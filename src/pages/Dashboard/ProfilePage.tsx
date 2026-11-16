import { DashboardLayout } from "@/components/Dashboard/dashboard-layout/DashboardLayout";
import { Card } from "@/components/shared/ui/card";
import { Button } from "@/components/shared/ui/button";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/ui/avatar";
import { Badge } from "@/components/shared/ui/badge";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/shared/ui/modal";
import { useAuthStore } from "@/store/auth.store";
import {
  Camera,
  MapPin,
  Edit,
  CheckSquare,
  FolderOpen,
  Star,
  TrendingUp,
  Mail,
  Briefcase,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.userName || "",
    // JWT only carries the username claim (which holds the email in this app)
    email: user?.userName || "",
    role: user?.role || "",
    location: "Addis Ababa, Ethiopia",
    bio: "Experienced professional with a passion for excellence.",
  });

  const [draft, setDraft] = useState({ ...formData });

  const openEdit = () => {
    setDraft({ ...formData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setFormData({ ...draft });
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* PROFILE HEADER */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
              <AvatarImage src="" />
              <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-yellow-400 to-yellow-600 text-brown-900">
                {getInitials(formData.name)}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-white border-2 border-brown-200 text-brown-700 hover:bg-yellow-50"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          <h1 className="text-2xl font-bold text-brown-900 mt-4">
            {formData.name}
          </h1>
          <Badge className="mt-2 bg-yellow-100 text-yellow-800">
            {formData.role}
          </Badge>
          <div className="flex items-center gap-2 text-brown-600 mt-2">
            <MapPin className="h-4 w-4" />
            {formData.location}
          </div>
        </div>

        {/* STATS */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-brown-900">
            Activity Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="p-4 hover:shadow-sm transition">
              <div className="flex items-center justify-between">
                <span className="text-sm text-brown-600">Tasks</span>
                <CheckSquare className="h-4 w-4 text-brown-600" />
              </div>
              <div className="text-2xl font-bold text-brown-900 mt-1">127</div>
            </Card>
            <Card className="p-4 hover:shadow-sm transition">
              <div className="flex items-center justify-between">
                <span className="text-sm text-brown-600">Projects</span>
                <FolderOpen className="h-4 w-4 text-brown-600" />
              </div>
              <div className="text-2xl font-bold text-brown-900 mt-1">23</div>
            </Card>
            <Card className="p-4 hover:shadow-sm transition">
              <div className="flex items-center justify-between">
                <span className="text-sm text-brown-600">Success</span>
                <TrendingUp className="h-4 w-4 text-brown-600" />
              </div>
              <div className="text-2xl font-bold text-brown-900 mt-1">89%</div>
            </Card>
            <Card className="p-4 hover:shadow-sm transition">
              <div className="flex items-center justify-between">
                <span className="text-sm text-brown-600">Rating</span>
                <Star className="h-4 w-4 text-brown-600" />
              </div>
              <div className="text-2xl font-bold text-brown-900 mt-1">4.8</div>
            </Card>
          </div>
        </div>

        {/* PERSONAL INFORMATION (read-only) */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-brown-900">
              Personal Information
            </h3>
            <Button
              onClick={openEdit}
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <div className="divide-y divide-slate-100">
            <div className="flex items-center gap-4 pb-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-50">
                <Mail className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm font-medium text-slate-900">
                  {formData.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-50">
                <Briefcase className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Role</p>
                <p className="text-sm font-medium text-slate-900">
                  {formData.role}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-50">
                <MapPin className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Location</p>
                <p className="text-sm font-medium text-slate-900">
                  {formData.location}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow-50">
                <FileText className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Bio</p>
                <p className="text-sm font-medium text-slate-900">
                  {formData.bio}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* EDIT MODAL */}
      <Modal open={isEditing} onOpenChange={setIsEditing}>
        <ModalHeader>
          <ModalTitle>Edit Profile</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={draft.location}
                onChange={(e) =>
                  setDraft({ ...draft, location: e.target.value })
                }
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                value={draft.bio}
                rows={3}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-brown-900"
          >
            Save Changes
          </Button>
        </ModalFooter>
      </Modal>
    </DashboardLayout>
  );
}
