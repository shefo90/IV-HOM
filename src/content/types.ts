/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * The shape of the editable content payload.
 *
 * Strings named `heading` (and a few marked below) are rendered through
 * <RichText> and may contain the restricted inline markdown it understands:
 * `*italic*`, `**gold**`, and a trailing period that becomes the oversized
 * dot. Every other string is rendered verbatim.
 *
 * Image fields hold a URL path, not an import. In development and in the
 * visual tests these resolve against `public/media/`; in production nginx
 * serves the same paths from the content volume.
 */

/* ---------- shared list item shapes (moved here from src/data.ts) -------- */

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
  images?: string[];
}

export interface Material {
  name: string;
  logo: string;
}

export interface Stat {
  value: string;
  label: string;
}

/* ------------------------------ site chrome ----------------------------- */

export interface SiteContent {
  brand: {
    monogram: string;
    tagline: string;
  };
  nav: {
    items: Array<{ label: string; to: string }>;
    proposalCta: string;
    proposalCtaMobile: string;
    established: string;
  };
  footer: {
    monogram: string;
    /** RichText, dot disabled — the periods here are ordinary sentence ends. */
    blurb: string;
    watermark: string;
    navHeading: string;
    navLinks: Array<{ label: string; href: string }>;
    contactHeading: string;
    contactLines: string[];
  };
  contactForm: {
    fullNameLabel: string;
    companyLabel: string;
    emailLabel: string;
    phoneLabel: string;
    interestedInLabel: string;
    interestedInOptions: string[];
    projectDetailsLabel: string;
    projectDetailsPlaceholder: string;
    submitLabel: string;
    sendingLabel: string;
    successMessage: string;
    errorMessage: string;
  };
  proposalModal: {
    proposalTab: string;
    tourTab: string;
    proposalHeading: string;
    proposalIntro: string;
    tourHeading: string;
    tourIntro: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    categoryLabel: string;
    categoryOptions: Array<{ value: string; label: string }>;
    sizeLabel: string;
    sizeSuffix: string;
    timeframeLabel: string;
    timeframeOptions: Array<{ value: string; label: string }>;
    tourDateLabel: string;
    tourTimeLabel: string;
    tourTimeOptions: Array<{ value: string; label: string }>;
    detailsLabel: string;
    detailsPlaceholder: string;
    estimateHeading: string;
    estimatePrefix: string;
    estimateNote: string;
    cancelLabel: string;
    submitProposalLabel: string;
    submitTourLabel: string;
    submittingLabel: string;
    proposalSuccessHeading: string;
    proposalSuccessBody: string;
    tourSuccessHeading: string;
    tourSuccessBody: string;
    tourDateFallback: string;
    dismissLabel: string;
    errorMessage: string;
  };
}

/* -------------------------------- home ---------------------------------- */

export interface HomeContent {
  hero: {
    eyebrow: string;
    /**
     * Split in two for the same reason as the process page: an empty
     * <span class="orange-dot"></span> sits between the halves in the
     * original markup, drawing nothing but setting the line height.
     */
    headingLead: string;
    headingRest: string;
    image: string;
    imageAlt: string;
    statementLabel: string;
    statement: string;
    exploreCta: string;
    proposalCta: string;
    scrollLabel: string;
    scrollLabelShort: string;
  };
  chapterOne: {
    eyebrow: string;
    heading: string;
    body: string[];
    stats: Array<{ index: string; value: string; label: string }>;
    image: string;
    imageAlt: string;
    imageBadge: string;
    imageCaption: string;
    imageYear: string;
  };
  whatWeBuild: {
    eyebrow: string;
    heading: string;
    intro: string;
    categories: BuildCategory[];
  };
  choreography: {
    eyebrow: string;
    heading: string;
    quote: string;
    stages: ChoreographyStage[];
  };
  selectedWork: {
    eyebrow: string;
    heading: string;
    intro: string;
    stats: Stat[];
    projects: ReferenceProject[];
  };
  contactHeader: {
    eyebrow: string;
    heading: string;
    intro: string;
  };
  materials: Material[];
}

/* -------------------------------- about --------------------------------- */

export interface Crumbs {
  homeLabel: string;
  current: string;
}

export interface Cta {
  eyebrow: string;
  heading: string;
  body: string;
  primaryLabel: string;
  primaryTo: string;
  secondaryLabel: string;
  secondaryTo: string;
}

export interface AboutContent {
  subhero: {
    image: string;
    imageAlt: string;
    crumbs: Crumbs;
    eyebrow: string;
    heading: string;
    body: string;
  };
  mission: {
    eyebrow: string;
    heading: string;
    lede: string;
    body: string[];
    image: string;
    imageAlt: string;
    imageCorner: string;
    imageTag: string;
  };
  stats: Array<{ index: string; value: string; label: string }>;
  values: {
    eyebrow: string;
    heading: string;
    cards: Array<{ number: string; title: string; description: string }>;
    feature: { number: string; title: string; body: string };
  };
  cta: Cta;
}

/* ------------------------------- projects -------------------------------- */

export interface ProjectCase {
  image: string;
  imageAlt: string;
  corner: string;
  tag: string;
  title: string;
  description: string;
}

export interface ProjectsContent {
  subhero: {
    image: string;
    imageAlt: string;
    crumbs: Crumbs;
    eyebrow: string;
    heading: string;
    body: string;
  };
  stats: Stat[];
  /** The grid is one tall card beside a stack of two; that split is layout. */
  featured: ProjectCase;
  secondary: ProjectCase[];
  cta: Omit<Cta, "secondaryLabel" | "secondaryTo">;
}

/* -------------------------------- contact -------------------------------- */

export interface ContactContent {
  subhero: {
    image: string;
    imageAlt: string;
    crumbs: Crumbs;
    eyebrow: string;
    heading: string;
    body: string;
  };
  details: {
    eyebrow: string;
    items: Array<{ label: string; value: string }>;
  };
  form: {
    nameLabel: string;
    companyLabel: string;
    emailLabel: string;
    phoneLabel: string;
    interestLabel: string;
    interestOptions: string[];
    messageLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
    sendingLabel: string;
    successMessage: string;
    errorMessage: string;
  };
}

/* -------------------------------- process -------------------------------- */

export interface Subhero {
  image: string;
  imageAlt: string;
  crumbs: Crumbs;
  eyebrow: string;
  heading: string;
  body: string;
}

export interface NumberedRow {
  number: string;
  title: string;
  description: string;
}

/**
 * Some subheroes carry an empty <span class="orange-dot"></span> partway
 * through the h1. It draws no glyph, but its 1.4em inline box raises the line
 * height — dropping it lifts the whole page by roughly 19px. The span is
 * structure rather than copy, so the page renders it and the halves either
 * side come from these two fields.
 */
export interface SplitHeadingSubhero extends Omit<Subhero, "heading"> {
  headingLead: string;
  headingRest: string;
}

export interface ProcessContent {
  subhero: SplitHeadingSubhero;
  steps: Array<{
    owner: string;
    number: string;
    title: string;
    description: string;
  }>;
  tech: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: Array<{
      eq: string;
      title: string;
      description: string;
      /** Always three cells — blank ones hold their place in the grid. */
      specs: Array<{ label: string; value: string }>;
    }>;
  };
  quality: {
    eyebrow: string;
    heading: string;
    statTarget: string;
    statDecimals: string;
    statCaption: string;
    statLede: string;
    rows: NumberedRow[];
  };
  cta: Omit<Cta, "secondaryLabel" | "secondaryTo">;
}

/* -------------------------------- factory -------------------------------- */

export interface FactoryContent {
  subhero: Subhero;
  capacity: {
    eyebrow: string;
    heading: string;
    lead: string;
  };
  delivery: {
    eyebrow: string;
    heading: string;
    intro: string;
    coverageEyebrow: string;
    coverage: Array<{ area: string; note: string }>;
    rows: NumberedRow[];
  };
  warranty: {
    eyebrow: string;
    heading: string;
    intro: string;
    cards: Array<{
      label: string;
      /** Counter cards animate to a target; the lifetime card uses `text`. */
      count?: { target: string; suffix: string };
      text?: string;
      title: string;
      description: string;
    }>;
    quote: string;
  };
  cta: Omit<Cta, "secondaryLabel" | "secondaryTo">;
}

/* -------------------------------- products ------------------------------- */

export interface ProductsContent {
  subhero: SplitHeadingSubhero;
  categories: Array<{
    to: string;
    image: string;
    imageAlt: string;
    index: string;
    title: string;
    metaLeft: string;
    metaRight: string;
  }>;
  details: Array<{
    eyebrow: string;
    title: string;
    lede: string;
    image: string;
    imageAlt: string;
    tag: string;
  }>;
  materials: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: Array<{ code: string; name: string }>;
  };
  cta: Omit<Cta, "secondaryLabel" | "secondaryTo">;
}

/* ------------------------------ the payload ----------------------------- */

export interface Content {
  site: SiteContent;
  home: HomeContent;
  about: AboutContent;
  projects: ProjectsContent;
  contact: ContactContent;
  process: ProcessContent;
  factory: FactoryContent;
  products: ProductsContent;
}
