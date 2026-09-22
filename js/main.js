/* ============================================================================
   Venzano · main.js
   ----------------------------------------------------------------------------
   01. CONFIG — datos editables del sitio
   02. WhatsApp e Instagram
   03. Año del footer
   04. Menú a pantalla completa
   05. Header al hacer scroll
   06. Vistas de la olla
   07. Formulario de contacto
   08. Revelado al hacer scroll
   ========================================================================== */

/* ============================================================
   01. CONFIG
   Lo único que hay que tocar para poner el sitio en marcha.
   ============================================================ */
const CONFIG = {
  whatsapp: "595XXXXXXXXX",  // número completo, solo dígitos, con código de país (595)
  instagram: "#",            // URL completa del perfil
  marca: "Venzano"           // MARCA 7/7 · nombre usado en los mensajes de WhatsApp
};


(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");


  /* ============================================================
     02. WHATSAPP E INSTAGRAM
     ============================================================ */

  // Mientras CONFIG.whatsapp sea el placeholder, los enlaces llevan al
  // formulario en vez de abrir un chat roto.
  const hayWhatsapp = /^\d{8,15}$/.test(CONFIG.whatsapp);

  function mensajeDe(pieza) {
    return pieza === "Consulta general"
      ? "Hola " + CONFIG.marca + ", quiero hacer una consulta."
      : "Hola " + CONFIG.marca + ", quiero consultar por: " + pieza + ".";
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
     04. MENÚ A PANTALLA COMPLETA
     ============================================================ */
  const raiz = document.documentElement;
  const botonMenu = $("#btn-menu");
  const menu = $("#menu");

  function abrirMenu(abrir) {
    raiz.classList.toggle("menu-abierto", abrir);
    botonMenu.setAttribute("aria-expanded", String(abrir));
    botonMenu.setAttribute("aria-label", abrir ? "Cerrar menú" : "Abrir menú");
    if (abrir) {
      // El panel recién es enfocable cuando el navegador aplicó el estilo.
      window.requestAnimationFrame(function () {
        const primero = $("a", menu);
        if (primero) primero.focus();
      });
    }
  }

  if (botonMenu && menu) {
    botonMenu.addEventListener("click", function () {
      abrirMenu(!raiz.classList.contains("menu-abierto"));
    });

    $$("a", menu).forEach(function (enlace) {
      enlace.addEventListener("click", function () { abrirMenu(false); });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && raiz.classList.contains("menu-abierto")) {
        abrirMenu(false);
        botonMenu.focus();
      }
    });

    window.matchMedia("(min-width: 900px)").addEventListener("change", function (e) {
      if (e.matches) abrirMenu(false);
    });
  }


  /* ============================================================
     05. HEADER AL HACER SCROLL
     ============================================================ */
  const cab = $("#cab");
  let pendiente = false;
  function marcarScroll() {
    cab.classList.toggle("esta-fija", window.scrollY > 24);
    pendiente = false;
  }
  window.addEventListener("scroll", function () {
    if (!pendiente) { pendiente = true; window.requestAnimationFrame(marcarScroll); }
  }, { passive: true });
  marcarScroll();


  /* ============================================================
     06. VISTAS DE LA OLLA
     ============================================================ */
  const ollaImg = $("#olla-img");
  const vistas = $$(".vista");

  vistas.forEach(function (boton) {
    boton.addEventListener("click", function () {
      if (!ollaImg || boton.classList.contains("es-activa")) return;
      ollaImg.src = boton.dataset.img;
      ollaImg.alt = boton.dataset.alt;
      vistas.forEach(function (otro) {
        const activo = otro === boton;
        otro.classList.toggle("es-activa", activo);
        otro.setAttribute("aria-pressed", String(activo));
      });
    });
  });


  /* ============================================================
     07. FORMULARIO DE CONTACTO
     ============================================================ */
  const form = $("#form-contacto");

  if (form) {
    const estado = $("#form-estado");

    const reglas = [
      { id: "nombre",  error: "Escribinos tu nombre.",            valido: function (v) { return v.trim().length >= 2; } },
      { id: "pieza",   error: "Elegí una opción.",                valido: function (v) { return v !== ""; } },
      { id: "mensaje", error: "Contanos un poco más.",            valido: function (v) { return v.trim().length >= 5; } }
    ];

    function marcarCampo(regla, ok) {
      const campo = $("#" + regla.id).closest(".campo");
      const aviso = $("#error-" + regla.id);
      campo.classList.toggle("tiene-error", !ok);
      aviso.hidden = ok;
      aviso.textContent = ok ? "" : regla.error;
    }

    reglas.forEach(function (regla) {
      const input = $("#" + regla.id);
      ["input", "change"].forEach(function (evento) {
        input.addEventListener(evento, function () {
          if (regla.valido(input.value)) marcarCampo(regla, true);
        });
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
        "Me interesa: " + $("#pieza").value + ".\n" +
        $("#mensaje").value.trim();

      window.open(enlaceWhatsapp(texto), "_blank", "noopener");
      estado.textContent = "Listo, abrimos WhatsApp con tu mensaje.";
      form.reset();
    });
  }


  /* ============================================================
     08. REVELADO AL HACER SCROLL
     ============================================================ */
  const revelables = $$("[data-revelar]");

  if (menosMovimiento.matches || !("IntersectionObserver" in window)) {
    revelables.forEach(function (el) { el.classList.add("es-visible"); });
  } else {
    $$(".notas, .pasos, .apuntes").forEach(function (grupo) {
      $$("[data-revelar]", grupo).forEach(function (el, i) {
        el.style.transitionDelay = (i * 90) + "ms";
      });
    });

    const observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("es-visible");
          observador.unobserve(entrada.target);
        }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });

    revelables.forEach(function (el) { observador.observe(el); });
  }

})();
