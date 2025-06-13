# UCalendar Component

The UCalendar component is a versatile Vue calendar component for selecting single dates, multiple dates, or date ranges. It relies on the `@internationalized/date` package for locale-aware date manipulation.

## Key Features

- **Single Date Selection**: Use `v-model` to control the selected date.
- **Multiple Date Selection**: Enable with the `multiple` prop.
- **Date Range Selection**: Enable with the `range` prop.
- **Customization**: Customize color, size, month/year controls, and more.
- **Disabled Dates**: Use `is-date-disabled` or `is-date-unavailable` props.
- **Integration**: Can be used with other UI components like `UButton` and `UPopover` to create date pickers.

## Basic Usage

```vue
<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
const value = ref(new CalendarDate(2022, 2, 3))
</script>

<template>
  <UCalendar v-model="value" />
</template>
```

## Props

- `v-model`: Controls the selected date(s).
- `default-value`: Sets the initial value.
- `multiple`: Allows selecting multiple dates.
- `range`: Allows selecting a date range.
- `color`: Changes the calendar color.
- `size`: Changes the calendar size.
- `disabled`: Disables the calendar.
- `numberOfMonths`: Changes the number of months displayed.
- `month-controls`, `year-controls`: Show/hide month/year controls.
- `is-date-disabled`, `is-date-unavailable`: Functions to mark specific dates as disabled/unavailable.

## Slots

- `heading`: Customize the month heading.
- `day`: Customize individual days.
- `week-day`: Customize weekday labels.

## Examples

- **Multiple Selection**:
  ```vue
  <UCalendar multiple v-model="value" />
  ```

- **Date Range**:
  ```vue
  <UCalendar range v-model="value" />
  ```

- **With Chip Events**:
  ```vue
  <UCalendar v-model="modelValue">
    <template #day="{ day }">
      <UChip :color="getColorByDate(day.toDate('UTC'))" size="2xs">
        {{ day.day }}
      </UChip>
    </template>
  </UCalendar>
  ```

## Theme Customization

Customize the calendar's appearance in your app's configuration:

```ts
export default defineAppConfig({
  ui: {
    calendar: {
      // Custom slot classes and variants
    }
  }
})
```