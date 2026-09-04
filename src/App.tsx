import { useMemo, useState } from 'react'
import { Activity, CalendarDays, Check, ChevronLeft, Clock3, FolderKanban, GripVertical, LayoutDashboard, Plus, Users, X } from 'lucide-react'

type Status = 'todo' | 'doing' | 'done'
type Person = { id: string; name: string; color: string }
type Group = { id: string; name: string }
type Project = { id: string; name: string; start: string; end: string; progress: number; groupId: string; ownerId: string }
type Task = { id: string; title: string; projectId: string; status: Status; groupId: string; assigneeId: string; createdAt: string; completedAt?: string }
type History = { id: string; personId: string; action: string; taskId: string; projectId: string; at: string }

const people: Person[] = [
  { id: 'p1', name: 'احمد سلیمانی', color: 'bg-violet-500' },
  { id: 'p2', name: 'محمد رضایی', color: 'bg-cyan-500' },
  { id: 'p3', name: 'سارا احمدی', color: 'bg-emerald-500' },
]
const initialGroups: Group[] = [{ id: 'g1', name: 'توسعه' }, { id: 'g2', name: 'طراحی' }, { id: 'g3', name: 'بازاریابی' }]
const initialProjects: Project[] = [
  { id: 'pr1', name: 'وب‌سایت شرکت', start: '2026-09-01', end: '2026-09-24', progress: 65, groupId: 'g1', ownerId: 'p1' },
  { id: 'pr2', name: 'اپلیکیشن موبایل', start: '2026-09-10', end: '2026-10-18', progress: 32, groupId: 'g1', ownerId: 'p2' },
  { id: 'pr3', name: 'کمپین پاییزه', start: '2026-09-20', end: '2026-10-08', progress: 15, groupId: 'g3', ownerId: 'p3' },
]
const initialTasks: Task[] = [
  { id: 't1', title: 'طراحی صفحه اصلی', projectId: 'pr1', status: 'done', groupId: 'g2', assigneeId: 'p3', createdAt: '2026-09-01', completedAt: '2026-09-05' },
  { id: 't2', title: 'پیاده‌سازی داشبورد', projectId: 'pr1', status: 'doing', groupId: 'g1', assigneeId: 'p1', createdAt: '2026-09-04' },
  { id: 't3', title: 'اتصال API', projectId: 'pr1', status: 'todo', groupId: 'g1', assigneeId: 'p2', createdAt: '2026-09-08' },
  { id: 't4', title: 'طراحی رابط کاربری', projectId: 'pr2', status: 'doing', groupId: 'g2', assigneeId: 'p3', createdAt: '2026-09-10' },
  { id: 't5', title: 'ساخت نسخه اولیه', projectId: 'pr2', status: 'todo', groupId: 'g1', assigneeId: 'p2', createdAt: '2026-09-11' },
  { id: 't6', title: 'تقویم محتوایی', projectId: 'pr3', status: 'todo', groupId: 'g3', assigneeId: 'p3', createdAt: '2026-09-20' },
]
const statusMeta: Record<Status, { title: string; dot: string }> = {
  todo: { title: 'در انتظار انجام', dot: 'bg-slate-400' },
  doing: { title: 'در حال انجام', dot: 'bg-amber-400' },
  done: { title: 'انجام شده', dot: 'bg-emerald-400' },
}
const fmt = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' })
const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

export default function App() {
  const [page, setPage] = useState<'board' | 'timeline' | 'activity'>('board')
  const [projects, setProjects] = useState(initialProjects)
  const [tasks, setTasks] = useState(initialTasks)
  const [groups, setGroups] = useState(initialGroups)
  const [history, setHistory] = useState<History[]>([])
  const [dragId, setDragId] = useState<string | null>(null)
  const [modal, setModal] = useState<'task' | 'project' | 'group' | null>(null)
  const [selectedProject, setSelectedProject] = useState('pr1')

  const projectMap = useMemo(() => Object.fromEntries(projects.map(p => [p.id, p])), [projects])
  const groupMap = useMemo(() => Object.fromEntries(groups.map(g => [g.id, g])), [groups])
  const personMap = useMemo(() => Object.fromEntries(people.map(p => [p.id, p])), [])

  const moveTask = (taskId: string, status: Status) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status, completedAt: status === 'done' ? new Date().toISOString().slice(0, 10) : undefined } : t))
    const task = tasks.find(t => t.id === taskId)
    if (task && task.status !== status) setHistory(prev => [{ id: uid('h'), personId: task.assigneeId, action: `${statusMeta[status].title} شد`, taskId, projectId: task.projectId, at: new Date().toISOString() }, ...prev])
    setDragId(null)
  }

  const addGroup = (name: string) => { if (name.trim()) setGroups(g => [...g, { id: uid('g'), name: name.trim() }]); setModal(null) }
  const addTask = (title: string) => { if (title.trim()) setTasks(t => [...t, { id: uid('t'), title: title.trim(), projectId: selectedProject, status: 'todo', groupId: groups[0]?.id ?? '', assigneeId: people[0].id, createdAt: new Date().toISOString().slice(0, 10) }]); setModal(null) }
  const addProject = (name: string, start: string, end: string) => { if (name.trim()) setProjects(p => [...p, { id: uid('pr'), name: name.trim(), start, end, progress: 0, groupId: groups[0]?.id ?? '', ownerId: people[0].id }]); setModal(null) }

  return <div dir="rtl" className="min-h-screen bg-[#08090d] text-slate-200 font-sans">
    <aside className="fixed right-0 top-0 bottom-0 hidden md:flex w-64 flex-col border-l border-white/10 bg-[#0d0f15] p-5">
      <div className="flex items-center gap-3 mb-8"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-xl font-black">O</div><div><b className="text-white">Orbit Tasks</b><p className="text-xs text-slate-500">مدیریت پروژه و تیم</p></div></div>
      <nav className="space-y-2">{([['board','برد پروژه',LayoutDashboard],['timeline','تایم‌لاین',CalendarDays],['activity','فعالیت افراد',Activity]] as const).map(([id,label,Icon]) => <button key={id} onClick={() => setPage(id)} className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${page === id ? 'bg-violet-500/15 text-violet-300' : 'text-slate-400 hover:bg-white/5'}`}><Icon size={18}/>{label}</button>)}</nav>
      <div className="mt-auto rounded-2xl border border-white/10 bg-white/[.03] p-4"><p className="text-xs text-slate-500">پیشرفت کل پروژه‌ها</p><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-violet-500" style={{width:`${Math.round(projects.reduce((a,p)=>a+p.progress,0)/projects.length)}%`}}/></div><b className="mt-2 block text-lg">{Math.round(projects.reduce((a,p)=>a+p.progress,0)/projects.length)}٪</b></div>
    </aside>

    <main className="md:mr-64 p-5 md:p-8 max-w-[1600px] mx-auto">
      <header className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-sm text-violet-400">فضای کاری تیم</p><h1 className="mt-1 text-3xl font-black text-white">مدیریت پروژه</h1><p className="mt-1 text-sm text-slate-500">سه وضعیت ساده، درصد پیشرفت، زمان‌بندی و سابقه عملکرد تیم</p></div><div className="flex flex-wrap gap-2"><button onClick={()=>setModal('group')} className="btn-secondary"><Users size={16}/> گروه جدید</button><button onClick={()=>setModal('task')} className="btn-secondary"><Plus size={16}/> تسک جدید</button><button onClick={()=>setModal('project')} className="btn-primary"><FolderKanban size={16}/> پروژه جدید</button></div></header>

      {page === 'board' && <>
        <section className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3">{[['پروژه‌ها',projects.length],['تسک‌ها',tasks.length],['انجام شده',tasks.filter(t=>t.status==='done').length],['میانگین پیشرفت',`${Math.round(projects.reduce((a,p)=>a+p.progress,0)/projects.length)}٪`]].map(([label,value])=><div key={label as string} className="rounded-2xl border border-white/10 bg-[#10121a] p-4"><p className="text-xs text-slate-500">{label}</p><strong className="mt-2 block text-2xl text-white">{value}</strong></div>)}</section>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">{(Object.keys(statusMeta) as Status[]).map(status => <div key={status} onDragOver={e=>e.preventDefault()} onDrop={()=>dragId && moveTask(dragId,status)} className="min-h-[460px] rounded-2xl border border-white/10 bg-[#0f1118] p-4"><div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${statusMeta[status].dot}`}/><h2 className="font-bold text-white">{statusMeta[status].title}</h2></div><span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-500">{tasks.filter(t=>t.status===status).length}</span></div><div className="space-y-3">{tasks.filter(t=>t.status===status).map(task => <article key={task.id} draggable onDragStart={()=>setDragId(task.id)} className="cursor-grab rounded-xl border border-white/10 bg-[#171923] p-4 shadow-lg active:cursor-grabbing"><div className="flex items-start gap-2"><GripVertical size={17} className="mt-0.5 text-slate-600"/><div className="flex-1"><h3 className="font-semibold text-white">{task.title}</h3><p className="mt-1 text-xs text-slate-500">{projectMap[task.projectId]?.name}</p><div className="mt-3 flex flex-wrap gap-1.5"><span className="chip">{groupMap[task.groupId]?.name}</span><span className="chip">{personMap[task.assigneeId]?.name}</span></div></div></div><div className="mt-3 flex items-center justify-between text-xs text-slate-500"><span>شروع: {fmt(task.createdAt)}</span>{task.completedAt && <span className="text-emerald-400">✓ {fmt(task.completedAt)}</span>}</div></article>)}</div></div>)}</section>
      </>}

      {page === 'timeline' && <Timeline projects={projects}/>} 
      {page === 'activity' && <ActivityLog history={history} tasks={tasks} projects={projects} people={people}/>} 
    </main>

    {modal && <Modal title={modal==='task'?'ساخت تسک جدید':modal==='project'?'ساخت پروژه جدید':'ساخت گروه جدید'} onClose={()=>setModal(null)}>{modal==='task' ? <TaskForm projects={projects} selectedProject={selectedProject} setSelectedProject={setSelectedProject} onSubmit={addTask}/> : modal==='project' ? <ProjectForm onSubmit={addProject}/> : <GroupForm onSubmit={addGroup}/>}</Modal>}
    <style>{`.btn-primary,.btn-secondary{display:flex;align-items:center;gap:7px;border-radius:12px;padding:10px 14px;font-size:13px;font-weight:700}.btn-primary{background:#7c3aed;color:white}.btn-secondary{border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#cbd5e1}.chip{display:inline-flex;border-radius:999px;background:rgba(255,255,255,.06);padding:4px 8px;font-size:10px;color:#94a3b8}`}</style>
  </div>
}

function Timeline({projects}:{projects:Project[]}) { const min=new Date('2026-09-01').getTime(), max=new Date('2026-10-31').getTime(); return <section className="rounded-2xl border border-white/10 bg-[#0f1118] p-5 overflow-x-auto"><div className="mb-6 flex items-center justify-between"><div><h2 className="text-xl font-bold text-white">تایم‌لاین پروژه‌ها</h2><p className="text-xs text-slate-500 mt-1">تاریخ شروع و آخرین مهلت اتمام هر پروژه</p></div><Clock3 className="text-violet-400"/></div><div className="min-w-[850px]"><div className="mr-44 grid grid-cols-5 text-[11px] text-slate-600"><span>شهریور ۱</span><span>شهریور ۱۵</span><span>مهر ۱</span><span>مهر ۱۵</span><span>مهر ۳۰</span></div>{projects.map(p=>{const left=((new Date(p.start).getTime()-min)/(max-min))*100,width=Math.max(5,((new Date(p.end).getTime()-new Date(p.start).getTime())/(max-min))*100);return <div key={p.id} className="relative mt-5 h-16"><div className="absolute right-0 top-1 w-40 text-sm font-semibold text-white">{p.name}<span className="block text-[10px] text-slate-600">{fmt(p.start)} تا {fmt(p.end)}</span></div><div className="absolute left-0 right-44 top-2 h-10 rounded-xl bg-white/[.03]"><div className="absolute top-0 h-10 rounded-xl bg-violet-500/25 border border-violet-400/30" style={{right:`${100-left-width}%`,width:`${width}%`}}><div className="h-full rounded-xl bg-violet-500" style={{width:`${p.progress}%`}}/><span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{p.progress}٪</span></div></div></div>})}</div></section> }
function ActivityLog({history,tasks,projects,people}:{history:History[];tasks:Task[];projects:Project[];people:Person[]}) { const pm=Object.fromEntries(people.map(p=>[p.id,p])); const tm=Object.fromEntries(tasks.map(t=>[t.id,t])); const pr=Object.fromEntries(projects.map(p=>[p.id,p])); return <section className="rounded-2xl border border-white/10 bg-[#0f1118] p-5"><h2 className="text-xl font-bold text-white">چه کسی چه کاری انجام داده؟</h2><p className="mt-1 text-xs text-slate-500">تاریخچه تغییر وضعیت و عملکرد اعضای تیم</p><div className="mt-6 space-y-3">{history.length===0?<div className="rounded-xl bg-white/[.03] p-8 text-center text-sm text-slate-500">هنوز فعالیتی ثبت نشده. با جابه‌جایی تسک‌ها در برد، تاریخچه اینجا ثبت می‌شود.</div>:history.map(h=><div key={h.id} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[.02] p-4"><div className={`grid h-10 w-10 place-items-center rounded-full ${pm[h.personId]?.color||'bg-slate-600'} text-sm font-bold`}>{pm[h.personId]?.name?.slice(0,1)}</div><div className="flex-1"><b className="text-white">{pm[h.personId]?.name}</b><span className="text-slate-500"> {h.action} </span><b className="text-violet-300">{tm[h.taskId]?.title}</b><span className="block text-xs text-slate-600 mt-1">پروژه: {pr[h.projectId]?.name}</span></div><time className="text-xs text-slate-600">{new Date(h.at).toLocaleString('fa-IR')}</time></div>)}</div></section> }
function Modal({title,onClose,children}:{title:string;onClose:()=>void;children:React.ReactNode}) { return <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"><div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#11131b] p-5"><div className="mb-5 flex items-center justify-between"><h2 className="text-lg font-bold text-white">{title}</h2><button onClick={onClose}><X/></button></div>{children}</div></div> }
const Input=({label,...props}:{label:string}&React.InputHTMLAttributes<HTMLInputElement>)=><label className="block space-y-2"><span className="text-xs text-slate-400">{label}</span><input {...props} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500"/></label>
function GroupForm({onSubmit}:{onSubmit:(n:string)=>void}){const[n,setN]=useState('');return <form onSubmit={e=>{e.preventDefault();onSubmit(n)}} className="space-y-4"><Input label="نام گروه" value={n} onChange={e=>setN(e.target.value)} placeholder="مثلاً تیم توسعه"/><button className="btn-primary w-full justify-center">ساخت گروه</button></form>}
function TaskForm({onSubmit,projects,selectedProject,setSelectedProject}:{onSubmit:(n:string)=>void;projects:Project[];selectedProject:string;setSelectedProject:(s:string)=>void}){const[n,setN]=useState('');return <form onSubmit={e=>{e.preventDefault();onSubmit(n)}} className="space-y-4"><Input label="عنوان تسک" value={n} onChange={e=>setN(e.target.value)} placeholder="عنوان کار را وارد کنید"/><label className="block space-y-2"><span className="text-xs text-slate-400">پروژه</span><select value={selectedProject} onChange={e=>setSelectedProject(e.target.value)} className="w-full rounded-xl border border-white/10 bg-[#171923] px-3 py-2.5 text-sm text-white">{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><button className="btn-primary w-full justify-center">ساخت تسک</button></form>}
function ProjectForm({onSubmit}:{onSubmit:(n:string,s:string,e:string)=>void}){const[n,setN]=useState('');const[s,setS]=useState('2026-09-04');const[e,setE]=useState('2026-10-04');return <form onSubmit={x=>{x.preventDefault();onSubmit(n,s,e)}} className="space-y-4"><Input label="نام پروژه" value={n} onChange={x=>setN(x.target.value)} placeholder="مثلاً وب‌سایت جدید"/><Input label="تاریخ شروع" type="date" value={s} onChange={x=>setS(x.target.value)}/><Input label="مهلت اتمام" type="date" value={e} onChange={x=>setE(x.target.value)}/><button className="btn-primary w-full justify-center">ساخت پروژه</button></form>}
