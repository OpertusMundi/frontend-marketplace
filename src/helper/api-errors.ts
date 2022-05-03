import { ServerMessage } from '@/model';
import { EnumRole } from '@/model/role';
import store from '@/store';

const showApiErrorModal = (messages: ServerMessage[]): void => {
  if (store.getters.hasRole([EnumRole.ROLE_ADMIN, EnumRole.ROLE_DEVELOPER])) {
    store.commit('setErrorMessages', messages);
    store.commit('setShownGlobalModal', 'modalApiError');
  }
  store.commit('setLoading', false);
};

// eslint-disable-next-line
export { showApiErrorModal };
