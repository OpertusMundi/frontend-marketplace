interface State {
  lastRouteName: string | null;
}

const initialState: State = {
  lastRouteName: null,
};

const getters = {
  getLastRouteName: (state: State): string | null => state.lastRouteName,
};

const actions = {

};

const mutations = {
  setLastRouteName(state: State, lastRouteName: string): void {
    state.lastRouteName = lastRouteName;
  },
};

export default {
  namespaced: false,
  state: initialState,
  getters,
  actions,
  mutations,
};
