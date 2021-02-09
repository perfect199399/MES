<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 上岗记录
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">

        <el-input v-model="query.employeename" placeholder="按姓名查询" class="handle-input mr10"></el-input>
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
          :row-class-name="tableRowClassName"
      >
        <el-table-column width="55" align="center" sortable></el-table-column>
<!--        <el-table-column prop="id" label="编号" sortable width="150"></el-table-column>-->
<!--        <el-table-column prop="employeeId" label="员工ID" sortable width="130"></el-table-column>-->
        <el-table-column prop="employeeno" label="员工工号" sortable width="130"></el-table-column>
        <el-table-column prop="employeename" label="员工姓名"></el-table-column>
        <el-table-column prop="officename" label="所属部门" sortable width="130"></el-table-column>
<!--        <el-table-column prop="lineId" label="所属产线" sortable width="180"></el-table-column>-->
        <el-table-column prop="linename" label="产线名称" sortable width="130"></el-table-column>
<!--        <el-table-column prop="stationId" label="所属工站" sortable width="130"></el-table-column>-->
        <el-table-column prop="stationname" label="工站名称"></el-table-column>
<!--        <el-table-column prop="cellId" label="所属工位" sortable width="130"></el-table-column>-->
        <el-table-column prop="cellname" label="工位名称" sortable width="180"></el-table-column>
        <el-table-column prop="clockin" label="上班" sortable width="130"></el-table-column>
        <el-table-column prop="clockoff" label="下班" sortable width="130"></el-table-column>
        <el-table-column prop="worktime" label="工作时间"></el-table-column>
        <el-table-column prop="workstatus" label="工作状态" sortable width="130"></el-table-column>
<!--        <el-table-column prop="remarks" label="备注" sortable width="180"></el-table-column>-->
<!--        <el-table-column prop="createBy" label="创建人" sortable width="130"></el-table-column>-->
<!--        <el-table-column label="操作" width="180" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-button-->
<!--                type="text"-->
<!--                icon="el-icon-edit"-->
<!--                @click="handleEdit(scope.$index, scope.row)"-->
<!--            >维修报告</el-button>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>

    </div>

<!--    &lt;!&ndash; 编辑弹出框 &ndash;&gt;-->
<!--    <el-dialog title="编辑维修报告" :visible.sync="editVisible" width="30%">-->
<!--      <el-form ref="form" :model="form" label-width="95px">-->
<!--        <el-form-item label="编号" v-show="false"><el-input :disabled="true" v-model="form.id"></el-input></el-form-item>-->
<!--        <el-form-item label="用户名" v-show="false"><el-input :disabled="true" v-model="form.reportPerson"></el-input></el-form-item>-->
<!--        <el-form-item label="故障类型"><el-input v-model="form.faultType"></el-input></el-form-item>-->
<!--        <el-form-item label="故障原因"><el-input v-model="form.faultReason"></el-input></el-form-item>-->
<!--        <el-form-item label="故障描述"><el-input type="textarea" v-model="form.faultDesc"></el-input></el-form-item>-->
<!--      </el-form>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--                <el-button @click="editVisible = false">取 消</el-button>-->
<!--                <el-button type="primary" @click="saveEdit">确 定</el-button>-->
<!--            </span>-->
<!--    </el-dialog>-->
    <!-- 查看弹出框 -->
<!--    <el-dialog title="查看维修报告" :visible.sync="lookVisible" width="30%">-->
<!--      <el-form ref="form" :model="equipReportData" label-width="95px">-->
<!--        <el-form-item label="故障类型"><el-input :disabled="true" v-model="equipReportData.faultType"></el-input></el-form-item>-->
<!--        <el-form-item label="故障原因"><el-input :disabled="true" v-model="equipReportData.faultReason"></el-input></el-form-item>-->
<!--        <el-form-item label="故障描述"><el-input :disabled="true" type="textarea" v-model="equipReportData.faultDesc"></el-input></el-form-item>-->
<!--      </el-form>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--                <el-button @click="lookVisible = false">关 闭</el-button>-->
<!--            </span>-->
<!--    </el-dialog>-->
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  name: 'shanggangjilu',
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
      lookVisible: false,
      pageTotal: 0,
      form: {},
      equipReportData: {},
      idx: -1,
      id: -1
    };
  },
  created() {
    this.getData2();
  },
  methods: {
    exportExcel () {
      /* out-table关联导出的dom节点  */
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
      /* get binary string as output */
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '上岗记录表.xlsx')
      } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
      return wbout
    },
    // toString(){
    //   const length = this.tableData.length;
    //   for (let i = 0; i < length; i++) {
    //     this.tableData[i].equipTypeString = "3";
    //     if(this.tableData[i].equipType=="0001")
    //       this.tableData[i].equipTypeString="电子秤";
    //     else if(this.tableData[i].equipType=="0002")
    //       this.tableData[i].equipTypeString="读卡器";
    //     else if(this.tableData[i].equipType=="0003")
    //       this.tableData[i].equipTypeString="条码打印机";
    //     else if(this.tableData[i].equipType=="0004")
    //       this.tableData[i].equipTypeString="安卓PAD";
    //     else if(this.tableData[i].equipType=="0005")
    //       this.tableData[i].equipTypeString="红外对射枪";
    //     var buytime = new Date(this.tableData[i].createDate);
    //     var month= buytime.getMonth()+1;
    //     this.tableData[i].createDateString = buytime.getFullYear()+"年"+month+"月"+buytime.getDate()+"日"+buytime.getHours()+"时"+buytime.getMinutes()+"分";
    //
    //     if(this.tableData[i].status=="0001")
    //       this.tableData[i].statusString="未派工";
    //     else if(this.tableData[i].status=="0002")
    //       this.tableData[i].statusString="维修中";
    //     else if(this.tableData[i].status=="0003")
    //       this.tableData[i].statusString="已完工";
    //   }
    // },
    getData2() {
      this.$axios.get('/api/mountGuard/selectAll').then(res =>{
        this.tableData = res.data;
        this.toString();
      })
      this.form.reportPerson = JSON.parse(localStorage.getItem("userInfo")).name;

    },
    handleSearch() {
      this.$axios.get('/api/mountGuard/selectByName?employeename='+this.query.employeename).then(res =>{
        this.tableData = res.data;
      })
    },

    //每行带颜色
    tableRowClassName({row, rowIndex}) {
      if(row.status!='0001')
        return 'success-row';
      else return 'warning-row';
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
