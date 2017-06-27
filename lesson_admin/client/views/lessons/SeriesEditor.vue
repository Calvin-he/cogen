<template>
  <loading :loading="isloading">
    <div class="columns">
      <div class="column is-half">
        <div class="box">
          <p class="control">
            <input class="input" type="text" v-model.trim="ctrl_title.value" placeholder="课程系列标题" @blur="validateTitle">
            <span class="help is-danger" v-show="ctrl_title.errors.required">价格不能为空</span>
          </p>
          <p class="control">
            <textarea v-model.trim="ctrl_desc.value" class="textarea" placeholder="简要描述"></textarea>
          </p>
        </div>
      </div>
      <div class="column">
        <div class="box">
          <p class="control has-icon">      
            <input class="input" type="number" v-model="ctrl_price.value" placeholder="购买价格" @blur="validatePrice">
            <span class="icon"><i class="fa fa-jpy"></i></span>
            <span class="help is-danger" v-show="ctrl_price.errors.required">课程名称不能为空</span>
          </p>
          <p class="control">
            <textarea v-model.trim="ctrl_noticeForPurchase.value" class="textarea" placeholder="购买须知"></textarea>
          </p>
        </div>
      </div>
    </div>
    <div class="box">
      <p class="control">
        <select-media v-model="ctrl_bannerId.value" @change="setBannerPath" placeholder="请选择插图" extensions="png|jpg|gif" accept="image/png, image/jpeg, image/gif"></select-media>
        <figure class="image is-128x128">
          <img v-show="ctrl_bannerId.bannerPath" :src="ctrl_bannerId.bannerPath">
        </figure>
        <span class="help is-danger" v-show="ctrl_bannerId.errors.required">必须有插图</span>
      </p>
    </div>
  
    <div class="columns">
      <div class="column">
        <div class="box">
          <h4 class="subtitle">选中课程</h4>
          <draggable v-model="ctrl_lessonList.value" :options="{group:'lessons'}" class="draggable" @change="onChangeLessonList">
            <transition-group class="draggable-container">
              <div v-for="element in ctrl_lessonList.value" :key="element._id" class="draggable-item">
                {{element.title}}
                <label class="checkbox is-pulled-right">
                  <input type="checkbox" v-model="ctrl_freeLessons.value[element._id]">试读</label>
              </div>
            </transition-group>
          </draggable>
        </div>
      </div>
  
      <div class="column">
        <div class="box">
          <h4 class="subtitle">未选中课程</h4>
          <draggable v-model="ctrl_lessonList.unselected" :options="{group:'lessons'}" class="draggable">
            <transition-group class="draggable-container">
              <div v-for="element in ctrl_lessonList.unselected" :key="element._id" class="draggable-item">
                {{element.title}}
              </div>
            </transition-group>
          </draggable>
        </div>
      </div>
    </div>
    <p class="control">
      <button class="button is-primary" @click="submit">提交</button>
    </p>
  </loading>
</template>

<script>
import SelectMedia from './SelectMedia'
import draggable from 'vuedraggable'
import Loading from './Loading'

const EVT_SUBMIT = 'submit'
export default {
  name: 'SeriesEditor',
  props: {
    series: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isloading: false,
      ctrl_title: { value: null, errors: {} },
      ctrl_desc: { value: null, errors: {} },
      ctrl_price: { value: null, errors: {} },
      ctrl_bannerId: { value: null, bannerPath: null, errors: {} },
      ctrl_lessonList: { unselected: [], value: [], errors: {} },
      ctrl_freeLessons: { value: {}, errors: {} },
      ctrl_noticeForPurchase: { value: null, errors: {} }
    }
  },
  mounted () {
    this.$store.dispatch('listLessons').then(() => {
      this.reset()
    })
  },

  methods: {
    validateTitle () {
      this.$set(this.ctrl_title.errors, 'required', this.isEmptyString(this.ctrl_title.value))
      return !this.ctrl_title.errors.required
    },
    validatePrice () {
      this.$set(this.ctrl_price.errors, 'required', this.isEmptyString(this.ctrl_price.value))
      return !this.ctrl_price.errors.required
    },
    validateBanner () {
      this.$set(this.ctrl_bannerId.errors, 'required', this.isEmptyString(this.ctrl_bannerId.value))
      return !this.ctrl_bannerId.errors.required
    },
    setBannerPath (media) {
      if (media) {
        this.ctrl_bannerId.bannerPath = media.path
      } else {
        this.ctrl_bannerId.bannerPath = ''
      }
    },

    isNew () {
      return !this.series._id
    },

    isModified () {
      return this.ctrl_title.value !== this.series.title ||
        this.ctrl_desc.value !== this.series.desc ||
        this.ctrl_bannerId !== this.series.bannerId ||
        !this.equalOfArray(this.ctrl_lessonList.value, this.series.lessonList)
    },
    reset () {
      this.ctrl_title = {
        value: this.series.title, errors: {}
      }
      this.ctrl_desc = {
        value: this.series.desc, errors: {}
      }
      this.ctrl_price = {
        value: this.series.price, errors: {}
      }
      this.ctrl_noticeForPurchase = {
        value: this.series.noticeForPurchase, errors: {}
      }
      this.ctrl_bannerId = {
        value: this.series.bannerId, errors: {}
      }
      let selected = []
      let unselected = []
      for (let item of this.$store.state.lesson.lessonList) {
        let found = this.series.lessonList.find(id => item._id === id)
        if (found != null) {
          selected.push(item)
        } else {
          unselected.push(item)
        }
      }
      this.ctrl_lessonList = {
        value: selected, unselected: unselected, errors: {}
      }

      let freeLessons = this.series.freeLessons || []
      freeLessons = freeLessons.reduce((result, item) => {
        result[item] = true
        return result
      }, {})
      this.ctrl_freeLessons = {
        value: freeLessons,
        errors: {}
      }
    },
    submit () {
      let valid = this.validateTitle()
      valid = this.validateBanner() && valid
      valid = this.validatePrice() && valid
      if (!valid) {
        return false
      }
      let selectedLessonIds = this.ctrl_lessonList.value.map(v => v._id)
      let freeLessonIds = Object.keys(this.ctrl_freeLessons.value).filter(lid => (this.ctrl_freeLessons.value[lid] === true))
      if (this.isNew()) {
        let data = {
          title: this.ctrl_title.value,
          desc: this.ctrl_desc.value,
          price: this.ctrl_price.value,
          noticeForPurchase: this.ctrl_noticeForPurchase.value,
          bannerId: this.ctrl_bannerId.value,
          lessonList: selectedLessonIds,
          freeLessons: freeLessonIds
        }
        this.isloading = true
        this.$store.dispatch('addSeries', data).then((series) => {
          this.$emit(EVT_SUBMIT, series)
          this.reset()
          this.isloading = false
        })
      } else {
        let data = {}
        if (this.ctrl_title.value !== this.series.title) {
          data.title = this.ctrl_title.value
        }
        if (this.ctrl_desc.value !== this.series.desc) {
          data.desc = this.ctrl_desc.value
        }
        if (this.ctrl_price.value !== this.series.price) {
          data.price = this.ctrl_price.value
        }
        if (this.ctrl_noticeForPurchase.value !== this.series.noticeForPurchase) {
          data.noticeForPurchase = this.ctrl_noticeForPurchase.value
        }
        if (this.ctrl_bannerId.value !== this.series.bannerId) {
          data.bannerId = this.ctr_bannerId.value
        }
        if (!this.equalOfArray(selectedLessonIds, this.series.lessonList)) {
          data.lessonList = selectedLessonIds
        }
        if (!this.equalOfArray(freeLessonIds, this.series.freeLessons)) {
          data.freeLessons = freeLessonIds
        }
        if (Object.keys(data).length > 0) {
          data._id = this.series._id
          this.isloading = true
          this.$store.dispatch('updateSeries', data).then((series) => {
            this.$emit(EVT_SUBMIT, series)
            this.isloading = false
          })
        }
      }
    },

    equalOfArray (a, b) {
      if (a === b) return true
      if (a == null || b == null) return false
      if (a.length !== b.length) return false
      for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false
      }
      return true
    },

    isEmptyString (v) {
      return v == null || v.trim().length === 0
    },

    onChangeLessonList (operation) {
      let removed = operation.removed
      if (removed) {
        let rid = removed.element._id
        this.ctrl_freeLessons.value[rid] = false
      }
    }
  },
  components: {
    SelectMedia,
    draggable,
    Loading
  }
}
</script>

<style lang="scss" scoped>
@import "~quill/dist/quill.snow.css";
@import "~bulma/sass/utilities/variables";
@import "~bulma/sass/utilities/functions";

.draggable-container {
  display: block;
  height: 305px;
  overflow-y: scroll;
}

.draggable-item {
  $color: $primary !default;
  $color-invert: findColorInvert($color) !default;
  $button-shadow-inset: inset 0 1px 2px rgba($black, 0.2) !default;

  font-size: 1.5rem;
  background-color: $color;
  border: 1px solid $grey-lighter;
  color: $color-invert;
  cursor: move;
  justify-content: center;
  padding-left: 0.75em;
  padding-right: 0.75em;
  text-align: left;
  white-space: nowrap;
  border-color: transparent;
  margin: 0 10px 5px 10px;
  &:hover,
  &.is-hovered {
    background-color: darken($color, 2.5%);
    border-color: transparent;
    color: $color-invert;
  }
  &:focus,
  &.is-focused {
    border-color: transparent;
    box-shadow: 0 0 0.5em rgba($color, 0.25);
    color: $color-invert;
  }
  &:active,
  &.is-active {
    background-color: darken($color, 5%);
    border-color: transparent;
    box-shadow: $button-shadow-inset;
    color: $color-invert;
  }
  &[disabled] {
    background-color: $color;
    border-color: transparent;
    box-shadow: none;
  }
}
</style>
