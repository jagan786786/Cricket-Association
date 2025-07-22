import { AdminHeader } from "../../admin/components/AdminHeader";
import { DashboardStats } from "../../admin/components/DashboardStats";
import { RecentActivity } from "../../admin/components/RecentActivity";
import { QuickActions } from "../../admin/components/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminHeader />
      
      <main className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Admin!</h1>
            <p className="text-muted-foreground">Here's what's happening at your cricket club today.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <QuickActions />
            
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { time: "6:00 AM", event: "Morning Fitness Training", location: "Gym", type: "fitness" },
                  { time: "8:00 AM", event: "U-16 Coaching Session", location: "Net 1-2", type: "coaching" },
                  { time: "10:00 AM", event: "Women's Team Practice", location: "Main Ground", type: "practice" },
                  { time: "4:00 PM", event: "League Match vs City Stars", location: "Main Ground", type: "match" },
                  { time: "6:00 PM", event: "Evening Nets Booking", location: "Net 3-4", type: "booking" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="text-sm font-medium text-primary w-16">{item.time}</div>
                    <div className="flex-1">
                      <p className="font-medium">{item.event}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      item.type === 'match' ? 'bg-accent/10 text-accent' :
                      item.type === 'coaching' ? 'bg-primary/10 text-primary' :
                      item.type === 'fitness' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {item.type}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <RecentActivity />
            
            {/* Facility Status */}
            <Card>
              <CardHeader>
                <CardTitle>Facility Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Main Ground", status: "Occupied", color: "bg-accent" },
                  { name: "Net 1", status: "Available", color: "bg-green-500" },
                  { name: "Net 2", status: "Available", color: "bg-green-500" },
                  { name: "Net 3", status: "Booked", color: "bg-yellow-500" },
                  { name: "Net 4", status: "Maintenance", color: "bg-gray-500" },
                ].map((facility, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{facility.name}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${facility.color}`}></div>
                      <span className="text-xs text-muted-foreground">{facility.status}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}