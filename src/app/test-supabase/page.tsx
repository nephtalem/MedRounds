"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2, ArrowLeft } from "lucide-react";

export default function TestSupabasePage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Testing connection...");
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Check if env variables are set
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          setStatus("error");
          setMessage("Environment variables not configured");
          setDetails({
            supabaseUrl: supabaseUrl ? "✅ Set" : "❌ Missing",
            supabaseKey: supabaseKey ? "✅ Set" : "❌ Missing",
            note: "Please create .env.local file with your Supabase credentials",
          });
          return;
        }

        // Try to query (even if table doesn't exist, it proves connection works)
        const { data, error } = await supabase
          .from("_test_connection")
          .select("*")
          .limit(1);

        // If we get "relation does not exist", that means connection works!
        if (error) {
          if (error.message.includes("does not exist") || error.code === "42P01") {
            setStatus("success");
            setMessage("✅ Supabase connected successfully!");
            setDetails({
              url: supabaseUrl,
              status: "Connected",
              note: "No tables created yet - this is expected",
              nextStep: "Ready to create database tables once you have Excel column details",
            });
          } else {
            setStatus("error");
            setMessage("Connection error");
            setDetails({
              error: error.message,
              code: error.code,
              hint: "Check your credentials in .env.local",
            });
          }
        } else {
          setStatus("success");
          setMessage("✅ Supabase connected and working!");
          setDetails({
            url: supabaseUrl,
            status: "Connected & Queried",
            tablesFound: "Yes",
          });
        }
      } catch (err: any) {
        setStatus("error");
        setMessage("❌ Connection failed");
        setDetails({
          error: err.message || String(err),
          suggestion: "Verify your SUPABASE_URL and ANON_KEY in .env.local",
        });
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Supabase Connection Test</h1>
            <p className="text-muted-foreground">
              Verify your database connection is working correctly
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Connection Status</CardTitle>
                {status === "loading" && (
                  <Badge variant="secondary">
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Testing...
                  </Badge>
                )}
                {status === "success" && (
                  <Badge className="bg-green-500">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Success
                  </Badge>
                )}
                {status === "error" && (
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 mr-1" />
                    Error
                  </Badge>
                )}
              </div>
              <CardDescription>{message}</CardDescription>
            </CardHeader>
            <CardContent>
              {details && (
                <div className="space-y-3">
                  <div className="rounded-lg bg-muted p-4 font-mono text-sm">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(details, null, 2)}
                    </pre>
                  </div>

                  {status === "success" && (
                    <div className="rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-4">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                        🎉 Great! Your Supabase connection is working!
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        You&apos;re ready to create database tables once you share the
                        Excel column details.
                      </p>
                    </div>
                  )}

                  {status === "error" && (
                    <div className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-4">
                      <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                        ⚠️ Connection Issue
                      </h4>
                      <div className="text-sm text-red-700 dark:text-red-300 space-y-2">
                        <p>Please check:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Created <code className="bg-red-100 dark:bg-red-900 px-1 rounded">.env.local</code> file in root directory</li>
                          <li>Added NEXT_PUBLIC_SUPABASE_URL</li>
                          <li>Added NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                          <li>Restarted the development server</li>
                        </ul>
                        <p className="mt-3">
                          See <code className="bg-red-100 dark:bg-red-900 px-1 rounded">SUPABASE_SETUP_GUIDE.md</code> for detailed instructions.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Create Supabase Project</h4>
                <p className="text-sm text-muted-foreground">
                  Go to{" "}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    supabase.com
                  </a>{" "}
                  and create a new project
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Get Your Credentials</h4>
                <p className="text-sm text-muted-foreground">
                  Project Settings → API → Copy your Project URL and anon key
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. Create .env.local File</h4>
                <div className="rounded-lg bg-muted p-3 text-sm font-mono">
                  <div>NEXT_PUBLIC_SUPABASE_URL=your_url_here</div>
                  <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">4. Restart Server</h4>
                <p className="text-sm text-muted-foreground">
                  Stop the dev server (Ctrl+C) and restart with <code>npm run dev</code>
                </p>
              </div>

              <Button asChild className="w-full">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}


