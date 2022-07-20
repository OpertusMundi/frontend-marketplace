<template>
  <div class="notification__card" :class="{'notification__card--unread': !notification.read}" ref="notificationCard">
    <div class="notification__card__icon" :style="{'width': `${getCardHeight()}px`}">
      <img v-if="notification.eventType === 'CATALOGUE_ASSET_UNPUBLISHED' && notification.read" src="@/assets/images/icons/notifications/notification_purchase.svg" alt="" />
      <img v-if="notification.eventType === 'CATALOGUE_ASSET_UNPUBLISHED' && !notification.read" src="@/assets/images/icons/notifications/notification_purchase--blue.svg" alt="" />
      <!-- TODO: add more cases, wait for enum -->
    </div>
    <div class="notification__card__main">
      <div class="notification__title">{{ formatTitle(notification.eventType) }}</div>
      <div class="notification__text" v-html="notification.text"></div>
      <div class="notification__moment">
        <template v-if="notification.createdAt">{{ getTimeFromNow(notification.createdAt) }}</template>
        <template v-else><span style="color: #fff">_</span></template>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Notification } from '@/model/notification';
import moment from 'moment';

@Component
export default class NotificationCard extends Vue {
  @Prop({ required: true }) readonly notification!: Notification;

  // to maintain 1:1 aspect-ratio for icon div
  getCardHeight(): number | null {
    if (this.$refs.notificationCard) return (this.$refs.notificationCard as Element).clientHeight;
    return null;
  }

  mounted(): void {
    this.$forceUpdate();
  }

  formatTitle(eventType: string): string {
    const title = eventType
      .split('_')
      .map((x, i) => (i === 0 ? x.charAt(0).toUpperCase() + x.slice(1).toLowerCase() : x.toLowerCase()))
      .join(' ');
    return title;
  }

  getTimeFromNow(t: string): string {
    return moment(t).fromNow(false);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_notifications.scss";
</style>
