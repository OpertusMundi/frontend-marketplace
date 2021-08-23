<template>
  <div class="assets">
    <div class="s_container">
      <div class="assets__head">
        <h1>Cart</h1>
      </div>
      <h3 v-if="cart && cart.items.length === 0">No assets in cart.</h3>
      <div v-if="cart && cart.items.length > 0" class="cart_items__container">
        <div class="grid-ignore-wrapper" v-for="item in cart.items" :key="item.id">
          <cart-card :item="item"></cart-card>
          <button class="btn--std btn--outlineblue" @click="onRemoveItem(item.id)">remove</button>
        </div>
        <h2 class="cart_items__total_price">
          <span>Total:</span>
          <span>{{ `${cart.totalPrice}€` }}</span>
        </h2>
      </div>
      <div class="cart_items__bottom_btns" v-if="cart">
        <button class="btn--std btn--blue" @click="goToCataloguePage">{{ cart.items.length ? 'add more assets' : 'add assets' }}</button>
        <button v-if="cart.items.length" class="btn--std btn--blue">proceed to checkout</button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CartCard from '@/components/Cart/CartCard.vue';
import CartApi from '@/service/cart';
import { Cart as CartModel } from '@/model/cart';
import store from '@/store';

@Component({
  components: { CartCard },
})
export default class Cart extends Vue {
  cartApi: CartApi;

  // items: CartItem[] | null;

  cart: CartModel | null;

  constructor() {
    super();

    this.cartApi = new CartApi();
    // this.items = null;
    this.cart = null;
  }

  mounted():void {
    console.log('cart mounted');

    this.cartApi.getCart().then((cartResponse) => {
      console.log('cart response', cartResponse);
      // this.items = cartResponse.result.items;
      this.cart = cartResponse.result;
    });
  }

  onRemoveItem(id: string): void {
    this.cartApi.removeItem(id).then((cartResponse) => {
      console.log('removal', cartResponse);
      // this.items = cartResponse.result.items;
      this.cart = cartResponse.result;
      store.commit('setCartItems', cartResponse.result);
    });
  }

  goToCataloguePage(): void {
    this.$router.push('/catalogue');
  }
}
</script>
<style lang="scss">
  @import "@/assets/styles/_assets.scss";
  @import "@/assets/styles/_btns.scss";
  @import "@/assets/styles/_cart.scss";
  // @import "@/assets/styles/style.scss";
</style>
