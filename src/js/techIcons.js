// Technology icons using SVG
const techIcons = {
  Laravel: `<svg viewBox="0 0 24 24" fill="#FF2D20" class="w-4 h-4"><path d="M23.642 5.43a.364.364 0 01.014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 01-.188.326L9.93 23.949a.348.348 0 01-.192 0L.533 18.755a.376.376 0 01-.189-.326V2.974c0-.033.005-.066.014-.098l.033-.045L5.044.05a.375.375 0 01.378 0L9.936 2.647l.038.027.033.045c.01.02.017.038.024.058l.013.032c.01.031.014.064.014.098v9.652l3.76-2.164V5.527c0-.033.004-.066.013-.098l4.513-2.598a.375.375 0 01.378 0l4.513 2.598c.016.01.027.021.042.031zm-.74 5.032V6.179l-3.76 2.164v4.283zm-4.51 7.75v-4.287l-8.273 4.723v4.325zM1.093 3.624v14.588l8.273 4.761v-4.325l-4.322-2.445V5.789zm4.137-2.814L1.47 2.974l3.76 2.164 3.758-2.164zm1.956 13.505l2.182-1.256V3.624l-3.762 2.165v9.435zm11.581-10.95l-3.76 2.163 3.76 2.163 3.759-2.164zm-.376 4.978l-3.76-2.164v4.283l3.76 2.164z"/></svg>`,
  'Vue.js': `<svg viewBox="0 0 24 24" fill="#4FC08D" class="w-4 h-4"><path d="M24 1.61h-9.94L12 5.16 9.94 1.61H0l12 20.78zM12 14.08L5.16 2.23h4.43L12 6.41l2.41-4.18h4.43z"/></svg>`,
  MySQL: `<svg viewBox="0 0 24 24" fill="#4479A1" class="w-4 h-4"><circle cx="12" cy="12" r="10"/></svg>`,
  Flutter: `<svg viewBox="0 0 24 24" fill="#02569B" class="w-4 h-4"><path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.357zm.014 11.072L7.857 17.53l6.47 6.47H21.7l-6.46-6.468 6.46-6.46h-7.37z"/></svg>`,
  Firebase: `<svg viewBox="0 0 24 24" fill="#FFCA28" class="w-4 h-4"><path d="M3.89 15.672L6.255.461A.542.542 0 017.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 00-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 001.588 0zM14.3 7.147l-1.82-3.482a.542.542 0 00-.96 0L3.53 17.984z"/></svg>`,
  'Node.js': `<svg viewBox="0 0 24 24" fill="#339933" class="w-4 h-4"><path d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.25 1.328-.604l2.256 1.339a.29.29 0 00.272 0l8.795-5.076a.277.277 0 00.134-.238V6.921a.283.283 0 00-.137-.242l-8.791-5.072a.278.278 0 00-.271 0L3.075 6.68a.284.284 0 00-.139.241v10.15a.27.27 0 00.139.235l2.409 1.392c1.307.654 2.108-.116 2.108-.89V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.112.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.551L2.28 18.675a1.857 1.857 0 01-.922-1.604V6.921c0-.659.353-1.275.922-1.603l8.795-5.082c.557-.315 1.296-.315 1.848 0l8.794 5.082c.57.329.924.944.924 1.603v10.15a1.86 1.86 0 01-.924 1.604l-8.794 5.078c-.28.163-.6.247-.925.247z"/></svg>`,
  React: `<svg viewBox="0 0 24 24" fill="#61DAFB" class="w-4 h-4"><circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="12" rx="11" ry="4.5" fill="none" stroke="#61DAFB" stroke-width="1"/><ellipse cx="12" cy="12" rx="11" ry="4.5" fill="none" stroke="#61DAFB" stroke-width="1" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="11" ry="4.5" fill="none" stroke="#61DAFB" stroke-width="1" transform="rotate(120 12 12)"/></svg>`,
  TailwindCSS: `<svg viewBox="0 0 24 24" fill="#06B6D4" class="w-4 h-4"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg>`,
  Figma: `<svg viewBox="0 0 24 24" fill="#F24E1E" class="w-4 h-4"><path d="M5 5.5A5.5 5.5 0 0110.5 0H12v8H10.5A5.5 5.5 0 015 5.5zM12 0h1.5A5.5 5.5 0 0119 5.5 5.5 5.5 0 0113.5 11H12V0zm0 11h1.5a5.5 5.5 0 110 11A5.5 5.5 0 0112 11zm-6.5 0A5.5 5.5 0 0011 16.5 5.5 5.5 0 015.5 22 5.5 5.5 0 010 16.5 5.5 5.5 0 015.5 11zm0 0A5.5 5.5 0 000 5.5 5.5 5.5 0 015.5 0H12v11H5.5z"/></svg>`,
  'Next.js': `<svg viewBox="0 0 24 24" fill="#ffffff" class="w-4 h-4"><circle cx="12" cy="12" r="11" fill="none" stroke="#fff" stroke-width="1"/><path d="M8 8v8l8-8" fill="#fff"/></svg>`,
  PostgreSQL: `<svg viewBox="0 0 24 24" fill="#4169E1" class="w-4 h-4"><circle cx="12" cy="12" r="10"/></svg>`,
  Prisma: `<svg viewBox="0 0 24 24" fill="#2D3748" class="w-4 h-4"><path d="M21.807 18.285L13.553.756a1.324 1.324 0 00-2.335-.128l-8.952 14.5a1.356 1.356 0 00.016 1.455l4.376 6.778a1.408 1.408 0 001.58.581l12.703-3.757c.778-.23 1.073-1.2.866-1.9z"/></svg>`,
  'Adobe Illustrator': `<svg viewBox="0 0 24 24" fill="#FF9A00" class="w-4 h-4"><rect width="20" height="20" x="2" y="2" rx="2"/></svg>`,
  Photoshop: `<svg viewBox="0 0 24 24" fill="#31A8FF" class="w-4 h-4"><rect width="20" height="20" x="2" y="2" rx="2"/></svg>`,
  'React Native': `<svg viewBox="0 0 24 24" fill="#61DAFB" class="w-4 h-4"><circle cx="12" cy="12" r="2.5"/><ellipse cx="12" cy="12" rx="11" ry="4.5" fill="none" stroke="#61DAFB" stroke-width="1"/></svg>`,
  Python: `<svg viewBox="0 0 24 24" fill="#3776AB" class="w-4 h-4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>`,
  TensorFlow: `<svg viewBox="0 0 24 24" fill="#FF6F00" class="w-4 h-4"><path d="M1.292 5.856L11.54 0v24l-4.095-2.378V7.603l-6.168 3.564.015-5.31zm21.43 5.311l-6.155-3.569v12.165L12.47 22V0l10.25 5.856z"/></svg>`,
  MongoDB: `<svg viewBox="0 0 24 24" fill="#47A248" class="w-4 h-4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>`,
  'Three.js': `<svg viewBox="0 0 24 24" fill="#ffffff" class="w-4 h-4"><circle cx="12" cy="12" r="10" fill="none" stroke="#fff" stroke-width="1"/></svg>`,
  'Google Ads': `<svg viewBox="0 0 24 24" fill="#4285F4" class="w-4 h-4"><circle cx="12" cy="12" r="10"/></svg>`,
  'Meta Ads': `<svg viewBox="0 0 24 24" fill="#0081FB" class="w-4 h-4"><circle cx="12" cy="12" r="10"/></svg>`,
  SEO: `<svg viewBox="0 0 24 24" fill="#47C83E" class="w-4 h-4"><circle cx="10" cy="10" r="7" fill="none" stroke="#47C83E" stroke-width="2"/><line x1="15" y1="15" x2="21" y2="21" stroke="#47C83E" stroke-width="2"/></svg>`,
  Analytics: `<svg viewBox="0 0 24 24" fill="#E37400" class="w-4 h-4"><rect x="4" y="14" width="4" height="6"/><rect x="10" y="10" width="4" height="10"/><rect x="16" y="6" width="4" height="14"/></svg>`,
  Midtrans: `<svg viewBox="0 0 24 24" fill="#00D4FF" class="w-4 h-4"><circle cx="12" cy="12" r="10"/></svg>`
};

export function getTechIcon(tech) {
  return techIcons[tech] || `<span class="text-xs px-2 py-1 bg-tertiary rounded">${tech}</span>`;
}

export { techIcons };
