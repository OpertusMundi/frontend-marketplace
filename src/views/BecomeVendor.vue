<template>
  <div class="page becomevendor">
    <div class="page__inner pb-sm-100">
      <div class="m_container">
        <h1>Become a vendor</h1>
        <div class="dashboard__form">
          <ul class="dashboard__form__nav">
            <li><a href="#" :class="[currentStep == 1 ? 'active' : '', currentStep < 1 ? 'inactive' : '']" @click="goToStep(1)">Company</a></li>
            <li><a href="#" :class="[currentStep == 2 ? 'active' : '', currentStep < 2 ? 'inactive' : '']" @click="goToStep(2)">Legal representative</a></li>
            <li><a href="#" :class="[currentStep == 3 ? 'active' : '', currentStep < 3 ? 'inactive' : '']" @click="goToStep(3)">Bank account</a></li>
            <li><a href="#" :class="[currentStep == 4 ? 'active' : '', currentStep < 4 ? 'inactive' : '']" @click="goToStep(4)">Review</a></li>
          </ul>
          <div class="dashboard__form__steps">
            <div class="dashboard__form__steps__inner">

            <!-- STEP 1 - Company -->
            <validation-observer ref="step1">
              <div class="dashboard__form__step" v-if="currentStep == 1">

                <validation-provider v-slot="{ errors }" name="VAT Number" rules="required">
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

                <validation-provider v-slot="{ errors }" name="Email" rules="required|email">
                  <div class="form-group">
                    <label for="vendor_email">Email *</label>
                    <input type="text" class="form-group__text" name="email" id="vendor_email" v-model="vendorData.email">
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
                  <!-- <validation-provider v-slot="{ errors }" name="Country" rules="required">
                    <div class="form-group">
                      <label for="country">Country *</label>
                      <select class="form-group__select" name="country" id="country" v-model="vendorData.headquartersAddress.country">
                        <option v-for="country in countries" :key="country"> {{country}} </option>
                      </select>
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider> -->

                  <validation-provider v-slot="{ errors }" name="Country of residence" rules="required">
                    <div class="form-group">
                      <label for="multiselect_headquarters_country">Country *</label>
                      <multiselect id="multiselect_headquarters_country" @input="onSelectHeadquartersCountry" v-model="selectedHeadquartersCountry" :options="countries" label="name" track-by="code" placeholder="Select country" :multiple="false" :close-on-select="true" :show-labels="false"></multiselect>
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
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
                    <input type="text" class="form-group__text" name="first_name" id="first_name" v-model="vendorData.representative.firstName">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Last name" rules="required">
                  <div class="form-group">
                    <label for="last_name">Last name *</label>
                    <input type="text" class="form-group__text" name="last_name" id="last_name" v-model="vendorData.representative.lastName">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Email" rules="required|email">
                  <div class="form-group">
                    <label for="email">Email *</label>
                    <input type="text" class="form-group__text" name="email" id="email" v-model="vendorData.representative.email">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Birthdate" rules="required">
                  <div class="form-group">
                    <label for="birthdate">Birthdate *</label>
                    <input type="date" class="form-group__text" name="birthdate" id="birthdate" v-model="vendorData.representative.birthdate">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <!-- <validation-provider v-slot="{ errors }" name="Nationality" rules="required">
                  <div class="form-group">
                    <label for="nationality">Nationality *</label>
                    <input type="text" class="form-group__text" name="nationality" id="nationality" v-model="vendorData.representative.nationality">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider> -->

                <validation-provider v-slot="{ errors }" name="Nationality" rules="required">
                  <div class="form-group">
                    <label for="multiselect_representative_nationality">Nationality *</label>
                    <multiselect id="multiselect_representative_nationality" @input="onSelectRepresentativeNationality" v-model="selectedRepresentativeNationality" :options="countries" label="name" track-by="code" placeholder="Select country" :multiple="false" :close-on-select="true" :show-labels="false"></multiselect>
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
                  </div>
                </validation-provider>

                <!-- <validation-provider v-slot="{ errors }" name="Country of residence" rules="required">
                  <div class="form-group">
                    <label for="lr_country_of_residence">Country of residence *</label>
                    <input type="text" class="form-group__text" name="lr_country_of_residence" id="lr_country_of_residence" v-model="vendorData.representative.countryOfResidence">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider> -->

                <validation-provider v-slot="{ errors }" name="Country of residence" rules="required">
                  <div class="form-group">
                    <label for="multiselect_representative_country_residence">Country of residence *</label>
                    <multiselect id="multiselect_representative_country_residence" @input="onSelectRepresentativeCountryOfResidence" v-model="selectedRepresentativeCountryOfResidence" :options="countries" label="name" track-by="code" placeholder="Select country" :multiple="false" :close-on-select="true" :show-labels="false"></multiselect>
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Address Line 1" rules="required">
                  <div class="form-group">
                    <label for="lr_address_line_1">Address Line 1 *</label>
                    <input type="text" class="form-group__text" name="lr_address_line_1" id="lr_address_line_1" v-model="vendorData.representative.address.line1">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="Address Line 2">
                  <div class="form-group">
                    <label for="lr_address_line_2">Address Line 2</label>
                    <input type="text" class="form-group__text" name="lr_address_line_2" id="lr_address_line_2" v-model="vendorData.representative.address.line2">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <!-- <validation-provider v-slot="{ errors }" name="Legal Person type" rules="required">
                  <div class="form-group">
                    <label for="multiselect_legal_person_type">Legal Person type *</label>
                    <multiselect id="multiselect_legal_person_type" @input="onSelectLegalPersonType" v-model="selectedLegalPersonType" :options="legalPersonTypeOptions" label="name" track-by="code" placeholder="Select type" :multiple="false" :close-on-select="true" :show-labels="false"></multiselect>
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
                  </div>
                </validation-provider> -->

                <div class="wrapper-50-50">
                  <!-- <validation-provider v-slot="{ errors }" name="Country" rules="required">
                    <div class="form-group">
                      <label for="lr_country">Country *</label>
                      <select class="form-group__select" name="lr_country" id="lr_country" v-model="vendorData.representative.address.country">
                        <option v-for="country in countries" :key="country"> {{country}} </option>
                      </select>
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider> -->

                  <validation-provider v-slot="{ errors }" name="Country" rules="required">
                    <div class="form-group">
                      <label for="multiselect_representative_address_country">Country *</label>
                      <multiselect id="multiselect_representative_address_country" @input="onSelectRepresentativeAddressCountry" v-model="selectedRepresentativeAddressCountry" :options="countries" label="name" track-by="code" placeholder="Select country" :multiple="false" :close-on-select="true" :show-labels="false"></multiselect>
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
                    </div>
                  </validation-provider>

                  <validation-provider v-slot="{ errors }" name="Region" rules="required">
                    <div class="form-group">
                      <label for="lr_region">Region *</label>
                      <input type="text" class="form-group__text" name="lr_region" id="lr_region" v-model="vendorData.representative.address.region">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>
                </div>

                <div class="wrapper-50-50">
                  <validation-provider v-slot="{ errors }" name="City" rules="required">
                    <div class="form-group">
                      <label for="lr_city">City *</label>
                      <input type="text" class="form-group__text" name="lr_city" id="lr_city" v-model="vendorData.representative.address.city">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>

                  <validation-provider v-slot="{ errors }" name="Postal Code" rules="required">
                    <div class="form-group">
                      <label for="lr_postal_code">ZIP code *</label>
                      <input type="text" class="form-group__text" name="lr_postal_code" id="lr_postal_code" v-model="vendorData.representative.address.postalCode">
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

                <validation-provider v-slot="{ errors }" name="IBAN" rules="required|iban">
                  <div class="form-group">
                    <label for="iban">IBAN *</label>
                    <input type="text" class="form-group__text" name="iban" id="iban" v-model="vendorData.bankAccount.iban">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" name="BIC" rules="required|bic">
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
                  <!-- <validation-provider v-slot="{ errors }" name="Country" rules="required">
                    <div class="form-group">
                      <label for="ba_country">Country *</label>
                      <select class="form-group__select" name="ba_country" id="ba_country" v-model="vendorData.bankAccount.ownerAddress.country">
                        <option v-for="country in countries" :key="country"> {{country}} </option>
                      </select>
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider> -->

                  <validation-provider v-slot="{ errors }" name="Country" rules="required">
                    <div class="form-group">
                      <label for="multiselect_representative_bank_account_country">Country *</label>
                      <multiselect id="multiselect_representative_bank_account_country" @input="onSelectBankAccountAddressCountry" v-model="selectedBankAccountAddressCountry" :options="countries" label="name" track-by="code" placeholder="Select country" :multiple="false" :close-on-select="true" :show-labels="false"></multiselect>
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
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
                    <div><span>Email: </span> <span> {{ this.vendorData.email }} </span></div>
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
                    <span>First name: </span> <span> {{ this.vendorData.representative.firstName }} </span>
                    <span>Last name: </span> <span> {{ this.vendorData.representative.lastName }} </span>
                    <span>Email: </span> <span> {{ this.vendorData.representative.email }} </span>
                    <span>Birthdate: </span> <span> {{ this.vendorData.representative.birthdate | formatDate }} </span>
                    <span>Nationality: </span> <span> {{ this.vendorData.representative.nationality }} </span>
                    <span>Country of residence: </span> <span> {{ this.vendorData.representative.countryOfResidence }} </span>
                    <span>Country: </span> <span> {{ this.vendorData.representative.address.country }} </span>
                    <span>Region: </span> <span> {{ this.vendorData.representative.address.region }} </span>
                    <span>City: </span> <span> {{ this.vendorData.representative.address.city }} </span>
                    <span>Zip code: </span> <span> {{ this.vendorData.representative.address.postalCode }} </span>
                    <span>Address line 1: </span> <span> {{ this.vendorData.representative.address.line1 }} </span>
                    <div v-if="this.vendorData.representative.address.line2"> <span>Address line 2: </span> <span> {{ this.vendorData.representative.address.line2 }} </span> </div>
                  </div>
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
  EnumMangopayUserType,
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
  // length,
} from 'vee-validate/dist/rules';
import {
  ValidationProvider,
  ValidationObserver,
  extend,
  localize,
} from 'vee-validate';
import { isValidIBAN, isValidBIC } from 'ibantools';
import Multiselect from 'vue-multiselect';
import en from 'vee-validate/dist/locale/en.json';
import PhoneNumber from 'awesome-phonenumber';
import ProviderAPI from '@/service/provider';
import store from '@/store';

extend('required', required);
extend('email', email);
extend('confirmed', confirmed);
extend('min', min);
// extend('length', length);
localize({
  en,
});

const phoneNumberValidator = {
  validate(value) {
    /* eslint-disable */
    const phone = new PhoneNumber(value);
    if (phone.isValid()) {
      return true;
    }
    return `Phone field ${phone.toJSON().possibility.replace(/-/g, ' ')}`;
  },
};
extend('phoneNumber', phoneNumberValidator);

const ibanValidator = {
  validate(value) {
    if (isValidIBAN(value)) return true;
    return false;
  }
}
extend('iban', ibanValidator);

const bicValidator = {
  validate(value) {
    if (isValidBIC(value)) return true;
    return false;
  }
}
extend('bic', bicValidator);

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
export default class BecomeVendor extends Vue {
  providerAPI: ProviderAPI;

  // temporarily? using the following array of countries to populate options of country-select inputs 
  // countries: string[] = ["Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Georgia", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Malta", "Moldova", "Monaco", "Montenegro", "The Netherlands", "Norway", "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Turkey", "Ukraine", "United Kingdom", "Vatican City",];

  countries: { name: string, code: string }[];

  legalPersonTypeOptions: { name: string, code: string }[];

  $refs!: {
    step1: InstanceType<typeof ValidationObserver>,
    step2: InstanceType<typeof ValidationObserver>,
    step3: InstanceType<typeof ValidationObserver>,
    step4: InstanceType<typeof ValidationObserver>,
  }

  totalSteps = 4;

  currentStep = 1;

  vendorData: ProviderProfessionalCommand;

  selectedHeadquartersCountry: { name: string, code: string };

  selectedRepresentativeNationality: { name: string, code: string };

  selectedRepresentativeCountryOfResidence: { name: string, code: string };

  selectedRepresentativeAddressCountry: { name: string, code: string };

  selectedBankAccountAddressCountry: { name: string, code: string };

  // selectedLegalPersonType : { name: string, code: string };

  constructor() {
    super();

    this.providerAPI = new ProviderAPI();

    this.countries = store.getters.getConfig.configuration.countries;

    this.legalPersonTypeOptions = [
      { name: 'Business', code: 'BUSINESS' },
      { name: 'Organization', code: 'ORGANIZATION' },
      { name: 'Soletrader', code: 'SOLETRADER' },
    ];

    this.vendorData = {
      name: '',
      phone: '',
      email: '',
      type: EnumMangopayUserType.PROFESSIONAL,
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
      legalPersonType: EnumLegalPersonType.BUSINESS,
      representative: {
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

    this.selectedHeadquartersCountry = { name: '', code: '' };
    this.selectedRepresentativeNationality = { name: '', code: '' };
    this.selectedRepresentativeCountryOfResidence = { name: '', code: '' };
    this.selectedRepresentativeAddressCountry = { name: '', code: '' };
    this.selectedBankAccountAddressCountry = { name: '', code: '' };
    // this.selectedLegalPersonType = { name: 'Business', code: 'BUSINESS' };
  }

  onSelectHeadquartersCountry(): void {
    this.vendorData.headquartersAddress.country = this.selectedHeadquartersCountry.code;
  }

  onSelectRepresentativeNationality(): void {
    this.vendorData.representative.nationality = this.selectedRepresentativeNationality.code;
  }

  onSelectRepresentativeCountryOfResidence(): void {
    this.vendorData.representative.countryOfResidence = this.selectedRepresentativeCountryOfResidence.code;
  }

  onSelectRepresentativeAddressCountry(): void {
    this.vendorData.representative.address.country = this.selectedRepresentativeAddressCountry.code;
  }

  onSelectBankAccountAddressCountry(): void {
    this.vendorData.bankAccount.ownerAddress.country = this.selectedBankAccountAddressCountry.code;
  }

  // onSelectLegalPersonType(): void {
  //   // this.vendorData.legalPersonType = this.selectedLegalPersonType.code as EnumLegalPersonType;
  //   Vue.set(this.vendorData, 'legalPersonType', this.selectedLegalPersonType.code);
  // }

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

  fixDataForSubmitting(): void {
    // fix date format (birthday)
    const d = new Date(this.vendorData.representative.birthdate);
    const isoString = d.toISOString();
    this.vendorData.representative.birthdate = isoString;
    /* */

    Object.keys(this.vendorData).forEach((x) => {
      if (this.vendorData[x] === '') delete this.vendorData[x];
    })

    if (this.vendorData.bankAccount.ownerAddress.line2 === '') this.vendorData.bankAccount.ownerAddress.line2 = null;
    if (this.vendorData.headquartersAddress.line2 === '') this.vendorData.headquartersAddress.line2 = null;
    if (this.vendorData.representative.address.line2 === '') this.vendorData.representative.address.line2 = null;
  }

  submitForm() {
    this.fixDataForSubmitting();

    console.log('submit form', this.vendorData);
    this.providerAPI.submitRegistration(this.vendorData)
      .then((submitResponse) => {
        if (submitResponse.success) {
          console.log('form was submitted');
          this.$router.push('/become-vendor-success');
        } else {
          console.log('submit error', submitResponse);
        }
      })
      .catch((err) => {
        console.log('error in submitting form: ', err);
      })
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_page.scss";
  @import "@/assets/styles/_becomevendor.scss";
  @import "@/assets/styles/_forms.scss";
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
