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
      <div class="users__header__item">Role</div>
      <div class="users__header__item"></div>
      <div class="users__line"></div>

      <div v-for="user in users" :key="user.username" class="grid-ignore-wrapper">
        <div class="users__item"> {{ user.username }} (dummy) </div>
        <div class="users__item"> {{user.fullName}} </div>
        <div class="users__item"> {{user.email}} </div>
        <div class="users__item"> {{user.role}} </div>
        <div class="users__item"></div>
        <div class="users__line"></div>
      </div>
    </div>

    <button v-if="!isAddUserFormOpen" @click="isAddUserFormOpen = true" class="btn--std btn-add-user mt-xs-20">Add New User</button>

    <transition name="fade" mode="out-in">
      <div v-if="isAddUserFormOpen" class="mt-xs-40 ml-xs-20">
        <h4>Add new user</h4>
        <p class="mb-xs-20">Create a new user role for your organisation. All people need to already have a topio account.</p>
        <div class="form-group">
          <label for="username">Username *</label>
          <input type="text" class="form-group__text" name="username" id="username">
        </div>
        <div class="form-group">
          <label for="email">Email *</label>
          <input type="text" class="form-group__text" name="email" id="email">
        </div>
        <div class="form-group">
          <label for="firstName">First name</label>
          <input type="text" class="form-group__text" name="firstName" id="firstName">
        </div>
        <div class="form-group">
          <label for="lastName">Last name</label>
          <input type="text" class="form-group__text" name="lastName" id="lastName">
        </div>
        <div class="form-group">
          <label for="role">Role *</label>
          <select class="form-group__select" name="role" id="role">
            <option value="publisher">Publisher</option>
            <option value="user">User</option>
          </select>
        </div>

        <div class="checkbox-group mt-xs-20">
          <input type="checkbox" class="mr-xs-10" id="checkboxNotifyUser">
          <label for="checkboxNotifyUser" class="text-second-color"> Notify user about their account role </label>
        </div>

        <button @click="isAddUserFormOpen = false" class="btn--std btn--outlineblue mt-xs-30">Cancel</button>
        <button class="btn--std btn--blue m-xs-30">Add User</button>
      </div>
    </transition>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class DashboardUsers extends Vue {
  users: any;

  isAddUserFormOpen: boolean;

  constructor() {
    super();

    this.isAddUserFormOpen = false;

    this.users = [{
      username: 'athenarc',
      fullName: 'Athena Research Center',
      email: 'email@athenarc.gr',
      role: 'Admin',
    }];
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/styles/dashboard/_users.scss";
@import "@/assets/styles/abstracts/_spacings.scss";
@import "@/assets/styles/_btns.scss";
@import "@/assets/styles/_forms.scss";
</style>
