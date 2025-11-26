"use client"

import { useCityLockers, CURRENCY } from "@/lib/citylockers-context"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Briefcase,
  Box,
  Bike,
  LayoutDashboard,
  Maximize,
  Plus,
  Minus,
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Plane,
  Building2,
} from "lucide-react"
import Link from "next/link"

const SectionHeader = ({ title, icon: Icon }: { title: string; icon?: any }) => (
  <div className="flex items-center gap-2 mb-4 border-b pb-2 border-border">
    {Icon && <Icon className="w-5 h-5 text-primary" />}
    <h3 className="font-bold text-foreground text-lg uppercase tracking-tight">{title}</h3>
  </div>
)

export default function DashboardPage() {
  const { state, financials, spaceMetrics, updateState } = useCityLockers()

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Hero Section */}
      <Card className="bg-card border-t-4 border-t-primary shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Briefcase className="w-32 h-32 text-primary" />
        </div>
        <CardContent className="p-8 text-center relative z-10">
          <div className="flex flex-col items-center justify-center mb-4">
            <h2 className="text-lg font-medium text-muted-foreground uppercase tracking-wider">
              Estimated Partner Annual Income (Net)
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-block bg-success/10 text-success text-xs font-bold px-3 py-1 rounded-full border border-success/20">
                Zero Capex - Zero Opex Model
              </span>
              {state.numberOfProperties > 1 && (
                <span className="inline-flex items-center gap-1 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
                  <Building2 className="w-3 h-3" />
                  {state.numberOfProperties} Properties
                </span>
              )}
            </div>
          </div>
          <div className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight mb-6">
            {CURRENCY} {financials.partnerAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-muted rounded-lg p-4 border border-border">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Monthly Net</p>
              <p className="text-xl font-bold text-foreground">
                {CURRENCY} {financials.partnerMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="bg-muted rounded-lg p-4 border border-border">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Daily Net</p>
              <p className="text-xl font-bold text-foreground">
                {CURRENCY} {financials.partnerDaily.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="bg-accent rounded-lg p-4 border border-primary/20 flex flex-col items-center justify-center">
              <p className="text-xs text-primary uppercase font-semibold mb-1">Partner Share</p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 rounded-full bg-card border-primary/30 text-primary hover:bg-accent"
                  onClick={() => updateState("revenueShare", Math.max(0, state.revenueShare - 1))}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="font-bold text-xl text-foreground">{state.revenueShare}%</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-6 w-6 rounded-full bg-card border-primary/30 text-primary hover:bg-accent"
                  onClick={() => updateState("revenueShare", Math.min(100, state.revenueShare + 1))}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/configuration">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                Configure Partnership <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/proposal">
              <Button variant="outline" className="border-primary text-primary hover:bg-accent gap-2 bg-transparent">
                Generate Proposal
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Value Props */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-chart-2">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="p-2 bg-chart-2/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-chart-2" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Revenue Generation</h4>
              <p className="text-sm text-muted-foreground">Monetize underutilized space with zero investment</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-chart-1">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="p-2 bg-chart-1/10 rounded-lg">
              <Shield className="w-5 h-5 text-chart-1" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Top Tier Security</h4>
              <p className="text-sm text-muted-foreground">400kg theft-resistant locks, 200,000hr lifespan</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-chart-3">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="p-2 bg-chart-3/10 rounded-lg">
              <Zap className="w-5 h-5 text-chart-3" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Smart Technology</h4>
              <p className="text-sm text-muted-foreground">Infrared sensors, 4G connectivity, UPS backup</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Revenue Mix */}
        <Card>
          <CardHeader className="pb-2">
            <SectionHeader title="Revenue Mix (Gross)" icon={LayoutDashboard} />
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-chart-1" /> Lockers
                </span>
                <span className="font-bold">{financials.mix.lockers.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-1 transition-all duration-500"
                  style={{ width: `${financials.mix.lockers}%` }}
                />
              </div>
              <p className="text-xs text-right text-muted-foreground">
                {CURRENCY} {financials.dailyLockerGross.toFixed(0)} / day
                {state.numberOfProperties > 1 && ` (${state.numberOfProperties} properties)`}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Bike className="w-4 h-4 text-chart-2" /> Scooters
                </span>
                <span className="font-bold">{financials.mix.scooters.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-2 transition-all duration-500"
                  style={{ width: `${financials.mix.scooters}%` }}
                />
              </div>
              <p className="text-xs text-right text-muted-foreground">
                {CURRENCY} {financials.dailyScooterGross.toFixed(0)} / day
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-chart-3" /> Delivery
                </span>
                <span className="font-bold">{(financials.mix.transfers + financials.mix.delivery).toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-3 transition-all duration-500"
                  style={{ width: `${financials.mix.transfers + financials.mix.delivery}%` }}
                />
              </div>
              <p className="text-xs text-right text-muted-foreground">
                {CURRENCY} {(financials.dailyTransferGross + financials.dailyDeliveryGross).toFixed(0)} / day
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Space Widget */}
        <Card>
          <CardHeader className="pb-2">
            <SectionHeader title="Space Utilization" icon={Maximize} />
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="relative w-48 h-24 overflow-hidden">
                <div className="absolute bottom-0 w-full h-full bg-muted rounded-t-full" />
                <div
                  className={`absolute bottom-0 w-full h-full rounded-t-full origin-bottom transition-all duration-700 ${
                    spaceMetrics.widthNeeded > state.availableWallSpace ? "bg-destructive" : "bg-primary"
                  }`}
                  style={{
                    transform: `rotate(${Math.min(180, (spaceMetrics.widthNeeded / (state.availableWallSpace || 1)) * 180) - 180}deg)`,
                  }}
                />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-32 h-32 bg-card rounded-full flex items-center justify-center pt-2 shadow-inner">
                  <div className="text-center -mt-16">
                    <p className="text-2xl font-bold">{spaceMetrics.widthNeeded.toFixed(1)}m</p>
                    <p className="text-[10px] text-muted-foreground">Required</p>
                  </div>
                </div>
              </div>

              <div className="w-full space-y-2 text-sm">
                <div className="flex justify-between border-b pb-2 border-border">
                  <span className="text-muted-foreground">Total Units (14 lockers/unit)</span>
                  <span className="font-mono font-bold">
                    {spaceMetrics.unitsNeeded}
                    {state.numberOfProperties > 1 && (
                      <span className="text-muted-foreground font-normal">
                        {" "}
                        x{state.numberOfProperties} = {spaceMetrics.unitsNeeded * state.numberOfProperties}
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2 border-border">
                  <span className="text-muted-foreground">
                    Available Space {state.numberOfProperties > 1 && "(per property)"}
                  </span>
                  <span className="font-mono font-bold">{state.availableWallSpace}m</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-muted-foreground">Status</span>
                  <span
                    className={`font-bold ${spaceMetrics.widthNeeded > state.availableWallSpace ? "text-destructive" : "text-success"}`}
                  >
                    {spaceMetrics.widthNeeded > state.availableWallSpace ? "OVER CAPACITY" : "OPTIMAL"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contract Value Card */}
      <Card className="overflow-hidden border-l-4 border-l-primary">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Total Contract Value (Net)
              </p>
              <h3 className="text-2xl font-bold mt-2 text-primary">
                {CURRENCY} {financials.partnerContract.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Over {state.contractTerm} years
                {state.numberOfProperties > 1 && ` across ${state.numberOfProperties} properties`}
              </p>
            </div>
            <div className="p-3 rounded-full bg-accent">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
