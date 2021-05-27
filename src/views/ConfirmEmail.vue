<template>
  <div class="wrapper">
    <div class="confirm-email">
      <div class="confirm-email__hero">
        <shape></shape>
        <div class="confirm-email__hero__content">
          <h1 class="confirm-email__hero__content__title">Confirm your email.</h1>
          <div class="confirm-email__hero__content__text mt-xs-10" style="margin-top: 0;">
            <p>Check your email and click on the link provided.<br>You will be redirected back here automatically.</p>
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
export default class Login extends Vue {
  mounted(): void {
    console.log('confirm email mounted');
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_confirm-email.scss";
</style>
