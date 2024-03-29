<template>
  <section class="asset__section asset__section__overview discovery-section">
    <div class="asset__section__head">
      <h4>Topio Discovery</h4>
      <a href="#" class="asset__section__head__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
    </div>
    <div class="asset__section__content">
      <div class="asset__section__content__inner asset__section__content__inner--no_min_height d-flex justify-content-center">
        <div class="w-100">
          <p class="mt-xs-10">Topio Discovery allows you to find connections between this and other published assets</p>
          <hr>

          <div class="w-100 d-flex justify-content-center">
            <button
              v-if="discoveryAssets === null"
              :disabled="isDiscoveryLoading"
              @click="showDiscovery"
              class="btn btn--std btn--blue mt-xs-20 mb-xs-20"
            >
              {{ `${isDiscoveryLoading ? 'loading...' : 'show discovery'}` }}
            </button>

            <p v-if="discoveryAssets && discoveryAssets.length === 0" class="mt-xs-20"><strong>No assets</strong></p>

            <template v-if="discoveryAssets && discoveryAssets.length">
              <div class="discovery__container">
                <div class="discovery__left">
                  <div>
                    <div class="discovery__child discovery__card__outter">
                      <div class="discovery__child discovery__card">

                        <div class="discovery__card__top">
                          <span>{{ formatFirstLetterUpperCase(asset.type) }}</span>

                        </div>
                        <div class="discovery__card__middle">
                          {{ asset.title }}
                        </div>
                        <div class="discovery__card__bottom">
                          <div>
                            <div v-if="asset.statistics && asset.statistics.rating !== null" class="rating rating--dark">
                              <span v-for="i in 5" :key="i" :class="{'active': Math.round(asset.statistics.rating) >= i}">★</span>
                              <i>{{ asset.statistics.rating }}/5</i>
                            </div>
                          </div>

                          <div class="discovery__card__price" v-if="price(asset).value">
                            <small v-if="price(asset).prefix">{{ price(asset).prefix + ' ' }}</small>
                            {{ price(asset).value }}<span v-if="!['FREE', 'OPEN'].includes(price(asset).value)">€ </span>
                            <small v-if="price(asset).suffix">{{ price(asset).suffix}}</small>
                          </div>
                        </div>

                      </div>
                    </div>

                    <div class="discovery__card discovery__card--no-border" v-if="selectedAssetId">

                      <div class="discovery__card__upper-btns">
                        <span class="arrow-left" v-if="currentExplanationTab > 0" @click="currentExplanationTab --">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10.207" height="14.788" viewBox="0 0 10.207 14.788">
                            <path id="Path_2295" data-name="Path 2295" d="M473.524-7260.858l6.637,8,6.61-8" transform="translate(-7251.291 -472.755) rotate(90)" fill="none" stroke="#190AFF" stroke-width="2"/>
                          </svg>
                        </span>
                        <span v-else></span>

                        <span class="arrow-right" v-if="currentExplanationTab < explanationsOfSelectedAsset.length - 1" @click="currentExplanationTab ++">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10.207" height="14.788" viewBox="0 0 10.207 14.788">
                            <path id="Path_9659" data-name="Path 9659" d="M0,8,6.637,0l6.61,8" transform="translate(8.638 0.77) rotate(90)" fill="none" stroke="#190AFF" stroke-width="2"/>
                          </svg>
                        </span>
                        <span v-else></span>
                      </div>

                      <div class="discovery__card__explanation">
                        <strong>Source column</strong>
                        <span>{{ explanationsOfSelectedAsset[currentExplanationTab].fromColumn }}</span>

                        <strong>Target column</strong>
                        <span>{{ explanationsOfSelectedAsset[currentExplanationTab].toColumn }}</span>

                        <div>
                          <strong class="explanation-large">Score</strong>
                          <span>{{ Math.round(1000 * explanationsOfSelectedAsset[currentExplanationTab].score) / 1000  }}</span>
                        </div>
                      </div>

                      <div class="discovery__card__bottom-btns">
                        <button class="btn btn--std btn--outlineblue" @click="navigateToAsset(selectedAssetId)">view asset</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  class="discovery__divider"
                  :style="{'margin-top': `calc(${dividerMarginTop}px + 11px)`, 'margin-bottom': `calc(${dividerMarginBottom}px + 11px - 3px)`}"
                ></div>
                <div class="discovery__right">
                  <div class="discovery__child discovery__card__outter" v-for="asset in discoveryAssets" :key="asset.id">
                    <div
                      class="discovery__child discovery__card"
                      :class="{'discovery__card--selected': selectedAssetId === asset.id}"
                      @click="selectAsset(asset.id)"
                    >
                      <div class="discovery__card__top">
                        <span>{{ formatFirstLetterUpperCase(asset.type) }}</span>
                      </div>
                      <div class="discovery__card__middle discovery__card__middle--overflow-ellipsis">
                        {{ asset.title }}
                      </div>
                      <div class="discovery__card__bottom">
                        <div>
                          <div v-if="asset.statistics && asset.statistics.rating !== null" class="rating rating--dark">
                            <span v-for="i in 5" :key="i" :class="{'active': Math.round(asset.statistics.rating) >= i}">★</span>
                            <i>{{ asset.statistics.rating }}/5</i>
                          </div>
                        </div>
                        <div class="discovery__card__price" v-if="price(asset).value">
                          <small v-if="price(asset).prefix">{{ price(asset).prefix + ' ' }}</small>
                          {{ price(asset).value }}<span v-if="!['FREE', 'OPEN'].includes(price(asset).value)">€ </span>
                          <small v-if="price(asset).suffix">{{ price(asset).suffix}}</small>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import DiscoveryApi from '@/service/discovery';
import CatalogueApi from '@/service/catalogue';
import { DiscoveryCatalogueItem, CatalogueItem } from '@/model/catalogue';
import { DiscoveryResult } from '@/model/discovery';
// import { EnumAssetType } from '@/model/enum';
// import { EnumPricingModel } from '@/model/pricing-model';
import getPriceOrMinimumPrice from '@/helper/cards';

@Component
export default class SatelliteImagesExplorer extends Vue {
  @Prop({ required: true }) asset!: CatalogueItem;

  discoveryApi = new DiscoveryApi();

  catalogueApi = new CatalogueApi();

  isDiscoveryLoading = false;

  discoveryResult: DiscoveryResult | null = null;

  discoveryAssets: DiscoveryCatalogueItem[] | null = null;

  selectedAssetId = '';

  explanationsOfSelectedAsset: {
    fromColumn: string,
    toColumn: string,
    score: number,
    text: string,
  }[] = [];

  currentExplanationTab = 0;

  dividerMarginTop = 0;

  dividerMarginBottom = 0;

  price(asset: DiscoveryCatalogueItem | CatalogueItem): { prefix: string, value: string, suffix: string } {
    return getPriceOrMinimumPrice(asset as any);
  }

  formatFirstLetterUpperCase(word: string): string {
    return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);
  }

  showDiscovery(): void {
    try {
      this.isDiscoveryLoading = true;

      this.discoveryApi.find(this.asset.id).then((response) => {
        this.discoveryResult = response.result;

        if (!response.result) {
          this.discoveryAssets = [];
          return;
        }

        const assets = response.result.joinableTables
          .map((x) => x.tablePath.split('/')[0]);

        // let assets: string[] = [];
        // response.result.joinableTables.forEach((joinableTable) => {
        //   joinableTable.matches.forEach((match) => {
        //     const { from } = match.keys;
        //     const fromName = from.split('/')[0];

        //     const { to } = match.keys;
        //     const toName = to.split('/')[0];

        //     if (!assets.includes(fromName)) assets.push(fromName);
        //     if (!assets.includes(toName)) assets.push(toName);
        //   });
        // });

        // assets = assets.filter((x) => x !== this.asset.id);

        const findAssetPromises = assets.map((x) => this.catalogueApi.findOneDiscoveryAsset(x));

        Promise.all(findAssetPromises).then((responses) => {
          this.discoveryAssets = responses
            .filter((x) => x.success)
            .map((x) => x.result);

          this.computeDividerMargins();
          this.isDiscoveryLoading = false;
        });
      });
    } catch (err) {
      this.discoveryAssets = [];
      this.isDiscoveryLoading = false;
    }
  }

  selectAsset(assetId: string): void {
    this.currentExplanationTab = 0;
    this.selectedAssetId = assetId;

    if (!this.discoveryResult) return;
    // eslint-disable-next-line
    this.explanationsOfSelectedAsset = this.discoveryResult.joinableTables
      .find((x) => x.tablePath.startsWith(this.selectedAssetId))!
      .matches
      .map((x) => ({
        fromColumn: x.keys.from,
        toColumn: x.keys.to,
        score: x.related.coma,
        text: x.explanation,
      }));
  }

  navigateToAsset(assetId: string): void {
    this.$router.push(`/catalogue/${assetId}`);
  }

  computeDividerMargins(): void {
    this.$nextTick(() => {
      const rightCards = Array.from(document.querySelectorAll('.discovery__right .discovery__card')) as HTMLElement[];

      const leftCard = document.querySelector('.discovery__left .discovery__card') as HTMLElement;

      this.dividerMarginTop = leftCard.clientHeight < rightCards[0].clientHeight ? leftCard.clientHeight / 2 : rightCards[0].clientHeight / 2;
      this.dividerMarginBottom = rightCards[rightCards.length - 1].clientHeight / 2;
    });
  }
}
</script>

<style lang="scss">
  @import "@/assets/styles/_btns.scss";
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";

  .discovery-section {
    overflow: initial !important;

    .w-100 {
      width: 100%;
    }

    .discovery {
      &__left {
        min-width: 0;
        flex-grow: 1;
        position: relative;
        padding-bottom: 10px;
        max-width: 30%;

        .discovery__card {
          margin: 10px 15px 10px 0;
        }

        > div {
          position: sticky;
          // top: 10px;
          top: 100px;
        }
      }

      &__divider {
        align-self: stretch;
        width: 3px;
        background: $darkColor;
      }

      &__right {
        min-width: 0;
        flex-grow: 1;

        .discovery__card {
          margin: 10px 0 10px 15px;
          cursor: pointer;
        }
      }

      &__container {
        width: 100%;
        display: flex;
      }

      &__card {
        font-size: em(16);
        border: solid 1px $darkColor;
        background: #fff;
        padding: 10px;
        // height: 4em;
        width: calc(100% - 15px);
        border-radius: 7px;
        z-index: 1;
        position: relative;

        &--selected {
          border: solid 1px $secondColor;
        }

        &--no-border {
          border: none;
        }

        &__outter {
          position: relative;
          width: 100%;

          &::before {
            content: '';
            display: block;
            height: 3px;
            width: 100%;
            background: $darkColor;
            position: absolute;
            top: 50%;
            z-index: 0;
          }
        }

        &__price {
          font-family: $titleFont;
          color: $labelColor;
          font-weight: 700;
          font-size: em(20);
          line-height: em(20);
          letter-spacing: 0.02em;

          div {
            margin-top: 20px;
          }

          small {
            font-size: em(13);
          }
        }

        &__top {
          justify-content: space-between;
          span:first-child {
            color: $labelColor;
          }
        }
        &__middle {
          font-weight: 600;
          font-size: em(20);
          margin: 5px 0 10px 0;

          &--overflow-ellipsis {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        &__bottom {
          display: flex;
          justify-content: space-between;
        }

        &__upper-btns {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1em;

          span {
            cursor: pointer;
          }
        }

        &__bottom-btns {
          display: flex;
          justify-content: center;
        }

        &__explanation {
          display: flex;
          flex-direction: column;
          font-size: 0.8em;

          span {
            margin-bottom: 1em;
            word-break: break-all;
          }

          div:last-child {
            display: flex;
            flex-direction: column;
            align-items: center;

            font-size: 1.2rem !important;
          }
        }
      }
    }
  }
</style>
