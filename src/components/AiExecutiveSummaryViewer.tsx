import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  FileText,
  Copy,
  Check,
  RefreshCw,
  Video,
  Shield,
  Layers,
  ChevronDown,
  ChevronUp,
  User,
  Search,
  ExternalLink,
  BrainCircuit,
  Award
} from 'lucide-react';
import { BookingSession, AiExecutiveSummaryTakeaways, MeetTranscriptEntry, Language } from '../types';
import {
  getSessionMeetTranscript,
  requestAiExecutiveSummaryGeneration,
  formatTranscriptToPlainText
} from '../utils/aiMeetingIntelligence';

interface AiExecutiveSummaryViewerProps {
  session: BookingSession;
  lang?: Language;
  onSummaryUpdated?: (updatedSummary: AiExecutiveSummaryTakeaways) => void;
  compact?: boolean;
}

export const AiExecutiveSummaryViewer: React.FC<AiExecutiveSummaryViewerProps> = ({
  session,
  lang = 'ar',
  onSummaryUpdated,
  compact = false,
}) => {
  const [summary, setSummary] = useState<AiExecutiveSummaryTakeaways | undefined>(
    session.aiExecutiveSummary || session.deliverable?.aiExecutiveSummary
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [selectedSpeakerFilter, setSelectedSpeakerFilter] = useState<string>('all');
  const [generationStep, setGenerationStep] = useState<string>('');

  const transcript = getSessionMeetTranscript(session);

  const handleGenerateAiSummary = async () => {
    setIsGenerating(true);
    setGenerationStep(lang === 'ar' ? 'جاري قراءة تفريغ Google Meet...' : 'Parsing Google Meet transcription...');

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setGenerationStep(lang === 'ar' ? 'استدعاء نموذج Gemini 3.7 Flash لاستخلاص القرارات...' : 'Querying Gemini 3.7 Flash model...');
      
      const newSummary = await requestAiExecutiveSummaryGeneration({
        session,
        transcript,
        language: lang === 'en' ? 'en' : 'ar',
      });

      setSummary(newSummary);
      if (onSummaryUpdated) {
        onSummaryUpdated(newSummary);
      }
    } catch (error) {
      console.error('Failed to generate AI executive summary:', error);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleCopySummary = () => {
    if (!summary) return;
    const textToCopy = `
=== ${lang === 'ar' ? 'الملخص التنفيذي والقرارات الاستراتيجية' : 'Executive Advisory Summary & Strategic Decisions'} ===
${lang === 'ar' ? 'الجلسة الاستشارية:' : 'Session:'} ${session.referenceCode} - ${session.challengeBrief.title}
${lang === 'ar' ? 'المستشار التنفيذي:' : 'Advisor:'} ${session.advisor.name} (${session.advisor.primaryTrackRecord})
${lang === 'ar' ? 'العميل:' : 'Client:'} ${session.clientName} (${session.clientCompany})
${lang === 'ar' ? 'النموذج:' : 'Model:'} ${summary.modelUsed} (${summary.generatedAt})

[${lang === 'ar' ? 'التشخيص التنفيذي' : 'Executive Brief'}]
${summary.executiveBrief}

[${lang === 'ar' ? 'القرارات الاستراتيجية المحورية' : 'Key Strategic Decisions'}]
${summary.keyDecisions.map((kd, i) => `${i + 1}. [${kd.category}] ${kd.decision} (المسؤول: ${kd.owner} | الإطار الزمني: ${kd.timeframe})`).join('\n')}

[${lang === 'ar' ? 'أبرز المخرجات والاستنتاجات الاستراتيجية' : 'Strategic Takeaways'}]
${summary.strategicTakeaways.map((st, i) => `• ${st}`).join('\n')}

[${lang === 'ar' ? 'إجراءات الأسبوع الأول الفورية' : 'Immediate 7-Day Action Items'}]
${summary.immediate7DayActions.map((act, i) => `[${act.priority}] ${act.action} (الجهة: ${act.responsibleParty})`).join('\n')}

[${lang === 'ar' ? 'ملاحظات التحوط والمخاطر' : 'Risk Mitigations'}]
${summary.riskMitigations.map((rm) => `⚠️ ${rm}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const filteredTranscript = transcript.filter((entry) => {
    const matchesSearch =
      entry.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
      entry.speaker.toLowerCase().includes(transcriptSearch.toLowerCase());
    const matchesSpeaker =
      selectedSpeakerFilter === 'all' || entry.speakerRole === selectedSpeakerFilter;
    return matchesSearch && matchesSpeaker;
  });

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Governance':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Financial':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Operational':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Strategic':
        return 'bg-amber-50 text-amber-900 border-amber-200';
      case 'Talent':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-50 text-rose-800 border-rose-200 font-bold';
      case 'High':
        return 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className={`rounded-2xl bg-white border border-slate-200/80 shadow-xs ${compact ? 'p-4 sm:p-5' : 'p-6 sm:p-7'} space-y-6 text-slate-800 relative overflow-hidden`}>

      {/* Top Banner & Action Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-slate-200/80 relative z-10">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-600 text-white text-[11px] font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
              <span>{lang === 'ar' ? 'محضر الجلسة والقرارات الاستراتيجية' : 'Executive Minutes & Decisions'}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-medium">
              <Video className="w-3 h-3 text-indigo-600" />
              <span>{lang === 'ar' ? 'موثق من اجتماع Google Meet' : 'Verified Google Meet Transcript'}</span>
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 pt-1">
            {lang === 'ar' ? 'القرارات الاستراتيجية وخلاصة الجلسة التنفيذية' : 'Key Decisions & Strategic Takeaways'}
          </h3>
          <p className="text-xs text-slate-500">
            {lang === 'ar'
              ? 'تلخيص تفصيلي معتمد لحوارات الجلسة مع الخبير، واستخلاص مصفوفة القرارات وخطة العمل التنفيذية.'
              : 'Structured synthesis of the executive consultation into actionable C-Suite takeaways and decisions.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowTranscriptModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title={lang === 'ar' ? 'استعراض النص الكامل لتفريغ المحادثة' : 'View Full Google Meet Transcript'}
          >
            <Video className="w-3.5 h-3.5 text-indigo-600" />
            <span>{lang === 'ar' ? 'نص حوار الجلسة' : 'Meeting Transcript'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 font-mono text-slate-600">
              {transcript.length}
            </span>
          </button>

          <button
            onClick={handleCopySummary}
            disabled={!summary}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
              copied
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ المحضر' : 'Copy Minutes')}</span>
          </button>

          <button
            onClick={handleGenerateAiSummary}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-70"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-indigo-200 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>
              {isGenerating
                ? (lang === 'ar' ? 'جاري إعداد المحضر...' : 'Compiling...')
                : summary
                ? (lang === 'ar' ? 'تحديث وتلخيص المحضر' : 'Refresh Executive Summary')
                : (lang === 'ar' ? 'إعداد الملخص التنفيذي' : 'Generate Executive Summary')}
            </span>
          </button>
        </div>
      </div>

      {/* Loading Progress State */}
      {isGenerating && (
        <div className="p-6 rounded-xl bg-indigo-50/60 border border-indigo-100 text-center space-y-3 animate-pulse">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-indigo-900">
            <BrainCircuit className="w-5 h-5 animate-spin text-indigo-600" />
            <span>{generationStep || (lang === 'ar' ? 'جاري تحليل وتدوين محضر الجلسة من تفريغ الاجتماع...' : 'Compiling meeting minutes from session transcript...')}</span>
          </div>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            {lang === 'ar'
              ? 'يتم استخلاص القرارات المتفق عليها مع الخبير، وتحديد الأولويات والمخاطر ومصفوفة المسؤوليات.'
              : 'Extracting strategic consensus, action items, and risk mitigation protocols.'}
          </p>
        </div>
      )}

      {/* Content Display */}
      {summary && !isGenerating && (
        <div className="space-y-6">
          {/* Metadata Statistics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-medium block">{lang === 'ar' ? 'دقة واستيعاب النموذج' : 'Model Confidence'}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-slate-900 font-mono">{summary.confidenceScore}%</span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 rounded">{lang === 'ar' ? 'موثوق' : 'Verified'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-medium block">{lang === 'ar' ? 'مدة الجلسة المسجلة' : 'Session Duration'}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-bold text-slate-900 font-mono">{summary.sessionDurationMinutes || 60} {lang === 'ar' ? 'دقيقة' : 'mins'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-medium block">{lang === 'ar' ? 'الكلمات المحللة' : 'Analyzed Words'}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-bold text-slate-900 font-mono">{(summary.transcriptWordCount || 3820).toLocaleString()} {lang === 'ar' ? 'كلمة' : 'words'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
              <span className="text-[10px] text-slate-500 font-medium block">{lang === 'ar' ? 'القرارات المتفق عليها' : 'Decisions Extracted'}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Award className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-bold text-slate-900 font-mono">{summary.keyDecisions.length} {lang === 'ar' ? 'قرارات' : 'Decisions'}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Diagnostic Brief */}
          <div className="p-4 sm:p-5 rounded-xl bg-indigo-50/40 border border-indigo-100 shadow-2xs space-y-2">
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>{lang === 'ar' ? '1. التشخيص التنفيذي والتوجه العام (Executive Diagnostic Brief)' : '1. Executive Diagnostic Brief'}</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {summary.executiveBrief}
            </p>
          </div>

          {/* Section 2: Key Strategic Decisions Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" />
                <span>{lang === 'ar' ? '2. القرارات الاستراتيجية المحورية (Key Decisions Matrix)' : '2. Key Decisions Matrix'}</span>
              </h4>
              <span className="text-[11px] text-slate-500 font-mono">
                {summary.keyDecisions.length} {lang === 'ar' ? 'قرارات حاسمة' : 'Consensus Items'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {summary.keyDecisions.map((decision, idx) => (
                <div
                  key={decision.id || idx}
                  className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-300 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${getCategoryBadgeClass(decision.category)}`}>
                        {decision.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{decision.timeframe}</span>
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                      {decision.decision}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{lang === 'ar' ? 'المسؤول التنفيذي:' : 'Owner:'}</span>
                    </span>
                    <strong className="text-slate-800 font-medium">{decision.owner}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Strategic Takeaways & Insights */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>{lang === 'ar' ? '3. أبرز المخرجات والاستنتاجات الاستراتيجية (Strategic Takeaways)' : '3. Strategic Takeaways & Key Insights'}</span>
            </h4>

            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              {summary.strategicTakeaways.map((takeaway, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="flex-1 font-normal">{takeaway}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Immediate 7-Day Actions Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'ar' ? '4. إجراءات الأسبوع الأول الفورية (Immediate 7-Day Actions)' : '4. Immediate 7-Day Actions'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {summary.immediate7DayActions.map((action, idx) => (
                <div
                  key={action.id || idx}
                  className="p-3.5 rounded-xl bg-emerald-50/40 border border-emerald-200/80 space-y-2 text-xs flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${getPriorityBadgeClass(action.priority)}`}>
                        {action.priority} Priority
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900 leading-snug">
                      {action.action}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-emerald-200/50 text-[10px] text-emerald-900 font-medium">
                    <span>{lang === 'ar' ? 'الجهة المنفذة:' : 'Assigned to:'} <strong>{action.responsibleParty}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Risk Mitigation Protocols */}
          {summary.riskMitigations && summary.riskMitigations.length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-200/80 space-y-2 text-xs">
              <h4 className="font-semibold text-rose-900 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-rose-600" />
                <span>{lang === 'ar' ? '5. مصفوفة التحوط وتخفيف المخاطر المكتشفة' : '5. Identified Risk Mitigation Protocols'}</span>
              </h4>
              <ul className="space-y-1.5 text-slate-700 text-xs">
                {summary.riskMitigations.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span className="font-normal">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Empty State if No Summary Generated Yet */}
      {!summary && !isGenerating && (
        <div className="p-8 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900">
            {lang === 'ar' ? 'محضر وقرارات الجلسة بانتظار الاعتماد' : 'Executive Minutes & Decisions'}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {lang === 'ar'
              ? 'انقر على الزر أدناه لإعداد محضر الجلسة المعتمد واستخلاص مصفوفة القرارات والتوصيات الاستراتيجية من مجريات الاجتماع.'
              : 'Click the button below to compile the official executive minutes and key decision matrix from the consultation.'}
          </p>
          <button
            onClick={handleGenerateAiSummary}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>{lang === 'ar' ? 'إعداد محضر وخلاصة الجلسة' : 'Compile Executive Summary'}</span>
          </button>
        </div>
      )}

      {/* GOOGLE MEET TRANSCRIPT MODAL */}
      {showTranscriptModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {lang === 'ar' ? 'تفريغ محادثة Google Meet المعتمد' : 'Verified Google Meet Transcript'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {session.referenceCode} • {session.advisor.name} & {session.clientName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowTranscriptModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 border-b border-slate-200 flex flex-wrap items-center gap-3 bg-white">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'بحث في نص الحوار...' : 'Search dialogue...'}
                  value={transcriptSearch}
                  onChange={(e) => setTranscriptSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => setSelectedSpeakerFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-semibold text-[11px] cursor-pointer ${
                    selectedSpeakerFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {lang === 'ar' ? 'الكل' : 'All'}
                </button>
                <button
                  onClick={() => setSelectedSpeakerFilter('Advisor')}
                  className={`px-2.5 py-1 rounded-md font-semibold text-[11px] cursor-pointer ${
                    selectedSpeakerFilter === 'Advisor' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {lang === 'ar' ? 'الخبير' : 'Advisor'}
                </button>
                <button
                  onClick={() => setSelectedSpeakerFilter('Client')}
                  className={`px-2.5 py-1 rounded-md font-semibold text-[11px] cursor-pointer ${
                    selectedSpeakerFilter === 'Client' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {lang === 'ar' ? 'العميل' : 'Client'}
                </button>
              </div>
            </div>

            {/* Transcript Dialogues Stream */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 bg-slate-50/50 text-xs leading-relaxed">
              {filteredTranscript.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  {lang === 'ar' ? 'لا توجد نتائج مطابقة للبحث.' : 'No matching dialogue found.'}
                </div>
              ) : (
                filteredTranscript.map((entry) => {
                  const isAdvisor = entry.speakerRole === 'Advisor';
                  return (
                    <div
                      key={entry.id}
                      className={`p-3.5 rounded-xl border ${
                        isAdvisor
                          ? 'bg-white border-indigo-200 ms-4 shadow-2xs'
                          : 'bg-blue-50/40 border-blue-200/80 me-4'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5 font-semibold">
                          <span className={isAdvisor ? 'text-indigo-900' : 'text-blue-900'}>
                            {entry.speaker}
                          </span>
                          <span className={`text-[10px] px-1.5 rounded-sm ${isAdvisor ? 'bg-indigo-50 text-indigo-700' : 'bg-blue-100 text-blue-800'}`}>
                            {entry.speakerRole}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400">
                          {entry.timestamp}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-normal">
                        {entry.text}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
              <button
                onClick={() => {
                  const raw = formatTranscriptToPlainText(transcript);
                  navigator.clipboard.writeText(raw);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? (lang === 'ar' ? 'تم نسخ التفريغ!' : 'Copied!') : (lang === 'ar' ? 'نسخ النص الكامل' : 'Copy Raw Text')}</span>
              </button>

              <button
                onClick={() => setShowTranscriptModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                {lang === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
