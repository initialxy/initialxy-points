# UFormField Component

## Overview
The UFormField component is a wrapper for form elements that provides validation and error handling. It's used within a UForm component to enhance form controls with labels, descriptions, hints, help messages, and error handling.

## Key Features
- **Label**: Set with the `label` prop. Adds a required asterisk if `required` is true.
- **Description**: Additional info below the label using the `description` prop.
- **Hint**: Display a hint next to the label with the `hint` prop.
- **Help**: Show a help message below the form control with the `help` prop.
- **Error**: Display an error message below the form control with the `error` prop. Takes precedence over `help` when both are used.
- **Size**: Change the size of the FormField using the `size` prop, which is proxied to the form control.

## Example Usage
```vue
<template>
  <UFormField
    label="Email"
    description="We'll never share your email with anyone else."
    hint="Optional"
    help="Please enter a valid email address."
    error="Please enter a valid email address."
    size="xl"
  >
    <UInput placeholder="Enter your email" class="w-full" />
  </UFormField>
</template>
```

## Props
- `label`: string - The label for the form control.
- `description`: string - Additional information below the label.
- `hint`: string - Hint message next to the label.
- `help`: string - Help message below the form control.
- `error`: string | false | true - Error message below the form control.
- `size`: "md" | "xs" | "sm" | "lg" | "xl" - Size of the FormField.
- `required`: boolean - Adds a required asterisk to the label.
- `eagerValidation`: boolean - Validates on input immediately instead of waiting for blur.
- `validateOnInputDelay`: number - Delay before validating on input events (default: 300ms).

## Slots
- `label`: `{ label?: string }`
- `hint`: `{ hint?: string }`
- `description`: `{ description?: string }`
- `help`: `{ help?: string }`
- `error`: `{ error?: string | boolean }`
- `default`: `{ error?: string | boolean }`