# Nuxt 3 Data Fetching Reference

## Core Concepts
- `useFetch`: SSR-safe reactive data fetching for component initialization
- `$fetch`: Client-side non-reactive HTTP requests (returns Promise)
- `useAsyncData`: Wrap non-SSR async functions (rarely needed with `$fetch`)

## 1. `useFetch` (Recommended for Initial Data)
```ts
<script setup lang="ts">
const { data, error, status } = await useFetch<ResponseBody>('/api/data')
</script>

<template>
  <div v-if="status === 'pending'">Loading...</div>
  <div v-else-if="error">{{ error.message }}</div>
  <div v-else>{{ data }}</div>
</template>
```
- Returns object with reactive refs:
  ```ts
  {
    data: Ref<T>,      // Reactive data (use directly in template)
    error: Ref<Error>, // Reactive error state (handle in template)
    status: Ref<'idle' | 'pending' | 'success' | 'error'>,
    refresh(): Promise<void>,  // Manual refresh
    execute(): Promise<void>   // Trigger fetch
  }
  ```
- **Important Notes:**
  - `await useFetch()` only ensures SSR support, not that data is fetched
  - Data is reactive, use it directly in template without accessing `.value`
  - Handle errors in template, not immediately after the call
  - Ideal for component initial state
  - Always specify response type as function generic (e.g., `useFetch<ResponseBody>`)

## 2. `$fetch` (Client-Side Actions)
```ts
<script setup lang="ts">
async function submitForm() {
  try {
    const response = await $fetch<ResponseType>('/api/submit', {
      method: 'POST',
      body: { data: 'example' }
    })
    // Handle response
  } catch (error) {
    // Handle error
  }
}
</script>
```
- Returns Promise that resolves to raw response data
- **Important Notes:**
  - No built-in error handling (requires try/catch)
  - Works only in client-side context
  - Non-reactive, direct HTTP calls
  - Use for user-triggered actions (form submissions, button clicks, etc.)
  - Always specify response type as function generic (e.g., `$fetch<ResponseType>`)

## 3. `useAsyncData` (Advanced Usage)
```ts
<script setup lang="ts">
const { data, refresh } = await useAsyncData('key', () => {
  return fetchData() // Custom async function
})
</script>
```
- Wrap non-SSR-safe async operations
- Returns object with similar reactive properties as `useFetch`
- **Important Notes:**
  - Rarely needed with `$fetch` (use `useFetch` instead)
  - Use only when you have a non-SSR async function that needs to be wrapped

## Key Differences
| Feature          | `useFetch`              | `$fetch`                | `useAsyncData`          |
|------------------|-------------------------|-------------------------|-------------------------|
| Returns          | Object with reactive props | Promise                 | Object with reactive props |
| SSR Support      | ✅                      | ❌                      | ❌                      |
| Reactive Data    | ✅                      | ❌                      | ✅                      |
| Error Handling   | Built-in (error ref)    | try/catch required      | Built-in (error ref)    |
| Usage           | Component initialization | User actions            | Custom async logic     |

## Correct Usage Patterns
### Parallel Requests
```ts
const { data } = await useAsyncData(() =>
  Promise.all([
    $fetch('/api/1'),
    $fetch('/api/2')
  ])
)
```

### Client-Side Only Fetch
```ts
const { data } = useFetch<ResponseBody>('/api/endpoint', { server: false })
```

### Manual Refresh
```ts
<template>
  <button @click="refresh">Reload</button>
</template>
```

## Common Anti-Patterns
❌ Wrong:
```ts
const data = await $fetch<ResponseType>('/api/data') // Non-reactive, no SSR support
const rewards = ref([])
rewards.value = data.value // Unnecessary ref creation
```

✅ Correct:
```ts
const { data, error, status } = await useFetch<ResponseType>('/api/data') // Reactive, SSR-safe
// Use data directly in template
```

## When to Use What
- Use `useFetch` for most data needs (reactive, SSR-safe)
- Use `$fetch` for user-triggered actions (non-reactive, client-only)
- Avoid `useAsyncData` unless you have a non-SSR async function