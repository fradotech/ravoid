import { EnvConfig } from '@/app/config/env.config';
import type { TApiRes, TPaginateResponse, TPaginationMeta } from '@/app/types/common.type';

interface RequestOptions {
  params?: Record<string, string | number | undefined>;
  headers?: Record<string, string>;
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
  const url = new URL(path, EnvConfig.apiBaseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

async function fetchJson<T>(path: string, options?: RequestOptions): Promise<T> {
  const url = buildUrl(path, options?.params);

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

async function request<T>(path: string, options?: RequestOptions): Promise<T> {
  const json = await fetchJson<TApiRes<T>>(path, options);
  return json.data;
}

async function requestPaginated<T>(path: string, options?: RequestOptions): Promise<TPaginateResponse<T>> {
  const json = await fetchJson<{ data: T[]; meta: TPaginationMeta }>(path, options);
  return { data: json.data, meta: json.meta };
}

export const httpClient = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, options),
  getList: <T>(path: string, options?: RequestOptions) => requestPaginated<T>(path, options),
};
