import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Eye, Clock, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuditLog {
  id: string;
  customer_id: string;
  accessed_by: string;
  access_type: string;
  accessed_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

export function PIIAuditLogs() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role === 'super_admin') {
      fetchAuditLogs();
    }
  }, [profile]);

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_pii_access_log')
        .select('*')
        .order('accessed_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs((data as AuditLog[]) || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch audit logs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getAccessTypeBadge = (accessType: string) => {
    const variants = {
      'LIST_ACCESS': 'secondary',
      'APPROVAL_ACTION': 'default',
      'FULL_PII_ACCESS': 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[accessType as keyof typeof variants] || 'outline'}>
        {accessType.replace('_', ' ')}
      </Badge>
    );
  };

  // Only show for super admins
  if (profile?.role !== 'super_admin') {
    return null;
  }

  if (loading) {
    return (
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            PII Access Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          PII Access Audit Logs
        </CardTitle>
        <CardDescription>
          Monitor access to sensitive investor information (Last 50 entries)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Access Type</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Investor ID</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {getAccessTypeBadge(log.access_type)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-mono">
                        {log.accessed_by.slice(0, 8)}...
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono">
                      {log.customer_id === '00000000-0000-0000-0000-000000000000' 
                        ? 'LIST_VIEW' 
                        : log.customer_id.slice(0, 8) + '...'
                      }
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {new Date(log.accessed_at).toLocaleString('en-IN')}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No access logs</h3>
            <p className="text-muted-foreground">
              Investor PII access will be logged here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}