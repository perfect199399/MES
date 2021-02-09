<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img :src="imgUrl" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        上次登录时间：
                        <span>{{loginData}}</span>
                    </div>
                    <div class="user-info-list">
                        上次登录IP：
                        <span>{{loginIp}}</span>
                    </div>
                </el-card>
                <el-card shadow="hover" style="height:252px;">
                    <div slot="header" class="clearfix">
                        <span>设备报修数量</span>
                    </div>
                    <el-progress :percentage="parseFloat((will*100/all)).toFixed(1)" color="#42b983"></el-progress>未派工
                    <el-progress :percentage="parseFloat((ing*100/all)).toFixed(1)" color="#f1e05a"></el-progress>维修中
                    <el-progress :percentage="parseFloat((ed*100/all)).toFixed(1)"></el-progress>已完工
<!--                    <el-progress :percentage="5.9" color="#f56c6c"></el-progress>切片-->
                </el-card>
            </el-col>

            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{lognums}}</div>
                                    <div>用户访问量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{doingnum}}</div>
                                    <div>进行订单</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{donenum}}</div>
                                    <div>完成订单</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:403px;">
                    <div slot="header" class="clearfix">
                        <span>设备故障待处理</span>
                    </div>
                    <el-table :show-header="false" :data="todoList" style="width:100%;">
<!--                        <el-table-column width="40">-->
<!--                            <template slot-scope="scope">-->
<!--                                <el-checkbox v-model="scope.row.status"></el-checkbox>-->
<!--                            </template>-->
<!--                        </el-table-column>-->
                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="todo-item" >
                                    <a style="color: #2d8cf0">
                                        {{scope.row.equipLocString}}
                                    </a>的
                                    <span style="color: #2d8cf0">
                                        {{scope.row.equipTypeString}}
                                    </span>，编号
                                    <span style="color: #2d8cf0">
                                        {{scope.row.equipNo}}
                                    </span>，在
                                    <span style="color: #2d8cf0">
                                        {{scope.row.createDateString}}
                                    </span>报修，现在的状态是
                                    <span style="color: #2d8cf0">
                                        {{scope.row.statusString}}
                                    </span>
                                </div>
                            </template>
                        </el-table-column>
<!--                        <el-table-column width="60">-->
<!--                            <template>-->
<!--                                <i class="el-icon-edit"></i>-->
<!--                                <i class="el-icon-delete"></i>-->
<!--                            </template>-->
<!--                        </el-table-column>-->
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Schart from 'vue-schart';
import bus from '../common/bus';
export default {
    name: 'dashboard',
    loginIp: '0.0.0.0',
    loginDate: '0-0-0-0',
    userType: '',
    photo: '../../assets/img/img2.jpg',
    data() {
        return {
            /**
             * 设备报修数量计算百分比
             */
            will:0,
            ing:0,
            ed:0,
            all:0,
            // name: localStorage.getItem('ms_username'),
            todoList: [],
            data: [

            ],
            options: {
                type: 'bar',
                title: {
                    text: '设备数量总览'
                },
                xRorate: 25,
                labels: ['电子秤', '读卡器', '条码打印机', '安卓PAD', '红外对射枪'],
                datasets: [
                    {
                        label: '重量',
                        data: [5, 2, 4, 7, 1]
                    },
                    {
                        label: '体积',
                        data: [4, 2, 4, 1, 6]
                    },
                    {
                        label: '长度',
                        data: [7, 1, 3, 1, 6]
                    }
                ]
            },
            options2: {
                type: 'line',
                title: {
                    text: '设备报修来源管控'
                },
                labels: ['金龙鱼产线', '鱿鱼丝产线', '金枪鱼产线', '马哈鱼产线'],
                datasets: [
                    {
                        label: '电子秤',
                        data: [1, 2, 3, 4, 5]
                    },
                    {
                        label: '读卡器',
                        data: [1, 4, 3, 2, 1]
                    },
                    {
                        label: '条码打印机',
                        data: [5, 6, 1, 3, 2]
                    },
                    {
                        label: '安卓PAD',
                        data: [5, 6, 1, 3, 2]
                    },
                    {
                        label: '红外对射枪',
                        data: [5, 6, 1, 3, 2]
                    }
                ]
            }
        };
    },
    components: {
        Schart
    },
    computed: {
        role() {
            return this.userType === '1' ? '超级管理员' : '普通用户';
        },
        imgUrl: function () {
            return this.photo;
        },
        lognums: function () {
            return localStorage.getItem("lognums")
        },
        doingnum: function () {
            return localStorage.getItem("doingnum")
        },
        donenum: function () {
            return localStorage.getItem("donenum")
        }

    },
    created() {
        this.$axios.get('/api/equipFaultReport/selectAll').then(res =>{
            this.todoList = res.data;
            this.toString();
        })
        this.getlognums();
        this.frashdata();
        this.ChartData1();
        this.ChartData2();
    },
    methods: {
        toString(){
            const length = this.todoList.length;
            this.all = length;
            for (let i = 0; i < length; i++) {
                this.todoList[i].equipTypeString = "3";
                if(this.todoList[i].equipType=="0001")
                    this.todoList[i].equipTypeString="电子秤";
                else if(this.todoList[i].equipType=="0002")
                    this.todoList[i].equipTypeString="读卡器";
                else if(this.todoList[i].equipType=="0003")
                    this.todoList[i].equipTypeString="条码打印机";
                else if(this.todoList[i].equipType=="0004")
                    this.todoList[i].equipTypeString="安卓PAD";
                else if(this.todoList[i].equipType=="0005")
                    this.todoList[i].equipTypeString="红外对射枪";
                var buytime = new Date(this.todoList[i].createDate);
                var month= buytime.getMonth()+1;
                this.todoList[i].createDateString = buytime.getFullYear()+"年"+month+"月"+buytime.getDate()+"日"+buytime.getHours()+"时"+buytime.getMinutes()+"分";

                if(this.todoList[i].status=="0001")
                {
                    this.will = this.will+1;
                    this.todoList[i].statusString="未派工";
                }
                else if(this.todoList[i].status=="0002")
                {
                    this.todoList[i].statusString="维修中";
                    this.ing = this.ing+1;
                }
                else if(this.todoList[i].status=="0003")
                {
                    this.ed = this.ed+1;
                    this.todoList[i].statusString="已完工";
                }
                if(this.todoList[i].equipLoc=="0001")
                    this.todoList[i].equipLocString="金龙鱼产线";
                else if(this.todoList[i].equipLoc=="0002")
                    this.todoList[i].equipLocString="鱿鱼丝产线";
                else if(this.todoList[i].equipLoc=="0003")
                    this.todoList[i].equipLocString="金枪鱼产线";
                else if(this.todoList[i].equipLoc=="0004")
                    this.todoList[i].equipLocString="马哈鱼产线";
            }
        },
        changeDate() {
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        },
        frashdata(){
            var obj=JSON.parse(localStorage.getItem("userInfo"));
            this.loginIp = obj.loginIp;
            var logintime = new Date(obj.loginDate);
            var month= logintime.getMonth()+1;
            this.loginData = logintime.getFullYear()+"年"+month+"月"+logintime.getDate()+"日"+logintime.getHours()+"时"+logintime.getMinutes()+"分";
            this.name = obj.name;
            this.photo = require("../../assets/img/"+obj.photo);
            this.userType = obj.userType;
        },
        getlognums(){
            this.$axios.get('/api/radis/get?key=lognums').then(res=>{
                localStorage.setItem('lognums', res.data.data);
            })
            this.$axios.get('/api/orders/doingNum').then(res=>{
                localStorage.setItem('doingnum', res.data.data);
            })
            this.$axios.get('/api/orders/doneNum').then(res=>{
                localStorage.setItem('donenum', res.data.data);
            })
        },
        ChartData1() {
            this.$axios.get('/api/equipReport/ChartData1').then(res=>{
                this.options.datasets[0].data=res.data[0];
                this.options.datasets[1].data=res.data[1];
                this.options.datasets[2].data=res.data[2];
            })
        },
        ChartData2() {
            this.$axios.get('/api/equipFaultReport/ChartData2').then(res=>{
                this.options2.datasets[0].data=res.data[0];
                this.options2.datasets[1].data=res.data[1];
                this.options2.datasets[2].data=res.data[2];
                this.options2.datasets[3].data=res.data[3];
                this.options2.datasets[4].data=res.data[4];
            })

        }
        // handleListener() {
        //     bus.$on('collapse', this.handleBus);
        //     // 调用renderChart方法对图表进行重新渲染
        //     window.addEventListener('resize', this.renderChart);
        // },
        // handleBus(msg) {
        //     setTimeout(() => {
        //         this.renderChart();
        //     }, 200);
        // },
        // renderChart() {
        //     this.$refs.bar.renderChart();
        //     this.$refs.line.renderChart();
        // }
    }
};
</script>


<style scoped>
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

.todo-item {
    font-size: 14px;
}

.todo-item-del {
    text-decoration: line-through;
    color: #999;
}

.schart {
    width: 100%;
    height: 300px;
}
</style>
