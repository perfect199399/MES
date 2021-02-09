<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 设备台账
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
                    <el-option key="3" label="体积" value="0002"></el-option>
                    <el-option key="4" label="长度" value="0003"></el-option>
                </el-select>
                <el-input v-model="query.code" placeholder="输入编号查询" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button icon="el-icon-download" @click="exportExcel">导出</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                id="out-table"
                height="800"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column width="55" align="center"></el-table-column>
                    <el-table-column prop="id" label="编号" sortable width="280"></el-table-column>
                    <el-table-column prop="typeString" label="设备类型" sortable width="130"></el-table-column>
                    <el-table-column prop="specString" label="设备规格"></el-table-column>
                    <el-table-column prop="supplier" label="供应商"></el-table-column>
                    <el-table-column prop="manufacturer" label="生产商"></el-table-column>
                    <el-table-column prop="factoryNumber" label="出厂编号"></el-table-column>
                    <el-table-column prop="purpose" label="用途"></el-table-column>
                    <el-table-column prop="buyDateString" label="采购日期" sortable width="230"></el-table-column>
                    <el-table-column prop="person" label="资产负责人"></el-table-column>
            </el-table>

        </div>
    </div>
</template>

<script>
    import FileSaver from 'file-saver'
    import XLSX from 'xlsx'

    export default {
    name: 'equipReport',
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
        // 获取 easy-mock 的模拟数据
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
                        this.tableData[i].specString="体积";
                    else if(this.tableData[i].spec=="0003")
                        this.tableData[i].specString="长度";
                    var buytime = new Date(this.tableData[i].buyDate);
                    var month= buytime.getMonth()+1;
                    this.tableData[i].buyDateString = buytime.getFullYear()+"年"+month+"月"+buytime.getDate()+"日"+buytime.getHours()+"时"+buytime.getMinutes()+"分";
            }
        },
        getData() {
            this.$axios.get('/api/equipReport/selectAll').then(res =>{
                this.tableData = res.data;
                this.toString();
            })
        },
        // 触发搜索按钮
        handleSearch() {
            console.log('/api/equipReport/select?type='+this.query.address1+'&spec='+this.query.address2+'&id='+this.query.code);
            this.$axios.get('/api/equipReport/select?type='+this.query.address1+'&spec='+this.query.address2+'&id='+this.query.code).then(res =>{

                this.tableData = res.data;
                this.toString();
            })

        },
        exportExcel () {
            /* out-table关联导出的dom节点  */
            var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
            /* get binary string as output */
            var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
            try {
                FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '设备台账.xlsx')
            } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
            return wbout
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
