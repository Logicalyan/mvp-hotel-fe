// lib/utils/getRedirectPath.js

/**
 * Get redirect path based on user role and hotel ID
 * @param {string} role - User role (admin, hotel, petugas, client)
 * @param {number|null} hotelId - Hotel ID for hotel role users
 * @returns {string} - Redirect path
 */
export function getRedirectPath(role, hotelId) {
  console.log('🔀 getRedirectPath:', { role, hotelId });
  
  switch(role) {
    case 'admin':
      return '/admin';
    case 'hotel':
      if (!hotelId) {
        console.warn('⚠️ Hotel role but no hotel_id, redirecting to /dashboard');
        return '/dashboard';
      }
      return `/hotel/dashboard/${hotelId}`;
    case 'petugas':
    case 'client':
    default:
      return '/dashboard';
  }
}
