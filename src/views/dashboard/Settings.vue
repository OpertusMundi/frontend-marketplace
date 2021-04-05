<template>
    <div class="dashboard__inner">
      <div class="dashboard__head">
        <div class="dashboard__head__helpers">
          <h1>Settings</h1>
        </div>
      </div>

      <div class="settings">
        <div class="collection__menu">
          <ul>
            <li @click="selectTab('general')" :class="{ 'active': selectedTab=='general' }"><a href="#" @click.prevent="">General</a></li>
            <li @click="selectTab('loginAndSecurity')" :class="{ 'active': selectedTab=='loginAndSecurity' }"><a href="#" @click.prevent="">Login & Security</a></li>
            <li @click="selectTab('companyInformation')" :class="{ 'active': selectedTab=='companyInformation' }"><a href="#" @click.prevent="">Company Information</a></li>
            <li @click="selectTab('payoutOptions')" :class="{ 'active': selectedTab=='payoutOptions' }"><a href="#" @click.prevent="">Payout Options</a></li>
            <li @click="selectTab('addresses')" :class="{ 'active': selectedTab=='addresses' }"><a href="#" @click.prevent="">Addresses</a></li>
            <li @click="selectTab('paymentMethods')" :class="{ 'active': selectedTab=='paymentMethods' }"><a href="#" @click.prevent="">Payment Methods</a></li>
            <li @click="selectTab('kyc')" :class="{ 'active': selectedTab=='kyc' }"><a href="#" @click.prevent="">KYC</a></li>
            <li @click="selectTab('ubo')" :class="{ 'active': selectedTab=='ubo' }"><a href="#" @click.prevent="">UBO</a></li>
          </ul>
        </div>

        <div class="tabs__outter-wrapper">
          <!-- GENERAL -->
          <transition name="fade" mode="out-in">
            <div class="tabs__single-tab-wrapper" v-if="userData && selectedTab == 'general'">
              <div class="tabs__tab tabs__tab__tab-general">
                <div class="tabs__tab__list">
                  <div class="tabs__tab__list__item"><strong>Image</strong></div>
                  <div class="tabs__tab__list__item"><img :src="'data:image/png;base64, ' + userData.profile.consumer.current.logoImage" :height="80" :width="80" alt="user image"></div>
                  <div class="tabs__tab__list__item">CHANGE</div>
                  <div class="tabs__tab__list__line"></div>

                  <div class="tabs__tab__list__item"><strong>Username</strong></div>
                  <div class="tabs__tab__list__item">{{ userData.username }}</div>
                  <div class="tabs__tab__list__item">EDIT</div>
                  <div class="tabs__tab__list__line"></div>

                  <div class="tabs__tab__list__item"><strong>Full name</strong></div>
                  <div class="tabs__tab__list__item">{{ userData.profile.firstName + ' ' + userData.profile.lastName }}</div>
                  <div class="tabs__tab__list__item">EDIT</div>
                  <div class="tabs__tab__list__line"></div>

                  <div class="tabs__tab__list__item"><strong>Company email</strong></div>
                  <div class="tabs__tab__list__item">{{ userData.profile.provider.current.email }}</div>
                  <div class="tabs__tab__list__item">EDIT</div>
                  <div class="tabs__tab__list__line"></div>
                </div>
              </div>
            </div>
          </transition>

          <!-- LOGIN & SECURITY -->
          <transition name="fade" mode="out-in">
            <div class="tabs__single-tab-wrapper" v-if="userData && selectedTab == 'loginAndSecurity'">
              <div class="tabs__tab tabs__tab__login_security">
                <div class="tabs__tab__list">
                  <div class="tabs__tab__list__item"><strong>Password</strong></div>
                  <div class="tabs__tab__list__item"></div>
                  <div class="tabs__tab__list__item">CHANGE</div>
                  <div class="tabs__tab__list__line"></div>

                  <div class="tabs__tab__list__item"><strong>Two-step verification</strong></div>
                  <div class="tabs__tab__list__item"></div>
                  <div class="tabs__tab__list__item">EDIT</div>
                  <div class="tabs__tab__list__line"></div>

                  <div class="tabs__tab__list__item"><strong>Mobile number</strong></div>
                  <div class="tabs__tab__list__item">{{ userData.profile.mobile }}</div>
                  <div class="tabs__tab__list__item">CHANGE</div>
                  <div class="tabs__tab__list__line"></div>
                </div>
              </div>
            </div>
          </transition>

          <!-- COMPANY INFORMATION -->
          <transition name="fade" mode="out-in">
            <div class="tabs__single-tab-wrapper" v-if="userData && selectedTab == 'companyInformation'">
              <div class="tabs__tab tabs__tab__company_information">
                <div class="tabs__tab__list">
                  <div class="tabs__tab__list__item"><strong>Company name</strong></div>
                  <div class="tabs__tab__list__item">{{ userData.profile.provider.current.name }}</div>
                  <div class="tabs__tab__list__item">EDIT</div>
                  <div class="tabs__tab__list__line"></div>

                  <div class="tabs__tab__list__item"><strong>VAT number</strong></div>
                  <div class="tabs__tab__list__item">123456789 (dummy)</div>
                  <div class="tabs__tab__list__item">EDIT</div>
                  <div class="tabs__tab__list__line"></div>

                  <div class="tabs__tab__list__item"><strong>Domain</strong></div>
                  <div class="tabs__tab__list__item">{{ userData.profile.provider.current.companyType }}</div>
                  <div class="tabs__tab__list__item">EDIT</div>
                  <div class="tabs__tab__list__line"></div>

                  <div class="tabs__tab__list__item"><strong>Country</strong></div>
                  <div class="tabs__tab__list__item">{{ userData.profile.provider.current.headquartersAddress.country }}</div>
                  <div class="tabs__tab__list__item">EDIT</div>
                  <div class="tabs__tab__list__line"></div>
                </div>
              </div>
            </div>
          </transition>

          <!-- PAYOUT OPTIONS -->
          <transition name="fade" mode="out-in">
            <div class="tabs__single-tab-wrapper" v-if="userData && selectedTab == 'payoutOptions'">
              <div class="tabs__tab tabs__tab__payout_options">
                <div class="tabs__tab__list">
                  <div class="tabs__tab__list__item"><strong>IBAN</strong></div>
                  <div class="tabs__tab__list__item">{{ userData.profile.provider.current.bankAccount.iban }}</div>
                  <div class="tabs__tab__list__item">CHANGE</div>
                  <div class="tabs__tab__list__line"></div>
                </div>
              </div>
            </div>
          </transition>

          <!-- ADDRESSES -->
          <transition name="fade" mode="out-in">
            <div class="tabs__single-tab-wrapper" v-if="userData && selectedTab == 'addresses'">
              <div class="tabs__tab tabs__tab__addresses">
                <div class="tabs__tab__list">
                  <div class="tabs__tab__list__item"><strong>ADDRESS 1</strong> (json: headquartersAddress)</div>
                  <div class="tabs__tab__list__item">
                    {{ userData.profile.provider.current.headquartersAddress.line1 + ', ' + userData.profile.provider.current.headquartersAddress.city + ', ' + userData.profile.provider.current.headquartersAddress.country + userData.profile.provider.current.headquartersAddress.postalCode }}
                  </div>
                  <div class="tabs__tab__list__item">EDIT</div>
                  <div class="tabs__tab__list__line"></div>

                  <div v-if="userData.profile.provider.current.representative.address.line1" class="tabs__tab__ignore-grid-wrapper">
                    <div class="tabs__tab__list__item"><strong>ADDRESS 2</strong> (json: representative)</div>
                    <div class="tabs__tab__list__item">
                      {{ userData.profile.provider.current.representative.address.line1 + ', ' + userData.profile.provider.current.representative.address.city + ', ' + userData.profile.provider.current.representative.address.country + userData.profile.provider.current.representative.address.postalCode }}
                    </div>
                    <div class="tabs__tab__list__item">EDIT</div>
                    <div class="tabs__tab__list__line"></div>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <!-- PAYMENT METHODS -->
          <transition name="fade" mode="out-in">
            <div class="tabs__single-tab-wrapper" v-if="selectedTab == 'paymentMethods'">
              <div class="tabs__tab tabs__tab__payment_methods">
                <div v-for="(card, i) in cards" :key="i" class="tabs__tab__ignore-grid-wrapper">
                  <div class="tabs__tab__list">
                    <div class="tabs__tab__list__item"><strong>CARD {{ i + 1 }}</strong></div>
                    <div class="tabs__tab__list__item">{{ card }} (dummy)</div>
                    <div class="tabs__tab__list__item">REMOVE</div>
                    <div class="tabs__tab__list__line"></div>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <!-- KYC -->
          <transition name="fade" mode="out-in">
            <div class="tabs__single-tab-wrapper" v-if="selectedTab == 'kyc'">
              <div class="tabs__tab tabs__tab__kyc">
                <div class="row mt-xs-20">
                  <div class="col-md-5 text-gray">
                    <p> We need you to upload the following documents in order to validate the information you provided. </p>

                    <p class="mt-xs-20"><strong>Identity proof</strong></p>
                    <p>This document should refer to the individual duly empowered to act on behalf of the legal entity. ID card: Front AND Back (Valid) OR Passport (Valid).</p>

                    <p class="mt-xs-20"><strong>Articles of association</strong></p>
                    <p>Certified articles of association (Statute) - formal memorandum stated by the entrepreneurs, in which the following information is mentioned: business name, activity, registered address, shareholding, etc.</p>

                    <p class="mt-xs-20"><strong>Registration proof</strong></p>
                    <p>Extract from the Company Register issued within the last three months in the case of an organization or soletrader, this can be a proof of registration from the official authority.</p>

                    <p class="mt-xs-20">You can upload <strong>multiple files</strong> for each document type. <br>Max size per file is <strong>7MB</strong>.</p>

                  </div>
                  <div class="col-md-7 d-flex flex-column">
                    <span class="text-black"><strong>Vendor validation status</strong></span>
                    <div class="mt-xs-20"><span class="tabs__tab__kyc__status-label" :class="isKycValidated? 'tabs__tab__kyc__status-label--validated' : 'tabs__tab__kyc__status-label--not-validated'">NOT KYC VALIDATED</span></div>
                    <div class="mt-xs-30 d-flex">
                      <div class="font-weight-500">Issues:</div>
                      <div class="ml-xs-20">
                        <p class="mb-xs-5">Missing Identity proof document</p>
                        <p class="mb-xs-5">Missing Articles of association document</p>
                        <p class="mb-xs-5">Missing Registration proof document</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="tabs__tab__kyc__list mt-xs-40">
                  <div class="tabs__tab__kyc__list__header-item">TYPE</div>
                  <div class="tabs__tab__kyc__list__header-item">STATUS</div>
                  <div class="tabs__tab__kyc__list__header-item">REFUSAL REASON</div>
                  <div class="tabs__tab__kyc__list__header-item">ID</div>
                  <div class="tabs__tab__kyc__list__header-item">CREATION DATE</div>
                  <div class="tabs__tab__kyc__list__header-item">PROCESSED DATE</div>
                  <div class="tabs__tab__kyc__list__header-item"></div>
                  <div class="tabs__tab__kyc__list__line"></div>

                  <div class="tabs__tab__list__item"><strong>Identity proof*</strong></div>
                  <div class="tabs__tab__list__item">UPLOAD</div>
                  <div class="tabs__tab__list__item"></div>
                  <div class="tabs__tab__list__item">-</div>
                  <div class="tabs__tab__list__item">-</div>
                  <div class="tabs__tab__list__item">-</div>
                  <div class="tabs__tab__list__item">ADD NEW IDENTITY PROOF DOCUMENT</div>
                  <div class="tabs__tab__kyc__list__line"></div>

                  <div class="tabs__tab__list__item"><strong>Articles of association*</strong></div>
                  <div class="tabs__tab__list__item">UPLOAD</div>
                  <div class="tabs__tab__list__item"></div>
                  <div class="tabs__tab__list__item">-</div>
                  <div class="tabs__tab__list__item">-</div>
                  <div class="tabs__tab__list__item">-</div>
                  <div class="tabs__tab__list__item">ADD NEW ARTICLES OF ASSOCIATION DOCUMENT</div>
                  <div class="tabs__tab__kyc__list__line"></div>

                  <div class="tabs__tab__list__item"><strong>Registration proof*</strong></div>
                  <div class="tabs__tab__list__item">UPLOAD</div>
                  <div class="tabs__tab__list__item"></div>
                  <div class="tabs__tab__list__item">-</div>
                  <div class="tabs__tab__list__item">-</div>
                  <div class="tabs__tab__list__item">-</div>
                  <div class="tabs__tab__list__item">ADD NEW REGISTRATION PROOF DOCUMENT</div>
                  <div class="tabs__tab__kyc__list__line"></div>
                </div>
              </div>
            </div>
          </transition>

          <!-- UBO -->
          <transition name="fade" mode="out-in">
            <div class="tabs__single-tab-wrapper" v-if="selectedTab == 'ubo'">
              <div class="tabs__tab tabs__tab__ubo">
                <div>
                  UBO declaration is replacing the manual shareholder declaration. <br>
                  For each declaration you need to create <strong>1 - 4 UBOs</strong>.
                </div>
                <div class="row mt-xs-30">
                  <div class="col-md-4 d-flex flex-column">
                    <div v-for="(declaration, i) in declarations" :key="i" @click="selectDeclaration(i)" class="tabs__tab__ubo__card" :class="{'tabs__tab__ubo__card--selected': i == selectedDeclaration}">
                      STATUS: {{ declaration.status }} <br>
                      ID: {{ declaration.id }} <br>
                      CREATION DATE: {{ declaration.creationDate }}
                    </div>
                    <button @click="addDeclaration()" class="tabs__tab__ubo__btn">ADD DECLARATION</button>
                  </div>
                  <div class="col-md-2">
                    <div v-if="selectedDeclaration !== null">
                      <div v-for="(ubo, i) in declarations[selectedDeclaration].ubos" :key="i" @click="selectUbo(i)" class="tabs__tab__ubo__card" :class="{'tabs__tab__ubo__card--selected': i == selectedUbo}">UBO {{ i + 1 }}</div>
                      <button @click="addUboToDeclaration()" class="tabs__tab__ubo__btn">ADD UBO</button>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div v-if="selectedDeclaration !== null && declarations[selectedDeclaration].ubos[selectedUbo]">
                      <validation-provider v-slot="{ errors }" name="Last name" rules="required">
                        <div class="form-group">
                          <label for="last_name">Last name*</label>
                          <input v-model="declarations[selectedDeclaration].ubos[selectedUbo].lastName" type="text" class="form-group__text" name="last_name" id="last_name">
                          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                        </div>
                      </validation-provider>

                      <validation-provider v-slot="{ errors }" name="First Name" rules="required">
                        <div class="form-group">
                          <label for="firstName">First name*</label>
                          <input v-model="declarations[selectedDeclaration].ubos[selectedUbo].firstName" type="text" class="form-group__text" name="firstName" id="firstName">
                          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                        </div>
                      </validation-provider>

                      <validation-provider v-slot="{ errors }" name="Address Line 1" rules="required">
                        <div class="form-group">
                          <label for="address_line_1">Address Line 1*</label>
                          <input v-model="declarations[selectedDeclaration].ubos[selectedUbo].addressLine1" type="text" class="form-group__text" name="address_line_1" id="address_line_1">
                          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                        </div>
                      </validation-provider>

                      <validation-provider v-slot="{ errors }" name="Address Line 2">
                        <div class="form-group">
                          <label for="address_line_2">Address Line 2</label>
                          <input v-model="declarations[selectedDeclaration].ubos[selectedUbo].addressLine2" type="text" class="form-group__text" name="address_line_2" id="address_line_2">
                          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                        </div>
                      </validation-provider>

                      <div class="row">
                        <div class="col-md-6">
                          <validation-provider v-slot="{ errors }" name="Country" rules="required">
                            <div class="form-group">
                              <label for="country">Country *</label>
                              <select v-model="declarations[selectedDeclaration].ubos[selectedUbo].country" class="form-group__select" name="country" id="country">
                                <option v-for="country in countries" :key="country"> {{country}} </option>
                              </select>
                              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                            </div>
                          </validation-provider>
                        </div>

                        <div class="col-md-6">
                          <validation-provider v-slot="{ errors }" name="Region" rules="required">
                            <div class="form-group">
                              <label for="region">Region *</label>
                              <input v-model="declarations[selectedDeclaration].ubos[selectedUbo].region" type="text" class="form-group__text" name="region" id="region">
                              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                            </div>
                          </validation-provider>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-6">
                          <validation-provider v-slot="{ errors }" name="City" rules="required">
                            <div class="form-group">
                              <label for="city">City *</label>
                              <input v-model="declarations[selectedDeclaration].ubos[selectedUbo].city" type="text" class="form-group__text" name="city" id="city">
                              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                            </div>
                          </validation-provider>
                        </div>

                        <div class="col-md-6">
                          <validation-provider v-slot="{ errors }" name="Zip code" rules="required">
                            <div class="form-group">
                              <label for="zipCode">Zip code *</label>
                              <input v-model="declarations[selectedDeclaration].ubos[selectedUbo].zipCode" type="text" class="form-group__text" name="zipCode" id="zipCode">
                              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                            </div>
                          </validation-provider>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-6">
                          <validation-provider v-slot="{ errors }" name="Birthdate" rules="required">
                            <div class="form-group">
                              <label for="birthdate">Birthdate *</label>
                              <input type="date" v-model="declarations[selectedDeclaration].ubos[selectedUbo].birthdate" class="form-group__text" name="birthdate" id="birthdate">
                              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                            </div>
                          </validation-provider>
                        </div>

                        <div class="col-md-6">
                          <validation-provider v-slot="{ errors }" name="Nationality" rules="required">
                            <div class="form-group">
                              <label for="nationality">Nationality *</label>
                              <select v-model="declarations[selectedDeclaration].ubos[selectedUbo].nationality" class="form-group__select" name="nationality" id="nationality">
                                <option v-for="country in countries" :key="country"> {{country}} </option>
                              </select>
                              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                            </div>
                          </validation-provider>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-6">
                          <validation-provider v-slot="{ errors }" name="Birthplace City" rules="required">
                            <div class="form-group">
                              <label for="birthplaceCity">Birthplace city *</label>
                              <input v-model="declarations[selectedDeclaration].ubos[selectedUbo].birthplaceCity" type="text" class="form-group__text" name="birthplaceCity" id="birthplaceCity">
                              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                            </div>
                          </validation-provider>
                        </div>

                        <div class="col-md-6">
                          <validation-provider v-slot="{ errors }" name="Birthplace Country" rules="required">
                            <div class="form-group">
                              <label for="birthplaceCountry">Birthplace country *</label>
                              <select v-model="declarations[selectedDeclaration].ubos[selectedUbo].birthplaceCountry" class="form-group__select" name="birthplaceCountry" id="birthplaceCountry">
                                <option v-for="country in countries" :key="country"> {{country}} </option>
                              </select>
                              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                            </div>
                          </validation-provider>
                        </div>
                      </div>

                      <button class="btn--std btn--outlinedark">CANCEL</button>
                      <button class="btn--std btn--dark ml-xs-20">ADD UBO</button>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- <div class="settings__grid">
          <a href="setting.html" class="settings__item">
            <h3 class="settings__item__title">Profile Information</h3>
            <div class="settings__item__details">
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">Full Name: </div>
                <div class="settings__item__details__row__main">John Doe</div>
              </div>
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">username: </div>
                <div class="settings__item__details__row__main">@John.doe.athenarc</div>
              </div>
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">Image:</div>
                <div class="settings__item__details__row__main"><div class="settings__item__details__row__main__logo"><img src="@/assets/images/about/partners/athina_logo.svg" alt=""></div></div>
              </div>
            </div>
          </a>
          <a href="setting.html" class="settings__item">
            <h3 class="settings__item__title">Profile Information</h3>
            <div class="settings__item__details">
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">Full Name: </div>
                <div class="settings__item__details__row__main">John Doe</div>
              </div>
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">username: </div>
                <div class="settings__item__details__row__main">@John.doe.athenarc</div>
              </div>
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">Image:</div>
                <div class="settings__item__details__row__main"><div class="settings__item__details__row__main__logo"><img src="@/assets/images/about/partners/athina_logo.svg" alt=""></div></div>
              </div>
            </div>
          </a>
          <a href="setting.html" class="settings__item">
            <h3 class="settings__item__title">Addresses</h3>
            <div class="settings__item__details">
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">Full Name: </div>
                <div class="settings__item__details__row__main">John Doe</div>
              </div>
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">username: </div>
                <div class="settings__item__details__row__main">@John.doe.athenarc</div>
              </div>
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">Address:</div>
                <div class="settings__item__details__row__main">
                  <p>17, Leocharous</p>
                  <p>Greece</p>
                  <p>Attica</p>
                </div>
              </div>
            </div>
          </a>
          <a href="setting.html" class="settings__item">
            <h3 class="settings__item__title">Addresses</h3>
            <div class="settings__item__details">
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">Full Name: </div>
                <div class="settings__item__details__row__main">John Doe</div>
              </div>
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">username: </div>
                <div class="settings__item__details__row__main">@John.doe.athenarc</div>
              </div>
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">Address:</div>
                <div class="settings__item__details__row__main">
                  <p>17, Leocharous</p>
                  <p>Greece</p>
                  <p>Attica</p>
                </div>
              </div>
            </div>
          </a>
          <a href="setting.html" class="settings__item">
            <h3 class="settings__item__title">Addresses</h3>
            <div class="settings__item__details">
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">Full Name: </div>
                <div class="settings__item__details__row__main">John Doe</div>
              </div>
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">username: </div>
                <div class="settings__item__details__row__main">@John.doe.athenarc</div>
              </div>
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">Address:</div>
                <div class="settings__item__details__row__main">
                  <p>17, Leocharous</p>
                  <p>Greece</p>
                  <p>Attica</p>
                </div>
              </div>
            </div>
          </a>
          <a class="settings__item settings__item--empty"></a>
          <a class="settings__item settings__item--empty"></a>
        </div> -->
      </div>
      <!-- <div class="dashboard__wrapper">
        <div class="dashboard__inner">
          <div class="dashboard__head">
            <div class="dashboard__head__helpers">
              <h1>Profile Information</h1>
            </div>
          </div>
          <div class="settings">
            <div class="settings__grid">
              <div class="settings__item settings__item--single">
                <div class="settings__item__details">
                  <div class="settings__item__details__row">
                    <div class="settings__item__details__row__label">Full Name: </div>
                    <div class="settings__item__details__row__main">John Doe</div>
                    <a href="#" class="settings__item__details__row__edit">CHANGE</a>
                  </div>
                  <div class="settings__item__details__row">
                    <div class="settings__item__details__row__label">username: </div>
                    <div class="settings__item__details__row__main">@John.doe.athenarc</div>
                    <a href="#" class="settings__item__details__row__edit">CHANGE</a>
                  </div>
                  <div class="settings__item__details__row">
                    <div class="settings__item__details__row__label">Image:</div>
                    <div class="settings__item__details__row__main"><div class="settings__item__details__row__main__logo"><img src="/assets/images/about/partners/athina_logo.svg" alt=""></div></div>
                    <a href="#" class="settings__item__details__row__edit">CHANGE</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AccountApi from '@/service/account';
import {
  Account, ServerResponse,
} from '@/model';
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

extend('required', required);
extend('email', email);
extend('confirmed', confirmed);
extend('min', min);
extend('length', length);
localize({
  en,
});

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
})
export default class DashboardHome extends Vue {
  selectedTab: string;

  accountApi: AccountApi;

  userData: null | Account;

  cards: string [];

  isKycValidated: boolean;

  declarations: any;

  selectedDeclaration: null | number;

  selectedUbo: number;

  showUboForm: boolean;

  // temporarily? using the following array of countries to populate options of country-select inputs
  // eslint-disable-next-line
  countries: string[] = ["Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Georgia", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Kosovo", "Latvia", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Malta", "Moldova", "Monaco", "Montenegro", "The Netherlands", "Norway", "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Turkey", "Ukraine", "United Kingdom", "Vatican City",];

  constructor() {
    super();

    this.accountApi = new AccountApi();

    this.userData = null;

    this.selectedTab = 'general';

    this.isKycValidated = false;

    this.declarations = [];

    this.selectedDeclaration = null;

    this.selectedUbo = 0;

    this.showUboForm = false;

    this.cards = ['1234 5678 1234 5678', '1111 2222 3333 4444'];
  }

  mounted(): void {
    this.loadUserData();
  }

  loadUserData() {
    this.accountApi.getUserData().then((response: ServerResponse<Account>) => {
      console.log(response);
      this.userData = response.result;
    });
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  addDeclaration(): void {
    this.selectedUbo = 0;

    this.declarations.push({
      status: 'CREATED',
      id: Math.floor(Math.random() * 10000000000),
      creationDate: Date.now(),
      ubos: [],
    });
  }

  selectDeclaration(i) {
    if (i !== this.selectedDeclaration) {
      this.selectedUbo = 0;
    }
    this.selectedDeclaration = i;
    // this.showUboForm = false;
  }

  selectUbo(i) {
    this.selectedUbo = i;
    // this.showUboForm = true;
  }

  addUboToDeclaration(): void {
    const uboData = {
      lastName: '',
      firstName: '',
      addressLine1: '',
      addressLine2: '',
      country: '',
      region: '',
      city: '',
      zipCode: '',
      birthdate: '',
      nationality: '',
      birthplaceCity: '',
      birthplaceCountry: '',
    };

    this.declarations[this.selectedDeclaration!].ubos.push(uboData);
    this.showUboForm = true;
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/dashboard/_settings.scss";
  // @import "@/assets/styles/_settings.scss";
  @import "@/assets/styles/_collection.scss";
  @import "~flexboxgrid/css/flexboxgrid.min.css";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
  @import "@/assets/styles/_forms.scss";
  @import "@/assets/styles/_btns.scss";
</style>
