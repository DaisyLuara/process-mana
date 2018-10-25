<template>
  <div 
    class="root">
    <div 
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText" 
      class="item-list-wrap">
      <div 
        class="item-content-wrap">
        <!-- 搜索 -->
        <div 
          class="search-wrap">
          <el-form 
            ref="searchForm" 
            :model="searchForm" 
            :inline="true"
            class="search-content">
            <el-row 
              :gutter="20">
              <el-col
                :span="6">
                <el-form-item 
                  label="" 
                  prop="status">
                  <el-select 
                    v-model="searchForm.status" 
                    placeholder="请选择审批状态" 
                    filterable 
                    clearable>
                    <el-option
                      v-for="item in statusList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :span="6">
                <el-form-item 
                  label="" 
                  prop="receive_status">
                  <el-select 
                    v-model="searchForm.receive_status" 
                    placeholder="请选择收票状态" 
                    filterable 
                    clearable>
                    <el-option
                      v-for="item in receiveList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col
                :span="6">
                <el-form-item 
                  label="" 
                  prop="payee">
                  <el-input 
                    v-model="searchForm.payee"
                    clearable 
                    placeholder="收款人"
                    class="item-input"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row 
              :gutter="20">
              <el-col
                :span="6">
                <el-form-item 
                  label="" 
                  prop="contract_number">
                  <el-input 
                    v-model="searchForm.contract_number"
                    clearable 
                    placeholder="合同编号"
                    class="item-input"/>
                </el-form-item>
              </el-col>
              <el-col
                :span="11">
                <el-form-item 
                  label="" 
                  prop="dataValue">
                  <el-date-picker
                    v-model="searchForm.dataValue"
                    :clearable="false"
                    :picker-options="pickerOptions2"
                    type="daterange"
                    align="right"
                    unlink-panels
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"/>
                </el-form-item>
              </el-col>
              <el-col
                :span="6">
                <el-form-item 
                  label="">
                  <el-button 
                    type="primary" 
                    size="small"
                    @click="search('searchForm')">搜索</el-button>
                  <el-button
                    type="default" 
                    size="small"
                    @click="resetSearch('searchForm')">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <!-- 合同列表 -->
        <div 
          class="total-wrap">
          <span 
            class="label">
            总数:{{ pagination.total }} 
          </span>
          <div>
            <el-button
              v-if="addButtonShow" 
              size="small" 
              type="success"
              @click="addPayment">新增付款</el-button>
          </div>
        </div>
        <el-table 
          :data="tableData" 
          style="width: 100%" >
          <el-table-column 
            type="expand">
            <template 
              slot-scope="scope">
              <el-form 
                label-position="left" 
                inline 
                class="demo-table-expand">
                <el-form-item 
                  label="合同编号:">
                  <span>{{ scope.row.contract_number }}</span> 
                </el-form-item>
                <el-form-item 
                  label="收款人:">
                  <span>{{ scope.row.payee }}</span> 
                </el-form-item>
                <el-form-item 
                  label="收票状态:">
                  <span>{{ scope.row.receive_status }}</span> 
                </el-form-item>
                <el-form-item 
                  label="申请人:">
                  <span>{{ scope.row.applicant_name }}</span> 
                </el-form-item>
                <el-form-item 
                  label="审批状态:">
                  <span>{{ scope.row.status }}</span> 
                </el-form-item>
                <el-form-item 
                  label="待处理人:">
                  <span>{{ scope.row.handler_name }}</span> 
                </el-form-item>
                <el-form-item 
                  label="申请时间:">
                  <span>{{ scope.row.created_at }}</span> 
                </el-form-item>
                <el-form-item 
                  label="最后操作时间:">
                  <span>{{ scope.row.updated_at }}</span> 
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="contract_id"
            label="合同编号"
            min-width="80">
            <template slot-scope="scope">
              {{ scope.row.contract_number }}
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="payee"
            label="收款人"
            min-width="100">
            <template slot-scope="scope">
              {{ scope.row.payee }}
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="receive_status"
            label="收票状态"
            min-width="80">
            <template slot-scope="scope">
              {{ scope.row.receive_status }}
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="applicant_name"
            label="申请人"
            min-width="80">
            <template slot-scope="scope">
              {{ scope.row.applicant_name }}
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="status"
            label="审批状态"
            min-width="80">
            <template slot-scope="scope">
              {{ scope.row.status }}
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="handler_name"
            label="待处理人"
            min-width="80">
            <template slot-scope="scope">
              {{ scope.row.handler_name === null ? '--' : scope.row.handler_name }}
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="created_at"
            label="申请时间"
            min-width="80">
            <template slot-scope="scope">
              {{ scope.row.created_at }}
            </template>
          </el-table-column>
          <el-table-column 
            label="操作" 
            min-width="200">
            <template 
              slot-scope="scope">
              <el-button 
                v-if="scope.row.status === '驳回' && scope.row.handler === applictant"
                size="mini" 
                type="primary"
                @click="editPayment(scope.row)">编辑</el-button>
              <el-button
                v-if="scope.row.handler === applictant && (scope.row.status !== '驳回' && scope.row.status !== '已付款')"
                size="mini" 
                @click="auditingPayment(scope.row)">审批</el-button>
              <el-button
                v-if="((scope.row.status === '待审批' && roles.name === 'user') || (scope.row.status === '待审批' && roles.name === 'bd-manager')) "
                size="mini" 
                type="danger"
                @click="deletePayment(scope.row)">删除</el-button>
              <el-button 
                v-if="scope.row.receive_status === '未收票' && roles.name === 'finance'"
                size="mini" 
                type="warning"
                @click="receivePayment(scope.row)">收到票据</el-button>
              <el-button
                size="mini" 
                type="info"
                @click="detailPayment(scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div 
          class="pagination-wrap">
          <el-pagination
            :total="pagination.total"
            :page-size="pagination.pageSize"
            :current-page="pagination.currentPage"
            layout="prev, pager, next, jumper, total"
            @current-change="changePage"
          />
        </div>
      </div>  
    </div>
  </div>
</template>

<script>
import {
  Button,
  Input,
  Table,
  TableColumn,
  Pagination,
  Form,
  FormItem,
  MessageBox,
  Select,
  Option,
  Row,
  Col,
  DatePicker
} from 'element-ui'
import {
  getPaymentList,
  handleDateTransform,
  receivePayment,
  deletePayment
} from 'service'

export default {
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-button': Button,
    'el-input': Input,
    'el-pagination': Pagination,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-select': Select,
    'el-option': Option,
    'el-row': Row,
    'el-col': Col,
    'el-date-picker': DatePicker
  },
  data() {
    return {
      searchForm: {
        dataValue: [],
        receive_status: '',
        payee: '',
        status: '',
        contract_number: ''
      },
      roles: {},
      pickerOptions2: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24)
              end.setTime(end.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      receiveList: [
        {
          id: 1,
          name: '已收票'
        },
        {
          id: 0,
          name: '未收票'
        }
      ],
      statusList: [
        {
          id: 1,
          name: '待审批'
        },
        {
          id: 2,
          name: '审批中'
        },
        {
          id: 3,
          name: '已审批'
        },
        {
          id: 4,
          name: '已付款'
        },
        {
          id: 5,
          name: '驳回'
        }
      ],
      setting: {
        loading: false,
        loadingText: '拼命加载中'
      },
      applictant: null,
      searchLoading: false,
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      tableData: []
    }
  },
  computed: {
    addButtonShow: function() {
      if (this.roles.name == 'user' || this.roles.name === 'bd-manager') {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    this.getPaymentList()
    let user_info = JSON.parse(localStorage.getItem('user_info'))
    this.applictant = user_info.id
    this.roles = user_info.roles.data[0]
  },
  methods: {
    receivePayment(data) {
      let id = data.id
      this.$confirm('确认收到票据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.setting.loading = true
          receivePayment(this, id)
            .then(response => {
              this.setting.loading = false
              this.$message({
                type: 'success',
                message: '收票成功！'
              })
              this.pagination.currentPage = 1
              this.getPaymentList()
            })
            .catch(error => {
              this.setting.loading = false
              this.$message({
                message: error.response.data.message,
                type: 'warning'
              })
            })
        })
        .catch(e => {
          this.setting.loading = false
        })
    },
    deletePayment(data) {
      let id = data.id
      this.$confirm('确认删除票据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.setting.loading = true
          deletePayment(this, id)
            .then(response => {
              this.setting.loading = false
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
              this.pagination.currentPage = 1
              this.getPaymentList()
            })
            .catch(error => {
              this.setting.loading = false
              this.$message({
                message: error.response.data.message,
                type: 'warning'
              })
            })
        })
        .catch(e => {
          this.setting.loading = false
        })
    },
    getPaymentList() {
      this.setting.loading = true
      let args = {
        page: this.pagination.currentPage,
        payee: this.searchForm.payee,
        status: this.searchForm.status,
        receive_status: this.searchForm.receive_status,
        contract_number: this.searchForm.contract_number,
        start_date: handleDateTransform(this.searchForm.dataValue[0]),
        end_date: handleDateTransform(this.searchForm.dataValue[1])
      }
      if (!this.searchForm.payee) {
        delete args.payee
      }
      if (!this.searchForm.status) {
        delete args.status
      }
      if (this.searchForm.receive_status === '') {
        delete args.receive_status
      }
      if (this.searchForm.contract_number === '') {
        delete args.contract_number
      }
      if (!this.searchForm.dataValue[0]) {
        delete args.start_date
      }
      if (!this.searchForm.dataValue[1]) {
        delete args.end_date
      }
      getPaymentList(this, args)
        .then(res => {
          this.tableData = res.data
          this.pagination.total = res.meta.pagination.total
          this.setting.loading = false
        })
        .catch(err => {
          this.setting.loading = false
        })
    },
    addPayment() {
      this.$router.push({
        path: '/payment/list/add'
      })
    },
    editPayment(data) {
      this.$router.push({
        path: '/payment/list/edit/' + data.id
      })
    },
    auditingPayment(data) {
      this.$router.push({
        path: '/payment/list/detail/' + data.id
      })
    },
    detailPayment(data) {
      this.$router.push({
        path: '/payment/list/detail/' + data.id,
        query: {
          hide: 'none'
        }
      })
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage
      this.getPaymentList()
    },
    search() {
      this.pagination.currentPage = 1
      this.getPaymentList()
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields()
      this.pagination.currentPage = 1
      this.getPaymentList()
    }
  }
}
</script>

<style lang="less" scoped>
.root {
  font-size: 14px;
  color: #5e6d82;
  .item-list-wrap {
    background: #fff;
    padding: 30px;

    .el-form-item {
      margin-bottom: 0;
    }
    .item-content-wrap {
      .demo-table-expand {
        font-size: 0;
      }
      .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
      }
      .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
      }
      .icon-item {
        padding: 10px;
        width: 50%;
      }
      .search-wrap {
        margin-top: 5px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 16px;
        align-items: center;
        margin-bottom: 10px;
        .search-content {
          width: 800px;
        }
        .el-form-item {
          margin-bottom: 10px;
        }
        .el-select {
          width: 200px;
        }
        .item-input {
          width: 200px;
        }
        .warning {
          background: #ebf1fd;
          padding: 8px;
          margin-left: 10px;
          color: #444;
          font-size: 12px;
          i {
            color: #4a8cf3;
            margin-right: 5px;
          }
        }
      }
      .highlighted {
        color: red;
      }
      .total-wrap {
        margin-top: 5px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 16px;
        align-items: center;
        margin-bottom: 10px;
        .label {
          font-size: 14px;
          margin: 5px 0;
        }
      }
      .pagination-wrap {
        margin: 10px auto;
        text-align: right;
      }
    }
  }
}
</style>
