import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import AdminRoute from '@/components/admin/AdminRoute';

export default function AdminPanelPage() {
  return (
    <AdminRoute>
      <div className="space-y-6">
        <div className="aviator-card-lime p-8 text-center">
          <h1 className="font-heading text-4xl font-bold flex items-center justify-center gap-3 text-primary aviator-text-glow">
            <Shield className="h-10 w-10" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground mt-2">System administration and management</p>
        </div>

        <Card className="aviator-card">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Admin functionality for Aviator Analytics. Manage users, view system stats, and configure settings.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminRoute>
  );
}
