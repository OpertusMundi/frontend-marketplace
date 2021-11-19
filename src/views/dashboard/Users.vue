<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <h1>Users</h1>
      </div>
    </div>

    <div class="users">
      <div class="users__header__item">Username</div>
      <div class="users__header__item">Full name</div>
      <div class="users__header__item">Email</div>
      <div class="users__header__item">Roles</div>
      <div class="users__header__item"></div>
      <div class="users__line"></div>

      <div v-for="account in accounts" :key="account.key" class="grid-ignore-wrapper">
        <div class="users__item">{{ account.username }}</div>
        <div class="users__item">{{ `${account.profile.firstName} ${account.profile.lastName}` }}</div>
        <div class="users__item">{{ account.email }}</div>
        <div class="users__item">{{ account.roles.map(x => availableRoles.find(y => y.id === x).label).join(', ') }}</div>
        <div class="users__item"></div>
        <div class="users__line"></div>
      </div>
    </div>

    <button v-if="!isAddUserFormOpen" @click="isAddUserFormOpen = true" class="btn--std btn-add-user mt-xs-20">Add New User</button>

    <transition name="fade" mode="out-in">
      <validation-observer ref="formNewUser">
        <div v-if="isAddUserFormOpen" class="users-form mt-xs-40 ml-xs-20">
          <h4>Add new user</h4>
          <p class="mb-xs-20">Create a new user role for your organisation.</p>

          <validation-provider v-slot="{ errors }" name="Email" rules="required">
            <div class="form-group">
              <label for="email">Email *</label>
              <input v-model="userToAdd.email" type="text" class="form-group__text" name="email" id="email">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="First name" rules="required">
            <div class="form-group">
              <label for="firstName">First name *</label>
              <input v-model="userToAdd.profile.firstName" type="text" class="form-group__text" name="firstName" id="firstName">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Last name" rules="required">
            <div class="form-group">
              <label for="lastName">Last name *</label>
              <input v-model="userToAdd.profile.lastName" type="text" class="form-group__text" name="lastName" id="lastName">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Mobile" rules="required">
            <div class="form-group">
              <label for="mobile">Mobile *</label>
              <input v-model="userToAdd.profile.mobile" type="text" class="form-group__text" name="mobile" id="mobile">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <div class="form-group">
            <label for="phone">Phone</label>
            <input v-model="userToAdd.profile.phone" type="text" class="form-group__text" name="phone" id="phone">
          </div>

          <div class="form-group">
            <label>Image</label>
            <input type="file" ref="imageInput" class="form-group__text" name="image" id="image" style="display: none" @input="onImageSelect">
            <div class="d-flex space-between">
              <button class="btn btn--std btn--outlineblue align-self-center" @click="$refs.imageInput.click()">UPLOAD</button>
              <div class="avatar"><img :src="userToAdd.profile.image ? 'data:' + userToAdd.profile.imageMimeType + ';base64, ' + userToAdd.profile.image : defaultLogo()" :height="80" :width="80" alt="user image"></div>
            </div>
          </div>

          <validation-provider v-slot="{ errors }" name="Roles" rules="required">
            <div class="form-group">
              <label for="multiselect_roles">Roles *</label>
              <multiselect id="multiselect_roles"
                :options="availableRoles"
                v-model="selectedRoles"
                track-by="id"
                label="label"
                :multiple="true"
                :close-on-select="true"
                :show-labels="false"
                placeholder="Select role(s)"
              ></multiselect>
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>

          <div class="checkbox-group mt-xs-20">
            <input type="checkbox" class="mr-xs-10" id="checkboxNotifyUser" v-model="isInviteUserOnCreate">
            <label for="checkboxNotifyUser" class="text-second-color"> Notify user about their account role </label>
          </div>

          <button @click="isAddUserFormOpen = false" class="btn--std btn--outlineblue mt-xs-30">Cancel</button>
          <button class="btn--std btn--blue m-xs-30" @click="onCreateUser">Add User</button>
        </div>
      </validation-observer>
    </transition>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import Multiselect from 'vue-multiselect';
import { cloneDeep } from 'lodash';
import AccountVendorApi from '@/service/account-vendor';
import { Sorting } from '@/model/request';
import { EnumAccountSortField, Account, VendorAccountCommand } from '@/model/account';
import { EnumVendorRole } from '@/model/role';
import getDefaultLogo from '@/helper/logo';
import store from '@/store';

extend('required', required);

@Component({
  components: { ValidationObserver, ValidationProvider, Multiselect },
})
export default class DashboardUsers extends Vue {
  accountVendorApi: AccountVendorApi;

  accounts: Account[];

  availableRoles: { id: EnumVendorRole, label: string }[];

  selectedRoles: { id: EnumVendorRole, label: string }[];

  accountsPerPage: number;

  isAddUserFormOpen: boolean;

  userToAdd: VendorAccountCommand;

  isInviteUserOnCreate: boolean;

  constructor() {
    super();

    this.accountVendorApi = new AccountVendorApi();

    this.accounts = [];

    this.availableRoles = [
      { id: EnumVendorRole.ROLE_VENDOR_USER, label: 'User' },
      { id: EnumVendorRole.ROLE_VENDOR_PROVIDER, label: 'Provider' },
      { id: EnumVendorRole.ROLE_VENDOR_CONSUMER, label: 'Consumer' },
      { id: EnumVendorRole.ROLE_VENDOR_ANALYTICS, label: 'Analytics' },
    ];

    this.selectedRoles = [];

    this.accountsPerPage = 10;

    this.isAddUserFormOpen = false;

    this.userToAdd = {} as VendorAccountCommand;

    this.isInviteUserOnCreate = true;
  }

  created(): void {
    this.initUserToAdd();

    this.loadUsers();
  }

  @Watch('selectedRoles', { deep: true })
  onSelectedRolesChange(): void {
    this.userToAdd.roles = this.selectedRoles.map((x) => x.id);
  }

  async loadUsers(): Promise<void> {
    const sorting: Sorting<EnumAccountSortField> = {
      id: EnumAccountSortField.EMAIL,
      order: 'ASC',
    };

    try {
      const accountsResponse = await this.accountVendorApi.findAccounts(null, null, 0, this.accountsPerPage, sorting);
      this.accounts = accountsResponse.result.items;
    } catch (err) {
      console.log('err', err);
    }
  }

  initUserToAdd(): void {
    this.userToAdd = {
      email: '',
      profile: {
        firstName: '',
        lastName: '',
        mobile: '',
        image: '',
        imageMimeType: '',
        locale: '',
        phone: '',
      },
      roles: [],
    };
  }

  defaultLogo(): string {
    return getDefaultLogo();
  }

  onImageSelect(e: InputEvent): void {
    console.log('image selection', e);

    if (!(e.target as HTMLInputElement).files?.length) return;
    // eslint-disable-next-line
    const file = (e.target as HTMLInputElement).files![0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const image = (reader.result as string).split(';base64,')[1];
      const imageMimeType = (reader.result as string).split(';base64,')[0].split('data:')[1];

      this.userToAdd.profile.image = image;
      this.userToAdd.profile.imageMimeType = imageMimeType;
    };
    // eslint-disable-next-line
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  async onCreateUser(): Promise<void> {
    const isFormValid = await (this.$refs.formNewUser as Vue & { validate: () => boolean }).validate();
    if (!isFormValid) return;

    store.commit('setLoading', true);

    const user = cloneDeep(this.userToAdd);

    Object.keys(user.profile).forEach((key) => {
      if (!user.profile[key]) delete user.profile[key];
    });

    try {
      const createAccountResponse = await this.accountVendorApi.create(user);

      if (!createAccountResponse.success) {
        console.log('err', createAccountResponse);
        return;
      }
      console.log('create account', createAccountResponse);

      if (this.isInviteUserOnCreate) {
        const inviteAccountResponse = await this.accountVendorApi.invite(createAccountResponse.result.key);
        if (!inviteAccountResponse.success) {
          console.log('err', inviteAccountResponse);
          return;
        }
        console.log('invite account', inviteAccountResponse);
      }

      await this.loadUsers();

      this.isAddUserFormOpen = false;
      store.commit('setLoading', false);
    } catch (err) {
      console.log('err', err);
    }
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/dashboard/_users.scss";
@import "@/assets/styles/abstracts/_spacings.scss";
@import "@/assets/styles/abstracts/_flexbox-utilities.scss";
@import "@/assets/styles/_btns.scss";
@import "@/assets/styles/_forms.scss";
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
