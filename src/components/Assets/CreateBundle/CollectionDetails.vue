<template>
  <validation-observer ref="refObserver">
    <div class="dashboard__form__step dashboard__form__step--full-width">

      <div class="row">
        <div class="col-md-7">
          <div class="dashboard__form__step__title">
            <h3>Collection Details</h3>
            <p>Give your new collection a title, versioning and a short description</p>
          </div>

        </div>
      </div>

    </div>
  </validation-observer>
</template>
<script lang="ts">
import {
  Component,
  Vue,
} from 'vue-property-decorator';

@Component
export default class CollectionDetails extends Vue {
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/abstracts/_spacings.scss";
  @import "@/assets/styles/abstracts/_flexbox-utilities.scss";
</style>
