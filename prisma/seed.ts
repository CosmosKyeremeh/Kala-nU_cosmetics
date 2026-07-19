import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateProductQr } from "../lib/qrcode";

const prisma = new PrismaClient();

const products = [
  {
    name: "Rose Glow Body Spray",
    slug: "rose-glow-body-spray",
    description:
      "A delicate rose and vanilla body mist that keeps you fresh all day. Alcohol-light formula suited for Ghana's climate.",
    tagline: "The scent that makes strangers ask what you're wearing.",
    price: 45,
    category: "FRAGRANCE",
    subcategory: "body-mist",
    images: ["/products/rose-glow-body-spray.svg"],
    stock: 40,
    isFeatured: true,
    badge: "Best Seller",
    texture: "A weightless, fine mist that settles as a soft veil — never wet, never sticky.",
    ingredients: ["Rose Water", "Vanilla Extract", "Glycerin", "Aloe Vera", "Vitamin E"],
    skinTones: [],
    concerns: [],
  },
  {
    name: "Citrus Burst Body Spray",
    slug: "citrus-burst-body-spray",
    description: "Zesty citrus and mint top notes for an energising everyday scent.",
    tagline: "Wake up your skin, not just your senses.",
    price: 42,
    category: "FRAGRANCE",
    subcategory: "body-mist",
    images: ["/products/citrus-burst-body-spray.svg"],
    stock: 35,
    badge: null,
    texture: "A crisp, cooling mist with an instant energising snap.",
    ingredients: ["Citrus Extract", "Peppermint Oil", "Glycerin", "Aloe Vera"],
    skinTones: [],
    concerns: [],
  },
  {
    name: "Vitamin C Brightening Serum",
    slug: "vitamin-c-serum",
    description: "Lightweight serum with 15% Vitamin C to even skin tone and add radiance.",
    tagline: "Dull skin doesn't stand a chance.",
    price: 85,
    category: "SKINCARE",
    subcategory: "serums-treatments",
    images: ["/products/vitamin-c-serum.svg"],
    stock: 25,
    isFeatured: true,
    badge: "New",
    texture: "A silky, fast-absorbing serum that sinks in within seconds — no sticky residue, just glow.",
    ingredients: ["15% Vitamin C", "Hyaluronic Acid", "Ferulic Acid", "Vitamin E"],
    skinTones: ["fair", "light", "medium", "tan", "deep"],
    concerns: ["dullness", "ageing"],
  },
  {
    name: "Hydrating Rose Toner",
    slug: "hydrating-rose-toner",
    description: "Alcohol-free toner with rose water and glycerin to soothe and hydrate skin.",
    tagline: "Skin that feels calmer within one spritz.",
    price: 55,
    category: "SKINCARE",
    subcategory: "toners-mists",
    images: ["/products/hydrating-rose-toner.svg"],
    stock: 30,
    badge: null,
    texture: "A featherlight liquid mist that hydrates instantly without any tackiness.",
    ingredients: ["Rose Water", "Glycerin", "Niacinamide", "Panthenol"],
    skinTones: ["fair", "light", "medium"],
    concerns: ["dryness", "sensitivity"],
  },
  {
    name: "Shea Butter Moisturizer",
    slug: "shea-butter-moisturizer",
    description: "Rich, fast-absorbing moisturizer made with unrefined Ghanaian shea butter.",
    tagline: "The moisture your skin has been asking for.",
    price: 60,
    category: "SKINCARE",
    subcategory: "moisturizers",
    images: ["/products/shea-butter-moisturizer.svg"],
    stock: 5,
    isFeatured: true,
    badge: "Low Stock",
    texture: "A rich, whipped cream texture that melts into skin, leaving a soft-focus finish.",
    ingredients: ["Unrefined Shea Butter", "Jojoba Oil", "Vitamin E", "Ceramides"],
    skinTones: ["medium", "tan", "deep"],
    concerns: ["dryness"],
  },
  {
    name: "SPF 50 Daily Sunscreen",
    slug: "spf50-sunscreen",
    description: "Broad-spectrum SPF 50 with a lightweight, non-greasy, no white-cast finish.",
    tagline: "Protection that never leaves a trace.",
    price: 70,
    category: "SKINCARE",
    subcategory: "sun-protection",
    images: ["/products/spf50-sunscreen.svg"],
    stock: 18,
    badge: null,
    texture: "A weightless fluid that blends invisibly — zero white cast, zero shine.",
    ingredients: ["Zinc Oxide", "Niacinamide", "Vitamin E", "Squalane"],
    skinTones: ["fair", "light", "medium", "tan", "deep"],
    concerns: ["ageing", "sensitivity"],
  },
  {
    name: "Charcoal Deodorant Stick",
    slug: "charcoal-deodorant",
    description: "24-hour protection with activated charcoal to neutralise odour naturally.",
    tagline: "All-day confidence, zero white marks.",
    price: 25,
    category: "BATH_BODY",
    subcategory: "deodorant",
    images: ["/products/charcoal-deodorant.svg"],
    stock: 50,
    badge: null,
    texture: "A smooth, dry-touch glide that disappears on contact — no residue on dark fabrics.",
    ingredients: ["Activated Charcoal", "Arrowroot Powder", "Coconut Oil", "Shea Butter"],
    skinTones: [],
    concerns: ["sensitivity"],
  },
  {
    name: "Cocoa Butter Lip Balm",
    slug: "cocoa-lip-balm",
    description: "Nourishing cocoa butter balm to heal and soften dry lips, with a soft wash of tint.",
    tagline: "Lips that feel healed, not just covered.",
    price: 18,
    category: "MAKEUP",
    subcategory: "lips",
    images: ["/products/cocoa-lip-balm.svg"],
    stock: 60,
    badge: null,
    texture: "A balmy, melt-on-contact texture that leaves a soft satin sheen, never sticky.",
    ingredients: ["Cocoa Butter", "Shea Butter", "Vitamin E", "Beeswax"],
    shades: [
      { name: "Nude Glow", hex: "#c98b73" },
      { name: "Rose Tint", hex: "#c2185b" },
      { name: "Berry Wine", hex: "#7a1f3d" },
    ],
    skinTones: [],
    concerns: ["dryness"],
  },
  {
    name: "Coconut Hair Pomade",
    slug: "coconut-hair-pomade",
    description: "Strong-hold pomade with coconut oil for shine without the grease.",
    tagline: "Hold that lasts, shine that doesn't quit.",
    price: 35,
    category: "HAIR_CARE",
    subcategory: "styling",
    images: ["/products/coconut-hair-pomade.svg"],
    stock: 28,
    isFeatured: true,
    badge: "Best Seller",
    texture: "A dense, workable pomade that melts between fingers and sets with a glossy finish.",
    ingredients: ["Coconut Oil", "Beeswax", "Shea Butter", "Castor Oil"],
    skinTones: [],
    concerns: [],
  },
  {
    name: "Herbal Foot & Pedicure Cream",
    slug: "herbal-pedicure-cream",
    description: "Intensive repair cream for cracked heels and rough feet, with tea tree and peppermint.",
    tagline: "Cracked heels, meet your last straw.",
    price: 40,
    category: "BATH_BODY",
    subcategory: "hand-care",
    images: ["/products/herbal-pedicure-cream.svg"],
    stock: 22,
    badge: null,
    texture: "A thick balm that softens rough patches overnight — wake up to smoother heels.",
    ingredients: ["Tea Tree Oil", "Peppermint Oil", "Urea", "Shea Butter"],
    skinTones: [],
    concerns: ["dryness"],
  },
  {
    name: "Second Skin Foundation",
    slug: "second-skin-foundation",
    description:
      "Buildable, breathable medium coverage foundation that matches Ghanaian skin tones without oxidising.",
    tagline: "Coverage that breathes with you.",
    price: 95,
    category: "MAKEUP",
    subcategory: "face",
    images: ["/products/second-skin-foundation.svg"],
    stock: 20,
    isFeatured: true,
    badge: "New",
    texture: "A weightless fluid that blurs on contact and sets to a natural, skin-like matte.",
    ingredients: ["Squalane", "Niacinamide", "Hyaluronic Acid", "Zinc Oxide"],
    shades: [
      { name: "Fair Sand", hex: "#f0c9a0" },
      { name: "Warm Tan", hex: "#c98b5f" },
      { name: "Deep Cocoa", hex: "#5b3a24" },
    ],
    skinTones: ["fair", "light", "medium", "tan", "deep"],
    concerns: ["oiliness", "dullness"],
  },
  {
    name: "Featherlight Volumizing Mascara",
    slug: "featherlight-mascara",
    description: "Smudge-proof, humidity-proof mascara that lifts and separates without clumping.",
    tagline: "Lashes that survive the whole day.",
    price: 48,
    category: "MAKEUP",
    subcategory: "eyes",
    images: ["/products/featherlight-mascara.svg"],
    stock: 32,
    badge: null,
    texture: "A featherlight coat that builds without clumping, holding curl through heat and humidity.",
    ingredients: ["Beeswax", "Carnauba Wax", "Vitamin E", "Panthenol"],
    skinTones: [],
    concerns: [],
  },
  {
    name: "Glass Shine Nail Polish",
    slug: "glass-shine-nail-polish",
    description: "High-gloss, chip-resistant nail lacquer in a rich berry shade.",
    tagline: "Salon shine, no salon needed.",
    price: 22,
    category: "MAKEUP",
    subcategory: "nails",
    images: ["/products/glass-shine-nail-polish.svg"],
    stock: 45,
    badge: null,
    texture: "A self-levelling formula that dries to a glassy, chip-resistant finish.",
    ingredients: ["Nitrocellulose", "Adipate", "Vitamin E"],
    shades: [
      { name: "Berry Wine", hex: "#7a1f3d" },
      { name: "Classic Red", hex: "#c2185b" },
      { name: "Nude Glow", hex: "#c98b73" },
    ],
    skinTones: [],
    concerns: [],
  },
  {
    name: "Ocean Breeze Eau de Parfum",
    slug: "ocean-breeze-edp",
    description: "A fresh aquatic-floral eau de parfum with a soft, lingering dry-down.",
    tagline: "The scent of a good day out.",
    price: 220,
    category: "FRAGRANCE",
    subcategory: "perfume",
    images: ["/products/ocean-breeze-edp.svg"],
    stock: 15,
    isFeatured: true,
    badge: "Best Seller",
    texture: "A fine spray that opens fresh and settles into a soft, skin-warm dry-down.",
    ingredients: ["Alcohol Denat.", "Fragrance", "Aqua", "Vitamin E"],
    skinTones: [],
    concerns: [],
  },
  {
    name: "Gentle Daily Shampoo",
    slug: "gentle-daily-shampoo",
    description: "Sulfate-free daily shampoo that cleanses without stripping natural oils.",
    tagline: "Clean hair, still soft by evening.",
    price: 38,
    category: "HAIR_CARE",
    subcategory: "shampoo-conditioner",
    images: ["/products/gentle-daily-shampoo.svg"],
    stock: 40,
    badge: null,
    texture: "A creamy, low-foam lather that rinses clean without leaving hair stripped.",
    ingredients: ["Coconut-derived Surfactants", "Argan Oil", "Panthenol"],
    skinTones: [],
    concerns: [],
  },
  {
    name: "Rose Quartz Gua Sha",
    slug: "rose-quartz-gua-sha",
    description: "Hand-polished rose quartz gua sha tool for daily facial massage and de-puffing.",
    tagline: "Five minutes, visibly less puffy.",
    price: 65,
    category: "TOOLS_ACCESSORIES",
    subcategory: "beauty-tools",
    images: ["/products/rose-quartz-gua-sha.svg"],
    stock: 18,
    isFeatured: true,
    badge: "New",
    texture: "A cool, smooth stone that glides without tugging when paired with a facial oil.",
    ingredients: [],
    skinTones: [],
    concerns: [],
  },
  {
    name: "Whipped Body Butter",
    slug: "whipped-body-butter",
    description: "Ultra-rich whipped shea and cocoa butter blend for intensive body moisture.",
    tagline: "Melts in, never sits heavy.",
    price: 50,
    category: "BATH_BODY",
    subcategory: "body-lotion-oil",
    images: ["/products/whipped-body-butter.svg"],
    stock: 30,
    badge: "Sale",
    texture: "A cloud-light whip that melts on contact and sinks in fully within minutes.",
    ingredients: ["Shea Butter", "Cocoa Butter", "Coconut Oil", "Vitamin E"],
    skinTones: [],
    concerns: ["dryness"],
  },
];

const reviewsBySlug: Record<
  string,
  { authorName: string; rating: number; body: string; skinTone?: string; concern?: string }[]
> = {
  "vitamin-c-serum": [
    {
      authorName: "Ama K.",
      rating: 5,
      body: "My dark spots have faded so much after 6 weeks. Doesn't sting like other vitamin C serums I've tried.",
      skinTone: "medium",
      concern: "dullness",
    },
    {
      authorName: "Efua T.",
      rating: 4,
      body: "Great glow but I had to introduce it slowly — a little strong for my sensitive skin at first.",
      skinTone: "fair",
      concern: "sensitivity",
    },
    {
      authorName: "Naa A.",
      rating: 5,
      body: "Absorbs fast, no sticky feeling under makeup. Repurchased twice already.",
      skinTone: "deep",
      concern: "dullness",
    },
  ],
  "shea-butter-moisturizer": [
    {
      authorName: "Abena O.",
      rating: 5,
      body: "Finally a moisturizer that actually survives the Accra heat without feeling greasy by noon.",
      skinTone: "tan",
      concern: "dryness",
    },
    {
      authorName: "Yaa B.",
      rating: 4,
      body: "Rich but sinks in well. A little goes a long way.",
      skinTone: "deep",
      concern: "dryness",
    },
  ],
  "cocoa-lip-balm": [
    {
      authorName: "Adjoa M.",
      rating: 5,
      body: "The Rose Tint shade is gorgeous and my lips stopped peeling within days.",
      concern: "dryness",
    },
    {
      authorName: "Akosua F.",
      rating: 5,
      body: "Berry Wine is my everyday shade now. Feels like a treatment, not just a balm.",
    },
  ],
  "coconut-hair-pomade": [
    {
      authorName: "Kwabena S.",
      rating: 5,
      body: "Strong hold all day in Accra humidity and the shine doesn't look greasy.",
    },
  ],
  "hydrating-rose-toner": [
    {
      authorName: "Esi N.",
      rating: 4,
      body: "Calmed my skin down within a week of use. Smells lovely too.",
      skinTone: "light",
      concern: "sensitivity",
    },
  ],
};

const ugcPosts = [
  { image: "/ugc/post-1.svg", caption: "Everyday glow", authorHandle: "@ama.wears.it" },
  { image: "/ugc/post-2.svg", caption: "Wedding-day skin", authorHandle: "@efua_beauty" },
  { image: "/ugc/post-3.svg", caption: "Post-gym routine", authorHandle: "@naa.glows" },
  { image: "/ugc/post-4.svg", caption: "First week results", authorHandle: "@abena.k" },
  { image: "/ugc/post-5.svg", caption: "Date night", authorHandle: "@yaa.b" },
  { image: "/ugc/post-6.svg", caption: "Sunday skincare", authorHandle: "@esi.n" },
];

const bundles = [
  {
    name: "Glow Starter Routine",
    slug: "glow-starter-routine",
    description: "Everything you need to start a brightening routine — serum, toner and daily SPF.",
    image: "/products/vitamin-c-serum.svg",
    price: 180,
    productSlugs: ["vitamin-c-serum", "hydrating-rose-toner", "spf50-sunscreen"],
  },
  {
    name: "Everyday Freshness Duo",
    slug: "everyday-freshness-duo",
    description: "Our best-selling body spray paired with the charcoal deodorant for all-day confidence.",
    image: "/products/rose-glow-body-spray.svg",
    price: 60,
    productSlugs: ["rose-glow-body-spray", "charcoal-deodorant"],
  },
  {
    name: "Repair & Restore Set",
    slug: "repair-and-restore-set",
    description: "Shea butter moisturizer and pedicure cream for head-to-toe repair.",
    image: "/products/shea-butter-moisturizer.svg",
    price: 90,
    productSlugs: ["shea-butter-moisturizer", "herbal-pedicure-cream"],
  },
];

async function main() {
  const createdProducts: Record<string, { id: string }> = {};

  for (const product of products) {
    const { ...data } = product;
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: data,
      create: data,
    });
    createdProducts[product.slug] = created;
  }

  for (const [slug, reviews] of Object.entries(reviewsBySlug)) {
    const product = createdProducts[slug];
    if (!product) continue;
    const existing = await prisma.review.count({ where: { productId: product.id } });
    if (existing > 0) continue;
    for (const review of reviews) {
      await prisma.review.create({
        data: { productId: product.id, ...review },
      });
    }
  }

  const existingUgc = await prisma.ugcPost.count();
  if (existingUgc === 0) {
    await prisma.ugcPost.createMany({ data: ugcPosts });
  }

  for (const bundle of bundles) {
    const { productSlugs, ...data } = bundle;
    const productIds = productSlugs
      .map((s) => createdProducts[s]?.id)
      .filter((id): id is string => Boolean(id));
    await prisma.bundle.upsert({
      where: { slug: bundle.slug },
      update: { ...data, productIds },
      create: { ...data, productIds },
    });
  }

  const demoPasswordHash = await bcrypt.hash("password123", 10);
  await prisma.user.upsert({
    where: { email: "demo@glowcart.gh" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "demo@glowcart.gh",
      passwordHash: demoPasswordHash,
      phone: "0244000000",
      region: "Greater Accra",
      city: "Accra",
      address: "12 Oxford Street, Osu",
    },
  });

  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@glowcart.gh" },
    update: { role: "ADMIN" },
    create: {
      name: "GlowCart Admin",
      email: "admin@glowcart.gh",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      region: "Greater Accra",
      city: "Accra",
    },
  });

  const cashierPasswordHash = await bcrypt.hash("cashier123", 10);
  await prisma.user.upsert({
    where: { email: "cashier@glowcart.gh" },
    update: { role: "CASHIER" },
    create: {
      name: "GlowCart Cashier",
      email: "cashier@glowcart.gh",
      passwordHash: cashierPasswordHash,
      role: "CASHIER",
      region: "Greater Accra",
      city: "Accra",
    },
  });

  // Auto-generate a QR code (encoding the product id) for every product
  // that doesn't have one yet, so the POS scanner has something to scan.
  const productsWithoutQr = await prisma.product.findMany({
    where: { qrCode: null },
    select: { id: true },
  });
  for (const product of productsWithoutQr) {
    const qrCode = await generateProductQr(product.id);
    await prisma.product.update({ where: { id: product.id }, data: { qrCode } });
  }

  console.log(
    `Seeded ${products.length} products (+ QR codes), reviews, ${ugcPosts.length} UGC posts, ${bundles.length} bundles, 1 demo user (demo@glowcart.gh / password123), 1 admin user (admin@glowcart.gh / admin123), and 1 cashier user (cashier@glowcart.gh / cashier123)`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
