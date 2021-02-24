<template>
  <div class="page becomevendor">
    <div class="page__inner">
      <div class="m_container">
        <h1>Become a vendor</h1>
        <div class="dashboard__form pb-sm-100">
          <ul class="dashboard__form__nav">
            <li><a href="#" :class="[currentStep == 1 ? 'active' : '', currentStep < 1 ? 'inactive' : '']" @click="goToStep(1)">Company</a></li>
            <li><a href="#" :class="[currentStep == 2 ? 'active' : '', currentStep < 2 ? 'inactive' : '']" @click="goToStep(2)">Legal representative</a></li>
            <li><a href="#" :class="[currentStep == 3 ? 'active' : '', currentStep < 3 ? 'inactive' : '']" @click="goToStep(3)">Bank account</a></li>
            <li><a href="#" :class="[currentStep == 4 ? 'active' : '', currentStep < 4 ? 'inactive' : '']" @click="goToStep(4)">Review</a></li>
          </ul>
          <div class="dashboard__form__steps">

            <!-- STEP 1 - Company -->
            <validation-observer ref="step1">
              <div class="dashboard__form__step" v-if="currentStep == 1">

                <validation-provider v-slot="{ errors }" name="VAT Number" rules="required|length:9">
                  <div class="form-group">
                    <label for="vat_number">VAT number:</label>
                    <input type="text" class="form-group__text" name="vat_number" id="vat_number" v-model="vendorData.companyNumber">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Name" rules="required">
                  <div class="form-group">
                    <label for="name">Name:</label>
                    <input type="text" class="form-group__text" name="name" id="name" v-model="vendorData.name">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Website">
                  <div class="form-group">
                    <label for="website">Website:</label>
                    <input type="text" class="form-group__text" name="website" id="website" v-model="vendorData.website">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Address Line 1" rules="required">
                  <div class="form-group">
                    <label for="address_line_1">Address Line 1:</label>
                    <input type="text" class="form-group__text" name="address_line_1" id="address_line_1" v-model="vendorData.headquartersAddress.line1">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Address Line 2">
                  <div class="form-group">
                    <label for="address_line_2">Address Line 2:</label>
                    <input type="text" class="form-group__text" name="address_line_2" id="address_line_2" v-model="vendorData.headquartersAddress.line2">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Country" rules="required">
                  <div class="form-group">
                    <label for="country">Country:</label>
                    <input type="text" class="form-group__text" name="country" id="country" v-model="vendorData.headquartersAddress.country">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Region" rules="required">
                  <div class="form-group">
                    <label for="region">Region:</label>
                    <input type="text" class="form-group__text" name="region" id="region" v-model="vendorData.headquartersAddress.region">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="City" rules="required">
                  <div class="form-group">
                    <label for="city">City:</label>
                    <input type="text" class="form-group__text" name="city" id="city" v-model="vendorData.headquartersAddress.city">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Postal Code" rules="required">
                  <div class="form-group">
                    <label for="postal_code">ZIP code:</label>
                    <input type="text" class="form-group__text" name="postal_code" id="postal_code" v-model="vendorData.headquartersAddress.postalCode">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

              </div>
            </validation-observer>

            <!-- <validation-observer ref="step1">
              <div class="dashboard__form__step" v-if="currentStep == 1">
                <validation-provider v-slot="{ errors }" name="First name" rules="required">
                  <div class="form-group">
                    <label for="first_name">First name:</label>
                    <input type="text" class="form-group__text" name="first_name" id="first_name" v-model="firstName">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>
                <validation-provider v-slot="{ errors }" name="Last name" rules="required">
                  <div class="form-group">
                    <label for="last_name">Last name:</label>
                    <input type="text" class="form-group__text" name="last_name" id="last_name" v-model="lastName">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>
                <validation-provider v-slot="{ errors }" name="Email" rules="required|email">
                  <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="text" class="form-group__text" name="email" id="email" v-model="vendorData.email">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>
                <validation-provider v-slot="{ errors }" name="Phone" rules="required|phoneNumber">
                  <div class="form-group">
                    <label for="phone">Phone:</label>
                    <input type="text" class="form-group__text" name="phone" id="phone" v-model="vendorData.phone">
                    <!- - <VuePhoneNumberInput required v-model="vendorData.phone" @update="checkPhoneNumber" /> - ->
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>
                <validation-provider v-slot="{ errors }" name="Username" rules="required|min:4">
                  <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" class="form-group__text" name="username" id="username" v-model="vendorData.username">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>
                <validation-provider v-slot="{ errors }" name="Password" rules="required|min:6">
                  <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" class="form-group__text" name="password" id="password" v-model="vendorData.password">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>
                <validation-provider v-slot="{ errors }" name="Password Repeat" rules="required|confirmed:Password">
                  <div class="form-group">
                    <label for="password_repeat">Password repeat:</label>
                    <input type="password" class="form-group__text" name="password_repeat" id="password_repeat" v-model="vendorData.password_repeat">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>
              </div>
            </validation-observer> -->

            <!-- STEP 2 - Legal Representative -->
            <validation-observer ref="step2">
              <div class="dashboard__form__step" v-if="currentStep == 2">

                <validation-provider v-slot="{ errors }" name="First name" rules="required">
                  <div class="form-group">
                    <label for="first_name">First name:</label>
                    <input type="text" class="form-group__text" name="first_name" id="first_name" v-model="vendorData.legalRepresentative.firstName">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Last name" rules="required">
                  <div class="form-group">
                    <label for="last_name">Last name:</label>
                    <input type="text" class="form-group__text" name="last_name" id="last_name" v-model="vendorData.legalRepresentative.lastName">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Email" rules="required|email">
                  <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="text" class="form-group__text" name="email" id="email" v-model="vendorData.legalRepresentative.email">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Birthdate" rules="required|email">
                  <div class="form-group">
                    <label for="email">Birthdate:</label>
                    <input type="text" class="form-group__text" name="email" id="email" v-model="vendorData.legalRepresentative.email">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

              </div>
            </validation-observer>

          </div>
          <div class="dashboard__form__navbuttons">
            <button class="btn--std btn--blue" @click.prevent="previousStep()" v-if="currentStep > 1">PREVIOUS</button>
            <button class="btn--std btn--blue" @click.prevent="nextStep()">{{ currentStep === totalSteps ? 'confirm and create account' : 'NEXT' }}</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  ProviderProfessionalCommand,
  BankAccountCommand,
  EnumCustomerType,
  AddressCommand,
  EnumLegalPersonType,
  CustomerRepresentativeCommand,
} from '@/model/account';
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import {
  required,
  email,
  confirmed,
  min,
  length,
} from 'vee-validate/dist/rules';
import {
  ValidationProvider,
  ValidationObserver,
  extend,
  localize,
} from 'vee-validate';
import en from 'vee-validate/dist/locale/en.json';
import PhoneNumber from 'awesome-phonenumber';

extend('required', required);
extend('email', email);
extend('confirmed', confirmed);
extend('min', min);
extend('length', length);
localize({
  en,
});
const phoneNumber = {
  validate(value) {
    /* eslint-disable */
    const phone = new PhoneNumber(value);
    if (phone.isValid()) {
      return true;
    }
    return `Phone field ${phone.toJSON().possibility.replace(/-/g, ' ')}`;
  },
};
extend('phoneNumber', phoneNumber);

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    VuePhoneNumberInput,
  },
})
export default class BecomeVendor extends Vue {
  $refs!: {
    step1: InstanceType<typeof ValidationObserver>,
    step2: InstanceType<typeof ValidationObserver>,
    step3: InstanceType<typeof ValidationObserver>,
    step4: InstanceType<typeof ValidationObserver>,
  }

  totalSteps = 4;

  currentStep = 1;

  vendorData: ProviderProfessionalCommand;

  // firstName: '';

  // lastName: '';

  phoneValid: boolean;

  constructor() {
    super();

    // this.firstName = '';
    // this.lastName = '';
    this.phoneValid = true;
    this.vendorData = {
      // name: `${this.firstName} ${this.lastName}`,
      name: '',
      phone: '',
      email: '',
      type: EnumCustomerType.PROFESSIONAL,
      additionalInfo: '',
      companyNumber: '',
      companyType: '',
      headquartersAddress: {
        line1: '',
        line2: '',
        city: '',
        region: '',
        postalCode: '',
        country: '',
      } as AddressCommand,
      legalPersonType: '' as EnumLegalPersonType,
      legalRepresentative: {
        birthdate: '',
        countryOfResidence: '',
        nationality: '',
        email: '',
        firstName: '',
        lastName: '',
        address: {
          line1: '',
          line2: '',
          city: '',
          region: '',
          postalCode: '',
          country: '',
        } as AddressCommand,
      } as CustomerRepresentativeCommand,
      logoImage: '',
      logoImageMimeType: '',
      siteUrl: '',
      bankAccount: {
        ownerName: '',
        iban: '',
        bic: '',
        ownerAddress: {
          line1: '',
          line2: '',
          city: '',
          region: '',
          postalCode: '',
          country: '',
        } as AddressCommand,
      } as BankAccountCommand,
    };
  }

  goToStep(step:number):void {
    this.currentStep = step;
  }

  previousStep():void {
    if (this.currentStep >= 1) {
      this.currentStep -= 1;
    }
  }

  nextStep():void {
    console.log(this.vendorData);
    this.$refs[`step${this.currentStep}`].validate().then((success) => {
      if (success) {
        if (this.currentStep === this.totalSteps) {
          // this.submitForm();
        } else {
          this.currentStep += 1;
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      }
    });
  }

  checkPhoneNumber(phone:string):void {
    console.log('ok');
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_page.scss";
  @import "@/assets/styles/_becomevendor.scss";
  @import "@/assets/styles/_forms.scss";
</style>
