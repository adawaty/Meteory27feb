#!/usr/bin/env python3
"""Generate *starter* 2D CAD drawings (DXF) from product specs.

This is intentionally simple: outlines + title text.
It gives customers a downloadable CAD reference while we collect
exact dimensions for full manufacturer-grade drawings and Revit families.

Usage:
  python scripts/generate-cad-dxf.py

Outputs:
  public/bim/cad/*.dxf
"""

from __future__ import annotations

import json
import math
import os
from pathlib import Path

try:
  import ezdxf
except Exception as e:
  raise SystemExit(
    "Missing dependency ezdxf. Install with: pnpm? no; use pip install ezdxf\n"
    + str(e)
  )

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "bim" / "cad"
OUT.mkdir(parents=True, exist_ok=True)

PRODUCTS_JSON = ROOT / "public" / "bim" / "products_cad_seed.json"

# Minimal seed dimensions (mm) — replace with real dimensions later.
# For now, we generate readable drawings and stable file names.
SEED = {
  "co2-portable": {"w": 220, "h": 650},
  "powder-stored": {"w": 220, "h": 650},
  "cabinet-single": {"w": 650, "h": 850},
  "cabinet-double": {"w": 900, "h": 850},
}

PRODUCTS_JSON.write_text(json.dumps(SEED, indent=2), encoding="utf-8")


def draw_outline(msp, w, h):
  msp.add_lwpolyline([(0, 0), (w, 0), (w, h), (0, h), (0, 0)])
  # centerline
  msp.add_line((w / 2, 0), (w / 2, h))


def create_dxf(product_id: str, w: float, h: float):
  doc = ezdxf.new(setup=True)
  doc.units = ezdxf.units.MM
  msp = doc.modelspace()

  draw_outline(msp, w, h)

  msp.add_text(
    f"Meteory — CAD Starter ({product_id})",
    dxfattribs={"height": 18},
  ).set_placement((0, h + 40))

  msp.add_text(
    f"Approx dims: {int(w)} x {int(h)} mm (replace with exact manufacturer dims)",
    dxfattribs={"height": 10},
  ).set_placement((0, h + 20))

  out = OUT / f"{product_id}.dxf"
  doc.saveas(out)


for pid, dims in SEED.items():
  create_dxf(pid, dims["w"], dims["h"])

print(f"Wrote {len(SEED)} DXF files to {OUT}")
