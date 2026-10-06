// Genera la firma de marca de Hernando Rey: para los README de GitHub, el correo
// y la portada de LinkedIn.
//
// Crea, en esta carpeta:
//   - firma-{es,en}-{oscuro,claro}.svg: el banner (logo, nombre, rol, tecnologías).
//   - boton-{id}-{oscuro,claro}.svg: los botones de contacto. Van como imágenes
//     separadas para que cada uno tenga su propio enlace en el README (dentro de
//     una sola imagen, GitHub no deja pulsar nada).
//   - correo/firma-{es,en}.html: la firma de correo, con un botón para copiarla.
//   - correo/logo.png: el logo de esa firma (los correos no muestran SVG).
//   - linkedin/portada-es.png: la portada del perfil de LinkedIn (1584 × 396 px).
//
// Uso:  node firma/generar.mjs
//
// Los PNG se crean con Chrome sin ventana; si no lo encuentra, se saltan (se
// puede indicar su ruta con la variable CHROME_PATH).
//
// Descarga de Google Fonts solo las letras de Inter que se usan y las incrusta en
// cada SVG, para que la firma se vea igual en cualquier sistema. Guarda una copia
// en firma/fuentes/ por si no hay internet. Para cambiar un texto, edítalo en
// TEXTS o BUTTONS, vuelve a ejecutar y sube los cambios: todos los README que
// usan la firma se actualizan solos.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const fontsDir = join(here, "fuentes");
const lion = readFileSync(join(here, "leon.png")).toString("base64");

const TEXTS = {
  es: {
    role: "Desarrollador Full Stack & Ingeniero Electrónico",
    location: "Barranquilla, Colombia",
    status: "Abierto a nuevas oportunidades",
    title: "Hernando Rey, Desarrollador Full Stack e Ingeniero Electrónico",
    portfolio: "Portafolio",
  },
  en: {
    role: "Full Stack Developer & Electronics Engineer",
    location: "Barranquilla, Colombia",
    status: "Open to new opportunities",
    title: "Hernando Rey, Full Stack Developer and Electronics Engineer",
    portfolio: "Portfolio",
  },
};

const CONTACT = {
  email: "hrking31@gmail.com",
  phone: "+57 302 844 6805",
  whatsapp: "https://wa.me/573028446805",
  linkedin: "https://www.linkedin.com/in/hernandorey/",
  github: "https://github.com/hrking31",
  portfolio: { es: "https://hernandorey-31.web.app/", en: "https://hernandorey-31.web.app/en" },
};

// La dirección del portafolio escrita en la portada de LinkedIn.
const PORTFOLIO_LABEL = "hernandorey-31.web.app";

// Idiomas de la portada de LinkedIn (es una sola imagen para todo el perfil).
const LINKEDIN_LANGS = ["es"];

// Desde aquí los ven los README y los correos.
const RAW = "https://raw.githubusercontent.com/hrking31/hrking31/main/firma";

// Colores de la firma de correo: se leen sobre fondo blanco y también cuando Gmail
// los invierte en el modo oscuro del celular.
const MAIL = {
  ink: "#1f2328",
  role: "#3d444d",
  muted: "#6b7280",
  brand: "#ea580c",
};

// Textos de la página para copiar la firma de correo.
const PAGE = {
  es: {
    title: "Firma de correo · Hernando Rey",
    button: "Copiar firma",
    copied: "¡Copiada! Pégala en Gmail con Ctrl + V.",
    failed: "No se pudo copiar: selecciona la firma con el mouse y copia con Ctrl + C.",
    steps: [
      "Pulsa <b>Copiar firma</b>.",
      "En Gmail: ⚙️ → <b>Ver todos los ajustes</b> → pestaña <b>General</b> → sección <b>Firma</b>.",
      "<b>Crear nueva</b> (por ejemplo «Español»), haz clic en el cuadro y pega con <b>Ctrl + V</b>.",
      "Abajo, en <b>Valores predeterminados de firma</b>, elígela para correos nuevos y respuestas.",
      "Baja hasta el final y pulsa <b>Guardar cambios</b>.",
    ],
  },
  en: {
    title: "Email signature · Hernando Rey",
    button: "Copy signature",
    copied: "Copied! Paste it in Gmail with Ctrl + V.",
    failed: "Couldn't copy: select the signature with the mouse and press Ctrl + C.",
    steps: [
      "Click <b>Copy signature</b>.",
      "In Gmail: ⚙️ → <b>See all settings</b> → <b>General</b> tab → <b>Signature</b> section.",
      "<b>Create new</b> (e.g. “English”), click in the box and paste with <b>Ctrl + V</b>.",
      "Below, under <b>Signature defaults</b>, pick it for new emails and replies.",
      "Scroll to the bottom and click <b>Save Changes</b>.",
    ],
  },
};

const STACK = [
  { label: "React", icon: "react" },
  { label: "Node.js", icon: "node" },
  { label: "Firebase", icon: "firebase" },
  { label: "REST APIs", icon: "api" },
  { label: "IoT · ESP32", icon: "wifi" },
];

// highlight: borde naranja (el botón principal).
const BUTTONS = [
  { id: "portafolio", label: "Portafolio", icon: "external", highlight: true },
  { id: "portfolio", label: "Portfolio", icon: "external", highlight: true },
  { id: "linkedin", label: "LinkedIn", icon: "linkedin" },
  { id: "github", label: "GitHub", icon: "github" },
  // El correo va escrito en el botón (sirve en ambos idiomas): así se lee sin
  // pulsar nada. En el README enlaza a Gmail, porque mailto: no hace nada si el
  // visitante no tiene una aplicación de correo configurada.
  { id: "correo", label: "hrking31@gmail.com", icon: "mail" },
];

// Fondos iguales a los de GitHub para que el banner no muestre bordes.
const THEMES = {
  oscuro: {
    bg: "#0d1117",
    ink: "#f5f6f7",
    role: "#d0d4da",
    label: "#e6e8eb",
    muted: "#a2a8b1",
    sep: "#3d434c",
    brand: "#f97316",
    wifi: "#a78bfa",
    glow: 0.38,
  },
  claro: {
    bg: "#ffffff",
    ink: "#1f2328",
    role: "#3d444d",
    label: "#1f2328",
    muted: "#59636e",
    sep: "#d1d9e0",
    brand: "#ea580c",
    wifi: "#8b5cf6",
    glow: 0.2,
  },
};

// --- Fuentes -----------------------------------------------------------------

const WEIGHTS = [400, 500, 800];
const FAMILY = "FirmaInter";

async function downloadFonts(chars) {
  const url =
    `https://fonts.googleapis.com/css2?family=Inter:wght@${WEIGHTS.join(";")}` +
    `&text=${encodeURIComponent(chars)}`;
  const css = await (await fetch(url)).text();
  for (const block of css.split("@font-face").slice(1)) {
    const weight = Number(block.match(/font-weight:\s*(\d+)/)[1]);
    const src = block.match(/url\((.+?)\)/)[1];
    const data = Buffer.from(await (await fetch(src)).arrayBuffer());
    writeFileSync(join(fontsDir, `inter-${weight}.ttf`), data);
  }
}

// Lee de un archivo TTF lo justo para medir textos: el glifo de cada letra
// (tabla cmap) y su ancho (tablas hhea y hmtx).
function parseFont(buf) {
  const tables = {};
  for (let i = 0; i < buf.readUInt16BE(4); i++) {
    const rec = 12 + i * 16;
    tables[buf.toString("ascii", rec, rec + 4)] = buf.readUInt32BE(rec + 8);
  }
  const unitsPerEm = buf.readUInt16BE(tables.head + 18);
  const metrics = buf.readUInt16BE(tables.hhea + 34);
  const advance = (glyph) => buf.readUInt16BE(tables.hmtx + 4 * Math.min(glyph, metrics - 1));
  const glyphOf = cmapLookup(buf, tables.cmap);

  return {
    base64: buf.toString("base64"),
    width(text, size) {
      let units = 0;
      for (const ch of text) {
        const glyph = glyphOf(ch.codePointAt(0));
        if (!glyph) throw new Error(`La fuente no tiene la letra "${ch}"`);
        units += advance(glyph);
      }
      return (units * size) / unitsPerEm;
    },
  };
}

function cmapLookup(buf, cmap) {
  const subtables = {};
  for (let i = 0; i < buf.readUInt16BE(cmap + 2); i++) {
    const offset = cmap + buf.readUInt32BE(cmap + 4 + i * 8 + 4);
    subtables[buf.readUInt16BE(offset)] = offset;
  }
  if (subtables[12] !== undefined) {
    const o = subtables[12];
    return (code) => {
      for (let g = 0; g < buf.readUInt32BE(o + 12); g++) {
        const rec = o + 16 + g * 12;
        const start = buf.readUInt32BE(rec);
        if (code >= start && code <= buf.readUInt32BE(rec + 4)) {
          return buf.readUInt32BE(rec + 8) + code - start;
        }
      }
      return 0;
    };
  }
  const o = subtables[4];
  const segX2 = buf.readUInt16BE(o + 6);
  const ends = o + 14;
  const starts = ends + segX2 + 2;
  const deltas = starts + segX2;
  const ranges = deltas + segX2;
  return (code) => {
    for (let i = 0; i < segX2; i += 2) {
      if (code > buf.readUInt16BE(ends + i)) continue;
      const start = buf.readUInt16BE(starts + i);
      if (code < start) return 0;
      const delta = buf.readInt16BE(deltas + i);
      const range = buf.readUInt16BE(ranges + i);
      if (range === 0) return (code + delta) & 0xffff;
      const glyph = buf.readUInt16BE(ranges + i + range + 2 * (code - start));
      return glyph ? (glyph + delta) & 0xffff : 0;
    }
    return 0;
  };
}

async function loadFonts() {
  const texts = [
    "Hernando Rey",
    "JS",
    "API",
    PORTFOLIO_LABEL,
    ...STACK.map((item) => item.label),
    ...BUTTONS.map((button) => button.label),
    ...Object.values(TEXTS).flatMap((t) => [t.role, t.location, t.status]),
  ];
  const chars = [...new Set(texts.join(""))].sort().join("");
  mkdirSync(fontsDir, { recursive: true });
  try {
    await downloadFonts(chars);
  } catch (error) {
    console.warn("Sin conexión con Google Fonts; uso la copia de firma/fuentes.", error.message);
  }
  const fonts = {};
  for (const weight of WEIGHTS) {
    const file = join(fontsDir, `inter-${weight}.ttf`);
    if (!existsSync(file)) throw new Error(`Falta ${file}: ejecuta con internet una vez.`);
    fonts[weight] = parseFont(readFileSync(file));
  }
  return fonts;
}

const fontFaces = (fonts, weights) =>
  weights
    .map(
      (weight) =>
        `@font-face { font-family: ${FAMILY}; font-weight: ${weight}; ` +
        `src: url(data:font/ttf;base64,${fonts[weight].base64}) format("truetype"); }`,
    )
    .join("\n    ");

const STYLE_TEXT = `text { font-family: ${FAMILY}, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; font-kerning: none; }`;

const escape = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Línea base para centrar un texto en vertical (altura de mayúsculas de Inter ≈ 0,727 em).
const baseline = (centerY, size) => centerY + size * 0.3635;

const round = (n) => Math.round(n * 10) / 10;

// --- Íconos (dibujados para no depender de emojis ni de servicios externos) ---

// Tecnologías: caja de 48 × 48.
const STACK_ICONS = {
  react: () => `
      <g fill="none" stroke="#22d3ee" stroke-width="2.6">
        <ellipse cx="24" cy="24" rx="22" ry="8.5"/>
        <ellipse cx="24" cy="24" rx="22" ry="8.5" transform="rotate(60 24 24)"/>
        <ellipse cx="24" cy="24" rx="22" ry="8.5" transform="rotate(120 24 24)"/>
      </g>
      <circle cx="24" cy="24" r="4.2" fill="#22d3ee"/>`,
  node: () => `
      <path d="M24 2 43 13v22L24 46 5 35V13z" fill="none" stroke="#6cc24a" stroke-width="2.8" stroke-linejoin="round"/>
      <text x="24" y="31" text-anchor="middle" font-size="19" font-weight="800" fill="#6cc24a">JS</text>`,
  firebase: () => `
      <g transform="scale(2)">
        <path d="M14.3 7.147l-1.82-3.482a.542.542 0 0 0-.96 0L3.53 17.984z" fill="#f57c00"/>
        <path d="M3.89 15.672 6.255.461A.542.542 0 0 1 7.27.288l2.543 4.771z" fill="#ffa000"/>
        <path d="M20.684 19.364l-2.25-14a.54.54 0 0 0-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 0 0 1.588 0z" fill="#ffca28"/>
      </g>`,
  api: () => `
      <path d="M13 37h22a8.5 8.5 0 0 0 1.4-16.9 12 12 0 0 0-23-2.6A9.8 9.8 0 0 0 13 37z" fill="none" stroke="#3b82f6" stroke-width="2.6" stroke-linejoin="round"/>
      <text x="24.5" y="32" text-anchor="middle" font-size="11" font-weight="800" fill="#3b82f6">API</text>`,
  wifi: (c) => {
    const arc = (r) => {
      const d = round(r * Math.SQRT1_2);
      return `<path d="M${round(24 - d)} ${round(38 - d)}A${r} ${r} 0 0 1 ${round(24 + d)} ${round(38 - d)}"/>`;
    };
    return `
      <g fill="none" stroke="${c.wifi}" stroke-width="3.6" stroke-linecap="round">${arc(9)}${arc(17)}${arc(25)}</g>
      <circle cx="24" cy="37" r="3.4" fill="${c.wifi}"/>`;
  },
};

// Botones: caja de 36 × 36.
const BUTTON_ICONS = {
  external: (color) => `
      <g fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M29 20v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3h10"/>
        <path d="M23 3h10v10M33 3 16 20"/>
      </g>`,
  linkedin: (color) => `
      <path transform="scale(1.5)" fill="${color}" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.063 2.063 0 1 1 0-4.126 2.063 2.063 0 0 1 0 4.126zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>`,
  github: (color) => `
      <path transform="scale(1.5)" fill="${color}" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>`,
  mail: (color) => `
      <g fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="6" width="32" height="24" rx="3"/>
        <path d="m3 8 15 12L33 8"/>
      </g>`,
};

// --- Banner --------------------------------------------------------------------

// Medidas tomadas de la imagen de referencia (2000 px de ancho).
const W = 2000;
const H = 490;
const TEXT_X = 478;
const STACK_Y = 329;
const STATUS_Y = 408;

// Tamaños de letra ajustados para que los textos en inglés midan lo mismo que
// en la referencia; el español usa los mismos tamaños.
function fitSizes(fonts) {
  const fit = (font, texts, width) =>
    round((width * 100) / texts.reduce((sum, text) => sum + font.width(text, 100), 0));
  return {
    name: fit(fonts[800], ["Hernando Rey"], 652),
    role: fit(fonts[400], [TEXTS.en.role], 817),
    stack: fit(fonts[500], STACK.map((item) => item.label), 548),
    status: fit(fonts[400], [TEXTS.en.location], 276),
    button: fit(fonts[500], ["Portfolio"], 100),
  };
}

// Gradiente, filtro y recorte del logo (los usan el banner y el PNG del correo).
const LOGO_DEFS = `
    <linearGradient id="naranja" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff8f2e"/>
      <stop offset="1" stop-color="#f25a0a"/>
    </linearGradient>
    <!-- Deja solo el león (lo oscuro) y vuelve transparente el naranja plano del PNG. -->
    <filter id="silueta" color-interpolation-filters="sRGB">
      <feColorMatrix type="matrix" values="0 0 0 0 0.08  0 0 0 0 0.05  0 0 0 0 0.03  -0.723 -2.432 -0.245 0 1.2"/>
      <!-- Sin esto, las partes transparentes del PNG se volverían negras. -->
      <feComposite in2="SourceAlpha" operator="in"/>
    </filter>
    <clipPath id="logo"><rect x="112" y="118" width="252" height="252" rx="48"/></clipPath>`;

const LOGO = `
  <g clip-path="url(#logo)">
    <rect x="112" y="118" width="252" height="252" fill="url(#naranja)"/>
    <image x="113" y="113" width="250" height="250" filter="url(#silueta)" href="data:image/png;base64,${lion}"/>
  </g>`;

const halo = (c, opacity) => `
    <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${c.brand}" stop-opacity="${opacity}"/>
      <stop offset="1" stop-color="${c.brand}" stop-opacity="0"/>
    </radialGradient>`;

// Nombre, rol, tecnologías y estado, en las coordenadas del banner. Con url, la
// línea del estado termina con la dirección del portafolio; sin header, no lleva
// nombre ni rol (los dos los usa la portada de LinkedIn).
function textBlock(fonts, sizes, t, c, { url, header = true } = {}) {
  let x = TEXT_X + 2;
  const stack = STACK.map((item, i) => {
    let svg = "";
    if (i > 0) {
      x += 38;
      svg += `\n    <rect x="${round(x)}" y="${STACK_Y - 15}" width="2" height="30" fill="${c.sep}"/>`;
      x += 44;
    }
    svg += `\n    <g transform="translate(${round(x)} ${STACK_Y - 24})">${STACK_ICONS[item.icon](c)}\n    </g>`;
    x += 78;
    svg += `\n    <text x="${round(x)}" y="${round(baseline(STACK_Y, sizes.stack))}" font-size="${sizes.stack}" font-weight="500" fill="${c.label}">${escape(item.label)}</text>`;
    x += fonts[500].width(item.label, sizes.stack);
    return svg;
  }).join("");

  const statusBase = round(baseline(STATUS_Y, sizes.status));
  const sepX = round(520 + fonts[400].width(t.location, sizes.status) + 36);
  let link = "";
  if (url) {
    const urlSep = round(sepX + 76 + fonts[400].width(t.status, sizes.status) + 36);
    link = `
  <rect x="${urlSep}" y="${STATUS_Y - 13}" width="2" height="26" fill="${c.sep}"/>
  <g transform="translate(${round(urlSep + 38)} ${STATUS_Y - 13}) scale(1.08)" fill="none" stroke="${c.brand}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </g>
  <text x="${round(urlSep + 76)}" y="${statusBase}" font-size="${sizes.status}" font-weight="500" fill="${c.label}">${escape(url)}</text>`;
  }

  const head = header ? `
  <text x="${TEXT_X}" y="197" font-size="${sizes.name}" font-weight="800" fill="${c.ink}">Hernando <tspan fill="${c.brand}">Rey</tspan></text>
  <text x="${TEXT_X + 2}" y="257" font-size="${sizes.role}" font-weight="400" fill="${c.role}">${escape(t.role)}</text>` : "";

  return `${head}
${stack}

  <path transform="translate(480 ${STATUS_Y - 14}) scale(1.35)" d="M8 0C3.6 0 0 3.5 0 7.9 0 13.8 8 20 8 20s8-6.2 8-12.1C16 3.5 12.4 0 8 0zm0 10.8a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" fill="${c.brand}"/>
  <text x="520" y="${statusBase}" font-size="${sizes.status}" font-weight="400" fill="${c.muted}">${escape(t.location)}</text>
  <rect x="${sepX}" y="${STATUS_Y - 13}" width="2" height="26" fill="${c.sep}"/>
  <circle cx="${round(sepX + 48)}" cy="${STATUS_Y}" r="9" fill="#22c55e"/>
  <text x="${round(sepX + 76)}" y="${statusBase}" font-size="${sizes.status}" font-weight="400" fill="${c.muted}">${escape(t.status)}</text>${link}`;
}

const svgHead = (fonts, width, height, viewBox, title) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}" role="img" aria-labelledby="titulo">
  <title id="titulo">${escape(title)}</title>
  <style>
    ${fontFaces(fonts, WEIGHTS)}
    ${STYLE_TEXT}
  </style>`;

function banner(fonts, sizes, lang, themeName) {
  const t = TEXTS[lang];
  const c = THEMES[themeName];

  return `${svgHead(fonts, W / 2, H / 2, `0 0 ${W} ${H}`, t.title)}
  <defs>${halo(c, c.glow)}${LOGO_DEFS}
  </defs>

  <rect width="${W}" height="${H}" fill="${c.bg}"/>
  <circle cx="220" cy="230" r="250" fill="url(#halo)"/>
${LOGO}

  <rect x="426" y="130" width="4" height="230" rx="2" fill="${c.brand}"/>
${textBlock(fonts, sizes, t, c)}

  <rect x="106" y="456" width="1788" height="4" rx="2" fill="${c.brand}"/>
</svg>
`;
}

// --- Logo para el correo ---------------------------------------------------------

// Solo el cuadro del logo. Se pasa a PNG (los correos no muestran SVG).
const logoSvg = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="112 118 252 252">
  <defs>${LOGO_DEFS}
  </defs>${LOGO}
</svg>
`;

// --- Portada de LinkedIn ---------------------------------------------------------

// 1584 × 396 px es la medida que pide LinkedIn. La foto de perfil tapa la esquina
// inferior izquierda (en computador desde y ≈ 205; en el celular hasta x ≈ 510).
// Por eso el nombre va grande arriba a la izquierda, sobre la foto, y el resto a
// la derecha de ella. El logo sobra (ahí está la foto) y los botones no se pueden
// pulsar, así que el portafolio va escrito.
const LI_W = 1584;
const LI_H = 396;

function linkedinCover(fonts, sizes, lang) {
  const t = TEXTS[lang];
  const c = THEMES.oscuro;
  const fit = (font, text, width, max) => round(Math.min(max, (width * 100) / font.width(text, 100)));
  const nameSize = fit(fonts[800], "Hernando Rey", 900, 140);
  const roleSize = fit(fonts[400], t.role, 900, 42);

  // Tecnologías y estado: los del banner, más pequeños y a la derecha de la foto.
  // left: lo más a la izquierda que se puede sin que la foto lo tape en el celular.
  const scale = 0.74;
  const left = 520;
  // Fin de la fila más larga (en coordenadas del banner), para que la línea naranja
  // mida lo mismo que el bloque.
  const w = (weight, text, size) => fonts[weight].width(text, size);
  const stackEnd =
    TEXT_X + 2 + STACK.reduce((sum, item) => sum + 78 + w(500, item.label, sizes.stack), 0) + 82 * (STACK.length - 1);
  const statusEnd =
    520 + w(400, t.location, sizes.status) + 36 + 76 + w(400, t.status, sizes.status) + 36 + 76 +
    w(500, PORTFOLIO_LABEL, sizes.status);
  const lineWidth = round((Math.max(stackEnd, statusEnd) - (TEXT_X + 2)) * scale);
  const dx = round(left - (TEXT_X + 2) * scale);
  const dy = round(254 - STACK_Y * scale);

  return `${svgHead(fonts, LI_W, LI_H, `0 0 ${LI_W} ${LI_H}`, t.title)}
  <defs>${halo(c, 0.32)}
  </defs>

  <rect width="${LI_W}" height="${LI_H}" fill="${c.bg}"/>
  <circle cx="210" cy="300" r="300" fill="url(#halo)"/>

  <rect x="48" y="46" width="4" height="146" rx="2" fill="${c.brand}"/>
  <text x="72" y="132" font-size="${nameSize}" font-weight="800" fill="${c.ink}">Hernando <tspan fill="${c.brand}">Rey</tspan></text>
  <text x="76" y="182" font-size="${roleSize}" font-weight="400" fill="${c.role}">${escape(t.role)}</text>

  <g transform="translate(${dx} ${dy}) scale(${scale})">${textBlock(fonts, sizes, t, c, { url: PORTFOLIO_LABEL, header: false })}
  </g>

  <rect x="${left}" y="350" width="${lineWidth}" height="3" rx="1.5" fill="${c.brand}"/>
</svg>
`;
}

// --- Firma de correo -------------------------------------------------------------

// Tabla con estilos en línea: es lo único que respetan Gmail, Outlook y Apple Mail.
// Solo el logo es imagen; el resto es texto, para que se lea aunque el destinatario
// bloquee las imágenes y para que el correo y el teléfono se puedan copiar.
function emailSignature(lang) {
  const t = TEXTS[lang];
  const link = (href, label, color = MAIL.brand, weight = "bold") =>
    `<a href="${href}" style="color:${color};font-weight:${weight};text-decoration:none;">${escape(label)}</a>`;
  const dot = `<span style="color:${MAIL.muted};">&nbsp;·&nbsp;</span>`;

  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;border-collapse:collapse;">
  <tr>
    <td style="vertical-align:top;padding:0 16px 0 0;">
      <a href="${CONTACT.portfolio[lang]}"><img src="${RAW}/correo/logo.png" width="80" height="80" alt="Hernando Rey" style="display:block;border:0;width:80px;height:80px;"></a>
    </td>
    <td style="vertical-align:top;padding:0 0 0 16px;border-left:3px solid ${MAIL.brand};">
      <div style="font-size:20px;line-height:24px;font-weight:bold;color:${MAIL.ink};">Hernando <span style="color:${MAIL.brand};">Rey</span></div>
      <div style="font-size:14px;line-height:20px;color:${MAIL.role};">${escape(t.role)}</div>
      <div style="font-size:12px;line-height:18px;color:${MAIL.muted};padding-top:2px;">${STACK.map((item) => escape(item.label)).join(" · ")}</div>
      <div style="font-size:13px;line-height:20px;padding-top:8px;">${link(CONTACT.portfolio[lang], t.portfolio)}${dot}${link(CONTACT.linkedin, "LinkedIn")}${dot}${link(CONTACT.github, "GitHub")}</div>
      <div style="font-size:12px;line-height:18px;color:${MAIL.muted};">${link(CONTACT.whatsapp, CONTACT.phone, MAIL.muted, "normal")}${dot}${link(`mailto:${CONTACT.email}`, CONTACT.email, MAIL.muted, "normal")}</div>
      <div style="font-size:12px;line-height:18px;color:${MAIL.muted};">${escape(t.location)}${dot}<span style="color:#16a34a;">●</span>&nbsp;${escape(t.status)}</div>
    </td>
  </tr>
</table>`;
}

// Página para copiar la firma: se abre en el navegador, se pulsa "Copiar firma" y
// se pega en Gmail (Configuración → Firma). Gmail no acepta pegar código HTML.
function emailPage(lang) {
  const p = PAGE[lang];
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(p.title)}</title>
</head>
<body style="margin:0;padding:32px 16px;background:#f6f8fa;font-family:system-ui,'Segoe UI',Arial,sans-serif;color:#1f2328;">
<div style="max-width:640px;margin:0 auto;">
  <h1 style="font-size:20px;margin:0 0 12px;">${escape(p.title)}</h1>
  <ol style="font-size:14px;line-height:22px;padding-left:20px;margin:0 0 16px;">
    ${p.steps.map((step) => `<li>${step}</li>`).join("\n    ")}
  </ol>
  <button id="copiar" type="button" style="font:inherit;font-size:14px;font-weight:600;padding:8px 16px;border:0;border-radius:8px;background:#ea580c;color:#fff;cursor:pointer;">${escape(p.button)}</button>
  <span id="estado" style="font-size:14px;margin-left:8px;"></span>
  <div style="margin-top:16px;padding:24px;background:#fff;border:1px solid #d0d7de;border-radius:12px;">
<div id="firma">
${emailSignature(lang)}
</div>
  </div>
</div>
<script>
  document.getElementById("copiar").addEventListener("click", () => {
    const range = document.createRange();
    range.selectNode(document.getElementById("firma"));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    const ok = document.execCommand("copy");
    selection.removeAllRanges();
    document.getElementById("estado").textContent = ok ? ${JSON.stringify(p.copied)} : ${JSON.stringify(p.failed)};
  });
</script>
</body>
</html>
`;
}

// --- PNG con Chrome --------------------------------------------------------------

const CHROME = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find((path) => path && existsSync(path));

// Abre el SVG en Chrome sin ventana y le toma una captura del tamaño exacto, con
// fondo transparente.
function renderPng(svg, file, width, height) {
  const source = join(tmpdir(), `firma-${process.pid}.svg`);
  writeFileSync(source, svg);
  rmSync(file, { force: true });
  spawnSync(CHROME, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "--default-background-color=00000000",
    `--window-size=${width},${height}`,
    `--user-data-dir=${join(tmpdir(), "firma-chrome")}`,
    `--screenshot=${file}`,
    pathToFileURL(source).href,
  ]);
  rmSync(source, { force: true });
  if (!existsSync(file)) throw new Error(`Chrome no pudo crear ${file}`);
}

// --- Botones -------------------------------------------------------------------

// Medidas de la referencia (2000 px de ancho). PAD es un margen transparente a
// cada lado que separa los botones cuando van uno al lado del otro en el README.
const BTN_H = 78;
const PAD = 22;

function button(fonts, sizes, spec, themeName) {
  const c = THEMES[themeName];
  const labelX = 108;
  const arrowX = round(labelX + fonts[500].width(spec.label, sizes.button) + 52);
  const width = round(arrowX + 24 + 40);
  const totalW = round(width + PAD * 2);
  const totalH = BTN_H + 4;
  const cy = 2 + BTN_H / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${round(totalW / 2)}" height="${totalH / 2}" viewBox="0 0 ${totalW} ${totalH}" role="img" aria-label="${escape(spec.label)}">
  <style>
    ${fontFaces(fonts, [500])}
    ${STYLE_TEXT}
  </style>
  <rect x="${PAD + 1.25}" y="3.25" width="${round(width - 2.5)}" height="${BTN_H - 2.5}" rx="26" fill="none" stroke="${spec.highlight ? c.brand : c.sep}" stroke-width="2.5"/>
  <g transform="translate(${PAD + 42} ${cy - 18})">${BUTTON_ICONS[spec.icon](c.brand)}
  </g>
  <text x="${PAD + labelX}" y="${round(baseline(cy, sizes.button))}" font-size="${sizes.button}" font-weight="500" fill="${c.ink}">${escape(spec.label)}</text>
  <g transform="translate(${round(PAD + arrowX)} ${cy - 12})" fill="none" stroke="${c.label}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 12h18M14 5l7 7-7 7"/>
  </g>
</svg>
`;
}

// --- Salida --------------------------------------------------------------------

const fonts = await loadFonts();
const sizes = fitSizes(fonts);

for (const themeName of Object.keys(THEMES)) {
  for (const lang of Object.keys(TEXTS)) {
    const file = join(here, `firma-${lang}-${themeName}.svg`);
    writeFileSync(file, banner(fonts, sizes, lang, themeName));
    console.log("creada", file.replace(here, "firma"));
  }
  for (const spec of BUTTONS) {
    const file = join(here, `boton-${spec.id}-${themeName}.svg`);
    writeFileSync(file, button(fonts, sizes, spec, themeName));
    console.log("creada", file.replace(here, "firma"));
  }
}

mkdirSync(join(here, "correo"), { recursive: true });
mkdirSync(join(here, "linkedin"), { recursive: true });

for (const lang of Object.keys(TEXTS)) {
  const file = join(here, "correo", `firma-${lang}.html`);
  writeFileSync(file, emailPage(lang));
  console.log("creada", file.replace(here, "firma"));
}

if (CHROME) {
  // El logo se muestra a 80 px; se guarda al doble para que se vea nítido.
  const logo = join(here, "correo", "logo.png");
  renderPng(logoSvg(160), logo, 160, 160);
  console.log("creada", logo.replace(here, "firma"));

  for (const lang of LINKEDIN_LANGS) {
    const file = join(here, "linkedin", `portada-${lang}.png`);
    renderPng(linkedinCover(fonts, sizes, lang), file, LI_W, LI_H);
    console.log("creada", file.replace(here, "firma"));
  }
} else {
  console.warn("No encontré Chrome: no se crearon los PNG (logo del correo y portada de LinkedIn).");
}
