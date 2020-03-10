<template>
  <div>
    <div v-if="step == 1">
      <el-row>
        <el-button v-on:click="search()">Search</el-button>
      </el-row>
      <el-row v-if="items && items.length != 0">
        <el-table :data="items" style="width: 100%">
          <el-table-column label="Add to cart" width="120">
            <template slot-scope="scope">
              <el-switch
                @change="toggleItem(scope.row.item.id, $event)"
                v-model="scope.row.selected"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="item.title" label="Title" width="180"></el-table-column>
          <el-table-column prop="item.creator" label="Creator" width="180"></el-table-column>
          <el-table-column prop="item.description" label="Description"></el-table-column>
          <el-table-column label="Price" width="120" align="right">
            <template slot-scope="scope">{{ `${(scope.row.item.price / 100).toFixed(2)} €` }}</template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row class="price-row">
        <el-badge v-if="selectedItems != 0" :value="selectedItems" class="item">
          <el-button>{{ `${(price / 100).toFixed(2)} €` }}</el-button>
        </el-badge>
      </el-row>
      <el-row v-if="selectedItems != 0">
        <el-button v-on:click="createOrder()" type="primary">Checkout</el-button>
      </el-row>
    </div>
    <div v-if="step == 2" class="sr-root">
      <div class="sr-main">
        <el-row class="price-row">
          <el-badge v-if="selectedItems != 0" :value="selectedItems" class="item">
            <el-button>{{ `${(price / 100).toFixed(2)} €` }}</el-button>
          </el-badge>
        </el-row>
        <form id="payment-form" class="sr-payment-form">
          <div class="sr-combo-inputs-row">
            <div class="sr-input sr-card-element" id="card-element"></div>
          </div>
          <div class="sr-field-error" id="card-errors" role="alert"></div>
          <button v-on:click="pay()" :disabled="isLoading" type="button">
            <div class="spinner hidden" id="spinner"></div>
            <span id="button-text">Pay</span>
            <span id="order-amount"></span>
          </button>
        </form>
        <div class="sr-result hidden">
          <p>
            Payment completed
            <br />
          </p>
          <pre>
            <code></code>
          </pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import axios, { AxiosResponse } from 'axios';

import {
  Order,
  CreatePaymentResult,
  ServerResponse,
  CatalogueSearchResult,
  CatalogueItem,
  Selectable,
} from '../model';

@Component
export default class User extends Vue {
  isLoading = true;

  payment: CreatePaymentResult | null = null;

  config: {
    client: stripe.Stripe;
    card: any;
    clientSecret: string;
  } | null = null;

  step = 1;

  items: Selectable<CatalogueItem>[] = [];

  selectedItems = 0;

  order: Order | null = null;

  price = 0;

  mounted() {
    this.isLoading = false;
  }

  search() {
    axios
      .post('/action/catalogue', {
        page: 1,
        size: 2,
      })
      .then(
        (response: AxiosResponse<ServerResponse<CatalogueSearchResult>>) => {
          if (response.data.success) {
            this.items = response.data.result.items.map((item) => ({
              selected: false,
              item,
            }));
            console.log(this.items);
          } else {
            throw new Error('Failed to load catalogue items');
          }
        },
      );
  }

  toggleItem(id: string, selected: boolean) {
    this.items = this.items.map((s) => {
      if (s.item.id === id) {
        return { ...s, selected };
      }
      return s;
    });

    this.selectedItems = this.items.filter((s) => s.selected).length;
    this.price = this.items
      .filter((s) => s.selected)
      .reduce((total, s) => total + s.item.price, 0);
  }

  createOrder() {
    const data: Order = {
      id: null,
      items: this.items
        .filter((s) => s.selected)
        .map((s, index) => ({
          id: s.item.id,
          index,
          price: s.item.price,
        })),
    };

    axios
      .post('/action/orders', data)
      .then((response: AxiosResponse<ServerResponse<Order>>) => {
        if (response.data.success) {
          this.order = response.data.result;
          console.log(this.order);
          return this.order;
        }

        throw new Error('Failed to create order');
      })
      .then((order: Order) => {
        console.log(order);
        this.preparePaymentIntent(order);
      });
  }

  preparePaymentIntent(order: Order) {
    // Disable the button until we have Stripe set up on the page
    this.isLoading = true;

    this.step = 2;

    // Get client secret
    const endpoint = `/action/payments/${order.id}`;

    axios
      .post(endpoint, order)
      .then((response: AxiosResponse<ServerResponse<CreatePaymentResult>>) => {
        if (response.data.success) {
          this.payment = response.data.result;
          console.log(this.payment);

          return this.setupElements();
        }
        throw new Error('Failed to create payment intent');
      })
      .then(
        (
          config: {
            client: stripe.Stripe;
            card: any;
            clientSecret: string;
          } | null,
        ) => {
          this.isLoading = false;
          this.config = config;
        },
      );
  }

  setupElements(): {
    client: stripe.Stripe;
    card: any;
    clientSecret: string;
  } | null {
    if (this.payment) {
      // eslint-disable-next-line no-undef
      const client: stripe.Stripe = Stripe(this.payment.publishableKey);
      const elements = client.elements();
      const style = {
        base: {
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a',
        },
      };

      const card = elements.create('card', { style });
      card.mount('#card-element');

      return {
        client,
        card,
        clientSecret: this.payment.clientSecret,
      };
    }
    return null;
  }

  changeLoadingState = (isLoading: boolean): void => {
    const button = document.querySelector('button');
    const spinner = document.querySelector('#spinner');
    const text = document.querySelector('#button-text');

    if (isLoading) {
      if (button) {
        button.disabled = true;
      }
      if (spinner) {
        spinner.classList.remove('hidden');
      }
      if (text) {
        text.classList.add('hidden');
      }
    } else {
      if (button) {
        button.disabled = false;
      }
      if (spinner) {
        spinner.classList.add('hidden');
      }
      if (text) {
        text.classList.remove('hidden');
      }
    }
  };

  pay() {
    if (this.config) {
      const { client, card, clientSecret } = this.config;

      this.changeLoadingState(true);

      // Initiate the payment.
      // If authentication is required, confirmCardPayment will automatically display a modal
      client
        .confirmCardPayment(clientSecret, {
          payment_method: {
            card,
          },
        })
        .then((result) => {
          if (result.error) {
            // Show error to your customer
            this.showError(result.error?.message || 'Unknown error');
          } else {
            // The payment has been processed!
            this.orderComplete();
          }
        });
    }
  }

  orderComplete(): void {
    if (this.config) {
      const { client, clientSecret } = this.config;

      // Just for the purpose of the sample, show the PaymentIntent response object
      client.retrievePaymentIntent(clientSecret).then((result) => {
        const { paymentIntent } = result;
        const paymentIntentJson = JSON.stringify(paymentIntent, null, 2);

        const form = document.querySelector('.sr-payment-form');
        if (form) {
          form.classList.add('hidden');
        }

        const preElement = document.querySelector('pre');
        if (preElement) {
          preElement.textContent = paymentIntentJson;
        }
        const resultElement = document.querySelector('.sr-result');
        if (resultElement) {
          resultElement.classList.remove('hidden');
        }

        setTimeout(() => {
          if (resultElement) {
            resultElement.classList.add('expand');
          }
        }, 200);

        this.changeLoadingState(false);
      });
    }
  }

  showError(errorMsgText: string): void {
    this.changeLoadingState(false);
    const errorMsg = document.querySelector('.sr-field-error');
    if (errorMsg) {
      errorMsg.textContent = errorMsgText;
      setTimeout(() => {
        errorMsg.textContent = '';
      }, 4000);
    }
  }
}
</script>

<style lang="scss">
/* Variables */
.price-row {
  padding: 20px;
  float: right;
}

:root {
  --body-color: rgb(247, 250, 252);
  --button-color: rgb(30, 166, 114);
  --accent-color: #0a721b;
  --link-color: #ffffff;
  --font-color: rgb(105, 115, 134);
  --body-font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  --radius: 6px;
  --form-width: 400px;
}

/* Base */
* {
  box-sizing: border-box;
}
body {
  font-family: var(--body-font-family);
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
}

/* Layout */
.sr-root {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 980px;
  padding: 48px;
  align-content: center;
  justify-content: center;
  height: auto;
  margin: 0 auto;
}
.sr-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  align-self: center;
  padding: 75px 50px;
  background: var(--body-color);
  width: var(--form-width);
  border-radius: var(--radius);
  box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
    0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
}

.sr-field-error {
  color: var(--font-color);
  text-align: left;
  font-size: 13px;
  line-height: 17px;
  margin-top: 12px;
}

/* Inputs */
.sr-input,
input[type='text'] {
  border: 1px solid var(--gray-border);
  border-radius: var(--radius);
  padding: 5px 12px;
  height: 44px;
  width: 100%;
  transition: box-shadow 0.2s ease;
  background: white;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
}
.sr-input:focus,
input[type='text']:focus,
button:focus,
.focused {
  box-shadow: 0 0 0 1px rgba(50, 151, 211, 0.3), 0 1px 1px 0 rgba(0, 0, 0, 0.07),
    0 0 0 4px rgba(50, 151, 211, 0.3);
  outline: none;
  z-index: 9;
}
.sr-input::placeholder,
input[type='text']::placeholder {
  color: var(--gray-light);
}
.sr-result {
  height: 44px;
  -webkit-transition: height 1s ease;
  -moz-transition: height 1s ease;
  -o-transition: height 1s ease;
  transition: height 1s ease;
  color: var(--font-color);
  overflow: auto;
}
.sr-result code {
  overflow: scroll;
}
.sr-result.expand {
  height: 350px;
}

.sr-combo-inputs-row {
  box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
    0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
  border-radius: 7px;
}

/* Buttons and links */
button {
  background: var(--accent-color);
  border-radius: var(--radius);
  color: white;
  border: 0;
  padding: 12px 16px;
  margin-top: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: block;
  box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
  width: 100%;
}
button:hover {
  filter: contrast(115%);
}
button:active {
  transform: translateY(0px) scale(0.98);
  filter: brightness(0.9);
}
button:disabled {
  opacity: 0.5;
  cursor: none;
}

a {
  color: var(--link-color);
  text-decoration: none;
  transition: all 0.2s ease;
}

a:hover {
  filter: brightness(0.8);
}

a:active {
  filter: brightness(0.5);
}

/* Code block */
code,
pre {
  font-family: 'SF Mono', 'IBM Plex Mono', 'Menlo', monospace;
  font-size: 12px;
}

/* Stripe Element placeholder */
.sr-card-element {
  padding-top: 12px;
}

/* Responsiveness */
@media (max-width: 720px) {
  .sr-root {
    flex-direction: column;
    justify-content: flex-start;
    padding: 48px 20px;
    min-width: 320px;
  }

  .sr-header__logo {
    background-position: center;
  }

  .sr-payment-summary {
    text-align: center;
  }

  .sr-content {
    display: none;
  }

  .sr-main {
    width: 100%;
    height: 305px;
    background: rgb(247, 250, 252);
    box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
      0px 2px 5px 0px rgba(50, 50, 93, 0.1),
      0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
    border-radius: 6px;
  }
}

/* todo: spinner/processing state, errors, animations */

.spinner,
.spinner:before,
.spinner:after {
  border-radius: 50%;
}
.spinner {
  color: #ffffff;
  font-size: 22px;
  text-indent: -99999px;
  margin: 0px auto;
  position: relative;
  width: 20px;
  height: 20px;
  box-shadow: inset 0 0 0 2px;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
}
.spinner:before,
.spinner:after {
  position: absolute;
  content: '';
}
.spinner:before {
  width: 10.4px;
  height: 20.4px;
  background: var(--accent-color);
  border-radius: 20.4px 0 0 20.4px;
  top: -0.2px;
  left: -0.2px;
  -webkit-transform-origin: 10.4px 10.2px;
  transform-origin: 10.4px 10.2px;
  -webkit-animation: loading 2s infinite ease 1.5s;
  animation: loading 2s infinite ease 1.5s;
}
.spinner:after {
  width: 10.4px;
  height: 10.2px;
  background: var(--accent-color);
  border-radius: 0 10.2px 10.2px 0;
  top: -0.1px;
  left: 10.2px;
  -webkit-transform-origin: 0px 10.2px;
  transform-origin: 0px 10.2px;
  -webkit-animation: loading 2s infinite ease;
  animation: loading 2s infinite ease;
}

@-webkit-keyframes loading {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes loading {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

/* Animated form */

.sr-root {
  animation: 0.4s form-in;
  animation-fill-mode: both;
  animation-timing-function: ease;
}

.hidden {
  display: none;
}

@keyframes field-in {
  0% {
    opacity: 0;
    transform: translateY(8px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
}

@keyframes form-in {
  0% {
    opacity: 0;
    transform: scale(0.98);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
