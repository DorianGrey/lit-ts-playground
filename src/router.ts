import { Router } from "@vaadin/router";

const outlet = document.getElementById("outlet");
const router = new Router(outlet);
router.setRoutes([
  { path: "/", redirect: "/counter" },
  /* 
    Use the app drawer as a navigation holder and render the actual contents into its <slot>.
    Heading this way is easier than trying to provide the router outlet via this custom
    element - it is usually not rendered when the router becomes set up, thus it would be
    required to init the router lazily ... which makes things way more complicated overall.
   */
  {
    path: "/",
    component: "app-drawer",
    children: [
      { path: "/counter", component: "x-counter" },
      { path: "(.*)", component: "not-found" },
    ],
  },
]);

export { router };
