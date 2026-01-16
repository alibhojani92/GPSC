/**
 * MCQ Validation Layer
 * Master Bot – Dental Pulse Edition 18
 * Hard validation before save
 */

import { DENTAL_PULSE_SUBJECTS } from "../config/constants.js";

export function validateMCQ(mcq) {
  if (!mcq) {
    throw new Error("MCQ object missing");
  }

  // Subject validation
  const subjectExists = DENTAL_PULSE_SUBJECTS.some(
    (s) => s.code === mcq.subjectCode
  );

  if (!subjectExists) {
    throw new Error("Invalid subject code for Dental Pulse 18");
  }

  // Question validation
  if (!mcq.question || mcq.question.length < 10) {
    throw new Error("Question text too short or missing");
  }

  // Options validation
  const opts = mcq.options || {};
  if (!opts.A || !opts.B || !opts.C || !opts.D) {
    throw new Error("All four options (A–D) are required");
  }

  // Answer validation
  if (!["A", "B", "C", "D"].includes(mcq.correctOption)) {
    throw new Error("Correct option must be A, B, C, or D");
  }

  // Explanation validation
  if (!mcq.explanation || mcq.explanation.length < 5) {
    throw new Error("Explanation is required");
  }

  return true;
    }
