<template>
  <div class="documentation-items">
    <div class="s_container">
      <div class="documentation-items__title">{{ title }}</div>
      <div class="documentation-items__subtitle">{{ subtitle }}</div>
      <div class="documentation-items__holder">
        <div class="documentation-items__item">
          <div class="documentation-items__item__inner">
            <div class="documentation-items__item__counter"><span>1</span></div>
            <div class="documentation-items__item__title">
              Documentation #1
            </div>
            <div class="documentation-items__item__text">
              Secure cloud storage for managing, sharing, trading and using your files across
              Topio’s services.
            </div>
          </div>

          <div class="documentation-items__item__view"><span>VIEW SERVICE</span></div>
        </div>
          <div class="documentation-items__item">
          <div class="documentation-items__item__inner">
            <div class="documentation-items__item__counter"><span>1</span></div>
            <div class="documentation-items__item__title">
              Documentation #1
            </div>
            <div class="documentation-items__item__text">
              Secure cloud storage for managing, sharing, trading and using your files across
              Topio’s services.
            </div>
          </div>

          <div class="documentation-items__item__view"><span>VIEW SERVICE</span></div>
        </div>
          <div class="documentation-items__item">
          <div class="documentation-items__item__inner">
            <div class="documentation-items__item__counter"><span>1</span></div>
            <div class="documentation-items__item__title">
              Documentation #1
            </div>
            <div class="documentation-items__item__text">
              Secure cloud storage for managing, sharing, trading and using your files across
              Topio’s services.
            </div>
          </div>

          <div class="documentation-items__item__view"><span>VIEW SERVICE</span></div>
        </div>
          <div class="documentation-items__item">
          <div class="documentation-items__item__inner">
            <div class="documentation-items__item__counter"><span>1</span></div>
            <div class="documentation-items__item__title">
              Documentation #1
            </div>
            <div class="documentation-items__item__text">
              Secure cloud storage for managing, sharing, trading and using your files across
              Topio’s services.
            </div>
          </div>

          <div class="documentation-items__item__view"><span>VIEW DOCUMENTATION</span></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Prop, Vue } from 'vue-property-decorator';

export default class DocumentationSection extends Vue {
    @Prop({ required: true }) readonly title!: string;

    @Prop({ required: true }) readonly subtitle!: string;
}
</script>
<style lang="scss">
@import "@/assets/styles/_documentation-items.scss";
</style>
