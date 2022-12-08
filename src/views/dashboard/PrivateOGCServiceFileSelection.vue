<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <h1>Select from Topio Drive</h1>
      </div>
    </div>

    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <div class="asset_search asset_search--sm asset_search--grey-border">
          <div class="asset_search__upper asset_search__upper--no-functional-search-button">
            <input type="text" name="" id="" v-model="searchString" placeholder="Search in folder" class="asset_search__upper__input">
            <div class="asset_search__upper__icon asset_search__upper__icon--open"><img src="@/assets/images/icons/search_black.svg" alt=""></div>
            <!-- <div class="asset_search__upper__icon asset_search__upper__icon--close"><img src="@/assets/images/icons/close_icon.svg" alt=""></div> -->
          </div>
        </div>
      </div>
    </div>
    <div class="storage">
      <div class="storage-files">
        <nav class="storage-files__nav">
          <ul>
            <li v-for="path in pathFormatted" v-bind:key="path">
              <a href="#" @click.prevent="goToPath('/')" v-if="path === ''" class="mt-xs-30">My Files</a>
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
            <th width="10px"></th>
            <th width="50%">Name</th>
            <th width="15%">Size</th>
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
            <td></td>
            <td @click="goToFolder(folder)"><img src="@/assets/images/icons/dashboard/folder.svg" alt="">{{folder.name}}</td>
            <td>{{folder.size | bytesToMb}} MB</td>
            <td> {{ folder.modified | timestampToDate }}</td>
            <td></td>
          </tr>
          <tr class="storage-files__item" v-for="(file, n) in filteredFiles" v-bind:key="`${n}_file`" @click="selectFile(file.path, file.name)">
            <td></td>
            <td><img src="@/assets/images/icons/dashboard/file.svg" alt="">{{file.name}}</td>
            <td>{{file.size | bytesToMb}} MB</td>
            <td> {{ file.modified | timestampToDate }}</td>
            <td></td>
          </tr>
        </table>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import FileSystemApi from '@/service/file';
import ProfileApi from '@/service/profile';
import { ServerResponse } from '@/model';
import { SimpleResponse } from '@/model/response';
import { DirectoryInfo, FileInfo, FileUploadCommand } from '@/model/file';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import moment from 'moment';

@Component({
  filters: {
    timestampToDate(value: any) {
      return moment(value).format('DD MMMM YYYY - HH:mm');
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

  filesFlattened: FileInfo[];

  newFolderPath: string;

  activeFolder: DirectoryInfo;

  selectedFiles: { [key: string]: boolean } = {};

  errors: any;

  newFolder: any;

  newFile: any;

  newFileData: FileUploadCommand;

  uploadPercentage: number;

  uploadSpeed: number;

  uploadTokenSource: any;

  searchString: string;

  quotaTotal: number | null;

  quotaUsed: number | null;

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
    this.filesFlattened = [];
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
      fileName: '',
      path: '',
    };
    this.uploadTokenSource = axios.CancelToken.source();
    this.searchString = '';

    this.quotaTotal = null;
    this.quotaUsed = null;
  }

  mounted():void {
    this.getFileSystem();
  }

  get pathsOfSelectedFiles(): string[] {
    return Object.entries(this.selectedFiles)
      /* eslint-disable */
      .filter(([path, isSelected]) => isSelected)
      .map(([path, isSelected]) => (path));
      /* eslint-enable */
  }

  get quotaPercentage(): number {
    if (this.quotaUsed === null || !this.quotaTotal) return 0;
    return Math.round((this.quotaUsed / this.quotaTotal) * 100);
  }

  get quotaTotalText(): string {
    if (!this.quotaTotal) return '';

    if (this.quotaTotal < 134217728) {
      const sizeMB = (this.quotaTotal / 1024) / 1024;
      const sizeMBRounded = Math.round(sizeMB * 10) / 10;
      return `${sizeMBRounded}MB`;
    }

    const sizeGB = ((this.quotaTotal / 1024) / 1024) / 1024;
    const sizeGBRounded = Math.round(sizeGB * 10) / 10;
    return `${sizeGBRounded}GB`;
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

  selectFile(path: string, name: string): void {
    console.log(path);
    this.$router.push(`/dashboard/create-private-ogc-service/${encodeURIComponent(path)}?originName=${name}`);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/dashboard/_storage.scss";
</style>
