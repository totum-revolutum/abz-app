export type serverResponse = {
  success: boolean;
  users: any[];
  total_pages: number;
  total_users: number;
  count: number;
  links: {
    next_url: string | null;
    prev_url: string | null;
  };
};

export type serverResponsePositions = {
  success: boolean;
  positions: {
    id: number;
    name: string;
  }[];
};

export type serverResponseToken = {
  success: boolean;
  token: string;
};

const BASE_URL = "https://frontend-test-assignment-api.abz.agency/api/v1";

type RequestMethod = "GET";

async function request<T>(
  url: string,
  method: RequestMethod = "GET",
  searchParams: string[][] = []
): Promise<T> {
  const options: RequestInit = { method };

  const partlyUrl = new URL(BASE_URL + (url.startsWith("/") ? url : `/${url}`));

  searchParams.forEach(([key, value]) => {
    partlyUrl.searchParams.set(key, value);
  });

  const finalUrl = partlyUrl.toString();

  const response = await fetch(finalUrl, options);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}

export const client = {
  get: <T>(url: string, searchParams: string[][] = []) =>
    request<T>(url, "GET", searchParams),
};

export const getAllUsers = (url: string, criterion?: string[][]) => {
  return client.get<serverResponse>(url, criterion);
};

export const getAllPositions = (url: string, criterion?: string[][]) => {
  return client.get<serverResponsePositions>(url, criterion);
};

export const getToken = (url: string, criterion?: string[][]) => {
  return client.get<serverResponseToken>(url, criterion);
};
