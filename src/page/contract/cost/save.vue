<template>
  <div class="item-wrap-template">
    <div v-loading="setting.loading" :element-loading-text="setting.loadingText" class="pane">
      <div class="pane-title">新增成本</div>
      <el-form ref="costForm" :model="costForm" label-position="left" label-width="130px">
        <el-form-item label="合同编号" prop="contract_number">
          <el-select v-model="costForm.contract_number" :loading="searchLoading">
            <el-option
              v-for="item in contractList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="合同名称" prop="contract_name">
          <el-input v-model="costForm.contract_name" :disabled="true" class="item-input"/>
        </el-form-item>
        <el-form-item label="所属BD" prop="bd">
          <el-input v-model="costForm.bd" :disabled="true" class="item-input"/>
        </el-form-item>
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
            prop="create"
            label="创建人"
            min-width="80"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.create }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="detail"
            label="费用明细"
            min-width="100"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <el-select
                v-if="scope.$index !== tableData.length-1"
                v-model="scope.row.detail"
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
              <span v-if="scope.$index === tableData.length-1">¥：{{ scope.row.detail }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="price"
            label="费用金额"
            min-width="100"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">
              <el-input v-model="scope.row.price" placeholder="请输入费用金额"/>
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
          <!-- <el-table-column prop label="金额（含税）" min-width="100" align="center" header-align="center">
            <template slot-scope="scope">{{ scope.row.num * scope.row.price }}</template>
          </el-table-column>-->
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
          <el-button type="primary" @click="submit('costForm')">保存</el-button>
          <el-button @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { historyBack, saveCost, Cookies, getContract } from "service";
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
        contract_number: "",
        bd: "",
        contract_name: ""
      },
      tableData: [
        {
          create: "已确认总成本：",
          detail: 0,
          price: 0,
          remark: ""
        }
      ],
      contractList: [],
      costDetailList: [],
      searchLoading: false,
      name: null
    };
  },
  watch: {
    tableData: {
      handler: function(val, oldVal) {
        let sum = 0;
        val.map(r => {
          if (String(r.create).indexOf("已确认总成本：：") === -1) {
            sum += parseFloat(r.price);
          }
        });
        let length = this.tableData.length;
        let data = this.tableData[length - 1];
        data.create = "已确认总成本:";
        data.detail = sum;
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
    this.name = user_info.name;
    this.roles = user_info.roles.data;
    this.getContract();
  },
  methods: {
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
        create: this.name,
        detail: "",
        price: 0,
        remark: ""
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
          let args = {};
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
