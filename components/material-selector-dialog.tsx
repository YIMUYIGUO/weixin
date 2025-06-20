"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface MaterialSpec {
  name: string
  category: string
  specs: string[]
  weightFormula: (spec: string, length: number) => number
  unit: string
}

interface MaterialSelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  materials: MaterialSpec[]
  onSelect: (material: MaterialSpec) => void
}

export function MaterialSelectorDialog({ open, onOpenChange, materials, onSelect }: MaterialSelectorDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  const categories = Array.from(new Set(materials.map((m) => m.category)))

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || material.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSelect = (material: MaterialSpec) => {
    onSelect(material)
    onOpenChange(false)
    setSearchTerm("")
    setSelectedCategory("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            选择材料类型
          </DialogTitle>
          <DialogDescription>选择您要查询重量的材料类型和规格</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="搜索材料名称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === "" ? "default" : "outline"}
              className="cursor-pointer hover:bg-blue-50"
              onClick={() => setSelectedCategory("")}
            >
              全部
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-blue-50"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* 材料列表 */}
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredMaterials.map((material) => (
              <div
                key={material.name}
                className="border rounded-lg p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-200 hover:shadow-md"
                onClick={() => handleSelect(material)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{material.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {material.category}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">{material.specs.length} 种规格</div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {material.specs.slice(0, 8).map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {material.specs.length > 8 && (
                    <Badge variant="secondary" className="text-xs">
                      +{material.specs.length - 8}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>未找到匹配的材料</p>
              <p className="text-sm">请尝试其他搜索关键词</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface SpecSelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  material: MaterialSpec | null
  selectedSpec: string
  onSelect: (spec: string) => void
}

export function SpecSelectorDialog({ open, onOpenChange, material, selectedSpec, onSelect }: SpecSelectorDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")

  if (!material) return null

  const filteredSpecs = material.specs.filter((spec) => spec.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSelect = (spec: string) => {
    onSelect(spec)
    onOpenChange(false)
    setSearchTerm("")
  }

  // 按规格大小排序
  const sortedSpecs = filteredSpecs.sort((a, b) => {
    // 提取数字进行比较
    const getFirstNumber = (str: string) => {
      const match = str.match(/\d+/)
      return match ? Number.parseInt(match[0]) : 0
    }
    return getFirstNumber(a) - getFirstNumber(b)
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            选择规格型号
          </DialogTitle>
          <DialogDescription>{material.name} - 选择您需要的规格型号</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="搜索规格型号..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* 当前选择 */}
          {selectedSpec && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-700 mb-1">当前选择</div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">{selectedSpec}</Badge>
            </div>
          )}

          {/* 规格网格 */}
          <div className="max-h-96 overflow-y-auto">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {sortedSpecs.map((spec) => (
                <div
                  key={spec}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 text-center
                    ${
                      selectedSpec === spec
                        ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md"
                        : "border-gray-200 hover:border-green-300 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:shadow-sm"
                    }
                  `}
                  onClick={() => handleSelect(spec)}
                >
                  <div className="font-semibold text-gray-800">{spec}</div>
                  <div className="text-xs text-gray-500 mt-1">{material.weightFormula(spec, 1000).toFixed(3)} kg/m</div>
                </div>
              ))}
            </div>
          </div>

          {filteredSpecs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>未找到匹配的规格</p>
              <p className="text-sm">请尝试其他搜索关键词</p>
            </div>
          )}

          {/* 规格说明 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">规格说明</h4>
            <div className="text-sm text-gray-600 space-y-1">
              {material.category === "角钢" && <p>• 格式：边长×厚度 (mm)，如 50×5 表示边长50mm，厚度5mm</p>}
              {material.category === "工字钢" && <p>• 格式：高度编号，如 20a 表示20号工字钢</p>}
              {material.category === "槽钢" && <p>• 格式：高度编号，如 16 表示16号槽钢</p>}
              {(material.category === "圆钢" || material.category === "方钢") && <p>• 格式：直径/边长 (mm)</p>}
              <p>• 理论重量基于钢材密度 7.85 g/cm³ 计算</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
