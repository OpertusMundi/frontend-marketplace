<template>
  <date-picker v-model="date" @change="dateValueChange(date)" range placeholder="Time period" input-class="input__date_picker" ref="datapicker">
    <i slot="icon-calendar"></i>
    <template v-slot:header="{ emit }">
      <div class="nav_date">
        <button class="nav_date__button" @click="today(emit)">
          <span class="nav_date__button__text">Today</span>
        </button>
        <button class="nav_date__button" @click="lastWeek(emit)">
          <span class="nav_date__button__text">Last Week</span>
        </button>
        <button class="nav_date__button" @click="lastMonth(emit)">
          <span class="nav_date__button__text">Last Month</span>
        </button>
        <button class="nav_date__button" @click="lastThreeMonths(emit)">
          <span class="nav_date__button__text">Last 3 Months</span>
        </button>
        <button class="nav_date__button" @click="lastSixMonths(emit)">
          <span class="nav_date__button__text">Last 6 Months</span>
        </button>
        <button class="nav_date__button" @click="lastYear(emit)">
          <span class="nav_date__button__text">Last Year</span>
        </button>
      </div>
    </template>
  </date-picker>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import moment from 'moment';

@Component({
  components: {
    DatePicker,
  },
})
export default class DataRangePicker extends Vue {
  @Prop({ default: null }) private dataRangeMin!: string;

  @Prop({ default: null }) private dataRangeMax!: string;

  momentFormat: any;

  date: any;

  dataMin: string;

  dataMax: string;

  constructor() {
    super();

    this.date = null;

    this.dataMin = this.dataRangeMin;

    this.dataMax = this.dataRangeMax;

    this.momentFormat = {
      stringify: (date) => (date ? moment(date).format('LL') : ''),
      parse: (value) => (value ? moment(value, 'LL').toDate() : null),
    };
  }

  mounted(): void {
    this.initDatePicker();
  }

  initDatePicker() {
    const start = moment().subtract(7, 'd');
    const end = moment().subtract(1, 'd');
    const date = [start.toDate(), end.toDate()];
    this.dataMin = start.format('YYYY-MM-DD');
    this.dataMax = end.format('YYYY-MM-DD');
    this.date = date;
    this.$emit('update:dataRangeMin', this.dataMin);
    this.$emit('update:dataRangeMax', this.dataMax);
  }

  dateValueChange(value: string | any[]): void {
    if (value[0] != null && value[1] != null) {
      this.dataMin = moment(value[0]).format('YYYY-MM-DD');
      this.dataMax = moment(value[1]).format('YYYY-MM-DD');
      this.$emit('update:dataRangeMin', this.dataMin);
      this.$emit('update:dataRangeMax', this.dataMax);
      if (value.length > 0) {
        this.$emit('triggerchange');
      }
    } else {
      this.dataMin = '';
      this.dataMax = '';
      this.$emit('update:dataRangeMin', this.dataMin);
      this.$emit('update:dataRangeMax', this.dataMax);
      this.$emit('triggerchange');
    }
  }

  today(emit: (arg0: Date[]) => void): void {
    const start = moment().toDate();
    const end = moment().toDate();
    const date = [start, end];
    emit(date);
    this.dataMin = moment().format('YYYY-MM-DD');
    this.dataMax = moment().format('YYYY-MM-DD');
  }

  lastWeek(emit: (arg0: Date[]) => void): void {
    const start = moment()
      .subtract(1, 'weeks')
      .startOf('week');
    const end = moment()
      .subtract(1, 'weeks')
      .endOf('week');
    const date = [start.toDate(), end.toDate()];
    this.dataMin = start.format('YYYY-MM-DD');
    this.dataMax = end.format('YYYY-MM-DD');
    emit(date);
  }

  lastMonth(emit: (arg0: Date[]) => void): void {
    const start = moment()
      .subtract(1, 'months')
      .startOf('month');
    const end = moment()
      .subtract(1, 'months')
      .endOf('month');
    const date = [start.toDate(), end.toDate()];
    this.dataMin = start.format('YYYY-MM-DD');
    this.dataMax = end.format('YYYY-MM-DD');
    emit(date);
  }

  lastThreeMonths(emit: (arg0: Date[]) => void): void {
    const start = moment()
      .subtract(3, 'months')
      .startOf('month');
    const end = moment()
      .subtract(1, 'months')
      .endOf('month');
    const date = [start.toDate(), end.toDate()];
    this.dataMin = start.format('YYYY-MM-DD');
    this.dataMax = end.format('YYYY-MM-DD');
    emit(date);
  }

  lastSixMonths(emit: (arg0: Date[]) => void): void {
    const start = moment()
      .subtract(6, 'months')
      .startOf('month');
    const end = moment()
      .subtract(1, 'months')
      .endOf('month');
    const date = [start.toDate(), end.toDate()];
    this.dataMin = start.format('YYYY-MM-DD');
    this.dataMax = end.format('YYYY-MM-DD');
    emit(date);
  }

  lastYear(emit: (arg0: Date[]) => void): void {
    const start = moment()
      .subtract(12, 'months')
      .startOf('month');
    const end = moment()
      .subtract(1, 'months')
      .endOf('month');
    const date = [start.toDate(), end.toDate()];
    this.dataMin = start.format('YYYY-MM-DD');
    this.dataMax = end.format('YYYY-MM-DD');
    emit(date);
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/graphs/_date-picker.scss';
</style>
