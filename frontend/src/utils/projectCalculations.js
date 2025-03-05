// Calculate monthly contribution based on project details
export const calculateMonthlyContribution = (
  targetAmount,
  savedAmount,
  deadline
) => {
  // Ensure at least 1 month for calculation
  const monthsRemaining = Math.max(
    1,
    Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24 * 30))
  );

  // Calculate monthly contribution
  return (targetAmount - savedAmount) / monthsRemaining;
};

// Calculate project progress percentage
export const calculateProjectProgress = (savedAmount, targetAmount) => {
  return Math.min((savedAmount / targetAmount) * 100, 100);
};

// Determine project status based on deadline and current savings
export const determineProjectStatus = (savedAmount, targetAmount, deadline) => {
  const today = new Date();
  const projectDeadline = new Date(deadline);
  const progress = calculateProjectProgress(savedAmount, targetAmount);

  if (progress >= 100) return "Completed";
  if (projectDeadline < today) return "Overdue";
  if (progress >= 75) return "On Track";
  if (progress >= 50) return "Needs Attention";
  return "Behind Schedule";
};
