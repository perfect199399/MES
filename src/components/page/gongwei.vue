<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 工位
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

        <el-input v-model="query.cellname" placeholder="工位名称查询" class="handle-input mr10"></el-input>
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
<!--        id	1	Y	varchar(64)	工位Id-->
<!--        cellName	2		varchar(20)	工站名称-->
<!--        cellNumber	3		varchar(20)	工站编码-->
<!--        cellMaster	4		varchar(10)	工站负责人-->
<!--        cellDescription	5		varchar(20)	工站描述-->
<!--        station_id	6	FK	varchar(64)	所属工站-->
<!--        del_flag	7		char	删除标记-->
<!--        remarks	8		varchar(255)	备注-->
<!--        create_by	9		varchar(64)	创建人-->
<!--        create_date	10		datetime	创建时间-->
<!--        update_by	11		varchar(64)	更新人-->
<!--        update_date	12		datetime	更新时间-->


        <el-table-column type="selection" width="55" align="center"></el-table-column>

        <el-table-column prop="cellname" label="工位名称"></el-table-column>
        <el-table-column prop="stationname" label="所属工站"></el-table-column>
        <el-table-column prop="cellnumber" label="工位编码"></el-table-column>
        <el-table-column prop="cellmaster" label="工位负责人"></el-table-column>
        <el-table-column prop="celldescription" label="工站描述"></el-table-column>

<!--        <el-table-column prop="del_flag" label="删除标记"></el-table-column>-->
<!--        <el-table-column prop="remarks" label="备注"></el-table-column>-->
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
        <el-form-item label="工位ID"><el-input v-model="form.id"></el-input></el-form-item>
        <el-form-item label="所属工站">
          <el-select v-model="form.station_id" placeholder="请选择工站">
            <el-option
                v-for="station in Station"
                :key="station.stationname"
                :label="station.stationname"
                :value="station.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工位名称"><el-input v-model="form.cellname"></el-input></el-form-item>
        <el-form-item label="工位编码"><el-input v-model="form.cellnumber"></el-input></el-form-item>
        <el-form-item label="工位负责人"><el-input v-model="form.cellmaster"></el-input></el-form-item>
        <el-form-item label="工位描述"><el-input v-model="form.celldescription"></el-input></el-form-item>
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
        <el-form-item label="所属工站">
          <el-select v-model="form.station_id" placeholder="请选择工站">
            <el-option
                v-for="station in Station"
                :key="station.stationname"
                :label="station.stationname"
                :value="station.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工位名称"><el-input v-model="form.cellName"></el-input></el-form-item>
        <el-form-item label="工位编码"><el-input v-model="form.cellNumber"></el-input></el-form-item>
        <el-form-item label="工位负责人"><el-input v-model="form.cellMaster"></el-input></el-form-item>
        <el-form-item label="工位描述"><el-input v-model="form.cellDescription"></el-input></el-form-item>
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
import { fetchData } from '../../api/index';
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  name: 'gongwei',
  data() {
    return {
      query: {
        address: 'equip_no',
        name: '',
        pageIndex: 0,
        pageSize: 50
      },
      Station:[],
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
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '工位表.xlsx')
      } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
      return wbout
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      this.$axios.get('/api/basWorkcell/selectAll').then(res =>{

        this.tableData = res.data;
      })
    },
    getStationData() {
      this.$axios.get('/api/basWorkstationinfos/selectAll').then(res =>{

        this.Station = res.data;
      })
    },
    // 触发搜索按钮
    handleSearch() {
      this.$axios.get('/api/basWorkcell/selectByName?cellname='+this.query.cellname).then(res =>{
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
            this.$axios.get('/api/basWorkcell/deleteById?id='+row.id).then(res=>{
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
        this.$axios.get('/api/basWorkcell/deleteById?id='+this.multipleSelection[i].id).then(res=>{
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
      this.getStationData();
    },
    //添加操作
    handleAdd(index, row) {
      this.getStationData();
      this.addVisible = true;
    },
    // 保存编辑
    saveEdit() {
      console.log(this.form)

      this.editVisible = false;
      this.$axios.post('/api/basWorkcell/edit',this.form).then(res=>{
        this.$message.success(`修改第 ${this.idx + 1} 行成功`);
      })
      this.$set(this.tableData, this.idx, this.form);
    },
    // 保存添加
    saveAdd() {
      console.log(this.form)

      this.addVisible = false;
      this.$axios.post('/api/basWorkcell/add',this.form).then(res=>{
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
