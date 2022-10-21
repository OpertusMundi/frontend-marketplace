<template>
  <div class="dashboard__inner dashboard-clients">
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
          <button @click="revokeClient(client.clientId)">revoke</button>
          <button>copy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import moment from 'moment';
import ClientsApi from '@/service/clients';
import { Client } from '@/model/client';
import store from '@/store';

@Component
export default class DashboardClients extends Vue {
  clientsApi = new ClientsApi();

  clients: Client[] | null = null;

  isCreateClientOpen = false;

  newClientAlias = '';

  isShowAliasError = false;

  statusFilterOptions = [
    'ALL',
    'ACTIVE',
    'REVOKED',
  ];

  selectedStatus = 'ALL';

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

  loadClients(): void {
    store.commit('setLoading', true);

    this.clientsApi.getClients().then((response) => {
      if (response.success) {
        this.clients = response.result.items;
        store.commit('setLoading', false);
      }
    });
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

  formatDate(type: 'DATE' | 'TIME', dateString: string): string {
    if (type === 'DATE') return moment(dateString).format('DD MMM YYYY');
    return moment(dateString).format('HH:mm:ss');
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/dashboard/_clients.scss";
</style>
