import * as Process from 'process';

export const limitNumber: number = Number.parseInt(Process.env.LIMIT_NUMBER);

/// status types
export const pendingStatus = 'Pending';

/// un searched values for searching functions
export const unSearchedValues = {
  en: ['the', 'on', 'a', 'or'],
  fr: ['the', 'on', 'a', 'or'],
  ar: ['the', 'on', 'a', 'or'],
};
