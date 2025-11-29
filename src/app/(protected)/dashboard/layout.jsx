import { Toaster } from "sonner";
import { DashboardHeader } from "@/components/dashboard-header.jsx";
import { DashboardFooter } from "@/components/dashboard-footer.jsx";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardHeader />
      <main className="flex-1">
        {children}
      </main>
      <DashboardFooter />
      <Toaster position="top-right" closeButton />
    </div>
  );
}
