interface State {
  notificationsCount: number | null;
}

const initialState: State = {
  notificationsCount: null,
};

const getters = {
  getNotificationsCount: (state: State): number | null => state.notificationsCount,
};

const actions = {

};

const mutations = {
  setNotificationsCount(state: State, n: number): void {
    state.notificationsCount = n;
  },
};

export default {
  namespaced: false,
  state: initialState,
  getters,
  actions,
  mutations,
};
