// import RoleGuard from "@/components/guards/RoleGuard";

export default function AdminLayout({ children }) {
  return (
    // <RoleGuard allowedRoles={["admin"]}>
    // </RoleGuard>
      <div className="p-4">
        <h1>Admin Area</h1>
        {children}
      </div>
  );
}
