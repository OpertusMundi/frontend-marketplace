<template>
  <div class="announcement-bar" id="t-announcement-bar">
    <div class="announcement-bar__text" v-html="$store.getters.getAnnouncement.content"></div>
    <div class="announcement-bar__btn-close" @click="closeAnnouncement">
      <svg xmlns="http://www.w3.org/2000/svg" width="17.061" height="17.061" viewBox="0 0 17.061 17.061">
        <g id="Group_7542" data-name="Group 7542" transform="translate(-1738.47 -46.47)">
          <path id="Path_815" data-name="Path 815" d="M0,0H22.627" transform="translate(1739 47) rotate(45)" fill="none" stroke="#333" stroke-width="1.5"/>
          <path id="Path_2030" data-name="Path 2030" d="M0,0H22.627" transform="translate(1739 63) rotate(-45)" fill="none" stroke="#333" stroke-width="1.5"/>
        </g>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import store from '@/store';

@Component
export default class AnnouncementBar extends Vue {
  closeAnnouncement(): void {
    store.commit('setAnnouncement', null);
    store.commit('setAnnouncementBarHeight', 0);
    sessionStorage.setItem('isAnnouncementBarClosed', 'y');
  }
}
</script>

<style lang="scss">
@import "@/assets/styles/_announcement-bar.scss";
</style>
