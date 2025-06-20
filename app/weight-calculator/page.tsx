"use client"

import { useState } from "react"
import { ArrowLeft, Calculator, Search, Zap, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MaterialSelectorDialog, SpecSelectorDialog } from "@/components/material-selector-dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface MaterialSpec {
  name: string
  category: string
  specs: string[]
  weightFormula: (spec: string, length: number) => number
  unit: string
}

const materialDatabase: MaterialSpec[] = [
  {
    name: "等边角钢",
    category: "角钢",
    specs: [
      "25×3",
      "30×3",
      "40×3",
      "40×4",
      "50×3",
      "50×4",
      "50×5",
      "63×4",
      "63×5",
      "75×5",
      "75×6",
      "80×6",
      "80×8",
      "100×6",
      "100×8",
      "100×10",
      "125×8",
      "125×10",
      "160×10",
      "160×12",
    ],
    weightFormula: (spec: string, length: number) => {
      const weights: { [key: string]: number } = {
        "25×3": 1.124,
        "30×3": 1.373,
        "40×3": 1.852,
        "40×4": 2.422,
        "50×3": 2.332,
        "50×4": 3.059,
        "50×5": 3.77,
        "63×4": 3.907,
        "63×5": 4.822,
        "75×5": 5.818,
        "75×6": 6.905,
        "80×6": 7.376,
        "80×8": 9.658,
        "100×6": 9.366,
        "100×8": 12.276,
        "100×10": 15.12,
        "125×8": 15.504,
        "125×10": 19.133,
        "160×10": 24.729,
        "160×12": 29.391,
      }
      return ((weights[spec] || 0) * length) / 1000
    },
    unit: "kg/m",
  },
  {
    name: "不等边角钢",
    category: "角钢",
    specs: ["45×28×3", "56×36×3", "63×40×4", "75×50×5", "100×63×6", "100×80×6", "125×80×7", "160×100×10"],
    weightFormula: (spec: string, length: number) => {
      const weights: { [key: string]: number } = {
        "45×28×3": 1.687,
        "56×36×3": 2.15,
        "63×40×4": 3.185,
        "75×50×5": 4.808,
        "100×63×6": 7.55,
        "100×80×6": 8.35,
        "125×80×7": 11.066,
        "160×100×10": 20.611,
      }
      return ((weights[spec] || 0) * length) / 1000
    },
    unit: "kg/m",
  },
  {
    name: "工字钢",
    category: "工字钢",
    specs: ["10", "12", "14", "16", "18", "20a", "22a", "25a", "28a", "32a", "36a", "40a", "45a", "56a", "63a"],
    weightFormula: (spec: string, length: number) => {
      const weights: { [key: string]: number } = {
        "10": 11.261,
        "12": 13.987,
        "14": 16.89,
        "16": 20.513,
        "18": 24.143,
        "20a": 27.929,
        "22a": 31.069,
        "25a": 38.105,
        "28a": 43.492,
        "32a": 52.717,
        "36a": 60.037,
        "40a": 73.878,
        "45a": 80.42,
        "56a": 106.316,
        "63a": 123.076,
      }
      return ((weights[spec] || 0) * length) / 1000
    },
    unit: "kg/m",
  },
  {
    name: "槽钢",
    category: "槽钢",
    specs: ["5", "6.3", "8", "10", "12", "14", "16", "18", "20a", "22a", "25a", "28a", "32a", "36a", "40a"],
    weightFormula: (spec: string, length: number) => {
      const weights: { [key: string]: number } = {
        "5": 5.438,
        "6.3": 7.011,
        "8": 9.065,
        "10": 11.261,
        "12": 13.987,
        "14": 16.89,
        "16": 20.513,
        "18": 24.143,
        "20a": 28.808,
        "22a": 31.069,
        "25a": 38.105,
        "28a": 43.492,
        "32a": 52.717,
        "36a": 60.037,
        "40a": 73.878,
      }
      return ((weights[spec] || 0) * length) / 1000
    },
    unit: "kg/m",
  },
  {
    name: "圆钢",
    category: "圆钢",
    specs: ["6", "8", "10", "12", "14", "16", "18", "20", "22", "25", "28", "32", "36", "40", "45", "50"],
    weightFormula: (spec: string, length: number) => {
      const diameter = Number.parseFloat(spec)
      const weight = (((Math.PI * Math.pow(diameter, 2)) / 4) * 7.85) / 1000000
      return weight * length
    },
    unit: "kg/m",
  },
  {
    name: "方钢",
    category: "方钢",
    specs: ["6", "8", "10", "12", "14", "16", "18", "20", "22", "25", "28", "32", "36", "40", "45", "50"],
    weightFormula: (spec: string, length: number) => {
      const side = Number.parseFloat(spec)
      const weight = (Math.pow(side, 2) * 7.85) / 1000000
      return weight * length
    },
    unit: "kg/m",
  },
]

export default function WeightCalculator() {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialSpec | null>(null)
  const [selectedSpec, setSelectedSpec] = useState<string>("")
  const [length, setLength] = useState<number>(6000)
  const [calculatedWeight, setCalculatedWeight] = useState<number | null>(null)
  const [showMaterialDialog, setShowMaterialDialog] = useState(false)
  const [showSpecDialog, setShowSpecDialog] = useState(false)
  const [isQuickSelectOpen, setIsQuickSelectOpen] = useState(false)

  const handleMaterialSelect = (material: MaterialSpec) => {
    setSelectedMaterial(material)
    setSelectedSpec("")
    setCalculatedWeight(null)
  }

  const calculateWeight = () => {
    if (selectedMaterial && selectedSpec && length > 0) {
      const weight = selectedMaterial.weightFormula(selectedSpec, length)
      setCalculatedWeight(weight)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-3">
            材料重量查询
          </h1>
          <p className="text-gray-600 text-lg">精确查询各种型材理论重量，基于国标数据计算</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  材料选择
                </CardTitle>
                <CardDescription className="text-green-100">选择材料类型和规格进行重量计算</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">材料类型</Label>
                  <Button
                    variant="outline"
                    className="w-full justify-start h-12 text-left bg-gradient-to-r from-gray-50 to-white hover:from-green-50 hover:to-emerald-50 border-2 hover:border-green-200"
                    onClick={() => setShowMaterialDialog(true)}
                  >
                    {selectedMaterial ? (
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{selectedMaterial.category}</Badge>
                        <span className="font-medium">{selectedMaterial.name}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Search className="w-4 h-4" />
                        <span>点击选择材料类型</span>
                      </div>
                    )}
                  </Button>
                </div>

                {selectedMaterial && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">规格型号</Label>
                    <Button
                      variant="outline"
                      className="w-full justify-start h-12 text-left bg-gradient-to-r from-gray-50 to-white hover:from-green-50 hover:to-emerald-50 border-2 hover:border-green-200"
                      onClick={() => setShowSpecDialog(true)}
                    >
                      {selectedSpec ? (
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{selectedSpec}</Badge>
                          <span className="text-gray-600">
                            {selectedMaterial.weightFormula(selectedSpec, 1000).toFixed(3)} kg/m
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-500">
                          <Search className="w-4 h-4" />
                          <span>点击选择规格型号</span>
                        </div>
                      )}
                    </Button>
                  </div>
                )}

                <div>
                  <Label htmlFor="length" className="text-sm font-medium text-gray-700">
                    长度 (mm)
                  </Label>
                  <Input
                    id="length"
                    type="number"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    placeholder="输入长度"
                    className="mt-2 h-12"
                  />
                </div>

                <Button
                  onClick={calculateWeight}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg h-12"
                  size="lg"
                  disabled={!selectedMaterial || !selectedSpec || length <= 0}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  计算重量
                </Button>
              </CardContent>
            </Card>

            {/* 快速选择折叠卡片 */}
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <Collapsible open={isQuickSelectOpen} onOpenChange={setIsQuickSelectOpen}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg cursor-pointer hover:from-orange-600 hover:to-red-600 transition-all duration-200">
                    <CardTitle className="flex items-center justify-between">
                      <span>快速选择</span>
                      {isQuickSelectOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </CardTitle>
                    <CardDescription className="text-orange-100">
                      {isQuickSelectOpen ? "点击收起材料类型列表" : "点击展开快速选择材料类型"}
                    </CardDescription>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {Array.from(new Set(materialDatabase.map((m) => m.category))).map((category) => (
                        <div key={category}>
                          <h4 className="font-medium mb-3 text-gray-700 flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            {category}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {materialDatabase
                              .filter((m) => m.category === category)
                              .map((material) => (
                                <Badge
                                  key={material.name}
                                  variant="outline"
                                  className="cursor-pointer hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:border-orange-200 transition-all duration-200 px-3 py-2"
                                  onClick={() => handleMaterialSelect(material)}
                                >
                                  {material.name}
                                </Badge>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          </div>

          <div className="space-y-6">
            {calculatedWeight !== null && (
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    计算结果
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="relative">
                      <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {calculatedWeight.toFixed(2)}
                      </div>
                      <div className="text-2xl font-semibold text-gray-600 mt-2">kg</div>
                    </div>

                    <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border">
                      <div className="text-gray-700 font-medium">
                        {selectedMaterial?.name} {selectedSpec} × {length}mm
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                        <div className="text-xl font-bold text-blue-600">
                          {selectedMaterial?.weightFormula(selectedSpec, 1000).toFixed(3)}
                        </div>
                        <div className="text-sm text-blue-700 font-medium">kg/m</div>
                        <div className="text-xs text-blue-600">理论重量</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                        <div className="text-xl font-bold text-green-600">{(length / 1000).toFixed(2)}</div>
                        <div className="text-sm text-green-700 font-medium">m</div>
                        <div className="text-xs text-green-600">长度</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <MaterialSelectorDialog
          open={showMaterialDialog}
          onOpenChange={setShowMaterialDialog}
          materials={materialDatabase}
          onSelect={handleMaterialSelect}
        />
        <SpecSelectorDialog
          open={showSpecDialog}
          onOpenChange={setShowSpecDialog}
          material={selectedMaterial}
          selectedSpec={selectedSpec}
          onSelect={setSelectedSpec}
        />
      </div>
    </div>
  )
}
