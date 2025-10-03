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
import { useToast } from '@/hooks/use-toast';

interface Plan {
  id: string;
  name: string;
  segment: 'PRE-IPO' | 'REAL ESTATE' | 'DIRECT';
  investment_amount: number;
  return_percentage: number;
  duration_months: number;
  active: boolean;
  planpayment_type: 'monthly' | 'yearly';
  created_at: string;
}

export default function Plans() {
  const { profile, user, fetchWithAuth } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    segment: 'PRE-IPO' as 'PRE-IPO' | 'REAL ESTATE' | 'DIRECT',
    investment_amount: '',
    return_percentage: '',
    duration_months: '',
    planpayment_type: 'monthly' as 'monthly' | 'yearly',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  // const fetchPlans = async () => {
  //   try {
  //     const data = await fetchWithAuth('/plans?is_active=true');
  //     setPlans(data || []);
  //   } catch (error: any) {
  //     console.error('Error fetching plans:', error);
  //     toast({
  //       title: 'Error',
  //       description: error.message || 'Failed to fetch plans',
  //       variant: 'destructive',
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchPlans = async () => {
  try {
    // Fetch ALL plans (active + inactive)
    const data = await fetchWithAuth('/plans');
    setPlans(data || []);
  } catch (error: any) {
    console.error('Error fetching plans:', error);
    toast({
      title: 'Error',
      description: error.message || 'Failed to fetch plans',
      variant: 'destructive',
    });
  } finally {
    setLoading(false);
  }
};


  const handleCreatePlan = async () => {
    if (!user || !['manager', 'super_admin'].includes(user.role)) {
      toast({
        title: 'Error',
        description: 'You do not have permission to create plans',
        variant: 'destructive',
      });
      return;
    }

    try {
      const payload = {
        name: formData.name,
        segment: formData.segment,
        investment_amount: parseFloat(formData.investment_amount),
        return_percentage: parseFloat(formData.return_percentage),
        duration_months: parseInt(formData.duration_months),
        planpayment_type: formData.planpayment_type,
      };

      const data = await fetchWithAuth('/plans', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      toast({
        title: 'Success',
        description: 'Plan created successfully',
      });

      setIsCreateDialogOpen(false);
      setFormData({
        name: '',
        segment: 'PRE-IPO',
        investment_amount: '',
        return_percentage: '',
        duration_months: '',
        planpayment_type: 'monthly',
      });
      fetchPlans();
    } catch (error: any) {
      console.error('Error creating plan:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create plan',
        variant: 'destructive',
      });
    }
  };

  const togglePlanStatus = async (planId: string, currentStatus: boolean) => {
    if (!user || !['manager', 'super_admin'].includes(user.role)) {
      toast({
        title: 'Error',
        description: 'You do not have permission to update plans',
        variant: 'destructive',
      });
      return;
    }

    try {
      await fetchWithAuth(`/plans/${planId}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !currentStatus }),
      });

      toast({
        title: 'Success',
        description: `Plan ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });

      fetchPlans();
    } catch (error: any) {
      console.error('Error updating plan status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update plan status',
        variant: 'destructive',
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getSegmentBadge = (segment: string) => {
    const variants = {
      'PRE-IPO': 'secondary',
      'REAL ESTATE': 'default',
      'DIRECT': 'outline',
    } as const;

    return (
      <Badge variant={variants[segment as keyof typeof variants] || 'secondary'}>
        {segment.toUpperCase()}
      </Badge>
    );
  };

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Investment Plans</h1>
          <p className="text-muted-foreground">Manage investment products and their terms</p>
        </div>

        {user && ['manager', 'super_admin'].includes(user.role) && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Plan</DialogTitle>
                <DialogDescription>Add a new investment plan with specific terms and conditions.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Premium Growth Plan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="investment_amount">Investment Amount (₹)</Label>
                    <Input
                      id="investment_amount"
                      type="number"
                      value={formData.investment_amount}
                      onChange={(e) => setFormData((prev) => ({ ...prev, investment_amount: e.target.value }))}
                      placeholder="100000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="return_percentage">Return % (Annual)</Label>
                    <Input
                      id="return_percentage"
                      type="number"
                      step="0.1"
                      value={formData.return_percentage}
                      onChange={(e) => setFormData((prev) => ({ ...prev, return_percentage: e.target.value }))}
                      placeholder="12.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration_months">Duration (Months)</Label>
                    <Input
                      id="duration_months"
                      type="number"
                      value={formData.duration_months}
                      onChange={(e) => setFormData((prev) => ({ ...prev, duration_months: e.target.value }))}
                      placeholder="12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="segment">Target Segment</Label>
                    <Select
                      value={formData.segment}
                      onValueChange={(value: any) => setFormData((prev) => ({ ...prev, segment: value }))}
                    >
                      <SelectTrigger>
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

                <div className="space-y-2">
                  <Label htmlFor="planpayment_type">Payment Type</Label>
                  <Select
                    value={formData.planpayment_type}
                    onValueChange={(value: any) => setFormData((prev) => ({ ...prev, planpayment_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleCreatePlan} className="flex-1">
                    Create Plan
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Plans Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
            <p className="text-xs text-muted-foreground">Investment products</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.filter((p) => p.active).length}</div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Return</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plans.length > 0
                ? `${(plans.reduce((acc, p) => acc + p.return_percentage, 0) / plans.length).toFixed(1)}%`
                : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">Annual returns</p>
          </CardContent>
        </Card>
      </div>

      {/* Plans Table */}
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle>All Plans</CardTitle>
          <CardDescription>Comprehensive list of all investment plans</CardDescription>
        </CardHeader>
        <CardContent>
          {plans.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Segment</TableHead>
                  <TableHead>Investment</TableHead>
                  <TableHead>Return %</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Payment Type</TableHead>
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
                      </div>
                    </TableCell>
                    <TableCell>{getSegmentBadge(plan.segment)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(plan.investment_amount)}</TableCell>
                    <TableCell className="text-success font-medium">{plan.return_percentage}%</TableCell>
                    <TableCell>{plan.duration_months} months</TableCell>
                    <TableCell>
                      <Badge variant={plan.planpayment_type === 'monthly' ? 'default' : 'secondary'}>
                        {plan.planpayment_type.charAt(0).toUpperCase() + plan.planpayment_type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={plan.active ? 'default' : 'secondary'}>{plan.active ? 'Active' : 'Inactive'}</Badge>
                    </TableCell>
                    <TableCell>
                      {user && ['manager', 'super_admin'].includes(user.role) && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePlanStatus(plan.id, plan.active)}
                          >
                            {plan.active ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No plans created yet</h3>
              <p className="text-muted-foreground mb-4">Create your first investment plan to get started.</p>
              {user && ['manager', 'super_admin'].includes(user.role) && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Plan
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}