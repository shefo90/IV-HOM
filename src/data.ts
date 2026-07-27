/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import luxuryKitchenImage from "./assets/images/luxury_kitchen_1784643668452.jpg";
import luxuryWardrobeImage from "./assets/images/luxury_wardrobe_1784643696854.jpg";
import luxuryVanityImage from "./assets/images/luxury_vanity_1784643711057.jpg";
import digitalFactoryImage from "./assets/images/digital_factory_1784643682666.jpg";
import cncRouterImage from "./assets/images/2030_CNC_Router_with_High-Precision_Spindle_and_Va.webp";
import kitchenCabinetImage from "./assets/images/1-2411200UP80-L.jpg";
import fullKitchenCNCImage from "./assets/images/full-kitchen-cabinet-production-cnc-usq.webp";
import factoryImage from "./assets/images/images.jpg";
import cncMachineImage from "./assets/images/unnamed-36.png";

// Company logo imports
import logo1Image from "./assets/company_logos/Gemini_Generated_Image_.png";
import logo2Image from "./assets/company_logos/Gemini_Generated_Image_ (1).png";
import logo3Image from "./assets/company_logos/Gemini_Generated_Image_ (2).png";
import logo4Image from "./assets/company_logos/Gemini_Generated_Image_ (3).png";
import logo5Image from "./assets/company_logos/Gemini_Generated_Image_ (4).png";
import logo6Image from "./assets/company_logos/Gemini_Generated_Image_ (5).png";
import logo7Image from "./assets/company_logos/Gemini_Generated_Image_ (6).png";
import logo8Image from "./assets/company_logos/Gemini_Generated_Image_ (7).png";
import logo9Image from "./assets/company_logos/Gemini_Generated_Image_ (8).png";

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
  images?: string[]; // Array of images for gallery
}

export interface Material {
  name: string;
  logo: string;
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
    image: luxuryKitchenImage
  },
  {
    id: "build-dressing-rooms",
    number: "SIGNATURE • 02",
    title: "Dressing Rooms",
    techSpecs: "Bespoke • Walnut",
    materials: "Made to spec",
    image: luxuryWardrobeImage
  },
  {
    id: "build-vanities",
    number: "SIGNATURE • 03",
    title: "Vanities",
    techSpecs: "Fluted • Brass",
    materials: "Contract-grade",
    image: luxuryVanityImage
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

export const materials: Material[] = [
  {
    name: "Matte laminate",
    logo: logo1Image
  },
  {
    name: "Textured woodgrain laminate",
    logo: logo2Image
  },
  {
    name: "Fenix laminate",
    logo: logo3Image
  },
  {
    name: "Egger & Kronospan panels",
    logo: logo4Image
  },
  {
    name: "Blum hardware",
    logo: logo5Image
  },
  {
    name: "Hettich components",
    logo: logo6Image
  },
  {
    name: "Rehau edging systems",
    logo: logo7Image
  },
  {
    name: "Grass drawer systems",
    logo: logo8Image
  },
  {
    name: "Hafele fittings",
    logo: logo9Image
  }
];

export const referenceProjects: ReferenceProject[] = [
  {
    id: "ref-1",
    caseNumber: "Case 01",
    location: "NEW CAIRO • DEVELOPER",
    scope: "Phased delivery across 6 months • consistent quality throughout",
    title: "Zed East Residences",
    description: "Standardized luxury kitchen systems manufactured and delivered in strict production choreography.",
    image: luxuryKitchenImage,
    images: [luxuryKitchenImage, kitchenCabinetImage, fullKitchenCNCImage] // Kitchen project gallery
  },
  {
    id: "ref-2",
    caseNumber: "Case 02",
    location: "SIDI ABDEL RAHMAN",
    scope: "Villa kitchens • handed over June 2025",
    title: "Marassi North Coast",
    description: "High-end bespoke walnut cabinetry and walk-in dressing rooms built to rigorous seaside environmental specifications.",
    image: luxuryWardrobeImage,
    images: [luxuryWardrobeImage, digitalFactoryImage, factoryImage] // Wardrobe/Dressing room gallery
  },
  {
    id: "ref-3",
    caseNumber: "Case 03",
    location: "KATAMEYA • PRIVATE VILLA",
    scope: "Full interior fit-out • architect-specified detailing",
    title: "Palm Hills Katameya",
    description: "Integrated signature vanity and bathroom cabinetry featuring brass accents and custom fluted panelling.",
    image: luxuryVanityImage,
    images: [luxuryVanityImage, cncRouterImage, cncMachineImage] // Vanity project gallery
  }
];