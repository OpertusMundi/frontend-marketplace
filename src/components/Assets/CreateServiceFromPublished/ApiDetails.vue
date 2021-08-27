<template>
  <validation-observer ref="refObserver">
      <h1>Api Details</h1>
  </validation-observer>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

extend('required', required);

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
  },
})
export default class ApiDetails extends Vue {
  $refs!: {
    refObserver: InstanceType<typeof ValidationObserver>,
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
</style>
