"use client"

import {
  useCityLockers,
  CURRENCY,
  LOCATIONS,
  PROPERTY_TYPES,
  TRANSFER_PERIODS,
  LOCKER_SPECS,
  PRICING_REFERENCE,
} from "@/lib/citylockers-context"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Box, Briefcase, Bike, Truck, Info, Ruler, Package, HelpCircle } from "lucide-react"
import Link from "next/link"

const SectionHeader = ({ title, icon: Icon, description }: { title: string; icon?: any; description?: string }) => (
  <div className="mb-4 border-b pb-3 border-gray-100">
    <div className="flex items-center gap-2">
      {Icon && <Icon className="w-5 h-5 text-[#FF9900]" />}
      <h3 className="font-bold text-gray-800 text-lg uppercase tracking-tight">{title}</h3>
    </div>
    {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
  </div>
)

const LockerSpecCard = ({ size, dimensions, fits }: { size: string; dimensions: string; fits: string }) => (
  <div className="bg-gray-50 border rounded-lg p-3 space-y-2">
    <div className="flex items-center justify-between">
      <span className="font-bold text-[#FF9900]">{size}</span>
      <span className="text-xs bg-white px-2 py-1 rounded border font-mono">{dimensions}</span>
    </div>
    <p className="text-xs text-gray-600">{fits}</p>
  </div>
)

export default function ConfigurationPage() {
  const { state, updateState, saveScenario, financials } = useCityLockers()

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Partnership Configuration</h1>
        <p className="text-gray-500 mt-1">Configure your CityLockers partnership parameters and inventory</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Business Config */}
          <Card>
            <CardHeader className="pb-3">
              <SectionHeader
                title="Business Configuration"
                icon={Settings}
                description="Set up your partnership terms and property details"
              />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Client / Property Name</Label>
                <Input
                  value={state.clientName}
                  onChange={(e) => updateState("clientName", e.target.value)}
                  placeholder="e.g., Anantara The Palm Dubai Resort"
                  className="border-gray-200 focus:border-[#FF9900]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Property Type</Label>
                  <Select value={state.propertyType} onValueChange={(v) => updateState("propertyType", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Location Factor</Label>
                  <Select
                    value={state.locationFactor.toString()}
                    onValueChange={(v) => updateState("locationFactor", Number.parseFloat(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map((l) => (
                        <SelectItem key={l.value} value={l.value.toString()}>
                          {l.label} ({l.value}x)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Contract Term: {state.contractTerm} Years</Label>
                  <Slider
                    value={[state.contractTerm]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(v) => updateState("contractTerm", v[0])}
                    className="py-2"
                  />
                  <p className="text-xs text-gray-400">Standard: 5 years with 6-month termination notice</p>
                </div>
                <div className="grid gap-2">
                  <Label>Revenue Share: {state.revenueShare}%</Label>
                  <Slider
                    value={[state.revenueShare]}
                    min={10}
                    max={40}
                    step={1}
                    onValueChange={(v) => updateState("revenueShare", v[0])}
                    className="py-2"
                  />
                  <p className="text-xs text-gray-400">Typical range: 15-25% commission</p>
                </div>
              </div>

              {/* Property Metrics */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-3">
                <Label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Property Metrics
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-1">
                    <Label className="text-xs">
                      {state.propertyType === "residential" ? "Total Units" : "Total Keys/Rooms"}
                    </Label>
                    <Input
                      type="number"
                      value={state.totalKeys}
                      onChange={(e) => updateState("totalKeys", Number.parseInt(e.target.value) || 0)}
                      className="h-9 bg-white"
                    />
                    <p className="text-[10px] text-gray-400">Helps estimate potential demand</p>
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-xs">Avg Daily Traffic</Label>
                    <Input
                      type="number"
                      value={state.avgDailyTraffic}
                      onChange={(e) => updateState("avgDailyTraffic", Number.parseInt(e.target.value) || 0)}
                      className="h-9 bg-white"
                    />
                    <p className="text-[10px] text-gray-400">Checkouts, deliveries, or packages</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Management */}
          <Card>
            <CardHeader className="pb-3">
              <SectionHeader
                title="Locker Inventory"
                icon={Box}
                description="Configure locker quantities and expected occupancy rates"
              />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Available Space */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-blue-600" />
                  <div>
                    <Label className="text-blue-800">Available Wall Space</Label>
                    <p className="text-xs text-blue-600">1 Unit = 14 Lockers = 2.2m width</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={state.availableWallSpace}
                    onChange={(e) => updateState("availableWallSpace", Number.parseFloat(e.target.value) || 0)}
                    className="w-20 h-9 text-right bg-white"
                  />
                  <span className="text-sm font-medium text-blue-800">meters</span>
                </div>
              </div>

              {/* Locker Inputs */}
              {(["XL", "L", "M"] as const).map((size) => {
                const key = `locker${size}` as keyof typeof state
                const data = state[key] as { qty: number; price: number; occupancy: number }
                const specs = LOCKER_SPECS.hospitality[size]
                return (
                  <div key={size} className="space-y-3 p-4 border rounded-lg bg-white">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <Label className="font-bold text-lg">{size} Lockers</Label>
                        <p className="text-xs text-gray-500 mt-1">{specs.dimensions}</p>
                        <p className="text-xs text-[#FF9900]">{specs.fits}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {data.qty} units @ {data.occupancy}% occupancy
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-500">Quantity (0-20)</Label>
                        <div className="flex items-center gap-3 mt-1">
                          <Slider
                            value={[data.qty]}
                            min={0}
                            max={20}
                            step={1}
                            onValueChange={(v) => updateState(`${key}.qty`, v[0])}
                            className="flex-1"
                          />
                          <span className="w-8 text-right font-mono font-bold">{data.qty}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Expected Occupancy %</Label>
                        <div className="flex items-center gap-3 mt-1">
                          <Slider
                            value={[data.occupancy]}
                            min={0}
                            max={100}
                            step={5}
                            onValueChange={(v) => updateState(`${key}.occupancy`, v[0])}
                            className="flex-1"
                          />
                          <span className="w-10 text-right font-mono font-bold">{data.occupancy}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Services Mix */}
          <Card>
            <CardHeader className="pb-3">
              <SectionHeader
                title="Additional Services"
                icon={Briefcase}
                description="Enable optional revenue streams"
              />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scooters */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Bike className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <Label className="font-bold">E-Scooter Rentals</Label>
                      <p className="text-xs text-gray-500">
                        From {CURRENCY} {PRICING_REFERENCE.scooter.hourly}/hr or {CURRENCY}{" "}
                        {PRICING_REFERENCE.scooter.monthly}/month subscription
                      </p>
                    </div>
                  </div>
                  <Switch checked={state.scootersEnabled} onCheckedChange={(v) => updateState("scootersEnabled", v)} />
                </div>
                {state.scootersEnabled && (
                  <div className="pl-12 space-y-3 border-l-2 border-green-100 ml-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-1">
                        <Label className="text-xs">Number of Scooters</Label>
                        <Input
                          type="number"
                          value={state.scooters.units}
                          onChange={(e) => updateState("scooters.units", Number.parseInt(e.target.value) || 0)}
                          className="h-9"
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-xs">Avg Hours Rented/Day</Label>
                        <Input
                          type="number"
                          value={state.scooters.utilization}
                          onChange={(e) => updateState("scooters.utilization", Number.parseFloat(e.target.value) || 0)}
                          className="h-9"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Locker size: 50cm x 140cm x 70cm with integrated charging</p>
                  </div>
                )}
              </div>

              {/* Transfers */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Truck className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <Label className="font-bold">Luggage Transfer Service</Label>
                      <p className="text-xs text-gray-500">
                        Starting at {CURRENCY} {PRICING_REFERENCE.transfer.starting} ({PRICING_REFERENCE.transfer.note})
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={state.transfersEnabled}
                    onCheckedChange={(v) => updateState("transfersEnabled", v)}
                  />
                </div>
                {state.transfersEnabled && (
                  <div className="pl-12 space-y-3 border-l-2 border-purple-100 ml-4">
                    <div className="grid gap-2">
                      <Label className="text-xs">Expected Volume</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={state.transfers.volume}
                          onChange={(e) => updateState("transfers.volume", Number.parseInt(e.target.value) || 0)}
                          className="h-9 w-24"
                        />
                        <Select
                          value={state.transfers.period.toString()}
                          onValueChange={(v) => updateState("transfers.period", Number.parseInt(v))}
                        >
                          <SelectTrigger className="h-9 w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TRANSFER_PERIODS.map((p) => (
                              <SelectItem key={p.value} value={p.value.toString()}>
                                {p.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Portfolio-wide service?</Label>
                      <Switch
                        checked={state.transfers.isPortfolio}
                        onCheckedChange={(v) => updateState("transfers.isPortfolio", v)}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Collection from locker, delivered to airport with video documentation
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Info & Summary */}
        <div className="space-y-6">
          {/* Quick Summary */}
          <Card className="border-t-4 border-t-[#FF9900] sticky top-20">
            <CardHeader className="pb-2">
              <h3 className="font-bold text-gray-800">Configuration Summary</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Client</span>
                  <span className="font-medium truncate max-w-[150px]">{state.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Contract Term</span>
                  <span className="font-medium">{state.contractTerm} Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Revenue Share</span>
                  <span className="font-medium text-[#FF9900]">{state.revenueShare}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Lockers</span>
                  <span className="font-medium">{state.lockerM.qty + state.lockerL.qty + state.lockerXL.qty}</span>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-xs text-gray-500 uppercase mb-1">Est. Annual Income</p>
                <p className="text-2xl font-bold text-[#FF9900]">
                  {CURRENCY} {financials.partnerAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full bg-[#FF9900] hover:bg-[#E68A00]"
                  onClick={() => {
                    const name = prompt(
                      "Enter scenario name:",
                      `${state.clientName} - ${new Date().toLocaleDateString()}`,
                    )
                    if (name) saveScenario(name)
                  }}
                >
                  Save Configuration
                </Button>
                <Link href="/proposal">
                  <Button
                    variant="outline"
                    className="w-full border-[#FF9900] text-[#FF9900] hover:bg-orange-50 bg-transparent"
                  >
                    Generate Proposal
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Locker Specifications Guide */}
          <Card>
            <CardHeader className="pb-2">
              <SectionHeader title="Locker Size Guide" icon={Package} />
            </CardHeader>
            <CardContent className="space-y-3">
              <LockerSpecCard
                size="XL - Extra Large"
                dimensions="48 x 55 x 85 cm"
                fits="Large suitcases, oversized bags, golf bags, strollers"
              />
              <LockerSpecCard
                size="L - Large"
                dimensions="48 x 33 x 85 cm"
                fits="Medium suitcases, carry-on bags, large backpacks"
              />
              <LockerSpecCard
                size="M - Medium"
                dimensions="48 x 28 x 58 cm"
                fits="Small bags, laptops, handbags, personal items"
              />
            </CardContent>
          </Card>

          {/* Pricing Reference */}
          <Card>
            <CardHeader className="pb-2">
              <SectionHeader title="Pricing Reference" icon={Info} />
            </CardHeader>
            <CardContent>
              <div className="text-xs space-y-3">
                <div>
                  <p className="font-bold text-gray-700 mb-2">Luggage Storage (AED)</p>
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-1">Size</th>
                        <th className="text-right">3hr</th>
                        <th className="text-right">6hr</th>
                        <th className="text-right">24hr</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-1">Medium</td>
                        <td className="text-right">{PRICING_REFERENCE.luggage.M["3hr"]}</td>
                        <td className="text-right">{PRICING_REFERENCE.luggage.M["6hr"]}</td>
                        <td className="text-right">{PRICING_REFERENCE.luggage.M["24hr"]}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1">Large</td>
                        <td className="text-right">{PRICING_REFERENCE.luggage.L["3hr"]}</td>
                        <td className="text-right">{PRICING_REFERENCE.luggage.L["6hr"]}</td>
                        <td className="text-right">{PRICING_REFERENCE.luggage.L["24hr"]}</td>
                      </tr>
                      <tr>
                        <td className="py-1">XL</td>
                        <td className="text-right">{PRICING_REFERENCE.luggage.XL["3hr"]}</td>
                        <td className="text-right">{PRICING_REFERENCE.luggage.XL["6hr"]}</td>
                        <td className="text-right">{PRICING_REFERENCE.luggage.XL["24hr"]}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Tips */}
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-bold mb-1">Configuration Tips</p>
                  <ul className="text-xs space-y-1 text-blue-700">
                    <li>• Default hotel config: 6 XL, 5 L, 3 M lockers</li>
                    <li>• Higher traffic areas = higher occupancy estimates</li>
                    <li>• Tourist hubs typically have 1.5x location factor</li>
                    <li>• Seasonality is auto-calculated in projections</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
