Just another of my (in-)famous playground projects :)

This time: [Lit](https://lit.dev) with TypeScript.

# Tasks

| Task         | description                                     |
| ------------ | ----------------------------------------------- |
| dev          | Start the dev enviroment                        |
| build        | Create a production build                       |
| format       | Format all code using `prettier`                |
| lint         | Lint all code using `eslint`                    |
| preview      | Serve a production build as a preview           |
| i18n:extract | Extract messages to be translated from the code |
| i18n:build   | Build translated `XLF` files back to code       |

# About the branches

The currently exisiting branches use different routers mostly for comparison and testing purposes.

- The [main](https://github.com/DorianGrey/lit-ts-playground) branch uses [@vaadin/router](https://vaadin.github.io/router).
- The [experiment/esroute](https://github.com/DorianGrey/lit-ts-playground/tree/experiment/esroute) branch uses [esroute](https://github.com/svi3c/esroute).

Those primarily differ in size, feature richness, performance and battle testing status. Just try out both and check for yourself :)

Note that the currently used features of the routers do not cover all they provide, but I will add more experiments to improve that.

Some numbers regarding the impact on the production build file sizes:

| File                               | Size `@vaadin/router`        | Size `esroute`               | Difference (gzip) |
| ---------------------------------- | ---------------------------- | ---------------------------- | ----------------- |
| assets/favicon.{hash}.svg          | 1.49 KiB                     | 1.49 KiB                     | ./.               |
| index.html                         | 0.53 KiB                     | 0.53 KiB                     | ./.               |
| assets/index.{hash}.js             | 9.08 KiB / gzip: 3.20 KiB    | 9.59 KiB / gzip: 3.44 KiB    | +0.24 KiB         |
| assets/de.{hash}.js                | 0.50 KiB / gzip: 0.38 KiB    | 0.50 KiB / gzip: 0.38 KiB    | ./.               |
| assets/ResizeObserver.es.{hash}.js | 9.46 KiB / gzip: 3.28 KiB    | 9.46 KiB / gzip: 3.28 KiB    | ./.               |
| assets/event-target-shim.{hash}.js | 6.00 KiB / gzip: 1.99 KiB    | 6.00 KiB / gzip: 1.99 KiB    | ./.               |
| assets/index.{hash}.css            | 2.58 KiB / gzip: 0.54 KiB    | 2.58 KiB / gzip: 0.54 KiB    | ./.               |
| assets/large-list.{hash}.js        | 31.65 KiB / gzip: 9.29 KiB   | 29.21 KiB / gzip: 8.45 KiB   | -0.85 KiB         |
| assets/vendor.{hash}.js            | 44.41 KiB / gzip: 15.47 KiB  | 27.90 KiB / gzip: 9.66 KiB   | -5.81 KiB         |
| assets/map.{hash}.js               | 160.79 KiB / gzip: 49.26 KiB | 160.79 KiB / gzip: 49.26 KiB | ./.               |

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

  listed directly in the `index.html` file, which cause the translations in the `app-drawer` component to not be applied properly. However, after wrapping it into another element `app-main` which does nothing but rendering the `app-drawer` element, the translations on that element started to work fine. Not that devastating overall, but still unlikely to have an unneccessary shadow root level. It is not yet clear if this issue is caused by `lit` or `vite`, however it's no longer an issue since the introduction of routing.

- On the `/experiments/large-list` screen, an experiment involving the virtual scrolling list from the `@lit-labs/virtualizer` package was added. To put a bit of stress on this, the code generates 1000000 entries, but when scrolling to the bottom of the screen, the last visible entry is 621378. I.e. it seems that 378622 entries are not rendered. While 1000000 entries are not that usual, this is still somewhat odd.
