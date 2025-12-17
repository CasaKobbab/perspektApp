import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe';

Deno.serve(async (req) => {
    try {
        // VALIDATION: Check Stripe Secret Key
        const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
        if (!stripeKey) {
            console.error("FATAL: STRIPE_SECRET_KEY not configured");
            return Response.json({ error: "Server Error: Missing Stripe Key" }, { status: 500 });
        }

        const stripe = new Stripe(stripeKey);

        // AUTH: Validate user
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            console.error("Unauthorized checkout attempt");
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log(`[Checkout] User: ${user.email} (${user.id})`);

        // PARSE: Get request body
        const body = await req.json();
        const { priceId: inputId, couponId: inputCouponId, successUrl, cancelUrl } = body;

        console.log(`[Checkout] Input priceId: ${inputId}, couponId: ${inputCouponId || 'none'}`);

        // VALIDATION: Check Price ID
        if (!inputId) {
            console.error("Missing priceId in request");
            return Response.json({ error: "Missing Price ID" }, { status: 400 });
        }

        // RESOLVE: Price ID and Coupon
        let priceId;
        let couponId = inputCouponId || null;

        if (inputId === 'ANNUAL') {
            priceId = Deno.env.get("STRIPE_PRICE_ID_ANNUAL");
            if (!couponId) {
                couponId = Deno.env.get("STRIPE_COUPON_ANNUAL") || null;
            }
            console.log(`[Checkout] Resolved ANNUAL -> priceId: ${priceId}, couponId: ${couponId || 'none'}`);
        } else if (inputId === 'MONTHLY') {
            priceId = Deno.env.get("STRIPE_PRICE_ID_MONTHLY");
            if (!couponId) {
                couponId = Deno.env.get("STRIPE_COUPON_MONTHLY") || null;
            }
            console.log(`[Checkout] Resolved MONTHLY -> priceId: ${priceId}, couponId: ${couponId || 'none'}`);
        } else {
            // Direct Stripe Price ID
            priceId = inputId;
            console.log(`[Checkout] Using direct priceId: ${priceId}`);
        }

        if (!priceId) {
            console.error("Price configuration missing for plan:", inputId);
            return Response.json({ error: 'Price configuration missing' }, { status: 500 });
        }

        // CUSTOMER: Create or retrieve
        let customerId = user.stripe_customer_id;

        if (!customerId) {
            console.log(`[Checkout] Creating new Stripe customer for ${user.email}`);
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.full_name,
                metadata: { userId: user.id }
            });
            customerId = customer.id;
            await base44.auth.updateMe({ stripe_customer_id: customerId });
            console.log(`[Checkout] Created customer: ${customerId}`);
        } else {
            console.log(`[Checkout] Using existing customer: ${customerId}`);
        }

        // SESSION CONFIG: Build session configuration
        const sessionConfig = {
            customer: customerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            allow_promotion_codes: true,
            client_reference_id: user.id,
        };

        // COUPON LOGIC (Safe Mode): Only add discounts if couponId is non-empty string
        if (couponId && typeof couponId === 'string' && couponId.trim().length > 0) {
            sessionConfig.discounts = [{ coupon: couponId.trim() }];
            console.log(`[Checkout] Applied coupon: ${couponId}`);
        } else {
            console.log(`[Checkout] No coupon applied`);
        }

        // URLs: Use provided or construct from origin
        const envUrl = Deno.env.get("BASE_URL") || Deno.env.get("NEXT_PUBLIC_BASE_URL");
        const origin = (envUrl || "https://perspekt.no").replace(/\/$/, "");

        sessionConfig.success_url = successUrl || `${origin}/PaymentSuccess?session_id={CHECKOUT_SESSION_ID}`;
        sessionConfig.cancel_url = cancelUrl || `${origin}/PaymentCancel`;

        console.log(`[Checkout] Success URL: ${sessionConfig.success_url}`);
        console.log(`[Checkout] Cancel URL: ${sessionConfig.cancel_url}`);

        // CREATE SESSION
        console.log(`[Checkout] Creating Stripe session...`);
        const session = await stripe.checkout.sessions.create(sessionConfig);

        console.log(`[Checkout] ✅ Session created: ${session.id}`);
        console.log(`[Checkout] Redirect URL: ${session.url}`);

        return Response.json({ 
            sessionId: session.id, 
            url: session.url 
        });

    } catch (error) {
        console.error("❌ [Checkout Error]:", error.message);
        console.error("Stack:", error.stack);
        
        // Return detailed error message
        return Response.json({ 
            error: error.message || "Unknown checkout error" 
        }, { status: 500 });
    }
});