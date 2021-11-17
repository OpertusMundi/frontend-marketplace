<template>
  <div class="login">
    <div class="login__content">
      <router-link to="/" class="login__content__logo"><img src="@/assets/images/logo_blue.svg" alt=""></router-link>
      <h1>Register</h1>
      <validation-observer ref="registrationForm">
      <form class="login__form login__form--small-margin" @submit.prevent="submitRegistration()">
          <validation-provider name="Email" rules="required|email" v-slot="{ errors }">
            <div class="login__form__group">
              <input @input="onEmailChange" type="text" name="Email" id="email" v-model="account.email" placeholder="Email">
              <span class="login__form__group__error">{{ errors[0] }}</span>
              <span class="login__form__group__error" v-if="emailTakenError">An account with this email already exists.</span>
            </div>
          </validation-provider>
          <validation-provider name="Password" rules="required" v-slot="{ errors }" vid="password">
            <div class="login__form__group">
              <input type="password" name="Password" id="password" v-model="account.password" placeholder="Password">
              <span class="login__form__group__error">{{ errors[0] }}</span>
            </div>
          </validation-provider>
          <validation-provider name="Password verification" rules="required|confirmed:password" v-slot="{ errors }">
            <div class="login__form__group">
              <input type="password" name="Password verification" id="passwordVerification" v-model="account.verifyPassword" placeholder="Re-enter password">
              <span class="login__form__group__error">{{ errors[0] }}</span>
            </div>
          </validation-provider>
          <validation-provider name="First name" rules="required" v-slot="{ errors }">
            <div class="login__form__group">
              <input type="text" name="First name" v-model="account.profile.firstName" id="firstName" placeholder="First Name">
              <span class="login__form__group__error">{{ errors[0] }}</span>
            </div>
          </validation-provider>
          <validation-provider name="Last name" rules="required" v-slot="{ errors }">
            <div class="login__form__group">
              <input type="text" name="Last name" v-model="account.profile.lastName" id="lastName" placeholder="Last Name">
              <span class="login__form__group__error">{{ errors[0] }}</span>
            </div>
          </validation-provider>
          <validation-provider name="Mobile" rules="required" v-slot="{ errors }">
            <div class="login__form__group">
              <input type="text" name="Mobile" v-model="account.profile.mobile" id="mobile" placeholder="Mobile">
              <span class="login__form__group__error">{{ errors[0] }}</span>
            </div>
          </validation-provider>

          <div>
            <!-- <div class="d-flex align-items-center justify-content-center">
              <input class="mr-xs-10" @change="onAcceptTermsChange" type="checkbox" v-model="termsAccepted" id="terms">
              <label for="terms">I 've read and accept <strong><a class="login__helpers" href="/terms">Terms & Conditions</a></strong></label>
            </div> -->
            <div>
              <div class="form-group-checkbox form-group-checkbox--centered">
                <input @change="onAcceptTermsChange" type="checkbox" v-model="termsAccepted" id="terms">
                <label for="terms">I 've read and accept the <strong><a class="login__helpers" href="/terms">Terms & Conditions</a></strong></label>
              </div>
            </div>
            <span class="login__form__errors" v-if="termsNotAcceptedError">You must accept Terms & Conditions to Register.</span>
          </div>

          <div class="login__form__errors" v-if="formErrors">{{ formErrors }}</div>
          <button type="submit" class="btn btn--std btn--blue" :disabled="loading" v-html="loading ? 'PLEASE WAIT..' : 'REGISTER'"></button>
      </form>
      </validation-observer>
      <div class="login__helpers">
        <router-link to="/signin">Already have an account? Log in</router-link><br>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { required, email, confirmed } from 'vee-validate/dist/rules';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import store from '@/store';
import AccountApi from '@/service/account';
import { fetchUserProfileAndCart } from '@/helper/user';
// import { ServerResponse } from '@/model';
import { PlatformAccountCommand, AccountProfileCommand } from '@/model/account';

extend('required', required);
extend('email', email);
extend('confirmed', confirmed);


@Component({
  components: { ValidationProvider, ValidationObserver },
})
export default class Login extends Vue {
  $refs!: {
    registrationForm: InstanceType<typeof ValidationObserver>
  }

  accountApi: AccountApi;

  account: PlatformAccountCommand;

  termsAccepted: boolean;

  loading: boolean;

  formErrors: string;

  emailTakenError: boolean;

  termsNotAcceptedError: boolean;

  constructor() {
    super();

    this.accountApi = new AccountApi();

    this.termsAccepted = false;
    this.loading = false;
    this.formErrors = '';
    this.emailTakenError = false;
    this.termsNotAcceptedError = false;

    this.account = {
      email: '',
      password: '',
      verifyPassword: '',
      profile: {
        firstName: '',
        lastName: '',
        mobile: '',
      } as AccountProfileCommand,
    };
  }

  mounted(): void {
    console.log('ok');
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
        this.accountApi.login(this.account.email, this.account.password).then((loginResponse) => {
          if (loginResponse.success) {
            // Set CSRF Token
            const { csrfToken: token, csrfHeader: header } = loginResponse.result;
            store.commit('setCsrfToken', { token, header });

            fetchUserProfileAndCart().then((res) => {
              if (res.success) {
                this.loading = false;
                this.$router.push('/confirmemail');
              } else {
                console.log('error fetching user profile and cart');
              }
            });
          } else {
            // todo: handle error
            console.log('error loggin in', loginResponse);
          }
        });
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
  // borrows styling from _login.scss
  @import "@/assets/styles/_login.scss";
  @import "@/assets/styles/_forms.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
</style>
