#!/usr/bin/env python3
"""Generate assets/images/og-1200x630.png for social sharing cards.

Pure standard-library Python (zlib + struct). No Pillow, no external tools.
Renders a short branded card using a tiny embedded 5x7 bitmap font.

Regenerate after editing the site copy/design with:

    python3 scripts/gen-og-image.py
"""

import struct
import zlib
from pathlib import Path

WIDTH, HEIGHT = 1200, 630

BG = (10, 10, 11)        # #0a0a0b
TEXT = (244, 244, 245)   # #f4f4f5
MUTED = (161, 161, 170)  # #a1a1aa
ACCENT = (59, 130, 246)  # #3b82f6
WHITE = (255, 255, 255)

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
        self.px = [[(0, 0, 0, 0) for _ in range(w)] for _ in range(h)]

    def fill(self, color, x, y, w, h):
        color = (*color, 255) if len(color) == 3 else color
        for yy in range(y, min(y + h, self.h)):
            row = self.px[yy]
            for xx in range(x, min(x + w, self.w)):
                row[xx] = color

    def rounded_rect(self, color, x, y, w, h, r):
        self.fill(color, x + r, y, w - 2 * r, h)
        self.fill(color, x, y + r, w, h - 2 * r)
        for dx in range(r):
            for dy in range(r):
                if (dx + 0.5) * (dx + 0.5) + (dy + 0.5) * (dy + 0.5) <= r * r:
                    for cx, cy in ((x + dx, y + dy), (x + w - 1 - dx, y + dy),
                                   (x + dx, y + h - 1 - dy), (x + w - 1 - dx, y + h - 1 - dy)):
                        if 0 <= cx < self.w and 0 <= cy < self.h:
                            self.px[cy][cx] = (*color, 255)

    def text(self, s, x, y, scale, color):
        advance = 6 * scale
        cur = x
        for ch in s:
            glyph = FONT.get(ch, FONT[" "])
            for row, bits in enumerate(glyph):
                for col, bit in enumerate(bits):
                    if bit == "1":
                        self.fill(color,
                                  cur + col * scale,
                                  y + row * scale,
                                  scale,
                                  scale)
            cur += advance
        return cur


def text_width(s, scale):
    return len(s) * 6 * scale


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


def main():
    canvas = Canvas(WIDTH, HEIGHT)

    # Solid background.
    canvas.fill(BG, 0, 0, WIDTH, HEIGHT)

    # Logo: accent rounded square with a white "m".
    logo = 96
    pad = 96
    canvas.rounded_rect(ACCENT, pad, pad, logo, logo, 20)
    canvas.text("m", pad + 18, pad + 6, 12, WHITE)

    # Brand + tagline to the right of the logo.
    tx = pad + logo + 40
    ty = pad + 24
    canvas.text("makitdev", tx, ty, 11, TEXT)
    canvas.text("Build. Share. Improve.", tx, ty + 96, 5, MUTED)

    # Thin accent rule plus site URL along the bottom.
    canvas.fill(ACCENT, pad, HEIGHT - pad - 8, 3 * text_width("m", 5) // 2, 8)
    canvas.text("makitdev.wordpress.com", pad, HEIGHT - pad - 44, 3, MUTED)

    out = Path(__file__).resolve().parent.parent / "assets" / "images" / "og-1200x630.png"
    write_png(out, canvas)
    print(f"wrote {out} ({out.stat().st_size} bytes)")


if __name__ == "__main__":
    main()