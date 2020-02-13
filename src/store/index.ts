import Vue from 'vue';
import Vuex from 'vuex';

import axios from 'axios';
import JwtDecode from 'jwt-decode';

Vue.use(Vuex);

interface JwtTokenData {
  iss: string;
  aud: string;
  sub: string;
  exp: number;
  roles: string[];
}

interface State {
  account: {
    token: string | null;
    username: string | null;
    roles: string[];
    profile: string | null;
  };
}

const initialState: State = {
  account: {
    token: null,
    username: null,
    roles: [],
    profile: null,
  },
};

export default new Vuex.Store({
  state: initialState,
  getters: {
    isAuthenticated: (state): boolean => !!state.account.token,
    hasRole: (state) => (role: string): boolean => state.account.roles.includes(role),
  },
  mutations: {
    setToken(state, token) {
      const data: JwtTokenData = JwtDecode(token);

      state.account.token = token;
      state.account.username = data.sub;
      state.account.roles = data.roles;

      axios.defaults.headers = { Authorization: `Bearer ${token}` };
    },
    setProfile(state, profile) {
      state.account.profile = profile;
    },
    logout(state) {
      state.account.token = null;
      state.account.profile = null;

      axios.defaults.headers = null;
    },
  },
  actions: {
  },
  modules: {
  },
});
