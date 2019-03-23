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
          <el-form ref="searchForm" :model="searchForm" :inline="true" class="search-content">
            <el-form-item label prop="status">
              <el-form-item label prop="demand_application_id">
                <el-select
                  v-model="searchForm.demand_application_id"
                  :loading="searchLoading"
                  placeholder="请选择项目标的"
                  filterable
                  clearable
                >
                  <el-option
                    v-for="item in titleList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-select
                v-model="searchForm.has_feedback"
                :loading="searchLoading"
                placeholder="请选择反馈状态"
                filterable
                clearable
              >
                <el-option
                  v-for="item in feedbackList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label prop="status">
              <el-select v-model="searchForm.status" placeholder="请选择平台意见" filterable clearable>
                <el-option
                  v-for="item in statusList"
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
                :picker-options="pickerOptions"
                type="daterange"
                align="right"
                unlink-panels
                start-placeholder="创建开始日期"
                end-placeholder="创建结束日期"
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
          <div>
            <el-button
              v-if="bd || bdManager || businessOperation"
              size="small"
              type="success"
              @click="addModify"
            >新增修改</el-button>
          </div>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="ID:">
                  <span>{{ scope.row.id }}</span>
                </el-form-item>
                <el-form-item label="项目标的:">
                  <span>{{ scope.row.demand_application.title }}</span>
                </el-form-item>
                <el-form-item label="需求修改标题:">
                  <span>{{ scope.row.title }}</span>
                </el-form-item>
                <el-form-item label="反馈状态:">
                  <span>{{ scope.row.has_feedback===0 ? '未反馈' : '已反馈' }}</span>
                </el-form-item>
                <el-form-item label="反馈人:">
                  <span>{{ scope.row.feedback_person_name }}</span>
                </el-form-item>
                <el-form-item label="平台意见:">
                  <span>{{ scope.row.status===0 ? '待处理' : scope.row.status===1 ? '已审核' : '已驳回' }}</span>
                </el-form-item>
                <el-form-item label="创建时间:">
                  <span>{{ scope.row.created_at }}</span>
                </el-form-item>
                <el-form-item label="反馈时间:">
                  <span>{{ scope.row.feedback_time }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="id" label="ID" min-width="80"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="demand_application_name"
            label="项目标的"
            min-width="100"
          >
            <template slot-scope="scope">{{ scope.row.demand_application.title }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="title"
            label="需求修改标题"
            min-width="100"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="has_feedback"
            label="反馈状态"
            min-width="80"
          >
            <template slot-scope="scope">{{ scope.row.has_feedback===0 ? '未反馈' : '已反馈' }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="feedback_person_name"
            label="反馈人"
            min-width="100"
          />
          <el-table-column :show-overflow-tooltip="true" prop="status" label="平台意见" min-width="80">
            <template
              slot-scope="scope"
            >{{ scope.row.status===0 ? '待处理' : scope.row.status===1 ? '已审核' : '已驳回' }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="created_at"
            label="创建时间"
            min-width="80"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="feedback_time"
            label="反馈时间"
            min-width="80"
          />

          <el-table-column label="操作" min-width="200">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.applicant_id === applicant && scope.row.has_feedback === 0"
                size="mini"
                type="primary"
                @click="editModify(scope.row)"
              >编辑</el-button>
              <el-button
                v-if="((scope.row.has_feedback === 1 && scope.row.status === 0) || timeRange(scope.row)) && ( bonusManager || legalAffairsManager || operation)"
                size="mini"
                type="success"
                @click="review(scope.row)"
              >审批</el-button>
              <el-button
                v-if="scope.row.has_feedback === 0 && scope.row.demand_application.receiver_id === applicant"
                size="mini"
                type="warning"
                @click="detailModify(scope.row)"
              >反馈</el-button>
              <el-button size="mini" type="info" @click="detailModify(scope.row)">详情</el-button>
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
    <el-dialog title="平台意见" :visible.sync="dialogFormVisible" :show-close="false">
      <el-form :model="reviewFrom">
        <el-form-item label="审批状态" label-width="100px">
          <el-radio-group v-model="reviewFrom.review" @change="reviewHandle">
            <el-radio :label="0">驳回</el-radio>
            <el-radio :label="1">通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="rejectShow"
          :rules="[{ required: true, message: '请输入驳回理由', trigger: 'submit' }]"
          label="驳回理由"
          label-width="100px"
        >
          <el-input
            v-model="reviewFrom.reject_remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请填写驳回理由"
            class="text-input"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
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
  Radio,
  RadioGroup,
  DatePicker,
  Dialog
} from "element-ui";
import {
  getDemandModifyList,
  handleDateTransform,
  reviewDemand,
  Cookies,
  getSearchDemandApplication
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
    "el-date-picker": DatePicker,
    "el-dialog": Dialog,
    "el-radio": Radio,
    "el-radio-group": RadioGroup
  },
  data() {
    return {
      dialogFormVisible: false,
      reviewFrom: {
        review: 0,
        reject_remark: ""
      },
      rejectShow: true,
      searchForm: {
        dataValue: [],
        demand_application_id: null,
        has_feedback: "",
        status: ""
      },
      roles: {},
      feedbackList: [
        {
          id: 0,
          name: "未反馈"
        },
        {
          id: 1,
          name: "已反馈"
        }
      ],
      titleList: [],
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
      modifyDemandId: null,
      statusList: [
        {
          id: 0,
          name: "待处理"
        },
        {
          id: 1,
          name: "已审核"
        },
        {
          id: 2,
          name: "已驳回"
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
    // 绩效主管
    bonusManager: function() {
      return this.roles.find(r => {
        return r.name === "bonus-manager";
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
    this.getDemandModifyList();
    this.getSearchDemandApplication();
    let user_info = JSON.parse(Cookies.get("user_info"));
    this.applicant = user_info.id;
    this.roles = user_info.roles.data;
  },
  methods: {
    // 反馈时间是否超过12小时
    timeRange: data => {
      let nowDate = new Date().getTime();
      let created_at = new Date(data.created_at).getTime();
      let time_range = nowDate - created_at;
      let has_feedback = data.has_feedback;
      let status = data.status;
      if (time_range > 12 * 3600 * 1000 && has_feedback === 0 && status === 0) {
        return true;
      } else {
        return false;
      }
    },
    reviewHandle(val) {
      if (val === 0) {
        this.rejectShow = true;
      } else {
        this.reviewFrom.reject_remark = "";
        this.rejectShow = false;
      }
    },
    cancel() {
      this.dialogFormVisible = false;
      this.reviewFrom.review = 0;
      this.reviewFrom.reject_remark = "";
    },
    review(data) {
      this.dialogFormVisible = true;
      this.modifyDemandId = data.id;
    },
    getSearchDemandApplication() {
      this.searchLoading = true;
      let args = {
        no_status: 0
      };
      getSearchDemandApplication(this, args)
        .then(res => {
          this.titleList = res;
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
    submit() {
      let args = {
        review: this.reviewFrom.review,
        reject_remark: this.reviewFrom.reject_remark
      };
      reviewDemand(this, this.modifyDemandId, args)
        .then(response => {
          this.dialogFormVisible = false;
          this.$message({
            type: "success",
            message: "审批成功！"
          });
          this.pagination.currentPage = 1;
          this.getDemandModifyList();
        })
        .catch(error => {
          this.dialogFormVisible = false;
          this.$message({
            message: error.response.data.message,
            type: "warning"
          });
        });
    },

    getDemandModifyList() {
      this.setting.loading = true;
      let args = {
        page: this.pagination.currentPage,
        demand_application_id: this.searchForm.demand_application_id,
        status: this.searchForm.status,
        has_feedback: this.searchForm.has_feedback,
        create_start_date: handleDateTransform(this.searchForm.dataValue[0]),
        create_end_date: handleDateTransform(this.searchForm.dataValue[1])
      };
      if (this.searchForm.status === "") {
        delete args.status;
      }
      if (this.searchForm.has_feedback === "") {
        delete args.has_feedback;
      }
      if (!this.searchForm.demand_application_id) {
        delete args.demand_application_id;
      }
      if (!this.searchForm.dataValue[0]) {
        delete args.create_start_date;
      }
      if (!this.searchForm.dataValue[1]) {
        delete args.create_end_date;
      }
      getDemandModifyList(this, args)
        .then(res => {
          this.tableData = res.data;
          this.pagination.total = res.meta.pagination.total;
          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
        });
    },
    addModify() {
      this.$router.push({
        path: "/demand/modify/add"
      });
    },
    editModify(data) {
      this.$router.push({
        path: "/demand/modify/edit/" + data.id
      });
    },
    detailModify(data) {
      this.$router.push({
        path: "/demand/modify/detail/" + data.id
      });
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getDemandModifyList();
    },
    search() {
      this.pagination.currentPage = 1;
      this.getDemandModifyList();
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getDemandModifyList();
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
