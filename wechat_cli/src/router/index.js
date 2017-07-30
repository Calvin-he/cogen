import Vue from 'vue'
import Router from 'vue-router'
import LessonList from 'pages/LessonList'
import Lesson from 'pages/Lesson'
import SeriesIntro from 'pages/SeriesIntro'
import Payment from 'pages/Payment'
import Login from 'auth/Login'

Vue.use(Router)

const router = new Router({
  routes: [{
    name: 'Login',
    path: '/login',
    alias: '/',
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
  }, {
    name: 'Payment',
    path: '/payment/:seriesId',
    meta: {auth: true},
    component: Payment,
    props: true
  }]
})

export default router
