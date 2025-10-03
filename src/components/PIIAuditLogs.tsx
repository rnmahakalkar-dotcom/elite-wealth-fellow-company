// import { useState, useEffect } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Shield, Eye, Clock, User } from 'lucide-react';
// import { supabase } from '@/integrations/supabase/client';
// import { useToast } from '@/hooks/use-toast';

// interface AuditLog {
//   id: string;
//   customer_id: string;
//   accessed_by: string;
//   access_type: string;
//   accessed_at: string;
//   ip_address: string | null;
//   user_agent: string | null;
// }

// export function PIIAuditLogs() {
//   const { profile } = useAuth();
//   const { toast } = useToast();
//   const [logs, setLogs] = useState<AuditLog[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (profile?.role === 'super_admin') {
//       fetchAuditLogs();
//     }
//   }, [profile]);

//   const fetchAuditLogs = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('customer_pii_access_log')
//         .select('*')
//         .order('accessed_at', { ascending: false })
//         .limit(50);

//       if (error) throw error;
//       setLogs((data as AuditLog[]) || []);
//     } catch (error) {
//       console.error('Error fetching audit logs:', error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch audit logs",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getAccessTypeBadge = (accessType: string) => {
//     const variants = {
//       'LIST_ACCESS': 'secondary',
//       'APPROVAL_ACTION': 'default',
//       'FULL_PII_ACCESS': 'destructive'
//     } as const;
    
//     return (
//       <Badge variant={variants[accessType as keyof typeof variants] || 'outline'}>
//         {accessType.replace('_', ' ')}
//       </Badge>
//     );
//   };

//   // Only show for super admins
//   if (profile?.role !== 'super_admin') {
//     return null;
//   }

//   if (loading) {
//     return (
//       <Card className="border-border/50 shadow-card">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Shield className="h-5 w-5" />
//             PII Access Audit Logs
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="animate-pulse space-y-4">
//             {[...Array(5)].map((_, i) => (
//               <div key={i} className="h-12 bg-muted rounded"></div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className="border-border/50 shadow-card">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Shield className="h-5 w-5 text-primary" />
//           PII Access Audit Logs
//         </CardTitle>
//         <CardDescription>
//           Monitor access to sensitive investor information (Last 50 entries)
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         {logs.length > 0 ? (
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Access Type</TableHead>
//                 <TableHead>User</TableHead>
//                 <TableHead>Investor ID</TableHead>
//                 <TableHead>Timestamp</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {logs.map((log) => (
//                 <TableRow key={log.id}>
//                   <TableCell>
//                     {getAccessTypeBadge(log.access_type)}
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2">
//                       <User className="h-4 w-4 text-muted-foreground" />
//                       <span className="text-sm font-mono">
//                         {log.accessed_by.slice(0, 8)}...
//                       </span>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <span className="text-sm font-mono">
//                       {log.customer_id === '00000000-0000-0000-0000-000000000000' 
//                         ? 'LIST_VIEW' 
//                         : log.customer_id.slice(0, 8) + '...'
//                       }
//                     </span>
//                   </TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                       <Clock className="h-4 w-4" />
//                       {new Date(log.accessed_at).toLocaleString('en-IN')}
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         ) : (
//           <div className="text-center py-8">
//             <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//             <h3 className="text-lg font-medium mb-2">No access logs</h3>
//             <p className="text-muted-foreground">
//               Investor PII access will be logged here.
//             </p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
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

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
}

// Mock data for 8 audit log entries
const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    customer_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    accessed_by: 'user12345678',
    access_type: 'FULL_PII_ACCESS',
    accessed_at: '2025-09-30T14:30:00Z',
    ip_address: '192.168.1.1',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    id: '2',
    customer_id: '00000000-0000-0000-0000-000000000000',
    accessed_by: 'user87654321',
    access_type: 'LIST_ACCESS',
    accessed_at: '2025-09-30T13:15:00Z',
    ip_address: '172.16.0.1',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    id: '3',
    customer_id: 'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    accessed_by: 'user45678912',
    access_type: 'APPROVAL_ACTION',
    accessed_at: '2025-09-29T10:45:00Z',
    ip_address: '10.0.0.1',
    user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
  },
  {
    id: '4',
    customer_id: 'c3d4e5f6-a7b8-9012-cdef-345678901234',
    accessed_by: 'user78912345',
    access_type: 'FULL_PII_ACCESS',
    accessed_at: '2025-09-28T16:20:00Z',
    ip_address: '192.168.2.1',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    id: '5',
    customer_id: '00000000-0000-0000-0000-000000000000',
    accessed_by: 'user32165487',
    access_type: 'LIST_ACCESS',
    accessed_at: '2025-09-28T09:10:00Z',
    ip_address: '172.16.0.2',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    id: '6',
    customer_id: 'd4e5f6a7-b8c9-0123-def0-456789012345',
    accessed_by: 'user65498732',
    access_type: 'APPROVAL_ACTION',
    accessed_at: '2025-09-27T12:00:00Z',
    ip_address: '10.0.0.2',
    user_agent: 'Mozilla/5.0 (Android 13; Mobile; rv:68.0)'
  },
  {
    id: '7',
    customer_id: 'e5f6a7b8-c9d0-1234-ef01-567890123456',
    accessed_by: 'user98732165',
    access_type: 'FULL_PII_ACCESS',
    accessed_at: '2025-09-26T15:30:00Z',
    ip_address: '192.168.3.1',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    id: '8',
    customer_id: '00000000-0000-0000-0000-000000000000',
    accessed_by: 'user12398765',
    access_type: 'LIST_ACCESS',
    accessed_at: '2025-09-26T08:00:00Z',
    ip_address: '172.16.0.3',
    user_agent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)'
  }
];

// Mock profile data for user names
const mockProfiles: Profile[] = [
  { id: 'user12345678', first_name: 'John', last_name: 'Doe' },
  { id: 'user87654321', first_name: 'Jane', last_name: 'Smith' },
  { id: 'user45678912', first_name: 'Alice', last_name: 'Johnson' },
  { id: 'user78912345', first_name: 'Bob', last_name: 'Williams' },
  { id: 'user32165487', first_name: 'Emma', last_name: 'Brown' },
  { id: 'user65498732', first_name: 'Michael', last_name: 'Davis' },
  { id: 'user98732165', first_name: 'Sarah', last_name: 'Wilson' },
  { id: 'user12398765', first_name: 'David', last_name: 'Taylor' }
];

export function PIIAuditLogs() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [logs, setLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role === 'super_admin') {
      fetchAuditLogs();
      fetchProfiles();
    }
  }, [profile]);

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_pii_access_log')
        .select('*')
        .order('accessed_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      const fetchedLogs = (data as AuditLog[]) || [];
      setLogs(fetchedLogs.length > 0 ? fetchedLogs : mockAuditLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: "Error",
        description: "Failed to fetch audit logs",
        variant: "destructive"
      });
      setLogs(mockAuditLogs);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    try {
      const userIds = Array.from(new Set(mockAuditLogs.map(log => log.accessed_by)));
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', userIds);

      if (error) throw error;
      const profileMap = (data as Profile[] || []).reduce((acc, profile) => ({
        ...acc,
        [profile.id]: profile
      }), {} as Record<string, Profile>);
      
      // Merge with mock profiles for fallback
      const finalProfileMap = {
        ...mockProfiles.reduce((acc, profile) => ({
          ...acc,
          [profile.id]: profile
        }), {} as Record<string, Profile>),
        ...profileMap
      };
      
      setProfiles(finalProfileMap);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user profiles",
        variant: "destructive"
      });
      // Fallback to mock profiles
      setProfiles(mockProfiles.reduce((acc, profile) => ({
        ...acc,
        [profile.id]: profile
      }), {} as Record<string, Profile>));
    }
  };

  const getUserName = (userId: string) => {
    const profile = profiles[userId];
    return profile ? `${profile.first_name} ${profile.last_name}` : `${userId.slice(0, 8)}...`;
  };

  const getAccessTypeBadge = (accessType: string) => {
    const variants = {
      'LIST_ACCESS': 'secondary',
      'APPROVAL_ACTION': 'default',
      'FULL_PII_ACCESS': 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[accessType as keyof typeof variants] || 'outline'} className="text-xs">
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
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            PII Access Audit Logs
          </CardTitle>
          <CardDescription className="text-sm">
            Monitor access to sensitive investor information (Last 6 entries)
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 md:px-8">
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
    <div className="space-y-6 ">
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            PII Access Audit Logs
          </CardTitle>
          <CardDescription className="text-sm">
            Monitor access to sensitive investor information (Last 6 entries)
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 md:px-8">
          {logs.length > 0 ? (
            <div className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-sm">Access Type</TableHead>
                      <TableHead className="text-sm">User</TableHead>
                      <TableHead className="text-sm">Investor ID</TableHead>
                      <TableHead className="text-sm">Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.slice(0, 6).map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {getAccessTypeBadge(log.access_type)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {getUserName(log.accessed_by)}
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
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {logs.slice(0, 6).map((log) => (
                  <Card key={log.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {log.access_type.replace('_', ' ')}
                        </span>
                        {getAccessTypeBadge(log.access_type)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p><strong>User:</strong> {getUserName(log.accessed_by)}</p>
                        <p>
                          <strong>Investor ID:</strong>{' '}
                          {log.customer_id === '00000000-0000-0000-0000-000000000000' 
                            ? 'LIST_VIEW' 
                            : log.customer_id.slice(0, 8) + '...'
                          }
                        </p>
                        <p>
                          <strong>Timestamp:</strong>{' '}
                          {new Date(log.accessed_at).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg sm:text-xl font-medium mb-2">No access logs</h3>
              <p className="text-sm text-muted-foreground">
                Investor PII access will be logged here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}