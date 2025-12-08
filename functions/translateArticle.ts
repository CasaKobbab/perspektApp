import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // 1. Authenticate user
        const user = await base44.auth.me();
        if (!user) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Parse request body
        const { text, source_language, target_language } = await req.json();

        if (!text || !target_language) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 3. Call LLM for translation
        const prompt = `Translate the following article text from ${source_language || 'auto-detect'} to ${target_language}. 
Maintain all formatting, HTML tags, paragraphs, and line breaks exactly as they are. 
Only return the translated text, nothing else. Do not add any introductory or concluding remarks.
Article text:
\`\`\`
${text}
\`\`\``;

        const result = await base44.integrations.Core.InvokeLLM({
            prompt: prompt,
            // We don't need internet context for translation, it's safer and faster without it
            add_context_from_internet: false 
        });

        // 4. Return translated text
        // InvokeLLM returns a string directly if response_json_schema is not set
        return Response.json({ translatedText: result });

    } catch (error) {
        console.error("Translation error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});