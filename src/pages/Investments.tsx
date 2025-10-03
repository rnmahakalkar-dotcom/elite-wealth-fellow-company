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
// import { Plus, TrendingUp, DollarSign, Calendar, CheckCircle, XCircle, Building, Eye } from 'lucide-react';
// import { supabase } from '@/integrations/supabase/client';
// import { useToast } from '@/hooks/use-toast';
// import { SecurityNotice } from '@/components/SecurityNotice';

// interface Investment {
//   id: string;
//   investment_name: string;
//   description: string | null;
//   investment_amount: number;
//   expected_return: number | null;
//   investment_date: string;
//   approval_status: 'pending' | 'approved' | 'rejected';
//   submitted_by: string;
//   reviewed_by: string | null;
//   review_comments: string | null;
//   approved_at: string | null;
//   created_at: string;
//   plan_id: string;
//   images?: string[];
// }

// interface Plan {
//   id: string;
//   name: string;
//   segment: string;
// }

// export default function Investments() {
//   const { profile } = useAuth();
//   const { toast } = useToast();
//   const [investments, setInvestments] = useState<Investment[]>([]);
//   const [plans, setPlans] = useState<Plan[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
//   const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
//   const [formData, setFormData] = useState({
//     investment_name: '',
//     description: '',
//     investment_amount: '',
//     expected_return: '',
//     investment_date: '',
//     plan_id: '',
//     images: [] as string[]
//   });

//   useEffect(() => {
//     fetchInvestments();
//     fetchPlans();
//   }, []);

//   const fetchInvestments = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('company_investments')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setInvestments(data || []);
//     } catch (error) {
//       console.error('Error fetching investments:', error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch investments",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchPlans = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('plans')
//         .select('id, name, segment')
//         .eq('is_active', true);

//       if (error) throw error;
//       setPlans(data || []);
//     } catch (error) {
//       console.error('Error fetching plans:', error);
//     }
//   };

//   const handleCreateInvestment = async () => {
//     try {
//       const { error } = await supabase
//         .from('company_investments')
//         .insert({
//           investment_name: formData.investment_name,
//           description: formData.description || null,
//           investment_amount: parseFloat(formData.investment_amount),
//           expected_return: formData.expected_return ? parseFloat(formData.expected_return) : null,
//           investment_date: formData.investment_date,
//           plan_id: formData.plan_id,
//           submitted_by: profile?.user_id,
//           images: formData.images
//         });

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: "Investment submitted for approval"
//       });

//       setIsCreateDialogOpen(false);
//       setFormData({
//         investment_name: '',
//         description: '',
//         investment_amount: '',
//         expected_return: '',
//         investment_date: '',
//         plan_id: '',
//         images: []
//       });
//       fetchInvestments();
//     } catch (error) {
//       console.error('Error creating investment:', error);
//       toast({
//         title: "Error",
//         description: "Failed to create investment",
//         variant: "destructive"
//       });
//     }
//   };

//   const handleApprovalAction = async (investmentId: string, action: 'approved' | 'rejected', comments?: string) => {
//     try {
//       const { error } = await supabase
//         .from('company_investments')
//         .update({
//           approval_status: action,
//           reviewed_by: profile?.user_id,
//           review_comments: comments || null,
//           approved_at: action === 'approved' ? new Date().toISOString() : null
//         })
//         .eq('id', investmentId);

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: `Investment ${action} successfully`
//       });

//       fetchInvestments();
//     } catch (error) {
//       console.error('Error updating investment status:', error);
//       toast({
//         title: "Error",
//         description: "Failed to update investment status",
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
//   const pendingInvestments = investments.filter(i => i.approval_status === 'pending').length;
//   const approvedInvestments = investments.filter(i => i.approval_status === 'approved').length;
//   const totalInvestmentValue = investments
//     .filter(i => i.approval_status === 'approved')
//     .reduce((sum, i) => sum + i.investment_amount, 0);

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
//           <h1 className="text-3xl font-bold text-foreground">Company Investments</h1>
//           <p className="text-muted-foreground">
//             Track and manage company investment portfolio
//           </p>
//         </div>

//         <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//           <DialogTrigger asChild>
//             <Button className="gap-2">
//               <Plus className="h-4 w-4" />
//               Add Investment
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>Record New Investment</DialogTitle>
//               <DialogDescription>
//                 Add a new company investment for tracking and approval.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="investment_name">Investment Name</Label>
//                 <Input
//                   id="investment_name"
//                   value={formData.investment_name}
//                   onChange={(e) => setFormData(prev => ({ ...prev, investment_name: e.target.value }))}
//                   placeholder="e.g., Tech Startup Series A"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea
//                   id="description"
//                   value={formData.description}
//                   onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//                   placeholder="Brief description of the investment opportunity..."
//                   rows={3}
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="investment_amount">Investment Amount (₹)</Label>
//                   <Input
//                     id="investment_amount"
//                     type="number"
//                     value={formData.investment_amount}
//                     onChange={(e) => setFormData(prev => ({ ...prev, investment_amount: e.target.value }))}
//                     placeholder="5000000"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="expected_return">Expected Return (₹)</Label>
//                   <Input
//                     id="expected_return"
//                     type="number"
//                     value={formData.expected_return}
//                     onChange={(e) => setFormData(prev => ({ ...prev, expected_return: e.target.value }))}
//                     placeholder="6000000"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="investment_date">Investment Date</Label>
//                   <Input
//                     id="investment_date"
//                     type="date"
//                     value={formData.investment_date}
//                     onChange={(e) => setFormData(prev => ({ ...prev, investment_date: e.target.value }))}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="plan_id">Related Plan</Label>
//                   <Select value={formData.plan_id} onValueChange={(value) => setFormData(prev => ({ ...prev, plan_id: value }))}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select a plan" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {plans.map((plan) => (
//                         <SelectItem key={plan.id} value={plan.id}>
//                           {plan.name} ({plan.segment})
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
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
//                 <Button onClick={handleCreateInvestment} className="flex-1">
//                   Submit Investment
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
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
//             <Building className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{investments.length}</div>
//             <p className="text-xs text-muted-foreground">Investment entries</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
//             <Calendar className="h-4 w-4 text-amber-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{pendingInvestments}</div>
//             <p className="text-xs text-muted-foreground">Awaiting review</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Approved Investments</CardTitle>
//             <TrendingUp className="h-4 w-4 text-green-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{approvedInvestments}</div>
//             <p className="text-xs text-muted-foreground">Portfolio active</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
//             <DollarSign className="h-4 w-4 text-primary" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{formatCurrency(totalInvestmentValue)}</div>
//             <p className="text-xs text-muted-foreground">Approved investments</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Investments Table */}
//       <Card className="border-border/50 shadow-card">
//         <CardHeader>
//           <CardTitle>Investment Portfolio</CardTitle>
//           <CardDescription>
//             Comprehensive view of all company investments
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {investments.length > 0 ? (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Investment Name</TableHead>
//                   <TableHead>Amount</TableHead>
//                   <TableHead>Expected Return</TableHead>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Status</TableHead>
//                   {canApprove && <TableHead>Actions</TableHead>}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {investments.map((investment) => (
//                   <TableRow key={investment.id}>
//                     <TableCell>
//                       <div>
//                         <div className="font-medium">{investment.investment_name}</div>
//                         {investment.description && (
//                           <div className="text-sm text-muted-foreground truncate max-w-xs">
//                             {investment.description}
//                           </div>
//                         )}
//                       </div>
//                     </TableCell>
//                     <TableCell className="font-medium">
//                       {formatCurrency(investment.investment_amount)}
//                     </TableCell>
//                     <TableCell className="text-success">
//                       {investment.expected_return ? formatCurrency(investment.expected_return) : 'N/A'}
//                     </TableCell>
//                     <TableCell className="text-muted-foreground">
//                       {new Date(investment.investment_date).toLocaleDateString('en-IN')}
//                     </TableCell>
//                     <TableCell>
//                       {getStatusBadge(investment.approval_status)}
//                     </TableCell>
//                     {canApprove && (
//                       <TableCell>
//                         <div className="flex gap-2">
//                           {investment.approval_status === 'pending' ? (
//                             <>
//                               <Button
//                                 size="sm"
//                                 onClick={() => handleApprovalAction(investment.id, 'approved')}
//                                 className="bg-green-600 hover:bg-green-700"
//                               >
//                                 <CheckCircle className="h-3 w-3 mr-1" />
//                                 Approve
//                               </Button>
//                               <Button
//                                 size="sm"
//                                 variant="destructive"
//                                 onClick={() => handleApprovalAction(investment.id, 'rejected', 'Investment declined')}
//                               >
//                                 <XCircle className="h-3 w-3 mr-1" />
//                                 Reject
//                               </Button>
//                             </>
//                           ) : (
//                             profile?.role === 'super_admin' && (
//                               <Button size="sm" variant="outline" onClick={() => { setSelectedInvestment(investment); setIsViewDialogOpen(true); }}>
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
//               <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//               <h3 className="text-lg font-medium mb-2">No investments recorded yet</h3>
//               <p className="text-muted-foreground mb-4">
//                 Start tracking your company's investment portfolio.
//               </p>
//               <Button onClick={() => setIsCreateDialogOpen(true)}>
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add First Investment
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//       <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
//         <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Investment Details</DialogTitle>
//           </DialogHeader>
//           {selectedInvestment && (
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <div className="text-sm text-muted-foreground">Name</div>
//                   <div className="font-medium">{selectedInvestment.investment_name}</div>
//                 </div>
//                 <div>
//                   <div className="text-sm text-muted-foreground">Amount</div>
//                   <div className="font-medium">{formatCurrency(selectedInvestment.investment_amount)}</div>
//                 </div>
//                 <div>
//                   <div className="text-sm text-muted-foreground">Expected Return</div>
//                   <div className="font-medium">{selectedInvestment.expected_return ? formatCurrency(selectedInvestment.expected_return) : 'N/A'}</div>
//                 </div>
//                 <div>
//                   <div className="text-sm text-muted-foreground">Date</div>
//                   <div className="font-medium">{new Date(selectedInvestment.investment_date).toLocaleDateString('en-IN')}</div>
//                 </div>
//                 <div className="col-span-2">
//                   <div className="text-sm text-muted-foreground">Description</div>
//                   <div className="font-medium whitespace-pre-wrap">{selectedInvestment.description || '—'}</div>
//                 </div>
//               </div>
//               {Array.isArray(selectedInvestment.images) && selectedInvestment.images.length > 0 && (
//                 <div>
//                   <div className="text-sm text-muted-foreground mb-2">Uploaded Documents</div>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                     {selectedInvestment.images.map((src: string, idx: number) => (
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
import { Plus, TrendingUp, DollarSign, Calendar, CheckCircle, XCircle, Building, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SecurityNotice } from '@/components/SecurityNotice';

interface Investment {
  id: string;
  investment_name: string;
  description: string | null;
  investment_amount: number;
  expected_return: number | null;
  investment_date: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  submitted_by: string;
  reviewed_by: string | null;
  review_comments: string | null;
  approved_at: string | null;
  created_at: string;
  plan_id: string;
  images?: string[];
}

interface Plan {
  id: string;
  name: string;
  segment: string;
}

export default function Investments() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [formData, setFormData] = useState({
    investment_name: '',
    description: '',
    investment_amount: '',
    expected_return: '',
    investment_date: '',
    plan_id: '',
    images: [] as string[]
  });

  useEffect(() => {
    fetchInvestments();
    fetchPlans();
  }, []);

  const fetchInvestments = async () => {
    try {
      const { data, error } = await supabase
        .from('company_investments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvestments(data || []);
    } catch (error) {
      console.error('Error fetching investments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch investments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('id, name, segment')
        .eq('is_active', true);

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleCreateInvestment = async () => {
    try {
      const { error } = await supabase
        .from('company_investments')
        .insert({
          investment_name: formData.investment_name,
          description: formData.description || null,
          investment_amount: parseFloat(formData.investment_amount),
          expected_return: formData.expected_return ? parseFloat(formData.expected_return) : null,
          investment_date: formData.investment_date,
          plan_id: formData.plan_id,
          submitted_by: profile?.user_id,
          images: formData.images
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Investment submitted for approval"
      });

      setIsCreateDialogOpen(false);
      setFormData({
        investment_name: '',
        description: '',
        investment_amount: '',
        expected_return: '',
        investment_date: '',
        plan_id: '',
        images: []
      });
      fetchInvestments();
    } catch (error) {
      console.error('Error creating investment:', error);
      toast({
        title: "Error",
        description: "Failed to create investment",
        variant: "destructive"
      });
    }
  };

  const handleApprovalAction = async (investmentId: string, action: 'approved' | 'rejected', comments?: string) => {
    try {
      const { error } = await supabase
        .from('company_investments')
        .update({
          approval_status: action,
          reviewed_by: profile?.user_id,
          review_comments: comments || null,
          approved_at: action === 'approved' ? new Date().toISOString() : null
        })
        .eq('id', investmentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Investment ${action} successfully`
      });

      fetchInvestments();
    } catch (error) {
      console.error('Error updating investment status:', error);
      toast({
        title: "Error",
        description: "Failed to update investment status",
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
  const pendingInvestments = investments.filter(i => i.approval_status === 'pending').length;
  const approvedInvestments = investments.filter(i => i.approval_status === 'approved').length;
  const totalInvestmentValue = investments
    .filter(i => i.approval_status === 'approved')
    .reduce((sum, i) => sum + i.investment_amount, 0);

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
    <div className="space-y-6">
      <SecurityNotice />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Company Investments</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track and manage company investment portfolio
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto gap-2">
              <Plus className="h-4 w-4" />
              Add Investment
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg">Record New Investment</DialogTitle>
              <DialogDescription className="text-sm">
                Add a new company investment for tracking and approval.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="investment_name" className="text-sm">Investment Name</Label>
                <Input
                  id="investment_name"
                  value={formData.investment_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, investment_name: e.target.value }))}
                  placeholder="e.g., Tech Startup Series A"
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the investment opportunity..."
                  rows={3}
                  className="text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="investment_amount" className="text-sm">Investment Amount (₹)</Label>
                  <Input
                    id="investment_amount"
                    type="number"
                    value={formData.investment_amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, investment_amount: e.target.value }))}
                    placeholder="5000000"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expected_return" className="text-sm">Expected Return (₹)</Label>
                  <Input
                    id="expected_return"
                    type="number"
                    value={formData.expected_return}
                    onChange={(e) => setFormData(prev => ({ ...prev, expected_return: e.target.value }))}
                    placeholder="6000000"
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="investment_date" className="text-sm">Investment Date</Label>
                  <Input
                    id="investment_date"
                    type="date"
                    value={formData.investment_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, investment_date: e.target.value }))}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plan_id" className="text-sm">Related Plan</Label>
                  <Select value={formData.plan_id} onValueChange={(value) => setFormData(prev => ({ ...prev, plan_id: value }))}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>
                          {plan.name} ({plan.segment})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <Button onClick={handleCreateInvestment} className="flex-1 text-sm">
                  Submit Investment
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="text-sm">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{investments.length}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Investment entries</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Calendar className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{pendingInvestments}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Investments</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{approvedInvestments}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Portfolio active</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(totalInvestmentValue)}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Approved investments</p>
          </CardContent>
        </Card>
      </div>

      {/* Investments List */}
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Investment Portfolio</CardTitle>
          <CardDescription className="text-sm">
            Comprehensive view of all company investments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {investments.length > 0 ? (
            <div className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Investment Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Expected Return</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      {canApprove && <TableHead>Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investments.map((investment) => (
                      <TableRow key={investment.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{investment.investment_name}</div>
                            {investment.description && (
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {investment.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(investment.investment_amount)}
                        </TableCell>
                        <TableCell className="text-success font-medium">
                          {investment.expected_return ? formatCurrency(investment.expected_return) : 'N/A'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(investment.investment_date).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(investment.approval_status)}
                        </TableCell>
                        {canApprove && (
                          <TableCell>
                            <div className="flex gap-2">
                              {investment.approval_status === 'pending' ? (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleApprovalAction(investment.id, 'approved')}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleApprovalAction(investment.id, 'rejected', 'Investment declined')}
                                  >
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              ) : (
                                profile?.role === 'super_admin' && (
                                  <Button size="sm" variant="outline" onClick={() => { setSelectedInvestment(investment); setIsViewDialogOpen(true); }}>
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
                {investments.map((investment) => (
                  <Card key={investment.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-sm">{investment.investment_name}</span>
                        {getStatusBadge(investment.approval_status)}
                      </div>
                      {investment.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {investment.description}
                        </p>
                      )}
                      <div className="text-sm text-muted-foreground">
                        <p><strong>Amount:</strong> {formatCurrency(investment.investment_amount)}</p>
                        <p><strong>Expected Return:</strong> {investment.expected_return ? formatCurrency(investment.expected_return) : 'N/A'}</p>
                        <p><strong>Date:</strong> {new Date(investment.investment_date).toLocaleDateString('en-IN')}</p>
                      </div>
                      {canApprove && (
                        <div className="flex flex-col gap-2 pt-2">
                          {investment.approval_status === 'pending' ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleApprovalAction(investment.id, 'approved')}
                                className="w-full bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="w-full"
                                onClick={() => handleApprovalAction(investment.id, 'rejected', 'Investment declined')}
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
                                onClick={() => { setSelectedInvestment(investment); setIsViewDialogOpen(true); }}
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
              <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No investments recorded yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start tracking your company's investment portfolio.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="text-sm">
                <Plus className="h-4 w-4 mr-2" />
                Add First Investment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Investment Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Investment Details</DialogTitle>
          </DialogHeader>
          {selectedInvestment && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Name</div>
                  <div className="font-medium">{selectedInvestment.investment_name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Amount</div>
                  <div className="font-medium">{formatCurrency(selectedInvestment.investment_amount)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Expected Return</div>
                  <div className="font-medium">{selectedInvestment.expected_return ? formatCurrency(selectedInvestment.expected_return) : 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div className="font-medium">{new Date(selectedInvestment.investment_date).toLocaleDateString('en-IN')}</div>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <div className="text-sm text-muted-foreground">Description</div>
                  <div className="font-medium whitespace-pre-wrap">{selectedInvestment.description || '—'}</div>
                </div>
              </div>
              {Array.isArray(selectedInvestment.images) && selectedInvestment.images.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground mb-2">Uploaded Documents</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedInvestment.images.map((src: string, idx: number) => (
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