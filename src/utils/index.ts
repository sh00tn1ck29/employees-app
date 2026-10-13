function parseBirthDate(dateStr: string): [number, number, number] {
  const [day, month, year] = dateStr.split('.').map(Number);
  return [year, month, day];
}

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function getBirthDateValue(dateStr: string): number {
  const [year, month, day] = parseBirthDate(dateStr);
  return new Date(year, month - 1, day).getTime();
}

export function getBirthYear(dateStr: string): number {
  return parseBirthDate(dateStr)[0];
}

export function getAge(dateStr: string): number {
  const [year, month, day] = parseBirthDate(dateStr);
  const today = new Date();
  let age = today.getFullYear() - year;
  if (
    today.getMonth() + 1 < month ||
    (today.getMonth() + 1 === month && today.getDate() < day)
  )
    age--;
  return age;
}

export function formatBirthDate(dateStr: string): string {
  const [year, month, day] = parseBirthDate(dateStr);
  return `${day} ${monthNames[month - 1]} ${year}`;
}

export function formatBirthdayShort(dateStr: string): string {
  const [, month, day] = parseBirthDate(dateStr);
  return `${day} ${monthNames[month - 1]}`;
}

export function formatPosition(position: string, plural = false): string {
  const normalized = position.toLowerCase();
  const label = normalized.charAt(0).toUpperCase() + normalized.slice(1);
  return plural && !label.endsWith('s') ? `${label}s` : label;
}
