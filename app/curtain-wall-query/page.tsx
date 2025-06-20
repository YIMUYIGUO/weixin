"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Search,
  BookOpen,
  FileText,
  Upload,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  ImageIcon,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface KnowledgeItem {
  id: string
  title: string
  category: string
  content: string
  images: string[]
  tags: string[]
  status: "approved" | "pending" | "rejected"
  authorId: string
  authorName: string
  createdAt: string
  updatedAt: string
}

interface Standard {
  id: string
  name: string
  code: string
  category: string
  description: string
  fileUrl?: string
  fileName?: string
  fileType?: string
  fileContent?: string
  status: "approved" | "pending" | "rejected"
  authorId: string
  authorName: string
  uploadDate: string
}

const knowledgeCategories = [
  "安装节点",
  "防雷系统",
  "转接件",
  "密封胶",
  "结构胶",
  "五金配件",
  "玻璃选型",
  "铝型材",
  "石材幕墙",
  "金属幕墙",
  "玻璃幕墙",
  "质量控制",
  "安全施工",
  "维护保养",
]

const standardCategories = ["国家标准", "行业标准", "地方标准", "企业标准", "国际标准"]

// 模拟用户角色
const currentUser = {
  id: "user1",
  name: "张工程师",
  role: "admin", // 'admin' | 'user'
}

// 预设知识库数据
const defaultKnowledge: KnowledgeItem[] = [
  {
    id: "1",
    title: "幕墙防雷系统设计要点",
    category: "防雷系统",
    content:
      "幕墙防雷系统应包括接闪器、引下线和接地装置三个基本组成部分。接闪器通常采用避雷针、避雷带或避雷网；引下线应与建筑物主体结构的钢筋连接；接地装置应符合建筑物防雷等级要求。幕墙金属框架应与建筑物防雷系统可靠连接，连接点间距不应大于18m。",
    images: [],
    tags: ["防雷", "设计", "安全"],
    status: "approved",
    authorId: "admin",
    authorName: "系统管理员",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    title: "幕墙转接件安装技术要求",
    category: "转接件",
    content:
      "转接件是连接幕墙与主体结构的重要构件。安装前应检查预埋件位置、尺寸和标高；转接件与预埋件的连接应采用焊接或螺栓连接；焊接质量应符合相关标准要求；螺栓连接应采用高强度螺栓，并按设计要求施加预紧力。转接件安装完成后应进行隐蔽工程验收。",
    images: [],
    tags: ["转接件", "安装", "连接"],
    status: "approved",
    authorId: "admin",
    authorName: "系统管理员",
    createdAt: "2024-01-16",
    updatedAt: "2024-01-16",
  },
]

// 预设规范数据
const defaultStandards: Standard[] = [
  {
    id: "1",
    name: "建筑幕墙",
    code: "GB/T 21086-2007",
    category: "国家标准",
    description: "规定了建筑幕墙的术语和定义、分类、要求、试验方法、检验规则、标志、包装、运输和贮存等。",
    fileContent: `建筑幕墙 GB/T 21086-2007

1 范围
本标准规定了建筑幕墙的术语和定义、分类、要求、试验方法、检验规则、标志、包装、运输和贮存。
本标准适用于工业与民用建筑的幕墙。

2 规范性引用文件
下列文件对于本文件的应用是必不可少的。凡是注日期的引用文件，仅注日期的版本适用于本文件。

3 术语和定义
3.1 幕墙 curtain wall
由支承结构体系与面板组成的、可相对主体结构有一定位移能力、不分担主体结构所受作用的建筑外围护结构或装饰结构。

3.2 构件式幕墙 stick curtain wall
幕墙的框架（立柱、横梁）与面板在现场逐件组装的幕墙。

3.3 单元式幕墙 unitized curtain wall
幕墙的框架与面板在工厂组装成整体单元，直接安装在主体结构上的幕墙。

4 分类
4.1 按面板材料分类
a) 玻璃幕墙
b) 金属幕墙
c) 石材幕墙
d) 人造板材幕墙
e) 组合幕墙

4.2 按安装方式分类
a) 构件式幕墙
b) 单元式幕墙

5 要求
5.1 一般要求
幕墙应满足建筑功能要求，具有良好的物理性能，并应满足安全性、适用性和耐久性要求。

5.2 安全性要求
5.2.1 幕墙及其连接件应具有足够的承载能力、刚度和稳定性。
5.2.2 幕墙应能承受风荷载、地震作用、温度作用等。

5.3 适用性要求
5.3.1 幕墙应具有良好的气密性、水密性和保温性能。
5.3.2 幕墙的变形应在允许范围内。

5.4 耐久性要求
幕墙应具有良好的耐候性，在设计使用年限内应保持良好的性能。`,
    status: "approved",
    authorId: "admin",
    authorName: "系统管理员",
    uploadDate: "2024-01-10",
  },
  {
    id: "2",
    name: "玻璃幕墙工程技术规范",
    code: "JGJ 102-2003",
    category: "行业标准",
    description: "适用于建筑高度不超过150m、抗震设防烈度不超过8度的建筑玻璃幕墙工程的设计、制作、安装和验收。",
    fileContent: `玻璃幕墙工程技术规范 JGJ 102-2003

1 总则
1.0.1 为了在玻璃幕墙工程设计、制作、安装和验收中，贯彻执行国家的技术经济政策，做到安全适用、技术先进、经济合理、确保质量，制定本规范。

1.0.2 本规范适用于建筑高度不超过150m、抗震设防烈度不超过8度的建筑玻璃幕墙工程的设计、制作、安装和验收。

1.0.3 玻璃幕墙工程的设计、制作、安装和验收，除应符合本规范外，尚应符合国家现行有关标准的规定。

2 术语
2.0.1 玻璃幕墙 glass curtain wall
由支承结构体系与玻璃组成的、可相对主体结构有一定位移能力、不分担主体结构所受作用的建筑外围护结构或装饰结构。

2.0.2 构件式玻璃幕墙 stick system glass curtain wall
玻璃幕墙的框架（立柱、横梁）与玻璃在现场逐件组装的玻璃幕墙。

2.0.3 单元式玻璃幕墙 unitized glass curtain wall
玻璃幕墙的框架与玻璃在工厂组装成整体单元，直接安装在主体结构上的玻璃幕墙。

3 基本规定
3.0.1 玻璃幕墙应根据建筑物的使用功能、美观要求、所在地区的气候条件、玻璃幕墙的朝向等进行设计。

3.0.2 玻璃幕墙的设计应满足建筑物的安全性、适用性和耐久性要求。

3.0.3 玻璃幕墙应具有良好的气密性、水密性、保温性能和隔声性能。`,
    status: "approved",
    authorId: "admin",
    authorName: "系统管理员",
    uploadDate: "2024-01-11",
  },
]

export default function CurtainWallQuery() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [standards, setStandards] = useState<Standard[]>([])
  const [showAddKnowledgeDialog, setShowAddKnowledgeDialog] = useState(false)
  const [showAddStandardDialog, setShowAddStandardDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [showAdminDialog, setShowAdminDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null)
  const [selectedStandard, setSelectedStandard] = useState<Standard | null>(null)
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null)
  const [newKnowledge, setNewKnowledge] = useState({
    title: "",
    category: "",
    content: "",
    tags: "",
    images: [] as string[],
  })
  const [newStandard, setNewStandard] = useState({
    name: "",
    code: "",
    category: "",
    description: "",
    file: null as File | null,
  })

  useEffect(() => {
    // 从localStorage加载数据，如果没有则使用默认数据
    const savedKnowledge = JSON.parse(localStorage.getItem("curtainWallKnowledge") || "[]")
    const savedStandards = JSON.parse(localStorage.getItem("curtainWallStandards") || "[]")

    if (savedKnowledge.length === 0) {
      setKnowledgeItems(defaultKnowledge)
      localStorage.setItem("curtainWallKnowledge", JSON.stringify(defaultKnowledge))
    } else {
      setKnowledgeItems(savedKnowledge)
    }

    if (savedStandards.length === 0) {
      setStandards(defaultStandards)
      localStorage.setItem("curtainWallStandards", JSON.stringify(defaultStandards))
    } else {
      setStandards(savedStandards)
    }
  }, [])

  // 根据用户角色过滤内容
  const getFilteredKnowledge = () => {
    let filtered = knowledgeItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = !selectedCategory || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // 普通用户只能看到已审核通过的内容
    if (currentUser.role !== "admin") {
      filtered = filtered.filter((item) => item.status === "approved")
    }

    return filtered
  }

  const getFilteredStandards = () => {
    let filtered = standards.filter((standard) => {
      const matchesSearch =
        standard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        standard.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        standard.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || standard.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // 普通用户只能看到已审核通过的内容
    if (currentUser.role !== "admin") {
      filtered = filtered.filter((standard) => standard.status === "approved")
    }

    return filtered
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string
          setNewKnowledge((prev) => ({
            ...prev,
            images: [...prev.images, imageUrl],
          }))
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setNewKnowledge((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // 读取文件内容用于预览
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setNewStandard((prev) => ({
          ...prev,
          file,
        }))
      }
      reader.readAsText(file)
    }
  }

  const saveKnowledge = () => {
    if (!newKnowledge.title || !newKnowledge.category || !newKnowledge.content) return

    const knowledge: KnowledgeItem = {
      id: editingItem?.id || Date.now().toString(),
      title: newKnowledge.title,
      category: newKnowledge.category,
      content: newKnowledge.content,
      images: newKnowledge.images,
      tags: newKnowledge.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      status: currentUser.role === "admin" ? "approved" : "pending",
      authorId: currentUser.id,
      authorName: currentUser.name,
      createdAt: editingItem?.createdAt || new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }

    let updatedKnowledge
    if (editingItem) {
      updatedKnowledge = knowledgeItems.map((item) => (item.id === editingItem.id ? knowledge : item))
    } else {
      updatedKnowledge = [knowledge, ...knowledgeItems]
    }

    setKnowledgeItems(updatedKnowledge)
    localStorage.setItem("curtainWallKnowledge", JSON.stringify(updatedKnowledge))

    setShowAddKnowledgeDialog(false)
    setEditingItem(null)
    setNewKnowledge({ title: "", category: "", content: "", tags: "", images: [] })
  }

  const saveStandard = () => {
    if (!newStandard.name || !newStandard.code || !newStandard.category) return

    // 读取文件内容
    if (newStandard.file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const fileContent = e.target?.result as string

        const standard: Standard = {
          id: Date.now().toString(),
          name: newStandard.name,
          code: newStandard.code,
          category: newStandard.category,
          description: newStandard.description,
          fileName: newStandard.file?.name,
          fileType: newStandard.file?.type,
          fileUrl: newStandard.file ? URL.createObjectURL(newStandard.file) : undefined,
          fileContent: fileContent,
          status: currentUser.role === "admin" ? "approved" : "pending",
          authorId: currentUser.id,
          authorName: currentUser.name,
          uploadDate: new Date().toISOString().split("T")[0],
        }

        const updatedStandards = [standard, ...standards]
        setStandards(updatedStandards)
        localStorage.setItem("curtainWallStandards", JSON.stringify(updatedStandards))
      }
      reader.readAsText(newStandard.file)
    } else {
      const standard: Standard = {
        id: Date.now().toString(),
        name: newStandard.name,
        code: newStandard.code,
        category: newStandard.category,
        description: newStandard.description,
        status: currentUser.role === "admin" ? "approved" : "pending",
        authorId: currentUser.id,
        authorName: currentUser.name,
        uploadDate: new Date().toISOString().split("T")[0],
      }

      const updatedStandards = [standard, ...standards]
      setStandards(updatedStandards)
      localStorage.setItem("curtainWallStandards", JSON.stringify(updatedStandards))
    }

    setShowAddStandardDialog(false)
    setNewStandard({ name: "", code: "", category: "", description: "", file: null })
  }

  const updateStatus = (type: "knowledge" | "standard", id: string, status: "approved" | "rejected") => {
    if (type === "knowledge") {
      const updated = knowledgeItems.map((item) => (item.id === id ? { ...item, status } : item))
      setKnowledgeItems(updated)
      localStorage.setItem("curtainWallKnowledge", JSON.stringify(updated))
    } else {
      const updated = standards.map((item) => (item.id === id ? { ...item, status } : item))
      setStandards(updated)
      localStorage.setItem("curtainWallStandards", JSON.stringify(updated))
    }
  }

  const deleteKnowledge = (id: string) => {
    const updated = knowledgeItems.filter((item) => item.id !== id)
    setKnowledgeItems(updated)
    localStorage.setItem("curtainWallKnowledge", JSON.stringify(updated))
  }

  const deleteStandard = (id: string) => {
    const updated = standards.filter((standard) => standard.id !== id)
    setStandards(updated)
    localStorage.setItem("curtainWallStandards", JSON.stringify(updated))
  }

  const editKnowledge = (item: KnowledgeItem) => {
    setEditingItem(item)
    setNewKnowledge({
      title: item.title,
      category: item.category,
      content: item.content,
      tags: item.tags.join(", "),
      images: item.images || [],
    })
    setShowAddKnowledgeDialog(true)
  }

  const previewStandard = (standard: Standard) => {
    setSelectedStandard(standard)
    setShowPreviewDialog(true)
  }

  const downloadStandard = (standard: Standard) => {
    if (standard.fileUrl) {
      const link = document.createElement("a")
      link.href = standard.fileUrl
      link.download = standard.fileName || `${standard.name}.${standard.fileType?.split("/")[1] || "txt"}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            已审核
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            待审核
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            已拒绝
          </Badge>
        )
      default:
        return null
    }
  }

  const pendingKnowledge = knowledgeItems.filter((item) => item.status === "pending")
  const pendingStandards = standards.filter((item) => item.status === "pending")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-4 md:mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>

        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-slate-800 mb-2 md:mb-3">幕墙查询工具</h1>
              <p className="text-slate-600 text-base md:text-lg">专业幕墙技术知识库与行业规范查询平台</p>
            </div>
            {currentUser.role === "admin" && (pendingKnowledge.length > 0 || pendingStandards.length > 0) && (
              <Button onClick={() => setShowAdminDialog(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
                <Clock className="w-4 h-4 mr-2" />
                待审核 ({pendingKnowledge.length + pendingStandards.length})
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue="knowledge" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-100 mb-6 md:mb-8">
            <TabsTrigger
              value="knowledge"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-sm md:text-base"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">技术知识库</span>
              <span className="sm:hidden">知识库</span>
            </TabsTrigger>
            <TabsTrigger
              value="standards"
              className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-sm md:text-base"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">规范标准</span>
              <span className="sm:hidden">规范</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="knowledge" className="space-y-4 md:space-y-6">
            <Card className="border border-slate-200 shadow-lg bg-white">
              <CardHeader className="bg-purple-600 text-white rounded-t-lg p-4 md:p-6">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="flex items-center gap-2 text-lg md:text-xl">
                    <Search className="w-5 h-5" />
                    知识库搜索
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowAddKnowledgeDialog(true)}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    添加知识
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="搜索知识内容、标题或标签..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-slate-300 focus:border-purple-500"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-48 border-slate-300">
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部分类</SelectItem>
                      {knowledgeCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 md:space-y-4">
                  {getFilteredKnowledge().map((item) => (
                    <div
                      key={item.id}
                      className="border border-slate-200 rounded-lg p-3 md:p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base md:text-lg text-slate-800 mb-2 break-words">
                            {item.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                              {item.category}
                            </Badge>
                            {getStatusBadge(item.status)}
                            <span className="text-xs md:text-sm text-slate-500">
                              {item.authorName} · {item.updatedAt}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedItem(item)
                              setShowViewDialog(true)
                            }}
                            className="border-slate-300"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {(currentUser.role === "admin" || item.authorId === currentUser.id) && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => editKnowledge(item)}
                                className="border-slate-300"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteKnowledge(item.id)}
                                className="border-slate-300 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-600 text-sm mb-2 line-clamp-2 break-words">
                        {item.content.substring(0, 120)}...
                      </p>

                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {getFilteredKnowledge().length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <Search className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p>未找到相关知识内容</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="standards" className="space-y-4 md:space-y-6">
            <Card className="border border-slate-200 shadow-lg bg-white">
              <CardHeader className="bg-purple-600 text-white rounded-t-lg p-4 md:p-6">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="flex items-center gap-2 text-lg md:text-xl">
                    <FileText className="w-5 h-5" />
                    规范标准库
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowAddStandardDialog(true)}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 w-full sm:w-auto"
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    上传规范
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="搜索规范名称、编号或描述..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-slate-300 focus:border-purple-500"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-48 border-slate-300">
                      <SelectValue placeholder="选择类别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类别</SelectItem>
                      {standardCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 md:space-y-4">
                  {getFilteredStandards().map((standard) => (
                    <div
                      key={standard.id}
                      className="border border-slate-200 rounded-lg p-3 md:p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base md:text-lg text-slate-800 mb-1 break-words">
                            {standard.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                              {standard.code}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {standard.category}
                            </Badge>
                            {getStatusBadge(standard.status)}
                            <span className="text-xs md:text-sm text-slate-500">
                              {standard.authorName} · {standard.uploadDate}
                            </span>
                          </div>
                          {standard.fileName && (
                            <div className="text-xs text-slate-500 mb-2">文件: {standard.fileName}</div>
                          )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {(standard.fileContent || standard.fileUrl) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => previewStandard(standard)}
                              className="border-slate-300"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              预览
                            </Button>
                          )}
                          {standard.fileUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadStandard(standard)}
                              className="border-slate-300"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                          {(currentUser.role === "admin" || standard.authorId === currentUser.id) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteStandard(standard.id)}
                              className="border-slate-300 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-600 text-sm break-words">{standard.description}</p>
                    </div>
                  ))}

                  {getFilteredStandards().length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <p>未找到相关规范标准</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 添加/编辑知识对话框 */}
        <Dialog open={showAddKnowledgeDialog} onOpenChange={setShowAddKnowledgeDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "编辑知识" : "添加新知识"}</DialogTitle>
              <DialogDescription>
                {editingItem ? "修改现有的技术知识内容" : "向知识库添加新的技术知识"}
                {currentUser.role !== "admin" && " (需要管理员审核)"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">标题</Label>
                  <Input
                    id="title"
                    value={newKnowledge.title}
                    onChange={(e) => setNewKnowledge({ ...newKnowledge, title: e.target.value })}
                    placeholder="输入知识标题"
                    className="mt-1 border-slate-300 focus:border-purple-500"
                  />
                </div>
                <div>
                  <Label htmlFor="category">分类</Label>
                  <Select
                    value={newKnowledge.category}
                    onValueChange={(value) => setNewKnowledge({ ...newKnowledge, category: value })}
                  >
                    <SelectTrigger className="mt-1 border-slate-300">
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      {knowledgeCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="content">内容</Label>
                <Textarea
                  id="content"
                  value={newKnowledge.content}
                  onChange={(e) => setNewKnowledge({ ...newKnowledge, content: e.target.value })}
                  placeholder="输入详细的技术知识内容"
                  className="mt-1 min-h-32 border-slate-300 focus:border-purple-500"
                />
              </div>

              <div>
                <Label htmlFor="images">图片</Label>
                <div className="mt-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="border-slate-300"
                    />
                    <Button type="button" variant="outline" size="sm">
                      <ImageIcon className="w-4 h-4 mr-1" />
                      选择图片
                    </Button>
                  </div>

                  {newKnowledge.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {newKnowledge.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`上传图片 ${index + 1}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="tags">标签</Label>
                <Input
                  id="tags"
                  value={newKnowledge.tags}
                  onChange={(e) => setNewKnowledge({ ...newKnowledge, tags: e.target.value })}
                  placeholder="输入标签，用逗号分隔"
                  className="mt-1 border-slate-300 focus:border-purple-500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddKnowledgeDialog(false)
                  setEditingItem(null)
                  setNewKnowledge({ title: "", category: "", content: "", tags: "", images: [] })
                }}
                className="border-slate-300"
              >
                取消
              </Button>
              <Button
                onClick={saveKnowledge}
                disabled={!newKnowledge.title || !newKnowledge.category || !newKnowledge.content}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {editingItem ? "更新" : "保存"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 添加规范对话框 */}
        <Dialog open={showAddStandardDialog} onOpenChange={setShowAddStandardDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>上传新规范</DialogTitle>
              <DialogDescription>
                添加新的行业规范标准到数据库
                {currentUser.role !== "admin" && " (需要管理员审核)"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="standard-name">规范名称</Label>
                  <Input
                    id="standard-name"
                    value={newStandard.name}
                    onChange={(e) => setNewStandard({ ...newStandard, name: e.target.value })}
                    placeholder="输入规范名称"
                    className="mt-1 border-slate-300 focus:border-purple-500"
                  />
                </div>
                <div>
                  <Label htmlFor="standard-code">规范编号</Label>
                  <Input
                    id="standard-code"
                    value={newStandard.code}
                    onChange={(e) => setNewStandard({ ...newStandard, code: e.target.value })}
                    placeholder="如：GB/T 21086-2007"
                    className="mt-1 border-slate-300 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="standard-category">规范类别</Label>
                <Select
                  value={newStandard.category}
                  onValueChange={(value) => setNewStandard({ ...newStandard, category: value })}
                >
                  <SelectTrigger className="mt-1 border-slate-300">
                    <SelectValue placeholder="选择类别" />
                  </SelectTrigger>
                  <SelectContent>
                    {standardCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="file-upload">上传文件</Label>
                <div className="mt-1">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="border-slate-300"
                  />
                  <div className="text-xs text-slate-500 mt-1">支持格式：PDF、Word文档、文本文件</div>
                  {newStandard.file && (
                    <div className="mt-2 text-sm text-slate-600">已选择: {newStandard.file.name}</div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="standard-description">规范描述</Label>
                <Textarea
                  id="standard-description"
                  value={newStandard.description}
                  onChange={(e) => setNewStandard({ ...newStandard, description: e.target.value })}
                  placeholder="输入规范的适用范围和主要内容"
                  className="mt-1 border-slate-300 focus:border-purple-500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddStandardDialog(false)
                  setNewStandard({ name: "", code: "", category: "", description: "", file: null })
                }}
                className="border-slate-300"
              >
                取消
              </Button>
              <Button
                onClick={saveStandard}
                disabled={!newStandard.name || !newStandard.code || !newStandard.category}
                className="bg-purple-600 hover:bg-purple-700"
              >
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 查看知识详情对话框 */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedItem?.title}</DialogTitle>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {selectedItem?.category}
                </Badge>
                {selectedItem && getStatusBadge(selectedItem.status)}
                <span className="text-sm text-slate-500">
                  {selectedItem?.authorName} · 更新于 {selectedItem?.updatedAt}
                </span>
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedItem?.content}</p>
              </div>

              {selectedItem?.images && selectedItem.images.length > 0 && (
                <div>
                  <h4 className="font-medium text-slate-800 mb-3">相关图片</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedItem.images.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`图片 ${index + 1}`}
                        className="w-full h-48 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedItem?.tags && selectedItem.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* 规范预览对话框 */}
        <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedStandard?.name}</DialogTitle>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {selectedStandard?.code}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {selectedStandard?.category}
                </Badge>
                {selectedStandard && getStatusBadge(selectedStandard.status)}
                <span className="text-sm text-slate-500">
                  {selectedStandard?.authorName} · {selectedStandard?.uploadDate}
                </span>
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg border">
                <h4 className="font-medium text-slate-800 mb-2">规范描述</h4>
                <p className="text-slate-600 text-sm">{selectedStandard?.description}</p>
              </div>

              {selectedStandard?.fileContent && (
                <div>
                  <h4 className="font-medium text-slate-800 mb-3">文件内容预览</h4>
                  <div className="bg-white border border-slate-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                      {selectedStandard.fileContent}
                    </pre>
                  </div>
                </div>
              )}

              {selectedStandard?.fileUrl && selectedStandard?.fileType?.includes("pdf") && (
                <div>
                  <h4 className="font-medium text-slate-800 mb-3">PDF预览</h4>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <iframe src={selectedStandard.fileUrl} className="w-full h-96" title="PDF预览" />
                  </div>
                </div>
              )}

              {selectedStandard?.fileName && (
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                  <span className="text-sm text-slate-600">文件: {selectedStandard.fileName}</span>
                  <Button
                    size="sm"
                    onClick={() => selectedStandard && downloadStandard(selectedStandard)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    下载文件
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* 管理员审核对话框 */}
        {currentUser.role === "admin" && (
          <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>内容审核管理</DialogTitle>
                <DialogDescription>审核用户提交的知识和规范内容</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {pendingKnowledge.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">待审核知识 ({pendingKnowledge.length})</h3>
                    <div className="space-y-3">
                      {pendingKnowledge.map((item) => (
                        <div key={item.id} className="border border-slate-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{item.title}</h4>
                              <div className="text-sm text-slate-500">
                                {item.authorName} · {item.createdAt} · {item.category}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateStatus("knowledge", item.id, "approved")}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                通过
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStatus("knowledge", item.id, "rejected")}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                拒绝
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2">{item.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {pendingStandards.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">待审核规范 ({pendingStandards.length})</h3>
                    <div className="space-y-3">
                      {pendingStandards.map((item) => (
                        <div key={item.id} className="border border-slate-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <div className="text-sm text-slate-500">
                                {item.authorName} · {item.uploadDate} · {item.code} · {item.category}
                              </div>
                              {item.fileName && <div className="text-sm text-slate-500">文件: {item.fileName}</div>}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateStatus("standard", item.id, "approved")}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                通过
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStatus("standard", item.id, "rejected")}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                拒绝
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {pendingKnowledge.length === 0 && pendingStandards.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    <p>暂无待审核内容</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
