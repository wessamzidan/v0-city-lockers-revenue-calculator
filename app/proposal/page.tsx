"use client"

import { useCityLockers, CURRENCY } from "@/lib/citylockers-context"
import { Button } from "@/components/ui/button"
import { Download, ArrowLeft, CheckCircle2, Phone, Mail, Globe } from "lucide-react"
import Link from "next/link"

export default function ProposalPage() {
  const { state, financials, spaceMetrics } = useCityLockers()

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      {/* Print Controls */}
      <div className="print:hidden bg-white border-b sticky top-16 z-10 p-4">
        <div className="max-w-[210mm] mx-auto flex justify-between items-center">
          <Link href="/">
            <Button variant="outline" className="gap-2 bg-transparent">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Button>
          </Link>
          <Button onClick={() => window.print()} className="bg-[#FF9900] hover:bg-[#E68A00] text-white gap-2">
            <Download className="w-4 h-4" /> Save to PDF
          </Button>
        </div>
      </div>

      {/* A4 Content Container */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none my-6 print:my-0">
        <div className="p-8 md:p-12 space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-[#FF9900] pb-6">
            <div>
              <div className="w-14 h-14 bg-[#FF9900] rounded-lg flex items-center justify-center text-white font-bold text-2xl mb-4">
                CL
              </div>
              <h1 className="text-3xl font-bold uppercase tracking-tight text-gray-900">Partnership Proposal</h1>
              <p className="text-gray-500 mt-2">Prepared for {state.clientName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Date</p>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
              <p className="text-sm text-gray-400 mt-3">Valid Until</p>
              <p className="font-medium">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Executive Summary */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-[#FF9900] uppercase tracking-wide">Executive Summary</h2>
            <p className="text-gray-700 leading-relaxed">
              CityLockers proposes a strategic revenue-sharing partnership to monetize underutilized space at{" "}
              <span className="font-bold">{state.clientName}</span>. By implementing our automated smart locker and
              service ecosystem, we project a total net income of{" "}
              <span className="font-bold text-[#FF9900]">
                {CURRENCY} {financials.partnerContract.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>{" "}
              over the next {state.contractTerm} years.
            </p>
            <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-lg">
              <p className="text-green-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Zero Capital Expenditure - Zero Operational Costs
              </p>
              <p className="text-sm text-green-700 mt-1">
                All installation, operation, maintenance, and marketing is handled by CityLockers at no cost to you.
              </p>
            </div>
          </section>

          {/* Financial Outlook */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-[#FF9900] uppercase tracking-wide">Projected Partner Income</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 border-l-4 border-[#FF9900]">
                <p className="text-xs uppercase text-gray-500">Annual Net</p>
                <p className="text-2xl font-bold text-gray-900">
                  {CURRENCY} {financials.partnerAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="bg-gray-50 p-4 border-l-4 border-gray-300">
                <p className="text-xs uppercase text-gray-500">Monthly Net</p>
                <p className="text-2xl font-bold text-gray-900">
                  {CURRENCY} {financials.partnerMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="bg-gray-50 p-4 border-l-4 border-gray-300">
                <p className="text-xs uppercase text-gray-500">Partner Share</p>
                <p className="text-2xl font-bold text-gray-900">{state.revenueShare}%</p>
              </div>
            </div>

            {/* 3-Year Outlook Table */}
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 font-bold text-gray-600">Year</th>
                  <th className="text-right py-3 font-bold text-gray-600">Growth Factor</th>
                  <th className="text-right py-3 font-bold text-gray-600">Projected Net Income</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(state.contractTerm)].map((_, i) => {
                  const growth = 1 + i * 0.05
                  return (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-3 font-medium">Year {i + 1}</td>
                      <td className="py-3 text-right text-gray-500">+{i * 5}%</td>
                      <td className="py-3 text-right font-mono font-bold">
                        {CURRENCY}{" "}
                        {(financials.partnerAnnual * growth).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  )
                })}
                <tr className="bg-orange-50 font-bold">
                  <td className="py-3 pl-2">Total ({state.contractTerm} Years)</td>
                  <td className="py-3"></td>
                  <td className="py-3 text-right font-mono pr-2 text-[#FF9900]">
                    {CURRENCY} {financials.partnerContract.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Scope of Work */}
          <section>
            <h2 className="text-xl font-bold mb-4 text-[#FF9900] uppercase tracking-wide">Scope of Deployment</h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold mb-3 text-gray-800">Hardware Configuration</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex justify-between border-b pb-2">
                    <span>Location Type</span>
                    <span className="font-medium capitalize">{state.propertyType}</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span>Location Multiplier</span>
                    <span className="font-medium">{state.locationFactor}x</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span>Space Required</span>
                    <span className="font-medium">{spaceMetrics.widthNeeded.toFixed(1)}m</span>
                  </li>
                  <li className="flex justify-between border-b pb-2">
                    <span>Total Locker Units</span>
                    <span className="font-medium">{spaceMetrics.unitsNeeded} units</span>
                  </li>
                  <li className="flex justify-between pt-1">
                    <span>Locker Breakdown</span>
                    <span className="font-medium text-right">
                      {state.lockerXL.qty} XL, {state.lockerL.qty} L, {state.lockerM.qty} M
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-3 text-gray-800">Services Included</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>24/7 Customer Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Full Maintenance Coverage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Comprehensive Insurance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className={`w-4 h-4 ${state.scootersEnabled ? "text-green-500" : "text-gray-300"}`} />
                    <span className={state.scootersEnabled ? "" : "text-gray-400"}>
                      E-Scooter Fleet ({state.scootersEnabled ? `${state.scooters.units} units` : "Not included"})
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${state.transfersEnabled ? "text-green-500" : "text-gray-300"}`}
                    />
                    <span className={state.transfersEnabled ? "" : "text-gray-400"}>
                      Luggage Transfer Service ({state.transfersEnabled ? "Active" : "Not included"})
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contract Summary */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-[#FF9900] uppercase tracking-wide">The Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500 uppercase">Contract Term</p>
                <p className="text-xl font-bold text-gray-900">{state.contractTerm} Years</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Commission</p>
                <p className="text-xl font-bold text-gray-900">{state.revenueShare}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Termination</p>
                <p className="text-xl font-bold text-gray-900">6 Months Notice</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Est. Installation</p>
                <p className="text-xl font-bold text-gray-900">5 Weeks</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500 uppercase mb-1">Forecasted Annual Commission</p>
              <p className="text-3xl font-bold text-[#FF9900]">
                {CURRENCY} {financials.partnerAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })}+
              </p>
            </div>
          </section>

          {/* Footer / Contact */}
          <footer className="border-t-2 border-[#FF9900] pt-6 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold text-xl text-gray-900">Wessam Zidan</h3>
                <p className="text-gray-500">Business Development Executive @ CityLockers</p>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#FF9900]" />
                  +971 55 711 5562
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#FF9900]" />
                  wessam.zidan@citylockers.com
                </p>
                <p className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#FF9900]" />
                  www.citylockers.com
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
