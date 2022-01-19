<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <h1>Users</h1>
      </div>
    </div>

    <div class="users">
      <div class="users__header__item"></div>
      <div class="users__header__item">Username</div>
      <div class="users__header__item">Full name</div>
      <div class="users__header__item">Email</div>
      <div class="users__header__item">Roles</div>
      <div class="users__header__item"></div>
      <div class="users__line"></div>

      <div v-for="account in accounts" :key="account.key" class="grid-ignore-wrapper">
        <div class="users__item--avatar">
          <div class="users__avatar"><img :src="account.profile.image ? 'data:' + account.profile.imageMimeType + ';base64, ' + account.profile.image : defaultLogo()" :height="80" :width="80" alt="user image"></div>
        </div>
        <div class="users__item">
          <div class="status-indicator__wrapper"><div class="status-indicator" :class="account.active ? 'status-indicator--active' : 'status-indicator--inactive'"></div></div>
          <span>{{ account.username }}</span>
        </div>
        <div class="users__item"><span>{{ `${account.profile.firstName} ${account.profile.lastName}` }}</span></div>
        <div class="users__item"><span>{{ account.email }}</span></div>
        <div class="users__item"><span>{{ account.roles.filter(x => x !== 'ROLE_VENDOR_USER').map(x => availableRoles.find(y => y.id === x).label).join(', ') }}</span></div>
        <div class="users__item">
          <button class="btn btn--std btn--outlineblue mr-xs-20" @click="onEditUser(account)">EDIT</button>
          <button v-if="account.emailVerified" :class="account.active ? 'btn--outlineblue' : 'btn--blue'" class="btn btn--std" @click="changeUserStatus(account.key, account.active ? 'disable' : 'enable')">{{ account.active ? 'DISABLE' : 'ENABLE' }}</button>
          <button v-else-if="account.activationStatus === 'UNDEFINED'" class="btn btn--std btn--blue" @click="inviteUser(account.key)">INVITE</button>
          <small v-else-if="account.activationStatus === 'PENDING'">PENDING EMAIL VERIFICATION</small>
        </div>
        <div class="users__line"></div>
      </div>
    </div>

    <pagination :currentPage="currentPage" :itemsPerPage="accountsPerPage" :itemsTotal="accountsTotal" @pageSelection="loadUsers" class="mt-xs-20"></pagination>

    <button v-if="mode === 'VIEW'" @click="onAddUser" class="btn btn--std btn--outlineblue mt-xs-20">Add New User</button>

    <transition name="fade" mode="out-in">
      <validation-observer ref="formNewUser">
        <div v-if="mode === 'ADD_USER' || mode === 'EDIT_USER'" class="users-form mt-xs-40 ml-xs-20">
          <h4>{{ mode === 'ADD_USER' ? 'Add new user' : 'Edit user' }}</h4>
          <p v-if="mode === 'ADD_USER'" class="mb-xs-20">Create a new user role for your organisation.</p>

          <validation-provider v-slot="{ errors }" name="Email" rules="required">
            <div class="form-group">
              <label for="email">Email *</label>
              <input :disabled="mode === 'EDIT_USER'" v-model="userToAddOrEdit.email" type="text" class="form-group__text" name="email" id="email">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="First name" rules="required">
            <div class="form-group">
              <label for="firstName">First name *</label>
              <input v-model="userToAddOrEdit.profile.firstName" type="text" class="form-group__text" name="firstName" id="firstName">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Last name" rules="required">
            <div class="form-group">
              <label for="lastName">Last name *</label>
              <input v-model="userToAddOrEdit.profile.lastName" type="text" class="form-group__text" name="lastName" id="lastName">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <validation-provider v-slot="{ errors }" name="Mobile" rules="required">
            <div class="form-group">
              <label for="mobile">Mobile *</label>
              <input v-model="userToAddOrEdit.profile.mobile" type="text" class="form-group__text" name="mobile" id="mobile">
              <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
            </div>
          </validation-provider>
          <div class="form-group">
            <label for="phone">Phone</label>
            <input v-model="userToAddOrEdit.profile.phone" type="text" class="form-group__text" name="phone" id="phone">
          </div>

          <div class="form-group">
            <label>Image</label>
            <input type="file" ref="imageInput" class="form-group__text" name="image" id="image" style="display: none" @input="onImageSelect">
            <div class="d-flex space-between">
              <button class="btn btn--std btn--outlineblue align-self-center" @click="$refs.imageInput.click()">UPLOAD</button>
              <div class="users__avatar"><img :src="userToAddOrEdit.profile.image ? 'data:' + userToAddOrEdit.profile.imageMimeType + ';base64, ' + userToAddOrEdit.profile.image : defaultLogo()" :height="80" :width="80" alt="user image"></div>
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

          <div v-if="mode === 'ADD_USER'" class="checkbox-group mt-xs-20">
            <input type="checkbox" class="mr-xs-10" id="checkboxNotifyUser" v-model="isInviteUserOnCreate">
            <label for="checkboxNotifyUser" class="text-second-color"> Notify user about their account role </label>
          </div>

          <button @click="mode = 'VIEW'" class="btn btn--std btn--outlineblue mt-xs-30">Cancel</button>
          <button class="btn btn--std btn--blue m-xs-30" @click="onCreateOrUpdateUser">{{ mode === 'ADD_USER' ? 'Add User' : 'Update User' }}</button>
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
import Pagination from '@/components/Pagination.vue';
import AccountVendorApi from '@/service/account-vendor';
import { ServerResponse } from '@/model';
import { Sorting } from '@/model/request';
import { EnumAccountSortField, Account, VendorAccountCommand } from '@/model/account';
import { EnumRole, EnumVendorRole } from '@/model/role';
import getDefaultLogo from '@/helper/logo';
import store from '@/store';

extend('required', required);

enum EnumMode {
  VIEW = 'VIEW',
  ADD_USER = 'ADD_USER',
  EDIT_USER = 'EDIT_USER',
}

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    Multiselect,
    Pagination,
  },
})
export default class DashboardUsers extends Vue {
  accountVendorApi: AccountVendorApi;

  accounts: Account[];

  availableRoles: { id: EnumVendorRole, label: string }[];

  selectedRoles: { id: EnumVendorRole, label: string }[];

  currentPage: number;

  accountsPerPage: number;

  accountsTotal: number;

  mode: EnumMode;

  userToAddOrEdit: VendorAccountCommand;

  keyOfUserToEdit: string;

  isInviteUserOnCreate: boolean;

  constructor() {
    super();

    this.accountVendorApi = new AccountVendorApi();

    this.accounts = [];

    this.availableRoles = [
      // { id: EnumVendorRole.ROLE_VENDOR_USER, label: 'User' },
      { id: EnumVendorRole.ROLE_VENDOR_PROVIDER, label: 'Provider' },
      { id: EnumVendorRole.ROLE_VENDOR_CONSUMER, label: 'Consumer' },
      { id: EnumVendorRole.ROLE_VENDOR_ANALYTICS, label: 'Analytics' },
    ];

    this.selectedRoles = [];

    this.currentPage = 0;
    this.accountsPerPage = 5;
    this.accountsTotal = 0;

    this.mode = EnumMode.VIEW;

    this.userToAddOrEdit = {} as VendorAccountCommand;

    this.keyOfUserToEdit = '';

    this.isInviteUserOnCreate = true;
  }

  created(): void {
    this.loadUsers();
  }

  @Watch('selectedRoles', { deep: true })
  onSelectedRolesChange(): void {
    this.userToAddOrEdit.roles = this.selectedRoles
      .map((x) => x.id);
    // .filter((x) => x !== EnumVendorRole.ROLE_VENDOR_USER); // ROLE_VENDOR_USER is automatically assigned server-side
  }

  async loadUsers(page = 0): Promise<void> {
    store.commit('setLoading', true);

    const sorting: Sorting<EnumAccountSortField> = {
      id: EnumAccountSortField.EMAIL,
      order: 'ASC',
    };

    try {
      const accountsResponse = await this.accountVendorApi.findAccounts(null, null, page, this.accountsPerPage, sorting);
      this.accounts = accountsResponse.result.items;
      this.accountsTotal = accountsResponse.result.count;
      this.currentPage = accountsResponse.result.pageRequest.page;
    } catch (err) {
      console.log('err', err);
    }
    store.commit('setLoading', false);
  }

  initUserToAdd(): void {
    this.userToAddOrEdit = {
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

    this.selectedRoles = [];

    this.isInviteUserOnCreate = true;
  }

  initUserToEdit(user: Account): void {
    this.userToAddOrEdit = {
      email: user.email,
      profile: {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        mobile: user.profile.mobile,
        ...(user.profile.locale && { locale: user.profile.locale }),
        ...(user.profile.phone && { phone: user.profile.phone }),
        ...(user.profile.image && { image: user.profile.image }),
        ...(user.profile.imageMimeType && { imageMimeType: user.profile.imageMimeType }),
      },
      roles: [],
    };

    this.selectedRoles = user.roles
      .filter((x) => x !== EnumRole.ROLE_VENDOR_USER)
      .map((x) => ({
        id: x as unknown as EnumVendorRole,
        label: this.availableRoles.find((y) => y.id === x as unknown as EnumVendorRole)?.label || '',
      }));
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

      Vue.set(this.userToAddOrEdit.profile, 'image', image);
      Vue.set(this.userToAddOrEdit.profile, 'imageMimeType', imageMimeType);
    };
    // eslint-disable-next-line
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  async onCreateOrUpdateUser(): Promise<void> {
    const isFormValid = await (this.$refs.formNewUser as Vue & { validate: () => boolean }).validate();
    if (!isFormValid) return;

    store.commit('setLoading', true);

    const user = cloneDeep(this.userToAddOrEdit);

    Object.keys(user.profile).forEach((key) => {
      if (!user.profile[key]) delete user.profile[key];
    });

    try {
      if (this.mode === EnumMode.ADD_USER) {
        const createAccountResponse = await this.accountVendorApi.create(user);

        if (!createAccountResponse.success) {
          console.log('err', createAccountResponse);
          return;
        }
        console.log('create account', createAccountResponse);

        if (this.isInviteUserOnCreate) await this.inviteUser(createAccountResponse.result.key, true);
      } else if (this.mode === EnumMode.EDIT_USER) {
        const updateAccountResponse = await this.accountVendorApi.update(this.keyOfUserToEdit, user);
        this.keyOfUserToEdit = '';

        if (!updateAccountResponse.success) {
          console.log('err', updateAccountResponse);
          return;
        }
        console.log('create account', updateAccountResponse);
      }

      await this.loadUsers(this.mode === EnumMode.EDIT_USER ? this.currentPage : 0);

      this.mode = EnumMode.VIEW;
      store.commit('setLoading', false);
    } catch (err) {
      console.log('err', err);
    }
  }

  async inviteUser(key: string, isCalledByCreateUserMethod = false): Promise<void> {
    if (!isCalledByCreateUserMethod) store.commit('setLoading', true);

    try {
      const response = await this.accountVendorApi.invite(key);

      if (!response.success) console.log('err', response);
    } catch (err) {
      console.log('err', err);
    }

    if (!isCalledByCreateUserMethod) this.loadUsers(this.currentPage);
  }

  onAddUser(): void {
    this.initUserToAdd();
    this.mode = EnumMode.ADD_USER;
    this.scrollToUserForm();
  }

  onEditUser(user: Account): void {
    this.keyOfUserToEdit = user.key;
    this.initUserToEdit(user);
    this.mode = EnumMode.EDIT_USER;
    this.scrollToUserForm();
  }

  changeUserStatus(key: string, action: 'enable' | 'disable'): void {
    store.commit('setLoading', true);

    let promise: Promise<ServerResponse<Account>> | null = null;
    switch (action) {
      case 'enable':
        promise = this.accountVendorApi.enable(key);
        break;
      case 'disable':
        promise = this.accountVendorApi.disable(key);
        break;
      default:
    }

    if (!promise) return;
    promise.then((response) => {
      if (!response.success) console.log('err', response);

      this.loadUsers(this.currentPage);
    }).catch((err) => {
      console.log('err', err);
    }).finally(() => {
      store.commit('setLoading', false);
    });
  }

  scrollToUserForm(): void {
    this.$nextTick(() => {
      const y = (document.querySelector('.users-form') as HTMLElement).offsetTop;
      window.scrollTo({
        top: y,
        behavior: 'smooth',
      });
    });
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
