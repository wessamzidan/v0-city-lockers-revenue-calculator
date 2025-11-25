"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from "react"

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

/**
 * Seasonality multiplier for revenue calculations
 * Formula: (5 months at 115% + 1 month at 85% + 6 months at 100%) / 12
 * Represents typical tourist season patterns in Dubai
 */
export const SEASONALITY_FACTOR = (5 * 1.15 + 1 * 0.85 + 6 * 1.0) / 12

/** Default currency for all calculations */
export const CURRENCY = "AED"

/** Primary brand color for CityLockers */
export const PRIMARY_COLOR = "#FF9900"

/**
 * Location multipliers affecting revenue potential
 * Higher multiplier = higher traffic/demand areas
 */
export const LOCATIONS = [
  { label: "Standard City", value: 1.0 },
  { label: "Tourist Hub", value: 1.5 },
  { label: "Downtown", value: 1.2 },
  { label: "Transit Zone", value: 1.3 },
  { label: "Remote Area", value: 0.8 },
] as const

/**
 * Supported property types for installation
 */
export const PROPERTY_TYPES = [
  { label: "Hospitality (Hotel)", value: "hotel" },
  { label: "Residential", value: "residential" },
  { label: "Commercial (Mall)", value: "commercial" },
  { label: "Entertainment Venue", value: "entertainment" },
  { label: "Waterpark", value: "waterpark" },
] as const

/**
 * Transfer volume period options for daily calculations
 */
export const TRANSFER_PERIODS = [
  { label: "Per Day", value: 365 },
  { label: "Per Week", value: 52 },
  { label: "Per Month", value: 12 },
] as const

/**
 * Locker specifications from CityLockers product catalog
 * Dimensions in cm (Width x Depth x Height)
 */
export const LOCKER_SPECS = {
  hospitality: {
    XL: { dimensions: "48cm x 55cm x 85cm", fits: "Large suitcases, oversized bags, golf bags" },
    L: { dimensions: "48cm x 33cm x 85cm", fits: "Medium suitcases, carry-on bags, backpacks" },
    M: { dimensions: "48cm x 28cm x 58cm", fits: "Small bags, laptops, personal items" },
  },
  residential: {
    XL: { dimensions: "47cm x 85cm x 51cm", fits: "Large packages, bulk deliveries" },
    M: { dimensions: "47cm x 30cm x 51cm", fits: "Standard packages, parcels" },
    S: { dimensions: "47cm x 20cm x 51cm", fits: "Small packages, documents" },
    Laundry: { dimensions: "35cm x 200cm x 51cm", fits: "Laundry bags, garment bags" },
  },
  scooter: {
    Scooter: { dimensions: "50cm x 140cm x 70cm", fits: "E-scooter with secure mount & charging" },
    Accessories: { dimensions: "50cm x 33cm x 70cm", fits: "Helmet, charger, accessories" },
  },
  entertainment: {
    Standard: { dimensions: "35cm x 35cm x 35cm", fits: "Bags, jackets, personal items" },
  },
} as const

/**
 * Reference pricing in AED for all services
 */
export const PRICING_REFERENCE = {
  luggage: {
    M: { "3hr": 9, "6hr": 16, "12hr": 19, "24hr": 32, "7day": 128 },
    L: { "3hr": 13, "6hr": 19, "12hr": 26, "24hr": 38, "7day": 152 },
    XL: { "3hr": 16, "6hr": 26, "12hr": 31, "24hr": 44, "7day": 176 },
  },
  scooter: {
    hourly: 1.13,
    monthly: 149,
  },
  transfer: {
    starting: 149,
    note: "Up to 4 bags",
  },
} as const

// ============================================================================
// STATE TYPES & DEFAULTS
// ============================================================================

/**
 * Default application state for new configurations
 * Based on typical hotel installation (Anantara reference)
 */
export const DEFAULT_STATE = {
  clientName: "New Client",
  propertyType: "hotel",
  locationFactor: 1.2,
  contractTerm: 5,
  revenueShare: 20,
  totalKeys: 150,
  avgDailyTraffic: 45,
  lockerM: { qty: 3, price: 20, occupancy: 60 },
  lockerL: { qty: 5, price: 30, occupancy: 55 },
  lockerXL: { qty: 6, price: 40, occupancy: 50 },
  availableWallSpace: 5,
  scootersEnabled: false,
  scooters: { units: 5, hourlyRate: 15, utilization: 4 },
  transfersEnabled: false,
  transfers: {
    volume: 10,
    period: 365,
    price: 50,
    isPortfolio: false,
  },
} as const

export type AppState = typeof DEFAULT_STATE

/**
 * Saved scenario structure for localStorage persistence
 */
export type Scenario = {
  name: string
  date: string
  data: AppState
}

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate daily revenue for a locker type
 * Formula: Price × Quantity × (Occupancy/100) × LocationMultiplier × Seasonality
 *
 * @param qty - Number of lockers
 * @param price - Daily price per locker
 * @param occupancy - Expected occupancy percentage (0-100)
 * @param locationFactor - Location multiplier
 * @returns Daily gross revenue for this locker type
 */
export const calculateLockerRevenue = (
  qty: number,
  price: number,
  occupancy: number,
  locationFactor: number,
): number => {
  return price * qty * (occupancy / 100) * locationFactor * SEASONALITY_FACTOR
}

/**
 * Calculate space utilization metrics
 * Standard: 1 Unit = 14 Lockers = 2.2m wall width
 *
 * @param m - Medium locker quantity
 * @param l - Large locker quantity
 * @param xl - Extra large locker quantity
 * @returns Space metrics including total lockers, width needed, and units needed
 */
export const calculateSpaceUtilization = (
  m: number,
  l: number,
  xl: number,
): {
  totalLockers: number
  widthNeeded: number
  unitsNeeded: number
} => {
  const totalLockers = m + l + xl
  const unitsNeeded = Math.ceil(totalLockers / 14)
  const widthNeeded = (totalLockers / 14) * 2.2
  return { totalLockers, widthNeeded, unitsNeeded }
}

/**
 * Calculate all financial metrics for a given state
 * Returns both gross and net (partner share) figures
 *
 * @param state - Current application state
 * @returns Complete financial breakdown including daily, monthly, annual figures
 */
export const calculateFinancials = (state: AppState) => {
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

  // Calculate daily locker revenue by size
  const dailyRevM = calculateLockerRevenue(lockerM.qty, lockerM.price, lockerM.occupancy, locationFactor)
  const dailyRevL = calculateLockerRevenue(lockerL.qty, lockerL.price, lockerL.occupancy, locationFactor)
  const dailyRevXL = calculateLockerRevenue(lockerXL.qty, lockerXL.price, lockerXL.occupancy, locationFactor)
  const dailyLockerGross = dailyRevM + dailyRevL + dailyRevXL

  // Calculate scooter revenue if enabled
  let dailyScooterGross = 0
  if (scootersEnabled) {
    dailyScooterGross =
      scooters.units * scooters.hourlyRate * scooters.utilization * locationFactor * SEASONALITY_FACTOR
  }

  // Calculate transfer revenue if enabled
  let dailyTransferGross = 0
  if (transfersEnabled) {
    const dailyVolume = transfers.volume * (transfers.period / 365)
    dailyTransferGross = dailyVolume * transfers.price * SEASONALITY_FACTOR
  }

  // Aggregate totals
  const totalDailyGross = dailyLockerGross + dailyScooterGross + dailyTransferGross
  const totalAnnualGross = totalDailyGross * 365

  // Calculate partner's share (NET figures)
  const partnerDaily = totalDailyGross * (revenueShare / 100)
  const partnerMonthly = partnerDaily * 30
  const partnerAnnual = totalAnnualGross * (revenueShare / 100)
  const partnerContract = partnerAnnual * contractTerm

  // Calculate revenue mix percentages
  const totalGross = Math.max(totalDailyGross, 0.01) // Prevent division by zero
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
}

// ============================================================================
// CONTEXT DEFINITION
// ============================================================================

interface CityLockersContextType {
  state: AppState
  setState: React.Dispatch<React.SetStateAction<AppState>>
  scenarios: Scenario[]
  setScenarios: React.Dispatch<React.SetStateAction<Scenario[]>>
  updateState: (path: string, value: unknown) => void
  saveScenario: (name?: string) => void
  loadScenario: (data: AppState) => void
  deleteScenario: (index: number) => void
  financials: ReturnType<typeof calculateFinancials>
  spaceMetrics: ReturnType<typeof calculateSpaceUtilization>
}

const CityLockersContext = createContext<CityLockersContextType | undefined>(undefined)

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

/**
 * CityLockersProvider
 *
 * Global state provider for the Revenue Calculator application.
 * Manages calculator state, scenarios, and localStorage persistence.
 *
 * Features:
 * - Automatic state persistence to localStorage
 * - Scenario save/load/delete functionality
 * - Computed financial metrics
 * - Space utilization calculations
 *
 * @param children - Child components to wrap
 */
export function CityLockersProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE)
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("citylockers_current_state")
    if (savedState) {
      try {
        setState(JSON.parse(savedState))
      } catch (e) {
        console.error("Failed to load state from localStorage:", e)
      }
    }

    const savedScenarios = localStorage.getItem("citylockers_scenarios")
    if (savedScenarios) {
      try {
        setScenarios(JSON.parse(savedScenarios))
      } catch (e) {
        console.error("Failed to load scenarios from localStorage:", e)
      }
    }

    setIsHydrated(true)
  }, [])

  // Persist state changes to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("citylockers_current_state", JSON.stringify(state))
    }
  }, [state, isHydrated])

  /**
   * Update a nested state property using dot notation
   * e.g., updateState("lockerM.qty", 5)
   */
  const updateState = useCallback((path: string, value: unknown) => {
    setState((prev) => {
      const newState = { ...prev }
      const parts = path.split(".")

      if (parts.length === 1) {
        ;(newState as Record<string, unknown>)[parts[0]] = value
      } else {
        let current = newState as Record<string, unknown>
        for (let i = 0; i < parts.length - 1; i++) {
          current[parts[i]] = { ...(current[parts[i]] as Record<string, unknown>) }
          current = current[parts[i]] as Record<string, unknown>
        }
        current[parts[parts.length - 1]] = value
      }

      return newState
    })
  }, [])

  /**
   * Save current state as a named scenario
   */
  const saveScenario = useCallback(
    (name?: string) => {
      const scenarioName = name || `${state.clientName} - ${new Date().toLocaleDateString()}`
      const newScenarios = [...scenarios, { name: scenarioName, date: new Date().toISOString(), data: state }]
      setScenarios(newScenarios)
      localStorage.setItem("citylockers_scenarios", JSON.stringify(newScenarios))
    },
    [state, scenarios],
  )

  /**
   * Load a scenario into current state
   */
  const loadScenario = useCallback((data: AppState) => {
    setState(data)
  }, [])

  /**
   * Delete a scenario by index
   */
  const deleteScenario = useCallback(
    (index: number) => {
      const newScenarios = scenarios.filter((_, i) => i !== index)
      setScenarios(newScenarios)
      localStorage.setItem("citylockers_scenarios", JSON.stringify(newScenarios))
    },
    [scenarios],
  )

  // Memoize computed values
  const financials = useMemo(() => calculateFinancials(state), [state])
  const spaceMetrics = useMemo(
    () => calculateSpaceUtilization(state.lockerM.qty, state.lockerL.qty, state.lockerXL.qty),
    [state.lockerM.qty, state.lockerL.qty, state.lockerXL.qty],
  )

  const contextValue = useMemo(
    () => ({
      state,
      setState,
      scenarios,
      setScenarios,
      updateState,
      saveScenario,
      loadScenario,
      deleteScenario,
      financials,
      spaceMetrics,
    }),
    [state, scenarios, updateState, saveScenario, loadScenario, deleteScenario, financials, spaceMetrics],
  )

  return <CityLockersContext.Provider value={contextValue}>{children}</CityLockersContext.Provider>
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * useCityLockers Hook
 *
 * Access the CityLockers context for state management and calculations.
 * Must be used within a CityLockersProvider.
 *
 * @returns Context with state, actions, and computed metrics
 * @throws Error if used outside of provider
 */
export function useCityLockers() {
  const context = useContext(CityLockersContext)
  if (context === undefined) {
    throw new Error("useCityLockers must be used within a CityLockersProvider")
  }
  return context
}
