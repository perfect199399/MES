<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 车间
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
        <el-input v-model="query.shopname" placeholder="车间名称查询" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-zoom-in" @click="handleAdd">添加</el-button>
        <el-button icon="el-icon-download" @click="exportExcel">导出</el-button>
      </div>
      <el-table
          :data="tableData"
          border
          class="table"
          id = "out-table"
          ref="multipleTable"
          header-cell-class-name="table-header"
          @selection-change="handleSelectionChange"
      >

<!--        id-->
<!--        shopName-->
<!--        shopNo-->
<!--        master-->
<!--        description-->
<!--        factory_id-->
<!--        remarks-->
<!--        del_flag-->
<!--        create_by-->
<!--        create_date-->
<!--        update_by-->
<!--        update_date-->

        <el-table-column type="selection" width="55" align="center"></el-table-column>
<!--        <el-table-column prop="id" label="车间ID"></el-table-column>-->
        <el-table-column prop="shopname" label="车间名称 "></el-table-column>
        <el-table-column prop="factoryname" label="所属工厂"></el-table-column>
        <el-table-column prop="shopno" label="车间编码 "></el-table-column>
        <el-table-column prop="master" label="车间负责人"></el-table-column>
        <el-table-column prop="description" label="车间描述"></el-table-column>

<!--        <el-table-column prop="createBy" label="创建人"></el-table-column>-->
<!--        <el-table-column prop="createDate" label="创建时间"></el-table-column>-->
<!--        <el-table-column prop="updateBy" label="更新人"></el-table-column>-->
<!--&lt;!&ndash;        <el-table-column prop="updateDate" label="更新时间"></el-table-column>&ndash;&gt;-->
<!--        <el-table-column prop="remarks" label="备注"></el-table-column>-->
<!--        <el-table-column prop="delFlag" label="删除标记"></el-table-column>-->


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
        <el-form-item label="车间ID"><el-input v-model="form.id"></el-input></el-form-item>
        <el-form-item label="所属工厂">
          <el-select v-model="form.factoryid" placeholder="请选择工厂">
            <el-option
                v-for="factory in Factory"
                :key="factory.factoryname"
                :label="factory.factoryname"
                :value="factory.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车间名称"><el-input v-model="form.shopname"></el-input></el-form-item>
        <el-form-item label="车间编码"><el-input v-model="form.shopno"></el-input></el-form-item>
        <el-form-item label="车间负责人"><el-input v-model="form.master"></el-input></el-form-item>
        <el-form-item label="车间描述"><el-input v-model="form.description"></el-input></el-form-item>
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

        <el-form-item label="所属工厂">
          <el-select v-model="form.factoryid" placeholder="请选择工厂">
            <el-option
                v-for="factory in Factory"
                :key="factory.factoryname"
                :label="factory.factoryname"
                :value="factory.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车间名称"><el-input v-model="form.shopName"></el-input></el-form-item>
        <el-form-item label="车间编码"><el-input v-model="form.shopNo"></el-input></el-form-item>
        <el-form-item label="车间负责人"><el-input v-model="form.master"></el-input></el-form-item>
        <el-form-item label="车间描述"><el-input v-model="form.description"></el-input></el-form-item>
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
// import { fetchData } from '../../api/index';
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  name: 'chejian',
  data() {
    return {
      query: {
        name: '',
        pageIndex: 0,
        pageSize: 50
      },
      tableData: [],
      multipleSelection: [],
      delList: [],
      Factory: [],
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
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '车间表.xlsx')
      } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
      return wbout
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      this.$axios.get('/api/basWorkshop/selectAll').then(res =>{

        this.tableData = res.data;
      })
    },
    getFactoryData(){
      this.$axios.get('/api/basFactory/selectAll').then(res =>{
        this.Factory = res.data;
      })
    },
    handleSearch() {
      this.$axios.get('/api/basWorkshop/selectByName?shopname='+this.query.shopname).then(res =>{
        this.tableData = res.data;
      })
      this.getFactoryData();
    },
    // 删除操作
    handleDelete(index, row) {
      // 二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
          .then(() => {
            this.tableData.splice(index, 1);
            this.$axios.get('/api/basWorkshop/deleteById?id='+row.id).then(res=>{
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
        this.$axios.get('/api/basWorkshop/deleteById?id='+this.multipleSelection[i].id).then(res=>{
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
      this.getFactoryData();
    },
    //添加操作
    handleAdd(index, row) {
      this.getFactoryData();
      this.addVisible = true;
    },
    // 保存编辑
    saveEdit() {
      console.log(this.form)

      this.editVisible = false;
      this.$axios.post('/api/basWorkshop/edit',this.form).then(res=>{
        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
      })
      this.$set(this.tableData, this.idx, this.form);
    },
    // 保存添加
    saveAdd() {
      console.log(this.form)

      this.addVisible = false;
      this.$axios.post('/api/basWorkshop/add',this.form).then(res=>{
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
