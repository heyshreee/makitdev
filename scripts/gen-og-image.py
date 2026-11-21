#!/usr/bin/env python3
"""Generate the social card and touch icon for makitdev.

Pure standard-library Python (zlib + struct). No Pillow, no external tools.
The artwork follows the site design system: flat surfaces, no gradients, the
four tile mark, and the muted lime accent.

Regenerate after editing the site copy or brand mark with:

    python3 scripts/gen-og-image.py
"""

import struct
import zlib
from pathlib import Path

WIDTH, HEIGHT = 1200, 630

BG = (0, 0, 0)            # #000000
TEXT = (245, 245, 240)    # #f5f5f0
MUTED = (138, 138, 133)   # #8a8a85
ACCENT = (201, 232, 155)  # #c9e89b

# Tiny 5x7 font: each glyph is 7 rows of 5 chars ('1' = on, '0' = off).
FONT = {
    "A": ["01110", "10001", "11111", "10001", "10001", "10001", "10001"],
    "B": ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
    "C": ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
    "D": ["11100", "10010", "10001", "10001", "10001", "10010", "11100"],
    "E": ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
    "F": ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
    "G": ["01110", "10001", "10000", "10111", "10001", "10001", "01110"],
    "H": ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
    "I": ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
    "J": ["00111", "00010", "00010", "00010", "10010", "10010", "01100"],
    "K": ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
    "L": ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
    "M": ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
    "N": ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
    "O": ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
    "P": ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
    "Q": ["01110", "10001", "10001", "10001", "10001", "10010", "01101"],
    "R": ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
    "S": ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
    "T": ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
    "U": ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
    "V": ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
    "W": ["10001", "10001", "10001", "10101", "10101", "11011", "10001"],
    "X": ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
    "Y": ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
    "Z": ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
    "a": ["00000", "00000", "01110", "00001", "01111", "10001", "01111"],
    "b": ["10000", "10000", "10110", "11001", "10001", "10001", "11110"],
    "c": ["00000", "00000", "01110", "10000", "10000", "10001", "01110"],
    "d": ["00001", "00001", "01101", "10011", "10001", "10001", "01111"],
    "e": ["00000", "00000", "01110", "10001", "11111", "10000", "01110"],
    "f": ["00010", "00100", "00100", "01110", "00100", "00100", "00100"],
    "g": ["00000", "01111", "10001", "10001", "01111", "00001", "01110"],
    "h": ["10000", "10000", "10110", "11001", "10001", "10001", "10001"],
    "i": ["00100", "00000", "01100", "00100", "00100", "00100", "01110"],
    "j": ["00010", "00000", "00110", "00010", "00010", "10010", "01100"],
    "k": ["10000", "10000", "10010", "10100", "11000", "10100", "10010"],
    "l": ["01100", "00100", "00100", "00100", "00100", "00100", "01110"],
    "m": ["00000", "00000", "11010", "10101", "10101", "10101", "10101"],
    "n": ["00000", "00000", "10110", "11001", "10001", "10001", "10001"],
    "o": ["00000", "00000", "01110", "10001", "10001", "10001", "01110"],
    "p": ["00000", "11110", "10001", "10001", "11110", "10000", "10000"],
    "q": ["00000", "01101", "10011", "10001", "01111", "00001", "00001"],
    "r": ["00000", "00000", "10110", "11001", "10000", "10000", "10000"],
    "s": ["00000", "00000", "01110", "10000", "01110", "00001", "11110"],
    "t": ["00100", "00100", "01110", "00100", "00100", "00100", "00010"],
    "u": ["00000", "00000", "10001", "10001", "10001", "10011", "01101"],
    "v": ["00000", "00000", "10001", "10001", "10001", "01010", "00100"],
    "w": ["00000", "00000", "10001", "10101", "10101", "11011", "10001"],
    "x": ["00000", "00000", "10001", "01010", "00100", "01010", "10001"],
    "y": ["00000", "10001", "10001", "01010", "00100", "01000", "10000"],
    "z": ["00000", "00000", "11111", "00010", "00100", "01000", "11111"],
    ".": ["00000", "00000", "00000", "00000", "00000", "00011", "00011"],
    "&": ["00000", "01100", "10010", "01100", "10010", "10010", "01101"],
    "@": ["01110", "10001", "10001", "10111", "10000", "10001", "01110"],
    " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
}


class Canvas:
    def __init__(self, w, h):
        self.w = w
        self.h = h
        self.px = [[(0, 0, 0, 255) for _ in range(w)] for _ in range(h)]

    def fill(self, color, x, y, w, h):
        color = (*color, 255) if len(color) == 3 else color
        for yy in range(max(0, y), min(y + h, self.h)):
            row = self.px[yy]
            for xx in range(max(0, x), min(x + w, self.w)):
                row[xx] = color

    def rounded_rect(self, color, x, y, w, h, r):
        self.fill(color, x + r, y, w - 2 * r, h)
        self.fill(color, x, y + r, w, h - 2 * r)
        for dx in range(r):
            for dy in range(r):
                if (dx + 0.5) ** 2 + (dy + 0.5) ** 2 <= r * r:
                    for cx, cy in ((x + dx, y + dy), (x + w - 1 - dx, y + dy),
                                   (x + dx, y + h - 1 - dy),
                                   (x + w - 1 - dx, y + h - 1 - dy)):
                        if 0 <= cx < self.w and 0 <= cy < self.h:
                            self.px[cy][cx] = (*color, 255)

    def text(self, s, x, y, scale, color, tracking=0):
        advance = 6 * scale + tracking
        cur = x
        for ch in s:
            glyph = FONT.get(ch, FONT[" "])
            for row, bits in enumerate(glyph):
                for col, bit in enumerate(bits):
                    if bit == "1":
                        self.fill(color, cur + col * scale, y + row * scale,
                                  scale, scale)
            cur += advance
        return cur


def text_width(s, scale, tracking=0):
    if not s:
        return 0
    return len(s) * 6 * scale + (len(s) - 1) * tracking


def write_png(path, canvas):
    raw = bytearray()
    for row in canvas.px:
        raw.append(0)  # filter: None
        for r, g, b, a in row:
            raw += bytes((r, g, b, a))

    def chunk(tag, data):
        return (struct.pack(">I", len(data)) + tag + data
                + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF))

    ihdr = struct.pack(">IIBBBBB", canvas.w, canvas.h, 8, 6, 0, 0, 0)
    png = (b"\x89PNG\r\n\x1a\n"
           + chunk(b"IHDR", ihdr)
           + chunk(b"IDAT", zlib.compress(bytes(raw), 9))
           + chunk(b"IEND", b""))
    path.write_bytes(png)


def draw_mark(canvas, x, y, tile, gap, radius, accent=True):
    colors = (TEXT, TEXT, TEXT, ACCENT if accent else TEXT)
    positions = ((x, y), (x + tile + gap, y),
                 (x, y + tile + gap), (x + tile + gap, y + tile + gap))
    for color, (cx, cy) in zip(colors, positions):
        canvas.rounded_rect(color, cx, cy, tile, tile, radius)


def og_card(path):
    canvas = Canvas(WIDTH, HEIGHT)
    canvas.fill(BG, 0, 0, WIDTH, HEIGHT)

    pad = 88
    draw_mark(canvas, pad, 88, 40, 8, 10)

    canvas.text("OPEN SOURCE", pad, 196, 3, ACCENT, tracking=6)
    canvas.text("makitdev", pad, 240, 12, TEXT, tracking=2)
    canvas.fill((39, 39, 39), pad, 386, WIDTH - pad * 2, 1)
    canvas.text("Built to be used.", pad, 420, 5, TEXT, tracking=2)
    canvas.text("Small tools. Real problems.", pad, 478, 4, MUTED, tracking=2)

    canvas.fill((39, 39, 39), pad, 546, WIDTH - pad * 2, 1)
    canvas.text("github.com/makitdev", pad, 566, 4, MUTED, tracking=3)

    out = Path(__file__).resolve().parent.parent / "assets" / "images" / "og-1200x630.png"
    write_png(out, canvas)
    print(f"wrote {out} ({out.stat().st_size} bytes)")


def touch_icon(path, size):
    canvas = Canvas(size, size)
    canvas.fill(BG, 0, 0, size, size)
    tile = round(size * 0.29)
    gap = round(size * 0.055)
    total = tile * 2 + gap
    offset = (size - total) // 2
    draw_mark(canvas, offset, offset, tile, gap, max(3, round(tile * 0.22)))
    write_png(path, canvas)
    print(f"wrote {path} ({path.stat().st_size} bytes)")


def main():
    root = Path(__file__).resolve().parent.parent / "assets" / "images"
    og_card(root / "og-1200x630.png")
    touch_icon(root / "apple-touch-icon.png", 180)


if __name__ == "__main__":
    main()
