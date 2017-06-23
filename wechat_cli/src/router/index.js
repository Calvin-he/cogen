import Vue from 'vue'
import Router from 'vue-router'
import LessonList from 'pages/LessonList'
import Lesson from 'pages/Lesson'
import SeriesIntro from 'pages/SeriesIntro'
import Login from 'auth/Login'

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    redirect: { name: 'SeriesIntro', params: {seriesId: '594b70a343d23e487197050b'} }
  }, {
    name: 'Login',
    path: '/login',
    component: Login
  }, {
    name: 'LessonList',
    path: '/lessonlist/:seriesId',
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
    path: '/seriesintro/:seriesId',
    meta: {auth: true},
    component: SeriesIntro,
    props: true
  }]
})

export default router
