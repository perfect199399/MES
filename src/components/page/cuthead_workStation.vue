<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 设备维修记录
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>

                <el-select v-model="query.select" placeholder="产品名称" class="handle-select mr10">
                    <el-option key="1" label="产品名称" value="name"></el-option>
                    <el-option key="2" label="条码" value="qrcode"></el-option>
                </el-select>

                <el-input v-model="query.desc" placeholder="请输入相应查询条件" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-zoom-in" @click="handleAdd">添加</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>


                  <el-table-column prop="time" label="日期"></el-table-column>
                  <el-table-column prop="employeename" label="员工姓名"></el-table-column>


            </el-table>


            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>


</template>


<script>
import { fetchData } from '../../api/index';
export default {
    name: 'bom_product',
    data() {
        return {
            query: {
                address: 'equip_no',
                name: '',
                pageIndex: 0,
                pageSize: 50
            },
            tableData: [],
            search:{},
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
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
            this.$axios.get('/api/logDecaptitatingbizrecords/selectAll').then(res =>{
                this.tableData = res.data;

            })
        },
        // 触发搜索按钮
        handleSearch() {
          this.$axios.get('/api/basProduct/search?select='+this.query.select+'&desc='+ this.query.desc).then(res =>{
            this.tableData = res.data;
          })
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            // this.query.pageIndex = val;
            this.getData();
        }
    }
};
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
