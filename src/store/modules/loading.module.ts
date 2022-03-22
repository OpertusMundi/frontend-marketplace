interface State {
  loading: boolean;
}

const initialState: State = {
  loading: false,
};

const getters = {
  isLoading: (state: State): boolean => state.loading,
};

const actions = {

};

const mutations = {
  setLoading(state: State, loading: boolean): void {
    state.loading = loading;
  },
};

export default {
  namespaced: false,
  state: initialState,
  getters,
  actions,
  mutations,
};
