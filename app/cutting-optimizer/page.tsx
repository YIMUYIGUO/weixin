"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Trash2, Calculator, Save, History, Copy, Edit3, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CuttingPlan {
  materialLength: number
  cuts: number[]
  waste: number
  utilization: number
}

interface RequiredLength {
  length: number
  quantity: number
}

interface SavedRecord {
  id: string
  name: string
  materialLength: number
  sawWidth: number
  requiredLengths: RequiredLength[]
  cuttingPlans: CuttingPlan[]
  totalWaste: number
  averageUtilization: number
  createdAt: string
}

export default function CuttingOptimizer() {
  const [materialLength, setMaterialLength] = useState<number>(6000)
  const [sawWidth, setSawWidth] = useState<number>(3)
  const [requiredLengths, setRequiredLengths] = useState<RequiredLength[]>([
    { length: 2000, quantity: 3 },
    { length: 1500, quantity: 2 },
  ])
  const [cuttingPlans, setCuttingPlans] = useState<CuttingPlan[]>([])
  const [savedRecords, setSavedRecords] = useState<SavedRecord[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [recordName, setRecordName] = useState("")
  const [pasteData, setPasteData] = useState("")
  const [activeTab, setActiveTab] = useState("manual")
  const [showAllPlans, setShowAllPlans] = useState(false)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cuttingRecords") || "[]")
    setSavedRecords(saved)
  }, [])

  const addRequiredLength = () => {
    setRequiredLengths([...requiredLengths, { length: 0, quantity: 1 }])
  }

  const removeRequiredLength = (index: number) => {
    setRequiredLengths(requiredLengths.filter((_, i) => i !== index))
  }

  const updateRequiredLength = (index: number, field: "length" | "quantity", value: number) => {
    const updated = [...requiredLengths]
    updated[index][field] = value
    setRequiredLengths(updated)
  }

  const parsePasteData = () => {
    if (!pasteData.trim()) return

    try {
      const lines = pasteData.trim().split("\n")
      const parsed: RequiredLength[] = []

      for (const line of lines) {
        if (!line.trim()) continue

        // 支持多种分隔符：制表符、空格、逗号
        const parts = line
          .trim()
          .split(/[\t\s,]+/)
          .filter((part) => part.trim())

        if (parts.length >= 2) {
          const length = Number.parseFloat(parts[0])
          const quantity = Number.parseInt(parts[1])

          if (!isNaN(length) && !isNaN(quantity) && length > 0 && quantity > 0) {
            parsed.push({ length, quantity })
          }
        }
      }

      if (parsed.length > 0) {
        setRequiredLengths(parsed)
        setPasteData("")
        setActiveTab("manual")
      }
    } catch (error) {
      console.error("解析数据失败:", error)
    }
  }

  const calculateOptimalCutting = () => {
    const plans: CuttingPlan[] = []
    const remaining = [...requiredLengths]

    while (remaining.some((item) => item.quantity > 0)) {
      const currentCuts: number[] = []
      let remainingLength = materialLength

      remaining.sort((a, b) => b.length - a.length)

      for (const item of remaining) {
        while (item.quantity > 0) {
          const neededLength = item.length + (currentCuts.length > 0 ? sawWidth : 0)
          if (neededLength <= remainingLength) {
            currentCuts.push(item.length)
            remainingLength -= item.length
            if (currentCuts.length > 1) {
              remainingLength -= sawWidth
            }
            item.quantity--
          } else {
            break
          }
        }
      }

      if (currentCuts.length > 0) {
        const totalCutLength = currentCuts.reduce((sum, cut) => sum + cut, 0)
        const totalSawWidth = Math.max(0, (currentCuts.length - 1) * sawWidth)
        const waste = materialLength - totalCutLength - totalSawWidth
        const utilization = ((materialLength - waste) / materialLength) * 100

        plans.push({
          materialLength,
          cuts: currentCuts,
          waste,
          utilization,
        })
      } else {
        break
      }
    }

    setCuttingPlans(plans)
  }

  const saveRecord = () => {
    if (!recordName.trim()) return

    const record: SavedRecord = {
      id: Date.now().toString(),
      name: recordName,
      materialLength,
      sawWidth,
      requiredLengths: [...requiredLengths],
      cuttingPlans: [...cuttingPlans],
      totalWaste,
      averageUtilization,
      createdAt: new Date().toLocaleString(),
    }

    const existing = JSON.parse(localStorage.getItem("cuttingRecords") || "[]")
    const updated = [record, ...existing].slice(0, 10)
    localStorage.setItem("cuttingRecords", JSON.stringify(updated))

    setSavedRecords(updated)
    setShowSaveDialog(false)
    setRecordName("")
  }

  const loadRecord = (record: SavedRecord) => {
    setMaterialLength(record.materialLength)
    setSawWidth(record.sawWidth)
    setRequiredLengths([...record.requiredLengths])
    setCuttingPlans([...record.cuttingPlans])
    setShowHistoryDialog(false)
  }

  const deleteRecord = (id: string) => {
    const updated = savedRecords.filter((record) => record.id !== id)
    localStorage.setItem("cuttingRecords", JSON.stringify(updated))
    setSavedRecords(updated)
  }

  const totalWaste = cuttingPlans.reduce((sum, plan) => sum + plan.waste, 0)
  const averageUtilization =
    cuttingPlans.length > 0 ? cuttingPlans.reduce((sum, plan) => sum + plan.utilization, 0) / cuttingPlans.length : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">条材套裁优化</h1>
          <p className="text-slate-600 text-lg">智能计算最优切割方案，考虑锯缝宽度，最大化材料利用率</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="border border-slate-200 shadow-lg bg-white">
              <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  参数设置
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="material-length" className="text-sm font-medium text-slate-700">
                        原材料长度 (mm)
                      </Label>
                      <Input
                        id="material-length"
                        type="number"
                        value={materialLength}
                        onChange={(e) => setMaterialLength(Number(e.target.value))}
                        className="mt-1 border-slate-300 focus:border-blue-500"
                        placeholder="6000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="saw-width" className="text-sm font-medium text-slate-700">
                        锯缝宽度 (mm)
                      </Label>
                      <Input
                        id="saw-width"
                        type="number"
                        value={sawWidth}
                        onChange={(e) => setSawWidth(Number(e.target.value))}
                        className="mt-1 border-slate-300 focus:border-blue-500"
                        placeholder="3"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 shadow-lg bg-white">
              <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                <CardTitle>所需规格</CardTitle>
                <CardDescription className="text-blue-100">手动输入或批量导入所需的长度规格</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-slate-100">
                    <TabsTrigger
                      value="manual"
                      className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      <Edit3 className="w-4 h-4" />
                      手动输入
                    </TabsTrigger>
                    <TabsTrigger
                      value="paste"
                      className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      <Copy className="w-4 h-4" />
                      批量导入
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="manual" className="space-y-4 mt-4">
                    {requiredLengths.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-3 items-end p-4 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="flex-1">
                          <Label className="text-sm font-medium text-slate-700">长度 (mm)</Label>
                          <Input
                            type="number"
                            value={item.length}
                            onChange={(e) => updateRequiredLength(index, "length", Number(e.target.value))}
                            className="mt-1 border-slate-300 focus:border-blue-500"
                            placeholder="长度"
                          />
                        </div>
                        <div className="w-24">
                          <Label className="text-sm font-medium text-slate-700">数量</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateRequiredLength(index, "quantity", Number(e.target.value))}
                            className="mt-1 border-slate-300 focus:border-blue-500"
                            placeholder="数量"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeRequiredLength(index)}
                          disabled={requiredLengths.length === 1}
                          className="border-slate-300 hover:bg-red-50 hover:border-red-300"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      onClick={addRequiredLength}
                      className="w-full border-dashed border-2 border-slate-300 hover:bg-blue-50 hover:border-blue-400"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      添加规格
                    </Button>
                  </TabsContent>

                  <TabsContent value="paste" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-slate-700">粘贴数据</Label>
                      <Textarea
                        placeholder="请粘贴表格数据，格式：长度 数量（每行一条）\n例如：\n2000 3\n1500 2\n1200 4"
                        value={pasteData}
                        onChange={(e) => setPasteData(e.target.value)}
                        className="min-h-32 border-slate-300 focus:border-blue-500"
                      />
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">支持的格式：</h4>
                        <div className="text-xs text-blue-700 space-y-1">
                          <div>• Excel表格复制：长度和数量用制表符分隔</div>
                          <div>• 空格分隔：2000 3</div>
                          <div>• 逗号分隔：2000,3</div>
                          <div>• 每行一条记录</div>
                        </div>
                      </div>
                      <Button
                        onClick={parsePasteData}
                        disabled={!pasteData.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        解析并导入数据
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                onClick={calculateOptimalCutting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                size="lg"
              >
                <Calculator className="w-4 h-4 mr-2" />
                计算最优方案
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowHistoryDialog(true)}
                className="border-slate-300 hover:bg-slate-50"
              >
                <History className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {cuttingPlans.length > 0 && (
              <>
                <Card className="border border-slate-200 shadow-lg bg-white">
                  <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center justify-between">
                      优化结果统计
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowSaveDialog(true)}
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        保存
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="text-3xl font-bold text-blue-600 mb-1">{cuttingPlans.length}</div>
                        <div className="text-sm text-blue-700 font-medium">所需原材料</div>
                      </div>
                      <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="text-3xl font-bold text-slate-600 mb-1">{averageUtilization.toFixed(1)}%</div>
                        <div className="text-sm text-slate-700 font-medium">平均利用率</div>
                      </div>
                      <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="text-3xl font-bold text-slate-600 mb-1">{totalWaste}mm</div>
                        <div className="text-sm text-slate-700 font-medium">总废料长度</div>
                      </div>
                      <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="text-3xl font-bold text-slate-600 mb-1">
                          {((totalWaste / (materialLength * cuttingPlans.length)) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-slate-700 font-medium">废料率</div>
                      </div>
                    </div>

                    {/* 简明套裁结果 */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        套裁明细
                      </h4>
                      <div className="space-y-2 font-mono text-sm">
                        {(() => {
                          // 按切割组合分组统计
                          const planGroups = new Map<string, { cuts: number[]; count: number; waste: number }>()

                          cuttingPlans.forEach((plan) => {
                            const key = plan.cuts.sort((a, b) => b - a).join(",")
                            if (planGroups.has(key)) {
                              planGroups.get(key)!.count++
                            } else {
                              planGroups.set(key, {
                                cuts: [...plan.cuts].sort((a, b) => b - a),
                                count: 1,
                                waste: plan.waste,
                              })
                            }
                          })

                          return Array.from(planGroups.entries()).map(([key, group], index) => {
                            // 统计每个长度的数量
                            const lengthCount = new Map<number, number>()
                            group.cuts.forEach((cut) => {
                              lengthCount.set(cut, (lengthCount.get(cut) || 0) + 1)
                            })

                            // 生成简明格式：2500*2+1000*1
                            const formula = Array.from(lengthCount.entries())
                              .sort(([a], [b]) => b - a) // 按长度降序排列
                              .map(([length, count]) => (count > 1 ? `${length}*${count}` : `${length}`))
                              .join("+")

                            return (
                              <div
                                key={key}
                                className="text-slate-700 bg-white px-3 py-2 rounded border border-slate-200"
                              >
                                <span className="text-blue-600 font-semibold">{index + 1}</span>
                                <span className="text-slate-800 font-semibold">{group.count}支</span>
                                <span className="ml-2">{formula}</span>
                                {group.waste > 0 && <span className="ml-2 text-slate-500">余料:{group.waste}mm</span>}
                              </div>
                            )
                          })
                        })()}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 shadow-lg bg-white">
                  <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                    <CardTitle>切割方案详情</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {(() => {
                        // 按切割组合分组统计
                        const planGroups = new Map<
                          string,
                          { cuts: number[]; count: number; utilization: number; waste: number }
                        >()

                        cuttingPlans.forEach((plan) => {
                          const key = plan.cuts.sort((a, b) => b - a).join(",")
                          if (planGroups.has(key)) {
                            planGroups.get(key)!.count++
                          } else {
                            planGroups.set(key, {
                              cuts: [...plan.cuts].sort((a, b) => b - a),
                              count: 1,
                              utilization: plan.utilization,
                              waste: plan.waste,
                            })
                          }
                        })

                        const planGroupsArray = Array.from(planGroups.entries())
                        const visiblePlans = showAllPlans ? planGroupsArray : planGroupsArray.slice(0, 3)

                        return (
                          <>
                            {visiblePlans.map(([key, group], index) => (
                              <div key={key} className="border border-slate-200 rounded-xl p-5 bg-slate-50">
                                <div className="flex justify-between items-center mb-4">
                                  <h4 className="font-semibold text-lg text-slate-800">
                                    切割方案 {String.fromCharCode(65 + index)}
                                    <span className="ml-2 text-sm font-normal text-slate-600">
                                      ({group.count} 支原材料)
                                    </span>
                                  </h4>
                                  <Badge
                                    className={
                                      group.utilization >= 90
                                        ? "bg-blue-100 text-blue-800 border-blue-200"
                                        : group.utilization >= 80
                                          ? "bg-slate-100 text-slate-800 border-slate-200"
                                          : "bg-slate-100 text-slate-600 border-slate-200"
                                    }
                                  >
                                    利用率 {group.utilization.toFixed(1)}%
                                  </Badge>
                                </div>

                                <div className="space-y-3">
                                  <div className="flex flex-wrap gap-2">
                                    {group.cuts.map((cut, cutIndex) => (
                                      <Badge
                                        key={cutIndex}
                                        variant="outline"
                                        className="bg-blue-50 text-blue-700 border-blue-200"
                                      >
                                        {cut}mm
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                                    <div className="grid grid-cols-2 gap-4">
                                      <span>切割总长: {group.cuts.reduce((sum, cut) => sum + cut, 0)}mm</span>
                                      <span>锯缝总宽: {Math.max(0, (group.cuts.length - 1) * sawWidth)}mm</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                      <span className="text-blue-600 font-medium">数量: {group.count} 支</span>
                                      {group.waste > 0 && (
                                        <span className="text-slate-600 font-medium">单支废料: {group.waste}mm</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {planGroupsArray.length > 3 && (
                              <div className="text-center">
                                <Button
                                  variant="outline"
                                  onClick={() => setShowAllPlans(!showAllPlans)}
                                  className="border-slate-300 hover:bg-slate-50"
                                >
                                  {showAllPlans ? (
                                    <>
                                      <ChevronUp className="w-4 h-4 mr-2" />
                                      收起方案
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-4 h-4 mr-2" />
                                      显示全部 {planGroupsArray.length} 个方案
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>

        {/* 保存对话框 */}
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>保存计算记录</DialogTitle>
              <DialogDescription>为这次计算结果起个名字，方便以后查看</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="record-name">记录名称</Label>
              <Input
                id="record-name"
                value={recordName}
                onChange={(e) => setRecordName(e.target.value)}
                placeholder="例如：办公楼钢材套裁方案"
                className="mt-2 border-slate-300 focus:border-blue-500"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSaveDialog(false)} className="border-slate-300">
                取消
              </Button>
              <Button onClick={saveRecord} disabled={!recordName.trim()} className="bg-blue-600 hover:bg-blue-700">
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 历史记录对话框 */}
        <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>历史记录</DialogTitle>
              <DialogDescription>查看和加载之前保存的计算记录</DialogDescription>
            </DialogHeader>
            <div className="max-h-96 overflow-y-auto">
              {savedRecords.length === 0 ? (
                <div className="text-center py-8 text-slate-500">暂无保存的记录</div>
              ) : (
                <div className="space-y-3">
                  {savedRecords.map((record) => (
                    <div key={record.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{record.name}</h4>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => loadRecord(record)}
                            className="border-slate-300"
                          >
                            加载
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteRecord(record.id)}
                            className="text-red-600 hover:bg-red-50 border-slate-300"
                          >
                            删除
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-slate-600 space-y-1">
                        <div>
                          原材料: {record.materialLength}mm, 锯缝: {record.sawWidth}mm
                        </div>
                        <div>
                          利用率: {record.averageUtilization.toFixed(1)}%, 废料: {record.totalWaste}mm
                        </div>
                        <div>保存时间: {record.createdAt}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
