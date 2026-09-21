# RVH Ollas — sitio provisorio

Sitio de una sola página para **RVH Ollas**, una línea de utensilios de cocina de
hierro fundido fabricados en Paraguay.

Hecho con HTML, CSS y JavaScript vanilla. Sin frameworks, sin npm, sin bundlers
y sin paso de compilación: funciona abriendo `index.html` y funciona publicado en
GitHub Pages. El único recurso externo son las tipografías de Google Fonts
(Fraunces e Inter).

> **El nombre es provisorio.** Está pensado para cambiarse en 7 lugares
> marcados con el comentario `MARCA`. Ver [Renombrar la marca](#renombrar-la-marca).

---

## Estructura

```
index.html        una sola página con navegación por anclas
css/styles.css    estilos, ordenados por secciones y comentados
js/main.js        CONFIG + menú, galería, formulario y animaciones
img/              renders de los productos
README.md         este archivo
```

---

## Verlo en local

**Opción rápida:** doble clic en `index.html`. No hace falta nada más.

**Opción con servidor** (recomendada si vas a probar links y compartir en la red
local). Con Python ya instalado:

```bash
python3 -m http.server 8000
```

Y abrir <http://localhost:8000>.

---

## Publicarlo en GitHub Pages

1. Subí el proyecto a un repositorio de GitHub (rama `main`).
2. En el repo: **Settings → Pages**.
3. En *Build and deployment*, **Source**: `Deploy from a branch`.
4. **Branch**: `main` y **carpeta**: `/ (root)`. Guardar.
5. A los pocos minutos el sitio queda en
   `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

Como todas las rutas del sitio son relativas (`css/styles.css`, `img/olla.png`),
funciona igual si el sitio cuelga de un subdirectorio.

**Al publicar, actualizá el Open Graph.** En `index.html` la etiqueta
`og:image` apunta a `img/olla-tapa.png`. Para que la vista previa se vea bien al
compartir el link en WhatsApp o Instagram, reemplazala por la URL completa:

```html
<meta property="og:image" content="https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/img/olla-tapa.png">
```

---

## Cambiar el número de WhatsApp

Todo lo que depende del WhatsApp sale de un solo lugar: el objeto `CONFIG` al
principio de **`js/main.js`**.

```js
const CONFIG = {
  whatsapp: "595XXXXXXXXX",  // número completo, solo dígitos, con código de país (595)
  instagram: "#",            // URL completa del perfil
  marca: "RVH Ollas"         // MARCA 7/7 · nombre usado en los mensajes de WhatsApp
};
```

- **`whatsapp`**: el número entero, **solo dígitos**. Sin `+`, sin espacios, sin
  guiones y sin el 0 inicial. Por ejemplo, para `0981 123 456` se escribe
  `"595981123456"`.
- **`instagram`**: la URL completa del perfil, por ejemplo
  `"https://instagram.com/rvhollas"`. Mientras quede en `"#"`, los enlaces de
  Instagram no llevan a ningún lado.

Con eso alcanza: los tres botones "Consultar por WhatsApp", el botón del hero, el
enlace de la sección Contacto y el formulario arman solos el mensaje.

> **Mientras el número siga siendo el placeholder `595XXXXXXXXX`**, los botones
> de WhatsApp llevan al formulario de contacto en vez de abrir un chat roto, y el
> formulario avisa "Todavía falta cargar el número de WhatsApp en js/main.js".
> Apenas pongas el número real, todo empieza a abrir WhatsApp. No hay que tocar
> nada más.

---

## Renombrar la marca

El nombre aparece en **7 lugares**, todos marcados con un comentario `MARCA n/7`
para encontrarlos rápido:

```bash
grep -rn "RVH Ollas" index.html js/main.js
```

| # | Archivo | Línea | Qué es |
|---|---------|-------|--------|
| 1 | `index.html` | 8 | `<title>` — pestaña del navegador y resultado de búsqueda |
| 2 | `index.html` | 12 | `<meta name="description">` — descripción para buscadores |
| 3 | `index.html` | 19 | `<meta property="og:title">` — título al compartir el link |
| 4 | `index.html` | 24 | `<meta property="og:site_name">` — nombre del sitio en redes |
| 5 | `index.html` | 52 | logo tipográfico del **header** (`.logo__texto`) |
| 6 | `index.html` | 440 | logo tipográfico del **footer** (`.pie__marca .logo__texto`) |
| 7 | `js/main.js` | 21 | `CONFIG.marca` — nombre que aparece en los mensajes de WhatsApp |

Cambiando esos siete valores la marca queda renombrada en todo el sitio. No hay
nombre escondido en el CSS ni en los textos de las secciones.

**El logo es tipográfico**, no una imagen: es texto en Fraunces con un punto
cobre-brasa al lado (`.logo__brasa`, dibujado con CSS). Por eso un nombre nuevo
entra sin rehacer ningún archivo gráfico. Si el nombre nuevo es mucho más largo,
podés ajustar `font-size` en `.logo__texto` dentro de `css/styles.css`.

El favicon también es propio: un SVG inline en el `<link rel="icon">` del
`<head>`, sin archivo externo.

---

## Las imágenes

`img/` tiene tres renders, todos de 1200 × 900 px con fondo gris claro:

| Archivo | Dónde se usa |
|---------|--------------|
| `olla-tapa.png` | imagen principal del hero y de la ficha de la olla |
| `olla.png` | segunda vista de la olla (galería) |
| `grill.png` | ficha del grill rectangular |

> ⚠️ **Los renders que están hoy en el repo son provisorios.** Se generaron para
> poder armar y revisar el diseño. Reemplazalos por los renders 3D definitivos
> **manteniendo los mismos nombres de archivo**; no hay que tocar el HTML.

Para que no se vea un recorte feo, los renders no van sueltos sobre el fondo:
van a sangre dentro de una tarjeta clara (`.marco`) y se funden con
`mix-blend-mode: multiply`, así el gris del render se mezcla con el crema de la
tarjeta. Conviene que los renders nuevos mantengan ese fondo gris claro y una
relación de 4:3.

Si cambiás la relación de aspecto, actualizá los atributos `width` y `height` de
los `<img>` en `index.html`: están puestos para reservar el espacio y evitar que
la página salte mientras carga.

---

## Tocar el diseño

Toda la paleta está en variables CSS, arriba de todo en `css/styles.css`:

```css
--hierro:      #1C1B1A   /* negro hierro, fondos oscuros    */
--carbon:      #262422   /* superficies sobre el negro      */
--brasa:       #B5541C   /* cobre-brasa, acento principal   */
--brasa-claro: #D9772F   /* acento sobre fondo oscuro       */
--brasa-oscuro:#9A4514   /* acento sobre fondo claro        */
--crema:       #F4EDE8   /* crema cálido, fondos claros     */
--lapacho:     #8C5A34   /* madera de lapacho, detalles     */
```

Cada sección declara si es clara u oscura con las clases `.seccion--clara` y
`.seccion--oscura`, y a partir de ahí se resuelven solos el color de texto, el
de acento, los bordes y el color del foco. Para dar vuelta una sección alcanza
con cambiarle la clase.

Las tipografías se cargan en una sola etiqueta `<link>` del `<head>`: **Fraunces**
para los títulos e **Inter** para el texto. Se cambian ahí y en las variables
`--serif` y `--sans`.

---

## Decisiones que conviene conocer

- **Accesibilidad**: HTML semántico, enlace "Saltar al contenido", menú
  hamburguesa con `aria-expanded` que se cierra con `Escape` y devuelve el foco,
  foco visible en todos los controles, textos alternativos en las imágenes y
  contraste AA en texto y acentos.
- **Animaciones**: las secciones aparecen al hacer scroll con
  `IntersectionObserver`. Si el sistema tiene activado *reducir movimiento*
  (`prefers-reduced-motion`), no se anima nada y todo se ve de entrada.
- **Sin JavaScript**: el contenido se ve completo igual. Lo único que se pierde
  son los enlaces de WhatsApp, la galería y el menú móvil.
- **Rendimiento**: las imágenes llevan `loading="lazy"` salvo la del hero, y
  todas tienen `width` y `height` para que no salte el layout.
- **Mobile first**: probado de 360 px hasta 1920 px, sin scroll horizontal en
  ningún ancho.
- **Sin precios**: el sitio no muestra precios; todo lleva a consultar por
  WhatsApp.
