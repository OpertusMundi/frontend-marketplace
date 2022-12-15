<template>
  <div class="asset_card__wrapper">
    <router-link :to="{ name: 'PrivateOGCServiceSingle', params: { key: ogcService.key, ogcService } }" class="asset_card">
      <div class="asset_card__view" :style="{'--color': getColor()}"><span>VIEW</span></div>
        <div class="asset_card__inner" :style="{'--color': getColor()}">
        <div class="asset_card__top">
          <div class="asset_card__top__left">
            <card-icon :asset="ogcService"></card-icon>
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
            <span>{{ ogcService.statistics.sales }}</span><img src="@/assets/images/icons/card_counter/subscriptions.svg" alt="">
          </div>
        </div>
      </div>
    </router-link>
    <div class="asset_card__right_dropdown_container">
      <div @click="isRightDropdownOpen = !isRightDropdownOpen" class="asset_card__three_dots_btn">
        <svg data-name="Asset actions" xmlns="http://www.w3.org/2000/svg" width="3" height="17"><g data-name="Group 2622" fill="#333"><circle data-name="Ellipse 169" cx="1.5" cy="1.5" r="1.5"/><circle data-name="Ellipse 170" cx="1.5" cy="1.5" r="1.5" transform="translate(0 14)"/><circle data-name="Ellipse 171" cx="1.5" cy="1.5" r="1.5" transform="translate(0 7)"/></g></svg>
      </div>
      <transition name="fade" mode="out-in">
        <div v-if="isRightDropdownOpen" class="asset_card__right_dropdown">
          <ul>
            <li @click="deleteService">Delete</li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import CardIcon from '@/components/Catalogue/CardIcon.vue';
import moment from 'moment';
import { PrivateOGCService } from '@/model/private-ogc-services';
import { EnumAssetType } from '@/model/enum';
import { getAssetCardColor } from '@/helper/cards';

@Component({
  components: { CardIcon },
})
export default class PrivateOGCServiceCard extends Vue {
  @Prop({ required: true }) readonly ogcService!: PrivateOGCService;

  isRightDropdownOpen = false;

  getColor = (): string => getAssetCardColor(EnumAssetType.SERVICE);

  formatDate(date: string): string {
    return moment(date).format('DD MMM YYYY');
  }

  deleteService(): void {
    this.$emit('delete', this.ogcService.key);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
