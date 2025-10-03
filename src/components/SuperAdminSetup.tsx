import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Crown, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function SuperAdminSetup() {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleBecomeSuperAdmin = async () => {
    if (!user?.email) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('make_first_user_super_admin', {
        user_email: user.email
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "Success!",
          description: "You have been promoted to Super Admin. Please refresh the page to see changes."
        });
        
        // Refresh the page to update the UI
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast({
          title: "Info",
          description: "A Super Admin already exists in the system.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error promoting to super admin:', error);
      toast({
        title: "Error",
        description: "Failed to promote to Super Admin",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Don't show this component if user is already super admin
  if (profile?.role === 'super_admin') {
    return null;
  }

  return (
    <Card className="max-w-md mx-auto border-warning/20 bg-warning/5">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 rounded-full bg-warning/10">
          <Crown className="h-8 w-8 text-warning" />
        </div>
        <CardTitle className="flex items-center gap-2 justify-center">
          <Shield className="h-5 w-5" />
          System Setup Required
        </CardTitle>
        <CardDescription>
          This system needs a Super Admin to manage users and approvals.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Since no Super Admin exists yet, you can promote yourself to get started with the system.
          </AlertDescription>
        </Alert>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p><strong>Super Admin privileges:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Create and manage user accounts</li>
            <li>Assign roles to team members</li>
            <li>Approve or reject all submissions</li>
            <li>Access all system features</li>
          </ul>
        </div>

        <Button 
          onClick={handleBecomeSuperAdmin}
          disabled={loading}
          className="w-full"
          variant="default"
        >
          {loading ? "Promoting..." : "Become Super Admin"}
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          Current email: {user?.email}
        </p>
      </CardContent>
    </Card>
  );
}