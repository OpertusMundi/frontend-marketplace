<template>
  <div class="page becomevendor">
    <div class="page__inner pb-sm-100">
      <div class="m_container">
        <h1>Become a consumer</h1>
        <div class="dashboard__form">
          <ul class="dashboard__form__nav">
            <li><a href="#" :class="[currentStep == 1 ? 'active' : '', currentStep < 1 ? 'inactive' : '']" @click="goToStep(1)">Account Type</a></li>
            <li><a href="#" :class="[currentStep == 2 ? 'active' : '', currentStep < 2 ? 'inactive' : '']" @click="goToStep(2)">Information</a></li>
            <li><a href="#" :class="[currentStep == 3 ? 'active' : '', currentStep < 3 ? 'inactive' : '']" @click="goToStep(3)">Review</a></li>
          </ul>
          <div class="dashboard__form__steps">
            <div class="dashboard__form__steps__inner">

            <!-- STEP 1 - Company -->
            <validation-observer ref="step1">
              <div class="dashboard__form__step" v-if="currentStep == 1">

                <div class="form-group">
                  <label class="control control-radio">
                    Individual
                    <input type="radio" name="account_type" v-model="accountType" value="INDIVIDUAL" />
                    <div class="control_indicator"></div>
                  </label>
                  <label class="control control-radio">
                    Professional
                    <input type="radio" name="account_type" v-model="accountType" value="PROFESSIONAL" />
                    <div class="control_indicator"></div>
                  </label>
                </div>

              </div>
            </validation-observer>

            <!-- STEP 2 - Legal Representative -->

            <validation-observer ref="step2">
              <div class="dashboard__form__step" v-if="currentStep === 2">
                <div v-if="accountType === 'INDIVIDUAL'">
                  <validation-provider v-slot="{ errors }" name="First Name" rules="required">
                    <div class="form-group">
                      <label for="last_name">First Name</label>
                      <input disabled type="text" class="form-group__text" name="first_name" id="first_name" v-model="consumerData.firstName">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>
                  <validation-provider v-slot="{ errors }" name="VAT Number" rules="required">
                    <div class="form-group">
                      <label for="last_name">Last Name</label>
                      <input disabled type="text" class="form-group__text" name="last_name" id="last_name" v-model="consumerData.lastName">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>
                  <validation-provider v-slot="{ errors }" name="Email" rules="required">
                    <div class="form-group">
                      <label for="email">Email</label>
                      <input disabled type="text" class="form-group__text" name="email" id="email" v-model="consumerData.email">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>
                  <validation-provider v-slot="{ errors }" name="Birthdate" rules="required">
                    <div class="form-group">
                      <label for="birthdate">Birthdate *</label>
                      <input type="date" class="form-group__text" name="birthdate" id="birthdate" v-model="consumerData.birthdate">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>
                  <validation-provider v-slot="{ errors }" name="Nationality" rules="required">
                    <div class="form-group">
                      <label for="multiselect_nationality">Nationality</label>
                      <multiselect id="multiselect_nationality" @input="onSelectNationality" v-model="selectedNationality" :options="countries" label="name" track-by="code" placeholder="Select nationality" :multiple="false" :close-on-select="true" :show-labels="false"></multiselect>
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
                    </div>
                  </validation-provider>
                  <validation-provider v-slot="{ errors }" name="Country of residence" rules="required">
                    <div class="form-group">
                      <label for="multiselect_country_residence">Country of residence</label>
                      <multiselect id="multiselect_country_residence" @input="onSelectCountryOfResidence" v-model="selectedCountryOfResidence" :options="countries" label="name" track-by="code" placeholder="Select country of residence" :multiple="false" :close-on-select="true" :show-labels="false"></multiselect>
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
                    </div>
                  </validation-provider>

                  <div class="form-group-checkbox mb-xs-30">
                    <input type="checkbox" v-model="includeAddress" id="terms">
                    <label for="terms">Add address</label>
                  </div>

                  <div v-if="includeAddress">
                    <validation-provider v-slot="{ errors }" name="Address Line 1" rules="required">
                      <div class="form-group">
                        <label for="ba_address_line_1">Address Line 1 *</label>
                        <input type="text" class="form-group__text" name="ba_address_line_1" id="ba_address_line_1" v-model="consumerData.address.line1">
                        <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                      </div>
                    </validation-provider>

                    <validation-provider v-slot="{ errors }" name="Address Line 2">
                      <div class="form-group">
                        <label for="ba_address_line_2">Address Line 2</label>
                        <input type="text" class="form-group__text" name="ba_address_line_2" id="ba_address_line_2" v-model="consumerData.address.line2">
                        <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                      </div>
                    </validation-provider>

                    <div class="wrapper-50-50">
                      <validation-provider v-slot="{ errors }" name="Country" rules="required">
                        <div class="form-group">
                          <!-- <label for="ba_country">Country *</label> -->
                          <!-- <select class="form-group__select" name="ba_country" id="ba_country" v-model="consumerData.address.country">
                            <option v-for="country in countries" :key="country"> {{country}} </option>
                          </select> -->
                          <div class="form-group">
                            <label for="multiselect_country_residence">Country *</label>
                            <multiselect id="multiselect_country_residence" @input="onSelectAddressCountry" v-model="selectedAddressCountry" :options="countries" label="name" track-by="code" placeholder="Select country of residence" :multiple="false" :close-on-select="true" :show-labels="false"></multiselect>
                            <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
                          </div>
                        </div>
                      </validation-provider>

                      <validation-provider v-slot="{ errors }" name="Region" rules="required">
                        <div class="form-group">
                          <label for="ba_region">Region *</label>
                          <input type="text" class="form-group__text" name="ba_region" id="ba_region" v-model="consumerData.address.region">
                          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                        </div>
                      </validation-provider>
                    </div>

                    <div class="wrapper-50-50">
                      <validation-provider v-slot="{ errors }" name="City" rules="required">
                        <div class="form-group">
                          <label for="ba_city">City *</label>
                          <input type="text" class="form-group__text" name="ba_city" id="ba_city" v-model="consumerData.address.city">
                          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                        </div>
                      </validation-provider>

                      <validation-provider v-slot="{ errors }" name="Postal Code" rules="required">
                        <div class="form-group">
                          <label for="ba_postal_code">ZIP code *</label>
                          <input type="text" class="form-group__text" name="ba_postal_code" id="ba_postal_code" v-model="consumerData.address.postalCode">
                          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                        </div>
                      </validation-provider>
                    </div>
                  </div>

                </div>
                <div v-if="accountType === 'PROFESSIONAL'">
                  <h1>professional (todo)</h1>
                </div>
              </div>
            </validation-observer>

            <!-- STEP 3 - Review -->

            <div class="dashboard__form__step" v-if="currentStep === 3">

              <div class="row">
                <div class="col-md-6">
                  <h3>Consumer</h3>
                  <hr>
                  <div class="wrapper-cells">
                    <div><span>First Name: </span> <span> {{ this.consumerData.firstName }} </span></div>
                    <div><span>Last Name: </span> <span> {{ this.consumerData.lastName }} </span></div>
                    <span>Email: </span> <span> {{ this.consumerData.email }} </span>
                    <span>Birthdate: </span> <span> {{ this.consumerData.birthdate | formatDate }} </span>
                    <span>Nationality: </span> <span> {{ this.countries.find((x) => x.code === this.consumerData.nationality).name }} </span>
                    <span>Country of residence: </span> <span> {{ this.countries.find((x) => x.code === this.consumerData.countryOfResidence).name }} </span>
                  </div>
                </div>
                <div class="col-md-6">
                  <h3>Address</h3>
                  <hr>
                  <div v-if="!consumerData.address.country" class="wrapper-cells"><span>Not provided</span></div>
                  <div class="wrapper-cells" v-else>
                    <div><span>Country: </span> <span> {{ this.countries.find((x) => x.code === this.consumerData.address.country).name }} </span></div>
                    <div><span>Region: </span> <span> {{ this.consumerData.address.region }} </span></div>
                    <div><span>City: </span> <span> {{ this.consumerData.address.city }} </span></div>
                    <div><span>Zip code: </span> <span> {{ this.consumerData.address.postalCode }} </span></div>
                    <div><span>Address line 1: </span> <span> {{ this.consumerData.address.line1 }} </span></div>
                    <div v-if="this.consumerData.address.line2"> <span>Address line 2: </span> <span> {{ this.consumerData.address.line2 }} </span> </div>
                  </div>
                </div>
              </div>

              <!-- <div class="wrapper-50-50">
                <div>
                  <h3 class="align-left">Company</h3>
                  <div class="clear"></div>
                  <hr>
                  <div class="wrapper-cells">
                    <div><span>First Name: </span> <span> {{ this.consumerData.firstName }} </span></div>
                    <div><span>Last Name: </span> <span> {{ this.consumerData.lastName }} </span></div>
                    <div v-if="this.consumerData.address.country"><span>Country: </span> <span> {{ this.consumerData.address.country }} </span></div>
                    <div v-if="this.consumerData.address.region"><span>Region: </span> <span> {{ this.consumerData.address.region }} </span></div>
                    <div v-if="this.consumerData.address.city"><span>City: </span> <span> {{ this.consumerData.address.city }} </span></div>
                    <div v-if="this.consumerData.address.postalCode"><span>Zip code: </span> <span> {{ this.consumerData.address.postalCode }} </span></div>
                    <div v-if="this.consumerData.address.line1"><span>Address line 1: </span> <span> {{ this.consumerData.address.line1 }} </span></div>
                    <div v-if="this.consumerData.address.line2"> <span>Address line 2: </span> <span> {{ this.consumerData.address.line2 }} </span> </div>
                  </div>
                </div>

                <div>
                  <h3 class="align-left">Legal Representative</h3>
                  <div class="clear"></div>
                  <hr>
                  <div class="wrapper-cells">
                    <span>Email: </span> <span> {{ this.consumerData.email }} </span>
                    <span>Birthdate: </span> <span> {{ this.consumerData.birthdate | formatDate }} </span>
                    <span>Nationality: </span> <span> {{ this.consumerData.nationality }} </span>
                    <span>Country of residence: </span> <span> {{ this.consumerData.countryOfResidence }} </span>
                  </div>
                </div>
              </div> -->
            </div>
          </div>

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
import { Component, Vue, Watch } from 'vue-property-decorator';
import ConsumerAPI from '@/service/consumer';
import ConfigurationApi from '@/service/config';
import {
  EnumMangopayUserType,
  ConsumerIndividualCommand,
  ConsumerProfessionalCommand,
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
import Multiselect from 'vue-multiselect';
import en from 'vee-validate/dist/locale/en.json';
import PhoneNumber from 'awesome-phonenumber';
import store from '@/store';

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
    Multiselect,
  },
  filters: {
    // input format: yyyy-mm-dd
    // output format: dd Mon yyyy
    formatDate: function(date) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const splitted = date.split('-');
      return splitted[2] + ' ' + months[parseInt(splitted[1]) - 1] + ' ' + splitted[0];
    }
  }
})
export default class BecomeConsumer extends Vue {
  accountType: EnumMangopayUserType;

  consumerApi: ConsumerAPI;

  configurationApi: ConfigurationApi;

  // temporarily? using the following array of countries to populate options of country-select inputs 
  // countries: string[] = ["Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Georgia", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Malta", "Moldova", "Monaco", "Montenegro", "The Netherlands", "Norway", "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Turkey", "Ukraine", "United Kingdom", "Vatican City",];

  countries: { code: string, name: string }[];

  selectedNationality: { code: string, name: string } | null;
  selectedCountryOfResidence: { code: string, name: string } | null;
  selectedAddressCountry: { code: string, name: string } | null;

  $refs!: {
    step1: InstanceType<typeof ValidationObserver>,
    step2: InstanceType<typeof ValidationObserver>,
    step3: InstanceType<typeof ValidationObserver>,
    step4: InstanceType<typeof ValidationObserver>,
  }

  includeAddress: boolean;

  totalSteps = 3;

  currentStep = 1;

  consumerData: ConsumerIndividualCommand | ConsumerProfessionalCommand;

  constructor() {
    super();

    this.consumerApi = new ConsumerAPI();
    this.configurationApi = new ConfigurationApi();

    this.countries = [];

    this.selectedNationality = null;
    this.selectedCountryOfResidence = null;
    this.selectedAddressCountry = null;

    this.includeAddress = false;

    this.accountType = EnumMangopayUserType.INDIVIDUAL;

    this.consumerData = {} as ConsumerIndividualCommand | ConsumerProfessionalCommand;
  }

  created(): void {
    this.initConsumerData();

    this.configurationApi.getConfiguration().then((configResponse) => {
      this.countries = configResponse.result.countries;
    })
  }

  @Watch('accountType')
  onAccountTypeChange(): void {
    this.initConsumerData();
  }

  @Watch('includeAddress')
  onOptionIncludeAddressChange(includeAddress): void {
    if (!includeAddress) {
      (this.consumerData as ConsumerIndividualCommand).address = {
        line1: '',
        line2: '',
        city: '',
        region: '',
        postalCode: '',
        country: '',
      }
      this.selectedAddressCountry = null;
    }
  }

  // mounted(): void {
  //   console.log(store.getters.getProfile);
  // }

  initConsumerData(): void {
    const userProfile = store.getters.getProfile;
    const userEmail = store.getters.getEmail;

    if (this.accountType === EnumMangopayUserType.INDIVIDUAL) {
      (this.consumerData as ConsumerIndividualCommand) = {
        address: {
          line1: '',
          line2: '',
          city: '',
          region: '',
          postalCode: '',
          country: '',
        },
        birthdate: '',
        countryOfResidence: '',
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        nationality: '',
        occupation: '',
        email: userEmail,
        type: EnumMangopayUserType.INDIVIDUAL,
      }
    }
    if (this.accountType === EnumMangopayUserType.PROFESSIONAL) {
      // TODO
      (this.consumerData as ConsumerProfessionalCommand) = {} as ConsumerProfessionalCommand;
    }
  }

  onSelectNationality(): void {
    (this.consumerData as ConsumerIndividualCommand).nationality = this.selectedNationality ? this.selectedNationality.code : '';
  }

  onSelectCountryOfResidence(): void {
    (this.consumerData as ConsumerIndividualCommand).countryOfResidence = this.selectedCountryOfResidence ? this.selectedCountryOfResidence.code : '';
  }

  onSelectAddressCountry(): void {
    (this.consumerData as ConsumerIndividualCommand).address.country = this.selectedAddressCountry ? this.selectedAddressCountry.code : '';
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
    console.log('cd', this.consumerData);
    if (this.currentStep === this.totalSteps) {
      this.submitForm();
      return;
    }
    this.$refs[`step${this.currentStep}`].validate().then((success) => {
      if (success) {
        this.currentStep += 1;
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    });
  }

  submitForm() {
    console.log('submit form');
    this.consumerApi.submitRegistration(this.consumerData).then((submitResponse) => {
      console.log(submitResponse);
      if (submitResponse.success) {
        store.commit('logout');
        this.$router.push('/signin');
      }
    }).catch((err) => {
      console.log('error submiting registration', err);
    });
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_page.scss";
  @import "@/assets/styles/_becomevendor.scss";
  @import "@/assets/styles/_forms.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "~flexboxgrid/css/flexboxgrid.min.css";
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
