# UKbd Component

The UKbd component is a Vue component used to display keyboard keys. It supports various props and styles.

## Usage

### Value
Set the key value using the default slot or the `value` prop:
```vue
<UKbd>K</UKbd>
<UKbd value="K" />
```

Special keys like `meta` are platform-specific:
```vue
<UKbd value="meta" /> <!-- Displays as ⌘ on macOS, Ctrl on other platforms -->
```

### Variant
Change the variant using the `variant` prop:
```vue
<UKbd variant="solid">K</UKbd>
```

### Size
Change the size using the `size` prop:
```vue
<UKbd size="lg">K</UKbd>
```

### Custom Class
Override base styles with the `class` prop:
```vue
<UKbd class="font-bold rounded-full" variant="subtle">K</UKbd>
```

## Props

- `as`: Element/component to render as (default: 'kbd')
- `value`: Key value (string)
- `variant`: Variant style ('outline', 'subtle', 'solid') (default: 'outline')
- `size`: Size ('sm', 'md', 'lg') (default: 'md')

## Slots

- `default`: Slot for key value