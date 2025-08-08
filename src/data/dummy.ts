import type { Product, SimilarProduct, SimilarsByProductId, ShopData } from '../types';

// Standalone, tweakable sources
export const dummyTitles: string[] = [
  'شامپو گیاهی تقویت کننده',
  'کرم ضد آفتاب با SPF50',
  'صابون طبیعی دست ساز',
  'روغن آرگان خالص',
  'ماسک موی ترمیم کننده',
  'ژل شستشوی صورت',
  'لوسیون بدن آبرسان',
  'عطر گل محمدی',
  'سرم ویتامین C',
  'کرم پودر مات کننده',
  'خط چشم ضد آب',
  'ریمل حجم دهنده',
  'رژ لب مایع ماندگار',
  'پالت سایه چشم',
  'برس آرایشی',
  'شانه چوبی ضد موخوره',
  'کش موی ساتن',
  'ناخن گیر استیل',
  'سوهان ناخن شیشه ای',
  'گوش پاک کن پنبه ای',
];

export const dummyPriceBuckets: number[] = [50000, 75000, 30000, 120000, 90000, 45000, 60000, 150000, 110000, 80000];

// Utility helpers kept local for easier edits
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const toIso = (d: Date) => d.toISOString();
const rndDate = () => new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
const roundToThousand = (n: number) => Math.round(n / 1000) * 1000;

// Separated data generators
export const generateMyProducts = (count = 15): Product[] => {
  const list: Product[] = [];
  for (let i = 1; i <= count; i++) {
    const basePrice = pick(dummyPriceBuckets);
    const price = roundToThousand(basePrice - Math.random() * 20000);
    const createdAt = rndDate();
    list.push({
      id: `prod-${i}`,
      title: `${pick(dummyTitles)} (محصول ${i})`,
      price,
      photo_id: `https://placehold.co/200x200/A7F3D0/10B981?text=Prod${i}`,
      photos: [
        `https://placehold.co/300x200/A7F3D0/10B981?text=Image${i}-1`,
        `https://placehold.co/300x200/FEE2E2/EF4444?text=Image${i}-2`,
        `https://placehold.co/300x200/DBEAFE/3B82F6?text=Image${i}-3`,
      ],
      description: `این محصول ${pick(dummyTitles)} با کیفیت بالا و ویژگی‌های منحصر به فرد است. مناسب برای تمامی نیازها.`,
      basalamUrl: `https://basalam.com/product/${i}`,
      createdAt: toIso(createdAt),
    });
  }
  // newest first
  return list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
};

export const generateOtherProducts = (startId = 16, endId = 30): Product[] => {
  const list: Product[] = [];
  for (let i = startId; i <= endId; i++) {
    const basePrice = pick(dummyPriceBuckets);
    const price = roundToThousand(basePrice);
    const createdAt = rndDate();
    list.push({
      id: `prod-${i}`,
      title: `${pick(dummyTitles)} (محصول ${i})`,
      price,
      photo_id: `https://placehold.co/200x200/A7F3D0/10B981?text=Prod${i}`,
      photos: [
        `https://placehold.co/300x200/A7F3D0/10B981?text=Image${i}-1`,
        `https://placehold.co/300x200/FEE2E2/EF4444?text=Image${i}-2`,
        `https://placehold.co/300x200/DBEAFE/3B82F6?text=Image${i}-3`,
      ],
      description: `این محصول ${pick(dummyTitles)} با کیفیت بالا و ویژگی‌های منحصر به فرد است. مناسب برای تمامی نیازها.`,
      basalamUrl: `https://basalam.com/product/${i}`,
      createdAt: toIso(createdAt),
    });
  }
  return list;
};

export const generateSimilars = (myProducts: Product[]): SimilarsByProductId => {
  const similars: SimilarsByProductId = {};
  for (const p of myProducts) {
    similars[p.id] = [];

    // Existing competitors for some products
    const i = Number(p.id.replace('prod-', ''));
    if (i % 3 === 0) {
      const competitors: SimilarProduct[] = [];
      const count = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < count; j++) {
        const competitorPrice = p.price + (Math.random() > 0.5 ? Math.random() * 10000 : -Math.random() * 5000);
        competitors.push({
          id: `comp-${p.id}-${j}`,
          title: `رقبای ${p.title} ${j + 1}`,
          price: roundToThousand(competitorPrice),
          photo_id: `https://placehold.co/150x150/CBD5E1/4B5563?text=Comp${i}-${j}`,
          isCompetitor: true,
        });
      }
      similars[p.id].push(...competitors);
    }

    // New similars to choose from
    const count = Math.floor(Math.random() * 5) + 2;
    for (let j = 0; j < count; j++) {
      const isHigher = Math.random() > 0.4;
      const competitorPrice = isHigher ? p.price + Math.random() * p.price * 0.2 : p.price - Math.random() * p.price * 0.1;
      similars[p.id].push({
        id: `similar-${p.id}-${j}`,
        title: `مشابه ${p.title} ${j + 1}`,
        price: roundToThousand(competitorPrice),
        photo_id: `https://placehold.co/150x150/D1FAE5/065F46?text=Sim${p.id}-${j}`,
        isCompetitor: false,
      });
    }
  }
  return similars;
};

// Generate once and export each part separately for easy tweaking
export const my_products: Product[] = generateMyProducts(15);
export const other_products: Product[] = generateOtherProducts(16, 30);
export const similars: SimilarsByProductId = generateSimilars(my_products);

// Convenience combined object (editable piece by piece)
export const dummyShopData: ShopData = { my_products, other_products, similars };


