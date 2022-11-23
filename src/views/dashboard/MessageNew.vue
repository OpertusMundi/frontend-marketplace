<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__left">
        <h1>New Message</h1>
      </div>
    </div>
    <div class="dashboard__form dashboard__form--transparent">
        <div class="single-message">
          <validation-observer ref="vpNewMessage">
            <validation-provider v-slot="{ errors }" name="Name" rules="required">
              <div class="form-group">
                <input type="text" class="form-group__text" id="email" placeholder="Subject" v-model="subject">
                <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
              </div>
            </validation-provider>

            <div class="form-group">
              <div class="form-group__stickyright">
                <div class="asset-owner__inner__logo">
                  <!-- <img src="@/assets/images/about/partners/athina_logo.svg" alt=""> -->
                  <img :src="$store.getters.getProfile.image ? 'data:' + $store.getters.getProfile.imageMimeType + ';base64, ' + $store.getters.getProfile.image : defaultLogo()" alt="user image">
                </div>
                <p class="form-group__stickyright__text">{{ $store.getters.getProfile.firstName }} {{ $store.getters.getProfile.lastName }}</p>
              </div>
              <validation-provider v-slot="{ errors }" name="Message" rules="required">
                <textarea name="message" id="message" rows="10" placeholder="Your message" v-model="message"></textarea>
                <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
              </validation-provider>
            </div>
          </validation-observer>
          <div class="form-group form-group--right submit-btn-container">
            <button type="submit" class="btn--std btn--blue" @click="sendMessage">SEND</button>
          </div>
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  ValidationProvider,
  ValidationObserver,
  extend,
} from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import MessageApi from '@/service/message';
import getDefaultLogo from '@/helper/logo';
import store from '@/store';

extend('required', required);

@Component({
  components: { ValidationObserver, ValidationProvider },
})
export default class DashboardHome extends Vue {
  messageApi = new MessageApi();

  subject = '';

  message = '';

  defaultLogo(): string {
    return getDefaultLogo();
  }

  async sendMessage(): Promise<void> {
    const valid = await (this.$refs.vpNewMessage as InstanceType<typeof ValidationObserver>).validate();
    if (!valid) return;

    store.commit('setLoading', true);

    const response = await this.messageApi.sendMessageToHelpdesk(this.subject, this.message);

    store.commit('setLoading', false);
    if (response.success) this.$router.push('/dashboard/messages');
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_messages.scss";
  @import "@/assets/styles/_forms.scss";
  @import "@/assets/styles/_assets.scss";
</style>
