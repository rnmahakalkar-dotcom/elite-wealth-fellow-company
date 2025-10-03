import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function SecurityNotice() {
  const { profile } = useAuth();

  const getAccessLevelInfo = () => {
    switch (profile?.role) {
      case 'super_admin':
        return {
          level: 'FULL ACCESS',
          description: 'You have access to all customer data including sensitive PII. All access is logged.',
          color: 'destructive' as const,
          icon: Shield
        };
      case 'manager':
        return {
          level: 'MANAGER ACCESS',
          description: 'You can view customer data with partial PII masking for approval purposes.',
          color: 'default' as const,
          icon: Eye
        };
      default:
        return {
          level: 'BASIC ACCESS',
          description: 'You can only view your own submissions with sensitive data hidden.',
          color: 'secondary' as const,
          icon: Lock
        };
    }
  };

  const accessInfo = getAccessLevelInfo();
  const Icon = accessInfo.icon;

  return (
    <Alert className="border-primary/20 bg-primary/5">
      <Icon className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">Data Protection Notice</span>
            <Badge variant={accessInfo.color} className="text-xs">
              {accessInfo.level}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {accessInfo.description}
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <FileText className="h-3 w-3" />
          <span>PII Protected</span>
        </div>
      </AlertDescription>
    </Alert>
  );
}