import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Ensure only admin can run this
        const user = await base44.auth.me();
        if (!user || user.role !== 'admin') {
             return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Use service role to ensure we can update everything
        const articles = await base44.asServiceRole.entities.Article.list();
        let updatedCount = 0;

        for (const article of articles) {
            let needsUpdate = false;
            let updates = {};

            // If topics is missing or empty, migrate from topic
            if (!article.topics || article.topics.length === 0) {
                if (article.topic) {
                    updates.topics = [article.topic];
                    needsUpdate = true;
                }
            }

            if (needsUpdate) {
                await base44.asServiceRole.entities.Article.update(article.id, updates);
                updatedCount++;
            }
        }

        return Response.json({ 
            success: true, 
            message: `Migrated topics for ${updatedCount} articles`,
            total: articles.length
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});