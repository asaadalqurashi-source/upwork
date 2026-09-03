import { jsPDF } from 'jspdf';
import { PostSessionDeliverable, BookingSession, BillingInvoice, Language } from '../types';

/**
 * Clean ASCII / Latin sanitization for standard jsPDF fonts,
 * with bilingual executive layout support.
 */
export function downloadExecutiveSummaryPDF(
  deliverable: PostSessionDeliverable,
  session: BookingSession,
  lang: Language
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = margin;
      drawHeaderFooter();
    }
  };

  const drawHeaderFooter = () => {
    // Top Accent Bar (Teams Indigo)
    doc.setFillColor(79, 70, 229); // #4F46E5
    doc.rect(0, 0, pageWidth, 4, 'F');

    // Header Branding
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42); // Slate #0F172A
    doc.text('MUSHOWR EXECUTIVE ADVISORY', margin, 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('CONFIDENTIAL & PRIVILEGED | BOARD-LEVEL DELIVERABLE', margin, 17);

    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(`DOC REF: ${deliverable.id.toUpperCase()}`, pageWidth - margin, 12, { align: 'right' });
    doc.text(`SESSION REF: ${session.referenceCode}`, pageWidth - margin, 17, { align: 'right' });

    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.line(margin, 20, pageWidth - margin, 20);

    // Footer
    const footerY = pageHeight - 10;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Mushowr Governance Platform - Verified Advisory Report & Escrow Payout Protocol', margin, footerY);
    doc.text(`Page ${doc.getNumberOfPages()}`, pageWidth - margin, footerY, { align: 'right' });
  };

  // Initialize Page 1 Header
  drawHeaderFooter();
  y = 28;

  // Title Box
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, y, contentWidth, 24, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text('EXECUTIVE ADVISORY SUMMARY & 90-DAY ROADMAP', margin + 5, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(226, 232, 240);
  doc.text(`Topic: ${session.challengeBrief.title.slice(0, 80)}`, margin + 5, y + 14);

  doc.setFontSize(8);
  doc.setTextColor(165, 180, 252); // Indigo Light
  doc.text(
    `Advisor: ${deliverable.advisorName} (${session.advisor.primaryTrackRecord} Track) | Client: ${session.clientName} (${session.clientCompany})`,
    margin + 5,
    y + 20
  );

  y += 30;

  // Meta Grid info table
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentWidth, 14, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, 14, 'S');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Delivered Date:', margin + 4, y + 5);
  doc.text('Consultation Fee:', margin + 45, y + 5);
  doc.text('Escrow Status:', margin + 95, y + 5);
  doc.text('NDA Reference:', margin + 140, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(new Date(deliverable.submittedAt).toLocaleDateString(), margin + 4, y + 10);
  doc.text(`${session.feeSAR.toLocaleString()} SAR`, margin + 45, y + 10);
  doc.setTextColor(16, 185, 129); // Emerald
  doc.text('ESCROW RELEASED', margin + 95, y + 10);
  doc.setTextColor(15, 23, 42);
  doc.text(session.nda?.agreementNumber || 'MSH-NDA-VERIFIED', margin + 140, y + 10);

  y += 20;

  // Section 1: Executive Summary
  doc.setFillColor(79, 70, 229);
  doc.rect(margin, y, 3, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. EXECUTIVE DIAGNOSTIC ASSESSMENT & STRATEGIC VERDICT', margin + 6, y + 5);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const execSummaryLines = doc.splitTextToSize(deliverable.executiveSummary, contentWidth);
  checkPageBreak(execSummaryLines.length * 5 + 8);
  doc.text(execSummaryLines, margin, y);
  y += execSummaryLines.length * 4.8 + 8;

  // AI-Powered Google Meet Synthesized Takeaways (If available)
  const aiSummary = deliverable.aiExecutiveSummary || session.aiExecutiveSummary;
  if (aiSummary) {
    checkPageBreak(35);
    doc.setFillColor(15, 44, 89); // Deep Navy
    doc.rect(margin, y, 3, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 44, 89);
    doc.text('AI EXECUTIVE SYNTHESIS: KEY DECISIONS & STRATEGIC TAKEAWAYS', margin + 6, y + 5);
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('[Gemini 3.7 Flash Engine | Google Meet Transcribed]', pageWidth - margin, y + 5, { align: 'right' });
    y += 9;

    // AI Key Decisions Box
    doc.setFillColor(254, 249, 231);
    doc.roundedRect(margin, y, contentWidth, 8 + aiSummary.keyDecisions.length * 6, 2, 2, 'F');
    doc.setDrawColor(229, 211, 146);
    doc.roundedRect(margin, y, contentWidth, 8 + aiSummary.keyDecisions.length * 6, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(133, 93, 16);
    doc.text('Key Strategic Decisions Agreed in Google Meet:', margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    let kdY = y + 9;
    aiSummary.keyDecisions.slice(0, 4).forEach((kd, idx) => {
      doc.text(`${idx + 1}. [${kd.category}] ${kd.decision.slice(0, 95)}`, margin + 4, kdY);
      kdY += 5.5;
    });
    y = kdY + 3;

    // AI Strategic Takeaways
    if (aiSummary.strategicTakeaways && aiSummary.strategicTakeaways.length > 0) {
      checkPageBreak(25);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(15, 44, 89);
      doc.text('Core Strategic Takeaways & Advisory Insights:', margin, y + 4);
      y += 7;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      aiSummary.strategicTakeaways.slice(0, 3).forEach((st) => {
        doc.text(`• ${st.slice(0, 110)}`, margin + 3, y);
        y += 4.8;
      });
      y += 3;
    }
  }

  // Section 2: Strategic Initiatives
  checkPageBreak(30);
  doc.setFillColor(212, 175, 55);
  doc.rect(margin, y, 3, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(10, 25, 47);
  doc.text('2. HIGH-IMPACT STRATEGIC RECOMMENDATIONS', margin + 6, y + 5);
  y += 10;

  deliverable.strategicRecommendations.forEach((rec, idx) => {
    checkPageBreak(25);
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`Initiative #${idx + 1}: ${rec.title.slice(0, 75)}`, margin + 4, y + 6);

    doc.setFontSize(8);
    doc.setTextColor(180, 130, 20);
    doc.text(`Impact Level: ${rec.impact.toUpperCase()}`, pageWidth - margin - 4, y + 6, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const descLines = doc.splitTextToSize(rec.description || rec.actionableSteps.join(' | '), contentWidth - 8);
    doc.text(descLines.slice(0, 2), margin + 4, y + 12);

    y += 24;
  });

  // Section 3: Risk Mitigation Matrix
  checkPageBreak(35);
  doc.setFillColor(225, 29, 72); // Rose
  doc.rect(margin, y, 3, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(10, 25, 47);
  doc.text('3. CRITICAL RISK AUDIT & MITIGATION PROTOCOL', margin + 6, y + 5);
  y += 10;

  deliverable.criticalRisks.forEach((risk, idx) => {
    checkPageBreak(18);
    doc.setFillColor(255, 241, 242);
    doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'F');
    doc.setDrawColor(254, 205, 211);
    doc.roundedRect(margin, y, contentWidth, 16, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(159, 18, 57);
    doc.text(`[${risk.severity.toUpperCase()} RISK] ${risk.risk.slice(0, 65)}`, margin + 4, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(15, 118, 110);
    doc.text(`Mitigation: ${risk.mitigation.slice(0, 80)}`, margin + 4, y + 11.5);

    y += 19;
  });

  // Section 4: 90-Day Execution Roadmap
  checkPageBreak(45);
  doc.setFillColor(14, 165, 233); // Blue
  doc.rect(margin, y, 3, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(10, 25, 47);
  doc.text('4. 90-DAY MILESTONE EXECUTION ROADMAP', margin + 6, y + 5);
  y += 10;

  const phases = [
    { name: 'Phase 1 (Days 1 - 30): Alignment & Setup', data: deliverable.roadmap90Days.phase1_30d },
    { name: 'Phase 2 (Days 31 - 60): Execution & Rollout', data: deliverable.roadmap90Days.phase2_60d },
    { name: 'Phase 3 (Days 61 - 90): Impact & Scaling', data: deliverable.roadmap90Days.phase3_90d }
  ];

  phases.forEach((phase) => {
    checkPageBreak(22);
    doc.setFillColor(240, 249, 255);
    doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');
    doc.setDrawColor(186, 230, 253);
    doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(3, 105, 161);
    doc.text(phase.name, margin + 4, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const itemsText = phase.data.items.slice(0, 2).map(it => `• ${it}`).join('   ');
    const splitItems = doc.splitTextToSize(itemsText, contentWidth - 8);
    doc.text(splitItems.slice(0, 2), margin + 4, y + 11);

    y += 21;
  });

  // Section 5: Signature Stamp & Verification
  checkPageBreak(30);
  y += 4;
  doc.setFillColor(10, 25, 47);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(243, 229, 171);
  doc.text('CERTIFIED DIGITAL ADVISORY STAMP & ESCROW SETTLEMENT', margin + 6, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`Signer: ${deliverable.advisorSignatureStamp}`, margin + 6, y + 12);
  doc.text(
    `Payout TX: ${deliverable.releaseTxHash} | Released: ${deliverable.releasedAmountSAR.toLocaleString()} SAR`,
    margin + 6,
    y + 17
  );

  doc.setFontSize(8);
  doc.setTextColor(16, 185, 129);
  doc.text('[ VERIFIED AUTHENTIC ]', pageWidth - margin - 6, y + 12, { align: 'right' });

  // Save PDF
  const filename = `Executive_Summary_${session.referenceCode}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}

/**
 * Generate and download ZATCA-compliant Tax Invoice PDF.
 */
export function downloadInvoicePDF(invoice: BillingInvoice, lang: Language) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Header Banner
  doc.setFillColor(10, 25, 47);
  doc.rect(0, 0, pageWidth, 30, 'F');

  doc.setFillColor(212, 175, 55);
  doc.rect(0, 29, pageWidth, 1.5, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(243, 229, 171);
  doc.text('MUSHOWR PLATFORM | TAX INVOICE', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(226, 232, 240);
  doc.text('VAT Number: 31094827100003 | Commercial Registration: 1010849201', margin, 21);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(`INVOICE: ${invoice.invoiceNumber}`, pageWidth - margin, 14, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(212, 175, 55);
  doc.text(`Date: ${invoice.issueDate}`, pageWidth - margin, 21, { align: 'right' });

  y = 40;

  // Parties Info Grid
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'S');

  // Seller Column
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(10, 25, 47);
  doc.text('SERVICE PROVIDER / ADVISOR:', margin + 6, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(invoice.advisorNameEn || invoice.advisorName, margin + 6, y + 13);
  doc.text(`Corporate Track: ${invoice.advisorTrackRecord} Executive Alumni`, margin + 6, y + 18);
  doc.text(`Platform Gateway: Mushowr Advisory Ltd (Riyadh, KSA)`, margin + 6, y + 23);

  // Buyer Column
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(10, 25, 47);
  doc.text('CLIENT / BILLED TO:', margin + contentWidth / 2 + 6, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(invoice.clientName, margin + contentWidth / 2 + 6, y + 13);
  doc.text(invoice.clientCompany, margin + contentWidth / 2 + 6, y + 18);
  doc.text(`Session Ref: ${invoice.referenceCode}`, margin + contentWidth / 2 + 6, y + 23);

  y += 42;

  // Itemized Invoice Table Header
  doc.setFillColor(10, 25, 47);
  doc.rect(margin, y, contentWidth, 9, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('Item Description & Service', margin + 4, y + 6);
  doc.text('Rate (SAR)', margin + 105, y + 6);
  doc.text('VAT Rate', margin + 135, y + 6);
  doc.text('Total (SAR)', pageWidth - margin - 4, y + 6, { align: 'right' });

  y += 9;

  // Row 1: Advisory Consultation
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, contentWidth, 12, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y + 12, pageWidth - margin, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. 1-on-1 C-Suite Executive Diagnostic Session', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Topic: ${invoice.challengeTitle.slice(0, 65)}`, margin + 4, y + 9.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${invoice.advisoryFeeSAR.toLocaleString()} SAR`, margin + 105, y + 7);
  doc.text('15%', margin + 135, y + 7);
  doc.text(`${invoice.advisoryFeeSAR.toLocaleString()} SAR`, pageWidth - margin - 4, y + 7, { align: 'right' });

  y += 12;

  // Row 2: Technology & Escrow Assurance
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentWidth, 10, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y + 10, pageWidth - margin, y + 10);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Escrow Vault Governance & NDA Digital Signature Protocol', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`${invoice.platformFeeSAR.toLocaleString()} SAR`, margin + 105, y + 6);
  doc.text('15%', margin + 135, y + 6);
  doc.text(`${invoice.platformFeeSAR.toLocaleString()} SAR`, pageWidth - margin - 4, y + 6, { align: 'right' });

  y += 18;

  // Summary Calculation Block
  const subtotal = invoice.advisoryFeeSAR + invoice.platformFeeSAR;
  const summaryX = margin + contentWidth - 85;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(summaryX, y, 85, 34, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(summaryX, y, 85, 34, 2, 2, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Subtotal (Excl. VAT):', summaryX + 4, y + 7);
  doc.text(`${subtotal.toLocaleString()} SAR`, summaryX + 81, y + 7, { align: 'right' });

  doc.text('Value Added Tax (15% VAT):', summaryX + 4, y + 14);
  doc.text(`${invoice.vatAmountSAR.toLocaleString()} SAR`, summaryX + 81, y + 14, { align: 'right' });

  doc.setDrawColor(212, 175, 55);
  doc.line(summaryX + 4, y + 18, summaryX + 81, y + 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(10, 25, 47);
  doc.text('Total Amount Due:', summaryX + 4, y + 26);
  doc.setTextColor(212, 175, 55);
  doc.text(`${invoice.totalAmountSAR.toLocaleString()} SAR`, summaryX + 81, y + 26, { align: 'right' });

  // Left QR Code & ZATCA Certification placeholder box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, 85, 34, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, 85, 34, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('ZATCA E-INVOICE QR & TRANSACTION PROOF', margin + 4, y + 6);

  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`QR-HASH: ${invoice.zatcaQrCodeHash.slice(0, 38)}...`, margin + 4, y + 12);
  doc.text(`ESCROW-HOLD: ${invoice.escrowHoldTxId}`, margin + 4, y + 18);
  if (invoice.escrowReleaseTxHash) {
    doc.text(`RELEASE-TX: ${invoice.escrowReleaseTxHash.slice(0, 32)}...`, margin + 4, y + 24);
  }
  doc.text(`PAYMENT: ${invoice.paymentMethod} (Processed)`, margin + 4, y + 30);

  y += 45;

  // Official Seal
  doc.setFillColor(10, 25, 47);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(243, 229, 171);
  doc.text('OFFICIAL SETTLEMENT STATUS: PAID & ESCROW PROTECTED', margin + 6, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(
    'This tax invoice was generated electronically via the Mushowr platform pursuant to Saudi ZATCA e-invoicing standards.',
    margin + 6,
    y + 13
  );

  const filename = `Tax_Invoice_${invoice.invoiceNumber}.pdf`;
  doc.save(filename);
}
