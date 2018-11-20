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
            <el-form-item 
              label="" 
              prop="name">
              <el-input 
                v-model="searchForm.name"
                clearable 
                placeholder="请输入收款人"
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
          <div>
            <el-button
              v-if="buttonShow" 
              size="small" 
              type="success"
              @click="addPayee">新增收款人</el-button>
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
                  label="收款人:">
                  <span>{{ scope.row.name }}</span> 
                </el-form-item>
                <el-form-item 
                  label="收款人开户行:">
                  <span>{{ scope.row.account_bank }}</span> 
                </el-form-item>
                <el-form-item 
                  label="收款人账号:">
                  <span>{{ scope.row.account_number }}</span> 
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="name"
            label="收款人"
            min-width="100"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="account_number"
            label="收款人账号"
            min-width="280"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="account_bank"
            label="收款人开户行"
            min-width="180"/>
          <el-table-column 
            label="操作" 
            min-width="200">
            <template 
              slot-scope="scope">
              <el-button 
                v-if="buttonShow"
                size="mini" 
                type="primary"
                @click="editPayee(scope.row)">编辑</el-button>
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
  MessageBox
} from 'element-ui'
import {
  getPayeeList,
  handleDateTransform,
  receivePayment,
  deletePayment,
  Cookies
} from 'service'

export default {
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-button': Button,
    'el-input': Input,
    'el-pagination': Pagination,
    'el-form': Form,
    'el-form-item': FormItem
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
      if (
        this.roles.name == 'user' ||
        this.roles.name === 'bd-manager' ||
        this.roles.name == 'legal-affairs' ||
        this.roles.name == 'legal-affairs-manager'
      ) {
        return true
      } else {
        return false
      }
    }
  },
  created() {
    this.getPayeeList()
    let user_info = JSON.parse(Cookies.get('user_info'))
    this.roles = user_info.roles.data[0]
  },
  methods: {
    getPayeeList() {
      this.setting.loading = true
      let args = {
        page: this.pagination.currentPage,
        name: this.searchForm.name
      }
      if (!this.searchForm.name) {
        delete args.name
      }
      getPayeeList(this, args)
        .then(res => {
          this.tableData = res.data
          this.pagination.total = res.meta.pagination.total
          this.setting.loading = false
        })
        .catch(err => {
          this.setting.loading = false
        })
    },
    addPayee() {
      this.$router.push({
        path: '/payment/payee/add'
      })
    },
    editPayee(data) {
      this.$router.push({
        path: '/payment/payee/edit/' + data.id
      })
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage
      this.getPayeeList()
    },
    search() {
      this.pagination.currentPage = 1
      this.getPayeeList()
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields()
      this.pagination.currentPage = 1
      this.getPayeeList()
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
