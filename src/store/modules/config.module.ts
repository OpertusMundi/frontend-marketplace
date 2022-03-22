import { Configuration } from '@/model';

interface State {
  configuration: Configuration | null;
}

const initialState: State = {
  configuration: null,
};

const getters = {
  getConfig: (state: State): Configuration | null => state.configuration,
};

const actions = {

};

const mutations = {
  setConfiguration(state: State, configuration: Configuration): void {
    state.configuration = configuration;
  },
};

export default {
  namespaced: false,
  state: initialState,
  getters,
  actions,
  mutations,
};
