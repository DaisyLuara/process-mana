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
            :inline="true" 
            class="search-content">
            <el-form-item 
              label 
              prop="status">
              <el-form-item 
                label 
                prop="title">
                <el-input
                  v-model="searchForm.title"
                  clearable
                  placeholder="请输入项目标的"
                  class="item-input"
                />
              </el-form-item>
              <el-select
                v-model="searchForm.applicant_id"
                :loading="searchLoading"
                placeholder="请选择申请人"
                filterable
                clearable
              >
                <el-option
                  v-for="item in applicantList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item 
              label 
              prop="status">
              <el-select 
                v-model="searchForm.status" 
                placeholder="请选择状态" 
                filterable 
                clearable>
                <el-option
                  v-for="item in statusList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item 
              label 
              prop="receiver_id">
              <el-select
                v-model="searchForm.receiver_id"
                :loading="searchLoading"
                placeholder="请选择接单人"
                filterable
                clearable
              >
                <el-option
                  v-for="item in receiverList"
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
                :picker-options="pickerOptions"
                type="daterange"
                align="right"
                unlink-panels
                start-placeholder="申请开始日期"
                end-placeholder="申请结束日期"
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
        <!-- 合同列表 -->
        <div class="total-wrap">
          <span class="label">总数:{{ pagination.total }}</span>
          <div>
            <el-button
              v-if="bd || bdManager || businessOperation || operation"
              size="small"
              type="success"
              @click="addDemand"
            >新增申请</el-button>
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
                <el-form-item label="ID:">
                  <span>{{ scope.row.id }}</span>
                </el-form-item>
                <el-form-item label="项目标的:">
                  <span>{{ scope.row.title }}</span>
                </el-form-item>
                <el-form-item label="申请人:">
                  <span>{{ scope.row.applicant_name }}</span>
                </el-form-item>
                <el-form-item label="接单人:">
                  <span>{{ scope.row.receiver_name }}</span>
                </el-form-item>
                <el-form-item label="状态:">
                  <span>{{ scope.row.status===0 ? '未接单' : scope.row.status===1 ? '已完成' : scope.row.status===2 ? '已接单' : '修改中' }}</span>
                </el-form-item>
                <el-form-item label="申请时间:">
                  <span>{{ scope.row.created_at }}</span>
                </el-form-item>
                <el-form-item label="接单时间:">
                  <span>{{ scope.row.receiver_time }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column 
            :show-overflow-tooltip="true" 
            prop="id" 
            label="ID" 
            min-width="80"/>
          <el-table-column 
            :show-overflow-tooltip="true" 
            prop="title" 
            label="项目标的" 
            min-width="100"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="applicant_name"
            label="申请人"
            min-width="80"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="receiver_name"
            label="接单人"
            min-width="80"
          />
          <el-table-column 
            :show-overflow-tooltip="true" 
            prop="status" 
            label="状态" 
            min-width="80">
            <template
              slot-scope="scope"
            >{{ scope.row.status===0 ? '未接单' : scope.row.status===1 ? '已完成' : scope.row.status===2 ? '已接单' : '修改中' }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="created_at"
            label="申请时间"
            min-width="80"
          >
            <template slot-scope="scope">{{ scope.row.created_at }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="receiver_time"
            label="接单时间"
            min-width="80"
          >
            <template slot-scope="scope">{{ scope.row.receiver_time }}</template>
          </el-table-column>
          <el-table-column 
            label="操作" 
            min-width="200">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.applicant_id === applicant && scope.row.status === 0"
                size="mini"
                type="primary"
                @click="editDemand(scope.row)"
              >编辑</el-button>
              <el-button
                v-if="(scope.row.status === 2 || scope.row.status === 3) && scope.row.applicant_id === applicant"
                size="mini"
                type="success"
                @click="confirmDemand(scope.row)"
              >确认完成</el-button>
              <el-button
                v-if="(projectManager || designer || legalAffairsManager) && scope.row.status === 0"
                size="mini"
                type="warning"
                @click="detailDemand(scope.row)"
              >接单</el-button>
              <el-button 
                size="mini" 
                type="info" 
                @click="detailDemand(scope.row)">详情</el-button>
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
  Pagination,
  Form,
  FormItem,
  MessageBox,
  Select,
  Option,
  DatePicker
} from "element-ui";
import {
  getDemandList,
  handleDateTransform,
  confirmDemand,
  Cookies,
  getSearchDemandPeople,
  downloadUrl,
  getExportDownload
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
        title: "",
        applicant_id: null,
        status: "",
        receiver_id: null
      },
      roles: {},
      applicantList: [],
      receiverList: [],
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
          name: "未接单"
        },
        {
          id: 1,
          name: "已完成"
        },
        {
          id: 2,
          name: "已接单"
        },
        {
          id: 3,
          name: "修改中"
        }
      ],
      setting: {
        loading: false,
        loadingText: "拼命加载中"
      },
      applicant: null,
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
    // BD
    bd: function() {
      return this.roles.find(r => {
        return r.name === "user";
      });
    },
    // BD主管
    bdManager: function() {
      return this.roles.find(r => {
        return r.name === "bd-manager";
      });
    },
    // 业务运营
    businessOperation: function() {
      return this.roles.find(r => {
        return r.name === "business-operation";
      });
    },
    // 平台运营
    operation: function() {
      return this.roles.find(r => {
        return r.name === "operation";
      });
    },
    // 产品经理
    projectManager: function() {
      return this.roles.find(r => {
        return r.name === "project-manager";
      });
    },
    // 设计
    designer: function() {
      return this.roles.find(r => {
        return r.name === "designer";
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
    this.getDemandList();
    this.getSearchDemandPeople("demand.application.receive", "receive");
    this.getSearchDemandPeople("demand.application.create", "create");
    let user_info = JSON.parse(Cookies.get("user_info"));
    this.applicant = user_info.id;
    this.roles = user_info.roles.data;
  },
  methods: {
    setArgs(){
      let args = {
        page: this.pagination.currentPage,
        title: this.searchForm.title,
        status: this.searchForm.status,
        applicant_id: this.searchForm.applicant_id,
        receiver_id: this.searchForm.receiver_id,
        create_start_date: handleDateTransform(this.searchForm.dataValue[0]),
        create_end_date: handleDateTransform(this.searchForm.dataValue[1])
      };
      if (!this.searchForm.title) {
        delete args.title;
      }
      if (this.searchForm.status === "") {
        delete args.status;
      }
      if (!this.searchForm.applicant_id) {
        delete args.applicant_id;
      }
      if (!this.searchForm.receiver_id) {
        delete args.receiver_id;
      }
      if (!this.searchForm.dataValue[0]) {
        delete args.create_start_date;
      }
      if (!this.searchForm.dataValue[1]) {
        delete args.create_end_date;
      }
      return args
    },
    download(){
      let args = this.setArgs();
      delete args.page;
      return getExportDownload(this,downloadUrl.DEMAND_APPLY_EXPORT_API, args)
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
    getSearchDemandPeople(permissionString, type) {
      this.searchLoading = true;
      let args = {
        permission: permissionString
      };
      getSearchDemandPeople(this, args)
        .then(res => {
          if (type === "receive") {
            this.receiverList = res;
          } else if (type === "create") {
            this.applicantList = res;
          }
          this.searchLoading = false;
        })
        .catch(err => {
          this.searchLoading = false;

          this.$message({
            type: "success",
            message: err.response.data.message
          });
        });
    },
    confirmDemand(data) {
      let id = data.id;
      this.$confirm("是否确认完成?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.setting.loading = true;
          confirmDemand(this, id)
            .then(response => {
              this.setting.loading = false;
              this.$message({
                type: "success",
                message: "确认完成成功！"
              });
              this.pagination.currentPage = 1;
              this.getDemandList();
            })
            .catch(error => {
              this.setting.loading = false;
              this.$message({
                message: error.response.data.message,
                type: "warning"
              });
            });
        })
        .catch(e => {
          this.setting.loading = false;
        });
    },
    getDemandList() {
      this.setting.loading = true;
      let args = this.setArgs();
      getDemandList(this, args)
        .then(res => {
          this.tableData = res.data;
          this.pagination.total = res.meta.pagination.total;
          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
        });
    },
    addDemand() {
      this.$router.push({
        path: "/demand/list/add"
      });
    },
    editDemand(data) {
      this.$router.push({
        path: "/demand/list/edit/" + data.id
      });
    },
    detailDemand(data) {
      this.$router.push({
        path: "/demand/list/detail/" + data.id
      });
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getDemandList();
    },
    search() {
      this.pagination.currentPage = 1;
      this.getDemandList();
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getDemandList();
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
        .search-content {
          width: 1000px;
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
