<template>
  <div class="dashboard_tabs">
    <ul class='dashboard_tabs__header'>
      <li v-for='(tab, index) in tabs'
        :key='tab.title'
        @click='selectTab(index)'
        :class='{"dashboard_tabs__selected": (index == selectedIndex)}'>
        {{ tab.title }}
      </li>
    </ul>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Tabs extends Vue {
  selectedIndex: number;

  tabs: Array<any>;

  constructor() {
    super();

    this.selectedIndex = 0;

    this.tabs = [];
  }

  mounted():void {
    this.tabs = this.$children;
    this.selectTab(0);
  }

  selectTab(i:number): void {
    this.selectedIndex = i;
    this.tabs.forEach((tab, index) => {
      tab.isActive = (index === i); // eslint-disable-line no-param-reassign
    });
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_tabs.scss";
</style>
