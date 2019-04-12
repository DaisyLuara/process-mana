<template>
  <div class="root">
    <div
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText"
      class="item-list-wrap"
    >
      <div class="item-content-wrap">
        <!-- 搜索 -->
        <div class="search-wrap">
          <el-form 
            ref="searchForm" 
            :model="searchForm" 
            :inline="true">
            <el-form-item 
              label 
              prop="name">
              <el-input 
                v-model="searchForm.name" 
                placeholder="付款公司" 
                clearable/>
            </el-form-item>
            <el-form-item 
              label 
              prop="claim_status">
              <el-select 
                v-model="searchForm.claim_status" 
                placeholder="认领状态">
                <el-option
                  v-for="item in statusReceiptList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item 
              label 
              prop="dataValue">
              <el-date-picker
                v-model="searchForm.dataValue"
                :clearable="false"
                :picker-options="pickerOptions2"
                type="daterange"
                align="right"
                unlink-panels
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item label>
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
        <div class="total-wrap">
          <span class="label">总数:{{ pagination.total }}</span>
          <div>
            <el-button 
              v-if="finance" 
              size="small" 
              type="success" 
              @click="addReceipt">新增收款</el-button>
            <el-button
              size="small"
              @click="download"
            >下载</el-button>
          </div>
        </div>
        <el-table 
          :data="tableData" 
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form 
                label-position="left" 
                inline 
                class="demo-table-expand">
                <el-form-item label="付款公司:">
                  <span>{{ scope.row.receipt_company }}</span>
                </el-form-item>
                <el-form-item label="收款金额:">
                  <span>{{ scope.row.receipt_money }}</span>
                </el-form-item>
                <el-form-item label="到账日期:">
                  <span>{{ scope.row.receipt_date }}</span>
                </el-form-item>
                <el-form-item label="认领状态:">
                  <span>{{ scope.row.claim_status }}</span>
                </el-form-item>
                <el-form-item label="收款创建人:">
                  <span>{{ scope.row.creator }}</span>
                </el-form-item>
                <el-form-item
                  label="预估收款时间:"
                >{{ scope.row.receiveDate !== undefined ? scope.row.receiveDate.receive_date : '' }}</el-form-item>
                <el-form-item label="合同编号:">
                  <span>{{ scope.row.receiveDate !== undefined ? scope.row.receiveDate.contract.contract_number : '' }}</span>
                </el-form-item>
                <el-form-item label="所属人:">
                  <span>{{ scope.row.receiveDate !== undefined ? scope.row.receiveDate.contract.applicant_name : '' }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="receipt_company"
            label="付款公司"
            min-width="100"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="receipt_money"
            label="收款金额"
            min-width="80"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="receipt_date"
            label="到账日期"
            min-width="80"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="creator"
            label="收款创建人"
            min-width="100"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="claim_status"
            label="认领状态"
            min-width="80"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="receive_data"
            label="预估收款时间"
            min-width="80"
          >
            <template
              slot-scope="scope"
            >{{ scope.row.receiveDate !== undefined ? scope.row.receiveDate.receive_date : '' }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="contract_number"
            label="合同编号"
            min-width="80"
          >
            <template
              slot-scope="scope"
            >{{ scope.row.receiveDate !== undefined ? scope.row.receiveDate.contract.contract_number : '' }}</template>
          </el-table-column>
          <el-table-column 
            :show-overflow-tooltip="true" 
            prop="BD" 
            label="所属人" 
            min-width="80">
            <template
              slot-scope="scope"
            >{{ scope.row.receiveDate !== undefined ? scope.row.receiveDate.contract.applicant_name : '' }}</template>
          </el-table-column>
          <el-table-column
            v-if="finance || legalAffairs || legalAffairsManager || operation"
            label="操作"
            min-width="200"
          >
            <template slot-scope="scope">
              <el-button
                v-if="finance && scope.row.claim_status === '未认领'"
                size="mini"
                type="primary"
                @click="editReceipt(scope.row)"
              >编辑</el-button>
              <el-button
                v-if="(legalAffairs || legalAffairsManager || operation) && scope.row.claim_status === '未认领'"
                size="mini"
                type="warning"
                @click="handleReceipt(scope.row)"
              >认领收款</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrap">
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
    <el-dialog 
      :visible.sync="dialogFormVisible" 
      title="认领收款">
      <el-form 
        :model="claimReceiptForm" 
        label-position="right" 
        label-width="100px">
        <el-form-item label="合同编号">
          <el-select
            v-model="claimReceiptForm.contract_id"
            :remote-method="getContract"
            :loading="searchLoading"
            remote
            filterable
            clearable
            placeholder="请搜索合同编号"
            @change="contractChangeHandle"
          >
            <el-option
              v-for="item in contractList"
              :key="item.id"
              :label="item.contract_number"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="预估收款日期">
          <el-select
            v-model="claimReceiptForm.dateId"
            :loading="searchLoading"
            filterable
            clearable
            placeholder="请选择预估收款日期"
          >
            <el-option
              v-for="item in receiptDateList"
              :key="item.id"
              :label="item.receive_date"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div 
        slot="footer" 
        class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button 
          type="primary" 
          @click="receiptInvoice">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  Button,
  Input,
  Table,
  TableColumn,
  Select,
  Option,
  Pagination,
  Form,
  FormItem,
  MessageBox,
  DatePicker,
  Dialog
} from "element-ui";
import {
  getReceiptList,
  Cookies,
  handleDateTransform,
  getContract,
  receiptInvoice,
  getReceiveDate,
  downloadUrl,
  getExportDownload } from 'service'

export default {
  components: {
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-button": Button,
    "el-input": Input,
    "el-pagination": Pagination,
    "el-form": Form,
    "el-form-item": FormItem,
    "el-select": Select,
    "el-option": Option,
    "el-date-picker": DatePicker,
    "el-dialog": Dialog
  },
  data() {
    return {
      claimReceiptForm: {
        contract_id: "",
        dateId: ""
      },
      dialogFormVisible: false,
      searchForm: {
        name: "",
        claim_status: "",
        dataValue: []
      },
      contractList: [],
      receiptDateList: [],
      pickerOptions2: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      statusReceiptList: [
        {
          id: 0,
          name: "未认领"
        },
        {
          id: 1,
          name: "已认领"
        }
      ],
      roles: {},
      setting: {
        loading: false,
        loadingText: "拼命加载中"
      },
      searchLoading: false,
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      tableData: [],
      id: ""
    };
  },
  computed: {
    // 财务
    finance: function() {
      return this.roles.find(r => {
        return r.name === "finance";
      });
    },

    // 运营
    operation: function() {
      return this.roles.find(r => {
        return r.name === "operation";
      });
    },
    // 法务
    legalAffairs: function() {
      return this.roles.find(r => {
        return r.name === "legal-affairs";
      });
    },
    // 法务主管
    legalAffairsManager: function() {
      return this.roles.find(r => {
        return r.name === "legal-affairs-manager";
      });
    }
  },
  created() {
    let user_info = JSON.parse(Cookies.get("user_info"));
    this.roles = user_info.roles.data;
    this.getReceiptList();
  },
  methods: {
    setArgs(){
      let args = {
        page: this.pagination.currentPage,
        include: "receiveDate.contract",
        name: this.searchForm.name,
        claim_status: this.searchForm.claim_status,
        start_date: handleDateTransform(this.searchForm.dataValue[0]),
        end_date: handleDateTransform(this.searchForm.dataValue[1])
      };
      if (!this.searchForm.name) {
        delete args.name;
      }
      if (this.searchForm.claim_status === "") {
        delete args.claim_status;
      }
      if (!this.searchForm.dataValue[0]) {
        delete args.start_date;
      }
      if (!this.searchForm.dataValue[1]) {
        delete args.end_date;
      }
      return args
    },
    download(){
      let args = this.setArgs();
      delete args.include;
      delete args.page;
      return getExportDownload(this,downloadUrl.RECEIPT_EXPORT_API, args)
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
    getContract(query) {
      this.searchLoading = true;
      let args = {
        // 0 收款
        type: 0,
        contract_number: query
      };
      getContract(this, args)
        .then(res => {
          this.searchLoading = false;
          this.contractList = res.data;
        })
        .catch(err => {
          this.searchLoading = false;
          this.$message({
            message: err.response.data.message,
            type: "warning"
          });
        });
    },
    contractChangeHandle() {
      this.claimReceiptForm.dateId = "";
      this.getReceiveDate();
    },
    getReceiveDate() {
      this.searchLoading = true;
      let args = {
        id: this.claimReceiptForm.contract_id
      };
      getReceiveDate(this, args)
        .then(res => {
          this.receiptDateList = res.data;
          this.searchLoading = false;
        })
        .catch(err => {
          this.$message({
            message: err.response.data.message,
            type: "warning"
          });
          this.searchLoading = false;
        });
    },
    handleReceipt(obj) {
      this.id = obj.id;
      this.claimReceiptForm.contract_id = "";
      this.claimReceiptForm.dateId = "";
      this.dialogFormVisible = true;
    },
    getReceiptList() {
      this.setting.loading = true;
      let args = this.setArgs();
      getReceiptList(this, args)
        .then(res => {
          this.tableData = res.data;
          this.pagination.total = res.meta.pagination.total;
          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
        });
    },
    addReceipt() {
      this.$router.push({
        path: "/invoice/receipt/add"
      });
    },
    editReceipt(data) {
      this.$router.push({
        path: "/invoice/receipt/edit/" + data.id
      });
    },
    receiptInvoice() {
      if (this.claimReceiptForm.dateId !== "") {
        this.setting.loading = true;
        let args = {
          receive_date_id: this.claimReceiptForm.dateId
        };
        receiptInvoice(this, this.id, args)
          .then(res => {
            this.dialogFormVisible = false;
            this.getReceiptList();
          })
          .catch(err => {
            this.dialogFormVisible = false;
            this.setting.loading = false;
            this.$message({
              message: err.response.data.message,
              type: "warning"
            });
          });
      } else {
        this.$message({
          message: "合同编号，预估收款日期必须填写",
          type: "warning"
        });
      }
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getReceiptList();
    },
    search() {
      this.pagination.currentPage = 1;
      this.getReceiptList();
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getReceiptList();
    }
  }
};
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
