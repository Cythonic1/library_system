import { useState } from "react";
import { Link } from "react-router-dom"; // or your preferred routing library
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

import { Bell} from "lucide-react";

export function UserNav() {
  // Mock authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/auth/sign-in">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:bg-primary/10 hover:text-primary"
          >
            Sign In
          </Button>
        </Link>
        <Link to="/auth/sign-up">
          <Button
            size="sm"
          >
            Sign Up
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link to="/dashboard/user/notifications">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {notificationCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white"
            >
              {notificationCount}
            </motion.span>
          )}
        </Button>
      </Link>
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8 border-2 border-primary">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback className="bg-primary/10 text-primary">
                JD
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">John Doe</p>
              <p className="text-xs leading-none text-muted-foreground">
                john.doe@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/user" className="cursor-pointer w-full">
                <User className="mr-2 h-4 w-4 text-primary" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/user/borrowed" className="cursor-pointer w-full">
                <BookOpen className="mr-2 h-4 w-4 text-primary" />
                <span>Borrowed Books</span>
                <Badge className="ml-auto bg-primary text-white">3</Badge>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/user/history" className="cursor-pointer w-full">
                <History className="mr-2 h-4 w-4 text-primary" />
                <span>History</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/user/payments" className="cursor-pointer w-full">
                <CreditCard className="mr-2 h-4 w-4 text-primary" />
                <span>Payments</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer w-full">
                <Settings className="mr-2 h-4 w-4 text-primary" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsAuthenticated(false)}
            className="cursor-pointer text-destructive focus:text-destructive w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  );
}