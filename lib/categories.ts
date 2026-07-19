// Full storefront taxonomy — top-level categories map directly to
// Product.category, subcategories map to the optional Product.subcategory
// field. Hero images are real photography supplied for this project,
// served from /public/images/categories.

export type Subcategory = { label: string; slug: string; icon?: string };

export type TopCategory = {
  value: string;
  label: string;
  slug: string;
  image: string;
  blurb: string;
  subcategories: Subcategory[];
};

export const TOP_CATEGORIES: TopCategory[] = [
  {
    value: "MAKEUP",
    label: "Makeup",
    slug: "makeup",
    image: "/images/categories/makeup-hero.jpg",
    blurb: "Face, eyes, lips and nails — colour that lasts through Accra heat.",
    subcategories: [
      { label: "Face", slug: "face", icon: "/images/categories/makeup-face.jpg" },
      { label: "Eyes", slug: "eyes" },
      { label: "Lips", slug: "lips" },
      { label: "Nails", slug: "nails", icon: "/images/categories/makeup-nails.jpg" },
    ],
  },
  {
    value: "SKINCARE",
    label: "Skincare",
    slug: "skincare",
    image: "/images/categories/skincare-hero.jpg",
    blurb: "Routines built for real skin, real climate, real results.",
    subcategories: [
      { label: "Cleansers", slug: "cleansers", icon: "/images/categories/skincare-cleansers.jpg" },
      { label: "Moisturizers", slug: "moisturizers", icon: "/images/categories/skincare-moisturizers.jpg" },
      {
        label: "Serums & Treatments",
        slug: "serums-treatments",
        icon: "/images/categories/skincare-serums.jpg",
      },
      { label: "Sun Protection", slug: "sun-protection" },
      {
        label: "Masks & Exfoliators",
        slug: "masks-exfoliators",
        icon: "/images/categories/skincare-masks.jpg",
      },
      { label: "Eye Care", slug: "eye-care" },
      { label: "Toners & Mists", slug: "toners-mists" },
    ],
  },
  {
    value: "HAIR_CARE",
    label: "Hair Care",
    slug: "hair-care",
    image: "/images/categories/haircare-hero.jpg",
    blurb: "Wash, style and treat — shine that holds in the humidity.",
    subcategories: [
      { label: "Shampoo & Conditioner", slug: "shampoo-conditioner" },
      { label: "Styling", slug: "styling" },
      { label: "Treatments", slug: "treatments" },
    ],
  },
  {
    value: "BATH_BODY",
    label: "Bath & Body",
    slug: "bath-body",
    image: "/images/categories/bathbody-hero.jpg",
    blurb: "Everyday rituals for skin that feels as good as it looks.",
    subcategories: [
      { label: "Body Wash & Soap", slug: "body-wash-soap" },
      {
        label: "Body Lotion & Oil",
        slug: "body-lotion-oil",
        icon: "/images/categories/bathbody-lotion.jpg",
      },
      { label: "Hand Care", slug: "hand-care" },
      { label: "Deodorant", slug: "deodorant" },
      { label: "Shave & Wax", slug: "shave-wax" },
    ],
  },
  {
    value: "FRAGRANCE",
    label: "Fragrance",
    slug: "fragrance",
    image: "/images/categories/fragrance-hero.jpg",
    blurb: "Signature scents — from everyday mists to statement parfum.",
    subcategories: [
      {
        label: "Perfume / Eau de Parfum",
        slug: "perfume",
        icon: "/images/categories/fragrance-perfume.jpg",
      },
      { label: "Cologne", slug: "cologne" },
      { label: "Body Mist", slug: "body-mist", icon: "/images/categories/fragrance-bodymist.jpg" },
    ],
  },
  {
    value: "GIFT_SETS",
    label: "Gift Sets",
    slug: "gift-sets",
    image: "/images/categories/giftsets-hero.jpg",
    blurb: "Curated bundles, ready to gift — see our Smart Bundles.",
    subcategories: [],
  },
  {
    value: "TOOLS_ACCESSORIES",
    label: "Tools & Accessories",
    slug: "tools-accessories",
    image: "/images/categories/tools-hero.jpg",
    blurb: "The brushes, tools and cases that finish the routine.",
    subcategories: [
      { label: "Brushes & Sponges", slug: "brushes-sponges" },
      { label: "Mirrors & Cases", slug: "mirrors-cases" },
      { label: "Travel & Storage", slug: "travel-storage" },
      { label: "Beauty Tools", slug: "beauty-tools" },
    ],
  },
];

export function getCategoryBySlug(slug: string): TopCategory | undefined {
  return TOP_CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryByValue(value: string): TopCategory | undefined {
  return TOP_CATEGORIES.find((c) => c.value === value);
}

export function subcategoryLabel(category: string, subSlug: string | null | undefined): string {
  if (!subSlug) return "";
  return getCategoryByValue(category)?.subcategories.find((s) => s.slug === subSlug)?.label ?? subSlug;
}

// A small image per subcategory keeps the mega-menu/accordion visual and
// tactile; subcategories without their own photo fall back to the parent
// category's hero shot rather than showing a blank row.
export function subcategoryIcon(category: TopCategory, sub: Subcategory): string {
  return sub.icon ?? category.image;
}

// "New" and "Sale" get their own standalone, visually distinct nav slots
// (never buried inside a dropdown) — used in the desktop mega-menu row and
// at the top of the mobile drawer.
export const HIGHLIGHT_LINKS = [
  { label: "New", href: "/products?badge=New", tone: "new" },
  { label: "Sale", href: "/products?badge=Sale", tone: "sale" },
] as const;

// Secondary utility links shown in the quieter strip above the mega-menu.
export const QUICK_LINKS = [
  { label: "Best Sellers", href: "/products?badge=Best+Seller" },
  { label: "Gift Sets", href: "/bundles" },
] as const;
