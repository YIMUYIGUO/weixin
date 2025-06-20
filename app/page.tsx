import { Search, Scissors, Weight, Sparkles, BookOpen, Shield, Wrench } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-blue-600 font-medium mb-6 shadow-sm">
            <Sparkles className="w-4 h-4" />
            专业材料计算工具
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            材料计算助手
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            智能化条材套裁优化与精确材料重量查询，助力工程项目降本增效
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Scissors className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <CardTitle className="text-xl md:text-2xl mb-2 md:mb-3">条材套裁优化</CardTitle>
              <CardDescription className="text-sm md:text-base leading-relaxed">
                智能算法计算最优切割方案，支持锯缝宽度设置，最大化材料利用率，减少浪费
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>智能优化算法</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>锯缝宽度计算</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>方案保存记录</span>
                </div>
              </div>
              <Link href="/cutting-optimizer" className="block">
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg text-sm md:text-base"
                  size="default"
                >
                  开始套裁计算
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Weight className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <CardTitle className="text-xl md:text-2xl mb-2 md:mb-3">材料重量查询</CardTitle>
              <CardDescription className="text-sm md:text-base leading-relaxed">
                精确查询各种型材理论重量，涵盖角钢、工字钢、槽钢等常用建筑材料
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>国标数据计算</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>丰富材料数据库</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>便捷弹窗选择</span>
                </div>
              </div>
              <Link href="/weight-calculator" className="block">
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg text-sm md:text-base"
                  size="default"
                >
                  查询材料重量
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Search className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <CardTitle className="text-xl md:text-2xl mb-2 md:mb-3">幕墙查询工具</CardTitle>
              <CardDescription className="text-sm md:text-base leading-relaxed">
                专业幕墙知识库，涵盖安装节点、防雷系统、转接件等技术资料和行业规范
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>技术知识库</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>行业规范查询</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>安装节点图集</span>
                </div>
              </div>
              <Link href="/curtain-wall-query" className="block">
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-lg text-sm md:text-base"
                  size="default"
                >
                  查询幕墙资料
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* 幕墙知识预览 */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">幕墙技术知识预览</h2>
            <p className="text-gray-600">精选专业幕墙技术知识，助力工程实践</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    防雷系统
                  </Badge>
                </div>
                <CardTitle className="text-lg">幕墙防雷系统设计要点</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  幕墙防雷系统应包括接闪器、引下线和接地装置三个基本组成部分。接闪器通常采用避雷针、避雷带或避雷网...
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    防雷
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    设计
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    安全
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    转接件
                  </Badge>
                </div>
                <CardTitle className="text-lg">转接件安装技术要求</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  转接件是连接幕墙与主体结构的重要构件。安装前应检查预埋件位置、尺寸和标高；转接件与预埋件的连接应采用焊接...
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    转接件
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    安装
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    连接
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    结构胶
                  </Badge>
                </div>
                <CardTitle className="text-lg">结构胶使用注意事项</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  结构胶是幕墙系统的关键材料，使用时应注意：严格按配比混合，搅拌均匀；在规定时间内用完，避免超过适用期...
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    结构胶
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    施工
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    质量
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/curtain-wall-query">
              <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg px-8 py-3">
                查看更多幕墙知识
                <Search className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
