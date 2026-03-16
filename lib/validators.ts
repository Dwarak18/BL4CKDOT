export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password: string) {
  return password.length >= 8;
}

export function isLongEnough(text: string, min = 50) {
  return text.trim().length >= min;
}

export function isPdfFile(filename: string) {
  return filename.toLowerCase().endsWith(".pdf");
}

export type ValidationError = { field: string; message: string };

export function validateStudentFields(data: Record<string, string>): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!data.name?.trim()) errors.push({ field: "name", message: "Name is required" });
  if (!data.email?.trim()) errors.push({ field: "email", message: "Email is required" });
  else if (!isValidEmail(data.email)) errors.push({ field: "email", message: "Invalid email format" });
  if (!data.password) errors.push({ field: "password", message: "Password is required" });
  else if (!isStrongPassword(data.password)) errors.push({ field: "password", message: "Password must be at least 8 characters" });
  if (!data.university?.trim()) errors.push({ field: "university", message: "University is required" });
  if (!data.degree?.trim()) errors.push({ field: "degree", message: "Degree is required" });
  if (!data.year) errors.push({ field: "year", message: "Year of study is required" });
  if (!data.domain) errors.push({ field: "domain", message: "Domain is required" });
  if (!data.motivation?.trim()) errors.push({ field: "motivation", message: "Motivation is required" });
  else if (!isLongEnough(data.motivation)) errors.push({ field: "motivation", message: "Motivation must be at least 50 characters" });
  return errors;
}

export function validateInnovatorFields(data: Record<string, string>): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!data.name?.trim()) errors.push({ field: "name", message: "Name is required" });
  if (!data.email?.trim()) errors.push({ field: "email", message: "Email is required" });
  else if (!isValidEmail(data.email)) errors.push({ field: "email", message: "Invalid email format" });
  if (!data.password) errors.push({ field: "password", message: "Password is required" });
  else if (!isStrongPassword(data.password)) errors.push({ field: "password", message: "Password must be at least 8 characters" });
  if (!data.location?.trim()) errors.push({ field: "location", message: "Location is required" });
  if (!data.startupName?.trim()) errors.push({ field: "startupName", message: "Startup/project name is required" });
  if (!data.problem?.trim()) errors.push({ field: "problem", message: "Problem statement is required" });
  else if (!isLongEnough(data.problem)) errors.push({ field: "problem", message: "Problem statement must be at least 50 characters" });
  if (!data.solution?.trim()) errors.push({ field: "solution", message: "Solution idea is required" });
  else if (!isLongEnough(data.solution)) errors.push({ field: "solution", message: "Solution must be at least 50 characters" });
  if (!data.technologyDomain) errors.push({ field: "technologyDomain", message: "Technology domain is required" });
  if (!data.stage) errors.push({ field: "stage", message: "Stage is required" });
  return errors;
}

export function validateCompanyFields(data: Record<string, string>): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!data.companyName?.trim()) errors.push({ field: "companyName", message: "Company name is required" });
  if (!data.industry?.trim()) errors.push({ field: "industry", message: "Industry is required" });
  if (!data.contactPerson?.trim()) errors.push({ field: "contactPerson", message: "Contact person is required" });
  if (!data.contactEmail?.trim()) errors.push({ field: "contactEmail", message: "Contact email is required" });
  else if (!isValidEmail(data.contactEmail)) errors.push({ field: "contactEmail", message: "Invalid contact email" });
  if (!data.projectDescription?.trim()) errors.push({ field: "projectDescription", message: "Project description is required" });
  else if (!isLongEnough(data.projectDescription)) errors.push({ field: "projectDescription", message: "Project description must be at least 50 characters" });
  if (!data.budgetRange) errors.push({ field: "budgetRange", message: "Budget range is required" });
  if (!data.partnershipType) errors.push({ field: "partnershipType", message: "Partnership type is required" });
  return errors;
}
