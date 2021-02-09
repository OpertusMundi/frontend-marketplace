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
        <a href="#" class="btn btn--outlineblue" @click.prevent="$refs.file.click();">Upload</a>
        <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" style="display:none"/>
      </div>
      <div class="dashboard__head__helpers">
        <div class="asset_search asset_search--grey-border">
          <div class="asset_search__upper asset_search__upper--sm">
            <input type="text" name="" id="" v-model="searchString" placeholder="Search in folder" class="asset_search__upper__input">
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
        <div class="storage__uploadprocess" v-if="newFile">
          <div class="storage__uploadprocess__info">{{newFile.name}} <span>{{newFile.size | bytesToMb}} MB</span><a href="" @click.prevent="uploadTokenSource.cancel('Canceled by the user')"><img src="@/assets/images/icons/close_icon.svg" alt=""></a></div>
          <div class="storage__uploadprocess__bar"><span :style="{ width: `${uploadPercentage}%` }"></span></div>
          <div class="storage__uploadprocess__bottom"><span>{{ uploadPercentage }}%</span><span>{{ uploadSpeed }} MB / s</span></div>
        </div>
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
            <td style="text-align:right;"><a href="#" @click.prevent="newFolder.show = false; newFolder.name= '';" ><img src="@/assets/images/icons/close_icon.svg" alt=""></a></td>
          </tr>
          <tr class="storage-files__item" v-for="(folder, n) in filteredFolders" v-bind:key="`${n}_folder`">
            <td><input type="checkbox" name="" id=""></td>
            <td @click="goToFolder(folder)"><img src="@/assets/images/icons/dashboard/folder.svg" alt="">{{folder.name}}</td>
            <td>{{folder.size | bytesToMb}} MB</td>
            <td> {{ folder.modified | timestampToDate }}</td>
            <td>
              <div class="storage-files__item__actions">
                <a href="#"><img src="@/assets/images/icons/dashboard/edit.svg" alt=""></a>
                <a href="#" @click.prevent="deleteRequest(folder.path, 'Folder')"><img src="@/assets/images/icons/dashboard/delete.svg" alt=""></a>
              </div>
            </td>
          </tr>
          <tr class="storage-files__item" v-for="(file, n) in filteredFiles" v-bind:key="`${n}_file`">
            <td><input type="checkbox" name="" id=""></td>
            <td><img src="@/assets/images/icons/dashboard/file.svg" alt="">{{file.name}}</td>
            <td>{{file.size | bytesToMb}} MB</td>
            <td> {{ file.modified | timestampToDate }}</td>
            <td>
              <div class="storage-files__item__actions">
                <a href="#" @click.prevent="download(file.path)"><img src="@/assets/images/icons/dashboard/download.svg" alt=""></a>
                <a href="#"><img src="@/assets/images/icons/dashboard/edit.svg" alt=""></a>
                <a href="#" @click.prevent="deleteRequest(file.path, 'File')"><img src="@/assets/images/icons/dashboard/delete.svg" alt=""></a>
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
import { SimpleResponse } from '@/model/response';
import { DirectoryInfo, FileUploadCommand } from '@/model/file';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import moment from 'moment';

@Component({
  filters: {
    timestampToDate(value: any) {
      return moment(value).format('d MMMM YYYY - HH:mm');
    },
    bytesToMb(value: number) {
      return (value / (1024 * 1024)).toFixed(2);
    },
  },
})
export default class DashboardStorage extends Vue {
  get filteredFolders():any {
    return this.activeFolder.folders.filter((folder) => folder.name.toLowerCase().includes(this.searchString.toLowerCase()));
  }

  get filteredFiles():any {
    return this.activeFolder.files.filter((file) => file.name.toLowerCase().includes(this.searchString.toLowerCase()));
  }

  fileSystemApi: FileSystemApi;

  fileSystem: DirectoryInfo;

  newFolderPath: string;

  activeFolder: DirectoryInfo;

  errors: any;

  newFolder: any;

  newFile: any;

  newFileData: FileUploadCommand;

  uploadPercentage: number;

  uploadSpeed: number;

  uploadTokenSource: any;

  searchString: string;

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
    this.newFile = null;
    this.uploadPercentage = 0;
    this.uploadSpeed = 0;
    this.newFileData = {
      filename: '',
      path: '',
    };
    this.uploadTokenSource = axios.CancelToken.source();
    this.searchString = '';
  }

  mounted():void {
    this.getFileSystem();
  }

  getFileSystem():void {
    this.fileSystemApi.browse().then((response: ServerResponse<DirectoryInfo>) => {
      this.fileSystem = response.result;
      this.activeFolder = this.fileSystem;
    }).catch((error: AxiosError) => {
      if (error.response) {
        this.errors = error.response.data.messages;
        this.$vToastify.error(this.errors.map((e) => e.description).join(', '));
      }
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

  deleteRequest(path: string, type:string):void {
    this.$vToastify.prompt({
      body: 'Are you sure?',
      answers: { YES: true, NO: false },
    }).then((value) => {
      if (value) {
        this.deletePath(path, type);
      }
    });
  }

  deletePath(path: string, type:string):void {
    this.fileSystemApi.deletePath(path).then((response: ServerResponse<DirectoryInfo>) => {
      if (!response.success) {
        this.errors = response.messages;
        this.$vToastify.error(this.errors.map((e) => e.description).join(', '));
      } else {
        this.fileSystem = response.result;
        this.$vToastify.success(`${type} "${path}" deleted!`);
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

  handleFileUpload():void {
    const file = this.$refs.file as HTMLInputElement;
    const files = file.files;
    if (!files || !files[0]) return;
    this.newFile = files[0];
    this.newFileData = {
      path: this.activeFolder.path,
      filename: this.newFile.name
    }
    const timeStart = new Date().getTime();
    const config: AxiosRequestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      cancelToken: this.uploadTokenSource.token,
      onUploadProgress: (progressEvent: any): void => {
        const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
        if (totalLength !== null) {
          this.uploadPercentage = (Math.round((progressEvent.loaded * 100) / totalLength));
        }
        const timePassedSeconds = Math.abs(Math.round (new Date().getTime() - timeStart) / 1000);
        const MBLoaded:number = progressEvent.loaded / 1048576;
        const speedMbps:any = (MBLoaded / timePassedSeconds).toFixed(1);
        this.uploadSpeed = speedMbps;
      },
    };
    this.fileSystemApi.uploadFile(this.newFile, this.newFileData, config).then((response: ServerResponse<DirectoryInfo>) => {
      if (!response.success) {
        this.newFile = null;
        this.errors = response.messages;
        this.$vToastify.error(this.errors.map((e) => e.description).join(', '));
      } else {
        this.newFile = null;
        this.uploadPercentage = 0;
        this.uploadSpeed = 0;
        this.fileSystem = response.result;
        this.$vToastify.success(`File uploaded successfully!`);
        this.goToPath(this.activeFolder.name);
      }
    }).catch((error: AxiosError) => {
      if (axios.isCancel(error)) {
        this.newFile = null;
        this.errors = error.message;
        this.uploadPercentage = 0;
        this.uploadSpeed = 0;
        this.uploadTokenSource = axios.CancelToken.source();
        this.$vToastify.error(this.errors);
        return;
      }
      if (error.response) {
        this.newFile = null;
        this.uploadPercentage = 0;
        this.uploadSpeed = 0;
        this.errors = error.response.data.messages;
        this.$vToastify.error(this.errors.map((e) => e.description).join(', '));
      }
    });
  }

  download(path: string):void {
    this.fileSystemApi.downloadFile(path).then((response: SimpleResponse) => {
    }).catch((error: AxiosError) => {
      if (error.response) {
        this.newFile = null;
        this.errors = error.response.data.messages;
        this.$vToastify.error(this.errors.map((e) => e.description).join(', '));
      }
    });
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/dashboard/_storage.scss";
</style>
