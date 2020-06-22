<template>
<div class="dashboard__inner">
    <div class="dashboard__head">
      <h1>Add an asset</h1>
      <div class="dashboard__head__helpers">
        <a href="#" class="btn btn--outlineblue">SAVE DRAFT</a>
        <a href="#" class="btn btn--outlineblue">EXIT</a>
      </div>
    </div>

    <div class="dashboard__form">
      <ul class="dashboard__form__nav">
        <li><a href="#" class="active">Asset Type</a></li>
        <li><a href="#">Metadata</a></li>
        <li><a href="#">Contract</a></li>
        <li><a href="#">Pricing</a></li>
        <li><a href="#">Delivery</a></li>
        <li><a href="#">Payout</a></li>
        <li><a href="#">Review</a></li>
      </ul>
      <div class="dashboard__form__steps">
        <div class="dashboard__form__step">
          <div class="form-group">
            <label for="email">Email address:</label>
            <input type="email" class="form-group__text" id="email" placeholder="Enter email">
            <div class="errors">Please check you input!</div>
          </div>
          <div class="form-group">
            <label for="email">Email address:</label>
            <input type="email" class="form-group__text" id="email" placeholder="Enter email">
            <div class="errors">Please check you input!</div>
          </div>
          <div class="form-group-double">
            <div class="form-group">
              <label for="email">Email address:</label>
              <input type="email" class="form-group__text" id="email" placeholder="Enter email">
              <div class="errors">Please check you input!</div>
            </div>
            <div class="form-group">
              <label for="email">Email address:</label>
              <input type="email" class="form-group__text" id="email" placeholder="Enter email">
              <div class="errors">Please check you input!</div>
            </div>
          </div>
          <div class="form-group">
            <label for="email">Additional Info:</label>
            <textarea name="" id="" cols="30" rows="10"></textarea>
            <div class="errors">Please check you input!</div>
          </div>
        </div>
      </div>
      <div class="dashboard__form__navbuttons">
        <button class="btn--std btn--blue">PREVIOUS</button>
        <button class="btn--std btn--blue">NEXT</button>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class CreateAsset extends Vue {
  // constructor() {
  //   super();
  // }
  mounted():void {
    console.log(this.$route.params.error);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_forms.scss";
</style>
