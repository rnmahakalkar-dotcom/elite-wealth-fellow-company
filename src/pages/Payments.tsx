import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, DollarSign, CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SecurityNotice } from '@/components/SecurityNotice';

interface PaymentSchedule {
  id: string;
  customer_id: string;
  payment_date: string;
  amount: number;
  is_paid: boolean;
  paid_at: string | null;
  payment_type: string;
  created_at: string;
}

export default function Payments() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid'>('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_schedules')
        .select('*')
        .order('payment_date', { ascending: true });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to fetch payment schedules",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('payment_schedules')
        .update({
          is_paid: true,
          paid_at: new Date().toISOString()
        })
        .eq('id', paymentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment marked as paid"
      });

      fetchPayments();
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status",
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

  const getStatusBadge = (payment: PaymentSchedule) => {
    if (payment.is_paid) {
      return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
    }
    
    const paymentDate = new Date(payment.payment_date);
    const today = new Date();
    
    if (paymentDate < today) {
      return <Badge variant="destructive">Overdue</Badge>;
    } else if (paymentDate.toDateString() === today.toDateString()) {
      return <Badge className="bg-amber-100 text-amber-800">Due Today</Badge>;
    } else {
      return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filterStatus === 'paid') return payment.is_paid;
    if (filterStatus === 'pending') return !payment.is_paid;
    return true;
  });

  const stats = {
    total: payments.length,
    pending: payments.filter(p => !p.is_paid).length,
    paid: payments.filter(p => p.is_paid).length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    paidAmount: payments.filter(p => p.is_paid).reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments.filter(p => !p.is_paid).reduce((sum, p) => sum + p.amount, 0)
  };

  const canManagePayments = profile?.role === 'manager' || profile?.role === 'super_admin';

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
          <h1 className="text-3xl font-bold text-foreground">Payment Schedules</h1>
          <p className="text-muted-foreground">
            Track and manage customer payment schedules
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
          >
            All Payments
          </Button>
          <Button
            variant={filterStatus === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('pending')}
          >
            Pending
          </Button>
          <Button
            variant={filterStatus === 'paid' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('paid')}
          >
            Paid
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All scheduled payments</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">{formatCurrency(stats.pendingAmount)}</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Payments</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paid}</div>
            <p className="text-xs text-muted-foreground">{formatCurrency(stats.paidAmount)}</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
            <p className="text-xs text-muted-foreground">All payment schedules</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Progress Card */}
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Payment Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Payment Completion Rate</span>
              <span className="text-sm text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-primary h-3 rounded-full transition-all duration-300" 
                style={{ 
                  width: stats.total > 0 ? `${(stats.paid / stats.total) * 100}%` : '0%' 
                }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Paid: {formatCurrency(stats.paidAmount)}</span>
              <span>Pending: {formatCurrency(stats.pendingAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle>Payment Schedule</CardTitle>
          <CardDescription>
            Detailed view of all customer payment schedules ({filteredPayments.length} payments)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPayments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid Date</TableHead>
                  {canManagePayments && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-sm">
                      {payment.customer_id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      {new Date(payment.payment_date).toLocaleDateString('en-IN')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{payment.payment_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payment)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.paid_at 
                        ? new Date(payment.paid_at).toLocaleDateString('en-IN')
                        : '-'
                      }
                    </TableCell>
                    {canManagePayments && (
                      <TableCell>
                        {!payment.is_paid && (
                          <Button
                            size="sm"
                            onClick={() => markAsPaid(payment.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Mark Paid
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {filterStatus === 'all' 
                  ? 'No payment schedules found' 
                  : `No ${filterStatus} payments found`
                }
              </h3>
              <p className="text-muted-foreground mb-4">
                Payment schedules are automatically generated when customers are approved.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}