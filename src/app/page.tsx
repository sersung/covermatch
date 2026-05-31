import Link from "next/link"
import { ArrowRight, Shield, Star, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const segments = [
  {
    slug: "pet-insurance",
    icon: "🐾",
    name: "Pet Insurance",
    description: "Compare plans by breed and pre-existing conditions",
    highlights: ["French Bulldog", "Golden Retriever", "Pre-Existing Conditions"],
  },
  {
    slug: "final-expense",
    icon: "🕊️",
    name: "Final Expense",
    description: "Burial insurance with no medical exam required",
    highlights: ["Seniors Over 80", "Guaranteed Acceptance", "No Medical Exam"],
  },
  {
    slug: "life-insurance",
    icon: "❤️",
    name: "Life Insurance",
    description: "Coverage for high-risk health conditions",
    highlights: ["Diabetics", "Smokers", "Heart Disease"],
  },
  {
    slug: "travel-insurance",
    icon: "✈️",
    name: "Travel Insurance",
    description: "Visa-compliant international travel coverage",
    highlights: ["Schengen Visa", "US B1/B2", "Cancel For Any Reason"],
  },
  {
    slug: "landlord-insurance",
    icon: "🏠",
    name: "Landlord Insurance",
    description: "Protection for rental and Airbnb properties",
    highlights: ["Short-Term Rental", "Multi-Family", "Vacation Home"],
  },
]

const stats = [
  { label: "Insurance Plans Compared", value: "200+", icon: Shield },
  { label: "Monthly Visitors", value: "50k+", icon: Users },
  { label: "Average Savings Found", value: "$420/yr", icon: TrendingUp },
  { label: "Average Rating", value: "4.8★", icon: Star },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge className="bg-white/20 text-white hover:bg-white/30 text-sm px-4 py-1">
            #1 Insurance Comparison Hub
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Find the Right Insurance<br />for Your Exact Situation
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Not a generic comparison site. CoverMatch finds plans for your specific breed,
            health condition, visa type, or property — with interactive calculators and real data.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/pet-insurance">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold">
                Compare Pet Insurance <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/calculators/pet-insurance">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Free Calculator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-white py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <s.icon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Segment Cards */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Choose Your Insurance Type</h2>
            <p className="text-gray-500 mt-2">Each hub has tailored calculators, plans, and guides</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {segments.map((seg) => (
              <Link key={seg.slug} href={`/${seg.slug}`} className="group">
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-200">
                  <CardHeader>
                    <div className="text-4xl mb-2">{seg.icon}</div>
                    <CardTitle className="group-hover:text-blue-700 transition-colors">{seg.name}</CardTitle>
                    <CardDescription>{seg.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {seg.highlights.map((h) => (
                        <Badge key={h} variant="secondary" className="text-xs">{h}</Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center text-sm font-medium text-blue-600">
                      Explore plans <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">How CoverMatch Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Pick Your Segment", desc: "Choose pet, life, travel, or landlord insurance. Then select your exact breed, condition, or visa type." },
              { step: "2", title: "Use the Calculator", desc: "Get real estimated premiums based on your age, location, and coverage needs — no signup required." },
              { step: "3", title: "Compare & Save", desc: "Side-by-side plan comparison with affiliate links. Save your quote and get a premium PDF report for $9.99." },
            ].map((item) => (
              <div key={item.step} className="space-y-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-lg flex items-center justify-center mx-auto">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-blue-700 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold">Start With the Most Popular Segment</h2>
          <p className="text-blue-100">
            Pet insurance for French Bulldogs has the highest search volume and best affiliate commissions.
          </p>
          <Link href="/pet-insurance/french-bulldog">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold">
              French Bulldog Pet Insurance <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
