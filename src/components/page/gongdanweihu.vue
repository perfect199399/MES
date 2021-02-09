<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 工单维护
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

        <el-input v-model="query.ordercode" placeholder="工单号查询" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        <el-button icon="el-icon-download" @click="exportExcel">导出</el-button>
<!--        <el-button type="primary" icon="el-icon-zoom-in" @click="handleAdd">添加</el-button>-->
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
<!--        <el-table-column prop="id" label="工单ID" sortable width="200"></el-table-column>-->
        <el-table-column prop="ordercode" label="工单码" sortable width="130"></el-table-column>
        <el-table-column prop="orderId" label="订单ID" sortable width="200"></el-table-column>

        <el-table-column prop="unitname" label="计量单位"></el-table-column>
        <el-table-column prop="ordertype" label="工单类型" sortable width="200"></el-table-column>
        <el-table-column prop="amount" label="工单生产数量" sortable width="200"></el-table-column>
        <el-table-column prop="eststarttime" label="预计生产时间" sortable width="200"></el-table-column>
        <el-table-column prop="estendtime" label="预计结束时间" sortable width="200"></el-table-column>
        <el-table-column prop="actstarttime" label="实际生产时间" sortable width="200"></el-table-column>
        <el-table-column prop="inamount" label="投入数量" sortable width="200"></el-table-column>
        <el-table-column prop="outamount" label="产出数量" sortable width="200"></el-table-column>
        <el-table-column prop="scrapamount" label="报废数量" sortable width="200"></el-table-column>
        <el-table-column prop="state" label="工单状态" sortable width="200"></el-table-column>
        <el-table-column prop="linename" label="工单产线" sortable width="200"></el-table-column>
        <el-table-column prop="productname" label="产品名称" sortable width="200"></el-table-column>


        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)"
            >修改</el-button>
            <el-button
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
            <el-button
                type="text"
                icon="el-icon-edit"
                @click="handleEdit(scope.$index, scope.row)"
            >查看BOM</el-button>
            <el-button
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
            >查看工艺路由</el-button>
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
    <el-dialog title="修改" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="95px">
        <el-form-item label="工单号"><el-input v-model="form.ordercode"></el-input></el-form-item>
        <el-form-item label="订单号"><el-input v-model="form.orderId"></el-input></el-form-item>
        <el-form-item label="工单类型">
          <el-select v-model="form.value1" placeholder="请选择">
            <el-option
                v-for="item in options1"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工单生产数量"><el-input v-model="form.amount"></el-input></el-form-item>
        <el-form-item label="计量单位"><el-input v-model="form.unitname"></el-input></el-form-item>
        <el-form-item label="预计生产时间"><el-input v-model="form.eststarttime"></el-input></el-form-item>
        <el-form-item label="预计结束时间"><el-input v-model="form.estendtime"></el-input></el-form-item>
        <el-form-item label="实际生产时间"><el-input v-model="form.actstarttime"></el-input></el-form-item>
        <el-form-item label="投入数量"><el-input v-model="form.inamount"></el-input></el-form-item>
        <el-form-item label="产出数量"><el-input v-model="form.outamount"></el-input></el-form-item>
        <el-form-item label="报废数量"><el-input v-model="form.scrapamount"></el-input></el-form-item>
<!--        <el-form-item label="工单状态"><el-input v-model="form.factoryname"></el-input></el-form-item>-->
        <el-form-item label="工单状态">
          <el-select v-model="form.value2" placeholder="请选择">
            <el-option
                v-for="item in options2"
                :key="item.value"
                :label="item.label"
                :value="item.value">
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

  </div>

</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
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

      options1: [{
        value: '选项1',
        label: '一般工单'
      }, {
        value: '选项2',
        label: '加班工单'
      }],
      options2: [{
        value: '选项1',
        label: '新建'
      }, {
        value: '选项2',
        label: '未发布'
      }, {
        value: '选项3',
        label: '已发布'
      }, {
        value: '选项4',
        label: '暂停  '
      }, {
        value: '选项5',
        label: '取消'
      }],

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
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '工单维护.xlsx')
      } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
      return wbout
    },
    // 获取 easy-mock 的模拟数据
    getData() {
      this.$axios.get('/api/basWorkorder/selectAll').then(res =>{
        this.tableData = res.data;
        // this.toString();
      })
    },
    // 触发搜索按钮
    handleSearch() {
      this.$axios.get('/api/basWorkorder/selectByName?ordercode='+this.query.ordercode).then(res =>{
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
            this.$axios.get('/api/basWorkorder/deleteById?id='+row.id).then(res=>{
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
        this.$axios.get('/api/basWorkorder/delete?id='+this.multipleSelection[i].id).then(res=>{
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
          this.$axios.post('/api/basWorkorder/edit',this.form).then(res=>{
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
          this.$axios.post('/api/basWorkorder/add',this.form).then(res=>{
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
