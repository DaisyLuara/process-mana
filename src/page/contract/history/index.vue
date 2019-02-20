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
          <el-form ref="searchForm" :model="searchForm" :inline="true">
            <el-form-item label prop="status">
              <el-select v-model="searchForm.status" placeholder="请选择审批状态" filterable clearable>
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label prop="name">
              <el-input
                v-model="searchForm.name"
                clearable
                placeholder="请输入公司名称"
                class="item-input"
              />
            </el-form-item>
            <el-form-item label prop="contract_number">
              <el-input
                v-model="searchForm.contract_number"
                clearable
                placeholder="请输入合同编号"
                class="item-input"
              />
            </el-form-item>
            <el-form-item label prop="product_status">
              <el-select
                v-model="searchForm.product_status"
                :loading="searchLoading"
                filterable
                clearable
                placeholder="请选择硬件状态"
              >
                <el-option
                  v-for="item in productStatusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label prop="dataValue">
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
              <el-button type="primary" size="small" @click="search('searchForm')">搜索</el-button>
              <el-button type="default" size="small" @click="resetSearch('searchForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 合同列表 -->
        <div class="total-wrap">
          <span class="label">总数:{{ pagination.total }}</span>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="合同编号:">
                  <span>{{ scope.row.contract_number }}</span>
                </el-form-item>
                <el-form-item label="公司名称:">
                  <span>{{ scope.row.company_name }}</span>
                </el-form-item>
                <el-form-item label="合同名称:">
                  <span>{{ scope.row.name }}</span>
                </el-form-item>
                <el-form-item label="申请人:">
                  <span>{{ scope.row.applicant_name }}</span>
                </el-form-item>
                <el-form-item label="审批状态:">
                  <span>{{ scope.row.status }}</span>
                </el-form-item>
                <el-form-item label="待处理人:">
                  <span>{{ scope.row.handler_name }}</span>
                </el-form-item>
                <el-form-item label="硬件状态">
                  <span>{{ scope.row.product_status }}</span>
                </el-form-item>
                <el-form-item label="申请时间:">
                  <span>{{ scope.row.created_at }}</span>
                </el-form-item>
                <el-form-item label="最后操作时间:">
                  <span>{{ scope.row.updated_at }}</span>
                </el-form-item>
                <el-form-item label="收款日期:">
                  <span style="color:#dd0d0d;">{{ scope.row.receive_date }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="contract_number"
            label="合同编号"
            min-width="80"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.contract_number }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="company_name"
            label="公司名称"
            min-width="100"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.company_name }}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="name" label="合同名称" min-width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="applicant_name"
            label="申请人"
            min-width="80"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.applicant_name }}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="status" label="审批状态" min-width="80">
            <template slot-scope="scope">
              <span>{{ scope.row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="handler_name"
            label="待处理人"
            min-width="80"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.handler_name === null ? '--' : scope.row.handler_name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="product_status"
            label="硬件状态"
            min-width="70"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="apply_time"
            label="申请时间"
            min-width="80"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.created_at }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="200">
            <template slot-scope="scope">
              <el-button size="mini" type="info" @click="detailContract(scope.row)">详情</el-button>
              <el-button
                v-if="scope.row.status === '已审批' && scope.row.product_status === '已出厂' "
                size="mini"
                @click="productHandle(scope.row)"
              >硬件详情</el-button>
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
      title="硬件详情"
      :show-close="false"
      :visible.sync="dialogFormVisible"
      label-width="80px"
    >
      <el-table
        v-loading="loading"
        :data="productTableData"
        border
        style="width: 100%;margin-bottom: 20px;"
      >
        <el-table-column
          prop="product_sku"
          label="SKU"
          min-width="80"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="name"
          label="产品名称"
          min-width="80"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">{{ scope.row.attribute.name }}</template>
        </el-table-column>
        <el-table-column
          prop="color"
          label="产品颜色"
          min-width="80"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">{{ scope.row.attribute.color }}</template>
        </el-table-column>
        <el-table-column
          prop="supplier"
          label="供应商"
          min-width="80"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">{{ scope.row.attribute.supplier }}</template>
        </el-table-column>
        <el-table-column
          prop="out_location_name"
          label="出库库位"
          min-width="80"
          align="center"
          header-align="center"
        />
        <el-table-column
          prop="num"
          label="产品数量"
          min-width="100"
          align="center"
          header-align="center"
        />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
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
  Pagination,
  Form,
  FormItem,
  MessageBox,
  Select,
  Option,
  Row,
  Col,
  DatePicker,
  Dialog
} from "element-ui";
import {
  contractHistory,
  handleDateTransform,
  leaveFactoryDetail
} from "service";

export default {
  components: {
    "el-dialog": Dialog,
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-button": Button,
    "el-input": Input,
    "el-pagination": Pagination,
    "el-form": Form,
    "el-form-item": FormItem,
    "el-select": Select,
    "el-option": Option,
    "el-row": Row,
    "el-col": Col,
    "el-date-picker": DatePicker
  },
  data() {
    return {
      loading: false,
      productTableData: [],
      dialogFormVisible: false,
      searchForm: {
        dataValue: [],
        name: "",
        status: "",
        contract_number: "",
        product_status: ""
      },
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
      statusList: [
        {
          id: 1,
          name: "待审批"
        },
        {
          id: 2,
          name: "审批中"
        },
        {
          id: 3,
          name: "已审批"
        },
        {
          id: 4,
          name: "特批"
        },
        {
          id: 5,
          name: "驳回"
        }
      ],
      productStatusList: [
        {
          id: 0,
          name: "无硬件"
        },
        {
          id: 1,
          name: "未出厂"
        },
        {
          id: 2,
          name: "已出厂"
        }
      ],
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
      contractId: null,
      productStatus: null,
      tableData: []
    };
  },
  created() {
    this.contractHistory();
  },
  methods: {
    editHandle(data) {
      this.$router.push({
        path: "/contract/list/edit/" + data.id
      });
    },
    productHandle(data) {
      this.loading = true;
      this.dialogFormVisible = true;
      this.contractId = data.id;
      this.productStatus = data.product_status;
      this.leaveFactoryDetail();
    },
    leaveFactoryDetail() {
      this.productTableData = [];
      let args = {
        id: this.contractId
      };
      leaveFactoryDetail(this, args)
        .then(res => {
          if (res.data.length > 0) {
            this.productTableData = res.data[0].product_content;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.$message({
            message: err.response.data.message,
            type: "warning"
          });
        });
    },
    contractHistory() {
      this.setting.loading = true;
      let args = {
        include: "company",
        page: this.pagination.currentPage,
        name: this.searchForm.name,
        status: this.searchForm.status,
        contract_number: this.searchForm.contract_number,
        start_date: handleDateTransform(this.searchForm.dataValue[0]),
        end_date: handleDateTransform(this.searchForm.dataValue[1]),
        product_status: this.searchForm.product_status
      };
      if (!this.searchForm.name) {
        delete args.name;
      }
      if (this.searchForm.contract_number === "") {
        delete args.contract_number;
      }
      if (this.searchForm.product_status === "") {
        delete args.product_status;
      }
      if (!this.searchForm.status) {
        delete args.status;
      }
      if (!this.searchForm.dataValue[0]) {
        delete args.start_date;
      }
      if (!this.searchForm.dataValue[1]) {
        delete args.end_date;
      }
      contractHistory(this, args)
        .then(res => {
          this.tableData = res.data;
          this.pagination.total = res.meta.pagination.total;
          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
        });
    },
    detailContract(data) {
      this.$router.push({
        path: "/contract/history/detail/" + data.id
      });
    },
    changePage(currentPage) {
      console.log(currentPage);
      this.pagination.currentPage = currentPage;
      this.contractHistory();
    },
    search() {
      this.pagination.currentPage = 1;
      this.contractHistory();
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.contractHistory();
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
