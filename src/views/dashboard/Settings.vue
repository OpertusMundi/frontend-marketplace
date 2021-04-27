<template>
    <div class="dashboard__inner">
      <div class="dashboard__head">
        <div class="dashboard__head__helpers">
          <h1>Settings</h1>
        </div>
      </div>

      <!-- MODALS -->
      <!-- IMPORTANT: Pass as input ID the exact name of API Gateway POST parameter in order to be passed on submit -->
      <div v-if="!isLoading()">
        <modal :show="modalToShow == 'image'" @dismiss="modalToShow = ''" @submit="onSubmitTopioAccountField" :title="'Change your image'" :modalId="'image'" :inputs="[{id: 'image', name: 'Image', type: 'file', returnType: 'base64'}]"></modal>
        <modal :show="modalToShow == 'fullName'" @dismiss="modalToShow = ''" @submit="onSubmitTopioAccountField" :title="'Change your full name'" :modalId="'fullName'" :inputs="[{id: 'firstName', name: 'First Name', value: userData.profile.firstName, type: 'text'}, {id: 'lastName', name: 'Last Name', value: userData.profile.lastName, type: 'text'}]"></modal>
        <modal :show="modalToShow == 'mobileNumber'" @dismiss="modalToShow = ''" @submit="onSubmitTopioAccountField" :title="'Change your mobile number'" :modalId="'mobile'" :inputs="[{id: 'mobile', name: 'Mobile number', value: userData.profile.mobile, type: 'text'}]"></modal>

        <modal :show="modalToShow == 'companyName'" @dismiss="modalToShow = ''" @submit="onSubmitMangoPayField" :title="'Change your company name'" :modalId="'companyName'" :inputs="[{id: 'companyName', name: 'Company Name', value: userData.profile.provider.draft? userData.profile.provider.draft.name : userData.profile.provider.current.name, type: 'text'}]"></modal>
        <modal :show="modalToShow == 'vatNumber'" @dismiss="modalToShow = ''" @submit="onSubmitMangoPayField" :title="'Change vendor VAT number'" :modalId="'vatNumber'" :inputs="[{id: 'vatNumber', name: 'VAT Number', value: userData.profile.provider.draft? userData.profile.provider.draft.companyNumber : userData.profile.provider.current.companyNumber, type: 'text'}]"></modal>
        <modal :show="modalToShow == 'domain'" @dismiss="modalToShow = ''" @submit="onSubmitMangoPayField" :title="'Change your company type'" :modalId="'companyType'" :inputs="[{id: 'companyType', name: 'Company Type', value: userData.profile.provider.draft? userData.profile.provider.draft.companyType : userData.profile.provider.current.companyType, type: 'text'}]"></modal>
        <modal :show="modalToShow == 'companyEmail'" @dismiss="modalToShow = ''" @submit="onSubmitMangoPayField" :title="'Change your company email'" :modalId="'companyEmail'" :inputs="[{id: 'companyEmail', name: 'Company Email', value: userData.profile.provider.draft? userData.profile.provider.draft.email : userData.profile.provider.current.email, type: 'text'}]"></modal>
        <modal :show="modalToShow == 'website'" @dismiss="modalToShow = ''" @submit="onSubmitMangoPayField" :title="'Change your website'" :modalId="'siteUrl'" :inputs="[{id: 'siteUrl', name: 'Site URL', value: userData.profile.provider.draft? userData.profile.provider.draft.siteUrl : userData.profile.provider.current.siteUrl, type: 'text'}]"></modal>

        <modal :show="modalToShow == 'bankAccountOwnerName'" @dismiss="modalToShow = ''" @submit="onSubmitMangoPayField" :title="'Change account owner\'s name'" :modalId="'bankAccountOwnerName'" :inputs="[{id: 'bankAccountOwnerName', name: 'Full Name', value: userData.profile.provider.draft? userData.profile.provider.draft.bankAccount.ownerName : userData.profile.provider.current.bankAccount.ownerName, type: 'text'}]"></modal>
        <modal :show="modalToShow == 'bankAccountIban'" @dismiss="modalToShow = ''" @submit="onSubmitMangoPayField" :title="'Change IBAN'" :modalId="'bankAccountIban'" :inputs="[{id: 'bankAccountIban', name: 'IBAN', value: userData.profile.provider.draft? userData.profile.provider.draft.bankAccount.iban : userData.profile.provider.current.bankAccount.iban, type: 'text'}]"></modal>
        <modal :show="modalToShow == 'bankAccountBic'" @dismiss="modalToShow = ''" @submit="onSubmitMangoPayField" :title="'Change BIC'" :modalId="'bankAccountBic'" :inputs="[{id: 'bankAccountBic', name: 'BIC', value: userData.profile.provider.draft? userData.profile.provider.draft.bankAccount.bic : userData.profile.provider.current.bankAccount.bic, type: 'text'}]"></modal>

        <modal :withSlots="true" :show="modalToShow == 'password'" @dismiss="modalToShow = ''" :modalId="'password'">
          <template v-slot:body>
            <h1>Change password</h1>

            <div class="form-group">
              <label for="modal_input_password" class="mt-xs-20"> Password </label>
              <input v-model="password" class="form-group__text" type="password" id="modal_input_password">

              <label for="modal_input_passwordVerification" class="mt-xs-20"> Verify password </label>
              <input v-model="passwordVerify" class="form-group__text" type="password" id="modal_input_passwordVerification">
            </div>
          </template>

          <template v-slot:btn-submit><button class="btn btn--std btn--blue ml-xs-20" @click="onSubmitTopioAccountField({modalId: 'password'})" :disabled="password !== passwordVerify || password === ''">CONFIRM</button></template>
        </modal>

        <modal :withSlots="true" :show="modalToShow == 'bankAccountOwnerAddress'" @dismiss="modalToShow = ''" :modalId="'bankAccountOwnerAddress'">
          <template v-slot:body>
            <h1 class="mb-xs-20">Change Owner Address</h1>

            <div class="form-group">
              <label for="bankAccountOwnerAddressLine1">Line 1</label>
              <input ref="bankAccountOwnerAddressLine1" :value="userData.profile.provider.draft? userData.profile.provider.draft.bankAccount.ownerAddress.line1 : userData.profile.provider.current.bankAccount.ownerAddress.line1" class="form-group__text" type="text" id="bankAccountOwnerAddressLine1">
            </div>
            <div class="form-group">
              <label for="bankAccountOwnerAddressLine2">Line 2</label>
              <input ref="bankAccountOwnerAddressLine2" :value="userData.profile.provider.draft? userData.profile.provider.draft.bankAccount.ownerAddress.line2 : userData.profile.provider.current.bankAccount.ownerAddress.line2" class="form-group__text" type="text" id="bankAccountOwnerAddressLine2">
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="bankAccountOwnerAddressCity">City</label>
                  <input ref="bankAccountOwnerAddressCity" :value="userData.profile.provider.draft? userData.profile.provider.draft.bankAccount.ownerAddress.city : userData.profile.provider.current.bankAccount.ownerAddress.city" class="form-group__text" type="text" id="bankAccountOwnerAddressCity">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="bankAccountOwnerAddressRegion">Region</label>
                  <input ref="bankAccountOwnerAddressRegion" :value="userData.profile.provider.draft? userData.profile.provider.draft.bankAccount.ownerAddress.region : userData.profile.provider.current.bankAccount.ownerAddress.region" class="form-group__text" type="text" id="bankAccountOwnerAddressRegion">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="bankAccountOwnerAddressPostalCode">Postal Code</label>
                  <input ref="bankAccountOwnerAddressPostalCode" :value="userData.profile.provider.draft? userData.profile.provider.draft.bankAccount.ownerAddress.postalCode : userData.profile.provider.current.bankAccount.ownerAddress.postalCode" class="form-group__text" type="text" id="bankAccountOwnerAddressPostalCode">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="bankAccountOwnerAddressCountry">Country</label>
                  <input ref="bankAccountOwnerAddressCountry" :value="userData.profile.provider.draft? userData.profile.provider.draft.bankAccount.ownerAddress.country : userData.profile.provider.current.bankAccount.ownerAddress.country" class="form-group__text" type="text" id="bankAccountOwnerAddressCountry">
                </div>
              </div>
            </div>
          </template>
          <template v-slot:btn-submit>
            <button class="btn--std btn--blue ml-xs-20" @click="onSubmitMangoPayField({modalId: 'bankAccountOwnerAddress'})">CONFIRM</button>
          </template>
        </modal>

        <modal :withSlots="true" :show="modalToShow == 'headquartersAddress'" @dismiss="modalToShow = ''" :modalId="'headquartersAddress'">
          <template v-slot:body>
            <h1 class="mb-xs-20">Change Headquarters Address</h1>

            <div class="form-group">
              <label for="headquartersAddressLine1">Line 1</label>
              <input ref="headquartersAddressLine1" :value="userData.profile.provider.draft? userData.profile.provider.draft.headquartersAddress.line1 : userData.profile.provider.current.headquartersAddress.line1" class="form-group__text" type="text" id="headquartersAddressLine1">
            </div>
            <div class="form-group">
              <label for="headquartersAddressLine2">Line 2</label>
              <input ref="headquartersAddressLine2" :value="userData.profile.provider.draft? userData.profile.provider.draft.headquartersAddress.line2 : userData.profile.provider.current.headquartersAddress.line2" class="form-group__text" type="text" id="headquartersAddressLine2">
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="headquartersAddressCity">City</label>
                  <input ref="headquartersAddressCity" :value="userData.profile.provider.draft? userData.profile.provider.draft.headquartersAddress.city : userData.profile.provider.current.headquartersAddress.city" class="form-group__text" type="text" id="headquartersAddressCity">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="headquartersAddressRegion">Region</label>
                  <input ref="headquartersAddressRegion" :value="userData.profile.provider.draft? userData.profile.provider.draft.headquartersAddress.region : userData.profile.provider.current.headquartersAddress.region" class="form-group__text" type="text" id="headquartersAddressRegion">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="headquartersAddressPostalCode">Postal Code</label>
                  <input ref="headquartersAddressPostalCode" :value="userData.profile.provider.draft? userData.profile.provider.draft.headquartersAddress.postalCode : userData.profile.provider.current.headquartersAddress.postalCode" class="form-group__text" type="text" id="headquartersAddressPostalCode">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="headquartersAddressCountry">Country</label>
                  <input ref="headquartersAddressCountry" :value="userData.profile.provider.draft? userData.profile.provider.draft.headquartersAddress.country : userData.profile.provider.current.headquartersAddress.country" class="form-group__text" type="text" id="headquartersAddressCountry">
                </div>
              </div>
            </div>
          </template>
          <template v-slot:btn-submit>
            <button class="btn--std btn--blue ml-xs-20" @click="onSubmitMangoPayField({modalId: 'headquartersAddress'})">CONFIRM</button>
          </template>
        </modal>

        <modal :withSlots="true" :show="modalToShow == 'representativeAddress'" @dismiss="modalToShow = ''" :modalId="'representativeAddress'">
          <template v-slot:body>
            <h1 class="mb-xs-20">Change Legal Representative's Address</h1>

            <div class="form-group">
              <label for="representativeAddressLine1">Line 1</label>
              <input ref="representativeAddressLine1" :value="userData.profile.provider.draft? userData.profile.provider.draft.representative.address.line1 : userData.profile.provider.current.representative.address.line1" class="form-group__text" type="text" id="representativeAddressLine1">
            </div>
            <div class="form-group">
              <label for="representativeAddressLine2">Line 2</label>
              <input ref="representativeAddressLine2" :value="userData.profile.provider.draft? userData.profile.provider.draft.representative.address.line2 : userData.profile.provider.current.representative.address.line2" class="form-group__text" type="text" id="representativeAddressLine2">
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="representativeAddressCity">City</label>
                  <input ref="representativeAddressCity" :value="userData.profile.provider.draft? userData.profile.provider.draft.representative.address.city : userData.profile.provider.current.representative.address.city" class="form-group__text" type="text" id="representativeAddressCity">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="representativeAddressRegion">Region</label>
                  <input ref="representativeAddressRegion" :value="userData.profile.provider.draft? userData.profile.provider.draft.representative.address.region : userData.profile.provider.current.representative.address.region" class="form-group__text" type="text" id="representativeAddressRegion">
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label for="representativeAddressPostalCode">Postal Code</label>
                  <input ref="representativeAddressPostalCode" :value="userData.profile.provider.draft? userData.profile.provider.draft.representative.address.postalCode : userData.profile.provider.current.representative.address.postalCode" class="form-group__text" type="text" id="representativeAddressPostalCode">
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-group">
                  <label for="representativeAddressCountry">Country</label>
                  <input ref="representativeAddressCountry" :value="userData.profile.provider.draft? userData.profile.provider.draft.representative.address.country : userData.profile.provider.current.representative.address.country" class="form-group__text" type="text" id="representativeAddressCountry">
                </div>
              </div>
            </div>
          </template>
          <template v-slot:btn-submit>
            <button class="btn--std btn--blue ml-xs-20" @click="onSubmitMangoPayField({modalId: 'representativeAddress'})">CONFIRM</button>
          </template>
        </modal>

        <modal :withSlots="true" :show="modalToShow == 'kycIdentityProof' || modalToShow == 'kycArticlesOfAssociation' || modalToShow == 'kycRegistrationProof'" @dismiss="modalToShow = ''" :modalId="'kycIdentityProof'">
          <template v-slot:body>
            <h1>Upload pages</h1>

            <div v-for="kycInput in kycNumberOfInputs" :key="kycInput" class="form-group mt-sm-20">
              <div><input class="form-group__text input-kyc-file" type="file"></div>
              <div><input class="form-group__text input-kyc-comments" type="text" placeholder="add comments"></div>
            </div>

            <button class="btn--std btn--outlineblue" @click="addKycInput">+ add page</button>
          </template>

          <template v-slot:btn-submit>
            <button v-if="modalToShow == 'kycIdentityProof'" class="btn--std btn--blue ml-xs-20" @click="onSubmitKycPages('identityProof')">submit pages</button>
            <button v-if="modalToShow == 'kycArticlesOfAssociation'" class="btn--std btn--blue ml-xs-20" @click="onSubmitKycPages('articlesOfAssociation')">submit pages</button>
            <button v-if="modalToShow == 'kycRegistrationProof'" class="btn--std btn--blue ml-xs-20" @click="onSubmitKycPages('registrationProof')">submit pages</button>
          </template>
        </modal>
      </div>

      <!-- END OF MODALS -->

      <div class="settings">

        <div v-if="isUserDraft && draftStatus=='DRAFT'" class="mt-xs-20 mb-xs-20">
          <h3 class="settings__alert--gray">You have unapplied changes in your draft, related to your vendor profile. If you have finsished editing, you need to
            <button @click="submitRegistrationFromDraft" class="btn btn--std btn--blue">SUBMIT CHANGES</button>
          </h3>
        </div>

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

        <div v-if="!isLoading()" class="tabs__outter-wrapper">
          <!-- GENERAL -->
          <transition name="fade" mode="out-in">
            <div class="tabs__single-tab-wrapper" v-if="selectedTab == 'general'">
              <div class="tabs__tab tabs__tab__tab-general">
                <div class="tabs__tab__list">
                  <div class="tabs__tab__list__item"><strong>Image</strong></div>
                  <div class="tabs__tab__list__item right"><img :src="'data:' + userData.profile.imageMimeType + ';base64, ' + userData.profile.image" :height="80" :width="80" alt="user image" style="border-radius: 50%"></div>
                  <div class="tabs__tab__list__item"><button @click="modalToShow = 'image'" class="btn--std btn--outlinedark">CHANGE</button></div>
                  <div class="tabs__tab__list__line"></div>

                  <div class="tabs__tab__list__item"><strong>Full name</strong></div>
                  <div class="tabs__tab__list__item right">{{ userData.profile.firstName + ' ' + userData.profile.lastName }}</div>
                  <div class="tabs__tab__list__item"><button @click="modalToShow = 'fullName'" class="btn--std btn--outlinedark">EDIT</button></div>
                  <div class="tabs__tab__list__line"></div>

                  <div class="tabs__tab__list__item"><strong>Mobile number</strong></div>
                  <div class="tabs__tab__list__item right">{{ userData.profile.mobile }}</div>
                  <div class="tabs__tab__list__item"><button @click="modalToShow = 'mobileNumber'" class="btn--std btn--outlinedark">CHANGE</button></div>
                  <div class="tabs__tab__list__line"></div>

                  <div class="tabs__tab__list__item"><strong>Locale</strong></div>
                  <div class="tabs__tab__list__item right">{{ userData.profile.locale }}</div>
                  <div class="tabs__tab__list__item"><button @click="modalToShow = 'locale'" class="btn--std btn--outlinedark">CHANGE</button></div>
                  <div class="tabs__tab__list__line"></div>
                </div>
              </div>
            </div>
          </transition>

          <!-- LOGIN & SECURITY -->
          <transition name="fade" mode="out-in">
            <div class="tabs__single-tab-wrapper" v-if="selectedTab == 'loginAndSecurity'">
              <div class="tabs__tab tabs__tab__login_security">
                <div class="tabs__tab__list">
                  <div class="tabs__tab__list__item"><strong>Password</strong></div>
                  <div class="tabs__tab__list__item"></div>
                  <div class="tabs__tab__list__item"><button @click="modalToShow = 'password'" class="btn--std btn--outlinedark">CHANGE</button></div>
                  <div class="tabs__tab__list__line"></div>
                </div>
              </div>
            </div>
          </transition>

          <!-- COMPANY INFORMATION -->
          <transition name="fade" mode="out-in">
            <div class="tabs__single-tab-wrapper" v-if="selectedTab == 'companyInformation'">

              <div v-if="isUserDraft && draftStatus=='SUBMITTED'" class="mt-xs-20 mb-xs-20">
                <h3 class="settings__alert--blue">You have submitted changes and are pending approval.</h3>
              </div>

              <div class="tabs__tab tabs__tab__company_information">
                <div class="tabs__tab__list">
                  <div class="tabs__tab__list__item"><strong>Company name</strong></div>
                  <div class="tabs__tab__list__item right">{{ userData.profile.provider.draft? userData.profile.provider.draft.name : userData.profile.provider.current.name }}</div>
                  <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" @click="modalToShow = 'companyName'" class="btn btn--std btn--outlinedark">EDIT</button></div>
                  <div class="tabs__tab__list__line"></div>

                  <div class="tabs__tab__list__item"><strong>VAT number</strong></div>
                  <div class="tabs__tab__list__item right"> {{ userData.profile.provider.draft? userData.profile.provider.draft.companyNumber : userData.profile.provider.current.companyNumber }} </div>
                  <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" @click="modalToShow = 'vatNumber'" class="btn btn--std btn--outlinedark">EDIT</button></div>
                  <div class="tabs__tab__list__line"></div>

                  <div class="tabs__tab__list__item"><strong>Domain</strong></div>
                  <div class="tabs__tab__list__item right">{{ userData.profile.provider.draft? userData.profile.provider.draft.companyType : userData.profile.provider.current.companyType }}</div>
                  <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" @click="modalToShow = 'domain'" class="btn btn--std btn--outlinedark">EDIT</button></div>
                  <div class="tabs__tab__list__line"></div>

                  <div class="tabs__tab__list__item"><strong>Company email</strong></div>
                  <div class="tabs__tab__list__item right">{{ userData.profile.provider.draft? userData.profile.provider.draft.email : userData.profile.provider.current.email }}</div>
                  <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" @click="modalToShow = 'companyEmail'" class="btn btn--std btn--outlinedark">EDIT</button></div>
                  <div class="tabs__tab__list__line"></div>

                  <div class="tabs__tab__list__item"><strong>Website</strong></div>
                  <div class="tabs__tab__list__item right">{{ userData.profile.provider.draft? userData.profile.provider.draft.siteUrl : userData.profile.provider.current.siteUrl }}</div>
                  <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" @click="modalToShow = 'website'" class="btn btn--std btn--outlinedark">EDIT</button></div>
                  <div class="tabs__tab__list__line"></div>
                </div>
              </div>
            </div>
          </transition>

          <!-- PAYOUT OPTIONS -->
          <transition name="fade" mode="out-in">
            <div class="tabs__single-tab-wrapper" v-if="selectedTab == 'payoutOptions'">

              <div v-if="isUserDraft && draftStatus=='SUBMITTED'" class="mt-xs-20 mb-xs-20">
                <h3 class="settings__alert--blue">You have submitted changes and are pending approval.</h3>
              </div>

              <div class="tabs__tab tabs__tab__payout_options">
                <div class="tabs__tab__list">
                  <div class="tabs__tab__list__item"><strong>Bank Account Owner Name</strong></div>
                  <div class="tabs__tab__list__item right">{{ userData.profile.provider.draft? userData.profile.provider.draft.bankAccount.ownerName : userData.profile.provider.current.bankAccount.ownerName }}</div>
                  <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" @click="modalToShow = 'bankAccountOwnerName'" class="btn btn--std btn--outlinedark">CHANGE</button></div>
                  <div class="tabs__tab__list__line"></div>
                </div>

                <div class="tabs__tab__list">
                  <div class="tabs__tab__list__item"><strong>IBAN</strong></div>
                  <div class="tabs__tab__list__item right">{{ userData.profile.provider.draft? userData.profile.provider.draft.bankAccount.iban : userData.profile.provider.current.bankAccount.iban }}</div>
                  <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" @click="modalToShow = 'bankAccountIban'" class="btn btn--std btn--outlinedark">CHANGE</button></div>
                  <div class="tabs__tab__list__line"></div>
                </div>

                <div class="tabs__tab__list">
                  <div class="tabs__tab__list__item"><strong>BIC</strong></div>
                  <div class="tabs__tab__list__item right">{{ userData.profile.provider.draft? userData.profile.provider.draft.bankAccount.bic : userData.profile.provider.current.bankAccount.bic }}</div>
                  <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" @click="modalToShow = 'bankAccountBic'" class="btn btn--std btn--outlinedark">CHANGE</button></div>
                  <div class="tabs__tab__list__line"></div>
                </div>

                <div class="tabs__tab__list">
                  <div class="tabs__tab__list__item"><strong>Address</strong></div>
                  <div v-if="!userData.profile.provider.draft" class="tabs__tab__list__item right">{{ userData.profile.provider.current.bankAccount.ownerAddress.line1 }}, {{ userData.profile.provider.current.bankAccount.ownerAddress.line2? userData.profile.provider.current.bankAccount.ownerAddress.line2 + ', ': '' }} {{ userData.profile.provider.current.bankAccount.ownerAddress.postalCode }}, {{ userData.profile.provider.current.bankAccount.ownerAddress.city }}, {{ userData.profile.provider.current.bankAccount.ownerAddress.region }}, {{ userData.profile.provider.current.bankAccount.ownerAddress.country }}</div>
                  <div v-if="userData.profile.provider.draft" class="tabs__tab__list__item right">{{ userData.profile.provider.draft.bankAccount.ownerAddress.line1 }}, {{ userData.profile.provider.draft.bankAccount.ownerAddress.line2? userData.profile.provider.draft.bankAccount.ownerAddress.line2 + ', ': '' }} {{ userData.profile.provider.draft.bankAccount.ownerAddress.postalCode }}, {{ userData.profile.provider.draft.bankAccount.ownerAddress.city }}, {{ userData.profile.provider.draft.bankAccount.ownerAddress.region }}, {{ userData.profile.provider.draft.bankAccount.ownerAddress.country }}</div>
                  <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" @click="modalToShow = 'bankAccountOwnerAddress'" class="btn btn--std btn--outlinedark">CHANGE</button></div>
                  <div class="tabs__tab__list__line"></div>
                </div>
              </div>
            </div>
          </transition>

          <!-- ADDRESSES -->
          <transition name="fade" mode="out-in">
            <div class="tabs__single-tab-wrapper" v-if="selectedTab == 'addresses'">

              <div v-if="isUserDraft && draftStatus=='SUBMITTED'" class="mt-xs-20 mb-xs-20">
                <h3 class="settings__alert--blue">You have submitted changes and are pending approval.</h3>
              </div>

              <div class="tabs__tab tabs__tab__addresses">
                <div class="tabs__tab__list">
                  <div class="tabs__tab__list__item"><strong>Headquarters address</strong></div>
                  <div v-if="!userData.profile.provider.draft" class="tabs__tab__list__item right">{{ userData.profile.provider.current.headquartersAddress.line1 }}, {{ userData.profile.provider.current.headquartersAddress.line2? userData.profile.provider.current.headquartersAddress.line2 + ', ': '' }} {{ userData.profile.provider.current.headquartersAddress.postalCode }}, {{ userData.profile.provider.current.headquartersAddress.city }}, {{ userData.profile.provider.current.headquartersAddress.region }}, {{ userData.profile.provider.current.headquartersAddress.country }}</div>
                  <div v-if="userData.profile.provider.draft" class="tabs__tab__list__item right">{{ userData.profile.provider.draft.headquartersAddress.line1 }}, {{ userData.profile.provider.draft.headquartersAddress.line2? userData.profile.provider.draft.headquartersAddress.line2 + ', ': '' }} {{ userData.profile.provider.draft.headquartersAddress.postalCode }}, {{ userData.profile.provider.draft.headquartersAddress.city }}, {{ userData.profile.provider.draft.headquartersAddress.region }}, {{ userData.profile.provider.draft.headquartersAddress.country }}</div>
                  <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" @click="modalToShow = 'headquartersAddress'" class="btn btn--std btn--outlinedark">EDIT</button></div>
                  <div class="tabs__tab__list__line"></div>

                  <div class="tabs__tab__list__item"><strong>Legal Representative's address</strong></div>
                  <div v-if="!userData.profile.provider.draft" class="tabs__tab__list__item right">{{ userData.profile.provider.current.representative.address.line1 }}, {{ userData.profile.provider.current.representative.address.line2? userData.profile.provider.current.representative.address.line2 + ', ': '' }} {{ userData.profile.provider.current.representative.address.postalCode }}, {{ userData.profile.provider.current.representative.address.city }}, {{ userData.profile.provider.current.representative.address.region }}, {{ userData.profile.provider.current.representative.address.country }}</div>
                  <div v-if="userData.profile.provider.draft" class="tabs__tab__list__item right">{{ userData.profile.provider.draft.representative.address.line1 }}, {{ userData.profile.provider.draft.representative.address.line2? userData.profile.provider.draft.representative.address.line2 + ', ': '' }} {{ userData.profile.provider.draft.representative.address.postalCode }}, {{ userData.profile.provider.draft.representative.address.city }}, {{ userData.profile.provider.draft.representative.address.region }}, {{ userData.profile.provider.draft.representative.address.country }}</div>
                  <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" @click="modalToShow = 'representativeAddress'" class="btn btn--std btn--outlinedark">EDIT</button></div>
                  <div class="tabs__tab__list__line"></div>
                </div>
              </div>
            </div>
          </transition>

          <!-- PAYMENT METHODS -->
          <transition name="fade" mode="out-in">
            <div class="tabs__single-tab-wrapper" v-if="selectedTab == 'paymentMethods'">

              <div v-if="isUserDraft && draftStatus=='SUBMITTED'" class="mt-xs-20 mb-xs-20">
                <h3 class="settings__alert--blue">You have submitted changes and are pending approval.</h3>
              </div>

              <div class="tabs__tab tabs__tab__payment_methods">
                <div v-for="(card, i) in cards" :key="i" class="tabs__tab__ignore-grid-wrapper">
                  <div class="tabs__tab__list">
                    <div class="tabs__tab__list__item"><strong>CARD {{ i + 1 }}</strong></div>
                    <div class="tabs__tab__list__item right">{{ card }} (dummy)</div>
                    <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" class="btn btn--std btn--outlinedark">REMOVE</button></div>
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
                  <div class="col-md-7 d-flex flex-column" v-if="kycDocuments">
                    <span class="text-black"><strong>Vendor validation status</strong></span>
                    <div class="mt-xs-20" v-if="isVendorKycValidated()"><span class="tabs__tab__kyc__status-label tabs__tab__kyc__status-label--validated">KYC VALIDATED</span></div>
                    <div class="mt-xs-20" v-if="!isVendorKycValidated()"><span class="tabs__tab__kyc__status-label tabs__tab__kyc__status-label--not-validated">NOT KYC VALIDATED</span></div>
                    <div class="mt-xs-30 d-flex" v-if="!isVendorKycValidated()">
                      <div class="font-weight-500">Issues:</div>
                      <div class="ml-xs-20">
                        <p v-if="!kycDocuments.filter(x => x.type === 'IDENTITY_PROOF').some((x) => x.status === 'VALIDATED')" class="mb-xs-5">Missing Identity proof document</p>
                        <p v-if="!kycDocuments.filter(x => x.type === 'ARTICLES_OF_ASSOCIATION').some((x) => x.status === 'VALIDATED')" class="mb-xs-5">Missing Articles of association document</p>
                        <p v-if="!kycDocuments.filter(x => x.type === 'REGISTRATION_PROOF').some((x) => x.status === 'VALIDATED')" class="mb-xs-5">Missing Registration proof document</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="tabs__tab__kyc__list mt-xs-30">
                  <!-- identity proof -->
                  <div class="tabs__tab__kyc__list__title d-flex align-items-center mb-xs-20">
                    <button @click="modalToShow = 'kycIdentityProof'" class="mr-xs-20 btn--std btn--blue">Add Document</button>
                    <h3>Identity proof *</h3>
                  </div>
                  <span></span><span>STATUS</span><span>REFUSAL REASON</span><span>ID</span><span>CREATION DATE</span><span>PROCESSED DATE</span>
                  <div class="tabs__tab__ignore-grid-wrapper">
                    <div v-for="(document, i) in kycDocuments.filter(x => x.type === 'IDENTITY_PROOF')" :key="i" class="tabs__tab__ignore-grid-wrapper">
                      <div class="mr-xs-40">{{ i + 1 }}.</div>
                      <div :class="{'validated': document.status == 'VALIDATED', 'refused': document.status == 'REFUSED'}">{{ document.status }}</div>
                      <div>{{ document.refusedReasonMessage }}</div>
                      <div><small>{{ document.id }}</small></div>
                      <div>{{ document.createdOn }}</div>
                      <div>{{ document.processedOn }}</div>
                    </div>
                  </div>
                  <hr>

                  <!-- articles of association -->
                  <div class="tabs__tab__kyc__list__title d-flex align-items-center mb-xs-20">
                    <button @click="modalToShow = 'kycArticlesOfAssociation'" class="mr-xs-20 btn--std btn--blue">Add Document</button>
                    <h3>Articles of Association *</h3>
                  </div>
                  <span></span><span>STATUS</span><span>REFUSAL REASON</span><span>ID</span><span>CREATION DATE</span><span>PROCESSED DATE</span>
                  <div class="tabs__tab__ignore-grid-wrapper">
                    <div v-for="(document, i) in kycDocuments.filter(x => x.type === 'ARTICLES_OF_ASSOCIATION')" :key="i" class="tabs__tab__ignore-grid-wrapper">
                      <div>{{ i + 1 }}.</div>
                      <div :class="{'validated': document.status == 'VALIDATED', 'refused': document.status == 'REFUSED'}">{{ document.status }}</div>
                      <div>{{ document.refusedReasonMessage }}</div>
                      <div><small>{{ document.id }}</small></div>
                      <div>{{ document.createdOn }}</div>
                      <div>{{ document.processedOn }}</div>
                    </div>
                  </div>
                  <hr>

                  <!-- registration proof -->
                  <div class="tabs__tab__kyc__list__title d-flex align-items-center mb-xs-20">
                    <button @click="modalToShow = 'kycRegistrationProof'" class="mr-xs-20 btn--std btn--blue">Add Document</button>
                    <h3>Registration proof *</h3>
                  </div>
                  <span></span><span>STATUS</span><span>REFUSAL REASON</span><span>ID</span><span>CREATION DATE</span><span>PROCESSED DATE</span>
                  <div class="tabs__tab__ignore-grid-wrapper">
                    <div v-for="(document, i) in kycDocuments.filter(x => x.type === 'REGISTRATION_PROOF')" :key="i" class="tabs__tab__ignore-grid-wrapper">
                      <div>{{ i + 1 }}.</div>
                      <div :class="{'validated': document.status == 'VALIDATED', 'refused': document.status == 'REFUSED'}">{{ document.status }}</div>
                      <div>{{ document.refusedReasonMessage }}</div>
                      <div><small>{{ document.id }}</small></div>
                      <div>{{ document.createdOn }}</div>
                      <div>{{ document.processedOn }}</div>
                    </div>
                  </div>

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
                    <div v-for="(declaration, i) in uboDeclarations" :key="i" @click="selectDeclaration(i)" class="tabs__tab__ubo__card tabs__tab__ubo__card--clickable" :class="{'tabs__tab__ubo__card--selected': i == selectedDeclaration}">
                      <span><span class="bold">STATUS:</span> {{ declaration.status }}</span>
                      <span><span class="bold">ID:</span> {{ declaration.id }}</span>
                      <span><span class="bold">CREATION DATE:</span> {{ declaration.createdOn }}</span>
                    </div>
                    <button v-if="uboDeclarations && canAddDeclaration()" @click="addDeclaration()" class="tabs__tab__ubo__btn">ADD DECLARATION</button>
                  </div>
                  <div class="col-md-2">
                    <div v-if="isUbosOfUboDeclarationLoaded">
                      <div v-for="(ubo, i) in uboDeclarations[selectedDeclaration].ubos" :key="i" class="tabs__tab__ubo__card">
                        <span class="title">UBO {{ i + 1 }}</span>
                        <span><span class="bold">ID:</span> {{ ubo.id }} </span>
                        <span><span class="bold">FIRST NAME:</span> {{ ubo.firstName }}</span>
                        <span><span class="bold">LAST NAME:</span> {{ ubo.lastName }} </span>
                        <span><span class="bold">ADDRESS:</span> {{ ubo.address.line1 + ', ' + (ubo.address.line2? ubo.address.line2 + ', ' : '') + ubo.address.postalCode + ', ' + ubo.address.city + ', ' + ubo.address.region + ', ' + ubo.address.country }} </span>
                        <span><span class="bold">NATIONALITY:</span> {{ ubo.nationality }} </span>
                        <span><span class="bold">BIRTHDATE:</span> {{ ubo.birthdate }} </span>
                        <span><span class="bold">BIRTHPLACE:</span> {{ ubo.birthplace.city + ', ' + ubo.birthplace.country }} </span>
                        <button v-if="canRemoveUboFromDeclaration()" @click="removeUboFromDeclaration(uboDeclarations[selectedDeclaration].id, ubo.id)" class="btn--std btn--outlinedark">REMOVE</button>
                      </div>
                      <div v-if="showUboForm" class="tabs__tab__ubo__card tabs__tab__ubo__card--selected">
                        <span class="ubo-title">
                          UBO {{ uboDeclarations[selectedDeclaration].ubos? uboDeclarations[selectedDeclaration].ubos.length + 1 : 1 }}
                        </span>
                      </div>
                      <button @click="addUboToDeclaration()" v-if="canAddUbo()" :disabled="showUboForm" class="tabs__tab__ubo__btn">ADD UBO</button>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <button class="btn--std btn--blue" v-if="canSubmitDeclaration()" @click="submitDeclaration">Submit Declaration</button>

                    <div v-if="showUboForm">
                      <validation-provider v-slot="{ errors }" name="Last name" rules="required">
                        <div class="form-group">
                          <label for="last_name">Last name*</label>
                          <input v-model="uboToAdd.lastName" type="text" class="form-group__text" name="last_name" id="last_name">
                          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                        </div>
                      </validation-provider>

                      <validation-provider v-slot="{ errors }" name="First Name" rules="required">
                        <div class="form-group">
                          <label for="firstName">First name*</label>
                          <input v-model="uboToAdd.firstName" type="text" class="form-group__text" name="firstName" id="firstName">
                          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                        </div>
                      </validation-provider>

                      <validation-provider v-slot="{ errors }" name="Address Line 1" rules="required">
                        <div class="form-group">
                          <label for="address_line_1">Address Line 1*</label>
                          <input v-model="uboToAdd.address.line1" type="text" class="form-group__text" name="address_line_1" id="address_line_1">
                          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                        </div>
                      </validation-provider>

                      <validation-provider v-slot="{ errors }" name="Address Line 2">
                        <div class="form-group">
                          <label for="address_line_2">Address Line 2</label>
                          <input v-model="uboToAdd.address.line2" type="text" class="form-group__text" name="address_line_2" id="address_line_2">
                          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                        </div>
                      </validation-provider>

                      <div class="row">
                        <div class="col-md-6">
                          <validation-provider v-slot="{ errors }" name="Country" rules="required">
                            <div class="form-group">
                              <label for="country">Country *</label>
                              <select v-model="uboToAdd.address.country" class="form-group__select" name="country" id="country">
                                <option v-for="country in countries" :key="country.name" :value="country.code"> {{country.name}} </option>
                              </select>
                              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                            </div>
                          </validation-provider>
                        </div>

                        <div class="col-md-6">
                          <validation-provider v-slot="{ errors }" name="Region" rules="required">
                            <div class="form-group">
                              <label for="region">Region *</label>
                              <input v-model="uboToAdd.address.region" type="text" class="form-group__text" name="region" id="region">
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
                              <input v-model="uboToAdd.address.city" type="text" class="form-group__text" name="city" id="city">
                              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                            </div>
                          </validation-provider>
                        </div>

                        <div class="col-md-6">
                          <validation-provider v-slot="{ errors }" name="Zip code" rules="required">
                            <div class="form-group">
                              <label for="zipCode">Zip code *</label>
                              <input v-model="uboToAdd.address.postalCode" type="text" class="form-group__text" name="zipCode" id="zipCode">
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
                              <input type="date" v-model="uboToAdd.birthdate" class="form-group__text" name="birthdate" id="birthdate">
                              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                            </div>
                          </validation-provider>
                        </div>

                        <div class="col-md-6">
                          <validation-provider v-slot="{ errors }" name="Nationality" rules="required">
                            <div class="form-group">
                              <label for="nationality">Nationality *</label>
                              <select v-model="uboToAdd.nationality" class="form-group__select" name="nationality" id="nationality">
                                <option v-for="country in countries" :key="country.name" :value="country.code"> {{country.name}} </option>
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
                              <input v-model="uboToAdd.birthplace.city" type="text" class="form-group__text" name="birthplaceCity" id="birthplaceCity">
                              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                            </div>
                          </validation-provider>
                        </div>

                        <div class="col-md-6">
                          <validation-provider v-slot="{ errors }" name="Birthplace Country" rules="required">
                            <div class="form-group">
                              <label for="birthplaceCountry">Birthplace country *</label>
                              <select v-model="uboToAdd.birthplace.country" class="form-group__select" name="birthplaceCountry" id="birthplaceCountry">
                                <option v-for="country in countries" :key="country.name" :value="country.code"> {{country.name}} </option>
                              </select>
                              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                            </div>
                          </validation-provider>
                        </div>
                      </div>

                      <button class="btn--std btn--outlinedark" @click="showUboForm = false">CANCEL</button>
                      <button class="btn--std btn--dark ml-xs-20" @click="submitUbo">ADD UBO</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <div v-if="isLoading()" class="dummy-loader" style="position: fixed; top: 0; left: 0; height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center"><h1>LOADER</h1></div>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
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
import { EnumCustomerRegistrationStatus, EnumCustomerType, Address } from '@/model/account';
import {
  EnumKycDocumentType,
  KycDocument,
  KycDocumentCommand,
  KycDocumentPageCommand,
} from '@/model/kyc-document';
import {
  UboDeclaration, UboCommand,
} from '@/model/ubo-declaration';
import ProfileApi from '../../service/profile';
import ProviderApi from '../../service/provider';
import KycDocumentApi from '../../service/kyc-document';
import UboDeclarationApi from '../../service/ubo-declaration';
import Modal from '../../components/Modal.vue';

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
    Modal,
  },
})
export default class DashboardHome extends Vue {
  // APIs
  profileApi: ProfileApi;

  providerApi: ProviderApi;

  kycDocumentApi: KycDocumentApi;

  uboDeclarationApi: UboDeclarationApi;

  // booleans for data loading
  isUserDataLoaded: boolean;

  isKycDocumentsLoaded: boolean;

  isUboDeclarationsLoaded: boolean;

  isUbosOfUboDeclarationLoaded: boolean;

  // user data status
  isUserDraft: boolean; // whether there is user draft data stored or not

  draftStatus: string; // if user draft saved, the status of it (draft, cancelled, submitted, completed)

  // more

  selectedTab: string;

  modalToShow: string;

  userData: null | Account;

  password: string;

  passwordVerify: string;

  cards: string [];

  kycDocuments: KycDocument[] | null;

  kycNumberOfInputs: number;

  uboDeclarations: UboDeclaration[] | null;

  selectedDeclaration: null | number;

  showUboForm: boolean;

  uboToAdd: UboCommand;

  // temporarily? using the following array of countries to populate options of country-select inputs
  // eslint-disable-next-line
  countries: {name: string, code: string}[] = [{ name: 'FRANCE', code: 'FR' }, { name: 'GREECE', code: 'GR' }];

  constructor() {
    super();

    this.profileApi = new ProfileApi();

    this.providerApi = new ProviderApi();

    this.kycDocumentApi = new KycDocumentApi();

    this.uboDeclarationApi = new UboDeclarationApi();

    this.isUserDataLoaded = false;

    this.isKycDocumentsLoaded = false;

    this.isUboDeclarationsLoaded = false;

    this.isUbosOfUboDeclarationLoaded = false;

    this.isUserDraft = false;

    this.draftStatus = '';

    this.userData = null;

    this.selectedTab = 'general';

    this.password = '';
    this.passwordVerify = '';

    // this.bankAccountOwnerAddress = {
    //   city: '',
    //   country: '',
    //   line1: '',
    //   line2: '',
    //   postalCode: '',
    //   region: '',
    // };

    this.cards = ['1234 5678 1234 5678', '1111 2222 3333 4444'];

    this.modalToShow = '';

    this.kycDocuments = null;

    this.kycNumberOfInputs = 1;

    // this.uboDeclarations = [];
    this.uboDeclarations = null;

    this.selectedDeclaration = null;

    // this.selectedUbo = null;

    this.showUboForm = false;

    this.uboToAdd = this.initUboToAdd();
  }

  mounted(): void {
    this.loadUserData();
    this.loadKycDocuments();
    this.loadUboDeclarations();
  }

  /*
    LOADING - INITIALIZATION
  */

  loadUserData(): void {
    this.isUserDataLoaded = false;

    this.profileApi.getProfile().then((response: ServerResponse<Account>) => {
      this.userData = response.result;
      this.isUserDraft = !!this.userData.profile.provider.draft;

      // NEXT BLOCK ( OVERWRITE ) TO BE DELETED - DEVELOPMENT PURPOSE ONLY
      // if (this.userData.profile.provider.draft) {
      //   this.userData.profile.provider.draft.status = EnumCustomerRegistrationStatus.DRAFT;
      // }

      if (this.isUserDraft && this.userData.profile.provider.draft?.status) {
        this.draftStatus = this.userData.profile.provider.draft?.status;
      }

      this.isUserDataLoaded = true;
    });
  }

  loadKycDocuments(): void {
    this.isKycDocumentsLoaded = false;

    this.kycDocumentApi.findAll(EnumCustomerType.PROVIDER).then((documentsResponse) => {
      this.kycDocuments = documentsResponse.result.items;
      this.isKycDocumentsLoaded = true;
    });
  }

  loadUboDeclarations(): void {
    this.isUboDeclarationsLoaded = false;

    this.uboDeclarationApi.findAll().then((delcarationResponse) => {
      this.uboDeclarations = delcarationResponse.result.items;
      this.isUboDeclarationsLoaded = true;
    });
  }

  isLoading(): boolean {
    if (!this.isUserDataLoaded || !this.isKycDocumentsLoaded || !this.isUboDeclarationsLoaded) {
      return true;
    }
    return false;
  }

  /*
    MISC METHODS
  */

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  /*
    MODAL SUBMISSION & CHANGING FIELDS
  */

  canEditMangoPayRelatedField(): boolean {
    if (!this.isUserDraft || (this.isUserDraft && this.draftStatus === 'DRAFT')) {
      return true;
    }
    return false;
  }

  // eslint-disable-next-line
  onSubmitTopioAccountField(modalData: any): void {
    const data = {
      firstName: this.userData!.profile.firstName,
      image: this.userData!.profile.image,
      imageMimeType: this.userData!.profile.imageMimeType,
      lastName: this.userData!.profile.lastName,
      locale: this.userData!.profile.locale,
      mobile: this.userData!.profile.mobile,
      phone: this.userData!.profile.phone,
    };

    switch (modalData.modalId) {
      case 'image': {
        console.log(modalData.inputValues[0]);
        const imgString = modalData.inputValues[0].value.split(',')[1];
        const imgType = modalData.inputValues[0].value.split(';')[0].split('data:')[1];
        data.image = imgString;
        data.imageMimeType = imgType;
        break;
      }
      case 'fullName':
      case 'mobile': {
        // create the data object for POST request
        // by iterating through modal's inputs IDs & values
        modalData.inputValues.forEach((input) => {
          data[input.id] = input.value;
        });
        break;
      }
      case 'password': {
        // eslint-disable-next-line
        console.log(this.password);
        break;
      }
      default:
    }

    console.log('data', data);
    this.isUserDataLoaded = false;
    this.profileApi.updateProfile(data as any).then((resp) => {
      console.log(resp);
      if (resp.success) {
        this.loadUserData();
      }
    }).catch((err) => {
      console.log(err);
    });

    this.modalToShow = '';
  }

  onSubmitMangoPayField(modalData): void {
    let draft;
    if (this.isUserDraft) { // if draft exists, update existing draft
      draft = this.userData!.profile.provider.draft;

      // rename 'representative' from CURRENT PROVIDER to 'legalRepresentative'. should be fixed in API. then, remove this line and change propertiesToKeep array accordingy
      // eslint-disable-next-line
      delete Object.assign(draft, {['legalRepresentative']: draft['representative'] })['representative'];

    } else { // if draft is null, copy current profile as draft
      draft = {};
      const propertiesToKeep = ['additionalInfo', 'bankAccount', 'companyNumber', 'companyType', 'email', 'headquartersAddress', 'legalPersonType', 'representative', 'logoImage', 'logoImageMimeType', 'name', 'phone', 'siteUrl', 'type'];
      Object.keys(this.userData!.profile.provider.current!).forEach((x) => {
        if (propertiesToKeep.includes(x)) {
          // eslint-disable-next-line
          draft[x] = this.userData!.profile.provider.current![x];
        }
      });
      // rename 'representative' from CURRENT PROVIDER to 'legalRepresentative'. should be fixed in API. then, remove this line and change propertiesToKeep array accordingy
      // eslint-disable-next-line
      delete Object.assign(draft, {['legalRepresentative']: draft['representative'] })['representative'];
    }

    switch (modalData.modalId) {
      case 'companyName': {
        draft!.name = modalData.inputValues[0].value;
        break;
      }
      case 'vatNumber': {
        draft!.companyNumber = modalData.inputValues[0].value;
        break;
      }
      case 'companyType': {
        draft!.companyType = modalData.inputValues[0].value;
        break;
      }
      case 'companyEmail': {
        draft!.email = modalData.inputValues[0].value;
        break;
      }
      case 'siteUrl': {
        draft!.siteUrl = modalData.inputValues[0].value;
        break;
      }
      case 'bankAccountOwnerName': {
        draft!.bankAccount.ownerName = modalData.inputValues[0].value;
        break;
      }
      case 'bankAccountIban': {
        draft!.bankAccount.iban = modalData.inputValues[0].value;
        break;
      }
      case 'bankAccountBic': {
        draft!.bankAccount.bic = modalData.inputValues[0].value;
        break;
      }
      case 'bankAccountOwnerAddress': {
        // eslint-disable-next-line
        draft!.bankAccount.ownerAddress.line1 = (this.$refs['bankAccountOwnerAddressLine1'] as HTMLInputElement).value;
        // eslint-disable-next-line
        draft!.bankAccount.ownerAddress.line2 = (this.$refs['bankAccountOwnerAddressLine2'] as HTMLInputElement).value;
        // eslint-disable-next-line
        draft!.bankAccount.ownerAddress.city = (this.$refs['bankAccountOwnerAddressCity'] as HTMLInputElement).value;
        // eslint-disable-next-line
        draft!.bankAccount.ownerAddress.region = (this.$refs['bankAccountOwnerAddressRegion'] as HTMLInputElement).value;
        // eslint-disable-next-line
        draft!.bankAccount.ownerAddress.postalCode = (this.$refs['bankAccountOwnerAddressPostalCode'] as HTMLInputElement).value;
        // eslint-disable-next-line
        draft!.bankAccount.ownerAddress.country = (this.$refs['bankAccountOwnerAddressCountry'] as HTMLInputElement).value;
        break;
      }
      case 'headquartersAddress': {
        // eslint-disable-next-line
        draft!.headquartersAddress.line1 = (this.$refs['headquartersAddressLine1'] as HTMLInputElement).value;
        // eslint-disable-next-line
        draft!.headquartersAddress.line2 = (this.$refs['headquartersAddressLine2'] as HTMLInputElement).value;
        // eslint-disable-next-line
        draft!.headquartersAddress.city = (this.$refs['headquartersAddressCity'] as HTMLInputElement).value;
        // eslint-disable-next-line
        draft!.headquartersAddress.region = (this.$refs['headquartersAddressRegion'] as HTMLInputElement).value;
        // eslint-disable-next-line
        draft!.headquartersAddress.postalCode = (this.$refs['headquartersAddressPostalCode'] as HTMLInputElement).value;
        // eslint-disable-next-line
        draft!.headquartersAddress.country = (this.$refs['headquartersAddressCountry'] as HTMLInputElement).value;
        break;
      }
      case 'representativeAddress': {
        // eslint-disable-next-line
        draft!.legalRepresentative.address.line1 = (this.$refs['representativeAddressLine1'] as HTMLInputElement).value;
        // eslint-disable-next-line
        draft!.legalRepresentative.address.line2 = (this.$refs['representativeAddressLine2'] as HTMLInputElement).value;
        // eslint-disable-next-line
        draft!.legalRepresentative.address.city = (this.$refs['representativeAddressCity'] as HTMLInputElement).value;
        // eslint-disable-next-line
        draft!.legalRepresentative.address.region = (this.$refs['representativeAddressRegion'] as HTMLInputElement).value;
        // eslint-disable-next-line
        draft!.legalRepresentative.address.postalCode = (this.$refs['representativeAddressPostalCode'] as HTMLInputElement).value;
        // eslint-disable-next-line
        draft!.legalRepresentative.address.country = (this.$refs['representativeAddressCountry'] as HTMLInputElement).value;
        break;
      }
      case 'iban': {
        draft!.bankAccount.iban = modalData.inputValues[0].value;
        break;
      }
      default:
    }

    console.log(draft);

    this.isUserDataLoaded = false;
    this.providerApi.updateRegistration(draft).then((resp) => {
      console.log(resp);
      this.loadUserData();
    });

    this.modalToShow = '';
  }

  submitRegistrationFromDraft(): void {
    const draft = this.userData?.profile.provider.draft;

    // rename 'representative' from CURRENT PROVIDER to 'legalRepresentative'. should be fixed in API.
    // eslint-disable-next-line
    delete Object.assign((draft as any), {['legalRepresentative']: (draft as any)['representative'] })['representative'];

    console.log(draft);
    // AS ANY - TO BE CORRECTED
    this.isUserDataLoaded = false;
    this.providerApi.submitRegistration(draft as any).then((submitRegistrationResponse) => {
      if (submitRegistrationResponse.success) {
        this.loadUserData();
      } else {
        console.log('error submitting registration', submitRegistrationResponse);
      }
    });
  }

  /*
    KYC
  */

  isVendorKycValidated():boolean {
    // eslint-disable-next-line
    if (!this.kycDocuments!.filter((x) => x.type === 'IDENTITY_PROOF').some((x) => x.status === 'VALIDATED') || !this.kycDocuments!.filter((x) => x.type === 'ARTICLES_OF_ASSOCIATION').some((x) => x.status === 'VALIDATED') || !this.kycDocuments!.filter((x) => x.type === 'REGISTRATION_PROOF').some((x) => x.status === 'VALIDATED')) {
      return false;
    }
    return true;
  }

  addKycInput(): void {
    this.kycNumberOfInputs += 1;
  }

  onSubmitKycPages(documentTypeString: string): void {
    const files = [...this.$el.querySelectorAll('.input-kyc-file')].map((x) => (x as any).files[0]);
    const comments = [...this.$el.querySelectorAll('.input-kyc-comments')].map((x) => (x as any).value);

    const data: {file: File, comments: string}[] = [];
    files.forEach((x, i) => {
      data.push({ file: x, comments: comments[i] });
    });
    console.log(data);

    let documentType;
    switch (documentTypeString) {
      case 'identityProof': {
        documentType = EnumKycDocumentType.IDENTITY_PROOF;
        break;
      }
      case 'articlesOfAssociation': {
        documentType = EnumKycDocumentType.ARTICLES_OF_ASSOCIATION;
        break;
      }
      case 'registrationProof': {
        documentType = EnumKycDocumentType.REGISTRATION_PROOF;
        break;
      }
      default:
    }

    // ATTENTION: it currently creates only PROVIDER document
    const document: KycDocumentCommand = {
      customerType: EnumCustomerType.PROVIDER,
      type: documentType,
    };

    // FIRSTLY, CHECK IF DOCUMENT OF THIS TYPE IS CREATED
    this.kycDocumentApi.findAll(EnumCustomerType.PROVIDER).then((getDocumentsResponse) => {
      if (getDocumentsResponse.success) {
        console.log('count: ', getDocumentsResponse.result.count, 'documentType: ', documentType, getDocumentsResponse);
        if (getDocumentsResponse.result.count && getDocumentsResponse.result.items.some((x) => x.type === documentType && x.status === 'CREATED')) {
          // eslint-disable-next-line
          const documentId = getDocumentsResponse.result.items.find((x) => x.type === documentType && x.status === 'CREATED')!.id;
          console.log(`document has been created before! will add pages to: ${documentId}`);
          this.addPagesInKycDocument(data, document, documentId);
        } else {
          console.log('document is not created, will be created now!');
          this.kycDocumentApi.createDocument(document).then((createDocumentResponse) => {
            if (createDocumentResponse.success) { // document created successfully
              console.log('document created successfully!');
              const documentId = createDocumentResponse.result.id;
              this.addPagesInKycDocument(data, document, documentId);
            } else { // error creating document
              console.log('error creating document', createDocumentResponse);
            }
          });
        }
      } else {
        console.log('error searching documents');
      }
    });
  }

  addPagesInKycDocument(data: {file: File, comments: string}[], document: KycDocumentCommand, documentId: string): void {
    const addPagePromises: any = [];
    data.forEach((x) => {
      const documentPage: KycDocumentPageCommand = {
        customerType: EnumCustomerType.PROVIDER,
        comment: x.comments,
      };
      addPagePromises.push(this.kycDocumentApi.addPage(documentId, documentPage, x.file));
    });

    // ADD PAGES IN DOCUMENT
    Promise.all(addPagePromises).then((addPagesResponse) => {
      console.log(addPagesResponse);
      if (addPagesResponse.some((x) => (x as any).success !== true)) {
        console.log('at least one page was not uploaded in document', addPagesResponse);
      } else {
        console.log('pages added successfully');

        // SUBMIT DOCUMENT FOR VALIDATION
        this.kycDocumentApi.submitDocument(documentId, document).then((submitDocumentResponse) => {
          if (submitDocumentResponse.success) {
            console.log('document submitted successfully!');
            // IF DOCUMENT ALREADY EXISTED, REPLACE IT WITH THE NEW FROM RESPONSE
            // eslint-disable-next-line
            if (this.kycDocuments?.some((x) => x.id === submitDocumentResponse.result.id)) {
              const i = this.kycDocuments?.findIndex((x) => x.id === submitDocumentResponse.result.id);
              this.kycDocuments[i] = submitDocumentResponse.result;
            // IF NOT, PUSH IT ON THE LIST
            } else {
            // eslint-disable-next-line
              this.kycDocuments!.push(submitDocumentResponse.result);
            }
          } else {
            console.log('error submitting document', submitDocumentResponse);
          }
        });
      }
    });
  }

  /*
    UBO
  */

  canAddDeclaration(): boolean {
    // if already exists declaration with the following status, return FALSE else TRUE
    const distinctOnlyStatuses = ['CREATED', 'INCOMPLETE', 'VALIDATION_ASKED'];
    if (!this.uboDeclarations || this.uboDeclarations?.some((x) => distinctOnlyStatuses.includes(x.status))) {
      return false;
    }
    return true;
  }

  canAddUbo(): boolean {
    const permittedStatuses = ['CREATED', 'INCOMPLETE'];
    if (!this.uboDeclarations || this.selectedDeclaration === null || !permittedStatuses.includes(this.uboDeclarations[this.selectedDeclaration].status)) {
      return false;
    }
    return true;
  }

  canSubmitDeclaration(): boolean {
    const permittedStatuses = ['CREATED', 'INCOMPLETE'];
    // !showUboForm && isUbosOfUboDeclarationLoaded && uboDeclarations[selectedDeclaration].ubos.length && (uboDeclarations[selectedDeclaration].status == 'CREATED' || uboDeclarations[selectedDeclaration].status == 'INCOMPLETE')
    if (this.showUboForm || !this.isUbosOfUboDeclarationLoaded || !this.uboDeclarations![this.selectedDeclaration!].ubos?.length || !permittedStatuses.includes(this.uboDeclarations![this.selectedDeclaration!].status)) {
      return false;
    }
    return true;
  }

  canRemoveUboFromDeclaration(): boolean {
    const permittedStatuses = ['CREATED', 'INCOMPLETE'];
    if (!this.uboDeclarations || this.selectedDeclaration === null || !permittedStatuses.includes(this.uboDeclarations[this.selectedDeclaration].status)) {
      return false;
    }
    return true;
  }

  addDeclaration(): void {
    this.uboDeclarationApi.createDeclaration().then((declarationResponse) => {
      const declaration = declarationResponse.result;
      // eslint-disable-next-line
      this.uboDeclarations!.push(declaration);
    });
  }

  selectDeclaration(i: number): void {
    this.isUbosOfUboDeclarationLoaded = false;
    this.showUboForm = false;
    this.selectedDeclaration = i;
    // eslint-disable-next-line
    const declarationId = this.uboDeclarations![i].id;

    this.uboDeclarationApi.findOne(declarationId).then((declarationResponse) => {
      if (declarationResponse.success) {
        if (declarationResponse.result.ubos) {
          // eslint-disable-next-line
          Vue.set(this.uboDeclarations![i], 'ubos', declarationResponse.result.ubos);
        }
        this.isUbosOfUboDeclarationLoaded = true;
      }
    });
  }

  initUboToAdd(): UboCommand {
    return {
      firstName: '',
      lastName: '',
      address: {
        city: '',
        country: '',
        line1: '',
        line2: '',
        postalCode: '',
        region: '',
      },
      nationality: '',
      birthdate: '',
      birthplace: {
        city: '',
        country: '',
      },
    };
  }

  addUboToDeclaration(): void {
    this.showUboForm = true;
  }

  submitUbo(): void {
    // OVERWRITE FOR DEVELOPMENT PURPOSE
    this.uboToAdd.birthdate = '1980-01-01T00:00:00.000Z';

    // eslint-disable-next-line
    const declarationId = this.uboDeclarations![this.selectedDeclaration!].id;
    console.log(declarationId);
    console.log('ubo to add: ', this.uboToAdd);
    this.uboDeclarationApi.addUbo(declarationId, this.uboToAdd).then((uboResponse) => {
      console.log(uboResponse);
      if (uboResponse.success) {
        // eslint-disable-next-line
        if (this.uboDeclarations![this.selectedDeclaration!].ubos) {
          // eslint-disable-next-line
          this.uboDeclarations![this.selectedDeclaration!].ubos.push(uboResponse.result);
        } else {
          // eslint-disable-next-line
          this.uboDeclarations![this.selectedDeclaration!].ubos = [uboResponse.result];
        }
        this.showUboForm = false;
      }
    });
  }

  removeUboFromDeclaration(declarationId: string, uboId: string): void {
    this.uboDeclarationApi.removeUbo(declarationId, uboId).then((removeUboResponse) => {
      if (removeUboResponse.success) {
        const index = this.uboDeclarations![this.selectedDeclaration!].ubos.findIndex((x) => x.id === uboId);
        this.uboDeclarations![this.selectedDeclaration!].ubos.splice(index, 1);
      }
    });
  }

  submitDeclaration(): void {
    const declarationId = this.uboDeclarations![this.selectedDeclaration!].id;
    this.uboDeclarationApi.submitDeclaration(declarationId).then((submitDeclarationResponse) => {
      if (submitDeclarationResponse.success) {
        const index = this.uboDeclarations?.findIndex((x) => x.id === submitDeclarationResponse.result.id);
        // this.uboDeclarations![index!] = submitDeclarationResponse.result;
        // eslint-disable-next-line
        Vue.set(this.uboDeclarations!, index!, submitDeclarationResponse.result);
      } else {
        console.log('error in submitting declaration');
      }
    });
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
