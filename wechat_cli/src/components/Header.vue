<template>
  <header class="nav">
    <div class="nav-left">
      <div class="nav-item">&nbsp;&nbsp;</div>
    </div>
    <div class="nav-center">
      <router-link class="nav-item is-bold" :to="{name: 'SeriesIntro', params: {seriesId: seriesId}}" replace>
        {{seriesTitle}}
      </router-link>
    </div>
    <div class="nav-right">
      <div class="nav-item">&nbsp;&nbsp;</div>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  props: {
    seriesId: String,
    seriesTitle: String
  }

}
</script>

<style>

</style>
