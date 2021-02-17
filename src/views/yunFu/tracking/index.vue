<template>
  <div class="app-container">
    <div v-if="show==0">
      <a class="lin" href="http://171.8.68.148:8082/Account/Login" target="_blank"
         >班列运踪跟踪系统</a>
    </div>
    <div v-if="show==1">
      <el-button type="text"
                 icon="el-icon-back"
                 @click="back">返回</el-button>
      <iframe src="http://171.8.68.148:8082/Account/Login"
              frameborder="0"
              width="100%"
              scrolling="auto"
              height="650"></iframe>
    </div>
  </div>
</template>

<script>


export default {
  name: 'Tracking',
  data () {
    return {
      show: 0
    }
  },
  created () {

  },
  methods: {
    togo () {
      this.show = 1
       
    },
    back () {
      this.show = 0
    }
  }
};
</script>
<style scoped>
.lin {
  color: blue;
}
a:hover {
  color: red;
  text-decoration: underline;
}
</style>