// backend/src/utils/pdf/cvTemplateV1.js
import PDFDocument from "pdfkit";

export function generateCVPdfFromData(cvData) {
  const doc = new PDFDocument({ margin: 40 });
  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));

  const {
    personalInfo = {},
    summary = "",
    skills = {},
    experience = [],
    education = [],
    projects = [],
    extra = {},
  } = cvData || {};

  const {
    fullName = "",
    title = "",
    location = "",
    email = "",
    phone = "",
    links = {},
  } = personalInfo;

  const { linkedin, github, portfolio } = links || {};

  const toSingleLine = (value) =>
    Array.isArray(value) ? value.join(" • ") : value || "";

  const drawSectionHeader = (titleText) => {
    doc
      .moveDown(0.8)
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#222222")
      .text(titleText.toUpperCase());
    doc
      .strokeColor("#dddddd")
      .lineWidth(1)
      .moveTo(doc.page.margins.left, doc.y + 2)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y + 2)
      .stroke();
    doc.moveDown(0.5);
  };

  const drawBulletList = (items) => {
    if (!items || !items.length) return;
    doc.font("Helvetica").fontSize(10).fillColor("#333333");
    for (const item of items) {
      if (!item) continue;
      doc.text(`• ${item}`, { indent: 10 });
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

  const contactParts = [
    location,
    email,
    phone,
    linkedin,
    github,
    portfolio,
  ].filter(Boolean);

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

  // ===== PROFIL =====
  if (summary) {
    drawSectionHeader("Profil");
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#333333")
      .text(summary, { align: "left" });
  }

  // ===== COMPÉTENCES =====
  const { technical = [], soft = [], languages = [] } = skills || {};
  if (technical.length || soft.length || languages.length) {
    drawSectionHeader("Compétences");

    if (technical.length) {
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#222222")
        .text("Compétences techniques");
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
        .text("Compétences comportementales");
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
        .text("Langues");
      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#333333")
        .text(toSingleLine(languages));
    }
  }

  // ===== EXPÉRIENCES =====
  if (experience && experience.length) {
    drawSectionHeader("Expériences professionnelles");

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

  // ===== FORMATION =====
  if (education && education.length) {
    drawSectionHeader("Formation");

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

  // ===== PROJETS =====
  if (projects && projects.length) {
    drawSectionHeader("Projets");

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
          .text(`Technologies : ${technologies.join(", ")}`);
      }
    });
  }

  // ===== AUTRES =====
  const { certifications = [], interests = [] } = extra || {};
  if (certifications.length || interests.length) {
    drawSectionHeader("Autres");

    if (certifications.length) {
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#222222")
        .text("Certifications");
      drawBulletList(certifications);
      doc.moveDown(0.3);
    }

    if (interests.length) {
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#222222")
        .text("Centres d'intérêt");
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
