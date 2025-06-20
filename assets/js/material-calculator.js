"use client"

// WordPress React 组件
const { createElement: h, useState, useEffect, useCallback } = window.wp.element
const materialCalculatorAjax = window.materialCalculatorAjax

// 材料数据库
const materialDatabase = [
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
    weightFormula: (spec, length) => {
      const weights = {
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
    weightFormula: (spec, length) => {
      const weights = {
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
    weightFormula: (spec, length) => {
      const weights = {
        10: 11.261,
        12: 13.987,
        14: 16.89,
        16: 20.513,
        18: 24.143,
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
    weightFormula: (spec, length) => {
      const weights = {
        5: 5.438,
        6.3: 7.011,
        8: 9.065,
        10: 11.261,
        12: 13.987,
        14: 16.89,
        16: 20.513,
        18: 24.143,
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
    weightFormula: (spec, length) => {
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
    weightFormula: (spec, length) => {
      const side = Number.parseFloat(spec)
      const weight = (Math.pow(side, 2) * 7.85) / 1000000
      return weight * length
    },
    unit: "kg/m",
  },
]

// 首页组件
function MaterialCalculatorHome() {
  return h(
    "div",
    { className: "min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" },
    // 装饰性背景元素
    h(
      "div",
      { className: "absolute inset-0 overflow-hidden" },
      h("div", {
        className:
          "absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl",
      }),
      h("div", {
        className:
          "absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl",
      }),
    ),
    h(
      "div",
      { className: "relative container mx-auto px-4 py-12" },
      // 标题部分
      h(
        "div",
        { className: "text-center mb-16" },
        h(
          "div",
          {
            className:
              "inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-blue-600 font-medium mb-6 shadow-sm",
          },
          h("span", { className: "text-blue-600" }, "✨"),
          h("span", null, "专业材料计算工具"),
        ),
        h(
          "h1",
          {
            className:
              "text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6",
          },
          "材料计算助手",
        ),
        h(
          "p",
          { className: "text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" },
          "智能化条材套裁优化与精确材料重量查询，助力工程项目降本增效",
        ),
      ),

      // 功能卡片
      h(
        "div",
        { className: "grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12" },
        // 条材套裁优化
        h(
          "div",
          {
            className:
              "group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2 rounded-lg",
          },
          h(
            "div",
            { className: "text-center pb-4 p-6" },
            h(
              "div",
              {
                className:
                  "w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg",
              },
              h("span", { className: "w-8 h-8 md:w-10 md:h-10 text-white text-2xl" }, "✂️"),
            ),
            h("h3", { className: "text-xl md:text-2xl font-bold mb-2 md:mb-3" }, "条材套裁优化"),
            h(
              "p",
              { className: "text-sm md:text-base leading-relaxed text-gray-600 mb-4 md:mb-6" },
              "智能算法计算最优切割方案，支持锯缝宽度设置，最大化材料利用率，减少浪费",
            ),
          ),
          h(
            "div",
            { className: "px-4 md:px-6 pb-6" },
            h(
              "div",
              { className: "space-y-3 md:space-y-4 mb-4 md:mb-6" },
              h(
                "div",
                { className: "flex items-center gap-3 text-sm text-gray-600" },
                h("div", { className: "w-2 h-2 bg-blue-500 rounded-full" }),
                h("span", null, "智能优化算法"),
              ),
              h(
                "div",
                { className: "flex items-center gap-3 text-sm text-gray-600" },
                h("div", { className: "w-2 h-2 bg-blue-500 rounded-full" }),
                h("span", null, "锯缝宽度计算"),
              ),
              h(
                "div",
                { className: "flex items-center gap-3 text-sm text-gray-600" },
                h("div", { className: "w-2 h-2 bg-blue-500 rounded-full" }),
                h("span", null, "方案保存记录"),
              ),
            ),
            h(
              "button",
              {
                className:
                  "w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg text-sm md:text-base text-white py-3 px-6 rounded-lg font-medium transition-all",
                onClick: () => {
                  const url = new URL(window.location.href)
                  url.hash = "cutting-optimizer"
                  window.location.href = url.toString()
                },
              },
              "开始套裁计算",
            ),
          ),
        ),

        // 材料重量查询
        h(
          "div",
          {
            className:
              "group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2 rounded-lg",
          },
          h(
            "div",
            { className: "text-center pb-4 p-6" },
            h(
              "div",
              {
                className:
                  "w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg",
              },
              h("span", { className: "w-8 h-8 md:w-10 md:h-10 text-white text-2xl" }, "⚖️"),
            ),
            h("h3", { className: "text-xl md:text-2xl font-bold mb-2 md:mb-3" }, "材料重量查询"),
            h(
              "p",
              { className: "text-sm md:text-base leading-relaxed text-gray-600 mb-4 md:mb-6" },
              "精确查询各种型材理论重量，涵盖角钢、工字钢、槽钢等常用建筑材料",
            ),
          ),
          h(
            "div",
            { className: "px-4 md:px-6 pb-6" },
            h(
              "div",
              { className: "space-y-3 md:space-y-4 mb-4 md:mb-6" },
              h(
                "div",
                { className: "flex items-center gap-3 text-sm text-gray-600" },
                h("div", { className: "w-2 h-2 bg-green-500 rounded-full" }),
                h("span", null, "国标数据计算"),
              ),
              h(
                "div",
                { className: "flex items-center gap-3 text-sm text-gray-600" },
                h("div", { className: "w-2 h-2 bg-green-500 rounded-full" }),
                h("span", null, "丰富材料数据库"),
              ),
              h(
                "div",
                { className: "flex items-center gap-3 text-sm text-gray-600" },
                h("div", { className: "w-2 h-2 bg-green-500 rounded-full" }),
                h("span", null, "便捷弹窗选择"),
              ),
            ),
            h(
              "button",
              {
                className:
                  "w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg text-sm md:text-base text-white py-3 px-6 rounded-lg font-medium transition-all",
                onClick: () => {
                  const url = new URL(window.location.href)
                  url.hash = "weight-calculator"
                  window.location.href = url.toString()
                },
              },
              "查询材料重量",
            ),
          ),
        ),

        // 幕墙知识
        h(
          "div",
          {
            className:
              "group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2 rounded-lg",
          },
          h(
            "div",
            { className: "text-center pb-4 p-6" },
            h(
              "div",
              {
                className:
                  "w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg",
              },
              h("span", { className: "w-8 h-8 md:w-10 md:h-10 text-white text-2xl" }, "📚"),
            ),
            h("h3", { className: "text-xl md:text-2xl font-bold mb-2 md:mb-3" }, "幕墙知识"),
            h(
              "p",
              { className: "text-sm md:text-base leading-relaxed text-gray-600 mb-4 md:mb-6" },
              "专业幕墙知识库，基于WordPress文章系统，涵盖技术要点和行业规范",
            ),
          ),
          h(
            "div",
            { className: "px-4 md:px-6 pb-6" },
            h(
              "div",
              { className: "space-y-3 md:space-y-4 mb-4 md:mb-6" },
              h(
                "div",
                { className: "flex items-center gap-3 text-sm text-gray-600" },
                h("div", { className: "w-2 h-2 bg-purple-500 rounded-full" }),
                h("span", null, "WordPress文章管理"),
              ),
              h(
                "div",
                { className: "flex items-center gap-3 text-sm text-gray-600" },
                h("div", { className: "w-2 h-2 bg-purple-500 rounded-full" }),
                h("span", null, "分类标签检索"),
              ),
              h(
                "div",
                { className: "flex items-center gap-3 text-sm text-gray-600" },
                h("div", { className: "w-2 h-2 bg-purple-500 rounded-full" }),
                h("span", null, "专业技术内容"),
              ),
            ),
            h(
              "button",
              {
                className:
                  "w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg text-sm md:text-base text-white py-3 px-6 rounded-lg font-medium transition-all",
                onClick: () => {
                  const url = new URL(window.location.href)
                  url.hash = "curtain-wall-knowledge"
                  window.location.href = url.toString()
                },
              },
              "浏览幕墙知识",
            ),
          ),
        ),
      ),

      // 幕墙知识预览
      h(
        "div",
        { className: "max-w-6xl mx-auto" },
        h(
          "div",
          { className: "text-center mb-8" },
          h("h2", { className: "text-3xl font-bold text-gray-900 mb-4" }, "幕墙技术知识预览"),
          h("p", { className: "text-gray-600" }, "精选专业幕墙技术知识，助力工程实践"),
        ),

        h(
          "div",
          { className: "grid md:grid-cols-3 gap-6 mb-8" },
          h(
            "div",
            {
              className:
                "border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow rounded-lg overflow-hidden",
            },
            h(
              "div",
              { className: "pb-4 p-6" },
              h(
                "div",
                { className: "flex items-center gap-3 mb-3" },
                h(
                  "div",
                  {
                    className:
                      "w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center",
                  },
                  h("span", { className: "w-5 h-5 text-white" }, "🛡️"),
                ),
                h(
                  "span",
                  {
                    className:
                      "bg-red-50 text-red-700 border-red-200 px-3 py-1 rounded-full text-sm font-medium border",
                  },
                  "防雷系统",
                ),
              ),
              h("h3", { className: "text-lg font-semibold mb-3" }, "幕墙防雷系统设计要点"),
            ),
            h(
              "div",
              { className: "px-6 pb-6" },
              h(
                "p",
                { className: "text-gray-600 text-sm leading-relaxed mb-4" },
                "幕墙防雷系统应包括接闪器、引下线和接地装置三个基本组成部分。接闪器通常采用避雷针、避雷带或避雷网...",
              ),
              h(
                "div",
                { className: "flex flex-wrap gap-1" },
                h("span", { className: "px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs" }, "防雷"),
                h("span", { className: "px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs" }, "设计"),
                h("span", { className: "px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs" }, "安全"),
              ),
            ),
          ),

          h(
            "div",
            {
              className:
                "border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow rounded-lg overflow-hidden",
            },
            h(
              "div",
              { className: "pb-4 p-6" },
              h(
                "div",
                { className: "flex items-center gap-3 mb-3" },
                h(
                  "div",
                  {
                    className:
                      "w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center",
                  },
                  h("span", { className: "w-5 h-5 text-white" }, "🔧"),
                ),
                h(
                  "span",
                  {
                    className:
                      "bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 rounded-full text-sm font-medium border",
                  },
                  "转接件",
                ),
              ),
              h("h3", { className: "text-lg font-semibold mb-3" }, "转接件安装技术要求"),
            ),
            h(
              "div",
              { className: "px-6 pb-6" },
              h(
                "p",
                { className: "text-gray-600 text-sm leading-relaxed mb-4" },
                "转接件是连接幕墙与主体结构的重要构件。安装前应检查预埋件位置、尺寸和标高；转接件与预埋件的连接应采用焊接...",
              ),
              h(
                "div",
                { className: "flex flex-wrap gap-1" },
                h("span", { className: "px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs" }, "转接件"),
                h("span", { className: "px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs" }, "安装"),
                h("span", { className: "px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs" }, "连接"),
              ),
            ),
          ),

          h(
            "div",
            {
              className:
                "border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow rounded-lg overflow-hidden",
            },
            h(
              "div",
              { className: "pb-4 p-6" },
              h(
                "div",
                { className: "flex items-center gap-3 mb-3" },
                h(
                  "div",
                  {
                    className:
                      "w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center",
                  },
                  h("span", { className: "w-5 h-5 text-white" }, "📖"),
                ),
                h(
                  "span",
                  {
                    className:
                      "bg-green-50 text-green-700 border-green-200 px-3 py-1 rounded-full text-sm font-medium border",
                  },
                  "结构胶",
                ),
              ),
              h("h3", { className: "text-lg font-semibold mb-3" }, "结构胶使用注意事项"),
            ),
            h(
              "div",
              { className: "px-6 pb-6" },
              h(
                "p",
                { className: "text-gray-600 text-sm leading-relaxed mb-4" },
                "结构胶是幕墙系统的关键材料，使用时应注意：严格按配比混合，搅拌均匀；在规定时间内用完，避免超过适用期...",
              ),
              h(
                "div",
                { className: "flex flex-wrap gap-1" },
                h("span", { className: "px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs" }, "结构胶"),
                h("span", { className: "px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs" }, "施工"),
                h("span", { className: "px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs" }, "质量"),
              ),
            ),
          ),
        ),

        h(
          "div",
          { className: "text-center" },
          h(
            "button",
            {
              className:
                "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg px-8 py-3 rounded-lg font-medium transition-all inline-flex items-center gap-2",
              onClick: () => {
                const url = new URL(window.location.href)
                url.hash = "curtain-wall-knowledge"
                window.location.href = url.toString()
              },
            },
            "查看更多幕墙知识",
            h("span", { className: "w-4 h-4 ml-2" }, "🔍"),
          ),
        ),
      ),
    ),
  )
}

// 材料选择对话框组件
function MaterialSelectorDialog({ open, onOpenChange, materials, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const categories = Array.from(new Set(materials.map((m) => m.category)))

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || material.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSelect = (material) => {
    onSelect(material)
    onOpenChange(false)
    setSearchTerm("")
    setSelectedCategory("")
  }

  if (!open) return null

  return h(
    "div",
    {
      className: "fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50",
      onClick: () => onOpenChange(false),
    },
    h(
      "div",
      {
        className: "bg-white rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto w-full",
        onClick: (e) => e.stopPropagation(),
      },
      h(
        "div",
        { className: "p-6 border-b" },
        h(
          "h2",
          {
            className:
              "text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2",
          },
          "选择材料类型",
        ),
        h("p", { className: "text-gray-600" }, "选择您要查询重量的材料类型和规格"),
      ),
      h(
        "div",
        { className: "p-6 space-y-4" },
        // 搜索框
        h(
          "div",
          { className: "relative" },
          h("span", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" }, "🔍"),
          h("input", {
            type: "text",
            placeholder: "搜索材料名称...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className:
              "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          }),
        ),

        // 分类筛选
        h(
          "div",
          { className: "flex flex-wrap gap-2" },
          h(
            "button",
            {
              className: `px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-blue-50"
              }`,
              onClick: () => setSelectedCategory(""),
            },
            "全部",
          ),
          categories.map((category) =>
            h(
              "button",
              {
                key: category,
                className: `px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-50"
                }`,
                onClick: () => setSelectedCategory(category),
              },
              category,
            ),
          ),
        ),

        // 材料列表
        h(
          "div",
          { className: "max-h-96 overflow-y-auto space-y-2" },
          filteredMaterials.length === 0
            ? h(
                "div",
                { className: "text-center py-8 text-gray-500" },
                h("div", { className: "text-4xl mb-4" }, "🔍"),
                h("p", null, "未找到匹配的材料"),
                h("p", { className: "text-sm" }, "请尝试其他搜索关键词"),
              )
            : filteredMaterials.map((material) =>
                h(
                  "div",
                  {
                    key: material.name,
                    className:
                      "border rounded-lg p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-200 hover:shadow-md",
                    onClick: () => handleSelect(material),
                  },
                  h(
                    "div",
                    { className: "flex justify-between items-start mb-2" },
                    h(
                      "div",
                      null,
                      h("h3", { className: "font-semibold text-lg text-gray-800" }, material.name),
                      h(
                        "span",
                        { className: "inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm" },
                        material.category,
                      ),
                    ),
                    h("div", { className: "text-sm text-gray-500" }, material.specs.length, " 种规格"),
                  ),
                  h(
                    "div",
                    { className: "flex flex-wrap gap-1 mt-3" },
                    material.specs
                      .slice(0, 8)
                      .map((spec) =>
                        h(
                          "span",
                          { key: spec, className: "px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs" },
                          spec,
                        ),
                      ),
                    material.specs.length > 8 &&
                      h(
                        "span",
                        { className: "px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs" },
                        `+${material.specs.length - 8}`,
                      ),
                  ),
                ),
              ),
        ),
      ),
      h(
        "div",
        { className: "p-6 border-t flex justify-end" },
        h(
          "button",
          {
            className: "px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors",
            onClick: () => onOpenChange(false),
          },
          "关闭",
        ),
      ),
    ),
  )
}

// 规格选择对话框组件
function SpecSelectorDialog({ open, onOpenChange, material, selectedSpec, onSelect }) {
  const [searchTerm, setSearchTerm] = useState("")

  if (!material || !open) return null

  const filteredSpecs = material.specs.filter((spec) => spec.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSelect = (spec) => {
    onSelect(spec)
    onOpenChange(false)
    setSearchTerm("")
  }

  // 按规格大小排序
  const sortedSpecs = filteredSpecs.sort((a, b) => {
    const getFirstNumber = (str) => {
      const match = str.match(/\d+/)
      return match ? Number.parseInt(match[0]) : 0
    }
    return getFirstNumber(a) - getFirstNumber(b)
  })

  return h(
    "div",
    {
      className: "fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50",
      onClick: () => onOpenChange(false),
    },
    h(
      "div",
      {
        className: "bg-white rounded-lg max-w-2xl max-h-[80vh] overflow-y-auto w-full",
        onClick: (e) => e.stopPropagation(),
      },
      h(
        "div",
        { className: "p-6 border-b" },
        h(
          "h2",
          {
            className:
              "text-2xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2",
          },
          "选择规格型号",
        ),
        h("p", { className: "text-gray-600" }, `${material.name} - 选择您需要的规格型号`),
      ),
      h(
        "div",
        { className: "p-6 space-y-4" },
        // 搜索框
        h(
          "div",
          { className: "relative" },
          h("span", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" }, "🔍"),
          h("input", {
            type: "text",
            placeholder: "搜索规格型号...",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className:
              "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",
          }),
        ),

        // 当前选择
        selectedSpec &&
          h(
            "div",
            { className: "bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg border border-blue-200" },
            h("div", { className: "text-sm text-blue-700 mb-1" }, "当前选择"),
            h(
              "span",
              { className: "px-3 py-1 bg-blue-100 text-blue-800 border-blue-200 rounded-full text-sm font-medium" },
              selectedSpec,
            ),
          ),

        // 规格网格
        h(
          "div",
          { className: "max-h-96 overflow-y-auto" },
          h(
            "div",
            { className: "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3" },
            sortedSpecs.length === 0
              ? h(
                  "div",
                  { className: "col-span-full text-center py-8 text-gray-500" },
                  h("div", { className: "text-4xl mb-4" }, "🔍"),
                  h("p", null, "未找到匹配的规格"),
                  h("p", { className: "text-sm" }, "请尝试其他搜索关键词"),
                )
              : sortedSpecs.map((spec) =>
                  h(
                    "div",
                    {
                      key: spec,
                      className: `p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 text-center ${
                        selectedSpec === spec
                          ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md"
                          : "border-gray-200 hover:border-green-300 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:shadow-sm"
                      }`,
                      onClick: () => handleSelect(spec),
                    },
                    h("div", { className: "font-semibold text-gray-800" }, spec),
                    h(
                      "div",
                      { className: "text-xs text-gray-500 mt-1" },
                      `${material.weightFormula(spec, 1000).toFixed(3)} kg/m`,
                    ),
                  ),
                ),
          ),
        ),

        // 规格说明
        h(
          "div",
          { className: "bg-gray-50 p-4 rounded-lg" },
          h("h4", { className: "font-medium text-gray-800 mb-2" }, "规格说明"),
          h(
            "div",
            { className: "text-sm text-gray-600 space-y-1" },
            material.category === "角钢" && h("p", null, "• 格式：边长×厚度 (mm)，如 50×5 表示边长50mm，厚度5mm"),
            material.category === "工字钢" && h("p", null, "• 格式：高度编号，如 20a 表示20号工字钢"),
            material.category === "槽钢" && h("p", null, "• 格式：高度编号，如 16 表示16号槽钢"),
            (material.category === "圆钢" || material.category === "方钢") && h("p", null, "• 格式：直径/边长 (mm)"),
            h("p", null, "• 理论重量基于钢材密度 7.85 g/cm³ 计算"),
          ),
        ),
      ),
      h(
        "div",
        { className: "p-6 border-t flex justify-end" },
        h(
          "button",
          {
            className: "px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors",
            onClick: () => onOpenChange(false),
          },
          "关闭",
        ),
      ),
    ),
  )
}

// 材料重量查询组件
function WeightCalculator() {
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [selectedSpec, setSelectedSpec] = useState("")
  const [length, setLength] = useState(6000)
  const [calculatedWeight, setCalculatedWeight] = useState(null)
  const [showMaterialDialog, setShowMaterialDialog] = useState(false)
  const [showSpecDialog, setShowSpecDialog] = useState(false)
  const [isQuickSelectOpen, setIsQuickSelectOpen] = useState(false)

  const handleMaterialSelect = (material) => {
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

  return h(
    "div",
    { className: "min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" },
    h(
      "div",
      { className: "container mx-auto px-4 py-8" },
      h(
        "div",
        { className: "mb-8" },
        h(
          "h1",
          {
            className:
              "text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-3",
          },
          "材料重量查询",
        ),
        h("p", { className: "text-gray-600 text-lg" }, "精确查询各种型材理论重量，基于国标数据计算"),
      ),

      h(
        "div",
        { className: "grid lg:grid-cols-2 gap-8" },
        h(
          "div",
          { className: "space-y-6" },
          h(
            "div",
            { className: "border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden" },
            h(
              "div",
              { className: "bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6" },
              h("h2", { className: "text-xl font-bold flex items-center gap-2" }, "🔍 材料选择"),
              h("p", { className: "text-green-100 mt-2" }, "选择材料类型和规格进行重量计算"),
            ),
            h(
              "div",
              { className: "p-6 space-y-6" },
              h(
                "div",
                null,
                h("label", { className: "text-sm font-medium text-gray-700 mb-3 block" }, "材料类型"),
                h(
                  "button",
                  {
                    className:
                      "w-full justify-start h-12 text-left bg-gradient-to-r from-gray-50 to-white hover:from-green-50 hover:to-emerald-50 border-2 hover:border-green-200 rounded-lg px-4 py-2 transition-all flex items-center",
                    onClick: () => setShowMaterialDialog(true),
                  },
                  selectedMaterial
                    ? h(
                        "div",
                        { className: "flex items-center gap-3" },
                        h(
                          "span",
                          { className: "px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm" },
                          selectedMaterial.category,
                        ),
                        h("span", { className: "font-medium" }, selectedMaterial.name),
                      )
                    : h(
                        "div",
                        { className: "flex items-center gap-2 text-gray-500" },
                        h("span", null, "🔍"),
                        h("span", null, "点击选择材料类型"),
                      ),
                ),
              ),

              selectedMaterial &&
                h(
                  "div",
                  null,
                  h("label", { className: "text-sm font-medium text-gray-700 mb-3 block" }, "规格型号"),
                  h(
                    "button",
                    {
                      className:
                        "w-full justify-start h-12 text-left bg-gradient-to-r from-gray-50 to-white hover:from-green-50 hover:to-emerald-50 border-2 hover:border-green-200 rounded-lg px-4 py-2 transition-all flex items-center",
                      onClick: () => setShowSpecDialog(true),
                    },
                    selectedSpec
                      ? h(
                          "div",
                          { className: "flex items-center gap-3" },
                          h("span", { className: "px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm" }, selectedSpec),
                          h(
                            "span",
                            { className: "text-gray-600" },
                            `${selectedMaterial.weightFormula(selectedSpec, 1000).toFixed(3)} kg/m`,
                          ),
                        )
                      : h(
                          "div",
                          { className: "flex items-center gap-2 text-gray-500" },
                          h("span", null, "🔍"),
                          h("span", null, "点击选择规格型号"),
                        ),
                  ),
                ),

              h(
                "div",
                null,
                h(
                  "label",
                  { htmlFor: "length", className: "text-sm font-medium text-gray-700 block mb-2" },
                  "长度 (mm)",
                ),
                h("input", {
                  id: "length",
                  type: "number",
                  value: length,
                  onChange: (e) => setLength(Number(e.target.value)),
                  placeholder: "输入长度",
                  className:
                    "w-full h-12 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent",
                }),
              ),

              h(
                "button",
                {
                  onClick: calculateWeight,
                  className:
                    "w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg h-12 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                  disabled: !selectedMaterial || !selectedSpec || length <= 0,
                },
                "🧮 计算重量",
              ),
            ),
          ),

          // 快速选择折叠卡片
          h(
            "div",
            { className: "border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden" },
            h(
              "button",
              {
                className:
                  "w-full bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 hover:from-orange-600 hover:to-red-600 transition-all duration-200 text-left",
                onClick: () => setIsQuickSelectOpen(!isQuickSelectOpen),
              },
              h(
                "div",
                { className: "flex items-center justify-between" },
                h("h2", { className: "text-xl font-bold" }, "快速选择"),
                h("span", { className: "text-2xl" }, isQuickSelectOpen ? "⬆️" : "⬇️"),
              ),
              h(
                "p",
                { className: "text-orange-100 mt-2" },
                isQuickSelectOpen ? "点击收起材料类型列表" : "点击展开快速选择材料类型",
              ),
            ),
            isQuickSelectOpen &&
              h(
                "div",
                { className: "p-6" },
                h(
                  "div",
                  { className: "space-y-4" },
                  Array.from(new Set(materialDatabase.map((m) => m.category))).map((category) =>
                    h(
                      "div",
                      { key: category },
                      h(
                        "h4",
                        { className: "font-medium mb-3 text-gray-700 flex items-center gap-2" },
                        h("div", { className: "w-2 h-2 bg-orange-500 rounded-full" }),
                        category,
                      ),
                      h(
                        "div",
                        { className: "flex flex-wrap gap-2" },
                        materialDatabase
                          .filter((m) => m.category === category)
                          .map((material) =>
                            h(
                              "button",
                              {
                                key: material.name,
                                className:
                                  "px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:border-orange-200 transition-all duration-200",
                                onClick: () => handleMaterialSelect(material),
                              },
                              material.name,
                            ),
                          ),
                      ),
                    ),
                  ),
                ),
              ),
          ),
        ),

        h(
          "div",
          { className: "space-y-6" },
          calculatedWeight !== null &&
            h(
              "div",
              { className: "border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-lg overflow-hidden" },
              h(
                "div",
                { className: "bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6" },
                h("h2", { className: "text-xl font-bold flex items-center gap-2" }, "⚡ 计算结果"),
              ),
              h(
                "div",
                { className: "p-8" },
                h(
                  "div",
                  { className: "text-center space-y-6" },
                  h(
                    "div",
                    { className: "relative" },
                    h(
                      "div",
                      {
                        className:
                          "text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
                      },
                      calculatedWeight.toFixed(2),
                    ),
                    h("div", { className: "text-2xl font-semibold text-gray-600 mt-2" }, "kg"),
                  ),

                  h(
                    "div",
                    { className: "bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border" },
                    h(
                      "div",
                      { className: "text-gray-700 font-medium" },
                      `${selectedMaterial?.name} ${selectedSpec} × ${length}mm`,
                    ),
                  ),

                  h(
                    "div",
                    { className: "grid grid-cols-2 gap-4" },
                    h(
                      "div",
                      { className: "text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl" },
                      h(
                        "div",
                        { className: "text-xl font-bold text-blue-600" },
                        selectedMaterial?.weightFormula(selectedSpec, 1000).toFixed(3),
                      ),
                      h("div", { className: "text-sm text-blue-700 font-medium" }, "kg/m"),
                      h("div", { className: "text-xs text-blue-600" }, "理论重量"),
                    ),
                    h(
                      "div",
                      { className: "text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl" },
                      h("div", { className: "text-xl font-bold text-green-600" }, (length / 1000).toFixed(2)),
                      h("div", { className: "text-sm text-green-700 font-medium" }, "m"),
                      h("div", { className: "text-xs text-green-600" }, "长度"),
                    ),
                  ),
                ),
              ),
            ),
        ),
      ),

      // 对话框
      h(MaterialSelectorDialog, {
        open: showMaterialDialog,
        onOpenChange: setShowMaterialDialog,
        materials: materialDatabase,
        onSelect: handleMaterialSelect,
      }),
      h(SpecSelectorDialog, {
        open: showSpecDialog,
        onOpenChange: setShowSpecDialog,
        material: selectedMaterial,
        selectedSpec: selectedSpec,
        onSelect: setSelectedSpec,
      }),
    ),
  )
}

// 条材套裁优化组件
function CuttingOptimizer() {
  const [materialLength, setMaterialLength] = useState(6000)
  const [sawWidth, setSawWidth] = useState(3)
  const [requiredLengths, setRequiredLengths] = useState([
    { length: 2000, quantity: 3 },
    { length: 1500, quantity: 2 },
  ])
  const [cuttingPlans, setCuttingPlans] = useState([])
  const [savedRecords, setSavedRecords] = useState([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [recordName, setRecordName] = useState("")
  const [pasteData, setPasteData] = useState("")
  const [activeTab, setActiveTab] = useState("manual")
  const [showAllPlans, setShowAllPlans] = useState(false)

  useEffect(() => {
    loadSavedRecords()
  }, [])

  const loadSavedRecords = async () => {
    try {
      const formData = new FormData()
      formData.append("action", "get_cutting_records")
      formData.append("nonce", materialCalculatorAjax.nonce)

      const response = await fetch(materialCalculatorAjax.ajaxurl, {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      if (result.success) {
        setSavedRecords(result.data || [])
      }
    } catch (error) {
      console.error("加载记录失败:", error)
    }
  }

  const addRequiredLength = () => {
    setRequiredLengths([...requiredLengths, { length: 0, quantity: 1 }])
  }

  const removeRequiredLength = (index) => {
    setRequiredLengths(requiredLengths.filter((_, i) => i !== index))
  }

  const updateRequiredLength = (index, field, value) => {
    const updated = [...requiredLengths]
    updated[index][field] = value
    setRequiredLengths(updated)
  }

  const parsePasteData = () => {
    if (!pasteData.trim()) return

    try {
      const lines = pasteData.trim().split("\n")
      const parsed = []

      for (const line of lines) {
        if (!line.trim()) continue

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
    const plans = []
    const remaining = [...requiredLengths]

    while (remaining.some((item) => item.quantity > 0)) {
      const currentCuts = []
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

  const saveRecord = async () => {
    if (!recordName.trim()) return

    try {
      const formData = new FormData()
      formData.append("action", "save_cutting_record")
      formData.append("nonce", materialCalculatorAjax.nonce)
      formData.append("record_name", recordName)
      formData.append("material_length", materialLength)
      formData.append("saw_width", sawWidth)
      formData.append("required_lengths", JSON.stringify(requiredLengths))
      formData.append("cutting_plans", JSON.stringify(cuttingPlans))

      const response = await fetch(materialCalculatorAjax.ajaxurl, {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      if (result.success) {
        setShowSaveDialog(false)
        setRecordName("")
        loadSavedRecords()
        alert("保存成功！")
      } else {
        alert("保存失败：" + (result.data?.message || "未知错误"))
      }
    } catch (error) {
      console.error("保存失败:", error)
      alert("保存失败，请重试")
    }
  }

  const loadRecord = (record) => {
    setMaterialLength(record.material_length)
    setSawWidth(record.saw_width)
    setRequiredLengths(JSON.parse(record.required_lengths))
    setCuttingPlans(JSON.parse(record.cutting_plans))
    setShowHistoryDialog(false)
  }

  const deleteRecord = async (id) => {
    if (!confirm("确定要删除这条记录吗？")) return

    try {
      const formData = new FormData()
      formData.append("action", "delete_cutting_record")
      formData.append("nonce", materialCalculatorAjax.nonce)
      formData.append("record_id", id)

      const response = await fetch(materialCalculatorAjax.ajaxurl, {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      if (result.success) {
        loadSavedRecords()
        alert("删除成功！")
      } else {
        alert("删除失败：" + (result.data?.message || "未知错误"))
      }
    } catch (error) {
      console.error("删除失败:", error)
      alert("删除失败，请重试")
    }
  }

  const totalWaste = cuttingPlans.reduce((sum, plan) => sum + plan.waste, 0)
  const averageUtilization =
    cuttingPlans.length > 0 ? cuttingPlans.reduce((sum, plan) => sum + plan.utilization, 0) / cuttingPlans.length : 0

  return h(
    "div",
    { className: "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50" },
    h(
      "div",
      { className: "container mx-auto px-4 py-8" },
      h(
        "div",
        { className: "mb-8" },
        h("h1", { className: "text-4xl font-bold text-slate-800 mb-3" }, "条材套裁优化"),
        h("p", { className: "text-slate-600 text-lg" }, "智能计算最优切割方案，考虑锯缝宽度，最大化材料利用率"),
      ),

      h(
        "div",
        { className: "grid lg:grid-cols-2 gap-8" },
        h(
          "div",
          { className: "space-y-6" },
          h(
            "div",
            { className: "border border-slate-200 shadow-lg bg-white rounded-lg overflow-hidden" },
            h(
              "div",
              { className: "bg-blue-600 text-white p-6" },
              h("h2", { className: "text-xl font-bold flex items-center gap-2" }, "🧮 参数设置"),
            ),
            h(
              "div",
              { className: "p-6" },
              h(
                "div",
                { className: "grid grid-cols-2 gap-4" },
                h(
                  "div",
                  null,
                  h(
                    "label",
                    { htmlFor: "material-length", className: "text-sm font-medium text-slate-700 block mb-2" },
                    "原材料长度 (mm)",
                  ),
                  h("input", {
                    id: "material-length",
                    type: "number",
                    value: materialLength,
                    onChange: (e) => setMaterialLength(Number(e.target.value)),
                    className:
                      "w-full px-3 py-2 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20",
                    placeholder: "6000",
                  }),
                ),
                h(
                  "div",
                  null,
                  h(
                    "label",
                    { htmlFor: "saw-width", className: "text-sm font-medium text-slate-700 block mb-2" },
                    "锯缝宽度 (mm)",
                  ),
                  h("input", {
                    id: "saw-width",
                    type: "number",
                    value: sawWidth,
                    onChange: (e) => setSawWidth(Number(e.target.value)),
                    className:
                      "w-full px-3 py-2 border border-slate-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20",
                    placeholder: "3",
                  }),
                ),
              ),
            ),
          ),
          h(
            "div",
            { className: "space-y-6" },
            h(
              "div",
              { className: "border border-slate-200 shadow-lg bg-white rounded-lg overflow-hidden" },
              h(
                "div",
                { className: "bg-green-600 text-white p-6" },
                h("h2", { className: "text-xl font-bold flex items-center gap-2" }, "📋 所需长度列表"),
              ),
              h(
                "div",
                { className: "p-6" },
                h(
                  "div",
                  { className: "space-y-4" },
                  requiredLengths.map((item, index) =>
                    h(
                      "div",
                      { key: index, className: "flex items-center justify-between" },
                      h(
                        "div",
                        { className: "flex items-center gap-4" },
                        h("input", {
                          type: "number",
                          value: item.length,
                          onChange: (e) => updateRequiredLength(index, "length", Number(e.target.value)),
                          className:
                            "w-24 px-3 py-2 border border-slate-300 rounded-md focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20",
                          placeholder: "长度",
                        }),
                        h("input", {
                          type: "number",
                          value: item.quantity,
                          onChange: (e) => updateRequiredLength(index, "quantity", Number(e.target.value)),
                          className:
                            "w-24 px-3 py-2 border border-slate-300 rounded-md focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20",
                          placeholder: "数量",
                        }),
                      ),
                      h(
                        "button",
                        {
                          className: "px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors",
                          onClick: () => removeRequiredLength(index),
                        },
                        "删除",
                      ),
                    ),
                  ),
                ),
                h(
                  "button",
                  {
                    onClick: addRequiredLength,
                    className: "w-full bg-green-500 text-white rounded hover:bg-green-600 transition-colors",
                  },
                  "添加所需长度",
                ),
              ),
            ),
            h(
              "div",
              { className: "border border-slate-200 shadow-lg bg-white rounded-lg overflow-hidden" },
              h(
                "div",
                { className: "bg-blue-600 text-white p-6" },
                h("h2", { className: "text-xl font-bold flex items-center gap-2" }, "📋 所需长度列表"),
              ),
              h(
                "div",
                { className: "p-6" },
                h(
                  "div",
                  { className: "space-y-4" },
                  requiredLengths.map((item, index) =>
                    h(
                      "div",
                      { key: index, className: "flex items-center justify-between" },
                      h(
                        "div",
                        { className: "flex items-center gap-4" },
                        h("input", {
                          type: "number",
                          value: item.length,
                          onChange: (e) => updateRequiredLength(index, "length", Number(e.target.value)),
                          className:
                            "w-24 px-3 py-2 border border-slate-300 rounded-md focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20",
                          placeholder: "长度",
                        }),
                        h("input", {
                          type: "number",
                          value: item.quantity,
                          onChange: (e) => updateRequiredLength(index, "quantity", Number(e.target.value)),
                          className:
                            "w-24 px-3 py-2 border border-slate-300 rounded-md focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20",
                          placeholder: "数量",
                        }),
                      ),
                      h(
                        "button",
                        {
                          className: "px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors",
                          onClick: () => removeRequiredLength(index),
                        },
                        "删除",
                      ),
                    ),
                  ),
                ),
                h(
                  "button",
                  {
                    onClick: addRequiredLength,
                    className: "w-full bg-green-500 text-white rounded hover:bg-green-600 transition-colors",
                  },
                  "添加所需长度",
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  )
}
