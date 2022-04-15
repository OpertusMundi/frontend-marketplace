import { ServerMessage } from '@/model';
import store from '@/store';

const showApiErrorModal = (messages: ServerMessage[]): void => {
  store.commit('setErrorMessages', messages);
  store.commit('setShownGlobalModal', 'modalApiError');
  store.commit('setLoading', false);
};

// eslint-disable-next-line
export { showApiErrorModal };
