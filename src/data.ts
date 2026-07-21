/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Discipline {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface BuildCategory {
  id: string;
  number: string;
  title: string;
  techSpecs: string;
  materials: string;
  image: string;
}

export interface ChoreographyStage {
  id: string;
  stageNumber: string;
  title: string;
  description: string;
}

export interface Equipment {
  id: string;
  number: string;
  title: string;
  description: string;
  meta: Array<{ label: string; value: string }>;
}

export interface ReferenceProject {
  id: string;
  caseNumber: string;
  location: string;
  scope: string;
  title: string;
  description: string;
  image: string;
}

export const disciplines: Discipline[] = [
  {
    id: "discipline-1",
    number: "D • 01",
    title: "Precision manufacturing",
    description: "CNC technology delivering sub-millimetre accuracy on every panel, every batch."
  },
  {
    id: "discipline-2",
    number: "D • 02",
    title: "Faster delivery",
    description: "Optimised digital processes deliver every project on time, at scale."
  },
  {
    id: "discipline-3",
    number: "D • 03",
    title: "Premium hardware",
    description: "Blum and top-tier Austrian components on every hinge and slide."
  },
  {
    id: "discipline-4",
    number: "D • 04",
    title: "Transparent process",
    description: "Digital communication from first sketch to final handover, versioned and traceable."
  },
  {
    id: "discipline-5",
    number: "D • 05",
    title: "Digital production",
    description: "Design flows seamlessly into digital manufacturing pipelines. Zero translation loss."
  },
  {
    id: "discipline-6",
    number: "D • 06",
    title: "Professional install",
    description: "Trained in-house teams deliver precise execution on site."
  },
  {
    id: "discipline-7",
    number: "D • 07",
    title: "Modern design",
    description: "Contemporary, functional, timeless — built to outlast trend cycles."
  }
];

export const buildCategories: BuildCategory[] = [
  {
    id: "build-kitchens",
    number: "SIGNATURE • 01",
    title: "Kitchens",
    techSpecs: "Modular • CNC-cut",
    materials: "Modern laminate finishes",
    image: "/src/assets/images/luxury_kitchen_1784643668452.jpg"
  },
  {
    id: "build-dressing-rooms",
    number: "SIGNATURE • 02",
    title: "Dressing Rooms",
    techSpecs: "Bespoke • Walnut",
    materials: "Made to spec",
    image: "/src/assets/images/luxury_wardrobe_1784643696854.jpg"
  },
  {
    id: "build-vanities",
    number: "SIGNATURE • 03",
    title: "Vanities",
    techSpecs: "Fluted • Brass",
    materials: "Contract-grade",
    image: "/src/assets/images/luxury_vanity_1784643711057.jpg"
  }
];

export const choreographyStages: ChoreographyStage[] = [
  {
    id: "stage-1",
    stageNumber: "Stage 01",
    title: "Measurement",
    description: "On-site verified against architectural drawings — no assumptions."
  },
  {
    id: "stage-2",
    stageNumber: "Stage 02",
    title: "3D Design",
    description: "Full digital model rendered for client approval before cutting."
  },
  {
    id: "stage-3",
    stageNumber: "Stage 03",
    title: "Engineering",
    description: "Fit, function, and hardware placement reviewed and locked."
  },
  {
    id: "stage-4",
    stageNumber: "Stage 04",
    title: "CNC Cutting",
    description: "Panels cut to exact digital spec on a Simplex CNC machine with boring head."
  },
  {
    id: "stage-5",
    stageNumber: "Stage 05",
    title: "Assembly",
    description: "Edge banded, hardware fitted, units built to specification."
  },
  {
    id: "stage-6",
    stageNumber: "Stage 06",
    title: "QC Inspection",
    description: "Every unit checked against original spec — nothing leaves the factory unverified."
  },
  {
    id: "stage-7",
    stageNumber: "Stage 07",
    title: "Installation",
    description: "Trained in-house team on site — signed off by the client."
  }
];

export const equipmentList: Equipment[] = [
  {
    id: "eq-1",
    number: "EQ • 01",
    title: "CNC Cutting",
    description: "Simplex CNC machine with an integrated boring head — every panel cut and bored from the same digital file, held to sub-millimetre tolerance.",
    meta: [
      { label: "Machine", value: "Simplex" },
      { label: "Head", value: "Boring-equipped" },
      { label: "Tolerance", value: "< 0.5 mm" }
    ]
  },
  {
    id: "eq-2",
    number: "EQ • 02",
    title: "Edge Banding Line",
    description: "Automated PU / EVA edge banding — factory-grade finish on every visible edge, at speed.",
    meta: [
      { label: "Bonding", value: "PU / EVA" },
      { label: "Cycle", value: "Automated" }
    ]
  },
  {
    id: "eq-3",
    number: "EQ • 03",
    title: "Drilling & Boring",
    description: "Multi-spindle CNC boring for hinges, drawer slides, and connectors — every hole located to the tenth of a millimetre.",
    meta: [
      { label: "Precision", value: "± 0.1 mm" },
      { label: "Type", value: "Multi-spindle" }
    ]
  },
  {
    id: "eq-4",
    number: "EQ • 04",
    title: "Design Stack",
    description: "Mozaik and Cabinet Vision CAD/CAM, feeding cut lists directly to the CNC floor — every file stored, versioned, and traceable.",
    meta: [
      { label: "Tools", value: "Mozaik • Cabinet Vision" }
    ]
  },
  {
    id: "eq-5",
    number: "EQ • 05",
    title: "Digital Production Tracking",
    description: "Every panel logged from cut list to installation — job status, materials, and hardware traceable in real time across the floor.",
    meta: [
      { label: "Tracking", value: "Real-time" }
    ]
  }
];

export const materials: string[] = [
  "Matte laminate",
  "Textured woodgrain laminate",
  "Fenix laminate",
  "Egger & Kronospan panels",
  "Blum hardware"
];

export const referenceProjects: ReferenceProject[] = [
  {
    id: "ref-1",
    caseNumber: "Case 01",
    location: "NEW CAIRO • DEVELOPER",
    scope: "Phased delivery across 6 months • consistent quality throughout",
    title: "Zed East Residences",
    description: "Standardized luxury kitchen systems manufactured and delivered in strict production choreography.",
    image: "/src/assets/images/luxury_kitchen_1784643668452.jpg"
  },
  {
    id: "ref-2",
    caseNumber: "Case 02",
    location: "SIDI ABDEL RAHMAN",
    scope: "Villa kitchens • handed over June 2025",
    title: "Marassi North Coast",
    description: "High-end bespoke walnut cabinetry and walk-in dressing rooms built to rigorous seaside environmental specifications.",
    image: "/src/assets/images/luxury_wardrobe_1784643696854.jpg"
  },
  {
    id: "ref-3",
    caseNumber: "Case 03",
    location: "KATAMEYA • PRIVATE VILLA",
    scope: "Full interior fit-out • architect-specified detailing",
    title: "Palm Hills Katameya",
    description: "Integrated signature vanity and bathroom cabinetry featuring brass accents and custom fluted panelling.",
    image: "/src/assets/images/luxury_vanity_1784643711057.jpg"
  }
];
