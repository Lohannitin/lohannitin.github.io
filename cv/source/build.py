"""Build both CV PDFs: render HTML with Chromium, then set PDF metadata.

Run from anywhere:  python3 cv/source/build.py
Needs Node + Playwright (Chromium) and PyMuPDF (pip install pymupdf).
"""
import pathlib
import subprocess

import pymupdf

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE.parent

META = {
    "Nitin_Lohan_CV_Academic.pdf": {
        "title": "Dr. Nitin Lohan - Academic Curriculum Vitae",
        "subject": "Academic CV: applied mathematics, atmospheric science, extreme precipitation, numerical weather prediction",
        "keywords": "Nitin Lohan, Assistant Professor, Applied Mathematics, Atmospheric Science, WRF, WRFDA, 3DVAR, Cloudburst, Monsoon, Extreme Rainfall",
    },
    "Nitin_Lohan_CV_AI_Trainer.pdf": {
        "title": "Nitin Lohan - AI Trainer & STEM Benchmark Developer - Resume",
        "subject": "Resume: AI trainer, LLM evaluation, mathematics benchmark development, scientific data analysis",
        "keywords": "Nitin Lohan, AI Trainer, LLM Evaluation, RLHF, STEM Benchmark, Mathematics, Python, Numerical Methods, Scientific Computing",
    },
}

subprocess.run(["node", str(HERE / "render.mjs")], check=True)

for name, meta in META.items():
    path = OUT / name
    doc = pymupdf.open(path)
    doc.set_metadata({**meta, "author": "Nitin Lohan", "creator": "Nitin Lohan", "producer": "Chromium"})
    tmp = path.with_suffix(".tmp.pdf")
    doc.save(tmp, garbage=3, deflate=True)
    doc.close()
    tmp.replace(path)
    print(f"{name}: metadata set")
