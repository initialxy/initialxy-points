# UForm Component

The UForm component in Nuxt UI provides built-in validation and submission handling for forms. It works with various validation libraries like Valibot, Zod, Yup, Joi, and Superstruct, or custom validation logic.

## Key Features

- **Schema Validation**: Requires `state` (reactive form state) and `schema` (validation schema) props.
- **Custom Validation**: Use the `validate` prop for custom validation logic.
- **Input Events**: Triggers validation on `input`, `change`, or `blur` events.
- **Error Handling**: Listens to `@error` event for error handling.
- **Nesting Forms**: Supports nested forms for complex data structures.

## Example Usage

```vue
<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>
const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>
    <UFormField label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormField>
    <UButton type="submit">Submit</UButton>
  </UForm>
</template>
```

## Props

- `state`: Reactive object holding the form's state.
- `schema`: Validation schema (supports Standard Schema, Yup, Joi, Superstruct).
- `validate`: Custom validation function.
- `validateOn`: List of input events that trigger validation.
- `disabled`: Boolean to disable all inputs.
- `attach`: Boolean to attach to parent form.
- `loadingAuto`: Boolean to disable form elements on submit.

## Slots

- `default`: Contains form errors and loading state.

## Emits

- `submit`: Form submission event.
- `error`: Error event with validation errors.

## Expose

- `submit()`: Triggers form submission.
- `validate()`: Triggers form validation.
- `clear()`: Clears form errors.
- `getErrors()`: Retrieves form errors.
- `setErrors()`: Sets form errors.
- `errors`: Reference to validation errors.
- `disabled`: Reference to disabled state.
- `dirty`: Boolean indicating if form has been modified.
- `dirtyFields`: Tracks modified fields.
- `touchedFields`: Tracks interacted fields.
- `blurredFields`: Tracks blurred fields.
