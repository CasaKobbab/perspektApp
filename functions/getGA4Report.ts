import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { google } from 'npm:googleapis';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // 1. Auth check
        const user = await base44.auth.me();
        if (!user || (user.role !== 'admin' && user.role !== 'editor')) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Secret check
        const credentialsJson = Deno.env.get("GA4_SERVICE_ACCOUNT_JSON");
        const propertyId = Deno.env.get("GA4_PROPERTY_ID");

        if (!credentialsJson || !propertyId) {
            return Response.json({ 
                error: "Missing credentials",
                configured: false 
            });
        }

        // 3. Initialize GA4 client
        let credentials;
        try {
            credentials = JSON.parse(credentialsJson);
        } catch (e) {
            return Response.json({ error: "Invalid JSON in GA4_SERVICE_ACCOUNT_JSON" }, { status: 500 });
        }

        const auth = new google.auth.GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
        });

        const analyticsData = google.analyticsdata({
            version: 'v1beta',
            auth
        });

        // 4. Run Report
        // We want: 
        // - Timeline (date -> activeUsers) for the last 30 days
        // - Summary (total activeUsers, sessions, engagementRate)
        // - Top Sources (sessionSource -> activeUsers)

        const [timelineResponse, summaryResponse, sourcesResponse] = await Promise.all([
            // Timeline
            analyticsData.properties.runReport({
                property: `properties/${propertyId}`,
                requestBody: {
                    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                    dimensions: [{ name: 'date' }],
                    metrics: [{ name: 'activeUsers' }],
                    orderBys: [{ dimension: { orderType: 'ALPHANUMERIC', dimensionName: 'date' } }]
                }
            }),
            // Summary
            analyticsData.properties.runReport({
                property: `properties/${propertyId}`,
                requestBody: {
                    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                    metrics: [
                        { name: 'activeUsers' },
                        { name: 'sessions' },
                        { name: 'engagementRate' }
                    ]
                }
            }),
            // Top Sources
            analyticsData.properties.runReport({
                property: `properties/${propertyId}`,
                requestBody: {
                    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                    dimensions: [{ name: 'sessionSource' }],
                    metrics: [{ name: 'activeUsers' }],
                    limit: 5,
                    orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }]
                }
            })
        ]);

        // 5. Transform Data
        const timeline = timelineResponse.data.rows?.map(row => {
            // date comes as YYYYMMDD
            const d = row.dimensionValues[0].value;
            const dateStr = `${d.substring(0,4)}-${d.substring(4,6)}-${d.substring(6,8)}`;
            return {
                date: dateStr,
                activeUsers: parseInt(row.metricValues[0].value || '0')
            };
        }) || [];

        const summaryRow = summaryResponse.data.rows?.[0];
        const summary = {
            activeUsers: parseInt(summaryRow?.metricValues?.[0]?.value || '0'),
            sessions: parseInt(summaryRow?.metricValues?.[1]?.value || '0'),
            engagementRate: parseFloat(summaryRow?.metricValues?.[2]?.value || '0').toFixed(2) + '%'
        };

        const topSources = sourcesResponse.data.rows?.map(row => ({
            name: row.dimensionValues[0].value,
            users: parseInt(row.metricValues[0].value || '0')
        })) || [];

        return Response.json({
            configured: true,
            timeline,
            summary,
            topSources
        });

    } catch (error) {
        console.error("GA4 Error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});