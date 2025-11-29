import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me().catch(() => null);

        // Parse request body
        const { id, slug, locale } = await req.json().catch(() => ({}));

        if (!id && !slug) {
            return Response.json({ error: "Article ID or Slug is required" }, { status: 400 });
        }

        // Build query
        const query = {};
        if (id) query.id = id;
        if (slug) query.slug = slug;
        if (locale) query.locale = locale;

        // Fetch article using service role to ensure we get the metadata
        // We need service role because if we want to implement a 'server-side paywall',
        // we might assume the underlying data should be restricted at the Row Level eventually.
        // For now, it guarantees we find the article even if we mess up permissions later.
        const articles = await base44.asServiceRole.entities.Article.filter(query);
        const article = articles[0];

        if (!article) {
            return Response.json({ error: "Article not found" }, { status: 404 });
        }

        // Check access
        const isPremium = article.access_level === 'premium';
        
        // Define active subscription statuses
        const activeStatuses = ['active', 'trialing', 'subscriber', 'premium'];
        const hasActiveSubscription = user && activeStatuses.includes(user.subscription_status);
        
        const isAdminOrEditor = user && (user.role === 'admin' || user.role === 'editor');
        
        const hasAccess = !isPremium || hasActiveSubscription || isAdminOrEditor;

        let responseArticle = { ...article };
        let isRestricted = false;

        if (!hasAccess) {
            isRestricted = true;
            // Redact body: First 1500 chars + ellipsis
            // We maintain the structure but redact the content
            const originalBody = article.body || "";
            responseArticle.body = originalBody.substring(0, 1500) + "...";
        }

        return Response.json({
            article: responseArticle,
            is_restricted: isRestricted
        });

    } catch (error) {
        console.error("getArticle error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});