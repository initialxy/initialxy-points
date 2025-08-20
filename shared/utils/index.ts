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
