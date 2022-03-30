<template>
  <div class="wrapper">
    <div class="confirm-email">
      <div class="confirm-email__hero">
        <shape></shape>
        <div class="confirm-email__hero__content">
          <h1 class="confirm-email__hero__content__title">Your topio supplier account has been initiated!</h1>
          <div class="confirm-email__hero__content__text">
            <p>Your can review the information you provided in your Settings. We will process your information and notify you for the additional documentation needed. These documents will be your company’s Identity Proof, Registration Proof and Articles of Association. </p>
            <!-- <p class="mt-xs-50"><router-link to="/dashboard" class="btn btn--std btn--teal">GO TO DASHBOARD</router-link></p> -->
            <p class="mt-xs-50"><button @click="onContinue" class="btn btn--std btn--teal">CONTINUE</button></p>
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

@Component({
  components: { Shape },
})
export default class BecomeVendorSuccess extends Vue {
  mounted(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  onContinue(): void {
    store.commit('logout');
  }
}
</script>
<style lang="scss">
  // borrows style from contifm-email
  @import "@/assets/styles/_confirm-email.scss";
  @import "@/assets/styles/_btns.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
</style>
