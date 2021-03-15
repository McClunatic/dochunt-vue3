import axios from 'axios'

// initial state
const state = () => ({
  results: [],
  loading: false,
  time: 0.0,
  tab: 'table'
})

// getters
const getters = {}

// mutations
const mutations = {
  updateResults(state, results) {
    state.results = results
  },
  updateLoading(state, loading) {
    state.loading = loading
  },
  updateTime(state, time) {
    state.time = time
  },
  updateTab(state, tab) {
    state.tab = tab
  }
}

// actions
const actions = {
  async updateResults({ commit, rootState, rootGetters }) {
    const endpoint = import.meta.env.PROD
      ? 'https://paper-scope-6-api.azurewebsites.net'
      : 'http://127.0.0.1:21383'
    const msalInstance = rootGetters['msal/instance']
    const tokenRequest = {
      account: rootState.msal.account,
      scopes: rootState.msal.scopes
    }
    let results = []
    try {
      commit('updateLoading', true)
      const opts = {}
      if (import.meta.env.VITE_AUTH_ENABLED == 'true') {
      const response = await msalInstance.acquireTokenSilent(tokenRequest)
        opts['headers'] = { Authorization: `Bearer ${response.accessToken}` }
      }
      const startTime = new Date().getTime()
      const apiResponse = await axios.get(`${endpoint}/search/`, opts)
      commit('updateTime', new Date().getTime() - startTime)
      results = apiResponse.data
    } catch (error) {
      commit('updateTime', 0)
      console.log(error.message)
      console.log(error.response)
    }
    commit('updateResults', results)
    commit('updateLoading', false)
  },
  async updateTab(context, tab) {
    context.commit('updateTab', tab)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
