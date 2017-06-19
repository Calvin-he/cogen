import Vue from 'vue'
import Router from 'vue-router'
import LessonList from 'pages/LessonList'
import Lesson from 'pages/Lesson'
import SeriesIntro from 'pages/SeriesIntro'

Vue.use(Router)

const router = new Router({
  routes: [{
    name: 'LessonList',
    path: '/lesson-list/:seriesId',
    meta: {auth: true},
    component: LessonList,
    props: true
  }, {
    name: 'Lesson',
    path: '/:seriesId/lesson/:lessonId',
    meta: {auth: true},
    component: Lesson,
    props: true
  }, {
    name: 'SeriesIntro',
    path: '/series-intro/:seriesId',
    meta: {auth: true},
    component: SeriesIntro,
    props: true
  }]
})

export default router
