import React, { useState } from 'react';
import { 
  Cpu, 
  Database, 
  Layers, 
  ShieldCheck, 
  Code, 
  Server, 
  Lock, 
  Calendar, 
  Video, 
  FileText, 
  DollarSign, 
  Copy, 
  Check, 
  Terminal,
  Activity,
  ArrowRight,
  Sparkles,
  Key
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ArchitectureSpecProps {
  lang: Language;
}

export const ArchitectureSpec: React.FC<ArchitectureSpecProps> = ({ lang }) => {
  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'ar';
  const [activeTab, setActiveTab] = useState<'overview' | 'schema' | 'api' | 'escrow' | 'nda'>('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(key);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sqlSchema = `-- ============================================================================
-- PLATFORM SCHEMA DEFINITION: MUSHOWR (مشور) B2B EXECUTIVE ADVISORY
-- PostgreSQL / Cloud SQL Relational Architecture
-- ============================================================================

-- 1. USERS & ROLES
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    role VARCHAR(32) NOT NULL CHECK (role IN ('CLIENT_CEO', 'ADVISOR_EXEC', 'PLATFORM_ADMIN')),
    organization_name VARCHAR(255),
    organization_cr VARCHAR(64), -- Commercial Registration
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. EXECUTIVE ADVISORS PROFILE
CREATE TABLE advisors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    headline_ar VARCHAR(255) NOT NULL,
    headline_en VARCHAR(255) NOT NULL,
    primary_csuite_role VARCHAR(32) NOT NULL, -- 'CEO', 'COO', 'CFO', 'CTO', etc.
    primary_track_record VARCHAR(64) NOT NULL, -- 'SABIC', 'Aramco', 'STC', 'PIF'
    sectors TEXT[] NOT NULL,
    bio_ar TEXT NOT NULL,
    bio_en TEXT NOT NULL,
    experience_years INT NOT NULL,
    hourly_rate_sar NUMERIC(10, 2) NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    video_pitch_url TEXT,
    google_calendar_token TEXT,
    microsoft_graph_token TEXT,
    buffer_minutes INT DEFAULT 30,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CHALLENGE BRIEFS & DOCUMENT VAULT
CREATE TABLE challenge_briefs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    industry_sector VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    urgency_level VARCHAR(32) NOT NULL, -- 'IMMEDIATE', 'THIS_MONTH', 'STRATEGIC_REVIEW'
    strategic_goals TEXT NOT NULL,
    budget_cap_sar NUMERIC(10, 2),
    encrypted_file_urls JSONB, -- Stored with AES-256 KMS encryption
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. B2B MUTUAL NON-DISCLOSURE AGREEMENTS (NDA)
CREATE TABLE nda_agreements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agreement_code VARCHAR(64) UNIQUE NOT NULL, -- e.g. MSH-NDA-2026-9421
    client_id UUID REFERENCES users(id),
    advisor_id UUID REFERENCES advisors(id),
    client_signature_stamp TEXT NOT NULL,
    client_signed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    advisor_signature_stamp TEXT NOT NULL,
    advisor_signed_at TIMESTAMP WITH TIME ZONE,
    sha256_audit_hash VARCHAR(64) NOT NULL,
    status VARCHAR(32) DEFAULT 'FULLY_EXECUTED',
    governing_jurisdiction VARCHAR(128) DEFAULT 'Kingdom of Saudi Arabia',
    non_circumvention_period_months INT DEFAULT 24
);

-- 5. ADVISORY BOOKING SESSIONS & MEET PROVISIONING
CREATE TABLE booking_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code VARCHAR(64) UNIQUE NOT NULL, -- MSH-SES-XXXX
    advisor_id UUID REFERENCES advisors(id),
    client_id UUID REFERENCES users(id),
    brief_id UUID REFERENCES challenge_briefs(id),
    nda_id UUID REFERENCES nda_agreements(id),
    scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,
    timezone VARCHAR(64) DEFAULT 'Asia/Riyadh',
    status VARCHAR(32) NOT NULL CHECK (status IN ('PENDING_APPROVAL', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    google_meet_link VARCHAR(255) NOT NULL,
    google_calendar_event_id VARCHAR(255),
    ics_file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. ESCROW LEDGER & REVENUE RECOGNITION
CREATE TABLE escrow_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES booking_sessions(id),
    client_id UUID REFERENCES users(id),
    advisor_id UUID REFERENCES advisors(id),
    advisory_fee_sar NUMERIC(10, 2) NOT NULL,
    platform_fee_sar NUMERIC(10, 2) NOT NULL,
    vat_sar NUMERIC(10, 2) NOT NULL,
    total_charged_sar NUMERIC(10, 2) NOT NULL,
    escrow_status VARCHAR(32) NOT NULL CHECK (escrow_status IN ('HELD_IN_ESCROW', 'RELEASED_TO_ADVISOR', 'REFUNDED_TO_CLIENT')),
    hold_tx_hash VARCHAR(128) NOT NULL,
    release_tx_hash VARCHAR(128),
    released_at TIMESTAMP WITH TIME ZONE
);

-- 7. POST-SESSION DELIVERABLES (90-DAY STRATEGIC ROADMAP)
CREATE TABLE deliverable_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES booking_sessions(id) UNIQUE,
    advisor_id UUID REFERENCES advisors(id),
    executive_summary TEXT NOT NULL,
    strategic_initiatives JSONB NOT NULL,
    critical_risks_matrix JSONB NOT NULL,
    roadmap_90_days JSONB NOT NULL,
    advisor_digital_seal TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. AUDIT LOGS & WEBHOOK NOTIFICATION QUEUE
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(64) NOT NULL,
    entity_id UUID NOT NULL,
    action VARCHAR(64) NOT NULL,
    actor_id UUID REFERENCES users(id),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`;

  const meetApiCode = `// ============================================================================
// MICROSERVICE: GOOGLE MEET PROVISIONING & ICS DISPATCH PIPELINE
// Express + Google Workspace Calendar API Integration
// ============================================================================

import { google } from 'googleapis';
import crypto from 'crypto';

interface ProvisionMeetParams {
  referenceCode: string;
  clientEmail: string;
  advisorEmail: string;
  startTimeIso: string;
  endTimeIso: string;
  challengeTitle: string;
  ndaNumber: string;
}

export async function provisionGoogleMeetAndCalendar(params: ProvisionMeetParams) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  
  // Set service account or advisor OAuth tokens
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_SERVICE_REFRESH_TOKEN });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const conferenceRequestId = \`msh-\${crypto.randomBytes(6).toString('hex')}\`;

  // 1. Create Calendar Event with automated Google Meet video room
  const event = await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    requestBody: {
      summary: \`مشور: جلسة استشارية تنفيذية - \${params.challengeTitle}\`,
      description: \`منصة مشور (Mushowr B2B Advisory)\\nالرقم المرجعي: \${params.referenceCode}\\nاتفاقية NDA: \${params.ndaNumber}\\nملخص التحدي مرفق بالدعوة.\`,
      start: { dateTime: params.startTimeIso, timeZone: 'Asia/Riyadh' },
      end: { dateTime: params.endTimeIso, timeZone: 'Asia/Riyadh' },
      attendees: [
        { email: params.clientEmail, responseStatus: 'accepted' },
        { email: params.advisorEmail, responseStatus: 'accepted' }
      ],
      conferenceData: {
        createRequest: {
          requestId: conferenceRequestId,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 24 Hours before
          { method: 'popup', minutes: 60 },      // 1 Hour before
          { method: 'popup', minutes: 10 }       // 10 Minutes before
        ]
      }
    }
  });

  const meetLink = event.data.hangoutLink || event.data.conferenceData?.entryPoints?.[0]?.uri;

  return {
    eventId: event.data.id,
    meetLink: meetLink,
    iCalUID: event.data.iCalUID
  };
}`;

  const ndaLegalTemplate = `اتفاقية عدم إفصاح وحماية سرية المعلومات المتبادلة (B2B Mutual Non-Disclosure Agreement)

الرقم المرجعي الموحد: MSH-NDA-2026-SA
المنصة الحاضنة والضامنة: منصة "مشور" للاستشارات التنفيذية (Mushowr B2B)

تم إبرام هذه الاتفاقية في المملكة العربية السعودية بين كل من:

الطرف الأول (العميل):
المنشأة التجارية / صاحب العمل، ويمثلها قانونياً الرئيس التنفيذي أو المفوض بالتوقيع.

الطرف الثاني (المستشار التنفيذي):
الخبير التنفيذي المعتمد في منصة مشور (عضو مجلس إدارة / قيادي تنفيذي سابق Ex-C Suite).

التمهيد:
حيث يرغب الطرف الأول في إطلاع الطرف الثاني على تحديات استراتيجية وبيانات تشغيلية ونماذج مالية حساسة لغرض تقديم استشارة تنفيذية، وحيث يوافق الطرف الثاني على الالتزام التام بسرية كافة المعلومات المتبادلة، فقد اتفق الطرفان على البنود الآتية:

البند الأول: تعريف المعلومات السرية
تشمل المعلومات السرية كافة الوثائق والبيانات المرفوعة في مستودع المنصة (Document Vault)، الخطط المستقبلية، البيانات المالية، دراسات الجدوى، وأي نقاش يدور أثناء جلسة الاستشارة المرئية عبر Google Meet.

البند الثاني: التزامات عدم الإفصاح
1. يتعهد الطرف الثاني بعدم الإفصاح عن أي جزء من المعلومات السرية لأي شخص أو كيان خارجي دون موافقة خطية صريحة.
2. استخدام المعلومات السرية حصراً لغرض صياغة تقرير التوصيات التنفيذي وخارطة طريق الـ 90 يوماً.

البند الثالث: عدم الالتفاف والمنافسة (Non-Circumvention)
يتعهد الطرف الثاني بعدم استغلال أي معلومات تجارية أو فرص استثمارية تم الاطلاع عليها لتحقيق منفعة شخصية مباشرة أو لصالح أطراف منافسة لمدة 24 شهراً من تاريخ التوقيع.

البند الرابع: التوقيع الرقمي وحساب الضمان
تعتبر هذه الاتفاقية نافذة فورياً بالتوقيع الإلكتروني للطرفين وتوليد بصمة التشفير الرقمية (SHA-256 Audit Hash)، وتُحفظ مستحقات الجلسة في حساب الضمان (Escrow) التابع للمنصة ولا تُحوّل إلا بعد إنجاز مخرجات الاستشارة.

البند الخامس: النظام الواجب التطبيق والاختصاص القضائي
تخضع هذه الاتفاقية وتُفسر وفقاً للأنظمة واللوائح القضائية والتجارية المعمول بها في المملكة العربية السعودية.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Principal Systems Architect & Lead Product Designer Specification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {t.architecture.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {t.architecture.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" />
            <span>Architecture Status: Active & Validated</span>
          </span>
        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t.architecture.tabs.systemOverview}</span>
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'schema'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>{t.architecture.tabs.databaseERD}</span>
        </button>

        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'api'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>{t.architecture.tabs.calendarMeetWorkflow}</span>
        </button>

        <button
          onClick={() => setActiveTab('escrow')}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'escrow'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{t.architecture.tabs.escrowGovernance}</span>
        </button>

        <button
          onClick={() => setActiveTab('nda')}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'nda'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t.architecture.tabs.ndaTemplate}</span>
        </button>
      </div>

      {/* TAB 1: SYSTEM OVERVIEW ARCHITECTURE DIAGRAM */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              <span>{lang === 'ar' ? 'المخطط الهيكلي لمنظومة مشور (End-to-End System Layers)' : 'Mushowr End-to-End Architectural Topology'}</span>
            </h3>

            {/* Architecture Visual Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Layer 1: Client & Advisor Portal */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Layer 1: Frontend Clients</span>
                <h4 className="text-sm font-bold text-slate-900">B2B Portal & Dashboards</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>CEO Challenge Search & AI Match</li>
                  <li>Advisor Video Elevator Pitch (30s)</li>
                  <li>E-Sign NDA & Doc Vault Dropzone</li>
                  <li>Advisor 90-Day Deliverables Engine</li>
                </ul>
              </div>

              {/* Layer 2: API Gateway & Gemini AI */}
              <div className="p-5 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-3">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Layer 2: AI & Core API</span>
                <h4 className="text-sm font-bold text-slate-900">Gemini Matching & Routing</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Natural Language Semantic Match</li>
                  <li>Role-Based Access Control (RBAC)</li>
                  <li>AES-256 KMS Document Encryption</li>
                  <li>Audit Logging & SHA-256 Hashing</li>
                </ul>
              </div>

              {/* Layer 3: Integrations & Provisioning */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Layer 3: Workspace Integrations</span>
                <h4 className="text-sm font-bold text-slate-900">Google Meet & Graph Sync</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Google Calendar & Meet Provisioning</li>
                  <li>Microsoft Graph 2-Way Calendar Sync</li>
                  <li>Automated .ICS Invite Dispatch</li>
                  <li>Trigger Reminders: 24h, 1h, 10m</li>
                </ul>
              </div>

              {/* Layer 4: Escrow & Governance */}
              <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Layer 4: Financial Governance</span>
                <h4 className="text-sm font-bold text-slate-900">Escrow Trust Engine</h4>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Corporate Funds Hold Gateway</li>
                  <li>Deliverable Verification Trigger</li>
                  <li>Instant Bank Payout Release</li>
                  <li>Saudi VAT 15% & Invoice Ledger</li>
                </ul>
              </div>

            </div>

            {/* Architecture Metrics Table */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <h4 className="font-bold text-slate-900 mb-2">{lang === 'ar' ? 'مواصفات الأمان والأداء للمنشآت (Enterprise SLA & Security)' : 'Enterprise Security & SLA Specifications'}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-600">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <p className="text-slate-500 text-[10px]">Data Encryption</p>
                  <p className="font-semibold text-slate-900 mt-0.5">AES-256 at rest, TLS 1.3 in transit</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <p className="text-slate-500 text-[10px]">Jurisdiction Compliance</p>
                  <p className="font-semibold text-slate-900 mt-0.5">Saudi Commercial Law & PDPL Ready</p>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <p className="text-slate-500 text-[10px]">Escrow Release Latency</p>
                  <p className="font-semibold text-emerald-700 mt-0.5">&lt; 2.5s Automated Webhook Payout</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: DATABASE ERD & SQL SCHEMA */}
      {activeTab === 'schema' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                <span>PostgreSQL / Cloud SQL Relational Schema (8 Core Entities)</span>
              </h3>
              <button
                onClick={() => handleCopy('schema', sqlSchema)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {copiedCode === 'schema' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'schema' ? 'Copied SQL!' : 'Copy SQL DDL'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[550px]">
              <code>{sqlSchema}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: CALENDAR & MEET PROVISIONING ENGINE */}
      {activeTab === 'api' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Video className="w-5 h-5 text-indigo-600" />
                <span>Google Meet & Calendar API Provisioning Service</span>
              </h3>
              <button
                onClick={() => handleCopy('meet', meetApiCode)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {copiedCode === 'meet' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'meet' ? 'Copied Code!' : 'Copy Integration Code'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'ar'
                ? 'يقوم هذا المحرك بإنشاء رابط Google Meet مشفر وفريد لكل جلسة استشارية فور تأكيد الحجز، وتوليد ملف الدعوة .ics وإرفاق اتفاقية السرية وملخص التحدي تلقائياً.'
                : 'This service generates a unique Google Meet room per executive session upon escrow authorization, dispatching .ics calendar invites with embedded NDA and challenge brief context.'}
            </p>

            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-200 overflow-x-auto leading-relaxed max-h-[450px]">
              <code>{meetApiCode}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: ESCROW STATE MACHINE & GOVERNANCE */}
      {activeTab === 'escrow' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>{lang === 'ar' ? 'حوكمة الضمان المالي وآلية الصرف التلقائي (Escrow Lifecycle)' : 'Corporate Escrow State Machine'}</span>
            </h3>

            {/* Step-by-step state machine */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">1</span>
                <h4 className="font-bold text-slate-900">Authorization & Hold</h4>
                <p className="text-slate-600">Client authorizes corporate funds during booking. 100% of the session fee is frozen in Mushowr Escrow.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">2</span>
                <h4 className="font-bold text-slate-900">NDA & Meet Execution</h4>
                <p className="text-slate-600">Session proceeds securely on Google Meet under active SHA-256 hashed Non-Disclosure Agreement.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">3</span>
                <h4 className="font-bold text-slate-900">Deliverable Submission</h4>
                <p className="text-slate-600">Advisor completes and submits the 90-Day Action Roadmap & Executive Summary within 24 hours.</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">4</span>
                <h4 className="font-bold text-emerald-900">Automated Release</h4>
                <p className="text-slate-600">Webhook triggers instant bank disbursement to advisor, generating corporate tax receipt and ledger entry.</p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 5: B2B NDA LEGAL TEMPLATE */}
      {activeTab === 'nda' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>{lang === 'ar' ? 'صيغة اتفاقية السرية المعتمدة وفق الأنظمة السعودية' : 'Official Saudi B2B Mutual NDA Agreement Template'}</span>
              </h3>
              <button
                onClick={() => handleCopy('nda', ndaLegalTemplate)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {copiedCode === 'nda' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'nda' ? 'Copied Template!' : 'Copy NDA Text'}</span>
              </button>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto">
              {ndaLegalTemplate}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
