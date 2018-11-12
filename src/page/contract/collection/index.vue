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
            :inline="true">
            <el-form-item 
              label="" 
              prop="name">
              <el-input 
                v-model="searchForm.name" 
                clearable
                placeholder="公司名称"
                class="item-input"/>
            </el-form-item>
            <el-form-item 
              label="" 
              prop="contract_number">
              <el-input 
                v-model="searchForm.contract_number" 
                clearable
                placeholder="合同编号"
                class="item-input"/>
            </el-form-item>
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
          </el-form>
        </div>
        <!-- 合同列表 -->
        <div 
          class="total-wrap">
          <span 
            class="label">
            总数:{{ pagination.total }} 
          </span>
        </div>
        <el-table 
          :data="tableData" 
          style="width: 100%" >
          <el-table-column 
            type="expand">
            <template 
              slot-scope="scope">
               <el-table
                :data="tableDataTwo"
                style="width: 100%">
                <el-table-column
                  prop="date"
                  label="收款日期"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="收款金额"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="收款状态">
                </el-table-column>
                <el-table-column 
                  min-width="180">
                  <template 
                    slot-scope="scope">
                    <el-button
                      size="mini" 
                      type="info"
                      @click="detailContract(scope.row)">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="contract_number"
            label="合同编号"
            min-width="80">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="company_name"
            label="公司名称"
            min-width="100">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="name"
            label="合同名称"
            min-width="80">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="applicant_name"
            label="申请人"
            min-width="80">
          </el-table-column>
            <el-table-column
            :show-overflow-tooltip="true"
            prop="handler_name"
            label="收款状态"
            min-width="80"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="status"
            label="收款总额"
            min-width="80"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="apply_time"
            label="已收款金额"
            min-width="80"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="apply_time"
            label="未收款金额"
            min-width="80"/>
          
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
  Option
} from 'element-ui'
import { getRemindContractList, receiptInvoice, Cookies } from 'service'

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
    'el-option': Option
  },
  data() {
    return {
      searchForm: {
        name: '',
        contract_number: ''
      },
      roles: [],
      setting: {
        loading: false,
        loadingText: '拼命加载中'
      },
      searchLoading: false,
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      tableData: [],
      tableDataTwo: [
        {
          date: '2016-05-02',
          name: '2000',
          address: '已收款'
        },
        {
          date: '2016-05-04',
          name: '200',
          address: '未收款'
        }
      ]
    }
  },
  computed: {
    buttonShow: function() {
      if (this.roles.name == 'user' || this.roles.name === 'bd-manager') {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    let user_info = JSON.parse(Cookies.get('user_info'))
    this.roles = user_info.roles.data[0]
    this.getRemindContractList()
  },
  methods: {
    receiptInvoice(data) {
      let id = data.id
      this.$confirm('确认收款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.setting.loadingText = '确认收款中'
          this.setting.loading = true
          receiptInvoice(this, id)
            .then(response => {
              this.setting.loading = false
              this.$message({
                type: 'success',
                message: '收款成功！'
              })
              this.pagination.currentPage = 1
              this.getRemindContractList()
            })
            .catch(error => {
              this.$message({
                message: error.response.data.message,
                type: 'warning'
              })
              this.setting.loading = false
            })
        })
        .catch(e => {
          console.log(e)
        })
    },
    getRemindContractList() {
      this.setting.loading = true
      let args = {
        page: this.pagination.currentPage,
        name: this.searchForm.name,
        contract_number: this.searchForm.contract_number
      }
      if (!this.searchForm.name) {
        delete args.name
      }
      if (this.searchForm.contract_number === '') {
        delete args.contract_number
      }
      getRemindContractList(this, args)
        .then(res => {
          this.tableData = res.data
          this.pagination.total = res.meta.pagination.total
          this.setting.loading = false
        })
        .catch(err => {
          this.setting.loading = false
        })
    },
    detailContract(data) {
      this.$router.push({
        path: '/contract/list/detail/' + data.id,
        query: {
          hide: 'none'
        }
      })
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage
      this.getRemindContractList()
    },
    search() {
      this.pagination.currentPage = 1
      this.getRemindContractList()
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields()
      this.pagination.currentPage = 1
      this.getRemindContractList()
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
