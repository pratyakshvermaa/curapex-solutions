export type Medicine = {
  slug: string;
  name: string;
  /** Dosage form subcategory: Tablets, Capsules, Injections, etc. */
  category: string;
  /** Therapeutic parent category from ADS PL sheet: ED Medicines, Pain Killers, etc. */
  parentCategory?: string;
  composition?: string | null;
  dosageForm?: string | null;
  packaging?: string | null;
  moq?: string | null;
  price?: string | null;
  description?: string | null;
  images: string[];
  certifications?: string[];
  brand?: string | null;
  strength?: string | null;
  indiaMartId?: string;
  indiaMartCategory?: string | null;
  source?: string;
  specs?: Record<string, string>;
};
