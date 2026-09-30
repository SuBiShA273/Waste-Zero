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
 * Format status keys to clean title case (e.g., "ON_THE_WAY" -> "On The Way")
 */
export const formatStatus = (status) => {
  if (!status) return 'Unknown';
  switch (status) {
    case 'REQUESTED':
      return 'Requested';
    case 'ASSIGNED':
      return 'Assigned';
    case 'ACCEPTED':
      return 'Accepted';
    case 'ON_THE_WAY':
      return 'On The Way';
    case 'ARRIVED':
      return 'Arrived';
    case 'COLLECTED':
      return 'Collected';
    case 'RECYCLED':
      return 'Recycled';
    case 'CANCELLED':
      return 'Cancelled';
    case 'REJECTED':
      return 'Rejected';
    default:
      return status
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
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

/**
 * Format image upload URLs to point to full backend server address if relative
 */
export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const cleanBase = baseUrl.replace(/\/$/, '');
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${cleanBase}${cleanUrl}`;
};


