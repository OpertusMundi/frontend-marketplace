<template>
  <div class="page becomevendor">
    <div class="page__inner pb-sm-100">
      <div class="m_container">
        <h1>Become a supplier</h1>
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

                <validation-provider v-slot="{ errors }" :custom-messages="getInputData('step1', 'name', 'customErrorMessages')" :name="getInputData('step1', 'name', 'label')" mode="lazy" rules="required|unique_name">
                  <div class="form-group">
                    <label for="name">{{ getInputData('step1', 'name', 'label') }} *</label>
                    <input type="text" class="form-group__text" name="name" id="name" :placeholder="getInputData('step1', 'name', 'placeholder') || ''" v-model="vendorData.name">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" :name="getInputData('step1', 'email', 'label')" rules="required|email">
                  <div class="form-group">
                    <label for="vendor_email">{{ getInputData('step1', 'email', 'label') }} *</label>
                    <input type="text" class="form-group__text" name="email" id="vendor_email" :placeholder="getInputData('step1', 'email', 'placeholder') || ''" v-model="vendorData.email">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" :name="getInputData('step1', 'site_url', 'label')">
                  <div class="form-group">
                    <label for="website">{{ getInputData('step1', 'site_url', 'label') }}</label>
                    <input type="text" class="form-group__text" name="website" id="website" :placeholder="getInputData('step1', 'site_url', 'placeholder') || ''" v-model="vendorData.siteUrl">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" :name="getInputData('step1', 'headquarters_address_line_1', 'label')" rules="required">
                  <div class="form-group">
                    <label for="address_line_1">{{ getInputData('step1', 'headquarters_address_line_1', 'label') }} *</label>
                    <input type="text" class="form-group__text" name="address_line_1" id="address_line_1" :placeholder="getInputData('step1', 'headquarters_address_line_1', 'placeholder') || ''" v-model="vendorData.headquartersAddress.line1">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" :name="getInputData('step1', 'headquarters_address_line_2', 'label')">
                  <div class="form-group">
                    <label for="address_line_2">{{ getInputData('step1', 'headquarters_address_line_2', 'label') }}</label>
                    <input type="text" class="form-group__text" name="address_line_2" id="address_line_2" :placeholder="getInputData('step1', 'headquarters_address_line_2', 'placeholder') || ''" v-model="vendorData.headquartersAddress.line2">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <div class="wrapper-50-50">
                  <validation-provider v-slot="{ errors }" :name="getInputData('step1', 'headquarters_country', 'label')" rules="required">
                    <div class="form-group">
                      <label for="multiselect_headquarters_country">{{ getInputData('step1', 'headquarters_country', 'label') }} *</label>
                      <!-- IMPORTANT NOTE: dropdown is populated by europe countries for VAT validation -->
                      <!-- on submission, it is converted to ISO code -->
                      <multiselect id="multiselect_headquarters_country" @input="onSelectHeadquartersCountry" v-model="selectedHeadquartersCountry" :options="europeCountries" label="name" track-by="code" :placeholder="getInputData('step1', 'headquarters_country', 'placeholder') || ''" :multiple="false" :close-on-select="true" :show-labels="false" open-direction="top"></multiselect>
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
                    </div>
                  </validation-provider>

                  <validation-provider v-slot="{ errors }" :name="getInputData('step1', 'headquarters_region', 'label')" rules="required">
                    <div class="form-group">
                      <label for="region">{{ getInputData('step1', 'headquarters_region', 'label') }} *</label>
                      <input type="text" class="form-group__text" name="region" id="region" :placeholder="getInputData('step1', 'headquarters_region', 'placeholder') || ''" v-model="vendorData.headquartersAddress.region">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>
                </div>

                <div class="wrapper-50-50">
                  <validation-provider v-slot="{ errors }" :name="getInputData('step1', 'headquarters_city', 'label')" rules="required">
                    <div class="form-group">
                      <label for="city">{{ getInputData('step1', 'headquarters_city', 'label') }} *</label>
                      <input type="text" class="form-group__text" name="city" id="city" :placeholder="getInputData('step1', 'headquarters_city', 'placeholder') || ''" v-model="vendorData.headquartersAddress.city">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>

                  <validation-provider v-slot="{ errors }" :name="getInputData('step1', 'headquarters_postal_code', 'label')" rules="required">
                    <div class="form-group">
                      <label for="postal_code">{{ getInputData('step1', 'headquarters_postal_code', 'label') }} *</label>
                      <input type="text" class="form-group__text" name="postal_code" id="postal_code" :placeholder="getInputData('step1', 'headquarters_postal_code', 'placeholder') || ''" v-model="vendorData.headquartersAddress.postalCode">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>
                </div>

                <validation-provider v-slot="{ errors }" :name="getInputData('step1', 'company_number', 'label')" :rules="`required|vat:${vendorData.headquartersAddress.country}`">
                  <div class="form-group">
                    <label for="vat_number">{{ getInputData('step1', 'company_number', 'label') }} *</label>
                    <div class="input-prefix-container">
                      <span>{{ vendorData.headquartersAddress.country }}</span>
                      <input type="text" class="form-group__text" name="vat_number" id="vat_number" v-model="vendorData.companyNumber" :placeholder="getVatPlaceholderPerCountry(vendorData.headquartersAddress.country)">
                    </div>
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

              </div>
            </validation-observer>

            <!-- STEP 2 - Legal Representative -->
            <validation-observer ref="step2">
              <div class="dashboard__form__step" v-if="currentStep == 2">

                <validation-provider v-slot="{ errors }" :name="getInputData('step2', 'representative_first_name', 'label')" rules="required">
                  <div class="form-group">
                    <label for="first_name">{{ getInputData('step2', 'representative_first_name', 'label') }} *</label>
                    <input type="text" class="form-group__text" name="first_name" id="first_name" :placeholder="getInputData('step2', 'representative_first_name', 'placeholder') || ''" v-model="vendorData.representative.firstName">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" :name="getInputData('step2', 'representative_last_name', 'label')" rules="required">
                  <div class="form-group">
                    <label for="last_name">{{ getInputData('step2', 'representative_last_name', 'label') }} *</label>
                    <input type="text" class="form-group__text" name="last_name" id="last_name" :placeholder="getInputData('step2', 'representative_last_name', 'placeholder') || ''" v-model="vendorData.representative.lastName">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" :name="getInputData('step2', 'representative_email', 'label')" rules="required|email">
                  <div class="form-group">
                    <label for="email">{{ getInputData('step2', 'representative_email', 'label') }} *</label>
                    <input type="text" class="form-group__text" name="email" id="email" :placeholder="getInputData('step2', 'representative_email', 'placeholder') || ''" v-model="vendorData.representative.email">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" :name="getInputData('step2', 'representative_birthdate', 'label')" rules="required">
                  <div class="form-group">
                    <label for="birthdate">{{ getInputData('step2', 'representative_birthdate', 'label') }} *</label>
                    <!-- <input type="date" class="form-group__text" name="birthdate" id="birthdate" v-model="vendorData.representative.birthdate"> -->
                    <datepicker input-class="form-group__text" :value="vendorData.representative.birthdate" @input="vendorData.representative.birthdate = formatDate($event)"></datepicker>
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" :name="getInputData('step2', 'representative_nationality', 'label')" rules="required">
                  <div class="form-group">
                    <label for="multiselect_representative_nationality">{{ getInputData('step2', 'representative_nationality', 'label') }} *</label>
                    <multiselect id="multiselect_representative_nationality" @input="onSelectRepresentativeNationality" v-model="selectedRepresentativeNationality" :options="countries" label="name" track-by="code" :placeholder="getInputData('step2', 'representative_nationality', 'placeholder') || ''" :multiple="false" :close-on-select="true" :show-labels="false"></multiselect>
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" :name="getInputData('step2', 'representative_country_residence', 'label')" rules="required">
                  <div class="form-group">
                    <label for="multiselect_representative_country_residence">{{ getInputData('step2', 'representative_country_residence', 'label') }} *</label>
                    <multiselect id="multiselect_representative_country_residence" @input="onSelectRepresentativeCountryOfResidence" v-model="selectedRepresentativeCountryOfResidence" :options="countries" label="name" track-by="code" :placeholder="getInputData('step2', 'representative_country_residence', 'placeholder') || ''" :multiple="false" :close-on-select="true" :show-labels="false"></multiselect>
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" :name="getInputData('step2', 'representative_address_line_1', 'label')" rules="required">
                  <div class="form-group">
                    <label for="lr_address_line_1">{{ getInputData('step2', 'representative_address_line_1', 'label') }} *</label>
                    <input type="text" class="form-group__text" name="lr_address_line_1" id="lr_address_line_1" :placeholder="getInputData('step2', 'representative_address_line_1', 'placeholder') || ''" v-model="vendorData.representative.address.line1">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" :name="getInputData('step2', 'representative_address_line_2', 'label')">
                  <div class="form-group">
                    <label for="lr_address_line_2">{{ getInputData('step2', 'representative_address_line_2', 'label') }}</label>
                    <input type="text" class="form-group__text" name="lr_address_line_2" id="lr_address_line_2" :placeholder="getInputData('step2', 'representative_address_line_2', 'placeholder') || ''" v-model="vendorData.representative.address.line2">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <div class="wrapper-50-50">
                  <validation-provider v-slot="{ errors }" :name="getInputData('step2', 'representative_country', 'label')" rules="required">
                    <div class="form-group">
                      <label for="multiselect_representative_address_country">{{ getInputData('step2', 'representative_country', 'label') }} *</label>
                      <multiselect id="multiselect_representative_address_country" @input="onSelectRepresentativeAddressCountry" v-model="selectedRepresentativeAddressCountry" :options="countries" label="name" track-by="code" :placeholder="getInputData('step2', 'representative_country', 'placeholder') || ''" :multiple="false" :close-on-select="true" :show-labels="false"></multiselect>
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
                    </div>
                  </validation-provider>

                  <validation-provider v-slot="{ errors }" :name="getInputData('step2', 'representative_region', 'label')" rules="required">
                    <div class="form-group">
                      <label for="lr_region">{{ getInputData('step2', 'representative_region', 'label') }} *</label>
                      <input type="text" class="form-group__text" name="lr_region" id="lr_region" :placeholder="getInputData('step2', 'representative_region', 'placeholder') || ''" v-model="vendorData.representative.address.region">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>
                </div>

                <div class="wrapper-50-50">
                  <validation-provider v-slot="{ errors }" :name="getInputData('step2', 'representative_city', 'label')" rules="required">
                    <div class="form-group">
                      <label for="lr_city">{{ getInputData('step2', 'representative_city', 'label') }} *</label>
                      <input type="text" class="form-group__text" name="lr_city" id="lr_city" :placeholder="getInputData('step2', 'representative_city', 'placeholder') || ''" v-model="vendorData.representative.address.city">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>

                  <validation-provider v-slot="{ errors }" :name="getInputData('step2', 'representative_postal_code', 'label')" rules="required">
                    <div class="form-group">
                      <label for="lr_postal_code">{{ getInputData('step2', 'representative_postal_code', 'label') }} *</label>
                      <input type="text" class="form-group__text" name="lr_postal_code" id="lr_postal_code" :placeholder="getInputData('step2', 'representative_postal_code', 'placeholder') || ''" v-model="vendorData.representative.address.postalCode">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>
                </div>

              </div>
            </validation-observer>

            <!-- STEP 3 - Bank account -->
            <validation-observer ref="step3">
              <div class="dashboard__form__step" v-if="currentStep == 3">

                <validation-provider v-slot="{ errors }" :name="getInputData('step3', 'bankaccount_owner_name', 'label')" rules="required">
                  <div class="form-group">
                    <label for="holder_name">{{ getInputData('step3', 'bankaccount_owner_name', 'label') }} *</label>
                    <input type="text" class="form-group__text" name="holder_name" id="holder_name" :placeholder="getInputData('step3', 'bankaccount_owner_name', 'placeholder') || ''" v-model="vendorData.bankAccount.ownerName">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" :name="getInputData('step3', 'bankaccount_iban', 'label')" rules="required|iban">
                  <div class="form-group">
                    <label for="iban">{{ getInputData('step3', 'bankaccount_iban', 'label') }} *</label>
                    <input type="text" class="form-group__text" name="iban" id="iban" :placeholder="getInputData('step3', 'bankaccount_iban', 'placeholder') || ''" v-model="vendorData.bankAccount.iban">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" :name="getInputData('step3', 'bankaccount_bic', 'label')" rules="required|bic">
                  <div class="form-group">
                    <label for="bic">{{ getInputData('step3', 'bankaccount_bic', 'label') }} *</label>
                    <input type="text" class="form-group__text" name="bic" id="bic" :placeholder="getInputData('step3', 'bankaccount_bic', 'placeholder') || ''" v-model="vendorData.bankAccount.bic">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" :name="getInputData('step3', 'bankaccount_address_line_1', 'label')" rules="required">
                  <div class="form-group">
                    <label for="ba_address_line_1">{{ getInputData('step3', 'bankaccount_address_line_1', 'label') }} *</label>
                    <input type="text" class="form-group__text" name="ba_address_line_1" id="ba_address_line_1" :placeholder="getInputData('step3', 'bankaccount_address_line_1', 'placeholder') || ''" v-model="vendorData.bankAccount.ownerAddress.line1">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <validation-provider v-slot="{ errors }" :name="getInputData('step3', 'bankaccount_address_line_2', 'label')">
                  <div class="form-group">
                    <label for="ba_address_line_2">{{ getInputData('step3', 'bankaccount_address_line_2', 'label') }}</label>
                    <input type="text" class="form-group__text" name="ba_address_line_2" id="ba_address_line_2" :placeholder="getInputData('step3', 'bankaccount_address_line_2', 'placeholder') || ''" v-model="vendorData.bankAccount.ownerAddress.line2">
                    <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                  </div>
                </validation-provider>

                <div class="wrapper-50-50">
                  <validation-provider v-slot="{ errors }" :name="getInputData('step3', 'bankaccount_country', 'label')" rules="required">
                    <div class="form-group">
                      <label for="multiselect_representative_bank_account_country">{{ getInputData('step3', 'bankaccount_country', 'label') }} *</label>
                      <multiselect id="multiselect_representative_bank_account_country" @input="onSelectBankAccountAddressCountry" v-model="selectedBankAccountAddressCountry" :options="countries" label="name" track-by="code" :placeholder="getInputData('step3', 'bankaccount_country', 'placeholder') || ''" :multiple="false" :close-on-select="true" :show-labels="false"></multiselect>
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
                    </div>
                  </validation-provider>

                  <validation-provider v-slot="{ errors }" :name="getInputData('step3', 'bankaccount_region', 'label')" rules="required">
                    <div class="form-group">
                      <label for="ba_region">{{ getInputData('step3', 'bankaccount_region', 'label') }} *</label>
                      <input type="text" class="form-group__text" name="ba_region" id="ba_region" :placeholder="getInputData('step3', 'bankaccount_region', 'placeholder') || ''" v-model="vendorData.bankAccount.ownerAddress.region">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>
                </div>

                <div class="wrapper-50-50">
                  <validation-provider v-slot="{ errors }" :name="getInputData('step3', 'bankaccount_city', 'label')" rules="required">
                    <div class="form-group">
                      <label for="ba_city">{{ getInputData('step3', 'bankaccount_city', 'label') }} *</label>
                      <input type="text" class="form-group__text" name="ba_city" id="ba_city" :placeholder="getInputData('step3', 'bankaccount_city', 'placeholder') || ''" v-model="vendorData.bankAccount.ownerAddress.city">
                      <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                    </div>
                  </validation-provider>

                  <validation-provider v-slot="{ errors }" :name="getInputData('step3', 'bankaccount_postal_code', 'label')" rules="required">
                    <div class="form-group">
                      <label for="ba_postal_code">{{ getInputData('step3', 'bankaccount_postal_code', 'label') }} *</label>
                      <input type="text" class="form-group__text" name="ba_postal_code" id="ba_postal_code" :placeholder="getInputData('step3', 'bankaccount_postal_code', 'placeholder') || ''" v-model="vendorData.bankAccount.ownerAddress.postalCode">
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
                    <div><span>{{ getInputData('step1', 'company_number', 'label') }}: </span> <span> {{ this.vendorData.companyNumber }} </span></div>
                    <div><span>{{ getInputData('step1', 'name', 'label') }}: </span> <span> {{ this.vendorData.name }} </span></div>
                    <div><span>{{ getInputData('step1', 'email', 'label') }}: </span> <span> {{ this.vendorData.email }} </span></div>
                    <div v-if="this.vendorData.siteUrl"><span>{{ getInputData('step1', 'site_url', 'label') }}: </span> <span> {{ this.vendorData.siteUrl }} </span></div>
                    <div><span>{{ getInputData('step1', 'headquarters_country', 'label') }}: </span> <span> {{ this.vendorData.headquartersAddress.country }} </span></div>
                    <div><span>{{ getInputData('step1', 'headquarters_region', 'label') }}: </span> <span> {{ this.vendorData.headquartersAddress.region }} </span></div>
                    <div><span>{{ getInputData('step1', 'headquarters_city', 'label') }}: </span> <span> {{ this.vendorData.headquartersAddress.city }} </span></div>
                    <div><span>{{ getInputData('step1', 'headquarters_postal_code', 'label') }}: </span> <span> {{ this.vendorData.headquartersAddress.postalCode }} </span></div>
                    <div><span>{{ getInputData('step1', 'headquarters_address_line_1', 'label') }}: </span> <span> {{ this.vendorData.headquartersAddress.line1 }} </span></div>
                    <div v-if="this.vendorData.headquartersAddress.line2"> <span>{{ getInputData('step1', 'headquarters_address_line_2', 'label') }}: </span> <span> {{ this.vendorData.headquartersAddress.line2 }} </span> </div>
                  </div>

                  <div class="mt-5">
                    <h3 class="align-left">Bank account</h3>
                    <span class="align-right edit-button" @click="goToStep(3)">EDIT</span>
                    <div class="clear"></div>
                    <hr>
                  </div>
                  <div class="wrapper-cells">
                    <span>{{ getInputData('step3', 'bankaccount_owner_name', 'label') }}: </span> <span> {{ this.vendorData.bankAccount.ownerName }} </span>
                    <span>{{ getInputData('step3', 'bankaccount_iban', 'label') }}: </span> <span> {{ this.vendorData.bankAccount.iban }} </span>
                    <span>{{ getInputData('step3', 'bankaccount_bic', 'label') }}: </span> <span> {{ this.vendorData.bankAccount.bic }} </span>
                    <span>{{ getInputData('step3', 'bankaccount_country', 'label') }}: </span> <span> {{ this.vendorData.bankAccount.ownerAddress.country }} </span>
                    <span>{{ getInputData('step3', 'bankaccount_region', 'label') }}: </span> <span> {{ this.vendorData.bankAccount.ownerAddress.region }} </span>
                    <span>{{ getInputData('step3', 'bankaccount_city', 'label') }}: </span> <span> {{ this.vendorData.bankAccount.ownerAddress.city }} </span>
                    <span>{{ getInputData('step3', 'bankaccount_postal_code', 'label') }}: </span> <span> {{ this.vendorData.bankAccount.ownerAddress.postalCode }} </span>
                    <span>{{ getInputData('step3', 'bankaccount_address_line_1', 'label') }}: </span> <span> {{ this.vendorData.bankAccount.ownerAddress.line1 }} </span>
                    <div v-if="this.vendorData.bankAccount.ownerAddress.line2"> <span>{{ getInputData('step3', 'bankaccount_address_line_2', 'label') }}: </span> <span> {{ this.vendorData.bankAccount.ownerAddress.line2 }} </span> </div>
                  </div>
                </div>

                <div>
                  <h3 class="align-left">Legal Representative</h3>
                  <span class="align-right edit-button" @click="goToStep(2)">EDIT</span>
                  <div class="clear"></div>
                  <hr>
                  <div class="wrapper-cells">
                    <span>{{ getInputData('step2', 'representative_first_name', 'label') }}: </span> <span> {{ this.vendorData.representative.firstName }} </span>
                    <span>{{ getInputData('step2', 'representative_last_name', 'label') }}: </span> <span> {{ this.vendorData.representative.lastName }} </span>
                    <span>{{ getInputData('step2', 'representative_email', 'label') }}: </span> <span> {{ this.vendorData.representative.email }} </span>
                    <span>{{ getInputData('step2', 'representative_birthdate', 'label') }}: </span> <span> {{ this.vendorData.representative.birthdate | formatDate }} </span>
                    <span>{{ getInputData('step2', 'representative_nationality', 'label') }}: </span> <span> {{ this.vendorData.representative.nationality }} </span>
                    <span>{{ getInputData('step2', 'representative_country_residence', 'label') }}: </span> <span> {{ this.vendorData.representative.countryOfResidence }} </span>
                    <span>{{ getInputData('step2', 'representative_country', 'label') }}: </span> <span> {{ this.vendorData.representative.address.country }} </span>
                    <span>{{ getInputData('step2', 'representative_region', 'label') }}: </span> <span> {{ this.vendorData.representative.address.region }} </span>
                    <span>{{ getInputData('step2', 'representative_city', 'label') }}: </span> <span> {{ this.vendorData.representative.address.city }} </span>
                    <span>{{ getInputData('step2', 'representative_postal_code', 'label') }}: </span> <span> {{ this.vendorData.representative.address.postalCode }} </span>
                    <span>{{ getInputData('step2', 'representative_address_line_1', 'label') }}: </span> <span> {{ this.vendorData.representative.address.line1 }} </span>
                    <div v-if="this.vendorData.representative.address.line2"> <span>{{ getInputData('step2', 'representative_address_line_2', 'label') }}: </span> <span> {{ this.vendorData.representative.address.line2 }} </span> </div>
                  </div>
                </div>
              </div>

              <!-- <div class="mt-xs-40 become-vendor-accept-terms">
                <div>
                  <div class="form-group-checkbox form-group-checkbox--centered">
                    <input @change="onAcceptTermsChange" type="checkbox" v-model="vendorData.termsAndConditionsAccepted" id="terms">
                    <label for="terms">I 've read and accept the <strong><a class="login__helpers" href="https://www.mangopay.com/terms/MANGOPAY_Terms-EN.pdf" target="_blank">MANGOPAY Terms & Conditions</a></strong></label>
                  </div>
                </div>
                <span class="become-vendor-accept-terms__errors" v-if="termsNotAcceptedError">You must accept Terms & Conditions to Register</span>
              </div> -->

            </div>
          </div>

          </div>
          <div>
            <div class="mt-xs-40 become-vendor-accept-terms" v-show="currentStep == 4">
              <div>
                <div class="form-group-checkbox form-group-checkbox--centered">
                  <input @change="onAcceptTermsChange" type="checkbox" v-model="vendorData.termsAndConditionsAccepted" id="terms">
                  <label for="terms">I 've read and accept the <strong><a class="login__helpers" href="https://www.mangopay.com/terms/MANGOPAY_Terms-EN.pdf" target="_blank">MANGOPAY Terms & Conditions</a></strong></label>
                </div>
              </div>
              <span class="become-vendor-accept-terms__errors mr-xs-15" v-if="termsNotAcceptedError">You must accept Terms & Conditions to Register</span>
            </div>
            <div class="dashboard__form__navbuttons">
              <button class="btn--std btn--blue" @click.prevent="previousStep()" v-if="currentStep > 1">PREVIOUS</button>
              <button class="btn--std btn--blue" @click.prevent="nextStep()">{{ currentStep === totalSteps ? 'confirm and create account' : 'NEXT' }}</button>
            </div>
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
import moment from 'moment';
import { isValidIBAN, isValidBIC } from 'ibantools';
import { checkVAT, countries as countriesForVatValidation } from 'jsvat';
// import validateVat, { CountryCodes as validateVatCountryCodes } from 'validate-vat-ts';
import Multiselect from 'vue-multiselect';
import Datepicker from 'vuejs-datepicker';
import en from 'vee-validate/dist/locale/en.json';
import PhoneNumber from 'awesome-phonenumber';
import { orderBy } from 'lodash';
import ProviderAPI from '@/service/provider';
import { europeanCodeToISOCode } from '@/helper/country';
import { getFormInputData } from '@/helper/form-config';
import { inputsConfig } from '@/config/become-vendor';
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
extend('phone_number', phoneNumberValidator);

// const vatValidator = {
//   async validate(value, args): Promise<boolean> {
//     const [country] = args;
//     if (!country) return true;

//     store.commit('setLoading', true);
//     try {
//       const validationResponse = await validateVat(country, value);
//       if (validationResponse.valid) return true;
//       return false;
//     } catch (err) {
//       return true;
//     } finally {
//       store.commit('setLoading', false);
//     }
//   }
// }
// extend('vat', vatValidator);

const vatValidator = {
  validate(value, args): boolean {
    const [country] = args;
    if (!country) return true;
    // skip validation for ISRAEL
    if (country === 'IL') return true;

    const fullVATValue = `${country}${value}`;

    if (!checkVAT(fullVATValue, countriesForVatValidation).isSupportedCountry) throw new Error('Country incompatible with jsvat library');
    if (checkVAT(fullVATValue, countriesForVatValidation).isValid) return true;
    return false;
  }
}
extend('vat', vatValidator);

const nameValidator = {
  async validate(value): Promise<boolean> {
    store.commit('setLoading', true);
    try {
      const isNameUnique = await (new ProviderAPI()).isNameAvailable(value);
      if (isNameUnique) return true;
      return false;
    } catch (err) {
      return true;
    } finally {
      store.commit('setLoading', false);
    }
  }
}
extend('unique_name', nameValidator);

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
    Datepicker,
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

  europeCountries: { name: string, code: string }[];

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

  termsNotAcceptedError: boolean;

  // selectedLegalPersonType : { name: string, code: string };

  constructor() {
    super();

    this.providerAPI = new ProviderAPI();

    this.countries = store.getters.getConfig.configuration.countries;
    this.europeCountries = store.getters.getConfig.configuration.europeCountries.map((x) => ({name: x.name, code: x.code}));
    // ADD ISRAEL
    this.europeCountries.push({ name: 'Israel', code: 'IL' });
    this.europeCountries = orderBy(this.europeCountries, ['name'], 'asc');

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
      termsAndConditionsAccepted: false,
    };

    this.selectedHeadquartersCountry = { name: '', code: '' };
    this.selectedRepresentativeNationality = { name: '', code: '' };
    this.selectedRepresentativeCountryOfResidence = { name: '', code: '' };
    this.selectedRepresentativeAddressCountry = { name: '', code: '' };
    this.selectedBankAccountAddressCountry = { name: '', code: '' };
    // this.selectedLegalPersonType = { name: 'Business', code: 'BUSINESS' };

    this.termsNotAcceptedError = false;
  }

  created(): void {
    if (!this.isHeadquartersCountryListCompatibleWithVatValidationLibrary()) throw new Error('Country list is incompatible with jsvat library');
    console.log('Country list is compatible with vat validation.');
  }

  isHeadquartersCountryListCompatibleWithVatValidationLibrary(): boolean {
    // const validationLibraryCountries = Object.values(validateVatCountryCodes);
    const headquartersCountries = store.getters.getConfig.configuration.europeCountries.map((x) => x.code);

    // if (headquartersCountries.some((x) => !validationLibraryCountries.includes(x))) return false;
    if (headquartersCountries.some((x) => !checkVAT(`${x}123`, countriesForVatValidation).isSupportedCountry)) return false;
    return true;
  }

  getInputData(step: string, id: string, type: 'label' | 'placeholder' | 'customErrorMessages'): string | {[key: string]: string} | null {
    return getFormInputData(inputsConfig, type, id, step);
  }

  onSelectHeadquartersCountry(): void {
    // if (!(Object.values(validateVatCountryCodes) as string[]).includes(this.selectedHeadquartersCountry.code)) throw new Error('Country incompatible with vat-validate library');
    Vue.set(this.vendorData.headquartersAddress, 'country', this.selectedHeadquartersCountry.code);
    // this.vendorData.headquartersAddress.country = this.selectedHeadquartersCountry.code;
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
      if (!this.vendorData.termsAndConditionsAccepted) {
        this.termsNotAcceptedError = true;
        return;
      }

      this.submitForm();
      return;
    }
    this.$refs[`step${this.currentStep}`].validate().then((success) => {
      if (success) {
        this.currentStep += 1;
      }
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  fixDataForSubmitting(): void {
    // fix date format (birthday)
    const d = new Date(this.vendorData.representative.birthdate);
    const isoString = d.toISOString();
    this.vendorData.representative.birthdate = isoString;
    /* */

    // fix country code
    this.vendorData.headquartersAddress.country = europeanCodeToISOCode(this.vendorData.headquartersAddress.country);
    /* */

    Object.keys(this.vendorData).forEach((x) => {
      if (this.vendorData[x] === '') delete this.vendorData[x];
    })

    if (this.vendorData.bankAccount.ownerAddress.line2 === '') this.vendorData.bankAccount.ownerAddress.line2 = null;
    if (this.vendorData.headquartersAddress.line2 === '') this.vendorData.headquartersAddress.line2 = null;
    if (this.vendorData.representative.address.line2 === '') this.vendorData.representative.address.line2 = null;
  }

  submitForm(): void {
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

  getVatPlaceholderPerCountry(country: string): string {
    // source: https://www.avalara.com/vatlive/en/eu-vat-rules/eu-vat-number-registration/eu-vat-number-formats.html

    const placeholders = {
      AT: { charactersNum: 9, format: 'U12345678' },
      BE: { charactersNum: 10, format: '1234567890' },
      BG: { charactersNum: [9, 10], format: ['123456789', '1234567890'] },
      HR: { charactersNum: 11, format: '12345678901' },
      CY: { charactersNum: 9, format: '12345678X' },
      CZ: { charactersNum: [8, 10], format: ['12345678', '123456789', '1234567890'] },
      DK: { charactersNum: 8, format: '12345678' },
      EE: { charactersNum: 9, format: '123456789' },
      FI: { charactersNum: 8, format: '12345678' },
      FR: { charactersNum: 11, format: ['12345678901', 'X1234567890', '1X123456789', 'XX123456789'] },
      DE: { charactersNum: 9, format: '123456789' },
      EL: { charactersNum: 9, format: '123456789' },
      HU: { charactersNum: 8, format: '12345678' },
      IE: { charactersNum: [8, 9], format: ['1234567WA', '1234567FA'] },
      IT: { charactersNum: 11, format: '12345678901' },
      LV: { charactersNum: 11, format: '12345678901' },
      LT: { charactersNum: 12, format: ['123456789', '123456789012'] },
      LU: { charactersNum: 8, format: '12345678' },
      MT: { charactersNum: 8, format: '12345678' },
      NL: { charactersNum: 12, format: ['123456789B01', '123456789BO2'] },
      PL: { charactersNum: 10, format: '1234567890' },
      PT: { charactersNum: 9, format: '123456789' },
      RO: { charactersNum: 10, format: '1234567890' },
      SK: { charactersNum: 10, format: '1234567890' },
      SI: { charactersNum: 8, format: '12345678' },
      ES: { charactersNum: 9, format: ['X12345678', '12345678X', 'X1234567X'] },
      SE: { charactersNum: 12, format: '123456789012' },
    }

    if (!placeholders[country]) return '';

    const partA = `${Array.isArray(placeholders[country].charactersNum) ? `${placeholders[country].charactersNum[0]}-${placeholders[country].charactersNum[1]}` : `${placeholders[country].charactersNum}`} characters`;
    const partB = Array.isArray(placeholders[country].format) ? `${placeholders[country].format.join(', ')}` : `${placeholders[country].format}`;

    return `${partA} (e.g. ${partB})`;
  }

  onAcceptTermsChange(): void {
    this.termsNotAcceptedError = false;
  }

  formatDate(date: string): string {
    return moment(date).format('YYYY-MM-DD');
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_page.scss";
  @import "@/assets/styles/_becomevendor.scss";
  @import "@/assets/styles/_forms.scss";

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
  }
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
