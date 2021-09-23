import { Filters } from '@/model/catalogue-filters';

interface State {
  lastAppliedFilters: Filters | null;
}

const initialState: State = {
  lastAppliedFilters: null,
};

const getters = {
  getLastAppliedFilters: (state: State): Filters | null => state.lastAppliedFilters,
};

const actions = {

};

const mutations = {
  setLastAppliedFilters(state: State, filters: Filters): void {
    state.lastAppliedFilters = filters;
  },
};

export default {
  namespaced: false,
  state: initialState,
  getters,
  actions,
  mutations,
};
