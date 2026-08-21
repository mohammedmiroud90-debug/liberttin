'use client';

import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { Settings, Shield, Database, Users } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <DashboardLayout role="admin">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Platform controls and shortcuts</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="border-gray-100">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-teal-600" /> User management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Enable or disable accounts and filter by role.</p>
            <Link href="/admin/users">
              <Button className="bg-teal-600 hover:bg-teal-700">Open Users</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-gray-100">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-teal-600" /> Doctor verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Approve providers before they appear publicly.</p>
            <Link href="/admin/doctors">
              <Button className="bg-teal-600 hover:bg-teal-700">Open Doctors</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-gray-100">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="h-4 w-4 text-teal-600" /> API health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Backend defaults to port 3001 with JWT-protected dashboard routes.</p>
            <a href="http://localhost:3001/health" target="_blank" rel="noreferrer">
              <Button variant="outline">Check /health</Button>
            </a>
          </CardContent>
        </Card>

        <Card className="border-gray-100">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4 text-teal-600" /> Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Return to the admin overview for live metrics.</p>
            <Link href="/admin/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
