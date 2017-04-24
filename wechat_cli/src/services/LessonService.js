import axios from 'axios'

var httpClient = axios.create({
  baseURL: '/cogen/api/v1.0/',
  timeout: 1000,
  headers: {Authorization: 'Basic YXBpOnBhc3N3b3Jk'}
})

export class LessonService {
  constructor() {
    this.lessons = []
  }

  getSeries(sid) {
    return httpClient.get(`series/${sid}`).then(response => {
      return response.data
    })
  }

  listLessons() {
    if (this.lessons.length > 0) {
      return Promise.resolve(this.lessons)
    } else {
      return this.httpClient.get('/lessons').then(response => {
        console.log('Query lesson list')
        this.lessons = response.lessons
        return this.lessons
      })
    }
  }

  getLesson(lessonId) {
    if (this.lessons.length > 0) {
      let lesson = this.lessons.find((item) => item.id === lessonId)
      return lesson ? Promise.resolve(lesson) : Promise.reject(`Not find lesson with lesson id:${lessonId}`)
    } else {
      return this.httpClient.get('/lessons/' + lessonId).then(response => {
        console.log('Query a lesson')
        return response.lesson
      })
    }
  }

}

