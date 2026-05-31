// Segments layout — Navbar/Footer are in root layout.
// Adds bg-gray-50 background for all segment pages.
export default function SegmentsLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-gray-50 flex-1">{children}</div>
}
