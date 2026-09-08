import { type Employee } from '../types';

const API_URL = 'https://68f747b1f7fb897c66152f05.mockapi.io/employees';

async function request<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Employees API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export function getEmployees(): Promise<Employee[]> {
  return request<Employee[]>(API_URL);
}

export function getEmployee(id: string): Promise<Employee> {
  return request<Employee>(`${API_URL}/${encodeURIComponent(id)}`);
}
