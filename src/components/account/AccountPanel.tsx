import { useState } from 'react';
import { X, UserRound, Mail, Phone, LockKeyhole, LogIn, UserPlus } from 'lucide-react';
import type { UserProfile } from '../../types/domain';

interface AccountPanelProps {
  open: boolean;
  user: UserProfile | null;
  onClose: () => void;
  onAuthenticated: (user: UserProfile) => void;
}

export default function AccountPanel({ open, user, onClose, onAuthenticated }: AccountPanelProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  if (!open) return null;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    // Temporary local profile so the UI is usable before the backend exists.
    // Replacing this callback with authApi.login/register is intentionally isolated.
    const profile: UserProfile = {
      id: `local-${Date.now()}`,
      fullName: mode === 'register' ? fullName.trim() : (fullName.trim() || email.split('@')[0] || 'کاربر'),
      email: email.trim(),
      phone: phone.trim(),
      role: 'member',
    };

    if (!profile.email || password.length < 4) return;
    onAuthenticated(profile);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" dir="rtl">
      <div className="glass w-full max-w-md rounded-3xl border border-white/10 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{user ? 'حساب کاربری' : mode === 'login' ? 'ورود به حساب' : 'ساخت حساب'}</h2>
            <p className="mt-1 text-sm text-gray-400">حساب سازمانی Orbit-Tasks</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-gray-400 hover:bg-white/5 hover:text-white" aria-label="بستن">
            <X size={20} />
          </button>
        </div>

        {user ? (
          <div className="space-y-3 text-sm">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><UserRound className="mb-2" size={20} /><strong>{user.fullName}</strong></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><Mail className="mb-2" size={20} /><span>{user.email}</span></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><Phone className="mb-2" size={20} /><span>{user.phone || 'ثبت نشده'}</span></div>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <label className="block"><span className="mb-2 block text-sm text-gray-300">نام و نام خانوادگی</span><div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3"><UserRound size={18} className="text-gray-500" /><input required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full bg-transparent py-3 text-white outline-none" /></div></label>
            )}
            <label className="block"><span className="mb-2 block text-sm text-gray-300">ایمیل سازمانی</span><div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3"><Mail size={18} className="text-gray-500" /><input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-transparent py-3 text-white outline-none" /></div></label>
            {mode === 'register' && <label className="block"><span className="mb-2 block text-sm text-gray-300">شماره تلفن</span><div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3"><Phone size={18} className="text-gray-500" /><input required value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-transparent py-3 text-white outline-none" /></div></label>}
            <label className="block"><span className="mb-2 block text-sm text-gray-300">رمز عبور</span><div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3"><LockKeyhole size={18} className="text-gray-500" /><input required minLength={4} type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-transparent py-3 text-white outline-none" /></div></label>
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-500 py-3 font-bold text-white transition hover:bg-pink-400">{mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}{mode === 'login' ? 'ورود' : 'ایجاد حساب'}</button>
            <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="w-full text-sm text-gray-400 hover:text-white">{mode === 'login' ? 'حساب ندارید؟ ثبت‌نام کنید' : 'قبلاً حساب دارید؟ وارد شوید'}</button>
          </form>
        )}
      </div>
    </div>
  );
}
