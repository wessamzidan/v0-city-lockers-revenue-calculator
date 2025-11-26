# CityLockers Revenue Calculator - Meta Prompt

> **Purpose:** A single comprehensive prompt to generate the complete CityLockers Revenue Calculator web application from scratch. This prompt consolidates all requirements, enhancements, and best practices discovered through iterative development.

---

## THE PROMPT

\`\`\`
ACT AS: Senior Full Stack Developer, UX Expert & Product Architect.

TASK: Build "CityLockers Revenue Calculator" – A comprehensive, multi-page Next.js application for B2B smart locker revenue modeling and partner proposal generation.

---

## 1. PROJECT OVERVIEW

### Identity & Disclaimer
- **App Name:** CityLockers Revenue Calculator
- **Tagline:** Smart Storage Revenue Modeling
- **Disclaimer (Required in Footer):** "This web app is a personal project by Wessam Zidan ('The Developer'). It is not affiliated with, endorsed by, or officially supported by CityLockers. Provided for personal use only, without warranties or liabilities."
- **Developer Contact:**
  - Name: Wessam Zidan
  - Title: Business Development Executive @ CityLockers
  - Phone: +971 55 711 5562
  - Email: wessam.zidan@citylockers.com (work), zidanwessam@gmail.com (personal)
  - LinkedIn: linkedin.com/in/wessamzidan
  - Website: wessamzidan.com
  - GitHub: github.com/wessamzidan
  - Facebook: facebook.com/zidanwessam

### Business Model Context
- **Zero Capex - Zero Opex Model:** Partners pay nothing for installation, maintenance, or operation
- CityLockers handles all hardware, software, support, and marketing
- Partners earn passive commission from revenue share
- Contract terms typically 3-5 years with 6-month termination notice

---

## 2. DESIGN SYSTEM

### Theme: Industrial Tech
- Clean, white cards with subtle borders
- Professional, trustworthy appearance suitable for B2B hospitality sales

### Color Palette (Exactly 5 Colors)
- **Primary (Brand):** #FF9900 (CityLockers Orange) - CTAs, highlights, key metrics
- **Secondary:** Slate/Gray tones for text hierarchy
- **Background:** White (#FFFFFF) and subtle grays (#F8FAFC)
- **Accent Success:** Emerald green for positive indicators
- **Accent Dark:** Slate-900 (#0F172A) for header/footer

### Typography
- Font Family: Inter or Geist (clean sans-serif)
- Hierarchy: Clear distinction between headings, body, and labels
- Use `text-balance` for titles, `text-pretty` for paragraphs

### Semantic Design Tokens (Required)
Define in globals.css and use throughout:
- `--primary`, `--primary-foreground` (Orange #FF9900)
- `--secondary`, `--secondary-foreground`
- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`, `--destructive-foreground`
- `--success`, `--success-foreground`
- `--warning`, `--warning-foreground`
- `--info`, `--info-foreground`
- `--border`, `--input`, `--ring`
- `--chart-1` through `--chart-5`

### Icons
- Use `lucide-react` exclusively
- Consistent sizing: 16px (small), 20px (default), 24px (large)

---

## 3. TECHNICAL ARCHITECTURE

### Framework & Stack
- Next.js 14+ with App Router
- TypeScript (strict mode)
- Tailwind CSS v4 with semantic tokens
- shadcn/ui components
- React Context for global state
- localStorage for persistence
- Server Actions for API calls

### Critical Stability Constraint
- Define sub-components as stable references (outside render or memoized)
- Use `useCallback` for event handlers passed to children
- Use `useMemo` for expensive calculations
- Prevent re-mounting on every keystroke (keyboard must NEVER close while typing on mobile)

### File Structure
\`\`\`
app/
├── page.tsx                 # Dashboard
├── configuration/page.tsx   # Configuration
├── scenarios/page.tsx       # Scenario Management
├── proposal/page.tsx        # PDF Proposal View
├── actions/
│   └── chat.ts             # AI Assistant Server Action
├── layout.tsx              # Root layout with providers
├── globals.css             # Design tokens & global styles
└── manifest.json           # PWA manifest

components/
├── citylockers/
│   ├── header.tsx          # Navigation header
│   ├── footer.tsx          # Contact & links footer
│   ├── whatsapp-button.tsx # Floating WhatsApp CTA
│   └── ai-assistant.tsx    # AI chatbot component
└── ui/                     # shadcn components

lib/
├── citylockers-context.tsx # Global state & calculations
└── utils.ts                # Utility functions

docs/
├── README.md               # Project overview
├── PRD.md                  # Product Requirements
├── ARCHITECTURE.md         # Technical architecture
├── CITYLOCKERS_CONTEXT.md  # Company knowledge base
└── META_PROMPT.md          # This file
\`\`\`

---

## 4. CORE FEATURES

### 4.1 Calculation Engine

#### Revenue Formulas
\`\`\`
Seasonality Factor = (5 months × 1.15 + 1 month × 0.85 + 6 months × 1.0) / 12
Location Multiplier = Based on property type (Hotel: 1.0, Mall: 1.2, Airport: 1.5, etc.)

Locker Revenue = Price × Quantity × Occupancy% × LocationMultiplier × Seasonality × 365 × Properties
Scooter Revenue = (Hourly bookings + Subscriptions) × Rates × Occupancy% × 365 × Properties
Delivery Revenue = Volume × Price × Period Multiplier × Properties (if per-property scope)

Gross Revenue = Locker + Scooter + Delivery
Partner Net Revenue = Gross Revenue × Revenue Share %
\`\`\`

#### Standard Unit Logic
- 1 Locker Unit = 14 Lockers = 2.2m width
- Calculate Required Width vs Available Width
- Visual gauge showing space utilization

### 4.2 Multi-Property Support
- Number of properties input (for hotel clusters/chains)
- Locker inventory: per-property (multiplied) or shared
- Delivery volume: per-property or total across portfolio
- Clear visual indicators showing calculations (e.g., "6 × 3 = 18 total")

### 4.3 Dashboard Page (`/`)
**Hero Section:**
- Large display: "Estimated Partner Annual Income" (Net, not Gross)
- "Zero Capex - Zero Opex Model" badge
- Inline Revenue Share % editor with +/- buttons
- Property count badge (if > 1)

**Revenue Mix Charts:**
- CSS-based progress bars (not external chart library)
- Segments: Luggage Storage, Scooter Storage, Luggage Delivery
- Percentage and AED value labels

**Space Utilization Widget:**
- Visual gauge showing locker units required
- Required width vs available width comparison
- Warning if space exceeded

**Value Proposition Cards:**
- Revenue Generation
- Enhanced Guest Services  
- Premium Security
- Zero Investment

### 4.4 Configuration Page (`/configuration`)

**Business Configuration:**
- Location Name (text input)
- Property Type (dropdown: Hotel, Resort, Mall, Airport, Residential, Mixed-Use)
- Number of Properties (for clusters, with +/- buttons)
- Contract Term (3/5/7/10 years)
- Revenue Share % (slider 15-35%, default 20%)
- Available Wall Space (meters)

**Property Metrics:**
- Total Keys/Units
- Average Daily Traffic (checkouts/packages)

**Locker Inventory Section:**
For each size (Medium, Large, XL):
- Quantity input with +/- buttons
- Occupancy slider (0-100%)
- Info tooltip with dimensions and what fits:
  - **Medium:** 48×28×58cm - Hand luggage, backpacks, small bags
  - **Large:** 48×33×85cm - Regular suitcases, carry-ons
  - **XL:** 48×55×85cm - Large suitcases, sports equipment

**Scooter Storage Section:**
- Toggle On/Off
- Locker quantity
- Hourly bookings per day
- Monthly subscriptions
- Pricing display (AED 1.13/hour, AED 149/month)
- Dimensions: Scooter 50×140×70cm, Accessories 50×33×70cm

**Luggage Delivery Service Section:**
- Toggle On/Off
- Airport Selection dropdown with pricing:
  | Airport | Code | Distance | Price |
  |---------|------|----------|-------|
  | Dubai International | DXB | ~25km | AED 149 |
  | Dubai World Central | DWC | ~45km | AED 199 |
  | Abu Dhabi International | AUH | ~130km | AED 299 |
  | Sharjah International | SHJ | ~15km | AED 149 |
  | Ras Al Khaimah | RKT | ~100km | AED 249 |
  | Fujairah International | FJR | ~120km | AED 299 |
- Volume input with period selector (Per Day/Week/Month)
- Scope toggle: Per Property / Total (for multi-property)
- Custom price override option
- **Note:** "Prices are default rates subject to discussion between CityLockers and the partner."

**Locker Specifications Reference:**
Expandable/collapsible section showing:
- All locker types with full specs
- Features: SGL Construction, Motor Driven Locks, 12" Kiosk, etc.
- Visual dimension diagrams

**Pricing Reference Tables:**
- Luggage storage rates (3hr/6hr/12hr/24hr/7day)
- Scooter rates (hourly/subscription)

### 4.5 Scenarios Page (`/scenarios`)

**Scenario Cards Grid:**
- Saved scenario cards showing:
  - Name, location, date saved
  - Key metrics (Annual Income, Properties, Share %)
  - Load / Delete buttons

**Actions:**
- Save Current (modal with name input)
- Export All (JSON download)
- Import (JSON file upload)
- Clear All (with confirmation)

**localStorage Structure:**
\`\`\`typescript
interface SavedScenario {
  id: string;
  name: string;
  savedAt: string;
  state: CityLockersState;
}
\`\`\`

### 4.6 Proposal Page (`/proposal`)

**Print-Friendly A4 Layout:**
- Optimized for PDF generation via browser print
- Hide navigation, show only proposal content
- Page break hints for multi-page

**Sections:**
1. **Header:** CityLockers branding + Partner name
2. **Executive Summary:** Key metrics, business model, value props
3. **Revenue Breakdown:** Detailed table by service type
4. **3-Year Financial Outlook:** Year 1/2/3 projections (5% growth)
5. **Scope of Work:** What CityLockers provides
6. **Terms:** Contract duration, commission, termination
7. **Footer:** Developer contact details

**Actions:**
- "Save to PDF" button (triggers window.print())
- Back to Dashboard link

---

## 5. SHARED COMPONENTS

### 5.1 Header
- Logo: Lock icon + "CityLockers Revenue Calculator"
- Navigation: Dashboard, Configuration, Scenarios, Proposal
- Active state highlighting
- Mobile: Hamburger menu with slide-out drawer

### 5.2 Footer
**Three Columns:**
1. **Branding:** Wessam Zidan, Business Development Executive @ CityLockers, tagline
2. **Quick Links:** Dashboard, Configuration, Company Website (citylockers.com)
3. **Contact Developer:** Name, phone, email, WhatsApp button

**Social Icons Row:** Website, LinkedIn, GitHub, Facebook

**Bottom:** Disclaimer + Copyright

### 5.3 Floating WhatsApp Button
- Fixed position bottom-right
- Green WhatsApp icon with pulse animation
- Opens: `https://wa.me/971557115562?text=Hi%20Wessam...`
- Tooltip on hover: "Chat on WhatsApp"

### 5.4 AI Assistant

**UI:**
- Floating button (bottom-right, above WhatsApp)
- BotMessageSquare icon
- Expandable chat panel
- Message history with user/assistant styling
- Input field with send button
- Close button

**Backend:**
- Server Action calling OpenRouter API
- Model: `openai/gpt-oss-20b:free` (or current free model)
- Environment variable: `OPENROUTER_API_KEY`

**System Prompt Context (Comprehensive):**
Include full CityLockers knowledge:
- Company info (founded Dubai 2025, team)
- All locker types with exact specifications
- All services (storage, transfer, delivery)
- Pricing tables
- Business model (Zero Capex/Opex)
- Host and user benefits
- Software features (Kiosk, User App, Management Portal)
- Technology specs (motor locks, SGL, sensors)

**Behavior:**
- Answer questions about CityLockers products/services
- Help with calculator usage
- Direct to citylockers.com for official quotes
- Suggest contacting Wessam for partnership inquiries

**Message Formatting:**
- Parse **bold**, *italic*, bullet points
- Style with brand colors
- Scrollable message history

---

## 6. STATE MANAGEMENT

### Context Provider Structure
\`\`\`typescript
interface CityLockersState {
  // Business Config
  location: string;
  propertyType: string;
  numberOfProperties: number;
  contractTerm: number;
  revenueShare: number;
  availableWallSpace: number;
  
  // Property Metrics
  totalKeys: number;
  avgDailyTraffic: number;
  
  // Lockers
  lockerM: { qty: number; occupancy: number };
  lockerL: { qty: number; occupancy: number };
  lockerXL: { qty: number; occupancy: number };
  
  // Scooters
  scootersEnabled: boolean;
  scooters: {
    qty: number;
    hourlyBookings: number;
    subscriptions: number;
    occupancy: number;
  };
  
  // Delivery
  deliveryEnabled: boolean;
  delivery: {
    selectedAirport: string;
    volume: number;
    period: 'day' | 'week' | 'month';
    scope: 'per-property' | 'total';
    customPrice: number | null;
  };
}
\`\`\`

### Hydration Safety
- Merge localStorage data with defaults on load
- Handle missing properties from older saves
- Prevent SSR/client mismatch with `isHydrated` flag

---

## 7. SEO & META

### Page Metadata
\`\`\`typescript
export const metadata: Metadata = {
  title: 'CityLockers Revenue Calculator | Smart Storage Revenue Modeling',
  description: 'B2B revenue calculator for CityLockers smart locker partnerships. Model passive income from luggage storage, scooter lockers, and delivery services.',
  keywords: ['smart lockers', 'revenue calculator', 'B2B', 'hospitality', 'luggage storage', 'Dubai'],
  authors: [{ name: 'Wessam Zidan' }],
  creator: 'Wessam Zidan',
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: 'https://citylockers-calculator.vercel.app',
    title: 'CityLockers Revenue Calculator',
    description: 'Model your passive income from smart locker partnerships',
    siteName: 'CityLockers Revenue Calculator',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CityLockers Revenue Calculator',
    description: 'Model your passive income from smart locker partnerships',
  },
  robots: {
    index: true,
    follow: true,
  },
};
\`\`\`

### Viewport
\`\`\`typescript
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#FF9900',
};
\`\`\`

---

## 8. PWA SUPPORT

### manifest.json
\`\`\`json
{
  "name": "CityLockers Revenue Calculator",
  "short_name": "CityLockers Calc",
  "description": "B2B revenue modeling for smart locker partnerships",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#FF9900",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
\`\`\`

### Service Worker (Optional)
- Cache static assets
- Offline fallback page
- Background sync for scenarios

---

## 9. ACCESSIBILITY

- Semantic HTML (`main`, `nav`, `header`, `footer`, `section`)
- ARIA labels on interactive elements
- `sr-only` class for screen reader text
- Keyboard navigation support
- Focus visible states
- Color contrast compliance (4.5:1 minimum)
- Alt text for any images
- Form labels and error messages

---

## 10. PERFORMANCE

- Memoize expensive calculations with `useMemo`
- Stable event handlers with `useCallback`
- Lazy load AI assistant component
- Optimize images (if any)
- Minimize client-side JavaScript
- Use Server Components where possible

---

## 11. RESPONSIVE DESIGN

### Breakpoints
- Mobile: < 640px (single column, stacked cards)
- Tablet: 640-1024px (2-column grids)
- Desktop: > 1024px (3-4 column grids, side-by-side layouts)

### Mobile-First Approach
- Touch-friendly targets (min 44px)
- Collapsible sections
- Bottom sheet modals
- Swipe gestures (optional)

---

## 12. DOCUMENTATION

Generate comprehensive docs:

1. **README.md** - Quick start, features, tech stack, deployment
2. **docs/PRD.md** - Full product requirements document
3. **docs/ARCHITECTURE.md** - Technical architecture, state flow, API
4. **docs/CITYLOCKERS_CONTEXT.md** - Complete company knowledge base
5. **CHANGELOG.md** - Version history

---

## 13. DEPLOYMENT

- Platform: Vercel
- Environment Variables:
  - `OPENROUTER_API_KEY` - For AI assistant
- Domain: Custom domain or Vercel subdomain
- Analytics: Vercel Analytics (optional)

---

## OUTPUT REQUIREMENTS

1. **Complete, runnable code** - No placeholders or TODOs
2. **All pages and components** - Dashboard, Configuration, Scenarios, Proposal, Header, Footer, WhatsApp, AI Assistant
3. **Full state management** - Context provider with all calculations
4. **Documentation** - README, PRD, Architecture docs
5. **Responsive design** - Mobile-first, works on all devices
6. **Semantic tokens** - Proper theming support
7. **Type safety** - Full TypeScript coverage
8. **Clean code** - JSDoc comments, consistent formatting
\`\`\`

---

## ENHANCEMENTS CHECKLIST

The following were identified as blind spots or improvements:

### Implemented
- [x] Multi-page architecture
- [x] Semantic color tokens
- [x] Multi-property support
- [x] AI assistant with company context
- [x] WhatsApp floating button
- [x] Luggage delivery with airport pricing
- [x] Comprehensive documentation
- [x] localStorage persistence
- [x] Scenario management
- [x] PDF proposal generation

### Recommended Additions
- [ ] **PWA Support** - manifest.json, service worker, offline mode
- [ ] **SEO Optimization** - Open Graph, Twitter cards, structured data
- [ ] **Analytics** - Vercel Analytics or Google Analytics
- [ ] **Error Boundaries** - Graceful error handling UI
- [ ] **Loading States** - Skeleton loaders for async operations
- [ ] **Dark Mode** - Full dark theme support (tokens ready)
- [ ] **Data Export** - CSV/Excel export for scenarios
- [ ] **Internationalization** - i18n ready structure for Arabic support
- [ ] **Rate Limiting** - Prevent AI API abuse
- [ ] **Input Validation** - Zod schemas for form validation
- [ ] **Keyboard Shortcuts** - Power user navigation
- [ ] **Onboarding Tour** - First-time user guide
- [ ] **Comparison Mode** - Side-by-side scenario comparison
- [ ] **Email Proposal** - Send proposal via email
- [ ] **QR Code** - Generate QR for proposal sharing
- [ ] **Version History** - Track changes to scenarios

---

## USAGE

Copy the prompt above and paste it into v0 or Claude to generate the complete application. The prompt is designed to be self-contained with all necessary context, specifications, and requirements.

For best results:
1. Start fresh with the complete prompt
2. Let the AI generate all files in one response
3. Test each page and feature
4. Iterate on specific improvements as needed

---

*Last Updated: November 2025*
*Author: Wessam Zidan*
