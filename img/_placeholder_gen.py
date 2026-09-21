"""Genera renders placeholder (fondo gris claro) para img/.
Se reemplazan por los renders 3D reales con el mismo nombre."""
from PIL import Image, ImageDraw, ImageFilter

S = 4                      # supersampling
W, H = 1200, 900
BG = (234, 234, 234)
IRON_D = (38, 37, 36)
IRON_M = (58, 56, 54)
IRON_L = (92, 89, 86)
WOOD_D = (122, 74, 42)
WOOD_L = (165, 106, 62)


def canvas():
    im = Image.new("RGB", (W * S, H * S), BG)
    return im, ImageDraw.Draw(im, "RGBA")


def finish(im, path):
    im = im.resize((W, H), Image.LANCZOS)
    im.save(path, optimize=True)
    print("ok", path)


def shadow(size, draw_fn, blur=26):
    """Capa de sombra difusa dibujada aparte y compuesta."""
    lay = Image.new("L", size, 0)
    d = ImageDraw.Draw(lay)
    draw_fn(d)
    return lay.filter(ImageFilter.GaussianBlur(blur * S))


def paste_shadow(im, lay, color=(0, 0, 0), alpha=78):
    sh = Image.new("RGBA", im.size, color + (0,))
    a = lay.point(lambda v: int(v * alpha / 255))
    sh.putalpha(a)
    im.paste(Image.new("RGB", im.size, color), (0, 0), sh)


# ---------------------------------------------------------------- grill
def grill(path):
    im, d = canvas()
    x0, y0, x1, y1 = 120 * S, 210 * S, 1080 * S, 700 * S
    r = 34 * S

    paste_shadow(im, shadow(im.size, lambda s: s.rounded_rectangle(
        (x0 + 10 * S, y0 + 34 * S, x1 - 10 * S, y1 + 44 * S), r, fill=255)), alpha=70)
    d = ImageDraw.Draw(im, "RGBA")

    # marco perimetral
    d.rounded_rectangle((x0, y0, x1, y1), r, fill=IRON_M)
    d.rounded_rectangle((x0, y0, x1, y1 - 12 * S), r, fill=IRON_L)
    d.rounded_rectangle((x0 + 6 * S, y0 + 6 * S, x1 - 6 * S, y1 - 18 * S), r - 6 * S, fill=IRON_D)

    # asas integradas (recortes en el marco)
    for cx in (x0 + 78 * S, x1 - 78 * S):
        d.rounded_rectangle((cx - 44 * S, y0 + 26 * S, cx + 44 * S, y0 + 52 * S), 13 * S, fill=BG)
        d.rounded_rectangle((cx - 44 * S, y1 - 64 * S, cx + 44 * S, y1 - 38 * S), 13 * S, fill=BG)

    ix0, iy0, ix1, iy1 = x0 + 38 * S, y0 + 74 * S, x1 - 38 * S, y1 - 86 * S
    d.rounded_rectangle((ix0, iy0, ix1, iy1), 18 * S, fill=(46, 44, 43))

    # zona central ranurada (escurre grasas)
    cw = (ix1 - ix0) * 0.30
    cx0 = (ix0 + ix1) / 2 - cw / 2
    cx1 = (ix0 + ix1) / 2 + cw / 2
    d.rounded_rectangle((cx0, iy0 + 8 * S, cx1, iy1 - 8 * S), 10 * S, fill=(30, 29, 28))
    n = 9
    step = (cx1 - cx0) / n
    for i in range(n):
        gx = cx0 + step * i + step * 0.25
        d.rounded_rectangle((gx, iy0 + 26 * S, gx + step * 0.42, iy1 - 26 * S), 6 * S, fill=(20, 19, 18))
        d.rounded_rectangle((gx, iy0 + 26 * S, gx + step * 0.42, iy0 + 33 * S), 4 * S, fill=(70, 67, 64))

    # nervaduras curvas a ambos lados
    for side, (sx0, sx1) in enumerate(((ix0 + 10 * S, cx0 - 10 * S), (cx1 + 10 * S, ix1 - 10 * S))):
        rows = 11
        h = (iy1 - iy0 - 40 * S) / rows
        for i in range(rows):
            yy = iy0 + 20 * S + h * i + h * 0.2
            bow = 22 * S if side == 0 else -22 * S
            d.arc((sx0, yy - 30 * S, sx1, yy + 30 * S), 0, 180, fill=IRON_L, width=7 * S)
            d.arc((sx0, yy - 30 * S + 5 * S, sx1, yy + 30 * S + 5 * S), 0, 180, fill=(26, 25, 24), width=5 * S)

    # brillo superior suave
    gl = Image.new("RGBA", im.size, (255, 255, 255, 0))
    ImageDraw.Draw(gl).rounded_rectangle((x0 + 10 * S, y0 + 8 * S, x1 - 10 * S, y0 + 120 * S), r,
                                         fill=(255, 255, 255, 26))
    im.paste(Image.alpha_composite(im.convert("RGBA"), gl.filter(ImageFilter.GaussianBlur(18 * S))).convert("RGB"), (0, 0))
    finish(im, path)


# ---------------------------------------------------------------- olla
def _cuerpo(d, cx, top, bot, rw):
    """Cuerpo de olla: boca ancha, perfil bajo, base redondeada."""
    d.rounded_rectangle((cx - rw, top, cx + rw, bot), 110 * S,
                        corners=(False, False, True, True), fill=IRON_M)
    # asas laterales integradas
    for sgn in (-1, 1):
        ax = cx + sgn * rw
        d.ellipse((ax - 40 * S, top + 40 * S, ax + 40 * S, top + 134 * S), fill=IRON_M)
        d.ellipse((ax - 14 * S, top + 66 * S, ax + 14 * S, top + 108 * S), fill=BG)
    # sombra propia inferior
    d.rounded_rectangle((cx - rw, bot - 150 * S, cx + rw, bot), 110 * S,
                        corners=(False, False, True, True), fill=(0, 0, 0, 46))
    # labio superior
    d.ellipse((cx - rw, top - 30 * S, cx + rw, top + 30 * S), fill=IRON_L)
    d.ellipse((cx - rw + 10 * S, top - 20 * S, cx + rw - 10 * S, top + 20 * S), fill=(26, 25, 24))


def olla(path, con_tapa):
    im, d = canvas()
    cx = W * S // 2
    top = 380 * S if con_tapa else 320 * S
    bot = 700 * S
    rw = 290 * S

    paste_shadow(im, shadow(im.size, lambda s: s.ellipse(
        (cx - rw - 30 * S, bot - 70 * S, cx + rw + 30 * S, bot + 40 * S), fill=255)), alpha=74)
    d = ImageDraw.Draw(im, "RGBA")
    _cuerpo(d, cx, top, bot, rw)

    if con_tapa:
        lw = rw + 18 * S
        ly = top - 8 * S
        # cupula de la tapa
        d.chord((cx - lw, ly - 130 * S, cx + lw, ly + 34 * S), 180, 360, fill=IRON_M)
        d.chord((cx - lw + 70 * S, ly - 122 * S, cx + lw - 70 * S, ly - 4 * S), 180, 360, fill=IRON_L)
        # borde / reborde
        d.ellipse((cx - lw, ly + 4 * S, cx + lw, ly + 40 * S), fill=IRON_M)
        d.ellipse((cx - lw, ly + 14 * S, cx + lw, ly + 46 * S), fill=(30, 29, 28))
        d.chord((cx - lw, ly - 130 * S, cx + lw, ly + 34 * S), 180, 360, outline=IRON_L, width=4 * S)
        # sosten de lapacho
        d.rounded_rectangle((cx - 22 * S, ly - 124 * S, cx + 22 * S, ly - 96 * S), 10 * S, fill=IRON_L)
        d.rounded_rectangle((cx - 74 * S, ly - 176 * S, cx + 74 * S, ly - 116 * S), 28 * S, fill=WOOD_D)
        d.rounded_rectangle((cx - 66 * S, ly - 170 * S, cx + 66 * S, ly - 142 * S), 16 * S, fill=WOOD_L)
    else:
        # interior visible
        d.ellipse((cx - rw + 26 * S, top - 12 * S, cx + rw - 26 * S, top + 26 * S), fill=(48, 46, 44))
        d.ellipse((cx - rw + 26 * S, top - 4 * S, cx + rw - 26 * S, top + 30 * S), fill=(34, 33, 32))
    finish(im, path)


grill("img/grill.png")
olla("img/olla-tapa.png", True)
olla("img/olla.png", False)
