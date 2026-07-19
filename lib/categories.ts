// Full storefront taxonomy — top-level categories map directly to
// Product.category, subcategories map to the optional Product.subcategory
// field. Hero images are real photography supplied for this project,
// served from /public/images/categories.

export type Subcategory = { label: string; slug: string };

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
      { label: "Face", slug: "face" },
      { label: "Eyes", slug: "eyes" },
      { label: "Lips", slug: "lips" },
      { label: "Nails", slug: "nails" },
    ],
  },
  {
    value: "SKINCARE",
    label: "Skincare",
    slug: "skincare",
    image: "/images/categories/skincare-hero.jpg",
    blurb: "Routines built for real skin, real climate, real results.",
    subcategories: [
      { label: "Cleansers", slug: "cleansers" },
      { label: "Moisturizers", slug: "moisturizers" },
      { label: "Serums & Treatments", slug: "serums-treatments" },
      { label: "Sun Protection", slug: "sun-protection" },
      { label: "Masks & Exfoliators", slug: "masks-exfoliators" },
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
      { label: "Body Lotion & Oil", slug: "body-lotion-oil" },
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
      { label: "Perfume / Eau de Parfum", slug: "perfume" },
      { label: "Cologne", slug: "cologne" },
      { label: "Body Mist", slug: "body-mist" },
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

// Quick links shown in the utility strip above the mega-menu.
export const QUICK_LINKS = [
  { label: "New Arrivals", href: "/products?badge=New" },
  { label: "Best Sellers", href: "/products?badge=Best+Seller" },
  { label: "Sale", href: "/products?badge=Sale" },
  { label: "Gift Sets", href: "/bundles" },
] as const;
