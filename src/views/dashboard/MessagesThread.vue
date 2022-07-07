<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__left">
        <h2>Subject</h2>
      </div>
    </div>
    <div class="thread">
      <div class="thread__main">
        <div class="thread__row" :class="{'thread__row--sent-by-user': message.senderId === $store.getters.getUserKey}" v-for="message in messages" :key="message.id">
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

      <validation-provider ref="vpMessage" rules="required" mode="passive" v-slot="{ errors }">
        <div class="thread__bottom">
          <div class="thread__bottom__block">
            <textarea placeholder="Your message" v-model="messageToSend"></textarea>

            <div class="thread__bottom__block__logo">
              <div class="asset-owner__inner__logo asset-owner__inner__logo--m">
                <img :src="getSenderProfile($store.getters.getUserKey).logoImage ? 'data:' + getSenderProfile($store.getters.getUserKey).logoImageMimeType + ';base64, ' + getSenderProfile($store.getters.getUserKey).logoImage : defaultLogo()" alt="user image">
              </div>
              <p class="form-group__stickyright__text">{{ getSenderProfile($store.getters.getUserKey).name }}</p>
            </div>
          </div>

          <div class="form-group">
            <span v-if="errors[0]" class="errors">A message is required</span>
          </div>

          <button :disabled="!messages" type="submit" class="btn btn--std btn--blue" @click="sendMessage">SEND</button>
        </div>
      </validation-provider>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import MessageApi from '@/service/message';
import { ClientContact, Message } from '@/model/message';
import getDefaultLogo from '@/helper/logo';
import store from '@/store';
import moment from 'moment';

extend('required', required);

@Component({
  components: { ValidationProvider, ValidationObserver },
})
export default class DashboardMessagesThread extends Vue {
  $refs!: {
    vpMessage: InstanceType<typeof ValidationProvider>,
  }

  threadId = '';

  messageApi = new MessageApi();

  contacts: ClientContact[] = [];

  messages: Message[] | null = null;

  messageToSend = '';

  created(): void {
    store.commit('setLoading', true);

    this.threadId = this.$route.params.id;

    this.messageApi.getThread(this.threadId).then((response) => {
      this.contacts = Object.keys(response.contacts).map((x) => response.contacts[x]);
      this.messages = response.result;
      console.log('m', this.messages);

      store.commit('setLoading', false);
    });
  }

  @Watch('messageToSend')
  onMessageToSendChange(newVal: string, oldVal: string): void {
    if (newVal && !oldVal) this.$refs.vpMessage.validate();
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

  async sendMessage(): Promise<void> {
    const { valid } = await this.$refs.vpMessage.validate();
    if (!valid) return;

    store.commit('setLoading', true);

    const replyToMessageResponse = await this.messageApi.replyToMessage(this.threadId, this.messageToSend);
    if (!replyToMessageResponse.success) return;

    if (!this.messages) return;
    this.messages.push(replyToMessageResponse.result);
    this.messageToSend = '';

    store.commit('setLoading', false);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_message-thread.scss";
  @import "@/assets/styles/_search.scss";
  @import "@/assets/styles/_forms.scss";
</style>
