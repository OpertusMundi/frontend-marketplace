import Vue from 'vue';
import Vuex from 'vuex';

import JwtDecode from 'jwt-decode';

import { Configuration } from '@/model';
import { Account, Profile } from '@/model/account';
import { EnumRole } from '@/model/role';

Vue.use(Vuex);

interface JwtTokenData {
  iss: string;
  aud: string;
  sub: string;
  exp: number;
  roles: EnumRole[];
}

interface State {
  account: {
    profile: Profile | null;
    roles: EnumRole[];
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
    hasRole: (state: State) => (role: EnumRole): boolean => state.account.roles.includes(role),
    isAuthenticated: (state: State): boolean => !!state.auth.token || !!state.account.profile,
  },
  mutations: {
    setCsrfToken(state: State, csrf: { token: string | null; header: string | null }): void {
      // Update token and configure interceptor
      state.csrf.header = csrf.header;
      state.csrf.token = csrf.token;

      // Uncomment for using global axios default instance

      /*
      // Reset existing interceptor
      const { interceptor } = state.csrf;

      if (interceptor !== null) {
        axios.interceptors.request.eject(interceptor);
        state.csrf.interceptor = null;
      }

      state.csrf.interceptor = axios.interceptors.request.use((config: AxiosRequestConfig) => {
        const result = { ...config };

        const required = ['POST', 'PUT', 'DELETE'].includes((config.method as string).toUpperCase());

        if (csrf.token && csrf.header && required) {
          if (!result.headers) {
            result.headers = {};
          }
          result.headers[csrf.header] = csrf.token;
        }
        return result;
      });
      */
    },
    setAccessToken(state: State, token: string): void {
      const data: JwtTokenData = JwtDecode(token);

      state.auth.token = token;

      state.account.username = data.sub;
      state.account.roles = data.roles;

      // Uncomment for using global axios default instance

      /*
      axios.defaults.headers = { Authorization: `Bearer ${token}` };
      */
    },
    setConfiguration(state: State, configuration: Configuration): void {
      state.configuration = configuration;
    },
    setUserData(state: State, data: Account): void {
      state.account.username = data.username;
      state.account.roles = data.roles;
      state.account.profile = data.profile;
    },
    logout(state: State): void {
      state.auth.token = null;

      state.account.username = null;
      state.account.roles = [];
      state.account.profile = null;

      // Uncomment for using global axios default instance

      /*
      axios.defaults.headers = null;
      */
    },
  },
  modules: {
  },
});
