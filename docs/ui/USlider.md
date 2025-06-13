# USlider Component

The USlider component is a Vue slider input for selecting numeric values within a range. Key features include:

## Basic Usage
- Control value with `v-model` directive
- Set initial value with `default-value` prop

## Range Settings
- Set min/max values with `min`/`max` props (default: 0/100)
- Set increment value with `step` prop (default: 1)

## Multiple Values
- Create range slider with array values in `v-model` or `default-value`
- Control thumb distance with `min-steps-between-thumbs` prop

## Orientation
- Change orientation with `orientation` prop (default: horizontal)

## Styling
- Change color with `color` prop
- Change size with `size` prop

## Tooltip
- Display current value with `tooltip` prop

## Disabled State
- Disable slider with `disabled` prop

## Inverted
- Visually invert slider with `inverted` prop

## Props
- `min`, `max`, `step`, `orientation`, `color`, `size`, `tooltip`, `disabled`, `inverted`

## Emits
- `update:modelValue`, `change`
