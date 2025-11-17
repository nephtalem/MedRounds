"use client";

import React, { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-[#030712] dark:via-slate-900/50 dark:to-[#030712] p-4">
          <Card className="max-w-2xl w-full border-0 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  We&apos;re sorry, but an unexpected error occurred. Don&apos;t worry, your data is safe.
                </p>
                <p className="text-sm text-gray-500">
                  You can try refreshing the page or go back to the dashboard.
                </p>
              </div>

              {/* Error Details (for development) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-6">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 mb-2">
                    Error Details (Development Only)
                  </summary>
                  <div className="mt-2 p-4 bg-red-50 border border-red-200 rounded-lg overflow-auto max-h-64">
                    <p className="text-sm font-mono text-red-900 mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </p>
                    {this.state.error.stack && (
                      <pre className="text-xs text-red-800 whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    )}
                    {this.state.errorInfo && (
                      <pre className="text-xs text-red-800 whitespace-pre-wrap mt-4">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button onClick={this.handleReload} className="gap-2">
                  <RefreshCcw className="h-4 w-4" />
                  Reload Page
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard" className="gap-2">
                    <Home className="h-4 w-4" />
                    Go to Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" onClick={this.handleReset}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

