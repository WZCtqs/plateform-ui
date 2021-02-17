<template>
  <div class="dashboard-editor-container">


    <div >
      <!-- 灯笼1 -->
      <div class="deng-box" style="z-index:999">
        <div class="deng">
          <div class="xian"></div>
          <div class="deng-a">
            <div class="deng-b"><div class="deng-t">节</div></div>
          </div>
          <div class="shui shui-a"><div class="shui-c"></div><div class="shui-b"></div></div>
        </div>
      </div>

      <!-- 灯笼2 -->
      <div class="deng-box1" style="z-index:999">
        <div class="deng">
          <div class="xian"></div>
          <div class="deng-a">
            <div class="deng-b"><div class="deng-t">春</div></div>
          </div>
          <div class="shui shui-a"><div class="shui-c"></div><div class="shui-b"></div></div>
        </div>
      </div>
      <!-- 灯笼3 -->
      <div class="deng-box2" style="z-index:999">
        <div class="deng">
          <div class="xian"></div>
          <div class="deng-a">
            <div class="deng-b"><div class="deng-t">快</div></div>
          </div>
          <div class="shui shui-a"><div class="shui-c"></div><div class="shui-b"></div></div>
        </div>
      </div>
      <!-- 灯笼4 -->
      <div class="deng-box3" style="z-index:999">
        <div class="deng">
          <div class="xian"></div>
          <div class="deng-a">
            <div class="deng-b"><div class="deng-t">乐</div></div>
          </div>
          <div class="shui shui-a"><div class="shui-c"></div><div class="shui-b"></div></div>
        </div>
      </div>
    </div>
    <panel-group @handleSetLineChartData="handleSetLineChartData" />





    <el-row :gutter="32">
      <el-col :lg="16">
         <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
          <div class="dateTabs">
            <span :class="currentNum=='0'?'current':''" @click="changeNumFn('0')">12月</span>
            <span :class="currentNum=='1'?'current':''" @click="changeNumFn('1')">30天</span>
            <span :class="currentNum=='2'?'current':''" @click="changeNumFn('2')">7天</span>
            <span :class="currentNum=='3'?'current':''" @click="changeNumFn('3')">今日</span></div>
          <line-chart :chart-data="lineChartData" />
        </el-row>
      </el-col>
      <el-col :lg="8">
            <el-card class="box-card">
            <div slot="header" class="clearfix greyHeader" >
              <div class="dateTabs">
                <span :class="currentNum2=='0'?'current':''" @click="changeNumFn2('0')">当前</span>
                <span :class="currentNum2=='1'?'current':''" @click="changeNumFn2('1')">历史</span>
              </div>
              <span>询价后订舱率排行榜</span>
            </div>
            <div class="text item" style=" margin-top:-20px;">
              <template>
                <ul class="tableData3css" >
                  <li v-for="(item,index) in tableData3" :key="index"> {{ item }}</li>
                </ul>
                <div style="text-align:right;"> 更多>> </div>
              </template>

            </div>
          </el-card>

      </el-col>
    </el-row>

    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row> -->

     <el-row :gutter="40" class="panel-group">
    <el-col :xs="24" :sm="24" :lg="12" :xl="8" class="card-panel-col">
      <el-card class="box-card">
      <div slot="header" class="clearfix greyHeader" >
        <span>客户询价排行榜</span>
      </div>
      <div class="text item">
        <div class="dateTabs">
          <span :class="currentNum1=='0'?'current':''" @click="changeNumFn1('0')">今日排行</span>
          <span :class="currentNum1=='1'?'current':''" @click="changeNumFn1('1')">七日排行</span>
          <span :class="currentNum1=='2'?'current':''" @click="changeNumFn1('2')">月排行</span>
        </div>
        <template>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="date"
              label="排名"
              >
            </el-table-column>
            <el-table-column
              prop="name"
              label="客户">
            </el-table-column>
            <el-table-column
              prop="address"
              label="提交询价">
            </el-table-column>
            <el-table-column
              prop="successNum"
              label="询价成功数量">
            </el-table-column>

          </el-table>
        </template>

      </div>
    </el-card>
    </el-col>
    <el-col :xs="24" :sm="24" :lg="12" :xl="8" class="card-panel-col">
      <el-card class="box-card">
      <div slot="header" class="clearfix greyHeader" >
        <span>客户订舱排行榜</span>
      </div>
      <div class="text item">
        <div class="dateTabs">
          <span :class="currentNum1=='0'?'current':''" @click="changeNumFn1('0')">今日排行</span>
          <span :class="currentNum1=='1'?'current':''" @click="changeNumFn1('1')">七日排行</span>
          <span :class="currentNum1=='2'?'current':''" @click="changeNumFn1('2')">月排行</span>
        </div>
        <template>
          <el-table
            :data="tableData1"
            style="width: 100%">
            <el-table-column
              prop="date"
              label="排名"
               >
            </el-table-column>
            <el-table-column
              prop="name"
              label="客户">
            </el-table-column>
            <el-table-column
              prop="address"
              label="提交订舱">
            </el-table-column>
            <el-table-column
              prop="successNum"
              label="订舱成功数量">
            </el-table-column>

          </el-table>
        </template>

      </div>
     </el-card>
    </el-col>

    <el-col :xs="24" :sm="24" :lg="24" :xl="8" class="card-panel-col">
      <el-card class="box-card">
      <div slot="header" class="clearfix greyHeader" >
        <span>询价后订舱率排行榜</span>
      </div>
      <div class="text item">
        <div class="dateTabs">
          <span :class="currentNum1=='0'?'current':''" @click="changeNumFn1('0')">今日排行</span>
          <span :class="currentNum1=='1'?'current':''" @click="changeNumFn1('1')">七日排行</span>
          <span :class="currentNum1=='2'?'current':''" @click="changeNumFn1('2')">月排行</span>
        </div>
        <template>
          <el-table
            :data="tableData2"
            style="width: 100%">
            <el-table-column
              prop="date"
              label="排名">
            </el-table-column>
            <el-table-column
              prop="name"
              label="客户">
            </el-table-column>
            <el-table-column
              prop="address"
              label="询价成功数量">
            </el-table-column>
            <el-table-column
              prop="successNum"
              label="订舱成功数量">
            </el-table-column>
            <el-table-column
              prop="dcl"
              label="订舱率">
            </el-table-column>

          </el-table>
        </template>

      </div>
     </el-card>
    </el-col>

  </el-row>


  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      activeName2: 'first',
      currentNum:'0',
      currentNum1:'0',
      currentNum2:'0',
      lineChartData: lineChartData.newVisitis,
      tableData: [{
            date: '1',
            name: 'XX公司',
            address: '66',
            successNum:'12'
      }],
      tableData1: [{
            date: '1',
            name: 'XX公司',
            address: '66',
            successNum:'12'
      }],
      tableData2: [{
            date: '1',
            name: 'XX公司',
            address: '66',
            successNum:'12',
            dcl:'50%'
      }],
      tableData3:[
        '您还有25笔询价未审核',
        '您还有12笔订单未审核',
        '您还有5笔售后未审核',
        '您还有25笔询价未审核',
        '您还有12笔订单未审核',
        '您还有5笔售后未审核',
         '您还有12笔订单未审核',
      ]

    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    changeNumFn(obj){
      this.currentNum = obj
    },
    changeNumFn1(obj){
      this.currentNum1 = obj
    },
    changeNumFn2(obj){
      this.currentNum2 = obj
    }
  }
}
</script>

<style lang="scss" scoped>
.tableData3css{
  li{
    height:35px;
    line-height: 35px;
    border-bottom:1px solid #ccc;
  }
}
.dateTabs{
  text-align: right;
  span{
    padding:5px;
    border:1px solid #000;
    cursor:pointer;
  }
  span.current{
    background:#ccc;
  }
}

.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
.deng-box {
  position: fixed;
  top: 20px;
  right: 950px;
  z-index: -1;
}

.deng-box1 {
  position: fixed;
  top: 20px;
  right: 1250px;
  z-index: -1;
}
.deng-box2 {
  position: fixed;
  top: 20px;
  right: 650px;
  z-index: -1;
}
.deng-box3 {
   position: fixed;
   top: 20px;
   right: 350px;
   z-index: -1;
 }

.deng-box1 .deng-box2 .deng-box3 .deng {
  position: relative;
  width: 120px;
  height: 90px;
  margin: 50px;
  background: #d8000f;
  background: rgba(216, 0, 15, 0.8);
  border-radius: 50% 50%;
  -webkit-transform-origin: 50% -100px;
  -webkit-animation: swing 5s infinite ease-in-out;
  box-shadow: -5px 5px 30px 4px rgba(252, 144, 61, 1);
}

.deng {
  position: relative;
  width: 120px;
  height: 90px;
  margin: 50px;
  background: #d8000f;
  background: rgba(216, 0, 15, 0.8);
  border-radius: 50% 50%;
  -webkit-transform-origin: 50% -100px;
  -webkit-animation: swing 3s infinite ease-in-out;
  box-shadow: -5px 5px 50px 4px rgba(250, 108, 0, 1);
}

.deng-a {
  width: 100px;
  height: 90px;
  background: #d8000f;
  background: rgba(216, 0, 15, 0.1);
  margin: 12px 8px 8px 8px;
  border-radius: 50% 50%;
  border: 2px solid #dc8f03;
}

.deng-b {
  width: 45px;
  height: 90px;
  background: #d8000f;
  background: rgba(216, 0, 15, 0.1);
  margin: -4px 8px 8px 26px;
  border-radius: 50% 50%;
  border: 2px solid #dc8f03;
}

.xian {
  position: absolute;
  top: -20px;
  left: 60px;
  width: 2px;
  height: 20px;
  background: #dc8f03;
}

.shui-a {
  position: relative;
  width: 5px;
  height: 20px;
  margin: -5px 0 0 59px;
  -webkit-animation: swing 4s infinite ease-in-out;
  -webkit-transform-origin: 50% -45px;
  background: #ffa500;
  border-radius: 0 0 5px 5px;
}

.shui-b {
  position: absolute;
  top: 14px;
  left: -2px;
  width: 10px;
  height: 10px;
  background: #dc8f03;
  border-radius: 50%;
}

.shui-c {
  position: absolute;
  top: 18px;
  left: -2px;
  width: 10px;
  height: 35px;
  background: #ffa500;
  border-radius: 0 0 0 5px;
}

.deng:before {
  position: absolute;
  top: -7px;
  left: 29px;
  height: 12px;
  width: 60px;
  content: " ";
  display: block;
  z-index: 999;
  border-radius: 5px 5px 0 0;
  border: solid 1px #dc8f03;
  background: #ffa500;
  background: linear-gradient(to right, #dc8f03, #ffa500, #dc8f03, #ffa500, #dc8f03);
}

.deng:after {
  position: absolute;
  bottom: -7px;
  left: 10px;
  height: 12px;
  width: 60px;
  content: " ";
  display: block;
  margin-left: 20px;
  border-radius: 0 0 5px 5px;
  border: solid 1px #dc8f03;
  background: #ffa500;
  background: linear-gradient(to right, #dc8f03, #ffa500, #dc8f03, #ffa500, #dc8f03);
}

.deng-t {
  font-family: 华文行楷,Arial,Lucida Grande,Tahoma,sans-serif;
  font-size: 3.2rem;
  color: #dc8f03;
  font-weight: bold;
  line-height: 85px;
  text-align: center;
}

.night .deng-t,
.night .deng-box,
.night .deng-box2,
.night .deng-box3,
.night .deng-box1 {
  background: transparent !important;
}

@-moz-keyframes swing {
  0% {
    -moz-transform: rotate(-10deg)
  }

  50% {
    -moz-transform: rotate(10deg)
  }

  100% {
    -moz-transform: rotate(-10deg)
  }
}

@-webkit-keyframes swing {
  0% {
    -webkit-transform: rotate(-10deg)
  }

  50% {
    -webkit-transform: rotate(10deg)
  }

  100% {
    -webkit-transform: rotate(-10deg)
  }
}
</style>
