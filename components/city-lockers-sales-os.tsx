"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Settings,
  Save,
  Download,
  Briefcase,
  Box,
  Truck,
  Bike,
  LayoutDashboard,
  FileText,
  Plus,
  Minus,
  Maximize,
  Globe,
  Linkedin,
  Facebook,
  Github,
  Phone,
  Mail,
  MessageCircle,
  User,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// --- Constants & Configuration ---
const PRIMARY_COLOR = "#FF9900"
const CURRENCY = "AED"

// Seasonality Multiplier: (5mo * 1.15 + 1mo * 0.85 + 6mo * 1.0) / 12
const SEASONALITY_FACTOR = (5 * 1.15 + 1 * 0.85 + 6 * 1.0) / 12

const LOCATIONS = [
  { label: "Standard City", value: 1.0 },
  { label: "Tourist Hub", value: 1.5 },
  { label: "Downtown", value: 1.2 },
  { label: "Transit Zone", value: 1.3 },
  { label: "Remote Area", value: 0.8 },
]

const PROPERTY_TYPES = [
  { label: "Hospitality (Hotel)", value: "hotel" },
  { label: "Residential", value: "residential" },
  { label: "Commercial (Mall)", value: "commercial" },
]

const TRANSFER_PERIODS = [
  { label: "Per Day", value: 365 },
  { label: "Per Week", value: 52 },
  { label: "Per Month", value: 12 },
]

// Defaults
const DEFAULT_STATE = {
  // Business Config
  clientName: "New Client",
  propertyType: "hotel",
  locationFactor: 1.2, // Downtown default
  contractTerm: 3, // Years
  revenueShare: 20, // %

  // Property Metrics
  totalKeys: 150, // Rooms/Units
  avgDailyTraffic: 45, // Checkouts/Packages

  // Inventory (Lockers)
  // Default: 6 XL, 5 L, 3 M per unit
  lockerM: { qty: 3, price: 20, occupancy: 60 },
  lockerL: { qty: 5, price: 30, occupancy: 55 },
  lockerXL: { qty: 6, price: 40, occupancy: 50 },
  availableWallSpace: 5, // meters

  // Services Mix
  scootersEnabled: false,
  scooters: { units: 5, hourlyRate: 15, utilization: 4 }, // 4 hours/day

  transfersEnabled: false,
  transfers: {
    volume: 10,
    period: 365, // Daily default
    price: 50,
    isPortfolio: false, // Per Property vs All
  },
}

// --- Types ---
type AppState = typeof DEFAULT_STATE

// --- Helper Functions ---

const calculateLockerRevenue = (
  qty: number,
  price: number,
  occupancy: number, // percentage 0-100
  locationFactor: number,
) => {
  // Revenue = Price * Qty * Occupancy * Location * Seasonality
  // Daily Revenue
  return price * qty * (occupancy / 100) * locationFactor * SEASONALITY_FACTOR
}

const calculateSpaceUtilization = (m: number, l: number, xl: number) => {
  const totalLockers = m + l + xl
  // 1 Unit = 14 Lockers = 2.2m
  // Width needed = (Total Lockers / 14) * 2.2
  const unitsNeeded = Math.ceil(totalLockers / 14)
  // More precise width calculation if not rounding units immediately,
  // but prompt says "1 Unit = 14 Lockers". We'll treat it as partial units allowed for width calc?
  // Let's use exact ratio:
  const widthNeeded = (totalLockers / 14) * 2.2
  return { totalLockers, widthNeeded, unitsNeeded }
}

// --- Sub-Components (Defined outside to prevent re-mounting) ---

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  highlight = false,
}: {
  title: string
  value: string
  subtitle?: string
  icon?: any
  highlight?: boolean
}) => (
  <Card className={`overflow-hidden border-l-4 ${highlight ? "border-l-[#FF9900]" : "border-l-gray-200"}`}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <h3 className={`text-2xl font-bold mt-2 ${highlight ? "text-[#FF9900]" : "text-gray-900"}`}>{value}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-full ${highlight ? "bg-orange-50" : "bg-gray-50"}`}>
            <Icon className={`w-6 h-6 ${highlight ? "text-[#FF9900]" : "text-gray-400"}`} />
          </div>
        )}
      </div>
    </CardContent>
  </Card>
)

const SectionHeader = ({ title, icon: Icon }: { title: string; icon?: any }) => (
  <div className="flex items-center gap-2 mb-4 border-b pb-2 border-gray-100">
    {Icon && <Icon className="w-5 h-5 text-[#FF9900]" />}
    <h3 className="font-bold text-gray-800 text-lg uppercase tracking-tight">{title}</h3>
  </div>
)

const Footer = () => (
  <footer className="bg-slate-900 text-white py-12 mt-12 print:hidden">
    <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Branding */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-[#FF9900]">Wessam Zidan</h3>
        <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
          Business Development Executive @ CityLockers.
          <br />
          Turning digital marketing, consultative sales & web development into explosive revenue growth.
        </p>
        <div className="flex gap-4 pt-2">
          <a
            href="https://www.wessamzidan.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-[#FF9900] transition-colors"
          >
            <Globe className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/wessamzidan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-[#FF9900] transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="https://facebook.com/zidanwessam"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-[#FF9900] transition-colors"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/wessamzidan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-[#FF9900] transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Middle Column - Spacer or Quick Links if needed (keeping empty to match general layout or add standard links) */}
      <div className="hidden md:block"></div>

      {/* Contact Developer */}
      <div className="space-y-4">
        <h4 className="text-[#FF9900] font-bold uppercase tracking-wider text-sm">Contact Developer</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-slate-300 text-sm">
            <User className="w-4 h-4 text-[#FF9900]" />
            <span>Wessam Zidan</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300 text-sm">
            <Phone className="w-4 h-4 text-[#FF9900]" />
            <span>+971 55 711 5562</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300 text-sm">
            <Mail className="w-4 h-4 text-[#FF9900]" />
            <a href="mailto:zidanwessam@gmail.com" className="hover:text-white transition-colors">
              zidanwessam@gmail.com
            </a>
          </div>
          <Button className="bg-green-500 hover:bg-green-600 text-white w-full mt-2">
            <MessageCircle className="w-4 h-4 mr-2" /> Chat on WhatsApp
          </Button>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 md:px-6 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
      © 2025 Wessam Zidan. All rights reserved. CityLockers Sales OS v2.0
    </div>
  </footer>
)

// --- Main Component ---

export default function CityLockersSalesOS() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE)
  const [view, setView] = useState<"dashboard" | "proposal">("dashboard")
  const [scenarios, setScenarios] = useState<{ name: string; date: string; data: AppState }[]>([])

  // -- Effects for LocalStorage --
  useEffect(() => {
    const saved = localStorage.getItem("citylockers_current_state")
    if (saved) {
      try {
        setState(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load state", e)
      }
    }
    // Load scenario list
    const savedScenarios = localStorage.getItem("citylockers_scenarios")
    if (savedScenarios) {
      try {
        setScenarios(JSON.parse(savedScenarios))
      } catch (e) {
        console.error("Failed to load scenarios", e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("citylockers_current_state", JSON.stringify(state))
  }, [state])

  // -- Calculations --

  const financials = useMemo(() => {
    const {
      lockerM,
      lockerL,
      lockerXL,
      locationFactor,
      revenueShare,
      scootersEnabled,
      scooters,
      transfersEnabled,
      transfers,
      contractTerm,
    } = state

    // 1. Lockers Revenue (Daily Gross)
    const dailyRevM = calculateLockerRevenue(lockerM.qty, lockerM.price, lockerM.occupancy, locationFactor)
    const dailyRevL = calculateLockerRevenue(lockerL.qty, lockerL.price, lockerL.occupancy, locationFactor)
    const dailyRevXL = calculateLockerRevenue(lockerXL.qty, lockerXL.price, lockerXL.occupancy, locationFactor)
    const dailyLockerGross = dailyRevM + dailyRevL + dailyRevXL

    // 2. Scooters Revenue (Daily Gross)
    // Revenue = Units * Rate * Utilization * Seasonality * Location
    // Usually scooters are less affected by seasonality/location in the same way?
    // Prompt says "Revenue = (Price x Qty x Occupancy x LocationMultiplier x Seasonality)" generally.
    // We will apply the same factors for consistency unless specified otherwise.
    let dailyScooterGross = 0
    if (scootersEnabled) {
      dailyScooterGross =
        scooters.units * scooters.hourlyRate * scooters.utilization * locationFactor * SEASONALITY_FACTOR
    }

    // 3. Transfers Revenue (Daily Gross)
    let dailyTransferGross = 0
    if (transfersEnabled) {
      // Volume per period -> Convert to Daily
      const dailyVolume = transfers.volume * (transfers.period / 365)
      // Price * Volume
      // Transfers might be less location dependent but let's keep it simple or apply strictly
      // Prompt: "Price x Qty x Occupancy...". Transfers don't have occupancy.
      // Let's assume just Price * Volume for transfers, maybe adjusted by seasonality.
      dailyTransferGross = dailyVolume * transfers.price * SEASONALITY_FACTOR
    }

    const totalDailyGross = dailyLockerGross + dailyScooterGross + dailyTransferGross
    const totalAnnualGross = totalDailyGross * 365

    // Partner Share (Net)
    const partnerDaily = totalDailyGross * (revenueShare / 100)
    const partnerMonthly = partnerDaily * 30
    const partnerAnnual = totalAnnualGross * (revenueShare / 100)
    const partnerContract = partnerAnnual * contractTerm

    // Mix Percentages (of Gross)
    const totalGross = Math.max(totalDailyGross, 0.01) // avoid div by 0
    const mix = {
      lockers: (dailyLockerGross / totalGross) * 100,
      scooters: (dailyScooterGross / totalGross) * 100,
      transfers: (dailyTransferGross / totalGross) * 100,
    }

    return {
      dailyLockerGross,
      dailyScooterGross,
      dailyTransferGross,
      totalDailyGross,
      totalAnnualGross,
      partnerDaily,
      partnerMonthly,
      partnerAnnual,
      partnerContract,
      mix,
    }
  }, [state])

  const spaceMetrics = useMemo(() => {
    return calculateSpaceUtilization(state.lockerM.qty, state.lockerL.qty, state.lockerXL.qty)
  }, [state.lockerM.qty, state.lockerL.qty, state.lockerXL.qty])

  // -- Handlers --

  const updateState = (path: string, value: any) => {
    setState((prev) => {
      const newState = { ...prev }
      const parts = path.split(".")
      if (parts.length === 1) {
        ;(newState as any)[parts[0]] = value
      } else {
        // Handle nested updates (e.g. 'lockerM.qty')
        let current = newState as any
        for (let i = 0; i < parts.length - 1; i++) {
          current = current[parts[i]]
        }
        current[parts[parts.length - 1]] = value
      }
      return newState
    })
  }

  const saveScenario = () => {
    const name = prompt("Enter scenario name:", `${state.clientName} - ${new Date().toLocaleDateString()}`)
    if (name) {
      const newScenarios = [...scenarios, { name, date: new Date().toISOString(), data: state }]
      setScenarios(newScenarios)
      localStorage.setItem("citylockers_scenarios", JSON.stringify(newScenarios))
    }
  }

  const loadScenario = (data: any) => {
    if (window.confirm("Load scenario? Unsaved changes will be lost.")) {
      setState(data)
    }
  }

  // -- Render --

  if (view === "proposal") {
    return (
      <ProposalView
        state={state}
        financials={financials}
        onBack={() => setView("dashboard")}
        spaceMetrics={spaceMetrics}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      {/* Top Bar */}
      <header className="bg-white border-b sticky top-0 z-10 px-4 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF9900] rounded flex items-center justify-center text-white font-bold">CL</div>
          <h1 className="font-bold text-lg tracking-tight hidden md:block">CityLockers Sales OS</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={saveScenario} className="text-gray-600">
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
          <Button className="bg-[#FF9900] hover:bg-[#E68A00] text-white" onClick={() => setView("proposal")}>
            <FileText className="w-4 h-4 mr-2" /> Proposal
          </Button>
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Controls (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Business Config */}
          <Card>
            <CardHeader className="pb-3">
              <SectionHeader title="Business Configuration" icon={Settings} />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Client Name</Label>
                <Input
                  value={state.clientName}
                  onChange={(e) => updateState("clientName", e.target.value)}
                  className="border-gray-200 focus:border-[#FF9900]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <Label>Location</Label>
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
              </div>

              {/* Property Metrics (Dynamic based on Type) */}
              <div className="bg-gray-50 p-3 rounded-md border border-gray-100 space-y-3">
                <Label className="text-xs font-bold text-gray-500 uppercase">Property Metrics</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1">
                    <Label className="text-xs">
                      {state.propertyType === "residential" ? "Total Units" : "Total Keys"}
                    </Label>
                    <Input
                      type="number"
                      value={state.totalKeys}
                      onChange={(e) => updateState("totalKeys", Number.parseInt(e.target.value) || 0)}
                      className="h-8 bg-white"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-xs">Avg Daily Traffic</Label>
                    <Input
                      type="number"
                      value={state.avgDailyTraffic}
                      onChange={(e) => updateState("avgDailyTraffic", Number.parseInt(e.target.value) || 0)}
                      className="h-8 bg-white"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Management */}
          <Card>
            <CardHeader className="pb-3">
              <SectionHeader title="Inventory (Lockers)" icon={Box} />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Available Space Input */}
              <div className="flex justify-between items-center mb-2">
                <Label>Available Wall Space (m)</Label>
                <Input
                  type="number"
                  value={state.availableWallSpace}
                  onChange={(e) => updateState("availableWallSpace", Number.parseFloat(e.target.value) || 0)}
                  className="w-20 h-8 text-right"
                />
              </div>

              {/* Locker Inputs */}
              {["M", "L", "XL"].map((size) => {
                const key = `locker${size}` as keyof typeof state
                const data = state[key] as any
                return (
                  <div key={size} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label className="font-bold">{size} Lockers</Label>
                      <span className="text-xs text-gray-500">
                        {data.qty} Units @ {data.occupancy}% Occ
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 items-center">
                      <div>
                        <Label className="text-[10px] text-gray-400">Quantity</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[data.qty]}
                            min={0}
                            max={20}
                            step={1}
                            onValueChange={(v) => updateState(`${key}.qty`, v[0])}
                          />
                          <span className="w-6 text-right text-sm font-mono">{data.qty}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-[10px] text-gray-400">Occupancy %</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[data.occupancy]}
                            min={0}
                            max={100}
                            step={5}
                            onValueChange={(v) => updateState(`${key}.occupancy`, v[0])}
                          />
                          <span className="w-8 text-right text-sm font-mono">{data.occupancy}%</span>
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
              <SectionHeader title="Services Mix" icon={Briefcase} />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Scooters */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bike className="w-4 h-4 text-gray-500" />
                    <Label>E-Scooters</Label>
                  </div>
                  <Switch checked={state.scootersEnabled} onCheckedChange={(v) => updateState("scootersEnabled", v)} />
                </div>
                {state.scootersEnabled && (
                  <div className="pl-6 space-y-3 border-l-2 border-gray-100 ml-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-1">
                        <Label className="text-xs">Units</Label>
                        <Input
                          type="number"
                          value={state.scooters.units}
                          onChange={(e) => updateState("scooters.units", Number.parseInt(e.target.value) || 0)}
                          className="h-8"
                        />
                      </div>
                      <div className="grid gap-1">
                        <Label className="text-xs">Hrs/Day</Label>
                        <Input
                          type="number"
                          value={state.scooters.utilization}
                          onChange={(e) => updateState("scooters.utilization", Number.parseFloat(e.target.value) || 0)}
                          className="h-8"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Transfers */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-gray-500" />
                    <Label>Transfers</Label>
                  </div>
                  <Switch
                    checked={state.transfersEnabled}
                    onCheckedChange={(v) => updateState("transfersEnabled", v)}
                  />
                </div>
                {state.transfersEnabled && (
                  <div className="pl-6 space-y-3 border-l-2 border-gray-100 ml-2">
                    <div className="grid gap-1">
                      <Label className="text-xs">Volume</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={state.transfers.volume}
                          onChange={(e) => updateState("transfers.volume", Number.parseInt(e.target.value) || 0)}
                          className="h-8 w-20"
                        />
                        <Select
                          value={state.transfers.period.toString()}
                          onValueChange={(v) => updateState("transfers.period", Number.parseInt(v))}
                        >
                          <SelectTrigger className="h-8 text-xs">
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

                    <div className="flex items-center justify-between pt-2">
                      <Label className="text-xs">Scope: Portfolio Wide?</Label>
                      <Switch
                        checked={state.transfers.isPortfolio}
                        onCheckedChange={(v) => updateState("transfers.isPortfolio", v)}
                        className="scale-75"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Dashboard (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Hero Section */}
          <Card className="bg-white border-t-4 border-t-[#FF9900] shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Briefcase className="w-32 h-32 text-[#FF9900]" />
            </div>
            <CardContent className="p-8 text-center relative z-10">
              <div className="flex flex-col items-center justify-center mb-4">
                <h2 className="text-lg font-medium text-gray-500 uppercase tracking-wider">
                  Estimated Partner Annual Income (Net)
                </h2>
                {/* Zero Capex - Opex badge */}
                <span className="inline-block bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full mt-2 border border-green-200">
                  Zero Capex - Zero Opex Model
                </span>
              </div>
              <div className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
                {CURRENCY} {financials.partnerAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Monthly Net</p>
                  <p className="text-xl font-bold text-gray-800">
                    {CURRENCY} {financials.partnerMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Daily Net</p>
                  <p className="text-xl font-bold text-gray-800">
                    {CURRENCY} {financials.partnerDaily.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="bg-[#FFF5E6] rounded-lg p-4 border border-orange-100 flex flex-col items-center justify-center">
                  <p className="text-xs text-[#FF9900] uppercase font-semibold mb-1">Partner Share</p>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded-full bg-white border-orange-200 text-orange-600 hover:bg-orange-50"
                      onClick={() => updateState("revenueShare", Math.max(0, state.revenueShare - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="font-bold text-xl text-gray-900">{state.revenueShare}%</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded-full bg-white border-orange-200 text-orange-600 hover:bg-orange-50"
                      onClick={() => updateState("revenueShare", Math.min(100, state.revenueShare + 1))}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
                      <Box className="w-4 h-4 text-blue-500" /> Lockers
                    </span>
                    <span className="font-bold">{financials.mix.lockers.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${financials.mix.lockers}%` }}
                    />
                  </div>
                  <p className="text-xs text-right text-gray-400">
                    {CURRENCY} {financials.dailyLockerGross.toFixed(0)} / day
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Bike className="w-4 h-4 text-green-500" /> Scooters
                    </span>
                    <span className="font-bold">{financials.mix.scooters.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${financials.mix.scooters}%` }}
                    />
                  </div>
                  <p className="text-xs text-right text-gray-400">
                    {CURRENCY} {financials.dailyScooterGross.toFixed(0)} / day
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-purple-500" /> Transfers
                    </span>
                    <span className="font-bold">{financials.mix.transfers.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 transition-all duration-500"
                      style={{ width: `${financials.mix.transfers}%` }}
                    />
                  </div>
                  <p className="text-xs text-right text-gray-400">
                    {CURRENCY} {financials.dailyTransferGross.toFixed(0)} / day
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
                    {/* Gauge Background */}
                    <div className="absolute bottom-0 w-full h-full bg-gray-100 rounded-t-full" />
                    {/* Gauge Fill */}
                    <div
                      className={`absolute bottom-0 w-full h-full rounded-t-full origin-bottom transition-all duration-700 ${
                        spaceMetrics.widthNeeded > state.availableWallSpace ? "bg-red-500" : "bg-[#FF9900]"
                      }`}
                      style={{
                        transform: `rotate(${Math.min(180, (spaceMetrics.widthNeeded / (state.availableWallSpace || 1)) * 180) - 180}deg)`,
                      }}
                    />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-32 h-32 bg-white rounded-full flex items-center justify-center pt-2 shadow-inner">
                      <div className="text-center -mt-16">
                        <p className="text-2xl font-bold">{spaceMetrics.widthNeeded.toFixed(1)}m</p>
                        <p className="text-[10px] text-gray-400">Required</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Total Units (14 lockers/unit)</span>
                      <span className="font-mono font-bold">{spaceMetrics.unitsNeeded}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Available Space</span>
                      <span className="font-mono font-bold">{state.availableWallSpace}m</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-gray-600">Status</span>
                      <span
                        className={`font-bold ${spaceMetrics.widthNeeded > state.availableWallSpace ? "text-red-600" : "text-green-600"}`}
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
          <StatCard
            title="Total Contract Value (Net)"
            value={`${CURRENCY} ${financials.partnerContract.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            subtitle={`Over ${state.contractTerm} years`}
            icon={Briefcase}
            highlight={true}
          />
        </div>
      </main>
      {/* Added Footer to the main dashboard view */}
      <Footer />
    </div>
  )
}

// --- Proposal View Component ---

const ProposalView = ({
  state,
  financials,
  onBack,
  spaceMetrics,
}: {
  state: AppState
  financials: any
  onBack: () => void
  spaceMetrics: any
}) => {
  return (
    <div className="min-h-screen bg-white text-black font-sans print:p-0 p-8 max-w-[210mm] mx-auto">
      {/* Print Controls */}
      <div className="print:hidden mb-8 flex justify-between items-center bg-gray-100 p-4 rounded-lg">
        <Button variant="outline" onClick={onBack}>
          Back to Dashboard
        </Button>
        <div className="flex gap-2">
          <Button onClick={() => window.print()} className="bg-[#FF9900] hover:bg-[#E68A00] text-white">
            <Download className="w-4 h-4 mr-2" /> Print PDF
          </Button>
        </div>
      </div>

      {/* A4 Content Container */}
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-[#FF9900] pb-6">
          <div>
            <div className="w-12 h-12 bg-[#FF9900] rounded flex items-center justify-center text-white font-bold text-xl mb-4">
              CL
            </div>
            <h1 className="text-3xl font-bold uppercase tracking-tight">Partnership Proposal</h1>
            <p className="text-gray-500 mt-2">Prepared for {state.clientName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Date</p>
            <p className="font-medium">{new Date().toLocaleDateString()}</p>
            <p className="text-sm text-gray-400 mt-2">Valid Until</p>
            <p className="font-medium">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Executive Summary */}
        <section>
          <h2 className="text-xl font-bold mb-4 text-[#FF9900] uppercase">Executive Summary</h2>
          <p className="text-gray-700 leading-relaxed">
            CityLockers proposes a strategic revenue-sharing partnership to monetize underutilized space at{" "}
            <span className="font-bold">{state.clientName}</span>. By implementing our automated smart locker and
            service ecosystem, we project a total net income of{" "}
            <span className="font-bold">
              {CURRENCY} {financials.partnerContract.toLocaleString()}
            </span>{" "}
            over the next {state.contractTerm} years. This solution requires zero capital expenditure from your side,
            with operations fully managed by CityLockers.
          </p>
        </section>

        {/* Financial Outlook */}
        <section>
          <h2 className="text-xl font-bold mb-4 text-[#FF9900] uppercase">Projected Partner Income</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 border-l-4 border-[#FF9900]">
              <p className="text-xs uppercase text-gray-500">Annual Net</p>
              <p className="text-2xl font-bold">
                {CURRENCY} {financials.partnerAnnual.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 border-l-4 border-gray-300">
              <p className="text-xs uppercase text-gray-500">Monthly Net</p>
              <p className="text-2xl font-bold">
                {CURRENCY} {financials.partnerMonthly.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-4 border-l-4 border-gray-300">
              <p className="text-xs uppercase text-gray-500">Partner Share</p>
              <p className="text-2xl font-bold">{state.revenueShare}%</p>
            </div>
          </div>

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2 font-bold text-gray-600">Year</th>
                <th className="text-right py-2 font-bold text-gray-600">Growth Factor</th>
                <th className="text-right py-2 font-bold text-gray-600">Projected Net Income</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(state.contractTerm)].map((_, i) => {
                // Simple 5% YoY growth projection for the table visual
                const growth = 1 + i * 0.05
                return (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3">Year {i + 1}</td>
                    <td className="py-3 text-right text-gray-500">{(growth * 100 - 100).toFixed(0)}%</td>
                    <td className="py-3 text-right font-mono font-bold">
                      {CURRENCY}{" "}
                      {(financials.partnerAnnual * growth).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                )
              })}
              <tr className="bg-gray-50 font-bold">
                <td className="py-3 pl-2">Total ({state.contractTerm} Years)</td>
                <td className="py-3"></td>
                <td className="py-3 text-right font-mono pr-2">
                  {CURRENCY} {financials.partnerContract.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Scope of Work */}
        <section>
          <h2 className="text-xl font-bold mb-4 text-[#FF9900] uppercase">Scope of Deployment</h2>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold mb-2 text-gray-800">Hardware Configuration</h3>
              <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600">
                <li>
                  <strong>Location:</strong> {state.propertyType.toUpperCase()} - Multiplier {state.locationFactor}x
                </li>
                <li>
                  <strong>Space Required:</strong> {spaceMetrics.widthNeeded.toFixed(1)} meters (Available:{" "}
                  {state.availableWallSpace}m)
                </li>
                <li>
                  <strong>Total Lockers:</strong> {spaceMetrics.totalLockers} compartments
                </li>
                <li className="ml-4 text-xs">Medium: {state.lockerM.qty}</li>
                <li className="ml-4 text-xs">Large: {state.lockerL.qty}</li>
                <li className="ml-4 text-xs">Extra Large: {state.lockerXL.qty}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-2 text-gray-800">Additional Services</h3>
              <ul className="list-disc pl-5 text-sm space-y-1 text-gray-600">
                <li>
                  <strong>E-Scooter Fleet:</strong>{" "}
                  {state.scootersEnabled ? `${state.scooters.units} Units` : "Not Included"}
                </li>
                <li>
                  <strong>Luggage Transfer:</strong> {state.transfersEnabled ? "Active" : "Not Included"}
                </li>
                <li>
                  <strong>Maintenance:</strong> Full 24/7 Support Included
                </li>
                <li>
                  <strong>Insurance:</strong> Comprehensive Coverage Included
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
