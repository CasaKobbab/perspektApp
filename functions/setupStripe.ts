import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user || user.role !== 'admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const log = [];
        const addLog = (msg) => log.push(msg);

        // 1. Monthly Product & Price
        let monthlyProduct = (await stripe.products.search({ query: "name:'Perspekt Monthly'" })).data[0];
        if (!monthlyProduct) {
            monthlyProduct = await stripe.products.create({ name: 'Perspekt Monthly', description: 'Monthly subscription to Perspekt' });
            addLog('Created Product: Perspekt Monthly');
        }

        let monthlyPrice = (await stripe.prices.list({ product: monthlyProduct.id, type: 'recurring' })).data.find(p => p.unit_amount === 19900 && p.currency === 'nok');
        if (!monthlyPrice) {
            monthlyPrice = await stripe.prices.create({
                product: monthlyProduct.id,
                unit_amount: 19900,
                currency: 'nok',
                recurring: { interval: 'month' }
            });
            addLog('Created Price: 199 NOK / Month');
        }

        // 2. Annual Product & Price
        let annualProduct = (await stripe.products.search({ query: "name:'Perspekt Annual'" })).data[0];
        if (!annualProduct) {
            annualProduct = await stripe.products.create({ name: 'Perspekt Annual', description: 'Annual subscription to Perspekt' });
            addLog('Created Product: Perspekt Annual');
        }

        let annualPrice = (await stripe.prices.list({ product: annualProduct.id, type: 'recurring' })).data.find(p => p.unit_amount === 238800 && p.currency === 'nok');
        if (!annualPrice) {
            annualPrice = await stripe.prices.create({
                product: annualProduct.id,
                unit_amount: 238800,
                currency: 'nok',
                recurring: { interval: 'year' }
            });
            addLog('Created Price: 2388 NOK / Year');
        }

        // 3. Coupons
        let monthlyCoupon = null;
        try {
            monthlyCoupon = await stripe.coupons.retrieve('intro_monthly_3m');
        } catch (e) {
            monthlyCoupon = await stripe.coupons.create({
                id: 'intro_monthly_3m',
                name: 'Intro Offer Monthly',
                amount_off: 10000,
                currency: 'nok',
                duration: 'repeating',
                duration_in_months: 3
            });
            addLog('Created Coupon: Intro Monthly');
        }

        let annualCoupon = null;
        try {
            annualCoupon = await stripe.coupons.retrieve('intro_annual_1y');
        } catch (e) {
            annualCoupon = await stripe.coupons.create({
                id: 'intro_annual_1y',
                name: 'Intro Offer Annual',
                amount_off: 120000,
                currency: 'nok',
                duration: 'once'
            });
            addLog('Created Coupon: Intro Annual');
        }

        // 4. Webhook
        const baseUrl = Deno.env.get("BASE_URL") || 'http://localhost:3000';
        const webhookUrl = `${baseUrl}/api/functions/stripeWebhook`;
        
        let webhookEndpoint = null;
        if (!baseUrl.includes('localhost')) {
             const webhooks = await stripe.webhookEndpoints.list();
             webhookEndpoint = webhooks.data.find(w => w.url === webhookUrl);
             if (!webhookEndpoint) {
                 webhookEndpoint = await stripe.webhookEndpoints.create({
                     url: webhookUrl,
                     enabled_events: ['checkout.session.completed', 'customer.subscription.updated', 'customer.subscription.deleted'],
                 });
                 addLog(`Created Webhook Endpoint: ${webhookUrl}`);
             }
        } else {
            addLog('Skipped Webhook creation (localhost detected)');
        }

        const output = `
STRIPE_PRICE_ID_MONTHLY=${monthlyPrice.id}
STRIPE_PRICE_ID_ANNUAL=${annualPrice.id}
STRIPE_COUPON_MONTHLY=${monthlyCoupon.id}
STRIPE_COUPON_ANNUAL=${annualCoupon.id}
STRIPE_WEBHOOK_SECRET=${webhookEndpoint ? webhookEndpoint.secret : 'YOUR_WEBHOOK_SECRET'}
        `.trim();

        return Response.json({ 
            message: "Stripe setup complete", 
            logs: log, 
            env_vars: output 
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});