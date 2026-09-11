import { type Employee } from '../types';

const API_URL = 'https://68f747b1f7fb897c66152f05.mockapi.io/employees';

export async function getEmployees(): Promise<Employee[]> {
  const response = await fetch(API_URL);
  return response.json() as Promise<Employee[]>;
}

export async function getEmployee(id: string): Promise<Employee> {
  const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`);
  return response.json() as Promise<Employee>;
}
