<template>
  <div class="page create-private-ogc">
    <div class="page__inner pb-sm-100">
      <div class="m_container">
        <h1>Create private service</h1>
        <div class="dashboard__form">
          <ul class="dashboard__form__nav">
            <li v-if="isPrivateOGCServiceCreated"><a class="completed" href="#">Well done!</a></li>
            <template v-else>
              <li v-for="(step, i) in steps" :key="step">
                <a href="#" :class="[currentStep === i + 1 ? 'active' : '', currentStep < i + 1 ? 'inactive' : '']" @click="goToStep(i + 1)">{{ step }}</a>
              </li>
            </template>
          </ul>
          <div class="dashboard__form__steps">
            <div class="dashboard__form__steps__inner" v-if="privateOGCService.path">
              <template v-if="isPrivateOGCServiceCreated">
                <div class="dashboard__form__step is-created">
                  <div class="dashboard__form__step__title">
                    <h2>Your service has been created</h2>
                    <p>Visit your topio OGC page to start using it</p>
                  </div>
                  <router-link to="/dashboard/private-ogc-services" class="btn btn--std btn--blue">go to topio OGC</router-link>
                </div>
              </template>
              <template v-else>
                <!-- STEP 1 -->
                <validation-observer ref="step1">
                  <div class="dashboard__form__step step1" v-if="currentStep == 1">
                    <div class="dashboard__form__step__title">
                      <h3>Select service type</h3>
                      <p>Select what type of private service you want to create</p>

                      <div class="service-options">
                        <div class="service-options__card" :class="{'service-options__card--active': privateOGCService.serviceType === 'WMS'}" @click="selectServiceType('WMS')">
                          <h2>WMS</h2>
                          <p>Create a Web Map Service</p>
                        </div>
                        <div class="service-options__card" :class="{'service-options__card--active': privateOGCService.serviceType === 'WFS'}" @click="selectServiceType('WFS')">
                          <h2>WFS</h2>
                          <p>Create a Web Feature Service</p>
                        </div>
                      </div>
                      <validation-provider v-slot="{ errors }" rules="required">
                        <div class="form-group">
                          <input hidden type="text" v-model="privateOGCService.serviceType">
                          <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">Select a service type</span></div>
                        </div>
                      </validation-provider>
                    </div>
                  </div>
                </validation-observer>

                <!-- STEP 2 -->
                <validation-observer ref="step2">
                  <div class="dashboard__form__step step2" v-if="currentStep == 2">
                    <div class="dashboard__form__step__title">
                      <h3>Metadata</h3>
                      <p>Fill in your service metadata</p>
                    </div>

                    <validation-provider v-slot="{ errors }" name="Title" rules="required">
                      <div class="form-group">
                        <label for="metadata_title">Title *</label>
                        <input type="text" class="form-group__text" name="metadata_title" id="metadata_title" placeholder="Title" v-model="privateOGCService.title">
                        <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                      </div>
                    </validation-provider>
                    <validation-provider v-slot="{ errors }" name="Version" rules="required">
                      <div class="form-group">
                        <label for="metadata_version">Version *</label>
                        <input type="text" class="form-group__text" id="" name="metadata_version" placeholder="Version" v-model="privateOGCService.version">
                        <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                      </div>
                    </validation-provider>
                    <validation-provider v-slot="{ errors }" name="Format" rules="required">
                      <div class="form-group">
                        <label for="multiselect_type">Format *</label>
                        <multiselect id="multiselect_format" v-model="privateOGCService.format" :options="availableFormats" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Select format"></multiselect>
                        <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span> </div>
                      </div>
                    </validation-provider>
                    <validation-provider v-slot="{ errors }" name="Abstract" rules="required">
                      <div class="form-group">
                        <label for="metadata_abstract">Abstract *</label>
                        <textarea v-model="privateOGCService.abstract" name="metadata_abstract" placeholder="Short description"></textarea>
                        <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                      </div>
                    </validation-provider>
                    <div class="form-group">
                      <label for="metadata_crs">Reference system *</label>
                      <multiselect id="metadata_crs" @input="onEpsgSelection($event)" v-model="selectedEpsg" :options="epsgList" label="name" track-by="code" :loading="isLoadingEpsg" :searchable="true" @search-change="asyncFindEpsg" :close-on-select="true" :show-labels="false" placeholder="Search reference system"></multiselect>
                      <validation-provider v-slot="{ errors }" name="CRS" rules="required">
                        <input hidden type="text" v-model="privateOGCService.crs">
                        <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">{{ error }}</span></div>
                      </validation-provider>
                    </div>
                    <div class="form-group">
                      <label for="metadata_encoding">Encoding</label>
                      <multiselect :options="popularEncodings" :taggable="true" :multiple="false" v-model="privateOGCService.encoding" @tag="privateOGCService = { ...privateOGCService, encoding: $event }" tag-placeholder="Custom encoding"></multiselect>
                    </div>
                  </div>
                </validation-observer>

                <!-- STEP 3 -->
                <validation-observer ref="step3">
                  <div class="dashboard__form__step step3" v-if="currentStep == 3">
                    <div class="row">
                      <div class="col-md-4">
                        <div class="dashboard__form__step__title">
                          <h3>Payment amount</h3>
                          <p>The cost of using topio OGC is fixed</p>
                          <div class="cost">
                            <span>{{ $store.getters.getConfig.configuration.asset.privateServicePricingModel.price }}</span>
                            <span>€/ {{ $store.getters.getConfig.configuration.asset.privateServicePricingModel.type.replaceAll('_', ' ').toLowerCase() }}</span>
                          </div>
                          <p>Billed every 1st working day of the month</p>
                        </div>
                      </div>
                      <div class="col-md-4">
                        <!-- <h3>Select payment method</h3> -->
                      </div>
                      <div class="col-md-4"></div>
                    </div>
                  </div>
                </validation-observer>

                <!-- STEP 4 -->
                <validation-observer ref="step4">
                  <div class="dashboard__form__step step4" v-if="currentStep == 4">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="dashboard__form__step__title">
                          <h3>Service details</h3>
                          <hr>
                          <div class="service-details__table">
                            <span>From asset:</span><span>{{ $route.query.originName }}</span>
                            <span>Type of service:</span><span>{{ privateOGCService.serviceType }}</span>
                          </div>
                        </div>
                        <div class="dashboard__form__step__title">
                          <h3>Metadata</h3>
                          <hr>
                          <div class="service-details__table">
                            <span>Title:</span><span>{{ privateOGCService.title }}</span>
                            <span>Abstract:</span><span>{{ privateOGCService.abstract }}</span>
                            <span>Version:</span><span>{{ privateOGCService.version }}</span>
                            <span>Format:</span><span>{{ privateOGCService.format }}</span>
                            <span>CRS:</span><span>{{ selectedEpsg.name }}</span>
                            <span v-if="privateOGCService.encoding">Encoding:</span><span>{{ privateOGCService.encoding }}</span>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="dashboard__form__step__title">
                          <h3>Payment information</h3>
                          <hr>
                          <div class="service-details__table">
                            <span>Amount:</span><span>{{ $store.getters.getConfig.configuration.asset.privateServicePricingModel.price }} € / {{ $store.getters.getConfig.configuration.asset.privateServicePricingModel.type.replaceAll('_', ' ').toLowerCase() }}</span>
                            <!-- <span>Method:</span><span></span> -->
                          </div>
                        </div>
                        <div class="dashboard__form__step__title">
                          <h3>Terms & Conditions</h3>
                          <hr>
                          <p>Check the box in order to proceed</p>
                          <div class="form-group">
                            <validation-provider v-slot="{ errors }" rules="isBooleanTrue">
                              <div class="form-group-checkbox">
                                <input type="checkbox" id="terms" v-model="isTermsAndConditionsAccepted">
                                <label for="terms">I 've read and accept the
                                  <strong><a href="/terms" target="_blank">Terms & Conditions</a></strong>
                                </label>
                                <div class="errors" v-if="errors"><span v-for="error in errors" v-bind:key="error">Check the box to proceed</span></div>
                              </div>
                            </validation-provider>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </validation-observer>
              </template>
            </div>
          </div>
          <div class="dashboard__form__navbuttons" v-if="!isPrivateOGCServiceCreated">
            <button class="btn--std btn--blue" @click.prevent="goToPreviousStep()" v-if="currentStep > 1">PREVIOUS</button>
            <button class="btn--std btn--blue" @click.prevent="goToNextStep()">{{ currentStep === steps.length ? 'confirm and pay' : 'next' }}</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import {
  ValidationProvider,
  ValidationObserver,
  extend as extendValidationRules,
} from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import Multiselect from 'vue-multiselect';
import PrivateOGCServicesApi from '@/service/private-ogc-services';
import SpatialApi from '@/service/spatial';
import { EnumServiceType, PrivateOGCServiceCommand } from '@/model/private-ogc-services';
import store from '@/store';
import { Configuration } from '@/model';

const booleanValidator = {
  validate(value) {
    return !!value;
  },
};

extendValidationRules('required', required);
extendValidationRules('isBooleanTrue', booleanValidator);

@Component({
  components: {
    ValidationProvider,
    ValidationObserver,
    Multiselect,
  },
})
export default class CreatePrivateOGCService extends Vue {
  privateOGCServicesApi = new PrivateOGCServicesApi();

  spatialApi = new SpatialApi();

  steps = [
    'Type of service',
    'Metadata',
    'Payment amount',
    'Review and confirm',
  ];

  currentStep = 1;

  availableFormats: string[] = [];

  privateOGCService: PrivateOGCServiceCommand = {
    abstract: '',
    crs: '',
    encoding: '',
    format: '',
    path: '',
    serviceType: '' as EnumServiceType,
    title: '',
    version: '',
  };

  epsgList: { code: string, name: string }[] = [];

  isLoadingEpsg = false;

  selectedEpsg = { name: '', code: '' };

  popularEncodings = ['UTF-8', 'Windows-1251', 'Windows-1252', 'Windows-1253', 'ISO 8859-1', 'ISO 8859-2', 'ISO 8859-3', 'ISO 8859-4', 'ISO 8859-5', 'ISO 8859-7'];

  isTermsAndConditionsAccepted = false;

  isPrivateOGCServiceCreated = false;

  // hook that runs immediately and ensures that config is fetched
  @Watch('$store.getters.getConfig', { immediate: true })
  onConfigChange(config: null | { configuration: Configuration }): void {
    if (!config) {
      store.commit('setLoading', true);
      return;
    }
    store.commit('setLoading', false);

    const fileStoragePath = decodeURIComponent(this.$route.params.fileStoragePath);
    const { originName } = this.$route.query;

    if (!fileStoragePath || !originName || typeof originName !== 'string') {
      this.$router.push('/error/401');
      return;
    }

    this.availableFormats = config.configuration.asset.fileTypes.map((x) => x.format);

    this.privateOGCService = {
      ...this.privateOGCService,
      title: originName,
      path: fileStoragePath,
    };
  }

  async goToNextStep(): Promise<void> {
    const isFormValid = await (this.$refs[`step${this.currentStep}`] as InstanceType<typeof ValidationObserver>).validate();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    if (!isFormValid) return;

    if (this.currentStep === this.steps.length) {
      this.submit();
      return;
    }

    this.currentStep += 1;
  }

  goToPreviousStep(): void {
    if (this.currentStep <= 1) return;
    this.currentStep -= 1;
  }

  submit(): void {
    store.commit('setLoading', true);
    this.privateOGCServicesApi.create(this.privateOGCService).then((response) => {
      if (response.success) {
        this.isPrivateOGCServiceCreated = true;
        store.commit('setLoading', false);
      }
    });
  }

  selectServiceType(serviceType: EnumServiceType): void {
    const { originName } = this.$route.query;
    if (typeof originName !== 'string') {
      this.$router.push('/error/401');
      return;
    }

    this.privateOGCService = {
      ...this.privateOGCService,
      title: this.serviceTitleSuggestion(originName, serviceType),
      serviceType,
    };
  }

  asyncFindEpsg(q: string): void {
    if (!q) return;
    console.log(q);
    this.isLoadingEpsg = true;
    const typeOfSearch = Number.isNaN(Number(q)) ? 'name' : 'number';
    console.log(typeOfSearch);
    const epsgPromise = Number.isNaN(Number(q)) ? this.spatialApi.getEpsgCodes(undefined, q) : this.spatialApi.getEpsgCodes(q, undefined);
    epsgPromise.then((epsgResponse) => {
      this.epsgList = epsgResponse.result.map((x) => ({ code: `${x.code}`, name: `EPSG:${x.code} | ${x.name}` }));
      this.isLoadingEpsg = false;
    });
  }

  onEpsgSelection(selectedEpsg: { code: string, name: string }): void {
    if (selectedEpsg && selectedEpsg.code) Vue.set(this.privateOGCService, 'crs', selectedEpsg.code);
  }

  serviceTitleSuggestion(originName: string, serviceType: EnumServiceType): string {
    let name = originName;
    if (originName.includes('.')) name = originName.split('.').reduce((p, c, i) => (i === originName.split('.').length - 1 ? p : `${p}${c}`), '');
    name = `${name} (${serviceType})`;
    return name;
  }
}
</script>
<style lang="scss">
@import "@/assets/styles/_page.scss";
@import "@/assets/styles/_forms.scss";
@import "@/assets/styles/_create-private-ogc.scss";
@import "~flexboxgrid/css/flexboxgrid.min.css";
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
