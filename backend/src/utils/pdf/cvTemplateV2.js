// backend/src/utils/pdf/cvTemplateV1.js
import PDFDocument from "pdfkit";

/**
 * Remove control characters and normalize whitespace.
 * Prevents weird artifacts like "" and broken PDF rendering.
 */
function sanitizeText(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);

  // Remove ASCII control chars except \n and \t
  const noCtrl = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Normalize spaces
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

  const doc = new PDFDocument({ margin: 40 });
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

  const {
    fullName = "",
    title = "",
    location = "",
    email = "",
    phone = "",
    links = {},
  } = personalInfo;

  const { linkedin, github, portfolio } = links || {};

  const labels = meta.labels || {};
  const L = (key, fallback) => sanitizeText(labels[key]) || fallback;

  // Global default fallbacks (English). LLM can override with meta.labels.
  const LABELS = {
    profile: L("profile", "Profile"),
    skills: L("skills", "Skills"),
    experience: L("experience", "Work Experience"),
    education: L("education", "Education"),
    projects: L("projects", "Projects"),
    other: L("other", "Other"),
    technicalSkills: L("technicalSkills", "Technical skills"),
    softSkills: L("softSkills", "Soft skills"),
    languages: L("languages", "Languages"),
    certifications: L("certifications", "Certifications"),
    interests: L("interests", "Interests"),
    technologiesPrefix: L("technologiesPrefix", "Technologies"),
  };

  const toSingleLine = (value) =>
    Array.isArray(value) ? value.filter(Boolean).join(" • ") : value || "";

  const drawSectionHeader = (titleText) => {
    const safeTitle = sanitizeText(titleText);
    if (!safeTitle) return;

    doc
      .moveDown(0.8)
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#222222")
      .text(safeTitle.toUpperCase());

    doc
      .strokeColor("#dddddd")
      .lineWidth(1)
      .moveTo(doc.page.margins.left, doc.y + 2)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y + 2)
      .stroke();

    doc.moveDown(0.5);
  };

  const drawBulletList = (items) => {
    const list = Array.isArray(items) ? items.filter(Boolean) : [];
    if (!list.length) return;

    doc.font("Helvetica").fontSize(10).fillColor("#333333");
    for (const item of list) {
      doc.text(`• ${sanitizeText(item)}`, { indent: 10 });
    }
  };

  // ===== HEADER =====
  doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .fillColor("#222222")
    .text(fullName || "", { align: "left" });

  if (title) {
    doc
      .moveDown(0.3)
      .font("Helvetica")
      .fontSize(12)
      .fillColor("#555555")
      .text(title, { align: "left" });
  }

  const contactParts = [location, email, phone, linkedin, github, portfolio]
    .map(sanitizeText)
    .filter(Boolean);

  if (contactParts.length) {
    doc
      .moveDown(0.5)
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#555555")
      .text(contactParts.join("  •  "), { align: "left" });
  }

  // Separator line
  doc
    .moveDown(0.7)
    .strokeColor("#cccccc")
    .lineWidth(1)
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .stroke();

  // ===== PROFILE =====
  if (summary) {
    drawSectionHeader(LABELS.profile);
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#333333")
      .text(summary, { align: "left" });
  }

  // ===== SKILLS =====
  const { technical = [], soft = [], languages = [] } = skills || {};
  if (technical.length || soft.length || languages.length) {
    drawSectionHeader(LABELS.skills);

    if (technical.length) {
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#222222")
        .text(LABELS.technicalSkills);

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#333333")
        .text(toSingleLine(technical));

      doc.moveDown(0.3);
    }

    if (soft.length) {
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#222222")
        .text(LABELS.softSkills);

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#333333")
        .text(toSingleLine(soft));

      doc.moveDown(0.3);
    }

    if (languages.length) {
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#222222")
        .text(LABELS.languages);

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#333333")
        .text(toSingleLine(languages));
    }
  }

  // ===== EXPERIENCE =====
  if (experience && experience.length) {
    drawSectionHeader(LABELS.experience);

    experience.forEach((exp) => {
      if (!exp) return;

      const {
        title: jobTitle = "",
        company = "",
        location: expLocation = "",
        startDate = "",
        endDate = "",
        bullets = [],
      } = exp;

      const line1 = [jobTitle, company].filter(Boolean).join(" — ");
      if (line1) {
        doc
          .moveDown(0.4)
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor("#222222")
          .text(line1);
      }

      const dates = [startDate, endDate].filter(Boolean).join(" - ");
      const line2 = [expLocation, dates].filter(Boolean).join("  •  ");
      if (line2) {
        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor("#666666")
          .text(line2);
      }

      drawBulletList(bullets);
    });
  }

  // ===== EDUCATION =====
  if (education && education.length) {
    drawSectionHeader(LABELS.education);

    education.forEach((ed) => {
      if (!ed) return;

      const {
        degree = "",
        school = "",
        location: eduLocation = "",
        startDate = "",
        endDate = "",
        details = [],
      } = ed;

      const line1 = [degree, school].filter(Boolean).join(" — ");
      if (line1) {
        doc
          .moveDown(0.4)
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor("#222222")
          .text(line1);
      }

      const dates = [startDate, endDate].filter(Boolean).join(" - ");
      const line2 = [eduLocation, dates].filter(Boolean).join("  •  ");
      if (line2) {
        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor("#666666")
          .text(line2);
      }

      drawBulletList(details);
    });
  }

  // ===== PROJECTS =====
  if (projects && projects.length) {
    drawSectionHeader(LABELS.projects);

    projects.forEach((p) => {
      if (!p) return;
      const { name = "", description = "", technologies = [] } = p;

      if (name) {
        doc
          .moveDown(0.4)
          .font("Helvetica-Bold")
          .fontSize(10)
          .fillColor("#222222")
          .text(name);
      }

      if (description) {
        doc
          .font("Helvetica")
          .fontSize(10)
          .fillColor("#333333")
          .text(description);
      }

      if (technologies && technologies.length) {
        doc
          .font("Helvetica")
          .fontSize(9)
          .fillColor("#666666")
          .text(`${LABELS.technologiesPrefix} : ${technologies.join(", ")}`);
      }
    });
  }

  // ===== OTHER =====
  const { certifications = [], interests = [] } = extra || {};
  if (certifications.length || interests.length) {
    drawSectionHeader(LABELS.other);

    if (certifications.length) {
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#222222")
        .text(LABELS.certifications);

      drawBulletList(certifications);
      doc.moveDown(0.3);
    }

    if (interests.length) {
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#222222")
        .text(LABELS.interests);

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#333333")
        .text(toSingleLine(interests));
    }
  }

  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
  });
}
