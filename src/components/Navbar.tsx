import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Globe, 
  Bell, 
  ChevronDown, 
  UserCheck, 
  Briefcase, 
  Cpu, 
  Calendar, 
  Lock,
  CheckCircle2,
  Mail
} from 'lucide-react';
import { Language, UserRole, SystemNotification } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { MushowrLogo } from './MushowrLogo';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: 'marketplace' | 'mySessions' | 'advisorWorkspace' | 'architectureSpec';
  setActiveTab: (tab: 'marketplace' | 'mySessions' | 'advisorWorkspace' | 'architectureSpec') => void;
  notifications: SystemNotification[];
  markNotificationRead: (id: string) => void;
  onOpenWorkspace?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  role,
  setRole,
  activeTab,
  setActiveTab,
  notifications,
  markNotificationRead,
  onOpenWorkspace
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const t = TRANSLATIONS[lang];

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleLanguage = () => {
    const nextLang: Language = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  const getRoleLabel = (r: UserRole) => {
    if (r === 'client') return t.nav.roleClient;
    if (r === 'advisor') return t.nav.roleAdvisor;
    return t.nav.roleAdmin;
  };

  const getRoleBadge = (r: UserRole) => {
    if (r === 'client') return { tag: 'CEO', labelAr: 'الرئيس التنفيذي', labelEn: 'CEO / Client', bg: 'bg-[#2D1B69]', lightBg: 'bg-[#EEF0FF] text-[#2D1B69] border-[#D8E3FB]' };
    if (r === 'advisor') return { tag: 'ADV', labelAr: 'المستشار التنفيذي', labelEn: 'Advisor', bg: 'bg-[#10B981]', lightBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    return { tag: 'ARCH', labelAr: 'بنية النظام', labelEn: 'Architect', bg: 'bg-[#180052]', lightBg: 'bg-slate-100 text-slate-700 border-slate-200' };
  };

  const currentRoleInfo = getRoleBadge(role);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-strategic-low">
      
      {/* Top Utility Bar: Midnight Purple Palette */}
      <div className="bg-[#180052] text-slate-300 px-4 sm:px-6 lg:px-8 py-1.5 text-xs border-b border-[#2D1B69]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Trust badges */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#10B981]/15 text-[#6FFBBE] border border-[#10B981]/30 text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{t.nav.escrowProtected}</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-slate-300/80 text-[11px]">
              <Lock className="w-3 h-3 text-[#A5B4FC]" />
              <span>Google Meet API & Automated E-Sign NDA</span>
            </span>
          </div>

          {/* Segmented Quick Role Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-slate-300 text-[11px] hidden md:inline font-medium">
              {t.nav.switchRolePrompt}
            </span>
            <div className="inline-flex items-center bg-[#2D1B69]/90 p-0.5 rounded-lg border border-[#4F46E5]/40">
              <button
                id="role-btn-client"
                onClick={() => { setRole('client'); setActiveTab('marketplace'); }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  role === 'client'
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Briefcase className="w-3 h-3" />
                <span>{lang === 'ar' ? 'الرئيس التنفيذي' : 'Client (CEO)'}</span>
              </button>

              <button
                id="role-btn-advisor"
                onClick={() => { setRole('advisor'); setActiveTab('advisorWorkspace'); }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  role === 'advisor'
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <UserCheck className="w-3 h-3" />
                <span>{lang === 'ar' ? 'المستشار التنفيذي' : 'Advisor'}</span>
              </button>

              <button
                id="role-btn-admin"
                onClick={() => { setRole('admin'); setActiveTab('architectureSpec'); }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  role === 'admin'
                    ? 'bg-[#4F46E5] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Cpu className="w-3 h-3" />
                <span>{lang === 'ar' ? 'إدارة المنصة والمواصفات' : 'Platform Specs'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo with exact uploaded ribbon typography */}
          <div className="flex items-center gap-4">
            <button 
              id="brand-logo-btn"
              onClick={() => setActiveTab('marketplace')}
              className="flex items-center gap-3 text-start group focus:outline-none cursor-pointer"
            >
              <MushowrLogo size="md" showArabic={true} />
              <span className="hidden md:inline-flex text-[11px] px-2.5 py-0.5 rounded-full bg-[#EEF0FF] text-[#2D1B69] border border-[#D8E3FB] font-semibold">
                {lang === 'ar' ? 'استشارات B2B' : 'B2B Advisory'}
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F0F3FF] p-1.5 rounded-xl border border-[#D8E3FB]">
            <button
              id="nav-tab-marketplace"
              onClick={() => setActiveTab('marketplace')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'marketplace'
                  ? 'bg-white text-[#2D1B69] shadow-strategic-low border border-[#D8E3FB]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>{t.nav.marketplace}</span>
            </button>

            <button
              id="nav-tab-my-sessions"
              onClick={() => setActiveTab('mySessions')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'mySessions'
                  ? 'bg-white text-[#2D1B69] shadow-strategic-low border border-[#D8E3FB]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>{t.nav.mySessions}</span>
            </button>

            <button
              id="nav-tab-advisor-space"
              onClick={() => { setRole('advisor'); setActiveTab('advisorWorkspace'); }}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'advisorWorkspace'
                  ? 'bg-white text-[#2D1B69] shadow-strategic-low border border-[#D8E3FB]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>{t.nav.advisorWorkspace}</span>
            </button>

            <button
              id="nav-tab-arch-spec"
              onClick={() => setActiveTab('architectureSpec')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'architectureSpec'
                  ? 'bg-white text-[#2D1B69] shadow-strategic-low border border-[#D8E3FB]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>{t.nav.architectureSpec}</span>
            </button>
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2.5">
            
            {/* Google Workspace & Gmail Hub Button */}
            {onOpenWorkspace && (
              <button
                id="workspace-hub-btn"
                onClick={onOpenWorkspace}
                className="p-2 rounded-lg bg-white border border-[#D8E3FB] text-[#2D1B69] hover:bg-[#F0F3FF] hover:border-[#4F46E5]/40 transition-all focus:outline-none cursor-pointer shadow-xs flex items-center gap-1.5"
                title={lang === 'ar' ? 'مركز تنبيهات Gmail وتكامل Google Workspace' : 'Gmail & Google Workspace Center'}
              >
                <Mail className="w-4 h-4 text-[#4F46E5]" />
                <span className="hidden xl:inline text-xs font-semibold text-[#111C2D]">
                  {lang === 'ar' ? 'تنبيهات Gmail' : 'Gmail API'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
              </button>
            )}

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                id="notif-btn"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-lg bg-white border border-[#D8E3FB] text-[#2D1B69] hover:bg-[#F0F3FF] transition-all focus:outline-none cursor-pointer shadow-xs"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#4F46E5] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div 
                  id="notif-dropdown-menu"
                  className={`absolute mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-[#D8E3FB] shadow-strategic-high z-50 p-4 ${
                    lang === 'ar' ? 'left-0 sm:right-auto sm:left-0' : 'right-0 sm:left-auto sm:right-0'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#E7EEFF]">
                    <span className="font-bold text-sm text-[#111C2D] flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#4F46E5]" />
                      {t.nav.notifications}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {unreadCount} {lang === 'ar' ? 'جديد' : 'new'}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 rounded-xl transition-all cursor-pointer border ${
                          n.read 
                            ? 'bg-[#F9F9FF] border-[#E2E8F0] text-slate-600' 
                            : 'bg-[#EEF0FF] border-[#D8E3FB] text-[#111C2D]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-xs text-[#111C2D]">
                            {lang === 'ar' ? n.titleAr : n.titleEn}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {lang === 'ar' ? n.messageAr : n.messageEn}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Language Toggle */}
            <button
              id="lang-toggle-btn"
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-[#D8E3FB] text-xs font-semibold text-[#2D1B69] hover:bg-[#F0F3FF] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Globe className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span>{t.nav.languageSwitch}</span>
            </button>

            {/* User Profile Capsule */}
            <div className="hidden sm:flex items-center gap-2 ps-2 border-s border-[#D8E3FB]">
              <div className={`w-8 h-8 rounded-lg ${currentRoleInfo.bg} flex items-center justify-center text-[11px] font-bold text-white shadow-xs`}>
                {currentRoleInfo.tag}
              </div>
              <div className="text-start">
                <p className="text-xs font-bold text-[#111C2D] leading-tight">
                  {role === 'client' ? (lang === 'ar' ? 'أ. مشعل الدوسري' : 'Mishal Al-Dosari') : role === 'advisor' ? (lang === 'ar' ? 'م. خالد التميمي' : 'Eng. Khalid Al-Tamimi') : (lang === 'ar' ? 'مهندس النظام' : 'Systems Architect')}
                </p>
                <span className="text-[10px] text-[#4F46E5] font-semibold block">
                  {getRoleLabel(role)}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center gap-1 pb-2.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
              activeTab === 'marketplace'
                ? 'bg-[#2D1B69] text-white shadow-xs'
                : 'text-slate-600 bg-[#F0F3FF] hover:bg-[#E7EEFF]'
            }`}
          >
            <Briefcase className="w-3 h-3" />
            <span>{t.nav.marketplace}</span>
          </button>
          <button
            onClick={() => setActiveTab('mySessions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
              activeTab === 'mySessions'
                ? 'bg-[#2D1B69] text-white shadow-xs'
                : 'text-slate-600 bg-[#F0F3FF] hover:bg-[#E7EEFF]'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>{t.nav.mySessions}</span>
          </button>
          <button
            onClick={() => { setRole('advisor'); setActiveTab('advisorWorkspace'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
              activeTab === 'advisorWorkspace'
                ? 'bg-[#2D1B69] text-white shadow-xs'
                : 'text-slate-600 bg-[#F0F3FF] hover:bg-[#E7EEFF]'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            <span>{t.nav.advisorWorkspace}</span>
          </button>
          <button
            onClick={() => setActiveTab('architectureSpec')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
              activeTab === 'architectureSpec'
                ? 'bg-[#2D1B69] text-white shadow-xs'
                : 'text-slate-600 bg-[#F0F3FF] hover:bg-[#E7EEFF]'
            }`}
          >
            <Cpu className="w-3 h-3" />
            <span>{t.nav.architectureSpec}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
