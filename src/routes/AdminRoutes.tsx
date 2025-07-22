import AdminDashboard from "@/pages/admin/pages/AdminDashboard";
import AdminLayout from "@/pages/admin/pages/AdminLayout";
import AdminLogin from "@/pages/admin/pages/AdminLogin";
import AdminServices from "@/pages/admin/pages/AdminServices";
import AdminTournaments from "@/pages/admin/pages/AdminTournaments";
import { Route } from "react-router-dom";

const adminRoutes = (
  <>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<AdminDashboard />} />
      <Route path="services" element={<AdminServices />} />
      <Route path="tournaments" element={<AdminTournaments />} />
    </Route>

    
    <Route path="/admin/login" element={<AdminLogin />} />
  </>
);

export default adminRoutes;
