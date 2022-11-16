interface State {
  isPendingInfoBoxHidden: boolean;
}

const initialState: State = {
  isPendingInfoBoxHidden: false,
};

const getters = {
  isPendingInfoBoxHidden: (state: State): boolean => state.isPendingInfoBoxHidden,
};

const actions = {

};

const mutations = {
  setPendingInfoBoxHidden(state: State, isHidden: boolean): void {
    state.isPendingInfoBoxHidden = isHidden;
  },
};

export default {
  namespaced: false,
  state: initialState,
  getters,
  actions,
  mutations,
};
