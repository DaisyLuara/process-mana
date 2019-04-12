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
                placeholder="请输入合同名称"
                class="item-input"/>
            </el-form-item>
            <el-form-item 
              label="" 
              prop="company_name">
              <el-input 
                v-model="searchForm.company_name" 
                clearable
                placeholder="请输入公司名称"
                class="item-input"/>
            </el-form-item>
            <el-form-item 
              label="" 
              prop="contract_number">
              <el-input 
                v-model="searchForm.contract_number" 
                clearable
                placeholder="请输入合同编号"
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
              size="small"
              @click="download"
            >下载</el-button>
          </div>
        </div>
        <el-table 
          :data="tableData" 
          style="width: 100%" >
          <el-table-column 
            type="expand">
            <template 
              slot-scope="scope">
              <el-table
                :data="scope.row.receiveDate.data"
                style="width: 100%">
                <el-table-column
                  prop="receive_date"
                  label="预估收款日期"
                  min-width="120"/>
                <el-table-column
                  prop="receive_status"
                  label="收款状态"
                  min-width="120"/>
                <el-table-column
                  prop="invoiceReceipt"
                  label="收款金额"
                  min-width="120">
                  <template slot-scope="scope">
                    <span>{{ scope.row.invoiceReceipt !== undefined ? scope.row.invoiceReceipt.receipt_money:'' }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="receipt_company"
                  label="付款公司"
                  min-width="120">
                  <template slot-scope="scope">
                    <span>{{ scope.row.invoiceReceipt !== undefined ? scope.row.invoiceReceipt.receipt_company : '' }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="receipt_date"
                  label="到账时间"
                  min-width="120">
                  <template slot-scope="scope">
                    <span>{{ scope.row.invoiceReceipt !== undefined ? scope.row.invoiceReceipt.receipt_date : '' }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="contract_number"
            label="合同编号"
            min-width="80"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="company_name"
            label="公司名称"
            min-width="100"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="name"
            label="合同名称"
            min-width="80"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="applicant_name"
            label="申请人"
            min-width="80"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="amount"
            label="合同金额"
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
import { 
  getRemindContractList,
  Cookies,
  downloadUrl,
  getExportDownload } from 'service'

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
        company_name:'',
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
  created() {
    let user_info = JSON.parse(Cookies.get('user_info'))
    this.getRemindContractList()
  },
  methods: {
    setArgs(){
      let args = {
        include: 'receiveDate.invoiceReceipt',
        page: this.pagination.currentPage,
        name: this.searchForm.name,
        company_name: this.searchForm.company_name,
        contract_number: this.searchForm.contract_number
      }
      if (!this.searchForm.name) {
        delete args.name
      }
      if (!this.searchForm.company_name) {
        delete args.company_name
      }
      if (this.searchForm.contract_number === '') {
        delete args.contract_number
      }
      return args
    },
    download(){
      let args = this.setArgs();
      delete args.include;
      delete args.page;
      return getExportDownload(this,downloadUrl.REMIND_EXPORT_API, args)
        .then(response => {
          const a = document.createElement("a");
          a.href = response;
          a.download = "download";
          a.click();
          window.URL.revokeObjectURL(response);
        })
        .catch(err => {
          console.log(err);
        });
    },
    getRemindContractList() {
      this.setting.loading = true
      let args = this.setArgs();
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
      console.log(currentPage)
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
