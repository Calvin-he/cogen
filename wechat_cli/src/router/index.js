import Vue from 'vue'
import Router from 'vue-router'
import LessonListPage from 'pages/LessonListPage'
import LessonPage from 'pages/LessonPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/', component: LessonListPage
    }, {
      path: '/lessons/:id', component: LessonPage
    }]
})
