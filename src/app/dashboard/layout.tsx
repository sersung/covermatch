// Dashboard layout — Navbar/Footer are in root layout.
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-gray-50 flex-1 min-h-[calc(100vh-8rem)]">{children}</div>
}
