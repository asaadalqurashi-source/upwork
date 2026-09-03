import { Advisor, BookingSession, SystemNotification } from '../types';

export interface PresetChallengeTemplate {
  id: string;
  functionCategory: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  strategicGoalAr: string;
  strategicGoalEn: string;
  industry: string;
}

export const PRESET_CHALLENGE_TEMPLATES: PresetChallengeTemplate[] = [
  {
    id: 'tpl-coo-01',
    functionCategory: 'COO',
    titleAr: 'إعادة هيكلة شبكة التوزيع الإقليمي وخفض كلفة الميل الأخير',
    titleEn: 'Regional Distribution Restructuring & Last-Mile Cost Reduction',
    descriptionAr: 'نواجه ارتفاعاً متزايداً في تكاليف الشحن والميل الأخير بين فروعنا في الرياض وجدة والدمام، مع تأخيرات في أوقات التسليم بالمستودعات المركزية. نحتاج لتشخيص تنفيذي لتصميم مراكز فرز هجينة وضبط كلفة الطن/الميل.',
    descriptionEn: 'Experiencing rising last-mile logistics costs and warehouse dispatch bottlenecks between Riyadh, Jeddah, and Dammam. Seeking executive diagnosis to restructure fulfillment hubs and optimize cost per ton/mile.',
    strategicGoalAr: 'خفض تكلفة النقل التشغيلية بنسبة 18% وتحسين نسبة الالتزام بمواعيد التسليم إلى 98% خلال 90 يوماً.',
    strategicGoalEn: 'Reduce operational transport overhead by 18% and improve on-time delivery compliance to 98% within 90 days.',
    industry: 'Logistics & Supply Chain'
  },
  {
    id: 'tpl-cfo-01',
    functionCategory: 'CFO',
    titleAr: 'تقييم جاهزية الحوكمة المالية قبل جولة استثمارية أو الطرح (IPO Readiness)',
    titleEn: 'Financial Governance Readiness Assessment Pre-IPO / Funding Round',
    descriptionAr: 'نستعد لفتح جولة تمويلية مؤسسية / التجهيز للإدراج في تداول. نحتاج إلى فحص تنفيذي لمصفوفة الصلاحيات المالية (DOA)، سياسات لجنة المراجعة الداخلية، ونموذج التدفقات النقدية المتوقعة (DCF).',
    descriptionEn: 'Preparing for an institutional equity round and TASI IPO readiness. We require an executive audit of our delegation of authority (DOA), audit committee charter, and projected DCF cashflow model.',
    strategicGoalAr: 'سد الفجوات الرقابية وإعداد مصفوفة حوكمة مالية معتمدة تعزز تقييم الشركة أمام كبار المستثمرين.',
    strategicGoalEn: 'Close governance gaps and establish an institutional financial framework that enhances corporate valuation.',
    industry: 'Banking & Fintech'
  },
  {
    id: 'tpl-ceo-01',
    functionCategory: 'CEO',
    titleAr: 'استراتيجية التوسع ودخول أسواق التجزئة الإقليمية مع حماية هوامش الربح',
    titleEn: 'Regional Retail Scaling Strategy while Defending Gross Margins',
    descriptionAr: 'تخطط الشركة للتوسع في 4 مدن رئيسية وفتح قنوات توزيع مباشرة مع مواجهة ضغوط حادة من الموردين والمنافسين. نحتاج لتحديد نموذج التسعير الأمثل وخطة حماية الهوامش الربحية.',
    descriptionEn: 'Planning rapid retail expansion across 4 major cities with direct-to-consumer channels amid fierce supplier price competition. Need optimal pricing architecture and gross margin defensibility.',
    strategicGoalAr: 'تحقيق نمو في الحصة السوقية بنسبة 20% مع الحفاظ على هامش ربح إجمالي لا يقل عن 28%.',
    strategicGoalEn: 'Achieve 20% market share expansion while securing gross profit margins above 28%.',
    industry: 'Retail & FMCG'
  },
  {
    id: 'tpl-cto-01',
    functionCategory: 'CTO',
    titleAr: 'مراجعة البنية التقنية السحابية وحوكمة الأمن السيبراني والذكاء الاصطناعي',
    titleEn: 'Enterprise Cloud Architecture, Cybersecurity & GenAI Governance',
    descriptionAr: 'لدينا تراكم في الديون التقنية وتعدد في الأنظمة المنعزلة، مع رغبة في أتمتة العمليات باستخدام نماذج الذكاء الاصطناعي المؤسسية مع الامتثال لضوابط الهيئة الوطنية للأمن السيبراني (NCA).',
    descriptionEn: 'Managing legacy technical debt and fragmented databases while deploying enterprise AI workflows compliant with Saudi National Cybersecurity Authority (NCA) mandates.',
    strategicGoalAr: 'وضع خارطة طريق للانتقال السحابي الآمن وتخفيض كلفة الاستضافة والصيانة بنسبة 25%.',
    strategicGoalEn: 'Establish a zero-trust cloud migration roadmap and cut infrastructure maintenance costs by 25%.',
    industry: 'Telecom & Digital Economy'
  },
  {
    id: 'tpl-chro-01',
    functionCategory: 'CHRO',
    titleAr: 'هيكلة خطط التعاقب الوظيفي وحوافز القيادات التنفيذية (LTIP)',
    titleEn: 'C-Suite Executive Succession & Long-Term Incentive Plans (LTIP)',
    descriptionAr: 'نحتاج لإعادة تصميم منظومة حوافز ومكافآت الإدارة التنفيذية وربطها بمؤشرات الأداء الربحية الفعلية (EBITDA)، وبناء خطة إحلال وتعاقب وظيفي للصف الأول والثاني من القيادات.',
    descriptionEn: 'Redesigning executive remuneration and LTIP packages indexed to EBITDA milestones, alongside building a resilient C-level succession pipeline.',
    strategicGoalAr: 'رفع معدل استبقاء الكفاءات القيادية إلى 95% ومواءمة حوافز الإدارة مع خطة نمو الشركة.',
    strategicGoalEn: 'Boost key leadership retention to 95% and align executive incentives with 3-year growth targets.',
    industry: 'Manufacturing & Mining'
  },
  {
    id: 'tpl-cso-01',
    functionCategory: 'CSO',
    titleAr: 'حوكمة ميزانيات المشاريع الرأسمالية الكبرى والشراكات الاستراتيجية (PPP)',
    titleEn: 'Megaproject CAPEX Budget Governance & Public-Private Partnerships',
    descriptionAr: 'ندير محفظة مشاريع إنشائية وبنية تحتية واسعة النطاق ونواجه تقلبات في سلاسل المقاولين وتضخم تكاليف التنفيذ. نحتاج لتطبيق هندسة القيمة وإعادة هيكلة العقود.',
    descriptionEn: 'Managing a large-scale CAPEX development portfolio facing contractor delivery variances and cost inflation. Seeking value engineering and PPP risk allocation models.',
    strategicGoalAr: 'ضبط الميزانية الرأسمالية ومنع التجاوزات المالية وتأمين التزامات المقاولين الرئيسيين.',
    strategicGoalEn: 'Control CAPEX overrun risks and secure multi-tier contractor performance commitments.',
    industry: 'Real Estate & Megaprojects'
  }
];

export const MOCK_ADVISORS: Advisor[] = [
  {
    id: 'adv-01',
    name: 'م. خالد بن عبدالعزيز التميمي',
    nameEn: 'Eng. Khalid Al-Tamimi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    currentRole: 'عضو مجلس إدارة غير تنفيذي ومستشار تحول سلاسل الإمداد',
    currentRoleEn: 'Non-Executive Board Member & Supply Chain Transformation Advisor',
    primaryFunction: 'COO',
    functionLabelAr: 'نائب رئيس تنفيذي للعمليات التشغيلية (Ex-COO)',
    functionLabelEn: 'Former Chief Operating Officer (Ex-COO)',
    primaryTrackRecord: 'SABIC',
    sectors: ['Logistics & Supply Chain', 'Petrochemicals & Energy', 'Manufacturing & Mining'],
    bioAr: 'خبرة تفوق 28 عاماً في قيادة العمليات اللوجستية وسلاسل الإمداد العالمية في سابك وأرامكو السعودية. قاد إعادة هيكلة شبكة التوزيع الدولية لخفض التكاليف التشغيلية بنسبة 23% وإدارة مشاريع صناعية تتجاوز قيمتها 14 مليار ريال.',
    bioEn: 'Over 28 years of executive leadership in global logistics and supply chain at SABIC and Saudi Aramco. Directed international distribution restructuring, reducing operational overhead by 23% and managing multi-billion SAR industrial assets.',
    experienceYears: 28,
    formerRoles: [
      {
        role: 'نائب الرئيس التنفيذي للعمليات وسلاسل الإمداد',
        roleEn: 'Executive VP of Global Operations & Supply Chain',
        company: 'سابك (SABIC)',
        companyEn: 'SABIC',
        trackRecordTag: 'SABIC',
        years: '2012 - 2023',
        keyAchievementAr: 'إعادة تصميم كامل لمنظومة النقل التكاملي وخفض زمن دورة التوريد بنسبة 35%',
        keyAchievementEn: 'Complete redesign of end-to-end multi-modal logistics, slashing cycle times by 35%'
      },
      {
        role: 'مدير عام الخدمات اللوجستية والمشتريات الاستراتيجية',
        roleEn: 'General Manager of Global Procurement',
        company: 'أرامكو السعودية (Saudi Aramco)',
        companyEn: 'Saudi Aramco',
        trackRecordTag: 'Aramco',
        years: '2001 - 2012',
        keyAchievementAr: 'إدارة عقود توريد وتوطين تجاوزت 18 مليار ريال سعودي',
        keyAchievementEn: 'Governed procurement & localization contracts exceeding 18 Billion SAR'
      }
    ],
    hourlyRate: 3200,
    currency: 'SAR',
    rating: 4.98,
    reviewsCount: 47,
    totalSessionsCompleted: 62,
    verifiedBadgesAr: ['قيادي تنفيذي سابق (SABIC)', 'عضو مجلس إدارة معتمد', 'خبير تحول سلاسل الإمداد'],
    verifiedBadgesEn: ['Former SABIC EVP', 'Certified Board Director', 'Supply Chain Authority'],
    videoElevatorPitch: {
      duration: '0:34',
      videoThumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-giving-a-presentation-in-an-office-41487-large.mp4',
      summaryAr: 'موجز استراتيجي حول كيفية كشف الفاقد التشغيلي وإعادة بناء شبكات التوزيع اللوجستي للشركات الكبرى في ظل تقلبات سلاسل الإمداد الإقليمية.',
      summaryEn: 'Executive summary on auditing operational bottlenecks and restructuring distribution networks amid regional supply disruptions.',
      topicsCoveredAr: ['إعادة هيكلة سلاسل الإمداد', 'إدارة المخاطر التشغيلية', 'خفض تكلفة الطن/الميل'],
      topicsCoveredEn: ['Supply Chain Restructuring', 'Operational Risk Governance', 'Logistics Cost Optimization']
    },
    availableDays: ['الأحد', 'الثلاثاء', 'الخميس'],
    bufferMinutes: 30,
    googleCalendarConnected: true,
    microsoftOutlookConnected: true
  },
  {
    id: 'adv-02',
    name: 'د. طارق بن فهد السبيعي',
    nameEn: 'Dr. Tariq Al-Subaie',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    currentRole: 'مستشار حوكمة وتمويل الشركات ورئيس لجنة التدقيق',
    currentRoleEn: 'Corporate Finance & Governance Advisor, Audit Committee Chairman',
    primaryFunction: 'CFO',
    functionLabelAr: 'الرئيس المالي التنفيذي السابق (Ex-CFO)',
    functionLabelEn: 'Former Chief Financial Officer (Ex-CFO)',
    primaryTrackRecord: 'STC',
    sectors: ['Telecom & Digital Economy', 'Banking & Fintech', 'Retail & FMCG'],
    bioAr: 'الرئيس المالي التنفيذي السابق لمجموعة STC ورئيس لجان المراجعة والمخاطر في عدد من الشركات المدرجة في تداول (TASI). خبير استراتيجي في إعادة هيكلة الديون، جولات التمويل الكبرى، والطرح العام الأولي (IPO).',
    bioEn: 'Former Group CFO at STC Group and current Chairman of Audit & Risk Committees across TASI-listed entities. Specialized in capital restructuring, mega-debt refinancings, and IPO readiness roadmaps.',
    experienceYears: 26,
    formerRoles: [
      {
        role: 'الرئيس المالي التنفيذي لمجموعة الاتصالات',
        roleEn: 'Group Chief Financial Officer',
        company: 'مجموعة STC',
        companyEn: 'STC Group',
        trackRecordTag: 'STC',
        years: '2014 - 2022',
        keyAchievementAr: 'قيادة برنامج الكفاءة الرأسمالية وإدارة توزيعات نقدية فاقت 30 مليار ريال',
        keyAchievementEn: 'Led Capital Allocation framework and managed 30B+ SAR dividend programs'
      },
      {
        role: 'رئيس قسم تمويل الشركات والاستثمار',
        roleEn: 'Head of Corporate Finance & Treasury',
        company: 'البنك الأهلي السعودي (SNB)',
        companyEn: 'Saudi National Bank',
        trackRecordTag: 'SNB',
        years: '2004 - 2014',
        keyAchievementAr: 'هيكلة صكوك وسندات سيادية ومؤسسية بقيمة 8 مليارات دولار',
        keyAchievementEn: 'Structured corporate & sovereign Sukuk issuance worth $8B+'
      }
    ],
    hourlyRate: 3800,
    currency: 'SAR',
    rating: 4.99,
    reviewsCount: 53,
    totalSessionsCompleted: 81,
    verifiedBadgesAr: ['الرئيس المالي السابق (STC)', 'خبير إعداد الطرح العام (IPO)', 'عضو لجان تدقيق ومخاطر'],
    verifiedBadgesEn: ['Former Group CFO (STC)', 'IPO Readiness Leader', 'Audit & Risk Committee Chair'],
    videoElevatorPitch: {
      duration: '0:31',
      videoThumbnail: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-confident-businessman-looking-at-the-camera-41460-large.mp4',
      summaryAr: 'كيف توازن بين التوسع والسيولة النقدية الحرة قبل دخول جولات التمويل أو الاستعداد للإدراج في سوق الأسهم.',
      summaryEn: 'Balancing aggressive expansion vs free cash flow durability before entering institutional capital rounds or IPO.',
      topicsCoveredAr: ['جاهزية الإدراج (IPO)', 'حوكمة التدقيق والمخاطر', 'إعادة هيكلة السيولة'],
      topicsCoveredEn: ['IPO Readiness', 'Audit Governance', 'Liquidity Restructuring']
    },
    availableDays: ['الإثنين', 'الأربعاء', 'الخميس'],
    bufferMinutes: 45,
    googleCalendarConnected: true,
    microsoftOutlookConnected: true
  },
  {
    id: 'adv-03',
    name: 'سعادة الأستاذة / نورة بنت ناصر القحطاني',
    nameEn: 'Noura Al-Qahtani',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    currentRole: 'مستشارة استراتيجيات التوسع ورئيسة تنفيذية سابقة',
    currentRoleEn: 'Corporate Scaling Strategist & Former Chief Executive Officer',
    primaryFunction: 'CEO',
    functionLabelAr: 'رئيس تنفيذي سابق وعضو مجلس إدارة (Ex-CEO)',
    functionLabelEn: 'Former Chief Executive Officer (Ex-CEO)',
    primaryTrackRecord: 'Almarai',
    sectors: ['Retail & FMCG', 'Logistics & Supply Chain', 'Healthcare & Pharma'],
    bioAr: 'قادت تحول قطاع الأغذية والتجزئة التنافسي خلال توليها مناصب قيادية في المراعي ومشاريع صندوق الاستثمارات العامة (PIF). متخصصة في دخول الأسواق الجديدة، بناء الميزة التنافسية، وحوكمة دمج الشركات والاستحواذ (M&A).',
    bioEn: 'Spearheaded turnaround and scale in ultra-competitive retail & consumer sectors across Almarai and PIF portfolio ventures. Specialized in market entry, competitive moat defensibility, and M&A integration.',
    experienceYears: 24,
    formerRoles: [
      {
        role: 'الرئيس التنفيذي لقطاع التجزئة والمنتجات الاستهلاكية',
        roleEn: 'CEO of Consumer & Retail Division',
        company: 'المراعي (Almarai)',
        companyEn: 'Almarai Co.',
        trackRecordTag: 'Almarai',
        years: '2015 - 2023',
        keyAchievementAr: 'زيادة الحصة السوقية بنسبة 18% وفتح 4 أسواق إقليمية جديدة',
        keyAchievementEn: 'Grew market share by 18% and expanded distribution into 4 new regional markets'
      },
      {
        role: 'مدير إدارة التخطيط الاستراتيجي وعمليات الاستحواذ',
        roleEn: 'VP of Strategic Planning & M&A',
        company: 'صندوق الاستثمارات العامة (PIF Portfolio)',
        companyEn: 'PIF Portfolio Co.',
        trackRecordTag: 'PIF',
        years: '2008 - 2015',
        keyAchievementAr: 'تنفيذ 5 صفقات استحواذ استراتيجية ناجحة بقيمة إجمالية 3.2 مليار ريال',
        keyAchievementEn: 'Executed 5 high-impact corporate acquisitions worth 3.2B SAR'
      }
    ],
    hourlyRate: 3500,
    currency: 'SAR',
    rating: 4.97,
    reviewsCount: 39,
    totalSessionsCompleted: 54,
    verifiedBadgesAr: ['رئيس تنفيذي سابق (Almarai)', 'مستشار استثمارات PIF', 'محكّمة استراتيجية معتمدة'],
    verifiedBadgesEn: ['Former CEO (Almarai)', 'PIF Strategic Advisor', 'Certified Strategy Arbitrator'],
    videoElevatorPitch: {
      duration: '0:29',
      videoThumbnail: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-business-woman-in-a-meeting-room-41484-large.mp4',
      summaryAr: 'كيف تضع خطة التوسع التجاري وحماية هوامش الربح في ظل المنافسة الحادة وضغوط تكاليف الموردين.',
      summaryEn: 'Structuring aggressive commercial expansion while fiercely defending gross margins under supplier cost pressure.',
      topicsCoveredAr: ['استراتيجيات التوسع الإقليمي', 'اندماج واستحواذ الشركات', 'بناء نماذج التسعير المتقدمة'],
      topicsCoveredEn: ['Regional Expansion', 'M&A Due Diligence', 'Margin Defense Strategy']
    },
    availableDays: ['الأحد', 'الإثنين', 'الأربعاء'],
    bufferMinutes: 30,
    googleCalendarConnected: true,
    microsoftOutlookConnected: true
  },
  {
    id: 'adv-04',
    name: 'م. سلطان بن إبراهيم المنصور',
    nameEn: 'Eng. Sultan Al-Mansoor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    currentRole: 'مستشار التحول الرقمي والذكاء الاصطناعي المؤسسي',
    currentRoleEn: 'Enterprise Digital Transformation & Enterprise AI Strategist',
    primaryFunction: 'CTO',
    functionLabelAr: 'الرئيس التقني التنفيذي السابق (Ex-CTO)',
    functionLabelEn: 'Former Chief Technology Officer (Ex-CTO)',
    primaryTrackRecord: 'Aramco',
    sectors: ['Telecom & Digital Economy', 'Petrochemicals & Energy', 'Banking & Fintech'],
    bioAr: 'الرئيس التنفيذي لتقنية المعلومات والتحول الرقمي السابق لمشاريع الطاقة الكبرى في أرامكو، وقاد مشاريع بناء مراكز البيانات السحابية الوطنية، وحوكمة الأمن السيبراني وتطبيقات الذكاء الاصطناعي التوليدي للشركات الكبرى.',
    bioEn: 'Former VP of Enterprise Technology & Digital Infrastructure at Saudi Aramco mega-programs. Architected national cloud migration blueprints, zero-trust cybersecurity, and enterprise generative AI governance.',
    experienceYears: 25,
    formerRoles: [
      {
        role: 'نائب الرئيس لتقنية المعلومات والأنظمة الصناعية الذكية',
        roleEn: 'VP of Digital Infrastructure & Smart Industrial Tech',
        company: 'أرامكو السعودية (Aramco Digital)',
        companyEn: 'Saudi Aramco',
        trackRecordTag: 'Aramco',
        years: '2013 - 2023',
        keyAchievementAr: 'قيادة التحول السحابي الشامل لأكثر من 300 منظومة تقنية وحفظ 450 مليون ريال',
        keyAchievementEn: 'Led enterprise cloud migration across 300+ legacy systems, saving 450M SAR'
      },
      {
        role: 'كبير مهندسي النظم والبنية التحتية',
        roleEn: 'Chief Architect, Enterprise Platforms',
        company: 'علم (Elm Co.)',
        companyEn: 'Elm Co.',
        trackRecordTag: 'PIF',
        years: '2003 - 2013',
        keyAchievementAr: 'تطوير منصات رقمية حكومية تخدم أكثر من 15 مليون مستخدم نشط يومياً',
        keyAchievementEn: 'Architected sovereign digital platforms serving 15M+ daily active users'
      }
    ],
    hourlyRate: 3400,
    currency: 'SAR',
    rating: 4.96,
    reviewsCount: 42,
    totalSessionsCompleted: 58,
    verifiedBadgesAr: ['كبير التقنيين السابق (Aramco)', 'مستشار أمن سيبراني مؤسسي', 'خبير حوكمة الذكاء الاصطناعي'],
    verifiedBadgesEn: ['Former Tech Chief (Aramco)', 'Cybersecurity Governance Expert', 'Enterprise AI Strategist'],
    videoElevatorPitch: {
      duration: '0:33',
      videoThumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-businessman-talking-to-camera-in-the-office-41483-large.mp4',
      summaryAr: 'بناء استراتيجية تقنية مؤسسية قابلة للنمو السريع بدون الوقوع في فخ الديون التقنية أو استنزاف ميزانية الشركة.',
      summaryEn: 'Building scalable enterprise tech infrastructure without sinking into technical debt or burning corporate cash.',
      topicsCoveredAr: ['التحول السحابي للشركات', 'حوكمة أمن المعلومات والبيانات', 'اختيار البنية التقنية المثلى'],
      topicsCoveredEn: ['Cloud Migration Roadmap', 'Cybersecurity Governance', 'Core Architecture Decisioning']
    },
    availableDays: ['الثلاثاء', 'الأربعاء', 'السبت'],
    bufferMinutes: 30,
    googleCalendarConnected: true,
    microsoftOutlookConnected: true
  },
  {
    id: 'adv-05',
    name: 'أ. عبدالعزيز بن منصور الراجحي',
    nameEn: 'Abdulaziz Al-Rajhi',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
    currentRole: 'مستشار حوكمة الموارد البشرية والقيادة التنفيذية',
    currentRoleEn: 'Executive Talent, Board Compensation & Organizational Design Advisor',
    primaryFunction: 'CHRO',
    functionLabelAr: 'رئيس تنفيذي سابق للموارد البشرية والتحول (Ex-CHRO)',
    functionLabelEn: 'Former Chief Human Resources Officer (Ex-CHRO)',
    primaryTrackRecord: 'Maaden',
    sectors: ['Manufacturing & Mining', 'Banking & Fintech', 'Healthcare & Pharma'],
    bioAr: 'قاد برامج التوطين القيادي، خطط التعاقب الوظيفي لمجالس الإدارة (Board Succession)، وإعادة هيكلة المكافآت والحوافز التنفيذية طويلة الأجل (LTI/STI) في كبرى الشركات الوطنية والقطاع المصرفي.',
    bioEn: 'Pioneered C-suite localization frameworks, board succession pipelines, and executive long-term incentive plans (LTIP) across tier-1 sovereign mining & financial enterprises.',
    experienceYears: 27,
    formerRoles: [
      {
        role: 'نائب الرئيس التنفيذي لرأس المال البشري والشؤون المؤسسية',
        roleEn: 'Senior VP of Human Capital & Corporate Affairs',
        company: 'شركة معادن (Maaden)',
        companyEn: 'Maaden Co.',
        trackRecordTag: 'Maaden',
        years: '2014 - 2023',
        keyAchievementAr: 'بناء أكاديمية القادة وتأهيل أكثر من 120 مديراً تنفيذياً للقيادة',
        keyAchievementEn: 'Built Corporate Leadership Academy, graduating 120+ C-level successors'
      },
      {
        role: 'المدير العام للموارد البشرية والمكافآت التنفيذية',
        roleEn: 'General Manager of Talent & Executive Remuneration',
        company: 'مصرف الراجحي (Al Rajhi Bank)',
        companyEn: 'Al Rajhi Bank',
        trackRecordTag: 'SNB',
        years: '2001 - 2014',
        keyAchievementAr: 'إعادة تصميم سلم الرواتب والحوافز لأكثر من 14,000 موظف',
        keyAchievementEn: 'Redesigned compensation & incentive architecture for 14,000+ staff'
      }
    ],
    hourlyRate: 2900,
    currency: 'SAR',
    rating: 4.95,
    reviewsCount: 34,
    totalSessionsCompleted: 49,
    verifiedBadgesAr: ['رئيس تنفيذي سابق للموارد البشرية', 'خبير حوكمة مجالس الإدارة', 'مستشار حوافز القيادات (LTIP)'],
    verifiedBadgesEn: ['Former CHRO (Maaden)', 'Board Governance Expert', 'Executive Compensation Strategist'],
    videoElevatorPitch: {
      duration: '0:30',
      videoThumbnail: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-business-man-having-a-remote-meeting-with-a-laptop-41480-large.mp4',
      summaryAr: 'كيف تجذب وتحتفظ بالكفاءات القيادية من الطراز الأول وتبني منظومة حوافز مرتبطة بتحقيق الأرباح الفعلية.',
      summaryEn: 'Attracting and retaining tier-1 executive leadership with performance-indexed LTIP structures.',
      topicsCoveredAr: ['استقطاب القيادات التنفيذية', 'حوكمة مكافآت مجلس الإدارة', 'خطط التعاقب الوظيفي'],
      topicsCoveredEn: ['C-Suite Headhunting', 'Board Compensation Governance', 'Executive Succession']
    },
    availableDays: ['الأحد', 'الثلاثاء', 'الخميس'],
    bufferMinutes: 30,
    googleCalendarConnected: true,
    microsoftOutlookConnected: true
  },
  {
    id: 'adv-06',
    name: 'م. فيصل بن سعد الغامدي',
    nameEn: 'Eng. Faisal Al-Ghamdi',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80',
    currentRole: 'مستشار مشاريع كبرى وتطوير الأعمال الاستراتيجية',
    currentRoleEn: 'Megaprojects & Strategic Business Development Senior Advisor',
    primaryFunction: 'CSO',
    functionLabelAr: 'رئيس قطاع الاستراتيجية وتطوير الأعمال السابق (Ex-CSO)',
    functionLabelEn: 'Former Chief Strategy Officer (Ex-CSO)',
    primaryTrackRecord: 'PIF',
    sectors: ['Real Estate & Megaprojects', 'Logistics & Supply Chain', 'Petrochemicals & Energy'],
    bioAr: 'قاد فرق التخطيط الاستراتيجي في مشاريع كبرى ضمن رؤية 2030 وفي شركات ماكينزي آند كومباني. متخصص في دراسات الجدوى التشغيلية، عقود الشراكة بين القطاعين العام والخاص (PPP)، وهيكلة الصفقات الحكومية.',
    bioEn: 'Directed core strategy teams across Vision 2030 giga-projects and McKinsey & Company. Specialist in operational feasibility, Public-Private Partnerships (PPP), and high-stakes procurement.',
    experienceYears: 22,
    formerRoles: [
      {
        role: 'رئيس قطاع التخطيط والاستراتيجية للمشاريع الكبرى',
        roleEn: 'Chief Strategy Officer, Giga-Development Ventures',
        company: 'شركة مشاريع البحر الأحمر / PIF',
        companyEn: 'Red Sea Global / PIF',
        trackRecordTag: 'PIF',
        years: '2017 - 2024',
        keyAchievementAr: 'إدارة وتطوير مصفوفة استراتيجية لمشاريع بنية تحتية تجاوزت 40 مليار ريال',
        keyAchievementEn: 'Developed strategic delivery frameworks for 40B+ SAR infrastructure programs'
      },
      {
        role: 'مستشار أول للاستراتيجيات الحكومية والشركات',
        roleEn: 'Engagement Manager, Middle East Practice',
        company: 'ماكينزي آند كومباني (McKinsey & Co.)',
        companyEn: 'McKinsey & Company',
        trackRecordTag: 'McKinsey',
        years: '2008 - 2017',
        keyAchievementAr: 'قيادة 20+ دراسة تحول استراتيجي لشركات قطاع عام وخاص',
        keyAchievementEn: 'Led 20+ corporate and public transformation roadmaps across GCC'
      }
    ],
    hourlyRate: 3600,
    currency: 'SAR',
    rating: 4.98,
    reviewsCount: 36,
    totalSessionsCompleted: 44,
    verifiedBadgesAr: ['خبير مشاريع كبرى (PIF Giga)', 'مستشار سابق McKinsey', 'مهندس شراكات حكومية PPP'],
    verifiedBadgesEn: ['PIF Giga-Project Expert', 'Ex-McKinsey Consultant', 'PPP Partnerships Architect'],
    videoElevatorPitch: {
      duration: '0:32',
      videoThumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-businessman-in-an-office-smiling-at-the-camera-41485-large.mp4',
      summaryAr: 'طريقة تجنب التضخم في ميزانيات المشاريع الرأسمالية الكبرى وتحقيق التكامل بين المقاولين والموردين.',
      summaryEn: 'Preventing CAPEX budget overruns on giga-scale developments and aligning multi-tier contractors.',
      topicsCoveredAr: ['إدارة ميزانيات المشاريع الكبرى', 'الشراكات بين القطاعين (PPP)', 'هندسة القيمة التشغيلية'],
      topicsCoveredEn: ['Megaproject CAPEX Governance', 'PPP Frameworks', 'Value Engineering']
    },
    availableDays: ['الإثنين', 'الأربعاء', 'الخميس'],
    bufferMinutes: 30,
    googleCalendarConnected: true,
    microsoftOutlookConnected: true
  }
];

export const INITIAL_BOOKINGS: BookingSession[] = [
  {
    id: 'ses-101',
    referenceCode: 'MSH-SES-9421',
    advisorId: 'adv-01',
    advisor: MOCK_ADVISORS[0],
    clientId: 'client-881',
    clientName: 'أ. مشعل بن فهد الدوسري',
    clientCompany: 'شركة الأفق للحلول اللوجستية والنقل السريع',
    clientEmail: 'm.aldosari@alofooq-logistics.sa',
    clientPhone: '+966 50 123 4567',
    date: '2026-09-03',
    timeSlot: '10:00 AM - 11:00 AM',
    timezone: 'Asia/Riyadh (GMT+3)',
    status: 'confirmed',
    meetLink: 'https://meet.google.com/msh-tamimi-q7x',
    calendarSynced: true,
    challengeBrief: {
      id: 'brf-9421',
      title: 'إعادة هيكلة شبكة التوزيع الإقليمي وخفض زمن التسليم بين الرياض والشرقية',
      industry: 'Logistics & Supply Chain',
      companyName: 'شركة الأفق للحلول اللوجستية',
      companyStage: 'growth',
      description: 'نواجه ارتفاعاً في كلفة الميل الأخير وتأخيراً في سلاسل الإمداد بمستودعاتنا المركزية. نحتاج لتشخيص تنفيذي مباشر لإعادة توزيع مراكز الفرز واستخدام أسطول نقل هجين.',
      urgency: 'immediate',
      strategicGoal: 'خفض كلفة النقل للطن بنسبة 18% خلال الربع الرابع وتحسين معدل الالتزام بالمواعيد إلى 97%.',
      attachedFiles: [
        {
          id: 'file-01',
          name: 'Alofooq_SupplyChain_Bottlenecks_Audit.pdf',
          size: '3.4 MB',
          type: 'application/pdf',
          uploadedAt: '2026-08-28'
        },
        {
          id: 'file-02',
          name: 'Fleet_Operating_Expenses_Q2_2026.xlsx',
          size: '1.8 MB',
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          uploadedAt: '2026-08-28'
        }
      ],
      budgetCapSAR: 15000
    },
    nda: {
      id: 'nda-9421',
      agreementNumber: 'MSH-NDA-2026-9421',
      clientName: 'أ. مشعل بن فهد الدوسري',
      clientCompany: 'شركة الأفق للحلول اللوجستية',
      clientSignDate: '2026-08-28 14:30 AST',
      clientSignatureData: 'M.AlDosari',
      advisorName: 'م. خالد بن عبدالعزيز التميمي',
      advisorSignDate: '2026-08-28 16:10 AST',
      advisorSignatureData: 'Khalid AlTamimi',
      ipProtectionHash: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      status: 'fully_executed',
      governingLaw: 'الأنظمة واللوائح القضائية والتجارية المعمول بها في المملكة العربية السعودية',
      nonCircumventionMonths: 24
    },
    escrowStatus: 'held_in_escrow',
    feeSAR: 3200,
    platformFeeSAR: 320,
    vatSAR: 528,
    totalPaidSAR: 4048,
    escrowHoldTxId: 'ESC-TX-98472910',
    remindersScheduled: {
      h24: true,
      h1: true,
      m10: true
    },
    createdAt: '2026-08-28T14:30:00Z'
  },
  {
    id: 'ses-102',
    referenceCode: 'MSH-SES-8819',
    advisorId: 'adv-02',
    advisor: MOCK_ADVISORS[1],
    clientId: 'client-881',
    clientName: 'أ. مشعل بن فهد الدوسري',
    clientCompany: 'شركة الأفق القابضة',
    clientEmail: 'm.aldosari@alofooq-logistics.sa',
    clientPhone: '+966 50 123 4567',
    date: '2026-08-20',
    timeSlot: '02:00 PM - 03:00 PM',
    timezone: 'Asia/Riyadh (GMT+3)',
    status: 'completed',
    meetLink: 'https://meet.google.com/msh-subaie-p9w',
    calendarSynced: true,
    challengeBrief: {
      id: 'brf-8819',
      title: 'تقييم جاهزية الحوكمة المالية قبل جولة تمويل استثماري Series-B',
      industry: 'Banking & Fintech',
      companyName: 'الأفق المالية التقنية',
      companyStage: 'growth',
      description: 'نستعد لطرح جولة تمويلية بقيمة 40 مليون ريال، ونريد مراجعة نموذج التدفقات النقدية ومصفوفة الصلاحيات المالية وسياسات لجنة المراجعة.',
      urgency: 'strategic_review',
      strategicGoal: 'سد الفجوات في هيكل رأس المال وإعداد ملف استثماري متوافق مع معايير الصناديق السيادية.',
      attachedFiles: [
        {
          id: 'file-03',
          name: 'SeriesB_Financial_Model_v3.xlsx',
          size: '4.1 MB',
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          uploadedAt: '2026-08-18'
        }
      ],
      budgetCapSAR: 20000
    },
    nda: {
      id: 'nda-8819',
      agreementNumber: 'MSH-NDA-2026-8819',
      clientName: 'أ. مشعل بن فهد الدوسري',
      clientCompany: 'شركة الأفق القابضة',
      clientSignDate: '2026-08-18 10:00 AST',
      clientSignatureData: 'M.AlDosari',
      advisorName: 'د. طارق بن فهد السبيعي',
      advisorSignDate: '2026-08-18 11:20 AST',
      advisorSignatureData: 'Dr. Tariq AlSubaie',
      ipProtectionHash: 'sha256:3a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456789abcdef012',
      status: 'fully_executed',
      governingLaw: 'أنظمة المملكة العربية السعودية',
      nonCircumventionMonths: 24
    },
    escrowStatus: 'released_to_advisor',
    feeSAR: 3800,
    platformFeeSAR: 380,
    vatSAR: 627,
    totalPaidSAR: 4807,
    escrowHoldTxId: 'ESC-TX-77192834',
    remindersScheduled: {
      h24: true,
      h1: true,
      m10: true
    },
    createdAt: '2026-08-18T10:00:00Z',
    deliverable: {
      id: 'del-8819',
      sessionId: 'ses-102',
      submittedAt: '2026-08-20T16:15:00Z',
      advisorId: 'adv-02',
      advisorName: 'د. طارق بن فهد السبيعي',
      executiveSummary: 'تمت مراجعة النموذج المالي ومصفوفة التدفقات النقدية وملاحظات التدقيق الخارجي. الشركة تتمتع بنمو تشغيلي متسارع ومعدل تحصيل صحي، إلا أن هناك حاجة ملحة لإنشاء لجنة تدقيق مستقلة وتعديل صيغ تقييم المخاطر الائتمانية قبل مقابلة المستثمرين المؤسسيين.',
      strategicRecommendations: [
        {
          id: 'rec-1',
          title: 'تشكيل لجنة مراجعة ومخاطر منبثقة عن مجلس الإدارة',
          impact: 'Transformational',
          description: 'تعيين رئيس لجنة تدقيق مستقل بخبرة في الأنظمة المالية لتعزيز موثوقية القوائم المالية أمام المستثمرين.',
          actionableSteps: [
            'صياغة ميثاق لجنة المراجعة الداخلي المعتمد',
            'تعيين مراجع حسابات خارجي من بين الشركات الأربع الكبرى (Big 4)',
            'إقرار مصفوفة الصلاحيات المالية (DOA)'
          ]
        },
        {
          id: 'rec-2',
          title: 'إعادة هيكلة دورة رأس المال العامل (Working Capital Cycle)',
          impact: 'High',
          description: 'تقليص فترة تحصيل الذمم المدينة من 78 يوماً إلى 45 يوماً عبر تقديم حوافز الدفع المبكر.',
          actionableSteps: [
            'تطبيق نظام فوترة رقمي آلي مع تذكيرات بالاستحقاق',
            'ربط عمولات فريق المبيعات بنسبة التحصيل الفعلي وليس حجم العقود فقط'
          ]
        }
      ],
      criticalRisks: [
        {
          id: 'rsk-1',
          risk: 'تركّز أكثر من 42% من الإيرادات لدى عميلين رئيسيين فقط',
          severity: 'Critical',
          mitigation: 'تنويع قاعدة العملاء باستهداف قطاع المنشآت المتوسطة لمنع تعرض الشركة لصدمات سيولة مفاجئة.'
        },
        {
          id: 'rsk-2',
          risk: 'عدم وجود صندوق تحوط لمخاطر أسعار الفائدة المتغيرة',
          severity: 'High',
          mitigation: 'تثبيت أسعار الفائدة على 60% من التسهيلات الائتمانية عبر عقود المبادلة الإسلامية.'
        }
      ],
      roadmap90Days: {
        phase1_30d: {
          title: 'الشهر الأول (1 - 30 يوماً): الضبط والتأسيس',
          items: [
            'اعتماد مصفوفة الصلاحيات المالية (DOA) من مجلس الإدارة',
            'بدء فحص العناية الواجبة المالي المبدئي الداخلي (Vendor Due Diligence)',
            'تحديث نموذج التقييم المالي المتوقع (DCF Model)'
          ]
        },
        phase2_60d: {
          title: 'الشهر الثاني (31 - 60 يوماً): الهيكلة والتنفيذ',
          items: [
            'إطلاق غرفة البيانات الافتراضية (VDR) للمستثمرين المؤسسيين',
            'إغلاق جميع الملاحظات الرقابية القديمة في تقارير المراجع الخارجي',
            'تعيين المستشار المالي القانوني لجولة الاستثمار'
          ]
        },
        phase3_90d: {
          title: 'الشهر الثالث (61 - 90 يوماً): الإغلاق والتوقيع',
          items: [
            'استقبال عروض الشروط غير الملزمة (Term Sheets)',
            'مفاوضات تقييم حقوق الملكية وحوكمة مقاعد مجلس الإدارة',
            'توقيع اتفاقية المساهمين النهائية وصرف الدفعة الأولى من التمويل'
          ]
        }
      },
      advisorSignatureStamp: 'د. طارق السبيعي - مستشار حوكمة معتمد #TASI-ADV-412',
      escrowReleased: true,
      releasedAmountSAR: 3800,
      releaseTxHash: '0x8f7c9e12a04918237b6c5d4e3f2a1098b7c6d5e4',
      aiExecutiveSummary: {
        id: 'ai-sum-8819',
        sessionId: 'ses-102',
        generatedAt: '2026-08-20T16:16:00Z',
        modelUsed: 'gemini-3.7-flash',
        executiveBrief: 'خلصت جلسة الاستشارة الاستراتيجية مع د. طارق السبيعي إلى تأكيد جاهزية الشركة للنمو مع ضرورة إعادة هيكلة مصفوفة الحوكمة ولجنة المراجعة وضبط دورة التحصيل النقدي قبل فتح جولة التمويل الاستثماري بقيمة 40 مليون ريال.',
        keyDecisions: [
          {
            id: 'kd-1',
            decision: 'تأسيس لجنة مراجعة وتدقيق مستقلة منبثقة عن مجلس الإدارة وتعيين رئيس مستقل بخلفية مصرفية وتنظيمية.',
            category: 'Governance',
            owner: 'مجلس الإدارة والرئيس التنفيذي',
            timeframe: 'خلال 21 يوماً',
          },
          {
            id: 'kd-2',
            decision: 'تقليص فترة استحقاق الذمم المدينة (DSO) من 78 يوماً إلى 45 يوماً عبر نظام تحفيز الدفع المبكر وربط الحوافز بالتحصيل الفعلي.',
            category: 'Financial',
            owner: 'المدير المالي (CFO)',
            timeframe: '30 يوماً',
          },
          {
            id: 'kd-3',
            decision: 'تعيين مكتب استشاري محاسبي من الشركات الأربع الكبرى (Big 4) لإعداد ملف الفحص النافي للجهالة الاستباقي (Vendor Due Diligence).',
            category: 'Strategic',
            owner: 'لجنة الاستثمار',
            timeframe: '14 يوماً',
          },
          {
            id: 'kd-4',
            decision: 'إبرام اتفاقيات تحوط إسلامية لمعدلات الفائدة المتغيرة على 60% من التسهيلات الائتمانية البنكية القائمة.',
            category: 'Financial',
            owner: 'إدارة الخزينة والتمويل',
            timeframe: '45 يوماً',
          },
        ],
        strategicTakeaways: [
          'جاهزية النموذج المالي للتوسع تتطلب فصل الصلاحيات التنفيذية عن صلاحيات الاعتماد المالي عبر مصفوفة DOA محدثة.',
          'الصناديق الاستثمارية السيادية تولي وزناً كبيراً لموثوقية توقعات التدفق النقدي الحر (FCF) أكثر من مجرد إجمالي حجم المبيعات.',
          'تعديل شروط عقود العملاء الكبار لتقليل مخاطر التركز الائتماني يحمي الشركة من صدمات السيولة أثناء التوسع.',
          'إنشاء غرفة بيانات افتراضية (VDR) منظمة يختصر فترة المفاوضات الاستثمارية بما لا يقل عن 40 يوماً.',
        ],
        immediate7DayActions: [
          {
            id: 'act-1',
            action: 'صياغة واعتماد المسودة الأولى لميثاق لجنة المراجعة الداخلية ومصفوفة الصلاحيات (DOA).',
            priority: 'Critical',
            responsibleParty: 'أمين سر المجلس والرئيس التنفيذي',
          },
          {
            id: 'act-2',
            action: 'مراجعة تقرير أعمار الديون وحصر العملاء المتعثرين فوق 60 يوماً لتطبيق خطة التسوية السريعة.',
            priority: 'High',
            responsibleParty: 'الفريق المالي ورئيس المبيعات',
          },
          {
            id: 'act-3',
            action: 'طلب عروض الأسعار (RFP) لفحص العناية الواجبة المالي من مكاتب التدقيق المعتمدة.',
            priority: 'High',
            responsibleParty: 'المدير المالي',
          },
        ],
        riskMitigations: [
          'خطر تركز 42% من الإيرادات لدى عميلين: البدء فوراً في تنويع قاعدة العملاء باستهداف قطاع الشركات المتوسطة بحزم دفع ميسرة.',
          'خطر تقلبات الفائدة: إبرام عقود تحوط إسلامية على 60% من التسهيلات البنكية لحماية هوامش الربحية.',
        ],
        confidenceScore: 98,
        transcriptWordCount: 3820,
        sessionDurationMinutes: 60,
      }
    },
    aiExecutiveSummary: {
      id: 'ai-sum-8819',
      sessionId: 'ses-102',
      generatedAt: '2026-08-20T16:16:00Z',
      modelUsed: 'gemini-3.7-flash',
      executiveBrief: 'خلصت جلسة الاستشارة الاستراتيجية مع د. طارق السبيعي إلى تأكيد جاهزية الشركة للنمو مع ضرورة إعادة هيكلة مصفوفة الحوكمة ولجنة المراجعة وضبط دورة التحصيل النقدي قبل فتح جولة التمويل الاستثماري بقيمة 40 مليون ريال.',
      keyDecisions: [
        {
          id: 'kd-1',
          decision: 'تأسيس لجنة مراجعة وتدقيق مستقلة منبثقة عن مجلس الإدارة وتعيين رئيس مستقل بخلفية مصرفية وتنظيمية.',
          category: 'Governance',
          owner: 'مجلس الإدارة والرئيس التنفيذي',
          timeframe: 'خلال 21 يوماً',
        },
        {
          id: 'kd-2',
          decision: 'تقليص فترة استحقاق الذمم المدينة (DSO) من 78 يوماً إلى 45 يوماً عبر نظام تحفيز الدفع المبكر وربط الحوافز بالتحصيل الفعلي.',
          category: 'Financial',
          owner: 'المدير المالي (CFO)',
          timeframe: '30 يوماً',
        },
        {
          id: 'kd-3',
          decision: 'تعيين مكتب استشاري محاسبي من الشركات الأربع الكبرى (Big 4) لإعداد ملف الفحص النافي للجهالة الاستباقي (Vendor Due Diligence).',
          category: 'Strategic',
          owner: 'لجنة الاستثمار',
          timeframe: '14 يوماً',
        },
        {
          id: 'kd-4',
          decision: 'إبرام اتفاقيات تحوط إسلامية لمعدلات الفائدة المتغيرة على 60% من التسهيلات الائتمانية البنكية القائمة.',
          category: 'Financial',
          owner: 'إدارة الخزينة والتمويل',
          timeframe: '45 يوماً',
        },
      ],
      strategicTakeaways: [
        'جاهزية النموذج المالي للتوسع تتطلب فصل الصلاحيات التنفيذية عن صلاحيات الاعتماد المالي عبر مصفوفة DOA محدثة.',
        'الصناديق الاستثمارية السيادية تولي وزناً كبيراً لموثوقية توقعات التدفق النقدي الحر (FCF) أكثر من مجرد إجمالي حجم المبيعات.',
        'تعديل شروط عقود العملاء الكبار لتقليل مخاطر التركز الائتماني يحمي الشركة من صدمات السيولة أثناء التوسع.',
        'إنشاء غرفة بيانات افتراضية (VDR) منظمة يختصر فترة المفاوضات الاستثمارية بما لا يقل عن 40 يوماً.',
      ],
      immediate7DayActions: [
        {
          id: 'act-1',
          action: 'صياغة واعتماد المسودة الأولى لميثاق لجنة المراجعة الداخلية ومصفوفة الصلاحيات (DOA).',
          priority: 'Critical',
          responsibleParty: 'أمين سر المجلس والرئيس التنفيذي',
        },
        {
          id: 'act-2',
          action: 'مراجعة تقرير أعمار الديون وحصر العملاء المتعثرين فوق 60 يوماً لتطبيق خطة التسوية السريعة.',
          priority: 'High',
          responsibleParty: 'الفريق المالي ورئيس المبيعات',
        },
        {
          id: 'act-3',
          action: 'طلب عروض الأسعار (RFP) لفحص العناية الواجبة المالي من مكاتب التدقيق المعتمدة.',
          priority: 'High',
          responsibleParty: 'المدير المالي',
        },
      ],
      riskMitigations: [
        'خطر تركز 42% من الإيرادات لدى عميلين: البدء فوراً في تنويع قاعدة العملاء باستهداف قطاع الشركات المتوسطة بحزم دفع ميسرة.',
        'خطر تقلبات الفائدة: إبرام عقود تحوط إسلامية على 60% من التسهيلات البنكية لحماية هوامش الربحية.',
      ],
      confidenceScore: 98,
      transcriptWordCount: 3820,
      sessionDurationMinutes: 60,
    }
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    titleAr: 'تأكيد حجز الجلسة وتوليد رابط Google Meet',
    titleEn: 'Session Confirmed & Google Meet Link Generated',
    messageAr: 'تم تأكيد جلستك الاستشارية مع م. خالد التميمي يوم الخميس 10:00 صباحاً. تم توليد رابط الاجتماع وإرسال ملف .ics لتقويمك.',
    messageEn: 'Your executive session with Eng. Khalid Al-Tamimi is confirmed for Thursday 10:00 AM. Google Meet link generated & .ics sent.',
    timestamp: 'منذ 15 دقيقة',
    type: 'booking',
    read: false
  },
  {
    id: 'notif-2',
    titleAr: 'توقيع اتفاقية السرية NDA بنجاح',
    titleEn: 'NDA Agreement Signed & Verified',
    messageAr: 'تم توقيع وتوثيق اتفاقية عدم الإفصاح رقم MSH-NDA-2026-9421 إلكترونياً وتشفيرها برقم بصمة SHA-256.',
    messageEn: 'NDA Agreement MSH-NDA-2026-9421 successfully signed and hashed with SHA-256.',
    timestamp: 'منذ ساعتين',
    type: 'nda',
    read: false
  },
  {
    id: 'notif-3',
    titleAr: 'إيداع المبلغ في حساب الضمان (Escrow Hold)',
    titleEn: 'Funds Secured in Escrow',
    messageAr: 'تم تجميد مبلغ 4,048 ر.س في حساب الضمان الآمن ولن يُحوّل للخبير إلا بعد تسليم التقرير الاستراتيجي.',
    messageEn: '4,048 SAR held securely in escrow, pending deliverable submission by advisor.',
    timestamp: 'منذ ساعتين',
    type: 'escrow',
    read: true
  }
];
