// import { useState, useEffect } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Plus, UserPlus, Users as UsersIcon, Shield, Settings } from 'lucide-react';
// import { createProfile, listProfiles, updateUserRole } from '@/lib/profileRepo';
// import { useToast } from '@/hooks/use-toast';

// interface Profile {
//   id: string;
//   user_id: string;
//   email: string;
//   first_name: string | null;
//   last_name: string | null;
//   role: 'super_admin' | 'manager' | 'office_staff';
//   created_at: string;
// }

// export default function Users() {
//   const { profile } = useAuth();
//   const { toast } = useToast();
//   const [profiles, setProfiles] = useState<Profile[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     email: '',
//     first_name: '',
//     last_name: '',
//     role: 'office_staff' as 'super_admin' | 'manager' | 'office_staff'
//   });

//   useEffect(() => {
//     fetchProfiles();
//   }, []);

//   const fetchProfiles = async () => {
//     try {
//       const { data, error } = await listProfiles();
//       if (error) throw error;
//       setProfiles(data || []);
//     } catch (error) {
//       console.error('Error fetching profiles:', error);
//       toast({
//         title: "Error",
//         description: "Failed to fetch user profiles",
//         variant: "destructive"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateUser = async () => {
//     try {
//       const { error } = await createProfile({
//         email: formData.email,
//         first_name: formData.first_name,
//         last_name: formData.last_name,
//         role: formData.role,
//         user_id: crypto.randomUUID()
//       });

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: "User created successfully"
//       });

//       setIsCreateDialogOpen(false);
//       setFormData({
//         email: '',
//         first_name: '',
//         last_name: '',
//         role: 'office_staff'
//       });
//       fetchProfiles();
//     } catch (error) {
//       console.error('Error creating user:', error);
//       toast({
//         title: "Error",
//         description: "Failed to create user",
//         variant: "destructive"
//       });
//     }
//   };

//   const updateUserRoleLocal = async (userId: string, newRole: 'super_admin' | 'manager' | 'office_staff') => {
//     try {
//       const { error } = await updateUserRole(userId, newRole);

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: "User role updated successfully"
//       });

//       fetchProfiles();
//     } catch (error) {
//       console.error('Error updating user role:', error);
//       toast({
//         title: "Error",
//         description: "Failed to update user role",
//         variant: "destructive"
//       });
//     }
//   };

//   const getRoleBadgeVariant = (role: string) => {
//     switch (role) {
//       case 'super_admin':
//         return 'default';
//       case 'manager':
//         return 'secondary';
//       case 'office_staff':
//         return 'outline';
//       default:
//         return 'outline';
//     }
//   };

//   const getRoleLabel = (role: string) => {
//     switch (role) {
//       case 'super_admin':
//         return 'Super Admin';
//       case 'manager':
//         return 'Manager';
//       case 'office_staff':
//         return 'Office Staff';
//       default:
//         return role;
//     }
//   };

//   const getRoleStats = () => {
//     const stats = {
//       super_admin: profiles.filter(p => p.role === 'super_admin').length,
//       manager: profiles.filter(p => p.role === 'manager').length,
//       office_staff: profiles.filter(p => p.role === 'office_staff').length
//     };
//     return stats;
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

//   const roleStats = getRoleStats();

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">User Management</h1>
//           <p className="text-muted-foreground">
//             Manage team members and their access levels
//           </p>
//         </div>

//         <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//           <DialogTrigger asChild>
//             <Button className="gap-2">
//               <Plus className="h-4 w-4" />
//               Add User
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[500px]">
//             <DialogHeader>
//               <DialogTitle>Create New User</DialogTitle>
//               <DialogDescription>
//                 Add a new team member and assign their role.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email Address</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
//                   placeholder="user@company.com"
//                 />
//               </div>

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
//                 <Label htmlFor="role">Role</Label>
//                 <Select value={formData.role} onValueChange={(value: any) => setFormData(prev => ({ ...prev, role: value }))}>
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="office_staff">Office Staff</SelectItem>
//                     <SelectItem value="manager">Manager</SelectItem>
//                     <SelectItem value="super_admin">Super Admin</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <p className="text-xs text-muted-foreground">
//                   Office Staff can create entries, Managers can approve, Super Admins have full access
//                 </p>
//               </div>

//               <div className="flex gap-3 pt-4">
//                 <Button onClick={handleCreateUser} className="flex-1">
//                   Create User
//                 </Button>
//                 <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* Role Statistics */}
//       <div className="grid gap-4 md:grid-cols-4">
//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Total Users</CardTitle>
//             <UsersIcon className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{profiles.length}</div>
//             <p className="text-xs text-muted-foreground">Active team members</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
//             <Shield className="h-4 w-4 text-primary" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{roleStats.super_admin}</div>
//             <p className="text-xs text-muted-foreground">Full access level</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Managers</CardTitle>
//             <Settings className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{roleStats.manager}</div>
//             <p className="text-xs text-muted-foreground">Approval authority</p>
//           </CardContent>
//         </Card>

//         <Card className="border-border/50 shadow-card">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Office Staff</CardTitle>
//             <UserPlus className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{roleStats.office_staff}</div>
//             <p className="text-xs text-muted-foreground">Data entry level</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Users Table */}
//       <Card className="border-border/50 shadow-card">
//         <CardHeader>
//           <CardTitle>Team Members</CardTitle>
//           <CardDescription>
//             Manage all team members and their access permissions
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {profiles.length > 0 ? (
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Name</TableHead>
//                   <TableHead>Email</TableHead>
//                   <TableHead>Role</TableHead>
//                   <TableHead>Created</TableHead>
//                   <TableHead>Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {profiles.map((user) => (
//                   <TableRow key={user.id}>
//                     <TableCell>
//                       <div className="font-medium">
//                         {user.first_name && user.last_name
//                           ? `${user.first_name} ${user.last_name}`
//                           : 'No name set'
//                         }
//                       </div>
//                     </TableCell>
//                     <TableCell>{user.email}</TableCell>
//                     <TableCell>
//                       <Badge variant={getRoleBadgeVariant(user.role)}>
//                         {getRoleLabel(user.role)}
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-muted-foreground">
//                       {new Date(user.created_at).toLocaleDateString('en-IN')}
//                     </TableCell>
//                     <TableCell>
//                       <Select
//                         value={user.role}
//                         onValueChange={(newRole: any) => updateUserRoleLocal(user.user_id, newRole)}
//                         disabled={user.user_id === profile?.user_id} // Can't change own role
//                       >
//                         <SelectTrigger className="w-40">
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="office_staff">Office Staff</SelectItem>
//                           <SelectItem value="manager">Manager</SelectItem>
//                           <SelectItem value="super_admin">Super Admin</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           ) : (
//             <div className="text-center py-12">
//               <UsersIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
//               <h3 className="text-lg font-medium mb-2">No users found</h3>
//               <p className="text-muted-foreground mb-4">
//                 Add team members to get started with collaboration.
//               </p>
//               <Button onClick={() => setIsCreateDialogOpen(true)}>
//                 <Plus className="h-4 w-4 mr-2" />
//                 Add First User
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, UserPlus, Users as UsersIcon, Shield, Settings } from 'lucide-react';
import { createProfile, listProfiles, updateUserRole } from '@/lib/profileRepo';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'super_admin' | 'manager' | 'office_staff';
  created_at: string;
}

export default function Users() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'office_staff' as 'super_admin' | 'manager' | 'office_staff'
  });

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await listProfiles();
      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user profiles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      const { error } = await createProfile({
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: formData.role,
        user_id: crypto.randomUUID()
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User created successfully"
      });

      setIsCreateDialogOpen(false);
      setFormData({
        email: '',
        first_name: '',
        last_name: '',
        role: 'office_staff'
      });
      fetchProfiles();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive"
      });
    }
  };

  const updateUserRoleLocal = async (userId: string, newRole: 'super_admin' | 'manager' | 'office_staff') => {
    try {
      const { error } = await updateUserRole(userId, newRole);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully"
      });

      fetchProfiles();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'default';
      case 'manager':
        return 'secondary';
      case 'office_staff':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'manager':
        return 'Manager';
      case 'office_staff':
        return 'Office Staff';
      default:
        return role;
    }
  };

  const getRoleStats = () => {
    const stats = {
      super_admin: profiles.filter(p => p.role === 'super_admin').length,
      manager: profiles.filter(p => p.role === 'manager').length,
      office_staff: profiles.filter(p => p.role === 'office_staff').length
    };
    return stats;
  };

  if (loading) {
    return (
      <div className="space-y-6 ">
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

  const roleStats = getRoleStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage team members and their access levels
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg">Create New User</DialogTitle>
              <DialogDescription className="text-sm">
                Add a new team member and assign their role.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="user@company.com"
                  className="text-sm"
                />
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm">Role</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData(prev => ({ ...prev, role: value }))} >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="office_staff">Office Staff</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Office Staff can create entries, Managers can approve, Super Admins have full access
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button onClick={handleCreateUser} className="flex-1 text-sm">
                  Create User
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="text-sm">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Role Statistics */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{profiles.length}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Active team members</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{roleStats.super_admin}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Full access level</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Managers</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{roleStats.manager}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Approval authority</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Office Staff</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{roleStats.office_staff}</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Data entry level</p>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card className="border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Team Members</CardTitle>
          <CardDescription className="text-sm">
            Manage all team members and their access permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profiles.length > 0 ? (
            <div className="space-y-4">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="font-medium">
                            {user.first_name && user.last_name
                              ? `${user.first_name} ${user.last_name}`
                              : 'No name set'
                            }
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {getRoleLabel(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.role}
                            onValueChange={(newRole: any) => updateUserRoleLocal(user.user_id, newRole)}
                            disabled={user.user_id === profile?.user_id}
                          >
                            <SelectTrigger className="w-40 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="office_staff">Office Staff</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="super_admin">Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {profiles.map((user) => (
                  <Card key={user.id} className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-sm">
                          {user.first_name && user.last_name
                            ? `${user.first_name} ${user.last_name}`
                            : 'No name set'
                          }
                        </span>
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Created:</strong> {new Date(user.created_at).toLocaleDateString('en-IN')}</p>
                      </div>
                      <Select
                        value={user.role}
                        onValueChange={(newRole: any) => updateUserRoleLocal(user.user_id, newRole)}
                        disabled={user.user_id === profile?.user_id}
                      >
                        <SelectTrigger className="w-full text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="office_staff">Office Staff</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <UsersIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No users found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add team members to get started with collaboration.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="text-sm">
                <Plus className="h-4 w-4 mr-2" />
                Add First User
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}