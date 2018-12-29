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
          <div>
            <el-button
              v-if="bd || bdManager ||legalAffairs || legalAffairsManager"
              size="small"
              type="success"
              @click="addContract"
            >新增合同</el-button>
          </div>
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
                <el-form-item label="收款总额:">
                  <span>{{ scope.row.amount }}</span>
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
                  <span>{{ scope.row.hardware_status }}</span>
                </el-form-item>
                <el-form-item label="申请时间:">
                  <span>{{ scope.row.created_at }}</span>
                </el-form-item>
                <el-form-item label="最后操作时间:">
                  <span>{{ scope.row.updated_at }}</span>
                </el-form-item>
                <el-form-item v-if="scope.row.type === '收款合同'" label="预估收款日期:">
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
            prop="hardware_status"
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
          <el-table-column label="操作" min-width="180">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status === '驳回' && scope.row.handler === applicant"
                size="mini"
                type="primary"
                @click="editContract(scope.row)"
              >再次提交</el-button>
              <el-button
                v-if="scope.row.handler === applicant && scope.row.status !== '驳回'"
                size="mini"
                @click="auditingContract(scope.row)"
              >审批</el-button>
              <el-button
                v-if="((scope.row.status === '待审批' && bd && scope.row.applicant === applicant) || (scope.row.status === '待审批' && bdManager && scope.row.applicant === applicant)) "
                size="mini"
                type="danger"
                @click="deleteContract(scope.row)"
              >删除</el-button>
              <el-button
                v-if="scope.row.status === '待审批' && scope.row.applicant === applicant"
                size="mini"
                type="warning"
                @click="specialAuditingContract(scope.row)"
              >特批</el-button>
              <el-button size="mini" type="info" @click="detailContract(scope.row)">详情</el-button>
              <!-- && purchase -->
              <el-button v-if="scope.row.status === '已审批'" size="mini" @click="hardwareHandle">硬件</el-button>
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
    <el-dialog title="硬件出厂" :visible.sync="dialogFormVisible" label-width="80px">
      <el-button
        size="small"
        type="success"
        style="margin-bottom: 20px;"
        @click="hardwareAdd"
      >新增硬件信息</el-button>
      <el-table :data="hardwareTableData" border style="width: 100%;margin-bottom: 20px;">
        <el-table-column
          prop="model"
          label="硬件型号"
          min-width="80"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.model_id"
              :loading="searchLoading"
              placeholder="请选择硬件型号"
              filterable
              clearable
            >
              <el-option
                v-for="item in modelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="color"
          label="硬件颜色"
          min-width="80"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.color_id"
              :loading="searchLoading"
              placeholder="请选择硬件颜色"
              filterable
              clearable
            >
              <el-option
                v-for="item in colorList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
          prop="origin"
          label="硬件出处"
          min-width="80"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.origin" type="tel" placeholder="请输入硬件出处"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="硬件数量"
          min-width="100"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.amount" placeholder="请输入硬件数量"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteHardware(scope.$index)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
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
  getContractList,
  handleDateTransform,
  deleteContract,
  specialAuditingContract,
  Cookies,
  getAuditingCount
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
      modelList: [],
      colorList: [],
      searchForm: {
        dataValue: [],
        name: "",
        status: "",
        contract_number: ""
      },
      hardwareForm: {
        origin: "",
        amount: null
      },
      dialogFormVisible: false,
      role: [],
      applicant: null,
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
      originList: [
        {
          id: 1,
          name: "工厂库存"
        },
        {
          id: 2,
          name: "仓库库存"
        },
        {
          id: 3,
          name: "公司库存"
        }
      ],
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
      hardwareTableData: []
    };
  },
  computed: {
    // BD
    bd: function() {
      return this.role.find(r => {
        return r.name === "user";
      });
    },
    // bd主管
    bdManager: function() {
      return this.role.find(r => {
        return r.name === "bd-manager";
      });
    },
    // 法务
    legalAffairs: function() {
      return this.role.find(r => {
        return r.name === "legal-affairs";
      });
    },
    // 法务主管
    legalAffairsManager: function() {
      return this.role.find(r => {
        return r.name === "legal-affairs-manager";
      });
    },
    // 采购
    purchase: function() {
      return this.roles.find(r => {
        return r.name === "purchase";
      });
    }
  },
  created() {
    this.getContractList();
    let user_info = JSON.parse(Cookies.get("user_info"));
    this.applicant = user_info.id;
    this.role = user_info.roles.data;
  },
  methods: {
    deleteHardware(index) {
      this.hardwareTableData.splice(index, 1);
    },
    hardwareAdd() {
      let td = {
        model_id: "",
        color_id: "",
        origin: "",
        amount: ""
      };
      this.hardwareTableData.unshift(td);
    },
    hardwareHandle() {
      this.dialogFormVisible = true;
    },
    getAuditingCount() {
      getAuditingCount(this)
        .then(res => {
          this.$store.commit("saveProcessState", res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    specialAuditingContract(data) {
      let id = data.id;
      this.$confirm("确认特批此合同?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.setting.loadingText = "特批申请中";
          this.setting.loading = true;
          specialAuditingContract(this, id)
            .then(response => {
              this.setting.loading = false;
              this.$message({
                type: "success",
                message: "申请成功！"
              });
              this.pagination.currentPage = 1;
              this.getContractList();
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
    deleteContract(data) {
      let id = data.id;
      this.$confirm("确认删除此合同?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.setting.loadingText = "删除中";
          this.setting.loading = true;
          deleteContract(this, id)
            .then(response => {
              this.setting.loading = false;
              this.$message({
                type: "success",
                message: "删除成功！"
              });
              this.pagination.currentPage = 1;
              this.getContractList();
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
    getContractList() {
      this.setting.loading = true;
      let args = {
        include: "company",
        page: this.pagination.currentPage,
        name: this.searchForm.name,
        status: this.searchForm.status,
        contract_number: this.searchForm.contract_number,
        start_date: handleDateTransform(this.searchForm.dataValue[0]),
        end_date: handleDateTransform(this.searchForm.dataValue[1])
      };
      if (!this.searchForm.name) {
        delete args.name;
      }
      if (this.searchForm.contract_number === "") {
        delete args.contract_number;
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
      getContractList(this, args)
        .then(res => {
          this.tableData = res.data;
          this.pagination.total = res.meta.pagination.total;
          this.getAuditingCount();
          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
        });
    },
    addContract() {
      this.$router.push({
        path: "/contract/list/add"
      });
    },
    editContract(data) {
      this.$router.push({
        path: "/contract/list/edit/" + data.id
      });
    },
    auditingContract(data) {
      this.$router.push({
        path: "/contract/list/detail/" + data.id
      });
    },
    detailContract(data) {
      this.$router.push({
        path: "/contract/list/detail/" + data.id,
        query: {
          hide: "none"
        }
      });
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getContractList();
    },
    search() {
      this.pagination.currentPage = 1;
      this.getContractList();
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getContractList();
    }
  }
};
</script>

<style lang="less" scoped>
.root {
  font-size: 14px;
  color: #5e6d82;
  .amount-input,
  .store {
    width: 300px;
  }
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
