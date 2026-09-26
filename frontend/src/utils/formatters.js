/**
 * Format string names to proper Title Case (e.g., "subisha" -> "Subisha")
 */
export const formatName = (str) => {
  if (!str) return 'N/A';
  return str
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format category keys to clean title case (e.g., "E_WASTE" -> "E-Waste")
 */
export const formatCategory = (cat) => {
  if (!cat) return 'General Waste';
  switch (cat) {
    case 'PLASTIC':
      return 'Plastic Waste';
    case 'PAPER':
      return 'Paper & Cardboard';
    case 'GLASS':
      return 'Glass Waste';
    case 'METAL':
      return 'Metal & Aluminum';
    case 'ORGANIC':
      return 'Organic Waste';
    case 'E_WASTE':
      return 'E-Waste';
    case 'MIXED':
      return 'Mixed Recyclables';
    case 'OTHER':
      return 'Other Waste';
    default:
      return cat.replace('_', ' ');
  }
};

/**
 * Format date & time strings cleanly
 */
export const formatDateTime = (dtStr) => {
  if (!dtStr) return 'N/A';
  try {
    const d = new Date(dtStr);
    if (isNaN(d.getTime())) return dtStr;
    return d.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return dtStr;
  }
};
