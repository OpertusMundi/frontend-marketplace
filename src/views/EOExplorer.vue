<template>
  <div class="wrapper">
    <div class="eo_explorer_page">
      <div class="container-fluid p-0">
        <div class="row">
          <div class="col-md-4">
            <h4>Data source: Something</h4>

            <h4>Date Selection</h4>

            <h4>Spatial extent</h4>
            <!-- <p>{{ bbox[0][0] }}</p>
            <p>{{ bbox[0][1] }}</p>
            <p>{{ bbox[1][0] }}</p>
            <p>{{ bbox[1][1] }}</p> -->
            <input type="number" v-model="bbox.minLat">
            <input type="number" v-model="bbox.minLon">
            <input type="number" v-model="bbox.maxLat">
            <input type="number" v-model="bbox.maxLon">
          </div>
          <div class="col-md-8">
            <div id="eo-map"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import 'leaflet-shades';

interface ExtendedMapOptions extends L.MapOptions {
  editable: boolean,
}

interface RectangleEditable extends L.Rectangle {
  enableEdit: any,
  disableEdit: any,
}

@Component
export default class EOExplorer extends Vue {
  map: L.Map = {} as L.Map;

  bboxSelectionRect: L.Rectangle | null = null;

  // bbox = [[54.559322, -5.767822], [56.1210604, -3.021240]];

  bbox = {
    minLat: 54,
    minLon: -5,
    maxLat: 56,
    maxLon: -3,
  };

  mapShades: any | null = null;

  mounted(): void {
    this.map = L.map('eo-map', { editable: true } as ExtendedMapOptions);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.map.attributionControl.setPrefix('');

    this.drawRectangle();
  }

  get bboxString(): string {
    return `${this.bbox.minLon},${this.bbox.minLat},${this.bbox.maxLon},${this.bbox.maxLat}`;
  }

  @Watch('bboxString')
  onBBoxStringChange(): void {
    console.log('changed!');
    this.drawRectangle();
  }

  drawRectangle(): void {
    console.log('draw');
    if (this.bboxSelectionRect) {
      this.bboxSelectionRect.removeFrom(this.map);
      this.bboxSelectionRect = null;
    }

    const bounds = [[this.bbox.minLat, this.bbox.minLon], [this.bbox.maxLat, this.bbox.maxLon]];

    this.bboxSelectionRect = L.rectangle(bounds as L.LatLngBoundsExpression, { color: '#190AFF', fillColor: 'transparent' }).addTo(this.map);

    this.map.fitBounds(this.bboxSelectionRect.getBounds(), { padding: [1, 1] });

    (this.bboxSelectionRect as RectangleEditable).enableEdit();

    if (this.mapShades) {
      this.mapShades.onRemove(this.map);
      this.mapShades = null;
    }
    this.mapShades = new (L as any).LeafletShades({ bounds: this.bboxSelectionRect.getBounds() });
    this.mapShades.addTo(this.map);
    // this.map.invalidateSize();

    this.bboxSelectionRect!.on('editable:vertex:dragstart', () => {
      console.log('dragstart');
      this.mapShades.onRemove(this.map);
      this.mapShades = null;
    });

    this.bboxSelectionRect!.on('editable:vertex:dragend', () => {
      console.log('dragend');
      const boundsArr = this.bboxSelectionRect!.getBounds().toBBoxString().split(',');
      this.bbox = {
        minLat: parseFloat(boundsArr[1]),
        minLon: parseFloat(boundsArr[0]),
        maxLat: parseFloat(boundsArr[3]),
        maxLon: parseFloat(boundsArr[2]),
      };
    });

    // todo: catch move event
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_eo-explorer.scss";
  @import "~flexboxgrid/css/flexboxgrid.min.css";
  @import "~leaflet-shades/src/css/leaflet-shades.css";
</style>
