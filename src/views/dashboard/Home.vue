<template>
  <div class="dashboard__inner">
    <div class="dashboard__head">
      <h1>Hello, vendor!</h1>
    </div>
    <div class="stats-cards">
      <div class="stats-cards__cont stats-cards__cont--double">
        <div class="stats-card">
          <div class="stats-card__upper">
            <h3 class="stats-card__title">Total earnings</h3>
            <div class="stats-card__filter">
              <div class="ds_select">
                <select name="version">
                  <option value="" default selected>ALL TIME</option>
                  <option value="">LAST 3 MONTHS</option>
                  <option value="">LAST 6 MONTHS</option>
                  <option value="">LAST YEAR</option>
                </select>
              </div>
            </div>
          </div>
          <div class="stats-card__value">€7.487</div>
        </div>
        <div class="stats-card">
          <div class="stats-card__upper">
            <h3 class="stats-card__title">Total assets</h3>
            <div class="stats-card__filter">
              <div class="ds_select">
                <select name="version">
                  <option value="" default selected>ALL TIME</option>
                  <option value="">LAST 3 MONTHS</option>
                  <option value="">LAST 6 MONTHS</option>
                  <option value="">LAST YEAR</option>
                </select>
              </div>
            </div>
          </div>
          <div class="stats-card__value">13</div>
        </div>
      </div>
      <div class="stats-cards__cont">
        <div class="stats-card">
          <div class="stats-card__upper">
            <h3 class="stats-card__title">Sales</h3>
            <a href="#">VIEW ALL <img src="@/assets/images/icons/right_arrow.svg" alt=""></a>
          </div>
          <div class="stats-card__chart">
            <bar-chart></bar-chart>
          </div>
        </div>
      </div>
      <div class="stats-cards__cont">
        <div class="stats-card">
          <div class="stats-card__upper">
            <h3 class="stats-card__title">Trust status</h3>
            <div class="stats-card__filter">
              <div class="ds_select">
                <select name="version">
                  <option value="" default selected>ALL TIME</option>
                  <option value="">LAST 3 MONTHS</option>
                  <option value="">LAST 6 MONTHS</option>
                  <option value="">LAST YEAR</option>
                </select>
              </div>
            </div>
          </div>
          <div class="stats-card__chart">
            <line-chart></line-chart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BarChart from '@/components/Charts/BarChart.vue';
import LineChart from '@/components/Charts/LineChart.vue';

@Component({
  components: {
    BarChart,
    LineChart,
  },
})
export default class DashboardHome extends Vue {
}
</script>
<style lang="scss">
  @import "@/assets/styles/_stats.scss";
  @import "@/assets/styles/_select.scss";
</style>
