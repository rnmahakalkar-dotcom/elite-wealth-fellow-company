import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/DashboardLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Plans from "./pages/Plans";
import Users from "./pages/Users";
import Investors from "./pages/Investors";
import Agents from "./pages/Agents";
import Investments from "./pages/Investments";
import Payments from "./pages/Payments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route element={<ProtectedRoute requireAuth={false}/>}>
               <Route path="/auth" element={<Auth />} />
            </Route>
           <Route element={<ProtectedRoute requireAuth={true}/>}>
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/plans" element={
              <ProtectedRoute requiredRole="manager">
                <DashboardLayout>
                  <Plans />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute requiredRole="super_admin">
                <DashboardLayout>
                  <Users />
                </DashboardLayout>
              </ProtectedRoute>
            } />
          <Route path="/investors" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Investors />
              </DashboardLayout>
            </ProtectedRoute>
          } />
            <Route path="/agents" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Agents />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/investments" element={
              <ProtectedRoute requiredRole="manager">
                <DashboardLayout>
                  <Investments />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/payments" element={
              <ProtectedRoute requiredRole="manager">
                <DashboardLayout>
                  <Payments />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
           
            </Route>
             <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
