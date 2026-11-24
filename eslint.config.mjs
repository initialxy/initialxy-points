// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    name: 'project/vue-html-self-closing',
    rules: {
      // Prettier always self-closes void elements (e.g. <hr />), so align
      // the ESLint rule with the formatter instead of fighting it.
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always',
          },
        },
      ],
    },
  }
)
