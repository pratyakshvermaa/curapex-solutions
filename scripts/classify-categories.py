#!/usr/bin/env python3
"""Assign parentCategory (therapeutic) from ADS PL sheet; keep dosage form as subcategory."""

from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "medicines.json"

# Display names for parent categories (from ADS PL sheet)
PARENTS = [
    "ED Medicines",
    "Steroids",
    "Anti Parasitic",
    "Anti Anxiety",
    "Pain Killers",
    "Sleeping Pills",
    "Weight Loss",
    "Antibiotics",
    "Anti Diabetics",
    "Antihypertensive",
    "Human Growth Hormones",
    "Skin Care",
    "Antiemetics",
    "Anti Cancer",
    "Antiviral",
    "HIV Drugs",
    "Cardiac",
    "Fertility",
    "Thyroid",
    "Insulin",
    "General Medicines",
]


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", (s or "").lower()).strip()


def dosage_subcategory(m: dict) -> str:
    """Keep/repair dosage-form subcategory."""
    existing = (m.get("category") or "").strip()
    dosage_forms = {
        "Tablets",
        "Capsules",
        "Injections",
        "Creams",
        "Oral Jelly",
        "Syrups",
        "Eye Drops",
        "Inhalers",
        "Pharmaceutical Medicines",
    }
    if existing in dosage_forms and existing != "Pharmaceutical Medicines":
        return existing

    blob = " ".join(
        [
            m.get("name") or "",
            m.get("dosageForm") or "",
            m.get("packaging") or "",
        ]
    ).lower()

    if "jelly" in blob:
        return "Oral Jelly"
    if "inhaler" in blob:
        return "Inhalers"
    if any(x in blob for x in ("eye drop", "ophthalmic", " ophthalmic")):
        return "Eye Drops"
    if any(x in blob for x in ("syrup", "suspension", "solution")) and "inject" not in blob:
        return "Syrups"
    if any(x in blob for x in ("cream", "gel", "ointment", "lotion")):
        return "Creams"
    if any(x in blob for x in ("capsule", "softgel")):
        return "Capsules"
    if any(x in blob for x in ("injection", "inj", "vial", "ampoule", "kwikpen", "pen")):
        return "Injections"
    if "tablet" in blob or re.search(r"\btab\b", blob):
        return "Tablets"
    return existing if existing else "Tablets"


# Keyword rules: first match wins (order matters — more specific first)
RULES: list[tuple[str, list[str]]] = [
    (
        "ED Medicines",
        [
            "sildenafil", "tadalafil", "vardenafil", "avanafil", "dapoxetine",
            "cenforce", "kamagra", "vidalista", "tadalista", "vilitra", "varditra",
            "suhagra", "lovegra", "fildena", "malegra", "manforce", "vigora",
            "eriacata", "eriacta", "silvitra", "super vidalista", "toptada",
            "tadaflo", "tastylia", "tadarise", "vitara", "abhiforce", "hiforce",
            "red force", "maxxima", "vega", "erectile", "impotence",
        ],
    ),
    (
        "Steroids",
        [
            "testosterone", "nandrolone", "trenbolone", "oxandrolone", "stanozolol",
            "boldenone", "methenolone", "drostanolone", "anavar", "deca", "sustanon",
            "primobol", "trenarix", "test e", "testosterone enanthate", "clenbuterol",
            "prednisolone", "methylprednisolone", "steroid",
        ],
    ),
    (
        "Anti Parasitic",
        [
            "ivermectin", "albendazole", "fenbendazole", "mebendazole", "niclosamide",
            "iverheal", "iverjohn", "iverzoom", "covimectin", "evimectin", "wormistar",
            "antiparasitic", "anti parasitic", "anthelmint",
        ],
    ),
    (
        "Anti Anxiety",
        [
            "modafinil", "armodafinil", "atomoxetine", "tofisopam", "nortriptyline",
            "buspirone", "buspin", "tofiso", "modafeel", "modalert", "waklert",
            "anxiety", "sertraline", "serta", "bupropion", "venlafaxine", "venlor",
            "quetiapine", "asprito",
        ],
    ),
    (
        "Pain Killers",
        [
            "tapentadol", "carisoprodol", "gabapentin", "pregabalin", "pain o soma",
            "baclofen", "baclosign", "aceclofenac", "diclofenac", "paracetamol",
            "amitriptyline", "gabasign", "gabatop", "pregarica", "soma", "prosoma",
            "painkiller", "pain killer", "lornoxicam", "etoricoxib",
        ],
    ),
    (
        "Sleeping Pills",
        [
            "zopiclone", "eszopiclone", "melatonin", "zopinap", "zopisign", "hypnite",
            "sleepose", "sleeping", "insomnia",
        ],
    ),
    (
        "Weight Loss",
        [
            "semaglutide", "tirzepatide", "orlistat", "rybelsus", "mounjaro", "fitaro",
            "semalix", "olisat", "slimtop", "weight loss", "dulaglutide", "trulicity",
        ],
    ),
    (
        "Antibiotics",
        [
            "azithromycin", "amoxicillin", "amoxycillin", "clindamycin", "ciprofloxacin",
            "levofloxacin", "metronidazole", "cephalexin", "azee", "azicip", "antibiotic",
            "paraxin", "chloramphenicol",
        ],
    ),
    (
        "Anti Diabetics",
        [
            "metformin", "glimepiride", "sitagliptin", "vildagliptin", "dapagliflozin",
            "empagliflozin", "acarbose", "repaglinide", "voglibose", "diabetes", "diabetic",
            "glucophage", "metfor", "jalra", "trajenta", "forxiga", "jardiance", "galvus",
            "novonorm", "glucobay",
        ],
    ),
    (
        "Antihypertensive",
        [
            "telmisartan", "amlodipine", "losartan", "olmesartan", "azilsartan", "valsartan",
            "hydrochlorothiazide", "nifedipine", "diltiazem", "carvedilol", "prazosin",
            "clonidine", "ivabradine", "cilnidipine", "telma", "amlip", "amlovas",
            "antihypertensive", "hypertension", "blood pressure",
        ],
    ),
    (
        "Human Growth Hormones",
        [
            "somatropin", "growth hormone", "norditropin", "zomacton", "eutropin",
            "headon", "shreetropin", "hgh",
        ],
    ),
    (
        "Skin Care",
        [
            "tretinoin", "hydroquinone", "isotretinoin", "tazarotene", "benzoyl",
            "melasma", "tretiheal", "retino", "triluma", "melalite", "skin cream",
            "acne", "dermatology",
        ],
    ),
    (
        "Antiemetics",
        ["ondansetron", "antiemetic", "ondaheal"],
    ),
    (
        "Anti Cancer",
        [
            "bortezomib", "bicalutamide", "carfilzomib", "axitinib", "olaparib",
            "sorafenib", "imatinib", "sunitinib", "lenalidomide", "tamoxifen",
            "letrozole", "abiraterone", "chlorambucil", "anti cancer", "anticancer",
            "borviz", "soranib", "imatib", "sutinat", "cancer",
        ],
    ),
    (
        "Antiviral",
        [
            "sofosbuvir", "ledipasvir", "daclatasvir", "entecavir", "acyclovir",
            "hepcinat", "ledifos", "antiviral", "hepatitis",
        ],
    ),
    (
        "HIV Drugs",
        [
            "dolutegravir", "tenofovir", "emtricitabine", "efavirenz", "lamivudine",
            "abacavir", "hiv", "viropil", "teevir", "tafero", "inbec",
        ],
    ),
    (
        "Cardiac",
        [
            "atorvastatin", "rosuvastatin", "nicorandil", "clopidogrel", "aspirin",
            "cardiac", "cardiovascular", "tranexamic", "enoxaparin",
        ],
    ),
    (
        "Fertility",
        [
            "clomiphene", "letrozole", "hcg", "human chorionic", "hucog", "fertigyn",
            "fertility", "ovral", "yasmin", "desogestrel", "progynova",
        ],
    ),
    (
        "Thyroid",
        ["thyroxine", "thyronorm", "thyrox", "thyroid", "methimazole"],
    ),
    (
        "Insulin",
        ["insulin", "novorapid", "basalog", "apidra", "humapen", "novopen", "fiasp"],
    ),
]


def classify_parent(m: dict) -> str:
    blob = norm(
        " ".join(
            [
                m.get("name") or "",
                m.get("composition") or "",
                m.get("brand") or "",
                m.get("indiaMartCategory") or "",
                m.get("description") or "",
                " ".join((m.get("specs") or {}).values()),
            ]
        )
    )
    for parent, keywords in RULES:
        for kw in keywords:
            if norm(kw) in blob:
                return parent
    return "General Medicines"


def main() -> None:
    data = json.loads(DATA.read_text(encoding="utf-8"))
    parents = Counter()
    for m in data:
        parent = classify_parent(m)
        sub = dosage_subcategory(m)
        m["parentCategory"] = parent
        m["category"] = sub  # subcategory = dosage form
        if not m.get("dosageForm"):
            # singular-ish display
            m["dosageForm"] = sub.rstrip("s") if sub.endswith("s") and sub != "Eye Drops" else sub
        parents[parent] += 1

    DATA.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("Classified", len(data), "medicines")
    print("\nParent categories:")
    for name, n in parents.most_common():
        print(f"  {n:4d}  {name}")
    print("\nSubcategories (dosage forms):")
    for name, n in Counter(m["category"] for m in data).most_common():
        print(f"  {n:4d}  {name}")


if __name__ == "__main__":
    main()
