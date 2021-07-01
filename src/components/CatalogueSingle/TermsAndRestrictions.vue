<template>
  <section class="asset__section">
    <div class="asset__section__head">
      <h4>Terms & Restrictions</h4>
      <a href="#" class="asset__section__head__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
      <ul class="asset__section__head__tabs">
        <li><a href="#" @click.prevent="activeTab = 1" :class="{ 'active' : activeTab == 1 }">Type of licence</a></li>
        <li><a href="#" @click.prevent="activeTab = 2" :class="{ 'active' : activeTab == 2 }">Countries</a></li>
        <li><a href="#" @click.prevent="activeTab = 3" :class="{ 'active' : activeTab == 3 }">Duration</a></li>
        <li><a href="#" @click.prevent="activeTab = 4" :class="{ 'active' : activeTab == 4 }">Vocabulary</a></li>
      </ul>
    </div>
    <div class="asset__section__content">
      <div class="asset__section__content__inner">
        <ul class="asset__section__tabs">
          <li v-if="activeTab == 1">
            <p>{{ catalogueItem.license }}</p>
          </li>
          <li v-if="activeTab == 2">
            <p>Countries content (DUMMY)</p>
          </li>
          <li v-if="activeTab == 3">
            <p>Duration content (DUMMY)</p>
          </li>
          <li v-if="activeTab == 4">
            <p>Vocabulary content (DUMMY)</p>
          </li>
        </ul>
      </div>
    </div>
    <a href="#" class="asset__section__toggle"><img src="@/assets/images/icons/arrow_down.svg" alt=""></a>
  </section>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { CatalogueItem } from '@/model';

@Component
export default class TermsAndRestrictions extends Vue {
  @Prop({ required: true }) private catalogueItem!: CatalogueItem;

  activeTab: number;

  constructor() {
    super();

    this.activeTab = 1;
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
