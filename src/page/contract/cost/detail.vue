<template>
  <div class="item-wrap-template">
    <div v-loading="setting.loading" :element-loading-text="setting.loadingText" class="pane">
      <div class="pane-title">成本详情</div>
      <el-form ref="costForm" :model="costForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同编号:" prop="contract_number">{{ costForm.contract_number }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同名称:" prop="contract_name">{{ costForm.contract_name }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="总成本:" prop="total_cost">{{ costForm.total_cost }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="已确认成本:" prop="confirm_cost">{{ costForm.confirm_cost }}</el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="所属人:" prop="applicant_name">{{ costForm.applicant_name }}</el-form-item>
        <el-table :data="tableData" border style="width: 100%;margin-bottom: 20px;">
          <el-table-column
            prop="creator"
            label="创建人"
            min-width="80"
            align="center"
            header-align="center"
          />
          <el-table-column
            prop="kind"
            label="成本类型"
            min-width="80"
            align="center"
            header-align="center"
          />
          <el-table-column
            prop="money"
            label="成本金额"
            min-width="100"
            align="center"
            header-align="center"
          />
          <el-table-column
            prop="remark"
            label="备注"
            min-width="100"
            align="center"
            header-align="center"
          />
          <el-table-column
            prop="status"
            label="状态"
            min-width="100"
            align="center"
            header-align="center"
          >
            <template slot-scope="scope">{{ scope.row.status===0 ? '未确认' : '已确认' }}</template>
          </el-table-column>
          <el-table-column
            prop="updated_at"
            label="操作时间"
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
import { historyBack, costDetail } from "service";
import {
  Form,
  FormItem,
  Button,
  Row,
  MessageBox,
  Col,
  Input,
  Table,
  TableColumn
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
    ElTableColumn: TableColumn
  },
  data() {
    return {
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      tableData: [],
      costID: null,
      costForm: {
        total_cost: 0,
        confirm_cost: 0,
        contract_name: "",
        contract_number: "",
        applicant_name: ""
      }
    };
  },
  created() {
    this.costID = this.$route.params.uid;
    this.costDetail();
  },
  methods: {
    historyBack() {
      historyBack();
    },
    costDetail() {
      this.setting.loading = true;
      let args = {
        include: "costContent"
      };
      costDetail(this, this.costID, args)
        .then(res => {
          this.costForm.total_cost = res.total_cost;
          this.tableData = res.costContent.data;
          this.costForm.confirm_cost = res.confirm_cost;
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