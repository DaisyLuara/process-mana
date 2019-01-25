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
        <el-form-item label="所属BD:" prop="bd">{{ costForm.bd }}</el-form-item>
        <el-table :data="tableData" border style="width: 100%;margin-bottom: 20px;">
          <el-table-column
            prop="creator"
            label="创建人"
            min-width="80"
            align="center"
            header-align="center"
          />
          <el-table-column
            prop="cost_details"
            label="费用明细"
            min-width="80"
            align="center"
            header-align="center"
          />
          <el-table-column
            prop="amount"
            label="费用金额"
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
          />
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
        company_name: "",
        company_id: "",
        applicant_name: "",
        applicant: "",
        name: "",
        contract_number: "",
        type: "",
        type_name: "",
        date: [],
        product_status: "",
        receive_date: "",
        remark: "",
        bd_ma_message: "",
        legal_message: "",
        legal_ma_message: ""
      }
    };
  },
  created() {
    this.costID = this.$route.params.uid;
    // this.costDetail();
  },
  methods: {
    historyBack() {
      historyBack();
    },
    costDetail() {
      this.setting.loading = true;

      costDetail(this, this.costID)
        .then(res => {
          let mediaIds = [];
          let mediaData = res.media.data;
          this.costForm.applicant_name = res.applicant_name;
          this.costForm.type =
            res.type === "收款合同" ? 0 : res.type === "付款合同" ? 1 : 2;
          this.costForm.type_name = res.type;
          this.costForm.applicant = res.applicant;
          this.costForm.name = res.name;
          this.costForm.contract_number = res.contract_number;
          this.costForm.company_id = res.company_id;
          this.costForm.company_name = res.company_name;
          this.costForm.date = res.receive_date.split(",");
          this.costForm.receive_date = res.receive_date;
          this.costForm.remark = res.remark;
          this.costForm.bd_ma_message = res.bd_ma_message;
          this.costForm.legal_message = res.legal_message;
          this.costForm.legal_ma_message = res.legal_ma_message;
          this.costForm.product_status =
            res.product_status === "无硬件" ? "否" : "是";
          if (res.product_content) {
            this.tableData = res.product_content;
          }

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
