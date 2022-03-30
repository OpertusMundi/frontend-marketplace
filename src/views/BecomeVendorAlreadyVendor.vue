<template>
  <div class="wrapper">
    <div class="confirm-email">
      <div class="confirm-email__hero">
        <shape></shape>
        <div class="confirm-email__hero__content">
          <h1 class="confirm-email__hero__content__title">{{ vendorStateMsg }}</h1>
          <div class="confirm-email__hero__content__text">
            <p class="mt-xs-50">
              <router-link to="/" class="btn btn--std btn--teal">HOME</router-link>
              <router-link to="/dashboard" class="btn btn--std btn--teal ml-xs-20">DASHBOARD</router-link>
            </p>
          </div>
      </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Shape from '@/components/Shape.vue';
import store from '@/store';
import { EnumRole } from '@/model/role';

@Component({
  components: { Shape },
})
export default class BecomeVendorAlreadyVendor extends Vue {
  vendorStateMsg: string;

  constructor() {
    super();

    this.vendorStateMsg = '';
  }

  created(): void {
    // eslint-disable-next-line
    this.vendorStateMsg = store.getters.hasRole([EnumRole.ROLE_PROVIDER])
      ? 'You are already a supplier!'
      : store.getters.getProfile.provider.draft
        ? 'Your supplier registration is pending!'
        : '';
  }

  mounted(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
</script>
<style lang="scss">
  // borrows style from contifm-email
  @import "@/assets/styles/_confirm-email.scss";
  @import "@/assets/styles/_btns.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
</style>
