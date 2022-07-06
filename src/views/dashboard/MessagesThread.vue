<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__left">
        <h2>Subject</h2>
      </div>
    </div>
    <div class="thread">
      <div class="thread__main">
        <div class="thread__row" v-for="message in messages" :key="message.id">
          <div class="thread__row__date"><span>{{ formatDate(message.createdAt).date }} • {{ formatDate(message.createdAt).time }}</span></div>
          <div class="thread__row__body">
            <div class="thread__row__body__logo">
                <div class="asset-owner__inner__logo asset-owner__inner__logo--m">
                  <img :src="getSenderProfile(message.senderId).logoImage ? 'data:' + getSenderProfile(message.senderId).logoImageMimeType + ';base64, ' + getSenderProfile(message.senderId).logoImage : defaultLogo()" alt="user image">
                </div>
                <p class="form-group__stickyright__text">{{ getSenderProfile(message.senderId).name }}</p>
            </div>
            <div class="thread__row__body__message">
              <p>{{ message.text }}</p>
            </div>
          </div>
        </div>

        <!-- <div class="thread__row">
          <div class="thread__row__date"><span>20 Nov 2020 • 09:23</span></div>
          <div class="thread__row__body">
            <div class="thread__row__body__logo">
                <div class="asset-owner__inner__logo">
                  <img src="@/assets/images/about/partners/athina_logo.svg" alt="">
                </div>
                <p class="form-group__stickyright__text">AthenaRC</p>
            </div>
            <div class="thread__row__body__message">
              <p> Message content</p>

              <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

              <p> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

              <p> Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            </div>
          </div>
        </div>

        <div class="thread__row">
          <div class="thread__row__date"><span>20 Nov 2020 • 09:23</span></div>
          <div class="thread__row__body">
            <div class="thread__row__body__logo">
              <div class="asset-owner__inner__logo">
                <img src="@/assets/images/about/partners/athina_logo.svg" alt="">
              </div>
              <p class="form-group__stickyright__text">AthenaRC</p>
            </div>
            <div class="thread__row__body__message">
              <p> Message content</p>

              <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

              <p> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

              <p> Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            </div>
          </div>
        </div> -->
      </div>

      <div class="thread__bottom">
        <div class="thread__bottom__block">
          <textarea name="message" id="message" placeholder="Your message"></textarea>
          <div class="thread__bottom__block__logo">
            <div class="asset-owner__inner__logo asset-owner__inner__logo--m">
              <img :src="getSenderProfile($store.getters.getUserKey).logoImage ? 'data:' + getSenderProfile($store.getters.getUserKey).logoImageMimeType + ';base64, ' + getSenderProfile($store.getters.getUserKey).logoImage : defaultLogo()" alt="user image">
            </div>
            <p class="form-group__stickyright__text">{{ getSenderProfile($store.getters.getUserKey).name }}</p>
          </div>
        </div>

        <button type="submit" class="btn--std btn--blue">SEND</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MessageApi from '@/service/message';
import { ClientContact, Message } from '@/model/message';
import getDefaultLogo from '@/helper/logo';
import store from '@/store';
import moment from 'moment';

@Component
export default class DashboardMessagesThread extends Vue {
  messageApi = new MessageApi();

  contacts: ClientContact[] = [];

  messages: Message[] | null = null;

  created(): void {
    store.commit('setLoading', true);

    const threadId = this.$route.params.id;

    this.messageApi.getThread(threadId).then((response) => {
      this.contacts = Object.keys(response.contacts).map((x) => response.contacts[x]);
      this.messages = response.result;
      console.log('m', this.messages);

      store.commit('setLoading', false);
    });
  }

  getSenderProfile(senderId: string): ClientContact {
    if (this.contacts.some((x) => x.id === senderId)) {
      // eslint-disable-next-line
      return this.contacts.find((x) => x.id === senderId)!;
    }
    // eslint-disable-next-line
    return { id: '', logoImage: '', logoImageMimeType: '', name: '' };
  }

  formatDate(datetime: string): { date: string, time: string } {
    const date = moment(datetime).format('D MMM YY');
    const time = moment(datetime).format('HH:mm');

    return {
      date,
      time,
    };
  }

  defaultLogo(): string {
    return getDefaultLogo();
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_message-thread.scss";
  @import "@/assets/styles/_search.scss";
</style>
