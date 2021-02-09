<template>

    <div>
        <div class="container">
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" @selection-change="handleSelectionChange">

                <el-table-column prop="batchnum" label="批号"></el-table-column>
                <el-table-column prop="mtype" label="材料类型"></el-table-column>
                <el-table-column prop="mname" label="材料名称"></el-table-column>
                <el-table-column prop="suppliername" label="供应商名称"></el-table-column>
                <el-table-column prop="purchasedate" label="采购日期"></el-table-column>
                <el-table-column prop="quantity" label="库存"></el-table-column>
<!--                <el-table-column prop="吨" label="单位"></el-table-column>-->
            </el-table>
          </div>
    </div>
</template>

<script>
    export default {
        name: "sourcelist",
        data() {
            return {
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1
            };
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                this.$axios.get('/api/material/selectAll').then(res =>{
                    this.tableData = res.data;
                })
            }
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .table {
        width: 100%;
        font-size: 14px;
    }
    .red {
        color: #ff0000;
    }
    .mr10 {
        margin-right: 10px;
    }
    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>