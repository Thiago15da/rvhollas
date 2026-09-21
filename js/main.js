/* ============================================================================
   RVH Ollas · main.js
   ----------------------------------------------------------------------------
   01. CONFIG — datos editables del sitio
   02. WhatsApp e Instagram
   03. Año del footer
   04. Menú móvil
   05. Header al hacer scroll
   06. Galería de la olla
   07. Formulario de contacto
   08. Aparición de secciones (IntersectionObserver)
   ========================================================================== */

/* ============================================================
   01. CONFIG
   Lo único que hay que tocar para poner el sitio en marcha.
   ============================================================ */
const CONFIG = {
  whatsapp: "595XXXXXXXXX",  // número completo, solo dígitos, con código de país (595)
  instagram: "#",            // URL completa del perfil
  marca: "RVH Ollas"         // MARCA 7/7 · nombre usado en los mensajes de WhatsApp
};


(function () {
  "use strict";

  // El CSS solo oculta las secciones animadas si el JS está vivo.
  document.documentElement.classList.add("js");

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");


  /* ============================================================
     02. WHATSAPP E INSTAGRAM
     ============================================================ */

  // El placeholder de CONFIG.whatsapp no es un número válido: mientras no se
  // reemplace, los botones siguen llevando al formulario de contacto.
  const hayWhatsapp = /^\d{8,15}$/.test(CONFIG.whatsapp);

  function mensajeDe(producto) {
    return producto === "Consulta general"
      ? "Hola " + CONFIG.marca + ", quiero hacer una consulta."
      : "Hola " + CONFIG.marca + ", quiero consultar por: " + producto + ".";
  }

  function enlaceWhatsapp(texto) {
    return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(texto);
  }

  if (hayWhatsapp) {
    $$("[data-wa]").forEach(function (enlace) {
      enlace.href = enlaceWhatsapp(mensajeDe(enlace.dataset.wa));
      enlace.target = "_blank";
      enlace.rel = "noopener";
    });
    const directo = $("[data-wa-texto]");
    if (directo) directo.textContent = "+" + CONFIG.whatsapp;
  }

  $$("[data-instagram]").forEach(function (enlace) {
    enlace.href = CONFIG.instagram;
    if (CONFIG.instagram !== "#") {
      enlace.target = "_blank";
      enlace.rel = "noopener";
    }
  });


  /* ============================================================
     03. AÑO DEL FOOTER
     ============================================================ */
  const anio = $("#anio");
  if (anio) anio.textContent = String(new Date().getFullYear());


  /* ============================================================
     04. MENÚ MÓVIL
     ============================================================ */
  const cab = $("#cab");
  const botonMenu = $("#btn-menu");
  const menu = $("#menu");

  function abrirMenu(abrir) {
    cab.classList.toggle("menu-abierto", abrir);
    botonMenu.setAttribute("aria-expanded", String(abrir));
    botonMenu.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
  }

  if (botonMenu && menu) {
    botonMenu.addEventListener("click", function () {
      abrirMenu(!cab.classList.contains("menu-abierto"));
    });

    // Cerrar al elegir una sección
    $$("a", menu).forEach(function (enlace) {
      enlace.addEventListener("click", function () { abrirMenu(false); });
    });

    // Cerrar con Escape y devolver el foco al botón
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && cab.classList.contains("menu-abierto")) {
        abrirMenu(false);
        botonMenu.focus();
      }
    });

    // Cerrar al tocar fuera del header
    document.addEventListener("click", function (e) {
      if (cab.classList.contains("menu-abierto") && !cab.contains(e.target)) {
        abrirMenu(false);
      }
    });

    // Al pasar a escritorio el panel deja de existir como tal
    window.matchMedia("(min-width: 960px)").addEventListener("change", function (e) {
      if (e.matches) abrirMenu(false);
    });
  }


  /* ============================================================
     05. HEADER AL HACER SCROLL
     ============================================================ */
  let pendiente = false;
  function marcarScroll() {
    cab.classList.toggle("esta-fija", window.scrollY > 12);
    pendiente = false;
  }
  window.addEventListener("scroll", function () {
    if (!pendiente) {
      pendiente = true;
      window.requestAnimationFrame(marcarScroll);
    }
  }, { passive: true });
  marcarScroll();


  /* ============================================================
     06. GALERÍA DE LA OLLA
     ============================================================ */
  const ollaImg = $("#olla-principal");
  const ollaPie = $("#olla-pie");
  const miniaturas = $$(".galeria__miniatura");

  function mostrarVista(boton) {
    if (!ollaImg || boton.classList.contains("es-activa")) return;
    ollaImg.src = boton.dataset.img;
    ollaImg.alt = boton.dataset.alt;
    if (ollaPie) ollaPie.textContent = boton.dataset.pie;
    miniaturas.forEach(function (otro) {
      const activo = otro === boton;
      otro.classList.toggle("es-activa", activo);
      otro.setAttribute("aria-pressed", String(activo));
    });
  }

  miniaturas.forEach(function (boton) {
    boton.addEventListener("click", function () { mostrarVista(boton); });
    boton.addEventListener("mouseenter", function () { mostrarVista(boton); });
  });


  /* ============================================================
     07. FORMULARIO DE CONTACTO
     ============================================================ */
  const form = $("#form-contacto");

  if (form) {
    const estado = $("#form-estado");

    const reglas = [
      { id: "nombre",   error: "Escribí tu nombre para saber con quién hablamos.", valido: function (v) { return v.trim().length >= 2; } },
      { id: "producto", error: "Elegí qué te interesa.",                           valido: function (v) { return v !== ""; } },
      { id: "mensaje",  error: "Contanos un poco más (al menos 5 caracteres).",    valido: function (v) { return v.trim().length >= 5; } }
    ];

    function marcarCampo(regla, ok) {
      const campo = $("#" + regla.id).closest(".campo");
      const aviso = $("#error-" + regla.id);
      campo.classList.toggle("tiene-error", !ok);
      aviso.hidden = ok;
      aviso.textContent = ok ? "" : regla.error;
    }

    // Al corregir, se limpia el error del campo
    reglas.forEach(function (regla) {
      const input = $("#" + regla.id);
      input.addEventListener("input", function () {
        if (regla.valido(input.value)) marcarCampo(regla, true);
      });
      input.addEventListener("change", function () {
        if (regla.valido(input.value)) marcarCampo(regla, true);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      estado.textContent = "";
      estado.classList.remove("es-error");

      let primerError = null;
      reglas.forEach(function (regla) {
        const input = $("#" + regla.id);
        const ok = regla.valido(input.value);
        marcarCampo(regla, ok);
        if (!ok && !primerError) primerError = input;
      });

      if (primerError) {
        primerError.focus();
        estado.textContent = "Revisá los campos marcados.";
        estado.classList.add("es-error");
        return;
      }

      if (!hayWhatsapp) {
        estado.textContent = "Todavía falta cargar el número de WhatsApp en js/main.js.";
        estado.classList.add("es-error");
        return;
      }

      const texto =
        "Hola " + CONFIG.marca + ", soy " + $("#nombre").value.trim() + ".\n" +
        "Me interesa: " + $("#producto").value + ".\n" +
        $("#mensaje").value.trim();

      window.open(enlaceWhatsapp(texto), "_blank", "noopener");
      estado.textContent = "Listo, abrimos WhatsApp con tu mensaje.";
      form.reset();
    });
  }


  /* ============================================================
     08. APARICIÓN DE SECCIONES
     ============================================================ */
  const animables = $$("[data-animar]");

  if (menosMovimiento.matches || !("IntersectionObserver" in window)) {
    animables.forEach(function (el) { el.classList.add("es-visible"); });
  } else {
    // Pequeño escalonado dentro de los grupos
    $$(".razones, .pasos, .origen__puntos").forEach(function (grupo) {
      $$("[data-animar]", grupo).forEach(function (el, i) {
        el.style.transitionDelay = (i * 80) + "ms";
      });
    });

    const observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("es-visible");
          observador.unobserve(entrada.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });

    animables.forEach(function (el) { observador.observe(el); });
  }

})();
