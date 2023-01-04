<template>
  <div class="dashboard__inner private-ogc-single">
    <div class="dashboard__head dashboard__head--column">
      <router-link to="/dashboard/private-ogc-services"><a href="#" class="asset__head__breadcrumps"><svg class="mr-xs-10" xmlns="http://www.w3.org/2000/svg" width="6.938" height="9.904" viewBox="0 0 6.938 9.904"><path id="Path_2295" data-name="Path 2295" d="M473.524-7260.858l4.383,5.283,3.273-3.961h0l1.092-1.322" transform="translate(-7254.398 -472.947) rotate(90)" fill="none" stroke="#333" stroke-width="1.5"/></svg>BACK</a></router-link>

      <template v-if="service">
        <div class="dashboard__head__helpers mt-xs-30 mb-xs-30">
          <h1>Private OGC - {{ service.title }}</h1>
        </div>

        <div class="private-ogc-single__detail">
          <template v-if="servicesData.length">
            <div v-for="(service, i) in servicesData" :key="i">
              <p class="private-ogc-single__detail__title">Type</p>
              <p class="private-ogc-single__detail__value">
                {{ service.type }}
              </p>

              <p class="private-ogc-single__detail__title mt-xs-10">URI</p>
              <p class="private-ogc-single__detail__value">
                <!-- <span>({{ service.type }})</span> -->
                {{ service.uri }}
              </p>

              <p class="private-ogc-single__detail__title mt-xs-10">Requests</p>
              <p class="private-ogc-single__detail__value">
                <ul>
                  <li v-for="request in service.availableRequests" :key="request">&#8226; {{ request }}</li>
                </ul>
              </p>

              <div v-for="[paramKey, paramVal] in service.parameters" :key="paramKey">
                <p class="private-ogc-single__detail__title mt-xs-10">{{ paramKey }}</p>
                <p class="private-ogc-single__detail__value">
                  {{ paramVal }}
                </p>
              </div>

              <p class="private-ogc-single__detail__title mt-xs-10">Example</p>
              <p class="private-ogc-single__detail__value">
                {{ service.example }}
              </p>
            </div>
          </template>
          <div v-else class="private-ogc-single__detail__value"><span>(URI not yet available)</span></div>
        </div>

        <hr style="width: 100%;">

        <div class="private-ogc-single__detail">
          <p class="private-ogc-single__detail__title">Original file</p>
          <p class="private-ogc-single__detail__value">{{ service.fileName }}</p>
        </div>

        <div class="private-ogc-single__detail">
          <p class="private-ogc-single__detail__title">Original file path</p>
          <p class="private-ogc-single__detail__value">{{ service.path }}</p>
        </div>

        <hr style="width: 100%;">

        <div class="private-ogc-single__detail">
          <p class="private-ogc-single__detail__title">Pricing</p>
          <p class="private-ogc-single__detail__value">{{ service.pricingModel.price }} {{ service.pricingModel.type.replaceAll('_', ' ').toLowerCase() }}</p>
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

  servicesData: {
    uri: string,
    type: string,
    parameters: string[][],
    availableRequests: string[],
    example: string,
  }[] = [];

  async created(): Promise<void> {
    console.log('CREATED!!!!');

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
    }

    if (this.service.ingestData?.endpoints?.length) {
      this.servicesData = this.service.ingestData.endpoints
        .map((x) => {
          const parameters = x.uri.split('?')[1]
            ? x.uri
              .split('?')[1]
              .split('&')
              .map((y) => y.split('='))
              .filter((y) => y[0].toLowerCase() !== 'request')
              .map((y) => [y[0].split('').map((z, i) => (i === 0 ? z.toUpperCase() : z)).join(''), y[1]])
            : [];

          return {
            uri: x.uri.split('?')[0],
            type: x.type,
            // eslint-disable-next-line
            availableRequests: x.type === 'WMS' ? ['GetCapabilities', 'GetMap', 'GetLegendGraphic', 'DescribeLayer'] : x.type === 'WFS' ? ['GetCapabilities', 'GetFeature', 'DescribeFeatureType'] : x.type as unknown as string === 'WMTS' ? ['GetCapabilities', 'GetTile'] : [],
            example: x.uri,
            parameters,
          };
        });

      console.log('LAAAA', this.servicesData);

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
