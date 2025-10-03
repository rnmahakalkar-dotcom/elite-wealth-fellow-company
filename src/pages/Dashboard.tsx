import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, TrendingUp, Users, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SuperAdminSetup } from '@/components/SuperAdminSetup';
import { PIIAuditLogs } from '@/components/PIIAuditLogs';

interface PaymentSchedule {
  id: string;
  payment_date: string;
  amount: number;
  customer_id: string;
  customers: {
    first_name: string;
    last_name: string;
    investment_amount: number;
  };
}

interface DashboardStats {
  totalCustomers: number;
  totalAgents: number;
  totalInvestments: number;
  pendingApprovals: number;
  upcomingPayments15: PaymentSchedule[];
  upcomingPayments30: PaymentSchedule[];
}

export default function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalAgents: 0,
    totalInvestments: 0,
    pendingApprovals: 0,
    upcomingPayments15: [],
    upcomingPayments30: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [profile]);

  const fetchDashboardData = async () => {
    if (!profile) return;

    try {
      const [
        customerStatsResult,
        agentsResult,
        investmentsResult,
        paymentsResult
      ] = await Promise.all([
        supabase.rpc('get_customer_stats'),
        supabase.from('agents').select('id, approval_status').eq('approval_status', 'approved'),
        supabase.from('company_investments').select('id, approval_status').eq('approval_status', 'approved'),
        supabase
          .from('payment_schedules')
          .select(`
            id,
            payment_date,
            amount,
            customer_id,
            customers (
              first_name,
              last_name,
              investment_amount
            )
          `)
          .gte('payment_date', new Date().toISOString().split('T')[0])
          .lte('payment_date', new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
          .order('payment_date', { ascending: true })
      ]);

      // Get customer stats securely
      const customerStats = customerStatsResult.data?.[0] || {
        total_customers: 0,
        pending_approvals: 0,
        approved_customers: 0,
        rejected_customers: 0
      };

      // Separate payments by date (15th vs 30th/31st)
      const payments = paymentsResult.data || [];
      const payments15 = payments.filter(p => {
        const day = new Date(p.payment_date).getDate();
        return day === 15;
      });
      const payments30 = payments.filter(p => {
        const day = new Date(p.payment_date).getDate();
        return day >= 28; // 28, 29, 30, or 31 (end of month)
      });

      setStats({
        totalCustomers: Number(customerStats.total_customers || 0),
        totalAgents: agentsResult.data?.length || 0,
        totalInvestments: investmentsResult.data?.length || 0,
        pendingApprovals: Number(customerStats.pending_approvals || 0),
        upcomingPayments15: payments15.slice(0, 5),
        upcomingPayments30: payments30.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-64 mb-2"></div>
          <div className="h-4 bg-muted rounded w-48"></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-muted rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Show Super Admin Setup for non-super-admin users */}
      {profile?.role !== 'super_admin' && <SuperAdminSetup />}
      
      {/* Main Dashboard Content */}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {getGreeting()}, {profile?.first_name || 'User'}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your investments today.
          </p>
        </div>
        <Badge variant={profile?.role === 'super_admin' ? 'default' : 'secondary'} className="text-sm">
          {profile?.role === 'super_admin' ? 'Super Admin' : 
           profile?.role === 'manager' ? 'Manager' : 'Office Staff'}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Approved investors</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAgents}</div>
            <p className="text-xs text-muted-foreground">Approved agents</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Company Investments</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInvestments}</div>
            <p className="text-xs text-muted-foreground">Active investments</p>
          </CardContent>
        </Card>

        {(['manager', 'super_admin'] as const).includes(profile?.role as any) && (
          <Card className="border-border/50 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">Require attention</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Payment Schedules - Only for Super Admin */}
      {profile?.role === 'super_admin' && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Upcoming Dues on 15th */}
          <Card className="border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Dues on 15th
              </CardTitle>
              <CardDescription>
                Payments scheduled for the 15th of each month
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.upcomingPayments15.length > 0 ? (
                <div className="space-y-3">
                  {stats.upcomingPayments15.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">
                          {payment.customers.first_name} {payment.customers.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Due: {formatDate(payment.payment_date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{formatCurrency(payment.amount)}</p>
                        <Badge variant="outline" className="text-xs">
                          Payment Due
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {stats.upcomingPayments15.length === 5 && (
                    <Button variant="outline" size="sm" className="w-full">
                      View All Payments
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>No upcoming payments on 15th</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Dues on 30th */}
          <Card className="border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Dues on 30th
              </CardTitle>
              <CardDescription>
                Payments scheduled for the end of each month
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.upcomingPayments30.length > 0 ? (
                <div className="space-y-3">
                  {stats.upcomingPayments30.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">
                          {payment.customers.first_name} {payment.customers.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Due: {formatDate(payment.payment_date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{formatCurrency(payment.amount)}</p>
                        <Badge variant="outline" className="text-xs">
                          Payment Due
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {stats.upcomingPayments30.length === 5 && (
                    <Button variant="outline" size="sm" className="w-full">
                      View All Payments
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                  <p>No upcoming payments on 30th</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks based on your role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {(profile?.role as string) === 'office_staff' && (
              <>
                <Button variant="outline" className="justify-start h-auto p-4" asChild>
                  <div className="flex flex-col items-start gap-1">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Add Customer</span>
                    <span className="text-xs text-muted-foreground">Submit new investor</span>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4" asChild>
                  <div className="flex flex-col items-start gap-1">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">Add Agent</span>
                    <span className="text-xs text-muted-foreground">Register new agent</span>
                  </div>
                </Button>
              </>
            )}
            
            {(['manager', 'super_admin'] as const).includes(profile?.role as any) && (
              <>
                <Button variant="outline" className="justify-start h-auto p-4" asChild>
                  <div className="flex flex-col items-start gap-1">
                    <AlertCircle className="h-4 w-4 text-warning" />
                    <span className="font-medium">Review Approvals</span>
                    <span className="text-xs text-muted-foreground">{stats.pendingApprovals} pending</span>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4" asChild>
                  <div className="flex flex-col items-start gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-medium">Manage Plans</span>
                    <span className="text-xs text-muted-foreground">Investment products</span>
                  </div>
                </Button>
              </>
            )}
            
            {profile?.role === 'super_admin' && (
              <Button variant="outline" className="justify-start h-auto p-4" asChild>
                <div className="flex flex-col items-start gap-1">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">User Management</span>
                  <span className="text-xs text-muted-foreground">Manage team access</span>
                </div>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* PII Audit Logs for Super Admins */}
      <PIIAuditLogs />
    </div>
  );
}