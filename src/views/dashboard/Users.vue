<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <h1>Users</h1>
      </div>
    </div>

    <div class="users">
      <div class="grid-container">
        <div class="grid-header-item">Username</div>
        <div class="grid-header-item">Full name</div>
        <div class="grid-header-item">Email</div>
        <div class="grid-header-item">Role</div>
        <div class="grid-header-item"></div>
        <div class="grid-line"></div>

        <div v-for="user in users" :key="user.username" class="grid-items-wrapper">
          <div class="grid-item"> {{ user.username }} </div>
          <div class="grid-item"> {{user.fullName}} </div>
          <div class="grid-item"> {{user.email}} </div>
          <div class="grid-item"> {{user.role}} </div>
          <div class="grid-item"></div>
          <div class="grid-line"></div>
        </div>
      </div>

      <button v-if="!isAddUserFormOpen" @click="isAddUserFormOpen = true" class="btn--std btn-add-user mt-md-20">Add New User</button>

      <div v-if="isAddUserFormOpen" class="add-user-form mt-md-40 ml-md-20">
        <h4>Add new user</h4>
        <p class="mb-md-20">Create a new user role for your organisation. All people need to already have a topio account.</p>
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

        <div class="checkbox-group mt-md-20">
          <input type="checkbox" class="mr-md-10" id="checkbox_notify_user">
          <label for="checkbox_notify_user"> Notify user about their account role </label>
        </div>

        <button @click="isAddUserFormOpen = false" class="btn--std btn--outlineblue mt-md-30">Cancel</button>
        <button class="btn--std btn--blue mt-md-30 ml-md-30">Add User</button>
      </div>

    </div>
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
<style lang="scss">

.users .grid-container {
    display: grid;
    grid-template-columns: 20% 20% 20% 20% 20%;
}

.users .grid-items-wrapper {
    display: contents;
}

// .grid-header-item, .grid-item {
//     padding: 20px;
// }

.users .grid-header-item {
  font-weight: 700;
  padding: 10px 20px 10px 20px;
}

.users .grid-item {
  padding: 20px;
}

.users .grid-line {
  grid-column: 1/6;
  height: 1px !important;
  width: 100%;
  background: $labelColor;
}

.users .btn-add-user {
  background: transparent;
}

// .add-user-form {
//   max-width: 600px;
// }

.add-user-form input {
  max-width: 600px;
}

.add-user-form select {
  max-width: 300px;
}

.add-user-form > .checkbox-group > label {
  color: $secondColor;
}

input[type="checkbox"] {
    -ms-transform: scale(1.3); /* IE */
    -moz-transform: scale(1.3); /* FF */
    -webkit-transform: scale(1.3); /* Safari and Chrome */
    -o-transform: scale(1.3); /* Opera */
    transform: scale(1.3);
    padding: 10px;
}

.checkbox-group {
    display: flex;
    align-items: center;
}

@import "@/assets/styles/dashboard/_users.scss";
@import "@/assets/styles/abstracts/_spacings.scss";
@import "@/assets/styles/_btns.scss";
@import "@/assets/styles/_forms.scss";
</style>
