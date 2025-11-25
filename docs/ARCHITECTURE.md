# Technical Architecture

## CityLockers Revenue Calculator

---

## 1. System Overview

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL EDGE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Dashboard  │  │Configuration │  │   Scenarios  │          │
│  │   /          │  │/configuration│  │  /scenarios  │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                 │                 │                   │
│         └────────────┬────┴────────────────┘                   │
│                      │                                          │
│              ┌───────▼───────┐                                  │
│              │   Context     │◄──────► localStorage             │
│              │   Provider    │         (persistence)            │
│              └───────┬───────┘                                  │
│                      │                                          │
│         ┌────────────┼────────────┐                            │
│         │            │            │                            │
│  ┌──────▼──────┐ ┌───▼───┐ ┌─────▼─────┐                      │
│  │   Header    │ │Footer │ │AI Assistant│                      │
│  └─────────────┘ └───────┘ └─────┬─────┘                       │
│                                  │                              │
│                          ┌───────▼───────┐                      │
│                          │ Server Action │                      │
│                          │  /actions/    │                      │
│                          │   chat.ts     │                      │
│                          └───────┬───────┘                      │
│                                  │                              │
└──────────────────────────────────┼──────────────────────────────┘
                                   │
                           ┌───────▼───────┐
                           │  OpenRouter   │
                           │     API       │
                           └───────────────┘
\`\`\`

---

## 2. State Management

### 2.1 Context Provider

The `CityLockersProvider` manages all application state:

\`\`\`typescript
interface CityLockersState {
  // Client Information
  clientName: string
  location: string
  propertyType: string
  contractTerm: number
  revenueShare: number
  
  // Property Metrics
  totalKeys: number
  avgDailyTraffic: number
  availableWidth: number
  
  // Locker Inventory
  lockers: {
    medium: { qty: number; occupancy: number }
    large: { qty: number; occupancy: number }
    xl: { qty: number; occupancy: number }
  }
  
  // Services
  scootersEnabled: boolean
  scooterQty: number
  scooterOccupancy: number
  transfersEnabled: boolean
  transferVolume: number
  transferFrequency: string
  transferScope: string
}
\`\`\`

### 2.2 Computed Values (useMemo)

Performance-optimized calculations:

\`\`\`typescript
// Revenue calculations (memoized)
const revenueMetrics = useMemo(() => {
  const locationMultiplier = LOCATION_MULTIPLIERS[state.location]
  const seasonality = SEASONALITY_FACTOR
  // ... calculation logic
  return { lockerRevenue, scooterRevenue, transferRevenue, totalGross, partnerNet }
}, [state.lockers, state.location, state.revenueShare, ...])

// Space metrics (memoized)
const spaceMetrics = useMemo(() => {
  const totalLockers = state.lockers.medium.qty + state.lockers.large.qty + state.lockers.xl.qty
  const requiredWidth = (totalLockers / LOCKERS_PER_UNIT) * UNIT_WIDTH
  // ...
}, [state.lockers, state.availableWidth])
\`\`\`

### 2.3 Persistence

State automatically syncs to localStorage:

\`\`\`typescript
useEffect(() => {
  if (isHydrated) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }
}, [state, isHydrated])
\`\`\`

---

## 3. Component Architecture

### 3.1 Layout Hierarchy

\`\`\`
RootLayout (app/layout.tsx)
├── CityLockersProvider (context)
│   ├── Header (navigation)
│   ├── {children} (page content)
│   ├── Footer (contact info)
│   ├── WhatsAppButton (floating CTA)
│   └── AIAssistant (floating chat)
\`\`\`

### 3.2 Page Components

| Page | Route | Purpose |
|------|-------|---------|
| Dashboard | `/` | Revenue overview & metrics |
| Configuration | `/configuration` | Business parameter setup |
| Scenarios | `/scenarios` | Save/load configurations |
| Proposal | `/proposal` | Print-ready document |

### 3.3 Shared Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Header | `components/citylockers/header.tsx` | Navigation & branding |
| Footer | `components/citylockers/footer.tsx` | Contact & legal |
| AIAssistant | `components/citylockers/ai-assistant.tsx` | Chatbot interface |
| WhatsAppButton | `components/citylockers/whatsapp-button.tsx` | Quick contact CTA |

---

## 4. API Integration

### 4.1 AI Chat (Server Action)

\`\`\`typescript
// app/actions/chat.ts
'use server'

export async function sendChatMessage(
  message: string,
  history: Array<{ role: string; content: string }>,
  calculatorContext: string
): Promise<{ success: boolean; message?: string; error?: string }>
\`\`\`

**Flow:**
1. Client sends message + history + calculator context
2. Server action constructs system prompt with CityLockers knowledge
3. Request sent to OpenRouter API
4. Response returned to client

### 4.2 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | No | Enables AI assistant |

---

## 5. Performance Optimizations

### 5.1 Memoization
- `useMemo` for expensive calculations (revenue, space metrics)
- `useCallback` for stable function references
- Prevents unnecessary re-renders

### 5.2 Component Stability
- Sub-components defined outside main component
- Prevents re-mounting on keystroke (mobile keyboard issue)

### 5.3 Lazy Loading
- AI assistant loaded on demand
- Chat history persisted in component state only

---

## 6. Security Considerations

### 6.1 API Key Protection
- OpenRouter API key stored server-side only
- Never exposed to client bundle
- Accessed via Server Actions

### 6.2 Input Validation
- Numeric inputs bounded with min/max
- String inputs sanitized before display

---

## 7. Deployment

### 7.1 Vercel Configuration
- Automatic deployments from GitHub main branch
- Edge runtime for optimal performance
- Environment variables configured in Vercel dashboard

### 7.2 Build Process
\`\`\`bash
npm run build
# Outputs: .next/ directory
# Static assets optimized
# Server components pre-rendered
