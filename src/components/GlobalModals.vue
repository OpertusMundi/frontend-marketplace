<!-- note: we use :withTransition="false" cause we already apply transition on the global-modals component -->

<template>
  <div>
    <!-- API ERROR -->
    <modal
      :withSlots="true"
      :show="getShownGlobalModal() === 'modalApiError'"
      @dismiss="dismissGlobalModal"
      :modalId="'modalApiError'"
      :showCancelButton="false"
      :showCloseButton="false"
      :withTransition="false"
    >
      <template v-slot:body>
        <h3>An error occured.</h3>
        <ul>
          <li v-for="(err, i) in $store.getters.getErrorMessages" :key="i">
            {{err.code}} | {{ err.level }} | {{ err.description }}
          </li>
        </ul>
      </template>

      <template v-slot:footer>
        <button class="btn btn--std btn--blue" @click="dismissGlobalModalAndClearApiErrors">OK</button>
      </template>
    </modal>
    <!--  -->

    <!-- USER ACCOUNT NOT READY -->
    <modal
      :withSlots="true"
      :show="getShownGlobalModal() === 'modalPendingAccountActivation'"
      @dismiss="dismissGlobalModal"
      :modalId="'modalPendingAccountActivation'"
      :showCancelButton="false"
      :showCloseButton="false"
      :withTransition="false"
    >
      <template v-slot:body>
        <h3>We are setting things up with your account. Please join us in a few minutes!</h3>
      </template>

      <template v-slot:footer>
        <button class="btn btn--std btn--blue" @click="dismissGlobalModal">OK</button>
      </template>
    </modal>
  </div>
  <!--  -->
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Modal from '@/components/Modal.vue';
import store from '@/store';

@Component({
  components: { Modal },
})
export default class GlobalModals extends Vue {
  getShownGlobalModal(): string | null {
    return store.getters.getShownGlobalModal;
  }

  dismissGlobalModal(): void {
    store.commit('setShownGlobalModal', null);
  }

  dismissGlobalModalAndClearApiErrors(): void {
    store.commit('setShownGlobalModal', null);
    store.commit('setErrorMessages', null);
  }
}
</script>
<style lang="scss">
</style>
