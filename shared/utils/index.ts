export const SESSION_MAX_AGE = 60 * 60 * 24 * 14 // 2 week

export function getReadableRecurrenceType(recurrenceType: string): string {
  switch (recurrenceType) {
    case 'single-use':
      return 'Single use'
    case 'perpetual':
      return 'Perpetual'
    default:
      return 'Unknown'
  }
}
