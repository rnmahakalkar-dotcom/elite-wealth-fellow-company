// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Plus, TrendingUp, Calendar, DollarSign, Gift } from 'lucide-react';
// import { SecurityNotice } from '@/components/SecurityNotice';

// interface GiftPlan {
//   id: string;
//   name: string;
//   description: string;
//   target_investors: number;
//   target_amount: number; // New field: target invested amount
//   reward_type: 'BONUS' | 'PHYSICAL';
//   reward_value: string;
//   duration_months: number; // Duration to achieve target
//   is_active: boolean;
// }

// export default function GiftPlans() {
//   const [plans, setPlans] = useState<GiftPlan[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     target_investors: '',
//     target_amount: '',  // New
//     reward_type: 'BONUS' as 'BONUS' | 'PHYSICAL',
//     reward_value: '',
//     duration_months: ''
//   });

//   useEffect(() => {
//     // Dummy plans
//     const dummyPlans: GiftPlan[] = [
//       { id: '1', name: 'Silver Plan', description: 'Providing silver coin', target_investors: 10, target_amount: 50000, reward_type: 'BONUS', reward_value: '5%', duration_months: 12, is_active: false },
//       { id: '2', name: 'Gold Plan', description: 'Providing Gold coin', target_investors: 20, target_amount: 100000, reward_type: 'PHYSICAL', reward_value: 'Gift Bag', duration_months: 12, is_active: true },
//     ];
//     setTimeout(() => {
//       setPlans(dummyPlans);
//       setLoading(false);
//     }, 500);
//   }, []);

//   const activatePlan = (planId: string) => {
//     setPlans(prev => prev.map(p => p.id === planId ? { ...p, is_active: !p.is_active } : p));
//   };

//   const handleCreatePlan = () => {
//     const newPlan: GiftPlan = {
//       id: Date.now().toString(),
//       name: formData.name,
//       description: formData.description,
//       target_investors: parseInt(formData.target_investors),
//       target_amount: parseFloat(formData.target_amount),
//       reward_type: formData.reward_type,
//       reward_value: formData.reward_value,
//       duration_months: parseInt(formData.duration_months),
//       is_active: false
//     };
//     setPlans(prev => [newPlan, ...prev]);
//     setIsCreateDialogOpen(false);
//     setFormData({ name: '', description: '', target_investors: '', target_amount: '', reward_type: 'BONUS', reward_value: '', duration_months: '' });
//   };

//   const avgBonus = plans.filter(p => p.reward_type === 'BONUS').length > 0
//     ? (plans.filter(p => p.reward_type === 'BONUS').reduce((acc, p) => acc + parseFloat(p.reward_value.replace('%','')), 0) / plans.filter(p => p.reward_type === 'BONUS').length).toFixed(1)
//     : '0';

//   const getBadge = (plan: GiftPlan) => (
//     <Badge variant={plan.is_active ? 'default' : 'secondary'}>
//       {plan.is_active ? 'Active' : 'Inactive'}
//     </Badge>
//   );

 

//   return (
//     <div className="space-y-6">
//       <SecurityNotice/>
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Gift & Reward Plans</h1>
//           <p className="text-muted-foreground">Create and manage reward plans for agents</p>
//         </div>

//         <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//           <DialogTrigger asChild>
//             <Button className="gap-2"><Plus className="h-4 w-4" /> Create Plan</Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//             <DialogHeader>
//               <DialogTitle>Create Gift Plan</DialogTitle>
//               <DialogDescription>Define a target and reward for this plan</DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label>Plan Name</Label>
//                 <Input value={formData.name} onChange={(e)=>setFormData(prev=>({...prev,name:e.target.value}))}/>
//               </div>

//               <div className="space-y-2">
//                 <Label>Description</Label>
//                 <Textarea
//                   rows={3}
//                   value={formData.description}
//                   onChange={(e)=>setFormData(prev=>({...prev, description:e.target.value}))}
//                   placeholder="Brief description of this reward plan..."
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label>Target Investors</Label>
//                 <Input type="number" value={formData.target_investors} onChange={(e)=>setFormData(prev=>({...prev,target_investors:e.target.value}))}/>
//               </div>

//               <div className="space-y-2">
//                 <Label>Target Invested Amount</Label>
//                 <Input type="number" value={formData.target_amount} onChange={(e)=>setFormData(prev=>({...prev,target_amount:e.target.value}))} placeholder="Enter target amount"/>
//               </div>

//               <div className="space-y-2">
//                 <Label>Duration (Months)</Label>
//                 <Input type="number" value={formData.duration_months} onChange={(e)=>setFormData(prev=>({...prev,duration_months:e.target.value}))}/>
//               </div>

//               <div className="space-y-2">
//                 <Label>Reward Type</Label>
//                 <select className="w-full border rounded px-2 py-1" value={formData.reward_type} onChange={(e)=>setFormData(prev=>({...prev,reward_type:e.target.value as 'BONUS'|'PHYSICAL'}))}>
//                   <option value="BONUS">Bonus %</option>
//                   <option value="PHYSICAL">Physical Gift</option>
//                 </select>
//               </div>

//               <div className="space-y-2">
//                 <Label>Reward Value</Label>
//                 <Input value={formData.reward_value} placeholder="5% or Bag" onChange={(e)=>setFormData(prev=>({...prev,reward_value:e.target.value}))}/>
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <Button onClick={handleCreatePlan} className="flex-1">Create Plan</Button>
//                 <Button variant="outline" onClick={()=>setIsCreateDialogOpen(false)}>Cancel</Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Top Cards */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <Card className="border-border/50 shadow-card">
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{plans.length}</div>
//             <p className="text-xs text-muted-foreground">Reward plans</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 shadow-card">
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{plans.filter(p=>p.is_active).length}</div>
//             <p className="text-xs text-muted-foreground">Currently active</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 shadow-card">
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Avg Bonus %</CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{avgBonus}%</div>
//             <p className="text-xs text-muted-foreground">Only bonus type</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Plans Table */}
//       <Card className="border-border/50 shadow-card">
//         <CardHeader>
//           <CardTitle>All Gift Plans</CardTitle>
//           <CardDescription>Manage and activate reward plans</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {plans.length>0 ? (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Plan</TableHead>
//                   <TableHead>Target </TableHead>
//                   <TableHead>Reward</TableHead>
//                   <TableHead>Duration</TableHead>
//                   <TableHead>Status</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {plans.map(plan=>(
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
//                     <TableCell>
//         {plan.target_investors ? (
//           <span>{plan.target_investors} Investors</span>
//         ) : (
//           <span>₹{plan.target_amount.toLocaleString()}</span>
//         )}
//       </TableCell>
//                     <TableCell>
//                       {plan.reward_type==='BONUS' ? 
//                         <span className="flex items-center gap-1  text-green-500 font-medium">{plan.reward_value}</span>
//                         :
//                         <span className="flex items-center gap-1  text-green-500 fot-medium">{plan.reward_value}</span>
//                       }
//                     </TableCell>
//                     <TableCell>{plan.duration_months} months</TableCell>
//                     <TableCell>{getBadge(plan)}</TableCell>
//                     <TableCell>
//                       <Button size="sm" variant="outline" onClick={()=>activatePlan(plan.id)}>
//                         {plan.is_active ? 'Deactivate' : 'Activate'}
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <div className="text-center py-12">
//               <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4"/>
//               <h3 className="text-lg font-medium mb-2">No plans yet</h3>
//               <p className="text-muted-foreground mb-4">Create your first gift plan to get started.</p>
//               <Button onClick={()=>setIsCreateDialogOpen(true)}><Plus className="h-4 w-4 mr-2"/>Create Plan</Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, TrendingUp, Calendar, DollarSign, Gift } from 'lucide-react';
import { SecurityNotice } from '@/components/SecurityNotice';

interface GiftPlan {
  id: string;
  name: string;
  description: string;
  target_investors: number;
  target_amount: number;
  reward_type: 'BONUS' | 'PHYSICAL';
  reward_value: string;
  duration_months: number;
  is_active: boolean;
}

export default function GiftPlans() {
  const [plans, setPlans] = useState<GiftPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    target_investors: '',
    target_amount: '',
    reward_type: 'BONUS' as 'BONUS' | 'PHYSICAL',
    reward_value: '',
    duration_months: ''
  });

  useEffect(() => {
    const dummyPlans: GiftPlan[] = [
      { id: '1', name: 'Silver Plan', description: 'Providing silver coin', target_investors: 10, target_amount: 50000, reward_type: 'BONUS', reward_value: '5%', duration_months: 12, is_active: false },
      { id: '2', name: 'Gold Plan', description: 'Providing Gold coin', target_investors: 20, target_amount: 100000, reward_type: 'PHYSICAL', reward_value: 'Gift Bag', duration_months: 12, is_active: true },
    ];
    setTimeout(() => {
      setPlans(dummyPlans);
      setLoading(false);
    }, 500);
  }, []);

  const activatePlan = (planId: string) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, is_active: !p.is_active } : p));
  };

  const handleCreatePlan = () => {
    const newPlan: GiftPlan = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      target_investors: parseInt(formData.target_investors),
      target_amount: parseFloat(formData.target_amount),
      reward_type: formData.reward_type,
      reward_value: formData.reward_value,
      duration_months: parseInt(formData.duration_months),
      is_active: false
    };
    setPlans(prev => [newPlan, ...prev]);
    setIsCreateDialogOpen(false);
    setFormData({ name: '', description: '', target_investors: '', target_amount: '', reward_type: 'BONUS', reward_value: '', duration_months: '' });
  };

  const avgBonus = plans.filter(p => p.reward_type === 'BONUS').length > 0
    ? (plans.filter(p => p.reward_type === 'BONUS').reduce((acc, p) => acc + parseFloat(p.reward_value.replace('%','')), 0) / plans.filter(p => p.reward_type === 'BONUS').length).toFixed(1)
    : '0';

  const getBadge = (plan: GiftPlan) => (
    <Badge variant={plan.is_active ? 'default' : 'secondary'}>
      {plan.is_active ? 'Active' : 'Inactive'}
    </Badge>
  );

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
    <div className="space-y-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      <SecurityNotice />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Gift & Reward Plans</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Create and manage reward plans for agents</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto gap-2 text-sm">
              <Plus className="h-4 w-4" /> Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg">Create Gift Plan</DialogTitle>
              <DialogDescription className="text-sm">Define a target and reward for this plan</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Plan Name</Label>
                <Input 
                  value={formData.name} 
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} 
                  placeholder="e.g., Silver Plan"
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Description</Label>
                <Textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of this reward plan..."
                  className="text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">Target Investors</Label>
                  <Input 
                    type="number" 
                    value={formData.target_investors} 
                    onChange={(e) => setFormData(prev => ({ ...prev, target_investors: e.target.value }))} 
                    placeholder="10"
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Target Invested Amount (₹)</Label>
                  <Input 
                    type="number" 
                    value={formData.target_amount} 
                    onChange={(e) => setFormData(prev => ({ ...prev, target_amount: e.target.value }))} 
                    placeholder="50000"
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Duration (Months)</Label>
                <Input 
                  type="number" 
                  value={formData.duration_months} 
                  onChange={(e) => setFormData(prev => ({ ...prev, duration_months: e.target.value }))} 
                  placeholder="12"
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Reward Type</Label>
                <Select 
                  value={formData.reward_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, reward_type: value as 'BONUS' | 'PHYSICAL' }))}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Select reward type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BONUS">Bonus %</SelectItem>
                    <SelectItem value="PHYSICAL">Physical Gift</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Reward Value</Label>
                <Input 
                  value={formData.reward_value} 
                  placeholder={formData.reward_type === 'BONUS' ? "5%" : "Gift Bag"} 
                  onChange={(e) => setFormData(prev => ({ ...prev, reward_value: e.target.value }))} 
                  className="text-sm"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button onClick={handleCreatePlan} className="flex-1 text-sm">Create Plan</Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="text-sm">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Top Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{plans.length}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Reward plans</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{plans.filter(p => p.is_active).length}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Bonus %</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{avgBonus}%</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Only bonus type</p>
          </CardContent>
        </Card>
      </div>

      {/* Plans List */}
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">All Gift Plans</CardTitle>
          <CardDescription className="text-sm">Manage and activate reward plans</CardDescription>
        </CardHeader>
        <CardContent>
          {plans.length > 0 ? (
            <div className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Reward</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {plans.map(plan => (
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
                        <TableCell>
                          {plan.target_investors ? (
                            <span>{plan.target_investors} Investors</span>
                          ) : (
                            <span>₹ {plan.target_amount.toLocaleString()}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 text-green-500 font-medium">
                            {/* {plan.reward_type === 'BONUS' ? (
                              <DollarSign className="h-4 w-4" />
                            ) : (
                              <Gift className="h-4 w-4" />
                            )} */}
                            {plan.reward_value}
                          </span>
                        </TableCell>
                        <TableCell>{plan.duration_months} months</TableCell>
                        <TableCell>{getBadge(plan)}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => activatePlan(plan.id)}>
                            {plan.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {plans.map(plan => (
                  <Card key={plan.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-sm">{plan.name}</span>
                        {getBadge(plan)}
                      </div>
                      {plan.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{plan.description}</p>
                      )}
                      <div className="text-sm text-muted-foreground">
                        <p><strong>Target:</strong> {plan.target_investors ? `${plan.target_investors} Investors` : `₹${plan.target_amount.toLocaleString()}`}</p>
                        <p><strong>Reward:</strong> {plan.reward_value} ({plan.reward_type})</p>
                        <p><strong>Duration:</strong> {plan.duration_months} months</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => activatePlan(plan.id)}
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
              <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4"/>
              <h3 className="text-lg font-medium mb-2">No plans yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Create your first gift plan to get started.</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="text-sm">
                <Plus className="h-4 w-4 mr-2"/>Create Plan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}