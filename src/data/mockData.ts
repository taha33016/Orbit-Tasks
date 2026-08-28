import {
  Instagram, Youtube, Twitch, Twitter, Music2, Camera,
  PenLine, Film, Mic, Palette, Sparkles, Send, BarChart3,
} from 'lucide-react'

export type Platform = 'instagram' | 'youtube' | 'twitch' | 'twitter' | 'tiktok' | 'podcast'

export const platformMeta: Record<Platform, { label: string; icon: typeof Instagram; color: string; bg: string }> = {
  instagram: { label: 'اینستاگرام', icon: Instagram, color: 'text-pink-400', bg: 'bg-pink-500/15' },
  youtube: { label: 'یوتیوب', icon: Youtube, color: 'text-red-400', bg: 'bg-red-500/15' },
  twitch: { label: 'توئیچ', icon: Twitch, color: 'text-violet-400', bg: 'bg-violet-500/15' },
  twitter: { label: 'توییتر', icon: Twitter, color: 'text-sky-400', bg: 'bg-sky-500/15' },
  tiktok: { label: 'تیک‌تاک', icon: Music2, color: 'text-teal-300', bg: 'bg-teal-500/15' },
  podcast: { label: 'پادکست', icon: Mic, color: 'text-amber-400', bg: 'bg-amber-500/15' },
}

export type ContentStage = 'idea' | 'script' | 'filming' | 'editing' | 'review' | 'published'

export const stageMeta: Record<ContentStage, { label: string; color: string; dot: string }> = {
  idea: { label: 'ایده', color: 'border-violet-500/40 bg-violet-500/10', dot: 'bg-violet-400' },
  script: { label: 'سناریو', color: 'border-sky-500/40 bg-sky-500/10', dot: 'bg-sky-400' },
  filming: { label: 'فیلم‌برداری', color: 'border-amber-500/40 bg-amber-500/10', dot: 'bg-amber-400' },
  editing: { label: 'تدوین', color: 'border-orange-500/40 bg-orange-500/10', dot: 'bg-orange-400' },
  review: { label: 'بازبینی', color: 'border-rose-500/40 bg-rose-500/10', dot: 'bg-rose-400' },
  published: { label: 'منتشر شده', color: 'border-emerald-500/40 bg-emerald-500/10', dot: 'bg-emerald-400' },
}

export const stageOrder: ContentStage[] = ['idea', 'script', 'filming', 'editing', 'review', 'published']

export interface ContentItem {
  id: string
  title: string
  platform: Platform
  stage: ContentStage
  progress: number
  assignee: string
  assigneeColor: string
  dueDate: string
  tags: string[]
  thumbnail?: string
  priority: 'high' | 'medium' | 'low'
}

export const contentItems: ContentItem[] = [
  { id: 'c1', title: 'ریلز آموزش فتوشاپ (قسمت ۴)', platform: 'instagram', stage: 'review', progress: 65, assignee: 'سارا', assigneeColor: 'bg-pink-500', dueDate: '۱۴۰۳/۰۶/۱۲', tags: ['آموزشی', 'فتوشاپ'], priority: 'high' },
  { id: 'c2', title: 'ویدیو بررسی لپ‌تاپ جدید', platform: 'youtube', stage: 'editing', progress: 35, assignee: 'علی', assigneeColor: 'bg-amber-500', dueDate: '۱۴۰۳/۰۶/۱۵', tags: ['تکنولوژی', 'ریویو'], priority: 'high' },
  { id: 'c3', title: 'پست اسلایدی معرفی دوره', platform: 'instagram', stage: 'published', progress: 100, assignee: 'سارا', assigneeColor: 'bg-pink-500', dueDate: '۱۴۰۳/۰۶/۰۸', tags: ['تبلیغاتی'], priority: 'medium' },
  { id: 'c4', title: 'استریم بازی جدید — معرفی', platform: 'twitch', stage: 'idea', progress: 5, assignee: 'نیما', assigneeColor: 'bg-violet-500', dueDate: '۱۴۰۳/۰۶/۲۰', tags: ['گیمینگ', 'استریم'], priority: 'low' },
  { id: 'c5', title: 'پادکست: مصاحبه با کارآفرین', platform: 'podcast', stage: 'filming', progress: 50, assignee: 'احمد', assigneeColor: 'bg-sky-500', dueDate: '۱۴۰۳/۰۶/۱۸', tags: ['مصاحبه'], priority: 'medium' },
  { id: 'c6', title: 'تیک‌تاک: ترفندهای موبایل', platform: 'tiktok', stage: 'script', progress: 20, assignee: 'نیما', assigneeColor: 'bg-violet-500', dueDate: '۱۴۰۳/۰۶/۱۴', tags: ['ترفند', 'مواد کوتاه'], priority: 'medium' },
  { id: 'c7', title: 'توییت ترد: سیر تحول هوش مصنوعی', platform: 'twitter', stage: 'published', progress: 100, assignee: 'احمد', assigneeColor: 'bg-sky-500', dueDate: '۱۴۰۳/۰۶/۰۵', tags: ['هوش مصنوعی'], priority: 'low' },
  { id: 'c8', title: 'یوتیوب: آموزش کامل پریمیر پرو', platform: 'youtube', stage: 'editing', progress: 70, assignee: 'علی', assigneeColor: 'bg-amber-500', dueDate: '۱۴۰۳/۰۶/۲۵', tags: ['آموزشی', 'تدوین'], priority: 'high' },
  { id: 'c9', title: 'ریلز: پشت صحنه استودیو', platform: 'instagram', stage: 'filming', progress: 40, assignee: 'سارا', assigneeColor: 'bg-pink-500', dueDate: '۱۴۰۳/۰۶/۱۶', tags: ['پشت صحنه'], priority: 'low' },
  { id: 'c10', title: 'پادکست: پایان فصل دوم', platform: 'podcast', stage: 'review', progress: 85, assignee: 'احمد', assigneeColor: 'bg-sky-500', dueDate: '۱۴۰۳/۰۶/۱۳', tags: ['فصل دوم'], priority: 'high' },
  { id: 'c11', title: 'تیک‌تاک: چالش ۳۰ روزه یادگیری', platform: 'tiktok', stage: 'idea', progress: 10, assignee: 'نیما', assigneeColor: 'bg-violet-500', dueDate: '۱۴۰۳/۰۶/۲۸', tags: ['چالش'], priority: 'low' },
  { id: 'c12', title: 'یوتیوب: ولاگ روزانه استودیو', platform: 'youtube', stage: 'script', progress: 25, assignee: 'علی', assigneeColor: 'bg-amber-500', dueDate: '۱۴۰۳/۰۶/۲۲', tags: ['ولاگ'], priority: 'medium' },
]

export interface TeamMember {
  name: string
  role: string
  status: string
  statusColor: string
  avatarColor: string
  initials: string
  activeTasks: number
}

export const teamMembers: TeamMember[] = [
  { name: 'احمد سلیمانی', role: 'استراتژیست محتوا', status: 'آنلاین', statusColor: 'bg-emerald-400', avatarColor: 'bg-sky-500', initials: 'ا.س', activeTasks: 5 },
  { name: 'علی حسینی', role: 'تدوینگر ارشد', status: 'در حال تدوین', statusColor: 'bg-amber-400', avatarColor: 'bg-amber-500', initials: 'ع.ح', activeTasks: 3 },
  { name: 'سارا راد', role: 'طراح کاور و بنر', status: 'آنلاین', statusColor: 'bg-emerald-400', avatarColor: 'bg-pink-500', initials: 'س.ر', activeTasks: 4 },
  { name: 'نیما پارسا', role: 'سناریونویس', status: 'در انتظار تایید', statusColor: 'bg-rose-400', avatarColor: 'bg-violet-500', initials: 'ن.پ', activeTasks: 2 },
]

export interface TaskItem {
  id: string
  title: string
  done: boolean
  priority: 'high' | 'medium' | 'low'
  dueTime: string
}

export const todayTasks: TaskItem[] = [
  { id: 't1', title: 'بررسی سناریوی ریلز محصول جدید', done: true, priority: 'high', dueTime: '۱۰:۰۰' },
  { id: 't2', title: 'تایید نهایی کاور یوتیوب', done: true, priority: 'high', dueTime: '۱۱:۳۰' },
  { id: 't3', title: 'بازخورد تدوین ویدیوی آموزشی پارت ۱', done: false, priority: 'high', dueTime: '۱۴:۰۰' },
  { id: 't4', title: 'آماده‌سازی متن کپشن و هشتگ‌ها', done: false, priority: 'medium', dueTime: '۱۵:۳۰' },
  { id: 't5', title: 'برنامه‌ریزی پست‌های هفته آینده', done: false, priority: 'medium', dueTime: '۱۷:۰۰' },
  { id: 't6', title: 'جلسه با تیم طراحی', done: false, priority: 'low', dueTime: '۱۸:۰۰' },
]

export interface IdeaItem {
  id: string
  title: string
  platform: Platform
  score: number
  trend: string
}

export const ideas: IdeaItem[] = [
  { id: 'i1', title: 'آموزش سریع ادیت رنگ در پریمیر', platform: 'youtube', score: 92, trend: 'رو به افزایش' },
  { id: 'i2', title: 'مقایسه ۳ میکروفون قابل حمل', platform: 'podcast', score: 78, trend: 'پایدار' },
  { id: 'i3', title: 'تایم‌لپ یک روز کاری استودیو', platform: 'instagram', score: 85, trend: 'رو به افزایش' },
  { id: 'i4', title: '۵ اشتباه رایج تدوینگران', platform: 'tiktok', score: 88, trend: 'رو به افزایش' },
]

export interface ActivityItem {
  id: string
  user: string
  avatarColor: string
  action: string
  target: string
  time: string
  icon: typeof PenLine
  iconColor: string
}

export const activities: ActivityItem[] = [
  { id: 'a1', user: 'علی حسینی', avatarColor: 'bg-amber-500', action: 'تدوین را به پایان رساند', target: 'ویدیو بررسی لپ‌تاپ', time: '۱۰ دقیقه پیش', icon: Film, iconColor: 'text-orange-400' },
  { id: 'a2', user: 'سارا راد', avatarColor: 'bg-pink-500', action: 'کاور جدید را طراحی کرد', target: 'پست اسلایدی دوره', time: '۳۰ دقیقه پیش', icon: Palette, iconColor: 'text-pink-400' },
  { id: 'a3', user: 'نیما پارسا', avatarColor: 'bg-violet-500', action: 'سناریو را ثبت کرد', target: 'تیک‌تاک ترفندهای موبایل', time: '۱ ساعت پیش', icon: PenLine, iconColor: 'text-violet-400' },
  { id: 'a4', user: 'احمد سلیمانی', avatarColor: 'bg-sky-500', action: 'ایده جدید را اضافه کرد', target: 'استریم بازی جدید', time: '۲ ساعت پیش', icon: Sparkles, iconColor: 'text-sky-400' },
  { id: 'a5', user: 'سارا راد', avatarColor: 'bg-pink-500', action: 'ریلز را منتشر کرد', target: 'پست اسلایدی معرفی دوره', time: '۳ ساعت پیش', icon: Send, iconColor: 'text-emerald-400' },
]

export interface CalendarEvent {
  day: number
  title: string
  platform: Platform
  time: string
}

export const calendarEvents: CalendarEvent[] = [
  { day: 3, title: 'ریلز آموزش فتوشاپ', platform: 'instagram', time: '۱۸:۰۰' },
  { day: 5, title: 'استریم بازی جدید', platform: 'twitch', time: '۲۰:۰۰' },
  { day: 8, title: 'پست معرفی دوره', platform: 'instagram', time: '۱۲:۰۰' },
  { day: 12, title: 'ویدیو یوتیوب', platform: 'youtube', time: '۱۷:۰۰' },
  { day: 15, title: 'پادکست مصاحبه', platform: 'podcast', time: '۱۹:۰۰' },
  { day: 18, title: 'تیک‌تاک ترفند', platform: 'tiktok', time: '۱۵:۰۰' },
  { day: 22, title: 'ولاگ استودیو', platform: 'youtube', time: '۱۶:۰۰' },
  { day: 25, title: 'توییت ترد هوش مصنوعی', platform: 'twitter', time: '۱۴:۰۰' },
]

export const weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه']
export const monthDays = Array.from({ length: 31 }, (_, i) => i + 1)

export const analyticsData = {
  totalViews: '۲۸۴٬۵۰۰',
  viewsChange: '+۱۲٪',
  totalEngagement: '۴۸٬۲۰۰',
  engagementChange: '+۸٪',
  newFollowers: '۳٬۲۴۰',
  followersChange: '+۱۵٪',
  watchTime: '۸٬۹۴۰ ساعت',
  watchTimeChange: '+۵٪',
  platformBreakdown: [
    { platform: 'instagram' as Platform, value: 35 },
    { platform: 'youtube' as Platform, value: 28 },
    { platform: 'tiktok' as Platform, value: 18 },
    { platform: 'twitch' as Platform, value: 10 },
    { platform: 'podcast' as Platform, value: 6 },
    { platform: 'twitter' as Platform, value: 3 },
  ],
  monthlyData: [
    { month: 'فروردین', views: 12000 },
    { month: 'اردیبهشت', views: 18000 },
    { month: 'خرداد', views: 22000 },
    { month: 'تیر', views: 28000 },
    { month: 'مرداد', views: 35000 },
    { month: 'شهریور', views: 42000 },
  ],
  topContent: [
    { title: 'آموزش ادیت رنگ سینمایی', platform: 'youtube' as Platform, views: '۸۹٬۲۰۰', engagement: '۶.۲٪' },
    { title: 'تریوندهای پریمیر پرو', platform: 'instagram' as Platform, views: '۷۲٬۵۰۰', engagement: '۸.۱٪' },
    { title: 'پشت صحنه استودیو', platform: 'tiktok' as Platform, views: '۶۵٬۳۰۰', engagement: '۹.۴٪' },
    { title: 'مصاحبه با کارآفرین', platform: 'podcast' as Platform, views: '۲۸٬۱۰۰', engagement: '۴.۸٪' },
  ],
}

export const toolLinks = [
  { label: 'تدوین', icon: Film, color: 'text-orange-400', bg: 'bg-orange-500/15' },
  { label: 'طراحی', icon: Palette, color: 'text-pink-400', bg: 'bg-pink-500/15' },
  { label: 'فیلم‌برداری', icon: Camera, color: 'text-amber-400', bg: 'bg-amber-500/15' },
  { label: 'تحلیل', icon: BarChart3, color: 'text-sky-400', bg: 'bg-sky-500/15' },
  { label: 'سناریو', icon: PenLine, color: 'text-violet-400', bg: 'bg-violet-500/15' },
  { label: 'انتشار', icon: Send, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
]

export const priorityMeta = {
  high: { label: 'اولویت بالا', color: 'text-rose-400', bg: 'bg-rose-500/15', dot: 'bg-rose-400' },
  medium: { label: 'اولویت متوسط', color: 'text-amber-400', bg: 'bg-amber-500/15', dot: 'bg-amber-400' },
  low: { label: 'اولویت پایین', color: 'text-sky-400', bg: 'bg-sky-500/15', dot: 'bg-sky-400' },
}
