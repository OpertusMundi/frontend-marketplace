<template>
  <div class="wrapper">
    <div class="container">
      <div class="row">
        <div class="col-md-4">side menu</div>
        <div class="col-md-8">map</div>
      </div>
    </div>
    <!-- <div class="row">
      <div class="col-md-4">side menu</div>
      <div class="col-md-8">map</div>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class EOExplorer extends Vue {
  // constructor() {
  //   super();
  // }

  mounted():void {
    console.log('eo explorer');
  }
}
</script>
<style lang="scss">
  @import "~flexboxgrid/css/flexboxgrid.min.css";
</style>
