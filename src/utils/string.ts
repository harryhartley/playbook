export const toTitleCase = (s: string): string => `${s.charAt(0).toUpperCase()}${s.slice(1).toLowerCase()}`

export const isInt = (s: string): boolean => parseInt(s, 10).toString() === s
