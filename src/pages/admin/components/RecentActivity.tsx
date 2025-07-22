import { Calendar, Clock, User, Trophy, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const activities = [
  {
    id: 1,
    type: "booking",
    title: "Net Practice Booked",
    description: "Rajesh Kumar booked Net 1 for tomorrow 6-8 PM",
    time: "5 minutes ago",
    icon: Calendar,
    avatar: "RK",
    color: "text-blue-600"
  },
  {
    id: 2,
    type: "member",
    title: "New Member Joined",
    description: "Priya Sharma joined U-16 Girls Training",
    time: "15 minutes ago",
    icon: User,
    avatar: "PS",
    color: "text-green-600"
  },
  {
    id: 3,
    type: "tournament",
    title: "Tournament Result",
    description: "Cricket Club won vs City Challengers by 45 runs",
    time: "2 hours ago",
    icon: Trophy,
    avatar: "CC",
    color: "text-accent"
  },
  {
    id: 4,
    type: "facility",
    title: "Facility Maintenance",
    description: "Pitch 2 maintenance completed successfully",
    time: "4 hours ago",
    icon: MapPin,
    avatar: "M",
    color: "text-orange-600"
  },
  {
    id: 5,
    type: "coaching",
    title: "Coaching Session",
    description: "Advanced batting session with Coach Suresh",
    time: "6 hours ago",
    icon: Clock,
    avatar: "CS",
    color: "text-purple-600"
  },
];

export function RecentActivity() {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`/avatar-${activity.avatar.toLowerCase()}.jpg`} />
                <AvatarFallback className="text-xs bg-gradient-primary text-primary-foreground">
                  {activity.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-4 h-4 ${activity.color}`} />
                  <p className="text-sm font-medium">{activity.title}</p>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}