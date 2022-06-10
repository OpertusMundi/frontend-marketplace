<template>
  <div class="become-vendor-registration">
    <shape-register></shape-register>
    <div class="text-container">
      <div class="text-inner">
        <h3>Publish. Sell. Grow.</h3>
        <p class="mt-xs-5 mb-xs-20">Create a topio supplier account to sell your assets and expand their value through the services available.</p>
        <p class="mb-xs-20">In order to complete your supplier registration you will need to provide info regarding the Company, its Legal Representative and an assigned Bank Account.</p>
        <p class="text-small mb-xs-5">KYC and UBO validations are also required before publishing your assets.</p>
        <p class="text-small">Topio user roles are explicitly explained in our FAQ page.</p>
      </div>
    </div>
    <div class="become-vendor-registration__form__container">
      <div class="become-vendor-registration__form">
        <h1 class="mt-xs-40">Become a topio Supplier</h1>
        <validation-observer ref="registrationForm">
          <form class="login__form login__form--small-margin mb-xs-40" @submit.prevent="submitRegistration()">
            <validation-provider :name="getInputData('email', 'label')" rules="required|email" v-slot="{ errors }">
              <div class="login__form__group">
                <input @input="onEmailChange" type="text" name="Email" id="email" v-model="account.email" :placeholder="getInputData('email', 'placeholder') || ''">
                <span class="login__form__group__error">{{ errors[0] }}</span>
                <span class="login__form__group__error" v-if="emailTakenError">An account with this email already exists</span>
              </div>
            </validation-provider>
            <validation-provider :name="getInputData('firstName', 'label')" rules="required" v-slot="{ errors }">
              <div class="login__form__group">
                <input type="text" name="First name" v-model="account.profile.firstName" id="firstName" :placeholder="getInputData('firstName', 'placeholder') || ''">
                <span class="login__form__group__error">{{ errors[0] }}</span>
              </div>
            </validation-provider>
            <validation-provider :name="getInputData('lastName', 'label')" rules="required" v-slot="{ errors }">
              <div class="login__form__group">
                <input type="text" name="Last name" v-model="account.profile.lastName" id="lastName" :placeholder="getInputData('lastName', 'placeholder') || ''">
                <span class="login__form__group__error">{{ errors[0] }}</span>
              </div>
            </validation-provider>
            <validation-provider :name="getInputData('mobile', 'label')" rules="required" v-slot="{ errors }">
              <div class="login__form__group">
                <input type="text" name="Mobile" v-model="account.profile.mobile" id="mobile" :placeholder="getInputData('mobile', 'placeholder') || ''">
                <span class="login__form__group__error">{{ errors[0] }}</span>
              </div>
            </validation-provider>

            <label class="login__form__mandatory-msg">Fields marked with * are mandatory</label>

            <div class="mt-xs-40">
              <div>
                <div class="form-group-checkbox form-group-checkbox--centered">
                  <input @change="onAcceptTermsChange" type="checkbox" v-model="termsAccepted" id="terms">
                  <label for="terms">I 've read and accept the <strong><a class="login__helpers" href="/terms">Terms & Conditions</a></strong></label>
                </div>
              </div>
              <span class="login__form__errors" v-if="termsNotAcceptedError">You must accept Terms & Conditions to Register</span>
            </div>

            <div class="login__form__errors" v-if="formErrors">{{ formErrors }}</div>
            <button type="submit" class="btn btn--std btn--blue" :disabled="loading" v-html="loading ? 'PLEASE WAIT..' : 'REGISTER'"></button>
          </form>
        </validation-observer>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ShapeRegister from '@/components/ShapeRegister.vue';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required, email, confirmed } from 'vee-validate/dist/rules';
import AccountApi from '@/service/account';
import { getFormInputData } from '@/helper/form-config';
import { inputsConfig } from '@/config/register';
import { PlatformAccountCommand, AccountProfileCommand } from '@/model/account';

extend('required', required);
extend('email', email);
extend('confirmed', confirmed);

@Component({
  components: { ShapeRegister, ValidationProvider, ValidationObserver },
})
export default class Login extends Vue {
  $refs!: {
    registrationForm: InstanceType<typeof ValidationObserver>
  }

  accountApi = new AccountApi();

  account: PlatformAccountCommand = {
    email: '',
    profile: {
      firstName: '',
      lastName: '',
      mobile: '',
    } as AccountProfileCommand,
  };

  loading = false;

  termsAccepted = false;

  termsNotAcceptedError = false;

  emailTakenError = false;

  formErrors = '';

  getInputData(id: string, type: 'label' | 'placeholder' | 'customErrorMessages'): string | {[key: string]: string} | null {
    return getFormInputData(inputsConfig, type, id);
  }

  onEmailChange(): void {
    this.emailTakenError = false;
  }

  onAcceptTermsChange(): void {
    this.termsNotAcceptedError = false;
  }

  async submitRegistration(): Promise<void> {
    this.formErrors = '';
    const valid = await this.$refs.registrationForm.validate();
    if (!valid) {
      return;
    }
    if (!this.termsAccepted) {
      this.termsNotAcceptedError = true;
      return;
    }
    console.log('account', this.account);
    this.loading = true;
    this.accountApi.register(this.account).then((registrationResponse) => {
      if (registrationResponse.success) {
        this.$router.push('/confirmemail');
        // this.accountApi.login(this.account.email, this.account.password).then((loginResponse) => {
        //   if (loginResponse.success) {
        //     // Set CSRF Token
        //     const { csrfToken: token, csrfHeader: header } = loginResponse.result;
        //     store.commit('setCsrfToken', { token, header });

        //     fetchUserProfileAndCart().then((res) => {
        //       if (res.success) {
        //         this.loading = false;
        //         this.$router.push('/confirmemail');
        //       } else {
        //         console.log('error fetching user profile and cart');
        //       }
        //     });
        //   } else {
        //     // todo: handle error
        //     console.log('error loggin in', loginResponse);
        //   }
        // });
      } else {
        // todo: handle error
        console.log('error registering', registrationResponse);
        if (registrationResponse.messages.some((x) => x.description === 'NotUnique')) {
          this.emailTakenError = true;
        }
        this.loading = false;
      }
    });
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_login.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import '~flexboxgrid/css/flexboxgrid.min.css';

  .become-vendor-registration {
    height: 100vh;
    max-height: 100vh;
    width: 100vw;
    background: $lightBgColor;
    overflow-x: hidden;
    position: absolute;
    svg {
      display: block;
      position: fixed;
      height: 150vh;
      width: 100%;
      top: -25vh;
      transform: translateX(-28%);
    }

    .text-container {
      position: fixed;
      height: 100vh;
      width: 50vw;
      display: flex;
      align-items: center;
      justify-content: center;

      .text-inner {
        color: #fff;
        max-width: 400px;

        .text-small {
          color: $greyColor;
          font-size: em(14);
        }
      }
    }

    &__form {
      &__container {
        text-align: center;
        margin: 100px 20px 0 20px;
        float: right;
        width: 40%;
        position: relative;
      }
    }
  }
</style>
