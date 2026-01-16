// Dental Pulse 18 Edition – Subject Master Map
// ⚠️ CORE FILE – DO NOT CHANGE IDS AFTER PRODUCTION

const SUBJECTS = [
  { id: 1, code: "anat", name: "General Anatomy", order: 1 },
  { id: 2, code: "hist", name: "Oral Histology & Embryology", order: 2 },
  { id: 3, code: "phys", name: "Physiology", order: 3 },
  { id: 4, code: "biochem", name: "Biochemistry", order: 4 },
  { id: 5, code: "path", name: "General Pathology", order: 5 },
  { id: 6, code: "micro", name: "Microbiology", order: 6 },
  { id: 7, code: "pharma", name: "Pharmacology", order: 7 },
  { id: 8, code: "oralpath", name: "Oral Pathology", order: 8 },
  { id: 9, code: "oralmed", name: "Oral Medicine & Radiology", order: 9 },
  { id: 10, code: "oralradio", name: "Oral Radiology", order: 10 },
  { id: 11, code: "period", name: "Periodontology", order: 11 },
  { id: 12, code: "prostho", name: "Prosthodontics", order: 12 },
  { id: 13, code: "endo", name: "Conservative Dentistry & Endodontics", order: 13 },
  { id: 14, code: "pedo", name: "Pedodontics", order: 14 },
  { id: 15, code: "ortho", name: "Orthodontics", order: 15 },
  { id: 16, code: "oralSurg", name: "Oral & Maxillofacial Surgery", order: 16 },
  { id: 17, code: "pubhealth", name: "Public Health Dentistry", order: 17 },
  { id: 18, code: "forensic", name: "Forensic Odontology", order: 18 }
];

// Helpers (used everywhere later)
const SUBJECT_BY_ID = Object.fromEntries(SUBJECTS.map(s => [s.id, s]));
const SUBJECT_BY_CODE = Object.fromEntries(SUBJECTS.map(s => [s.code, s]));

module.exports = {
  SUBJECTS,
  SUBJECT_BY_ID,
  SUBJECT_BY_CODE
};
