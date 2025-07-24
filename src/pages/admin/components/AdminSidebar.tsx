import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

// Type for icon components from Lucide
type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

// Safely get Lucide icon or fallback
function getLucideIcon(iconName: string): IconType {
  return (
    (LucideIcons as unknown as Record<string, IconType>)[iconName] ||
    LucideIcons.Circle
  );
}

interface MenuItem {
  id: string;
  title: string;
  icon: IconType;
  href: string;
}

export function AdminSidebar() {
  const [dynamicItems, setDynamicItems] = useState<MenuItem[]>([]);
  const location = useLocation();

  const staticNavigationItems: MenuItem[] = [
    {
      id: "static-dashboard",
      title: "Dashboard",
      icon: LucideIcons.BarChart3,
      href: "/admin",
    },
  ];

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const res = await fetch("http://localhost:4000/api/menuitems");
        const data = await res.json();

        const mapped: MenuItem[] = data.menuItems.map(
          (item: { _id: string; name: string; icon: string }) => ({
            id: item._id,
            title: item.name,
            icon: getLucideIcon(item.icon),
            href: `/admin/${item.name.toLowerCase().replace(/\s+/g, "-")}`,
          })
        );

        setDynamicItems(mapped);
      } catch (err) {
        console.error("Failed to fetch dynamic menu items:", err);
      }
    }

    fetchMenuItems();
  }, []);

  const navigationItems = [...staticNavigationItems, ...dynamicItems];

  return (
    <aside className="w-64 bg-card border-r border-border">
      <div className="p-6">
        {/* Sidebar Header */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <LucideIcons.Trophy className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">
            Cricket Club
          </span>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.id}
                to={item.href}
                state={{ menuItemId: item.id }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
