<template>
  <div class="wrapper">
    <div class="confirm-email">
      <div class="confirm-email__hero">
        <shape></shape>
        <div class="confirm-email__hero__content">
          <h1 class="confirm-email__hero__content__title">Error...</h1>
          <div class="confirm-email__hero__content__text">
            <p v-if="!errorCode || [1, 2].includes(errorCode)">There was a problem with authentication. Please, try again later!</p>
            <p v-if="errorCode === 3">The email is used with another authentication method.</p>

            <p class="mt-xs-50"><router-link to="/" class="btn btn--std btn--teal">Back</router-link></p>
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
export default class LoginError extends Vue {
  errorCode: number | null = null;

  created(): void {
    const errorCode = Number.parseInt(this.$route.query.error as string, 10);

    this.errorCode = errorCode;
  }
}
</script>
<style lang="scss">
  // borrows style from contifm-email
  @import "@/assets/styles/_confirm-email.scss";
  @import "@/assets/styles/_btns.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
</style>
