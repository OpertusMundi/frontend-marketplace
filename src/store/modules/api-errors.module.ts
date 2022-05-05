import { ServerMessage } from '@/model/error';

interface State {
  errorMessages: ServerMessage[] | null;
}

const initialState: State = {
  errorMessages: null,
};

const getters = {
  getErrorMessages: (state: State): ServerMessage[] | null => state.errorMessages,
};

const actions = {

};

const mutations = {
  setErrorMessages(state: State, errorMessages: ServerMessage[] | null): void {
    state.errorMessages = errorMessages;
  },
};

export default {
  namespaced: false,
  state: initialState,
  getters,
  actions,
  mutations,
};
