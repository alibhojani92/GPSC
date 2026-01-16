/**
 * MCQ Core Data Model
 * Master Bot – Dental Pulse Edition 18
 * DO NOT MODIFY WITHOUT DISCUSSION
 */

export function createMCQ({
  id,
  subjectCode,
  question,
  options,
  correctOption,
  explanation,
  tags = [],
  difficulty = "medium",
  source = "Dental Pulse",
  createdBy,
  createdAt = new Date().toISOString(),
}) {
  return {
    // Identity
    id, // unique string (uuid later)
    subjectCode, // must match Dental Pulse 18 subject map

    // Content
    question, // string
    options: {
      A: options.A,
      B: options.B,
      C: options.C,
      D: options.D,
    },
    correctOption, // "A" | "B" | "C" | "D"
    explanation, // string (can be empty but required)

    // Classification
    difficulty, // easy | medium | hard
    tags, // eg: ["repeated", "conceptual", "exam-favourite"]

    // Metadata
    source, // Dental Pulse / Custom
    createdBy, // adminId
    createdAt,

    // Runtime stats (auto-updated later)
    stats: {
      asked: 0,
      correct: 0,
      wrong: 0,
    },
  };
}
