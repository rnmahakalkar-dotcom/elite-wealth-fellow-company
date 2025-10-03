// import { ReactNode } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// import { Badge } from '@/components/ui/badge';
// import { LogOut, User, Settings, Shield, TrendingUp, Users, FileText, BarChart3, UserCheck, Building, Calendar,CreditCard,CalendarCheck,Gift } from 'lucide-react';
// import { Link, useLocation } from 'react-router-dom';
// import { cn } from '@/lib/utils';

// interface DashboardLayoutProps {
//   children: ReactNode;
// }

// interface NavItem {
//   title: string;
//   href: string;
//   icon: any;
//   roles: Array<'super_admin' | 'manager' | 'office_staff'>;
// }

// const navigation: NavItem[] = [
//   {
//     title: 'Dashboard',
//     href: '/',
//     icon: BarChart3,
//     roles: ['super_admin', 'manager', 'office_staff']
//   },
//   {
//     title: 'Plans',
//     href: '/plans',
//     icon: TrendingUp,
//     roles: ['super_admin', 'manager']
//   },
//   {
//     title: 'Investors',
//     href: '/investors',
//     icon: Users,
//     roles: ['super_admin', 'manager', 'office_staff']
//   },
//   {
//     title: 'Agents',
//     href: '/agents',
//     icon: UserCheck,
//     roles: ['super_admin', 'manager', 'office_staff']
//   },
//   {
//     title: 'Investments',
//     href: '/investments',
//     icon: Building,
//     roles: ['super_admin', 'manager', 'office_staff']
//   },
//   {
//     title: 'Investor Payments',
//     href: '/payments',
//     icon: Calendar,
//     roles: ['super_admin', 'manager']
//   },
//   {
//     title: 'Investment Payments',
//     href: '/payments',
//     icon: CalendarCheck,
//     roles: ['super_admin', 'manager']
//   },
//   {
//     title: 'Gifts Schemes',
//     href: '/payments',
//     icon: Gift,
//     roles: ['super_admin']
//   },
//   {
//     title: 'User Management',
//     href: '/users',
//     icon: Settings,
//     roles: ['super_admin']
//   }
// ];

// export function DashboardLayout({ children }: DashboardLayoutProps) {
//   const { profile, signOut } = useAuth();
//   const location = useLocation();

//   const handleSignOut = async () => {
//     await signOut();
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

//   const getInitials = (firstName?: string | null, lastName?: string | null) => {
//     const first = firstName?.charAt(0) || '';
//     const last = lastName?.charAt(0) || '';
//     return (first + last).toUpperCase() || profile?.email?.charAt(0).toUpperCase() || 'U';
//   };

//   const filteredNavigation = navigation.filter(item => 
//     item.roles.includes(profile?.role as any)
//   );

//   return (
//     <div className="min-h-screen bg-background flex">
//       {/* Sidebar */}
//       <div className="w-64 bg-sidebar border-r border-sidebar-border">
//         <div className="flex flex-col h-full">
//           {/* Logo */}
//           <div className="p-6 border-b border-sidebar-border">
//             <div className="flex items-center gap-3">
//               <div className="bg-sidebar-primary rounded-lg p-2">
//                 <Shield className="h-6 w-6 text-sidebar-primary-foreground" />
//               </div>
//               <div>
//                 <h1 className="text-lg font-bold text-sidebar-foreground">Elite Wealth</h1>
//                 <p className="text-xs text-sidebar-foreground/70">Management Suite</p>
//               </div>
//             </div>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 p-4">
//             <div className="space-y-2">
//               {filteredNavigation.map((item) => {
//                 const isActive = location.pathname === item.href;
//                 return (
//                   <Link
//                     key={item.href}
//                     to={item.href}
//                     className={cn(
//                       "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
//                       isActive
//                         ? "bg-sidebar-accent text-sidebar-accent-foreground"
//                         : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
//                     )}
//                   >
//                     <item.icon className="h-4 w-4" />
//                     {item.title}
//                   </Link>
//                 );
//               })}
//             </div>
//           </nav>

//           {/* User Menu */}
//           <div className="p-4 border-t border-sidebar-border">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="w-full justify-start gap-3 h-auto p-3">
//                   <Avatar className="h-8 w-8">
//                     <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm">
//                       {getInitials(profile?.first_name, profile?.last_name)}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1 text-left">
//                     <div className="text-sm font-medium text-sidebar-foreground">
//                       {profile?.first_name && profile?.last_name
//                         ? `${profile.first_name} ${profile.last_name}`
//                         : profile?.email
//                       }
//                     </div>
//                     <Badge variant={getRoleBadgeVariant(profile?.role || '')} className="text-xs mt-1">
//                       {getRoleLabel(profile?.role || '')}
//                     </Badge>
//                   </div>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-56">
//                 <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem disabled>
//                   <User className="mr-2 h-4 w-4" />
//                   Profile Settings
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Sign Out
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col">
//         <main className="flex-1 p-6">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

import { ReactNode, useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  User,
  Settings,
  Shield,
  TrendingUp,
  Users,
  BarChart3,
  UserCheck,
  Building,
  CalendarCheck,
  Gift,
  Activity,
  Menu,
  Banknote,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  title: string;
  href: string;
  icon: any;
  roles: Array<"super_admin" | "manager" | "office_staff">;
}

const navigation: NavItem[] = [
  { title: "Dashboard", href: "/", icon: BarChart3, roles: ["super_admin", "manager", "office_staff"] },
  { title: "Plans", href: "/plans", icon: TrendingUp, roles: ["super_admin", "manager"] },
  { title: "Investors", href: "/investors", icon: Users, roles: ["super_admin", "manager", "office_staff"] },
  { title: "Agents", href: "/agents", icon: UserCheck, roles: ["super_admin", "manager", "office_staff"] },
  { title: "Investments", href: "/investments", icon: Building, roles: ["super_admin", "manager", "office_staff"] },
  { title: "Investor Payments", href: "/payments", icon: Activity, roles: ["super_admin", "manager"] },
  { title: "Investment Payments", href: "/investment-payments", icon: CalendarCheck, roles: ["super_admin", "manager"] },
  { title: "Agent Payments", href: "/agent-payments", icon: Banknote, roles: ["super_admin", "manager"] },
  { title: "Gifts Schemes", href: "/gifts", icon: Gift, roles: ["super_admin"] },
  { title: "User Management", href: "/users", icon: Settings, roles: ["super_admin"] },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    await signOut();
  };

  // Close sidebar on click outside (for mobile)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };
    if (sidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen]);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "super_admin":
        return "default";
      case "manager":
        return "secondary";
      case "office_staff":
        return "outline";
      default:
        return "outline";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Super Admin";
      case "manager":
        return "Manager";
      case "office_staff":
        return "Office Staff";
      default:
        return role;
    }
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || profile?.email?.charAt(0).toUpperCase() || "U";
  };

  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(profile?.role as any)
  );

  return (
    <div className="min-h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border z-40 transform transition-transform duration-200 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border flex items-center gap-3">
            <div className="bg-sidebar-primary rounded-lg p-2">
              <Shield className="h-6 w-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">Elite Wealth</h1>
              <p className="text-xs text-sidebar-foreground/70">Management Suite</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2 overflow-y-auto">
            <div className="space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                    onClick={() => setSidebarOpen(false)} // close sidebar on click
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User Menu (Compact) */}
          <div className="p-2 border-t border-sidebar-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2 h-18 p-2 text-sm">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                      {getInitials(profile?.first_name, profile?.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left truncate">
                    <div className="text-xs font-medium text-sidebar-foreground truncate">
                      {profile?.first_name && profile?.last_name
                        ? `${profile.first_name} ${profile.last_name}`
                        : profile?.email}
                    </div>
                    <Badge
                      variant={getRoleBadgeVariant(profile?.role || "")}
                      className="text-[0.55rem] mt-0.5"
                    >
                      {getRoleLabel(profile?.role || "")}
                    </Badge>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Top bar (mobile hamburger) */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b bg-background z-30">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          
          <h1 className="text-lg font-semibold truncate">Elite Wealth</h1>
        </div>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
