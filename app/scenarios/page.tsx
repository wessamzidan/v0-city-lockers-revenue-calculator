"use client"

import { useCityLockers, CURRENCY, type Scenario } from "@/lib/citylockers-context"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FolderOpen, Trash2, Upload, Download, Calendar, Building2, Percent, AlertCircle } from "lucide-react"
import { calculateFinancials } from "@/lib/citylockers-context"

export default function ScenariosPage() {
  const { scenarios, loadScenario, deleteScenario, state, saveScenario } = useCityLockers()

  const exportScenarios = () => {
    const dataStr = JSON.stringify(scenarios, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `citylockers-scenarios-${new Date().toISOString().split("T")[0]}.json`
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const importScenarios = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const imported = JSON.parse(event.target?.result as string)
            if (Array.isArray(imported)) {
              imported.forEach((scenario: Scenario) => {
                saveScenario(scenario.name)
              })
              alert("Scenarios imported successfully!")
            }
          } catch (err) {
            alert("Invalid file format")
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scenario Management</h1>
          <p className="text-gray-500 mt-1">Save, compare, and manage different partnership configurations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={importScenarios} className="gap-2 bg-transparent">
            <Upload className="w-4 h-4" /> Import
          </Button>
          <Button
            variant="outline"
            onClick={exportScenarios}
            className="gap-2 bg-transparent"
            disabled={scenarios.length === 0}
          >
            <Download className="w-4 h-4" /> Export All
          </Button>
          <Button
            className="bg-[#FF9900] hover:bg-[#E68A00] gap-2"
            onClick={() => {
              const name = prompt("Enter scenario name:", `${state.clientName} - ${new Date().toLocaleDateString()}`)
              if (name) saveScenario(name)
            }}
          >
            <FolderOpen className="w-4 h-4" /> Save Current
          </Button>
        </div>
      </div>

      {/* Current Configuration Preview */}
      <Card className="mb-6 border-l-4 border-l-[#FF9900]">
        <CardHeader className="pb-2">
          <h3 className="font-bold text-gray-800">Current Configuration</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs">Client</p>
              <p className="font-medium">{state.clientName}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Property Type</p>
              <p className="font-medium capitalize">{state.propertyType}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Revenue Share</p>
              <p className="font-medium">{state.revenueShare}%</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Est. Annual Income</p>
              <p className="font-medium text-[#FF9900]">
                {CURRENCY}{" "}
                {calculateFinancials(state).partnerAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Scenarios */}
      {scenarios.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <FolderOpen className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">No Saved Scenarios</h3>
                <p className="text-gray-500 mt-1 max-w-md mx-auto">
                  Save your current configuration to compare different partnership scenarios. Each scenario stores all
                  settings including locker inventory, pricing, and service options.
                </p>
              </div>
              <Button
                className="bg-[#FF9900] hover:bg-[#E68A00] gap-2 mt-2"
                onClick={() => {
                  const name = prompt(
                    "Enter scenario name:",
                    `${state.clientName} - ${new Date().toLocaleDateString()}`,
                  )
                  if (name) saveScenario(name)
                }}
              >
                <FolderOpen className="w-4 h-4" /> Save First Scenario
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenarios.map((scenario, index) => {
            const scenarioFinancials = calculateFinancials(scenario.data)
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{scenario.name}</h4>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(scenario.date).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-red-500 shrink-0"
                      onClick={() => {
                        if (confirm("Delete this scenario?")) {
                          deleteScenario(index)
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <span className="capitalize">{scenario.data.propertyType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Percent className="w-4 h-4 text-gray-400" />
                      <span>{scenario.data.revenueShare}% Revenue Share</span>
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-500">Est. Annual Income</p>
                    <p className="text-xl font-bold text-[#FF9900]">
                      {CURRENCY}{" "}
                      {scenarioFinancials.partnerAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => {
                        if (confirm("Load this scenario? Your current configuration will be replaced.")) {
                          loadScenario(scenario.data)
                        }
                      }}
                    >
                      Load
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Help Section */}
      <Card className="mt-6 bg-blue-50 border-blue-100">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-bold mb-1">How Scenarios Work</p>
              <ul className="text-xs space-y-1 text-blue-700">
                <li>• Each scenario saves all configuration settings including inventory, services, and terms</li>
                <li>• Use scenarios to compare different partnership proposals for the same client</li>
                <li>• Export scenarios as JSON to share with team members or backup</li>
                <li>• Loading a scenario replaces your current configuration</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
