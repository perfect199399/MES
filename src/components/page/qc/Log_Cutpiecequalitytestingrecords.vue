<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 切片检测
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-form ref="form" :model="form" :inline="true" label-width="95px" :rules="rules">
                <el-form-item label="开始时间">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.startTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker type="date" placeholder="选择日期" v-model="form.endTime" style="width: 100%;"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
                </el-form-item>
            </el-form>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-card shadow="hover">
                        <schart ref="bar" class="schart" canvasId="bar" :options="options"></schart>
                    </el-card>
                </el-col>

            </el-row>
        </div>
    </div>
</template>

<script>
    import Schart from "vue-schart";

    export default {
        name: "Log_Cutpiecequalitytestingrecords",
        data() {
            return {
                todoList: [''],
                multipleSelection: [],
                delList: [],
                form: {
                    endTime:'',
                    startTime:''
                },
                options: {
                    type: 'bar',
                    title: {
                        text: '切片工位成品率'
                    },
                    xRorate: 25,
                    labels: ['1'],
                    datasets: [
                        {
                            label: '成品率',
                            data: [1]
                        }
                    ]
                },
            };
        },
        components: {
            Schart
        },
        created() {
            this.ChartData33();
        },
        methods: {
            handleSearch() {
                let date_value = this.formatLongDate(this.form.startTime);
                let date_value2 = this.formatLongDate(this.form.endTime);
                this.$axios.get('/api/logCutpiecequalitytestingrecords/selectAll?startTime='+date_value+'&endTime='+date_value2).then(res=>{
                    if (res.data[0].length==0)
                    {
                        this.options.datasets[0].data=this.todoList;
                        this.options.labels=this.todoList;
                        this.$message.error('所选时间段内没有记录');

                    }else{
                        this.options.datasets[0].data=res.data[1];
                        this.options.labels=res.data[0];
                    }
                })
            },
            formatLongDate (date) {
                let myyear = date.getFullYear();
                let mymonth = date.getMonth() + 1;
                let myweekday = date.getDate();
                let myHour = date.getHours();
                let myMin = date.getMinutes();
                let mySec = date.getSeconds();

                if (mymonth < 10) {
                    mymonth = '0' + mymonth;
                }
                if (myweekday < 10) {
                    myweekday = '0' + myweekday;
                }
                if (myHour < 10) {
                    myHour = '0' + myHour;
                }
                if (myMin < 10) {
                    myMin = '0' + myMin;
                }
                if (mySec < 10) {
                    mySec = '0' + mySec;
                }
                return (myyear + '' + mymonth + '' + myweekday + '' + myHour + '' + myMin + '' + mySec);
            },

            ChartData33(){
                this.form.startTime = new Date();
                this.form.endTime = new Date();

                this.$axios.get('/api/logCutpiecequalitytestingrecords/selectAll?startTime=20111111121212&endTime=20911111121212').then(res=>{
                    this.options.datasets[0].data=res.data[1];
                    this.options.labels=res.data[0];
                })

            }

        }
    };

</script>

<style scoped>
    .schart {
        width: 100%;
        height: 300px;
    }
</style>