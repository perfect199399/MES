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
            <div class="handle-box">
                <el-select v-model="query.address1" placeholder="设备类型" class="handle-select mr10">
                    <el-option key="1" label="" value=""></el-option>
                    <el-option key="2" label="电子秤" value="0001"></el-option>
                    <el-option key="3" label="读卡器" value="0002"></el-option>
                    <el-option key="4" label="条码打印机" value="0003"></el-option>
                    <el-option key="5" label="安卓PAD" value="0004"></el-option>
                    <el-option key="6" label="红外对射枪" value="0005"></el-option>
                </el-select>
                <el-select v-model="query.address2" placeholder="设备规格" class="handle-select mr10">
                    <el-option key="1" label="" value=""></el-option>
                    <el-option key="2" label="重量" value="0001"></el-option>
                    <el-option key="3" label="长度" value="0002"></el-option>
                    <el-option key="4" label="体积" value="0003"></el-option>
                </el-select>
                <el-input v-model="query.code" placeholder="输入编号查询" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <!--        增加记录        -->
                <el-button type="primary" icon="el-icon-zoom-in" @click="handleAdd">添加</el-button>
                <el-button icon="el-icon-download" @click="exportExcel">导出</el-button>

            </div>
            <el-table
                    :data="tableData"
                    border
                    class="table"
                    id="out-table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>

                <el-table-column prop="qrcode" label="设备条码"></el-table-column>
                <el-table-column prop="typeString" label="设备类型value"></el-table-column>
                <el-table-column prop="specString" label="设备规格value"></el-table-column>
                <el-table-column prop="stationname" label="所属工站"></el-table-column>
                <el-table-column prop="cellname" label="所属工位"></el-table-column>
                <el-table-column prop="padsc" label="分辨率"></el-table-column>
                <el-table-column prop="padnucleus" label="核心数"></el-table-column>
                <el-table-column prop="padmemory" label="内存"></el-table-column>
                <el-table-column prop="capacity" label="电池容量"></el-table-column>
                <el-table-column prop="supplier" label="供应商"></el-table-column>
                <el-table-column prop="manufacturer" label="生产商"></el-table-column>
                <el-table-column prop="factorynumber" label="出厂编号"></el-table-column>
                <el-table-column prop="purpose" label="用途"></el-table-column>
                <el-table-column prop="buydate" label="采购日期"></el-table-column>
                <el-table-column prop="person" label="资产负责人"></el-table-column>
                <el-table-column prop="organization" label="所有权部门"></el-table-column>

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

        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="95px">
                <el-form-item label="id"><el-input v-model="form.id"></el-input></el-form-item>
                <el-form-item label="设备条码"><el-input v-model="form.qrcode"></el-input></el-form-item>
                <el-form-item label="设备类型value"><el-input v-model="form.type"></el-input></el-form-item>
                <el-form-item label="设备规格value"><el-input v-model="form.spec"></el-input></el-form-item>
                <el-form-item label="所属工站"><el-input v-model="form.stationId"></el-input></el-form-item>
                <el-form-item label="所属工位"><el-input v-model="form.cellId"></el-input></el-form-item>
                <el-form-item label="分辨率"><el-input v-model="form.padsc"></el-input></el-form-item>
                <el-form-item label="核心数"><el-input v-model="form.padnucleus"></el-input></el-form-item>
                <el-form-item label="内存"><el-input v-model="form.padmemory"></el-input></el-form-item>
                <el-form-item label="电池容量"><el-input v-model="form.capacity"></el-input></el-form-item>
                <el-form-item label="供应商"><el-input v-model="form.supplier"></el-input></el-form-item>
                <el-form-item label="生产商"><el-input v-model="form.manufacturer"></el-input></el-form-item>
                <el-form-item label="出厂编号"><el-input v-model="form.factorynumber"></el-input></el-form-item>
                <el-form-item label="用途"><el-input v-model="form.purpose"></el-input></el-form-item>
                <el-form-item label="采购日期"><el-input v-model="form.buydate"></el-input></el-form-item>
                <el-form-item label="资产负责人"><el-input v-model="form.person"></el-input></el-form-item>
                <el-form-item label="所有权部门"><el-input v-model="form.organization"></el-input></el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加弹出框 -->
        <el-dialog title="添加" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form" label-width="95px">
                <el-form-item label="id"><el-input v-model="form.id"></el-input></el-form-item>
                <el-form-item label="设备条码"><el-input v-model="form.qrcode"></el-input></el-form-item>
                <el-form-item label="设备类型">
                    <el-select v-model="form.type" placeholder="设备类型" class="handle-select mr10">
                    <el-option key="1" label="电子秤" value="0001"></el-option>
                    <el-option key="2" label="读卡器" value="0002"></el-option>
                    <el-option key="3" label="条码打印机" value="0003"></el-option>
                    <el-option key="4" label="安卓PAD" value="0004"></el-option>
                    <el-option key="5" label="红外对射枪" value="0005"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备规格"><el-input v-model="form.spec"></el-input></el-form-item>
                <el-form-item label="所属工站"><el-input v-model="form.stationId"></el-input></el-form-item>
                <el-form-item label="所属工位"><el-input v-model="form.cellId"></el-input></el-form-item>
                <el-form-item label="分辨率"><el-input v-model="form.padsc"></el-input></el-form-item>
                <el-form-item label="核心数"><el-input v-model="form.padnucleus"></el-input></el-form-item>
                <el-form-item label="内存"><el-input v-model="form.padmemory"></el-input></el-form-item>
                <el-form-item label="电池容量"><el-input v-model="form.capacity"></el-input></el-form-item>
                <el-form-item label="供应商"><el-input v-model="form.supplier"></el-input></el-form-item>
                <el-form-item label="生产商"><el-input v-model="form.manufacturer"></el-input></el-form-item>
                <el-form-item label="出厂编号"><el-input v-model="form.factorynumber"></el-input></el-form-item>
                <el-form-item label="用途"><el-input v-model="form.purpose"></el-input></el-form-item>
                <el-form-item label="采购日期"><el-input v-model="form.buydate"></el-input></el-form-item>
                <el-form-item label="资产负责人"><el-input v-model="form.person"></el-input></el-form-item>
                <el-form-item label="所有权部门"><el-input v-model="form.organization"></el-input></el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
    export default {
        name: "BasPad",
        data() {
            return {
                query: {
                    address1: '',
                    address2: '',
                    code: '',
                    pageIndex: 0,
                    pageSize: 50
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                addVisible: false,
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
            toString(){
                const length = this.tableData.length;
                for (let i = 0; i < length; i++) {
                    this.tableData[i].typeString = "3";
                    if(this.tableData[i].type=="0001")
                        this.tableData[i].typeString="电子秤";
                    else if(this.tableData[i].type=="0002")
                        this.tableData[i].typeString="读卡器";
                    else if(this.tableData[i].type=="0003")
                        this.tableData[i].typeString="条码打印机";
                    else if(this.tableData[i].type=="0004")
                        this.tableData[i].typeString="安卓PAD";
                    else if(this.tableData[i].type=="0005")
                        this.tableData[i].typeString="红外对射枪";
                    if(this.tableData[i].spec=="0001")
                        this.tableData[i].specString="重量";
                    else if(this.tableData[i].spec=="0002")
                        this.tableData[i].specString="长度";
                    else if(this.tableData[i].spec=="0003")
                        this.tableData[i].specString="体积";
                    // var buytime = new Date(this.tableData[i].buyDate);
                    // var month= buytime.getMonth()+1;
                    // this.tableData[i].buyDateString = buytime.getFullYear()+"年"+month+"月"+buytime.getDate()+"日"+buytime.getHours()+"时"+buytime.getMinutes()+"分";
                }
            },
            getData() {
                this.$axios.get('/api/basPad/selectAll').then(res =>{
                    this.tableData = res.data;
                    this.toString();
                })
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                console.log(this.form)
                this.editVisible = true;
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.tableData.splice(index, 1);
                        this.$axios.get('/api/basPad/delete?id='+row.id).then(res=>{
                            this.$message.success("删除成功");
                        })
                    })
                    .catch(() => {});
            },
            // 保存编辑
            saveEdit() {
                console.log(this.form)

                this.editVisible = false;
                this.$axios.post('/api/basPad/edit',this.form).then(res=>{
                    this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                })
                this.$set(this.tableData, this.idx, this.form);
            },
            // 保存添加
            saveAdd() {
                console.log(this.form)

                this.addVisible = false;
                this.$axios.post('/api/basPad/add',this.form).then(res=>{
                    this.$message.success(`添加成功`);
                })
                this.getData();
            },
            // 触发搜索按钮
            handleSearch() {
                this.$axios.get('/api/basPad/select?type='+this.query.address1+'&spec='+this.query.address2+'&id='+this.query.code).then(res =>{
                    this.tableData = res.data;
                    this.toString();
                })
                this.toString();

            },
            //添加导出操作
            handleAdd(index, row) {
                this.addVisible = true;
            },
            exportExcel () {
                /* out-table关联导出的dom节点  */
                var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
                /* get binary string as output */
                var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
                try {
                    FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '安卓PAD.xlsx')
                } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
                return wbout
            },

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