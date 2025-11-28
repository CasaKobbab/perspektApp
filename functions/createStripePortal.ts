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

        if (!user.stripe_customer_id) {
            return Response.json({ error: 'No billing account found' }, { status: 400 });
        }

        // Robust Origin Resolver
        const envUrl = Deno.env.get("BASE_URL") || Deno.env.get("NEXT_PUBLIC_BASE_URL");
        const origin = (envUrl || "https://perspekt.no").replace(/\/$/, "");

        const session = await stripe.billingPortal.sessions.create({
            customer: user.stripe_customer_id,
            return_url: `${origin}/Account`,
        });

        return Response.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Portal Error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});