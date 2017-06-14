import Vue from 'vue'
import Router from 'vue-router'
import LessonList from 'pages/LessonList'
import Lesson from 'pages/Lesson'
import SeriesIntro from 'pages/SeriesIntro'

Vue.use(Router)

export default new Router({
  routes: [{
    name: 'LessonList',
    path: '/lesson-list/:series_id',
    component: LessonList
  }, {
    name: 'Lesson',
    path: '/:seriesId/lesson/:lessonId',
    component: Lesson,
    props: true
  }, {
    name: 'SeriesIntro',
    path: '/series-intro/:series_id',
    component: SeriesIntro
  }]
})
