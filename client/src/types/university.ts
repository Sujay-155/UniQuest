export interface University {
  name: string;
  state: string;
  university_type: string;
  courses_offered: string[];
  official_website?: string;
  admission_portal_link?: string;
  application_deadline?: string;
  established_year?: number;
  location?: string;
  specialization?: string;
  fee_range?: string;
  scholarships_available?: string[];
  data_source?: string;
}

export interface UniversityFilterState {
  search: string;
  state: string | null;
  universityType: string | null;
}

