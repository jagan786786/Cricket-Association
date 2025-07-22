import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import AdminServices from "./pages/AdminServices";
import AdminTournaments from "./pages/AdminTournaments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Index />} /> */}
          <Route path="/" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="services" element={<AdminServices/>} />
            <Route path="tournaments" element={<AdminTournaments/>} />
            {/* <Route path="members" element={<div className="p-6"><h1 className="text-2xl font-bold">Members Management</h1><p className="text-muted-foreground">Manage club members, registrations, and profiles.</p></div>} />
            <Route path="coaching" element={<div className="p-6"><h1 className="text-2xl font-bold">Coaching Management</h1><p className="text-muted-foreground">Manage coaches, sessions, and training programs.</p></div>} />
            <Route path="facilities" element={<div className="p-6"><h1 className="text-2xl font-bold">Facilities Management</h1><p className="text-muted-foreground">Manage grounds, nets, and equipment.</p></div>} />
            <Route path="bookings" element={<div className="p-6"><h1 className="text-2xl font-bold">Bookings Management</h1><p className="text-muted-foreground">Manage facility bookings and schedules.</p></div>} />
            <Route path="tournaments" element={<div className="p-6"><h1 className="text-2xl font-bold">Tournament Management</h1><p className="text-muted-foreground">Organize and manage tournaments and leagues.</p></div>} />
            <Route path="fitness" element={<div className="p-6"><h1 className="text-2xl font-bold">Fitness Programs</h1><p className="text-muted-foreground">Manage fitness training and conditioning programs.</p></div>} />
            <Route path="events" element={<div className="p-6"><h1 className="text-2xl font-bold">Events & Camps</h1><p className="text-muted-foreground">Manage camps, clinics, and special events.</p></div>} />
            <Route path="womens" element={<div className="p-6"><h1 className="text-2xl font-bold">Women's Programs</h1><p className="text-muted-foreground">Manage women's and girls' cricket programs.</p></div>} />
            <Route path="financials" element={<div className="p-6"><h1 className="text-2xl font-bold">Financial Management</h1><p className="text-muted-foreground">Track revenue, expenses, and membership fees.</p></div>} />
            <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Club Settings</h1><p className="text-muted-foreground">Configure club settings and preferences.</p></div>} /> */}
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
