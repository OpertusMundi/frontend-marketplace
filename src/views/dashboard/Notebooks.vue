<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <h1>topio Notebooks</h1>
        <h2>Available servers for your subscription</h2>
      </div>
    </div>
    <div class="notebooks pt-xs-50" v-if="configuration">
      <div class="notebooks__inner">
        <notebook-card
          v-for="(profile, index) in configuration.profiles"
          v-bind:key="`notebook_${index}`"
          :profile="profile"
          :active="checkIfActive(profile.name)"
        >
        </notebook-card>
        <div class="notebooks-item notebooks-item--empty"></div>
        <div class="notebooks-item notebooks-item--empty"></div>
        <div class="notebooks-item notebooks-item--empty"></div>
      </div>
      <hr>
      <div class="notebooks__sectiontitle">More servers</div>
      <div class="notebooks__inner">
        <notebook-card
          v-for="(profile, index) in configuration.profiles.slice(0, 2)"
          v-bind:key="`notebook_${index}`"
          :profile="profile"
          :active="checkIfActive(profile.name)"
        >
        </notebook-card>
        <div class="notebooks-item notebooks-item--empty"></div>
        <div class="notebooks-item notebooks-item--empty"></div>
        <div class="notebooks-item notebooks-item--empty"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NotebookCard from '@/components/NotebookCard.vue';
import { JupyterConfiguration } from '@/model/notebook';
import NotebooksApi from '@/service/notebook';

@Component({
  components: { NotebookCard },
})
export default class Notebooks extends Vue {
  notebooksApi: NotebooksApi;

  configuration: JupyterConfiguration | null;

  constructor() {
    super();

    this.notebooksApi = new NotebooksApi();
    this.configuration = null;
  }

  mounted():void {
    this.notebooksApi.getConfiguration().then((response) => {
      if (response.success) {
        this.configuration = response.result;
      }
    });
  }

  checkIfActive(name:string):boolean {
    if (name === this.configuration?.activeProfile) {
      return true;
    }
    return false;
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/abstracts/_spacings.scss";
</style>
