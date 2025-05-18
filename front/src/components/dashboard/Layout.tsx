import React, { useEffect, useState } from "react";
import { Book, Home, Menu, User, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, data, isLoading } = useAuth();

  const [open, setOpen] = useState(false);

  const pathname = location.pathname;
  const role = (data as any)?.role;
  const isAllowed = role === "librarian" || role === "admin";

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !isAllowed) {
        navigate("/sign-in", { replace: true });
      }
    }
  }, [isAuthenticated, isAllowed, isLoading, navigate]);

  const routes = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/books",
      label: "Books",
      icon: Book,
      active: pathname === "/dashboard/books",
    },
    {
      href: "/dashboard/users",
      label: "Users",
      icon: Users,
      active: pathname === "/dashboard/users",
      hidden: role == "librarian", 
    },
  ];

  if (isLoading) return <>Loading...</>;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <div className="flex h-full flex-col">
              <div className="flex items-center border-b py-4">
                <Book className="mr-2 h-6 w-6" />
                <h2 className="text-lg font-semibold">Digital Library</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <nav className="flex-1 overflow-auto py-4">
                <div className="grid gap-1 px-2">
                  {routes.map((route) =>
                    route.hidden ? null : (
                      <a
                        key={route.href}
                        href={route.href}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(route.href);
                          setOpen(false);
                        }}
                      >
                        <span
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                            route.active
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          <route.icon className="h-5 w-5" />
                          {route.label}
                        </span>
                      </a>
                    )
                  )}
                </div>
              </nav>
              <div className="border-t py-4">
                <div className="flex items-center gap-3 px-5">
                  <User className="h-8 w-8 rounded-full bg-muted p-1" />
                  <div className="text-sm">
                    <div className="font-medium">{(data as any)?.username || "Admin User"}</div>
                    <div className="text-muted-foreground">{(data as any)?.email || "admin@example.com"}</div>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          <Book className="h-6 w-6" />
          <h1 className="text-lg font-semibold">Digital Library</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex">
            <User className="h-8 w-8 rounded-full bg-muted p-1" />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-64 shrink-0 border-r bg-muted/40 md:block">
          <div className="flex h-full flex-col">
            <div className="flex-1 overflow-auto py-4">
              <div className="grid gap-1 px-2">
                {routes.map((route) =>
                  route.hidden ? null : (
                    <a key={route.href} href={route.href} onClick={(e) => {
                      e.preventDefault();
                      navigate(route.href);
                    }}>
                      <span
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                          route.active
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        <route.icon className="h-5 w-5" />
                        {route.label}
                      </span>
                    </a>
                  )
                )}
              </div>
            </div>
            <div className="border-t py-4">
              <div className="flex items-center gap-3 px-5">
                <User className="h-8 w-8 rounded-full bg-muted p-1" />
                <div className="text-sm">
                  <div className="font-medium">{(data as any)?.username || "Admin User"}</div>
                  <div className="text-muted-foreground">{(data as any)?.email || "admin@example.com"}</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
