/**
 * Sanitizes user input string by encoding HTML entities to prevent Cross-Site
 * Scripting (XSS) and DOM injection vulnerabilities.
 * @param {string} str - Raw user input string
 * @returns {string} Sanitized string
 */
export function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validates that username matches a strict whitelist of safe characters.
 * @param {string} username - Candidate username
 * @returns {boolean} True if username meets validation criteria
 */
export function isValidUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9._@+-]{1,64}$/;
  return usernameRegex.test(username);
}
