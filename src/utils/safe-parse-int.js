/**
 * Interpreta un string como número.
 * 
 * @param {string} input
 * @returns {number} Retorna null si el número resultante es NaN. Retorna el número resultante
 * en otro caso.
 */
export function safeParseInt(input) {
    const numberId = parseInt(input);
    if (!input || Number.isNaN(numberId)) {
      return null;
    }
    return numberId;
}