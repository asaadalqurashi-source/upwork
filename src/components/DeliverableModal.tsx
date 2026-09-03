import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Plus, 
  Trash2,
  DollarSign,
  ArrowLeft,
  ArrowRight,
  Stamp
} from 'lucide-react';
import { BookingSession, Language, PostSessionDeliverable, StrategicRecommendation, CriticalRisk } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface DeliverableModalProps {
  session: BookingSession | null;
  lang: Language;
  onClose: () => void;
  onSubmitDeliverable: (sessionId: string, deliverable: PostSessionDeliverable) => void;
}

export const DeliverableModal: React.FC<DeliverableModalProps> = ({
  session,
  lang,
  onClose,
  onSubmitDeliverable
}) => {
  if (!session) return null;
  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'ar';

  const [execSummary, setExecSummary] = useState(
    'بناءً على جلسة التشخيص الاستراتيجي ومراجعة عقود النقل ومراكز التوزيع، يتبيّن أن كلفة الميل الأخير ناتجة عن التكرار الجغرافي وعدم تفعيل مراكز فرز فرعية ذكية. نوصي بالتحول الفوري إلى نموذج النقل الهجين مع دمج أتمتة مسارات النقل.'
  );

  const [recs, setRecs] = useState<StrategicRecommendation[]>([
    {
      id: 'rec-1',
      title: 'إعادة توزيع مسارات النقل وتفعيل 3 مراكز فرز سريعة (Micro-Hubs)',
      impact: 'Transformational',
      description: 'إنشاء مراكز فرز مصغرة في أطراف المدن الرئيسية لتقليص زمن الشاحنات الكبيرة داخل المناطق السكنية.',
      actionableSteps: [
        'تأجير مراكز تخزين سريعة مرنة بعقود قصيرة الأجل',
        'ربط نظام إدارة النقل (TMS) بنقاط التوزيع الفرعية'
      ]
    },
    {
      id: 'rec-2',
      title: 'إعادة التفاوض على عقود التوريد وتطبيق مؤشر الكلفة الديناميكية للوقود',
      impact: 'High',
      description: 'حماية هوامش الربح عبر إدراج بنود مرونة أسعار الطاقة في عقود كبار العملاء.',
      actionableSteps: [
        'تحديث اتفاقيات مستوى الخدمة (SLAs)',
        'إطلاق منصة تتبع لحظي لأسعار النقل'
      ]
    }
  ]);

  const [risks, setRisks] = useState<CriticalRisk[]>([
    {
      id: 'rsk-1',
      risk: 'مقاومة التغيير من السائقين ومشغلي الأسطول عند تطبيق نظام التتبع الذكي',
      severity: 'High',
      mitigation: 'ربط الحوافز المالية الشهرية بمعدل الكفاءة وتوفير الوقود بدلاً من الجزاءات.'
    },
    {
      id: 'rsk-2',
      risk: 'تأخر توريد أجهزة التتبع والفرز الآلي من الموردين الخارجيين',
      severity: 'Moderate',
      mitigation: 'التعاقد مع موردين محليين معتمدين ووضع شروط جزائية واضحة للالتزام بالجدول الزمني.'
    }
  ]);

  const [phase1Items, setPhase1Items] = useState([
    'تحديد مواقع مراكز الفرز الثلاثة وتوقيع مذكرات التفاهم الأولية',
    'إجراء تدقيق كامل لكفاءة مسارات الأسطول الحالية وحساب الفاقد'
  ]);
  const [phase2Items, setPhase2Items] = useState([
    'إطلاق المنظومة الرقمية لإدارة النقل (TMS) في مركز الرياض',
    'بدء تشغيل المراكز الفرعية وخفض زمن الرحلات بنسبة 20%'
  ]);
  const [phase3Items, setPhase3Items] = useState([
    'التقييم الشامل للنتائج المالية وتوثيق وفورات التكلفة في تقرير مجلس الإدارة',
    'توسيع التجربة لتشمل كافة فروع المنطقة الغربية والشرقية'
  ]);

  const [advisorStamp, setAdvisorStamp] = useState(`${session.advisor.name} - مستشار تنفيذي معتمد #MSH-ADV-${session.advisor.primaryTrackRecord}`);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddRec = () => {
    setRecs(prev => [
      ...prev,
      {
        id: `rec-${Date.now()}`,
        title: lang === 'ar' ? 'مبادرة استراتيجية جديدة' : 'New Strategic Initiative',
        impact: 'High',
        description: '',
        actionableSteps: [lang === 'ar' ? 'الخطوة الأولى للتنفيذ' : 'First execution step']
      }
    ]);
  };

  const handleRemoveRec = (id: string) => {
    setRecs(prev => prev.filter(r => r.id !== id));
  };

  const handleAddRisk = () => {
    setRisks(prev => [
      ...prev,
      {
        id: `rsk-${Date.now()}`,
        risk: lang === 'ar' ? 'خطر تشغيلي محتمل' : 'Potential Operational Risk',
        severity: 'High',
        mitigation: lang === 'ar' ? 'خطة التحوط الموصى بها' : 'Recommended Mitigation Plan'
      }
    ]);
  };

  const handleRemoveRisk = (id: string) => {
    setRisks(prev => prev.filter(r => r.id !== id));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const deliverable: PostSessionDeliverable = {
        id: `del-${Date.now()}`,
        sessionId: session.id,
        submittedAt: new Date().toISOString(),
        advisorId: session.advisorId,
        advisorName: session.advisor.name,
        executiveSummary: execSummary,
        strategicRecommendations: recs,
        criticalRisks: risks,
        roadmap90Days: {
          phase1_30d: { title: lang === 'ar' ? 'المرحلة الأولى (1 - 30 يوماً): التأسيس والضبط' : 'Phase 1 (1 - 30 Days): Foundation', items: phase1Items },
          phase2_60d: { title: lang === 'ar' ? 'المرحلة الثانية (31 - 60 يوماً): الهيكلة والتنفيذ' : 'Phase 2 (31 - 60 Days): Execution', items: phase2Items },
          phase3_90d: { title: lang === 'ar' ? 'المرحلة الثالثة (61 - 90 يوماً): الأثر والتمكين' : 'Phase 3 (61 - 90 Days): Scale & Moat', items: phase3Items }
        },
        advisorSignatureStamp: advisorStamp,
        escrowReleased: true,
        releasedAmountSAR: session.feeSAR,
        releaseTxHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`
      };

      onSubmitDeliverable(session.id, deliverable);
      setIsSubmitting(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="deliverable-builder-modal"
        className="relative w-full max-w-4xl rounded-2xl bg-white border border-slate-200/80 shadow-2xl overflow-hidden text-slate-800 my-auto flex flex-col max-h-[92vh]"
      >
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-400/30 text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {t.deliverableModal.title}
              </h2>
              <p className="text-xs text-indigo-300 font-medium">
                {session.referenceCode} • {session.clientName} ({session.clientCompany})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Escrow Release Notice Banner */}
        <div className="bg-indigo-50/70 px-6 py-3 border-b border-indigo-100 flex items-center justify-between text-slate-800">
          <span className="text-xs text-indigo-900 font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>{t.deliverableModal.subtitle}</span>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            {session.feeSAR.toLocaleString()} SAR {lang === 'ar' ? 'مستحق الصرف فوراً' : 'Payout Ready'}
          </span>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* 1. Executive Summary */}
          <div>
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              {t.deliverableModal.execSummaryLabel}
            </label>
            <textarea
              rows={3}
              value={execSummary}
              onChange={(e) => setExecSummary(e.target.value)}
              placeholder={t.deliverableModal.execSummaryPlaceholder}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-indigo-600 focus:bg-white leading-relaxed"
            />
          </div>

          {/* 2. Strategic Recommendations */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                {t.deliverableModal.strategicRecsLabel}
              </label>
              <button
                onClick={handleAddRec}
                className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.deliverableModal.addRecBtn}</span>
              </button>
            </div>

            <div className="space-y-3">
              {recs.map((rec, index) => (
                <div key={rec.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                        {lang === 'ar' ? `المبادرة #${index + 1}` : `Initiative #${index + 1}`}
                      </span>
                      <input
                        type="text"
                        value={rec.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRecs(prev => prev.map(r => r.id === rec.id ? { ...r, title: val } : r));
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                      />
                    </div>

                    <div className="w-36 shrink-0">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                        {t.deliverableModal.recImpactLabel}
                      </span>
                      <select
                        value={rec.impact}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setRecs(prev => prev.map(r => r.id === rec.id ? { ...r, impact: val } : r));
                        }}
                        className="w-full px-2.5 py-2 rounded-lg bg-white border border-slate-200 text-xs text-indigo-700 font-semibold focus:outline-none"
                      >
                        <option value="Transformational">Transformational (تحولي)</option>
                        <option value="High">High Impact (عالي الأثر)</option>
                        <option value="Medium">Medium Impact (متوسط)</option>
                      </select>
                    </div>

                    {recs.length > 1 && (
                      <button
                        onClick={() => handleRemoveRec(rec.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 mt-5 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      value={rec.description}
                      onChange={(e) => {
                        const val = e.target.value;
                        setRecs(prev => prev.map(r => r.id === rec.id ? { ...r, description: val } : r));
                      }}
                      placeholder={t.deliverableModal.recDescLabel}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Critical Risks Matrix */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                {t.deliverableModal.criticalRisksLabel}
              </label>
              <button
                onClick={handleAddRisk}
                className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold border border-rose-200 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.deliverableModal.addRiskBtn}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {risks.map((risk) => (
                <div key={risk.id} className="p-3.5 rounded-xl bg-rose-50/40 border border-rose-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-800 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>{risk.severity} Risk</span>
                    </span>
                    {risks.length > 1 && (
                      <button onClick={() => handleRemoveRisk(risk.id)} className="text-slate-400 hover:text-rose-600 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={risk.risk}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRisks(prev => prev.map(r => r.id === risk.id ? { ...r, risk: val } : r));
                    }}
                    placeholder={t.deliverableModal.riskNameLabel}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-xs text-slate-900 font-medium"
                  />
                  <input
                    type="text"
                    value={risk.mitigation}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRisks(prev => prev.map(r => r.id === risk.id ? { ...r, mitigation: val } : r));
                    }}
                    placeholder={t.deliverableModal.riskMitigationLabel}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-emerald-800 font-medium"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 4. 90-Day Execution Roadmap */}
          <div>
            <label className="block text-xs font-bold text-indigo-900 uppercase tracking-wider mb-3">
              {t.deliverableModal.roadmapLabel}
            </label>

            <div className="space-y-3">
              {/* Phase 1 */}
              <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200 text-xs space-y-2">
                <span className="font-bold text-indigo-950 block">{t.deliverableModal.phase1}</span>
                {phase1Items.map((item, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPhase1Items(prev => prev.map((it, i) => i === idx ? val : it));
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-xs text-slate-800"
                  />
                ))}
              </div>

              {/* Phase 2 */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs space-y-2">
                <span className="font-bold text-blue-950 block">{t.deliverableModal.phase2}</span>
                {phase2Items.map((item, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPhase2Items(prev => prev.map((it, i) => i === idx ? val : it));
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-xs text-slate-800"
                  />
                ))}
              </div>

              {/* Phase 3 */}
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2">
                <span className="font-bold text-emerald-950 block">{t.deliverableModal.phase3}</span>
                {phase3Items.map((item, idx) => (
                  <input
                    key={idx}
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPhase3Items(prev => prev.map((it, i) => i === idx ? val : it));
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-xs text-slate-800"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 5. Advisor Stamp Signature */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500 font-medium block">{t.deliverableModal.advisorSignStamp}</span>
              <p className="text-slate-900 font-bold text-sm mt-0.5">{advisorStamp}</p>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-mono font-bold flex items-center gap-1.5">
              <Stamp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Certified Digital Stamp</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-300 transition-colors cursor-pointer"
          >
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>

          <button
            id="submit-deliverable-btn"
            onClick={handleSubmit}
            disabled={isSubmitting || !execSummary}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{lang === 'ar' ? 'جارٍ تسليم التقرير والإفراج عن مستحقات الضمان...' : 'Submitting & Releasing Escrow...'}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>{t.deliverableModal.submitAndReleaseFunds} ({session.feeSAR.toLocaleString()} SAR)</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
