<template>
  <div class="asset__vendor_info">
    <div class="s_container">
      <div class="asset__related__content">
        <div class="asset__related__content__right">
          <h6>About the vendor</h6>
          <div class="asset__vendor_info__card">
            <img :src="'data:' + catalogueItem.publisher.logoImageMimeType + ';base64, ' + catalogueItem.publisher.logoImage" alt="" height="80" width="80">
            <div class="asset__vendor_info__card__info">
              <div>
                <span class="asset__vendor_info__card__info__title">Vendor name</span>
              </div>
              <div class="asset__vendor_info__card__info__rating">
                <div v-if="catalogueItem.publisher.rating && catalogueItem.publisher.rating !== null" class="rating rating--dark">
                  <span v-for="i in 5" :key="i" :class="{'active': Math.round(catalogueItem.publisher.rating) >= i}">★</span>
                  <i>{{ catalogueItem.publisher.rating }}/5</i>
                </div>
              </div>
              <span class="asset__vendor_info__card__info__location">Athens, Greece</span>
              <span class="asset__vendor_info__card__info__join_date">Joined February 2020</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { CatalogueItem } from '@/model';

@Component
export default class VendorInformation extends Vue {
  @Prop({ required: true }) catalogueItem!: CatalogueItem;
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
