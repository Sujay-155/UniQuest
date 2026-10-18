export interface Fest {
  name: string;
  host_institution: string;
  state?: string;
  location?: string;
  festival_type?: string;
  first_held?: number;
  official_website?: string;
  data_source?: string;
}

export interface FestFilterState {
  search: string;
  state: string | null;
  festivalType: string | null;
}
