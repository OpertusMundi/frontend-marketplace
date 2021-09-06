<template>
  <div class="notebooks-item" :class="{'active' : active}" v-if="profile">
  <!-- <div class="notebooks-item notebooks-item--inactive"> -->
    <div class="notebooks-item__view"><span><a v-if="url" :href="url" target="_blank">OPEN</a></span></div>
    <div class="notebooks-item__inner">
      <div class="notebooks-item__top">
        <div class="notebooks-item__top__left">
          <div class="notebooks-item__title">{{profile.name}}</div>
          <ul class="notebooks-item__specs">
            <li>{{profile.resources.memoryLimit | bytesToMb}}GB RAM</li>
            <li>{{profile.resources.cpuLimit}} VC</li>
          </ul>
        </div>
        <div class="notebooks-item__top__right">
          <div class="notebooks-item__action" v-if="!loading && !active" @click.prevent="startNotebook()"><span v-if="started">STARTED</span><span v-else>START</span></div>
          <div class="notebooks-item__action" v-if="loading && !active">STARTING<i>.</i><i>.</i><i>.</i></div>
          <div class="notebooks-item__action" v-if="active || started" @click.prevent="stopNotebook()">STOP</div>
        </div>
      </div>
      <div class="notebooks-item__bottom">
        <p v-html="profile.description"></p>
        <!-- <span>Available in Medium Tier package</span> -->
        <transition name="fade" mode="out-in">
          <span v-if="error" class="notebooks-item__bottom__error">{{ error }}</span>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { JupyterHubProfile } from '@/model/notebook';
import NotebooksApi from '@/service/notebook';

@Component({
  filters: {
    bytesToMb(value: number) {
      return (value / (1024 * 1024 * 1024)).toFixed(0);
    },
  },
})
export default class NotebookCard extends Vue {
  notebooksApi: NotebooksApi;

  @Prop(Object) readonly profile: JupyterHubProfile | undefined;

  @Prop({ required: true }) active!: boolean;

  started = false;

  loading = false;

  error: string | null;

  url: string | null;

  constructor() {
    super();

    this.notebooksApi = new NotebooksApi();
    this.url = null;
    this.error = null;
  }

  mounted():void {
    if (this.active) {
      this.notebooksApi.getServerStatus().then((response) => {
        if (response.success) {
          if (response.result.ready) {
            this.started = true;
            this.active = true;
            this.loading = false;
            this.url = response.result.path;
          }
        }
      });
    }
  }

  startNotebook():void {
    if (this.started || this.active) return;
    if (this.profile) {
      this.loading = true;
      this.notebooksApi.startServer(this.profile.name).then((response) => {
        if (response.success) {
          if (response.result.ready) {
            this.started = true;
            this.active = true;
            this.loading = false;
            this.url = response.result.path;
          } else {
            this.checkIfStarted();
          }
        } else {
          this.started = false;
          this.active = false;
          this.loading = false;
          response.messages.forEach((message) => {
            if (message.code === 'JupyterMessageCode.SERVER_RUNNING') {
              this.error = message.description;
              setTimeout(() => {
                this.error = null;
              }, 4000);
            }
          });
        }
      });
    }
  }

  stopNotebook():void {
    this.loading = true;
    this.notebooksApi.stopServer().then((response) => {
      if (response.success) {
        // emit event to parent
        this.started = false;
        this.loading = false;
      }
    });
  }

  checkIfStarted(): void {
    this.notebooksApi.getServerStatus().then((response) => {
      if (response.success) {
        if (response.result.ready) {
          this.started = true;
          this.active = true;
          this.loading = false;
          this.url = response.result.path;
          // emit event to parent
        } else {
          setTimeout(() => {
            this.checkIfStarted();
          }, 2000);
        }
      }
    });
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/_notebooks.scss";
</style>
