"""
PortföyAI - İsterleri GitHub Issues'a aktaran script.

Ne yapar?
  1. docs/diagrams/use_case.md, docs/requirements/fonksiyonel_isterler.md ve
     docs/requirements/fonksiyonel_olmayan_isterler.md dosyalarındaki tabloları okur.
  2. Her use case (UC) için bir issue açar; o UC'ye bağlı FR'ler issue içinde
     yapılacaklar listesi (checkbox) olarak yer alır.
  3. Her NFR kategorisi (N1 ... N10) için bir issue açar.
  4. Etiketleri (Must/Should/Could, grup, alan) ve haftalık kilometre taşlarını oluşturur.

Kullanım (repo kök klasöründe):
  python scripts/create_issues.py --dry-run   # önce sadece ne yapacağını göster
  python scripts/create_issues.py             # gerçekten oluştur

  Sonradan eklenen use case'ler için (kopya oluşturmamak için) sadece onları seç:
  python scripts/create_issues.py --only UC-52,UC-53 --dry-run
"""
import argparse
import re
import subprocess
import sys
import tempfile
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UC_FILE = ROOT / "docs/diagrams/use_case.md"
FR_FILE = ROOT / "docs/requirements/fonksiyonel_isterler.md"
NFR_FILE = ROOT / "docs/requirements/fonksiyonel_olmayan_isterler.md"

# ---------------------------------------------------------------- ayarlar
PRIORITY = {"M": "Must", "S": "Should", "C": "Could"}
PRIORITY_COLOR = {"Must": "B60205", "Should": "FBCA04", "Could": "C5DEF5"}

# Grup -> (kilometre taşı, alan etiketleri)
GROUP_PLAN = {
    "Hesap":           ("Hafta 4", ["backend", "mobile"]),
    "Profil ve Plan":  ("Hafta 5", ["backend", "mobile"]),
    "Portföy":         ("Hafta 5", ["backend", "mobile"]),
    "AI Öneri":        ("Hafta 6", ["ml", "backend", "mobile"]),
    "Simülatör":       ("Hafta 6", ["ml", "backend", "mobile"]),
    "Öğren ve Bilgi":  ("Hafta 7", ["mobile", "backend"]),
    "Bildirim":        ("Hafta 7", ["backend", "mobile"]),
    "Otomasyon":       ("Hafta 6", ["data", "ml", "backend"]),
    "Yönetim":         ("Hafta 8", ["ml", "backend"]),
}
# Bazı UC'ler grubundan daha erken yapılmalı (iş planına göre)
UC_MILESTONE_OVERRIDE = {"UC-40": "Hafta 3", "UC-29": "Hafta 3", "UC-12": "Hafta 4", "UC-07": "Hafta 4"}

# NFR kategori numarası -> (kilometre taşı, alan etiketleri)
NFR_PLAN = {
    1: ("Hafta 9", ["backend", "ml"]),        # Performans
    2: ("Hafta 8", ["backend"]),              # Güvenilirlik
    3: ("Hafta 9", ["backend", "security"]),  # Güvenlik
    4: ("Hafta 4", ["backend", "security"]),  # Gizlilik
    5: ("Hafta 3", ["data"]),                 # Veri kalitesi
    6: ("Hafta 6", ["ml", "data"]),           # Bilimsel geçerlilik
    7: ("Hafta 9", ["test"]),                 # Test altyapısı
    8: ("Hafta 4", ["devops"]),               # Bakım ve tekrarlanabilirlik
    9: ("Hafta 7", ["mobile"]),               # Kullanılabilirlik
    10: ("Hafta 8", ["devops"]),              # Yedekleme ve ölçeklenebilirlik
}

MILESTONES = {
    "Hafta 3": "Veri + AI Baseline (Demo)",
    "Hafta 4": "Backend İskeleti",
    "Hafta 5": "Frontend + Ara Demo (Demo)",
    "Hafta 6": "AI Entegrasyonu",
    "Hafta 7": "MVP (Demo)",
    "Hafta 8": "Deploy",
    "Hafta 9": "Stres Testi + Güvenlik",
}
AREA_COLOR = {"backend": "1D76DB", "mobile": "5319E7", "ml": "0E8A16", "data": "006B75",
              "security": "D93F0B", "test": "BFD4F2", "devops": "6E7781"}


# ---------------------------------------------------------------- tablo okuma
def table_rows(text):
    """Markdown tablolarındaki veri satırlarını hücre listesi olarak döndürür."""
    rows = []
    for line in text.splitlines():
        line = line.strip()
        if not line.startswith("|") or re.match(r"^\|\s*-", line):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        rows.append(cells)
    return rows


def priority_of(cell):
    for key, name in PRIORITY.items():
        if name in cell or re.search(rf"\b{key}\b", cell):
            return name
    return None


def expand_sources(cell):
    """'UC-01, UC-02' veya 'UC-48–51' -> ['UC-01', 'UC-02'] / ['UC-48', ..., 'UC-51']"""
    out = []
    for part in re.split(r",", cell):
        part = part.strip()
        m = re.match(r"UC-(\d+)\s*[–-]\s*(?:UC-)?(\d+)", part)
        if m:
            a, b = int(m.group(1)), int(m.group(2))
            out += [f"UC-{i:02d}" for i in range(a, b + 1)]
        else:
            m = re.match(r"UC-(\d+)", part)
            if m:
                out.append(f"UC-{int(m.group(1)):02d}")
    return out


def read_use_cases():
    ucs = {}
    for cells in table_rows(UC_FILE.read_text(encoding="utf-8")):
        if len(cells) >= 6 and re.fullmatch(r"UC-\d+", cells[0]):
            ucs[cells[0]] = {"id": cells[0], "name": cells[1], "actors": cells[2], "group": cells[3],
                             "priority": priority_of(cells[4]), "desc": cells[5], "frs": []}
    return ucs


def read_frs(ucs):
    count = 0
    for cells in table_rows(FR_FILE.read_text(encoding="utf-8")):
        if len(cells) >= 5 and re.fullmatch(r"FR-\d+", cells[0]):
            fr = {"id": cells[0], "text": cells[1], "priority": priority_of(cells[3]), "accept": cells[4]}
            srcs = expand_sources(cells[2])
            if not srcs:
                print(f"  ! {cells[0]}: kaynak UC bulunamadı ({cells[2]})")
            for s in srcs:
                if s in ucs:
                    ucs[s]["frs"].append(fr)
                else:
                    print(f"  ! {cells[0]}: {s} use case listesinde yok")
            count += 1
    return count


def read_nfr_categories():
    text = NFR_FILE.read_text(encoding="utf-8")
    cats = []
    parts = re.split(r"^##\s+N(\d+)\.\s*(.+)$", text, flags=re.M)
    # parts = [önsöz, num, başlık, içerik, num, başlık, içerik, ...]
    for i in range(1, len(parts), 3):
        num, title, body = int(parts[i]), parts[i + 1].strip(), parts[i + 2]
        items = []
        for cells in table_rows(body):
            if len(cells) >= 4 and re.fullmatch(r"NFR-\d+", cells[0]):
                items.append({"id": cells[0], "text": cells[1], "priority": priority_of(cells[2]),
                              "accept": cells[3]})
        cats.append({"num": num, "title": title, "items": items})
    return cats


# ---------------------------------------------------------------- issue içeriği
def uc_issue(uc):
    milestone, areas = GROUP_PLAN.get(uc["group"], ("Hafta 7", ["backend"]))
    milestone = UC_MILESTONE_OVERRIDE.get(uc["id"], milestone)
    title = f"[{uc['id']}] {uc['name']}"
    lines = [
        f"**Grup:** {uc['group']} · **Öncelik:** {uc['priority']} · **Aktör:** {uc['actors']}",
        "",
        f"> {uc['desc']}",
        "",
        "Kaynak: [`docs/diagrams/use_case.md`](../blob/main/docs/diagrams/use_case.md)",
        "",
        "## Fonksiyonel isterler",
        "",
    ]
    for fr in uc["frs"]:
        lines.append(f"- [ ] **{fr['id']}** ({fr['priority']}) {fr['text']}")
        lines.append(f"  - *Kabul kriteri:* {fr['accept']}")
    if not uc["frs"]:
        lines.append("_Bu use case için tanımlı FR yok._")
    labels = ["use-case", uc["priority"], f"grup: {uc['group']}"] + areas
    return title, "\n".join(lines), labels, milestone


def nfr_issue(cat):
    milestone, areas = NFR_PLAN.get(cat["num"], ("Hafta 9", ["backend"]))
    title = f"[NFR] N{cat['num']}. {cat['title']}"
    lines = [
        f"Fonksiyonel olmayan isterler – **{cat['title']}**",
        "",
        "Kaynak: [`docs/requirements/fonksiyonel_olmayan_isterler.md`]"
        "(../blob/main/docs/requirements/fonksiyonel_olmayan_isterler.md)",
        "",
    ]
    for it in cat["items"]:
        lines.append(f"- [ ] **{it['id']}** ({it['priority']}) {it['text']}")
        lines.append(f"  - *Kabul kriteri:* {it['accept']}")
    prios = [it["priority"] for it in cat["items"]]
    top = next((p for p in ("Must", "Should", "Could") if p in prios), "Should")
    labels = ["nfr", top] + areas
    return title, "\n".join(lines), labels, milestone


# ---------------------------------------------------------------- GitHub
def gh(args, dry):
    if dry:
        return ""
    r = subprocess.run(["gh"] + args, capture_output=True, text=True, encoding="utf-8")
    if r.returncode != 0:
        raise RuntimeError(r.stderr.strip())
    return r.stdout.strip()


def ensure_labels(dry):
    labels = {"use-case": "0052CC", "nfr": "5319E7"}
    labels.update(PRIORITY_COLOR)
    labels.update(AREA_COLOR)
    for g in GROUP_PLAN:
        labels[f"grup: {g}"] = "EDEDED"
    for name, color in labels.items():
        print(f"  etiket: {name}")
        gh(["label", "create", name, "--color", color, "--force"], dry)


def ensure_milestones(dry):
    existing = set()
    if not dry:
        out = gh(["api", "repos/{owner}/{repo}/milestones", "--paginate", "-q", ".[].title"], dry)
        existing = set(out.splitlines())
    for title, desc in MILESTONES.items():
        if title in existing:
            continue
        print(f"  kilometre taşı: {title} – {desc}")
        gh(["api", "repos/{owner}/{repo}/milestones", "-f", f"title={title}", "-f", f"description={desc}"], dry)


def create_issue(title, body, labels, milestone, dry):
    print(f"  [{milestone}] {title}  ({', '.join(labels)})")
    if dry:
        return
    with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8") as f:
        f.write(body)
        path = f.name
    args = ["issue", "create", "--title", title, "--body-file", path, "--milestone", milestone]
    for lb in labels:
        args += ["--label", lb]
    gh(args, dry)
    Path(path).unlink(missing_ok=True)
    time.sleep(1)  # GitHub'ı yormamak için


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="Hiçbir şey oluşturmadan sadece listele")
    ap.add_argument("--only", help="Sadece bu use case'lerin issue'larını aç (ör. UC-52,UC-53); NFR issue'ları atlanır")
    a = ap.parse_args()
    dry = a.dry_run
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    print("1) Dosyalar okunuyor...")
    ucs = read_use_cases()
    fr_count = read_frs(ucs)
    cats = read_nfr_categories()
    nfr_count = sum(len(c["items"]) for c in cats)
    print(f"   {len(ucs)} use case · {fr_count} FR · {len(cats)} NFR kategorisi · {nfr_count} NFR")

    print("2) Etiketler" + (" (deneme)" if dry else ""))
    ensure_labels(dry)
    print("3) Kilometre taşları" + (" (deneme)" if dry else ""))
    ensure_milestones(dry)

    print("4) Issue'lar" + (" (deneme)" if dry else ""))
    if a.only:
        wanted = [x.strip() for x in a.only.split(",")]
        missing = [x for x in wanted if x not in ucs]
        if missing:
            sys.exit(f"Bulunamayan use case: {', '.join(missing)}")
        selected, cats = [ucs[x] for x in wanted], []
    else:
        selected = list(ucs.values())
    for uc in selected:
        create_issue(*uc_issue(uc), dry)
    for cat in cats:
        create_issue(*nfr_issue(cat), dry)

    print(f"\nBitti: {len(selected) + len(cats)} issue" + (" (deneme modunda hiçbir şey oluşturulmadı)" if dry else ""))


if __name__ == "__main__":
    main()
