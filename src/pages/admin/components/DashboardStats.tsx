import { Users, Calendar, Trophy, DollarSign, TrendingUp, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  {
    title: "Total Members",
    value: "347",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    title: "Active Bookings",
    value: "28",
    change: "+5%",
    trend: "up",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    title: "Tournaments",
    value: "8",
    change: "+2",
    trend: "up",
    icon: Trophy,
    color: "text-accent",
    bgColor: "bg-accent/10"
  },
  {
    title: "Monthly Revenue",
    value: "₹1,25,000",
    change: "+18%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  {
    title: "Coaching Sessions",
    value: "142",
    change: "+8%",
    trend: "up",
    icon: Target,
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  {
    title: "Match Wins",
    value: "75%",
    change: "+5%",
    trend: "up",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  },
];

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-card transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
                <span className="text-green-500">{stat.change}</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}