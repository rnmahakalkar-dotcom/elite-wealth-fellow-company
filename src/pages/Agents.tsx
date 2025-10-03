// import { useState, useEffect } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Plus, UserCheck, Users, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
// import { supabase } from '@/integrations/supabase/client';
// import { useToast } from '@/hooks/use-toast';
// import { SecurityNotice } from '@/components/SecurityNotice';

// interface Agent {
//   id: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone: string;
//   address: string;
//   pan_number: string;
//   commission_percentage: number;
//   approval_status: 'pending' | 'approved' | 'rejected';
//   submitted_by: string;
//   reviewed_by: string | null;
//   review_comments: string | null;
//   approved_at: string | null;
//   created_at: string;
//   images?: string[];
// }

// export default function Agents() {
//   const { profile } = useAuth();
//   const { toast } = useToast();
//   const [agents, setAgents] = useState<Agent[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
//   const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     phone: '',
//     address: '',
//     pan_number: '',
//     commission_percentage: '',
//     images: [] as string[]
//   });

//   useEffect(() => {
//     fetchAgents();
//   }, []);

//   const fetchAgents = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('agents')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setAgents(data || []);
//     } catch (error) {
//       console.error('Error fetching agents:', error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch agents",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateAgent = async () => {
//     try {
//       const { error } = await supabase
//         .from('agents')
//         .insert({
//           first_name: formData.first_name,
//           last_name: formData.last_name,
//           email: formData.email,
//           phone: formData.phone,
//           address: formData.address,
//           pan_number: formData.pan_number,
//           commission_percentage: parseFloat(formData.commission_percentage),
//           submitted_by: profile?.user_id,
//           images: formData.images
//         });

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: "Agent submitted for approval"
//       });

//       setIsCreateDialogOpen(false);
//       setFormData({
//         first_name: '',
//         last_name: '',
//         email: '',
//         phone: '',
//         address: '',
//         pan_number: '',
//         commission_percentage: '',
//         images: []
//       });
//       fetchAgents();
//     } catch (error) {
//       console.error('Error creating agent:', error);
//       toast({
//         title: "Error",
//         description: "Failed to create agent",
//         variant: "destructive"
//       });
//     }
//   };

//   const handleApprovalAction = async (agentId: string, action: 'approved' | 'rejected', comments?: string) => {
//     try {
//       const { error } = await supabase
//         .from('agents')
//         .update({
//           approval_status: action,
//           reviewed_by: profile?.user_id,
//           review_comments: comments || null,
//           approved_at: action === 'approved' ? new Date().toISOString() : null
//         })
//         .eq('id', agentId);

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: `Agent ${action} successfully`
//       });

//       fetchAgents();
//     } catch (error) {
//       console.error('Error updating agent status:', error);
//       toast({
//         title: "Error",
//         description: "Failed to update agent status",
//         variant: "destructive"
//       });
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case 'approved':
//         return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
//       case 'rejected':
//         return <Badge variant="destructive">Rejected</Badge>;
//       case 'pending':
//         return <Badge variant="secondary">Pending</Badge>;
//       default:
//         return <Badge variant="outline">{status}</Badge>;
//     }
//   };

//   const canApprove = profile?.role === 'manager' || profile?.role === 'super_admin';
//   const pendingAgents = agents.filter(a => a.approval_status === 'pending').length;
//   const approvedAgents = agents.filter(a => a.approval_status === 'approved').length;

//   if (loading) {
//     return (
//       <div className="space-y-6">
//         <div className="animate-pulse">
//           <div className="h-8 bg-muted rounded w-64 mb-2"></div>
//           <div className="h-4 bg-muted rounded w-48"></div>
//         </div>
//         <div className="animate-pulse space-y-4">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="h-24 bg-muted rounded-lg"></div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <SecurityNotice />
      
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Agent Management</h1>
//           <p className="text-muted-foreground">
//             Manage sales agents and their commission structures
//           </p>
//         </div>

//         <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//           <DialogTrigger asChild>
//             <Button className="gap-2">
//               <Plus className="h-4 w-4" />
//               Add Agent
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>Add New Agent</DialogTitle>
//               <DialogDescription>
//                 Register a new sales agent for commission-based sales.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="first_name">First Name</Label>
//                   <Input
//                     id="first_name"
//                     value={formData.first_name}
//                     onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
//                     placeholder="John"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="last_name">Last Name</Label>
//                   <Input
//                     id="last_name"
//                     value={formData.last_name}
//                     onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
//                     placeholder="Doe"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="email">Email Address</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
//                   placeholder="agent@example.com"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="phone">Phone Number</Label>
//                 <Input
//                   id="phone"
//                   value={formData.phone}
//                   onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
//                   placeholder="+91 9876543210"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="address">Address</Label>
//                 <Textarea
//                   id="address"
//                   value={formData.address}
//                   onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
//                   placeholder="Complete address"
//                   rows={3}
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="pan_number">PAN Number</Label>
//                   <Input
//                     id="pan_number"
//                     value={formData.pan_number}
//                     onChange={(e) => setFormData(prev => ({ ...prev, pan_number: e.target.value.toUpperCase() }))}
//                     placeholder="ABCTY1234D"
//                     maxLength={10}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="commission_percentage">Commission %</Label>
//                   <Input
//                     id="commission_percentage"
//                     type="number"
//                     step="0.1"
//                     value={formData.commission_percentage}
//                     onChange={(e) => setFormData(prev => ({ ...prev, commission_percentage: e.target.value }))}
//                     placeholder="2.5"
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="images">Upload Documents/Images</Label>
//                 <Input
//                   id="images"
//                   type="file"
//                   multiple
//                   accept="image/*"
//                   onChange={async (e) => {
//                     const files = Array.from(e.target.files || []);
//                     const encoded: string[] = [];
//                     for (const f of files) {
//                       const b64 = await new Promise<string>((resolve) => {
//                         const reader = new FileReader();
//                         reader.onload = () => resolve(reader.result as string);
//                         reader.readAsDataURL(f);
//                       });
//                       encoded.push(b64);
//                     }
//                     setFormData(prev => ({ ...prev, images: encoded }));
//                   }}
//                 />
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <Button onClick={handleCreateAgent} className="flex-1">
//                   Submit Agent
//                 </Button>
//                 <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{agents.length}</div>
//             <p className="text-xs text-muted-foreground">Registered agents</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
//             <Clock className="h-4 w-4 text-amber-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{pendingAgents}</div>
//             <p className="text-xs text-muted-foreground">Awaiting review</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
//             <UserCheck className="h-4 w-4 text-green-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{approvedAgents}</div>
//             <p className="text-xs text-muted-foreground">Commission-eligible</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Agents Table */}
//       <Card className="border-border/50 shadow-card">
//         <CardHeader>
//           <CardTitle>All Agents</CardTitle>
//           <CardDescription>
//             Comprehensive list of all registered sales agents
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {agents.length > 0 ? (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Agent Name</TableHead>
//                   <TableHead>Contact</TableHead>
//                   <TableHead>Commission %</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Submitted</TableHead>
//                   {canApprove && <TableHead>Actions</TableHead>}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {agents.map((agent) => (
//                   <TableRow key={agent.id}>
//                     <TableCell>
//                       <div>
//                         <div className="font-medium">
//                           {agent.first_name} {agent.last_name}
//                         </div>
//                         <div className="text-sm text-muted-foreground">
//                           PAN: {agent.pan_number}
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <div className="text-sm">
//                         <div>{agent.email}</div>
//                         <div className="text-muted-foreground">{agent.phone}</div>
//                       </div>
//                     </TableCell>
//                     <TableCell className="font-medium">
//                       {agent.commission_percentage}%
//                     </TableCell>
//                     <TableCell>
//                       {getStatusBadge(agent.approval_status)}
//                     </TableCell>
//                     <TableCell className="text-muted-foreground">
//                       {new Date(agent.created_at).toLocaleDateString('en-IN')}
//                     </TableCell>
//                     {canApprove && (
//                       <TableCell>
//                         <div className="flex gap-2">
//                           {agent.approval_status === 'pending' ? (
//                             <>
//                               <Button
//                                 size="sm"
//                                 onClick={() => handleApprovalAction(agent.id, 'approved')}
//                                 className="bg-green-600 hover:bg-green-700"
//                               >
//                                 <CheckCircle className="h-3 w-3 mr-1" />
//                                 Approve
//                               </Button>
//                               <Button
//                                 size="sm"
//                                 variant="destructive"
//                                 onClick={() => handleApprovalAction(agent.id, 'rejected', 'Declined by management')}
//                               >
//                                 <XCircle className="h-3 w-3 mr-1" />
//                                 Reject
//                               </Button>
//                             </>
//                           ) : (
//                             profile?.role === 'super_admin' && (
//                               <Button size="sm" variant="outline" onClick={() => { setSelectedAgent(agent); setIsViewDialogOpen(true); }}>
//                                 <Eye className="h-3 w-3 mr-1" /> View
//                               </Button>
//                             )
//                           )}
//                         </div>
//                       </TableCell>
//                     )}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <div className="text-center py-12">
//               <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//               <h3 className="text-lg font-medium mb-2">No agents registered yet</h3>
//               <p className="text-muted-foreground mb-4">
//                 Add your first sales agent to start tracking commissions.
//               </p>
//               <Button onClick={() => setIsCreateDialogOpen(true)}>
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add First Agent
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//       <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
//         <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Agent Details</DialogTitle>
//           </DialogHeader>
//           {selectedAgent && (
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <div className="text-sm text-muted-foreground">Name</div>
//                   <div className="font-medium">{selectedAgent.first_name} {selectedAgent.last_name}</div>
//                 </div>
//                 <div>
//                   <div className="text-sm text-muted-foreground">Email</div>
//                   <div className="font-medium">{selectedAgent.email}</div>
//                 </div>
//                 <div>
//                   <div className="text-sm text-muted-foreground">Phone</div>
//                   <div className="font-medium">{selectedAgent.phone}</div>
//                 </div>
//                 <div>
//                   <div className="text-sm text-muted-foreground">Address</div>
//                   <div className="font-medium">{selectedAgent.address}</div>
//                 </div>
//                 <div>
//                   <div className="text-sm text-muted-foreground">PAN</div>
//                   <div className="font-medium">{selectedAgent.pan_number}</div>
//                 </div>
//                 <div>
//                   <div className="text-sm text-muted-foreground">Commission %</div>
//                   <div className="font-medium">{selectedAgent.commission_percentage}%</div>
//                 </div>
//               </div>
//               {Array.isArray(selectedAgent.images) && selectedAgent.images.length > 0 && (
//                 <div>
//                   <div className="text-sm text-muted-foreground mb-2">Uploaded Documents</div>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                     {selectedAgent.images.map((src: string, idx: number) => (
//                       <img key={idx} src={src} alt={`doc-${idx}`} className="rounded border" />
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

import { useState, useEffect, Component, ErrorInfo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, UserCheck, Users, Clock, CheckCircle, XCircle, Eye, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SecurityNotice } from '@/components/SecurityNotice';
import { useNavigate } from 'react-router-dom';

interface Agent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  pan_number: string;
  commission_percentage: number;
  approval_status: 'pending' | 'approved' | 'rejected';
  submitted_by: string;
  reviewed_by: string | null;
  review_comments: string | null;
  approved_at: string | null;
  created_at: string;
  images?: string[];
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AgentsErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error in Agents component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
          <p className="text-muted-foreground">
            An error occurred while loading the Agents page. Please try again later or contact support.
          </p>
          <p className="text-sm text-red-500 mt-2">{this.state.error?.message}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Agents() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    pan_number: '',
    commission_percentage: '',
    images: [] as File[]
  });

  const API_BASE_URL ='https://elite-wealth-company-project.vercel.app';

  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Error",
          description: "Please log in to view agents",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/agents?page=1&page_size=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to fetch agents');
      }
      setAgents(result.items || []);
    } catch (error: any) {
      console.error('Error fetching agents:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch agents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Error",
          description: "Please log in to create an agent",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      const form = new FormData();
      form.append('data', JSON.stringify({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        pan_number: formData.pan_number,
        commission_percentage: parseFloat(formData.commission_percentage)
      }));
      formData.images.forEach((file, index) => {
        form.append(`files[${index}]`, file);
      });

      const response = await fetch(`${API_BASE_URL}/agents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: form
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to create agent');
      }

      toast({
        title: "Success",
        description: "Agent submitted for approval"
      });

      setIsCreateDialogOpen(false);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        pan_number: '',
        commission_percentage: '',
        images: []
      });
      fetchAgents();
    } catch (error: any) {
      console.error('Error creating agent:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create agent",
        variant: "destructive"
      });
    }
  };

  const handleUpdateAgent = async () => {
    if (!selectedAgent) return;

    try {
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Error",
          description: "Please log in to update an agent",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      const form = new FormData();
      form.append('data', JSON.stringify({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        pan_number: formData.pan_number,
        commission_percentage: parseFloat(formData.commission_percentage)
      }));
      formData.images.forEach((file, index) => {
        form.append(`files[${index}]`, file);
      });

      const response = await fetch(`${API_BASE_URL}/agents/${selectedAgent.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: form
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to update agent');
      }

      toast({
        title: "Success",
        description: "Agent updated successfully"
      });

      setIsUpdateDialogOpen(false);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        pan_number: '',
        commission_percentage: '',
        images: []
      });
      fetchAgents();
    } catch (error: any) {
      console.error('Error updating agent:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update agent",
        variant: "destructive"
      });
    }
  };

  const handleApprovalAction = async (agentId: string, action: 'approve' | 'reject', comments?: string) => {
    try {
      const token = getAuthToken();
      if (!token) {
        toast({
          title: "Error",
          description: "Please log in to perform this action",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/agents/${agentId}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comments: comments || 'Action by management' })
      });

      if (!response.ok) {
        const text = await response.text();
        try {
          const result = JSON.parse(text);
          throw new Error(result.error?.message || `Failed to ${action} agent`);
        } catch (e) {
          throw new Error(`Failed to ${action} agent: Server returned ${response.status} ${response.statusText}`);
        }
      }

      const result = await response.json();
      toast({
        title: "Success",
        description: `Agent ${action}d successfully`
      });

      fetchAgents();
    } catch (error: any) {
      console.error('Error updating agent status:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${action} agent`,
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const canApprove = profile?.role === 'manager' || profile?.role === 'super_admin';
  const pendingAgents = agents.filter(a => a.approval_status === 'pending').length;
  const approvedAgents = agents.filter(a => a.approval_status === 'approved').length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-2"></div>
          <div className="h-4 bg-muted rounded w-48"></div>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SecurityNotice />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agent Management</h1>
          <p className="text-muted-foreground">
            Manage sales agents and their commission structures
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Agent</DialogTitle>
              <DialogDescription>
                Register a new sales agent for commission-based sales.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="agent@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Complete address"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pan_number">PAN Number</Label>
                  <Input
                    id="pan_number"
                    value={formData.pan_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, pan_number: e.target.value.toUpperCase() }))}
                    placeholder="ABCTY1234D"
                    maxLength={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commission_percentage">Commission %</Label>
                  <Input
                    id="commission_percentage"
                    type="number"
                    step="0.1"
                    value={formData.commission_percentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, commission_percentage: e.target.value }))}
                    placeholder="2.5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Upload Documents/Images</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setFormData(prev => ({ ...prev, images: files }));
                  }}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleCreateAgent} className="flex-1">
                  Submit Agent
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
            <p className="text-xs text-muted-foreground">Registered agents</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingAgents}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedAgents}</div>
            <p className="text-xs text-muted-foreground">Commission-eligible</p>
          </CardContent>
        </Card>
      </div>

      {/* Agents Table */}
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle>All Agents</CardTitle>
          <CardDescription>
            Comprehensive list of all registered sales agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {agents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Commission %</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  {canApprove && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {agent.first_name} {agent.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          PAN: {agent.pan_number}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{agent.email}</div>
                        <div className="text-muted-foreground">{agent.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {agent.commission_percentage}%
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(agent.approval_status)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(agent.created_at).toLocaleDateString('en-IN')}
                    </TableCell>
                    {canApprove && (
                      <TableCell>
                        <div className="flex gap-2">
                          {agent.approval_status === 'pending' ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprovalAction(agent.id, 'approve')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleApprovalAction(agent.id, 'reject', 'Declined by management')}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => { 
                                  setSelectedAgent(agent); 
                                  setIsViewDialogOpen(true); 
                                }}
                              >
                                <Eye className="h-3 w-3 mr-1" /> 
                                View
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => { 
                                  setSelectedAgent(agent);
                                  setFormData({
                                    first_name: agent.first_name,
                                    last_name: agent.last_name,
                                    email: agent.email,
                                    phone: agent.phone,
                                    address: agent.address,
                                    pan_number: agent.pan_number,
                                    commission_percentage: agent.commission_percentage.toString(),
                                    images: []
                                  });
                                  setIsUpdateDialogOpen(true); 
                                }}
                              >
                                <Edit className="h-3 w-3 mr-1" /> 
                                Update
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No agents registered yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first sales agent to start tracking commissions.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Agent
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agent Details</DialogTitle>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="font-medium">{selectedAgent.first_name} {selectedAgent.last_name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{selectedAgent.email}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div className="font-medium">{selectedAgent.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Address</div>
                  <div className="font-medium">{selectedAgent.address}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">PAN</div>
                  <div className="font-medium">{selectedAgent.pan_number}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Commission %</div>
                  <div className="font-medium">{selectedAgent.commission_percentage}%</div>
                </div>
              </div>
              {Array.isArray(selectedAgent.images) && selectedAgent.images.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Uploaded Documents</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedAgent.images.map((src: string, idx: number) => (
                      <img key={idx} src={src} alt={`doc-${idx}`} className="rounded border" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Agent</DialogTitle>
            <DialogDescription>
              Update the details of the selected sales agent.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="update_first_name">First Name</Label>
                <Input
                  id="update_first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="update_last_name">Last Name</Label>
                <Input
                  id="update_last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="update_email">Email Address</Label>
              <Input
                id="update_email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="agent@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="update_phone">Phone Number</Label>
              <Input
                id="update_phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+91 9876543210"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="update_address">Address</Label>
              <Textarea
                id="update_address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Complete address"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="update_pan_number">PAN Number</Label>
                <Input
                  id="update_pan_number"
                  value={formData.pan_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, pan_number: e.target.value.toUpperCase() }))}
                  placeholder="ABCTY1234D"
                  maxLength={10}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="update_commission_percentage">Commission %</Label>
                <Input
                  id="update_commission_percentage"
                  type="number"
                  step="0.1"
                  value={formData.commission_percentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, commission_percentage: e.target.value }))}
                  placeholder="2.5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="update_images">Upload Additional Documents/Images</Label>
              <Input
                id="update_images"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setFormData(prev => ({ ...prev, images: files }));
                }}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleUpdateAgent} className="flex-1">
                Update Agent
              </Button>
              <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AgentsWithErrorBoundary() {
  return (
    <AgentsErrorBoundary>
      <Agents />
    </AgentsErrorBoundary>
  );
}