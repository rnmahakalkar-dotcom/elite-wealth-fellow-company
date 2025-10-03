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
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, UserCheck, Users, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SecurityNotice } from '@/components/SecurityNotice';

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
  agent_type: 'main' | 'sub' | null;
  parent_agent_id: string | null;
}

export default function Agents() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    pan_number: '',
    commission_percentage: '',
    agent_type: 'main' as 'main' | 'sub',
    parent_agent_id: '',
    images: [] as string[]
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      const sanitizedData = data?.map(agent => ({
        ...agent,
        agent_type: agent.agent_type ?? 'main'
      })) || [];
      setAgents(sanitizedData);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch agents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async () => {
    try {
      const { error } = await supabase
        .from('agents')
        .insert({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          pan_number: formData.pan_number,
          commission_percentage: parseFloat(formData.commission_percentage),
          agent_type: formData.agent_type,
          parent_agent_id: formData.agent_type === 'sub' ? formData.parent_agent_id : null,
          submitted_by: profile?.user_id,
          images: formData.images
        });

      if (error) throw error;

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
        agent_type: 'main',
        parent_agent_id: '',
        images: []
      });
      fetchAgents();
    } catch (error) {
      console.error('Error creating agent:', error);
      toast({
        title: "Error",
        description: "Failed to create agent",
        variant: "destructive"
      });
    }
  };

  const handleApprovalAction = async (agentId: string, action: 'approved' | 'rejected', comments?: string) => {
    try {
      const { error } = await supabase
        .from('agents')
        .update({
          approval_status: action,
          reviewed_by: profile?.user_id,
          review_comments: comments || null,
          approved_at: action === 'approved' ? new Date().toISOString() : null
        })
        .eq('id', agentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Agent ${action} successfully`
      });

      fetchAgents();
    } catch (error) {
      console.error('Error updating agent status:', error);
      toast({
        title: "Error",
        description: "Failed to update agent status",
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

  const formatAgentType = (agentType: string | null) => {
    if (!agentType) return 'Unknown';
    return agentType.charAt(0).toUpperCase() + agentType.slice(1);
  };

  const canApprove = profile?.role === 'manager' || profile?.role === 'super_admin';
  const pendingAgents = agents.filter(a => a.approval_status === 'pending').length;
  const approvedAgents = agents.filter(a => a.approval_status === 'approved').length;

  if (loading) {
    return (
      <div className="space-y-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
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
    <div className="space-y-6 ">
      <SecurityNotice />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Agent Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage sales agents and their commission structures
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto gap-2 text-sm">
              <Plus className="h-4 w-4" />
              Add Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-sm sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg">Add New Agent</DialogTitle>
              <DialogDescription className="text-sm">
                Register a new sales agent for commission-based sales.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-sm">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    placeholder="John"
                    className="text-sm w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-sm">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    placeholder="Doe"
                    className="text-sm w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="agent@example.com"
                  className="text-sm w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 9876543210"
                  className="text-sm w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Complete address"
                  rows={3}
                  className="text-sm w-full"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pan_number" className="text-sm">PAN Number</Label>
                  <Input
                    id="pan_number"
                    value={formData.pan_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, pan_number: e.target.value.toUpperCase() }))}
                    placeholder="ABCTY1234D"
                    maxLength={10}
                    className="text-sm w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commission_percentage" className="text-sm">Commission %</Label>
                  <Input
                    id="commission_percentage"
                    type="number"
                    step="0.1"
                    value={formData.commission_percentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, commission_percentage: e.target.value }))}
                    placeholder="2.5"
                    className="text-sm w-full"
                  />
                </div>
              </div>

              
              <div className="space-y-2">
                <Label htmlFor="images" className="text-sm">Upload Documents/Images</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    const encoded: string[] = [];
                    for (const f of files) {
                      const b64 = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.readAsDataURL(f);
                      });
                      encoded.push(b64);
                    }
                    setFormData(prev => ({ ...prev, images: encoded }));
                  }}
                  className="text-sm w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Agent Type</Label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="main_agent"
                      name="agent_type"
                      value="main"
                      checked={formData.agent_type === 'main'}
                      onChange={() => setFormData(prev => ({ ...prev, agent_type: 'main', parent_agent_id: '' }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <Label htmlFor="main_agent" className="ml-2 text-sm">Main Agent</Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="sub_agent"
                      name="agent_type"
                      value="sub"
                      checked={formData.agent_type === 'sub'}
                      onChange={() => setFormData(prev => ({ ...prev, agent_type: 'sub' }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <Label htmlFor="sub_agent" className="ml-2 text-sm">Sub Agent</Label>
                  </div>
                </div>
              </div>

              {formData.agent_type === 'sub' && (
                <div className="space-y-2">
                  <Label htmlFor="parent_agent_id" className="text-sm">Parent Agent</Label>
                  <Select
                    value={formData.parent_agent_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, parent_agent_id: value }))}
                  >
                    <SelectTrigger className="text-sm w-full">
                      <SelectValue placeholder="Select parent agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents
                        .filter((a) => a.agent_type === 'main' || a.agent_type === 'sub')
                        .map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.first_name} {agent.last_name} ({formatAgentType(agent.agent_type)})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}


              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button onClick={handleCreateAgent} className="flex-1 text-sm">
                  Submit Agent
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="text-sm w-full sm:w-auto">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{agents.length}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Registered agents</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{pendingAgents}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{approvedAgents}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Commission-eligible</p>
          </CardContent>
        </Card>
      </div>

      {/* Agents List */}
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">All Agents</CardTitle>
          <CardDescription className="text-sm">
            Comprehensive list of all registered sales agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          {agents.length > 0 ? (
            <div className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agent Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Commission %</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Agent Type</TableHead>
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
                        <TableCell className="font-medium">
                          {formatAgentType(agent.agent_type)}
                        </TableCell>
                        {canApprove && (
                          <TableCell>
                            <div className="flex gap-2">
                              {agent.approval_status === 'pending' ? (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleApprovalAction(agent.id, 'approved')}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleApprovalAction(agent.id, 'rejected', 'Declined by management')}
                                  >
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              ) : (
                                profile?.role === 'super_admin' && (
                                  <Button size="sm" variant="outline" onClick={() => { setSelectedAgent(agent); setIsViewDialogOpen(true); }}>
                                    <Eye className="h-3 w-3 mr-1" /> View
                                  </Button>
                                )
                              )}
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {agents.map((agent) => (
                  <Card key={agent.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-sm">
                          {agent.first_name} {agent.last_name}
                        </span>
                        {getStatusBadge(agent.approval_status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p><strong>PAN:</strong> {agent.pan_number}</p>
                        <p><strong>Email:</strong> {agent.email}</p>
                        <p><strong>Phone:</strong> {agent.phone}</p>
                        <p><strong>Commission:</strong> {agent.commission_percentage}%</p>
                        <p><strong>Type:</strong> {formatAgentType(agent.agent_type)}</p>
                        <p><strong>Submitted:</strong> {new Date(agent.created_at).toLocaleDateString('en-IN')}</p>
                      </div>
                      {canApprove && (
                        <div className="flex flex-col gap-2 pt-2">
                          {agent.approval_status === 'pending' ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprovalAction(agent.id, 'approved')}
                                className="w-full bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="w-full"
                                onClick={() => handleApprovalAction(agent.id, 'rejected', 'Declined by management')}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </>
                          ) : (
                            profile?.role === 'super_admin' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={() => { setSelectedAgent(agent); setIsViewDialogOpen(true); }}
                              >
                                <Eye className="h-3 w-3 mr-1" /> View Details
                              </Button>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No agents registered yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your first sales agent to start tracking commissions.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="text-sm">
                <Plus className="h-4 w-4 mr-2" />
                Add First Agent
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="w-[95vw] max-w-sm sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Agent Details</DialogTitle>
          </DialogHeader>
          {selectedAgent && (() => {
            const parentAgent = agents.find(a => a.id === selectedAgent.parent_agent_id);
            return (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <div className="text-sm text-muted-foreground">PAN</div>
                      <div className="font-medium">{selectedAgent.pan_number}</div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="text-sm text-muted-foreground">Address</div>
                      <div className="font-medium">{selectedAgent.address}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold">Commission & Type</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Commission %</div>
                      <div className="font-medium">{selectedAgent.commission_percentage}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Agent Type</div>
                      <div className="font-medium">{formatAgentType(selectedAgent.agent_type)}</div>
                    </div>
                    {selectedAgent.parent_agent_id && parentAgent && (
                      <div>
                        <div className="text-sm text-muted-foreground">Parent Agent</div>
                        <div className="font-medium">{parentAgent.first_name} {parentAgent.last_name}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold">Approval Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Status</div>
                      <div className="font-medium">{selectedAgent.approval_status.charAt(0).toUpperCase() + selectedAgent.approval_status.slice(1)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Submitted Date</div>
                      <div className="font-medium">{new Date(selectedAgent.created_at).toLocaleDateString('en-IN')}</div>
                    </div>
                    {selectedAgent.approved_at && (
                      <div>
                        <div className="text-sm text-muted-foreground">Approved At</div>
                        <div className="font-medium">{new Date(selectedAgent.approved_at).toLocaleDateString('en-IN')}</div>
                      </div>
                    )}
                    {selectedAgent.review_comments && (
                      <div className="sm:col-span-2">
                        <div className="text-sm text-muted-foreground">Review Comments</div>
                        <div className="font-medium">{selectedAgent.review_comments}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-muted-foreground">Submitted By</div>
                      <div className="font-medium">{selectedAgent.submitted_by}</div>
                    </div>
                    {selectedAgent.reviewed_by && (
                      <div>
                        <div className="text-sm text-muted-foreground">Reviewed By</div>
                        <div className="font-medium">{selectedAgent.reviewed_by}</div>
                      </div>
                    )}
                  </div>
                </div>

                {Array.isArray(selectedAgent.images) && selectedAgent.images.length > 0 && (
  <div className="space-y-4">
    <h3 className="text-base sm:text-lg font-semibold">Uploaded Documents</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
      {selectedAgent.images.map((src: string, idx: number) => (
        <div key={idx} className="relative w-full h-32 sm:h-40 md:h-48">
          <img
            src={src}
            alt={`doc-${idx}`}
            className="rounded border w-full h-full object-cover cursor-pointer"
            onClick={() => setPreviewImage(src)}
          />
        </div>
      ))}
    </div>
  </div>
)}
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      {previewImage && (
        <div
          className="fixed inset-0 w-screen h-screen bg-black bg-opacity-90 flex items-center justify-center z-[2000]"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="preview"
            className="max-w-[90%] max-h-[90%] rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
}