<template>
  <div class="dashboard__inner dashboard-clients">
    <!-- MODALS -->
    <modal :withSlots="true" :show="clientSecret" @dismiss="clientSecret = ''" :modalId="'clientSecret'" :showCancelButton="false" :showCloseButton="false">
      <template v-slot:body>
        <h1>Client Secret</h1>

        <p>Here is the generated client secret:</p>
        <p class="modal__client-secret">
          <span><strong>{{ clientSecret }}</strong></span>
          <button class="btn btn--std btn--outlinedark" @click="copyClientSecretToClipboard" v-if="!isClientSecretCopied">copy</button>
          <button class="btn btn--std modal__client-secret__label-copied" v-else>copied &#10003;</button>
        </p>
        <p>Copy and save it somewhere safe. You will not be able to reproduce it.
          <a href="https://www.oauth.com/oauth2-servers/client-registration/client-id-secret/" target="_blank">Read more</a> about Client ID & Secret architecture.
        </p>
      </template>

      <template v-slot:footer>
        <button class="btn btn--std btn--blue" @click="clientSecret = ''">OK</button>
      </template>
    </modal>
    <!-- END OF MODALS -->

    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <h1>Clients</h1>
        <p>Keys are generated per user and used in any service that needs authentication. You can generate new keys, delete or revoke all previous ones.</p>
      </div>
    </div>

    <div class="filters">
      <div class="filters__block">
        <button class="btn btn--std btn--dark" @click="isCreateClientOpen = true">GENERATE</button>
      </div>
      <div class="filters__block">
        <div class="filters__block__select">
          <label for="filter">STATUS: </label>
          <select v-model="selectedStatus" name="filter" id="filter">
            <option v-for="status in statusFilterOptions" :key="status" :value="status">{{ status }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="dashboard-clients__table">
      <div class="dashboard-clients__table__row dashboard-clients__table__row--header">
        <span>Name</span>
        <span>Key</span>
        <span>Created</span>
        <span>Revoked</span>
        <div></div>
        <hr v-if="(!clients || !clients.length) && !isCreateClientOpen">
      </div>
      <template v-if="isCreateClientOpen">
        <hr>
        <div class="dashboard-clients__table__row">
          <div class="dashboard-clients__table__row__input-container">
            <input type="text" placeholder="Client name" v-model="newClientAlias">
            <small v-if="isShowAliasError">Please, type a client name</small>
          </div>
          <span></span>
          <span></span>
          <span></span>
          <div class="dashboard-clients__table__row__actions">
            <button @click="isCreateClientOpen = false">cancel</button>
            <button @click="createClient">save client</button>
          </div>
        </div>
      </template>
      <div
        class="dashboard-clients__table__row"
        :class="{'dashboard-clients__table__row--revoked': client.revokedOn}"
        v-for="client in clients"
        :key="client.clientId"
      >
        <hr>
        <span>{{ client.alias }}</span>
        <span>{{ client.clientId }}</span>
        <span>{{ formatDate('DATE', client.createdOn) }}, {{ formatDate('TIME', client.createdOn) }}</span>
        <span>
          <template v-if="client.revokedOn">{{ formatDate('DATE', client.revokedOn) }}, {{ formatDate('TIME', client.revokedOn) }}</template>
        </span>
        <div class="dashboard-clients__table__row__actions">
          <template v-if="!client.revokedOn">
            <button @click="revokeClient(client.clientId)">revoke</button>
            <button @click="copyClientIdToClipboard(client.clientId)" v-if="clientIdCopiedToClipboard !== client.clientId">copy</button>
            <button class="dashboard-clients__table__row__actions__label-copied" v-else>copied &#10003;</button>
          </template>
        </div>
      </div>
    </div>

    <pagination
      :currentPage="paginationData.currentPage"
      :itemsPerPage="paginationData.itemsPerPage"
      :itemsTotal="paginationData.itemsTotal"
      @pageSelection="onPageSelect"
    ></pagination>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import moment from 'moment';
import ClientsApi from '@/service/clients';
import { Client } from '@/model/client';
import Pagination from '@/components/Pagination.vue';
import Modal from '@/components/Modal.vue';
import store from '@/store';

@Component({
  components: { Pagination, Modal },
})
export default class DashboardClients extends Vue {
  clientsApi = new ClientsApi();

  clients: Client[] | null = null;

  isCreateClientOpen = false;

  newClientAlias = '';

  clientSecret = '';

  isShowAliasError = false;

  clientIdCopiedToClipboard: string | null = null;

  isClientSecretCopied = false;

  statusFilterOptions = [
    'ALL',
    'ACTIVE',
    'REVOKED',
  ];

  selectedStatus = 'ALL';

  paginationData: {
    currentPage: number | null,
    itemsPerPage: number,
    itemsTotal: number | null,
  } = {
    currentPage: null,
    itemsPerPage: 10,
    itemsTotal: null,
  };

  @Watch('selectedStatus')
  onSelectedStatusChange(): void {
    console.log('changed');
  }

  @Watch('newClientAlias')
  onAliasChange(): void {
    this.isShowAliasError = false;
  }

  created(): void {
    this.loadClients();
  }

  loadClients(page = 0): void {
    store.commit('setLoading', true);

    this.clientsApi.getClients(page, this.paginationData.itemsPerPage).then((response) => {
      if (response.success) {
        this.clients = response.result.items;

        this.paginationData = {
          ...this.paginationData,
          currentPage: response.result.pageRequest.page,
          itemsTotal: response.result.count,
        };

        store.commit('setLoading', false);
      }
    });
  }

  onPageSelect(page: number): void {
    this.loadClients(page);
  }

  createClient(): void {
    if (!this.newClientAlias) {
      this.isShowAliasError = true;
      return;
    }

    this.isCreateClientOpen = false;

    store.commit('setLoading', true);

    this.clientsApi.createClient(this.newClientAlias).then((response) => {
      if (response.success) {
        this.isClientSecretCopied = false;
        this.clientSecret = response.result.secret;

        store.commit('setLoading', false);
        this.loadClients();
      }
    });
  }

  revokeClient(key: string): void {
    store.commit('setLoading', true);

    this.clientsApi.revokeClient(key).then((response) => {
      if (response.success) {
        store.commit('setLoading', false);
        this.loadClients();
      }
    });
  }

  copyClientIdToClipboard(clientId: string): void {
    navigator.clipboard.writeText(clientId);
    this.clientIdCopiedToClipboard = clientId;
  }

  copyClientSecretToClipboard(): void {
    navigator.clipboard.writeText(this.clientSecret);
    this.isClientSecretCopied = true;
  }

  formatDate(type: 'DATE' | 'TIME', dateString: string): string {
    if (type === 'DATE') return moment(dateString).format('DD MMM YYYY');
    return moment(dateString).format('HH:mm:ss');
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/dashboard/_clients.scss";
</style>
