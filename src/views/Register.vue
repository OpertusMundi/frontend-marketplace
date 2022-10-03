<template>
  <div class="become-vendor-registration">
    <shape-register></shape-register>
    <div class="text-container">
      <div class="text-inner">
        <template v-if="$route.name === 'RegisterVendor'">
          <h3>Publish. Sell. Grow.</h3>
          <p class="mt-xs-5 mb-xs-20">Create a topio supplier account to sell your assets and expand their value through the services available.</p>
          <p class="mb-xs-20">In order to complete your supplier registration you will need to provide info regarding the Company, its Legal Representative and an assigned Bank Account.</p>
          <p class="text-small mb-xs-5">KYC and UBO validations are also required before publishing your assets.</p>
        </template>
        <template v-if="$route.name === 'Register'">
          <router-link to="/">
            <svg xmlns="http://www.w3.org/2000/svg" width="214" height="79.692" viewBox="0 0 214 79.692"><path data-name="Path 1" d="M11.5 19.402V5.395h9.515v14.007h12.457v7.743H21.015v24.703q0 2.609 2.423 2.609h8.734v7.829h-12.02a8.359 8.359 0 0 1-6.27-2.434 8.811 8.811 0 0 1-2.382-6.439V27.148H0v-7.743Z" fill="#fff"/><path data-name="Path 2" d="M40.74 28.885a19.868 19.868 0 0 1 7.915-7.918 23.407 23.407 0 0 1 11.462-2.782 23.162 23.162 0 0 1 11.418 2.782 19.925 19.925 0 0 1 7.869 7.918 26.48 26.48 0 0 1 0 23.925 19.9 19.9 0 0 1-7.869 7.916 23.126 23.126 0 0 1-11.418 2.784 23.371 23.371 0 0 1-11.462-2.784 19.776 19.776 0 0 1-7.915-7.959 26.41 26.41 0 0 1 0-23.881Zm10.165 22.4a12.789 12.789 0 0 0 18.336 0q3.5-3.87 3.5-10.481t-3.5-10.441a12.84 12.84 0 0 0-18.336.045q-3.5 3.872-3.506 10.4 0 6.61 3.506 10.478Z" fill="#fff"/><path data-name="Path 3" d="M75.442 2.209A7.528 7.528 0 0 1 80.902 0a7.647 7.647 0 0 1 5.523 2.121 7.333 7.333 0 0 1 2.193 5.523 7.372 7.372 0 0 1-3.917 6.687 7.914 7.914 0 0 1-3.8.956 7.55 7.55 0 0 1-3.8-1.015 7.8 7.8 0 0 1-2.851-2.777 7.591 7.591 0 0 1 1.189-9.286Zm2.047 8.9a5.165 5.165 0 1 0-1.334-3.463 4.665 4.665 0 0 0 1.336 3.462Z" fill="#fff"/><path data-name="Path 4" d="m160.436 0-2.7 13.3h-1.764l.552-13.3Z" fill="#fff"/><path data-name="Path 5" d="m206.892 0-2.7 13.3h-1.765l.55-13.3ZM214 0l-2.7 13.3h-1.817l.552-13.3Z" fill="#fff"/><path data-name="Path 6" d="M98.39 19.401v6.262h.863q4.931-7.477 14.792-7.479a18.038 18.038 0 0 1 9.731 2.782 20.006 20.006 0 0 1 7.134 7.918 25.361 25.361 0 0 1 2.683 11.92 25.617 25.617 0 0 1-2.683 11.961 19.918 19.918 0 0 1-7.134 7.959 18.011 18.011 0 0 1-9.731 2.784q-9.861 0-14.62-7.308h-.862v23.49h-9.429V19.4Zm22.143 31.972q3.543-3.872 3.545-10.569t-3.545-10.572a12.9 12.9 0 0 0-18.469.045q-3.59 3.912-3.587 10.527t3.587 10.526a12.9 12.9 0 0 0 18.469.043Z" fill="#fff"/><path data-name="Path 7" d="M151.066 62.291h-9.429v-42.89h9.429Z" fill="#fff"/><path data-name="Path 8" d="M161.962 28.885a19.878 19.878 0 0 1 7.914-7.918 23.41 23.41 0 0 1 11.462-2.782 23.146 23.146 0 0 1 11.415 2.782 19.921 19.921 0 0 1 7.873 7.918 26.489 26.489 0 0 1 0 23.925 19.9 19.9 0 0 1-7.873 7.916 23.11 23.11 0 0 1-11.415 2.784 23.374 23.374 0 0 1-11.462-2.784 19.786 19.786 0 0 1-7.914-7.959 26.4 26.4 0 0 1 0-23.881Zm10.164 22.4a12.789 12.789 0 0 0 18.335 0q3.5-3.87 3.505-10.481t-3.505-10.441a12.839 12.839 0 0 0-18.335.045q-3.5 3.872-3.5 10.4-.004 6.61 3.5 10.478Z" fill="#fff"/><path data-name="Path 1" d="M11.5 19.402V5.395h9.515v14.007h12.457v7.743H21.015v24.703q0 2.609 2.423 2.609h8.734v7.829h-12.02a8.359 8.359 0 0 1-6.27-2.434 8.811 8.811 0 0 1-2.382-6.439V27.148H0v-7.743Z" fill="#fff"/><path data-name="Path 2" d="M40.74 28.885a19.868 19.868 0 0 1 7.915-7.918 23.407 23.407 0 0 1 11.462-2.782 23.162 23.162 0 0 1 11.418 2.782 19.925 19.925 0 0 1 7.869 7.918 26.48 26.48 0 0 1 0 23.925 19.9 19.9 0 0 1-7.869 7.916 23.126 23.126 0 0 1-11.418 2.784 23.371 23.371 0 0 1-11.462-2.784 19.776 19.776 0 0 1-7.915-7.959 26.41 26.41 0 0 1 0-23.881Zm10.165 22.4a12.789 12.789 0 0 0 18.336 0q3.5-3.87 3.5-10.481t-3.5-10.441a12.84 12.84 0 0 0-18.336.045q-3.5 3.872-3.506 10.4 0 6.61 3.506 10.478Z" fill="#fff"/><path data-name="Path 3" d="M75.442 2.209A7.528 7.528 0 0 1 80.902 0a7.647 7.647 0 0 1 5.523 2.121 7.333 7.333 0 0 1 2.193 5.523 7.372 7.372 0 0 1-3.917 6.687 7.914 7.914 0 0 1-3.8.956 7.55 7.55 0 0 1-3.8-1.015 7.8 7.8 0 0 1-2.851-2.777 7.591 7.591 0 0 1 1.189-9.286Zm2.047 8.9a5.165 5.165 0 1 0-1.334-3.463 4.665 4.665 0 0 0 1.336 3.462Z" fill="#fff"/><path data-name="Path 4" d="m160.436 0-2.7 13.3h-1.764l.552-13.3Z" fill="#fff"/><path data-name="Path 5" d="m206.892 0-2.7 13.3h-1.765l.55-13.3ZM214 0l-2.7 13.3h-1.817l.552-13.3Z" fill="#fff"/><path data-name="Path 6" d="M98.39 19.401v6.262h.863q4.931-7.477 14.792-7.479a18.038 18.038 0 0 1 9.731 2.782 20.006 20.006 0 0 1 7.134 7.918 25.361 25.361 0 0 1 2.683 11.92 25.617 25.617 0 0 1-2.683 11.961 19.918 19.918 0 0 1-7.134 7.959 18.011 18.011 0 0 1-9.731 2.784q-9.861 0-14.62-7.308h-.862v23.49h-9.429V19.4Zm22.143 31.972q3.543-3.872 3.545-10.569t-3.545-10.572a12.9 12.9 0 0 0-18.469.045q-3.59 3.912-3.587 10.527t3.587 10.526a12.9 12.9 0 0 0 18.469.043Z" fill="#fff"/><path data-name="Path 7" d="M151.066 62.291h-9.429v-42.89h9.429Z" fill="#fff"/><path data-name="Path 8" d="M161.962 28.885a19.878 19.878 0 0 1 7.914-7.918 23.41 23.41 0 0 1 11.462-2.782 23.146 23.146 0 0 1 11.415 2.782 19.921 19.921 0 0 1 7.873 7.918 26.489 26.489 0 0 1 0 23.925 19.9 19.9 0 0 1-7.873 7.916 23.11 23.11 0 0 1-11.415 2.784 23.374 23.374 0 0 1-11.462-2.784 19.786 19.786 0 0 1-7.914-7.959 26.4 26.4 0 0 1 0-23.881Zm10.164 22.4a12.789 12.789 0 0 0 18.335 0q3.5-3.87 3.505-10.481t-3.505-10.441a12.839 12.839 0 0 0-18.335.045q-3.5 3.872-3.5 10.4-.004 6.61 3.5 10.478Z" fill="#fff"/></svg>
          </router-link>
          <h3 class="mt-xs-20">Explore. Create. Expand.</h3>
          <p class="mt-xs-5 mb-xs-20">Create your topio account for free and start buying and using the geospatial assets and services available in the catalogue.</p>
          <p class="text-small mb-xs-5">KYC validation is required before completing any transaction.</p>
        </template>
        <p class="text-small">Topio user roles are explicitly explained in our <router-link to="/faq">FAQ page</router-link>.</p>
      </div>
    </div>
    <div class="become-vendor-registration__form__container">
      <div class="become-vendor-registration__form">
        <h1 v-if="$route.name === 'RegisterVendor'" class="mt-xs-40">Become a topio Supplier</h1>
        <h1 v-if="$route.name === 'Register'" class="mt-xs-40">Register</h1>
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
            <button type="submit" class="btn btn--std btn--blue btn-register" :disabled="loading" v-html="loading ? 'PLEASE WAIT..' : 'REGISTER'"></button>

            <div>
              <div class="alternative-login-label">
                <hr>
                <span>Or register with</span>
                <hr>
              </div>
              <div class="alternative-login-btn__container">
                <a href="https://beta.topio.market/oauth2/authorization/github" class="alternative-login-btn alternative-login-btn--left">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20.506" height="20" viewBox="0 0 20.506 20"><defs><clipPath id="a"><path data-name="Rectangle 5694" fill="#333" d="M0 0h20.506v20H0z"/></clipPath></defs><g data-name="Group 7742"><g data-name="Group 7741" clip-path="url(#a)"><path data-name="Path 14414" d="M10.252 0a10.254 10.254 0 0 0-3.24 19.982c.512.094.7-.223.7-.495 0-.243-.009-.888-.014-1.744-2.851.619-3.454-1.375-3.454-1.375a2.719 2.719 0 0 0-1.139-1.5c-.931-.636.071-.623.071-.623A2.154 2.154 0 0 1 4.747 15.3a2.183 2.183 0 0 0 2.983.852 2.188 2.188 0 0 1 .651-1.371c-2.277-.259-4.67-1.139-4.67-5.068a3.964 3.964 0 0 1 1.056-2.747 3.684 3.684 0 0 1 .1-2.713s.86-.276 2.819 1.051a9.723 9.723 0 0 1 5.134 0c1.958-1.327 2.817-1.051 2.817-1.051a3.675 3.675 0 0 1 .1 2.713 3.958 3.958 0 0 1 1.055 2.751c0 3.939-2.4 4.806-4.682 5.059a2.447 2.447 0 0 1 .7 1.9c0 1.37-.013 2.476-.013 2.812 0 .274.185.594.7.493A10.255 10.255 0 0 0 10.252 0" fill="#333" fill-rule="evenodd"/></g></g></svg>
                  GITHUB
                </a>
                <a href="https://beta.topio.market/oauth2/authorization/google" class="alternative-login-btn alternative-login-btn--right">
                  <svg xmlns="http://www.w3.org/2000/svg" width="19.6" height="20" viewBox="0 0 19.6 20"><defs><clipPath id="a"><path data-name="Rectangle 5695" fill="#333" d="M0 0h19.6v20H0z"/></clipPath></defs><g data-name="Group 7747"><g data-name="Group 7746" clip-path="url(#a)" fill="#333"><path data-name="Path 14415" d="M19.6 10.222Z"/><path data-name="Path 14416" d="M10 8.178v3.711h5.511a4.887 4.887 0 0 1-2.044 3.244 5.919 5.919 0 0 1-3.467 1 6.02 6.02 0 0 1-5.689-4.155 6.156 6.156 0 0 1-.333-1.976 6.469 6.469 0 0 1 .322-1.98A6.045 6.045 0 0 1 10 3.867a5.542 5.542 0 0 1 3.867 1.489l2.822-2.754A9.608 9.608 0 0 0 10 .002a10 10 0 0 0 0 20 9.531 9.531 0 0 0 6.622-2.422 9.777 9.777 0 0 0 2.978-7.358 8.569 8.569 0 0 0-.211-2.044Z"/></g></g></svg>
                  GOOGLE
                </a>
              </div>
            </div>

            <div class="login__helpers">Already a topio user? <a @click.prevent="loginWithKeycloak">LOG IN</a></div>
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
import { navigateToKeycloakLogin } from '@/helper/login';
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

  loginWithKeycloak(): void {
    navigateToKeycloakLogin('/dashboard');
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
    svg.shape-svg {
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

          a {
            color: $greyColor;
            text-decoration: underline;
          }
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

    .alternative-login-label {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin: 1em 0;

      hr {
        flex-grow: 1;
        background: $darkColor;
        height: 2px;
      }
    }

    .alternative-login-btn {
      background: #fff;
      border: none;
      padding: 9px 20px 9px;
      font-size: 0.94em;
      letter-spacing: 0.04em;
      font-weight: 500;
      color: var(--darkColor) !important;
      text-decoration-line: none !important;
      display: flex;
      align-items: center;
      gap: 10px;

      &__container {
        display: flex;
        justify-content: center;
        gap: 2px;
        margin: .6em 0 2em 0;

        svg {
          margin: 0;
        }
      }

      &:hover {
        box-shadow: 0 5px 7px #c4c4c4;
      }

      &--left {
        border-radius: 32px 0 0 32px;
      }
      &--right {
        border-radius: 0 32px 32px 0;
      }
    }

    .btn-register {
      transition: all ease-in-out .05s;
      border: solid 2px $secondColor;
      padding: 11px 20px 10px;

      &:hover {
        background: transparent;
        border: solid 2px $secondColor;
        color: $secondColor !important;
      }
    }
  }
</style>
