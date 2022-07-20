<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <h1>Notifications</h1>
    </div>
    <div class="notifications">
      <div class="row">
        <div class="col-md-6">
          <div class="filters">
            <div class="filters__block">
              <p class="filters__title">{{ unreadNotifications || '' }} NEW NOTIFICATIONS</p>
            </div>
            <div class="filters__block">
              <p class="filters__title notification__btn_mark_all_as_read">Mark all as read</p>
            </div>
          </div>

          <div class="notifications__main">
            <notification-card @click.native="navigateToMessages" :notification="{id: 'notification_messages', text: 'You have unread messages', createdAt: '', readAt: null, read: false, recipient: '', eventType: 'UNREAD_MESSAGES', data: null}"></notification-card>
            <hr>
            <notification-card v-for="notification in notifications" :key="notification.id" :notification="notification" @click.native="onSelectNotification(notification.id)"></notification-card>
            <pagination :currentPage="currentPage" :itemsPerPage="itemsPerPage" :itemsTotal="itemsTotal" @pageSelection="onPageSelect"></pagination>
          </div>
        </div>
        <div class="col-md-6"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import NotificationCard from '@/components/Notifications/NotificationCard.vue';
import Pagination from '@/components/Pagination.vue';
import NotificationApi from '@/service/notification';
import { Notification } from '@/model/notification';
import store from '@/store';

@Component({
  components: {
    NotificationCard,
    Pagination,
  },
})
export default class DashboardNotifications extends Vue {
  notificationApi: NotificationApi;

  notifications: Notification[];

  unreadNotifications: number | null;

  currentPage: number;

  itemsPerPage: number;

  itemsTotal: number;

  constructor() {
    super();

    this.notificationApi = new NotificationApi();
    this.notifications = [];

    this.unreadNotifications = null;

    this.currentPage = 0;
    this.itemsPerPage = 10;
    this.itemsTotal = 0;
  }

  get notificationsCount(): number | null {
    return this.$store.getters.getNotificationsCount;
  }

  @Watch('notificationsCount')
  onNotificationsCountChange(newCount: number, oldCount: number): void {
    console.log('nc', newCount, 'oc', oldCount);
    if (newCount > oldCount) {
      this.loadNotifications(0);
    }
  }

  created(): void {
    this.loadNotifications(0);
  }

  navigateToMessages(): void {
    this.$router.push('/dashboard/messages');
  }

  loadNotifications(page: number): void {
    store.commit('setLoading', true);

    Promise.all([
      this.notificationApi.find(page, this.itemsPerPage, null, null, null),
      this.notificationApi.find(0, 1, null, null, false),
    ]).then((responses) => {
      const [notificationsResponse] = responses;
      const { 1: unreadNotificationsResponse } = responses;

      this.notifications = notificationsResponse.result.items;
      this.currentPage = notificationsResponse.result.pageRequest.page;
      this.itemsTotal = notificationsResponse.result.count;

      this.unreadNotifications = unreadNotificationsResponse.result.count;

      store.commit('setLoading', false);
    });
  }

  onPageSelect(page: number): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    this.loadNotifications(page);
  }

  onSelectNotification(id: string): void {
    store.commit('setLoading', true);
    console.log('clicked notif', id);
    this.notificationApi.readNotification(id).then((response) => {
      if (response.success) {
        this.loadNotifications(this.currentPage);
      } else {
        console.log('error marking notification as read');
        store.commit('setLoading', false);
      }
    });
  }
}
</script>
<style lang="scss">
@import "~flexboxgrid/css/flexboxgrid.min.css";
</style>
