import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { priceId: inputId, couponId: inputCouponId } = await req.json();

        let priceId;
        let couponId = inputCouponId || null;

        // Resolve Price ID
        if (inputId === 'ANNUAL') {
            priceId = Deno.env.get("STRIPE_PRICE_ID_ANNUAL");
            // Apply default coupon if no specific coupon was passed
            if (!couponId) couponId = Deno.env.get("STRIPE_COUPON_ANNUAL");
        } else if (inputId === 'MONTHLY') {
            priceId = Deno.env.get("STRIPE_PRICE_ID_MONTHLY");
            // Apply default coupon if no specific coupon was passed
            if (!couponId) couponId = Deno.env.get("STRIPE_COUPON_MONTHLY");
        } else {
            // Allow passing a direct Stripe Price ID
            priceId = inputId;
        }

        if (!priceId) {
            return Response.json({ error: 'Price configuration missing' }, { status: 500 });
        }

        let customerId = user.stripe_customer_id;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.full_name,
                metadata: {
                    userId: user.id
                }
            });
            customerId = customer.id;
            // Update user with new customer ID
            await base44.auth.updateMe({ stripe_customer_id: customerId });
        }

        const discounts = [];
        if (couponId) {
            discounts.push({ coupon: couponId });
        }

        // Robust Origin Resolver
        const envUrl = Deno.env.get("BASE_URL") || Deno.env.get("NEXT_PUBLIC_BASE_URL");
        const origin = (envUrl || "https://perspekt.no").replace(/\/$/, "");
        
        console.log(`Checkout Origin used: ${origin}`);

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            discounts: discounts.length > 0 ? discounts : undefined,
            allow_promotion_codes: true,
            success_url: `${origin}/Account?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/Subscribe?canceled=true`,
            client_reference_id: user.id,
        });

        return Response.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});