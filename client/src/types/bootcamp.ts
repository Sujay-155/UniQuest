export interface Bootcamp {
  id: string;
  name: string;
  provider: string;
  tech_stack: string[];
  price_inr: number;
  placement_guarantee: boolean;
  isa_available: boolean;
  alumni_rating: number;
  affiliate_url: string;
  duration_weeks?: number;
  mode?: string;
  highlights?: string[];
  description?: string;
}

export interface ComparisonMetrics {
  price_difference_inr: number;
  cheaper_bootcamp_id: string;
  rating_difference: number;
  higher_rated_bootcamp_id: string;
  common_technologies: string[];
  unique_to_b1: string[];
  unique_to_b2: string[];
}

export interface ComparisonResponse {
  success: boolean;
  bootcamps: [Bootcamp, Bootcamp];
  comparison: ComparisonMetrics;
  error?: string;
}

export interface BootcampsResponse {
  success: boolean;
  count: number;
  data: Bootcamp[];
  error?: string;
}

export interface BootcampDetailResponse {
  success: boolean;
  data: Bootcamp;
  error?: string;
}

export interface FilterState {
  search: string;
  techStack: string[];
  placementGuarantee: boolean | null;
  isaAvailable: boolean | null;
  maxPrice: number | null;
  sortBy: 'rating_desc' | 'rating_asc' | 'price_asc' | 'price_desc';
}
