import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  series: {},
  lessons: new Map(),
  appId: null,
  messageEvent: null
}

const actions = {
  getSeries ({ commit, state }, seriesId) {
    if (seriesId === state.series._id) {
      return Promise.resolve(state.series)
    } else {
      return Vue.axios.get('/series/' + seriesId).then((response) => {
        let seriesObj = response.data
        return Vue.axios.get(`/media/${seriesObj.bannerId}`).then((response) => {
          seriesObj.bannerUrl = response.data.path
          commit('SET_SERIES', seriesObj)
          return state.series
        })
      })
    }
  },
  queryLesson ({ dispatch, commit, state }, { seriesId, lessonIds }) {
    return dispatch('getSeries', seriesId).then((series) => {
      let unfetchedLessonIds = lessonIds.filter((lid) => !state.lessons.has(lid))
      if (unfetchedLessonIds.length > 0) {
        let idstr = unfetchedLessonIds.join(',')
        return Vue.axios.get(`/series/${seriesId}/search?lesson_ids=${idstr}`).then((response) => {
          let lessons = response.data
          lessons.forEach(v => commit('SET_LESSON', v))
        })
      }
    }).then(() => {
      let result = lessonIds.map(lid => state.lessons.get(lid))
      return result
    })
  },
  getLesson ({dispatch, commit, state}, {seriesId, lessonId}) {
    return dispatch('getSeries', seriesId).then(() => {
      let lesson = state.lessons.get(lessonId)
      if (lesson && lesson.content) {
        return lesson
      } else {
        return Vue.axios.get(`/lessons/${lessonId}`).then((response) => {
          commit('SET_LESSON', response.data)
          return state.lessons.get(lessonId)
        })
      }
    })
  },
  listComments ({dispatch}, {lessonId}) {
    return Vue.axios.get(`/lessons/${lessonId}/comments/`).then((response) => {
      return response.data
    })
  },

  addComment ({dispatch}, {lessonId, content}) {
    return Vue.axios.post(`/lessons/${lessonId}/comments/`, {content}).then((response) => {
      return response.data
    })
  },

  deleteComment ({dispatch}, {lessonId, commentId}) {
    return Vue.axios.delete(`/lessons/${lessonId}/comments/${commentId}`)
  },

  getSeriesPayParams ({dispatch}, {seriesId}) {
    return Vue.axios.get(`/series/${seriesId}/wxpay`).then((response) => {
      return response.data
    })
  },

  getPayState ({dispatch}, {seriesId, outTradeNo}) {
    return Vue.axios.get(`/series/${seriesId}/check_paystate?out_trade_no=${outTradeNo}`).then(response => {
      return response.data.state
    })
  },

  showMessage ({commit}, {msg, level}) {
    commit('SET_MESSAGE_EVENT', {msg, level})
    setTimeout(() => {
      commit('SET_MESSAGE_EVENT', null)
    }, 1500)
  }
}

// define the possible mutations that can be applied to our state
const mutations = {
  SET_SERIES (state, series) {
    state.series = series
  },
  SET_LESSON (state, lesson) {
    state.lessons.set(lesson._id, lesson)
  },
  SET_MESSAGE_EVENT (state, obj) {
    state.messageEvent = obj
  }

}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
