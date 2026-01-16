/**
 * Test Session Model
 * Master Bot – Daily / Weekly / Subject Tests
 */

export function createTestSession({
  id, // unique test id
  userId,
  type, // daily | weekly | subject
  subjectCode = null, // null for mixed tests
  totalQuestions,
  startedAt = new Date().toISOString(),
}) {
  return {
    // Identity
    id,
    userId,

    // Test meta
    type,
    subjectCode,

    // Progress
    totalQuestions,
    currentIndex: 0,

    // Result
    correct: 0,
    wrong: 0,

    // Timing
    startedAt,
    finishedAt: null,

    // Per-question history
    answers: [
      // {
      //   mcqId,
      //   selectedOption,
      //   isCorrect,
      //   timeTakenSeconds
      // }
    ],
  };
}
