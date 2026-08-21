/** Deterministic placeholder avatar when a profile picture is missing. */
export function getDefaultAvatar(seed = 'default', size = 200): string {
  const safeSeed = encodeURIComponent(seed || 'default');
  return `https://api.dicebear.com/7.x/initials/svg?seed=${safeSeed}&size=${size}&backgroundColor=0d9488&textColor=ffffff`;
}
