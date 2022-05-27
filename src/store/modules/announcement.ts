interface State {
  announcement: string | null;
  barHeight: number;
}

const initialState: State = {
  announcement: null,
  barHeight: 0,
};

const getters = {
  getAnnouncement: (state: State): string | null => state.announcement,
  getAnnouncementBarHeight: (state: State): number => state.barHeight,
};

const actions = {

};

const mutations = {
  setAnnouncement(state: State, announcement: string): void {
    state.announcement = announcement;
  },
  setAnnouncementBarHeight(state: State, barHeight: number): void {
    state.barHeight = barHeight;
  },
};

export default {
  namespaced: false,
  state: initialState,
  getters,
  actions,
  mutations,
};
