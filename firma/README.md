# Firma de marca para los README

Banner de Hernando Rey (logo, rol, tecnologías y estado) con botones de contacto,
para pegar al final de cualquier README. GitHub elige solo la versión clara u
oscura según el tema de quien lo ve.

- Para cambiar un texto: editar `generar.mjs`, ejecutar `node firma/generar.mjs`
  y subir los cambios. Todos los README que usan la firma se actualizan solos.
- Las imágenes se sirven desde este repositorio (`hrking31/hrking31`), así que
  no hay que copiar archivos a cada proyecto.
- Los botones son imágenes aparte (`boton-*.svg`) para que cada uno tenga su
  propio enlace: dentro de una sola imagen, GitHub no deja pulsar nada.
- La letra (Inter) va incrustada en cada imagen, así se ve igual en cualquier
  sistema. `generar.mjs` la descarga de Google Fonts y guarda una copia en
  `fuentes/` por si no hay internet.

## Español

Pegar al final del `README.md`:

```html
---

<p align="center">
  <a href="https://hernandorey-31.web.app/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/hrking31/hrking31/main/firma/firma-es-oscuro.svg">
      <img alt="Hernando Rey, Desarrollador Full Stack e Ingeniero Electrónico" src="https://raw.githubusercontent.com/hrking31/hrking31/main/firma/firma-es-claro.svg" width="100%">
    </picture>
  </a>
</p>

<p align="center">
  <a href="https://hernandorey-31.web.app/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/hrking31/hrking31/main/firma/boton-portafolio-oscuro.svg"><img alt="Portafolio" src="https://raw.githubusercontent.com/hrking31/hrking31/main/firma/boton-portafolio-claro.svg" height="41"></picture></a>
  <a href="https://www.linkedin.com/in/hernandorey/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/hrking31/hrking31/main/firma/boton-linkedin-oscuro.svg"><img alt="LinkedIn" src="https://raw.githubusercontent.com/hrking31/hrking31/main/firma/boton-linkedin-claro.svg" height="41"></picture></a>
  <a href="https://github.com/hrking31"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/hrking31/hrking31/main/firma/boton-github-oscuro.svg"><img alt="GitHub" src="https://raw.githubusercontent.com/hrking31/hrking31/main/firma/boton-github-claro.svg" height="41"></picture></a>
  <a href="mailto:hrking31@gmail.com"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/hrking31/hrking31/main/firma/boton-correo-oscuro.svg"><img alt="Correo" src="https://raw.githubusercontent.com/hrking31/hrking31/main/firma/boton-correo-claro.svg" height="41"></picture></a>
</p>
```

## English

Paste at the end of `README.en.md` (or of an English-only README):

```html
---

<p align="center">
  <a href="https://hernandorey-31.web.app/en">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/hrking31/hrking31/main/firma/firma-en-oscuro.svg">
      <img alt="Hernando Rey, Full Stack Developer and Electronics Engineer" src="https://raw.githubusercontent.com/hrking31/hrking31/main/firma/firma-en-claro.svg" width="100%">
    </picture>
  </a>
</p>

<p align="center">
  <a href="https://hernandorey-31.web.app/en"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/hrking31/hrking31/main/firma/boton-portfolio-oscuro.svg"><img alt="Portfolio" src="https://raw.githubusercontent.com/hrking31/hrking31/main/firma/boton-portfolio-claro.svg" height="41"></picture></a>
  <a href="https://www.linkedin.com/in/hernandorey/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/hrking31/hrking31/main/firma/boton-linkedin-oscuro.svg"><img alt="LinkedIn" src="https://raw.githubusercontent.com/hrking31/hrking31/main/firma/boton-linkedin-claro.svg" height="41"></picture></a>
  <a href="https://github.com/hrking31"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/hrking31/hrking31/main/firma/boton-github-oscuro.svg"><img alt="GitHub" src="https://raw.githubusercontent.com/hrking31/hrking31/main/firma/boton-github-claro.svg" height="41"></picture></a>
  <a href="mailto:hrking31@gmail.com"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/hrking31/hrking31/main/firma/boton-email-oscuro.svg"><img alt="Email" src="https://raw.githubusercontent.com/hrking31/hrking31/main/firma/boton-email-claro.svg" height="41"></picture></a>
</p>
```
