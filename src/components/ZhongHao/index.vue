<template>
  <div>
    <svg-icon icon-class="download" @click="handleDownload"/>
  </div>
</template>

<script>
export default {
  name: 'url',
  data() {
    return {
    }
  },
  methods: {
    handleDownload() {
      // window.open(this.url)
    }
  }
}
</script>