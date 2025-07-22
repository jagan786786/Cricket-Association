import { BarChart3, Calendar, Settings, Trophy, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    href: "/admin",
    active: true,
  },
  {
    title: "Services",
    icon: Settings,
    href: "/admin/services",
    active: false,
  },
  {
    title: "Tournaments",
    icon: Trophy,
    href: "/admin/tournaments",
    active: false,
  },
];

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-card border-r border-border">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">Cricket Club</span>
        </div>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  item.active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.title}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}