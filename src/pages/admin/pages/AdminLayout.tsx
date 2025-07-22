import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../../admin/components/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AdminSidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}