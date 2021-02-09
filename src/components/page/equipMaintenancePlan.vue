<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 设备保养计划
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-select v-model="query.address" placeholder="设备类型" class="handle-select mr10">
                    <el-option key="1" label="" value=""></el-option>
                    <el-option key="2" label="电子秤" value="0001"></el-option>
                    <el-option key="3" label="读卡器" value="0002"></el-option>
                    <el-option key="4" label="条码打印机" value="0003"></el-option>
                    <el-option key="5" label="安卓PAD" value="0004"></el-option>
                    <el-option key="6" label="红外对射枪" value="0005"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" icon="el-icon-zoom-in" @click="handleAdd">添加</el-button>
                <el-button icon="el-icon-download" @click="exportExcel">导出</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                height="800"
                class="table"
                id="out-table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column prop="equipTypeString" label="设备类型" sortable width="200"></el-table-column>
                    <el-table-column prop="cycleString" label="保养周期" sortable width="200"></el-table-column>
                    <el-table-column prop="warnTime" label="预警时间" sortable width="130"></el-table-column>
                    <el-table-column prop="maintenance" label="保养内容"></el-table-column>
                    <el-table-column prop="userName" label="保养人" sortable width="200"></el-table-column>



<!--                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>-->
<!--                <el-table-column prop="name" label="用户名"></el-table-column>-->
<!--                <el-table-column label="账户余额">-->
<!--                    <template slot-scope="scope">￥{{scope.row.money}}</template>-->
<!--                </el-table-column>-->
<!--                <el-table-column label="头像(查看大图)" align="center">-->
<!--                    <template slot-scope="scope">-->
<!--                        <el-image-->
<!--                            class="table-td-thumb"-->
<!--                            :src="scope.row.thumb"-->
<!--                            :preview-src-list="[scope.row.thumb]"-->
<!--                        ></el-image>-->
<!--                    </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column prop="address" label="地址"></el-table-column>-->
<!--                <el-table-column label="状态" align="center">-->
<!--                    <template slot-scope="scope">-->
<!--                        <el-tag-->
<!--                            :type="scope.row.state==='成功'?'success':(scope.row.state==='失败'?'danger':'')"-->
<!--                        >{{scope.row.state}}</el-tag>-->
<!--                    </template>-->
<!--                </el-table-column>-->

<!--                <el-table-column prop="date" label="注册时间"></el-table-column>-->
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible"  width="30%">
            <el-form ref="form" :model="form" label-width="95px" :rules="rules">
                <el-form-item label="编号" v-show="false"><el-input :disabled="true" v-model="form.id"></el-input></el-form-item>
                <el-form-item label="设备类型" prop="equipType">
                    <el-select v-model="form.equipType" placeholder="请选择设备类型">
                        <el-option key="1" label="电子秤" value="0001"></el-option>
                        <el-option key="2" label="读卡器" value="0002"></el-option>
                        <el-option key="3" label="条码打印机" value="0003"></el-option>
                        <el-option key="4" label="安卓PAD" value="0004"></el-option>
                        <el-option key="5" label="红外对射枪" value="0005"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="保养周期" prop="cycle">
                    <el-select v-model="form.cycle" placeholder="请选择保养周期">
                        <el-option key="1" label="周" value="week"></el-option>
                        <el-option key="2" label="月" value="month"></el-option>
                        <el-option key="3" label="年" value="year"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预警时间" prop="warnTime"><el-input v-model="form.warnTime"></el-input></el-form-item>
                <el-form-item label="保养人姓名" prop="userName"><el-input v-model="form.userName"></el-input></el-form-item>
                <el-form-item label="保养内容" prop="maintenance"><el-input type="textarea"  v-model="form.maintenance"></el-input></el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('form')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑添加框 -->
        <el-dialog title="添加" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="95px" :rules="rules">
                <el-form-item label="编号" v-show="false"><el-input :disabled="true" v-model="form.id"></el-input></el-form-item>
                <el-form-item label="设备类型" prop="equipType">
                    <el-select v-model="form.equipType" placeholder="请选择设备类型">
                        <el-option key="1" label="电子秤" value="0001"></el-option>
                        <el-option key="2" label="读卡器" value="0002"></el-option>
                        <el-option key="3" label="条码打印机" value="0003"></el-option>
                        <el-option key="4" label="安卓PAD" value="0004"></el-option>
                        <el-option key="5" label="红外对射枪" value="0005"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="保养周期" prop="cycle">
                    <el-select v-model="form.cycle" placeholder="请选择保养周期">
                        <el-option key="1" label="周" value="week"></el-option>
                        <el-option key="2" label="月" value="mouth"></el-option>
                        <el-option key="3" label="年" value="year"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预警时间" prop="warnTime"><el-input v-model="form.warnTime"></el-input></el-form-item>
                <el-form-item label="保养人姓名" prop="userName"><el-input v-model="form.userName"></el-input></el-form-item>
                <el-form-item label="保养内容" prop="maintenance"><el-input type="textarea"  v-model="form.maintenance"></el-input></el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd('form')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
export default {
    name: 'equipMaintenancePlan',
    data() {
        return {
            query: {
                address: '',
                name: '',
                pageIndex: 0,
                pageSize: 50
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            rules: {
                equipType: [
                    { required: true, message: '请选择设备类型', trigger: 'change' }
                ],
                cycle: [
                    { required: true, message: '请选择保养周期', trigger: 'change' }
                ],
                warnTime: [
                    { required: true, message: '请输入预警时间', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                userName: [
                    { required: true, message: '请输入保养人姓名', trigger: 'blur' },
                    { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
                ],
                maintenance: [
                    { required: true, message: '请输入保养内容', trigger: 'blur' },
                    { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
                ]
            }
        };
    },
    created() {
        this.getData();
    },
    methods: {

        toString(){
            const length = this.tableData.length;
            for (let i = 0; i < length; i++) {
                this.tableData[i].equipTypeString = "3";
                if(this.tableData[i].equipType=="0001")
                    this.tableData[i].equipTypeString="电子秤";
                else if(this.tableData[i].equipType=="0002")
                    this.tableData[i].equipTypeString="读卡器";
                else if(this.tableData[i].equipType=="0003")
                    this.tableData[i].equipTypeString="条码打印机";
                else if(this.tableData[i].equipType=="0004")
                    this.tableData[i].equipTypeString="安卓PAD";
                else if(this.tableData[i].equipType=="0005")
                    this.tableData[i].equipTypeString="红外对射枪";

                if(this.tableData[i].cycle=="week")
                    this.tableData[i].cycleString="每周";
                else if(this.tableData[i].cycle=="mouth")
                    this.tableData[i].cycleString="每月";
                else if(this.tableData[i].cycle=="year")
                    this.tableData[i].cycleString="每年";
            }
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            this.$axios.get('/api/equipMaintenancePlan/selectAll').then(res =>{
                this.tableData = res.data;
                this.toString();
            })
        },
        // 触发搜索按钮
        handleSearch() {
            this.$axios.get('/api/equipMaintenancePlan/selectByType?equip_type='+this.query.address).then(res =>{
                this.tableData = res.data;
                this.toString();

            })
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.tableData.splice(index, 1);
                    this.$axios.get('/api/equipMaintenancePlan/delete?id='+row.id).then(res=>{
                        this.$message.success("删除成功");
                    })
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].id + ' ';
                this.$axios.get('/api/equipMaintenancePlan/delete?id='+this.multipleSelection[i].id).then(res=>{
                })
            }
            this.$message.success(`删除了${str}`);
            this.getData();
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            console.log(this.form)
            this.editVisible = true;
        },
        //添加操作
        handleAdd(index, row) {
            this.addVisible = true;
        },
        // 保存编辑，加输入校验
        saveEdit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.editVisible = false;
                    this.$axios.post('/api/equipMaintenancePlan/edit',this.form).then(res=>{
                        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                    })
                    this.$set(this.tableData, this.idx, this.form);
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        // 保存添加,输入校验
        saveAdd(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.addVisible = false;
                    this.$axios.post('/api/equipMaintenancePlan/add',this.form).then(res=>{
                        this.$message.success(`添加成功`);
                    })
                    this.getData();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            // this.query.pageIndex = val;
            this.getData();
        },
        exportExcel () {
            /* out-table关联导出的dom节点  */
            var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
            /* get binary string as output */
            var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
            try {
                FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '设备保养计划.xlsx')
            } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
            return wbout
        }

    },

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
