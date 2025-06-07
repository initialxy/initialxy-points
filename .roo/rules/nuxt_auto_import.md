**Nuxt 3 Auto-Import Feature Overview**  
Nuxt 3 simplifies development by automatically importing common Vue and Nuxt utilities, components, and custom code without explicit `import` statements. This reduces boilerplate and enhances productivity.

---

### **Key Auto-Import Scenarios**
1. **Vue Reactivity & Lifecycle**  
   - `ref`, `computed`, `watch`, and other Vue APIs are auto-imported in `<script setup>` and components.  
   - Example:  
     ```ts
     const count = ref(1) // No need to import `ref`
     ```

2. **Built-In Nuxt Composables**  
   - Functions like `useFetch`, `useRouter`, `useRuntimeConfig`, and `useNuxtApp` are available globally.  
   - Example:  
     ```ts
     const { data } = await useFetch('/api/endpoint') // `useFetch` is auto-imported
     ```

3. **Custom Code from Specific Directories**  
   Nuxt auto-imports files in these folders:  
   - `components/` (Vue components)  
   - `composables/` (custom composables)  
   - `utils/` (helper functions)  
   - Example: A `useMyComposable()` in `composables/` is accessible without manual imports.

---

### **Best Practices**
- **Avoid Manual Imports for Framework Code**: Use `#imports` alias for explicit control if needed:  
  ```ts
  import { ref, computed } from '#imports'
  ```
- **Component Auto-Import**: Disable via `components.dirs: []` in `nuxt.config.ts` if custom component imports are preferred.
- **Layered Projects**: Be cautious with `scan: false` as it may break layer override features.

---

### **Why It Matters**  
Nuxt 3’s auto-imports streamline development by eliminating repetitive imports, while maintaining type safety and performance. Most files (components, composables, utilities) don’t require explicit imports, making the code cleaner and faster to write.