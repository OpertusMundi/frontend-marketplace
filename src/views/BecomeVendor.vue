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
                    <label for="vat_number">VAT number *</label>
                    <input type="text" class="form-group__text" name="vat_number" id="vat_number" v-model="vendorData.companyNumber">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Name" rules="required">
                  <div class="form-group">
                    <label for="name">Name *</label>
                    <input type="text" class="form-group__text" name="name" id="name" v-model="vendorData.name">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Website">
                  <div class="form-group">
                    <label for="website">Website</label>
                    <input type="text" class="form-group__text" name="website" id="website" v-model="vendorData.siteUrl">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Address Line 1" rules="required">
                  <div class="form-group">
                    <label for="address_line_1">Address Line 1 *</label>
                    <input type="text" class="form-group__text" name="address_line_1" id="address_line_1" v-model="vendorData.headquartersAddress.line1">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Address Line 2">
                  <div class="form-group">
                    <label for="address_line_2">Address Line 2</label>
                    <input type="text" class="form-group__text" name="address_line_2" id="address_line_2" v-model="vendorData.headquartersAddress.line2">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <div class="wrapper-50-50">
                  <validation-provider v-slot="{ errors }" name="Country" rules="required">
                    <div class="form-group">
                      <label for="country">Country *</label>
                      <input type="text" class="form-group__text" name="country" id="country" v-model="vendorData.headquartersAddress.country">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>

                  <validation-provider v-slot="{ errors }" name="Region" rules="required">
                    <div class="form-group">
                      <label for="region">Region *</label>
                      <input type="text" class="form-group__text" name="region" id="region" v-model="vendorData.headquartersAddress.region">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>
                </div>

                <div class="wrapper-50-50">
                  <validation-provider v-slot="{ errors }" name="City" rules="required">
                    <div class="form-group">
                      <label for="city">City *</label>
                      <input type="text" class="form-group__text" name="city" id="city" v-model="vendorData.headquartersAddress.city">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>

                  <validation-provider v-slot="{ errors }" name="Postal Code" rules="required">
                    <div class="form-group">
                      <label for="postal_code">ZIP code *</label>
                      <input type="text" class="form-group__text" name="postal_code" id="postal_code" v-model="vendorData.headquartersAddress.postalCode">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>
                </div>

              </div>
            </validation-observer>

            <!-- STEP 2 - Legal Representative -->
            <validation-observer ref="step2">
              <div class="dashboard__form__step" v-if="currentStep == 2">

                <validation-provider v-slot="{ errors }" name="First name" rules="required">
                  <div class="form-group">
                    <label for="first_name">First name *</label>
                    <input type="text" class="form-group__text" name="first_name" id="first_name" v-model="vendorData.legalRepresentative.firstName">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Last name" rules="required">
                  <div class="form-group">
                    <label for="last_name">Last name *</label>
                    <input type="text" class="form-group__text" name="last_name" id="last_name" v-model="vendorData.legalRepresentative.lastName">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Email" rules="required|email">
                  <div class="form-group">
                    <label for="email">Email *</label>
                    <input type="text" class="form-group__text" name="email" id="email" v-model="vendorData.legalRepresentative.email">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Birthdate" rules="required">
                  <div class="form-group">
                    <label for="birthdate">Birthdate *</label>
                    <input type="text" class="form-group__text" name="birthdate" id="birthdate" v-model="vendorData.legalRepresentative.birthdate">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Nationality" rules="required">
                  <div class="form-group">
                    <label for="nationality">Nationality *</label>
                    <input type="text" class="form-group__text" name="nationality" id="nationality" v-model="vendorData.legalRepresentative.nationality">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Country of residence" rules="required">
                  <div class="form-group">
                    <label for="lr_country_of_residence">Country of residence *</label>
                    <input type="text" class="form-group__text" name="lr_country_of_residence" id="lr_country_of_residence" v-model="vendorData.legalRepresentative.countryOfResidence">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Address Line 1" rules="required">
                  <div class="form-group">
                    <label for="lr_address_line_1">Address Line 1 *</label>
                    <input type="text" class="form-group__text" name="lr_address_line_1" id="lr_address_line_1" v-model="vendorData.legalRepresentative.address.line1">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Address Line 2">
                  <div class="form-group">
                    <label for="lr_address_line_2">Address Line 2</label>
                    <input type="text" class="form-group__text" name="lr_address_line_2" id="lr_address_line_2" v-model="vendorData.legalRepresentative.address.line2">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <div class="wrapper-50-50">
                  <validation-provider v-slot="{ errors }" name="Country" rules="required">
                    <div class="form-group">
                      <label for="lr_country">Country *</label>
                      <input type="text" class="form-group__text" name="lr_country" id="lr_country" v-model="vendorData.legalRepresentative.address.country">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>

                  <validation-provider v-slot="{ errors }" name="Region" rules="required">
                    <div class="form-group">
                      <label for="lr_region">Region *</label>
                      <input type="text" class="form-group__text" name="lr_region" id="lr_region" v-model="vendorData.legalRepresentative.address.region">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>
                </div>

                <div class="wrapper-50-50">
                  <validation-provider v-slot="{ errors }" name="City" rules="required">
                    <div class="form-group">
                      <label for="lr_city">City *</label>
                      <input type="text" class="form-group__text" name="lr_city" id="lr_city" v-model="vendorData.legalRepresentative.address.city">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>

                  <validation-provider v-slot="{ errors }" name="Postal Code" rules="required">
                    <div class="form-group">
                      <label for="lr_postal_code">ZIP code *</label>
                      <input type="text" class="form-group__text" name="lr_postal_code" id="lr_postal_code" v-model="vendorData.legalRepresentative.address.postalCode">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>
                </div>

              </div>
            </validation-observer>

            <!-- STEP 3 - Bank account -->
            <validation-observer ref="step3">
              <div class="dashboard__form__step" v-if="currentStep == 3">

                <validation-provider v-slot="{ errors }" name="Holder name" rules="required">
                  <div class="form-group">
                    <label for="holder_name">Holder name *</label>
                    <input type="text" class="form-group__text" name="holder_name" id="holder_name" v-model="vendorData.bankAccount.ownerName">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="IBAN" rules="required">
                  <div class="form-group">
                    <label for="iban">IBAN *</label>
                    <input type="text" class="form-group__text" name="iban" id="iban" v-model="vendorData.bankAccount.iban">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="BIC" rules="required">
                  <div class="form-group">
                    <label for="bic">BIC *</label>
                    <input type="text" class="form-group__text" name="bic" id="bic" v-model="vendorData.bankAccount.bic">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Address Line 1" rules="required">
                  <div class="form-group">
                    <label for="ba_address_line_1">Address Line 1 *</label>
                    <input type="text" class="form-group__text" name="ba_address_line_1" id="ba_address_line_1" v-model="vendorData.bankAccount.ownerAddress.line1">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Address Line 2">
                  <div class="form-group">
                    <label for="ba_address_line_2">Address Line 2</label>
                    <input type="text" class="form-group__text" name="ba_address_line_2" id="ba_address_line_2" v-model="vendorData.bankAccount.ownerAddress.line2">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <div class="wrapper-50-50">
                  <validation-provider v-slot="{ errors }" name="Country" rules="required">
                    <div class="form-group">
                      <label for="ba_country">Country *</label>
                      <input type="text" class="form-group__text" name="ba_country" id="ba_country" v-model="vendorData.bankAccount.ownerAddress.country">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>

                  <validation-provider v-slot="{ errors }" name="Region" rules="required">
                    <div class="form-group">
                      <label for="ba_region">Region *</label>
                      <input type="text" class="form-group__text" name="ba_region" id="ba_region" v-model="vendorData.bankAccount.ownerAddress.region">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>
                </div>

                <div class="wrapper-50-50">
                  <validation-provider v-slot="{ errors }" name="City" rules="required">
                    <div class="form-group">
                      <label for="ba_city">City *</label>
                      <input type="text" class="form-group__text" name="ba_city" id="ba_city" v-model="vendorData.bankAccount.ownerAddress.city">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>

                  <validation-provider v-slot="{ errors }" name="Postal Code" rules="required">
                    <div class="form-group">
                      <label for="ba_postal_code">ZIP code *</label>
                      <input type="text" class="form-group__text" name="ba_postal_code" id="ba_postal_code" v-model="vendorData.bankAccount.ownerAddress.postalCode">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>
                </div>

              </div>
            </validation-observer>

            <!-- STEP 4 - Review -->

            <!--
              Instead of hardcoding the fields, we could also loop through vendorData
              object properties and only display the ones with non-empty values
              I leave it hardcoded as it is more straight-forward and seems easier
              to maintain/understand in the furure.
            -->

            <div class="dashboard__form__step" v-if="currentStep == 4">

              <div class="wrapper-50-50">
                <div>
                  <h3 class="align-left">Company</h3>
                  <span class="align-right edit-button" @click="goToStep(1)">EDIT</span>
                  <div class="clear"></div>
                  <hr>
                  <div class="wrapper-cells">
                    <div><span>Vat Number: </span> <span> {{ this.vendorData.companyNumber }} </span></div>
                    <div><span>Name: </span> <span> {{ this.vendorData.name }} </span></div>
                    <div v-if="this.vendorData.siteUrl"><span>Website: </span> <span> {{ this.vendorData.siteUrl }} </span></div>
                    <div><span>Country: </span> <span> {{ this.vendorData.headquartersAddress.country }} </span></div>
                    <div><span>Region: </span> <span> {{ this.vendorData.headquartersAddress.region }} </span></div>
                    <div><span>City: </span> <span> {{ this.vendorData.headquartersAddress.city }} </span></div>
                    <div><span>Zip code: </span> <span> {{ this.vendorData.headquartersAddress.postalCode }} </span></div>
                    <div><span>Address line 1: </span> <span> {{ this.vendorData.headquartersAddress.line1 }} </span></div>
                    <div v-if="this.vendorData.headquartersAddress.line2"> <span>Address line 2: </span> <span> {{ this.vendorData.headquartersAddress.line2 }} </span> </div>
                  </div>

                  <div class="mt-5">
                    <h3 class="align-left">Bank account</h3>
                    <span class="align-right edit-button" @click="goToStep(3)">EDIT</span>
                    <div class="clear"></div>
                    <hr>
                  </div>
                  <div class="wrapper-cells">
                    <span>Holder name: </span> <span> {{ this.vendorData.bankAccount.ownerName }} </span>
                    <span>IBAN: </span> <span> {{ this.vendorData.bankAccount.iban }} </span>
                    <span>BIC: </span> <span> {{ this.vendorData.bankAccount.bic }} </span>
                    <span>Country: </span> <span> {{ this.vendorData.bankAccount.ownerAddress.country }} </span>
                    <span>Region: </span> <span> {{ this.vendorData.bankAccount.ownerAddress.region }} </span>
                    <span>City: </span> <span> {{ this.vendorData.bankAccount.ownerAddress.city }} </span>
                    <span>Zip code: </span> <span> {{ this.vendorData.bankAccount.ownerAddress.postalCode }} </span>
                    <span>Address line 1: </span> <span> {{ this.vendorData.bankAccount.ownerAddress.line1 }} </span>
                    <div v-if="this.vendorData.bankAccount.ownerAddress.line2"> <span>Address line 2: </span> <span> {{ this.vendorData.bankAccount.ownerAddress.line2 }} </span> </div>
                  </div>
                </div>

                <div>
                  <h3 class="align-left">Legal Representative</h3>
                  <span class="align-right edit-button" @click="goToStep(2)">EDIT</span>
                  <div class="clear"></div>
                  <hr>
                  <div class="wrapper-cells">
                    <span>First name: </span> <span> {{ this.vendorData.legalRepresentative.firstName }} </span>
                    <span>Last name: </span> <span> {{ this.vendorData.legalRepresentative.lastName }} </span>
                    <span>Email: </span> <span> {{ this.vendorData.legalRepresentative.email }} </span>
                    <span>Birthdate: </span> <span> {{ this.vendorData.legalRepresentative.birthdate }} </span>
                    <span>Nationality: </span> <span> {{ this.vendorData.legalRepresentative.nationality }} </span>
                    <span>Country of residence: </span> <span> {{ this.vendorData.legalRepresentative.countryOfResidence }} </span>
                    <span>Country: </span> <span> {{ this.vendorData.legalRepresentative.address.country }} </span>
                    <span>Region: </span> <span> {{ this.vendorData.legalRepresentative.address.region }} </span>
                    <span>City: </span> <span> {{ this.vendorData.legalRepresentative.address.city }} </span>
                    <span>Zip code: </span> <span> {{ this.vendorData.legalRepresentative.address.postalCode }} </span>
                    <span>Address line 1: </span> <span> {{ this.vendorData.legalRepresentative.address.line1 }} </span>
                    <div v-if="this.vendorData.legalRepresentative.address.line2"> <span>Address line 2: </span> <span> {{ this.vendorData.legalRepresentative.address.line2 }} </span> </div>
                  </div>
                </div>
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
import ProviderAPI from '@/service/provider';

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
  providerAPI: ProviderAPI;

  // temporarily? using the following array of countries to populate options of country-select inputs 
  countries: {name: string, code: string}[] = [{"name":"Afghanistan","code":"AF"},{"name":"land Islands","code":"AX"},{"name":"Albania","code":"AL"},{"name":"Algeria","code":"DZ"},{"name":"American Samoa","code":"AS"},{"name":"AndorrA","code":"AD"},{"name":"Angola","code":"AO"},{"name":"Anguilla","code":"AI"},{"name":"Antarctica","code":"AQ"},{"name":"Antigua and Barbuda","code":"AG"},{"name":"Argentina","code":"AR"},{"name":"Armenia","code":"AM"},{"name":"Aruba","code":"AW"},{"name":"Australia","code":"AU"},{"name":"Austria","code":"AT"},{"name":"Azerbaijan","code":"AZ"},{"name":"Bahamas","code":"BS"},{"name":"Bahrain","code":"BH"},{"name":"Bangladesh","code":"BD"},{"name":"Barbados","code":"BB"},{"name":"Belarus","code":"BY"},{"name":"Belgium","code":"BE"},{"name":"Belize","code":"BZ"},{"name":"Benin","code":"BJ"},{"name":"Bermuda","code":"BM"},{"name":"Bhutan","code":"BT"},{"name":"Bolivia","code":"BO"},{"name":"Bosnia and Herzegovina","code":"BA"},{"name":"Botswana","code":"BW"},{"name":"Bouvet Island","code":"BV"},{"name":"Brazil","code":"BR"},{"name":"British Indian Ocean Territory","code":"IO"},{"name":"Brunei Darussalam","code":"BN"},{"name":"Bulgaria","code":"BG"},{"name":"Burkina Faso","code":"BF"},{"name":"Burundi","code":"BI"},{"name":"Cambodia","code":"KH"},{"name":"Cameroon","code":"CM"},{"name":"Canada","code":"CA"},{"name":"Cape Verde","code":"CV"},{"name":"Cayman Islands","code":"KY"},{"name":"Central African Republic","code":"CF"},{"name":"Chad","code":"TD"},{"name":"Chile","code":"CL"},{"name":"China","code":"CN"},{"name":"Christmas Island","code":"CX"},{"name":"Cocos (Keeling) Islands","code":"CC"},{"name":"Colombia","code":"CO"},{"name":"Comoros","code":"KM"},{"name":"Congo","code":"CG"},{"name":"Congo, The Democratic Republic of the","code":"CD"},{"name":"Cook Islands","code":"CK"},{"name":"Costa Rica","code":"CR"},{"name":"Cote D'Ivoire","code":"CI"},{"name":"Croatia","code":"HR"},{"name":"Cuba","code":"CU"},{"name":"Cyprus","code":"CY"},{"name":"Czech Republic","code":"CZ"},{"name":"Denmark","code":"DK"},{"name":"Djibouti","code":"DJ"},{"name":"Dominica","code":"DM"},{"name":"Dominican Republic","code":"DO"},{"name":"Ecuador","code":"EC"},{"name":"Egypt","code":"EG"},{"name":"El Salvador","code":"SV"},{"name":"Equatorial Guinea","code":"GQ"},{"name":"Eritrea","code":"ER"},{"name":"Estonia","code":"EE"},{"name":"Ethiopia","code":"ET"},{"name":"Falkland Islands (Malvinas)","code":"FK"},{"name":"Faroe Islands","code":"FO"},{"name":"Fiji","code":"FJ"},{"name":"Finland","code":"FI"},{"name":"France","code":"FR"},{"name":"French Guiana","code":"GF"},{"name":"French Polynesia","code":"PF"},{"name":"French Southern Territories","code":"TF"},{"name":"Gabon","code":"GA"},{"name":"Gambia","code":"GM"},{"name":"Georgia","code":"GE"},{"name":"Germany","code":"DE"},{"name":"Ghana","code":"GH"},{"name":"Gibraltar","code":"GI"},{"name":"Greece","code":"GR"},{"name":"Greenland","code":"GL"},{"name":"Grenada","code":"GD"},{"name":"Guadeloupe","code":"GP"},{"name":"Guam","code":"GU"},{"name":"Guatemala","code":"GT"},{"name":"Guernsey","code":"GG"},{"name":"Guinea","code":"GN"},{"name":"Guinea-Bissau","code":"GW"},{"name":"Guyana","code":"GY"},{"name":"Haiti","code":"HT"},{"name":"Heard Island and Mcdonald Islands","code":"HM"},{"name":"Holy See (Vatican City State)","code":"VA"},{"name":"Honduras","code":"HN"},{"name":"Hong Kong","code":"HK"},{"name":"Hungary","code":"HU"},{"name":"Iceland","code":"IS"},{"name":"India","code":"IN"},{"name":"Indonesia","code":"ID"},{"name":"Iran, Islamic Republic Of","code":"IR"},{"name":"Iraq","code":"IQ"},{"name":"Ireland","code":"IE"},{"name":"Isle of Man","code":"IM"},{"name":"Israel","code":"IL"},{"name":"Italy","code":"IT"},{"name":"Jamaica","code":"JM"},{"name":"Japan","code":"JP"},{"name":"Jersey","code":"JE"},{"name":"Jordan","code":"JO"},{"name":"Kazakhstan","code":"KZ"},{"name":"Kenya","code":"KE"},{"name":"Kiribati","code":"KI"},{"name":"Korea, Democratic People'S Republic of","code":"KP"},{"name":"Korea, Republic of","code":"KR"},{"name":"Kuwait","code":"KW"},{"name":"Kyrgyzstan","code":"KG"},{"name":"Lao People'S Democratic Republic","code":"LA"},{"name":"Latvia","code":"LV"},{"name":"Lebanon","code":"LB"},{"name":"Lesotho","code":"LS"},{"name":"Liberia","code":"LR"},{"name":"Libyan Arab Jamahiriya","code":"LY"},{"name":"Liechtenstein","code":"LI"},{"name":"Lithuania","code":"LT"},{"name":"Luxembourg","code":"LU"},{"name":"Macao","code":"MO"},{"name":"Macedonia, The Former Yugoslav Republic of","code":"MK"},{"name":"Madagascar","code":"MG"},{"name":"Malawi","code":"MW"},{"name":"Malaysia","code":"MY"},{"name":"Maldives","code":"MV"},{"name":"Mali","code":"ML"},{"name":"Malta","code":"MT"},{"name":"Marshall Islands","code":"MH"},{"name":"Martinique","code":"MQ"},{"name":"Mauritania","code":"MR"},{"name":"Mauritius","code":"MU"},{"name":"Mayotte","code":"YT"},{"name":"Mexico","code":"MX"},{"name":"Micronesia, Federated States of","code":"FM"},{"name":"Moldova, Republic of","code":"MD"},{"name":"Monaco","code":"MC"},{"name":"Mongolia","code":"MN"},{"name":"Montenegro","code":"ME"},{"name":"Montserrat","code":"MS"},{"name":"Morocco","code":"MA"},{"name":"Mozambique","code":"MZ"},{"name":"Myanmar","code":"MM"},{"name":"Namibia","code":"NA"},{"name":"Nauru","code":"NR"},{"name":"Nepal","code":"NP"},{"name":"Netherlands","code":"NL"},{"name":"Netherlands Antilles","code":"AN"},{"name":"New Caledonia","code":"NC"},{"name":"New Zealand","code":"NZ"},{"name":"Nicaragua","code":"NI"},{"name":"Niger","code":"NE"},{"name":"Nigeria","code":"NG"},{"name":"Niue","code":"NU"},{"name":"Norfolk Island","code":"NF"},{"name":"Northern Mariana Islands","code":"MP"},{"name":"Norway","code":"NO"},{"name":"Oman","code":"OM"},{"name":"Pakistan","code":"PK"},{"name":"Palau","code":"PW"},{"name":"Palestinian Territory, Occupied","code":"PS"},{"name":"Panama","code":"PA"},{"name":"Papua New Guinea","code":"PG"},{"name":"Paraguay","code":"PY"},{"name":"Peru","code":"PE"},{"name":"Philippines","code":"PH"},{"name":"Pitcairn","code":"PN"},{"name":"Poland","code":"PL"},{"name":"Portugal","code":"PT"},{"name":"Puerto Rico","code":"PR"},{"name":"Qatar","code":"QA"},{"name":"Reunion","code":"RE"},{"name":"Romania","code":"RO"},{"name":"Russian Federation","code":"RU"},{"name":"RWANDA","code":"RW"},{"name":"Saint Helena","code":"SH"},{"name":"Saint Kitts and Nevis","code":"KN"},{"name":"Saint Lucia","code":"LC"},{"name":"Saint Pierre and Miquelon","code":"PM"},{"name":"Saint Vincent and the Grenadines","code":"VC"},{"name":"Samoa","code":"WS"},{"name":"San Marino","code":"SM"},{"name":"Sao Tome and Principe","code":"ST"},{"name":"Saudi Arabia","code":"SA"},{"name":"Senegal","code":"SN"},{"name":"Serbia","code":"RS"},{"name":"Seychelles","code":"SC"},{"name":"Sierra Leone","code":"SL"},{"name":"Singapore","code":"SG"},{"name":"Slovakia","code":"SK"},{"name":"Slovenia","code":"SI"},{"name":"Solomon Islands","code":"SB"},{"name":"Somalia","code":"SO"},{"name":"South Africa","code":"ZA"},{"name":"South Georgia and the South Sandwich Islands","code":"GS"},{"name":"Spain","code":"ES"},{"name":"Sri Lanka","code":"LK"},{"name":"Sudan","code":"SD"},{"name":"Suriname","code":"SR"},{"name":"Svalbard and Jan Mayen","code":"SJ"},{"name":"Swaziland","code":"SZ"},{"name":"Sweden","code":"SE"},{"name":"Switzerland","code":"CH"},{"name":"Syrian Arab Republic","code":"SY"},{"name":"Taiwan, Province of China","code":"TW"},{"name":"Tajikistan","code":"TJ"},{"name":"Tanzania, United Republic of","code":"TZ"},{"name":"Thailand","code":"TH"},{"name":"Timor-Leste","code":"TL"},{"name":"Togo","code":"TG"},{"name":"Tokelau","code":"TK"},{"name":"Tonga","code":"TO"},{"name":"Trinidad and Tobago","code":"TT"},{"name":"Tunisia","code":"TN"},{"name":"Turkey","code":"TR"},{"name":"Turkmenistan","code":"TM"},{"name":"Turks and Caicos Islands","code":"TC"},{"name":"Tuvalu","code":"TV"},{"name":"Uganda","code":"UG"},{"name":"Ukraine","code":"UA"},{"name":"United Arab Emirates","code":"AE"},{"name":"United Kingdom","code":"GB"},{"name":"United States","code":"US"},{"name":"United States Minor Outlying Islands","code":"UM"},{"name":"Uruguay","code":"UY"},{"name":"Uzbekistan","code":"UZ"},{"name":"Vanuatu","code":"VU"},{"name":"Venezuela","code":"VE"},{"name":"Viet Nam","code":"VN"},{"name":"Virgin Islands, British","code":"VG"},{"name":"Virgin Islands, U.S.","code":"VI"},{"name":"Wallis and Futuna","code":"WF"},{"name":"Western Sahara","code":"EH"},{"name":"Yemen","code":"YE"},{"name":"Zambia","code":"ZM"},{"name":"Zimbabwe","code":"ZW"}];

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

    this.providerAPI = new ProviderAPI();

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
    if (this.currentStep === this.totalSteps) {
      this.submitForm();
      return;
    }
    this.$refs[`step${this.currentStep}`].validate().then((success) => {
      if (success) {
        /*
        if (this.currentStep === this.totalSteps) {
          this.submitForm();
        } else {
        */
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
    this.providerAPI.submitRegistration(this.vendorData)
      .then(() => {
        console.log('form was submitted');
      })
      .catch((err) => {
        console.log('error in submitting form: ', err);
      })
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

  .wrapper-50-50 {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 50px;
  }

  .wrapper-cells {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 10px;
  }

  .wrapper-cells div {
    display: contents;
  }

  .wrapper-cells span:nth-child(odd) {
    color: #474747;
    font-weight: 500;
  }

  .wrapper-cells span:nth-child(even) {
    color: #5f5f5f;
  }

  /*
  @media (min-width: 500px) {
    .row {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  */

  /*
  .col-50 {
    margin-left: 20px;
    margin-right: 20px;
    flex: 50%;
  }
  */

  .mt-5 {
    margin-top: 5rem;
  }

  .align-left {
    float: left;
  }

  .align-right {
    float: right;
  }

  .clear {
    clear: both;
  }

  .edit-button {
    background: none!important;
    border: none;
    padding: 0!important;
    font-weight: 200;
    /*optional*/
    // font-family: arial, sans-serif;
    /*input has OS specific font-family*/
    color: #5f5f5f;
    cursor: pointer;
  }
</style>
