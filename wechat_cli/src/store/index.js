import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  user: {},
  series: {},
  lessons: new Map()
}

const actions = {
  getSeries ({ commit, state }, seriesId) {
    if (state.series[ seriesId ]) {
      return Promise.resolve(state.series[ seriesId ])
    } else {
      return Vue.axios.get('/series/' + seriesId).then((response) => {
        let seriesObj = response.data
        return Vue.axios.get(`/media/${seriesObj.bannerId}`).then((response) => {
          seriesObj.bannerUrl = response.data.path
          commit('SET_SERIES', seriesObj)
          return state.series[ seriesId ]
        })
      })
    }
  },
  queryLesson ({ dispatch, commit, state }, { seriesId, lessonIds }) {
    return dispatch('getSeries', seriesId).then((series) => {
      let unfetchedLessonIds = lessonIds.filter((lid) => !state.lessons.has(lid))
      if (unfetchedLessonIds.length > 0) {
        return Vue.axios.post(`/series/${seriesId}/search`, {lesson_ids: unfetchedLessonIds}).then((response) => {
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
  }
}

// define the possible mutations that can be applied to our state
const mutations = {
  SET_SERIES (state, series) {
    Vue.set(state.series, series._id, series)
  },
  SET_USER (state, userData) {
    state.user = userData
  },
  SET_LESSON (state, lesson) {
    state.lessons.set(lesson._id, lesson)
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations
})
