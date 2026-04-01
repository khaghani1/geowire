declare module 'leaflet-ant-path' {
  import L from 'leaflet';

  interface AntPathOptions extends L.PolylineOptions {
    delay?: number;
    dashArray?: number[];
    weight?: number;
    color?: string;
    pulseColor?: string;
    paused?: boolean;
    reverse?: boolean;
    hardwareAccelerated?: boolean;
  }

  export class AntPath extends L.Polyline {
    constructor(path: L.LatLngExpression[], options?: AntPathOptions);
    pause(): void;
    resume(): void;
  }
}
