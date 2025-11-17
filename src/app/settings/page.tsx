"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ModernSidebar } from "@/components/modern-sidebar";
import { ModernHeader } from "@/components/modern-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Save,
  CheckCircle2,
  Printer,
  User,
  Building2,
  FileText,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

function SettingsContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Profile Settings
  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [hospital, setHospital] = useState("");

  // Print Header Settings
  const [printHeader, setPrintHeader] = useState("");
  const [printSubheader, setPrintSubheader] = useState("");

  useEffect(() => {
    if (user?.user_metadata) {
      setFullName(user.user_metadata.full_name || "");
      setTitle(user.user_metadata.title || "");
      setHospital(user.user_metadata.hospital || "");
      setPrintHeader(user.user_metadata.print_header || "");
      setPrintSubheader(user.user_metadata.print_subheader || "");
    }
  }, [user]);

  async function handleSave() {
    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          title,
          hospital,
          print_header: printHeader,
          print_subheader: printSubheader,
        },
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-[#030712] dark:via-slate-900/50 dark:to-[#030712]">
      {/* Modern Sidebar */}
      <ModernSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
        {/* Modern Header */}
        <ModernHeader
          title="Settings"
          subtitle="Manage your preferences and application settings"
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-modern">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Success Message */}
            {success && (
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 flex items-center gap-3 animate-fade-in">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                <p className="text-sm font-medium text-green-900 dark:text-green-300">
                  Settings saved successfully!
                </p>
              </div>
            )}

            {/* Profile Settings */}
            <Card className="border-0 shadow-lg dark:bg-slate-900/40 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2 dark:text-gray-100">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Profile Settings
                </CardTitle>
                <CardDescription className="text-sm dark:text-gray-400">
                  Update your professional information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-semibold dark:text-gray-300">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Dr. John Smith"
                      disabled={loading}
                      className="pl-10 h-12 border-2 focus:border-blue-500 dark:bg-slate-800/50 dark:border-slate-700 dark:text-gray-200 dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-semibold dark:text-gray-300">
                    Professional Title
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="General Practitioner"
                      disabled={loading}
                      className="pl-10 h-12 border-2 focus:border-blue-500 dark:bg-slate-800/50 dark:border-slate-700 dark:text-gray-200 dark:placeholder:text-gray-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Default: Neurologist</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospital" className="text-sm font-semibold dark:text-gray-300">
                    Hospital / Institution
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="hospital"
                      type="text"
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      placeholder="Axon Stroke and Spine Center"
                      disabled={loading}
                      className="pl-10 h-12 border-2 focus:border-blue-500 dark:bg-slate-800/50 dark:border-slate-700 dark:text-gray-200 dark:placeholder:text-gray-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Default: Axon Stroke and Spine Center
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Print Settings */}
            <Card className="border-0 shadow-lg dark:bg-slate-900/40 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2 dark:text-gray-100">
                  <Printer className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Print Header Customization
                </CardTitle>
                <CardDescription className="text-sm dark:text-gray-400">
                  Customize the header that appears on printed rounds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="printHeader"
                    className="text-sm font-semibold dark:text-gray-300"
                  >
                    Print Header (Main Title)
                  </Label>
                  <Input
                    id="printHeader"
                    type="text"
                    value={printHeader}
                    onChange={(e) => setPrintHeader(e.target.value)}
                    placeholder="Axon Stroke and Spine Center"
                    disabled={loading}
                    className="h-12 border-2 focus:border-blue-500 dark:bg-slate-800/50 dark:border-slate-700 dark:text-gray-200 dark:placeholder:text-gray-500"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    This appears as the main heading on printed pages. Default:
                    Axon Stroke and Spine Center
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="printSubheader"
                    className="text-sm font-semibold dark:text-gray-300"
                  >
                    Print Subheader
                  </Label>
                  <Input
                    id="printSubheader"
                    type="text"
                    value={printSubheader}
                    onChange={(e) => setPrintSubheader(e.target.value)}
                    placeholder="Daily Patient Rounds"
                    disabled={loading}
                    className="h-12 border-2 focus:border-blue-500 dark:bg-slate-800/50 dark:border-slate-700 dark:text-gray-200 dark:placeholder:text-gray-500"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Secondary text that appears below the main header. Default:
                    Daily Patient Rounds
                  </p>
                </div>

                {/* Preview */}
                <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800/50 dark:to-slate-900/50 border-2 border-gray-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Print Preview
                  </p>
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border-2 border-gray-300 dark:border-slate-700 shadow-sm text-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {printHeader || "Axon Stroke and Spine Center"}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {printSubheader || "Daily Patient Rounds"}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 italic">
                      {!printHeader && !printSubheader
                        ? "Using default values"
                        : ""}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white dark:from-slate-900/40 dark:to-slate-800/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      Save Your Changes
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Your settings will be applied immediately
                    </p>
                  </div>
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="h-12 px-8 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        Save All Settings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="border-0 bg-blue-50 dark:bg-blue-900/20 shadow-lg dark:border-slate-800">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 dark:bg-blue-600 shadow-lg shadow-blue-500/30 flex-shrink-0">
                    <Printer className="h-6 w-6 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Print Settings Tips
                    </h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                      <li>
                        • Use your hospital or department name in the header
                      </li>
                      <li>• Keep headers concise for better print layout</li>
                      <li>• Headers appear on all printed patient rounds</li>
                      <li>• Leave blank to use Axon Stroke and Spine Center defaults</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}
