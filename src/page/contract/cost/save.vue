<template>
  <div class="item-wrap-template">
    <div v-loading="setting.loading" :element-loading-text="setting.loadingText" class="pane">
      <div class="pane-title">新增成本</div>
      <el-form ref="costForm" :model="costForm" label-position="left" label-width="130px">
        <el-form-item
          :rules="{
            required: true, message: '请选择合同编号', trigger: 'submit'
          }"
          label="合同编号"
          prop="contract_id"
        >
          <el-select
            v-model="costForm.contract_id"
            :loading="searchLoading"
            @change="contractNumberHandle"
          >
            <el-option
              v-for="item in contractList"
              :key="item.id"
              :label="item.contract_number"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="合同名称" prop="name">
          <el-input v-model="costForm.name" :disabled="true" class="item-input"/>
        </el-form-item>
        <el-form-item label="所属BD" prop="applicant_name">
          <el-input v-model="costForm.applicant_name" :disabled="true" class="item-input"/>
        </el-form-item>
        <!-- v-if="operation || auditor || legalAffairsManager" -->
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
            prop="kind_id"
            label="成本类型"
            min-width="100"
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
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deletecost(scope.$index)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-form-item>
          <!-- v-if="operation || auditor || legalAffairsManager" -->
          <el-button type="primary" @click="submit('costForm')">保存</el-button>
          <el-button @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  historyBack,
  saveCost,
  Cookies,
  getContract,
  getSearchCostKind
} from "service";
import {
  Form,
  FormItem,
  Button,
  Input,
  MessageBox,
  Select,
  Option,
  Table,
  TableColumn
} from "element-ui";
export default {
  components: {
    ElForm: Form,
    ElFormItem: FormItem,
    ElButton: Button,
    ElInput: Input,
    ElSelect: Select,
    ElOption: Option,
    ElTable: Table,
    ElTableColumn: TableColumn
  },
  data() {
    return {
      setting: {
        loading: false,
        loadingText: "拼命加载中"
      },
      roles: {},
      costForm: {
        contract_id: "",
        applicant_name: "",
        name: ""
      },
      tableData: [
        {
          creator: "已确认总成本：",
          kind_id: 0,
          money: 0,
          remark: ""
        }
      ],
      total_cost: 0,
      contractList: [],
      costDetailList: [],
      searchLoading: false,
      userId: null,
      name: null
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
    let user_info = JSON.parse(Cookies.get("user_info"));
    this.userId = user_info.id;
    this.name = user_info.name;
    this.roles = user_info.roles.data;
    this.getContract();
    this.getSearchCostKind();
  },
  methods: {
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
    contractNumberHandle(val) {
      this.contractList.map(r => {
        if (r.id === val) {
          this.costForm.contract_id = r.id;
          this.costForm.name = r.name;
          this.costForm.applicant_name = r.applicant_name;
          return;
        }
      });
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === this.tableData.length - 1) {
        if (columnIndex === 1) {
          return [4, 5];
        }
      }
    },
    deletecost(index) {
      this.tableData.splice(index, 1);
    },
    costAddDetail() {
      let td = {
        creator: this.name,
        kind_id: "",
        money: 0,
        remark: "",
        creator_id: this.userId
      };
      this.tableData.unshift(td);
    },
    getContract() {
      this.searchLoading = true;
      getContract(this)
        .then(res => {
          this.contractList = res.data;
          this.searchLoading = false;
        })
        .catch(err => {
          this.searchLoading = false;
          this.$message({
            message: err.response.data.message,
            type: "warning"
          });
        });
    },
    back() {
      historyBack();
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true;
          let cost_content = [];
          let args = {
            contract_id: this.costForm.contract_id,
            applicant_name: this.costForm.applicant_name,
            total_cost: this.total_cost
          };
          // 删除数据最后一个
          this.tableData.pop();
          cost_content = this.tableData;
          args.cost_content = cost_content;
          saveCost(this, args)
            .then(res => {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$router.push({
                path: "/contract/cost"
              });
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
