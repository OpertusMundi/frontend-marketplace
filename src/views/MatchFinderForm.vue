<template>
  <div class="page contact-page">
    <!-- MODALS -->
    <modal :withSlots="true" :show="isShownModalMessageSent" :modalId="'modalMessageSent'" :showCancelButton="false" :showCloseButton="false" :closeOnClickOutside="false">
      <template v-slot:body>
        <h1 class="mt-xs-100 mb-xs-100">Your message has been successfully delivered</h1>
      </template>

      <template v-slot:footer>
        <div class="mt-xs-100 mb-xs-100">
          <router-link to="/" class="btn btn--std btn--blue">home page</router-link>
          <router-link to="/catalogue" class="btn btn--std btn--blue ml-xs-20">browse assets</router-link>
        </div>
      </template>
    </modal>
    <!-- END OF MODALS -->

    <div class="page__inner pb-sm-100">
      <div class="xs_container contact-page__container">
        <div class="contact-page__top">
          <h1>Find my match!</h1>
          <p>Didn't find the data or services you are looking for?</p>
          <p>Feel free to send us an email at <a href = "mailto:hello@topio.market">hello@topio.market</a> or fill in this form and we will find them for you from one of our data suppliers.</p>
        </div>
        <div class="dashboard__form contact-page__form">
          <validation-observer ref="contact_form">
            <div class="form-group">
              <label for="name">{{ getInputData('firstName', 'label') }}</label>
              <input v-model="messageData.firstName" type="text" class="form-group__text" name="name" id="name" :placeholder="getInputData('firstName', 'placeholder') || ''">
            </div>

            <div class="form-group">
              <label for="name">{{ getInputData('lastName', 'label') }}</label>
              <input v-model="messageData.lastName" type="text" class="form-group__text" name="name" id="name" :placeholder="getInputData('lastName', 'placeholder') || ''">
            </div>

            <validation-provider v-slot="{ errors }" :name="getInputData('email', 'label')" rules="required|email">
              <div class="form-group">
                <label for="name">{{ getInputData('email', 'label') }} *</label>
                <input v-model="messageData.email" type="text" class="form-group__text" name="name" id="name" :placeholder="getInputData('email', 'placeholder') || ''">
                <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
              </div>
            </validation-provider>

            <validation-provider v-slot="{ errors }" :name="getInputData('phoneNumber', 'label')" rules="phone_number">
              <div class="form-group">
                <label for="name">{{ getInputData('phoneNumber', 'label') }}</label>
                <input v-model="messageData.phoneNumber" type="text" class="form-group__text" name="name" id="name" :placeholder="getInputData('phoneNumber', 'placeholder') || ''">
                <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
              </div>
            </validation-provider>

            <div class="form-group">
              <label for="name">{{ getInputData('companyName', 'label') }}</label>
              <input v-model="messageData.companyName" type="text" class="form-group__text" name="name" id="name" :placeholder="getInputData('companyName', 'placeholder') || ''">
            </div>

            <validation-provider v-slot="{ errors }" :name="getInputData('message', 'label')" rules="required">
              <div class="form-group">
                <label for="name">{{ getInputData('message', 'label') }} *</label>
                <textarea v-model="messageData.message" rows="4" class="form-group__text" name="name" id="name" :placeholder="getInputData('message', 'placeholder') || ''"></textarea>
                <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
              </div>
            </validation-provider>
          </validation-observer>

          <div class="mt-xs-40 contact-page__accept-terms">
            <div>
              <div class="form-group-checkbox form-group-checkbox--centered">
                <div>
                  <input @change="onAcceptTermsChange" type="checkbox" v-model="messageData.privacyTermsAccepted" id="terms">
                  <label for="terms">By submitting my personal information, I accept the <router-link to="/privacy">Privacy Policy</router-link></label>
                </div>
                <span class="contact-page__accept-terms__errors mt-xs-10" v-if="isErrorTermsNotAccepted">You must accept Privacy Policy to Register</span>
              </div>
            </div>
          </div>
          <div class="contact-page__btn-container mt-xs-40">
            <button class="btn btn--std btn--blue" @click="submitMessage">submit</button>
          </div>
        </div>
      </div>
    </div>
    <div class="contact-page__footer">
      <div class="xs_container">
        <p>If your are interested in learning about trading your datasets and becoming a Topio vendor or finding and using new datasets, please also visit our <router-link to="/faq">Frequently Asked Questions</router-link> page.</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import { required, email } from 'vee-validate/dist/rules';
import {
  ValidationProvider,
  ValidationObserver,
  extend,
  localize,
} from 'vee-validate';
import en from 'vee-validate/dist/locale/en.json';
import Modal from '@/components/Modal.vue';
import MessageApi from '@/service/message';
import { EnumContactFormType, ContactMessage } from '@/model/message';
import { getFormInputData } from '@/helper/form-config';
import { inputsConfig } from '@/config/contact';
import store from '@/store';

extend('required', required);
extend('email', email);
localize({
  en,
});

const phoneNumberValidator = {
  validate(value: string) {
    if (value.split('').every((x) => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+'].includes(x))) return true;
    return false;
  },
};
extend('phone_number', phoneNumberValidator);

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    Modal,
  },
})
export default class MatchFinderForm extends Vue {
  messageApi = new MessageApi();

  messageData: ContactMessage = {
    type: EnumContactFormType.DATA_MATCH,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    message: '',
    privacyTermsAccepted: false,
  };

  isErrorTermsNotAccepted = false;

  isShownModalMessageSent = false;

  mounted(): void {
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 200);
  }

  getInputData(id: string, type: 'label' | 'placeholder' | 'customErrorMessages'): string | {[key: string]: string} | null {
    return getFormInputData(inputsConfig, type, id);
  }

  onAcceptTermsChange(): void {
    this.isErrorTermsNotAccepted = false;
  }

  submitMessage(): void {
    if (!this.messageData.privacyTermsAccepted) {
      this.isErrorTermsNotAccepted = true;
      return;
    }

    (this.$refs.contact_form as InstanceType<typeof ValidationObserver>).validate().then((success) => {
      if (!success) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        return;
      }

      store.commit('setLoading', true);
      this.messageApi.submitContactForm(this.messageData).then((response) => {
        if (response.success) {
          this.isShownModalMessageSent = true;
          store.commit('setLoading', false);
        }
      });
    });
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_page.scss";
  @import "@/assets/styles/_forms.scss";
  @import "@/assets/styles/_contact.scss";

  .input-prefix-container {
    display: flex;
    align-items: center;
    background: #fff;
    border: 1px solid $darkColor;
    border-radius: 25px;
    padding-left: 0.5rem;
    overflow: hidden;
    font-family: sans-serif;
    margin-bottom: 10px;

    >span {
      font-weight: 300;
      font-size: 14px;
      color: $labelColor;
    }

    input {
      flex-grow: 1;
      background: #fff;
      border: none;
      outline: none;
      margin-bottom: 0;
    }

    .contact-page__form {
      background: transparent;
    }
  }
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
