// Define project priority levels
export type ProjectPriority = "Basse" | "Moyenne" | "Haute";

// Define the project data structure
export interface ProjectData {
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string | Date;
  priority: ProjectPriority;
}

// Define the validation result structure
export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof ProjectData, string>>;
}

// Validate project creation/update data
export const validateProjectData = (projectData: ProjectData): ValidationResult => {
  const errors: Partial<Record<keyof ProjectData, string>> = {};

  // Name validation
  if (!projectData.name || projectData.name.trim() === "") {
    errors.name = "Project name is required";
  }

  // Target amount validation
  if (!projectData.targetAmount || projectData.targetAmount <= 0) {
    errors.targetAmount = "Target amount must be greater than zero";
  }

  // Saved amount validation
  if (projectData.savedAmount < 0) {
    errors.savedAmount = "Saved amount cannot be negative";
  }

  // Deadline validation
  const deadline = new Date(projectData.deadline);
  if (isNaN(deadline.getTime())) {
    errors.deadline = "Invalid deadline date";
  } else if (deadline < new Date()) {
    errors.deadline = "Deadline must be in the future";
  }

  // Priority validation
  const validPriorities: ProjectPriority[] = ["Basse", "Moyenne", "Haute"];
  if (!validPriorities.includes(projectData.priority)) {
    errors.priority = "Invalid priority level";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
