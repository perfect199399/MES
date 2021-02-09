
        <template>
          <div>
            <div class="crumbs">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                  <i class="el-icon-lx-cascades"></i> 订单
                </el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            <div class="container">
              <div class="handle-box">
                <el-button icon="el-icon-download" @click="exportExcel">导出</el-button>
                <!--        <el-button type="primary" icon="el-icon-zoom-in" @click="handleAdd">添加</el-button>-->
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
                <el-table-column prop="id" label="编号" sortable width="150"></el-table-column>
                <el-table-column prop="orderno" label="订单号" sortable width="150"></el-table-column>
                <el-table-column prop="indentor" label="订购商" sortable width="150"></el-table-column>
                <el-table-column prop="productname" label="产品名称" sortable width="150"></el-table-column>
                <el-table-column prop="quantity" label="数量" sortable width="150"></el-table-column>
                <el-table-column prop="unit" label="单位" sortable width="150"></el-table-column>
                <el-table-column prop="orderdate" label="订购日期" sortable width="150"></el-table-column>
                <el-table-column prop="salesman" label="经办人" sortable width="150"></el-table-column>
                <el-table-column prop="status" label="订单状态" sortable width="150"></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                  <template slot-scope="scope">
                    <el-button
                        type="text"
                        icon="el-icon-edit"
                        @click="handleEdit(scope.$index, scope.row)"
                    >下工单</el-button>

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

            <!-- 编辑添加框 -->
            <el-dialog title="下工单" :visible.sync="editVisible" width="30%">
              <el-form ref="form" :model="form" label-width="95px">
                <el-form-item label="工单号"><el-input v-model="form.Id"></el-input></el-form-item>
                <el-form-item label="订单号"><el-input v-model="form.orderno"></el-input></el-form-item>
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
                <el-form-item label="计量单位"><el-input v-model="form.unitName"></el-input></el-form-item>
                <el-form-item label="预计生产时间"><el-input v-model="form.estStartTime"></el-input></el-form-item>
                <el-form-item label="预计结束时间"><el-input v-model="form.estEndTime"></el-input></el-form-item>
                <el-form-item label="实际生产时间"><el-input v-model="form.actStartTime"></el-input></el-form-item>
                <el-form-item label="投入数量"><el-input v-model="form.inAmount"></el-input></el-form-item>
                <el-form-item label="产出数量"><el-input v-model="form.outAmount"></el-input></el-form-item>
                <el-form-item label="报废数量"><el-input v-model="form.scrapAmount"></el-input></el-form-item>
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
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
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

                  name: '',
                  pageIndex: 0,
                  pageSize: 50
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                Workshop:[],
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
                  FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '订单表.xlsx')
                } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
                return wbout
              },
              // 多选操作
              handleSelectionChange(val) {
                this.multipleSelection = val;
              },
              // 获取 easy-mock 的模拟数据
              getData() {
                this.$axios.get('/api/orders/selectAll').then(res =>{

                  this.tableData = res.data;
                })
              },

              // 编辑操作
              handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                console.log(this.form)
                this.editVisible = true;
              },
              // 保存编辑
              saveEdit() {
                console.log(this.form)

                this.editVisible = false;

                 // this.$set(this.tableData, this.idx, this.form);
              },

              //添加操作
              handleAdd(index, row) {
                this.addVisible = true;
              },
              // 保存添加
              saveAdd() {
                console.log(this.form)

                this.editVisible = false;
                this.$axios.post('/api/basWorkorder/add',this.form).then(res=>{
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
