<template>
  <div>
    <div class="messages-main">
      <p v-if="messages && !messages.length">No messages</p>
      <template v-else>
        <router-link class="messages__main__row" :class="{'messages__main__row--read': message.read}" :to="`/dashboard/messages/${message.thread}`" v-for="message in messages" :key="message.id">
          <div class="messages__main__row__view"><span>VIEW MESSAGE</span></div>
          <div class="messages__main__row__inner">
            <div class="messages__main__row__block">
              <div class="messages__main__row__block__icon">
                <img :src="getContactProfile(message).logoImage ? 'data:' + getContactProfile(message).logoImageMimeType + ';base64, ' + getContactProfile(message).logoImage : defaultLogo()" alt="user image">
              </div>
              <div class="messages__main__row__block__name">
                {{ getContactProfile(message).name }}
              </div>
            </div>
            <span class="messages__main__row__block" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis !important;">
              <p class="messages__main__row__block__title">{{ '' }} <span>{{ message.text }}</span> </p>
            </span>
            <div class="messages__main__row__block">
              <p class="messages__main__row__block__date">{{ formatDate(message.createdAt).date }} • {{ formatDate(message.createdAt).time }}</p>
            </div>
          </div>
        </router-link>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import moment from 'moment';
import MessageApi from '@/service/message';
import getDefaultLogo from '@/helper/logo';
import { ClientContact, Message } from '@/model/message';
import store from '@/store';

@Component
export default class DashboardHomeMessages extends Vue {
  messageApi = new MessageApi();

  contacts: ClientContact[] = [];

  messages: Message[] | null = null;

  created(): void {
    this.findMessages();
  }

  findMessages(page = 0): void {
    this.messageApi.find(page, 3, null, null, 'THREAD_ONLY').then((response) => {
      this.contacts = Object.keys(response.contacts).map((x) => response.contacts[x]);

      this.messages = response.result.items;
    });
  }

  getContactProfile(message: Message): ClientContact {
    const contactsExcludingCurrentUser = this.contacts.filter((x) => x.id !== store.getters.getUserKey);
    console.log(contactsExcludingCurrentUser);

    const userIDs = [message.senderId, message.recipientId];
    if (contactsExcludingCurrentUser.some((x) => userIDs.includes(x.id))) {
      // eslint-disable-next-line
      return contactsExcludingCurrentUser.find((x) => userIDs.includes(x.id))!;
    }
    // eslint-disable-next-line
    return { id: '', logoImage: '', logoImageMimeType: '', name: '' };
  }

  defaultLogo(): string {
    return getDefaultLogo();
  }

  formatDate(datetime: string): { date: string, time: string } {
    const date = moment(datetime).format('D MMM YY');
    const time = moment(datetime).format('HH:mm');

    return {
      date,
      time,
    };
  }
}
</script>

<style lang="scss">
  @import "@/assets/styles/_messages.scss";
</style>
