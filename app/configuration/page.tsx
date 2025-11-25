"use client"

import {
  useCityLockers,
  CURRENCY,
  LOCATIONS,
  PROPERTY_TYPES,
  TRANSFER_PERIODS,
  LOCKER_SPECS,
  PRICING_REFERENCE,
  UAE_AIRPORTS,
} from "@/lib/citylockers-context"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Settings,
  Box,
  Briefcase,
  Bike,
  Info,
  Ruler,
  Package,
  HelpCircle,
  Plane,
  AlertCircle,
  Building2,
  Plus,
  Minus,
} from "lucide-react"
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

  const selectedAirport = UAE_AIRPORTS.find((a) => a.code === state.delivery.selectedAirport) || UAE_AIRPORTS[0]

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

              <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Building2 className="w-5 h-5 text-[#FF9900]" />
                    </div>
                    <div>
                      <Label className="text-sm font-bold text-gray-800">Number of Properties</Label>
                      <p className="text-xs text-gray-500">For hotel clusters or property portfolios</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-orange-200 hover:bg-orange-100 bg-transparent"
                      onClick={() => updateState("numberOfProperties", Math.max(1, state.numberOfProperties - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-16 text-center">
                      <span className="text-2xl font-bold text-[#FF9900]">{state.numberOfProperties}</span>
                      <p className="text-[10px] text-gray-400 -mt-1">
                        {state.numberOfProperties === 1 ? "Property" : "Properties"}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full border-orange-200 hover:bg-orange-100 bg-transparent"
                      onClick={() => updateState("numberOfProperties", state.numberOfProperties + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {state.numberOfProperties > 1 && (
                  <div className="mt-3 p-2 bg-white/70 rounded text-xs text-gray-600 flex items-start gap-2">
                    <Info className="w-4 h-4 text-[#FF9900] flex-shrink-0 mt-0.5" />
                    <span>
                      Locker and scooter revenue will be calculated <strong>per property</strong> and multiplied by{" "}
                      {state.numberOfProperties}. Delivery volume scope can be set below.
                    </span>
                  </div>
                )}
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
                  <Briefcase className="w-4 h-4" /> Property Metrics{" "}
                  {state.numberOfProperties > 1 && <span className="text-[#FF9900]">(Per Property)</span>}
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
                description={
                  state.numberOfProperties > 1
                    ? `Configure locker quantities per property (applied to all ${state.numberOfProperties} properties)`
                    : "Configure locker quantities and expected occupancy rates"
                }
              />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Available Space */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-blue-600" />
                  <div>
                    <Label className="text-blue-800">
                      Available Wall Space{" "}
                      {state.numberOfProperties > 1 && <span className="text-blue-600">(Per Property)</span>}
                    </Label>
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
                        {state.numberOfProperties > 1 && (
                          <p className="text-[10px] text-[#FF9900] mt-1">
                            x{state.numberOfProperties} = {data.qty * state.numberOfProperties} total
                          </p>
                        )}
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
                    <div className="flex items-center gap-2 mt-2">
                      <Label className="text-xs text-gray-500">Daily Price ({CURRENCY})</Label>
                      <Input
                        type="number"
                        value={data.price}
                        onChange={(e) => updateState(`${key}.price`, Number.parseFloat(e.target.value) || 0)}
                        className="w-24 h-8 text-right"
                      />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Scooter Storage */}
          <Card className={state.scootersEnabled ? "ring-2 ring-green-200" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <SectionHeader title="Scooter Storage" icon={Bike} description="E-scooter charging lockers" />
                <Switch
                  checked={state.scootersEnabled}
                  onCheckedChange={(v) => updateState("scootersEnabled", v)}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
            </CardHeader>
            {state.scootersEnabled && (
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-xs text-green-800">
                  <strong>Scooter Locker Specs:</strong> 50cm x 140cm x 70cm with integrated charging, secure mount,
                  temperature monitoring.
                  {state.numberOfProperties > 1 && (
                    <span className="block mt-1 text-green-600">
                      Configuration applies to each of your {state.numberOfProperties} properties.
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-xs text-gray-500">Units (Per Property)</Label>
                    <div className="flex items-center gap-3">
                      <Slider
                        value={[state.scooters.units]}
                        min={1}
                        max={20}
                        step={1}
                        onValueChange={(v) => updateState("scooters.units", v[0])}
                        className="flex-1"
                      />
                      <span className="w-8 font-mono font-bold">{state.scooters.units}</span>
                    </div>
                    {state.numberOfProperties > 1 && (
                      <p className="text-[10px] text-green-600">
                        Total: {state.scooters.units * state.numberOfProperties} units
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs text-gray-500">Hourly Rate ({CURRENCY})</Label>
                    <Input
                      type="number"
                      value={state.scooters.hourlyRate}
                      onChange={(e) => updateState("scooters.hourlyRate", Number.parseFloat(e.target.value) || 0)}
                      className="h-9"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-xs text-gray-500">Avg Hours/Day Used</Label>
                    <div className="flex items-center gap-3">
                      <Slider
                        value={[state.scooters.utilization]}
                        min={1}
                        max={12}
                        step={1}
                        onValueChange={(v) => updateState("scooters.utilization", v[0])}
                        className="flex-1"
                      />
                      <span className="w-8 font-mono font-bold">{state.scooters.utilization}h</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          <Card className={state.transfersEnabled || state.deliveryEnabled ? "ring-2 ring-purple-200" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <SectionHeader
                  title="Luggage Delivery Service"
                  icon={Plane}
                  description="Airport transfers and luggage delivery"
                />
                <Switch
                  checked={state.transfersEnabled || state.deliveryEnabled}
                  onCheckedChange={(v) => {
                    updateState("transfersEnabled", v)
                    updateState("deliveryEnabled", v)
                  }}
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>
            </CardHeader>
            {(state.transfersEnabled || state.deliveryEnabled) && (
              <CardContent className="space-y-6">
                {/* Airport Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">Destination Airport</Label>
                  <Select
                    value={state.delivery.selectedAirport}
                    onValueChange={(v) => updateState("delivery.selectedAirport", v)}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UAE_AIRPORTS.map((airport) => (
                        <SelectItem key={airport.code} value={airport.code}>
                          <div className="flex items-center justify-between w-full gap-4">
                            <span>{airport.name}</span>
                            <span className="text-[#FF9900] font-bold">
                              {CURRENCY} {airport.price}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Airport Pricing Reference */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <Label className="text-xs font-bold text-purple-800 uppercase mb-3 block">
                    Airport Pricing Reference (Up to 4 bags)
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {UAE_AIRPORTS.map((airport) => (
                      <div
                        key={airport.code}
                        className={`p-2 rounded text-center text-xs transition-all ${
                          airport.code === state.delivery.selectedAirport
                            ? "bg-purple-600 text-white ring-2 ring-purple-300"
                            : "bg-white text-gray-600 border"
                        }`}
                      >
                        <p className="font-bold">{airport.code}</p>
                        <p className="font-mono">
                          {CURRENCY} {airport.price}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Volume and Scope Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label className="text-xs text-gray-500">Expected Deliveries</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={state.delivery.volume}
                        onChange={(e) => updateState("delivery.volume", Number.parseInt(e.target.value) || 0)}
                        className="h-9 flex-1"
                      />
                      <Select
                        value={state.delivery.period.toString()}
                        onValueChange={(v) => updateState("delivery.period", Number.parseInt(v))}
                      >
                        <SelectTrigger className="w-32 h-9">
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

                  {state.numberOfProperties > 1 && (
                    <div className="grid gap-2">
                      <Label className="text-xs text-gray-500">Volume Scope</Label>
                      <div className="flex bg-gray-100 rounded-lg p-1 h-9">
                        <button
                          type="button"
                          onClick={() => updateState("delivery.scope", "per-property")}
                          className={`flex-1 text-xs font-medium rounded-md transition-all ${
                            state.delivery.scope === "per-property"
                              ? "bg-white text-purple-700 shadow-sm"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          Per Property
                        </button>
                        <button
                          type="button"
                          onClick={() => updateState("delivery.scope", "total")}
                          className={`flex-1 text-xs font-medium rounded-md transition-all ${
                            state.delivery.scope === "total"
                              ? "bg-white text-purple-700 shadow-sm"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          Total (All {state.numberOfProperties})
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Volume calculation info */}
                {state.numberOfProperties > 1 && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-800">
                      {state.delivery.scope === "per-property" ? (
                        <>
                          <strong>Per Property:</strong> {state.delivery.volume} deliveries × {state.numberOfProperties}{" "}
                          properties ={" "}
                          <span className="font-bold">
                            {state.delivery.volume * state.numberOfProperties} total deliveries
                          </span>{" "}
                          {TRANSFER_PERIODS.find((p) => p.value === state.delivery.period)?.label.toLowerCase()}
                        </>
                      ) : (
                        <>
                          <strong>Total:</strong> {state.delivery.volume} deliveries shared across all{" "}
                          {state.numberOfProperties} properties
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Custom Price Override */}
                <div className="grid gap-2">
                  <Label className="text-xs text-gray-500 flex items-center gap-1">
                    Custom Price Override ({CURRENCY})
                    <HelpCircle className="w-3 h-3 text-gray-400" />
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder={`Default: ${selectedAirport.price}`}
                      value={state.delivery.customPrice ?? ""}
                      onChange={(e) => {
                        const val = e.target.value
                        updateState("delivery.customPrice", val === "" ? null : Number.parseFloat(val))
                      }}
                      className="h-9 flex-1"
                    />
                    {state.delivery.customPrice !== null && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateState("delivery.customPrice", null)}
                        className="text-xs text-gray-500"
                      >
                        Reset
                      </Button>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Leave empty to use default airport price. Set custom for negotiated rates.
                  </p>
                </div>

                {/* Pricing Disclaimer */}
                <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    <strong>Note:</strong> Prices shown are default reference rates and are subject to discussion
                    between CityLockers and the partner. Final pricing will be confirmed during contract negotiations.
                    Service expected to launch Q1 2026.
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Right Column - Summary & Help */}
        <div className="space-y-6">
          {/* Live Summary */}
          <Card className="sticky top-4 border-t-4 border-t-[#FF9900]">
            <CardHeader className="pb-2">
              <SectionHeader title="Live Summary" icon={Info} />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-semibold">Est. Annual Partner Income</p>
                <p className="text-3xl font-extrabold text-[#FF9900] mt-1">
                  {CURRENCY} {financials.partnerAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                {state.numberOfProperties > 1 && (
                  <p className="text-xs text-gray-500 mt-1">Across {state.numberOfProperties} properties</p>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Properties</span>
                  <span className="font-bold">{state.numberOfProperties}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Total Lockers {state.numberOfProperties > 1 && "(All)"}</span>
                  <span className="font-bold">
                    {(state.lockerM.qty + state.lockerL.qty + state.lockerXL.qty) * state.numberOfProperties}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Daily Gross Revenue</span>
                  <span className="font-mono">
                    {CURRENCY} {financials.totalDailyGross.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Revenue Share</span>
                  <span className="font-bold text-[#FF9900]">{state.revenueShare}%</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Contract Term</span>
                  <span className="font-bold">{state.contractTerm} Years</span>
                </div>
              </div>

              {/* Revenue Mix Mini */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-gray-500 uppercase">Revenue Mix</p>
                <div className="h-3 rounded-full overflow-hidden flex bg-gray-100">
                  <div
                    className="bg-blue-500 transition-all"
                    style={{ width: `${financials.mix.lockers}%` }}
                    title={`Lockers: ${financials.mix.lockers.toFixed(1)}%`}
                  />
                  <div
                    className="bg-green-500 transition-all"
                    style={{ width: `${financials.mix.scooters}%` }}
                    title={`Scooters: ${financials.mix.scooters.toFixed(1)}%`}
                  />
                  <div
                    className="bg-purple-500 transition-all"
                    style={{ width: `${financials.mix.transfers + financials.mix.delivery}%` }}
                    title={`Delivery: ${(financials.mix.transfers + financials.mix.delivery).toFixed(1)}%`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full" /> Lockers
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full" /> Scooters
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full" /> Delivery
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <Button className="w-full bg-[#FF9900] hover:bg-[#E68A00] text-white" onClick={() => saveScenario()}>
                  Save Scenario
                </Button>
                <Link href="/proposal" className="w-full">
                  <Button variant="outline" className="w-full border-gray-300 bg-transparent">
                    Generate Proposal
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Help Cards */}
          <Card>
            <CardHeader className="pb-2">
              <SectionHeader title="Locker Specifications" icon={Package} />
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(LOCKER_SPECS.hospitality).map(([size, spec]) => (
                <LockerSpecCard key={size} size={size} dimensions={spec.dimensions} fits={spec.fits} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <SectionHeader title="Pricing Reference" icon={HelpCircle} />
            </CardHeader>
            <CardContent>
              <div className="text-xs space-y-3">
                <div>
                  <p className="font-semibold text-gray-700 mb-2">Luggage Lockers (per booking)</p>
                  <div className="overflow-x-auto">
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
                        {Object.entries(PRICING_REFERENCE.luggage).map(([size, prices]) => (
                          <tr key={size} className="border-b border-dashed">
                            <td className="py-1 font-medium">{size}</td>
                            <td className="text-right">{prices["3hr"]}</td>
                            <td className="text-right">{prices["6hr"]}</td>
                            <td className="text-right">{prices["24hr"]}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Scooters</p>
                  <p className="text-gray-500">
                    From {CURRENCY} {PRICING_REFERENCE.scooter.hourly}/hr or {CURRENCY}{" "}
                    {PRICING_REFERENCE.scooter.monthly}/month
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Delivery</p>
                  <p className="text-gray-500">
                    From {CURRENCY} {PRICING_REFERENCE.transfer.starting} ({PRICING_REFERENCE.transfer.note})
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
