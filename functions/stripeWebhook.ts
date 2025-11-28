import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));
const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

Deno.serve(async (req) => {
    const signature = req.headers.get("stripe-signature");
    const body = await req.text();

    let event;

    try {
        event = await stripe.webhooks.constructEventAsync(body, signature, endpointSecret);
    } catch (err) {
        console.error(`Webhook signature verification failed.`, err.message);
        return Response.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Initialize Base44 client with service role
    const base44 = createClientFromRequest(req);

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const userId = session.client_reference_id;
                const subscriptionId = session.subscription;
                const customerId = session.customer;

                if (userId) {
                    // Fetch subscription to get status and end date
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                    
                    // Determine plan based on price ID (simplified mapping)
                    // Ideally, this should be robust, but for now we'll infer from the event if possible or just update status
                    const priceId = subscription.items.data[0].price.id;
                    const plan = priceId === Deno.env.get("STRIPE_PRICE_ID_ANNUAL") ? 'yearly' : 'monthly';

                    await base44.asServiceRole.entities.User.update(userId, {
                        stripe_customer_id: customerId,
                        stripe_subscription_id: subscriptionId,
                        stripe_price_id: priceId,
                        subscription_status: subscription.status,
                        subscription_plan: plan,
                        subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString()
                    });
                }
                break;
            }
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                const customerId = subscription.customer;
                
                // Find user by stripe_customer_id
                // Note: The Entity SDK might not support 'findOne' or 'filter' on non-indexed fields efficiently depending on backend, 
                // but Base44 entities support filter.
                const users = await base44.asServiceRole.entities.User.filter({ stripe_customer_id: customerId });
                
                if (users.length > 0) {
                    const user = users[0];
                    await base44.asServiceRole.entities.User.update(user.id, {
                        subscription_status: subscription.status,
                        subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
                        stripe_price_id: subscription.items.data[0].price.id
                    });
                }
                break;
            }
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return Response.json({ received: true });
    } catch (err) {
        console.error("Webhook handler error:", err);
        return Response.json({ error: "Webhook handler failed" }, { status: 500 });
    }
});