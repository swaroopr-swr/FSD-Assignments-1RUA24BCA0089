export const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMins = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMins < 1) return "JUST NOW";
  if (diffInMins < 60) return `${diffInMins}M AGO`;
  if (diffInHours < 24) return `${diffInHours}H AGO`;
  if (diffInDays < 7) return `${diffInDays}D AGO`;
  
  // Format as "OCT 12" style
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
};
