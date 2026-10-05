// Genera la firma de marca de Hernando Rey para los README de GitHub.
// Crea 4 variantes (español / inglés × tema oscuro / claro) en esta carpeta.
//
// Uso:  node firma/generar.mjs
//
// Para cambiar un texto (por ejemplo, el estado "Abierto a nuevas
// oportunidades"), edítalo en TEXTS, vuelve a ejecutar y sube los cambios:
// todos los README que usan la firma se actualizan solos.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const lion = readFileSync(join(here, "leon.png")).toString("base64");

const TEXTS = {
  es: {
    status: "Abierto a nuevas oportunidades",
    role: "Desarrollador Full Stack & Ingeniero Electrónico",
    location: "Barranquilla, Colombia",
    tagline: "Hecho con amor y café",
    title: "Hernando Rey, Desarrollador Full Stack e Ingeniero Electrónico",
  },
  en: {
    status: "Open to new opportunities",
    role: "Full Stack Developer & Electronics Engineer",
    location: "Barranquilla, Colombia",
    tagline: "Crafted with love and coffee",
    title: "Hernando Rey, Full Stack Developer and Electronics Engineer",
  },
};

const STACK = ["React", "Node.js", "Firebase", "REST APIs", "IoT · ESP32"];

// Colores de la marca (los mismos del sitio hernandorey-31.web.app).
const THEMES = {
  oscuro: {
    bgFrom: "#0d111a",
    bgTo: "#20252c",
    line: "#363d47",
    ink: "#f2f2f0",
    muted: "#aab1ba",
    chip: "#272d35",
    brand: "#e7562e",
    accent: "#f08a65",
    glow: 0.55,
  },
  claro: {
    bgFrom: "#faf9f6",
    bgTo: "#f3f1ec",
    line: "#e7e4de",
    ink: "#1d2025",
    muted: "#5a6069",
    chip: "#ffffff",
    brand: "#e7562e",
    accent: "#c2410c",
    glow: 0.3,
  },
};

const FONT = "Raleway, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const W = 1200;
const H = 300;

const escape = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Ancho aproximado de un texto (sin medir fuentes): promedio por carácter.
const textWidth = (text, size, factor = 0.56) => text.length * size * factor;

function chips(theme, x, y) {
  let cursor = x;
  return STACK.map((label) => {
    const width = Math.round(textWidth(label, 16, 0.58) + 30);
    const svg = `
    <g transform="translate(${cursor} ${y})">
      <rect width="${width}" height="34" rx="17" fill="${theme.chip}" stroke="${theme.line}"/>
      <text x="${width / 2}" y="22.5" text-anchor="middle" font-size="16" font-weight="600" fill="${theme.ink}">${escape(label)}</text>
    </g>`;
    cursor += width + 10;
    return svg;
  }).join("");
}

function render(lang, themeName) {
  const t = TEXTS[lang];
  const theme = THEMES[themeName];
  const pillWidth = Math.round(textWidth(t.status, 15, 0.56) + 58);
  const pillX = W - 48 - pillWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="titulo">
  <title id="titulo">${escape(t.title)}</title>
  <style>
    text { font-family: ${FONT}; }
    .glow { animation: glow 4s ease-in-out infinite; }
    .ping { animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; transform-box: fill-box; transform-origin: center; }
    .shine { animation: shine 7s ease-in-out infinite; }
    @keyframes glow { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
    @keyframes ping { 0% { transform: scale(1); opacity: 0.7; } 80%, 100% { transform: scale(2.6); opacity: 0; } }
    @keyframes shine { 0% { transform: translateX(-420px); } 55%, 100% { transform: translateX(${W + 120}px); } }
    @media (prefers-reduced-motion: reduce) { .glow, .ping, .shine { animation: none; } }
  </style>
  <defs>
    <linearGradient id="fondo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${theme.bgFrom}"/>
      <stop offset="1" stop-color="${theme.bgTo}"/>
    </linearGradient>
    <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${theme.brand}" stop-opacity="${theme.glow}"/>
      <stop offset="1" stop-color="${theme.brand}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="barra" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${theme.accent}"/>
      <stop offset="0.5" stop-color="${theme.brand}"/>
      <stop offset="1" stop-color="${theme.accent}"/>
    </linearGradient>
    <linearGradient id="brillo" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.75"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="tarjeta"><rect width="${W}" height="${H}" rx="24"/></clipPath>
    <clipPath id="logo"><rect x="70" y="70" width="160" height="160" rx="36"/></clipPath>
  </defs>

  <g clip-path="url(#tarjeta)">
    <rect width="${W}" height="${H}" fill="url(#fondo)"/>
    <circle class="glow" cx="150" cy="150" r="150" fill="url(#halo)"/>

    <image x="70" y="70" width="160" height="160" clip-path="url(#logo)" href="data:image/png;base64,${lion}"/>

    <g transform="translate(${pillX} 34)">
      <rect width="${pillWidth}" height="34" rx="17" fill="${theme.chip}" stroke="${theme.line}"/>
      <circle class="ping" cx="22" cy="17" r="5" fill="#22c55e"/>
      <circle cx="22" cy="17" r="5" fill="#22c55e"/>
      <text x="38" y="22" font-size="15" font-weight="600" fill="${theme.ink}">${escape(t.status)}</text>
    </g>

    <text x="270" y="128" font-size="58" font-weight="800" letter-spacing="-1" fill="${theme.ink}">Hernando Rey</text>
    <text x="272" y="168" font-size="23" font-weight="500" fill="${theme.muted}">${escape(t.role)}</text>
    ${chips(theme, 272, 190)}

    <g transform="translate(272 252)" fill="${theme.muted}">
      <path d="M8 0C3.6 0 0 3.5 0 7.9 0 13.8 8 20 8 20s8-6.2 8-12.1C16 3.5 12.4 0 8 0zm0 10.8a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" fill="${theme.brand}"/>
      <text x="24" y="15" font-size="16" font-weight="500">${escape(t.location)}</text>
    </g>
    <text x="${W - 76}" y="267" text-anchor="end" font-size="16" font-style="italic" fill="${theme.muted}">${escape(t.tagline)}</text>
    <!-- Tacita de café dibujada (un emoji se vería distinto en cada sistema). -->
    <g transform="translate(${W - 68} 249)" fill="none" stroke="${theme.brand}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 7h12v5a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5z"/>
      <path d="M14 9h1.5a2.5 2.5 0 0 1 0 5H14"/>
      <path d="M6 1.5c-.8.9.8 1.6 0 3M10 1.5c-.8.9.8 1.6 0 3"/>
    </g>

    <rect y="${H - 6}" width="${W}" height="6" fill="url(#barra)"/>
    <rect class="shine" y="${H - 6}" width="320" height="6" fill="url(#brillo)"/>
  </g>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="24" fill="none" stroke="${theme.line}"/>
</svg>
`;
}

for (const lang of Object.keys(TEXTS)) {
  for (const themeName of Object.keys(THEMES)) {
    const file = join(here, `firma-${lang}-${themeName}.svg`);
    writeFileSync(file, render(lang, themeName));
    console.log("creada", file.replace(here, "firma"));
  }
}
