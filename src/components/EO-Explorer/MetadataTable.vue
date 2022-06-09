<template>
  <div class="eo-metadata-table-container">
    <table>
      <tr>
        <th v-for="(item, i) in headerItems" :key="i">{{ item }}</th>
      </tr>
      <tr v-for="(row, i) in data" :key="i">
        <!-- <td v-for="(item, j) in Object.values(row)" :key="j">{{ item }}</td> -->
        <td v-for="(item, j) in headerItems" :key="j">{{ data[i][item] || '' }}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Vue,
} from 'vue-property-decorator';

@Component
export default class MetadataTable extends Vue {
  @Prop({ required: true }) data!: any[];

  get headerItems(): string[] {
    // return Object.keys(this.data[0]);
    return this.data.reduce((p, c) => ([...new Set(p.concat(Object.keys(c)))]), []);
  }
}
</script>

<style lang="scss">
  .eo-metadata-table-container {
    width: 100%;
    padding: 4px;
    overflow-x: auto;

    table {
      // border-spacing: 10px;
      border-radius: 7px;
      font-size: em(15);
      background: #fff;
      border-collapse: separate;

      td, th {
        padding: 7px;
        border: solid 1px $lightBgColor;
      }

      tr:hover:not(:nth-of-type(1)) {
        background: $lightBgColor;
      }
    }
  }
</style>
