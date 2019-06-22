import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import user from './model/user'
import io from "socket.io-client";

Vue.use(Vuex)

const URL = "http://localhost:9000/"

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      paths: ["user"]
    })
  ],
  state: {
    user: user,
    url: URL,
    socket: io(URL+ "myroom"),
  },
  mutations: {
    saveUser(state, user) {
      state.user.userId = user._id
      state.user.name = user.name
      state.user.mobileNumber = user.mobileNumber
      state.user.password = user.password
    },
    logout(state) {
      state.user = user
    }
  },
  actions: {

  }
})
