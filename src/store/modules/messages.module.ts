interface State {
  unreadMessages: number | null;
}

const initialState: State = {
  unreadMessages: null,
};

const getters = {
  getUnreadMessagesCount: (state: State): number | null => state.unreadMessages,
};

const actions = {

};

const mutations = {
  setUnreadMessagesCount(state: State, n: number): void {
    state.unreadMessages = n;
  },
};

export default {
  namespaced: false,
  state: initialState,
  getters,
  actions,
  mutations,
};
