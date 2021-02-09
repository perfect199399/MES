<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 设备报修派工记录
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
                <el-select v-model="query.address2" placeholder="设备位置" class="handle-select mr10">
                    <el-option key="1" label="" value=""></el-option>
                    <el-option key="2" label="金龙鱼产线" value="0001"></el-option>
                    <el-option key="3" label="鱿鱼丝产线" value="0002"></el-option>
                    <el-option key="4" label="金枪鱼产线" value="0003"></el-option>
                    <el-option key="4" label="马哈鱼产线" value="0004"></el-option>
                </el-select>
                <el-select v-model="query.address3" placeholder="维修状态" class="handle-select mr10">
                    <el-option key="1" label="" value=""></el-option>
                    <el-option key="2" label="未派工" value="0001"></el-option>
                    <el-option key="3" label="维修" value="0002"></el-option>
                    <el-option key="4" label="完工" value="0003"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
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
                :row-class-name="tableRowClassName"
            >
                <el-table-column width="55" align="center"></el-table-column>
                    <el-table-column prop="equipNo" label="设备编号" sortable  width="160"></el-table-column>
                    <el-table-column prop="equipTypeString" label="设备类型" sortable width="130"></el-table-column>
                    <el-table-column prop="equipLocString" label="所处产线" sortable width="130"></el-table-column>
                    <el-table-column prop="faultDesc" label="故障描述" ></el-table-column>
                    <el-table-column prop="reportPerson" label="上报人姓名" sortable width="130"></el-table-column>
                    <el-table-column prop="createDateString" label="创建时间" sortable width="180"></el-table-column>
                    <el-table-column prop="statusString" label="状态" sortable width="130"></el-table-column>
                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button
                                    type="text"
                                    icon="el-icon-edit"
                                    @click="handleEdit(scope.$index, scope.row)"
                            >派工</el-button>
                        </template>
                    </el-table-column>
            </el-table>

        </div>
        <!-- 编辑弹出框 -->
        <el-dialog title="派工" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="95px">
                <el-form-item label="编号" v-show="false"><el-input :disabled="true" v-model="form.id"></el-input></el-form-item>
                <el-form-item label="用户名" v-show="false"><el-input :disabled="true" v-model="form.reportPerson"></el-input></el-form-item>
                <el-form-item label="设备编号"><el-input :disabled="true" v-model="form.equipNo"></el-input></el-form-item>
                <el-form-item label="设备类型" prop="equipType">
                    <el-select v-model="form.equipType" placeholder="请选择设备类型" :disabled="true">
                        <el-option key="1" label="电子秤" value="0001"></el-option>
                        <el-option key="2" label="读卡器" value="0002"></el-option>
                        <el-option key="3" label="条码打印机" value="0003"></el-option>
                        <el-option key="4" label="安卓PAD" value="0004"></el-option>
                        <el-option key="5" label="红外对射枪" value="0005"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备位置" prop="equipLoc">
                    <el-select v-model="form.equipLoc" placeholder="请选择设备所处产线" :disabled="true">
                        <el-option label="ML0001" value="0001"></el-option>
                        <el-option label="ML0002" value="0002"></el-option>
                        <el-option label="ML0003" value="0003"></el-option>
                        <el-option label="ML0004" value="0004"></el-option>
                        <el-option label="ML0005" value="0005" ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="故障描述"><el-input :disabled="true" type="textarea"  v-model="form.faultDesc"></el-input></el-form-item>
                <el-form-item label="保养人"><el-input v-model="form.maintenanceWorker"></el-input></el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'
export default {
    name: 'equipRepairPerson',
    data() {
        return {
            query: {
                address1: '',
                address2: '',
                address3: '',
                pageIndex: 0,
                pageSize: 50
            },
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
        this.getData2();
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
                var buytime = new Date(this.tableData[i].createDate);
                var month= buytime.getMonth()+1;
                this.tableData[i].createDateString = buytime.getFullYear()+"年"+month+"月"+buytime.getDate()+"日"+buytime.getHours()+"时"+buytime.getMinutes()+"分";
                if(this.tableData[i].status=="0001")
                    this.tableData[i].statusString="未派工";
                else if(this.tableData[i].status=="0002")
                    this.tableData[i].statusString="维修中";
                else if(this.tableData[i].status=="0003")
                    this.tableData[i].statusString="已完工";
                if(this.tableData[i].equipLoc=="0001")
                    this.tableData[i].equipLocString="金龙鱼产线";
                else if(this.tableData[i].equipLoc=="0002")
                    this.tableData[i].equipLocString="鱿鱼丝产线";
                else if(this.tableData[i].equipLoc=="0003")
                    this.tableData[i].equipLocString="金枪鱼产线";
                else if(this.tableData[i].equipLoc=="0004")
                    this.tableData[i].equipLocString="马哈鱼产线";

            }
        },
        getData2() {
            this.$axios.get('/api/equipFaultReport/selectAll').then(res =>{
                this.tableData = res.data;
                this.toString();
                console.log(res);
                console.log(this.tableData);
            })
            this.form.reportPerson = JSON.parse(localStorage.getItem("userInfo")).name;
        },
        handleSearch() {
            console.log('/api/equipFaultReport/select?equip_type='+this.query.address1+'&equip_loc='+this.query.address2+'&status='+this.query.address3);
            this.$axios.get('/api/equipFaultReport/select?equip_type='+this.query.address1+'&equip_loc='+this.query.address2+'&status='+this.query.address3).then(res =>{

                this.tableData = res.data;
                this.toString();
            })
            this.toString();
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            console.log(this.form)
            if(row.status=='0003')
            {
                this.$message.error(`维修报告已提交，不能派工`);
            }
            else {
                this.editVisible = true;
            }
        },
        // 保存编辑
        saveEdit() {
            console.log(this.form)
            this.editVisible = false;
            this.form.status='0002';
            this.$axios.post('/api/equipFaultReport/edit',this.form).then(res=>{
                this.$message.success(`派工第 ${this.idx + 1} 行成功`);
            })
            this.$set(this.tableData, this.idx, this.form);
        },
        //每行带颜色
        tableRowClassName({row, rowIndex}) {
            if(row.status!='0001')
                return 'success-row';
            else return 'warning-row';
        },
        exportExcel () {
            /* out-table关联导出的dom节点  */
            var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
            /* get binary string as output */
            var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
            try {
                FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '设备报修派工记录.xlsx')
            } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
            return wbout
        }
    }
};
</script>

<style>
    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
</style>
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
