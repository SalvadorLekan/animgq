import dayjs from "dayjs";

export default function sortByDate<T extends { updatedAt?: number | null }>(data: T[]): Record<string, T[]> {
  return data.reduce((acc, curr) => {
    const key = getDate(curr.updatedAt);
    console.log(curr.updatedAt, key);
    return {
      ...acc,
      [key]: [...(acc[key] || []), curr],
    };
  }, {} as Record<string, T[]>);
}

export function getDate(date?: number | null): string {
  return dayjs.unix(date || Date.now()).format("DD/MM/YYYY");
}
