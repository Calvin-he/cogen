<template>
  <div>
    <mt-header fixed
               title="课程A">
      <router-link to="/"
                   slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <mt-button size="normal"
                 type="primary"
                 slot="right">
        <img src="/static/images/text-message.ico"
             height="32"
             width="32"
             slot="icon">留言
      </mt-button>
    </mt-header>
    <div>
      <img src="/static/images/openclass.jpg"
           alt="无图片"
           style="width: 100%">
      <div class="audio">
        <audio src="song.ogg"
               class="full-width"
               controls="controls">
          Your browser does not support the audio tag.
        </audio>
      </div>
    </div>
    <mt-cell title="课程名称"></mt-cell>
    <div class="lesson-content">
      <article class=""> 英语学习应遵循以下五大原则。这些原则都是"常识"性的。正如美国总统林肯所说：一个人必须依据语言、逻辑和"简单的常识"来决定问题和建立自己的行动计划。在学习英语的过程中，按照常理去做，就可能成功。违背了常理，就不可能成功。当然，成功与否还取决于"努力"。
      </article>
    </div>
    <mt-cell>
      <h4 slot="title">留言区</h4>
      <mt-button size="normal"
                 type="primary">
        <img src="/static/images/text-message.ico"
             height="32"
             width="32"
             slot="icon">留言
      </mt-button>
    </mt-cell>
  </div>
</template>

<script>
export default {
  name: 'LessonPage',
  data() {
    return {
      lesson: {
        poster: '',
        title: 'title',
        summary: 'summary',
        content: 'content'
      }
    }
  },
  components: {
  }
}
</script>

<style>
.full-width {
  width: 100%
}
</style>
