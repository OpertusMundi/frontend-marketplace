<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <div class="dashboard__head__helpers">
        <h1>Storage</h1>
      </div>
    </div>
    <div class="storage">
      <div class="storage__status">
        <div class="storage__status__label">
          <span v-if="quotaTotal">{{ 1 > quotaPercentage ? '&#60;1' : quotaPercentage }}% out of {{ quotaTotalText }} used</span><span v-else>%</span>
          <!-- todo: should not be hardcoded -->
          <router-link to="/vas/drive-3">Upgrade</router-link>
        </div>
        <div class="storage__status__bar"><span :style="`width: ${ quotaPercentage }%`"></span></div>
      </div>
    </div>
    <div class="dashboard__head">
      <div class="dashboard__head__btns">
        <a href="#" class="btn--std btn--blue" @click.prevent="newFolder.show = true;">create folder</a>
        <a href="#" class="btn btn--outlineblue" @click.prevent="$refs.file.click();">Upload</a>
        <a href="#" class="btn btn--outlineblue" v-if="this.pathsOfSelectedFiles.length === 1" @click.prevent="createPrivateOGCService">Create private service</a>
        <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" style="display:none"/>
      </div>
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
            <li v-for="(path, i) in pathFormatted" v-bind:key="path">
              <a href="#" @click.prevent="goToPath('/')" v-if="path === ''">My Files</a>
              <a href="#" @click.prevent="goToPath(pathFormatted.filter((x, j) => j <= i).join('/'))" v-else>{{ path }}</a>
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
            <td><input type="checkbox" name="" id=""></td>
            <td @click="goToFolder(folder)"><img src="@/assets/images/icons/dashboard/folder.svg" alt="">{{folder.name}}</td>
            <td>{{folder.size | bytesToMb}} MB</td>
            <td> {{ folder.modified | timestampToDate }}</td>
            <td>
              <div class="storage-files__item__actions">
                <!-- <a href="#"><img src="@/assets/images/icons/dashboard/edit.svg" alt=""></a> -->
                <a href="#" @click.prevent="deleteRequest(folder.path, 'Folder')"><img src="@/assets/images/icons/dashboard/delete.svg" alt=""></a>
              </div>
            </td>
          </tr>
          <tr class="storage-files__item" v-for="(file, n) in filteredFiles" v-bind:key="`${n}_file`">
            <td><input type="checkbox" name="" id="" v-model="selectedFiles[file.path]"></td>
            <td>
              <template v-if="pathToRename === file.path">
                <input type="text" :value="file.name" @keyup.enter="rename(file.path, $event.target.value)" />
              </template>
              <template v-else>
                <img src="@/assets/images/icons/dashboard/file.svg" alt="">{{file.name}}
              </template>
            </td>
            <td>{{file.size | bytesToMb}} MB</td>
            <td> {{ file.modified | timestampToDate }}</td>
            <td>
              <div class="storage-files__item__actions">
                <a href="#" @click.prevent="download(file.path)"><img src="@/assets/images/icons/dashboard/download.svg" alt=""></a>
                <a href="#" @click.prevent="pathToRename = file.path"><img src="@/assets/images/icons/dashboard/edit.svg" alt=""></a>
                <a href="#" @click.prevent="createPrivateOGCService(file.path, file.name)"><img src="@/assets/images/icons/dashboard/layers.svg" alt=""></a>
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
import { Component, Vue, Watch } from 'vue-property-decorator';
import FileSystemApi from '@/service/file';
import ProfileApi from '@/service/profile';
import { ServerResponse } from '@/model';
import { SimpleResponse } from '@/model/response';
import { DirectoryInfo, FileInfo, FileUploadCommand } from '@/model/file';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import moment from 'moment';
import store from '@/store';

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

  profileApi: ProfileApi;

  fileSystem: DirectoryInfo;

  filesFlattened: FileInfo[];

  newFolderPath: string;

  activeFolder: DirectoryInfo;

  selectedFiles: { [key: string]: boolean } = {};

  errors: any;

  newFolder: any;

  newFile: any;

  pathToRename: string;

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
    this.profileApi = new ProfileApi();

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
    this.pathToRename = '';
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
    this.getQuota();
    this.getFileSystem();
  }

  getQuota(): void {
    this.profileApi.getProfile().then((response) => {
      if (response.success && response.result.profile.quota) {
        this.quotaTotal = response.result.profile.quota.total;
        this.quotaUsed = response.result.profile.quota.used;
      }
    });
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

  @Watch('selectedFiles', { deep: true })
  onSelectedFilesChange(): void {
    console.log('s', this.selectedFiles);
  }

  getFileSystem():void {
    store.commit('setLoading', true);
    this.fileSystemApi.browse().then((response: ServerResponse<DirectoryInfo>) => {
      this.fileSystem = response.result;
      this.activeFolder = this.fileSystem;
    }).catch((error: AxiosError) => {
      if (error.response) {
        this.errors = error.response.data.messages;
        this.$vToastify.error(this.errors.map((e) => e.description).join(', '));
      }
    }).finally(() => {
      store.commit('setLoading', false);
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
        this.goToPath(this.activeFolder.path);
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
        this.goToPath(this.activeFolder.path);
        this.getQuota();
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

  goToPath(path:string):void {
    // let search = name;
    // if (search !== '/') search = search.replace(/\//g, '');
    const result = this.deepSearch(this.fileSystem, 'path', (k, v) => v === path);
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

  rename(path: string, newName: string) {
    store.commit('setLoading', true);

    this.fileSystemApi.renameFile(path, newName).finally(() => {
      store.commit('setLoading', false);

      this.pathToRename = '';
      this.getFileSystem();
    });
  }

  handleFileUpload():void {
    const file = this.$refs.file as HTMLInputElement;
    const files = file.files;
    if (!files || !files[0]) return;
    this.newFile = files[0];
    this.newFileData = {
      path: this.activeFolder.path,
      fileName: this.newFile.name
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
        this.goToPath(this.activeFolder.path);
        this.getQuota();
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

  addFilesToFilesArrayRecursively(directory: DirectoryInfo): void {
    if (directory.files && directory.files.length) this.filesFlattened.push(...directory.files);
    if (directory.folders && directory.folders.length) {
      directory.folders.forEach((x) => {
        this.addFilesToFilesArrayRecursively(x);
      });
    }
  }

  createPrivateOGCService(filePath?: string, fileName?: string): void {
    let fPath = '';
    let fName = '';

    if (filePath && fileName) { // selected from item side-buttons
      fPath = filePath;
      fName = fileName;
    } else { // selected from top-page action buttons
      if (this.pathsOfSelectedFiles.length === 0) {
        alert('select a file');
        return;
      }
      if (this.pathsOfSelectedFiles.length > 1) {
        alert('select only one file');
        return;
      }

      this.addFilesToFilesArrayRecursively(this.fileSystem);

      const [pathOfSelectedFile] = this.pathsOfSelectedFiles;
      const nameOfSelectedFile = this.filesFlattened.find((x) => x.path === pathOfSelectedFile)?.name || '';

      fPath = pathOfSelectedFile;
      fName = nameOfSelectedFile;
    }

    this.$router.push(`/dashboard/create-private-ogc-service/${encodeURIComponent(fPath)}?originName=${fName}`);
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/dashboard/_storage.scss";
</style>
