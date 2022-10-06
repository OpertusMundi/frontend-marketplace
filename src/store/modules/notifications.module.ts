interface State {
  notificationsCount: number | null;
  triggerReloadNotificationsTimestamp: number;
}

const initialState: State = {
  notificationsCount: null,
  triggerReloadNotificationsTimestamp: 0,
};

const getters = {
  getNotificationsCount: (state: State): number | null => state.notificationsCount,
  getTriggerReloadNotificationsTimestamp: (state: State): number => state.triggerReloadNotificationsTimestamp,
};

const actions = {

};

const mutations = {
  setNotificationsCount(state: State, n: number): void {
    state.notificationsCount = n;
  },
  setTriggerReloadNotificationsTimestamp(state: State, t: number): void {
    state.triggerReloadNotificationsTimestamp = t;
  },
};

export default {
  namespaced: false,
  state: initialState,
  getters,
  actions,
  mutations,
};
