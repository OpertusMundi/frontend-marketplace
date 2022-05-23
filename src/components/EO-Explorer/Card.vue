<template>
  <div class="eo_card d-flex">
    <div class="eo_card__img">
      <img :src="feature.assets.thumbnail.href" alt="Thumbnail">
    </div>
    <div class="eo_card__info">
      <div class="d-flex align-items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path data-name="Path 13434" d="m9.171 7.756-.442.442-2.2-2.2 1.512-1.512a2 2 0 0 0 2.531-.243L7.743 1.414a2 2 0 0 0-.234 2.542L5.998 5.467l-2.2-2.2.442-.442L1.411-.004.969.438l-.53.531-.442.442L2.826 4.24l.442-.442 2.2 2.2-2.172 2.171.53.531 2.172-2.172 2.2 2.2-.442.442 2.829 2.829 1.414-1.415Z" fill="#333"/></svg>
        <p>{{ feature.properties.constellation || '' }}</p>
      </div>

      <div class="d-flex align-items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path data-name="Path 13433" d="M10.453.938H9.375V.375a.375.375 0 0 0-.75 0v.563h-5.25V.375a.375.375 0 0 0-.75 0v.563H1.547A1.549 1.549 0 0 0 0 2.484v7.969A1.549 1.549 0 0 0 1.547 12h8.906A1.549 1.549 0 0 0 12 10.453V2.484A1.549 1.549 0 0 0 10.453.938Zm-8.906.75h1.078v.375a.375.375 0 0 0 .75 0v-.375h5.25v.375a.375.375 0 0 0 .75 0v-.375h1.078a.8.8 0 0 1 .8.8v.891H.75v-.895a.8.8 0 0 1 .797-.796Zm8.906 9.563H1.547a.8.8 0 0 1-.8-.8V4.125h10.5v6.328a.8.8 0 0 1-.794.797Z" fill="#333"/></svg>
        <p>{{ feature.properties.datetime? formatDate(feature.properties.datetime) : '' }}</p>
      </div>

      <div class="d-flex align-items-center">
        <svg data-name="Group 5891" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path data-name="Path 13431" d="M6 0a6 6 0 1 0 6 6 6.007 6.007 0 0 0-6-6Zm0 11.25A5.25 5.25 0 1 1 11.25 6 5.256 5.256 0 0 1 6 11.25Z" fill="#333"/><path data-name="Path 13432" d="M6.375 2.25h-.75v3.905l2.36 2.36.53-.53-2.14-2.14Z" fill="#333"/></svg>
        <p>{{ feature.properties.datetime? formatTime(feature.properties.datetime) : '' }}</p>
      </div>

      <div class="mt-xs-20">
        <button @click="$emit('viewAllMetadata', feature.id)">View all metadata</button>
        <button disabled class="ml-xs-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="16.776" height="10" viewBox="0 0 16.776 10"><g data-name="Group 5863"><path data-name="Path 13426" d="M8.388 0C5.183 0 2.276 1.754.131 4.6a.664.664 0 0 0 0 .793c2.145 2.852 5.051 4.605 8.257 4.605s6.112-1.754 8.257-4.6a.664.664 0 0 0 0-.793C14.5 1.754 11.593 0 8.388 0Zm.23 8.521a3.528 3.528 0 1 1 3.291-3.291 3.531 3.531 0 0 1-3.291 3.291Zm-.106-1.627a1.9 1.9 0 1 1 1.774-1.774 1.9 1.9 0 0 1-1.775 1.774Z" fill="#190aff"/></g></svg>
          Visualise
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Feature } from '@/model/sentinel-hub';
import moment from 'moment';

@Component({
})
export default class EOExplorerCard extends Vue {
  @Prop({ required: true }) feature!: Feature;

  formatDate(date: string): string {
    return moment(date).format('D MMMM YYYY');
  }

  formatTime(date: string): string {
    return `${moment(date).format('kk:mm:ss')} UTC`;
  }
}
</script>

<style lang="scss">
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
  @import "@/assets/styles/_eo-explorer.scss";
</style>
