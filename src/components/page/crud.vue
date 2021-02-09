<template>

    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 增删改查模板
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="编号"></el-table-column>
                <el-table-column prop="mid" label="维修记录Id"></el-table-column>
                <el-table-column prop="faultType" label="故障类型"></el-table-column>
                <el-table-column prop="faultReason" label="故障原因"></el-table-column>
                <el-table-column prop="faultDesc" label="故障描述"></el-table-column>
                <el-table-column prop="faultImgs" label="故障图片"></el-table-column>
                <el-table-column prop="delFlag" label="删除标记"></el-table-column>
                <el-table-column prop="remarks" label="备注"></el-table-column>
                <el-table-column prop="createBy" label="创建人"></el-table-column>
                <el-table-column prop="createDate" label="创建时间"></el-table-column>
                <el-table-column prop="updateBy" label="更新人"></el-table-column>
                <el-table-column prop="updateDate" label="更新时间"></el-table-column>

            </el-table>

        </div>
    </div>
</template>

<script>
    export default {
        name: "crud",
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
                this.$axios.get('/api/equipRepair/selectAll').then(res =>{
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