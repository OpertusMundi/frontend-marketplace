<!-- note: we use :withTransition="false" cause we already apply transition on the global-modals component -->

<template>
  <!-- USER ACCOUNT NOT READY -->
  <modal
    :withSlots="true"
    :show="getShownGlobalModal() === 'modalPendingAccountActivation'"
    @dismiss="dismissGlobalModal"
    :modalId="'modalShowCrsList'"
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
}
</script>
<style lang="scss">
</style>
