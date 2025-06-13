# UCheckboxGroup

The UCheckboxGroup component is a set of checklist buttons that allows users to select multiple options from a list. It's part of the Nuxt UI component library.

## Usage

Use the `v-model` directive to control the value of the CheckboxGroup or the `default-value` prop to set the initial value when you don't need to control its state.

### Items

You can use the `items` prop as an array of strings, numbers, or objects with properties like `label`, `description`, `value`, `disabled`, `class`, and `ui`.

### Value Key

Change the property used to set the value with the `value-key` prop. Defaults to `value`.

### Legend

Set the legend of the CheckboxGroup using the `legend` prop.

### Color

Change the color of the CheckboxGroup with the `color` prop.

### Variant

Change the variant of the CheckboxGroup with the `variant` prop.

### Size

Change the size of the CheckboxGroup with the `size` prop.

### Orientation

Change the orientation of the CheckboxGroup with the `orientation` prop. Defaults to `vertical`.

### Indicator

Change the position or hide the indicator with the `indicator` prop. Defaults to `start`.

### Disabled

Disable the CheckboxGroup with the `disabled` prop.

## Props

- `as`: The element or component this component should render as.
- `legend`: The legend of the CheckboxGroup.
- `valueKey`: When `items` is an array of objects, select the field to use as the value.
- `labelKey`: When `items` is an array of objects, select the field to use as the label.
- `descriptionKey`: When `items` is an array of objects, select the field to use as the description.
- `items`: Array of CheckboxGroupItem objects.
- `size`: Size of the CheckboxGroup.
- `variant`: Variant of the CheckboxGroup.
- `orientation`: Orientation of the CheckboxGroup.
- `defaultValue`: Initial value of the CheckboxGroup.
- `disabled`: Disable the CheckboxGroup.
- `loop`: Whether keyboard navigation should loop around.
- `modelValue`: Controlled value of the CheckboxGroup.
- `name`: Name of the field.
- `required`: Indicates if the user must set the value before form submission.
- `color`: Color of the CheckboxGroup.
- `indicator`: Position of the indicator.
- `icon`: Icon displayed when checked.
- `ui`: Custom UI properties.

## Slots

- `legend`: Legend slot.
- `label`: Label slot.
- `description`: Description slot.

## Emits

- `change`: Emitted on change.
- `update:modelValue`: Emitted when modelValue changes.
