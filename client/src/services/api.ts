import { BootcampDetailResponse, BootcampsResponse, ComparisonResponse, FilterState } from "../types/bootcamp";
import { University, UniversityFilterState } from "../types/university";
import { Fest, FestFilterState } from "../types/fest";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/bootcamps";

export async function fetchBootcamps(filters?: Partial<FilterState>): Promise<BootcampsResponse> {
  const params = new URLSearchParams();

  if (filters?.techStack && filters.techStack.length > 0) {
    params.set("tech_stack", filters.techStack.join(","));
  }
  if (filters?.placementGuarantee !== null && filters?.placementGuarantee !== undefined) {
    params.set("placement_guarantee", String(filters.placementGuarantee));
  }
  if (filters?.isaAvailable !== null && filters?.isaAvailable !== undefined) {
    params.set("isa_available", String(filters.isaAvailable));
  }
  if (filters?.maxPrice !== null && filters?.maxPrice !== undefined) {
    params.set("max_price", String(filters.maxPrice));
  }
  if (filters?.search) {
    params.set("search", filters.search);
  }
  if (filters?.sortBy) {
    params.set("sort_by", filters.sortBy);
  }

  const query = params.toString();
  const url = query ? `${BASE_URL}?${query}` : BASE_URL;

  const response = await fetch(url);
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Failed to fetch bootcamps (${response.status})`);
  }

  return response.json();
}

export async function fetchBootcampById(id: string): Promise<BootcampDetailResponse> {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Failed to fetch bootcamp details (${response.status})`);
  }

  return response.json();
}

export async function compareBootcamps(b1Id: string, b2Id: string): Promise<ComparisonResponse> {
  const params = new URLSearchParams({ b1: b1Id, b2: b2Id });
  const response = await fetch(`${BASE_URL}/compare?${params.toString()}`);
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Failed to compare bootcamps (${response.status})`);
  }

  return response.json();
}

export async function fetchUniversities(filters?: Partial<UniversityFilterState>): Promise<University[]> {
  const params = new URLSearchParams();

  if (filters?.search) {
    params.set("course", filters.search);
  }
  if (filters?.state) {
    params.set("state", filters.state);
  }
  if (filters?.universityType) {
    params.set("university_type", filters.universityType);
  }

  const query = params.toString();
  const url = "/api/universities" + (query ? "?" + query : "");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch universities");
  }

  return response.json();
}

export async function fetchFests(filters?: Partial<FestFilterState>): Promise<Fest[]> {
  const params = new URLSearchParams();

  if (filters?.state) {
    params.set("state", filters.state);
  }
  if (filters?.festivalType) {
    params.set("festival_type", filters.festivalType);
  }
  if (filters?.search) {
    params.set("institution", filters.search);
  }

  const query = params.toString();
  const url = "/api/fests" + (query ? "?" + query : "");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch fests");
  }

  return response.json();
}