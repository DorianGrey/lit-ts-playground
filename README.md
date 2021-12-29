Just another of my (in-)famous playground projects :)

This time: [Lit](https://lit.dev) with TypeScript.

# The Good

# The Mixed-Bag

- Even in runtime mode, `@lit/localize` does not complain about a missing translation for a text fragment, not even via browser console. This only happens in the `lit-localize build` task. While this is totally fine with having progressive work in mind (translations might come in deferred) it may become problematic when testing without having feedback about the missing parts.

# The Bad

- For a still unknown reason, `@lit/localize` does not update the translations on the app's root element if that element is listed directly in the `index.html`. In my case, I had
  ```html
  <body>
    <app-drawer></app-drawer>
  </body>
  ```
  listed directly in the `index.html` file, which cause the translations in the `app-drawer` component to not be applied properly. However, after wrapping it into another element `app-main` which does nothing but rendering the `app-drawer` element, the translations on that element started to work fine. Not that devastating overall, but still unlikely to have an unneccessary shadow root level.

# The Ugly
