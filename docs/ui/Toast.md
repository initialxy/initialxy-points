# Toast Component

The Toast component in Nuxt UI is used to display succinct messages to provide information or feedback to users. It's implemented using the `useToast` composable.

## Usage

1. Wrap your app with the `App` component which uses the `Toaster` component.
2. Use the `useToast` composable to display toasts.

## Configuration Options

- **Title**: Pass a `title` field to the `toast.add` method.
- **Description**: Pass a `description` field to the `toast.add` method.
- **Icon**: Pass an `icon` field to display an icon.
- **Avatar**: Pass an `avatar` field to display an avatar.
- **Color**: Pass a `color` field to change the toast color.
- **Close Button**: Customize or hide the close button with the `close` field.
- **Close Icon**: Customize the close button icon with the `closeIcon` field.
- **Actions**: Add button actions with the `actions` field.
- **Orientation**: Change the orientation with the `orientation` prop.

## Global Configuration

- **Position**: Change the `toaster.position` prop on the `App` component.
- **Duration**: Change the `toaster.duration` prop on the `App` component.
- **Expand**: Set the `toaster.expand` prop to control stacked toasts.

## API

### Props

- `as`: Element or component to render as
- `title`: Title of the toast
- `description`: Description of the toast
- `icon`: Icon to display
- `avatar`: Avatar properties
- `color`: Color of the toast
- `orientation`: Orientation between content and actions
- `progress`: Show progress bar
- `actions`: List of button actions
- `close`: Display close button
- `closeIcon`: Icon in the close button
- `duration`: Time in milliseconds the toast remains visible

### Slots

- `leading`
- `title`
- `description`
- `actions`
- `close`

### Emits

- `pause`
- `escapeKeyDown`
- `resume`
- `swipeStart`
- `swipeMove`
- `swipeCancel`
- `swipeEnd`
- `update:open`
