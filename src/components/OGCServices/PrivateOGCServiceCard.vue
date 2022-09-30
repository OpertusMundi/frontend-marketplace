<template>
  <!-- <router-link :to="`/private-ogc-service/${ogcService.key}`" class="asset_card"> -->
  <router-link to="#" class="asset_card">
    <div class="asset_card__view" :style="{'--color': cardColor}"><span>VIEW</span></div>
      <div class="asset_card__inner" :style="{'--color': cardColor}">
      <div class="asset_card__top">
        <div class="asset_card__top__left">
          <img src="@/assets/images/icons/types/wms.svg" alt="" v-if="ogcService.serviceType === 'WMS'">
          <img src="@/assets/images/icons/types/wfs.svg" alt="" v-if="ogcService.serviceType === 'WFS'">
          <img src="@/assets/images/icons/types/data_api.svg" alt="" v-if="ogcService.serviceType === 'DATA_API'">
          <span class="asset_card__type">{{ ogcService.serviceType }}</span>
        </div>
        <div class="asset_card__top__right"><span>{{ ogcService.owner.username }}</span></div>
      </div>
      <div class="asset_card__center">
        <div class="asset_card__title">{{ ogcService.title }}</div>
          <div class="asset_card__price" v-if="ogcService.pricingModel">
            <small>FROM </small> {{ ogcService.pricingModel.price }}<span>€ </span><small>per call</small>
          </div>
      </div>
      <div class="asset_card__bottom">
        <div class="asset_card__bottom__left">
          <div v-if="ogcService.statistics && ogcService.statistics.rating !== null" class="rating rating--dark">
            <span v-for="i in 5" :key="i" :class="{'active': Math.round(ogcService.statistics.rating) >= i}">★</span>
            <i>{{ ogcService.statistics.rating }}/5</i>
          </div>
          <div class="asset_card__bottom__left__info">
            <span><strong>Version: </strong>{{ ogcService.version }}</span><span v-if="ogcService.updatedOn"><strong>Last updated: </strong>{{ formatDate(ogcService.updatedOn) }}</span>
          </div>
        </div>
        <div class="asset_card__bottom__right" v-if="ogcService.statistics">
          <span>{{ ogcService.statistics.sales }}</span><img src="@/assets/images/icons/bag-icon.svg" alt="">
        </div>
      </div>
    </div>
  </router-link>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import moment from 'moment';
import { PrivateOGCService } from '@/model/private-ogc-services';

@Component
export default class PrivateOGCServiceCard extends Vue {
  @Prop({ required: true }) readonly ogcService!: PrivateOGCService;

  cardColor = '#6F43B5';

  formatDate(date: string): string {
    return moment(date).format('DD MMM YYYY');
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
