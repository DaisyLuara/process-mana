<template>
  <div class="item-wrap-template">
    <div v-loading="setting.loading" :element-loading-text="setting.loadingText" class="pane">
      <div class="pane-title">成本编辑</div>
      <el-form ref="costForm" :model="costForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同编号:" prop="contract_number">{{ costForm.contract_number }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同名称:" prop="contract_name">{{ costForm.contract_name }}</el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="所属BD:" prop="applicant_name">{{ costForm.applicant_name }}</el-form-item>
        <el-button
          size="small"
          type="success"
          style="margin-bottom: 20px;"
          @click="costAddDetail"
        >新增成本明细</el-button>
        <el-table
          :data="tableData"
          :span-method="arraySpanMethod"
          border
          style="width: 100%;margin-bottom: 20px;"
        >
          <el-table-column
            prop="creator"
            label="创建人"
            min-width="80"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.creator }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="cost_details"
            label="成本类型"
            min-width="80"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <el-select
                v-if="scope.$index !== tableData.length-1"
                v-model="scope.row.kind_id"
                :loading="searchLoading"
                placeholder="请选择"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in costDetailList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <span v-if="scope.$index === tableData.length-1">¥：{{ scope.row.kind_id }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="money"
            label="成本金额"
            min-width="100"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.money" placeholder="请输入费用金额"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            min-width="100"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.remark" placeholder="请输入备注"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="操作"
            min-width="100"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status !== undefined && scope.row.status===0"
                type="primary"
                icon="el-icon-edit"
                circle
                @click="editCostDetail(scope.row)"
              />
              <el-button
                v-if="scope.row.status !== undefined && scope.row.status === 0 && legalAffairsManager"
                type="success"
                icon="el-icon-check"
                circle
                @click="confirmCost(scope.row)"
              />
              <el-button
                v-if="scope.row.status !== undefined && scope.row.status===0"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteCost(scope.row)"
              />
              <el-button
                v-if="scope.row.id === undefined"
                type="success"
                size="mini"
                @click="addCostDetail(scope.row)"
              >保存</el-button>
              <el-button
                v-if="scope.row.id === undefined"
                type="danger"
                size="mini"
                @click="deletecost(scope.$index)"
              >删除</el-button>
              <span v-if="scope.row.status === 1">法务主管已确认</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="updated_at"
            label="最后操作时间"
            min-width="100"
            align="center"
            header-align="center"
          />
        </el-table>
        <el-form-item>
          <el-button size="small" @click="historyBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  historyBack,
  costDetail,
  getSearchCostKind,
  Cookies,
  addCostDetail,
  deleteCost,
  editCostDetail,
  confirmCost
} from "service";

import {
  Form,
  FormItem,
  Button,
  Row,
  MessageBox,
  Col,
  Input,
  Table,
  TableColumn,
  Select,
  Option
} from "element-ui";

export default {
  components: {
    ElRow: Row,
    ElCol: Col,
    ElForm: Form,
    ElFormItem: FormItem,
    ElButton: Button,
    ElInput: Input,
    ElTable: Table,
    ElTableColumn: TableColumn,
    ElSelect: Select,
    ElOption: Option
  },
  data() {
    return {
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      searchLoading: false,
      costDetailList: [],
      tableData: [
        {
          creator: "已确认总成本：",
          kind_id: 0,
          money: 0,
          remark: ""
        }
      ],
      costID: null,
      costForm: {
        contract_name: "",
        contract_number: "",
        applicant_name: ""
      },
      total_cost: null,
      name: "",
      roles: {}
    };
  },
  watch: {
    tableData: {
      handler: function(val, oldVal) {
        let sum = 0;
        val.map(r => {
          if (String(r.creator).indexOf("已确认总成本：：") === -1) {
            sum += parseFloat(r.money);
          }
        });
        let length = this.tableData.length;
        let data = this.tableData[length - 1];
        data.creator = "已确认总成本:";
        data.kind_id = sum;
        this.total_cost = sum;
      },
      deep: true
    }
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
    this.costID = this.$route.params.uid;
    let user_info = JSON.parse(Cookies.get("user_info"));
    this.name = user_info.name;
    this.roles = user_info.roles.data;
    this.costDetail();
    this.getSearchCostKind();
  },
  methods: {
    confirmCost(data) {
      this.$confirm("确认该条操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let id = data.id;
          confirmCost(this, id)
            .then(res => {
              this.$message({
                type: "success",
                message: "确认成功"
              });
              this.costDetail();
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.response.data.message
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消确认"
          });
        });
    },
    editCostDetail(data) {
      let id = data.id;
      let args = {
        creator: data.creator,
        kind_id: data.kind_id,
        money: data.money,
        remark: data.remark,
        total_cost: this.total_cost
      };
      editCostDetail(this, this.costID, id, args)
        .then(res => {
          this.$message({
            type: "success",
            message: "修改成功"
          });
          this.costDetail();
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.response.data.message
          });
        });
    },
    deleteCost(data) {
      this.$confirm("此操作将删除该条操作, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let id = data.id;
          let args = {
            total_cost: this.total_cost
          };
          deleteCost(this, this.costID, id, args)
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.costDetail();
            })
            .catch(err => {
              this.$message({
                type: "warning",
                message: err.response.data.message
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    deletecost(index) {
      this.tableData.splice(index, 1);
    },
    addCostDetail(data) {
      let args = data;
      args.total_cost = this.total_cost;
      addCostDetail(this, this.costID, args)
        .then(res => {
          this.$message({
            type: "success",
            message: "保存成功"
          });
          this.costDetail();
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.response.data.message
          });
        });
    },
    costAddDetail() {
      let td = {
        creator: this.name,
        kind_id: "",
        money: 0,
        remark: ""
      };
      this.tableData.unshift(td);
    },
    getSearchCostKind() {
      this.searchLoading = true;
      getSearchCostKind(this)
        .then(res => {
          this.searchLoading = false;
          this.costDetailList = res;
        })
        .catch(err => {
          this.searchLoading = false;
          this.$message({
            type: "warning",
            message: err.response.data.message
          });
        });
    },
    historyBack() {
      historyBack();
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === this.tableData.length - 1) {
        if (columnIndex === 1) {
          return [4, 5];
        }
      }
    },
    costDetail() {
      this.setting.loading = true;
      let args = {
        include: "costContent"
      };
      costDetail(this, this.costID, args)
        .then(res => {
          this.tableData = [
            {
              creator: "已确认总成本：",
              kind_id: 0,
              money: 0,
              remark: ""
            }
          ];
          res.costContent.data.map(r => {
            this.tableData.unshift(r);
          });
          this.costForm.contract_name = res.contract_name;
          this.costForm.contract_number = res.contract_number;
          this.costForm.applicant_name = res.applicant_name;
          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
          this.$message({
            message: err.response.data.message,
            type: "warning"
          });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.item-wrap-template {
  .pane {
    border-radius: 5px;
    background-color: white;
    padding: 20px 40px 80px;
    .el-select,
    .item-input,
    .text-input,
    .payment-time,
    .el-date-editor.el-input {
      width: 330px;
    }
    .upload-demo {
      width: 400px;
    }
    .download {
      color: #fff;
      font-size: 10px;
      padding: 3px 5px;
      background: #77a245;
      border-radius: 5px;
      margin-left: 5px;
      cursor: pointer;
    }
    .pane-title {
      padding-bottom: 20px;
      font-size: 18px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }
}
</style>
