import { Account, EnumActivationStatus, Profile } from '@/model/account';
import { EnumRole } from '@/model/role';

interface State {
    account: {
      profile: Profile | null;
      roles: EnumRole[];
      username: string | null;
      email: string | null;
      key: string | null;
      activationStatus: EnumActivationStatus | null;
    };
    auth: {
      token: string | null;
    };
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
    email: null,
    key: null,
    activationStatus: null,
  },
  auth: {
    token: null,
  },
  csrf: {
    header: null,
    interceptor: null,
    token: null,
  },
};


const getters = {
  csrfHeader: (state: State): string | null => state.csrf.header,
  hasRole: (state: State) => (role: EnumRole[]): boolean => role.some((x) => state.account.roles.includes(x)),
  isAuthenticated: (state: State): boolean => !!state.auth.token || !!state.account.profile,
  getProfile: (state: State): Profile | null => state.account.profile,
  isAccountActivated: (state: State): boolean => state.account.activationStatus === EnumActivationStatus.COMPLETED,
  getEmail: (state: State): string | null => state.account.email,
  getUserKey: (state: State): string | null => state.account.key,
};

const actions = {

};

const mutations = {
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
  setUserData(state: State, data: Account): void {
    state.account.username = data.username;
    state.account.roles = data.roles;
    state.account.profile = data.profile;
    state.account.email = data.email;
    state.account.key = data.key;
    state.account.activationStatus = data.activationStatus;
  },
  logout(state: State): void {
    state.auth.token = null;
    state.account.username = null;
    state.account.roles = [];
    state.account.profile = null;
    state.account.email = null;
    state.account.key = null;
    state.account.activationStatus = null;
    // Uncomment for using global axios default instance
    /*
    axios.defaults.headers = null;
    */
  },
};

export default {
  namespaced: false,
  state: initialState,
  getters,
  actions,
  mutations,
};
