<template>
  <div class="cookie-box">
    <div class="m_container">
      <div class="cookie-box__text">
        <h2>This website uses cookies</h2>
        <p>We use cookies to personalise content and ads, to provide social media features and analyse our traffic. We also share information about your use of our site with our social media, advertising and analytics partners who may combine it with other information that you’ve provided to them or that they’ve collected from your use of theirs services. You consent to our cookies if you continue to use our website.</p>
      </div>
      <div class="cookie-box__btns">
        <button class="btn btn--std btn--blue" @click="acceptCookies">accept cookies</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class CookieBox extends Vue {
  acceptCookies(): void {
    localStorage.setItem('is_user_accepted_cookies', 'yes');
    this.$emit('close');
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/_btns.scss";
</style>
<style lang="scss" scoped>
  .cookie-box {
    position: fixed;
    width: 100vw;
    bottom: 0;
    background: #fff;
    padding: 1.3em 0;

    &__btns {
      min-width: 30%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    h2 {
      margin-bottom: .7em;
    }

    p {
      color: $labelColor;
      font-size: .85em;
    }

    > div {
      display: flex;
      align-items: center;
    }
  }
</style>
