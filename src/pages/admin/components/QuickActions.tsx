import { Plus, UserPlus, Calendar, Trophy, MapPin, Dumbbell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const quickActions = [
  {
    title: "Add New Member",
    description: "Register a new club member",
    icon: UserPlus,
    color: "bg-gradient-primary",
    textColor: "text-primary-foreground"
  },
  {
    title: "Schedule Coaching",
    description: "Create a new coaching session",
    icon: Calendar,
    color: "bg-blue-100",
    textColor: "text-blue-700"
  },
  {
    title: "Book Facility",
    description: "Reserve nets or grounds",
    icon: MapPin,
    color: "bg-green-100",
    textColor: "text-green-700"
  },
  {
    title: "Create Tournament",
    description: "Organize a new tournament",
    icon: Trophy,
    color: "bg-accent/10",
    textColor: "text-accent"
  },
  {
    title: "Fitness Program",
    description: "Add fitness training session",
    icon: Dumbbell,
    color: "bg-purple-100",
    textColor: "text-purple-700"
  },
  {
    title: "Add Event",
    description: "Create camps or special events",
    icon: Plus,
    color: "bg-orange-100",
    textColor: "text-orange-700"
  }
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant="ghost"
                className="h-auto p-4 flex flex-col items-start gap-2 hover:shadow-card transition-all duration-200"
              >
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${action.textColor}`} />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}