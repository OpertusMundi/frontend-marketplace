import Vue from 'vue';
import Vuex from 'vuex';

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import JwtDecode from 'jwt-decode';

import { Configuration, LogoutSuccessResult, ServerResponse } from '@/model';

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
    profile: string | null;
    roles: string[];
    username: string | null;
  };
  auth: {
    token: string | null;
  };
  configuration: Configuration | null;
  csrf: {
    header: string | null;
    interceptor: number | null;
    token: string | null;
  };
}

const initialState: State = {
  account: {
    profile: null,
    roles: [],
    username: null,
  },
  auth: {
    token: null,
  },
  configuration: null,
  csrf: {
    header: null,
    interceptor: null,
    token: null,
  },
};

export default new Vuex.Store({
  state: initialState,
  getters: {
    csrfHeader: (state: State): string | null => state.csrf.header,
    hasRole: (state) => (role: string): boolean => state.account.roles.includes(role),
    isAuthenticated: (state: State): boolean => !!state.auth.token,
  },
  mutations: {
    setCsrfToken(state: State, csrf: { token: string | null; header: string | null }) {
      // Reset existing interceptor
      const { interceptor } = state.csrf;

      if (interceptor !== null) {
        axios.interceptors.request.eject(interceptor);
        state.csrf.interceptor = null;
      }

      // Update token and configure interceptor
      state.csrf.header = csrf.header;
      state.csrf.token = csrf.token;

      state.csrf.interceptor = axios.interceptors.request.use((config: AxiosRequestConfig) => {
        const result = { ...config };

        const required = ['POST', 'PUT', 'DELETE'].includes((config.method as string).toUpperCase());

        if (csrf.token && csrf.header && required) {
          result.headers[csrf.header] = csrf.token;
        }
        return result;
      });
    },
    setAccessToken(state, token) {
      const data: JwtTokenData = JwtDecode(token);

      state.auth.token = token;

      state.account.username = data.sub;
      state.account.roles = data.roles;

      axios.defaults.headers = { Authorization: `Bearer ${token}` };
    },
    setConfiguration(state: State, configuration: Configuration) {
      state.configuration = configuration;
    },
    setProfile(state, profile) {
      state.account.profile = profile;
    },
    logout(state) {
      state.auth.token = null;

      state.account.username = null;
      state.account.roles = [];
      state.account.profile = null;

      axios.defaults.headers = null;
    },
  },
  actions: {
    logout(context) {
      return axios.post('/logout', new FormData()).then((response: AxiosResponse<ServerResponse<LogoutSuccessResult>>) => {
        const { data } = response;

        if (data?.success && data?.result) {
          // Update CSRF token
          context.commit('setCsrfToken', { token: data.result.csrfToken, header: data.result.csrfHeader });

          // Reset session
          context.commit('logout');
        }
      });
    },
  },
  modules: {
  },
});
