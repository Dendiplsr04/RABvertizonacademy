/**
 * DIGITAL MULTI SERVICE - Logo Philosophy
 *
 * ELEMENTS & MEANING:
 *
 * 1. HEXAGON FRAME (Outer shape)
 *    - Represents stability, strength, and modern technology
 *    - Like honeycomb - symbolizes interconnected network
 *    - Common in tech industry - shows digital expertise
 *
 * 2. THREE FLOWING PATHS (Inside hexagon)
 *    - Represents "MULTI" - multiple integrated services
 *    - Shows digital transformation flow
 *    - Forms abstract letter "D" for "DIGITAL"
 *    - Curved lines = flexibility and adaptability
 *
 * 3. CONNECTION NODES (Circles at path ends)
 *    - Left nodes: Client/Starting point
 *    - Right nodes: Solutions/Goals achieved
 *    - Shows journey from problem to solution
 *    - Represents connectivity in digital world
 *
 * 4. GOLD GRADIENT
 *    - Premium quality and trust
 *    - Success and achievement
 *    - Luxury and professionalism
 *
 * OVERALL MESSAGE:
 * "We connect clients to digital solutions through multiple integrated services"
 */

export const logoSVG = `
<svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f4e4ba"/>
      <stop offset="50%" style="stop-color:#d4af37"/>
      <stop offset="100%" style="stop-color:#b8960c"/>
    </linearGradient>
    <linearGradient id="goldGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#b8960c"/>
      <stop offset="100%" style="stop-color:#f4e4ba"/>
    </linearGradient>
  </defs>
  <!-- Hexagon Frame -->
  <polygon points="25,3 44,14 44,36 25,47 6,36 6,14" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.6"/>
  <!-- Three flowing paths -->
  <path d="M12,14 Q18,14 22,18 Q30,14 38,16" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M12,25 Q20,22 28,25 Q36,28 38,25" fill="none" stroke="url(#goldGrad)" stroke-width="3" stroke-linecap="round"/>
  <path d="M12,36 Q18,36 22,32 Q30,36 38,34" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" stroke-linecap="round"/>
  <!-- Connection nodes -->
  <circle cx="12" cy="14" r="2.5" fill="url(#goldGrad)"/>
  <circle cx="12" cy="25" r="3" fill="url(#goldGrad)"/>
  <circle cx="12" cy="36" r="2.5" fill="url(#goldGrad)"/>
  <circle cx="38" cy="16" r="2" fill="url(#goldGrad2)"/>
  <circle cx="38" cy="25" r="2.5" fill="url(#goldGrad2)"/>
  <circle cx="38" cy="34" r="2" fill="url(#goldGrad2)"/>
</svg>
`;

export default logoSVG;
