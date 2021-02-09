<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 员工
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
        <!--        <el-select v-model="query.address" placeholder="设备编号" class="handle-select mr10">-->
        <!--          <el-option key="1" label="工厂编号" value="equip_no"></el-option>-->
        <!--          <el-option key="2" label="工厂名称" value="equip_type"></el-option>-->
        <!--&lt;!&ndash;          <el-option key="3" label="上报人姓名" value="report_person"></el-option>&ndash;&gt;-->
        <!--        </el-select>-->
        <el-input v-model="query.employeename" placeholder="员工姓名查询" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
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
<!--        id	1	1	varchar(64)	员工ID-->
<!--        employeeNo	2	2	varchar(20)	员工编号-->
<!--        employeeName	3		varchar(20)	员工姓名-->
<!--        workDate	4		date	入职日期-->
<!--        sex	5		char(2)	性别-->
<!--        age	6		int	年龄-->
<!--        telNum	7		varchar(20)	电话-->
<!--        address	8		varchar(50)	地址-->
<!--        email	9		varchar(50)	邮箱-->
<!--        idCard	10		varchar(20)	身份证号-->
<!--        officeId	11	FK	varchar(64)	所属部门-->
<!--        remarks	12		varchar(255)	备注-->
<!--        del_flag	13		char	删除标记-->
<!--        create_by	14		varchar(64)	创建人-->
<!--        create_date	15		datetime	创建时间-->
<!--        update_by	16		varchar(64)	更新人-->
<!--        update_date	17		datetime	更新时间-->

        <el-table-column type="selection" width="55" align="center"></el-table-column>
<!--        <el-table-column prop="id" label="员工ID"></el-table-column>-->
        <el-table-column prop="employeeno" label="员工编号"></el-table-column>
        <el-table-column prop="employeename" label="员工姓名"></el-table-column>
        <el-table-column prop="workdate" label="入职日期"></el-table-column>
        <el-table-column prop="sex" label="性别"></el-table-column>
        <el-table-column prop="age" label="年龄"></el-table-column>
        <el-table-column prop="telnum" label="电话"></el-table-column>
        <el-table-column prop="address" label="地址"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="idcard" label="身份证号"></el-table-column>
        <el-table-column prop="officename" label="所属部门"></el-table-column>
<!--        <el-table-column prop="delFlag" label="删除标记"></el-table-column>-->
<!--        <el-table-column prop="remarks" label="备注"></el-table-column>-->
<!--        <el-table-column prop="create_by" label="创建人"></el-table-column>-->
<!--        <el-table-column prop="create_date" label="创建时间"></el-table-column>-->
<!--        <el-table-column prop="update_by" label="更新人"></el-table-column>-->
<!--        <el-table-column prop="update_date" label="更新时间"></el-table-column>-->


<!--        <el-form-item label="员工id"><el-input v-model="form.id"></el-input></el-form-item>-->
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
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="95px">
        <el-form-item label="员工ID"><el-input v-model="form.id"></el-input></el-form-item>
        <el-form-item label="员工编号"><el-input v-model="form.employeeno"></el-input></el-form-item>
        <el-form-item label="员工姓名"><el-input v-model="form.employeename"></el-input></el-form-item>
        <el-form-item label="入职日期"><el-input v-model="form.workdate"></el-input></el-form-item>
        <el-form-item label="性别"><el-input v-model="form.sex"></el-input></el-form-item>
        <el-form-item label="年龄"><el-input v-model="form.age"></el-input></el-form-item>
        <el-form-item label="电话"><el-input v-model="form.telnum"></el-input></el-form-item>
        <el-form-item label="地址"><el-input v-model="form.address"></el-input></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="form.email"></el-input></el-form-item>
        <el-form-item label="身份证号"><el-input v-model="form.idcard"></el-input></el-form-item>
        <el-form-item label="所属部门">
          <el-select v-model="form.officeId" placeholder="请选择部门">
            <el-option
                v-for="office in Office"
                :key="office.name"
                :label="office.name"
                :value="office.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remarks"></el-input></el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
    </el-dialog>
    <!-- 编辑添加框 -->
    <el-dialog title="添加" :visible.sync="addVisible" width="30%">
      <el-form ref="form" :model="form" label-width="95px">


        <el-form-item label="员工编号"><el-input v-model="form.employeeNo"></el-input></el-form-item>
        <el-form-item label="员工姓名"><el-input v-model="form.employeeName"></el-input></el-form-item>
        <el-form-item label="入职日期"><el-input v-model="form.workDate"></el-input></el-form-item>
        <el-form-item label="性别"><el-input v-model="form.sex"></el-input></el-form-item>

        <el-form-item label="年龄"><el-input v-model="form.age"></el-input></el-form-item>
        <el-form-item label="电话"><el-input v-model="form.telNum"></el-input></el-form-item>
        <el-form-item label="地址"><el-input v-model="form.address"></el-input></el-form-item>
        <el-form-item label="邮箱"><el-input v-model="form.email"></el-input></el-form-item>
        <el-form-item label="身份证号"><el-input v-model="form.idCard"></el-input></el-form-item>

        <el-form-item label="所属部门">
          <el-select v-model="form.officeId" placeholder="请选择部门">
            <el-option
                v-for="office in Office"
                :key="office.name"
                :label="office.name"
                :value="office.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remarks"></el-input></el-form-item>
        <el-form-item label="创建人"><el-input v-model="form.createBy"></el-input></el-form-item>
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
  name: 'yuangong',
  data() {
    return {
      query: {
        name: '',
        pageIndex: 0,
        pageSize: 50
      },
      Office:[],
      tableData: [],
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
    exportExcel () {
      /* out-table关联导出的dom节点  */
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
      /* get binary string as output */
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '员工表.xlsx')
      } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
      return wbout
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      this.$axios.get('/api/basEmployees/selectAll').then(res =>{

        this.tableData = res.data;
      })
    },
    getOfficeData() {
      this.$axios.get('/api/sysOffice/selectAll').then(res =>{

        this.Office = res.data;
      })
    },
    // 触发搜索按钮
    handleSearch() {
      this.$axios.get('/api/basEmployees/selectByName?employeename='+this.query.employeename).then(res =>{
        this.tableData = res.data;
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
            this.$axios.get('/api/basEmployees/deleteById?id='+row.id).then(res=>{
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
        this.$axios.get('/api/basEmployees/deleteById?id='+this.multipleSelection[i].id).then(res=>{
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
      this.getOfficeData();
    },
    //添加操作
    handleAdd(index, row) {
      this.getOfficeData();
      this.addVisible = true;
    },
    // 保存编辑
    saveEdit() {
      console.log(this.form)

      this.editVisible = false;
      this.$axios.post('/api/basEmployees/edit',this.form).then(res=>{
        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
      })
      this.$set(this.tableData, this.idx, this.form);
    },
    // 保存添加
    saveAdd() {
      console.log(this.form)

      this.addVisible = false;
      this.$axios.post('/api/basEmployees/add',this.form).then(res=>{
        this.$message.success(`添加成功`);
      })
      this.getData();
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
