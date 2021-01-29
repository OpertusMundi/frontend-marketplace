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
        <a href="#" class="btn--std btn--blue">add folder</a>
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
        <h4>My files</h4>
        <table class="storage-files__table">
          <tr>
            <th width="10px"><input type="checkbox" name="" id=""></th>
            <th width="50%">Name</th>
            <th width="15%">File size</th>
            <th>Modified</th>
            <th width="10%"></th>
          </tr>
          <tr class="storage-files__item" v-for="(n,index) in 10" v-bind:key="`${index}_tableline`">
            <td><input type="checkbox" name="" id=""></td>
            <td><img src="@/assets/images/icons/dashboard/folder.svg" alt="">Road network datasets</td>
            <td>32 MB</td>
            <td> 20 • 11 • 2020, 18:40</td>
            <td>
              <div class="storage-files__item__actions">
                <a href="#"><img src="@/assets/images/icons/dashboard/download.svg" alt=""></a>
                <a href="#"><img src="@/assets/images/icons/dashboard/edit.svg" alt=""></a>
                <a href="#"><img src="@/assets/images/icons/dashboard/delete.svg" alt=""></a>
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

@Component
export default class DashboardStorage extends Vue {
}
</script>
<style lang="scss">
  @import "@/assets/styles/dashboard/_storage.scss";
</style>
