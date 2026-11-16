import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/ui/avatar";
import { Badge } from "@/components/shared/ui/badge";

interface ProfileHeaderProps {
  displayName: string;
  isActive?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function ProfileHeader({ displayName }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
        <AvatarImage src="" />
        <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-yellow-400 to-yellow-600 text-brown-900">
          {getInitials(displayName)}
        </AvatarFallback>
      </Avatar>
      <h1 className="text-2xl font-bold text-brown-900 mt-4">{displayName}</h1>
      <Badge className="mt-2 bg-green-100 text-green-800">
        Verified Customer
      </Badge>
    </div>
  );
}
