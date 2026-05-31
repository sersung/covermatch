import Link from "next/link"
import { Shield } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 font-bold text-blue-700 mb-2">
            <Shield className="w-5 h-5" />
            CoverMatch
          </Link>
          <p className="text-sm text-gray-500">
            Data-driven insurance comparisons for every life situation.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3">Pet Insurance</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link href="/pet-insurance/french-bulldog" className="hover:text-blue-600">French Bulldog</Link></li>
            <li><Link href="/pet-insurance/golden-retriever" className="hover:text-blue-600">Golden Retriever</Link></li>
            <li><Link href="/pet-insurance/german-shepherd" className="hover:text-blue-600">German Shepherd</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3">Other Segments</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link href="/final-expense" className="hover:text-blue-600">Final Expense</Link></li>
            <li><Link href="/travel-insurance" className="hover:text-blue-600">Travel Insurance</Link></li>
            <li><Link href="/life-insurance" className="hover:text-blue-600">Life Insurance</Link></li>
            <li><Link href="/landlord-insurance" className="hover:text-blue-600">Landlord Insurance</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link href="/about" className="hover:text-blue-600">About</Link></li>
            <li><Link href="/dashboard" className="hover:text-blue-600">My Quotes</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t text-center text-xs text-gray-400 py-4">
        © {new Date().getFullYear()} CoverMatch. For informational purposes only. Not financial advice.
      </div>
    </footer>
  )
}
