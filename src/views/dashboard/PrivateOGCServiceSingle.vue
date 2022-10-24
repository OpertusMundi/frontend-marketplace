<template>
  <div class="dashboard__inner private-ogc-single">
    <div class="dashboard__head dashboard__head--column">
      <router-link to="/dashboard/private-ogc-services"><a href="#" class="asset__head__breadcrumps"><svg class="mr-xs-10" xmlns="http://www.w3.org/2000/svg" width="6.938" height="9.904" viewBox="0 0 6.938 9.904"><path id="Path_2295" data-name="Path 2295" d="M473.524-7260.858l4.383,5.283,3.273-3.961h0l1.092-1.322" transform="translate(-7254.398 -472.947) rotate(90)" fill="none" stroke="#333" stroke-width="1.5"/></svg>BACK</a></router-link>

      <template v-if="service">
        <div class="dashboard__head__helpers mt-xs-30 mb-xs-30">
          <h1>Private OGC - {{ service.title }}</h1>
        </div>

        <div class="private-ogc-single__detail">
          <p class="private-ogc-single__detail__title">URI</p>
          <template v-if="service.ingestData && service.ingestData.endpoints">
            <p class="private-ogc-single__detail__value" v-for="endpoint in service.ingestData.endpoints" :key="endpoint.uri">
              <span>({{ endpoint.type }})</span>
              {{ endpoint.uri }}
            </p>
          </template>
          <div v-else class="private-ogc-single__detail__value"><span>(Not available)</span></div>
        </div>

        <div class="private-ogc-single__detail">
          <p class="private-ogc-single__detail__title">Original file</p>
          <p class="private-ogc-single__detail__value">{{ service.fileName }}</p>
        </div>

        <div class="private-ogc-single__detail">
          <p class="private-ogc-single__detail__title">Original file path</p>
          <p class="private-ogc-single__detail__value">{{ service.path }}</p>
        </div>

      </template>
    </div>

  </div>
</template>

<script lang="ts">
import { PrivateOGCService } from '@/model/private-ogc-services';
import { Component, Vue } from 'vue-property-decorator';
import PrivateOGCServicesApi from '@/service/private-ogc-services';
import store from '@/store';

@Component
export default class PrivateOGCServiceSingle extends Vue {
  service: PrivateOGCService | null = null;

  privateOGCServicesApi = new PrivateOGCServicesApi();

  async created(): Promise<void> {
    this.service = this.$route.params.ogcService as unknown as PrivateOGCService;

    if (!this.service) {
      store.commit('setLoading', true);

      const { key } = this.$route.params;

      const serviceResponse = await this.privateOGCServicesApi.findOne(key);
      if (!serviceResponse.success) {
        store.commit('setLoading', false);
        this.$router.push('/error/404');
        return;
      }
      this.service = serviceResponse.result;
      store.commit('setLoading', false);
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/_dashboard.scss";
@import "@/assets/styles/_btns.scss";
@import "@/assets/styles/dashboard/_private-ogc.scss";
@import "@/assets/styles/abstracts/_spacings.scss";
</style>
