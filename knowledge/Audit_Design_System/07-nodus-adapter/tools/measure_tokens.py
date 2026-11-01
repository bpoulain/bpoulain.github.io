"""Measure Nodus semantic color pairs: APCA Lc, WCAG 2 ratio, L*, deltaE2000.

Usage: python3 measure_tokens.py <path to the Nodus repository>

The APCA function is a local implementation of 0.0.98G-4g, checked below against
published values. Final results must come from the apca-w3 reference package.
"""
import math, re, sys


def parse(path):
    return open(path, encoding="utf-8").read()


root = sys.argv[1]
prim = parse(root + "/ui-lib/tokens/_primitives.css")
sem = parse(root + "/ui-lib/tokens/_semantic.css")

P = dict(re.findall(r"(--[a-z]+(?:-\d+)?):\s*(#[0-9a-fA-F]{6})", prim))
assert len(P) > 80


def block(start):
    i = sem.index(start)
    j = sem.index("{", i)
    d, k = 1, j + 1
    while d:
        d += {"{": 1, "}": -1}.get(sem[k], 0)
        k += 1
    return sem[j + 1 : k - 1]


def tokens(text):
    t = {}
    for m in re.finditer(r"(--color-[a-z-]+):\s*([^;]+);", text):
        t[m[1]] = m[2].strip()
    return t


LIGHT = tokens(block('[data-theme="light"]'))
DARK = dict(LIGHT)
DARK.update(tokens(sem[sem.index('\n[data-theme="dark"]'):]))


def h2r(h):
    return tuple(int(h[i : i + 2], 16) for i in (1, 3, 5))


def resolve(v, T):
    v = v.strip()
    if v.startswith("#"):
        return h2r(v)
    m = re.fullmatch(r"var\((--[a-z0-9-]+)\)", v)
    if m:
        n = m[1]
        return resolve(T[n], T) if n in T else h2r(P[n])
    m = re.fullmatch(r"color-mix\(in srgb,\s*var\((--[a-z0-9-]+)\)\s*(\d+)%,\s*(.+)\)", v)
    if m:
        a = int(m[2]) / 100
        c = resolve(f"var({m[1]})", T)
        if m[3].strip() == "transparent":
            return c + (a,)
        b = resolve(m[3], T)
        return tuple(round(c[i] * a + b[i] * (1 - a)) for i in range(3))
    raise ValueError(v)


def over(c, bg):
    if len(c) == 3:
        return c
    a = c[3]
    return tuple(round(c[i] * a + bg[i] * (1 - a)) for i in range(3))


def lum2(c):
    def f(x):
        x /= 255
        return x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4

    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2])


def wcag(a, b):
    x, y = sorted((lum2(a), lum2(b)), reverse=True)
    return (x + 0.05) / (y + 0.05)


def apca(txt, bg):
    def y(c):
        return sum(k * (v / 255) ** 2.4 for k, v in zip((0.2126729, 0.7151522, 0.0721750), c))

    def clamp(v):
        return v + (0.022 - v) ** 1.414 if v < 0.022 else v

    t, b = clamp(y(txt)), clamp(y(bg))
    if abs(b - t) < 0.0005:
        return 0.0
    if b > t:
        s = (b**0.56 - t**0.57) * 1.14
        out = 0.0 if s < 0.1 else s - 0.027
    else:
        s = (b**0.65 - t**0.62) * 1.14
        out = 0.0 if s > -0.1 else s + 0.027
    return out * 100


def lab(c):
    def f(x):
        x /= 255
        return x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4

    r, g, b = map(f, c)
    X = (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047
    Y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b
    Z = (0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / 1.08883

    def h(t):
        return t ** (1 / 3) if t > 216 / 24389 else (24389 / 27 * t + 16) / 116

    return 116 * h(Y) - 16, 500 * (h(X) - h(Y)), 200 * (h(Y) - h(Z))


def de00(c1, c2):
    L1, a1, b1 = lab(c1)
    L2, a2, b2 = lab(c2)
    C1, C2 = math.hypot(a1, b1), math.hypot(a2, b2)
    Cb = (C1 + C2) / 2
    G = 0.5 * (1 - math.sqrt(Cb**7 / (Cb**7 + 25**7)))
    a1p, a2p = (1 + G) * a1, (1 + G) * a2
    C1p, C2p = math.hypot(a1p, b1), math.hypot(a2p, b2)
    h1 = math.degrees(math.atan2(b1, a1p)) % 360
    h2 = math.degrees(math.atan2(b2, a2p)) % 360
    dL, dC = L2 - L1, C2p - C1p
    dh = 0.0
    if C1p * C2p:
        dh = h2 - h1
        dh = dh - 360 if dh > 180 else dh + 360 if dh < -180 else dh
    dH = 2 * math.sqrt(C1p * C2p) * math.sin(math.radians(dh / 2))
    Lb, Cbp = (L1 + L2) / 2, (C1p + C2p) / 2
    if C1p * C2p == 0:
        hb = h1 + h2
    elif abs(h1 - h2) <= 180:
        hb = (h1 + h2) / 2
    else:
        hb = (h1 + h2 + 360) / 2 if h1 + h2 < 360 else (h1 + h2 - 360) / 2
    T = (1 - 0.17 * math.cos(math.radians(hb - 30)) + 0.24 * math.cos(math.radians(2 * hb))
         + 0.32 * math.cos(math.radians(3 * hb + 6)) - 0.20 * math.cos(math.radians(4 * hb - 63)))
    dt = 30 * math.exp(-(((hb - 275) / 25) ** 2))
    Rc = 2 * math.sqrt(Cbp**7 / (Cbp**7 + 25**7))
    Sl = 1 + 0.015 * (Lb - 50) ** 2 / math.sqrt(20 + (Lb - 50) ** 2)
    Sc = 1 + 0.045 * Cbp
    Sh = 1 + 0.015 * Cbp * T
    Rt = -math.sin(math.radians(2 * dt)) * Rc
    return math.sqrt((dL / Sl) ** 2 + (dC / Sc) ** 2 + (dH / Sh) ** 2 + Rt * dC / Sc * dH / Sh)


# Published reference values
assert abs(apca(h2r("#888888"), h2r("#ffffff")) - 63.06) < 0.1
assert abs(apca(h2r("#ffffff"), h2r("#888888")) + 68.54) < 0.1
assert abs(apca(h2r("#000000"), h2r("#aaaaaa")) - 58.15) < 0.1
assert abs(apca(h2r("#aaaaaa"), h2r("#000000")) + 56.24) < 0.1
assert abs(de00((255, 255, 255), (0, 0, 0)) - 100) < 0.1

SURF = ["bg-canvas", "bg", "bg-elevated", "bg-muted", "bg-state"]
PAIRS = []
for fg, sfs, floor, use in [
    ("fg", SURF, 75, "body"),
    ("fg-muted", SURF, 60, "secondary"),
    ("fg-subtle", ["bg", "bg-elevated"], 60, "tertiary text"),
    ("fg-disabled", ["bg", "bg-elevated"], 30, "disabled"),
    ("border", ["bg", "bg-elevated"], 15, "divider"),
    ("border-control", ["bg", "bg-elevated"], 30, "control boundary"),
]:
    for s in sfs:
        PAIRS.append((fg, s, floor, use))
PAIRS += [
    ("primary-fg", "primary", 60, "control text"),
    ("primary-fg", "primary-hover", 60, "control text"),
    ("primary-fg", "primary-solid", 60, "control text"),
    ("primary-fg", "primary-solid-hover", 60, "control text"),
    ("destructive-fg", "destructive-solid", 60, "control text"),
    ("destructive-fg", "destructive-solid-hover", 60, "control text"),
    ("secondary-fg", "secondary", 60, "control text"),
    ("primary", "bg", 60, "link/accent text"),
    ("destructive", "bg", 60, "error text"),
    ("destructive", "bg-elevated", 60, "error text"),
    ("success", "bg", 45, "status icon"),
    ("warning", "bg", 45, "status icon"),
    ("destructive-on-muted", "destructive-muted", 60, "alert text"),
    ("success-on-muted", "success-muted", 60, "alert text"),
    ("warning-on-muted", "warning-muted", 60, "alert text"),
    ("info-on-muted", "info-muted", 60, "alert text"),
    ("ring", "bg", 45, "focus (solid)"),
]


def col(n, T, bg=None):
    c = resolve(T["--color-" + n], T)
    return over(c, bg) if bg else c


for name, T in (("LIGHT", LIGHT), ("DARK", DARK)):
    print("==", name)
    for fg, sf, floor, use in PAIRS:
        b = col(sf, T)
        f = col(fg, T, b)
        lc = abs(apca(f, b))
        print(f"{fg:22}{sf:24}{use:18}Lc {lc:5.1f} /{floor:3} {'ok ' if lc>=floor else 'KO '} wcag {wcag(f,b):5.2f}")
    # focus ring: alpha 40% over surface
    ring = resolve(T["--color-ring"], T)
    for sf in ["bg", "bg-elevated"]:
        b = col(sf, T)
        mixed = tuple(round(ring[i] * 0.4 + b[i] * 0.6) for i in range(3))
        print(f"focus-ring 40% on {sf:12} Lc {abs(apca(mixed,b)):5.1f} /45 wcag {wcag(mixed,b):.2f}")
    print("-- surfaces deltaE / L*")
    for a, b in [("bg-canvas", "bg"), ("bg", "bg-elevated"), ("bg", "bg-muted"), ("bg-muted", "bg-state"), ("bg", "bg-state")]:
        ca, cb = col(a, T), col(b, T)
        print(f"{a:12}{b:12} dE {de00(ca,cb):5.2f}  L* {lab(ca)[0]:5.1f} -> {lab(cb)[0]:5.1f}")
    print("-- states deltaE")
    for a, b in [("primary", "primary-hover"), ("secondary", "secondary-hover"), ("destructive-solid", "destructive-solid-hover"), ("primary", "destructive"), ("primary", "info"), ("primary", "success"), ("destructive", "warning"), ("success", "warning")]:
        print(f"{a:20}{b:24} dE {de00(col(a,T),col(b,T)):5.2f}")

print("-- zinc L*")
print([round(lab(h2r(P[f"--zinc-{n}"]))[0], 1) for n in (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)])
