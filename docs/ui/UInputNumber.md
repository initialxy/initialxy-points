# UInputNumber Component

## Overview
The UInputNumber component is a Vue.js input component for numerical values with customizable range. It relies on the `@internationalized/number` package for formatting and parsing numbers across locales.

## Key Features
- Control value with `v-model` or set initial value with `default-value`
- Set min/max values with `min`/`max` props
- Customize step value with `step` prop
- Change orientation with `orientation` prop
- Customize placeholder text with `placeholder` prop
- Change ring color on focus with `color` prop
- Change variant with `variant` prop
- Change size with `size` prop
- Disable input with `disabled` prop
- Customize increment/decrement buttons with `increment`/`decrement` props
- Customize increment/decrement icons with `increment-icon`/`decrement-icon` props
- Format value with `format-options` prop (decimal, percentage, currency)
- Use within a FormField component for label, help text, etc.
- Customize buttons with slots (`#increment`, `#decrement`)

## Props
- `as`: Element/component to render as
- `placeholder`: Placeholder text
- `color`: Ring color on focus
- `variant`: Variant style
- `size`: Size of the input
- `highlight`: Highlight ring color
- `orientation`: Orientation (horizontal/vertical)
- `increment`: Configure increment button
- `incrementIcon`: Icon for increment button
- `incrementDisabled`: Disable increment button
- `decrement`: Configure decrement button
- `decrementIcon`: Icon for decrement button
- `decrementDisabled`: Disable decrement button
- `autofocus`: Auto-focus input
- `autofocusDelay`: Delay before auto-focus
- `locale`: Locale for formatting/parsing
- `disabled`: Disable input
- `name`: Field name
- `modelValue`: Controlled value
- `defaultValue`: Initial value
- `required`: Required field
- `id`: Element ID
- `min`: Minimum value
- `max`: Maximum value
- `step`: Step value
- `stepSnapping`: Enable/disable step snapping
- `formatOptions`: Formatting options
- `disableWheelChange`: Prevent value change on wheel scroll
- `invertWheelChange`: Invert wheel change direction
- `ui`: Custom UI classes

## Slots
- `increment`: Customize increment button
- `decrement`: Customize decrement button

## Emits
- `blur`: Emitted on blur
- `change`: Emitted on change
- `update:modelValue`: Emitted on value update

## Expose
- `inputRef`: Reference to the input element
