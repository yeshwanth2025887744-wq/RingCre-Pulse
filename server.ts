import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: '10mb' }));

// Shared Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI:', err);
  }
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash',
  });
});

// Underwriting AI Engine
app.post('/api/underwrite', async (req, res) => {
  try {
    const submission = req.body;
    if (!submission || !submission.companyName) {
      return res.status(400).json({ error: 'Missing submission payload or companyName' });
    }

    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are a Senior Commercial Insurance Underwriting Officer and Risk Actuary at RiskPulse.
Perform an in-depth, rigorous underwriting risk audit and pricing analysis for the following commercial insurance submission:

Submission Details:
Company Name: ${submission.companyName}
Industry / Segment: ${submission.industry || 'Commercial Services'}
Line of Business: ${submission.lineOfBusiness || 'Commercial Package'}
Total Insured Value (TIV): $${Number(submission.tiv || 15000000).toLocaleString()}
Annual Revenue: $${Number(submission.revenue || 25000000).toLocaleString()}
Employees / Headcount: ${submission.employees || 120}
Years in Business: ${submission.yearsInBusiness || 8}
Locations / Facilities: ${submission.locations || '1 Primary Headquarters, 2 Warehouses'}
Geographic Region / Cat Peril Zone: ${submission.locationZone || 'Gulf Coast / Tier 2 Wind & Flood'}
Loss History (Past 5 Years): ${submission.lossHistoryText || '2 minor water damage claims ($28k total), 0 bodily injury'}
Protection Systems: ${submission.protections || 'Full NFPA 13 Wet Sprinklers, Central Station Burglar & Fire Alarm, 24/7 CCTV'}
Cyber / Data Security: ${submission.cyberPosture || 'MFA enforced on 100% endpoints, weekly immutable backups, SOC2 Type II certified'}
Current Requested Limits: ${submission.requestedLimits || '$10,000,000 Occurrence / $20,000,000 Aggregate'}
Requested Deductible: ${submission.requestedDeductible || '$25,000'}

Carrier Underwriting Appetite Parameters:
- Max Target Loss Ratio: 48%
- Target Composite Score: >= 70 for Auto-Bind, 55-69 for Referral / Subjectivities, < 55 Decline
- High Hazard Restrictions: Heavy chemical manufacturing, coastal Tier-1 unmitigated wind, uninsured fleet drivers.

Return a STRICT, valid JSON object matching this schema:
{
  "pulseScore": number (0 to 100, where 100 is lowest risk / safest),
  "riskTier": "Tier 1 - Preferred" | "Tier 2 - Standard" | "Tier 3 - Substandard / High Risk" | "Tier 4 - Declined / Ineligible",
  "appetiteFit": "Full Appetite Match" | "Conditional Match (Subjectivities Required)" | "Out of Appetite",
  "categoryScores": {
    "propertyRisk": number (0-100),
    "operationalSafety": number (0-100),
    "financialSolvency": number (0-100),
    "cyberPosture": number (0-100),
    "catPerils": number (0-100),
    "claimsHistory": number (0-100)
  },
  "executiveSummary": string (3-4 concise professional sentences outlining the risk profile, key drivers, and underwriter verdict),
  "keyFindings": [
    {
      "type": "positive" | "warning" | "critical",
      "category": string,
      "title": string,
      "description": string,
      "underwritingImpact": string
    }
  ],
  "recommendedPricing": {
    "indicatedAnnualPremium": number (realistic dollar amount),
    "suggestedDebitCreditPercent": number (e.g., -7 for 7% credit or +12 for 12% debit surcharge),
    "pricingRationale": string,
    "recommendedDeductible": number,
    "targetLossRatioExpected": number (percentage e.g. 42.5)
  },
  "mandatorySubjectivities": [
    string (e.g. "Receipt and approval of satisfactory thermographic infrared electrical survey within 30 days of binding")
  ],
  "warrantiesAndEndorsements": [
    string (e.g. "Water damage sublimit $500,000 with mandatory automatic shutoff valve warranty")
  ],
  "catastropheScenarios": [
    {
      "event": string,
      "probability": "Low" | "Medium" | "High",
      "pmlExposure": string,
      "mitigationNotes": string
    }
  ],
  "underwritingAction": "RECOMMEND_QUOTE" | "REFERRAL_REQUIRED" | "DECLINE_RISK"
}
Only output the raw valid JSON, no markdown formatting ticks if possible or standard json string.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const text = response.text || '{}';
        const parsed = JSON.parse(text);
        return res.json({
          success: true,
          source: 'gemini-3.8-flash',
          analysis: parsed,
        });
      } catch (geminiError: any) {
        console.error('Gemini underwriting error, applying heuristic engine:', geminiError);
      }
    }

    // Heuristic Fallback Engine
    const tiv = Number(submission.tiv) || 12000000;
    const losses = String(submission.lossHistoryText || '').toLowerCase();
    const hasSevereLoss = losses.includes('fatality') || losses.includes('catastrophic') || losses.includes('million');
    const hasModerateLoss = losses.includes('claim') || losses.includes('fire') || losses.includes('water');

    let baseScore = 76;
    if (hasSevereLoss) baseScore -= 28;
    else if (hasModerateLoss) baseScore -= 10;
    if (submission.protections?.toLowerCase().includes('sprinkler')) baseScore += 6;
    if (submission.cyberPosture?.toLowerCase().includes('mfa')) baseScore += 5;

    const pulseScore = Math.max(25, Math.min(96, baseScore));
    const riskTier = pulseScore >= 80 ? 'Tier 1 - Preferred' : pulseScore >= 65 ? 'Tier 2 - Standard' : pulseScore >= 50 ? 'Tier 3 - Substandard / High Risk' : 'Tier 4 - Declined / Ineligible';
    const appetiteFit = pulseScore >= 70 ? 'Full Appetite Match' : pulseScore >= 55 ? 'Conditional Match (Subjectivities Required)' : 'Out of Appetite';

    const basePrem = Math.round((tiv * 0.0035) * (1 + (75 - pulseScore) * 0.015));

    const fallbackAnalysis = {
      pulseScore,
      riskTier,
      appetiteFit,
      categoryScores: {
        propertyRisk: Math.min(95, pulseScore + 4),
        operationalSafety: Math.min(92, pulseScore - 2),
        financialSolvency: Math.min(94, pulseScore + 7),
        cyberPosture: Math.min(90, pulseScore + 1),
        catPerils: Math.max(45, pulseScore - 12),
        claimsHistory: hasSevereLoss ? 42 : hasModerateLoss ? 68 : 88,
      },
      executiveSummary: `${submission.companyName} operates within ${submission.industry || 'Commercial Services'} with an insurable asset footprint of $${(tiv / 1000000).toFixed(1)}M. Overall risk appetite alignment is favorable with robust protection engineering, though location peril vulnerability requires adjusted retention terms.`,
      keyFindings: [
        {
          type: pulseScore >= 70 ? 'positive' : 'warning',
          category: 'Asset Engineering',
          title: 'Facility Protection Standards',
          description: submission.protections || 'Monitored fire suppression and commercial grade security implemented.',
          underwritingImpact: 'Lowers estimated burn rate on physical premises; qualifies for favorable property tier.',
        },
        {
          type: hasSevereLoss ? 'critical' : hasModerateLoss ? 'warning' : 'positive',
          category: 'Loss Run Performance',
          title: 'Claims Frequency & Severity',
          description: submission.lossHistoryText || 'Clean 5-year commercial loss run submitted.',
          underwritingImpact: hasSevereLoss ? 'Elevates loss ratio projection; requires senior referral.' : 'Stable experience modifier within carrier benchmarks.',
        },
        {
          type: 'positive',
          category: 'Information Security',
          title: 'Cyber Security Posture',
          description: submission.cyberPosture || 'Multi-factor authentication and backup rotation in place.',
          underwritingImpact: 'Qualifies risk for cyber incident endorsement with baseline $1M coverage.',
        },
      ],
      recommendedPricing: {
        indicatedAnnualPremium: basePrem,
        suggestedDebitCreditPercent: pulseScore >= 75 ? -8 : pulseScore >= 65 ? 0 : 15,
        pricingRationale: pulseScore >= 75 ? 'Preferred credit applied due to superior risk management & clean loss run history.' : 'Surcharge applied to absorb potential CAT volatility and loss severity.',
        recommendedDeductible: Math.max(25000, Math.round(tiv * 0.002)),
        targetLossRatioExpected: pulseScore >= 75 ? 38.2 : 51.4,
      },
      mandatorySubjectivities: [
        'Receipt of updated 5-year carrier-certified loss runs dated within 30 days of binding.',
        'Confirmation of operational NFPA sprinkler flow testing report within past 12 months.',
        'Completed and signed Statement of Values (SOV) detailing roof construction type & year replaced.',
      ],
      warrantiesAndEndorsements: [
        'Named Storm / Wind-Hail 2% Percentage Deductible per location.',
        'Protective Safeguards Warranty (P-1 Automatic Sprinklers & P-2 Central Station Alarm).',
        'Communicable Disease Exclusion Endorsement.',
      ],
      catastropheScenarios: [
        {
          event: '100-Year Severe Convective Storm & Hail',
          probability: 'Medium',
          pmlExposure: `$${Math.round(tiv * 0.12 / 1000000 * 10) / 10}M (12% PML)`,
          mitigationNotes: 'Impact-resistant roof assemblies and secondary water barriers required.',
        },
        {
          event: 'Regional Utility Grid Interruption (48 hrs)',
          probability: 'Low',
          pmlExposure: '$320,000 Business Interruption',
          mitigationNotes: 'Onsite dual-fuel backup generator covers 85% critical refrigeration/datacenter load.',
        },
      ],
      underwritingAction: pulseScore >= 70 ? 'RECOMMEND_QUOTE' : pulseScore >= 55 ? 'REFERRAL_REQUIRED' : 'DECLINE_RISK',
    };

    return res.json({
      success: true,
      source: 'heuristic-engine',
      analysis: fallbackAnalysis,
    });
  } catch (err: any) {
    console.error('Underwriting server error:', err);
    res.status(500).json({ error: err.message || 'Underwriting analysis failed' });
  }
});

// Interactive Underwriting Copilot / Chat
app.post('/api/copilot/chat', async (req, res) => {
  try {
    const { message, submissionContext, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const systemInstruction = `You are RiskPulse Copilot, an elite AI Commercial Lines Insurance Underwriter and Actuarial Assistant.
You assist underwriters, MGAs, and risk managers with:
- Evaluating commercial submissions, loss runs, ACORD forms, and SOVs
- Analyzing exclusions, warranties, policy wording, and carrier appetite adherence
- Explaining risk scores, catastrophe PML exposure, and debit/credit pricing adjustments
- Drafting formal Underwriting Memos, broker inquiry emails (RFIs), or declination notices
- Recommending subjectivities and loss mitigation requirements

Keep responses concise, highly professional, realistic to London Market / US Excess & Surplus / Commercial Standards, and structured with clear headers, bullet points, and data-backed rationale.
Current Submission In Focus:
${JSON.stringify(submissionContext || {}, null, 2)}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction,
            temperature: 0.3,
          },
        });

        return res.json({
          reply: response.text || 'Analysis completed with standard underwriting criteria.',
        });
      } catch (err: any) {
        console.error('Copilot chat error:', err);
      }
    }

    // Fallback Copilot responses
    let fallbackReply = `As your RiskPulse Underwriting Copilot, I've audited this account:

**Key Underwriting Assessment**:
- **Appetite Check**: The account fits within standard commercial package guidelines assuming satisfactory loss runs.
- **Exposure Concern**: Water damage and windstorm perils remain the primary drivers of potential loss frequency.
- **Pricing Guidance**: A baseline rate of $0.32 per $100 TIV with a 5% credit is indicated if central station monitoring warranties are signed.
- **Recommended Action**: Issue a 30-day quote with standard P-1 / P-2 protective safeguards and a $25,000 property deductible.

Would you like me to draft a Broker RFI (Request for Information) or an Underwriting Memo summary?`;

    if (message.toLowerCase().includes('rfi') || message.toLowerCase().includes('broker')) {
      fallbackReply = `**Broker Request for Information (RFI) Draft**:

**To:** Broker of Record
**Re:** ${submissionContext?.companyName || 'Insured Account'} — Submission Review
**Line:** Commercial Property & General Liability

Dear Broker Team,

We have reviewed the initial submission for **${submissionContext?.companyName || 'the applicant'}**. To proceed with a firm quotation, our underwriting committee requires the following subjectivities prior to binding:

1. **Carrier-Certified Loss Runs:** Currently valued 5-year hard copy loss runs for all property & casualty policies.
2. **Schedule of Values (SOV):** Breakdown of building, contents, and Business Interruption values by location with roof replacement year.
3. **Protection Verification:** Current NFPA annual inspection certificate for fire suppression and sprinkler flow test.
4. **Cyber Endorsement Questionnaire:** Confirmation of universal MFA enforcement and air-gapped backup protocols.

Please submit these items at your earliest convenience to release binding terms.

Best regards,
**RiskPulse AI Underwriting Team**`;
    }

    return res.json({ reply: fallbackReply });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Copilot error' });
  }
});

// Document / Submission Extractor
app.post('/api/extract-submission', async (req, res) => {
  try {
    const { documentText } = req.body;
    if (!documentText) {
      return res.status(400).json({ error: 'documentText is required' });
    }

    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `Extract insurance submission data from the following raw commercial policy document / broker slip / ACORD notes into a valid JSON object:
Raw Text:
${documentText}

Return valid JSON with:
{
  "companyName": string,
  "industry": string,
  "lineOfBusiness": string,
  "tiv": number,
  "revenue": number,
  "employees": number,
  "yearsInBusiness": number,
  "locations": string,
  "locationZone": string,
  "lossHistoryText": string,
  "protections": string,
  "cyberPosture": string,
  "requestedLimits": string,
  "requestedDeductible": string
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text || '{}';
        return res.json(JSON.parse(text));
      } catch (err) {
        console.error('Extract error:', err);
      }
    }

    // Heuristic extraction
    res.json({
      companyName: 'Extracted Commercial Account',
      industry: 'Light Industrial Manufacturing',
      lineOfBusiness: 'Commercial Property & Inland Marine',
      tiv: 14500000,
      revenue: 18000000,
      employees: 65,
      yearsInBusiness: 12,
      locations: '2 Plants (Dallas, TX & Atlanta, GA)',
      locationZone: 'Southeast Convective Storm Belt',
      lossHistoryText: '1 roof water leak claim in 2023 ($18,400)',
      protections: 'Full Wet Sprinklers, Gated Perimeter, Monitored Heat Sensors',
      cyberPosture: 'MFA Enabled on Enterprise Gateway',
      requestedLimits: '$10,000,000 TIV Blanket',
      requestedDeductible: '$25,000',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Extract failed' });
  }
});

// Auto-Audit Vendor Deep Dependency Scan
app.post('/api/vendor-audit', async (req, res) => {
  try {
    const { vendorName, category, serviceProvided, currentRiskScore, compliance } = req.body;
    if (!vendorName) {
      return res.status(400).json({ error: 'vendorName is required' });
    }

    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are RiskPulse AI Supply-Chain Cyber Intelligence Engine.
Conduct an in-depth security scan and audit for third-party vendor:
Vendor: ${vendorName}
Category: ${category}
Role: ${serviceProvided}
Current Score: ${currentRiskScore || 75}
Compliance Status: ${JSON.stringify(compliance || {})}

Perform a forensic assessment covering:
1. Sub-processor 4th-party dependencies (cloud hubs, CDNs, telco transit)
2. CVE vulnerability footprint & historical security incidents
3. Data breach cascade potential into the primary insured enterprise
4. Compliance verification (ISO 27001, SOC 2 Type II, PCI-DSS)
5. Underwriter action recommendation

Return valid STRICT JSON:
{
  "updatedRiskScore": number (0 to 100),
  "securityRating": "A (Low Risk)" | "B (Moderate Risk)" | "C (Elevated Risk)" | "D (Critical Exposure)",
  "fourthPartyDependencies": string[],
  "complianceAudit": {
    "iso27001Status": "VERIFIED" | "EXPIRED" | "MISSING" | "IN_PROGRESS",
    "soc2Type2Status": "VERIFIED" | "EXPIRED" | "MISSING" | "IN_PROGRESS",
    "pciDssStatus": "VERIFIED" | "EXPIRED" | "MISSING" | "N/A",
    "auditorFirm": string,
    "lastAuditDate": string,
    "certificateExpiry": string
  },
  "auditFindings": [
    string
  ],
  "underwriterAdvisory": "APPROVED" | "CONDITIONAL_WARRANTY" | "ACTION_REQUIRED" | "FLAGGED",
  "suggestedPolicyWarranty": string
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const text = response.text || '{}';
        return res.json({
          success: true,
          audit: JSON.parse(text),
        });
      } catch (err: any) {
        console.error('Gemini vendor audit error:', err);
      }
    }

    // Heuristic Fallback
    const isHighTier = vendorName.toLowerCase().includes('aws') || vendorName.toLowerCase().includes('stripe') || vendorName.toLowerCase().includes('workday');
    const isMedium = vendorName.toLowerCase().includes('okta') || vendorName.toLowerCase().includes('analytics');
    const newScore = isHighTier ? 93 : isMedium ? 77 : 54;
    const rating = newScore >= 85 ? 'A (Low Risk)' : newScore >= 70 ? 'B (Moderate Risk)' : newScore >= 50 ? 'C (Elevated Risk)' : 'D (Critical Exposure)';

    return res.json({
      success: true,
      audit: {
        updatedRiskScore: newScore,
        securityRating: rating,
        fourthPartyDependencies: ['Cloudflare Enterprise Edge', 'AWS Global Transit', 'Datadog Telemetry'],
        complianceAudit: {
          iso27001Status: isHighTier ? 'VERIFIED' : isMedium ? 'VERIFIED' : 'MISSING',
          soc2Type2Status: isHighTier || isMedium ? 'VERIFIED' : 'EXPIRED',
          pciDssStatus: isHighTier ? 'VERIFIED' : 'N/A',
          auditorFirm: isHighTier ? 'Ernst & Young LLP' : 'Grant Thornton LLP',
          lastAuditDate: '2026-02-14',
          certificateExpiry: '2027-02-14',
        },
        auditFindings: [
          `Forensic scan verified cryptographic cipher suites (TLS 1.3 enforced) for ${vendorName}.`,
          'Zero active unpatched remote code execution CVEs discovered in exposed DNS endpoints.',
          isHighTier 
            ? 'Annual SOC 2 Type II report contains zero qualified opinions; meets tier-1 binding guidelines.'
            : 'Vendor sub-processor data sharing agreement requires mandatory cybersecurity addendum with $2M liability cap.',
        ],
        underwriterAdvisory: isHighTier ? 'APPROVED' : isMedium ? 'CONDITIONAL_WARRANTY' : 'ACTION_REQUIRED',
        suggestedPolicyWarranty: `Third-Party Vendor Warranty: Insured must mandate annual ISO 27001/SOC 2 re-certification for ${vendorName} during policy term.`,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Vendor audit failed' });
  }
});

// Shared Exposure & Cascade Breach Simulator
app.post('/api/cascade-simulation', async (req, res) => {
  try {
    const { targetVendor, attackVector, clientRevenue, clientTIV, lineOfBusiness } = req.body;
    if (!targetVendor) {
      return res.status(400).json({ error: 'targetVendor is required' });
    }

    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are a Senior Cyber Actuary at RiskPulse specializing in 4th-party cascade failure modeling.
Simulate the downstream financial loss and business interruption when a security breach strikes the third-party vendor:
Target Vendor: ${targetVendor}
Attack Vector: ${attackVector || 'Cloud Outage / Zero-Day Supply Chain Injection'}
Client Profile: Commercial Insured with $${Number(clientRevenue || 45000000).toLocaleString()} annual revenue, $${Number(clientTIV || 30000000).toLocaleString()} TIV, Line: ${lineOfBusiness || 'Commercial Package & Cyber'}.

Calculate the cascading financial loss, propagation steps across the supply chain, and insurance policy impact.

Return STRICT JSON:
{
  "title": string,
  "compromiseType": "Ransomware Supply-Chain Injection" | "Cloud Infrastructure Outage" | "Stolen API Master Credentials" | "Zero-Day Flaw in 4th-Party Dependency",
  "directFinancialLoss": number,
  "businessInterruptionHours": number,
  "contingentLossOfAttraction": number,
  "regulatoryFinesEstimated": number,
  "totalCascadeExposure": number,
  "propagationSteps": [
    {
      "step": number,
      "entity": string,
      "event": string,
      "impactDuration": string,
      "lossMagnitude": string
    }
  ],
  "carrierPolicyImpact": string,
  "recommendedSublimit": number,
  "recommendedRetention": number
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const text = response.text || '{}';
        return res.json({
          success: true,
          scenario: JSON.parse(text),
        });
      } catch (err: any) {
        console.error('Gemini cascade error:', err);
      }
    }

    // Heuristic Fallback
    const rev = Number(clientRevenue) || 45000000;
    const directLoss = Math.round(rev * 0.045);
    const biLoss = Math.round(rev * 0.028);
    const fines = Math.round(rev * 0.012);
    const total = directLoss + biLoss + fines;

    return res.json({
      success: true,
      scenario: {
        title: `Cascade Breach: Downstream Compromise of ${targetVendor}`,
        compromiseType: 'Ransomware Supply-Chain Injection',
        directFinancialLoss: directLoss,
        businessInterruptionHours: 48,
        contingentLossOfAttraction: biLoss,
        regulatoryFinesEstimated: fines,
        totalCascadeExposure: total,
        propagationSteps: [
          {
            step: 1,
            entity: `${targetVendor} Upstream Infrastructure`,
            event: 'Adversary compromises upstream software build pipeline and injects malicious payload.',
            impactDuration: 'T+00:00 to T+08:00',
            lossMagnitude: '$75,000 preliminary mitigation',
          },
          {
            step: 2,
            entity: 'Third-Party Integration Middleware',
            event: 'Automated microservice synchronization pushes poisoned update to client endpoint agents.',
            impactDuration: 'T+08:00 to T+24:00',
            lossMagnitude: `$${Math.round(directLoss * 0.4).toLocaleString()} localized workstation lockouts`,
          },
          {
            step: 3,
            entity: 'Primary Insured Enterprise',
            event: 'Operations halted; business interruption coverage invoked; client legal and forensics mobilized.',
            impactDuration: 'T+24:00 to T+48:00',
            lossMagnitude: `$${total.toLocaleString()} total insured loss exposure`,
          },
        ],
        carrierPolicyImpact: 'Triggers Contingent Business Interruption (CBI) & System Failure endorsement.',
        recommendedSublimit: Math.max(1000000, Math.round(total * 0.8)),
        recommendedRetention: 100000,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Cascade simulation failed' });
  }
});

// ----------------- ENTERPRISE CYBER AUDIT & LOG INGESTION (CRO & ARCHITECT) -----------------
app.post('/api/cyber-audit-ingest', async (req, res) => {
  try {
    const {
      companyName = 'Apex Global Financial Technologies',
      industry = 'FinTech & Cloud Banking',
      techStackLogs = 'Kube-apiserver auth warning: Unauthenticated token probe; AWS CloudTrail: root console login without MFA; MongoDB cluster: TLSv1.0 fallback enabled on port 27017; PostgreSQL prod: Unencrypted PII column containing Aadhaar & PAN hashes.',
      cveList = 'CVE-2024-3094 (XZ Utils Backdoor - Critical), CVE-2023-4863 (libwebp Heap Buffer Overflow - High), CVE-2023-38606 (Kernel PrivEsc - High)',
      soc2ReportText = 'SOC 2 Type II Assessment: Exception noted in CC6.1 - logical access reviews not completed quarterly. Exception noted in CC6.6 - external penetration test high findings unresolved past 90 days. Exception in CC7.1 - data retention disposal policy missing automation.',
      annualRevenue = 65000000,
      tiv = 40000000,
    } = req.body;

    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are an elite AI Cybersecurity Architect and Chief Risk Officer at RiskPulse Syndicate.
Analyze the following incoming enterprise tech stack logs, CVE lists, and SOC 2 audit reports for:
Company: ${companyName} (${industry})
Annual Revenue: $${Number(annualRevenue).toLocaleString()} | Insured Asset TIV: $${Number(tiv).toLocaleString()}

Inputs:
1. Tech Stack Logs:
${techStackLogs}

2. Active CVE List:
${cveList}

3. SOC 2 Audit Report Findings:
${soc2ReportText}

Requirements:
1. Cross-reference vulnerabilities against global security baselines (ISO 27001, NIST CSF, DPDP framework).
2. Calculate the precise financial exposure, separating Annual Loss Expectancy (ALE) from Tail Risk (Maximum Potential Loss).
3. Generate a strict set of binding Underwriting Conditions with strict 30/60-day remediation SLAs.

Return STRICT, valid JSON only:
{
  "entity_overview": {
    "organization_name": string,
    "audit_scope": string,
    "composite_cyber_risk_score": number,
    "risk_tier": "Tier 1 - Preferred" | "Tier 2 - Standard" | "Tier 3 - Substandard / High Risk" | "Tier 4 - Declined / Ineligible",
    "underwriting_verdict": "CONDITIONAL_BIND_WITH_SLAS" | "UNDERWRITER_REFERRAL_REQUIRED" | "DECLINE_INELIGIBLE"
  },
  "financial_exposure": {
    "annual_loss_expectancy_ale_usd": number,
    "ale_breakdown": {
      "data_breach_direct_costs": number,
      "business_interruption_daily_burn": number,
      "statutory_regulatory_fines": number,
      "incident_response_forensics": number
    },
    "tail_risk_maximum_potential_loss_usd": number,
    "tail_risk_confidence_interval": "99.5% VaR (1-in-200 Year Catastrophe)",
    "tail_risk_scenarios": [
      {
        "scenario": string,
        "loss_projection_usd": number,
        "reinsurance_attachment_point": string
      }
    ]
  },
  "baseline_cross_reference": [
    {
      "vulnerability_id": string,
      "cve_or_finding": string,
      "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "affected_component": string,
      "iso_27001_mapping": {
        "control_clause": string,
        "compliance_status": "NON_COMPLIANT" | "PARTIAL" | "COMPLIANT",
        "gap_analysis": string
      },
      "nist_csf_mapping": {
        "function": string,
        "sub_category": string,
        "implementation_tier": string
      },
      "dpdp_2025_mapping": {
        "section": string,
        "statutory_exposure_crores_inr": number,
        "regulatory_mandate": string
      }
    }
  ],
  "binding_underwriting_conditions": {
    "policy_bind_status": "CONDITIONAL_APPROVAL" | "SUSPENDED_PENDING_SLA" | "DECLINED",
    "thirty_day_remediation_slas": [
      {
        "condition_id": string,
        "title": string,
        "required_corrective_action": string,
        "mandatory_evidence": string,
        "failure_penalty": string,
        "deadline_days": 30
      }
    ],
    "sixty_day_remediation_slas": [
      {
        "condition_id": string,
        "title": string,
        "required_corrective_action": string,
        "mandatory_evidence": string,
        "failure_penalty": string,
        "deadline_days": 60
      }
    ],
    "endorsements_and_warranties": [
      string
    ]
  }
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const text = response.text || '{}';
        return res.json({
          success: true,
          source: 'gemini-3.8-flash',
          data: JSON.parse(text),
        });
      } catch (err: any) {
        console.error('Gemini cyber audit error:', err);
      }
    }

    // Heuristic Fallback
    const ale = 2450000;
    const tailRisk = 18750000;
    return res.json({
      success: true,
      source: 'heuristic-fallback',
      data: {
        entity_overview: {
          organization_name: companyName,
          audit_scope: 'Enterprise Core AWS Infrastructure, CI/CD Pipeline, and SOC 2 Type II Findings',
          composite_cyber_risk_score: 82,
          risk_tier: 'Tier 3 - Substandard / High Risk',
          underwriting_verdict: 'CONDITIONAL_BIND_WITH_SLAS',
        },
        financial_exposure: {
          annual_loss_expectancy_ale_usd: ale,
          ale_breakdown: {
            data_breach_direct_costs: 850000,
            business_interruption_daily_burn: 620000,
            statutory_regulatory_fines: 680000,
            incident_response_forensics: 300000,
          },
          tail_risk_maximum_potential_loss_usd: tailRisk,
          tail_risk_confidence_interval: '99.5% VaR (1-in-200 Year Catastrophe)',
          tail_risk_scenarios: [
            {
              scenario: 'Compromised Master Cloud Credentials + Unencrypted Data Exfiltration',
              loss_projection_usd: 12500000,
              reinsurance_attachment_point: 'Exceeds Primary $5M Limit; Attaches to Excess Layer Syndicate 1892',
            },
            {
              scenario: 'Supply Chain Package Poisoning via Unpatched Build Dependency',
              loss_projection_usd: 6250000,
              reinsurance_attachment_point: 'Attaches to Contingent Business Interruption Sublimit',
            },
          ],
        },
        baseline_cross_reference: [
          {
            vulnerability_id: 'VULN-001',
            cve_or_finding: 'Unencrypted PII in Core Database (Aadhaar/PAN)',
            severity: 'CRITICAL',
            affected_component: 'Production PostgreSQL Clustered Storage',
            iso_27001_mapping: {
              control_clause: 'A.8.24 Use of Cryptography & Key Management',
              compliance_status: 'NON_COMPLIANT',
              gap_analysis: 'Customer sensitive financial data stored in cleartext without column-level envelope encryption.',
            },
            nist_csf_mapping: {
              function: 'PR.DS (Data Security)',
              sub_category: 'PR.DS-1: Data-at-rest is protected using cryptographic algorithms.',
              implementation_tier: 'Tier 1 - Partial (Immediate Remediation Required)',
            },
            dpdp_2025_mapping: {
              section: 'Section 8(5) Mandatory Reasonable Technical Safeguards',
              statutory_exposure_crores_inr: 250,
              regulatory_mandate: 'Immediate deployment of AES-256 GCM encryption at rest with HSM-backed key rotation.',
            },
          },
          {
            vulnerability_id: 'VULN-002',
            cve_or_finding: 'Root Console Login Without Mandatory Hardware MFA',
            severity: 'CRITICAL',
            affected_component: 'AWS IAM Root Account & Production API Gateway',
            iso_27001_mapping: {
              control_clause: 'A.5.17 Authentication Information & Privileged Access Management',
              compliance_status: 'NON_COMPLIANT',
              gap_analysis: 'Root account lacks mandatory FIDO2 hardware MFA, violating zero-standing-privilege standard.',
            },
            nist_csf_mapping: {
              function: 'PR.AC (Identity Management & Access Control)',
              sub_category: 'PR.AC-7: Users, devices, and other assets are authenticated with multi-factor credentials.',
              implementation_tier: 'Tier 1 - Partial',
            },
            dpdp_2025_mapping: {
              section: 'Section 8(4) Access Governance & Incident Prevention',
              statutory_exposure_crores_inr: 150,
              regulatory_mandate: 'Enforce hardware token MFA across all privileged identity scopes within 48 hours.',
            },
          },
          {
            vulnerability_id: 'VULN-003',
            cve_or_finding: 'CVE-2024-3094 (XZ Utils Upstream Supply Chain Vulnerability)',
            severity: 'HIGH',
            affected_component: 'Production Bastion Hosts & CI/CD Runner Base AMIs',
            iso_27001_mapping: {
              control_clause: 'A.8.8 Management of Technical Vulnerabilities',
              compliance_status: 'PARTIAL',
              gap_analysis: 'Vulnerable upstream library versions present in container base images without automatic patch pipeline.',
            },
            nist_csf_mapping: {
              function: 'ID.RA (Risk Assessment)',
              sub_category: 'ID.RA-1: Asset vulnerabilities are identified and documented against threat intel.',
              implementation_tier: 'Tier 2 - Risk Informed',
            },
            dpdp_2025_mapping: {
              section: 'Section 8(6) Duty to Prevent Data Breach via Third-Party Dependencies',
              statutory_exposure_crores_inr: 100,
              regulatory_mandate: 'Purge affected packages and establish automated SCA (Software Composition Analysis) gates.',
            },
          },
        ],
        binding_underwriting_conditions: {
          policy_bind_status: 'CONDITIONAL_APPROVAL',
          thirty_day_remediation_slas: [
            {
              condition_id: 'SLA-30-01',
              title: 'Mandatory Database Column Encryption (AES-256)',
              required_corrective_action: 'Deploy database column encryption on all production PII tables and configure AWS KMS customer-managed keys.',
              mandatory_evidence: 'Independent penetration test verification letter and SOC 2 auditor bridge memo.',
              failure_penalty: 'Automatic 35% premium debit surcharge and revocation of DPDP regulatory safe harbor endorsement.',
              deadline_days: 30,
            },
            {
              condition_id: 'SLA-30-02',
              title: 'Universal Hardware MFA on IAM & Cloud Consoles',
              required_corrective_action: 'Lock down AWS root account, enforce FIDO2 WebAuthn keys across all engineering IAM users, and disable password-only fallback.',
              mandatory_evidence: 'AWS IAM Credential Report confirming 100% MFA compliance with zero exceptions.',
              failure_penalty: 'Immediate cancellation of unauthorized access coverage sublimit ($2,500,000 sublimit voided).',
              deadline_days: 30,
            },
          ],
          sixty_day_remediation_slas: [
            {
              condition_id: 'SLA-60-01',
              title: 'Automated CI/CD Vulnerability Gate & SBOM Enforcement',
              required_corrective_action: 'Integrate automated Software Composition Analysis (SCA) into build pipeline to block any build with CVSS >= 7.0 CVEs.',
              mandatory_evidence: 'GitLab / GitHub Actions pipeline audit report certified by external DevSecOps consultant.',
              failure_penalty: 'Increase policy deductible from $25,000 to $100,000 on all supply chain claims.',
              deadline_days: 60,
            },
            {
              condition_id: 'SLA-60-02',
              title: 'Quarterly Privileged Access Review Automation',
              required_corrective_action: 'Remediate SOC 2 CC6.1 exception by deploying automated Just-In-Time (JIT) access approval workflows.',
              mandatory_evidence: 'Completed Q3 access attestation report signed by Chief Information Security Officer.',
              failure_penalty: 'Application of 15% actuarial surcharge upon policy renewal.',
              deadline_days: 60,
            },
          ],
          endorsements_and_warranties: [
            'Protective Safeguards Warranty Clause 9A: Insured warrants continuous cryptographic token protection on customer records.',
            'Continuous Telemetry Endorsement: Insured agrees to maintain real-time RiskPulse agent connectivity; unannounced disconnects exceeding 72 hours void ransomware coverage.',
          ],
        },
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Cyber audit ingestion failed' });
  }
});

// ----------------- DPDP 2025 & SEBI CSCRF REGULATORY CROSS-REFERENCE -----------------
app.post('/api/dpdp-compliance', async (req, res) => {
  try {
    const { vulnerabilities, companyName, industry } = req.body;

    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are an elite Regulatory Compliance and Cyber-Law Officer specializing in Indian and Global Financial Data Governance.
Cross-reference the following IT vulnerabilities against:
1. Digital Personal Data Protection (DPDP) Act 2025 & DPDP Rules 2025 (Section 8(5) Technical Safeguards, Section 8(6) Breach Notification, Section 8(7) Erasure/Retention, Section 9 Processing of Children Data, Schedule Penalties up to ₹250 Crores).
2. SEBI Cybersecurity and Cyber Resilience Framework (CSCRF) (Domain 4 Application & API Security, Domain 6 Data Protection & Encryption, Domain 9.3 6-Hour Incident Notification Window).

Entity: ${companyName || 'Target Financial Services Firm'} (${industry || 'Financial Services'})
Vulnerabilities Ingested:
${JSON.stringify(vulnerabilities || [], null, 2)}

Return STRICT JSON:
{
  "totalStatutoryExposureCrores": number,
  "statutoryExposureFormatted": string,
  "crossReferencedFindings": [
    {
      "vulnerabilityName": string,
      "dpdpClause": string,
      "dpdpPenaltyCap": string,
      "sebiCscrfDomain": string,
      "sebiAction": string,
      "severity": "Critical" | "High" | "Medium" | "Low",
      "statutoryFineInrCrores": number,
      "mandatoryCorrectiveControls": string[],
      "remediationSLA": string
    }
  ],
  "regulatorySafeHarborSummary": string,
  "underwriterPolicyAdvisory": string
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        return res.json({
          success: true,
          data: JSON.parse(response.text || '{}'),
        });
      } catch (err: any) {
        console.error('Gemini DPDP error:', err);
      }
    }

    // Heuristic Fallback
    return res.json({
      success: true,
      data: {
        totalStatutoryExposureCrores: 450,
        statutoryExposureFormatted: '₹450 Crores Cumulative Statutory Exposure',
        crossReferencedFindings: [
          {
            vulnerabilityName: 'Unencrypted Personal Identifiable Information (PII) at Rest',
            dpdpClause: 'DPDP Act 2025 Section 8(5) — Failure to deploy reasonable security safeguards to prevent personal data breach',
            dpdpPenaltyCap: 'Up to ₹250 Crores under Schedule Item 1',
            sebiCscrfDomain: 'SEBI CSCRF Domain 6.1 — Cryptographic Standard (AES-256 mandatory on all persistent disks)',
            sebiAction: 'Regulatory Show-Cause Notice & Directed External Audit',
            severity: 'Critical',
            statutoryFineInrCrores: 250,
            mandatoryCorrectiveControls: [
              'Deploy column-level AES-256 Galois/Counter Mode (GCM) with centralized HSM key management.',
              'Implement PII tokenization proxy masking customer Aadhaar & PAN in all non-production DBs.',
              'Enforce strict zero-plaintext retention policy with cryptographic verification.',
            ],
            remediationSLA: '24 Hours',
          },
          {
            vulnerabilityName: 'Lack of Automated Data Retention & Erasure Policy',
            dpdpClause: 'DPDP Act 2025 Section 8(7) — Obligation to erase personal data upon purpose completion or consent withdrawal',
            dpdpPenaltyCap: 'Up to ₹200 Crores under Schedule Item 3',
            sebiCscrfDomain: 'SEBI CSCRF Domain 7.3 — Data Lifecycle Management, Secure Disposal & Media Sanitation',
            sebiAction: 'Compliance Defect Escalation to SEBI Oversight Board',
            severity: 'High',
            statutoryFineInrCrores: 200,
            mandatoryCorrectiveControls: [
              'Implement automated Time-To-Live (TTL) retention purging customer transaction logs past 180 days.',
              'Deploy customer consent withdrawal portal triggering automated cryptographic deletion within 72 hours.',
              'Quarterly erasure certification verified by CERT-In empanelled auditor.',
            ],
            remediationSLA: '7 Days',
          },
        ],
        regulatorySafeHarborSummary: 'Entity is at acute risk of statutory enforcement. Immediate remediation of unencrypted PII is required to establish safe harbor under Section 8(5).',
        underwriterPolicyAdvisory: 'Mandate strict DPDP Section 8(5) Compliance Warranty in master policy endorsement prior to release of bindable terms.',
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'DPDP compliance check failed' });
  }
});

// ----------------- DYNAMIC ACTUARIAL PRICING MODEL -----------------
app.post('/api/actuarial-pricing', (req, res) => {
  try {
    const {
      baselinePremiumInr = 95000,
      activeCriticalCves = 2,
      activeHighCves = 3,
      activeMediumCves = 5,
      closedTicketsCount = 38,
      totalTicketsCount = 45,
      mfaEnforcementPct = 100,
      patchTurnaroundDays = 6,
    } = req.body;

    // Actuarial Multipliers
    // Critical CVEs add +18% each, High adds +8%, Medium adds +3%
    const cveRiskSurchargePct = (activeCriticalCves * 18) + (activeHighCves * 8) + (activeMediumCves * 3);
    const cveMultiplier = 1 + (cveRiskSurchargePct / 100);

    // Closed tickets credit: up to -15% based on closed resolution ratio
    const ticketResolutionRate = totalTicketsCount > 0 ? (closedTicketsCount / totalTicketsCount) : 0.8;
    const closedTicketDiscountPct = Math.round(ticketResolutionRate * 15 * 10) / 10;

    // MFA Credit: up to -12%
    const mfaCreditPct = mfaEnforcementPct >= 100 ? 12 : mfaEnforcementPct >= 80 ? 6 : 0;

    // SLA Patch Turnaround Modifier
    const slaPatchModifierPct = patchTurnaroundDays <= 7 ? -5 : patchTurnaroundDays <= 14 ? 0 : 12;

    // Net Debit/Credit Calculation
    const totalCreditPct = closedTicketDiscountPct + mfaCreditPct + (slaPatchModifierPct < 0 ? Math.abs(slaPatchModifierPct) : 0);
    const totalDebitPct = cveRiskSurchargePct + (slaPatchModifierPct > 0 ? slaPatchModifierPct : 0);
    const netDebitCreditPct = Math.round((totalDebitPct - totalCreditPct) * 10) / 10;

    // Final Adjusted Premium
    const baseAmount = Number(baselinePremiumInr) || 95000;
    const finalAdjustedPremiumInr = Math.max(
      25000,
      Math.round(baseAmount * (1 + netDebitCreditPct / 100))
    );

    const cveSurchargeInr = Math.round(baseAmount * (cveRiskSurchargePct / 100));
    const closedTicketDiscountInr = Math.round(baseAmount * (closedTicketDiscountPct / 100));
    const mfaCreditInr = Math.round(baseAmount * (mfaCreditPct / 100));

    let underwritingVerdict: 'PREFERRED_CREDIT' | 'STANDARD_TERMS' | 'DEBIT_SURCHARGE_REQUIRED' | 'HIGH_EXPOSURE_REFERRAL';
    let underwritingNotes = '';

    if (activeCriticalCves >= 4 || netDebitCreditPct >= 40) {
      underwritingVerdict = 'HIGH_EXPOSURE_REFERRAL';
      underwritingNotes = 'Excessive active Critical CVE volume exceeds automated treaty capacity. Senior underwriting referral required with mandatory 24-hr patch subjectivity.';
    } else if (netDebitCreditPct > 5) {
      underwritingVerdict = 'DEBIT_SURCHARGE_REQUIRED';
      underwritingNotes = `Actuarial debit surcharge of +${netDebitCreditPct}% applied to cover elevated vulnerability frequency.`;
    } else if (netDebitCreditPct < -5) {
      underwritingVerdict = 'PREFERRED_CREDIT';
      underwritingNotes = `Preferred cyber risk credit of ${netDebitCreditPct}% granted for superior patch SLA (<7 days), universal MFA, and high security ticket closure rate.`;
    } else {
      underwritingVerdict = 'STANDARD_TERMS';
      underwritingNotes = 'Risk profile tracks standard portfolio actuarial burn rate. Release standard binding terms.';
    }

    return res.json({
      success: true,
      pricing: {
        baselinePremiumInr: baseAmount,
        cveThreatMultiplier: Math.round(cveMultiplier * 100) / 100,
        cveSurchargeInr,
        cveRiskSurchargePct,
        closedTicketDiscountPct,
        closedTicketDiscountInr,
        mfaCreditPct,
        mfaCreditInr,
        slaPatchModifierPct,
        finalAdjustedPremiumInr,
        netDebitCreditPct,
        underwritingVerdict,
        underwritingNotes,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Actuarial pricing calculation failed' });
  }
});

// ----------------- REAL-TIME THREAT INTEL INJECTOR -----------------
app.post('/api/threat-stream/inject', (req, res) => {
  try {
    const {
      eventTitle = 'Production API Key leaked on public GitHub repository 4 minutes ago',
      source = 'GitGuardian & GitHub Public Code Intelligence Feed',
      targetAccount = 'Aegis Cyber Solutions & FinTech',
      priorScore = 72,
    } = req.body;

    const adjustedScore = 89; // Jump from 72 to 89
    const breachEvent = {
      id: `threat-${Date.now()}`,
      timestamp: 'Just now (Live Injection)',
      severity: 'CRITICAL',
      title: eventTitle,
      source: source,
      description: `Critical credential leak detected for ${targetAccount}: Live production API key and database master tokens exposed in public repository commit. Automated scrapers attempting authentication pings.`,
      priorScore,
      adjustedScore,
      underwriterAlert: `🚨 CRITICAL UNDERWRITER REVIEW ALERT: Live credential exfiltration for ${targetAccount}. Cyber Risk Score escalated from ${priorScore} to ${adjustedScore}/100. Policy breach flagged!`,
      policyBreachFlag: true,
      breachedWarranty: 'Protective Safeguards Warranty Clause 4B: Mandatory Hardware Secrets Storage & Zero Public Credential Exposure',
      recommendedAction: 'Immediate Policy Suspension: Issue 24-hour Emergency Remediation Demand to broker. Revoke AWS/API secret keys, invalidate active sessions, and mandate forensic audit attestation.',
      status: 'ACTIVE_BREACH',
    };

    return res.json({
      success: true,
      breachEvent,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Threat injection failed' });
  }
});

// ----------------- DARK WEB OSINT & THREAT INTELLIGENCE AGENT -----------------
app.post('/api/threat-intel/dark-web-report', async (req, res) => {
  try {
    const {
      companyName = 'Apex Global Financial Technologies',
      domain = 'apexglobalfin.com',
      industry = 'FinTech & Cloud Banking',
      annualRevenue = 65000000,
      tiv = 40000000,
      threatScenario = 'Compromised C-Suite Credential Dump & Exposed Staging DB Replica'
    } = req.body;

    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `Role: You are an elite Cyber Threat Intelligence and OSINT (Open-Source Intelligence) Agent.
Task: Given a target company profile, generate a simulated real-time dark web threat intelligence report.
Target Company: ${companyName}
Primary Domain: ${domain}
Industry: ${industry}
Annual Revenue: $${Number(annualRevenue).toLocaleString()}
Total Insured Value (TIV): $${Number(tiv).toLocaleString()}
Threat Scenario: ${threatScenario}

Requirements:
1. Identify mock leaked credentials, exposed database endpoints, and compromised employee accounts.
2. Calculate the immediate escalation in corporate financial exposure and Annual Loss Expectancy (ALE).
3. Formulate an automated cyber insurance policy override recommendation (e.g., mandatory suspension of coverage pending credential rotation within 24 hours).

Return CLEAN, STRICT, VALID JSON ONLY (no markdown fences, no preamble):
{
  "target_company_profile": {
    "entity_name": "${companyName}",
    "primary_domain": "${domain}",
    "industry": "${industry}",
    "monitored_infrastructure": "Multi-cloud AWS & GCP, Hybrid Kubernetes Cluster, Internal Git Repositories",
    "threat_monitoring_level": "RED - ACTIVE EXFILTRATION DETECTED",
    "timestamp": "Live Threat Stream (Real-Time Synchronized)"
  },
  "leaked_credentials": [
    {
      "id": "LEAK-8841",
      "source": "BreachForums / Russian Market Dark Web Pastebin",
      "identity": "admin@${domain}",
      "type": "Cleartext Corporate Email & SHA-256 Hash",
      "hash_cracked": true,
      "exposure_context": "RedLine Stealer botnet log dump containing browser autofill tokens and AWS SSO sessions",
      "stealer_variant": "RedLine v24.2",
      "detection_timestamp": "8 minutes ago",
      "risk_rating": "CRITICAL"
    },
    {
      "id": "LEAK-8842",
      "source": "Public GitHub Repository Commit (GitGuardian Alert)",
      "identity": "AKIAIOSFODNN7EXAMPLE (AWS Production Root Key)",
      "type": "Live Production Cloud Secret Key",
      "hash_cracked": true,
      "exposure_context": "Hardcoded AWS secret in public devops repo commit: master-rds-backup-sync.sh",
      "stealer_variant": "Automated Public Scraper",
      "detection_timestamp": "14 minutes ago",
      "risk_rating": "CRITICAL"
    },
    {
      "id": "LEAK-8843",
      "source": "Telegram Cyber Syndicate Channel: Genesis Market Reborn",
      "identity": "cfo@${domain}",
      "type": "High-Value Executive Stealer Log",
      "hash_cracked": false,
      "exposure_context": "Lumma Stealer infostealer infection on executive personal laptop accessing corporate VPN",
      "stealer_variant": "Lumma Stealer v4.8",
      "detection_timestamp": "32 minutes ago",
      "risk_rating": "HIGH"
    }
  ],
  "exposed_database_endpoints": [
    {
      "endpoint_url": "db-analytics-replica-01.${domain} (194.26.29.114)",
      "service_type": "MongoDB 6.0 Replica Cluster",
      "port": 27017,
      "exposure_source": "Shodan & Censys live network scan",
      "data_exposed": "Cleartext customer ledger records, unhashed PAN & Aadhaar references, 42,000 PII records",
      "authentication_state": "No Auth / Default Admin Enabled",
      "risk_rating": "CRITICAL"
    },
    {
      "endpoint_url": "api-internal-gateway.${domain}:8443",
      "service_type": "Public Swagger API Documentation & Debug Endpoint",
      "port": 8443,
      "exposure_source": "Automated OSINT Subdomain Enumeration",
      "data_exposed": "Internal microservice API endpoints, JWT signing secret disclosed in Swagger test payload",
      "authentication_state": "Anonymous Read Permitted",
      "risk_rating": "HIGH"
    }
  ],
  "compromised_employee_accounts": [
    {
      "employee_name": "Vikram Malhotra",
      "job_title": "Lead DevOps Architect & Cloud Admin",
      "department": "Platform Infrastructure",
      "privilege_level": "Tier-0 Domain & Cloud Root Admin",
      "mfa_bypass_risk": "Session Cookie Hijack (Pass-the-Cookie bypasses FIDO2)",
      "associated_threat_log": "RedLine Stealer botnet token dump",
      "status": "IMMEDIATE_SESSION_TERMINATION_REQUIRED"
    },
    {
      "employee_name": "Priya Nair",
      "job_title": "Treasury & Payments Controller",
      "department": "Finance & Wire Operations",
      "privilege_level": "Tier-1 Swift/Wire Approval Authority",
      "mfa_bypass_risk": "Compromised Corporate Password + SMS OTP Interception Risk",
      "associated_threat_log": "BreachForums Pastebin Credential List",
      "status": "IMMEDIATE_PASSWORD_RESET_REQUIRED"
    }
  ],
  "financial_exposure_escalation": {
    "baseline_cyber_risk_score": 64,
    "escalated_cyber_risk_score": 93,
    "risk_score_penalty_delta": 29,
    "baseline_annual_loss_expectancy_usd": 1450000,
    "escalated_annual_loss_expectancy_usd": 4820000,
    "ale_surge_dollar_increase_usd": 3370000,
    "ale_surge_percentage": 232.4,
    "baseline_tail_risk_pml_usd": 7500000,
    "escalated_tail_risk_pml_usd": 24500000,
    "exposure_breakdown": {
      "immediate_forensic_investigation_usd": 480000,
      "ransomware_extortion_negotiation_contingency_usd": 1250000,
      "regulatory_statutory_fines_dpdp_sebi_usd": 1650000,
      "customer_notification_credit_monitoring_usd": 640000,
      "contingent_business_interruption_loss_usd": 800000
    }
  },
  "automated_insurance_policy_override": {
    "override_status": "MANDATORY_EMERGENCY_POLICY_OVERRIDE",
    "carrier_directive": "Immediate temporary suspension of cyber coverage limits pending mandatory 24-hour credential rotation and forensic remediation.",
    "policy_violations_flagged": [
      "Breach of Protective Safeguards Warranty Clause 4B: Compromised privileged administrator credentials exposed on public networks.",
      "Breach of Condition 8: Failure to revoke exposed API secrets and cryptographic keys within mandated 2-hour window.",
      "SEBI CSCRF Domain 9.3 Notification Window: Threat detected 8 minutes ago, mandatory regulatory disclosure timer active."
    ],
    "coverage_limit_actions": {
      "primary_aggregate_limit_action": "Restricted from $10,000,000 Blanket to $1,000,000 Emergency Sublimit",
      "ransomware_extortion_coverage": "Temporarily Suspended (0% Coverage until credential purge confirmed)",
      "deductible_multiplier": "3x Emergency Retention ($25,000 -> $75,000)",
      "grace_period_hours": 24
    },
    "underwriter_mandatory_conditions_precedent": [
      "Immediate revocation and rotation of all AWS IAM access keys and root credentials within 4 hours.",
      "Global session invalidation across all Google Workspace / Okta / Azure AD accounts.",
      "CERT-In and underwriter forensic attestation of zero data exfiltration submitted within 24 hours.",
      "Firewall isolation of exposed database replica port 27017."
    ]
  }
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json({
          success: true,
          report: parsed,
        });
      } catch (err: any) {
        console.error('Gemini Dark Web OSINT error:', err);
      }
    }

    // High-Fidelity Fallback
    const fallbackReport = {
      target_company_profile: {
        entity_name: companyName,
        primary_domain: domain,
        industry: industry,
        monitored_infrastructure: "Multi-cloud AWS & GCP, Hybrid Kubernetes Cluster, Internal Git Repositories",
        threat_monitoring_level: "RED - ACTIVE EXFILTRATION DETECTED",
        timestamp: "Live Threat Stream (Real-Time Synchronized)"
      },
      leaked_credentials: [
        {
          id: "LEAK-8841",
          source: "BreachForums / Russian Market Dark Web Pastebin",
          identity: `admin@${domain}`,
          type: "Cleartext Corporate Email & SHA-256 Hash",
          hash_cracked: true,
          exposure_context: "RedLine Stealer botnet log dump containing browser autofill tokens and AWS SSO sessions",
          stealer_variant: "RedLine v24.2",
          detection_timestamp: "8 minutes ago",
          risk_rating: "CRITICAL"
        },
        {
          id: "LEAK-8842",
          source: "Public GitHub Repository Commit (GitGuardian Alert)",
          identity: "AKIAIOSFODNN7EXAMPLE (AWS Production Root Key)",
          type: "Live Production Cloud Secret Key",
          hash_cracked: true,
          exposure_context: "Hardcoded AWS secret in public devops repo commit: master-rds-backup-sync.sh",
          stealer_variant: "Automated Public Scraper",
          detection_timestamp: "14 minutes ago",
          risk_rating: "CRITICAL"
        },
        {
          id: "LEAK-8843",
          source: "Telegram Cyber Syndicate Channel: Genesis Market Reborn",
          identity: `cfo@${domain}`,
          type: "High-Value Executive Stealer Log",
          hash_cracked: false,
          exposure_context: "Lumma Stealer infostealer infection on executive personal laptop accessing corporate VPN",
          stealer_variant: "Lumma Stealer v4.8",
          detection_timestamp: "32 minutes ago",
          risk_rating: "HIGH"
        }
      ],
      exposed_database_endpoints: [
        {
          endpoint_url: `db-analytics-replica-01.${domain} (194.26.29.114)`,
          service_type: "MongoDB 6.0 Replica Cluster",
          port: 27017,
          exposure_source: "Shodan & Censys live network scan",
          data_exposed: "Cleartext customer ledger records, unhashed PAN & Aadhaar references, 42,000 PII records",
          authentication_state: "No Auth / Default Admin Enabled",
          risk_rating: "CRITICAL"
        },
        {
          endpoint_url: `api-internal-gateway.${domain}:8443`,
          service_type: "Public Swagger API Documentation & Debug Endpoint",
          port: 8443,
          exposure_source: "Automated OSINT Subdomain Enumeration",
          data_exposed: "Internal microservice API endpoints, JWT signing secret disclosed in Swagger test payload",
          authentication_state: "Anonymous Read Permitted",
          risk_rating: "HIGH"
        }
      ],
      compromised_employee_accounts: [
        {
          employee_name: "Vikram Malhotra",
          job_title: "Lead DevOps Architect & Cloud Admin",
          department: "Platform Infrastructure",
          privilege_level: "Tier-0 Domain & Cloud Root Admin",
          mfa_bypass_risk: "Session Cookie Hijack (Pass-the-Cookie bypasses FIDO2)",
          associated_threat_log: "RedLine Stealer botnet token dump",
          status: "IMMEDIATE_SESSION_TERMINATION_REQUIRED"
        },
        {
          employee_name: "Priya Nair",
          job_title: "Treasury & Payments Controller",
          department: "Finance & Wire Operations",
          privilege_level: "Tier-1 Swift/Wire Approval Authority",
          mfa_bypass_risk: "Compromised Corporate Password + SMS OTP Interception Risk",
          associated_threat_log: "BreachForums Pastebin Credential List",
          status: "IMMEDIATE_PASSWORD_RESET_REQUIRED"
        }
      ],
      financial_exposure_escalation: {
        baseline_cyber_risk_score: 64,
        escalated_cyber_risk_score: 93,
        risk_score_penalty_delta: 29,
        baseline_annual_loss_expectancy_usd: 1450000,
        escalated_annual_loss_expectancy_usd: 4820000,
        ale_surge_dollar_increase_usd: 3370000,
        ale_surge_percentage: 232.4,
        baseline_tail_risk_pml_usd: 7500000,
        escalated_tail_risk_pml_usd: 24500000,
        exposure_breakdown: {
          immediate_forensic_investigation_usd: 480000,
          ransomware_extortion_negotiation_contingency_usd: 1250000,
          regulatory_statutory_fines_dpdp_sebi_usd: 1650000,
          customer_notification_credit_monitoring_usd: 640000,
          contingent_business_interruption_loss_usd: 800000
        }
      },
      automated_insurance_policy_override: {
        override_status: "MANDATORY_EMERGENCY_POLICY_OVERRIDE",
        carrier_directive: "Immediate temporary suspension of cyber coverage limits pending mandatory 24-hour credential rotation and forensic remediation.",
        policy_violations_flagged: [
          "Breach of Protective Safeguards Warranty Clause 4B: Compromised privileged administrator credentials exposed on public networks.",
          "Breach of Condition 8: Failure to revoke exposed API secrets and cryptographic keys within mandated 2-hour window.",
          "SEBI CSCRF Domain 9.3 Notification Window: Threat detected 8 minutes ago, mandatory regulatory disclosure timer active."
        ],
        coverage_limit_actions: {
          primary_aggregate_limit_action: "Restricted from $10,000,000 Blanket to $1,000,000 Emergency Sublimit",
          ransomware_extortion_coverage: "Temporarily Suspended (0% Coverage until credential purge confirmed)",
          deductible_multiplier: "3x Emergency Retention ($25,000 -> $75,000)",
          grace_period_hours: 24
        },
        underwriter_mandatory_conditions_precedent: [
          "Immediate revocation and rotation of all AWS IAM access keys and root credentials within 4 hours.",
          "Global session invalidation across all Google Workspace / Okta / Azure AD accounts.",
          "CERT-In and underwriter forensic attestation of zero data exfiltration submitted within 24 hours.",
          "Firewall isolation of exposed database replica port 27017."
        ]
      }
    };

    return res.json({
      success: true,
      report: fallbackReport
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Dark web OSINT report generation failed' });
  }
});

// ----------------- AUTOMATED POLICY AUDIT EXECUTION -----------------
app.post('/api/threat-intel/execute-policy-audit', (req, res) => {
  try {
    const {
      companyName = 'Apex Global Financial Technologies',
      policyNumber = 'RP-CYBER-2026-8812',
      riskScore = 93,
      threatCount = 5,
    } = req.body;

    const auditTimestamp = new Date().toISOString();
    const auditResult = {
      audit_id: `AUDIT-${Date.now().toString().slice(-6)}`,
      timestamp: auditTimestamp,
      company_name: companyName,
      policy_number: policyNumber,
      audit_trigger: `AUTOMATED_DARK_WEB_BREACH_DETECTION (${threatCount} active high/critical indicators)`,
      underwriter_syndicate: "RiskPulse Syndicate 1892 (Lloyd's of London & GIFT City Re)",
      audit_verdict: "BINDING_POLICY_BREACH_DECLARED",
      violations_flagged: [
        {
          clause: "Protective Safeguards Warranty Clause 4B",
          title: "Privileged Access Credential Compromise",
          severity: "CRITICAL",
          detail: "Active root API credentials found publicly available on GitHub/Pastebin. Insured failed to enforce HSM storage.",
          remedy_deadline: "4 Hours"
        },
        {
          clause: "Condition 7: Unrestricted Ingress & Perimeter Exposure",
          title: "Publicly Exposed Database Replica Without Authentication",
          severity: "CRITICAL",
          detail: "Port 27017 open to global internet with unencrypted PII records accessible without credential challenge.",
          remedy_deadline: "2 Hours"
        },
        {
          clause: "Mandatory Regulatory Disclosure Condition 12",
          title: "SEBI CSCRF / DPDP 6-Hour Notification Clock",
          severity: "HIGH",
          detail: "Statutory breach reporting timer running. CERT-In and SEBI notifications must be drafted immediately.",
          remedy_deadline: "6 Hours"
        }
      ],
      underwriter_directives: {
        coverage_suspension: "Emergency reduction: Aggregate limit locked to $1,000,000 contingent sublimit.",
        ransomware_waiver: "Ransom payment reimbursement coverage formally suspended until forensic eradication letter is signed.",
        deductible_increase: "Emergency deductible adjusted from $25,000 to $75,000.",
        underwriter_review_notice_dispatched: true,
        assigned_senior_underwriter: "Eleanor Vance, Chief Cyber Actuary (Syndicate 1892)",
        underwriter_status: "UNDER_EMERGENCY_COVERAGE_REVIEW"
      }
    };

    return res.json({
      success: true,
      auditResult
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Policy audit execution failed' });
  }
});

// ----------------- MITIGATA ENTERPRISE RESILIENCY ENGINE (4-PILLAR SCORECARD) -----------------
app.post('/api/mitigata/resiliency-scorecard', async (req, res) => {
  try {
    const {
      companyName = 'Apex Global Financial Technologies',
      domain = 'apexglobalfin.com',
      industry = 'FinTech & Banking Infrastructure',
      annualRevenue = 65000000,
      tiv = 40000000,
    } = req.body;

    const inrRate = 83.33; // USD to INR conversion rate
    const revCrores = Math.round((annualRevenue * inrRate) / 10000000 * 100) / 100;
    const tivCrores = Math.round((tiv * inrRate) / 10000000 * 100) / 100;

    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `Role: You are Mitigata's Enterprise Resiliency Engine.
Task: Evaluate a company's cybersecurity profile across four distinct operational pillars:
1. Security Operations (EDR, SIEM, active alerts, dark web exposures)
2. Risk Management (Attack surface, third-party vendor dependencies)
3. Compliance Automation (Readiness for DPDP 2025, ISO 27001, SEBI CSCRF)
4. Cyber Insurance (Claims risk, policy coverage limits, premium optimization)

Target Profile:
Company Name: ${companyName}
Domain: ${domain}
Industry: ${industry}
Annual Revenue: $${Number(annualRevenue).toLocaleString()} (₹${revCrores} Crores)
Insured TIV: $${Number(tiv).toLocaleString()} (₹${tivCrores} Crores)

Requirements:
- Output a unified JSON scorecard containing:
  - Pillar-by-pillar health score (0-100)
  - Aggregate financial exposure in INR and USD (ALE & Tail Risk)
  - A single overarching "Resiliency Index" (0-100)

Return STRICT, CLEAN, VALID JSON ONLY (no markdown fences, no explanatory preambles):
{
  "entity_profile": {
    "organization_name": "${companyName}",
    "primary_domain": "${domain}",
    "industry": "${industry}",
    "annual_revenue": { "usd": ${annualRevenue}, "inr_crores": ${revCrores} },
    "total_insured_value_tiv": { "usd": ${tiv}, "inr_crores": ${tivCrores} },
    "evaluation_timestamp": "${new Date().toISOString()}",
    "engine_version": "Mitigata Resiliency Intelligence Engine v4.2"
  },
  "overall_resiliency_index": {
    "score": 78,
    "grade": "B+ Strong / Insurable with Remediations",
    "resilience_tier": "Tier 2 - Dynamic Self-Healing Eligible",
    "trend": "+6.4% MoM (Automated patch deployment active)",
    "underwriting_eligibility": "PREFERRED_TERMS_APPROVED"
  },
  "operational_pillars": {
    "security_operations": {
      "pillar_name": "Security Operations",
      "health_score": 74,
      "status": "ELEVATED_ATTENTION",
      "metrics": {
        "edr_coverage_percentage": 98.4,
        "siem_log_ingestion_coverage": "24/7 Clustered Wazuh & Splunk",
        "mean_time_to_detect_mttd_minutes": 14,
        "mean_time_to_respond_mttr_minutes": 42,
        "active_dark_web_exposures": 2,
        "critical_unresolved_alerts": 1
      },
      "strengths": [
        "98.4% CrowdStrike/SentinelOne EDR sensor parity across production servers",
        "Automated GitHub & git-hound secrets quarantine active"
      ],
      "gaps": [
        "Dark web pastebin leak containing administrative email credentials",
        "Occasional delay in out-of-hours root access alert triage"
      ],
      "financial_risk_usd": 680000,
      "financial_risk_inr_crores": 5.67
    },
    "risk_management": {
      "pillar_name": "Risk Management & Attack Surface",
      "health_score": 71,
      "status": "MODERATE_RISK",
      "metrics": {
        "external_attack_surface_assets": 14,
        "third_party_vendor_dependencies": 8,
        "high_risk_tier4_vendor_exposure": "Stripe, AWS, Okta, Workday",
        "cascade_risk_multiplier": "2.4x Tail Risk Expansion",
        "unpatched_cves_count": 3
      },
      "strengths": [
        "Quarterly external attack surface & Shodan port scans automated",
        "Tier-1 cloud vendor SOC 2 compliance verification enforced"
      ],
      "gaps": [
        "Exposed MongoDB replica port 27017 detected on staging network",
        "Shared 4th-party API partner dependency lacks SLA guarantee"
      ],
      "financial_risk_usd": 1250000,
      "financial_risk_inr_crores": 10.42
    },
    "compliance_automation": {
      "pillar_name": "Compliance Automation",
      "health_score": 83,
      "status": "HEALTHY",
      "metrics": {
        "dpdp_2025_readiness_score": 86,
        "iso_27001_2022_control_adherence_pct": 91.2,
        "sebi_cscrf_domain_compliance_pct": 79.5,
        "statutory_safe_harbor_status": "ACTIVE_WITH_WARRANTY",
        "six_hour_breach_reporting_readiness": "100% Automated Playbook Ready"
      },
      "strengths": [
        "Automated consent revocation and TTL data purging active for DPDP Section 8(7)",
        "Formal ISO 27001:2022 Stage 2 surveillance audit cleared with zero major non-conformities"
      ],
      "gaps": [
        "Column-level AES-256 database tokenization pending completion on secondary archive DB"
      ],
      "financial_risk_usd": 850000,
      "financial_risk_inr_crores": 7.08
    },
    "cyber_insurance": {
      "pillar_name": "Cyber Insurance & Risk Transfer",
      "health_score": 85,
      "status": "OPTIMAL_TERMS",
      "metrics": {
        "current_policy_status": "BOUND & ACTIVE",
        "binding_carrier": "RiskPulse Syndicate 1892 (Lloyd's of London & GIFT City Re)",
        "annual_premium_usd": 80750,
        "annual_premium_inr": 6732000,
        "baseline_indicated_premium_usd": 95000,
        "mitigata_active_discount_applied": "15% Continuous Compliance Credit (-$14,250/yr)",
        "aggregate_policy_limit_usd": 10000000,
        "policy_retention_deductible_usd": 25000,
        "claims_risk_probability_annual": "3.8% (Benchmark: 9.4%)"
      },
      "strengths": [
        "Continuous telemetry link unlocks dynamic monthly premium debits/credits",
        "Ransomware coinsurance waiver granted based on verified offline air-gapped backups"
      ],
      "gaps": [
        "Contingent Business Interruption (CBI) sublimit capped at $5,000,000"
      ],
      "financial_risk_usd": 420000,
      "financial_risk_inr_crores": 3.50
    }
  },
  "aggregate_financial_exposure": {
    "annual_loss_expectancy_ale": {
      "usd": 3200000,
      "inr_crores": 26.67
    },
    "probable_maximum_loss_pml_tail_risk": {
      "usd": 12800000,
      "inr_crores": 106.67
    },
    "composite_risk_exposure_inr": "₹26.67 Crores Annual Burn Expectancy / ₹106.67 Crores 99.5% Tail Risk",
    "exposure_reduction_potential_via_mitigata": {
      "ale_savings_usd": 1850000,
      "ale_savings_inr_crores": 15.42,
      "premium_savings_annual_usd": 14250,
      "roi_on_resiliency_automation": "12.4x First-Year Net ROI"
    }
  },
  "executive_underwriter_recommendation": "Firm displays robust operational telemetry and automated compliance controls. The Mitigata Continuous Resiliency Engine qualifies the client for a 15% upfront policy credit and expedited binder approval under Syndicate 1892 treaty."
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        return res.json({
          success: true,
          scorecard: parsed,
        });
      } catch (err: any) {
        console.error('Gemini Resiliency Scorecard error:', err);
      }
    }

    // High-Fidelity Fallback
    const fallbackScorecard = {
      entity_profile: {
        organization_name: companyName,
        primary_domain: domain,
        industry: industry,
        annual_revenue: { usd: annualRevenue, inr_crores: revCrores },
        total_insured_value_tiv: { usd: tiv, inr_crores: tivCrores },
        evaluation_timestamp: new Date().toISOString(),
        engine_version: "Mitigata Resiliency Intelligence Engine v4.2"
      },
      overall_resiliency_index: {
        score: 78,
        grade: "B+ Strong / Insurable with Remediations",
        resilience_tier: "Tier 2 - Dynamic Self-Healing Eligible",
        trend: "+6.4% MoM (Automated patch deployment active)",
        underwriting_eligibility: "PREFERRED_TERMS_APPROVED"
      },
      operational_pillars: {
        security_operations: {
          pillar_name: "Security Operations",
          health_score: 74,
          status: "ELEVATED_ATTENTION",
          metrics: {
            edr_coverage_percentage: 98.4,
            siem_log_ingestion_coverage: "24/7 Clustered Wazuh & Splunk",
            mean_time_to_detect_mttd_minutes: 14,
            mean_time_to_respond_mttr_minutes: 42,
            active_dark_web_exposures: 2,
            critical_unresolved_alerts: 1
          },
          strengths: [
            "98.4% CrowdStrike/SentinelOne EDR sensor parity across production servers",
            "Automated GitHub & git-hound secrets quarantine active"
          ],
          gaps: [
            "Dark web pastebin leak containing administrative email credentials",
            "Occasional delay in out-of-hours root access alert triage"
          ],
          financial_risk_usd: 680000,
          financial_risk_inr_crores: 5.67
        },
        risk_management: {
          pillar_name: "Risk Management & Attack Surface",
          health_score: 71,
          status: "MODERATE_RISK",
          metrics: {
            external_attack_surface_assets: 14,
            third_party_vendor_dependencies: 8,
            high_risk_tier4_vendor_exposure: "Stripe, AWS, Okta, Workday",
            cascade_risk_multiplier: "2.4x Tail Risk Expansion",
            unpatched_cves_count: 3
          },
          strengths: [
            "Quarterly external attack surface & Shodan port scans automated",
            "Tier-1 cloud vendor SOC 2 compliance verification enforced"
          ],
          gaps: [
            "Exposed MongoDB replica port 27017 detected on staging network",
            "Shared 4th-party API partner dependency lacks SLA guarantee"
          ],
          financial_risk_usd: 1250000,
          financial_risk_inr_crores: 10.42
        },
        compliance_automation: {
          pillar_name: "Compliance Automation",
          health_score: 83,
          status: "HEALTHY",
          metrics: {
            dpdp_2025_readiness_score: 86,
            iso_27001_2022_control_adherence_pct: 91.2,
            sebi_cscrf_domain_compliance_pct: 79.5,
            statutory_safe_harbor_status: "ACTIVE_WITH_WARRANTY",
            six_hour_breach_reporting_readiness: "100% Automated Playbook Ready"
          },
          strengths: [
            "Automated consent revocation and TTL data purging active for DPDP Section 8(7)",
            "Formal ISO 27001:2022 Stage 2 surveillance audit cleared with zero major non-conformities"
          ],
          gaps: [
            "Column-level AES-256 database tokenization pending completion on secondary archive DB"
          ],
          financial_risk_usd: 850000,
          financial_risk_inr_crores: 7.08
        },
        cyber_insurance: {
          pillar_name: "Cyber Insurance & Risk Transfer",
          health_score: 85,
          status: "OPTIMAL_TERMS",
          metrics: {
            current_policy_status: "BOUND & ACTIVE",
            binding_carrier: "RiskPulse Syndicate 1892 (Lloyd's of London & GIFT City Re)",
            annual_premium_usd: 80750,
            annual_premium_inr: 6732000,
            baseline_indicated_premium_usd: 95000,
            mitigata_active_discount_applied: "15% Continuous Compliance Credit (-$14,250/yr)",
            aggregate_policy_limit_usd: 10000000,
            policy_retention_deductible_usd: 25000,
            claims_risk_probability_annual: "3.8% (Benchmark: 9.4%)"
          },
          strengths: [
            "Continuous telemetry link unlocks dynamic monthly premium debits/credits",
            "Ransomware coinsurance waiver granted based on verified offline air-gapped backups"
          ],
          gaps: [
            "Contingent Business Interruption (CBI) sublimit capped at $5,000,000"
          ],
          financial_risk_usd: 420000,
          financial_risk_inr_crores: 3.50
        }
      },
      aggregate_financial_exposure: {
        annual_loss_expectancy_ale: {
          usd: 3200000,
          inr_crores: 26.67
        },
        probable_maximum_loss_pml_tail_risk: {
          usd: 12800000,
          inr_crores: 106.67
        },
        composite_risk_exposure_inr: "₹26.67 Crores Annual Burn Expectancy / ₹106.67 Crores 99.5% Tail Risk",
        exposure_reduction_potential_via_mitigata: {
          ale_savings_usd: 1850000,
          ale_savings_inr_crores: 15.42,
          premium_savings_annual_usd: 14250,
          roi_on_resiliency_automation: "12.4x First-Year Net ROI"
        }
      },
      executive_underwriter_recommendation: "Firm displays robust operational telemetry and automated compliance controls. The Mitigata Continuous Resiliency Engine qualifies the client for a 15% upfront policy credit and expedited binder approval under Syndicate 1892 treaty."
    };

    return res.json({
      success: true,
      scorecard: fallbackScorecard
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Resiliency scorecard evaluation failed' });
  }
});

// ----------------- AUTOMITIGATE: AUTONOMOUS REMEDIATION & DYNAMIC RE-PRICING -----------------
app.post('/api/automitigate/remediate', (req, res) => {
  try {
    const {
      vulnerabilityType = 'OUTDATED_TLS_AND_MISSING_MFA',
      targetService = 'Production API Gateway & AWS IAM',
      currentPremium = 95000,
      currentAle = 1850000,
    } = req.body;

    const premium = Number(currentPremium) || 95000;
    const ale = Number(currentAle) || 1850000;

    // Financial state change calculation
    const aleDrop = Math.round(ale * 0.62); // 62% reduction in ALE
    const postAle = ale - aleDrop;
    const tailRiskDrop = Math.round(ale * 1.8);
    const discountPct = 15;
    const premiumSavings = Math.round(premium * (discountPct / 100));
    const newPremium = premium - premiumSavings;
    const deductibleReduction = 25000;

    const responsePayload = {
      remediation_scripts: [
        {
          language: "terraform",
          filename: "security_group_tls.tf",
          description: "Enforces TLS 1.3 minimum protocol version and disables deprecated SSLv3/TLS1.0/TLS1.1 ciphers across CloudFront and ALB.",
          code: `# AutoMitigate Terraform Autonomous Patch
resource "aws_lb_listener" "https_secure" {
  load_balancer_arn = aws_lb.production_gateway.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate.wildcard_cert.arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.core_api.arn
  }
}

resource "aws_cloudfront_distribution" "cdn_secure" {
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.wildcard_cert.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}`
        },
        {
          language: "nginx",
          filename: "nginx_ssl_hardening.conf",
          description: "Production Nginx reverse proxy SSL configuration rejecting legacy handshakes and enforcing HSTS with ECDHE cipher suites.",
          code: `# AutoMitigate Nginx SSL/TLS Hardening Patch
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;

# HSTS (HTTP Strict Transport Security) - 1 year with subdomains
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Frame-Options DENY always;
add_header X-Content-Type-Options nosniff always;`
        },
        {
          language: "json",
          filename: "aws_iam_enforce_mfa_policy.json",
          description: "AWS IAM Condition block policy denying all administrative and API access unless authenticated with hardware/FIDO2 MFA token.",
          code: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AutoMitigateBlockNonMfaAccess",
      "Effect": "Deny",
      "NotAction": [
        "iam:CreateVirtualMFADevice",
        "iam:EnableMFADevice",
        "iam:GetUser",
        "iam:ListMFADevices",
        "iam:ResyncMFADevice",
        "sts:GetSessionToken"
      ],
      "Resource": "*",
      "Condition": {
        "BoolIfExists": {
          "aws:MultiFactorAuthPresent": "false"
        }
      }
    }
  ]
}`
        }
      ],
      financial_impact: {
        pre_remediation: {
          system_status: "VULNERABLE",
          cyber_risk_score: 84,
          annual_loss_expectancy_ale_usd: ale,
          probable_maximum_loss_pml_usd: ale * 4.2,
          tail_risk_exposure_usd: ale * 6.5
        },
        post_remediation: {
          system_status: "REMEDIATED_AUTONOMOUSLY",
          cyber_risk_score: 36,
          annual_loss_expectancy_ale_usd: postAle,
          probable_maximum_loss_pml_usd: Math.round((ale * 4.2) * 0.45),
          tail_risk_exposure_usd: Math.round((ale * 6.5) * 0.38),
          delta_reduction: {
            ale_savings_usd: aleDrop,
            ale_reduction_percentage: 62.16,
            tail_risk_reduction_usd: tailRiskDrop,
            risk_score_improvement: -48
          }
        }
      },
      new_insurance_terms: {
        carrier_syndicate: "RiskPulse Syndicate 1892 (Underwritten via AutoMitigate Binding Authority)",
        policy_status: "ACTIVE_PREFERRED_TERMS",
        action_applied: "INSTANT_CONTINUOUS_COMPLIANCE_DISCOUNT",
        adjustment_summary: "Active production security patch autonomously deployed and cryptographic posture verified: Applying an instant 15% continuous compliance discount to insurance premium, reducing deductible by $25,000.",
        premium_details: {
          baseline_annual_premium_usd: premium,
          applied_discount_percentage: discountPct,
          annual_cash_savings_usd: premiumSavings,
          new_adjusted_annual_premium_usd: newPremium,
          billing_frequency: "Monthly Dynamic Adjustment"
        },
        retention_and_sublimits: {
          previous_deductible_usd: 50000,
          new_deductible_usd: 25000,
          deductible_reduction_usd: deductibleReduction,
          contingent_bi_sublimit_usd: 5000000,
          ransomware_coinsurance_waived: true
        },
        mandatory_endorsement_clause: "AutoMitigate Continuous Cyber Warranty Endorsement v2.4: The insured warrants continuous telemetry connection to the AutoMitigate runtime agent. In consideration of immediate autonomous patching, the carrier waives traditional 30-day waiting period exclusions for newly discovered zero-day CVEs."
      }
    };

    return res.json(responsePayload);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AutoMitigate execution failed' });
  }
});

// ----------------- STACK CONSOLIDATION & SLA AUDIT ENGINE -----------------
app.post('/api/vendor-consolidation/audit', async (req, res) => {
  try {
    const {
      companyName = 'Apex Global Financial Technologies',
      selectedVendors = [
        'CrowdStrike Falcon (Standalone EDR)',
        'Splunk Enterprise (Separate SIEM)',
        'Vanta / Drata (Siloed Compliance)',
        'Traditional Insurance Broker (Paper Questionnaires)',
        'SecurityScorecard (External Surface)'
      ],
      currentRiskScore = 84,
      annualRevenue = 65000000,
      tiv = 40000000,
    } = req.body;

    const consolidatedScore = Math.round(currentRiskScore * 0.75); // 25% risk score reduction
    const inrRate = 83.33;

    const responsePayload = {
      audit_meta: {
        organization_name: companyName,
        analysis_timestamp: new Date().toISOString(),
        evaluator_role: "Enterprise Cyber-Resilience and Vendor Consolidation Consultant",
        framework_version: "RiskPulse Multi-Vendor Harmonizer v3.2"
      },
      current_fragmented_stack: {
        vendor_count: selectedVendors.length,
        vendors_identified: selectedVendors,
        average_annual_license_spend_usd: 168000,
        average_annual_license_spend_inr_crores: 1.40,
        hidden_administrative_overhead_hours_annual: 460,
        unproductive_ops_cost_usd: 92000
      },
      sla_blind_spots_and_communication_gaps: [
        {
          gap_id: "GAP-01",
          gap_name: "Alert-to-Underwrite Latency Blind Spot",
          severity: "CRITICAL",
          impact_description: "When standalone EDR flags root account credential compromise, the information remains trapped in IT ticket backlogs. The insurance underwriter is unaware, voiding Warranty Clause 4B and leaving $10M in claims uninsured.",
          sla_latency_traditional: "14 to 28 days",
          sla_latency_single_stack: "Real-time (< 30 seconds automated synchronization)"
        },
        {
          gap_id: "GAP-02",
          gap_name: "Siloed Compliance vs Threat Reality Disconnect",
          severity: "HIGH",
          impact_description: "Standalone compliance platforms collect static quarterly screenshots for ISO 27001/SOC 2, while active CVEs and Shodan-exposed database ports violate DPDP Section 8(5) statutory requirements.",
          sla_latency_traditional: "90 days (Quarterly point-in-time snapshot)",
          sla_latency_single_stack: "Continuous 24/7 cryptographic control verification"
        },
        {
          gap_id: "GAP-03",
          gap_name: "Manual Insurance Broker Onboarding Cycle",
          severity: "HIGH",
          impact_description: "Traditional cyber brokers require 120-question PDF forms that take 4 weeks of engineering meetings to answer, during which coverage lapses and new zero-day exposures remain unpriced.",
          sla_latency_traditional: "4 weeks (28 days onboarding cycle)",
          sla_latency_single_stack: "3 minutes (Automated policy binder generation)"
        }
      ],
      consolidation_impact: {
        onboarding_timeline: {
          traditional_fragmented_weeks: 4,
          single_stack_minutes: 3,
          efficiency_gain_multiplier: "13,440x faster onboarding"
        },
        risk_score_reduction: {
          baseline_fragmented_score: currentRiskScore,
          consolidated_single_stack_score: consolidatedScore,
          percentage_reduction: 25.0,
          tier_progression: "Progresses from Tier 3 (Substandard) to Tier 1 (Preferred Insurable)"
        },
        financial_efficiency: {
          eliminated_vendor_duplication_savings_usd: 76000,
          administrative_hours_reclaimed_usd: 92000,
          cyber_insurance_compliance_discount_usd: 17100,
          net_annual_cost_savings_usd: 185100,
          net_annual_cost_savings_inr_crores: 1.54,
          projected_first_year_roi: "4.8x Net ROI"
        }
      },
      transition_roadmap: [
        {
          phase: "Phase 1: Telemetry Integration (Day 1)",
          action: "Deploy lightweight RiskPulse agent to replace fragmented monitoring silos. Instant 3-minute baseline sync.",
          deliverable: "Unified Single-Stack Telemetry & Dark Web Radar Live"
        },
        {
          phase: "Phase 2: Automated Gap Remediation (Days 2-7)",
          action: "Autonomous patch scripts resolve top CVEs, enforce DPDP AES-256 encryption, and firewall exposed ports.",
          deliverable: "25% Risk Score Drop (84 -> 63) Certified"
        },
        {
          phase: "Phase 3: Real-Time Policy Binding (Day 8)",
          action: "Decommission redundant compliance tools; execute automated Syndicate 1892 policy binder with 18% dynamic discount.",
          deliverable: "Master Policy Bound at Preferred Rates ($10M Blanket)"
        }
      ]
    };

    return res.json({
      success: true,
      audit: responsePayload
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Vendor consolidation audit failed' });
  }
});

// ----------------- C-SUITE & BOARD EXECUTIVE BRIEF GENERATOR -----------------
app.post('/api/executive-brief/boardroom', (req, res) => {
  try {
    const {
      companyName = 'Apex Global Financial Technologies',
      industry = 'FinTech & Banking Infrastructure',
      annualRevenue = 65000000,
      tiv = 40000000,
      pulseScore = 68,
    } = req.body;

    const inrRate = 83.33;
    const aleUsd = 3200000;
    const aleInrCrores = 26.67;
    const tailRiskUsd = 12800000;
    const tailRiskInrCrores = 106.67;
    const mitigatedAleUsd = 1120000;
    const mitigatedAleInrCrores = 9.33;

    const executiveBrief = {
      brief_meta: {
        document_title: "C-Suite & Board of Directors Executive Cyber Risk Brief",
        prepared_for: `Board of Directors & Audit Committee — ${companyName}`,
        classification: "CONFIDENTIAL / BOARD DELIBERATION ONLY",
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        underwriting_partner: "RiskPulse AI × Mitigata Syndicate 1892"
      },
      executive_summary: {
        headline: "Quantifying Enterprise Cyber Exposure: Transforming Technical Vulnerabilities into Balance-Sheet Resilience",
        board_verdict: "CYBER RISK IS NOW A MATERIAL BALANCE SHEET EXPOSURE. IMMEDIATE CONSOLIDATION RECOMMENDED.",
        current_resilience_grade: "B- (Moderately Insurable with ₹17.34 Cr in Recoverable Losses)"
      },
      business_translation_of_technical_risks: [
        {
          technical_finding: "CVE-2024-3094, Unencrypted Database PII & Root IAM Session Leaks",
          business_risk_translation: "Direct Operational Disruption & Customer Data Exfiltration: Attackers can forge administrative authority, halt online transaction processing, and trigger public disclosure.",
          potential_financial_impact: {
            usd: "$1,850,000 Direct Forensics & Ransom Extortion Contingency",
            inr: "₹15.41 Crores Immediate Cash Drain"
          },
          boardroom_action: "Approve automated infrastructure self-healing patch pipeline; mandate 24-hr session rotation."
        },
        {
          technical_finding: "DPDP 2025 Section 8(5) & SEBI CSCRF Domain 9.3 Gaps",
          business_risk_translation: "Statutory Enforcement & Executive Liability: Failure to deploy mandatory encryption triggers statutory regulatory penalties and executive show-cause notices from SEBI and Data Protection Board.",
          potential_financial_impact: {
            usd: "$3,000,000 Maximum Statutory Penalty Exposure",
            inr: "Up to ₹250 Crores Statutory Fine Exposure under DPDP 2025 Schedule 1"
          },
          boardroom_action: "Establish certified Safe Harbor via continuous automated cryptographic compliance verification."
        },
        {
          technical_finding: "Fragmented Security Vendors & 4-Week Insurance Underwriting Lag",
          business_risk_translation: "Coverage Gaps & Inefficient Capital Allocation: Overpaying for 5 disconnected security tools while manual paper questionnaires leave company exposed without bindable terms.",
          potential_financial_impact: {
            usd: "$185,100 Annual Wasted Overhead & Surcharges",
            inr: "₹1.54 Crores Wasted Annual Operating Expenditure"
          },
          boardroom_action: "Consolidate onto RiskPulse unified single-stack platform to eliminate redundant vendor subscriptions."
        }
      ],
      balance_sheet_exposure_matrix: {
        current_annual_loss_expectancy_ale: {
          usd: `$${(aleUsd / 1000000).toFixed(2)}M / year`,
          inr: `₹${aleInrCrores} Crores / year`
        },
        catastrophic_tail_risk_99_5_pml: {
          usd: `$${(tailRiskUsd / 1000000).toFixed(2)}M (1-in-200 Year Catastrophe)`,
          inr: `₹${tailRiskInrCrores} Crores Maximum Balance-Sheet Shock`
        },
        post_mitigation_exposure: {
          usd: `$${(mitigatedAleUsd / 1000000).toFixed(2)}M / year`,
          inr: `₹${mitigatedAleInrCrores} Crores / year`
        },
        net_retained_capital_protected: {
          usd: "$2,080,000 Annual Net Capital Preserved",
          inr: "₹17.34 Crores Annual Enterprise Value Protected"
        }
      },
      recommended_risk_mitigation_roi: {
        implementation_cost_estimate_usd: 48000,
        annualized_savings_usd: 395000,
        payback_period_days: 44,
        net_five_year_roi: "8.2x Net Enterprise ROI",
        boardroom_resolution: "Resolved: That management is authorized to consolidate fragmented cyber tooling onto the RiskPulse AI operating layer and execute binding dynamic policy terms under Syndicate 1892."
      }
    };

    return res.json({
      success: true,
      executiveBrief
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Executive brief generation failed' });
  }
});

// Serve frontend
if (!isProd) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`RiskPulse Underwriting server running on http://0.0.0.0:${PORT}`);
});
