declare module 'globe.gl' {
  import type { Object3D, Scene, WebGLRenderer, Camera } from 'three';

  interface GlobeInstance {
    (element: HTMLElement): GlobeInstance;

    // Globe appearance
    globeImageUrl(url: string): GlobeInstance;
    bumpImageUrl(url: string): GlobeInstance;
    backgroundImageUrl(url: string): GlobeInstance;
    backgroundColor(color: string): GlobeInstance;
    showAtmosphere(show: boolean): GlobeInstance;
    atmosphereColor(color: string): GlobeInstance;
    atmosphereAltitude(alt: number): GlobeInstance;

    // Dimensions
    width(w: number): GlobeInstance;
    height(h: number): GlobeInstance;

    // Camera / controls
    pointOfView(pov: { lat?: number; lng?: number; altitude?: number }, transitionMs?: number): GlobeInstance;
    controls(): { autoRotate: boolean; autoRotateSpeed: number; enableZoom: boolean };

    // Arcs
    arcsData(data: object[]): GlobeInstance;
    arcStartLat(fn: string | ((d: any) => number)): GlobeInstance;
    arcStartLng(fn: string | ((d: any) => number)): GlobeInstance;
    arcEndLat(fn: string | ((d: any) => number)): GlobeInstance;
    arcEndLng(fn: string | ((d: any) => number)): GlobeInstance;
    arcColor(fn: string | ((d: any) => string | string[])): GlobeInstance;
    arcDashLength(fn: string | number | ((d: any) => number)): GlobeInstance;
    arcDashGap(fn: string | number | ((d: any) => number)): GlobeInstance;
    arcDashAnimateTime(fn: string | number | ((d: any) => number)): GlobeInstance;
    arcStroke(fn: string | number | ((d: any) => number | null)): GlobeInstance;
    arcAltitude(fn: string | number | ((d: any) => number)): GlobeInstance;
    arcAltitudeAutoScale(fn: string | number | ((d: any) => number)): GlobeInstance;

    // Labels
    labelsData(data: object[]): GlobeInstance;
    labelLat(fn: string | ((d: any) => number)): GlobeInstance;
    labelLng(fn: string | ((d: any) => number)): GlobeInstance;
    labelText(fn: string | ((d: any) => string)): GlobeInstance;
    labelSize(fn: string | number | ((d: any) => number)): GlobeInstance;
    labelColor(fn: string | ((d: any) => string)): GlobeInstance;
    labelDotRadius(fn: string | number | ((d: any) => number)): GlobeInstance;
    labelResolution(res: number): GlobeInstance;
    labelAltitude(fn: string | number | ((d: any) => number)): GlobeInstance;

    // Points
    pointsData(data: object[]): GlobeInstance;
    pointLat(fn: string | ((d: any) => number)): GlobeInstance;
    pointLng(fn: string | ((d: any) => number)): GlobeInstance;
    pointColor(fn: string | ((d: any) => string)): GlobeInstance;
    pointRadius(fn: string | number | ((d: any) => number)): GlobeInstance;
    pointAltitude(fn: string | number | ((d: any) => number)): GlobeInstance;

    // Scene access
    scene(): Scene;
    camera(): Camera;
    renderer(): WebGLRenderer;

    // Lifecycle
    pauseAnimation(): GlobeInstance;
    resumeAnimation(): GlobeInstance;
    _destructor(): void;
  }

  const Globe: () => GlobeInstance;
  export default Globe;
}
