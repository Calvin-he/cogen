import Vue from 'vue'

const state = {
  seriesList: [],
  lessonList: [],
  mediaList: []
}

const actions = {
  listLessons ({ commit }) {
    return Vue.axios.get('/lessons').then((response) => commit('LISTOFLESSONS', response.data))
  },

  addLesson ({ commit }, lesson) {
    return Vue.axios.post('/lessons', lesson).then((response) => commit('ADDLESSON', response.data))
  },

  updateLesson ({ commit }, lesson) {
    return Vue.axios.put('/lessons/' + lesson._id, lesson).then((response) => commit('UPDATELESSON', response.data))
  },

  deleteLesson ({commit}, lesson) {
    // TODO
  },

  listSeries ({ commit }) {
    return Vue.axios.get('/series').then((response) => commit('LISTOFSERIES', response.data))
  },
  addSeries ({ commit }, series) {
    return Vue.axios.post('/series', series).then((response) => {
      commit('ADDSERIES', response.data)
      return response.data
    })
  },
  updateSeries ({commit}, series) {
    return Vue.axios.put('/series/' + series._id, series).then((response) => {
      commit('UPDATESERIES', response.data)
      return response.data
    })
  },

  deleteSeries ({commit}, series) {
    return Vue.axios.delete('/series/' + series._id).then(response => {
      commit('DELETESERIES', series)
      return true
    })
  },

  listMedia ({commit, state}) {
    if (state.mediaList.length === 0) {
      return Vue.axios.get('/media').then((response) => commit('LISTOFMEDIA', response.data))
    } else {
      return new Promise((resolve, reject) => {
        resolve(state.mediaList)
      })
    }
  },
  addMedia ({commit}, file) {
    let formData = new window.FormData()
    formData.append('file', file)
    return Vue.axios.post('./media', formData).then((response) => {
      commit('ADDMEDIA', response.data)
      return response.data
    })
  },
  getMediaPathById ({dispatch}, mediaId) {
    return dispatch('listMedia').then(mediaList => {
      return mediaList[mediaId]
    })
  }
}

const mutations = {
  ADDLESSON (state, lesson) {
    state.lessonList.unshift(lesson)
    return lesson
  },

  UPDATELESSON (state, lesson) {
    let found = state.lessonList.find((item) => item._id === lesson._id)
    for (let prop in lesson) {
      if (found[prop] !== lesson[prop]) {
        found[prop] = lesson[prop]
      }
    }
    return found
  },

  LISTOFLESSONS (state, lessons) {
    state.lessonList = lessons.reverse()
    return state.lessonList
  },
  LISTOFSERIES (state, seriesList) {
    state.seriesList = seriesList.reverse()
    return state.seriesList
  },
  ADDSERIES (state, series) {
    state.seriesList.unshift(series)
    return series
  },
  UPDATESERIES (state, series) {
    let found = state.seriesList.find((item) => item._id === series._id)
    for (let prop in series) {
      if (found[prop] !== series[prop]) {
        found[prop] = series[prop]
      }
    }
    return found
  },
  DELETESERIES (state, series) {
    state.seriesList = state.seriesList.filter(v => v._id !== series._id)
  },

  LISTOFMEDIA (state, mediaList) {
    state.mediaList = mediaList.reverse()
    return state.mediaList
  },
  ADDMEDIA (state, media) {
    state.mediaList.unshift(media)
    return media
  }

}

export default {
  state,
  actions,
  mutations
}
