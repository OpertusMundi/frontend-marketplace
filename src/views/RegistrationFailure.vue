<template>
  <div class="wrapper">
    <div class="confirm-email">
      <div class="confirm-email__hero">
        <shape></shape>
        <div class="confirm-email__hero__content">
          <h1 class="confirm-email__hero__content__title">Error...</h1>
          <div class="confirm-email__hero__content__text">
            <p>We could not verify your email</p>
            <!-- todo: let user do something for this issue -->
            <!-- <p class="mt-xs-50"><router-link to="/dashboard" class="btn btn--std btn--teal">GO TO DASHBOARD</router-link></p> -->
          </div>
      </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Shape from '@/components/Shape.vue';

@Component({
  components: { Shape },
})
export default class RegistrationFailure extends Vue {
  mounted(): void {
    console.log('confirm email mounted');
  }
}
</script>
<style lang="scss">
  // borrows style from contifm-email
  @import "@/assets/styles/_confirm-email.scss";
  @import "@/assets/styles/_btns.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
</style>
