// import { useState, useEffect } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Plus, Users, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';
// import { createInvestor, listInvestorsWithAccess, listActivePlans, approveInvestorSecure, Plan } from '@/lib/customerRepo';
// import { useToast } from '@/hooks/use-toast';
// import { SecurityNotice } from '@/components/SecurityNotice';

// interface Investor {
//   id: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone: string;
//   address: string;
//   pan_number: string;
//   aadhar_number: string;
//   plan_id: string;
//   investment_amount: number;
//   approval_status: 'pending' | 'approved' | 'rejected';
//   submitted_by: string;
//   reviewed_by: string | null;
//   review_comments: string | null;
//   approved_at: string | null;
//   created_at: string;
//   data_access_level?: string; // Added to track access level
//   plans?: {
//     name: string;
//     return_percentage: number;
//     duration_months: number;
//   };
// }

// // Plan is imported from repo

// export default function Investors() {
//   const { profile } = useAuth();
//   const { toast } = useToast();
//   const [investors, setInvestors] = useState<Investor[]>([]);
//   const [plans, setPlans] = useState<Plan[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
//   const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
//   const [activeTab, setActiveTab] = useState('all');
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     phone: '',
//     address: '',
//     pan_number: '',
//     aadhar_number: '',
//     plan_id: '',
//     investment_amount: '',
//     images: [] as string[]
//   });

//   useEffect(() => {
//     fetchInvestors();
//     fetchPlans();
//   }, []);

//   const fetchInvestors = async () => {
//     try {
//       const { data, error } = await listInvestorsWithAccess();
//       if (error) throw error;
//       setInvestors(data || []);
//     } catch (error) {
//       console.error('Error fetching investors:', error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch investors",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPlans = async () => {
//     try {
//       const { data, error } = await listActivePlans();
//       if (error) throw error;
//       setPlans(data || []);
//     } catch (error) {
//       console.error('Error fetching plans:', error);
//     }
//   };

//   const handleCreateInvestor = async () => {
//     try {
//       const { error } = await createInvestor({
//         first_name: formData.first_name,
//         last_name: formData.last_name,
//         email: formData.email,
//         phone: formData.phone,
//         address: formData.address,
//         pan_number: formData.pan_number,
//         aadhar_number: formData.aadhar_number,
//         plan_id: formData.plan_id,
//         investment_amount: parseFloat(formData.investment_amount),
//         submitted_by: profile?.user_id as string,
//         images: formData.images,
//       } as any);

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: "Investor created successfully and sent for approval"
//       });

//       setIsCreateDialogOpen(false);
//       setFormData({
//         first_name: '',
//         last_name: '',
//         email: '',
//         phone: '',
//         address: '',
//         pan_number: '',
//         aadhar_number: '',
//         plan_id: '',
//         investment_amount: '',
//         images: []
//       });
//       fetchInvestors();
//     } catch (error) {
//       console.error('Error creating investor:', error);
//       toast({
//         title: "Error",
//         description: "Failed to create investor",
//         variant: "destructive"
//       });
//     }
//   };

//   const handleApprovalAction = async (investorId: string, action: 'approved' | 'rejected', comments?: string) => {
//     try {
//       const { data, error } = await approveInvestorSecure(investorId, action, comments);

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: `Investor ${action} successfully`
//       });

//       fetchInvestors();
//     } catch (error) {
//       console.error('Error updating investor status:', error);
//       toast({
//         title: "Error",
//         description: "Failed to update investor status",
//         variant: "destructive"
//       });
//     }
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0
//     }).format(amount);
//   };

//   const getStatusBadge = (status: string) => {
//     const variants = {
//       pending: { variant: 'secondary' as const, icon: Clock, color: 'text-warning' },
//       approved: { variant: 'default' as const, icon: CheckCircle, color: 'text-success' },
//       rejected: { variant: 'destructive' as const, icon: XCircle, color: 'text-destructive' }
//     };
    
//     const config = variants[status as keyof typeof variants];
//     const Icon = config.icon;
    
//     return (
//       <Badge variant={config.variant} className="gap-1">
//         <Icon className="h-3 w-3" />
//         {status.charAt(0).toUpperCase() + status.slice(1)}
//       </Badge>
//     );
//   };

//   const getFilteredInvestors = () => {
//     switch (activeTab) {
//       case 'pending':
//         return investors.filter(c => c.approval_status === 'pending');
//       case 'approved':
//         return investors.filter(c => c.approval_status === 'approved');
//       case 'rejected':
//         return investors.filter(c => c.approval_status === 'rejected');
//       default:
//         return investors;
//     }
//   };

//   const getInvestorStats = () => {
//     return {
//       total: investors.length,
//       pending: investors.filter(c => c.approval_status === 'pending').length,
//       approved: investors.filter(c => c.approval_status === 'approved').length,
//       rejected: investors.filter(c => c.approval_status === 'rejected').length
//     };
//   };

//   // Helper function to display sensitive data based on access level
//   const displaySensitiveData = (investor: Investor, field: 'email' | 'phone' | 'address' | 'pan_number' | 'aadhar_number') => {
//     const value = investor[field];
//     const accessLevel = investor.data_access_level;
    
//     // Show appropriate data based on access level
//     if (value === 'HIDDEN') {
//       return <span className="text-muted-foreground italic">Hidden</span>;
//     }
    
//     if (accessLevel === 'BASIC_ACCESS' && (field === 'address' || field === 'pan_number' || field === 'aadhar_number')) {
//       return <span className="text-muted-foreground italic">Hidden</span>;
//     }
    
//     return value;
//   };

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

//   const stats = getInvestorStats();
//   const filteredInvestors = getFilteredInvestors();
//   const canManageInvestors = profile?.role === 'office_staff' || profile?.role === 'manager' || profile?.role === 'super_admin';
//   const canApprove = profile?.role === 'manager' || profile?.role === 'super_admin';
//   const isSuperAdmin = profile?.role === 'super_admin';

//   return (
//     <div className="space-y-6">
//       {/* Security Notice */}
//       <SecurityNotice />
      
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Investor Management</h1>
//           <p className="text-muted-foreground">
//             Manage investor onboarding and approvals
//           </p>
//         </div>

//         {canManageInvestors && (
//           <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="gap-2">
//                 <Plus className="h-4 w-4" />
//                 Add Investor
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle>Add New Investor</DialogTitle>
//                 <DialogDescription>
//                   Register a new investor for investment plan enrollment.
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="space-y-4">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="first_name">First Name</Label>
//                     <Input
//                       id="first_name"
//                       value={formData.first_name}
//                       onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
//                       placeholder="John"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="last_name">Last Name</Label>
//                     <Input
//                       id="last_name"
//                       value={formData.last_name}
//                       onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
//                       placeholder="Doe"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="email">Email</Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={formData.email}
//                       onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
//                       placeholder="john@example.com"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="phone">Phone</Label>
//                     <Input
//                       id="phone"
//                       value={formData.phone}
//                       onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
//                       placeholder="+91 9876543210"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="address">Address</Label>
//                   <Textarea
//                     id="address"
//                     value={formData.address}
//                     onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
//                     placeholder="Complete residential address..."
//                     rows={2}
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="pan_number">PAN Number</Label>
//                     <Input
//                       id="pan_number"
//                       value={formData.pan_number}
//                       onChange={(e) => setFormData(prev => ({ ...prev, pan_number: e.target.value.toUpperCase() }))}
//                       placeholder="ABCDE1234F"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="aadhar_number">Aadhar Number</Label>
//                     <Input
//                       id="aadhar_number"
//                       value={formData.aadhar_number}
//                       onChange={(e) => setFormData(prev => ({ ...prev, aadhar_number: e.target.value }))}
//                       placeholder="1234 5678 9012"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="plan_id">Investment Plan</Label>
//                     <Select value={formData.plan_id} onValueChange={(value) => setFormData(prev => ({ ...prev, plan_id: value }))}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select a plan" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {plans.map((plan) => (
//                           <SelectItem key={plan.id} value={plan.id}>
//                             {plan.name} - {plan.return_percentage}% for {plan.duration_months}m
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="investment_amount">Investment Amount (₹)</Label>
//                     <Input
//                       id="investment_amount"
//                       type="number"
//                       value={formData.investment_amount}
//                       onChange={(e) => setFormData(prev => ({ ...prev, investment_amount: e.target.value }))}
//                       placeholder="100000"
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="images">Upload Documents/Images</Label>
//                   <Input
//                     id="images"
//                     type="file"
//                     multiple
//                     accept="image/*"
//                     onChange={async (e) => {
//                       const files = Array.from(e.target.files || []);
//                       const encoded: string[] = [];
//                       for (const f of files) {
//                         const b64 = await new Promise<string>((resolve) => {
//                           const reader = new FileReader();
//                           reader.onload = () => resolve(reader.result as string);
//                           reader.readAsDataURL(f);
//                         });
//                         encoded.push(b64);
//                       }
//                       setFormData(prev => ({ ...prev, images: encoded }));
//                     }}
//                   />
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <Button onClick={handleCreateInvestor} className="flex-1">
//                     Submit for Approval
//                   </Button>
//                   <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             </DialogContent>
//           </Dialog>
//         )}
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Investors</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.total}</div>
//             <p className="text-xs text-muted-foreground">All registrations</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Pending</CardTitle>
//             <Clock className="h-4 w-4 text-warning" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-warning">{stats.pending}</div>
//             <p className="text-xs text-muted-foreground">Awaiting approval</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Approved</CardTitle>
//             <CheckCircle className="h-4 w-4 text-success" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-success">{stats.approved}</div>
//             <p className="text-xs text-muted-foreground">Active investors</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Rejected</CardTitle>
//             <XCircle className="h-4 w-4 text-destructive" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-destructive">{stats.rejected}</div>
//             <p className="text-xs text-muted-foreground">Not approved</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Investors Table with Tabs */}
//       <Card className="border-border/50 shadow-card">
//         <CardHeader>
//           <CardTitle>Investor Applications</CardTitle>
//           <CardDescription>
//             Review and manage investor applications
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
//             <TabsList>
//               <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
//               <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
//               <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
//               <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
//             </TabsList>

//             <TabsContent value={activeTab} className="space-y-4">
//               {filteredInvestors.length === 0 ? (
//                 <div className="text-center py-12">
//                   <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
//                   <h3 className="text-lg font-medium text-foreground mb-2">No Investors Found</h3>
//                   <p className="text-muted-foreground mb-4">
//                     {activeTab === 'all' 
//                       ? "No investor records found. Add your first investor to get started."
//                       : `No ${activeTab} investors found.`
//                     }
//                   </p>
//                   {canManageInvestors && activeTab === 'all' && (
//                     <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
//                       <Plus className="h-4 w-4" />
//                       Add First Investor
//                     </Button>
//                   )}
//                 </div>
//               ) : (
//                 <div className="rounded-md border">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>Name</TableHead>
//                         <TableHead>Contact</TableHead>
//                         <TableHead>Plan</TableHead>
//                         <TableHead>Investment</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead>Date</TableHead>
//                         {canApprove && <TableHead>Actions</TableHead>}
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {filteredInvestors.map((investor) => (
//                         <TableRow key={investor.id}>
//                           <TableCell>
//                             <div>
//                               <div className="font-medium">
//                                 {investor.first_name} {investor.last_name}
//                               </div>
//                               <div className="text-sm text-muted-foreground">
//                                 {displaySensitiveData(investor, 'email')}
//                               </div>
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <div className="text-sm">
//                               <div>{displaySensitiveData(investor, 'phone')}</div>
//                               <div className="text-muted-foreground">
//                                 {displaySensitiveData(investor, 'address')}
//                               </div>
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <div>
//                               <div className="font-medium">{investor.plans?.name}</div>
//                               <div className="text-sm text-muted-foreground">
//                                 {investor.plans?.return_percentage}% for {investor.plans?.duration_months}m
//                               </div>
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             <div className="font-medium">
//                               {formatCurrency(investor.investment_amount)}
//                             </div>
//                           </TableCell>
//                           <TableCell>
//                             {getStatusBadge(investor.approval_status)}
//                           </TableCell>
//                           <TableCell>
//                             <div className="text-sm">
//                               {new Date(investor.created_at).toLocaleDateString()}
//                             </div>
//                           </TableCell>
//                           {canApprove && (
//                             <TableCell>
//                               <div className="flex gap-2">
//                                 {investor.approval_status === 'pending' ? (
//                                   <>
//                                     <Button
//                                       size="sm"
//                                       onClick={() => handleApprovalAction(investor.id, 'approved')}
//                                       className="bg-success hover:bg-success/90"
//                                     >
//                                       Approve
//                                     </Button>
//                                     <Button
//                                       size="sm"
//                                       variant="destructive"
//                                       onClick={() => handleApprovalAction(investor.id, 'rejected')}
//                                     >
//                                       Reject
//                                     </Button>
//                                   </>
//                                 ) : (
//                                   isSuperAdmin && (
//                                     <Button size="sm" variant="outline" onClick={() => { setSelectedInvestor(investor); setIsViewDialogOpen(true); }}>
//                                       <Eye className="h-3 w-3 mr-1" /> View
//                                     </Button>
//                                   )
//                                 )}
//                               </div>
//                             </TableCell>
//                           )}
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               )}
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>

//       <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
//         <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Investor Details</DialogTitle>
//           </DialogHeader>
//           {selectedInvestor && (
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <div className="text-sm text-muted-foreground">Name</div>
//                   <div className="font-medium">{selectedInvestor.first_name} {selectedInvestor.last_name}</div>
//                 </div>
//                 <div>
//                   <div className="text-sm text-muted-foreground">Email</div>
//                   <div className="font-medium">{selectedInvestor.email}</div>
//                 </div>
//                 <div>
//                   <div className="text-sm text-muted-foreground">Phone</div>
//                   <div className="font-medium">{selectedInvestor.phone}</div>
//                 </div>
//                 <div>
//                   <div className="text-sm text-muted-foreground">Address</div>
//                   <div className="font-medium">{selectedInvestor.address}</div>
//                 </div>
//                 <div>
//                   <div className="text-sm text-muted-foreground">PAN</div>
//                   <div className="font-medium">{selectedInvestor.pan_number}</div>
//                 </div>
//                 <div>
//                   <div className="text-sm text-muted-foreground">Aadhar</div>
//                   <div className="font-medium">{selectedInvestor.aadhar_number}</div>
//                 </div>
//               </div>
//               {Array.isArray((selectedInvestor as any).images) && (selectedInvestor as any).images.length > 0 && (
//                 <div>
//                   <div className="text-sm text-muted-foreground mb-2">Uploaded Documents</div>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                     {(selectedInvestor as any).images.map((src: string, idx: number) => (
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Users, CheckCircle, Clock, XCircle, Eye } from 'lucide-react';
import { createInvestor, listInvestorsWithAccess, listActivePlans, approveInvestorSecure, Plan } from '@/lib/customerRepo';
import { useToast } from '@/hooks/use-toast';
import { SecurityNotice } from '@/components/SecurityNotice';

interface Investor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  pan_number: string;
  aadhar_number: string;
  plan_id: string;
  investment_amount: number;
  approval_status: 'pending' | 'approved' | 'rejected';
  submitted_by: string;
  reviewed_by: string | null;
  review_comments: string | null;
  approved_at: string | null;
  created_at: string;
  data_access_level?: string;
  plans?: {
    name: string;
    return_percentage: number;
    duration_months: number;
  };
}

export default function Investors() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    pan_number: '',
    aadhar_number: '',
    plan_id: '',
    investment_amount: '',
    images: [] as string[]
  });

  useEffect(() => {
    fetchInvestors();
    fetchPlans();
  }, []);

  const fetchInvestors = async () => {
    try {
      const { data, error } = await listInvestorsWithAccess();
      if (error) throw error;
      setInvestors(data || []);
    } catch (error) {
      console.error('Error fetching investors:', error);
      toast({
        title: "Error",
        description: "Failed to fetch investors",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const { data, error } = await listActivePlans();
      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleCreateInvestor = async () => {
    try {
      const { error } = await createInvestor({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        pan_number: formData.pan_number,
        aadhar_number: formData.aadhar_number,
        plan_id: formData.plan_id,
        investment_amount: parseFloat(formData.investment_amount),
        submitted_by: profile?.user_id as string,
        images: formData.images,
      } as any);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Investor created successfully and sent for approval"
      });

      setIsCreateDialogOpen(false);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        pan_number: '',
        aadhar_number: '',
        plan_id: '',
        investment_amount: '',
        images: []
      });
      fetchInvestors();
    } catch (error) {
      console.error('Error creating investor:', error);
      toast({
        title: "Error",
        description: "Failed to create investor",
        variant: "destructive"
      });
    }
  };

  const handleApprovalAction = async (investorId: string, action: 'approved' | 'rejected', comments?: string) => {
    try {
      const { data, error } = await approveInvestorSecure(investorId, action, comments);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Investor ${action} successfully`
      });

      fetchInvestors();
    } catch (error) {
      console.error('Error updating investor status:', error);
      toast({
        title: "Error",
        description: "Failed to update investor status",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'secondary' as const, icon: Clock, color: 'text-warning' },
      approved: { variant: 'default' as const, icon: CheckCircle, color: 'text-success' },
      rejected: { variant: 'destructive' as const, icon: XCircle, color: 'text-destructive' }
    };
    
    const config = variants[status as keyof typeof variants];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getFilteredInvestors = () => {
    switch (activeTab) {
      case 'pending':
        return investors.filter(c => c.approval_status === 'pending');
      case 'approved':
        return investors.filter(c => c.approval_status === 'approved');
      case 'rejected':
        return investors.filter(c => c.approval_status === 'rejected');
      default:
        return investors;
    }
  };

  const getInvestorStats = () => {
    return {
      total: investors.length,
      pending: investors.filter(c => c.approval_status === 'pending').length,
      approved: investors.filter(c => c.approval_status === 'approved').length,
      rejected: investors.filter(c => c.approval_status === 'rejected').length
    };
  };

  const displaySensitiveData = (investor: Investor, field: 'email' | 'phone' | 'address' | 'pan_number' | 'aadhar_number') => {
    const value = investor[field];
    const accessLevel = investor.data_access_level;
    
    if (value === 'HIDDEN') {
      return <span className="text-muted-foreground italic">Hidden</span>;
    }
    
    if (accessLevel === 'BASIC_ACCESS' && (field === 'address' || field === 'pan_number' || field === 'aadhar_number')) {
      return <span className="text-muted-foreground italic">Hidden</span>;
    }
    
    return value;
  };

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

  const stats = getInvestorStats();
  const filteredInvestors = getFilteredInvestors();
  const canManageInvestors = profile?.role === 'office_staff' || profile?.role === 'manager' || profile?.role === 'super_admin';
  const canApprove = profile?.role === 'manager' || profile?.role === 'super_admin';
  const isSuperAdmin = profile?.role === 'super_admin';

  return (
    <div className="space-y-6">
      <SecurityNotice />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Investor Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage investor onboarding and approvals
          </p>
        </div>

        {canManageInvestors && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto gap-2">
                <Plus className="h-4 w-4" />
                Add Investor
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg">Add New Investor</DialogTitle>
                <DialogDescription className="text-sm">
                  Register a new investor for investment plan enrollment.
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
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-sm">Last Name</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                      placeholder="Doe"
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@example.com"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 9876543210"
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Complete residential address..."
                    rows={3}
                    className="text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pan_number" className="text-sm">PAN Number</Label>
                    <Input
                      id="pan_number"
                      value={formData.pan_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, pan_number: e.target.value.toUpperCase() }))}
                      placeholder="ABCDE1234F"
                      className="text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadhar_number" className="text-sm">Aadhar Number</Label>
                    <Input
                      id="aadhar_number"
                      value={formData.aadhar_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, aadhar_number: e.target.value }))}
                      placeholder="1234 5678 9012"
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="plan_id" className="text-sm">Investment Plan</Label>
                    <Select value={formData.plan_id} onValueChange={(value) => setFormData(prev => ({ ...prev, plan_id: value }))}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map((plan) => (
                          <SelectItem key={plan.id} value={plan.id}>
                            {plan.name} - {plan.return_percentage}% for {plan.duration_months}m
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="investment_amount" className="text-sm">Investment Amount (₹)</Label>
                    <Input
                      id="investment_amount"
                      type="number"
                      value={formData.investment_amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, investment_amount: e.target.value }))}
                      placeholder="100000"
                      className="text-sm"
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
                    className="text-sm"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button onClick={handleCreateInvestor} className="flex-1 text-sm">
                    Submit for Approval
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="text-sm">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">All registrations</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-warning">{stats.pending}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-success">{stats.approved}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Active investors</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-destructive">{stats.rejected}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Not approved</p>
          </CardContent>
        </Card>
      </div>

      {/* Investors List with Tabs */}
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Investor Applications</CardTitle>
          <CardDescription className="text-sm">
            Review and manage investor applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="flex flex-wrap justify-center md:justify-start gap-2">
              <TabsTrigger value="all" className="flex-1 md:flex-none text-sm">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending" className="flex-1 md:flex-none text-sm">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="approved" className="flex-1 md:flex-none text-sm">Approved ({stats.approved})</TabsTrigger>
              <TabsTrigger value="rejected" className="flex-1 md:flex-none text-sm">Rejected ({stats.rejected})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredInvestors.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Investors Found</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {activeTab === 'all' 
                      ? "No investor records found. Add your first investor to get started."
                      : `No ${activeTab} investors found.`
                    }
                  </p>
                  {canManageInvestors && activeTab === 'all' && (
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2 text-sm">
                      <Plus className="h-4 w-4" />
                      Add First Investor
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Plan</TableHead>
                          <TableHead>Investment</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          {canApprove && <TableHead>Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInvestors.map((investor) => (
                          <TableRow key={investor.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {investor.first_name} {investor.last_name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {displaySensitiveData(investor, 'email')}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{displaySensitiveData(investor, 'phone')}</div>
                                <div className="text-muted-foreground">
                                  {displaySensitiveData(investor, 'address')}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{investor.plans?.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {investor.plans?.return_percentage}% for {investor.plans?.duration_months}m
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {formatCurrency(investor.investment_amount)}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(investor.approval_status)}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {new Date(investor.created_at).toLocaleDateString()}
                              </div>
                            </TableCell>
                            {canApprove && (
                              <TableCell>
                                <div className="flex gap-2">
                                  {investor.approval_status === 'pending' ? (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={() => handleApprovalAction(investor.id, 'approved')}
                                        className="bg-success hover:bg-success/90"
                                      >
                                        Approve
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleApprovalAction(investor.id, 'rejected')}
                                      >
                                        Reject
                                      </Button>
                                    </>
                                  ) : (
                                    isSuperAdmin && (
                                      <Button size="sm" variant="outline" onClick={() => { setSelectedInvestor(investor); setIsViewDialogOpen(true); }}>
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
                    {filteredInvestors.map((investor) => (
                      <Card key={investor.id} className="p-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium text-sm">
                              {investor.first_name} {investor.last_name}
                            </span>
                            {getStatusBadge(investor.approval_status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p><strong>Email:</strong> {displaySensitiveData(investor, 'email')}</p>
                            <p><strong>Phone:</strong> {displaySensitiveData(investor, 'phone')}</p>
                            <p><strong>Plan:</strong> {investor.plans?.name}</p>
                            <p><strong>Investment:</strong> {formatCurrency(investor.investment_amount)}</p>
                            <p><strong>Date:</strong> {new Date(investor.created_at).toLocaleDateString()}</p>
                          </div>
                          {canApprove && (
                            <div className="flex flex-col gap-2 pt-2">
                              {investor.approval_status === 'pending' ? (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleApprovalAction(investor.id, 'approved')}
                                    className="w-full bg-success hover:bg-success/90"
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => handleApprovalAction(investor.id, 'rejected')}
                                  >
                                    Reject
                                  </Button>
                                </>
                              ) : (
                                isSuperAdmin && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => { setSelectedInvestor(investor); setIsViewDialogOpen(true); }}
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
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Investor Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Investor Details</DialogTitle>
          </DialogHeader>
          {selectedInvestor && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="font-medium">{selectedInvestor.first_name} {selectedInvestor.last_name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{selectedInvestor.email}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                  <div className="font-medium">{selectedInvestor.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Address</div>
                  <div className="font-medium">{selectedInvestor.address}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">PAN</div>
                  <div className="font-medium">{selectedInvestor.pan_number}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Aadhar</div>
                  <div className="font-medium">{selectedInvestor.aadhar_number}</div>
                </div>
              </div>
              {Array.isArray((selectedInvestor as any).images) && (selectedInvestor as any).images.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Uploaded Documents</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {(selectedInvestor as any).images.map((src: string, idx: number) => (
                      <img key={idx} src={src} alt={`doc-${idx}`} className="rounded border w-full h-auto" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}