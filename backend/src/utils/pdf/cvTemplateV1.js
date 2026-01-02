// backend/src/utils/pdf/cvTemplateV2.js
import PDFDocument from "pdfkit";

function sanitizeText(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  const noCtrl = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  return noCtrl.replace(/[ \u00A0]+/g, " ").trim();
}
function sanitizeArray(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map(sanitizeText).filter(Boolean);
}
function sanitizeCvData(cvData) {
  const data = cvData || {};
  const meta = data.meta || {};
  const labels = meta.labels || {};
  const personalInfo = data.personalInfo || {};
  const links = personalInfo.links || {};

  return {
    meta: {
      language: sanitizeText(meta.language),
      labels: Object.fromEntries(
        Object.entries(labels).map(([k, v]) => [k, sanitizeText(v)])
      ),
    },
    personalInfo: {
      fullName: sanitizeText(personalInfo.fullName),
      title: sanitizeText(personalInfo.title),
      location: sanitizeText(personalInfo.location),
      email: sanitizeText(personalInfo.email),
      phone: sanitizeText(personalInfo.phone),
      links: {
        linkedin: sanitizeText(links.linkedin),
        github: sanitizeText(links.github),
        portfolio: sanitizeText(links.portfolio),
      },
    },
    summary: sanitizeText(data.summary),
    skills: {
      technical: sanitizeArray(data.skills?.technical),
      soft: sanitizeArray(data.skills?.soft),
      languages: sanitizeArray(data.skills?.languages),
    },
    experience: Array.isArray(data.experience)
      ? data.experience.map((exp) => ({
          title: sanitizeText(exp?.title),
          company: sanitizeText(exp?.company),
          location: sanitizeText(exp?.location),
          startDate: sanitizeText(exp?.startDate),
          endDate: sanitizeText(exp?.endDate),
          bullets: sanitizeArray(exp?.bullets),
        }))
      : [],
    education: Array.isArray(data.education)
      ? data.education.map((ed) => ({
          degree: sanitizeText(ed?.degree),
          school: sanitizeText(ed?.school),
          location: sanitizeText(ed?.location),
          startDate: sanitizeText(ed?.startDate),
          endDate: sanitizeText(ed?.endDate),
          details: sanitizeArray(ed?.details),
        }))
      : [],
    projects: Array.isArray(data.projects)
      ? data.projects.map((p) => ({
          name: sanitizeText(p?.name),
          description: sanitizeText(p?.description),
          technologies: sanitizeArray(p?.technologies),
        }))
      : [],
    extra: {
      certifications: sanitizeArray(data.extra?.certifications),
      interests: sanitizeArray(data.extra?.interests),
    },
  };
}

export function generateCVPdfFromData(cvDataRaw) {
  const cvData = sanitizeCvData(cvDataRaw);

  const doc = new PDFDocument({ size: "A4", margin: 36 });
  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));

  const {
    meta = {},
    personalInfo = {},
    summary = "",
    skills = {},
    experience = [],
    education = [],
    projects = [],
    extra = {},
  } = cvData;

  const { fullName, title, location, email, phone, links = {} } = personalInfo;
  const { linkedin, github, portfolio } = links;

  const labels = meta.labels || {};
  const L = (key, fallback) => sanitizeText(labels[key]) || fallback;

  const LABELS = {
    profile: L("profile", "Profil"),
    skills: L("skills", "Compétences"),
    experience: L("experience", "Expérience"),
    education: L("education", "Formation"),
    projects: L("projects", "Projets"),
    other: L("other", "Autres"),
    technicalSkills: L("technicalSkills", "Compétences techniques"),
    softSkills: L("softSkills", "Compétences comportementales"),
    languages: L("languages", "Langues"),
    certifications: L("certifications", "Certifications"),
    interests: L("interests", "Centres d’intérêt"),
    technologiesPrefix: L("technologiesPrefix", "Technologies"),
  };

  // ===== STYLE TOKENS =====
  const PAGE_W = doc.page.width;
  const PAGE_H = doc.page.height;
  const M = doc.page.margins.left;

  const ACCENT = "#2563EB"; // modern blue
  const TEXT = "#111827";
  const MUTED = "#6B7280";
  const LINE = "#E5E7EB";
  const SIDEBAR_BG = "#F3F4F6";

  const gap = 12;
  const sidebarW = 190;
  const contentW = PAGE_W - doc.page.margins.left - doc.page.margins.right - sidebarW - gap;

  const sidebarX = doc.page.margins.left;
  const contentX = sidebarX + sidebarW + gap;
  const topY = doc.page.margins.top;

  const toLine = (arr) => (Array.isArray(arr) ? arr.filter(Boolean).join(" • ") : "");

  // ===== HELPERS =====
  function sectionTitle(x, y, w, text) {
    const t = sanitizeText(text);
    if (!t) return y;
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(TEXT)
      .text(t.toUpperCase(), x, y, { width: w });
    // underline
    const underlineY = doc.y + 3;
    doc
      .strokeColor(LINE)
      .lineWidth(1)
      .moveTo(x, underlineY)
      .lineTo(x + w, underlineY)
      .stroke();
    return underlineY + 8;
  }

  function bulletList(x, y, w, items) {
    const list = Array.isArray(items) ? items.filter(Boolean) : [];
    if (!list.length) return y;

    doc.font("Helvetica").fontSize(9.5).fillColor(TEXT);
    for (const it of list) {
      const startY = y;
      doc.text("•", x, y, { width: 10 });
      doc.text(sanitizeText(it), x + 12, y, { width: w - 12 });
      y = doc.y + 2;
      // safety to avoid infinite loops
      if (doc.y === startY) y += 12;
    }
    return y;
  }

  function keyValue(x, y, w, label, value, link) {
    const v = sanitizeText(value);
    if (!v) return y;
    doc.font("Helvetica-Bold").fontSize(9).fillColor(MUTED).text(label, x, y, { width: w });
    doc.font("Helvetica").fontSize(9.5).fillColor(TEXT);
    if (link) doc.text(v, x, doc.y + 2, { width: w, link });
    else doc.text(v, x, doc.y + 2, { width: w });
    return doc.y + 8;
  }

  function ensureSpace(minSpace) {
    if (doc.y + minSpace > PAGE_H - doc.page.margins.bottom) {
      doc.addPage();
      // redraw sidebar background on new page
      drawSidebarBackground();
      // reset cursor top
      doc.y = topY;
    }
  }

  function drawSidebarBackground() {
    doc.save();
    doc
      .rect(sidebarX, 0, sidebarW, PAGE_H)
      .fill(SIDEBAR_BG);
    doc.restore();
  }

  // ===== PAGE BASE =====
  drawSidebarBackground();

  // ===== HEADER (RIGHT) =====
  let yR = topY;

  doc.font("Helvetica-Bold").fontSize(22).fillColor(TEXT).text(fullName || "", contentX, yR, { width: contentW });
  yR = doc.y + 2;

  if (title) {
    doc.font("Helvetica").fontSize(12).fillColor(MUTED).text(title, contentX, yR, { width: contentW });
    yR = doc.y + 10;
  } else {
    yR += 8;
  }

  // Accent bar
  doc.save();
  doc.fillColor(ACCENT).rect(contentX, yR, 64, 3).fill();
  doc.restore();
  yR += 14;

  // ===== SIDEBAR (LEFT) =====
  let yL = topY;

  // Contact block
  yL = sectionTitle(sidebarX + 14, yL, sidebarW - 28, "Contact");
  yL = keyValue(sidebarX + 14, yL, sidebarW - 28, "Localisation", location);
  yL = keyValue(sidebarX + 14, yL, sidebarW - 28, "Email", email, email ? `mailto:${email}` : "");
  yL = keyValue(sidebarX + 14, yL, sidebarW - 28, "Téléphone", phone);

  // Links as clickable
  yL = keyValue(sidebarX + 14, yL, sidebarW - 28, "LinkedIn", linkedin, linkedin ? (linkedin.startsWith("http") ? linkedin : `https://www.linkedin.com${linkedin}`) : "");
  yL = keyValue(sidebarX + 14, yL, sidebarW - 28, "GitHub", github, github);
  yL = keyValue(sidebarX + 14, yL, sidebarW - 28, "Portfolio", portfolio, portfolio);

  // Skills block
  const { technical = [], soft = [], languages = [] } = skills || {};
  if (technical.length || soft.length || languages.length) {
    yL += 6;
    yL = sectionTitle(sidebarX + 14, yL, sidebarW - 28, LABELS.skills);

    if (technical.length) {
      doc.font("Helvetica-Bold").fontSize(9.5).fillColor(TEXT).text(LABELS.technicalSkills, sidebarX + 14, yL, { width: sidebarW - 28 });
      yL = doc.y + 4;
      doc.font("Helvetica").fontSize(9).fillColor(TEXT).text(technical.join(", "), sidebarX + 14, yL, { width: sidebarW - 28 });
      yL = doc.y + 10;
    }

    if (soft.length) {
      doc.font("Helvetica-Bold").fontSize(9.5).fillColor(TEXT).text(LABELS.softSkills, sidebarX + 14, yL, { width: sidebarW - 28 });
      yL = doc.y + 4;
      doc.font("Helvetica").fontSize(9).fillColor(TEXT).text(soft.join(", "), sidebarX + 14, yL, { width: sidebarW - 28 });
      yL = doc.y + 10;
    }

    if (languages.length) {
      doc.font("Helvetica-Bold").fontSize(9.5).fillColor(TEXT).text(LABELS.languages, sidebarX + 14, yL, { width: sidebarW - 28 });
      yL = doc.y + 4;
      doc.font("Helvetica").fontSize(9).fillColor(TEXT).text(toLine(languages), sidebarX + 14, yL, { width: sidebarW - 28 });
      yL = doc.y + 10;
    }
  }

  // Other block
  const { certifications = [], interests = [] } = extra || {};
  if (certifications.length || interests.length) {
    yL += 2;
    yL = sectionTitle(sidebarX + 14, yL, sidebarW - 28, LABELS.other);

    if (certifications.length) {
      doc.font("Helvetica-Bold").fontSize(9.5).fillColor(TEXT).text(LABELS.certifications, sidebarX + 14, yL, { width: sidebarW - 28 });
      yL = doc.y + 6;
      yL = bulletList(sidebarX + 14, yL, sidebarW - 28, certifications);
      yL += 6;
    }

    if (interests.length) {
      doc.font("Helvetica-Bold").fontSize(9.5).fillColor(TEXT).text(LABELS.interests, sidebarX + 14, yL, { width: sidebarW - 28 });
      yL = doc.y + 4;
      doc.font("Helvetica").fontSize(9).fillColor(TEXT).text(toLine(interests), sidebarX + 14, yL, { width: sidebarW - 28 });
      yL = doc.y + 8;
    }
  }

  // ===== MAIN CONTENT (RIGHT) =====
  doc.y = yR;

  // Profile
  if (summary) {
    ensureSpace(60);
    let y = doc.y;
    y = sectionTitle(contentX, y, contentW, LABELS.profile);
    doc.font("Helvetica").fontSize(10).fillColor(TEXT).text(summary, contentX, y, { width: contentW });
    doc.y = doc.y + 8;
  }

  // Experience
  if (experience?.length) {
    ensureSpace(80);
    let y = sectionTitle(contentX, doc.y, contentW, LABELS.experience);

    for (const exp of experience) {
      if (!exp) continue;
      ensureSpace(70);

      const line1 = [exp.title, exp.company].filter(Boolean).join(" — ");
      doc.font("Helvetica-Bold").fontSize(10).fillColor(TEXT).text(line1, contentX, y, { width: contentW });

      const dates = [exp.startDate, exp.endDate].filter(Boolean).join(" - ");
      const line2 = [exp.location, dates].filter(Boolean).join("  •  ");
      if (line2) doc.font("Helvetica").fontSize(9).fillColor(MUTED).text(line2, contentX, doc.y + 2, { width: contentW });

      y = doc.y + 6;
      y = bulletList(contentX, y, contentW, exp.bullets);
      y += 8;
    }
    doc.y = y;
  }

  // Education
  if (education?.length) {
    ensureSpace(70);
    let y = sectionTitle(contentX, doc.y, contentW, LABELS.education);

    for (const ed of education) {
      if (!ed) continue;
      ensureSpace(50);

      const line1 = [ed.degree, ed.school].filter(Boolean).join(" — ");
      doc.font("Helvetica-Bold").fontSize(10).fillColor(TEXT).text(line1, contentX, y, { width: contentW });

      const dates = [ed.startDate, ed.endDate].filter(Boolean).join(" - ");
      const line2 = [ed.location, dates].filter(Boolean).join("  •  ");
      if (line2) doc.font("Helvetica").fontSize(9).fillColor(MUTED).text(line2, contentX, doc.y + 2, { width: contentW });

      y = doc.y + 6;
      y = bulletList(contentX, y, contentW, ed.details);
      y += 8;
    }
    doc.y = y;
  }

  // Projects
  if (projects?.length) {
    ensureSpace(70);
    let y = sectionTitle(contentX, doc.y, contentW, LABELS.projects);

    for (const p of projects) {
      if (!p) continue;
      ensureSpace(50);

      if (p.name) doc.font("Helvetica-Bold").fontSize(10).fillColor(TEXT).text(p.name, contentX, y, { width: contentW });

      if (p.description) doc.font("Helvetica").fontSize(10).fillColor(TEXT).text(p.description, contentX, doc.y + 2, { width: contentW });

      if (p.technologies?.length) {
        doc.font("Helvetica").fontSize(9).fillColor(MUTED).text(`${LABELS.technologiesPrefix} : ${p.technologies.join(", ")}`, contentX, doc.y + 2, { width: contentW });
      }

      y = doc.y + 10;
    }
    doc.y = y;
  }

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });
}
