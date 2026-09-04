import { useMemo, useState } from 'react'
import { Activity, CalendarDays, Check, Clock3, FolderKanban, GripVertical, LayoutDashboard, Plus, Users, X } from 'lucide-react'

type Status = 'todo' | 'doing' | 'done'
type Person = { id: string; name: string }
type Group = { id: string; name: string }
type Project = { id: string; name: string; start: string; end: string; groupId: string; ownerId: string }
type Task = { id: string; title: string; projectId: string; status: Status; groupId: string; assigneeId: string; createdAt: string; completedAt?: string }
type History = { id: string; personId: string; action: string; taskId: string; projectId: string; at: string }

const people: Person[] = [
  { id: 'p1', name: 'احمد سلیمانی' },
  { id: 'p2', name: 'محمد رضایی' },
  { id: 'p3', name: 'سارا احمدی' },
]
const initialGroups: Group[] = [{ id: 'g1', name: 'توسعه' }, { id: 'g2', name: 'طراحی' }, { id: 'g3', name: 'بازاریابی' }]
const initialProjects: Project[] = [
  { id: 'pr1', name: 'وب‌سایت شرکت', start: '2026-09-01', end: '2026-09-24', groupId: 'g1', ownerId: 'p1' },
  { id: 'pr2', name: 'اپلیکیشن موبایل', start: '2026-09-10', end: '2026-10-18', groupId: 'g1', ownerId: 'p2' },
  { id: 'pr3', name: 'کمپین پاییزه', start: '2026-09-20', end: '2026-10-08', groupId: 'g3', ownerId: 'p3' },
]
const initialTasks: Task[] = [
  { id: 't1', title: 'طراحی صفحه اصلی', projectId: 'pr1', status: 'done', groupId: 'g2', assigneeId: 'p3', createdAt: '2026-09-01', completedAt: '2026-09-05' },
  { id: 't2', title: 'پیاده‌سازی داشبورد', projectId: 'pr1', status: 'doing', groupId: 'g1', assigneeId: 'p1', createdAt: '2026-09-04' },
  { id: 't3', title: 'اتصال API', projectId: 'pr1', status: 'todo', groupId: 'g1', assigneeId: 'p2', createdAt: '2026-09-08' },
  { id: 't4', title: 'طراحی رابط کاربری', projectId: 'pr2', status: 'doing', groupId: 'g2', assigneeId: 'p3', createdAt: '2026-09-10' },
  { id: 't5', title: 'ساخت نسخه اولیه', projectId: 'pr2', status: 'todo', groupId: 'g1', assigneeId: 'p2', createdAt: '2026-09-11' },
  { id: 't6', title: 'تقویم محتوایی', projectId: 'pr3', status: 'todo', groupId: 'g3', assigneeId: 'p3', createdAt: '2026-09-20' },
]
const statusMeta: Record<Status, { title: string; dot: string; weight: number }> = {
  todo: { title: 'در انتظار انجام', dot: 'bg-slate-400', weight: 0 },
  doing: { title: 'در حال انجام', dot: 'bg-amber-400', weight: 50 },
  done: { title: 'انجام شده', dot: 'bg-emerald-400', weight: 100 },
}
const fmt = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' })
const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
const calcProgress = (projectId: string, tasks: Task[]) => {
  const projectTasks = tasks.filter(t => t.projectId === projectId)
  if (!projectTasks.length) return 0
  return Math.round(projectTasks.reduce((sum, task) => sum + statusMeta[task.status].weight, 0) / projectTasks.length)
}

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
  const progressMap = useMemo(() => Object.fromEntries(projects.map(p => [p.id, calcProgress(p.id, tasks)])), [projects, tasks])
  const overallProgress = projects.length ? Math.round(projects.reduce((sum, p) => sum + progressMap[p.id], 0) / projects.length) : 0

  const moveTask = (taskId: string, status: Status) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task || task.status === status) return setDragId(null)
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status, completedAt: status === 'done' ? new Date().toISOString().slice(0, 10) : undefined } : t))
    setHistory(prev => [{ id: uid('h'), personId: task.assigneeId, action: `${statusMeta[status].title} شد`, taskId, projectId: task.projectId, at: new Date().toISOString() }, ...prev])
    setDragId(null)
  }

  const addGroup = (name: string) => { if (name.trim()) setGroups(g => [...g, { id: uid('g'), name: name.trim() }]); setModal(null) }
  const addTask = (title: string, projectId: string, groupId: string, assigneeId: string) => { if (title.trim()) setTasks(t => [...t, { id: uid('t'), title: title.trim(), projectId, status: 'todo', groupId, assigneeId, createdAt: new Date().toISOString().slice(0, 10) }]); setModal(null) }
  const addProject = (name: string, start: string, end: string, groupId: string) => { if (name.trim()) { const id = uid('pr'); setProjects(p => [...p, { id, name: name.trim(), start, end, groupId, ownerId: people[0].id }]); setSelectedProject(id) }; setModal(null) }

  return <div dir="rtl" className="min-h-screen bg-[#08090d] text-slate-200 font-sans">
    <aside className="fixed right-0 top-0 bottom-0 hidden md:flex w-64 flex-col border-l border-white/10 bg-[#0d0f15] p-5">
      <div className="flex items-center gap-3 mb-8"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-xl font-black">O</div><div><b className="text-white">Orbit Tasks</b><p className="text-xs text-slate-500">مدیریت پروژه و تیم</p></div></div>
      <nav className="space-y-2">{([['board','برد پروژه',LayoutDashboard],['timeline','تایم‌لاین',CalendarDays],['activity','فعالیت افراد',Activity]] as const).map(([id,label,Icon]) => <button key={id} onClick={() => setPage(id)} className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm ${page === id ? 'bg-violet-500/15 text-violet-300' : 'text-slate-400 hover:bg-white/5'}`}><Icon size={18}/>{label}</button>)}</nav>
      <div className="mt-auto rounded-2xl border border-white/10 bg-white/[.03] p-4"><p className="text-xs text-slate-500">پیشرفت کل پروژه‌ها</p><div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-violet-500" style={{width:`${overallProgress}%`}}/></div><b className="mt-2 block text-lg">{overallProgress}٪</b><p className="mt-1 text-[10px] text-slate-600">محاسبه خودکار از روی وضعیت تسک‌ها</p></div>
    </aside>

    <main className="md:mr-64 p-5 md:p-8 max-w-[1600px] mx-auto">
      <header className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-sm text-violet-400">فضای کاری تیم</p><h1 className="mt-1 text-3xl font-black text-white">مدیریت پروژه</h1><p className="mt-1 text-sm text-slate-500">درصد پیشرفت پروژه‌ها اکنون مستقیماً از وضعیت تسک‌ها محاسبه می‌شود.</p></div><div className="flex flex-wrap gap-2"><button onClick={()=>setModal('group')} className="btn-secondary"><Users size={16}/> گروه جدید</button><button onClick={()=>setModal('task')} className="btn-secondary"><Plus size={16}/> تسک جدید</button><button onClick={()=>setModal('project')} className="btn-primary"><FolderKanban size={16}/> پروژه جدید</button></div></header>

      {page === 'board' && <>
        <section className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-3">{[['پروژه‌ها',projects.length],['تسک‌ها',tasks.length],['انجام شده',tasks.filter(t=>t.status==='done').length],['میانگین پیشرفت',`${overallProgress}٪`]].map(([label,value])=><div key={label as string} className="rounded-2xl border border-white/10 bg-[#10121a] p-4"><p className="text-xs text-slate-500">{label}</p><strong className="mt-2 block text-2xl text-white">{value}</strong></div>)}</section>
        <section className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">{projects.map(p=><div key={p.id} className="rounded-2xl border border-white/10 bg-[#10121a] p-4"><div className="flex justify-between gap-3"><div><p className="text-xs text-slate-500">پیشرفت پروژه</p><h3 className="mt-1 font-bold text-white">{p.name}</h3></div><b className="text-violet-300">{progressMap[p.id]}٪</b></div><div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden"><div className="h-full rounded-full bg-violet-500 transition-all" style={{width:`${progressMap[p.id]}%`}}/></div><p className="mt-2 text-[10px] text-slate-600">۰٪ انتظار · ۵۰٪ در حال انجام · ۱۰۰٪ انجام شده</p></div>)}</section>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">{(Object.keys(statusMeta) as Status[]).map(status => <div key={status} onDragOver={e=>e.preventDefault()} onDrop={()=>dragId && moveTask(dragId,status)} className="min-h-[460px] rounded-2xl border border-white/10 bg-[#0f1118] p-4"><div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${statusMeta[status].dot}`}/><h2 className="font-bold text-white">{statusMeta[status].title}</h2></div><span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-500">{tasks.filter(t=>t.status===status).length}</span></div><div className="space-y-3">{tasks.filter(t=>t.status===status).map(task => <article key={task.id} draggable onDragStart={()=>setDragId(task.id)} className="cursor-grab rounded-xl border border-white/10 bg-[#171923] p-4 shadow-lg active:cursor-grabbing"><div className="flex items-start gap-2"><GripVertical size={17} className="mt-0.5 text-slate-600"/><div className="flex-1"><h3 className="font-semibold text-white">{task.title}</h3><p className="mt-1 text-xs text-slate-500">{projectMap[task.projectId]?.name}</p><div className="mt-3 flex flex-wrap gap-1.5"><span className="chip">{groupMap[task.groupId]?.name}</span><span className="chip">{personMap[task.assigneeId]?.name}</span></div></div></div><div className="mt-3 flex items-center justify-between text-xs text-slate-500"><span>شروع: {fmt(task.createdAt)}</span>{task.completedAt && <span className="text-emerald-400">✓ {fmt(task.completedAt)}</span>}</div></article>)}</div></div>)}</section>
      </>}
      {page === 'timeline' && <Timeline projects={projects} progressMap={progressMap}/>} 
      {page === 'activity' && <ActivityLog history={history} tasks={tasks} projects={projects} people={people}/>} 
    </main>

    {modal && <Modal title={modal==='task'?'ساخت تسک جدید':modal==='project'?'ساخت پروژه جدید':'ساخت گروه جدید'} onClose={()=>setModal(null)}>{modal==='task' ? <TaskForm projects={projects} groups={groups} people={people} selectedProject={selectedProject} onSubmit={addTask}/> : modal==='project' ? <ProjectForm groups={groups} onSubmit={addProject}/> : <GroupForm onSubmit={addGroup}/>}</Modal>}
    <style>{`.btn-primary,.btn-secondary{display:flex;align-items:center;gap:7px;border-radius:12px;padding:10px 14px;font-size:13px;font-weight:700}.btn-primary{background:#7c3aed;color:white}.btn-secondary{border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#cbd5e1}.chip{display:inline-flex;border-radius:999px;background:rgba(255,255,255,.06);padding:4px 8px;font-size:10px;color:#94a3b8}.field{width:100%;border:1px solid rgba(255,255,255,.1);background:#0b0d12;color:#e2e8f0;border-radius:10px;padding:10px;outline:none}.field:focus{border-color:#7c3aed}`}</style>
  </div>
}

function Timeline({projects,progressMap}:{projects:Project[];progressMap:Record<string,number>}) { const min=new Date('2026-09-01').getTime(), max=new Date('2026-10-31').getTime(); return <section className="rounded-2xl border border-white/10 bg-[#0f1118] p-5 overflow-x-auto"><div className="mb-6 flex items-center justify-between"><div><h2 className="text-xl font-bold text-white">تایم‌لاین پروژه‌ها</h2><p className="text-xs text-slate-500 mt-1">تاریخ شروع، مهلت و درصد پیشرفت خودکار</p></div><Clock3 className="text-violet-400"/></div><div className="min-w-[850px]"><div className="mr-44 grid grid-cols-5 text-[11px] text-slate-600"><span>شهریور ۱</span><span>شهریور ۱۵</span><span>مهر ۱</span><span>مهر ۱۵</span><span>مهر ۳۰</span></div>{projects.map(p=>{const left=((new Date(p.start).getTime()-min)/(max-min))*100,width=Math.max(5,((new Date(p.end).getTime()-new Date(p.start).getTime())/(max-min))*100);return <div key={p.id} className="relative mt-5 h-16"><div className="absolute right-0 top-1 w-40 text-sm font-semibold text-white">{p.name}<span className="block text-[10px] text-slate-600">{fmt(p.start)} تا {fmt(p.end)}</span></div><div className="absolute left-0 right-44 top-2 h-10 rounded-xl bg-white/[.03]"><div className="absolute top-0 h-10 rounded-xl bg-violet-500/25 border border-violet-400/30" style={{right:`${100-left-width}%`,width:`${width}%`}}><div className="h-full rounded-xl bg-violet-500" style={{width:`${progressMap[p.id]}%`}}/><span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">{progressMap[p.id]}٪</span></div></div></div>})}</div></section> }

function ActivityLog({history,tasks,projects,people}:{history:History[];tasks:Task[];projects:Project[];people:Person[]}) { const taskMap=Object.fromEntries(tasks.map(t=>[t.id,t]));const projectMap=Object.fromEntries(projects.map(p=>[p.id,p]));const personMap=Object.fromEntries(people.map(p=>[p.id,p])); return <section className="rounded-2xl border border-white/10 bg-[#0f1118] p-5"><h2 className="text-xl font-bold text-white">فعالیت افراد</h2><p className="text-xs text-slate-500 mt-1">تغییر وضعیت تسک‌ها در این نشست</p><div className="mt-5 space-y-3">{history.length===0?<div className="rounded-xl bg-white/[.03] p-6 text-center text-sm text-slate-500">هنوز فعالیتی ثبت نشده است. یک تسک را بین ستون‌ها جابه‌جا کنید.</div>:history.map(h=><div key={h.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[.02] p-4"><div className="grid h-9 w-9 place-items-center rounded-full bg-violet-500/15 text-violet-300"><Check size={16}/></div><div className="flex-1 text-sm"><b className="text-white">{personMap[h.personId]?.name}</b> <span className="text-slate-400">تسک</span> <b className="text-white">{taskMap[h.taskId]?.title}</b> <span className="text-slate-400">را به</span> <span className="text-violet-300">{h.action}</span><p className="mt-1 text-[10px] text-slate-600">پروژه: {projectMap[h.projectId]?.name} · {new Date(h.at).toLocaleString('fa-IR')}</p></div></div>)}</div></section> }

function Modal({title,onClose,children}:{title:string;onClose:()=>void;children:React.ReactNode}) { return <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"><div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#11131b] p-5 shadow-2xl"><div className="mb-5 flex items-center justify-between"><h2 className="font-bold text-white">{title}</h2><button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20}/></button></div>{children}</div></div> }
function GroupForm({onSubmit}:{onSubmit:(name:string)=>void}) { const [name,setName]=useState('');return <form onSubmit={e=>{e.preventDefault();onSubmit(name)}} className="space-y-4"><input autoFocus className="field" placeholder="نام گروه" value={name} onChange={e=>setName(e.target.value)}/><button className="btn-primary w-full justify-center">ایجاد گروه</button></form> }
function TaskForm({projects,groups,people,selectedProject,onSubmit}:{projects:Project[];groups:Group[];people:Person[];selectedProject:string;onSubmit:(title:string,projectId:string,groupId:string,assigneeId:string)=>void}) { const [title,setTitle]=useState('');const [projectId,setProjectId]=useState(selectedProject||projects[0]?.id||'');const [groupId,setGroupId]=useState(groups[0]?.id||'');const [assigneeId,setAssigneeId]=useState(people[0]?.id||'');return <form onSubmit={e=>{e.preventDefault();onSubmit(title,projectId,groupId,assigneeId)}} className="space-y-3"><input autoFocus className="field" placeholder="عنوان تسک" value={title} onChange={e=>setTitle(e.target.value)}/><select className="field" value={projectId} onChange={e=>setProjectId(e.target.value)}>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select><select className="field" value={groupId} onChange={e=>setGroupId(e.target.value)}>{groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select><select className="field" value={assigneeId} onChange={e=>setAssigneeId(e.target.value)}>{people.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select><button className="btn-primary w-full justify-center">ایجاد تسک</button></form> }
function ProjectForm({groups,onSubmit}:{groups:Group[];onSubmit:(name:string,start:string,end:string,groupId:string)=>void}) { const [name,setName]=useState('');const [start,setStart]=useState('2026-09-01');const [end,setEnd]=useState('2026-09-30');const [groupId,setGroupId]=useState(groups[0]?.id||'');return <form onSubmit={e=>{e.preventDefault();onSubmit(name,start,end,groupId)}} className="space-y-3"><input autoFocus className="field" placeholder="نام پروژه" value={name} onChange={e=>setName(e.target.value)}/><label className="block text-xs text-slate-500">تاریخ شروع<input type="date" className="field mt-1" value={start} onChange={e=>setStart(e.target.value)}/></label><label className="block text-xs text-slate-500">مهلت پایان<input type="date" className="field mt-1" value={end} onChange={e=>setEnd(e.target.value)}/></label><select className="field" value={groupId} onChange={e=>setGroupId(e.target.value)}>{groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}</select><button className="btn-primary w-full justify-center">ایجاد پروژه</button></form> }
