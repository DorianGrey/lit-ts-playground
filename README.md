Just another of my (in-)famous playground projects :)

This time: [Lit](https://lit.dev) with TypeScript.

# Tasks

| Task         | description                                     |
| ------------ | ----------------------------------------------- |
| dev          | Start the dev enviroment                        |
| build        | Create a production build                       |
| format       | Format all code using `prettier`                |
| lint         | Lint all code using `eslint`                    |
| serve        | Serve a production build as a preview           |
| i18n:extract | Extract messages to be translated from the code |
| i18n:build   | Build translated `XLF` files back to code       |

# About the branch

This branch uses [esroute](https://github.com/svi3c/esroute) instead of [@vaadin/router](https://vaadin.github.io/router), which is more lightweight, but with a few less features and less battle-testing. Whether the feature difference is a concern naturally depends on the particular use-case - the most relevant and commonly required features are there. Let's see where this one heads to :)

Regarding "lightweight", here are the numbers of a production build:

| File                                 | Size                         |
| ------------------------------------ | ---------------------------- |
| assets/favicon.17e50649.svg          | 1.49 KiB                     |
| index.html                           | 0.53 KiB                     |
| assets/index.222ae776.js             | 9.59 KiB / gzip: 3.44 KiB    |
| assets/de.84995442.js                | 0.50 KiB / gzip: 0.38 KiB    |
| assets/ResizeObserver.es.86b88537.js | 9.46 KiB / gzip: 3.28 KiB    |
| assets/event-target-shim.243ee299.js | 6.00 KiB / gzip: 1.99 KiB    |
| assets/vendor.8a495999.js            | 27.90 KiB / gzip: 9.66 KiB   |
| assets/index.fe7a0692.css            | 2.58 KiB / gzip: 0.54 KiB    |
| assets/large-list.90fed5b5.js        | 29.21 KiB / gzip: 8.45 KiB   |
| assets/map.03e26aad.js               | 160.79 KiB / gzip: 49.26 KiB |

# Impressions

The list below contains my impressions based on what I've tried so far, and will be updated during the progress.

## The Good

- From what I've seen until now, `lit` is very performant and only triggers rerenders when essentially neccessary.
- `lit` itself is very small w.r.t. the resulting bundle size. When building the project, the impression might be slightly different (with more than 60 KB gzipped), but most of this is caused by the other libraries involved.

## The Mixed-Bag

- Even in runtime mode, `@lit/localize` does not complain about a missing translation for a text fragment, not even via browser console. This only happens in the `lit-localize build` task. While this is totally fine with having progressive work in mind (translations might come in deferred) it may become problematic when testing without having feedback about the missing parts.
- I'm still having mixed feelings about writing template and style code as string literals. Different from particular files, specific tooling is required even for simple things like syntax highlighting. Besides, both can become quite complex even for "small" components (imagine a very grim look at _business requirements_ here) which makes them even harder to read. On the other hand, this approach leads to a very simple diffing mechanism and allows to have a better overview about all ties between layout and logic without additional tooling like it is required for JSX/TSX.
- While especially style-encapsulation via shadow DOM is very useful feature for preventing collisions, it makes applying base style normalizations like [modern-normalize](https://github.com/sindresorhus/modern-normalize) or [sanitize.css](https://github.com/csstools/sanitize.css) a more complex task, since they have to be added to all relevant components.

## The Bad

## The Ugly

## The Curious

- For a still unknown reason, `@lit/localize` does not update the translations on the app's root element if that element is listed directly in the `index.html`. In my case, I had

  ```html
  <body>
    <app-drawer></app-drawer>
  </body>
  ```

  listed directly in the `index.html` file, which cause the translations in the `app-drawer` component to not be applied properly. However, after wrapping it into another element `app-main` which does nothing but rendering the `app-drawer` element, the translations on that element started to work fine. Not that devastating overall, but still unlikely to have an unneccessary shadow root level. It is not yet clear if this issue is caused by `lit` or `vite`. To avoid this, it was required to render the `app-drawer` element manually using `lit`'s `render` function.

- On the `/experiments/large-list` screen, an experiment involving the virtual scrolling list from the `@lit-labs/virtualizer` package was added. To put a bit of stress on this, the code generates 1000000 entries, but when scrolling to the bottom of the screen, the last visible entry is 621378. I.e. it seems that 378622 entries are not rendered. While 1000000 entries are not that usual, this is still somewhat odd.
