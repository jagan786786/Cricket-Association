import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Target, Phone, Info, CreditCard, Camera } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Helper to get icon component from string
function getLucideIcon(name: string) {
  return LucideIcons[name] || LucideIcons.Circle;
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dynamicItems, setDynamicItems] = useState<
    { id?: string; name: string; path: string; icon: React.ElementType }[]
  >([]);

  const staticNavItemsStart = [
    { id: "home", name: "Home", path: "/", icon: Target }
  ];

  const staticNavItemsEnd = [
    { id: "about", name: "About", path: "/about", icon: Info },
    { id: "contact", name: "Contact", path: "/contact", icon: Phone },
    { id: "gallery", name: "Gallery", path: "/gallery", icon: Camera },
  ];

  useEffect(() => {
    async function fetchMenuItems() {
      try {
        const res = await fetch("http://localhost:4000/api/menuitems");
        const data = await res.json();

        const mapped = data.menuItems.map(
          (item: { _id: string; name: string; icon: string }) => ({
            id: item._id,
            name: item.name,
            path: `/${item.name.toLowerCase().replace(/\s+/g, "-")}`,
            icon: getLucideIcon(item.icon),
          })
        );

        console.log("Fetched menu items:", mapped);

        setDynamicItems(mapped);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    }

    fetchMenuItems();
  }, []);

  const navItems = [
    ...staticNavItemsStart,
    ...dynamicItems,
    ...staticNavItemsEnd,
  ];

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2 group">
            <div className="cricket-ball-3d w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-accent-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-primary">
                Cricket Association
              </h1>
              <p className="text-sm text-muted-foreground">
                Excellence in Cricket
              </p>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                state={{ menuItemId: item.id }}
                onClick={() => {
                  console.log("Clicked menu item:", {
                    id: item.id,
                    name: item.name,
                    path: item.path,
                  });
                  setIsOpen(false);
                }}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-foreground hover:bg-muted hover:text-primary"
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="btn-hero">Join Now</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in-up">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
            <div className="pt-4 border-t border-border">
              <Button className="btn-hero w-full">Join Now</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
