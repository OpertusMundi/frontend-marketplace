interface State {
  globalModalToShow: string | null;
}

const initialState: State = {
  globalModalToShow: null,
};

const getters = {
  getShownGlobalModal: (state: State): string | null => state.globalModalToShow,
};

const actions = {

};

const mutations = {
  setShownGlobalModal(state: State, globalModalToShow: string | null): void {
    state.globalModalToShow = globalModalToShow;
  },
};

export default {
  namespaced: false,
  state: initialState,
  getters,
  actions,
  mutations,
};
