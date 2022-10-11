<template>
  <div class="file_manager__inner">
    <div class="file_manager__head">
      <div class="file_manager__head__helpers">
        <div class="asset_search asset_search--grey-border">
          <div class="asset_search__upper asset_search__upper--sm asset_search__upper--no-z-index asset_search__upper--no-functional-search-button">
            <input type="text" name="" id="" v-model="searchString" placeholder="Search in folder" class="asset_search__upper__input" />
            <div class="asset_search__upper__icon asset_search__upper__icon--open"><img src="@/assets/images/icons/search_black.svg" alt="" /></div>
            <!-- <div class="asset_search__upper__icon asset_search__upper__icon--close"><img src="@/assets/images/icons/close_icon.svg" alt="" /></div> -->
          </div>
        </div>
      </div>
      <div class="file_manager__head__data">{{ fileSystem.count }} files</div>
    </div>
    <div class="storage">
      <div class="storage-files">
        <nav class="storage-files__nav">
          <ul>
            <li v-for="path in pathFormatted" v-bind:key="path">
              <a href="#" @click.prevent="goToPath('/')" v-if="path === ''">Your files</a>
              <a href="#" @click.prevent="goToPath(path)" v-else>{{ path }}</a>
            </li>
          </ul>
        </nav>
        <table class="storage-files__table">
          <tr>
            <th class="table-th" width="50%">Name</th>
            <th class="table-th--middle" width="20%">Size</th>
            <th class="table-th" width="30%">Modified</th>
          </tr>
          <tr class="storage-files__item" v-for="(folder, n) in filteredFolders" v-bind:key="`${n}_folder`">
            <td @click="goToFolder(folder)"><img src="@/assets/images/icons/dashboard/folder.svg" alt="" />{{ folder.name }}</td>
            <td>{{ folder.size | bytesToMb }} MB</td>
            <td>{{ folder.modified | timestampToDate }}</td>
          </tr>
          <tr @click="(activeFile = `${file.name}-${file.size}`), clickedFile(file)" :class="activeFile == `${file.name}-${file.size}` ? 'selected-file' : ''" class="storage-files__item" v-for="(file, n) in filteredFiles" v-bind:key="`${n}_file`">
            <td><img src="@/assets/images/icons/dashboard/file.svg" alt="" />{{ file.name }}</td>
            <td>{{ file.size | bytesToMb }} MB</td>
            <td>{{ file.modified | timestampToDate }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import FileSystemApi from '@/service/file';
import { ServerResponse } from '@/model';
import { DirectoryInfo } from '@/model/file';
import { DraftApiFromFileCommand } from '@/model/catalogue';
import { AxiosError } from 'axios';
import moment from 'moment';

@Component({
  filters: {
    timestampToDate(value: any) {
      return moment(value).format('DD MM YYYY, HH:mm');
    },
    bytesToMb(value: number) {
      return (value / (1024 * 1024)).toFixed(2);
    },
  },
})
export default class DashboardStorage extends Vue {
  @Prop({ required: false }) private fileApi!: DraftApiFromFileCommand;

  get filteredFolders(): any {
    return this.activeFolder.folders.filter((folder) => folder.name.toLowerCase().includes(this.searchString.toLowerCase()));
  }

  get filteredFiles(): any {
    return this.activeFolder.files.filter((file) => file.name.toLowerCase().includes(this.searchString.toLowerCase()));
  }

  fileSystemApi: FileSystemApi;

  fileSystem: DirectoryInfo;

  activeFolder: DirectoryInfo;

  errors: any;

  activeFile: boolean;

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
    this.errors = [];
    this.searchString = '';
    this.activeFile = false;
  }

  mounted(): void {
    this.getFileSystem();
  }

  clickedFile(file: any | null): void {
    this.$emit('update:fileApi', file);
    console.log(file);
  }

  getFileSystem(): void {
    this.fileSystemApi
      .browse()
      .then((response: ServerResponse<DirectoryInfo>) => {
        this.fileSystem = response.result;
        this.activeFolder = this.fileSystem;
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          this.errors = error.response.data.messages;
          this.$vToastify.error(this.errors.map((e) => e.description).join(', '));
        }
      });
  }

  goToFolder(folder: DirectoryInfo): void {
    this.activeFolder = folder;
  }

  goToPath(name: string): void {
    let search = name;
    if (search !== '/') search = search.replace(/\//g, '');
    const result = this.deepSearch(this.fileSystem, 'name', (k, v) => v === search);
    if (result) {
      this.activeFolder = result;
    }
  }

  get pathFormatted(): any {
    if (this.activeFolder.path === '/') return [''];
    return this.activeFolder.path.split('/');
  }
  /* eslint-disable */
  deepSearch(object: any, key: string, predicate: any): any {
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
@import '@/assets/styles/dashboard/_storage.scss';
@import '@/assets/styles/dashboard/_file-topio-drive.scss';
</style>
