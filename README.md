# RVH Ollas — sitio provisorio

Sitio de una sola página para **RVH Ollas**, una línea de utensilios de cocina de
hierro fundido fabricados en Paraguay.

Hecho con HTML, CSS y JavaScript vanilla. Sin frameworks, sin npm, sin bundlers
y sin paso de compilación: funciona abriendo `index.html` y funciona publicado en
GitHub Pages. El único recurso externo son las tipografías de Google Fonts
(Cormorant Garamond y Jost).

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
| 2 | `index.html` | 11 | `<meta name="description">` — descripción para buscadores |
| 3 | `index.html` | 17 | `<meta property="og:title">` — título al compartir el link |
| 4 | `index.html` | 22 | `<meta property="og:site_name">` — nombre del sitio en redes |
| 5 | `index.html` | 47 | logo tipográfico del **header** (`.marca__texto`) |
| 6 | `index.html` | 433 | logo tipográfico del **footer** (`.pie__marca`) |
| 7 | `js/main.js` | 21 | `CONFIG.marca` — nombre que aparece en los mensajes de WhatsApp |

Cambiando esos siete valores la marca queda renombrada en todo el sitio. No hay
nombre escondido en el CSS ni en los textos de las secciones.

**El logo es tipográfico**, no una imagen: es el nombre en Cormorant Garamond,
en mayúsculas y con mucho espaciado entre letras (`.marca__texto`). Por eso un
nombre nuevo entra sin rehacer ningún archivo gráfico. Si el nombre nuevo es
bastante más largo, ajustá `font-size` o `letter-spacing` en `.marca__texto`
dentro de `css/styles.css`.

El favicon también es propio: un SVG inline en el `<link rel="icon">` del
`<head>`, sin archivo externo.

---

## Las imágenes

`img/` tiene tres renders, todos de 1200 × 900 px sobre fondo claro:

| Archivo | Dónde se usa |
|---------|--------------|
| `olla-tapa.png` | imagen principal del hero y de la ficha de la olla |
| `olla.png` | segunda vista de la olla (galería) |
| `grill.png` | plancha del grill rectangular |

> ⚠️ **Los renders que están hoy en el repo son provisorios.** Se generaron para
> poder armar y revisar el diseño. Reemplazalos por los renders 3D definitivos
> **manteniendo los mismos nombres de archivo**; no hay que tocar el HTML.

Para que no se vea un recorte feo, los renders no van dentro de una tarjeta:
ocupan todo el ancho de su columna, se funden con `mix-blend-mode: multiply` y
se desvanecen en los bordes con una máscara. La pieza queda flotando sobre el
papel, con su propia sombra, sin ningún rectángulo a la vista.

**Sobre el fondo de los renders:** cuanto más claro y más cálido, mejor. El
empalme se vuelve invisible cuando el fondo del render se acerca al `--papel`
del sitio (`#FBF9F6`). Un gris frío o marcado se va a notar como una mancha
aunque la máscara suavice los bordes; si los renders definitivos vienen así,
subí los porcentajes del desvanecido en `.plato img`.

Conviene también que mantengan la relación de 4:3, con el producto centrado y
con aire arriba y abajo (la máscara desvanece el 11% superior e inferior y el
4,5% de cada lado). Si cambiás la relación de aspecto, actualizá los atributos
`width` y `height` de los `<img>` en `index.html`.

La sección **Origen** usa `img/olla-tapa.png` recortada en vertical para mostrar
el sostén de lapacho de cerca. El recorte se controla con `object-position` y
`transform: scale()` en `.plato--retrato`; si el render nuevo tiene el producto
en otra posición, ese es el lugar para ajustarlo.

---

## Tocar el diseño

Toda la paleta está en variables CSS, arriba de todo en `css/styles.css`:

```css
--papel:       #FBF9F6   /* blanco cálido, fondo base        */
--arena:       #F3EFE8   /* segundo tono, para alternar      */
--lino:        #EBE5DB   /* tono más asentado, pie de página */
--texto:       #33302C   /* gris cálido, nunca negro puro    */
--tenue:       #6E6760   /* texto secundario                 */
--cobre:       #A85A24   /* acento: botones                  */
--cobre-texto: #9C4D22   /* acento legible en texto chico    */
--lapacho:     #8A5A38   /* madera de lapacho, detalles      */
--laton:       #9A7434   /* sello y filetes                  */
```

La paleta es clara de punta a punta. El contraste fuerte lo pone el producto,
que es hierro negro sobre superficies casi blancas; el negro no se usa ni
siquiera para el texto, porque un negro puro sobre blanco endurece la página.

Cada sección elige su tono con `.seccion--blanca` o `.seccion--arena`, y las
piezas de la colección alternan solas (`.pieza:nth-of-type(even)`). Para dar
vuelta una sección alcanza con cambiarle la clase.

Las tipografías se cargan en una sola etiqueta `<link>` del `<head>`:
**Cormorant Garamond** para los títulos y **Jost** para el texto y las
versalitas. Se cambian ahí y en las variables `--display` y `--sans`.

Tres recursos sostienen el aire premium, por si hace falta tocarlos:

- **Grano.** `body::after` proyecta un ruido finísimo (SVG inline) sobre toda
  la página, al 3% de opacidad y en modo `multiply`. Le da textura de papel a
  los fondos claros. Se apaga cambiando `opacity` a `0`.
- **Platos.** `.plato` no tiene fondo propio. El render se funde con la sección
  mediante `mix-blend-mode: multiply` y dos desvanecidos cruzados: mucho arriba
  y abajo (11%), poco a los lados (4,5%). Así la pieza queda flotando sobre el
  papel, con su propia sombra, sin ningún rectángulo a la vista. El desvanecido
  lateral es chico a propósito: uno radial se comía las puntas del grill, que
  es una pieza ancha.
- **Sello.** El emblema "100% PARAGUAYA" es SVG inline dentro de `index.html`
  (sección Origen), con el texto sobre dos arcos: `#sello-arriba` va en
  sentido horario y `#sello-abajo` al revés, para que ninguno de los dos
  quede cabeza abajo. Los colores salen de `--laton` y `--laton-2`.

---

## Decisiones que conviene conocer

- **Accesibilidad**: HTML semántico, enlace "Saltar al contenido", menú a
  pantalla completa con `aria-expanded` que lleva el foco al primer enlace, se
  cierra con `Escape` y devuelve el foco al botón; foco visible en todos los
  controles, textos alternativos en las imágenes y contraste AA en texto y
  acentos.
- **Animaciones**: las secciones aparecen al hacer scroll con
  `IntersectionObserver`. Si el sistema tiene activado *reducir movimiento*
  (`prefers-reduced-motion`), no se anima nada y todo se ve de entrada.
- **Sin JavaScript**: el contenido se ve completo igual. Lo único que se pierde
  son los enlaces de WhatsApp, la galería y el menú móvil.
- **Rendimiento**: las imágenes llevan `loading="lazy"` salvo la del hero, y
  todas tienen `width` y `height` para que no salte el layout.
- **Mobile first**: probado de 360 px hasta 1920 px, sin scroll horizontal en
  ningún ancho.
- **Sin precios ni fichas técnicas**: el sitio no muestra precios, pesos ni
  medidas; todo lleva a consultar por WhatsApp.
- **Producción 100% paraguaya**: el mensaje aparece en cuatro lugares, que es
  donde conviene tocarlo si cambia la formulación — la volanta del hero, la
  franja de marca debajo del hero, la sección Origen y el pie.
  `grep -n "100% paraguaya" index.html` los encuentra a los cuatro. El sello
  gráfico refuerza lo mismo sin repetir texto.
- **La colección puede crecer**: no hay nada en los textos que dé a entender que
  son solo dos piezas. Para sumar una, copiá un bloque `<article class="pieza">`
  en `index.html`, alterná la clase `pieza--invertida` para que la foto cambie
  de lado, y agregá la opción al `<select>` de contacto.

## Qué falta

El sitio está terminado como diseño. Lo que queda por cargar son datos reales:

1. El número de WhatsApp y la URL de Instagram en `CONFIG` (`js/main.js`).
2. Los renders 3D definitivos en `img/`.
3. Repasar los textos de cada pieza con la información final.
