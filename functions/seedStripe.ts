import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe';

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY"));

Deno.serve(async (req) => {
    try {
        // Security: Ensure only admins can run this
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        if (!user || user.role !== 'admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const logs = [];
        const log = (msg) => logs.push(msg);

        log('Starting Stripe seeding...');

        // Helper to find or create product
        async function findOrCreateProduct(name, description) {
            const search = await stripe.products.search({
                query: `name:'${name}'`,
            });
            if (search.data.length > 0) {
                log(`Found existing Product: ${name}`);
                return search.data[0];
            }
            const product = await stripe.products.create({ name, description });
            log(`Created Product: ${name}`);
            return product;
        }

        // 1. Monthly
        const productMonthly = await findOrCreateProduct('Perspekt Monthly Subscription', 'Full access to all articles, billed monthly.');
        
        // Create Price (always create new if needed, but simplistic check: list prices for product)
        const pricesMonthly = await stripe.prices.list({ product: productMonthly.id, active: true });
        let priceMonthly = pricesMonthly.data.find(p => p.unit_amount === 19900 && p.recurring?.interval === 'month');
        if (!priceMonthly) {
            priceMonthly = await stripe.prices.create({
                product: productMonthly.id,
                unit_amount: 19900,
                currency: 'nok',
                recurring: { interval: 'month' },
            });
            log(`Created Price: 199 NOK/month`);
        } else {
            log(`Found existing Price: 199 NOK/month`);
        }

        // Create Coupon Monthly
        let couponMonthly;
        try {
            couponMonthly = await stripe.coupons.retrieve('INTRO_MONTHLY');
            log(`Found existing Coupon: INTRO_MONTHLY`);
        } catch (e) {
            couponMonthly = await stripe.coupons.create({
                name: 'INTRO_MONTHLY',
                id: 'INTRO_MONTHLY', // Explicit ID for easier reference
                amount_off: 10000,
                currency: 'nok',
                duration: 'repeating',
                duration_in_months: 3,
            });
            log(`Created Coupon: INTRO_MONTHLY`);
        }

        // 2. Annual
        const productAnnual = await findOrCreateProduct('Perspekt Annual Subscription', 'Full access to all articles, billed annually. Best Value.');
        
        const pricesAnnual = await stripe.prices.list({ product: productAnnual.id, active: true });
        let priceAnnual = pricesAnnual.data.find(p => p.unit_amount === 238800 && p.recurring?.interval === 'year');
        if (!priceAnnual) {
            priceAnnual = await stripe.prices.create({
                product: productAnnual.id,
                unit_amount: 238800,
                currency: 'nok',
                recurring: { interval: 'year' },
            });
            log(`Created Price: 2388 NOK/year`);
        } else {
            log(`Found existing Price: 2388 NOK/year`);
        }

        // Create Coupon Annual
        let couponAnnual;
        try {
            couponAnnual = await stripe.coupons.retrieve('INTRO_ANNUAL');
            log(`Found existing Coupon: INTRO_ANNUAL`);
        } catch (e) {
            couponAnnual = await stripe.coupons.create({
                name: 'INTRO_ANNUAL',
                id: 'INTRO_ANNUAL',
                amount_off: 120000,
                currency: 'nok',
                duration: 'once',
            });
            log(`Created Coupon: INTRO_ANNUAL`);
        }

        const envOutput = `
STRIPE_PRICE_ID_MONTHLY=${priceMonthly.id}
STRIPE_PRICE_ID_ANNUAL=${priceAnnual.id}
STRIPE_COUPON_MONTHLY=${couponMonthly.id}
STRIPE_COUPON_ANNUAL=${couponAnnual.id}
        `;

        return Response.json({
            message: "Seeding complete",
            logs,
            env_values: envOutput.trim()
        });

    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});