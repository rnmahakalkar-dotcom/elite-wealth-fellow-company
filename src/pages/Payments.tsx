// import { useState, useEffect } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Calendar, DollarSign, CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';
// import { supabase } from '@/integrations/supabase/client';
// import { useToast } from '@/hooks/use-toast';
// import { SecurityNotice } from '@/components/SecurityNotice';

// interface PaymentSchedule {
//   id: string;
//   customer_id: string;
//   payment_date: string;
//   amount: number;
//   is_paid: boolean;
//   paid_at: string | null;
//   payment_type: string;
//   created_at: string;
// }

// export default function Payments() {
//   const { profile } = useAuth();
//   const { toast } = useToast();
//   const [payments, setPayments] = useState<PaymentSchedule[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid'>('all');

//   useEffect(() => {
//     fetchPayments();
//   }, []);

//   const fetchPayments = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('payment_schedules')
//         .select('*')
//         .order('payment_date', { ascending: true });

//       if (error) throw error;
//       setPayments(data || []);
//     } catch (error) {
//       console.error('Error fetching payments:', error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch payment schedules",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAsPaid = async (paymentId: string) => {
//     try {
//       const { error } = await supabase
//         .from('payment_schedules')
//         .update({
//           is_paid: true,
//           paid_at: new Date().toISOString()
//         })
//         .eq('id', paymentId);

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: "Payment marked as paid"
//       });

//       fetchPayments();
//     } catch (error) {
//       console.error('Error updating payment:', error);
//       toast({
//         title: "Error",
//         description: "Failed to update payment status",
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

//   const getStatusBadge = (payment: PaymentSchedule) => {
//     if (payment.is_paid) {
//       return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
//     }
    
//     const paymentDate = new Date(payment.payment_date);
//     const today = new Date();
    
//     if (paymentDate < today) {
//       return <Badge variant="destructive">Overdue</Badge>;
//     } else if (paymentDate.toDateString() === today.toDateString()) {
//       return <Badge className="bg-amber-100 text-amber-800">Due Today</Badge>;
//     } else {
//       return <Badge variant="secondary">Pending</Badge>;
//     }
//   };

//   const filteredPayments = payments.filter(payment => {
//     if (filterStatus === 'paid') return payment.is_paid;
//     if (filterStatus === 'pending') return !payment.is_paid;
//     return true;
//   });

//   const stats = {
//     total: payments.length,
//     pending: payments.filter(p => !p.is_paid).length,
//     paid: payments.filter(p => p.is_paid).length,
//     totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
//     paidAmount: payments.filter(p => p.is_paid).reduce((sum, p) => sum + p.amount, 0),
//     pendingAmount: payments.filter(p => !p.is_paid).reduce((sum, p) => sum + p.amount, 0)
//   };

//   const canManagePayments = profile?.role === 'manager' || profile?.role === 'super_admin';

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
//           <h1 className="text-3xl font-bold text-foreground">Payment Schedules</h1>
//           <p className="text-muted-foreground">
//             Track and manage customer payment schedules
//           </p>
//         </div>

//         <div className="flex gap-2">
//           <Button
//             variant={filterStatus === 'all' ? 'default' : 'outline'}
//             onClick={() => setFilterStatus('all')}
//           >
//             All Payments
//           </Button>
//           <Button
//             variant={filterStatus === 'pending' ? 'default' : 'outline'}
//             onClick={() => setFilterStatus('pending')}
//           >
//             Pending
//           </Button>
//           <Button
//             variant={filterStatus === 'paid' ? 'default' : 'outline'}
//             onClick={() => setFilterStatus('paid')}
//           >
//             Paid
//           </Button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.total}</div>
//             <p className="text-xs text-muted-foreground">All scheduled payments</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
//             <Clock className="h-4 w-4 text-amber-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.pending}</div>
//             <p className="text-xs text-muted-foreground">{formatCurrency(stats.pendingAmount)}</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Completed Payments</CardTitle>
//             <CheckCircle className="h-4 w-4 text-green-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.paid}</div>
//             <p className="text-xs text-muted-foreground">{formatCurrency(stats.paidAmount)}</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Value</CardTitle>
//             <DollarSign className="h-4 w-4 text-primary" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
//             <p className="text-xs text-muted-foreground">All payment schedules</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Payment Progress Card */}
//       <Card className="border-border/50 shadow-card">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <TrendingUp className="h-5 w-5" />
//             Payment Progress
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <span className="text-sm font-medium">Payment Completion Rate</span>
//               <span className="text-sm text-muted-foreground">
//                 {stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0}%
//               </span>
//             </div>
//             <div className="w-full bg-muted rounded-full h-3">
//               <div 
//                 className="bg-primary h-3 rounded-full transition-all duration-300" 
//                 style={{ 
//                   width: stats.total > 0 ? `${(stats.paid / stats.total) * 100}%` : '0%' 
//                 }}
//               ></div>
//             </div>
//             <div className="flex justify-between text-sm text-muted-foreground">
//               <span>Paid: {formatCurrency(stats.paidAmount)}</span>
//               <span>Pending: {formatCurrency(stats.pendingAmount)}</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Payments Table */}
//       <Card className="border-border/50 shadow-card">
//         <CardHeader>
//           <CardTitle>Payment Schedule</CardTitle>
//           <CardDescription>
//             Detailed view of all customer payment schedules ({filteredPayments.length} payments)
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {filteredPayments.length > 0 ? (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Customer ID</TableHead>
//                   <TableHead>Payment Date</TableHead>
//                   <TableHead>Amount</TableHead>
//                   <TableHead>Type</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Paid Date</TableHead>
//                   {canManagePayments && <TableHead>Actions</TableHead>}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredPayments.map((payment) => (
//                   <TableRow key={payment.id}>
//                     <TableCell className="font-mono text-sm">
//                       {payment.customer_id.slice(0, 8)}...
//                     </TableCell>
//                     <TableCell>
//                       {new Date(payment.payment_date).toLocaleDateString('en-IN')}
//                     </TableCell>
//                     <TableCell className="font-medium">
//                       {formatCurrency(payment.amount)}
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant="outline">{payment.payment_type}</Badge>
//                     </TableCell>
//                     <TableCell>
//                       {getStatusBadge(payment)}
//                     </TableCell>
//                     <TableCell className="text-muted-foreground">
//                       {payment.paid_at 
//                         ? new Date(payment.paid_at).toLocaleDateString('en-IN')
//                         : '-'
//                       }
//                     </TableCell>
//                     {canManagePayments && (
//                       <TableCell>
//                         {!payment.is_paid && (
//                           <Button
//                             size="sm"
//                             onClick={() => markAsPaid(payment.id)}
//                             className="bg-green-600 hover:bg-green-700"
//                           >
//                             <CheckCircle className="h-3 w-3 mr-1" />
//                             Mark Paid
//                           </Button>
//                         )}
//                       </TableCell>
//                     )}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <div className="text-center py-12">
//               <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//               <h3 className="text-lg font-medium mb-2">
//                 {filterStatus === 'all' 
//                   ? 'No payment schedules found' 
//                   : `No ${filterStatus} payments found`
//                 }
//               </h3>
//               <p className="text-muted-foreground mb-4">
//                 Payment schedules are automatically generated when customers are approved.
//               </p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// import { useState, useEffect } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Calendar, DollarSign, CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';
// import { supabase } from '@/integrations/supabase/client';
// import { useToast } from '@/hooks/use-toast';
// import { SecurityNotice } from '@/components/SecurityNotice';

// interface PaymentSchedule {
//   id: string;
//   customer_id: string;
//   payment_date: string;
//   amount: number;
//   is_paid: boolean;
//   paid_at: string | null;
//   payment_type: string;
//   created_at: string;
// }

// export default function Payments() {
//   const { profile } = useAuth();
//   const { toast } = useToast();
//   const [payments, setPayments] = useState<PaymentSchedule[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid'>('all');

//   useEffect(() => {
//     fetchPayments();
//   }, []);

//   const fetchPayments = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('payment_schedules')
//         .select('*')
//         .order('payment_date', { ascending: true });

//       if (error) throw error;
//       setPayments(data || []);
//     } catch (error) {
//       console.error('Error fetching payments:', error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch payment schedules",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAsPaid = async (paymentId: string) => {
//     try {
//       const { error } = await supabase
//         .from('payment_schedules')
//         .update({
//           is_paid: true,
//           paid_at: new Date().toISOString()
//         })
//         .eq('id', paymentId);

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: "Payment marked as paid"
//       });

//       fetchPayments();
//     } catch (error) {
//       console.error('Error updating payment:', error);
//       toast({
//         title: "Error",
//         description: "Failed to update payment status",
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

//   const getStatusBadge = (payment: PaymentSchedule) => {
//     if (payment.is_paid) {
//       return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
//     }
    
//     const paymentDate = new Date(payment.payment_date);
//     const today = new Date();
    
//     if (paymentDate < today) {
//       return <Badge variant="destructive">Overdue</Badge>;
//     } else if (paymentDate.toDateString() === today.toDateString()) {
//       return <Badge className="bg-amber-100 text-amber-800">Due Today</Badge>;
//     } else {
//       return <Badge variant="secondary">Pending</Badge>;
//     }
//   };

//   const filteredPayments = payments.filter(payment => {
//     if (filterStatus === 'paid') return payment.is_paid;
//     if (filterStatus === 'pending') return !payment.is_paid;
//     return true;
//   });

//   const stats = {
//     total: payments.length,
//     pending: payments.filter(p => !p.is_paid).length,
//     paid: payments.filter(p => p.is_paid).length,
//     totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
//     paidAmount: payments.filter(p => p.is_paid).reduce((sum, p) => sum + p.amount, 0),
//     pendingAmount: payments.filter(p => !p.is_paid).reduce((sum, p) => sum + p.amount, 0)
//   };

//   const canManagePayments = profile?.role === 'manager' || profile?.role === 'super_admin';

//   if (loading) {
//     return (
//       <div className="space-y-6 px-4 sm:px-6">
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
//     <div className="space-y-6 ">
//       <SecurityNotice />
      
//      {/* Header */}
//      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Customer Payments</h1>
//           <p className="text-sm sm:text-base text-muted-foreground">
//             Track and manage Customer payment schedules
//           </p>
//         </div>

//         <div className="flex flex-wrap justify-center md:justify-end gap-2">
//           <Button
//             variant={filterStatus === "all" ? "default" : "outline"}
//             onClick={() => setFilterStatus("all")}
//             className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
//           >
//             All
//           </Button>
//           <Button
//             variant={filterStatus === "pending" ? "default" : "outline"}
//             onClick={() => setFilterStatus("pending")}
//             className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
//           >
//             Pending
//           </Button>
//           <Button
//             variant={filterStatus === "paid" ? "default" : "outline"}
//             onClick={() => setFilterStatus("paid")}
//             className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
//           >
//             Received
//           </Button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
//             <p className="text-xs text-muted-foreground">All scheduled payments</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
//             <Clock className="h-4 w-4 text-amber-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-xl sm:text-2xl font-bold">{stats.pending}</div>
//             <p className="text-xs text-muted-foreground">{formatCurrency(stats.pendingAmount)}</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Completed Payments</CardTitle>
//             <CheckCircle className="h-4 w-4 text-green-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-xl sm:text-2xl font-bold">{stats.paid}</div>
//             <p className="text-xs text-muted-foreground">{formatCurrency(stats.paidAmount)}</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Value</CardTitle>
//             <DollarSign className="h-4 w-4 text-primary" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-xl sm:text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
//             <p className="text-xs text-muted-foreground">All payment schedules</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Payment Progress Card */}
//       <Card className="border-border/50 shadow-card">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
//             <TrendingUp className="h-5 w-5" />
//             Payment Progress
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <span className="text-sm font-medium">Payment Completion Rate</span>
//               <span className="text-sm text-muted-foreground">
//                 {stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0}%
//               </span>
//             </div>
//             <div className="w-full bg-muted rounded-full h-3">
//               <div 
//                 className="bg-primary h-3 rounded-full transition-all duration-300" 
//                 style={{ 
//                   width: stats.total > 0 ? `${(stats.paid / stats.total) * 100}%` : '0%' 
//                 }}
//               ></div>
//             </div>
//             <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
//               <span>Paid: {formatCurrency(stats.paidAmount)}</span>
//               <span>Pending: {formatCurrency(stats.pendingAmount)}</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Payments Table */}
//       <Card className="border-border/50 shadow-card">
//         <CardHeader>
//           <CardTitle className="text-base sm:text-lg">Payment Schedule</CardTitle>
//           <CardDescription className="text-sm">
//             Detailed view of all customer payment schedules ({filteredPayments.length} payments)
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {filteredPayments.length > 0 ? (
//             <div className="overflow-x-auto">
//               <Table className="hidden sm:table">
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Customer ID</TableHead>
//                     <TableHead>Payment Date</TableHead>
//                     <TableHead>Amount</TableHead>
//                     <TableHead>Type</TableHead>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Paid Date</TableHead>
//                     {canManagePayments && <TableHead>Actions</TableHead>}
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredPayments.map((payment) => (
//                     <TableRow key={payment.id}>
//                       <TableCell className="font-mono text-sm">
//                         {payment.customer_id.slice(0, 8)}...
//                       </TableCell>
//                       <TableCell>
//                         {new Date(payment.payment_date).toLocaleDateString('en-IN')}
//                       </TableCell>
//                       <TableCell className="font-medium">
//                         {formatCurrency(payment.amount)}
//                       </TableCell>
//                       <TableCell>
//                         <Badge variant="outline">{payment.payment_type}</Badge>
//                       </TableCell>
//                       <TableCell>
//                         {getStatusBadge(payment)}
//                       </TableCell>
//                       <TableCell className="text-muted-foreground">
//                         {payment.paid_at 
//                           ? new Date(payment.paid_at).toLocaleDateString('en-IN')
//                           : '-'
//                         }
//                       </TableCell>
//                       {canManagePayments && (
//                         <TableCell>
//                           {!payment.is_paid && (
//                             <Button
//                               size="sm"
//                               onClick={() => markAsPaid(payment.id)}
//                               className="bg-green-600 hover:bg-green-700"
//                             >
//                               <CheckCircle className="h-3 w-3 mr-1" />
//                               Mark Paid
//                             </Button>
//                           )}
//                         </TableCell>
//                       )}
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>

//               {/* Mobile Card View */}
//               <div className="sm:hidden space-y-4">
//                 {filteredPayments.map((payment) => (
//                   <Card key={payment.id} className="p-4">
//                     <div className="space-y-2">
//                       <div className="flex justify-between">
//                         <span className="text-sm font-medium">Customer ID</span>
//                         <span className="font-mono text-sm">
//                           {payment.customer_id.slice(0, 8)}...
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm font-medium">Payment Date</span>
//                         <span className="text-sm">
//                           {new Date(payment.payment_date).toLocaleDateString('en-IN')}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm font-medium">Amount</span>
//                         <span className="text-sm font-medium">
//                           {formatCurrency(payment.amount)}
//                         </span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm font-medium">Type</span>
//                         <Badge variant="outline">{payment.payment_type}</Badge>
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm font-medium">Status</span>
//                         {getStatusBadge(payment)}
//                       </div>
//                       <div className="flex justify-between">
//                         <span className="text-sm font-medium">Paid Date</span>
//                         <span className="text-sm text-muted-foreground">
//                           {payment.paid_at 
//                             ? new Date(payment.paid_at).toLocaleDateString('en-IN')
//                             : '-'
//                           }
//                         </span>
//                       </div>
//                       {canManagePayments && !payment.is_paid && (
//                         <div className="pt-2">
//                           <Button
//                             size="sm"
//                             onClick={() => markAsPaid(payment.id)}
//                             className="w-full bg-green-600 hover:bg-green-700"
//                           >
//                             <CheckCircle className="h-3 w-3 mr-1" />
//                             Mark Paid
//                           </Button>
//                         </div>
//                       )}
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//               <h3 className="text-base sm:text-lg font-medium mb-2">
//                 {filterStatus === 'all' 
//                   ? 'No payment schedules found' 
//                   : `No ${filterStatus} payments found`
//                 }
//               </h3>
//               <p className="text-sm text-muted-foreground mb-4">
//                 Payment schedules are automatically generated when customers are approved.
//               </p>
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, DollarSign, CheckCircle, Clock, TrendingUp, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  transaction_id?: string;
  images?: string[];
  customers: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
  };
}

export default function Payments() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid'>('all');
  const [selectedPayment, setSelectedPayment] = useState<PaymentSchedule | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewPayment, setViewPayment] = useState<PaymentSchedule | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [form, setForm] = useState({ paymentType: '', transactionId: '', images: [] as string[] });

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    if (previewImage) {
      window.history.pushState({ preview: true }, '');
      const handlePopState = () => setPreviewImage(null);
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [previewImage]);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_schedules')
        .select(`
          *,
          customers (
            first_name,
            last_name,
            email,
            phone,
            address
          )
        `)
        .order('payment_date', { ascending: true });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch payment schedules',
        variant: 'destructive',
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
          paid_at: new Date().toISOString(),
          payment_type: form.paymentType,
          transaction_id: form.paymentType !== 'Cash' ? form.transactionId : null,
          images: form.images,
        })
        .eq('id', paymentId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Payment marked as paid',
      });

      fetchPayments();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to update payment status',
        variant: 'destructive',
      });
    }
  };

  const handleOpenDialog = (payment: PaymentSchedule) => {
    setSelectedPayment(payment);
    setForm({ paymentType: '', transactionId: '', images: [] });
    setOpenDialog(true);
  };

  const handleSubmit = () => {
    if (!form.paymentType) {
      toast({ title: 'Please select payment type', variant: 'destructive' });
      return;
    }
    if (form.paymentType !== 'Cash' && !form.transactionId) {
      toast({ title: 'Transaction ID is required for non-cash payments', variant: 'destructive' });
      return;
    }
    if (form.images.length === 0) {
      toast({ title: 'Please upload at least one image', variant: 'destructive' });
      return;
    }

    markAsPaid(selectedPayment!.id);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
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
    pendingAmount: payments.filter(p => !p.is_paid).reduce((sum, p) => sum + p.amount, 0),
  };

  const canManagePayments = profile?.role === 'manager' || profile?.role === 'super_admin';

  if (loading) {
    return (
      <div className="space-y-6 px-4 sm:px-6">
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
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Customer Payments</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track and manage customer payment schedules
          </p>
        </div>

        <div className="flex flex-wrap justify-center md:justify-end gap-2">
          <Button
            variant={filterStatus === "all" ? "default" : "outline"}
            onClick={() => setFilterStatus("all")}
            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
          >
            All
          </Button>
          <Button
            variant={filterStatus === "pending" ? "default" : "outline"}
            onClick={() => setFilterStatus("pending")}
            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
          >
            Pending
          </Button>
          <Button
            variant={filterStatus === "paid" ? "default" : "outline"}
            onClick={() => setFilterStatus("paid")}
            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
          >
            Received
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All scheduled payments</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">{formatCurrency(stats.pendingAmount)}</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Payments</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.paid}</div>
            <p className="text-xs text-muted-foreground">{formatCurrency(stats.paidAmount)}</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
            <p className="text-xs text-muted-foreground">All payment schedules</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Progress Card */}
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
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
            <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
              <span>Paid: {formatCurrency(stats.paidAmount)}</span>
              <span>Pending: {formatCurrency(stats.pendingAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Payment Schedule</CardTitle>
          <CardDescription className="text-sm">
            Detailed view of all customer payment schedules ({filteredPayments.length} payments)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="hidden sm:table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
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
                      <TableCell className="font-medium">
                        {payment.customers.first_name} {payment.customers.last_name}
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
                          <div className="flex gap-2">
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setViewPayment(payment)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            {!payment.is_paid && (
                              <Button
                                size="sm"
                                onClick={() => handleOpenDialog(payment)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Mark Paid
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Mobile Card View */}
              <div className="sm:hidden space-y-4">
                {filteredPayments.map((payment) => (
                  <Card key={payment.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Customer Name</span>
                        <span className="text-sm font-medium">
                          {payment.customers.first_name} {payment.customers.last_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Payment Date</span>
                        <span className="text-sm">
                          {new Date(payment.payment_date).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Amount</span>
                        <span className="text-sm font-medium">
                          {formatCurrency(payment.amount)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Type</span>
                        <Badge variant="outline">{payment.payment_type}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Status</span>
                        {getStatusBadge(payment)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Paid Date</span>
                        <span className="text-sm text-muted-foreground">
                          {payment.paid_at 
                            ? new Date(payment.paid_at).toLocaleDateString('en-IN')
                            : '-'
                          }
                        </span>
                      </div>
                      {canManagePayments && (
                        <div className="flex flex-col gap-2 pt-2">
                          {!payment.is_paid && (
                            <Button
                              size="sm"
                              onClick={() => handleOpenDialog(payment)}
                              className="w-full bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Mark Paid
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => setViewPayment(payment)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-base sm:text-lg font-medium mb-2">
                {filterStatus === 'all' 
                  ? 'No payment schedules found' 
                  : `No ${filterStatus} payments found`
                }
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Payment schedules are automatically generated when customers are approved.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mark Paid Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Mark Payment as Paid</DialogTitle>
            <DialogDescription className="text-sm">
              Fill in details for {selectedPayment?.customers.first_name} {selectedPayment?.customers.last_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Payment Type</label>
              <Select
                value={form.paymentType}
                onValueChange={(v) => setForm({ ...form, paymentType: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Net Banking / UPI</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.paymentType && form.paymentType !== 'Cash' && (
              <div>
                <label className="text-sm font-medium block mb-1">
                  {form.paymentType === 'cheque' ? 'Cheque Number' : form.paymentType === 'Other' ? 'Payment ID' : 'Transaction ID'}
                </label>
                <Input
                  value={form.transactionId}
                  onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
                  className="text-sm"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium">Upload Images</label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={async (e) => {
                  const files = Array.from(e.target.files || []);
                  const base64: string[] = [];
                  for (const f of files) {
                    const b64 = await new Promise<string>((resolve) => {
                      const reader = new FileReader();
                      reader.onload = () => resolve(reader.result as string);
                      reader.readAsDataURL(f);
                    });
                    base64.push(b64);
                  }
                  setForm({ ...form, images: base64 });
                }}
                className="text-sm"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {form.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="preview"
                    className="w-16 h-16 object-cover cursor-pointer rounded"
                    onClick={() => setPreviewImage(img)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenDialog(false)} className="text-sm">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 text-sm">
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={!!viewPayment} onOpenChange={() => setViewPayment(null)}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Payment Details</DialogTitle>
          </DialogHeader>
          {viewPayment && (
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-medium text-base mb-2">Customer Information</h4>
                <p><strong>Full Name:</strong> {viewPayment.customers.first_name} {viewPayment.customers.last_name}</p>
                <p><strong>Email:</strong> {viewPayment.customers.email || '-'}</p>
                <p><strong>Phone:</strong> {viewPayment.customers.phone || '-'}</p>
                <p><strong>Address:</strong> {viewPayment.customers.address || '-'}</p>
              </div>
              <div>
                <h4 className="font-medium text-base mb-2">Payment Details</h4>
                <p><strong>Payment ID:</strong> {viewPayment.id}</p>
                <p><strong>Customer ID:</strong> {viewPayment.customer_id}</p>
                <p><strong>Payment Date:</strong> {new Date(viewPayment.payment_date).toLocaleDateString('en-IN')}</p>
                <p><strong>Amount:</strong> {formatCurrency(viewPayment.amount)}</p>
                <p><strong>Payment Type:</strong> {viewPayment.payment_type}</p>
                <p><strong>Status:</strong> {viewPayment.is_paid ? 'Paid' : getStatusBadge(viewPayment).props.children}</p>
                {viewPayment.paid_at && <p><strong>Paid At:</strong> {new Date(viewPayment.paid_at).toLocaleDateString('en-IN')}</p>}
                {viewPayment.transaction_id && <p><strong>Transaction ID:</strong> {viewPayment.transaction_id}</p>}
                <p><strong>Created At:</strong> {new Date(viewPayment.created_at).toLocaleDateString('en-IN')}</p>
              </div>
              {viewPayment.images?.length > 0 && (
                <div>
                  <h4 className="font-medium text-base mb-2">Uploaded Images</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewPayment.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="payment"
                        className="w-20 h-20 object-cover rounded cursor-pointer"
                        onClick={() => setPreviewImage(img)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Fullscreen Image Preview */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[2000]"
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