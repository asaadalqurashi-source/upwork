export type Language = 'ar' | 'en';

export type UserRole = 'client' | 'advisor' | 'admin';

export type CSuiteFunction = 'CEO' | 'COO' | 'CFO' | 'CTO' | 'CHRO' | 'CMO' | 'BOARD_DIRECTOR' | 'CSO';

export type CorporateTrackRecord = 'Aramco' | 'SABIC' | 'STC' | 'PIF' | 'Almarai' | 'Maaden' | 'SNB' | 'McKinsey';

export type IndustrySector = 
  | 'Logistics & Supply Chain'
  | 'Petrochemicals & Energy'
  | 'Telecom & Digital Economy'
  | 'Banking & Fintech'
  | 'Retail & FMCG'
  | 'Healthcare & Pharma'
  | 'Real Estate & Megaprojects'
  | 'Manufacturing & Mining';

export interface FormerRole {
  role: string;
  roleEn: string;
  company: string;
  companyEn: string;
  trackRecordTag: CorporateTrackRecord;
  years: string;
  keyAchievementAr: string;
  keyAchievementEn: string;
}

export interface Advisor {
  id: string;
  name: string;
  nameEn: string;
  avatar: string;
  currentRole: string;
  currentRoleEn: string;
  primaryFunction: CSuiteFunction;
  functionLabelAr: string;
  functionLabelEn: string;
  primaryTrackRecord: CorporateTrackRecord;
  sectors: IndustrySector[];
  bioAr: string;
  bioEn: string;
  experienceYears: number;
  formerRoles: FormerRole[];
  hourlyRate: number; // in SAR
  currency: string;
  rating: number;
  reviewsCount: number;
  totalSessionsCompleted: number;
  verifiedBadgesAr: string[];
  verifiedBadgesEn: string[];
  videoElevatorPitch: {
    duration: string;
    videoThumbnail: string;
    videoUrl: string;
    summaryAr: string;
    summaryEn: string;
    topicsCoveredAr: string[];
    topicsCoveredEn: string[];
  };
  availableDays: string[];
  bufferMinutes: number;
  googleCalendarConnected: boolean;
  microsoftOutlookConnected: boolean;
}

export interface ChallengeBrief {
  id: string;
  title: string;
  industry: IndustrySector;
  companyName: string;
  companyStage: 'growth' | 'enterprise' | 'turnaround' | 'pre_ipo';
  description: string;
  urgency: 'immediate' | 'this_month' | 'strategic_review';
  strategicGoal: string;
  attachedFiles: Array<{
    id: string;
    name: string;
    size: string;
    type: string;
    uploadedAt: string;
  }>;
  budgetCapSAR: number;
}

export interface NDAAgreement {
  id: string;
  agreementNumber: string;
  clientName: string;
  clientCompany: string;
  clientSignDate?: string;
  clientSignatureData?: string;
  advisorName: string;
  advisorSignDate?: string;
  advisorSignatureData?: string;
  ipProtectionHash: string;
  status: 'draft' | 'client_signed' | 'fully_executed';
  governingLaw: string;
  nonCircumventionMonths: number;
}

export interface StrategicRecommendation {
  id: string;
  title: string;
  impact: 'High' | 'Medium' | 'Transformational';
  description: string;
  actionableSteps: string[];
}

export interface CriticalRisk {
  id: string;
  risk: string;
  severity: 'Critical' | 'High' | 'Moderate';
  mitigation: string;
}

export interface ExecutionRoadmap {
  phase1_30d: { title: string; items: string[] };
  phase2_60d: { title: string; items: string[] };
  phase3_90d: { title: string; items: string[] };
}

export interface MeetTranscriptEntry {
  id: string;
  speaker: string;
  speakerRole: 'Advisor' | 'Client' | 'Participant';
  timestamp: string; // e.g. "04:12"
  text: string;
}

export interface KeyDecisionItem {
  id: string;
  decision: string;
  category: 'Governance' | 'Financial' | 'Operational' | 'Strategic' | 'Talent';
  owner: string;
  timeframe: string;
}

export interface ImmediateActionItem {
  id: string;
  action: string;
  priority: 'Critical' | 'High' | 'Medium';
  responsibleParty: string;
}

export interface AiExecutiveSummaryTakeaways {
  id: string;
  sessionId: string;
  generatedAt: string;
  modelUsed: string; // e.g. "gemini-3.7-flash"
  executiveBrief: string;
  keyDecisions: KeyDecisionItem[];
  strategicTakeaways: string[];
  immediate7DayActions: ImmediateActionItem[];
  riskMitigations: string[];
  confidenceScore: number; // 0 - 100
  transcriptWordCount?: number;
  sessionDurationMinutes?: number;
}

export interface PostSessionDeliverable {
  id: string;
  sessionId: string;
  submittedAt: string;
  advisorId: string;
  advisorName: string;
  executiveSummary: string;
  strategicRecommendations: StrategicRecommendation[];
  criticalRisks: CriticalRisk[];
  roadmap90Days: ExecutionRoadmap;
  advisorSignatureStamp: string;
  escrowReleased: boolean;
  releasedAmountSAR: number;
  releaseTxHash: string;
  aiExecutiveSummary?: AiExecutiveSummaryTakeaways;
}

export interface SessionRatingFeedback {
  id: string;
  ratingOverall: number; // 1-5
  ratingProfessionalism: number; // 1-5
  ratingInsightQuality: number; // 1-5
  selectedTags: string[];
  testimonial: string;
  submittedAt: string;
  clientName: string;
}

export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  sessionId: string;
  referenceCode: string;
  advisorId: string;
  advisorName: string;
  advisorNameEn: string;
  advisorTrackRecord: CorporateTrackRecord;
  clientName: string;
  clientCompany: string;
  clientVatNumber?: string;
  issueDate: string;
  advisoryFeeSAR: number;
  platformFeeSAR: number;
  vatAmountSAR: number; // 15%
  totalAmountSAR: number;
  status: 'paid_in_escrow' | 'escrow_released' | 'refunded';
  escrowReleaseTxHash?: string;
  escrowHoldTxId: string;
  paymentMethod: string;
  zatcaQrCodeHash: string;
  challengeTitle: string;
}

export interface BookingSession {
  id: string;
  referenceCode: string;
  advisorId: string;
  advisor: Advisor;
  clientId: string;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:00 - 11:00 AM"
  timezone: string;
  status: 'pending_advisor_approval' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  meetLink: string;
  calendarSynced: boolean;
  challengeBrief: ChallengeBrief;
  nda: NDAAgreement;
  escrowStatus: 'held_in_escrow' | 'released_to_advisor' | 'refunded';
  feeSAR: number;
  platformFeeSAR: number;
  vatSAR: number;
  totalPaidSAR: number;
  escrowHoldTxId: string;
  remindersScheduled: {
    h24: boolean;
    h1: boolean;
    m10: boolean;
  };
  deliverable?: PostSessionDeliverable;
  ratingFeedback?: SessionRatingFeedback;
  meetTranscript?: MeetTranscriptEntry[];
  aiExecutiveSummary?: AiExecutiveSummaryTakeaways;
  createdAt: string;
}

export interface SystemNotification {
  id: string;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  timestamp: string;
  type: 'booking' | 'nda' | 'escrow' | 'deliverable' | 'reminder';
  read: boolean;
  actionUrl?: string;
}

export type ToastType = 
  | 'nda_signed'
  | 'escrow_locked'
  | 'escrow_released'
  | 'deliverable_submitted'
  | 'feedback_submitted'
  | 'profile_updated'
  | 'calendar_synced'
  | 'success'
  | 'info';

export interface ToastNotification {
  id: string;
  type: ToastType;
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  badgeAr?: string;
  badgeEn?: string;
  timestamp?: number;
  durationMs?: number;
  referenceCode?: string;
  amountSAR?: number;
  action?: {
    labelAr: string;
    labelEn: string;
    onClick: () => void;
  };
}

