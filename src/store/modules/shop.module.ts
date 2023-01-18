import { Cart } from '@/model';

interface State {
  cart: Cart | null;
}

const initialState: State = {
  cart: null,
};

const getters = {
  getCart: (state: State): Cart | null => state.cart,
  isAssetInCart: (state: State) => (assetId: string): boolean => (!!state.cart && state.cart.items.map((x) => x.asset.id).includes(assetId)),
};

const actions = {

};

const mutations = {
  setCartItems(state: State, cart: Cart | null): void {
    state.cart = cart;
  },
};

export default {
  namespaced: false,
  state: initialState,
  getters,
  actions,
  mutations,
};
