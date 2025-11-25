# Product Requirements Document (PRD)

## CityLockers Revenue Calculator v1.0

**Document Version:** 1.0  
**Last Updated:** November 25, 2025  
**Author:** Wessam Zidan  
**Status:** Production

---

## 1. Executive Summary

### 1.1 Product Vision
A web-based B2B revenue modeling tool that enables CityLockers sales professionals to quickly generate accurate partnership proposals, calculate projected revenues, and present compelling business cases to potential hotel and property partners.

### 1.2 Problem Statement
Sales professionals need a reliable, professional tool to:
- Calculate projected partner revenues based on various configurations
- Present the Zero Capex/Zero Opex business model clearly
- Generate standardized, branded proposal documents
- Compare multiple scenarios for different properties

### 1.3 Target Users
- CityLockers Business Development Executives
- Partnership Managers
- Property owners evaluating CityLockers installations

---

## 2. Goals & Success Metrics

### 2.1 Business Goals
| Goal | Target | Measurement |
|------|--------|-------------|
| Reduce proposal generation time | < 5 minutes | Time from start to PDF |
| Increase proposal consistency | 100% | Standardized calculations |
| Improve client engagement | +25% | AI assistant interactions |

### 2.2 User Goals
- Quickly configure property-specific parameters
- See real-time revenue projections
- Save and compare multiple scenarios
- Generate professional PDF proposals
- Get instant answers about CityLockers products

---

## 3. Features & Requirements

### 3.1 Dashboard (Priority: P0)

**Purpose:** Display key financial metrics at a glance

| Requirement | Description | Status |
|-------------|-------------|--------|
| Hero Metric | Display "Estimated Partner Annual Income" prominently | Done |
| Revenue Share Editor | Inline +/- controls to adjust partner % (15-30%) | Done |
| Business Model Badge | "Zero Capex - Zero Opex" highlight | Done |
| Revenue Mix Chart | CSS progress bars for Luggage/Scooters/Transfers | Done |
| Space Utilization | Visual gauge showing wall space usage | Done |
| Value Props | Cards highlighting convenience, security, support | Done |

### 3.2 Configuration (Priority: P0)

**Purpose:** Full business parameter configuration

| Requirement | Description | Status |
|-------------|-------------|--------|
| Client Information | Name, location dropdown, property type | Done |
| Contract Terms | Duration selector (1-5 years) | Done |
| Locker Inventory | Qty & occupancy sliders for M/L/XL | Done |
| Locker Specifications | Dimensions, features, what fits each size | Done |
| Scooter Service | Toggle + quantity input | Done |
| Transfer Service | Toggle + volume + frequency dropdown | Done |
| Property Metrics | Total keys/units, daily traffic | Done |
| Pricing Reference | Tables showing current locker rates | Done |
| Help Tips | Contextual guidance throughout | Done |

### 3.3 Scenarios (Priority: P1)

**Purpose:** Save and compare multiple configurations

| Requirement | Description | Status |
|-------------|-------------|--------|
| Save Scenario | Store current state with custom name | Done |
| Load Scenario | Restore previously saved configuration | Done |
| Delete Scenario | Remove saved scenarios | Done |
| Export JSON | Download scenario as JSON file | Done |
| Import JSON | Upload and load scenario from file | Done |
| Scenario Cards | Visual preview with key metrics | Done |

### 3.4 Proposal Generation (Priority: P0)

**Purpose:** Create print-ready partnership proposals

| Requirement | Description | Status |
|-------------|-------------|--------|
| Print Layout | A4-optimized, clean design | Done |
| Executive Summary | Key metrics and partnership highlights | Done |
| 3-Year Outlook | Revenue projection table | Done |
| Scope of Work | What CityLockers provides | Done |
| Contact Footer | Developer contact information | Done |
| Print Action | Browser print dialog trigger | Done |

### 3.5 AI Assistant (Priority: P1)

**Purpose:** Provide instant product information

| Requirement | Description | Status |
|-------------|-------------|--------|
| Chat Interface | Floating, expandable chatbot | Done |
| CityLockers Context | Trained on products, specs, pricing | Done |
| Calculator Context | Aware of current configuration state | Done |
| Formatted Responses | Proper markdown rendering | Done |
| Website Redirect | Direct to citylockers.com for official inquiries | Done |

### 3.6 Navigation & Layout (Priority: P0)

**Purpose:** Professional website experience

| Requirement | Description | Status |
|-------------|-------------|--------|
| Header | Logo, navigation links, CTA button | Done |
| Footer | Contact info, social links, disclaimer | Done |
| WhatsApp Button | Floating CTA with pre-filled message | Done |
| Mobile Responsive | Full functionality on all devices | Done |

---

## 4. Calculation Engine

### 4.1 Core Formulas

\`\`\`
Daily Locker Revenue = Sum(Price × Qty × Occupancy × LocationMultiplier) per size
Daily Scooter Revenue = ScooterPrice × Qty × Occupancy × LocationMultiplier
Daily Transfer Revenue = TransferPrice × Volume × FrequencyMultiplier

Annual Gross Revenue = (Daily Revenue × 365) × Seasonality Factor
Partner Net Income = Annual Gross Revenue × (Revenue Share / 100)
\`\`\`

### 4.2 Seasonality Factor
\`\`\`
Seasonality = (5 × 1.15 + 1 × 0.85 + 6 × 1.0) / 12 = 1.0375
\`\`\`
- Peak Season (5 months): +15%
- Low Season (1 month): -15%
- Normal Season (6 months): baseline

### 4.3 Location Multipliers
| Location | Multiplier |
|----------|------------|
| Dubai | 1.0 |
| Abu Dhabi | 0.9 |
| Sharjah | 0.75 |
| Ras Al Khaimah | 0.7 |
| Other Emirates | 0.65 |

### 4.4 Space Calculation
\`\`\`
1 Standard Unit = 14 Lockers = 2.2m wall width
Required Width = (Total Lockers / 14) × 2.2m
\`\`\`

---

## 5. Technical Architecture

### 5.1 Stack
- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui components
- **State:** React Context API with localStorage persistence
- **AI:** OpenRouter API (GPT-OSS-20B free tier)
- **Deployment:** Vercel

### 5.2 Project Structure
\`\`\`
app/
├── page.tsx                 # Dashboard
├── configuration/page.tsx   # Configuration
├── scenarios/page.tsx       # Scenario management
├── proposal/page.tsx        # PDF proposal
├── actions/chat.ts          # AI server action
└── layout.tsx               # Root layout

components/citylockers/
├── header.tsx               # Navigation
├── footer.tsx               # Contact & disclaimer
├── ai-assistant.tsx         # Chatbot
└── whatsapp-button.tsx      # Floating CTA

lib/
├── citylockers-context.tsx  # Global state & calculations
└── utils.ts                 # Utilities
\`\`\`

---

## 6. Design System

### 6.1 Colors
| Token | Value | Usage |
|-------|-------|-------|
| Primary | #FF9900 | CTAs, highlights, brand accent |
| Background | #FFFFFF | Cards, surfaces |
| Foreground | #0F172A | Primary text |
| Muted | #64748B | Secondary text |
| Border | #E2E8F0 | Card borders, dividers |

### 6.2 Typography
- **Font Family:** System sans-serif stack
- **Headings:** Bold, tracking-tight
- **Body:** Regular, leading-relaxed

### 6.3 Components
- Clean white cards with subtle borders
- Orange accent buttons for primary actions
- Ghost/outline buttons for secondary actions
- Progress bars for data visualization

---

## 7. Future Roadmap

### v1.1 (Q1 2026)
- [ ] Multi-language support (Arabic, English)
- [ ] Email proposal delivery
- [ ] CRM integration

### v1.2 (Q2 2026)
- [ ] Historical data tracking
- [ ] Advanced analytics dashboard
- [ ] Team collaboration features

---

## 8. Appendix

### 8.1 Glossary
| Term | Definition |
|------|------------|
| SGL | Special Grade Laminate (locker construction material) |
| Capex | Capital Expenditure |
| Opex | Operational Expenditure |
| UPS | Uninterruptible Power Supply |

### 8.2 References
- [CityLockers Website](https://citylockers.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
