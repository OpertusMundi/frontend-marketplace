<template>
    <div class="dashboard__inner">
      <div class="dashboard__head">
        <div class="dashboard__head__helpers">
          <h1>Settings</h1>
        </div>
      </div>

      <div class="settings">
        <div class="collection__menu">
          <ul>
            <li @click="selectTab('general')" :class="{ active: selectedTab=='general' }"><a href="#" @click.prevent="">General</a></li>
            <li @click="selectTab('loginAndSecurity')" :class="{ active: selectedTab=='loginAndSecurity' }"><a href="#" @click.prevent="">Login & Security</a></li>
            <li @click="selectTab('companyInformation')" :class="{ active: selectedTab=='companyInformation' }"><a href="#" @click.prevent="">Company Information</a></li>
            <li @click="selectTab('payoutOptions')" :class="{ active: selectedTab=='payoutOptions' }"><a href="#" @click.prevent="">Payout Options</a></li>
            <li @click="selectTab('addresses')" :class="{ active: selectedTab=='addresses' }"><a href="#" @click.prevent="">Addresses</a></li>
            <li @click="selectTab('paymentMethods')" :class="{ active: selectedTab=='paymentMethods' }"><a href="#" @click.prevent="">Payment Methods</a></li>
            <li @click="selectTab('kyc')" :class="{ active: selectedTab=='kyc' }"><a href="#" @click.prevent="">KYC</a></li>
            <li @click="selectTab('ubo')" :class="{ active: selectedTab=='ubo' }"><a href="#" @click.prevent="">UBO</a></li>
          </ul>
        </div>

        <!-- GENERAL -->
        <div class="tab tab-general" v-if="selectedTab == 'general'">
          <div class="grid-container">
            <div class="grid-item">Image</div>
            <div class="grid-item">AthImg</div>
            <div class="grid-item">CHANGE</div>
            <div class="grid-line"></div>

            <div class="grid-item">Username</div>
            <div class="grid-item">AthImg</div>
            <div class="grid-item">EDIT</div>
            <div class="grid-line"></div>

            <div class="grid-item">Full name</div>
            <div class="grid-item">AthImg</div>
            <div class="grid-item">EDIT</div>
            <div class="grid-line"></div>

            <div class="grid-item">Company email</div>
            <div class="grid-item">AthImg</div>
            <div class="grid-item">EDIT</div>
            <div class="grid-line"></div>
          </div>
        </div>

        <!-- LOGIN & SECURITY -->
        <div class="tab tab-login_security" v-if="selectedTab == 'loginAndSecurity'">
          <div class="grid-container">
            <div class="grid-item">Password</div>
            <div class="grid-item"></div>
            <div class="grid-item">CHANGE</div>
            <div class="grid-line"></div>

            <div class="grid-item">Two-step verification</div>
            <div class="grid-item"></div>
            <div class="grid-item">EDIT</div>
            <div class="grid-line"></div>

            <div class="grid-item">Mobile number</div>
            <div class="grid-item">+30 000 00000000</div>
            <div class="grid-item">CHANGE</div>
            <div class="grid-line"></div>
          </div>
        </div>

        <!-- COMPANY INFORMATION -->
        <div class="tab tab-company_information" v-if="selectedTab == 'companyInformation'">
          <div class="grid-container">
            <div class="grid-item">Company name</div>
            <div class="grid-item">Athena Research Centre</div>
            <div class="grid-item">EDIT</div>
            <div class="grid-line"></div>

            <div class="grid-item">Vat number</div>
            <div class="grid-item">123456789</div>
            <div class="grid-item">EDIT</div>
            <div class="grid-line"></div>

            <div class="grid-item">Domain</div>
            <div class="grid-item">Data research</div>
            <div class="grid-item">EDIT</div>
            <div class="grid-line"></div>

            <div class="grid-item">Country</div>
            <div class="grid-item">Greece</div>
            <div class="grid-item">EDIT</div>
            <div class="grid-line"></div>
          </div>
        </div>

        <!-- PAYOUT OPTIONS -->
        <div class="tab tab-payout_options" v-if="selectedTab == 'payoutOptions'">
          <div class="grid-container">
            <div class="grid-item">IBAN</div>
            <div class="grid-item">GR 01 2345 6789 0123 4567 8901 234</div>
            <div class="grid-item">CHANGE</div>
            <div class="grid-line"></div>
          </div>
        </div>

        <!-- ADDRESSES -->
        <div class="tab tab-addresses" v-if="selectedTab == 'addresses'">
          <div v-for="(address, i) in addresses" :key="i" class="grid-items-wrapper">
            <div class="grid-container">
              <div class="grid-item">ADDRESS {{ i + 1 }}</div>
              <div class="grid-item">{{ address.number + ', ' + address.street + ', ' + address.city + ', ' + address.country + ', ' + address.zipCode }}</div>
              <div class="grid-item">EDIT</div>
              <div class="grid-line"></div>
            </div>
          </div>
        </div>

        <!-- PAYMENT METHODS -->
        <div class="tab tab-payment_methods" v-if="selectedTab == 'paymentMethods'">
          <div v-for="(card, i) in cards" :key="i" class="grid-items-wrapper">
            <div class="grid-container">
              <div class="grid-item">CARD {{ i + 1 }}</div>
              <div class="grid-item">{{ card }}</div>
              <div class="grid-item">REMOVE</div>
              <div class="grid-line"></div>
            </div>
          </div>
        </div>

        <!-- <div class="settings__grid">
          <a href="setting.html" class="settings__item">
            <h3 class="settings__item__title">Profile Information</h3>
            <div class="settings__item__details">
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">Full Name: </div>
                <div class="settings__item__details__row__main">John Doe</div>
              </div>
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">username: </div>
                <div class="settings__item__details__row__main">@John.doe.athenarc</div>
              </div>
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">Image:</div>
                <div class="settings__item__details__row__main"><div class="settings__item__details__row__main__logo"><img src="@/assets/images/about/partners/athina_logo.svg" alt=""></div></div>
              </div>
            </div>
          </a>
          <a href="setting.html" class="settings__item">
            <h3 class="settings__item__title">Profile Information</h3>
            <div class="settings__item__details">
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">Full Name: </div>
                <div class="settings__item__details__row__main">John Doe</div>
              </div>
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">username: </div>
                <div class="settings__item__details__row__main">@John.doe.athenarc</div>
              </div>
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">Image:</div>
                <div class="settings__item__details__row__main"><div class="settings__item__details__row__main__logo"><img src="@/assets/images/about/partners/athina_logo.svg" alt=""></div></div>
              </div>
            </div>
          </a>
          <a href="setting.html" class="settings__item">
            <h3 class="settings__item__title">Addresses</h3>
            <div class="settings__item__details">
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">Full Name: </div>
                <div class="settings__item__details__row__main">John Doe</div>
              </div>
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">username: </div>
                <div class="settings__item__details__row__main">@John.doe.athenarc</div>
              </div>
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">Address:</div>
                <div class="settings__item__details__row__main">
                  <p>17, Leocharous</p>
                  <p>Greece</p>
                  <p>Attica</p>
                </div>
              </div>
            </div>
          </a>
          <a href="setting.html" class="settings__item">
            <h3 class="settings__item__title">Addresses</h3>
            <div class="settings__item__details">
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">Full Name: </div>
                <div class="settings__item__details__row__main">John Doe</div>
              </div>
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">username: </div>
                <div class="settings__item__details__row__main">@John.doe.athenarc</div>
              </div>
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">Address:</div>
                <div class="settings__item__details__row__main">
                  <p>17, Leocharous</p>
                  <p>Greece</p>
                  <p>Attica</p>
                </div>
              </div>
            </div>
          </a>
          <a href="setting.html" class="settings__item">
            <h3 class="settings__item__title">Addresses</h3>
            <div class="settings__item__details">
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">Full Name: </div>
                <div class="settings__item__details__row__main">John Doe</div>
              </div>
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">username: </div>
                <div class="settings__item__details__row__main">@John.doe.athenarc</div>
              </div>
              <div class="settings__item__details__row">
                <div class="settings__item__details__row__label">Address:</div>
                <div class="settings__item__details__row__main">
                  <p>17, Leocharous</p>
                  <p>Greece</p>
                  <p>Attica</p>
                </div>
              </div>
            </div>
          </a>
          <a class="settings__item settings__item--empty"></a>
          <a class="settings__item settings__item--empty"></a>
        </div> -->
      </div>
      <!-- <div class="dashboard__wrapper">
        <div class="dashboard__inner">
          <div class="dashboard__head">
            <div class="dashboard__head__helpers">
              <h1>Profile Information</h1>
            </div>
          </div>
          <div class="settings">
            <div class="settings__grid">
              <div class="settings__item settings__item--single">
                <div class="settings__item__details">
                  <div class="settings__item__details__row">
                    <div class="settings__item__details__row__label">Full Name: </div>
                    <div class="settings__item__details__row__main">John Doe</div>
                    <a href="#" class="settings__item__details__row__edit">CHANGE</a>
                  </div>
                  <div class="settings__item__details__row">
                    <div class="settings__item__details__row__label">username: </div>
                    <div class="settings__item__details__row__main">@John.doe.athenarc</div>
                    <a href="#" class="settings__item__details__row__edit">CHANGE</a>
                  </div>
                  <div class="settings__item__details__row">
                    <div class="settings__item__details__row__label">Image:</div>
                    <div class="settings__item__details__row__main"><div class="settings__item__details__row__main__logo"><img src="/assets/images/about/partners/athina_logo.svg" alt=""></div></div>
                    <a href="#" class="settings__item__details__row__edit">CHANGE</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class DashboardHome extends Vue {
  selectedTab: string;

  addresses: any = [];

  cards: string [];

  constructor() {
    super();

    this.selectedTab = 'general';

    this.addresses = [
      // eslint-disable-next-line
      { street: 'Leocharous', number: 17, city: 'Athens', country: 'Greece', zipCode: '10560' },
      // eslint-disable-next-line
      { street: 'Leocharous', number: 23, city: 'Athens', country: 'Greece', zipCode: '10560' },
    ];

    this.cards = ['1234 5678 1234 5678', '1111 2222 3333 4444'];
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
}
</script>
<style lang="scss">
  // style override
  .settings .collection__menu {
    margin-bottom: 0;
  }

  .settings .tab .grid-container {
    display: grid;
    grid-template-columns: 60% 30% 10%;
  }

  .settings .grid-items-wrapper {
    display: contents;
  }

  .settings .grid-line {
    grid-column: 1/6;
    height: 1px !important;
    width: 100%;
    background: $labelColor;
  }

  .settings .grid-item {
    padding: 20px;
  }

  @import "@/assets/styles/_settings.scss";
  @import "@/assets/styles/_collection.scss";
</style>
