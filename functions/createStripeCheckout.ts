import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe';

Deno.serve(async (req) => {
    try {
        // 1. CRITICAL CONFIG VALIDATION
        // using Deno.env.get is required for Deno runtime
        const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
        if (!stripeKey) {
            console.error("CRITICAL: STRIPE_SECRET_KEY is missing from environment variables");
            return Response.json({ error: "Server Config Error: Missing Stripe Key" }, { status: 500 });
        }

        // Initialize Stripe with fetch client explicitly for Deno safety
        const stripe = new Stripe(stripeKey, {
            httpClient: Stripe.createFetchHttpClient(),
            apiVersion: '2023-10-16', // Pinning version for stability
        });

        // 2. AUTHENTICATION
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user) {
            return Response.json({ error: "Unauthorized: Please log in" }, { status: 401 });
        }

        // 3. SAFE BODY PARSING
        let body;
        try {
            body = await req.json();
        } catch (e) {
            return Response.json({ error: "Invalid Request: Malformed JSON" }, { status: 400 });
        }

        const { priceId, successUrl, cancelUrl, couponId } = body;

        if (!priceId) {
            return Response.json({ error: "User Error: Missing Price ID" }, { status: 400 });
        }

        // 4. RESOLVE PRICES & COUPONS (Robust Mapping)
        let finalPriceId = priceId;
        let finalCouponId = couponId;

        if (priceId === 'ANNUAL') {
            finalPriceId = Deno.env.get("STRIPE_PRICE_ID_ANNUAL");
            // Only apply default coupon if specific one wasn't passed
            if (!finalCouponId) finalCouponId = Deno.env.get("STRIPE_COUPON_ANNUAL");
        } else if (priceId === 'MONTHLY') {
            finalPriceId = Deno.env.get("STRIPE_PRICE_ID_MONTHLY");
            if (!finalCouponId) finalCouponId = Deno.env.get("STRIPE_COUPON_MONTHLY");
        }

        if (!finalPriceId) {
            console.error(`Configuration Error: Price ID not found for '${priceId}'`);
            return Response.json({ error: "Server Config Error: Price ID not configured" }, { status: 500 });
        }

        // 5. CUSTOMER RESOLUTION
        let customerId = user.stripe_customer_id;
        if (!customerId) {
            try {
                const customer = await stripe.customers.create({
                    email: user.email,
                    name: user.full_name,
                    metadata: { userId: user.id }
                });
                customerId = customer.id;
                // Save for future use
                await base44.auth.updateMe({ stripe_customer_id: customerId });
            } catch (custErr) {
                console.error("Stripe Customer Create Error:", custErr);
                return Response.json({ error: "Failed to create payment profile" }, { status: 500 });
            }
        }

        // 6. SESSION CREATION
        // Robust fallback for URLs if not provided
        const baseUrl = Deno.env.get("BASE_URL") || "https://perspekt.no";
        const finalSuccessUrl = successUrl || `${baseUrl}/PaymentSuccess?session_id={CHECKOUT_SESSION_ID}`;
        const finalCancelUrl = cancelUrl || `${baseUrl}/PaymentCancel`;

        const sessionConfig = {
            customer: customerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: finalPriceId,
                    quantity: 1,
                },
            ],
            allow_promotion_codes: true,
            success_url: finalSuccessUrl,
            cancel_url: finalCancelUrl,
            client_reference_id: user.id,
        };

        // Safe coupon application
        if (finalCouponId && typeof finalCouponId === 'string' && finalCouponId.trim().length > 0) {
            sessionConfig.discounts = [{ coupon: finalCouponId.trim() }];
        }

        console.log(`Initiating checkout for user ${user.email} with price ${finalPriceId}`);
        
        const session = await stripe.checkout.sessions.create(sessionConfig);

        return Response.json({ 
            sessionId: session.id, 
            url: session.url 
        });

    } catch (err) {
        // Global Error Handler
        console.error("CRITICAL CHECKOUT CRASH:", err);
        return Response.json({ 
            error: err.message || "Internal Server Error during checkout" 
        }, { status: 500 });
    }
});