<template>
  <div class="section" id="comment-list">
    <div class="is-flex" style="justify-content:flex-end">
      <a @click="addComment" style="">我要留言
        <span class="icon">
          <i class="fa fa-edit"></i>
        </span>
      </a>
    </div>
    <hr>
    <div class="media" v-for="comment in commentList" :key="comment._id">
      <figure class="media-left">
        <p class="image is-32x32">
          <img :src="comment.userAvatar">
        </p>
      </figure>
      <div class="media-content">
        <strong>{{comment.userNickname}}</strong>
        <p>
          {{comment.content}}
        </p>
      </div>
      <div class="media-right">{{comment.created | datetimeFormat}} 
        <a class="delete is-warning is-large" @click="deleteComment(comment._id)" v-if="canDelete(comment.username)">    
        </a>
      </div>
    </div>
  
    <div class="modal" :class="{'is-active': showCommentModal}">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">@{{lessonTitle}}</p>
          <button class="delete is-large" @click="showCommentModal=false"></button>
        </header>
        <section class="modal-card-body" style="padding:0">
          <textarea class="textarea" placeholder="字数必须多于3个字，少于500字" rows="10" ref="commentTextarea" v-model="comment"></textarea>
        </section>
        <footer class="modal-card-foot">
          <button type="submit" class="button is-success full-width" @click="submitComment">提交</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'Comments',
  props: {
    lessonId: {
      type: String,
      required: true
    },
    seriesId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      comment: '',
      showCommentModal: false,
      commentList: [],
      lessonTitle: ''

    }
  },

  activated () {
    this.$store.dispatch('getLesson', { seriesId: this.seriesId, lessonId: this.lessonId }).then((lesson) => {
      this.lessonTitle = lesson.title
    })
    this.loadComments()
  },
  deactivated () {
    this.lessonTitle = ''
    this.comment = ''
    this.showCommentModal = false
    this.commentList = []
  },
  methods: {
    addComment () {
      this.showCommentModal = true
      setTimeout(() => {
        this.$refs.commentTextarea.focus()
      }, 300)
    },
    submitComment () {
      if (this.comment.length <= 3 || this.comment.length >= 500) {
        return false
      }
      this.$store.dispatch('addComment', { lessonId: this.lessonId, content: this.comment }).then((comment) => {
        this.commentList = [comment, ...this.commentList]
        this.showCommentModal = false
        this.comment = ''
      }).catch(err => {
        console.warn(err)
      })
    },
    loadComments () {
      this.$store.dispatch('listComments', { lessonId: this.lessonId }).then((comments) => {
        this.commentList = comments
      })
    },
    deleteComment (commentId) {
      this.$store.dispatch('deleteComment', {lessonId: this.lessonId, commentId: commentId}).then(() => {
        this.commentList = this.commentList.filter(c => c._id !== commentId)
      })
    },
    canDelete (username) {
      let user = this.$auth.user()
      return user.isAdmin || user.username === username
    }

  },
  components: {
    InfiniteLoading
  }
}</script>

<style scoped>
#comment-list {
  background-color: ghostwhite;
}
</style>
