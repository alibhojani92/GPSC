/*****************************************************************
 * MCQ Service – FINAL STABLE
 * Handles MCQ add (single/bulk), parsing & subject mapping
 * NO Telegram code here
 *****************************************************************/

const mcqRepo = require("../repositories/mcq.repo");

class MCQService {
  /* ================= ADD MCQs (BULK / SINGLE) ================= */
  async addMCQs(rawText, defaultSubject = "General") {
    const subjectMatch = rawText.match(/SUBJECT\s*:\s*(.+)/i);
    const subject = subjectMatch
      ? subjectMatch[1].trim()
      : defaultSubject;

    const cleaned = rawText
      .replace(/SUBJECT\s*:.+/i, "")
      .trim();

    const blocks = cleaned.split(/\n(?=Q[\.\d])/i);

    let added = 0;
    let skipped = 0;

    for (const block of blocks) {
      const mcq = this.parseMCQ(block, subject);
      if (!mcq) {
        skipped++;
        continue;
      }
      await mcqRepo.addMCQ(mcq);
      added++;
    }

    return {
      ok: true,
      added,
      skipped,
      subject
    };
  }

  /* ================= PARSE SINGLE MCQ ================= */
  parseMCQ(text, subject) {
    const q = text.match(/Q[\.\d]*\s*(.+)/i)?.[1];
    const A = text.match(/A\)\s*(.+)/i)?.[1];
    const B = text.match(/B\)\s*(.+)/i)?.[1];
    const C = text.match(/C\)\s*(.+)/i)?.[1];
    const D = text.match(/D\)\s*(.+)/i)?.[1];
    const ans = text.match(/Ans\s*:\s*([ABCD])/i)?.[1];
    const exp = text.match(/Exp\s*:\s*(.+)/i)?.[1] || "";

    if (!q || !A || !B || !C || !D || !ans) return null;

    return {
      id: `mcq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      question: q.trim(),
      options: {
        A: A.trim(),
        B: B.trim(),
        C: C.trim(),
        D: D.trim()
      },
      answer: ans.trim(),
      explanation: exp.trim(),
      subject,
      createdAt: Date.now()
    };
  }

  /* ================= GET RANDOM MCQs ================= */
  async getRandomMCQs(limit = 20, subject = null) {
    const all = subject
      ? await mcqRepo.getBySubject(subject)
      : await mcqRepo.getAll();

    return this.shuffle(all).slice(0, limit);
  }

  /* ================= SHUFFLE ================= */
  shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }
}

module.exports = new MCQService();
