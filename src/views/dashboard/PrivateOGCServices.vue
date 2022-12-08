<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers dashboard__head__helpers--full-width">
        <h1>topio OGC</h1>
        <router-link to="/dashboard/private-ogc-service-file-selection" class="btn--std btn--blue">CREATE SERVICE</router-link>
      </div>
    </div>

    <private-ogc-service-card v-for="ogcService in ogcServices" :key="ogcService.key" :ogcService="ogcService" @delete="onDeleteService"></private-ogc-service-card>

    <pagination
      :currentPage="paginationData.currentPage"
      :itemsPerPage="paginationData.itemsPerPage"
      :itemsTotal="paginationData.itemsTotal"
      @pageSelection="onPageSelect"
    ></pagination>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PrivateOGCServicesApi from '@/service/private-ogc-services';
import PrivateOGCServiceCard from '@/components/OGCServices/PrivateOGCServiceCard.vue';
import Pagination from '@/components/Pagination.vue';
import { PrivateOGCService } from '@/model/private-ogc-services';
import store from '@/store';

@Component({
  components: {
    'private-ogc-service-card': PrivateOGCServiceCard,
    Pagination,
  },
})
export default class PrivateOGCServices extends Vue {
  privateOGCServiceAPI = new PrivateOGCServicesApi();

  ogcServices: PrivateOGCService[] | null = null;

  paginationData: {
    currentPage: number | null,
    itemsPerPage: number,
    itemsTotal: number | null,
  } = {
    currentPage: null,
    itemsPerPage: 10,
    itemsTotal: null,
  };

  created(): void {
    this.getOGCServices(0, this.paginationData.itemsPerPage);
  }

  getOGCServices(page: number, itemsPerPage: number): void {
    store.commit('setLoading', true);
    this.privateOGCServiceAPI.find(page, itemsPerPage).then((response) => {
      this.ogcServices = response.result.items;

      this.paginationData = {
        ...this.paginationData,
        currentPage: response.result.pageRequest.page,
        itemsTotal: response.result.count,
      };

      store.commit('setLoading', false);
    });
  }

  onPageSelect(page: number): void {
    this.getOGCServices(page, this.paginationData.itemsPerPage);
  }

  onDeleteService(key: string): void {
    store.commit('setLoading', true);
    this.privateOGCServiceAPI.deleteService(key)
      .then(() => {
        this.getOGCServices(0, this.paginationData.itemsPerPage);
      })
      .catch(() => {
        store.commit('setLoading', false);
      });
  }
}
</script>
<style lang="scss">
</style>
