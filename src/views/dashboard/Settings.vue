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

      <!-- <modal :show="modalToShow == 'companyName'" @dismiss="modalToShow = ''" @submit="onSubmitMangoPayField" :title="'Change your company name'" :modalId="'companyName'" :inputs="[{id: 'companyName', name: 'Company Name', value: userData.profile.provider.draft? userData.profile.provider.draft.name : userData.profile.provider.current.name, type: 'text'}]"></modal> -->
      <modal :show="modalToShow == 'companyName'" @dismiss="modalToShow = ''" @submit="onSubmitMangoPayField" :title="'Change your company name'" :modalId="'companyName'" :inputs="[{id: 'companyName', name: 'Company Name', value: getCurrentOrDraftValue('name'), type: 'text'}]"></modal>
      <modal :show="modalToShow == 'vatNumber'" @dismiss="modalToShow = ''" @submit="onSubmitMangoPayField" :title="'Change vendor VAT number'" :modalId="'vatNumber'" :inputs="[{id: 'vatNumber', name: 'VAT Number', value: getCurrentOrDraftValue('companyNumber'), type: 'text'}]"></modal>
      <modal :show="modalToShow == 'domain'" @dismiss="modalToShow = ''" @submit="onSubmitMangoPayField" :title="'Change your company type'" :modalId="'companyType'" :inputs="[{id: 'companyType', name: 'Company Type', value: getCurrentOrDraftValue('companyType'), type: 'text'}]"></modal>
      <modal :show="modalToShow == 'companyEmail'" @dismiss="modalToShow = ''" @submit="onSubmitMangoPayField" :title="'Change your company email'" :modalId="'companyEmail'" :inputs="[{id: 'companyEmail', name: 'Company Email', value: getCurrentOrDraftValue('email'), type: 'text'}]"></modal>
      <modal :show="modalToShow == 'website'" @dismiss="modalToShow = ''" @submit="onSubmitMangoPayField" :title="'Change your website'" :modalId="'siteUrl'" :inputs="[{id: 'siteUrl', name: 'Site URL', value: getCurrentOrDraftValue('siteUrl'), type: 'text'}]"></modal>

      <modal v-if="getCurrentOrDraftValue('type') === 'PROFESSIONAL'" :show="modalToShow == 'bankAccountOwnerName'" @dismiss="modalToShow = ''" @submit="onSubmitMangoPayField" :title="'Change account owner\'s name'" :modalId="'bankAccountOwnerName'" :inputs="[{id: 'bankAccountOwnerName', name: 'Full Name', value: getCurrentOrDraftValue('bankAccount.ownerName'), type: 'text'}]"></modal>
      <modal v-if="getCurrentOrDraftValue('type') === 'PROFESSIONAL'" :show="modalToShow == 'bankAccountIban'" @dismiss="modalToShow = ''" @submit="onSubmitMangoPayField" :title="'Change IBAN'" :modalId="'bankAccountIban'" :inputs="[{id: 'bankAccountIban', name: 'IBAN', value: getCurrentOrDraftValue('bankAccount.iban'), type: 'text'}]"></modal>
      <modal v-if="getCurrentOrDraftValue('type') === 'PROFESSIONAL'" :show="modalToShow == 'bankAccountBic'" @dismiss="modalToShow = ''" @submit="onSubmitMangoPayField" :title="'Change BIC'" :modalId="'bankAccountBic'" :inputs="[{id: 'bankAccountBic', name: 'BIC', value: getCurrentOrDraftValue('bankAccount.bic'), type: 'text'}]"></modal>

      <modal :show="modalToShow == 'newCard'" @dismiss="modalToShow = ''" @submit="onSubmitNewCard" :title="'Add new card'" :modalId="'newCard'" :inputs="[{id: 'cardNumber', name: 'Card Number', type: 'text'}, {id: 'cardExpirationDate', name: 'Expiration Date', type: 'text'}, {id: 'cardCvx', name: 'CVX (3-digit number)', type: 'text'}]"></modal>

      <modal :withSlots="true" :show="modalToShow == 'password'" @dismiss="onPasswordModalDismiss" :modalId="'password'" :showCancelButton="false">
        <template v-slot:body>
          <div v-if="!passwordChanged">
            <h1>Change password</h1>

            <div class="form-group">
              <label for="modal_input_passwordCurrent" class="mt-xs-20"> Current password </label>
              <input v-model="passwordCurrent" class="form-group__text" type="password" id="modal_input_passwordCurrent">
              <transition name="fade" mode="out-in"><div class="modal__errors" v-if="passwordCurrentError">Incorrect password.</div></transition>

              <label for="modal_input_passwordNew" class="mt-xs-20"> New password </label>
              <input v-model="passwordNew" class="form-group__text" type="password" id="modal_input_passwordNew">

              <label for="modal_input_passwordNewVerify" class="mt-xs-20"> Verify new password </label>
              <input v-model="passwordNewVerify" class="form-group__text" type="password" id="modal_input_passwordNewVerify">
            </div>
          </div>
          <div v-else>
            <h1>Password is changed successfully!</h1>
          </div>
        </template>

        <template v-slot:footer>
          <button v-if="!passwordChanged" @click="onPasswordModalDismiss" class="btn btn--std btn--blue">CANCEL</button>
          <button v-if="!passwordChanged" class="btn btn--std btn--blue ml-xs-20" @click="onChangePassword" :disabled="passwordNew !== passwordNewVerify || passwordNew === '' || passwordCurrent === ''">CONFIRM</button>

          <button v-if="passwordChanged" @click="onPasswordModalDismiss" class="btn btn--std btn--blue">ΟΚ</button>
        </template>
      </modal>

      <modal v-if="getCurrentOrDraftValue('type') === 'PROFESSIONAL'" :withSlots="true" :show="modalToShow == 'bankAccountOwnerAddress'" @dismiss="modalToShow = ''" :modalId="'bankAccountOwnerAddress'">
        <template v-slot:body>
          <h1 class="mb-xs-20">Change Owner Address</h1>

          <div class="form-group">
            <label for="bankAccountOwnerAddressLine1">Line 1</label>
            <input ref="bankAccountOwnerAddressLine1" :value="getCurrentOrDraftValue('bankAccount.ownerAddress.line1')" class="form-group__text" type="text" id="bankAccountOwnerAddressLine1">
          </div>
          <div class="form-group">
            <label for="bankAccountOwnerAddressLine2">Line 2</label>
            <input ref="bankAccountOwnerAddressLine2" :value="getCurrentOrDraftValue('bankAccount.ownerAddress.line2')" class="form-group__text" type="text" id="bankAccountOwnerAddressLine2">
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="bankAccountOwnerAddressCity">City</label>
                <input ref="bankAccountOwnerAddressCity" :value="getCurrentOrDraftValue('bankAccount.ownerAddress.city')" class="form-group__text" type="text" id="bankAccountOwnerAddressCity">
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="bankAccountOwnerAddressRegion">Region</label>
                <input ref="bankAccountOwnerAddressRegion" :value="getCurrentOrDraftValue('bankAccount.ownerAddress.region')" class="form-group__text" type="text" id="bankAccountOwnerAddressRegion">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="bankAccountOwnerAddressPostalCode">Postal Code</label>
                <input ref="bankAccountOwnerAddressPostalCode" :value="getCurrentOrDraftValue('bankAccount.ownerAddress.postalCode')" class="form-group__text" type="text" id="bankAccountOwnerAddressPostalCode">
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="bankAccountOwnerAddressCountry">Country</label>
                <input ref="bankAccountOwnerAddressCountry" :value="getCurrentOrDraftValue('bankAccount.ownerAddress.country')" class="form-group__text" type="text" id="bankAccountOwnerAddressCountry">
              </div>
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <button class="btn--std btn--blue ml-xs-20" @click="onSubmitMangoPayField({modalId: 'bankAccountOwnerAddress'})">CONFIRM</button>
        </template>
      </modal>

      <modal v-if="getCurrentOrDraftValue('type') === 'PROFESSIONAL'" :withSlots="true" :show="modalToShow == 'headquartersAddress'" @dismiss="modalToShow = ''" :modalId="'headquartersAddress'">
        <template v-slot:body>
          <h1 class="mb-xs-20">Change Headquarters Address</h1>

          <div class="form-group">
            <label for="headquartersAddressLine1">Line 1</label>
            <input ref="headquartersAddressLine1" :value="getCurrentOrDraftValue('headquartersAddress.line1')" class="form-group__text" type="text" id="headquartersAddressLine1">
          </div>
          <div class="form-group">
            <label for="headquartersAddressLine2">Line 2</label>
            <input ref="headquartersAddressLine2" :value="getCurrentOrDraftValue('headquartersAddress.line2')" class="form-group__text" type="text" id="headquartersAddressLine2">
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="headquartersAddressCity">City</label>
                <input ref="headquartersAddressCity" :value="getCurrentOrDraftValue('headquartersAddress.city')" class="form-group__text" type="text" id="headquartersAddressCity">
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="headquartersAddressRegion">Region</label>
                <input ref="headquartersAddressRegion" :value="getCurrentOrDraftValue('headquartersAddress.region')" class="form-group__text" type="text" id="headquartersAddressRegion">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="headquartersAddressPostalCode">Postal Code</label>
                <input ref="headquartersAddressPostalCode" :value="getCurrentOrDraftValue('headquartersAddress.postalCode')" class="form-group__text" type="text" id="headquartersAddressPostalCode">
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="headquartersAddressCountry">Country</label>
                <input ref="headquartersAddressCountry" :value="getCurrentOrDraftValue('headquartersAddress.country')" class="form-group__text" type="text" id="headquartersAddressCountry">
              </div>
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <button class="btn--std btn--blue ml-xs-20" @click="onSubmitMangoPayField({modalId: 'headquartersAddress'})">CONFIRM</button>
        </template>
      </modal>

      <modal v-if="getCurrentOrDraftValue('type') === 'PROFESSIONAL'" :withSlots="true" :show="modalToShow == 'representativeAddress'" @dismiss="modalToShow = ''" :modalId="'representativeAddress'">
        <template v-slot:body>
          <h1 class="mb-xs-20">Change Legal Representative's Address</h1>

          <div class="form-group">
            <label for="representativeAddressLine1">Line 1</label>
            <input ref="representativeAddressLine1" :value="getCurrentOrDraftValue('representative.address.line1')" class="form-group__text" type="text" id="representativeAddressLine1">
          </div>
          <div class="form-group">
            <label for="representativeAddressLine2">Line 2</label>
            <input ref="representativeAddressLine2" :value="getCurrentOrDraftValue('representative.address.line2')" class="form-group__text" type="text" id="representativeAddressLine2">
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="representativeAddressCity">City</label>
                <input ref="representativeAddressCity" :value="getCurrentOrDraftValue('representative.address.city')" class="form-group__text" type="text" id="representativeAddressCity">
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="representativeAddressRegion">Region</label>
                <input ref="representativeAddressRegion" :value="getCurrentOrDraftValue('representative.address.region')" class="form-group__text" type="text" id="representativeAddressRegion">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="representativeAddressPostalCode">Postal Code</label>
                <input ref="representativeAddressPostalCode" :value="getCurrentOrDraftValue('representative.address.postalCode')" class="form-group__text" type="text" id="representativeAddressPostalCode">
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="representativeAddressCountry">Country</label>
                <input ref="representativeAddressCountry" :value="getCurrentOrDraftValue('representative.address.country')" class="form-group__text" type="text" id="representativeAddressCountry">
              </div>
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <button class="btn--std btn--blue ml-xs-20" @click="onSubmitMangoPayField({modalId: 'representativeAddress'})">CONFIRM</button>
        </template>
      </modal>

      <modal v-if="getCurrentOrDraftValue('type') === 'INDIVIDUAL'" :withSlots="true" :show="modalToShow == 'individualAddress'" @dismiss="modalToShow = ''" :modalId="'individualAddress'">
        <template v-slot:body>
          <h1 class="mb-xs-20">Change Address</h1>

          <div class="form-group">
            <label for="individualAddressLine1">Line 1</label>
            <input ref="individualAddressLine1" :value="getCurrentOrDraftValue('address.line1')" class="form-group__text" type="text" id="individualAddressLine1">
          </div>
          <div class="form-group">
            <label for="individualAddressLine2">Line 2</label>
            <input ref="individualAddressLine2" :value="getCurrentOrDraftValue('address.line2')" class="form-group__text" type="text" id="individualAddressLine2">
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="individualAddressCity">City</label>
                <input ref="individualAddressCity" :value="getCurrentOrDraftValue('address.city')" class="form-group__text" type="text" id="individualAddressCity">
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="individualAddressRegion">Region</label>
                <input ref="individualAddressRegion" :value="getCurrentOrDraftValue('address.region')" class="form-group__text" type="text" id="individualAddressRegion">
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label for="individualAddressPostalCode">Postal Code</label>
                <input ref="individualAddressPostalCode" :value="getCurrentOrDraftValue('address.postalCode')" class="form-group__text" type="text" id="individualAddressPostalCode">
              </div>
            </div>
            <div class="col-md-6">
              <div class="form-group">
                <label for="individualAddressCountry">Country</label>
                <input ref="individualAddressCountry" :value="getCurrentOrDraftValue('address.country')" class="form-group__text" type="text" id="individualAddressCountry">
              </div>
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <button class="btn--std btn--blue ml-xs-20" @click="onSubmitMangoPayField({modalId: 'individualAddress'})">CONFIRM</button>
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

        <template v-slot:footer>
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
          <li v-if="!isLoading() && getCurrentOrDraftValue('type') === 'PROFESSIONAL'" @click="selectTab('companyInformation')" :class="{ 'active': selectedTab=='companyInformation' }"><a href="#" @click.prevent="">Company Information</a></li>
          <li v-if="!isLoading() && getCurrentOrDraftValue('type') === 'PROFESSIONAL'" @click="selectTab('payoutOptions')" :class="{ 'active': selectedTab=='payoutOptions' }"><a href="#" @click.prevent="">Payout Options</a></li>
          <li @click="selectTab('addresses')" :class="{ 'active': selectedTab=='addresses' }"><a href="#" @click.prevent="">Addresses</a></li>
          <li v-if="includeTabDueToRole('ROLE_CONSUMER')" @click="selectTab('paymentMethods')" :class="{ 'active': selectedTab=='paymentMethods' }"><a href="#" @click.prevent="">Payment Methods</a></li>
          <li @click="selectTab('kyc')" :class="{ 'active': selectedTab=='kyc' }"><a href="#" @click.prevent="">KYC</a></li>
          <li v-if="includeTabDueToRole('ROLE_PROVIDER')" @click="selectTab('ubo')" :class="{ 'active': selectedTab=='ubo' }"><a href="#" @click.prevent="">UBO</a></li>
        </ul>
      </div>

      <div v-if="!isLoading()" class="tabs__outter-wrapper">
        <!-- GENERAL -->
        <transition name="fade" mode="out-in">
          <div class="tabs__single-tab-wrapper" v-if="selectedTab == 'general'">
            <div class="tabs__tab tabs__tab__tab-general">
              <div class="tabs__tab__list">
                <div class="tabs__tab__list__item"><strong>Image</strong></div>
                <div class="tabs__tab__list__item right avatar"><img :src="'data:' + userData.profile.imageMimeType + ';base64, ' + userData.profile.image" :height="80" :width="80" alt="user image"></div>
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
                <div class="tabs__tab__list__item right">{{ getCurrentOrDraftValue('name') }}</div>
                <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" @click="modalToShow = 'companyName'" class="btn btn--std btn--outlinedark">EDIT</button></div>
                <div class="tabs__tab__list__line"></div>

                <div class="tabs__tab__list__item"><strong>VAT number</strong></div>
                <div class="tabs__tab__list__item right"> {{ getCurrentOrDraftValue('companyNumber') }} </div>
                <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" @click="modalToShow = 'vatNumber'" class="btn btn--std btn--outlinedark">EDIT</button></div>
                <div class="tabs__tab__list__line"></div>

                <div class="tabs__tab__list__item"><strong>Domain</strong></div>
                <div class="tabs__tab__list__item right">{{ getCurrentOrDraftValue('companyType') }}</div>
                <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" @click="modalToShow = 'domain'" class="btn btn--std btn--outlinedark">EDIT</button></div>
                <div class="tabs__tab__list__line"></div>

                <div class="tabs__tab__list__item"><strong>Company email</strong></div>
                <div class="tabs__tab__list__item right">{{ getCurrentOrDraftValue('email') }}</div>
                <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" @click="modalToShow = 'companyEmail'" class="btn btn--std btn--outlinedark">EDIT</button></div>
                <div class="tabs__tab__list__line"></div>

                <div class="tabs__tab__list__item"><strong>Website</strong></div>
                <div class="tabs__tab__list__item right">{{ getCurrentOrDraftValue('siteUrl') }}</div>
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
                <div class="tabs__tab__list__item right">{{ getCurrentOrDraftValue('bankAccount.ownerName') }}</div>
                <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" @click="modalToShow = 'bankAccountOwnerName'" class="btn btn--std btn--outlinedark">CHANGE</button></div>
                <div class="tabs__tab__list__line"></div>
              </div>

              <div class="tabs__tab__list">
                <div class="tabs__tab__list__item"><strong>IBAN</strong></div>
                <div class="tabs__tab__list__item right">{{ getCurrentOrDraftValue('bankAccount.iban') }}</div>
                <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" @click="modalToShow = 'bankAccountIban'" class="btn btn--std btn--outlinedark">CHANGE</button></div>
                <div class="tabs__tab__list__line"></div>
              </div>

              <div class="tabs__tab__list">
                <div class="tabs__tab__list__item"><strong>BIC</strong></div>
                <div class="tabs__tab__list__item right">{{ getCurrentOrDraftValue('bankAccount.bic') }}</div>
                <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" @click="modalToShow = 'bankAccountBic'" class="btn btn--std btn--outlinedark">CHANGE</button></div>
                <div class="tabs__tab__list__line"></div>
              </div>

              <div class="tabs__tab__list">
                <div class="tabs__tab__list__item"><strong>Address</strong></div>
                <div class="tabs__tab__list__item right">{{ getCurrentOrDraftValue('bankAccount.ownerAddress.line1') }}, {{ getCurrentOrDraftValue('bankAccount.ownerAddress.line2') ? getCurrentOrDraftValue('bankAccount.ownerAddress.line2') + ', ': '' }} {{ getCurrentOrDraftValue('bankAccount.ownerAddress.postalCode') }}, {{ getCurrentOrDraftValue('bankAccount.ownerAddress.city') }}, {{ getCurrentOrDraftValue('bankAccount.ownerAddress.region') }}, {{ getCurrentOrDraftValue('bankAccount.ownerAddress.country') }}</div>
                <!-- <div v-if="userData.profile.provider.draft" class="tabs__tab__list__item right">{{ userData.profile.provider.draft.bankAccount.ownerAddress.line1 }}, {{ userData.profile.provider.draft.bankAccount.ownerAddress.line2? userData.profile.provider.draft.bankAccount.ownerAddress.line2 + ', ': '' }} {{ userData.profile.provider.draft.bankAccount.ownerAddress.postalCode }}, {{ userData.profile.provider.draft.bankAccount.ownerAddress.city }}, {{ userData.profile.provider.draft.bankAccount.ownerAddress.region }}, {{ userData.profile.provider.draft.bankAccount.ownerAddress.country }}</div> -->
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
              <div class="tabs__tab__list" v-if="getCurrentOrDraftValue('type') === 'PROFESSIONAL'">
                <div class="tabs__tab__list__item"><strong>Headquarters address</strong></div>
                <div class="tabs__tab__list__item right">{{ getCurrentOrDraftValue('headquartersAddress.line1') }}, {{ getCurrentOrDraftValue('headquartersAddress.line2') ? getCurrentOrDraftValue('headquartersAddress.line2') + ', ': '' }} {{ getCurrentOrDraftValue('headquartersAddress.postalCode') }}, {{ getCurrentOrDraftValue('headquartersAddress.city') }}, {{ getCurrentOrDraftValue('headquartersAddress.region') }}, {{ getCurrentOrDraftValue('headquartersAddress.country') }}</div>
                <!-- <div v-if="userData.profile.provider.draft" class="tabs__tab__list__item right">{{ userData.profile.provider.draft.headquartersAddress.line1 }}, {{ userData.profile.provider.draft.headquartersAddress.line2? userData.profile.provider.draft.headquartersAddress.line2 + ', ': '' }} {{ userData.profile.provider.draft.headquartersAddress.postalCode }}, {{ userData.profile.provider.draft.headquartersAddress.city }}, {{ userData.profile.provider.draft.headquartersAddress.region }}, {{ userData.profile.provider.draft.headquartersAddress.country }}</div> -->
                <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" @click="modalToShow = 'headquartersAddress'" class="btn btn--std btn--outlinedark">EDIT</button></div>
                <div class="tabs__tab__list__line"></div>

                <div class="tabs__tab__list__item"><strong>Legal Representative's address</strong></div>
                <div class="tabs__tab__list__item right">{{ getCurrentOrDraftValue('representative.address.line1') }}, {{ getCurrentOrDraftValue('representative.address.line2') ? getCurrentOrDraftValue('representative.address.line2') + ', ': '' }} {{ getCurrentOrDraftValue('representative.address.postalCode') }}, {{ getCurrentOrDraftValue('representative.address.city') }}, {{ getCurrentOrDraftValue('representative.address.region') }}, {{ getCurrentOrDraftValue('representative.address.country') }}</div>
                <!-- <div v-if="userData.profile.provider.draft" class="tabs__tab__list__item right">{{ userData.profile.provider.draft.representative.address.line1 }}, {{ userData.profile.provider.draft.representative.address.line2? userData.profile.provider.draft.representative.address.line2 + ', ': '' }} {{ userData.profile.provider.draft.representative.address.postalCode }}, {{ userData.profile.provider.draft.representative.address.city }}, {{ userData.profile.provider.draft.representative.address.region }}, {{ userData.profile.provider.draft.representative.address.country }}</div> -->
                <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" @click="modalToShow = 'representativeAddress'" class="btn btn--std btn--outlinedark">EDIT</button></div>
                <div class="tabs__tab__list__line"></div>
              </div>

              <div class="tabs__tab__list" v-if="getCurrentOrDraftValue('type') === 'INDIVIDUAL'">
                <div class="tabs__tab__list__item"><strong>Address</strong></div>
                <div class="tabs__tab__list__item right">{{ getCurrentOrDraftValue('address.line1') }}, {{ getCurrentOrDraftValue('address.line2') ? getCurrentOrDraftValue('address.line2') + ', ': '' }} {{ getCurrentOrDraftValue('address.postalCode') }}, {{ getCurrentOrDraftValue('address.city') }}, {{ getCurrentOrDraftValue('address.region') }}, {{ getCurrentOrDraftValue('address.country') }}</div>
                <!-- <div v-if="userData.profile.provider.draft" class="tabs__tab__list__item right">{{ userData.profile.provider.draft.headquartersAddress.line1 }}, {{ userData.profile.provider.draft.headquartersAddress.line2? userData.profile.provider.draft.headquartersAddress.line2 + ', ': '' }} {{ userData.profile.provider.draft.headquartersAddress.postalCode }}, {{ userData.profile.provider.draft.headquartersAddress.city }}, {{ userData.profile.provider.draft.headquartersAddress.region }}, {{ userData.profile.provider.draft.headquartersAddress.country }}</div> -->
                <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" @click="modalToShow = 'individualAddress'" class="btn btn--std btn--outlinedark">EDIT</button></div>
                <div class="tabs__tab__list__line"></div>
              </div>
            </div>
          </div>
        </transition>

        <!-- PAYMENT METHODS -->
        <transition name="fade" mode="out-in">
          <div class="tabs__single-tab-wrapper" v-if="selectedTab == 'paymentMethods'">

            <!-- <div v-if="isUserDraft && draftStatus=='SUBMITTED'" class="mt-xs-20 mb-xs-20">
              <h3 class="settings__alert--blue">You have submitted changes and are pending approval.</h3>
            </div> -->

            <div class="tabs__tab tabs__tab__payment_methods">
              <div v-for="(card, i) in cards" :key="i" class="tabs__tab__ignore-grid-wrapper">
                <div class="tabs__tab__list">
                  <div class="tabs__tab__list__item"><strong>CARD {{ i + 1 }}</strong></div>
                  <div class="tabs__tab__list__item right">
                    {{ card.alias }}
                    <div class="tabs__tab__list__item__active-indicator" :class="card.active ? 'tabs__tab__list__item__active-indicator--active' : 'tabs__tab__list__item__active-indicator--inactive'"></div>
                  </div>
                  <!-- TODO: remove card (currently not available in API) -->
                  <!-- <div class="tabs__tab__list__item"><button :disabled="!canEditMangoPayRelatedField()" class="btn btn--std btn--outlinedark">REMOVE</button></div> -->
                  <div class="tabs__tab__list__line"></div>
                </div>
              </div>

              <!-- TODO: fix itemsTotal. MangoPay API seems to not support total items field. we've set it to 50 (no pagination as cards per page is set to 100) -->
              <pagination class="mt-xs-30" :currentPage="cardsCurrentPage" :itemsPerPage="cardsPerPage" :itemsTotal="50" @pageSelection="loadCards($event)"></pagination>

              <div v-if="cards.length" class="d-flex justify-content-end mt-xs-30">
                <button @click="addCard" class="btn btn--std btn--outlineblue">ADD CARD</button>
              </div>
              <h4 v-else class="mt-xs-30">There are no cards submitted. <button @click="addCard" class="btn btn--std btn--blue ml-xs-20">ADD CARD</button></h4>

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

    <loader v-if="isLoading()"></loader>
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
import store from '@/store';
// eslint-disable-next-line
import EnumRole from '@/model/role';
import {
  CustomerDraftIndividual,
  CustomerDraftProfessional,
  CustomerIndividual,
  CustomerProfessional,
  EnumCustomerType,
} from '@/model/account';
import { Card, CardRegistration } from '@/model/payin';
import {
  EnumKycDocumentType,
  KycDocument,
  KycDocumentCommand,
  KycDocumentPageCommand,
} from '@/model/kyc-document';
import {
  UboDeclaration, UboCommand,
} from '@/model/ubo-declaration';
import Modal from '@/components/Modal.vue';
import Pagination from '@/components/Pagination.vue';
import Loader from '@/components/Loader.vue';
import AccountApi from '../../service/account';
import ProfileApi from '../../service/profile';
import ProviderApi from '../../service/provider';
import PaymentApi from '../../service/consumer-payin';
import KycDocumentApi from '../../service/kyc-document';
import UboDeclarationApi from '../../service/ubo-declaration';

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
    Pagination,
    Loader,
  },
})
export default class DashboardHome extends Vue {
  // APIs
  accountApi: AccountApi;

  profileApi: ProfileApi;

  providerApi: ProviderApi;

  paymentApi: PaymentApi;

  kycDocumentApi: KycDocumentApi;

  uboDeclarationApi: UboDeclarationApi;

  // booleans for data loading status
  isUserDataLoaded: boolean;

  isCardsLoaded: boolean;

  isKycDocumentsLoaded: boolean;

  isUboDeclarationsLoaded: boolean;

  isUbosOfUboDeclarationLoaded: boolean;

  // user data status
  isUserDraft: boolean; // whether there is user draft data stored or not

  draftStatus: string; // if user draft saved, the status of it (draft, cancelled, submitted, completed)

  // more
  selectedTab: string;

  modalToShow: string;

  userData: Account;

  passwordCurrent: string;

  passwordNew: string;

  passwordNewVerify: string;

  passwordChanged: boolean;

  passwordCurrentError: boolean;

  cards: Card[];

  cardInitialization: CardRegistration;

  cardsPerPage: number;

  cardsCurrentPage: number;

  kycViewAsRole: EnumCustomerType;

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

    this.accountApi = new AccountApi();
    this.profileApi = new ProfileApi();
    this.providerApi = new ProviderApi();
    this.paymentApi = new PaymentApi();
    this.kycDocumentApi = new KycDocumentApi();
    this.uboDeclarationApi = new UboDeclarationApi();

    this.isUserDataLoaded = false;
    this.isCardsLoaded = false;
    this.isKycDocumentsLoaded = false;
    this.isUboDeclarationsLoaded = false;
    this.isUbosOfUboDeclarationLoaded = false;

    this.isUserDraft = false;
    this.draftStatus = '';

    this.userData = {} as Account;

    this.selectedTab = 'general';
    this.modalToShow = '';

    this.passwordCurrent = '';
    this.passwordNew = '';
    this.passwordNewVerify = '';
    this.passwordChanged = false;
    this.passwordCurrentError = false;

    this.cards = [];
    this.cardInitialization = {} as CardRegistration;
    this.cardsPerPage = 100;
    this.cardsCurrentPage = 0;

    this.kycViewAsRole = {} as EnumCustomerType;
    this.kycDocuments = null;
    this.kycNumberOfInputs = 1;

    this.uboDeclarations = null;
    this.selectedDeclaration = null;
    this.showUboForm = false;
    this.uboToAdd = this.initUboToAdd();
  }

  // TODO: add pagination to documents that support it (e.g. KYC)

  mounted(): void {
    this.loadUserData();
    this.loadCards();
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

      // todo: handle case with both roles
      if (store.getters.hasRole([EnumRole.ROLE_PROVIDER])) {
        this.isUserDraft = !!this.userData.profile.provider.draft;
        if (this.isUserDraft && this.userData.profile.provider.draft?.status) {
          this.draftStatus = this.userData.profile.provider.draft?.status;
        }
      } else if (store.getters.hasRole([EnumRole.ROLE_CONSUMER])) {
        this.isUserDraft = !!this.userData.profile.consumer.draft;
        if (this.isUserDraft && this.userData.profile.consumer.draft?.status) {
          this.draftStatus = this.userData.profile.consumer.draft?.status;
        }
      }

      this.isUserDataLoaded = true;
    });
  }

  loadCards(page = 0): void {
    // if not consumer, do not load cards
    if (!store.getters.hasRole([EnumRole.ROLE_CONSUMER])) {
      this.isCardsLoaded = true;
      return;
    }

    this.isCardsLoaded = false;
    this.paymentApi.getCards(page, this.cardsPerPage).then((cardsResponse) => {
      this.cardsCurrentPage = page;
      if (cardsResponse.success) {
        this.cards = cardsResponse.result;
        this.isCardsLoaded = true;
      } else {
        console.log('error fetching cards');
      }
    });
  }

  loadKycDocuments(): void {
    this.isKycDocumentsLoaded = false;

    // todo: handle case with both roles
    if (store.getters.hasRole([EnumRole.ROLE_PROVIDER])) {
      this.kycViewAsRole = EnumCustomerType.PROVIDER;
    } else if (store.getters.hasRole([EnumRole.ROLE_CONSUMER])) {
      this.kycViewAsRole = EnumCustomerType.CONSUMER;
    }

    this.kycDocumentApi.findAll(this.kycViewAsRole).then((documentsResponse) => {
      this.kycDocuments = documentsResponse.result.items;
      this.isKycDocumentsLoaded = true;
    });
  }

  loadUboDeclarations(): void {
    // if not provider, do not load UBOs
    if (!store.getters.hasRole([EnumRole.ROLE_PROVIDER])) {
      this.isUboDeclarationsLoaded = true;
      return;
    }

    this.isUboDeclarationsLoaded = false;
    this.uboDeclarationApi.findAll().then((delcarationResponse) => {
      this.uboDeclarations = delcarationResponse.result.items;
      this.isUboDeclarationsLoaded = true;
    });
  }

  isLoading(): boolean {
    if (!this.isUserDataLoaded || !this.isCardsLoaded || !this.isKycDocumentsLoaded || !this.isUboDeclarationsLoaded) {
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

  includeTabDueToRole(role: string): boolean {
    if (store.getters.hasRole([role])) {
      return true;
    }
    return false;
  }

  /*
    MODAL SUBMISSION & CHANGING FIELDS
  */

  getCurrentOrDraftValue(propertyPath: string): string {
    let obj: CustomerDraftProfessional | CustomerProfessional | CustomerDraftIndividual | CustomerIndividual | null;
    // todo: handle role better (?)
    if (store.getters.hasRole([EnumRole.ROLE_PROVIDER])) {
      obj = this.userData.profile.provider.draft ? this.userData.profile.provider.draft : this.userData.profile.provider.current;
    } else if (store.getters.hasRole([EnumRole.ROLE_CONSUMER])) {
      obj = this.userData.profile.consumer.draft ? this.userData.profile.consumer.draft : this.userData.profile.consumer.current;
    } else {
      obj = null;
    }

    // const obj = this.userData.profile.provider.draft ? this.userData.profile.provider.draft : this.userData.profile.provider.current;
    // eslint-disable-next-line
    const res = propertyPath.split('.').reduce((previous, current) => previous![current], obj) as any;
    return res;
  }

  canEditMangoPayRelatedField(): boolean {
    if (!this.isUserDraft || (this.isUserDraft && this.draftStatus === 'DRAFT')) {
      return true;
    }
    return false;
  }

  // eslint-disable-next-line
  onSubmitTopioAccountField(modalData: any): void {
    const data = {
      firstName: this.userData.profile.firstName,
      image: this.userData.profile.image,
      imageMimeType: this.userData.profile.imageMimeType,
      lastName: this.userData.profile.lastName,
      locale: this.userData.profile.locale,
      mobile: this.userData.profile.mobile,
      phone: this.userData.profile.phone,
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

  onChangePassword(): void {
    this.accountApi.changePassword(this.passwordCurrent, this.passwordNew, this.passwordNewVerify).then((changePasswordResponse) => {
      if (changePasswordResponse.success) {
        console.log('password changed successfully!');
        this.passwordCurrentError = false;
        this.passwordChanged = true;
      } else if (changePasswordResponse.messages[0].description === 'Access Denied') {
        console.log('wrong current password');
        this.passwordCurrentError = true;
      } else {
        console.log('failed to change password');
      }
    });
  }

  onPasswordModalDismiss(): void {
    this.passwordCurrent = '';
    this.passwordNew = '';
    this.passwordNewVerify = '';
    this.passwordChanged = false;
    this.passwordCurrentError = false;
    this.modalToShow = '';
  }

  // eslint-disable-next-line
  onSubmitMangoPayField(modalData): void {
    let draft;
    console.log('is user draft: ', this.isUserDraft);
    if (this.isUserDraft) { // if draft exists, update existing draft
      draft = this.userData.profile.provider.draft;
    } else { // if draft is null, copy current profile as draft
      draft = {};
      const propertiesToKeep = ['additionalInfo', 'bankAccount', 'companyNumber', 'companyType', 'email', 'headquartersAddress', 'address', 'legalPersonType', 'representative', 'logoImage', 'logoImageMimeType', 'name', 'phone', 'siteUrl', 'type'];
      // eslint-disable-next-line
      Object.keys(this.userData.profile.provider.current!).forEach((x) => {
        if (propertiesToKeep.includes(x)) {
          // eslint-disable-next-line
          draft[x] = this.userData.profile.provider.current![x];
        }
      });
    }

    switch (modalData.modalId) {
      case 'companyName': {
        draft.name = modalData.inputValues[0].value;
        break;
      }
      case 'vatNumber': {
        draft.companyNumber = modalData.inputValues[0].value;
        break;
      }
      case 'companyType': {
        draft.companyType = modalData.inputValues[0].value;
        break;
      }
      case 'companyEmail': {
        draft.email = modalData.inputValues[0].value;
        break;
      }
      case 'siteUrl': {
        draft.siteUrl = modalData.inputValues[0].value;
        break;
      }
      case 'bankAccountOwnerName': {
        draft.bankAccount.ownerName = modalData.inputValues[0].value;
        break;
      }
      case 'bankAccountIban': {
        draft.bankAccount.iban = modalData.inputValues[0].value;
        break;
      }
      case 'bankAccountBic': {
        draft.bankAccount.bic = modalData.inputValues[0].value;
        break;
      }
      case 'bankAccountOwnerAddress': {
        draft.bankAccount.ownerAddress.line1 = (this.$refs.bankAccountOwnerAddressLine1 as HTMLInputElement).value;
        draft.bankAccount.ownerAddress.line2 = (this.$refs.bankAccountOwnerAddressLine2 as HTMLInputElement).value;
        draft.bankAccount.ownerAddress.city = (this.$refs.bankAccountOwnerAddressCity as HTMLInputElement).value;
        draft.bankAccount.ownerAddress.region = (this.$refs.bankAccountOwnerAddressRegion as HTMLInputElement).value;
        draft.bankAccount.ownerAddress.postalCode = (this.$refs.bankAccountOwnerAddressPostalCode as HTMLInputElement).value;
        draft.bankAccount.ownerAddress.country = (this.$refs.bankAccountOwnerAddressCountry as HTMLInputElement).value;
        break;
      }
      case 'headquartersAddress': {
        draft.headquartersAddress.line1 = (this.$refs.headquartersAddressLine1 as HTMLInputElement).value;
        draft.headquartersAddress.line2 = (this.$refs.headquartersAddressLine2 as HTMLInputElement).value;
        draft.headquartersAddress.city = (this.$refs.headquartersAddressCity as HTMLInputElement).value;
        draft.headquartersAddress.region = (this.$refs.headquartersAddressRegion as HTMLInputElement).value;
        draft.headquartersAddress.postalCode = (this.$refs.headquartersAddressPostalCode as HTMLInputElement).value;
        draft.headquartersAddress.country = (this.$refs.headquartersAddressCountry as HTMLInputElement).value;
        break;
      }
      case 'representativeAddress': {
        draft.representative.address.line1 = (this.$refs.representativeAddressLine1 as HTMLInputElement).value;
        draft.representative.address.line2 = (this.$refs.representativeAddressLine2 as HTMLInputElement).value;
        draft.representative.address.city = (this.$refs.representativeAddressCity as HTMLInputElement).value;
        draft.representative.address.region = (this.$refs.representativeAddressRegion as HTMLInputElement).value;
        draft.representative.address.postalCode = (this.$refs.representativeAddressPostalCode as HTMLInputElement).value;
        draft.representative.address.country = (this.$refs.representativeAddressCountry as HTMLInputElement).value;
        break;
      }
      case 'individualAddress': {
        draft.address.line1 = (this.$refs.individualAddressLine1 as HTMLInputElement).value;
        draft.address.line2 = (this.$refs.individualAddressLine2 as HTMLInputElement).value;
        draft.address.city = (this.$refs.individualAddressCity as HTMLInputElement).value;
        draft.address.region = (this.$refs.individualAddressRegion as HTMLInputElement).value;
        draft.address.postalCode = (this.$refs.individualAddressPostalCode as HTMLInputElement).value;
        draft.address.country = (this.$refs.individualAddressCountry as HTMLInputElement).value;
        break;
      }
      case 'iban': {
        draft.bankAccount.iban = modalData.inputValues[0].value;
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
    CARDS
  */

  addCard(): void {
    // todo: add loader here
    this.paymentApi.createCardRegistration().then((createCardResponse) => {
      if (createCardResponse.success) {
        // submit card registration
        this.cardInitialization = createCardResponse.result;
        this.modalToShow = 'newCard';
      } else {
        console.log('error initializing card creation', createCardResponse);
      }
    });
  }

  // eslint-disable-next-line
  onSubmitNewCard(e: any): void {
    const url = this.cardInitialization.cardRegistrationUrl;

    const cardData = {
      accessKeyRef: this.cardInitialization.accessKey,
      data: this.cardInitialization.preRegistrationData,
      cardNumber: e.inputValues.find((x) => x.id === 'cardNumber').value,
      cardExpirationDate: e.inputValues.find((x) => x.id === 'cardExpirationDate').value,
      cardCvx: e.inputValues.find((x) => x.id === 'cardCvx').value,
    };

    this.paymentApi.postCardInfoToTokenizationServer(url, cardData).then((postCardResponse) => {
      if (postCardResponse && postCardResponse.startsWith('data=')) {
        const completeRegistrationData = {
          registrationData: postCardResponse,
          registrationId: this.cardInitialization.registrationId,
        };

        this.paymentApi.completeCardRegistration(completeRegistrationData).then((completeRegistrationResponse) => {
          if (completeRegistrationResponse.success) {
            console.log('successfully added card!', completeRegistrationResponse);
          } else {
            console.log('error adding card', completeRegistrationResponse);
          }
        });
      } else {
        console.log('error posting card details to token server', postCardResponse);
      }
    }).catch((err) => {
      console.log('err', err);
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

    // ATTENTION: it currently creates only PROVIDER document (TODO)
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
    // eslint-disable-next-line
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
    // OVERWRITE FOR DEVELOPMENT PURPOSE (TODO: submit birthdate in right format)
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
        // eslint-disable-next-line
        const index = this.uboDeclarations![this.selectedDeclaration!].ubos.findIndex((x) => x.id === uboId);
        // eslint-disable-next-line
        this.uboDeclarations![this.selectedDeclaration!].ubos.splice(index, 1);
      }
    });
  }

  submitDeclaration(): void {
    // eslint-disable-next-line
    const declarationId = this.uboDeclarations![this.selectedDeclaration!].id;
    this.uboDeclarationApi.submitDeclaration(declarationId).then((submitDeclarationResponse) => {
      if (submitDeclarationResponse.success) {
        const index = this.uboDeclarations?.findIndex((x) => x.id === submitDeclarationResponse.result.id);
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
  @import "@/assets/styles/_collection.scss";
  @import "~flexboxgrid/css/flexboxgrid.min.css";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
  @import "@/assets/styles/_forms.scss";
  @import "@/assets/styles/_btns.scss";
</style>
