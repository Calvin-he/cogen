import { lessonHttp } from '../../api/LessonApi'

const state = {
  seriesList: [],
  lessonList: [],
  mediaList: []
}

const actions = {
  listLessons ({ commit }) {
    return lessonHttp.get('/lessons').then((response) => commit('LISTOFLESSONS', response.data))
  },

  addLesson ({ commit }, lesson) {
    return lessonHttp.post('/lessons', lesson).then((response) => commit('ADDLESSON', response.data))
  },

  updateLesson ({ commit }, lesson) {
    console.log(lesson)
    return lessonHttp.put('/lessons/' + lesson._id, lesson).then((response) => commit('UPDATELESSON', response.data))
  },

  listSeries ({ commit }) {
    return lessonHttp.get('/series').then((response) => commit('LISTOFSERIES', response.data))
  },
  addSeries ({ commit }, series) {
    return lessonHttp.post('/series', series).then((response) => {
      commit('ADDSERIES', response.data)
      return response.data
    })
  },
  updateSeries ({commit}, series) {
    return lessonHttp.put('/series/' + series._id, series).then((response) => {
      commit('UPDATESERIES', response.data)
      return response.data
    })
  },

  listMedia ({commit, state}) {
    if (state.mediaList.length === 0) {
      return lessonHttp.get('/media').then((response) => commit('LISTOFMEDIA', response.data))
    } else {
      return new Promise((resolve, reject) => {
        resolve(state.mediaList)
      })
    }
  },
  addMedia ({commit}, file) {
    let formData = new window.FormData()
    formData.append('file', file)
    return lessonHttp.post('./media', formData).then((response) => {
      commit('ADDMEDIA', response.data)
      return response.data
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
