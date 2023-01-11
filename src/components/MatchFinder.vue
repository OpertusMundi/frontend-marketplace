<template>
  <div class="match-finder">
    <svg class="match-finder__bg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1920" height="504" viewBox="0 0 1920 504">
      <defs>
        <linearGradient id="linear-gradient" x1="0.5" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0" stop-color="#100699"/>
          <stop offset="1" stop-color="#328f8c"/>
        </linearGradient>
      </defs>
      <rect id="Rectangle_5943" data-name="Rectangle 5943" width="1920" height="504" fill="url(#linear-gradient)"/>
    </svg>

    <div class="match-finder__content">
      <p>Didn't find the data you need?</p>
      <h1>Topio's free-of-charge<br>matchmaking service is all you need!</h1>
      <p>Hit the button below and let us</p>
      <p>find your the perfect match.</p>

      <router-link to="/match-finder" class="btn btn--std btn--white-blue-text">find my match</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class MatchFinder extends Vue {
}
</script>

<style lang="scss">
.match-finder {
  height: 504px;
  position: relative;
  overflow-x: hidden;

  &__bg {
    position: absolute;
    top: 0;
  }

  &__content {
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: #fff;

    h1 {
      margin: .7em 0;
    }

    p {
      font-family: $mainFont;
      font-size: 1em;
      margin-bottom: 10px;

      &:first-child {
        margin-bottom: 0;
      }
    }

    a {
      margin-top: 3em;
    }
  }
}
</style>
