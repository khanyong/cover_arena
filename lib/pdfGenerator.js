import { jsPDF } from 'jspdf';

/**
 * PDF Generator for Interview Questions and Answers
 * Handles Korean text rendering for interview preparation documents
 */

/**
 * Add Korean text to PDF with proper line wrapping
 * @param {jsPDF} doc - jsPDF document instance
 * @param {string} text - Text to add
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} maxWidth - Maximum width for text wrapping
 * @param {number} lineHeight - Line height
 * @returns {number} - Final Y position after text
 */
function addWrappedText(doc, text, x, y, maxWidth, lineHeight = 7) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + (lines.length * lineHeight);
}

/**
 * Add page header
 * @param {jsPDF} doc - jsPDF document instance
 * @param {string} title - Header title
 */
function addHeader(doc, title) {
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 105, 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString('ko-KR')}`, 105, 28, { align: 'center' });

  // Draw line
  doc.setLineWidth(0.5);
  doc.line(20, 32, 190, 32);
}

/**
 * Add page footer
 * @param {jsPDF} doc - jsPDF document instance
 * @param {number} pageNumber - Current page number
 */
function addFooter(doc, pageNumber) {
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text(`Page ${pageNumber}`, 105, 285, { align: 'center' });
  doc.text('Generated with CoverCompetition - Interview Preparation System', 105, 290, { align: 'center' });
}

/**
 * Check if new page is needed
 * @param {jsPDF} doc - jsPDF document instance
 * @param {number} currentY - Current Y position
 * @param {number} requiredSpace - Required space for next content
 * @param {number} pageNumber - Current page number
 * @returns {object} - { y: new Y position, pageNumber: updated page number }
 */
function checkNewPage(doc, currentY, requiredSpace = 40, pageNumber) {
  if (currentY + requiredSpace > 270) {
    addFooter(doc, pageNumber);
    doc.addPage();
    pageNumber++;
    addHeader(doc, 'Interview Questions & Answers (Continued)');
    currentY = 45;
  }
  return { y: currentY, pageNumber };
}

/**
 * Generate PDF for Essential Questions
 * @param {Array} questions - Array of question objects
 * @param {Object} userInfo - User information
 * @returns {jsPDF} - PDF document
 */
export function generateEssentialQuestionsPDF(questions, userInfo = {}) {
  const doc = new jsPDF();
  let currentY = 45;
  let pageNumber = 1;

  // Add header
  addHeader(doc, 'Essential Interview Questions');

  // Add user info if provided
  if (userInfo.name || userInfo.university) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    currentY = addWrappedText(doc, `Name: ${userInfo.name || 'N/A'}`, 20, currentY, 170);
    currentY = addWrappedText(doc, `University: ${userInfo.university || 'N/A'}`, 20, currentY + 5, 170);
    currentY += 10;
  }

  // Add questions and answers
  questions.forEach((q, index) => {
    // Check if new page needed
    const pageCheck = checkNewPage(doc, currentY, 60, pageNumber);
    currentY = pageCheck.y;
    pageNumber = pageCheck.pageNumber;

    // Question number and category
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    currentY = addWrappedText(doc, `Q${index + 1}. ${q.category}`, 20, currentY, 170);
    currentY += 2;

    // Question text
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    currentY = addWrappedText(doc, q.question, 20, currentY, 170);
    currentY += 5;

    // Answer
    if (q.answer) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      // Split by paragraphs
      const paragraphs = q.answer.split('\n\n');
      paragraphs.forEach((para, pIndex) => {
        if (para.trim()) {
          // Check if new page needed for each paragraph
          const pageCheck = checkNewPage(doc, currentY, 30, pageNumber);
          currentY = pageCheck.y;
          pageNumber = pageCheck.pageNumber;

          currentY = addWrappedText(doc, para.trim(), 25, currentY, 165);
          currentY += 5;
        }
      });
    }

    // Keywords
    if (q.keywords && q.keywords.length > 0) {
      const pageCheck = checkNewPage(doc, currentY, 20, pageNumber);
      currentY = pageCheck.y;
      pageNumber = pageCheck.pageNumber;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      currentY = addWrappedText(doc, `Keywords: ${q.keywords.join(', ')}`, 25, currentY, 165);
      currentY += 3;
    }

    // Separator
    doc.setLineWidth(0.3);
    doc.setDrawColor(200, 200, 200);
    doc.line(20, currentY, 190, currentY);
    currentY += 8;
  });

  // Add footer to last page
  addFooter(doc, pageNumber);

  return doc;
}

/**
 * Generate PDF for Category Questions
 * @param {Object} categorizedQuestions - Questions grouped by category
 * @param {Object} userInfo - User information
 * @returns {jsPDF} - PDF document
 */
export function generateCategoryQuestionsPDF(categorizedQuestions, userInfo = {}) {
  const doc = new jsPDF();
  let currentY = 45;
  let pageNumber = 1;

  // Add header
  addHeader(doc, 'Category-Based Interview Questions');

  // Add user info if provided
  if (userInfo.name || userInfo.university) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    currentY = addWrappedText(doc, `Name: ${userInfo.name || 'N/A'}`, 20, currentY, 170);
    currentY = addWrappedText(doc, `University: ${userInfo.university || 'N/A'}`, 20, currentY + 5, 170);
    currentY += 10;
  }

  // Process each category
  Object.entries(categorizedQuestions).forEach(([category, questions]) => {
    if (!questions || questions.length === 0) return;

    // Check if new page needed for category header
    const pageCheck = checkNewPage(doc, currentY, 40, pageNumber);
    currentY = pageCheck.y;
    pageNumber = pageCheck.pageNumber;

    // Category header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(231, 76, 60);
    currentY = addWrappedText(doc, category, 20, currentY, 170);
    currentY += 8;

    // Process questions in category
    questions.forEach((q, index) => {
      // Check if new page needed
      const pageCheck = checkNewPage(doc, currentY, 50, pageNumber);
      currentY = pageCheck.y;
      pageNumber = pageCheck.pageNumber;

      // Question number
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(41, 128, 185);
      currentY = addWrappedText(doc, `${index + 1}. Question`, 20, currentY, 170);
      currentY += 2;

      // Question text
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      currentY = addWrappedText(doc, q.question, 20, currentY, 170);
      currentY += 5;

      // Answer
      if (q.answer) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        const paragraphs = q.answer.split('\n\n');
        paragraphs.forEach((para) => {
          if (para.trim()) {
            const pageCheck = checkNewPage(doc, currentY, 25, pageNumber);
            currentY = pageCheck.y;
            pageNumber = pageCheck.pageNumber;

            currentY = addWrappedText(doc, para.trim(), 25, currentY, 165);
            currentY += 4;
          }
        });
      }

      // Keywords
      if (q.keywords && q.keywords.length > 0) {
        const pageCheck = checkNewPage(doc, currentY, 15, pageNumber);
        currentY = pageCheck.y;
        pageNumber = pageCheck.pageNumber;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        currentY = addWrappedText(doc, `Keywords: ${q.keywords.join(', ')}`, 25, currentY, 165);
      }

      currentY += 6;
    });

    currentY += 5;
  });

  // Add footer to last page
  addFooter(doc, pageNumber);

  return doc;
}

/**
 * Generate combined PDF with all questions
 * @param {Array} essentialQuestions - Essential questions
 * @param {Object} categoryQuestions - Category-based questions
 * @param {Object} userInfo - User information
 * @returns {jsPDF} - PDF document
 */
export function generateCompletePDF(essentialQuestions, categoryQuestions, userInfo = {}) {
  const doc = new jsPDF();
  let currentY = 45;
  let pageNumber = 1;

  // Cover page
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Interview Preparation', 105, 100, { align: 'center' });
  doc.text('Questions & Answers', 105, 115, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  if (userInfo.name) {
    doc.text(userInfo.name, 105, 140, { align: 'center' });
  }
  if (userInfo.university) {
    doc.text(userInfo.university, 105, 150, { align: 'center' });
  }

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString('ko-KR')}`, 105, 270, { align: 'center' });

  // Essential Questions Section
  if (essentialQuestions && essentialQuestions.length > 0) {
    doc.addPage();
    pageNumber++;
    currentY = 45;

    addHeader(doc, 'Part 1: Essential Questions');

    essentialQuestions.forEach((q, index) => {
      const pageCheck = checkNewPage(doc, currentY, 60, pageNumber);
      currentY = pageCheck.y;
      pageNumber = pageCheck.pageNumber;

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(41, 128, 185);
      currentY = addWrappedText(doc, `Q${index + 1}. ${q.category}`, 20, currentY, 170);
      currentY += 2;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      currentY = addWrappedText(doc, q.question, 20, currentY, 170);
      currentY += 5;

      if (q.answer) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const paragraphs = q.answer.split('\n\n');
        paragraphs.forEach((para) => {
          if (para.trim()) {
            const pageCheck = checkNewPage(doc, currentY, 30, pageNumber);
            currentY = pageCheck.y;
            pageNumber = pageCheck.pageNumber;
            currentY = addWrappedText(doc, para.trim(), 25, currentY, 165);
            currentY += 5;
          }
        });
      }

      if (q.keywords && q.keywords.length > 0) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100, 100, 100);
        currentY = addWrappedText(doc, `Keywords: ${q.keywords.join(', ')}`, 25, currentY, 165);
      }

      doc.setLineWidth(0.3);
      doc.setDrawColor(200, 200, 200);
      doc.line(20, currentY + 3, 190, currentY + 3);
      currentY += 8;
    });

    addFooter(doc, pageNumber);
  }

  // Category Questions Section
  if (categoryQuestions && Object.keys(categoryQuestions).length > 0) {
    doc.addPage();
    pageNumber++;
    currentY = 45;

    addHeader(doc, 'Part 2: Category Questions');

    Object.entries(categoryQuestions).forEach(([category, questions]) => {
      if (!questions || questions.length === 0) return;

      const pageCheck = checkNewPage(doc, currentY, 40, pageNumber);
      currentY = pageCheck.y;
      pageNumber = pageCheck.pageNumber;

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(231, 76, 60);
      currentY = addWrappedText(doc, category, 20, currentY, 170);
      currentY += 8;

      questions.forEach((q, index) => {
        const pageCheck = checkNewPage(doc, currentY, 50, pageNumber);
        currentY = pageCheck.y;
        pageNumber = pageCheck.pageNumber;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(41, 128, 185);
        currentY = addWrappedText(doc, `${index + 1}. Question`, 20, currentY, 170);
        currentY += 2;

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        currentY = addWrappedText(doc, q.question, 20, currentY, 170);
        currentY += 5;

        if (q.answer) {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const paragraphs = q.answer.split('\n\n');
          paragraphs.forEach((para) => {
            if (para.trim()) {
              const pageCheck = checkNewPage(doc, currentY, 25, pageNumber);
              currentY = pageCheck.y;
              pageNumber = pageCheck.pageNumber;
              currentY = addWrappedText(doc, para.trim(), 25, currentY, 165);
              currentY += 4;
            }
          });
        }

        if (q.keywords && q.keywords.length > 0) {
          doc.setFontSize(9);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(100, 100, 100);
          currentY = addWrappedText(doc, `Keywords: ${q.keywords.join(', ')}`, 25, currentY, 165);
        }

        currentY += 6;
      });

      currentY += 5;
    });

    addFooter(doc, pageNumber);
  }

  return doc;
}

/**
 * Download PDF to user's device
 * @param {jsPDF} doc - PDF document
 * @param {string} filename - Filename for download
 */
export function downloadPDF(doc, filename = 'interview-questions.pdf') {
  doc.save(filename);
}
