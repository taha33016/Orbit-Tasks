import { useState } from 'react'
import {
  LayoutDashboard, Calendar, Sparkles, FolderKanban, Users,
  Settings, Plus, Search, Bell, ChevronLeft,
  CheckCircle2, Circle, TrendingUp, Clock, Filter, MoreHorizontal,
  Zap, Crown, ArrowUpRight, ArrowDownRight, Eye, Heart,
  Lightbulb, Flame, Target, BarChart3,
} from 'lucide-react'
import {
  platformMeta, stageMeta, stageOrder, contentItems, teamMembers,
  todayTasks, ideas, activities, calendarEvents, analyticsData,
  toolLinks, priorityMeta,
  type ContentItem, type Platform, type TaskItem,
} from '@/data/mockData'

type NavItem = 'dashboard' | 'calendar' | 'ideas' | 'projects' | 'team' | 'analytics' | 'settings'
type View = 'kanban' | 'list' | 'calendar-grid'

export default function App() {
  const [activeNav, setActiveNav] = useState<NavItem>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [tasks, setTasks] = useState<TaskItem[]>(todayTasks)
  const [view, setView] = useState<View>('kanban')
  const [showNewProject, setShowNewProject] = useState(false)

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const navItems: { id: NavItem; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
    { id: 'calendar', label: 'تقویم محتوا', icon: Calendar },
    { id: 'ideas', label: 'ایده‌پردازی', icon: Sparkles },
    { id: 'projects', label: 'پروژه‌ها', icon: FolderKanban },
    { id: 'analytics', label: 'تحلیل و آمار', icon: BarChart3 },
    { id: 'team', label: 'تیم محتوا', icon: Users },
    { id: 'settings', label: 'تنظیمات', icon: Settings },
  ]

  const completedTasks = tasks.filter(t => t.done).length
  const taskProgress = Math.round((completedTasks / tasks.length) * 100)
  const publishedCount = contentItems.filter(c => c.stage === 'published').length
  const inProgressCount = contentItems.filter(c => c.stage !== 'published' && c.stage !== 'idea').length
  const ideaCount = contentItems.filter(c => c.stage === 'idea').length

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 font-sans flex flex-row-reverse" dir="rtl">

      {/* Sidebar */}
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} navItems={navItems} />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto max-h-screen">

        {/* Top Header */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNewProject={() => setShowNewProject(true)}
        />

        {/* View Switcher */}
        {activeNav === 'dashboard' && (
          <DashboardView
            tasks={tasks}
            toggleTask={toggleTask}
            taskProgress={taskProgress}
            completedTasks={completedTasks}
            publishedCount={publishedCount}
            inProgressCount={inProgressCount}
            ideaCount={ideaCount}
          />
        )}

        {activeNav === 'projects' && (
          <ProjectsView view={view} setView={setView} searchQuery={searchQuery} />
        )}

        {activeNav === 'calendar' && <CalendarView />}

        {activeNav === 'ideas' && <IdeasView />}

        {activeNav === 'team' && <TeamView />}

        {activeNav === 'analytics' && <AnalyticsView />}

        {activeNav === 'settings' && <SettingsView />}

      </main>

      {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} />}

    </div>
  )
}

/* ─────────────────────────── Sidebar ─────────────────────────── */

function Sidebar({
  activeNav, setActiveNav, navItems,
}: {
  activeNav: NavItem
  setActiveNav: (n: NavItem) => void
  navItems: { id: NavItem; label: string; icon: typeof LayoutDashboard }[]
}) {
  return (
    <aside className="w-64 bg-[#111118] border-l border-white/5 p-5 flex flex-col justify-between hidden md:flex shrink-0">
      <div className="space-y-6">
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 animate-fade-in">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-lg shadow-pink-500/20 text-lg">
            ک
          </div>
          <div>
            <h1 className="font-bold text-white leading-tight text-sm">استودیو کاسپین</h1>
            <p className="text-[11px] text-slate-500">پنل تولید محتوا</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="space-y-1">
          {navItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all animate-fade-in ${
                activeNav === item.id
                  ? 'bg-gradient-to-l from-pink-500/20 to-transparent text-pink-400 font-semibold border-r-2 border-pink-500'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Quick Tools */}
        <div className="pt-4 border-t border-white/5">
          <p className="text-[11px] text-slate-600 px-3 mb-2 font-medium">ابزارهای سریع</p>
          <div className="grid grid-cols-3 gap-2">
            {toolLinks.map((tool, idx) => (
              <button
                key={tool.label}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl ${tool.bg} hover:scale-105 transition-transform animate-scale-in`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <tool.icon size={16} className={tool.color} />
                <span className="text-[10px] text-slate-400">{tool.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pro Banner */}
      <div className="bg-gradient-to-br from-pink-500/10 to-orange-500/10 border border-pink-500/20 p-4 rounded-2xl relative overflow-hidden animate-fade-in">
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-pink-500/10 rounded-full blur-2xl" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-pink-400 flex items-center gap-1">
              <Crown size={14} /> نسخه حرفه‌ای
            </span>
            <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full border border-white/10">۸/۳۰ روز</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">دسترسی به ابزارهای هوش مصنوعی و تاییدیه سرپرست</p>
          <button className="w-full mt-1 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-100 transition flex items-center justify-center gap-1 group">
            ارتقا به نسخه پرو
            <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </aside>
  )
}

/* ─────────────────────────── Header ─────────────────────────── */

function Header({
  searchQuery, setSearchQuery, onNewProject,
}: {
  searchQuery: string
  setSearchQuery: (s: string) => void
  onNewProject: () => void
}) {
  return (
    <header className="flex items-center justify-between glass p-3 md:p-4 rounded-2xl border border-white/5 animate-fade-in">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی پروژه، تسک یا سناریو..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500/50 transition"
          />
          <Search className="absolute right-3 top-3 text-slate-500" size={18} />
        </div>
        <button
          onClick={onNewProject}
          className="flex items-center gap-2 bg-gradient-to-l from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition whitespace-nowrap shadow-lg shadow-pink-500/20"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">پروژه جدید</span>
        </button>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <button className="relative p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 transition">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full animate-pulse-ring"></span>
        </button>
        <div className="flex items-center gap-3 pr-1 md:pr-3 border-r border-white/10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
            ا.س
          </div>
          <div className="text-right hidden md:block">
            <div className="text-sm font-bold text-white">احمد سلیمانی</div>
            <div className="text-[11px] text-slate-500">استراتژیست محتوا</div>
          </div>
        </div>
      </div>
    </header>
  )
}

/* ─────────────────────────── Dashboard View ─────────────────────────── */

function DashboardView({
  tasks, toggleTask, taskProgress, completedTasks,
  publishedCount, inProgressCount, ideaCount,
}: {
  tasks: TaskItem[]
  toggleTask: (id: string) => void
  taskProgress: number
  completedTasks: number
  publishedCount: number
  inProgressCount: number
  ideaCount: number
}) {
  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="بازدید کل" value={analyticsData.totalViews} change={analyticsData.viewsChange} icon={Eye} color="from-pink-500/20 to-transparent" iconColor="text-pink-400" delay={0} />
        <StatCard label="تعامل" value={analyticsData.totalEngagement} change={analyticsData.engagementChange} icon={Heart} color="from-rose-500/20 to-transparent" iconColor="text-rose-400" delay={60} />
        <StatCard label="فالوورهای جدید" value={analyticsData.newFollowers} change={analyticsData.followersChange} icon={TrendingUp} color="from-emerald-500/20 to-transparent" iconColor="text-emerald-400" delay={120} />
        <StatCard label="زمان مشاهده" value={analyticsData.watchTime} change={analyticsData.watchTimeChange} icon={Clock} color="from-sky-500/20 to-transparent" iconColor="text-sky-400" delay={180} />
      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Campaign Progress */}
        <Card title="وضعیت انتشار کمپین" delay={100}>
          <div className="flex items-center justify-around mt-2">
            <ProgressRing percentage={72} size={120} stroke={10} color="#ec4899" />
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-pink-500 rounded-full"></span>
                <span className="text-slate-400">منتشر شده: <b className="text-white">{publishedCount} پست</b></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-orange-400 rounded-full"></span>
                <span className="text-slate-400">در حال تولید: <b className="text-white">{inProgressCount} ویدیو</b></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-violet-400 rounded-full"></span>
                <span className="text-slate-400">ایده جدید: <b className="text-white">{ideaCount} مورد</b></span>
              </div>
            </div>
          </div>
        </Card>

        {/* Today's Tasks */}
        <Card title="تسک‌های امروز" subtitle={`${completedTasks} از ${tasks.length} تکمیل شده`} delay={160}>
          <div className="mt-3 mb-3">
            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
              <span>پیشرفت روزانه</span>
              <span>{taskProgress}٪</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-l from-pink-500 to-orange-500 rounded-full transition-all duration-500" style={{ width: `${taskProgress}%` }}></div>
            </div>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="w-full flex items-center gap-2.5 text-xs bg-white/5 p-2.5 rounded-xl border border-white/5 hover:bg-white/10 transition text-right group"
              >
                {task.done ? (
                  <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                ) : (
                  <Circle size={16} className="text-slate-600 flex-shrink-0 group-hover:text-slate-400 transition" />
                )}
                <span className={`flex-1 ${task.done ? 'line-through text-slate-600' : 'text-slate-300 font-medium'}`}>
                  {task.title}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${priorityMeta[task.priority].bg} ${priorityMeta[task.priority].color}`}>
                  {task.dueTime}
                </span>
              </button>
            ))}
          </div>
        </Card>

        {/* Team Status */}
        <Card title="وضعیت تیم تولید محتوا" actionLabel="+ دعوت عضو" delay={220}>
          <div className="space-y-3 mt-3">
            {teamMembers.map((member) => (
              <div key={member.name} className="flex items-center justify-between text-xs group">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <div className={`w-9 h-9 rounded-full ${member.avatarColor} flex items-center justify-center font-bold text-white text-[11px]`}>
                      {member.initials}
                    </div>
                    <span className={`absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full ${member.statusColor} border-2 border-[#14141c]`}></span>
                  </div>
                  <div>
                    <p className="font-bold text-white text-[13px]">{member.name}</p>
                    <p className="text-[10px] text-slate-500">{member.role}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-500">{member.activeTasks} تسک فعال</p>
                  <p className={`text-[10px] font-medium`} style={{ color: member.statusColor.includes('emerald') ? '#34d399' : member.statusColor.includes('amber') ? '#fbbf24' : '#fb7185' }}>
                    {member.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Kanban Board */}
      <KanbanBoard />

      {/* Bottom Row: Activity Feed + Ideas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="فعالیت‌های اخیر" className="lg:col-span-2" delay={300}>
          <div className="space-y-3 mt-3">
            {activities.map((act) => (
              <div key={act.id} className="flex items-center gap-3 text-xs group animate-fade-in">
                <div className={`w-8 h-8 rounded-full ${act.avatarColor} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                  {act.user.split(' ')[0][0]}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <act.icon size={14} className={act.iconColor} />
                  <span className="text-slate-300">
                    <b className="text-white">{act.user}</b> {act.action} <span className="text-slate-400">«{act.target}»</span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-600 flex-shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="ایده‌های داغ" actionLabel="مشاهده همه" delay={360}>
          <div className="space-y-2.5 mt-3">
            {ideas.slice(0, 4).map((idea) => {
              const pm = platformMeta[idea.platform]
              return (
                <div key={idea.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition group cursor-pointer">
                  <div className={`w-9 h-9 rounded-lg ${pm.bg} flex items-center justify-center flex-shrink-0`}>
                    <pm.icon size={16} className={pm.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{idea.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] ${idea.trend === 'رو به افزایش' ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {idea.trend}
                      </span>
                      {idea.trend === 'رو به افزایش' && <Flame size={10} className="text-orange-400" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Zap size={12} className="text-amber-400" />
                    <span className="font-bold text-white">{idea.score}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ─────────────────────────── Stat Card ─────────────────────────── */

function StatCard({
  label, value, change, icon: Icon, color, iconColor, delay,
}: {
  label: string
  value: string
  change: string
  icon: typeof Eye
  color: string
  iconColor: string
  delay: number
}) {
  const isPositive = change.startsWith('+')
  return (
    <div
      className={`relative bg-gradient-to-b ${color} bg-[#14141c] border border-white/5 p-4 rounded-2xl card-hover animate-fade-in overflow-hidden`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center`}>
          <Icon size={18} className={iconColor} />
        </div>
        <div className={`flex items-center gap-0.5 text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </div>
      </div>
      <p className="text-[11px] text-slate-500 mb-1">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  )
}

/* ─────────────────────────── Progress Ring ─────────────────────────── */

function ProgressRing({ percentage, size, stroke, color }: { percentage: number; size: number; stroke: number; color: string }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} fill="transparent" />
        <circle
          cx={size / 2} cy={size / 2} r={radius} stroke={color} strokeWidth={stroke} fill="transparent"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute font-bold text-xl text-white">{percentage}٪</div>
    </div>
  )
}

/* ─────────────────────────── Card ─────────────────────────── */

function Card({
  title, subtitle, actionLabel, children, className = '', delay = 0,
}: {
  title: string
  subtitle?: string
  actionLabel?: string
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <div
      className={`bg-[#14141c] border border-white/5 p-5 rounded-2xl card-hover animate-fade-in ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="font-bold text-white text-sm">{title}</h3>
          {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {actionLabel && (
          <button className="text-xs text-pink-400 font-semibold hover:text-pink-300 transition">{actionLabel}</button>
        )}
      </div>
      {children}
    </div>
  )
}

/* ─────────────────────────── Kanban Board ─────────────────────────── */

function KanbanBoard() {
  return (
    <div className="bg-[#14141c] border border-white/5 p-5 rounded-2xl animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white text-sm">جریان تولید محتوا</h3>
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <Filter size={14} />
          <span>فیلتر: همه پلتفرم‌ها</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stageOrder.map((stage) => {
          const items = contentItems.filter(c => c.stage === stage)
          const sm = stageMeta[stage]
          return (
            <div key={stage} className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${sm.dot}`}></span>
                  <span className="text-xs font-semibold text-slate-300">{sm.label}</span>
                </div>
                <span className="text-[10px] text-slate-600 bg-white/5 px-1.5 py-0.5 rounded-md">{items.length}</span>
              </div>
              <div className={`rounded-xl border ${sm.color} p-2 space-y-2 min-h-[120px]`}>
                {items.length === 0 && (
                  <p className="text-[10px] text-slate-600 text-center py-4">خالی</p>
                )}
                {items.map((item) => {
                  const pm = platformMeta[item.platform]
                  return (
                    <div key={item.id} className="bg-[#0a0a0f] border border-white/5 rounded-lg p-2.5 space-y-2 cursor-pointer hover:border-white/10 transition group">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] ${pm.bg} ${pm.color} px-1.5 py-0.5 rounded-md font-medium flex items-center gap-1`}>
                          <pm.icon size={10} />
                          {pm.label}
                        </span>
                        <MoreHorizontal size={14} className="text-slate-600 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                      <p className="text-[11px] font-medium text-slate-200 leading-snug line-clamp-2">{item.title}</p>
                      <div className="flex items-center justify-between">
                        <div className={`w-5 h-5 rounded-full ${item.assigneeColor} flex items-center justify-center text-white text-[8px] font-bold`}>
                          {item.assignee[0]}
                        </div>
                        <span className="text-[9px] text-slate-600">{item.progress}٪</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────── Projects View ─────────────────────────── */

function ProjectsView({ view, setView, searchQuery }: { view: View; setView: (v: View) => void; searchQuery: string }) {
  const filtered = contentItems.filter(c =>
    c.title.includes(searchQuery) || c.tags.some(t => t.includes(searchQuery))
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">پروژه‌ها و محتواهای در دست تولید</h2>
        <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
          {(['kanban', 'list'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                view === v ? 'bg-pink-500/20 text-pink-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {v === 'kanban' ? 'کانبان' : 'لیست'}
            </button>
          ))}
        </div>
      </div>

      {view === 'kanban' && <KanbanBoard />}

      {view === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, idx) => (
            <ProjectCard key={item.id} item={item} delay={idx * 40} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectCard({ item, delay }: { item: ContentItem; delay: number }) {
  const pm = platformMeta[item.platform]
  const sm = stageMeta[item.stage]
  return (
    <div
      className="bg-[#14141c] border border-white/5 p-4 rounded-2xl card-hover animate-fade-in space-y-3"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <span className={`text-[10px] ${pm.bg} ${pm.color} px-2 py-0.5 rounded-md font-medium flex items-center gap-1`}>
          <pm.icon size={11} />
          {pm.label}
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${sm.color} font-medium`}>{sm.label}</span>
      </div>
      <h4 className="text-sm font-bold text-white leading-snug">{item.title}</h4>
      <div className="flex flex-wrap gap-1.5">
        {item.tags.map(tag => (
          <span key={tag} className="text-[10px] bg-white/5 text-slate-400 px-2 py-0.5 rounded-md">#{tag}</span>
        ))}
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>پیشرفت تولید</span>
          <span className="text-slate-300 font-medium">{item.progress}٪</span>
        </div>
        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-l from-pink-500 to-orange-500 rounded-full transition-all duration-700"
            style={{ width: `${item.progress}%` }}
          ></div>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full ${item.assigneeColor} flex items-center justify-center text-white text-[10px] font-bold`}>
            {item.assignee[0]}
          </div>
          <span className="text-[11px] text-slate-400">{item.assignee}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <Clock size={12} />
          <span>{item.dueDate}</span>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────── Calendar View ─────────────────────────── */

function CalendarView() {
  const days = Array.from({ length: 35 }, (_, i) => i - 2) // offset
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">تقویم محتوا — شهریور ۱۴۰۳</h2>
        <button className="flex items-center gap-2 bg-pink-500/20 text-pink-400 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-pink-500/30 transition">
          <Plus size={14} /> رویداد جدید
        </button>
      </div>
      <div className="bg-[#14141c] border border-white/5 p-5 rounded-2xl animate-fade-in">
        <div className="grid grid-cols-7 gap-2 mb-3">
          {['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'].map(day => (
            <div key={day} className="text-center text-[11px] font-semibold text-slate-500 py-2">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            const events = day > 0 && day <= 31 ? calendarEvents.filter(e => e.day === day) : []
            const isToday = day === 8
            return (
              <div
                key={idx}
                className={`min-h-[80px] rounded-xl border p-1.5 transition ${
                  day <= 0 || day > 31
                    ? 'border-transparent bg-transparent'
                    : isToday
                    ? 'border-pink-500/40 bg-pink-500/5'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                }`}
              >
                {day > 0 && day <= 31 && (
                  <>
                    <span className={`text-[11px] font-medium ${isToday ? 'text-pink-400' : 'text-slate-500'}`}>{day}</span>
                    <div className="space-y-1 mt-1">
                      {events.map((e, eIdx) => {
                        const pm = platformMeta[e.platform]
                        return (
                          <div key={eIdx} className={`text-[9px] ${pm.bg} ${pm.color} rounded-md px-1.5 py-1 flex items-center gap-1 truncate`}>
                            <pm.icon size={9} className="flex-shrink-0" />
                            <span className="truncate">{e.title}</span>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────── Ideas View ─────────────────────────── */

function IdeasView() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lightbulb size={20} className="text-amber-400" />
            ایده‌پردازی
          </h2>
          <p className="text-xs text-slate-500 mt-1">ایده‌های رتبه‌بندی شده بر اساس پتانسیل تعامل</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-l from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:from-amber-600 hover:to-orange-600 transition shadow-lg shadow-amber-500/20">
          <Sparkles size={14} /> تولید ایده با هوش مصنوعی
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ideas.map((idea, idx) => {
          const pm = platformMeta[idea.platform]
          return (
            <div
              key={idea.id}
              className="bg-[#14141c] border border-white/5 p-5 rounded-2xl card-hover animate-fade-in space-y-3"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl ${pm.bg} flex items-center justify-center`}>
                  <pm.icon size={18} className={pm.color} />
                </div>
                <div className="flex items-center gap-1.5">
                  <Target size={14} className="text-amber-400" />
                  <span className="text-2xl font-bold text-white">{idea.score}</span>
                  <span className="text-[10px] text-slate-500">/۱۰۰</span>
                </div>
              </div>
              <h4 className="text-sm font-bold text-white leading-snug">{idea.title}</h4>
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className={`text-[11px] flex items-center gap-1 ${idea.trend === 'رو به افزایش' ? 'text-emerald-400' : 'text-slate-500'}`}>
                  <TrendingUp size={12} />
                  {idea.trend}
                </span>
                <button className="text-[11px] text-pink-400 font-semibold hover:text-pink-300 transition">شروع تولید ←</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─────────────────────────── Team View ─────────────────────────── */

function TeamView() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">تیم تولید محتوا</h2>
        <button className="flex items-center gap-2 bg-pink-500/20 text-pink-400 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-pink-500/30 transition">
          <Plus size={14} /> دعوت عضو جدید
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamMembers.map((member, idx) => (
          <div
            key={member.name}
            className="bg-[#14141c] border border-white/5 p-5 rounded-2xl card-hover animate-fade-in text-center space-y-3"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <div className="relative inline-block">
              <div className={`w-16 h-16 rounded-full ${member.avatarColor} flex items-center justify-center text-white font-bold text-lg`}>
                {member.initials}
              </div>
              <span className={`absolute -bottom-1 -left-1 w-4 h-4 rounded-full ${member.statusColor} border-2 border-[#14141c]`}></span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{member.name}</h4>
              <p className="text-[11px] text-slate-500">{member.role}</p>
            </div>
            <div className="flex items-center justify-around pt-2 border-t border-white/5">
              <div>
                <p className="text-lg font-bold text-white">{member.activeTasks}</p>
                <p className="text-[10px] text-slate-500">تسک فعال</p>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div>
                <p className="text-sm font-semibold" style={{ color: member.statusColor.includes('emerald') ? '#34d399' : member.statusColor.includes('amber') ? '#fbbf24' : '#fb7185' }}>
                  {member.status}
                </p>
                <p className="text-[10px] text-slate-500">وضعیت</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────── Analytics View ─────────────────────────── */

function AnalyticsView() {
  const maxViews = Math.max(...analyticsData.monthlyData.map(d => d.views))
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <BarChart3 size={20} className="text-sky-400" />
        تحلیل و آمار عملکرد
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="بازدید کل" value={analyticsData.totalViews} change={analyticsData.viewsChange} icon={Eye} color="from-pink-500/20 to-transparent" iconColor="text-pink-400" delay={0} />
        <StatCard label="تعامل" value={analyticsData.totalEngagement} change={analyticsData.engagementChange} icon={Heart} color="from-rose-500/20 to-transparent" iconColor="text-rose-400" delay={60} />
        <StatCard label="فالوورهای جدید" value={analyticsData.newFollowers} change={analyticsData.followersChange} icon={TrendingUp} color="from-emerald-500/20 to-transparent" iconColor="text-emerald-400" delay={120} />
        <StatCard label="زمان مشاهده" value={analyticsData.watchTime} change={analyticsData.watchTimeChange} icon={Clock} color="from-sky-500/20 to-transparent" iconColor="text-sky-400" delay={180} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Chart */}
        <Card title="روند بازدید ماهانه" delay={200}>
          <div className="flex items-end justify-between gap-3 h-48 mt-4">
            {analyticsData.monthlyData.map((d, idx) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition">{d.views.toLocaleString('fa')}</span>
                <div
                  className="w-full bg-gradient-to-t from-pink-500/40 to-pink-500 rounded-t-lg transition-all duration-700 hover:from-pink-500/60 hover:to-pink-400"
                  style={{ height: `${(d.views / maxViews) * 100}%`, animationDelay: `${idx * 80}ms` }}
                ></div>
                <span className="text-[10px] text-slate-500">{d.month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Platform Breakdown */}
        <Card title="سهم پلتفرم‌ها" delay={260}>
          <div className="space-y-3 mt-4">
            {analyticsData.platformBreakdown.map((p, idx) => {
              const pm = platformMeta[p.platform]
              return (
                <div key={p.platform} className="space-y-1.5 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <pm.icon size={14} className={pm.color} />
                      <span className="text-slate-300">{pm.label}</span>
                    </div>
                    <span className="text-slate-400 font-medium">{p.value}٪</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${pm.bg.replace('/15', '/60')}`}
                      style={{ width: `${p.value}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Top Content */}
      <Card title="محتواهای پربازدید" delay={320}>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-slate-500 text-right border-b border-white/5">
                <th className="py-2 px-2 font-medium">عنوان</th>
                <th className="py-2 px-2 font-medium">پلتفرم</th>
                <th className="py-2 px-2 font-medium">بازدید</th>
                <th className="py-2 px-2 font-medium">نرخ تعامل</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.topContent.map((c, idx) => {
                const pm = platformMeta[c.platform]
                return (
                  <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 px-2 text-slate-200 font-medium">{c.title}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex items-center gap-1 ${pm.bg} ${pm.color} px-2 py-0.5 rounded-md text-[10px]`}>
                        <pm.icon size={10} />
                        {pm.label}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-300">{c.views}</td>
                    <td className="py-3 px-2">
                      <span className="text-emerald-400 font-medium">{c.engagement}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

/* ─────────────────────────── Settings View ─────────────────────────── */

function SettingsView() {
  const settings = [
    { label: 'اعلان‌های تسک', desc: 'هنگام اختصاص تسک جدید اطلاع بده', enabled: true },
    { label: 'یادآوری مهلت‌ها', desc: '۲۴ ساعت قبل از مهلت نهایی یادآوری کن', enabled: true },
    { label: 'گزارش هفتگی', desc: 'خلاصه عملکرد را هر هفته ایمیل کن', enabled: false },
    { label: 'تایید سرپرست', desc: 'انتشار محتوا نیاز به تایید دارد', enabled: true },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white">تنظیمات</h2>
      <Card title="تنظیمات اعلان‌ها" delay={0}>
        <div className="space-y-3 mt-4">
          {settings.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 animate-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
              <div>
                <p className="text-sm font-medium text-white">{s.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
              </div>
              <ToggleSwitch defaultOn={s.enabled} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function ToggleSwitch({ defaultOn }: { defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative w-11 h-6 rounded-full transition ${on ? 'bg-pink-500' : 'bg-white/10'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${on ? 'left-0.5' : 'right-0.5'}`}></span>
    </button>
  )
}

/* ─────────────────────────── New Project Modal ─────────────────────────── */

function NewProjectModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState<Platform>('instagram')
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="bg-[#14141c] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">پروژه محتوایی جدید</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition">✕</button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">عنوان محتوا</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: ریلز آموزش ادیت رنگ..."
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-pink-500/50 transition"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">پلتفرم</label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(platformMeta) as Platform[]).map(p => {
                const pm = platformMeta[p]
                return (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition border ${
                      platform === p ? `${pm.bg} ${pm.color} border-current` : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <pm.icon size={14} />
                    {pm.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">اولویت</label>
            <div className="flex gap-2">
              {(['high', 'medium', 'low'] as const).map(pr => (
                <button
                  key={pr}
                  onClick={() => setPriority(pr)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${
                    priority === pr ? `${priorityMeta[pr].bg} ${priorityMeta[pr].color}` : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {priorityMeta[pr].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-white/5 text-slate-300 text-sm font-medium hover:bg-white/10 transition">
            انصراف
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-gradient-to-l from-pink-500 to-orange-500 text-white text-sm font-bold hover:from-pink-600 hover:to-orange-600 transition shadow-lg shadow-pink-500/20">
            ایجاد پروژه
          </button>
        </div>
      </div>
    </div>
  )
}
