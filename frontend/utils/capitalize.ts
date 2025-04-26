export function capitalize(str: string): string {
  // Check if the string is empty or null
  if (!str) return str;

  return str
    .split(" ") // Split the string by spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(" "); // Join back into a string
}
