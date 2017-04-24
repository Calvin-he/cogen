<template>
  <div class="weui-media-box weui-media-box_appmsg">
    <div class="weui-media-box__hd">
      <img class="weui-media-box__thumb"
           :src="lessonObject.imageUrl"
           alt="无图片">
    </div>
    <div class="weui-media-box__bd">
      <h4 class="weui-media-box__title">{{lessonObject.title}}</h4>
      <p class="weui-media-box__desc">{{lessonObject.description}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LessonListItem',
  props: {
    lessonObject: {
      type: Object,
      required: true
    }
  }
}

</script>
