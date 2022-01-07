import { localized, msg } from "@lit/localize";
import { css, html, LitElement, unsafeCSS } from "lit";
import { customElement, queryAsync, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { LatLng, map as createMap, Map as LMap, tileLayer } from "leaflet";

import leafletStyles from "leaflet/dist/leaflet.css?inline";
import { fmtNumber } from "../util/number-format";

@localized()
@customElement("map-page")
export class MapPage extends LitElement {
  /**
   * A little cheat since the imported styles are not able to penetrate shadow dom.
   * Note that this stuff goes directly to the JS bundle.
   * See https://github.com/vitejs/vite/commit/e1de8a888ea9adb9dc415cf74aec43dfa83aa526
   */
  static styles = css`
    ${unsafeCSS(leafletStyles)}

    input {
      padding: 4px 8px;
      border-color: rgba(0, 0, 0, 0.2);
      border-width: 1px;
      border-radius: 3px;
    }

    button {
      background-color: var(--header-bg-color);
      color: var(--header-text-color);
      border: none;
      padding: 10px 6px;
      border-radius: 3px;
      cursor: pointer;
      transition: all 0.25s linear;
    }

    button:hover {
      filter: brightness(150%);
    }

    button:disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    #map {
      height: calc(100vh - var(--header-height));
      min-height: 600px;
      width: 100%;
    }

    .map-container {
      position: relative;
    }

    .map-overlay {
      z-index: 1024;
      background-color: var(--content-bg-color);
      color: var(--content-text-color);
      padding: 8px;
      border-radius: 3px;
      box-shadow: 2px 2px 6px #222222;
    }

    #current-center {
      position: absolute;
      top: 10px;
      right: 10px;
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.25rem 1rem;
    }

    #target-pos {
      position: absolute;
      left: 10px;
      bottom: 10px;
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.25rem 1rem;
    }

    .move-headline {
      grid-column-end: span 2;
    }

    .coordinate {
      justify-self: flex-end;
    }

    .grid-col-span-2 {
      grid-column-end: span 2;
    }
  `;

  #mapRef?: LMap;

  @state()
  currentCenter: LatLng = new LatLng(78.2226646285947, 15.65149504364928);

  // Used to track move target. This cannot be a `LatLng` model since that
  // one would be invalid for not yet set values.
  @state()
  targetCoordinates: { latitude?: number; longitude?: number } = {};

  @queryAsync("#map")
  mapElement!: Promise<HTMLElement>;

  render() {
    return html`
      <div class="map-container">
        <div id="map"></div>
        <div id="current-center" class="map-overlay">
          <div>${msg("Latitude")}:</div>
          <div class="coordinate">${fmtNumber(this.currentCenter.lat)}</div>
          <div>${msg("Longitude")}:</div>
          <div class="coordinate">${fmtNumber(this.currentCenter.lng)}</div>
        </div>
        <form id="target-pos" class="map-overlay" @submit="${this.moveCenter}">
          <div class="move-headline">${msg("Move to coordinates")}</div>
          <label for="latitude">${msg("Latitude")}:</label>
          <input
            type="number"
            step="0.00001"
            id="latitude"
            min="-90"
            max="90"
            @input="${this.latitudeChanged}"
          />
          <label for="longitude">${msg("Longitude")}:</label>
          <input
            type="number"
            step="0.00001"
            id="longitude"
            min="-180"
            max="180"
            @input="${this.longitudeChanged}"
          />
          <button
            class="grid-col-span-2"
            type="submit"
            disabled=${ifDefined(this.areCoordinatesValid() ? null : true)}
          >
            ${msg("Move")}
          </button>
        </form>
      </div>
    `;
  }

  private areCoordinatesValid(): boolean {
    return (
      this.isCoordinateValid(this.targetCoordinates.latitude) &&
      this.isCoordinateValid(this.targetCoordinates.longitude)
    );
  }

  private isCoordinateValid(source?: number): boolean {
    return source != null && !isNaN(source);
  }

  private latitudeChanged(event: Event): void {
    const latStr = (event.target as HTMLInputElement).value;
    this.targetCoordinates = {
      ...this.targetCoordinates,
      latitude: parseFloat(latStr),
    };
  }

  private longitudeChanged(event: Event): void {
    const lngStr = (event.target as HTMLInputElement).value;
    this.targetCoordinates = {
      ...this.targetCoordinates,
      longitude: parseFloat(lngStr),
    };
  }

  async connectedCallback(): Promise<void> {
    super.connectedCallback();
    const targetElem = await this.mapElement;
    if (targetElem) {
      // Geolocation by priority:
      // 1. Explicitly provided lat/lng query params
      // 2. Position requested from user
      // 3. Internal default
      const urlSearchParams = new URLSearchParams(location.search);
      const providedLat = urlSearchParams.get("lat");
      const providedLng = urlSearchParams.get("lng");
      if (providedLat && providedLng) {
        const latitude = parseFloat(providedLat);
        const longitude = parseFloat(providedLng);
        this.currentCenter = new LatLng(latitude, longitude);
        this.setupMap(targetElem);
      } else {
        navigator.geolocation.getCurrentPosition(
          (success) => {
            this.currentCenter = new LatLng(
              success.coords.latitude,
              success.coords.longitude
            );
            this.setupMap(targetElem);
          },
          (error) => {
            console.warn("Position request failed:", error);
            this.setupMap(targetElem);
          }
        );
      }
    }
  }

  private setupMap(targetElem: HTMLElement): void {
    this.#mapRef = createMap(targetElem).setView(this.currentCenter, 13);
    this.currentCenter = this.#mapRef.getCenter();
    this.#mapRef.addEventListener("move", () => {
      if (this.#mapRef) {
        this.currentCenter = this.#mapRef.getCenter();
      }
    });

    tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
    }).addTo(this.#mapRef);
  }

  private moveCenter(event: Event): void {
    event.preventDefault();
    const latitudeElem = this.shadowRoot?.getElementById(
      "latitude"
    ) as HTMLInputElement;
    const latitude = latitudeElem.value;
    const longitudeElem = this.shadowRoot?.getElementById(
      "longitude"
    ) as HTMLInputElement;
    const longitude = longitudeElem.value;
    this.#mapRef?.flyTo(
      new LatLng(parseFloat(latitude), parseFloat(longitude))
    );

    latitudeElem.value = "";
    longitudeElem.value = "";
    this.targetCoordinates = {};
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "map-page": MapPage;
  }
}
