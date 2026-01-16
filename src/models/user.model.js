/**
 * User Core Model
 * Master Bot – Role & Identity
 */

export function createUser({
  id,
  username = "",
  firstName = "",
  role = "student", // student | admin
  joinedAt = new Date().toISOString(),
}) {
  return {
    // Identity
    id, // Telegram user id
    username,
    firstName,

    // Role
    role,

    // Metadata
    joinedAt,

    // Activity stats (expanded later)
    stats: {
      readingMinutes: {}, // date => minutes
      testsTaken: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
    },
  };
}
