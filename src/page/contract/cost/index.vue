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
            <el-form-item label prop="contract_name">
              <el-input v-model="searchForm.contract_name" placeholder="请输入合同名称" clearable/>
            </el-form-item>
            <el-form-item label prop="contract_number">
              <el-input v-model="searchForm.contract_number" placeholder="请输入合同编号" clearable/>
            </el-form-item>
            <el-form-item label prop="dataValue">
              <el-date-picker
                v-model="searchForm.dataValue"
                :clearable="false"
                :picker-options="pickerOptions"
                type="daterange"
                align="right"
                unlink-panels
                start-placeholder="修改开始日期"
                end-placeholder="修改结束日期"
              />
            </el-form-item>
            <el-form-item label>
              <el-button type="primary" size="small" @click="search('searchForm')">搜索</el-button>
              <el-button type="default" size="small" @click="resetSearch('searchForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 开票列表 -->
        <div class="total-wrap">
          <span class="label">总数:{{ pagination.total }}</span>
          <div>
            <el-button size="small" type="success" @click="addCost">新增成本</el-button>
          </div>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="合同编号:">
                  <span>{{ scope.row.contract_number }}</span>
                </el-form-item>
                <el-form-item label="合同名称:">
                  <span>{{ scope.row.contract_name }}</span>
                </el-form-item>
                <el-form-item label="所属人:">
                  <span>{{ scope.row.applicant_name }}</span>
                </el-form-item>
                <el-form-item label="成本总额:">
                  <span>{{ scope.row.total_cost }}</span>
                </el-form-item>
                <el-form-item label="已确认成本:">
                  <span>{{ scope.row.confirm_cost }}</span>
                </el-form-item>
                <el-form-item label="创建时间:">
                  <span>{{ scope.row.created_at }}</span>
                </el-form-item>
                <el-form-item label="修改时间:">
                  <span>{{ scope.row.updated_at }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="contract_number"
            label="合同编号"
            min-width="100"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="contract_name"
            label="合同名称"
            min-width="80"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="applicant_name"
            label="所属人"
            min-width="80"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="total_cost"
            label="成本总额"
            min-width="80"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="confirm_cost"
            label="已确认成本"
            min-width="80"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="created_at"
            label="创建时间"
            min-width="80"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="updated_at"
            label="修改时间"
            min-width="80"
          />
          <el-table-column label="操作" min-width="180">
            <template slot-scope="scope">
              <el-button size="mini" @click="detailCost(scope.row)">详情</el-button>
              <el-button size="mini" type="warning" @click="editCost(scope.row)">编辑</el-button>
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
  DatePicker
} from "element-ui";
import {
  getCostList,
  Cookies,
  handleDateTransform,
  getContract,
  receiptInvoice,
  getReceiveDate
} from "service";

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
    "el-date-picker": DatePicker
  },
  data() {
    return {
      searchForm: {
        dataValue: [],
        contract_name: "",
        contract_number: ""
      },
      pickerOptions: {
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
          id: 0,
          name: "运营已修改"
        },
        {
          id: 1,
          name: "审计已修改"
        },
        {
          id: 2,
          name: "法务主管已确定"
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
      tableData: []
    };
  },
  computed: {
    // 运营
    operation: function() {
      return this.roles.find(r => {
        return r.name === "operation";
      });
    },
    // 审计
    auditor: function() {
      return this.roles.find(r => {
        return r.name === "auditor";
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
    this.getCostList();
  },
  methods: {
    getCostList() {
      this.setting.loading = true;
      let args = {
        page: this.pagination.currentPage,
        contract_name: this.searchForm.contract_name,
        contract_number: this.searchForm.contract_number,
        start_date: handleDateTransform(this.searchForm.dataValue[0]),
        end_date: handleDateTransform(this.searchForm.dataValue[1])
      };
      if (this.searchForm.contract_name === "") {
        delete args.contract_name;
      }
      if (this.searchForm.contract_number === "") {
        delete args.contract_number;
      }
      if (!this.searchForm.dataValue[0]) {
        delete args.start_date;
      }
      if (!this.searchForm.dataValue[1]) {
        delete args.end_date;
      }
      getCostList(this, args)
        .then(res => {
          this.tableData = res.data;
          this.pagination.total = res.meta.pagination.total;
          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
        });
    },
    addCost() {
      this.$router.push({
        path: "/contract/cost/add"
      });
    },
    editCost(data) {
      this.$router.push({
        path: "/contract/cost/edit/" + data.id
      });
    },
    detailCost(data) {
      this.$router.push({
        path: "/contract/cost/detail/" + data.id
      });
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getCostList();
    },
    search() {
      this.pagination.currentPage = 1;
      this.getCostList();
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getCostList();
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
