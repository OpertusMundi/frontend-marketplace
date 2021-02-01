<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <h1>Storage</h1>
      </div>
    </div>
    <div class="storage">
      <div class="storage__status">
        <div class="storage__status__label"><span>45% out of 20GB used</span><a href="">Upgrade</a></div>
        <div class="storage__status__bar"><span></span></div>
      </div>
    </div>
    <div class="dashboard__head">
      <div class="dashboard__head__btns">
        <a href="#" class="btn--std btn--blue" @click.prevent="newFolder.show = true;">create folder</a>
        <a href="#" class="btn btn--outlineblue">Upload</a>
      </div>
      <div class="dashboard__head__helpers">
        <div class="asset_search asset_search--grey-border">
          <div class="asset_search__upper asset_search__upper--sm">
            <input type="text" name="" id="" placeholder="Search in storage" class="asset_search__upper__input">
            <div class="asset_search__upper__icon asset_search__upper__icon--open"><img src="@/assets/images/icons/search_black.svg" alt=""></div>
            <div class="asset_search__upper__icon asset_search__upper__icon--close"><img src="@/assets/images/icons/close_icon.svg" alt=""></div>
          </div>
        </div>
      </div>
    </div>
    <div class="storage">
      <div class="storage-files">
        <nav class="storage-files__nav">
          <ul>
            <li v-for="path in pathFormatted" v-bind:key="path">
              <a href="#" @click.prevent="goToPath('/')" v-if="path === ''">My Files</a>
              <a href="#" @click.prevent="goToPath(path)" v-else>{{ path }}</a>
            </li>
          </ul>
        </nav>
        <table class="storage-files__table">
          <tr>
            <th width="10px"><input type="checkbox" name="" id=""></th>
            <th width="50%">Name</th>
            <th width="15%">File size</th>
            <th>Modified</th>
            <th width="10%"></th>
          </tr>
          <tr class="storage-files__item storage-files__item--new" v-if="newFolder.show">
            <td></td>
            <td><img src="@/assets/images/icons/dashboard/folder.svg" alt=""><input type="text" name="newfolder" placeholder="Folder name.." v-model="newFolder.name" required @keyup.enter="createFolder()" ref="newFolderName"></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr class="storage-files__item" v-for="(folder, n) in activeFolder.folders" v-bind:key="`${n}_folder`">
            <td><input type="checkbox" name="" id=""></td>
            <td @click="goToFolder(folder)"><img src="@/assets/images/icons/dashboard/folder.svg" alt="">{{folder.name}}</td>
            <td>{{folder.size}}b</td>
            <td> {{ folder.modified }}</td>
            <td>
              <div class="storage-files__item__actions">
                <a href="#"><img src="@/assets/images/icons/dashboard/download.svg" alt=""></a>
                <a href="#"><img src="@/assets/images/icons/dashboard/edit.svg" alt=""></a>
                <a href="#" @click.prevent="deletePath(folder.path)"><img src="@/assets/images/icons/dashboard/delete.svg" alt=""></a>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FileSystemApi from '@/service/file';
import { ServerResponse } from '@/model';
import { DirectoryInfo, FilePathCommand, FileUploadCommand } from '@/model/file';
import { AxiosError } from 'axios';


@Component
export default class DashboardStorage extends Vue {
  fileSystemApi: FileSystemApi;

  fileSystem: DirectoryInfo;

  newFolderPath: string;

  activeFolder: DirectoryInfo;

  errors: any;

  newFolder: any;

  constructor() {
    super();

    this.fileSystemApi = new FileSystemApi();
    this.fileSystem = {
      name: '',
      path: '',
      count: 0,
      files: [],
      folders: [],
      size: 0,
      modifiedOn: '',
    };
    this.activeFolder = {
      name: '',
      path: '/',
      count: 0,
      files: [],
      folders: [],
      size: 0,
      modifiedOn: '',
    };
    this.newFolderPath = '';
    this.errors = [];
    this.newFolder = {
      name: '',
      show: false,
    };
  }

  mounted():void {
    this.getFileSystem();
  }

  getFileSystem():void {
    this.fileSystemApi.browse().then((response: ServerResponse<DirectoryInfo>) => {
      this.fileSystem = response.result;
      this.activeFolder = this.fileSystem;
    }).catch((error: AxiosError) => {
      console.log(error);
    });
  }

  createFolder():void {
    if (!this.newFolder.name) return;
    const path = `${this.activeFolder.path}/${this.newFolder.name}`;
    this.fileSystemApi.createFolder(path).then((response: ServerResponse<DirectoryInfo>) => {
      if (!response.success) {
        this.errors = response.messages;
        this.$vToastify.error(this.errors.map((e) => e.description).join(', '));
      } else {
        this.fileSystem = response.result;
        this.$vToastify.success(`Folder "${this.newFolder.name}" created!`);
        this.newFolder.show = false;
        this.newFolder.name = '';
        this.goToPath(this.activeFolder.name);
      }
    }).catch((error: AxiosError) => {
      if (error.response) {
        this.errors = error.response.data.messages;
        this.$vToastify.error(this.errors.map((e) => e.description).join(', '));
      }
    });
  }

  deletePath(path: string):void {
    this.fileSystemApi.deletePath(path).then((response: ServerResponse<DirectoryInfo>) => {
      if (!response.success) {
        this.errors = response.messages;
        this.$vToastify.error(this.errors.map((e) => e.description).join(', '));
      } else {
        this.fileSystem = response.result;
        this.$vToastify.success(`Folder "${path}" deleted!`);
        this.newFolder.show = false;
        this.newFolder.name = '';
        this.goToPath(this.activeFolder.name);
      }
    }).catch((error: AxiosError) => {
      if (error.response) {
        this.errors = error.response.data.messages;
        this.$vToastify.error(this.errors.map((e) => e.description).join(', '));
      }
    });
  }

  goToFolder(folder:DirectoryInfo):void {
    this.activeFolder = folder;
  }

  goToPath(name:string):void {
    let search = name;
    if (search !== '/') search = search.replace(/\//g, '');
    const result = this.deepSearch(this.fileSystem, 'name', (k, v) => v === search);
    if (result) {
      this.activeFolder = result;
    }
  }

  get pathFormatted():any {
    if (this.activeFolder.path === '/') return [''];
    return this.activeFolder.path.split('/');
  }
  /* eslint-disable */
  deepSearch(object:any, key:string, predicate:any):any {
    if (Object.prototype.hasOwnProperty.call(object, key) && predicate(key, object[key]) === true) return object;
    for (let i = 0; i < Object.keys(object).length; i += 1) {
      const value = object[Object.keys(object)[i]];
      if (typeof value === 'object' && value != null) {
        const o = this.deepSearch(object[Object.keys(object)[i]], key, predicate);
        if (o != null) return o;
      }
    }
    return null;
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/dashboard/_storage.scss";
</style>
