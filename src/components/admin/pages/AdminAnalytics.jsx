import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useTranslation } from "@/components/i18n/translations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, TrendingUp, Users, MousePointerClick } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { toast } from "sonner";

export default function AdminAnalytics({ currentLocale }) {
  const { t } = useTranslation(currentLocale);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await base44.functions.invoke("getGA4Report");
      
      if (response.data.error) {
        setError(response.data.error);
        if (response.data.configured === false) {
           setError("not_configured");
        }
      } else {
        setData(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
      setError("fetch_failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error === "not_configured") {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-6">
           <TrendingUp className="w-8 h-8 text-accent" />
           <h1 className="text-3xl font-bold text-primary">Analytics Dashboard</h1>
        </div>

        <Card className="card-surface border-dashed border-2 border-accent/30">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="bg-accent/10 p-4 rounded-full mb-6">
              <TrendingUp className="w-12 h-12 text-accent" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">Connect Google Analytics</h2>
            <p className="text-secondary max-w-lg mb-8">
              To see your website's performance data directly in this dashboard, you need to configure the connection to your Google Analytics 4 property.
            </p>
            
            <div className="bg-surface p-6 rounded-lg text-left max-w-2xl w-full mb-8 border border-default">
              <h3 className="font-semibold text-primary mb-4">How to set it up:</h3>
              <ol className="list-decimal list-inside space-y-3 text-secondary text-sm">
                <li>Go to Google Cloud Console and create a <strong>Service Account</strong>.</li>
                <li>Download the JSON key file for this service account.</li>
                <li>Go to Google Analytics Admin -&gt; Property Settings -&gt; Property Access Management.</li>
                <li>Add the service account email (from the JSON file) as a viewer.</li>
                <li>Find your <strong>GA4 Property ID</strong> in Property Settings.</li>
                <li>Ask the AI assistant to "Set GA4 secrets" to securely save these credentials.</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-96 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-primary mb-2">Failed to load analytics</h3>
        <p className="text-secondary mb-6">{typeof error === 'string' ? error : "An unexpected error occurred"}</p>
        <Button onClick={fetchAnalytics}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-accent" />
          Analytics Overview
        </h1>
        <div className="text-sm text-secondary">
          Last 30 days
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-surface">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-secondary">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{data?.summary?.activeUsers?.toLocaleString() || 0}</div>
          </CardContent>
        </Card>
        <Card className="card-surface">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-secondary">Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{data?.summary?.sessions?.toLocaleString() || 0}</div>
          </CardContent>
        </Card>
        <Card className="card-surface">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-secondary">Engagement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{data?.summary?.engagementRate || "0%"}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card className="card-surface">
        <CardHeader>
          <CardTitle>Traffic Trend</CardTitle>
          <CardDescription>Daily users over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.timeline || []}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--mint-green)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--mint-green)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                stroke="var(--text-secondary)"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-surface)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="activeUsers" 
                stroke="var(--mint-green)" 
                fillOpacity={1} 
                fill="url(#colorUsers)" 
                name="Active Users"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="card-surface">
          <CardHeader>
            <CardTitle>Top Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.topSources?.map((source, index) => (
                <div key={index} className="flex items-center justify-between border-b border-default pb-2 last:border-0">
                  <span className="text-primary font-medium">{source.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-secondary text-sm">{source.users.toLocaleString()} users</span>
                    <div className="w-24 h-2 bg-secondary/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent" 
                        style={{ width: `${(source.users / (data?.summary?.activeUsers || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {(!data?.topSources || data.topSources.length === 0) && (
                <p className="text-secondary text-center py-4">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}