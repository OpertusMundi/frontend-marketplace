<template>
  <validation-observer ref="refObserver">
    <div class="dashboard__form__step dashboard__form__step--review dashboard__form__step--full-width">
      <div class="dashboard__form__review">
        <!-- <div class="dashboard__form__review__inner"> -->
        <div class="row">
          <div class="col-md-4">
            <div class="dashboard__form__review__item">
              <div class="dashboard__form__review__item__head">
                <h5>Asset type</h5>
                <a href="#" @click.prevent="goToStep(1)">EDIT</a>
              </div>
              <div class="dashboard__form__review__item__body">
                <ul>
                  <li>
                    <strong>{{ asset.spatialDataServiceType ? 'Published Asset type:' : 'Type:' }}</strong
                    >{{ asset.type === 'BUNDLE' ? 'COLLECTION' : asset.type }}
                  </li>
                  <li v-if="asset.spatialDataServiceType"><strong>Service type:</strong>{{ asset.spatialDataServiceType }}</li>
                </ul>
              </div>
            </div>

            <div class="dashboard__form__review__item" v-if="asset.type === 'BUNDLE'">
              <div class="dashboard__form__review__item__head">
                <h5>Selected Assets</h5>
                <a href="#" @click.prevent="goToStep(2)">EDIT</a>
              </div>
              <div class="dashboard__form__review__item__body">
                <a target="_blank" :href="`/catalogue/${asset.id}`" v-for="asset in bundleAssets" :key="asset.id">
                  <asset-api-details-card :selected="false" :isMini="true" :asset="asset"></asset-api-details-card>
                </a>
              </div>
            </div>

            <div class="dashboard__form__review__item" v-if="asset.type === 'BUNDLE'">
              <div class="dashboard__form__review__item__head">
                <h5>Collection Details</h5>
                <a href="#" @click.prevent="goToStep(2)">EDIT</a>
              </div>
              <div class="dashboard__form__review__item__body">
                <ul>
                  <li v-if="asset.title"><strong>Asset title:</strong>{{ asset.title }}</li>
                  <li v-if="asset.version"><strong>Version:</strong>{{ asset.version }}</li>
                  <li v-if="asset.abstract"><strong>Version:</strong>{{ asset.abstract }}</li>
                </ul>
              </div>
            </div>

            <div class="dashboard__form__review__item" v-if="asset.type !== 'BUNDLE'">
              <div class="dashboard__form__review__item__head">
                <h5>Metadata</h5>
                <a href="#" @click.prevent="goToStep(2)">EDIT</a>
              </div>
              <div class="dashboard__form__review__item__body">
                <ul>
                  <li v-if="asset.title"><strong>Asset title:</strong>{{ asset.title }}</li>
                  <li v-if="asset.version"><strong>Version:</strong>{{ asset.version }}</li>
                  <li v-if="asset.spatialDataServiceType || asset.format"><strong>Format:</strong>{{ asset.spatialDataServiceType || asset.format }}</li>
                  <li v-if="asset.abstract || asset.abstractText"><strong>Asset short description:</strong>{{ asset.abstract || asset.abstractText }}</li>
                  <li v-if="asset.language"><strong>Language:</strong>{{ $store.getters.getConfig.configuration.europeLanguages.find((x) => x.code === asset.language).name || '' }}</li>
                  <!-- <li v-if="asset.keywords && asset.keywords.length"><strong>Keywords:</strong>{{ asset.keywords.map(x => x.keyword).join(', ') }}</li> -->
                  <li class="d-flex" v-if="asset.keywords && asset.keywords.length"><strong>Keywords:</strong><div class="d-flex flex-column"><span v-for="(keyword, i) in asset.keywords.map(x => x.keyword)" :key="i">{{ keyword }}</span></div></li>
                  <li class="d-flex" v-if="asset.topicCategory && asset.topicCategory.length"><strong>Topic:</strong><div class="d-flex flex-column"><span v-for="(topic, i) in asset.topicCategory" :key="i">{{ topic }}</span></div></li>
                  <li class="d-flex" v-if="asset.suitableFor && asset.suitableFor.length"><strong>Suitable for:</strong><div class="d-flex flex-column"><span v-for="(suitable, i) in asset.suitableFor" :key="i">{{ suitable }}</span></div></li>
                  <li v-if="asset.referenceSystem"><strong>Reference system:</strong>{{ referenceSystemTitle }}</li>
                  <li class="d-flex" v-if="asset.scales && asset.scales.length"><strong>Scales:</strong><div class="d-flex flex-column"><span v-for="(scale, i) in asset.scales.map(x => x.description)" :key="i">{{ scale }}</span></div></li>
                  <li v-if="asset.dateStart"><strong>Date start:</strong>{{ asset.dateStart }}</li>
                  <li v-if="asset.dateEnd"><strong>Date end:</strong>{{ asset.dateEnd }}</li>
                  <li v-if="asset.creationDate"><strong>Creation date:</strong>{{ asset.creationDate }}</li>
                  <li v-if="asset.publicationDate"><strong>Publication date:</strong>{{ asset.publicationDate }}</li>
                  <li v-if="asset.revisionDate"><strong>Revision date:</strong>{{ asset.revisionDate }}</li>
                  <li class="d-flex" v-for="(responsibleParty, i) in asset.responsibleParty" :key="i">
                    <!-- <strong>Responsible party ({{ responsibleParty.role }})</strong>{{ `${responsibleParty.name}, ${responsibleParty.organizationName}${ responsibleParty.email ? ', ' + responsibleParty.email : '' }${ responsibleParty.address ? ', ' + responsibleParty.address : '' }${ responsibleParty.phone ? ', ' + responsibleParty.phone : '' }${responsibleParty.serviceHours ? ', ' + responsibleParty.serviceHours : ''}` }} -->
                    <strong>Responsible party ({{ responsibleParty.role }})</strong>
                    <div class="d-flex flex-column">
                      <span v-if="responsibleParty.name">{{ responsibleParty.name }}</span>
                      <span v-if="responsibleParty.organizationName">{{ responsibleParty.organizationName }}</span>
                      <span v-if="responsibleParty.email">{{ responsibleParty.email }}</span>
                      <span v-if="responsibleParty.address">{{ responsibleParty.address }}</span>
                      <span v-if="responsibleParty.phone">{{ responsibleParty.phone }}</span>
                      <span v-if="responsibleParty.serviceHours">{{ responsibleParty.serviceHours }}</span>
                    </div>
                  </li>
                  <li v-if="asset.metadataLanguage"><strong>Metadata language:</strong>{{ $store.getters.getConfig.configuration.europeLanguages.find((x) => x.code === asset.metadataLanguage).name || '' }}</li>
                  <li v-if="asset.metadataDate"><strong>Metadata date:</strong>{{ asset.metadataDate }}</li>

                  <!-- <li v-if="asset.publisherName"><strong>Editor:</strong>{{ asset.publisherName }}</li>
                  <li v-if="asset.publisherEmail"><strong>Editor’s email:</strong>{{ asset.publisherEmail }}</li>
                  <li v-if="asset.metadataPointOfContactName"><strong>Maintenance manager:</strong>{{ asset.metadataPointOfContactName }}</li>
                  <li v-if="asset.metadataPointOfContactEmail"><strong>Maintenance manager’s email:</strong>{{ asset.metadataPointOfContactEmail }}</li>
                  <li v-if="asset.metadataLanguage"><strong>Metadata language:</strong>{{ $store.getters.getConfig.configuration.europeLanguages.find((x) => x.code === asset.metadataLanguage).name || '' }}</li>
                  <li v-if="asset.metadataDate"><strong>Metadata date:</strong>{{ asset.metadataDate }}</li>
                  <li v-if="asset.scale"><strong>Scale:</strong>{{ asset.scale }}</li> -->
                </ul>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="dashboard__form__review__item" v-if="!asset.openDataset">
              <div class="dashboard__form__review__item__head">
                <h5>Contract</h5>
                <a href="#" @click.prevent="goToStep(3)">EDIT</a>
              </div>
              <div class="dashboard__form__review__item__body">
                <ul>
                  <li><strong>Template:</strong>{{ contractTitle }}</li>
                </ul>
              </div>
            </div>

            <div class="dashboard__form__review__item" v-if="asset.openDataset">
              <div class="dashboard__form__review__item__head">
                <h5>License</h5>
                <a href="#" @click.prevent="goToStep(3)">EDIT</a>
              </div>
              <div class="dashboard__form__review__item__body">
                <ul>
                  <!-- <li><strong>Type:</strong>{{ asset.license }}</li> -->
                  <li class="d-flex">
                    <strong class="small-width">Type:</strong>
                    <template v-if="asset.license === 'CC BY'">
                      <div>Attribution<br>(CC BY)<br>
                        <svg class="mr-xs-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 36"><path data-name="Path 14352" d="M18 0a17.311 17.311 0 0 1 12.75 5.25A17.311 17.311 0 0 1 36 18a16.621 16.621 0 0 1-5.1 12.6A17.933 17.933 0 0 1 18 36a17.463 17.463 0 0 1-12.6-5.25A17.355 17.355 0 0 1 0 18 17.925 17.925 0 0 1 18 0m0 3.3A14.167 14.167 0 0 0 7.65 7.65a14.161 14.161 0 0 0-4.35 10.5A14.167 14.167 0 0 0 7.65 28.5 14.415 14.415 0 0 0 18 32.85a14.756 14.756 0 0 0 10.5-4.35 13.572 13.572 0 0 0 4.2-10.35 14.756 14.756 0 0 0-4.35-10.5A13.392 13.392 0 0 0 18 3.3m4.8 10.2v7.35h-2.1v8.7h-5.55v-8.7H13.2V13.5a1.146 1.146 0 0 1 .3-.75c.3-.15.45-.3.75-.3h7.35a1.146 1.146 0 0 1 .75.3c.45.15.45.45.45.75m-7.35-4.65a2.55 2.55 0 1 1 5.1 0A2.3 2.3 0 0 1 18 11.4a2.234 2.234 0 0 1-2.55-2.55" fill="#6c6c6c"/></svg>
                      </div>
                    </template>
                    <template v-if="asset.license === 'CC BY-SA'">
                      <div>
                        Attribution - ShareAlike<br>(CC BY-SA)<br>
                        <svg class="mr-xs-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 36"><path data-name="Path 14352" d="M18 0a17.311 17.311 0 0 1 12.75 5.25A17.311 17.311 0 0 1 36 18a16.621 16.621 0 0 1-5.1 12.6A17.933 17.933 0 0 1 18 36a17.463 17.463 0 0 1-12.6-5.25A17.355 17.355 0 0 1 0 18 17.925 17.925 0 0 1 18 0m0 3.3A14.167 14.167 0 0 0 7.65 7.65a14.161 14.161 0 0 0-4.35 10.5A14.167 14.167 0 0 0 7.65 28.5 14.415 14.415 0 0 0 18 32.85a14.756 14.756 0 0 0 10.5-4.35 13.572 13.572 0 0 0 4.2-10.35 14.756 14.756 0 0 0-4.35-10.5A13.392 13.392 0 0 0 18 3.3m4.8 10.2v7.35h-2.1v8.7h-5.55v-8.7H13.2V13.5a1.146 1.146 0 0 1 .3-.75c.3-.15.45-.3.75-.3h7.35a1.146 1.146 0 0 1 .75.3c.45.15.45.45.45.75m-7.35-4.65a2.55 2.55 0 1 1 5.1 0A2.3 2.3 0 0 1 18 11.4a2.234 2.234 0 0 1-2.55-2.55" fill="#6c6c6c"/></svg>
                        <svg class="mr-xs-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 36"><path data-name="Path 14345" d="M18 8.55a7.967 7.967 0 0 0-5.25 1.8 7.429 7.429 0 0 0-2.7 5.1H8.7l3.6 3.6 3.6-3.6h-1.35Q15 12.3 18.6 12.3a3.331 3.331 0 0 1 3 1.5 7.183 7.183 0 0 1 1.05 4.35 7.478 7.478 0 0 1-1.2 4.35 3.648 3.648 0 0 1-3 1.65c-2.55 0-3.75-1.05-3.9-3.3h-4.5a7.782 7.782 0 0 0 2.7 5.25A7.967 7.967 0 0 0 18 27.9a9.158 9.158 0 0 0 6.75-2.7 10.041 10.041 0 0 0 2.55-6.9 10.157 10.157 0 0 0-2.55-7.05A8.7 8.7 0 0 0 18 8.55" fill="#6c6c6c"/><path data-name="Path 14346" d="M30.75 5.25A17.311 17.311 0 0 0 18 0 17.925 17.925 0 0 0 0 18a18.183 18.183 0 0 0 18 18 17.933 17.933 0 0 0 12.9-5.4A16.621 16.621 0 0 0 36 18a17.311 17.311 0 0 0-5.25-12.75m-2.25 23.1A14.756 14.756 0 0 1 18 32.7a14.415 14.415 0 0 1-10.35-4.35A14.7 14.7 0 0 1 18 3.3a13.611 13.611 0 0 1 10.35 4.35A13.926 13.926 0 0 1 32.7 18a13.572 13.572 0 0 1-4.2 10.35" fill="#6c6c6c"/></svg>
                      </div>
                    </template>
                    <template v-if="asset.license === 'CC BY-ND'">
                      <div>
                        Attribution - NoDerivs<br>(CC BY-ND)<br>
                        <svg class="mr-xs-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 36"><path data-name="Path 14352" d="M18 0a17.311 17.311 0 0 1 12.75 5.25A17.311 17.311 0 0 1 36 18a16.621 16.621 0 0 1-5.1 12.6A17.933 17.933 0 0 1 18 36a17.463 17.463 0 0 1-12.6-5.25A17.355 17.355 0 0 1 0 18 17.925 17.925 0 0 1 18 0m0 3.3A14.167 14.167 0 0 0 7.65 7.65a14.161 14.161 0 0 0-4.35 10.5A14.167 14.167 0 0 0 7.65 28.5 14.415 14.415 0 0 0 18 32.85a14.756 14.756 0 0 0 10.5-4.35 13.572 13.572 0 0 0 4.2-10.35 14.756 14.756 0 0 0-4.35-10.5A13.392 13.392 0 0 0 18 3.3m4.8 10.2v7.35h-2.1v8.7h-5.55v-8.7H13.2V13.5a1.146 1.146 0 0 1 .3-.75c.3-.15.45-.3.75-.3h7.35a1.146 1.146 0 0 1 .75.3c.45.15.45.45.45.75m-7.35-4.65a2.55 2.55 0 1 1 5.1 0A2.3 2.3 0 0 1 18 11.4a2.234 2.234 0 0 1-2.55-2.55" fill="#6c6c6c"/></svg>
                        <svg class="mr-xs-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 36"><path data-name="Rectangle 5652" fill="#6c6c6c" d="M11.7 13.8h13.05v3.15H11.7z"/><path data-name="Rectangle 5653" fill="#6c6c6c" d="M11.7 19.5h13.05v3.15H11.7z"/><path data-name="Path 14340" d="M30.75 5.25A17.311 17.311 0 0 0 18 0 17.925 17.925 0 0 0 0 18a18.183 18.183 0 0 0 18 18 17.933 17.933 0 0 0 12.9-5.4A16.621 16.621 0 0 0 36 18a17.311 17.311 0 0 0-5.25-12.75m-2.25 23.1A14.756 14.756 0 0 1 18 32.7a14.415 14.415 0 0 1-10.35-4.35A14.7 14.7 0 0 1 18 3.3a13.611 13.611 0 0 1 10.35 4.35A13.926 13.926 0 0 1 32.7 18a13.572 13.572 0 0 1-4.2 10.35" fill="#6c6c6c"/></svg>
                      </div>
                    </template>
                    <template v-if="asset.license === 'CC BY-NC'">
                      <div>
                        Attribution - NonCommercial<br>(CC BY-NC)<br>
                        <svg class="mr-xs-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 36"><path data-name="Path 14352" d="M18 0a17.311 17.311 0 0 1 12.75 5.25A17.311 17.311 0 0 1 36 18a16.621 16.621 0 0 1-5.1 12.6A17.933 17.933 0 0 1 18 36a17.463 17.463 0 0 1-12.6-5.25A17.355 17.355 0 0 1 0 18 17.925 17.925 0 0 1 18 0m0 3.3A14.167 14.167 0 0 0 7.65 7.65a14.161 14.161 0 0 0-4.35 10.5A14.167 14.167 0 0 0 7.65 28.5 14.415 14.415 0 0 0 18 32.85a14.756 14.756 0 0 0 10.5-4.35 13.572 13.572 0 0 0 4.2-10.35 14.756 14.756 0 0 0-4.35-10.5A13.392 13.392 0 0 0 18 3.3m4.8 10.2v7.35h-2.1v8.7h-5.55v-8.7H13.2V13.5a1.146 1.146 0 0 1 .3-.75c.3-.15.45-.3.75-.3h7.35a1.146 1.146 0 0 1 .75.3c.45.15.45.45.45.75m-7.35-4.65a2.55 2.55 0 1 1 5.1 0A2.3 2.3 0 0 1 18 11.4a2.234 2.234 0 0 1-2.55-2.55" fill="#6c6c6c"/></svg>
                        <svg class="mr-xs-3" xmlns="http://www.w3.org/2000/svg" width="19.92" height="20" viewBox="0 0 35.85 36"><path data-name="Path 14335" d="M30.6 5.25a17.925 17.925 0 0 0-25.35 0A17.8 17.8 0 0 0 0 18a17.117 17.117 0 0 0 5.25 12.6 16.794 16.794 0 0 0 12.6 5.4 17.687 17.687 0 0 0 12.9-5.4 16.621 16.621 0 0 0 5.1-12.6A17.554 17.554 0 0 0 30.6 5.25m-2.25 23.1a14.667 14.667 0 0 1-20.85 0A14.167 14.167 0 0 1 3.15 18a12.887 12.887 0 0 1 .75-4.8l9.3 4.2 2.85 1.2 2.1.9 1.8.9a1.362 1.362 0 0 1 .45 1.05 1.462 1.462 0 0 1-.6 1.35 3.024 3.024 0 0 1-1.65.45 6.074 6.074 0 0 1-4.05-1.65l-2.55 2.55a8.437 8.437 0 0 0 5.4 2.1v2.7h2.1v-2.7a4.942 4.942 0 0 0 3.3-1.2A4.992 4.992 0 0 0 24 22.2l6.75 3a14.633 14.633 0 0 1-2.4 3.15M22.8 17.7l-2.85-1.35-1.5-.75-2.25-1.05a.551.551 0 0 1-.15-.45 1 1 0 0 1 .6-1.05 4.438 4.438 0 0 1 1.5-.3 5.284 5.284 0 0 1 3.15 1.05l2.4-2.4a8.253 8.253 0 0 0-4.5-1.65v-2.7h-2.1V9.9a5.068 5.068 0 0 0-3 .9 4.9 4.9 0 0 0-1.65 2.25L5.55 9.9A15.146 15.146 0 0 1 7.5 7.5a14.167 14.167 0 0 1 10.35-4.35 13.552 13.552 0 0 1 10.2 4.2 14.26 14.26 0 0 1 4.35 10.5 16.35 16.35 0 0 1-.45 3.9Z" fill="#6c6c6c"/></svg>
                      </div>
                    </template>
                    <template v-if="asset.license === 'CC BY-NC-SA'">
                      <div>
                        Attribution - NonCommercial - ShareAlike<br>(CC BY-NC-SA)<br>
                        <svg class="mr-xs-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 36"><path data-name="Path 14352" d="M18 0a17.311 17.311 0 0 1 12.75 5.25A17.311 17.311 0 0 1 36 18a16.621 16.621 0 0 1-5.1 12.6A17.933 17.933 0 0 1 18 36a17.463 17.463 0 0 1-12.6-5.25A17.355 17.355 0 0 1 0 18 17.925 17.925 0 0 1 18 0m0 3.3A14.167 14.167 0 0 0 7.65 7.65a14.161 14.161 0 0 0-4.35 10.5A14.167 14.167 0 0 0 7.65 28.5 14.415 14.415 0 0 0 18 32.85a14.756 14.756 0 0 0 10.5-4.35 13.572 13.572 0 0 0 4.2-10.35 14.756 14.756 0 0 0-4.35-10.5A13.392 13.392 0 0 0 18 3.3m4.8 10.2v7.35h-2.1v8.7h-5.55v-8.7H13.2V13.5a1.146 1.146 0 0 1 .3-.75c.3-.15.45-.3.75-.3h7.35a1.146 1.146 0 0 1 .75.3c.45.15.45.45.45.75m-7.35-4.65a2.55 2.55 0 1 1 5.1 0A2.3 2.3 0 0 1 18 11.4a2.234 2.234 0 0 1-2.55-2.55" fill="#6c6c6c"/></svg>
                        <svg class="mr-xs-3" xmlns="http://www.w3.org/2000/svg" width="19.92" height="20" viewBox="0 0 35.85 36"><path data-name="Path 14335" d="M30.6 5.25a17.925 17.925 0 0 0-25.35 0A17.8 17.8 0 0 0 0 18a17.117 17.117 0 0 0 5.25 12.6 16.794 16.794 0 0 0 12.6 5.4 17.687 17.687 0 0 0 12.9-5.4 16.621 16.621 0 0 0 5.1-12.6A17.554 17.554 0 0 0 30.6 5.25m-2.25 23.1a14.667 14.667 0 0 1-20.85 0A14.167 14.167 0 0 1 3.15 18a12.887 12.887 0 0 1 .75-4.8l9.3 4.2 2.85 1.2 2.1.9 1.8.9a1.362 1.362 0 0 1 .45 1.05 1.462 1.462 0 0 1-.6 1.35 3.024 3.024 0 0 1-1.65.45 6.074 6.074 0 0 1-4.05-1.65l-2.55 2.55a8.437 8.437 0 0 0 5.4 2.1v2.7h2.1v-2.7a4.942 4.942 0 0 0 3.3-1.2A4.992 4.992 0 0 0 24 22.2l6.75 3a14.633 14.633 0 0 1-2.4 3.15M22.8 17.7l-2.85-1.35-1.5-.75-2.25-1.05a.551.551 0 0 1-.15-.45 1 1 0 0 1 .6-1.05 4.438 4.438 0 0 1 1.5-.3 5.284 5.284 0 0 1 3.15 1.05l2.4-2.4a8.253 8.253 0 0 0-4.5-1.65v-2.7h-2.1V9.9a5.068 5.068 0 0 0-3 .9 4.9 4.9 0 0 0-1.65 2.25L5.55 9.9A15.146 15.146 0 0 1 7.5 7.5a14.167 14.167 0 0 1 10.35-4.35 13.552 13.552 0 0 1 10.2 4.2 14.26 14.26 0 0 1 4.35 10.5 16.35 16.35 0 0 1-.45 3.9Z" fill="#6c6c6c"/></svg>
                        <svg class="mr-xs-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 36"><path data-name="Path 14345" d="M18 8.55a7.967 7.967 0 0 0-5.25 1.8 7.429 7.429 0 0 0-2.7 5.1H8.7l3.6 3.6 3.6-3.6h-1.35Q15 12.3 18.6 12.3a3.331 3.331 0 0 1 3 1.5 7.183 7.183 0 0 1 1.05 4.35 7.478 7.478 0 0 1-1.2 4.35 3.648 3.648 0 0 1-3 1.65c-2.55 0-3.75-1.05-3.9-3.3h-4.5a7.782 7.782 0 0 0 2.7 5.25A7.967 7.967 0 0 0 18 27.9a9.158 9.158 0 0 0 6.75-2.7 10.041 10.041 0 0 0 2.55-6.9 10.157 10.157 0 0 0-2.55-7.05A8.7 8.7 0 0 0 18 8.55" fill="#6c6c6c"/><path data-name="Path 14346" d="M30.75 5.25A17.311 17.311 0 0 0 18 0 17.925 17.925 0 0 0 0 18a18.183 18.183 0 0 0 18 18 17.933 17.933 0 0 0 12.9-5.4A16.621 16.621 0 0 0 36 18a17.311 17.311 0 0 0-5.25-12.75m-2.25 23.1A14.756 14.756 0 0 1 18 32.7a14.415 14.415 0 0 1-10.35-4.35A14.7 14.7 0 0 1 18 3.3a13.611 13.611 0 0 1 10.35 4.35A13.926 13.926 0 0 1 32.7 18a13.572 13.572 0 0 1-4.2 10.35" fill="#6c6c6c"/></svg>
                      </div>
                    </template>
                    <template v-if="asset.license === 'CC BY-NC-ND'">
                      <div>
                        Attribution - NonCommercial - NoDerivs<br>(CC BY-NC-ND)<br>
                        <svg class="mr-xs-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 36"><path data-name="Path 14352" d="M18 0a17.311 17.311 0 0 1 12.75 5.25A17.311 17.311 0 0 1 36 18a16.621 16.621 0 0 1-5.1 12.6A17.933 17.933 0 0 1 18 36a17.463 17.463 0 0 1-12.6-5.25A17.355 17.355 0 0 1 0 18 17.925 17.925 0 0 1 18 0m0 3.3A14.167 14.167 0 0 0 7.65 7.65a14.161 14.161 0 0 0-4.35 10.5A14.167 14.167 0 0 0 7.65 28.5 14.415 14.415 0 0 0 18 32.85a14.756 14.756 0 0 0 10.5-4.35 13.572 13.572 0 0 0 4.2-10.35 14.756 14.756 0 0 0-4.35-10.5A13.392 13.392 0 0 0 18 3.3m4.8 10.2v7.35h-2.1v8.7h-5.55v-8.7H13.2V13.5a1.146 1.146 0 0 1 .3-.75c.3-.15.45-.3.75-.3h7.35a1.146 1.146 0 0 1 .75.3c.45.15.45.45.45.75m-7.35-4.65a2.55 2.55 0 1 1 5.1 0A2.3 2.3 0 0 1 18 11.4a2.234 2.234 0 0 1-2.55-2.55" fill="#6c6c6c"/></svg>
                        <svg class="mr-xs-3" xmlns="http://www.w3.org/2000/svg" width="19.92" height="20" viewBox="0 0 35.85 36"><path data-name="Path 14335" d="M30.6 5.25a17.925 17.925 0 0 0-25.35 0A17.8 17.8 0 0 0 0 18a17.117 17.117 0 0 0 5.25 12.6 16.794 16.794 0 0 0 12.6 5.4 17.687 17.687 0 0 0 12.9-5.4 16.621 16.621 0 0 0 5.1-12.6A17.554 17.554 0 0 0 30.6 5.25m-2.25 23.1a14.667 14.667 0 0 1-20.85 0A14.167 14.167 0 0 1 3.15 18a12.887 12.887 0 0 1 .75-4.8l9.3 4.2 2.85 1.2 2.1.9 1.8.9a1.362 1.362 0 0 1 .45 1.05 1.462 1.462 0 0 1-.6 1.35 3.024 3.024 0 0 1-1.65.45 6.074 6.074 0 0 1-4.05-1.65l-2.55 2.55a8.437 8.437 0 0 0 5.4 2.1v2.7h2.1v-2.7a4.942 4.942 0 0 0 3.3-1.2A4.992 4.992 0 0 0 24 22.2l6.75 3a14.633 14.633 0 0 1-2.4 3.15M22.8 17.7l-2.85-1.35-1.5-.75-2.25-1.05a.551.551 0 0 1-.15-.45 1 1 0 0 1 .6-1.05 4.438 4.438 0 0 1 1.5-.3 5.284 5.284 0 0 1 3.15 1.05l2.4-2.4a8.253 8.253 0 0 0-4.5-1.65v-2.7h-2.1V9.9a5.068 5.068 0 0 0-3 .9 4.9 4.9 0 0 0-1.65 2.25L5.55 9.9A15.146 15.146 0 0 1 7.5 7.5a14.167 14.167 0 0 1 10.35-4.35 13.552 13.552 0 0 1 10.2 4.2 14.26 14.26 0 0 1 4.35 10.5 16.35 16.35 0 0 1-.45 3.9Z" fill="#6c6c6c"/></svg>
                        <svg class="mr-xs-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 36"><path data-name="Rectangle 5652" fill="#6c6c6c" d="M11.7 13.8h13.05v3.15H11.7z"/><path data-name="Rectangle 5653" fill="#6c6c6c" d="M11.7 19.5h13.05v3.15H11.7z"/><path data-name="Path 14340" d="M30.75 5.25A17.311 17.311 0 0 0 18 0 17.925 17.925 0 0 0 0 18a18.183 18.183 0 0 0 18 18 17.933 17.933 0 0 0 12.9-5.4A16.621 16.621 0 0 0 36 18a17.311 17.311 0 0 0-5.25-12.75m-2.25 23.1A14.756 14.756 0 0 1 18 32.7a14.415 14.415 0 0 1-10.35-4.35A14.7 14.7 0 0 1 18 3.3a13.611 13.611 0 0 1 10.35 4.35A13.926 13.926 0 0 1 32.7 18a13.572 13.572 0 0 1-4.2 10.35" fill="#6c6c6c"/></svg>
                      </div>
                    </template>
                    <template v-if="asset.license === 'ODBL V1.0'">
                      <div>
                        Open Data Commons Open Database License v1.0<br>(ODbL v1.0)<br>
                      <svg xmlns="http://www.w3.org/2000/svg" width="0" height="36" viewBox="0 0 36 36"><path data-name="Path 14352" d="" fill="#333"/></svg>
                      </div>
                    </template>
                  </li>
                </ul>
              </div>
            </div>

            <div class="dashboard__form__review__item">
              <div class="dashboard__form__review__item__head">
                <h5>Pricing</h5>
                <a href="#" @click.prevent="goToStep(4)" v-if="!asset.openDataset">EDIT</a>
              </div>
              <div class="dashboard__form__review__item__body">
                <ul>
                  <li v-if="asset.openDataset"><span><strong>Pricing model:</strong>FREE</span></li>
                  <template v-else>
                    <li v-for="(pricingModel, index) in asset.pricingModels" v-bind:key="`pricingmodel${index}`">
                      <span v-if="pricingModel.type === 'FREE'">
                        <strong>Pricing model {{ index + 1 }}:</strong>FREE
                      </span>
                      <span v-if="pricingModel.type === 'FIXED'">
                        <strong>Pricing model {{ index + 1 }}:</strong>{{ pricingModel.totalPriceExcludingTax }}€, {{ pricingModel.yearsOfUpdates }} {{ pricingModel.yearsOfUpdates == 1 ? 'year' : 'years' }} of updates
                      </span>
                      <span v-if="pricingModel.type === 'FIXED_PER_ROWS'">
                        <strong>Pricing model {{ index + 1 }}:</strong>
                        {{ pricingModel.price }}€, minimum rows: {{ pricingModel.minRows }} <br />
                        <div v-for="discountRate in pricingModel.discountRates" :key="discountRate.count">{{ discountRate.discount }}% discount at {{ discountRate.count }} rows<br /></div>
                      </span>
                      <span v-if="pricingModel.type === 'FIXED_FOR_POPULATION'">
                        <strong>Pricing model {{ index + 1 }}:</strong>
                        {{ pricingModel.price }}€, minimum percent: {{ pricingModel.minPercent }} <br />
                        <div v-for="discountRate in pricingModel.discountRates" :key="discountRate.count">{{ discountRate.discount }}% discount at {{ discountRate.count }} rows<br /></div>
                      </span>
                      <span v-if="pricingModel.type === 'PER_CALL'">
                        <strong>Pricing model {{ index + 1 }}:</strong>
                        {{ pricingModel.price }}€ per call<br />
                        <div v-for="discountRate in pricingModel.discountRates" :key="discountRate.count">discount: {{ discountRate.discount }}% discount at {{ discountRate.count }} calls<br /></div>
                        <div v-for="prePaidTier in pricingModel.prePaidTiers" :key="prePaidTier.count">prepaid tier: {{ prePaidTier.discount }}% discount at {{ prePaidTier.count }} calls<br /></div>
                      </span>
                      <!-- <span v-if="pricingModel.type === 'PER_CALL_WITH_BLOCK_RATE'">
                        <strong>Pricing model {{ index + 1 }}:</strong>
                        {{ pricingModel.price }}€ per call<br />
                        <div v-for="discountRate in pricingModel.discountRates" :key="discountRate.count">{{ discountRate.discount }}% discount at {{ discountRate.count }} calls<br /></div>
                      </span> -->
                      <span v-if="pricingModel.type === 'PER_ROW'">
                        <strong>Pricing model {{ index + 1 }}:</strong>
                        {{ pricingModel.price }}€ per row<br />
                        <div v-for="discountRate in pricingModel.discountRates" :key="discountRate.count">discount: {{ discountRate.discount }}% discount at {{ discountRate.count }} rows<br /></div>
                        <div v-for="prePaidTier in pricingModel.prePaidTiers" :key="prePaidTier.count">prepaid tier: {{ prePaidTier.discount }}% discount at {{ prePaidTier.count }} rows<br /></div>
                      </span>
                      <!-- <span v-if="pricingModel.type === 'PER_ROW_WITH_BLOCK_RATE'">
                        <strong>Pricing model {{ index + 1 }}:</strong>
                        {{ pricingModel.price }}€ per row<br />
                        <div v-for="discountRate in pricingModel.discountRates" :key="discountRate.count">{{ discountRate.discount }}% discount at {{ discountRate.count }} rows<br /></div>
                      </span> -->
                    </li>
                  </template>
                </ul>
              </div>
            </div>
            <div class="dashboard__form__review__item" v-if="asset.type !== 'BUNDLE'">
              <div class="dashboard__form__review__item__head">
                <h5>Delivery</h5>
                <a href="#" @click.prevent="asset.openDataset ? goToStep(4) : goToStep(3)">EDIT</a>
              </div>
              <div class="dashboard__form__review__item__body">
                <ul>
                  <li><span><strong>Means of delivery:</strong>
                    {{
                      asset.deliveryMethod === 'DIGITAL_PLATFORM'
                        ? 'Through the platform'
                        : asset.deliveryMethod === 'DIGITAL_PROVIDER'
                          ? 'Through digital provider'
                          : asset.deliveryMethod === 'PHYSICAL_PROVIDER'
                            ? 'Through physical provider' : ''
                    }}</span>
                  </li>
                  <li><span><strong>Access to asset: </strong>{{ accessToFileType }}</span></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <template v-if="!asset.openDataset">
              <div class="dashboard__form__review__item__head dashboard__form__review__item__head--no-border">
                <h5>Vetting purchase</h5>
              </div>
              <div class="dashboard__form__review__item__body">
                <ul>
                  <span>Do you want to vet the sale of the asset to prospective consumers, before the sale is processed? This allows you to accept or deny the sale of the asset by examining the profile information of a prospective consumer.</span>
                </ul>
                <div class="form-group mt-xs-20">
                  <label class="control control-radio">
                    Yes, I want to approve a purchase first
                    <input type="radio" name="vetting_true" v-model="vettingRequiredLocal" :value="true" />
                    <div class="control_indicator"></div>
                  </label>
                  <label class="control control-radio">
                    No, I do not want to approve a purchase first
                    <input type="radio" name="vetting_false" v-model="vettingRequiredLocal" :value="false" />
                    <div class="control_indicator"></div>
                  </label>
                </div>
              </div>
            </template>
          </div>
          <div class="col-md-4">
            <div v-for="error in errors" :key="error.id" style="color: red;" class="dashboard__form__review__item__head dashboard__form__review__item__head--no-border">
              <h5>{{ error.level }}</h5>
              <p>
                <strong>Description</strong> : <span>{{ error.description }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- </div> -->
        <!-- <div class="dashboard__form__review__inner"> -->

        <!-- </div> -->
      </div>
    </div>
  </validation-observer>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch,
} from 'vue-property-decorator';
import { CatalogueItem, CatalogueItemCommand, ServerResponse } from '@/model';
import { EnumAssetType } from '@/model/enum';
import { ValidationObserver } from 'vee-validate';
import ContractApi from '@/service/provider-contract';
import SpatialApi from '@/service/spatial';
import AssetApiDetailsCard from '@/components/Assets/AssetApiDetailsCard.vue';
import store from '@/store';
import { ProviderTemplateContract } from '@/model/provider-contract';
import { EpsgCode } from '@/model/spatial';

@Component({
  components: {
    ValidationObserver,
    AssetApiDetailsCard,
  },
})
export default class Review extends Vue {
  @Prop({ required: true }) private asset!: CatalogueItemCommand;

  @Prop({ required: true }) private vettingRequired!: boolean;

  @Prop({ required: true }) private accessToFileType!: string;

  @Prop({ required: false }) private errors: any;

  contractApi: ContractApi;

  spatialApi: SpatialApi;

  vettingRequiredLocal: boolean;

  contractTitle: string;

  referenceSystemTitle: string;

  bundleAssets: CatalogueItem[] = [];

  constructor() {
    super();

    this.contractApi = new ContractApi();
    this.spatialApi = new SpatialApi();

    this.vettingRequiredLocal = this.vettingRequired;
    this.contractTitle = '';
    this.referenceSystemTitle = '';

    if (this.asset.type === EnumAssetType.BUNDLE) this.bundleAssets = this.asset.resources as unknown as CatalogueItem[];
  }

  created(): void {
    this.setAsyncLabels();

    console.log('asset', this.asset);
  }

  @Watch('vettingRequiredLocal')
  onVettingRequiredLocalChange(vettingRequired: boolean): void {
    console.log('vetting', vettingRequired);
    this.$emit('update:vettingRequired', vettingRequired);
  }

  goToStep(step: number): void {
    this.$emit('goToStep', step);
  }

  setAsyncLabels(): void {
    store.commit('setLoading', true);

    const promises: (Promise<ServerResponse<ProviderTemplateContract | EpsgCode[]>> | null)[] = [
      this.asset.openDataset ? null : this.contractApi.findOneTemplate(this.asset.contractTemplateKey),
      this.asset.referenceSystem ? this.spatialApi.getEpsgCodes(this.asset.referenceSystem) : null,
    ];

    Promise.all(promises).then((responses) => {
      const [contractResponse, referenceSystemResponse] = responses;

      if (contractResponse) this.contractTitle = (contractResponse.result as ProviderTemplateContract).title;
      if (referenceSystemResponse) this.referenceSystemTitle = (referenceSystemResponse.result as EpsgCode[]).some((x) => `${x.code}` === this.asset.referenceSystem) ? (referenceSystemResponse.result as EpsgCode[]).find((x) => `${x.code}` === this.asset.referenceSystem)?.name || '' : '';

      store.commit('setLoading', false);
    });
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/_assets.scss';
@import '@/assets/styles/abstracts/_spacings.scss';
@import '@/assets/styles/abstracts/_flexbox-utilities.scss';
@import '~flexboxgrid/css/flexboxgrid.min.css';
</style>
