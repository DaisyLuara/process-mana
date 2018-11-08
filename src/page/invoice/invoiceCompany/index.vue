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
                placeholder="开票公司"
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
        <!-- 开票列表 -->
        <div 
          class="total-wrap">
          <span 
            class="label">
            总数:{{ pagination.total }} 
          </span>
          <div>
            <el-button
              v-if="buttonShow" 
              size="small" 
              type="success"
              @click="addInvoiceCompany">新增开票公司</el-button>
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
                  label="开票公司:">
                  <span>{{ scope.row.name }}</span> 
                </el-form-item>
                <el-form-item 
                  label="地址:">
                  <span>{{ scope.row.address }}</span> 
                </el-form-item>
                <el-form-item 
                  label="纳税人识别号:">
                  <span>{{ scope.row.taxpayer_num }}</span> 
                </el-form-item>
                <el-form-item 
                  label="手机号:">
                  <span>{{ scope.row.phone }}</span> 
                </el-form-item>
                <el-form-item 
                  label="座机电话:">
                  <span>{{ scope.row.telephone }}</span> 
                </el-form-item>
                <el-form-item 
                  label="开户银行:">
                  <span>{{ scope.row.account_bank }}</span> 
                </el-form-item>
                <el-form-item 
                  label="开户行账号:">
                  <span>{{ scope.row.account_number }}</span> 
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="name"
            label="开票公司"
            min-width="100"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="address"
            label="地址"
            min-width="80"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="taxpayer_num"
            label="纳税人识别号"
            min-width="80"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="phone"
            label="手机号"
            min-width="80"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="telephone"
            label="座机电话"
            min-width="80"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="account_bank"
            label="开户银行"
            min-width="80"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="account_number"
            label="开户行账号"
            min-width="80"/>
          <el-table-column 
            label="操作" 
            min-width="200">
            <template 
              slot-scope="scope">
              <el-button
                v-if="buttonShow" 
                size="mini" 
                type="primary"
                @click="editInvoiceCompany(scope.row)">编辑</el-button>
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
} from 'element-ui'
import {
  getInvoiceCompanyList,
  Cookies,
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
  },
  data() {
    return {
      searchForm: {
        name: ''
      },
      roles: {},
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
      tableData: []
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
    this.getInvoiceCompanyList()
  },
  methods: {
    getInvoiceCompanyList() {
      this.setting.loading = true
      let args = {
        name: this.searchForm.name
      }
      if (!this.searchForm.name) {
        delete args.name
      }
      getInvoiceCompanyList(this, args)
        .then(res => {
          this.tableData = res.data
          this.pagination.total = res.meta.pagination.total
          this.setting.loading = false
        })
        .catch(err => {
          this.setting.loading = false
        })
    },
    addInvoiceCompany() {
      this.$router.push({
        path: '/invoice/invoice_company/add'
      })
    },
    editInvoiceCompany(data) {
      console.log(data)
      this.$router.push({
        path: '/invoice/invoice_company/edit/' + data.id
      })
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage
      this.getInvoiceCompanyList()
    },
    search() {
      this.pagination.currentPage = 1
      this.getInvoiceCompanyList()
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields()
      this.pagination.currentPage = 1
      this.getInvoiceCompanyList()
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
