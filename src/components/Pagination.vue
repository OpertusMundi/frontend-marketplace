<!-- ATTENTION: currentPage starts at 0, not 1 -->
<!-- REQUIRED PROPS: currentPage: number, itemsPerPage: number, itemsTotal: number -->

<template>
  <div class="pagination-wrapper" v-if="showPagination()">

    <span class="arrow" v-if="currentPage > 0" @click="onSelectPage(currentPage - 1)">
      <svg xmlns="http://www.w3.org/2000/svg" width="10.207" height="14.788" viewBox="0 0 10.207 14.788">
        <path id="Path_2295" data-name="Path 2295" d="M473.524-7260.858l6.637,8,6.61-8" transform="translate(-7251.291 -472.755) rotate(90)" fill="none" stroke="#333" stroke-width="2"/>
      </svg>
    </span>

    <template v-for="page, i in pagesShownInPagination()">
      <span :key="`pre_dots_${i}`" v-if="page - pagesShownInPagination()[i - 1] > 1">...</span>
      <span @click="onSelectPage(page)" :key="`page_${i}`" class="page" :class="{'page--current': currentPage === page}">{{ page + 1 }}</span>
      <span :key="`post_dots_${i}`" v-if="page - pagesShownInPagination()[i - 1] < 1">...</span>
    </template>

    <span class="arrow" v-if="currentPage < totalPages() - 1" @click="onSelectPage(currentPage + 1)">
      <svg xmlns="http://www.w3.org/2000/svg" width="10.207" height="14.788" viewBox="0 0 10.207 14.788">
        <path id="Path_9659" data-name="Path 9659" d="M0,8,6.637,0l6.61,8" transform="translate(8.638 0.77) rotate(90)" fill="none" stroke="#333" stroke-width="2"/>
      </svg>
    </span>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

const numberOfShownFirstLastPages = 4;

@Component({
})
export default class Pagination extends Vue {
  @Prop({ default: 0 }) private currentPage!: number;

  @Prop() private itemsPerPage!: number;

  @Prop() private itemsTotal!: number;

  showPagination(): boolean {
    if (this.totalPages() > 1) {
      return true;
    }
    return false;
  }

  totalPages(): number {
    return Math.ceil(this.itemsTotal / this.itemsPerPage);
  }

  pagesShownInPagination(): number[] {
    const pages: number[] = [];

    for (let i = 0; i < this.totalPages(); i += 1) {
      if (i < numberOfShownFirstLastPages || (Math.abs(i - this.currentPage) <= 1) || (i >= this.totalPages() - numberOfShownFirstLastPages)) {
        pages.push(i);
      }
    }

    return pages;
  }

  onSelectPage(page: number): void {
    if (page === this.currentPage) {
      return;
    }
    this.$emit('pageSelection', page);
  }
}
</script>

<style lang="scss">
  @import "@/assets/styles/_pagination.scss";
</style>
