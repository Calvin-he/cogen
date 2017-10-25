<template>
  <div class="tile is-ancestor">
    <div class="tile is-vertical">
      <div class="tile box" @keyup.enter="addNewWord">
        <input class="input" type="text" v-model="newWord" placeholder="Add New Word" style="max-width: 15rem;">
        <button class="button is-primary" @click="addNewWord">Add New Word</button>
      </div>
      <div class="tile box">
        <table class="table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Word</th>
              <th>Phonetic</th>
              <th>Pronoun</th>
              <th>#Pronouns</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(w,index) in wordPageList" :key="w.word">
              <td>{{(curPage-1)*10 + index + 1}}</td>
              <td>{{w.word}}</td>
              <td>{{w.phoneticSymbol?w.phoneticSymbol:'N/A'}}</td>
              <td>
                <a class="button is-success is-small" @click="playPronoun(w.pronouns[0])" v-if="w.pronouns.length" title="Play">
                  <span class="icon is-small">
                    <i class="fa fa-play"></i>
                  </span>
                </a>
              </td>
              <td>{{w.pronouns.length}}</td>
              <td>
                <a class="button is-danger is-outlined" title="Remove this word" @click="removeWord(w.word)">
                  <span class="icon">
                    <i class="fa fa-trash"></i>
                  </span>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
        <audio ref="playingAudio"></audio>
      </div>
      <div class="tile">
        <nav class="pagination is-centered is-large" role="navigation" aria-label="pagination" style="width:100%">
          <a class="pagination-previous" @click="gotoPage(curPage-1)">Previous</a>
          <a class="pagination-next" @click="gotoPage(curPage+1)">Next page</a>
          <ul class="pagination-list">
            <li>
              <a class="pagination-link" v-show="curPage>3" @click="gotoPage(1)">1</a>
            </li>
            <li>
              <span class="pagination-ellipsis" v-show="curPage>3">&hellip;</span>
            </li>
            <li>
              <a class="pagination-link" v-show="curPage>2" @click="gotoPage(curPage-2)">{{curPage-2}}</a>
            </li>
            <li>
              <a class="pagination-link" v-show="curPage>1" @click="gotoPage(curPage-1)">{{curPage-1}}</a>
            </li>
            <li>
              <a class="pagination-link is-current" @click="gotoPage(curPage)">{{curPage}}</a>
            </li>
            <li>
              <a class="pagination-link" v-show="curPage+1<=maxPageNum" @click="gotoPage(curPage+1)">{{curPage+1}}</a>
            </li>
            <li>
              <a class="pagination-link" v-show="curPage+2<=maxPageNum" @click="gotoPage(curPage+2)">{{curPage+2}}</a>
            </li>
            <li>
              <span class="pagination-ellipsis" v-show="curPage+3<maxPageNum">&hellip;</span>
            </li>
            <li>
              <a class="pagination-link" v-show="curPage+3<maxPageNum" @click="gotoPage(maxPageNum)">{{maxPageNum}}</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      wordList: [],
      newWord: '',
      curPage: 1
    }
  },
  computed: {
    wordPageList () {
      let pageSize = 10
      let start = (this.curPage - 1) * pageSize
      return this.wordList.slice(start, start + pageSize)
    },
    maxPageNum () {
      let pageSize = 10
      return Math.floor(this.wordList.length / pageSize)
    }
  },
  mounted () {
    this.axios.get('/words').then((response) => {
      this.wordList = response.data
    })
    this.audioPlayer = this.$refs.playingAudio
  },
  methods: {
    addNewWord () {
      let word = this.newWord.trim()
      if (word) {
        this.axios.post('/words', { word: word }).then(response => {
          this.wordList.push(response.data)
          this.newWord = ''
        })
      }
    },
    removeWord (word) {
      this.axios.delete('/words', {word: word}).then(response => {
        if (response.status !== 200) {
          console.log(`Failed to remove word ${word}`)
        } else {
          this.wordList = this.wordList.filter((w) => w.word !== word)
        }
      })
    },
    playPronoun (pronounObj) {
      this.audioPlayer.src = pronounObj.audioPath
      this.audioPlayer.play()
    },
    gotoPage (pageNum) {
      if (pageNum >= 1 && pageNum <= this.maxPageNum) {
        this.curPage = pageNum
      }
    }

  }
}
</script>

<style>

</style>
