<template>
  <div class="asset__vendor_info">
    <div class="s_container">
      <div class="asset__related__content">
        <div class="asset__related__content__right">
          <h6>About the vendor</h6>
          <div class="asset__vendor_info__card">
            <img src="/assets/img/sentinel-hub/sh-logo.jpg" alt="" height="80" width="80">
            <div class="asset__vendor_info__card__info">
              <div>
                <span class="asset__vendor_info__card__info__title">Sentinel Hub</span>
              </div>
              <div class="asset__vendor_info__card__info__rating">
              </div>
              <span class="asset__vendor_info__card__info__location">Ljubljana, Slovenia</span>
            </div>
          </div>
        </div>
      </div>
      <div class="asset__related__content">
        <div class="asset__related__content__right">
          <h6>About the owner</h6>
          <div class="asset__vendor_info__card">
            <img src="/assets/img/copernicus/copernicus-logo.jpg" alt="" height="80" width="80">
            <div class="asset__vendor_info__card__info">
              <div>
                <span class="asset__vendor_info__card__info__title">Copernicus</span>
              </div>
              <div class="asset__vendor_info__card__info__rating">
              </div>
              <span class="asset__vendor_info__card__info__location">Europe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class VendorInformationSH extends Vue {
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
