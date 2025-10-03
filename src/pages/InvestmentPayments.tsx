
// import { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   CheckCircle,
//   Eye,
//   Calendar,
//   Clock,
//   DollarSign,
//   TrendingUp
// } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { SecurityNotice } from "@/components/SecurityNotice";
// import { useToast } from "@/hooks/use-toast";

// // Mock Investment Payment type
// interface InvestmentPayment {
//   id: string;
//   investment_name: string;
//   payment_date: string;
//   amount: number;
//   is_received: boolean;
//   received_at: string | null;
//   payment_type: string;
//   transaction_id?: string;
//   images?: string[];
// }

// export default function InvestmentPayments() {
//   const { toast } = useToast();

//   // Mock Data
//   const [payments, setPayments] = useState<InvestmentPayment[]>([
//     {
//       id: "1",
//       investment_name: "Real Estate Fund",
//       payment_date: "2025-10-10",
//       amount: 50000,
//       is_received: false,
//       received_at: null,
//       payment_type: "Pending",
//       images: [],
//     },
//     {
//       id: "2",
//       investment_name: "Tech Growth Plan",
//       payment_date: "2025-09-15",
//       amount: 75000,
//       is_received: true,
//       received_at: "2025-09-20",
//       payment_type: "UPI",
//       transaction_id: "UPI123456",
//       images: [],
//     },
//   ]);

//   const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "received">("all");
//   const [selectedPayment, setSelectedPayment] = useState<InvestmentPayment | null>(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [form, setForm] = useState({ paymentType: "", transactionId: "", images: [] as string[] });
//   const [viewPayment, setViewPayment] = useState<InvestmentPayment | null>(null);
//   const [previewImage, setPreviewImage] = useState<string | null>(null);

//   // Filtered list
//   const filteredPayments = payments.filter((p) => {
//     if (filterStatus === "received") return p.is_received;
//     if (filterStatus === "pending") return !p.is_received;
//     return true;
//   });

//   // Stats
//   const stats = {
//     total: payments.length,
//     received: payments.filter((p) => p.is_received).length,
//     pending: payments.filter((p) => !p.is_received).length,
//     totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
//     receivedAmount: payments.filter((p) => p.is_received).reduce((sum, p) => sum + p.amount, 0),
//     pendingAmount: payments.filter((p) => !p.is_received).reduce((sum, p) => sum + p.amount, 0),
//   };

//   const formatCurrency = (amount: number) =>
//     new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//     }).format(amount);

//   // Handle Mark as Received
//   const handleOpenDialog = (payment: InvestmentPayment) => {
//     setSelectedPayment(payment);
//     setForm({ paymentType: "", transactionId: "", images: [] });
//     setOpenDialog(true);
//   };

//   const handleSubmit = () => {
//     if (!form.paymentType) {
//       toast({ title: "Please select payment type", variant: "destructive" });
//       return;
//     }
//     if (form.paymentType !== "Cash" && !form.transactionId) {
//       toast({ title: "Transaction ID is required for non-cash payments", variant: "destructive" });
//       return;
//     }
//     if (form.images.length === 0) {
//       toast({ title: "Please upload at least one image", variant: "destructive" });
//       return;
//     }

//     setPayments((prev) =>
//       prev.map((p) =>
//         p.id === selectedPayment?.id
//           ? {
//               ...p,
//               is_received: true,
//               received_at: new Date().toISOString(),
//               payment_type: form.paymentType,
//               transaction_id: form.paymentType !== "Cash" ? form.transactionId : undefined,
//               images: form.images,
//             }
//           : p
//       )
//     );

//     toast({ title: "Payment marked as received!", variant: "default" });
//     setOpenDialog(false);
//   };

//   // Handle back button for image preview
//   useEffect(() => {
//     if (previewImage) {
//       window.history.pushState({ preview: true }, "");
//       const handlePopState = () => setPreviewImage(null);
//       window.addEventListener("popstate", handlePopState);
//       return () => window.removeEventListener("popstate", handlePopState);
//     }
//   }, [previewImage]);

//   return (
//     <div className="space-y-6">
//       <SecurityNotice />

//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Investment Payments</h1>
//           <p className="text-muted-foreground">
//             Track and manage investment payment schedules
//           </p>
//         </div>

//         <div className="flex gap-2">
//           <Button
//             variant={filterStatus === "all" ? "default" : "outline"}
//             onClick={() => setFilterStatus("all")}
//           >
//             All
//           </Button>
//           <Button
//             variant={filterStatus === "pending" ? "default" : "outline"}
//             onClick={() => setFilterStatus("pending")}
//           >
//             Pending
//           </Button>
//           <Button
//             variant={filterStatus === "received" ? "default" : "outline"}
//             onClick={() => setFilterStatus("received")}
//           >
//             Received
//           </Button>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent className="text-2xl font-bold">{stats.total}</CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Pending </CardTitle>
//             <Clock className="h-4 w-4 text-amber-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.pending}</div>
//             <p className="text-sm text-muted-foreground">
//               {formatCurrency(stats.pendingAmount)}
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Received</CardTitle>
//             <CheckCircle className="h-4 w-4 text-green-500" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.received}</div>
//             <p className="text-sm text-muted-foreground">
//               {formatCurrency(stats.receivedAmount)}
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Value</CardTitle>
//             <DollarSign className="h-4 w-4 text-primary" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Payment Progress */}
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
//                 {stats.total > 0 ? Math.round((stats.received / stats.total) * 100) : 0}%
//               </span>
//             </div>
//             <div className="w-full bg-muted rounded-full h-3">
//               <div 
//                 className="bg-primary h-3 rounded-full transition-all duration-300" 
//                 style={{ width: stats.total > 0 ? `${(stats.received / stats.total) * 100}%` : '0%' }}
//               ></div>
//             </div>
//             <div className="flex justify-between text-sm text-muted-foreground">
//               <span>Paid: {formatCurrency(stats.receivedAmount)}</span>
//               <span>Pending: {formatCurrency(stats.pendingAmount)}</span>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Investment Payment Schedule</CardTitle>
//           <CardDescription>
//             Detailed view of all investment payments ({filteredPayments.length})
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {filteredPayments.length > 0 ? (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Investment</TableHead>
//                   <TableHead>Date</TableHead>
//                   <TableHead>Amount</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Received Date</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {filteredPayments.map((p) => (
//                   <TableRow key={p.id}>
//                     <TableCell>{p.investment_name}</TableCell>
//                     <TableCell>{new Date(p.payment_date).toLocaleDateString("en-IN")}</TableCell>
//                     <TableCell>{formatCurrency(p.amount)}</TableCell>
//                     <TableCell>
//                       {p.is_received ? (
//                         <Badge className="bg-green-100 text-green-800">Received</Badge>
//                       ) : (
//                         <Badge variant="secondary">Pending</Badge>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       {p.received_at ? new Date(p.received_at).toLocaleDateString("en-IN") : "-"}
//                     </TableCell>
//                     <TableCell className="flex gap-2">
//                       {!p.is_received && (
//                         <Button
//                           size="sm"
//                           className="bg-green-600 hover:bg-green-700"
//                           onClick={() => handleOpenDialog(p)}
//                         >
//                           <CheckCircle className="h-3 w-3 mr-1" />
//                           Mark Received
//                         </Button>
//                       )}
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => setViewPayment(p)}
//                       >
//                         <Eye className="h-3 w-3 mr-1" />
//                         View
//                       </Button>
//                     </TableCell>
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
//                 Payment schedules are automatically generated when Investments are approved.
//               </p>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Receive Payment Dialog */}
//       <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Receive Payment</DialogTitle>
//             <DialogDescription>
//               Fill in details for {selectedPayment?.investment_name}
//             </DialogDescription>
//           </DialogHeader>

//           <div className="space-y-4">
//             <div>
//               <label className="text-sm font-medium">Payment Type</label>
//               <Select
//                 value={form.paymentType}
//                 onValueChange={(v) => setForm({ ...form, paymentType: v })}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
//                   <SelectItem value="Net Banking">Net Banking</SelectItem>
//                   <SelectItem value="UPI">UPI</SelectItem>
//                   <SelectItem value="Cash">Cash</SelectItem>
//                   <SelectItem value="Other">Other</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {form.paymentType && form.paymentType !== "Cash" && (
//               <div>
//                 <label className="text-sm font-medium">Transaction ID</label>
//                 <Input
//                   value={form.transactionId}
//                   onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
//                 />
//               </div>
//             )}

//             <div>
//               <label className="text-sm font-medium">Upload Images</label>
//               <Input
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 onChange={async (e) => {
//                   const files = Array.from(e.target.files || []);
//                   const base64: string[] = [];
//                   for (const f of files) {
//                     const b64 = await new Promise<string>((resolve) => {
//                       const reader = new FileReader();
//                       reader.onload = () => resolve(reader.result as string);
//                       reader.readAsDataURL(f);
//                     });
//                     base64.push(b64);
//                   }
//                   setForm({ ...form, images: base64 });
//                 }}
//               />
//               <div className="flex gap-2 mt-2">
//                 {form.images.map((img, i) => (
//                   <img
//                     key={i}
//                     src={img}
//                     alt="preview"
//                     className="w-16 h-16 object-cover cursor-pointer rounded"
//                     onClick={() => setPreviewImage(img)}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end gap-2 mt-4">
//             <Button variant="outline" onClick={() => setOpenDialog(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
//               Submit
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* View Details Dialog */}
//       <Dialog open={!!viewPayment} onOpenChange={() => setViewPayment(null)}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Payment Details</DialogTitle>
//           </DialogHeader>
//           {viewPayment && (
//             <div className="space-y-2">
//               <p><strong>Investment:</strong> {viewPayment.investment_name}</p>
//               <p><strong>Amount:</strong> {formatCurrency(viewPayment.amount)}</p>
//               <p><strong>Date:</strong> {new Date(viewPayment.payment_date).toLocaleDateString("en-IN")}</p>
//               <p><strong>Status:</strong> {viewPayment.is_received ? "Received" : "Pending"}</p>
//               {viewPayment.received_at && <p><strong>Received Date:</strong> {new Date(viewPayment.received_at).toLocaleDateString("en-IN")}</p>}
//               {viewPayment.transaction_id && <p><strong>Txn ID:</strong> {viewPayment.transaction_id}</p>}
//               <div className="flex gap-2">
//                 {viewPayment.images?.map((img, i) => (
//                   <img
//                     key={i}
//                     src={img}
//                     alt="payment"
//                     className="w-20 h-20 object-cover rounded cursor-pointer"
//                     onClick={() => setPreviewImage(img)}
//                   />
//                 ))}
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Fullscreen Image Preview */}
//       {previewImage && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[2000]"
//           onClick={() => setPreviewImage(null)}
//         >
//           <img
//             src={previewImage}
//             alt="preview"
//             className="max-w-[90%] max-h-[90%] rounded shadow-lg"
//           />
//         </div>
//       )}
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  Eye,
  Calendar,
  Clock,
  DollarSign,
  TrendingUp
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SecurityNotice } from "@/components/SecurityNotice";
import { useToast } from "@/hooks/use-toast";

// Mock Investment Payment type
interface InvestmentPayment {
  id: string;
  investment_name: string;
  payment_date: string;
  amount: number;
  is_received: boolean;
  received_at: string | null;
  payment_type: string;
  transaction_id?: string;
  images?: string[];
}

export default function InvestmentPayments() {
  const { toast } = useToast();

  // Mock Data
  const [payments, setPayments] = useState<InvestmentPayment[]>([
    {
      id: "1",
      investment_name: "Real Estate Fund",
      payment_date: "2025-10-10",
      amount: 50000,
      is_received: false,
      received_at: null,
      payment_type: "Pending",
      images: [],
    },
    {
      id: "2",
      investment_name: "Tech Growth Plan",
      payment_date: "2025-09-15",
      amount: 75000,
      is_received: true,
      received_at: "2025-09-20",
      payment_type: "UPI",
      transaction_id: "UPI123456",
      images: [],
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "received">("all");
  const [selectedPayment, setSelectedPayment] = useState<InvestmentPayment | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState({ paymentType: "", transactionId: "", images: [] as string[] });
  const [viewPayment, setViewPayment] = useState<InvestmentPayment | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Filtered list
  const filteredPayments = payments.filter((p) => {
    if (filterStatus === "received") return p.is_received;
    if (filterStatus === "pending") return !p.is_received;
    return true;
  });

  // Stats
  const stats = {
    total: payments.length,
    received: payments.filter((p) => p.is_received).length,
    pending: payments.filter((p) => !p.is_received).length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    receivedAmount: payments.filter((p) => p.is_received).reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments.filter((p) => !p.is_received).reduce((sum, p) => sum + p.amount, 0),
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);

  // Handle Mark as Received
  const handleOpenDialog = (payment: InvestmentPayment) => {
    setSelectedPayment(payment);
    setForm({ paymentType: "", transactionId: "", images: [] });
    setOpenDialog(true);
  };

  const handleSubmit = () => {
    if (!form.paymentType) {
      toast({ title: "Please select payment type", variant: "destructive" });
      return;
    }
    if (form.paymentType !== "Cash" && !form.transactionId) {
      toast({ title: "Transaction ID is required for non-cash payments", variant: "destructive" });
      return;
    }
    if (form.images.length === 0) {
      toast({ title: "Please upload at least one image", variant: "destructive" });
      return;
    }

    setPayments((prev) =>
      prev.map((p) =>
        p.id === selectedPayment?.id
          ? {
              ...p,
              is_received: true,
              received_at: new Date().toISOString(),
              payment_type: form.paymentType,
              transaction_id: form.paymentType !== "Cash" ? form.transactionId : undefined,
              images: form.images,
            }
          : p
      )
    );

    toast({ title: "Payment marked as received!", variant: "default" });
    setOpenDialog(false);
  };

  // Handle back button for image preview
  useEffect(() => {
    if (previewImage) {
      window.history.pushState({ preview: true }, "");
      const handlePopState = () => setPreviewImage(null);
      window.addEventListener("popstate", handlePopState);
      return () => window.removeEventListener("popstate", handlePopState);
    }
  }, [previewImage]);

  return (
    <div className="space-y-6 ">
      <SecurityNotice />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Investment Payments</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track and manage investment payment schedules
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
            variant={filterStatus === "received" ? "default" : "outline"}
            onClick={() => setFilterStatus("received")}
            className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
          >
            Received
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-xl sm:text-2xl font-bold">{stats.total}</CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {formatCurrency(stats.pendingAmount)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Received</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{stats.received}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {formatCurrency(stats.receivedAmount)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{formatCurrency(stats.totalAmount)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Progress */}
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <TrendingUp className="h-5 w-5" />
            Payment Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Payment Completion Rate</span>
              <span className="text-sm text-muted-foreground">
                {stats.total > 0 ? Math.round((stats.received / stats.total) * 100) : 0}%
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className="bg-primary h-3 rounded-full transition-all duration-300" 
                style={{ width: stats.total > 0 ? `${(stats.received / stats.total) * 100}%` : '0%' }}
              ></div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm text-muted-foreground">
              <span>Paid: {formatCurrency(stats.receivedAmount)}</span>
              <span>Pending: {formatCurrency(stats.pendingAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Investment Payment Schedule</CardTitle>
          <CardDescription className="text-sm">
            Detailed view of all investment payments ({filteredPayments.length})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPayments.length > 0 ? (
            <div className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Investment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Received Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.investment_name}</TableCell>
                        <TableCell>{new Date(p.payment_date).toLocaleDateString("en-IN")}</TableCell>
                        <TableCell>{formatCurrency(p.amount)}</TableCell>
                        <TableCell>
                          {p.is_received ? (
                            <Badge className="bg-green-100 text-green-800">Received</Badge>
                          ) : (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {p.received_at ? new Date(p.received_at).toLocaleDateString("en-IN") : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setViewPayment(p)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>

                            {!p.is_received && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleOpenDialog(p)}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Mark Received
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredPayments.map((p) => (
                  <Card key={p.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-sm">{p.investment_name}</span>
                        <span>
                          {p.is_received ? (
                            <Badge className="bg-green-100 text-green-800">Received</Badge>
                          ) : (
                            <Badge variant="secondary">Pending</Badge>
                          )}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p><strong>Date:</strong> {new Date(p.payment_date).toLocaleDateString("en-IN")}</p>
                        <p><strong>Amount:</strong> {formatCurrency(p.amount)}</p>
                        <p><strong>Received:</strong> {p.received_at ? new Date(p.received_at).toLocaleDateString("en-IN") : "-"}</p>
                      </div>
                      <div className="flex flex-col gap-2 pt-2">
                        {!p.is_received && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 w-full"
                            onClick={() => handleOpenDialog(p)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Mark Received
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full"
                          onClick={() => setViewPayment(p)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {filterStatus === 'all' 
                  ? 'No payment schedules found' 
                  : `No ${filterStatus} payments found`
                }
              </h3>
              <p className="text-sm text-muted-foreground">
                Payment schedules are automatically generated when Investments are approved.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Receive Payment Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Receive Payment</DialogTitle>
            <DialogDescription className="text-sm">
              Fill in details for {selectedPayment?.investment_name}
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
                  <SelectItem value="online">Net Banking / UPI </SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {form.paymentType && form.paymentType !== "Cash" && (
              <div>
                 <label className="text-sm font-medium block mb-1">
      {form.paymentType === "cheque" ? "Cheque Number" :form.paymentType === "Other"
        ? "Payment ID": "Transaction ID"}
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
            <div className="space-y-2 text-sm">
              <p><strong>Investment:</strong> {viewPayment.investment_name}</p>
              <p><strong>Amount:</strong> {formatCurrency(viewPayment.amount)}</p>
              <p><strong>Date:</strong> {new Date(viewPayment.payment_date).toLocaleDateString("en-IN")}</p>
              <p><strong>Status:</strong> {viewPayment.is_received ? "Received" : "Pending"}</p>
              {viewPayment.received_at && <p><strong>Received Date:</strong> {new Date(viewPayment.received_at).toLocaleDateString("en-IN")}</p>}
              {viewPayment.transaction_id && <p><strong>Txn ID:</strong> {viewPayment.transaction_id}</p>}
              <div className="flex flex-wrap gap-2">
                {viewPayment.images?.map((img, i) => (
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