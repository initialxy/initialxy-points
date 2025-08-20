export function getReadableTaskType(taskType: string): string {
  switch (taskType) {
    case 'single-use':
      return 'Single use'
    case 'perpetual':
      return 'Perpetual'
    default:
      return 'Unknown'
  }
}
