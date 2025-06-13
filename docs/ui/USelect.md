# USelect Component

The USelect component is a versatile select element for choosing from a list of options. It supports various features including:

## Basic Usage

- Use `v-model` for two-way binding or `default-value` for initial value
- Accepts arrays of strings, numbers, booleans, or objects as items

## Key Props

- `items`: Array of options (strings, objects, or nested arrays)
- `value-key`: Customize the value property (default: 'value')
- `multiple`: Allow multiple selections
- `placeholder`: Set placeholder text
- `content`: Customize menu positioning
- `arrow`, `color`, `variant`, `size`, `icon`: Style and behavior customization
- `loading`, `disabled`: Control component state

## Advanced Features

- Supports icons, avatars, and chips in items
- Customizable open state and loading indicators
- Accessible via template ref for programmatic control

## Slots

- `leading`, `default`, `trailing`, `item`, `item-leading`, `item-label`, `item-trailing`
- `content-top`, `content-bottom` for custom content

## Events

- `blur`, `change`, `focus`, `update:modelValue`, `update:open`

## Theme Customization

- Customize globally in `app.config.ts` or `vite.config.ts`
- Modify colors, variants, sizes, and other styles

For detailed examples and API documentation, refer to the [official USelect documentation](https://ui.nuxt.com/components/select).
