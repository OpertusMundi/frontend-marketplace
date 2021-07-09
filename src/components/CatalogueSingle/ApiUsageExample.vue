<template>
  <section class="asset__section asset__section__overview" v-if="catalogueItem.type === 'API'">
    <div class="asset__section__head">
      <h4>Usage example</h4>
      <a href="#" class="asset__section__head__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
    </div>
    <div class="asset__section__content">
      <div class="asset__section__content__inner bg-dark text-light">
        <div class="asset__section__overview__left">
          <h4>Sample Request</h4>
          <pre>
            <code>
              www.opertus-mundi.eu/api/123456789
            </code>
          </pre>
          <hr>
          <h4>Sample Response</h4>
          <pre>
            <code>
              <json-viewer :value="apiSampleResponse" theme="custom-json-viewer-theme"></json-viewer>
            </code>
          </pre>
        </div>
        <div class="asset__section__overview__right">

        </div>
      </div>
    </div>
    <a href="#" class="asset__section__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
  </section>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import JsonViewer from 'vue-json-viewer';
import { CatalogueItem } from '@/model';

@Component({
  components: {
    JsonViewer,
  },
})
export default class ApiUsageExample extends Vue {
  @Prop({ required: true }) catalogueItem!: CatalogueItem;

  // a dummy API response example
  apiSampleResponse: any = {
    status: 'ok',
    geometries: {
      foo: 'foo',
      bar: 'bar',
    },
    fooNumber: 123,
  }
  /* */
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
