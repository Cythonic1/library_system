import * as React from "react";
import { Link } from "react-router-dom"; // or your preferred routing library
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface Route {
  href: string;
  label: string;
  active: boolean;
}

export const MobileNav: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const pathname = window.location.pathname; // Replace with useLocation().pathname if using react-router

  const routes: Route[] = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/books",
      label: "Books",
      active: pathname === "/books",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      active: pathname === "/dashboard",
    },
    {
      href: "/about",
      label: "About",
      active: pathname === "/about",
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link 
            to="/" 
            className="flex items-center" 
            onClick={() => setOpen(false)}
          >
            <span className="font-bold">Library Management System</span>
          </Link>
        </div>
        <div className="mt-8 flex flex-col space-y-3">
          {routes.map((route) => (
            <Link
              key={route.href}
              to={route.href}
              onClick={() => setOpen(false)}
              className={cn(
                "px-7 py-2 text-base font-medium transition-colors hover:text-foreground/80",
                route.active ? "text-foreground" : "text-foreground/60",
              )}
            >
              {route.label}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};