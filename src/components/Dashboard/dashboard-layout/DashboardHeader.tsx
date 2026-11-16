import { Button } from "@/components/shared/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shared/ui/popover";
import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { LogOut, Bell, User, Menu } from "lucide-react";
import { Badge } from "@/components/shared/ui/badge";

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="bg-amber-100 border-b border-brown-200 px-3 sm:px-6 py-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Hamburger Menu for Mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden shrink-0 h-9 w-9 text-brown-700 hover:bg-yellow-50"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <p className="text-brown-600 text-sm truncate">
            <span className="hidden sm:inline">Welcome back, </span>
            {user?.userName}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 text-brown-700 hover:bg-yellow-50"
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
              3
            </Badge>
          </Button>

          {/* Avatar with Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" alt={user?.userName} />
                  <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-brown-900 font-semibold">
                    {getInitials(user?.userName || "User")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-38 p-2" align="end">
              <div className="flex flex-col">
                <div className="h-px bg-brown-200" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/dashboard/profile")}
                  className="justify-start gap-2 font-normal text-brown-700 hover:bg-yellow-50"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
                <div className="h-px bg-brown-200" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="justify-start gap-2 font-normal text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
