<template>
  <section class="asset__section asset__section__overview">
    <div class="asset__section__head">
      <h4>Overview</h4>
      <a href="#" class="asset__section__head__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
    </div>
    <div class="asset__section__content">
      <div class="asset__section__content__inner">
        <div class="asset__section__overview__left">
          <h5>Description</h5>
          <p>{{ catalogueItem.abstract }}</p>
          <h5 v-if="catalogueItem.suitableFor">Suitable for:</h5>
          <ul>
            <li v-for="suitableFor in catalogueItem.suitableFor" v-bind:key="`${suitableFor}_suitable`">{{ suitableFor }}</li>
          </ul>
          <h5 v-if="catalogueItem.additionalResources">Additional resources:</h5>
          <a v-for="(additionalResources, index) in catalogueItem.additionalResources" v-bind:key="`${index}_aditional_r`" :href="additionalResources.uri" target="_blank" style="display:block">{{ additionalResources.text }}</a>
        </div>
        <div class="asset__section__overview__right">
          <h5>Asset Info</h5>
          <p><strong>Language:</strong> {{ catalogueItem.language }} <br>
          <strong>Temporal extent:</strong> <span v-if="catalogueItem.dateStart && catalogueItem.dateEnd">{{ formatDate(catalogueItem.dateStart) }} - {{ formatDate(catalogueItem.dateEnd) }}</span>
          <h5>Tags</h5>
          <p>
            <span v-for="(keyword, i) in catalogueItem.keywords" :key="keyword.keyword">{{ keyword.keyword }}<span v-if="i !== catalogueItem.keywords.length - 1">, </span></span>
          </p>
          <!-- <div v-if="catalogueItemType == 'api'">
            <p>
              <span v-for="(tag, index) in catalogueItemDummyMetadata.distinct.feat_desc" :key="index">
                {{tag}}<span v-if="index < catalogueItemDummyMetadata.distinct.feat_desc.length - 1">,</span>
              </span>
            </p>
          </div>
          <div v-else></div> -->
        </div>
      </div>
    </div>
    <a href="#" class="asset__section__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
  </section>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { CatalogueItem } from '@/model';
import moment from 'moment';

@Component
export default class Overview extends Vue {
  @Prop({ required: true }) catalogueItem!: CatalogueItem;

  formatDate(date: string): string {
    return moment(date).format('DD MMM. YYYY');
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
