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
// import { Separator } from '@/components/ui/separator';
// import { Plus, Edit, Eye, TrendingUp, Calendar, DollarSign } from 'lucide-react';
// import { supabase } from '@/integrations/supabase/client';
// import { useToast } from '@/hooks/use-toast';
// import { SecurityNotice } from '@/components/SecurityNotice';

// interface Plan {
//   id: string;
//   name: string;
//   description: string | null;
//   investment_amount: number;
//   return_percentage: number;
//   duration_months: number;
//   segment: 'PRE-IPO' | 'REAL ESTATE' | 'DIRECT';
//   is_active: boolean;
//   created_at: string;
//   created_by: string;
// }

// export default function Plans() {
//   const { profile } = useAuth();
//   const { toast } = useToast();
//   const [plans, setPlans] = useState<Plan[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     investment_amount: '',
//     return_percentage: '',
//     duration_months: '',
//     segment: 'PRE-IPO' as 'PRE-IPO' | 'REAL ESTATE' | 'DIRECT'
//   });

//   useEffect(() => {
//     fetchPlans();
//   }, []);

//   const fetchPlans = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('plans')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setPlans(data || []);
//     } catch (error) {
//       console.error('Error fetching plans:', error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch plans",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreatePlan = async () => {
//     try {
//       const { error } = await supabase
//         .from('plans')
//         .insert({
//           name: formData.name,
//           description: formData.description || null,
//           investment_amount: parseFloat(formData.investment_amount),
//           return_percentage: parseFloat(formData.return_percentage),
//           duration_months: parseInt(formData.duration_months),
//           segment: formData.segment,
//           created_by: profile?.user_id
//         });

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: "Plan created successfully"
//       });

//       setIsCreateDialogOpen(false);
//       setFormData({
//         name: '',
//         description: '',
//         investment_amount: '',
//         return_percentage: '',
//         duration_months: '',
//         segment: 'PRE-IPO'
//       });
//       fetchPlans();
//     } catch (error) {
//       console.error('Error creating plan:', error);
//       toast({
//         title: "Error",
//         description: "Failed to create plan",
//         variant: "destructive"
//       });
//     }
//   };

//   const togglePlanStatus = async (planId: string, currentStatus: boolean) => {
//     try {
//       const { error } = await supabase
//         .from('plans')
//         .update({ is_active: !currentStatus })
//         .eq('id', planId);

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: `Plan ${!currentStatus ? 'activated' : 'deactivated'} successfully`
//       });

//       fetchPlans();
//     } catch (error) {
//       console.error('Error updating plan status:', error);
//       toast({
//         title: "Error",
//         description: "Failed to update plan status",
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

//   const getSegmentBadge = (segment: string) => {
//     const variants = {
//       'PRE-IPO': 'secondary',
//       'REAL ESTATE': 'default',
//       'DIRECT': 'outline'
//     } as const;
    
//     return (
//       <Badge variant={variants[segment as keyof typeof variants] || 'secondary'}>
//         {segment.toUpperCase()}
//       </Badge>
//     );
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

//   return (
//     <div className="space-y-6">
//       <SecurityNotice/>
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Investment Plans</h1>
//           <p className="text-muted-foreground">
//             Manage investment products and their terms
//           </p>
//         </div>

//         <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//           <DialogTrigger asChild>
//             <Button className="gap-2">
//               <Plus className="h-4 w-4" />
//               Create Plan
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[500px]">
//             <DialogHeader>
//               <DialogTitle>Create New Plan</DialogTitle>
//               <DialogDescription>
//                 Add a new investment plan with specific terms and conditions.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Plan Name</Label>
//                 <Input
//                   id="name"
//                   value={formData.name}
//                   onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//                   placeholder="e.g., Premium Growth Plan"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="description">Description</Label>
//                 <Textarea
//                   id="description"
//                   value={formData.description}
//                   onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//                   placeholder="Brief description of the plan features..."
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
//                     placeholder="100000"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="return_percentage">Return % (Annual)</Label>
//                   <Input
//                     id="return_percentage"
//                     type="number"
//                     step="0.1"
//                     value={formData.return_percentage}
//                     onChange={(e) => setFormData(prev => ({ ...prev, return_percentage: e.target.value }))}
//                     placeholder="12.5"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="duration_months">Duration (Months)</Label>
//                   <Input
//                     id="duration_months"
//                     type="number"
//                     value={formData.duration_months}
//                     onChange={(e) => setFormData(prev => ({ ...prev, duration_months: e.target.value }))}
//                     placeholder="12"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="segment">Target Segment</Label>
//                   <Select value={formData.segment} onValueChange={(value: any) => setFormData(prev => ({ ...prev, segment: value }))}>
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="PRE-IPO">Pre-IPO</SelectItem>
//                       <SelectItem value="REAL ESTATE">Real Estate</SelectItem>
//                       <SelectItem value="DIRECT">Direct</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <Button onClick={handleCreatePlan} className="flex-1">
//                   Create Plan
//                 </Button>
//                 <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Plans Overview Cards */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <Card className="border-border/50 shadow-card">
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{plans.length}</div>
//             <p className="text-xs text-muted-foreground">Investment products</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{plans.filter(p => p.is_active).length}</div>
//             <p className="text-xs text-muted-foreground">Currently available</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Avg Return</CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {plans.length > 0 
//                 ? `${(plans.reduce((acc, p) => acc + p.return_percentage, 0) / plans.length).toFixed(1)}%`
//                 : '0%'
//               }
//             </div>
//             <p className="text-xs text-muted-foreground">Annual returns</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Plans Table */}
//       <Card className="border-border/50 shadow-card">
//         <CardHeader>
//           <CardTitle>All Plans</CardTitle>
//           <CardDescription>
//             Comprehensive list of all investment plans
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {plans.length > 0 ? (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Plan Name</TableHead>
//                   <TableHead>Segment</TableHead>
//                   <TableHead>Investment</TableHead>
//                   <TableHead>Return %</TableHead>
//                   <TableHead>Duration</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {plans.map((plan) => (
//                   <TableRow key={plan.id}>
//                     <TableCell>
//                       <div>
//                         <div className="font-medium">{plan.name}</div>
//                         {plan.description && (
//                           <div className="text-sm text-muted-foreground truncate max-w-xs">
//                             {plan.description}
//                           </div>
//                         )}
//                       </div>
//                     </TableCell>
//                     <TableCell>{getSegmentBadge(plan.segment)}</TableCell>
//                     <TableCell className="font-medium">
//                       {formatCurrency(plan.investment_amount)}
//                     </TableCell>
//                     <TableCell className="text-success font-medium">
//                       {plan.return_percentage}%
//                     </TableCell>
//                     <TableCell>{plan.duration_months} months</TableCell>
//                     <TableCell>
//                       <Badge variant={plan.is_active ? "default" : "secondary"}>
//                         {plan.is_active ? 'Active' : 'Inactive'}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex gap-2">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => togglePlanStatus(plan.id, plan.is_active)}
//                         >
//                           {plan.is_active ? 'Deactivate' : 'Activate'}
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <div className="text-center py-12">
//               <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//               <h3 className="text-lg font-medium mb-2">No plans created yet</h3>
//               <p className="text-muted-foreground mb-4">
//                 Create your first investment plan to get started.
//               </p>
//               <Button onClick={() => setIsCreateDialogOpen(true)}>
//                 <Plus className="h-4 w-4 mr-2" />
//                 Create First Plan
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
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
import { Separator } from '@/components/ui/separator';
import { Plus, Edit, Eye, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SecurityNotice } from '@/components/SecurityNotice';

interface Plan {
  id: string;
  name: string;
  description: string | null;
  investment_amount: number;
  return_percentage: number;
  duration_months: number;
  segment: 'PRE-IPO' | 'REAL ESTATE' | 'DIRECT';
  is_active: boolean;
  created_at: string;
  created_by: string;
}

export default function Plans() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    investment_amount: '',
    return_percentage: '',
    duration_months: '',
    segment: 'PRE-IPO' as 'PRE-IPO' | 'REAL ESTATE' | 'DIRECT'
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Error",
        description: "Failed to fetch plans",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async () => {
    try {
      const { error } = await supabase
        .from('plans')
        .insert({
          name: formData.name,
          description: formData.description || null,
          investment_amount: parseFloat(formData.investment_amount),
          return_percentage: parseFloat(formData.return_percentage),
          duration_months: parseInt(formData.duration_months),
          segment: formData.segment,
          created_by: profile?.user_id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Plan created successfully"
      });

      setIsCreateDialogOpen(false);
      setFormData({
        name: '',
        description: '',
        investment_amount: '',
        return_percentage: '',
        duration_months: '',
        segment: 'PRE-IPO'
      });
      fetchPlans();
    } catch (error) {
      console.error('Error creating plan:', error);
      toast({
        title: "Error",
        description: "Failed to create plan",
        variant: "destructive"
      });
    }
  };

  const togglePlanStatus = async (planId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('plans')
        .update({ is_active: !currentStatus })
        .eq('id', planId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Plan ${!currentStatus ? 'activated' : 'deactivated'} successfully`
      });

      fetchPlans();
    } catch (error) {
      console.error('Error updating plan status:', error);
      toast({
        title: "Error",
        description: "Failed to update plan status",
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

  const getSegmentBadge = (segment: string) => {
    const variants = {
      'PRE-IPO': 'secondary',
      'REAL ESTATE': 'default',
      'DIRECT': 'outline'
    } as const;
    
    return (
      <Badge variant={variants[segment as keyof typeof variants] || 'secondary'}>
        {segment.toUpperCase()}
      </Badge>
    );
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

  return (
    <div className="space-y-6 ">
      <SecurityNotice/>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Investment Plans</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage investment products and their terms
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto gap-2">
              <Plus className="h-4 w-4" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg">Create New Plan</DialogTitle>
              <DialogDescription className="text-sm">
                Add a new investment plan with specific terms and conditions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">Plan Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Premium Growth Plan"
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the plan features..."
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
                    placeholder="100000"
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="return_percentage" className="text-sm">Return % (Annual)</Label>
                  <Input
                    id="return_percentage"
                    type="number"
                    step="0.1"
                    value={formData.return_percentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, return_percentage: e.target.value }))}
                    placeholder="12.5"
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration_months" className="text-sm">Duration (Months)</Label>
                  <Input
                    id="duration_months"
                    type="number"
                    value={formData.duration_months}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_months: e.target.value }))}
                    placeholder="12"
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="segment" className="text-sm">Target Segment</Label>
                  <Select value={formData.segment} onValueChange={(value: any) => setFormData(prev => ({ ...prev, segment: value }))}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRE-IPO">Pre-IPO</SelectItem>
                      <SelectItem value="REAL ESTATE">Real Estate</SelectItem>
                      <SelectItem value="DIRECT">Direct</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button onClick={handleCreatePlan} className="flex-1 text-sm">
                  Create Plan
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="text-sm">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Plans Overview Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{plans.length}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Investment products</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{plans.filter(p => p.is_active).length}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Return</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {plans.length > 0 
                ? `${(plans.reduce((acc, p) => acc + p.return_percentage, 0) / plans.length).toFixed(1)}%`
                : '0%'
              }
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">Annual returns</p>
          </CardContent>
        </Card>
      </div>

      {/* Plans List */}
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">All Plans</CardTitle>
          <CardDescription className="text-sm">
            Comprehensive list of all investment plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          {plans.length > 0 ? (
            <div className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan Name</TableHead>
                      <TableHead>Segment</TableHead>
                      <TableHead>Investment</TableHead>
                      <TableHead>Return %</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{plan.name}</div>
                            {plan.description && (
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {plan.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{getSegmentBadge(plan.segment)}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(plan.investment_amount)}
                        </TableCell>
                        <TableCell className="text-success font-medium">
                          {plan.return_percentage}%
                        </TableCell>
                        <TableCell>{plan.duration_months} months</TableCell>
                        <TableCell>
                          <Badge variant={plan.is_active ? "default" : "secondary"}>
                            {plan.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => togglePlanStatus(plan.id, plan.is_active)}
                            >
                              {plan.is_active ? 'Deactivate' : 'Activate'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {plans.map((plan) => (
                  <Card key={plan.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-sm">{plan.name}</span>
                        <span>{getSegmentBadge(plan.segment)}</span>
                      </div>
                      {plan.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {plan.description}
                        </p>
                      )}
                      <div className="text-sm text-muted-foreground">
                        <p><strong>Investment:</strong> {formatCurrency(plan.investment_amount)}</p>
                        <p><strong>Return:</strong> {plan.return_percentage}%</p>
                        <p><strong>Duration:</strong> {plan.duration_months} months</p>
                        <p><strong>Status:</strong> {plan.is_active ? 'Active' : 'Inactive'}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => togglePlanStatus(plan.id, plan.is_active)}
                      >
                        {plan.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No plans created yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first investment plan to get started.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="text-sm">
                <Plus className="h-4 w-4 mr-2" />
                Create First Plan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}