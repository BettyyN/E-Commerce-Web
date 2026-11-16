import { DashboardLayout } from "@/components/Dashboard/dashboard-layout/DashboardLayout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shared/ui/tabs";
import { CategoriesManagement } from "@/components/Dashboard/settings/CategoriesManagement";
import { MeasTypesManagement } from "@/components/Dashboard/settings/MeasTypesManagement";
import { PackagingTypesManagement } from "@/components/Dashboard/settings/PackagingTypesManagement";
import { BankManagement } from "@/components/Dashboard/settings/BankManagement";
import { Tag, Ruler, Archive, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const triggerClass = cn(
  "h-9 rounded-md px-4 text-sm font-medium text-slate-700 transition-all",
  "hover:text-slate-900",
  "data-[state=active]:bg-yellow-500 data-[state=active]:text-brown-900 data-[state=active]:shadow-none",
);

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-brown-900">Settings</h1>
          <p className="text-brown-600">
            Manage categories, measurement types, packaging, and banks
          </p>
        </div>

        <Tabs defaultValue="categories" className="space-y-4">
          <TabsList className="h-11 w-fit rounded-lg border border-slate-200 bg-slate-50 p-0 gap-1 shadow-sm">
            <TabsTrigger value="categories" className={triggerClass}>
              <Tag className="mr-2 h-4 w-4" /> Categories
            </TabsTrigger>
            <TabsTrigger value="meastypes" className={triggerClass}>
              <Ruler className="mr-2 h-4 w-4" /> Meas. Types
            </TabsTrigger>
            <TabsTrigger value="packaging" className={triggerClass}>
              <Archive className="mr-2 h-4 w-4" /> Packaging
            </TabsTrigger>
            <TabsTrigger value="banks" className={triggerClass}>
              <Building2 className="mr-2 h-4 w-4" /> Banks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <CategoriesManagement />
          </TabsContent>
          <TabsContent value="meastypes">
            <MeasTypesManagement />
          </TabsContent>
          <TabsContent value="packaging">
            <PackagingTypesManagement />
          </TabsContent>
          <TabsContent value="banks">
            <BankManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
