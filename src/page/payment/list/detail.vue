<template>
  <div class="item-wrap-template">
    <div 
      v-loading="setting.loading" 
      :element-loading-text="setting.loadingText" 
      class="pane">
      <div class="pane-title">付款{{ hide ? '详情' : '审批' }}</div>
      <el-form 
        ref="paymentForm" 
        :model="paymentForm" 
        label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="合同编号:" 
              prop="contract_number">{{ paymentForm.contract_number }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="申请人:" 
              prop="applicant_name">{{ paymentForm.applicant_name }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="申请金额（大写):" 
              prop="amount">{{ paymentForm.amount }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="票据种类:" 
              prop="type_name">{{ paymentForm.type_name }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="申请事由:" 
              prop="reason">{{ paymentForm.reason }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="收款人:" 
              prop="name">{{ paymentPayee.name }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="收款人开户行:" 
              prop="account_bank">{{ paymentPayee.account_bank }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="收款人账号:" 
              prop="account_number">{{ paymentPayee.account_number }}</el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          v-if="paymentForm.bd_ma_message"
          label="bd主管意见:"
          prop="bd_ma_message"
        >{{ paymentForm.bd_ma_message }}</el-form-item>
        <el-form-item
          v-if="paymentForm.legal_message"
          label="法务意见:"
          prop="legal_message"
        >{{ paymentForm.legal_message }}</el-form-item>
        <el-form-item
          v-if="paymentForm.legal_ma_message"
          label="法务主管意见:"
          prop="legal_ma_message"
        >{{ paymentForm.legal_ma_message }}</el-form-item>
        <el-form-item
          v-if="paymentForm.auditor_message"
          label="审计意见:"
          prop="auditor_message"
        >{{ paymentForm.auditor_message }}</el-form-item>
        <el-form-item 
          label="附件内容:" 
          prop="content">
          <div 
            v-for="item in fileList" 
            :key="item.id">
            {{ item.name }}
            <span 
              class="download" 
              @click="handlePreview(item)">下载</span>
          </div>
        </el-form-item>
        <el-form-item 
          label="备注:" 
          prop="remark">{{ paymentForm.remark }}</el-form-item>
        <el-form-item>
          <el-button
            v-if="!hide && !finance"
            type="danger"
            size="small"
            @click="dialogFormVisible = true, rejectStatus=true, agreeStatus = false"
          >驳回</el-button>
          <el-button
            v-if="!hide"
            :type="(paymentForm.status === '已审批' && paymentForm.handler === id) ?'warning' : 'primary'"
            size="small"
            @click="auditing"
          >{{ (paymentForm.status === '已审批' && paymentForm.handler === id) ?'确认付款' : '审核通过' }}</el-button>
          <el-button 
            size="small" 
            @click="historyBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :title="rejectStatus === true ? '驳回理由': '审批'"
    >
      <el-form>
        <el-form-item
          v-if="legalAffairsManager"
          :rules="[{ required: true, message: '请填写意见', trigger: 'submit' }]"
          label="意见"
          prop="legal_ma_message"
        >
          <el-input
            v-model="paymentForm.legal_ma_message"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入内容"
            class="text-input"
          />
        </el-form-item>
        <el-form-item
          v-if="legalAffairs"
          :rules="[{ required: true, message: '请填写意见', trigger: 'submit' }]"
          label="意见"
          prop="legal_message"
        >
          <el-input
            v-model="paymentForm.legal_message"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入内容"
            class="text-input"
          />
        </el-form-item>
        <el-form-item
          v-if="bdManager"
          :rules="[{ required: true, message: '请填写意见', trigger: 'submit' }]"
          label="意见"
          prop="bd_ma_message"
        >
          <el-input
            v-model="paymentForm.bd_ma_message"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入内容"
            class="text-input"
          />
        </el-form-item>
        <el-form-item
          v-if="auditor"
          :rules="[{ required: true, message: '请填写意见', trigger: 'submit' }]"
          label="意见"
          prop="auditor_message"
        >
          <el-input
            v-model="paymentForm.auditor_message"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入内容"
            class="text-input"
          />
        </el-form-item>
      </el-form>
      <div 
        slot="footer" 
        class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button 
          type="primary" 
          @click="rejectedAuditingHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  historyBack,
  paymentDetail,
  paymentReject,
  auditingPayment,
  Cookies
} from "service";

import {
  Form,
  FormItem,
  Button,
  Row,
  MessageBox,
  Col,
  Dialog,
  Input
} from "element-ui";

export default {
  components: {
    ElRow: Row,
    ElCol: Col,
    ElForm: Form,
    ElFormItem: FormItem,
    ElButton: Button,
    ElDialog: Dialog,
    ElInput: Input
  },
  data() {
    return {
      fileList: [],
      rejectStatus: false,
      agreeStatus: false,
      auditingDialog: false,
      hide: null,
      dialogFormVisible: false,
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      paymentPayee: {
        account_number: "",
        account_bank: "",
        name: ""
      },
      paymentForm: {
        applicant: "",
        type: 1,
        type_name: "",
        contract_id: "",
        contract_number: "",
        reason: "",
        amount: "",
        remark: "",
        applicant_name: "",
        handler: "",
        status: "",
        bd_ma_message: "",
        legal_ma_message: "",
        auditor_message: "",
        legal_message: ""
      },
      id: "",
      roles: [],
      paymentID: ""
    };
  },
  computed: {
    // 审计
    auditor: function() {
      return this.roles.find(r => {
        return r.name === "auditor";
      });
    },
    // bd主管
    bdManager: function() {
      return this.roles.find(r => {
        return r.name === "bd-manager";
      });
    },
    // 法务
    legalAffairs: function() {
      return this.roles.find(r => {
        return r.name === "legal-affairs";
      });
    },
    // 法务主管
    legalAffairsManager: function() {
      return this.roles.find(r => {
        return r.name === "legal-affairs-manager";
      });
    },
    // 财务
    finance: function() {
      return this.roles.find(r => {
        return r.name === "finance";
      });
    }
  },
  created() {
    this.paymentID = this.$route.params.uid;
    this.hide = this.$route.query.hide;
    let user_info = JSON.parse(Cookies.get("user_info"));
    this.id = user_info.id;
    this.roles = user_info.roles.data;

    this.paymentDetail();
  },
  methods: {
    handlePreview(file) {
      let url = file.url;
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.responseType = "blob";
      xhr.onload = () => {
        var urlObject = window.URL || window.webkitURL || window;
        let a = document.createElement("a");
        a.href = urlObject.createObjectURL(new Blob([xhr.response]));
        a.download = file.name;
        a.click();
      };
      xhr.send();
    },
    paymentDetail() {
      this.setting.loading = true;
      let args = {
        include: "contract,payment_payee,media"
      };
      paymentDetail(this, this.paymentID, args)
        .then(res => {
          this.paymentForm.contract_id = res.contract_number;
          this.paymentForm.contract_number = res.contract_number;
          this.paymentForm.type =
            res.type === "支票" ? 1 : res.type === "电汇单" ? 2 : 3;
          this.paymentForm.type_name = res.type;
          this.paymentForm.applicant = res.applicant;
          this.paymentForm.applicant_name = res.applicant_name;
          this.paymentForm.amount = res.amount;
          this.paymentForm.remark = res.remark;
          if (res.payment_payee) {
            this.paymentPayee.name = res.payment_payee.name;
            this.paymentPayee.account_bank = res.payment_payee.account_bank;
            this.paymentPayee.account_number = res.payment_payee.account_number;
          }
          let mediaIds = [];
          let mediaData = res.media.data;
          this.fileList = mediaData;
          this.paymentForm.reason = res.reason;
          this.paymentForm.handler = res.handler;
          this.paymentForm.status = res.status;
          this.paymentForm.bd_ma_message = res.bd_ma_message;
          this.paymentForm.legal_message = res.legal_message;
          this.paymentForm.legal_ma_message = res.legal_ma_message;
          this.paymentForm.auditor_message = res.auditor_message;
          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
        });
    },
    historyBack() {
      historyBack();
    },
    auditing() {
      if (
        this.paymentForm.status === "已审批" &&
        this.paymentForm.handler === this.id
      ) {
        this.$confirm("确定确认付款吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.auditingPayment(this, this.paymentID);
          })
          .catch(e => {
            this.setting.loading = false;
          });
      } else {
        this.dialogFormVisible = true;
        this.rejectStatus = false;
        this.agreeStatus = true;
      }
    },
    auditingPayment(obj, paymentID, args) {
      this.setting.loading = true;
      auditingPayment(obj, paymentID, args)
        .then(res => {
          this.dialogFormVisible = false;
          this.$message({
            message:
              this.paymentForm.status === "已审批" &&
              this.paymentForm.handler === this.id
                ? "付款成功"
                : "审批通过",
            type: "success"
          });
          this.$router.push({
            path: "/payment/list"
          });
          this.setting.loading = false;
        })
        .catch(err => {
          this.dialogFormVisible = false;
          this.$message({
            message: err.response.data.message,
            type: "warning"
          });
          this.setting.loading = false;
        });
    },
    rejectedAuditingHandle() {
      let args = {};
      this.setting.loading = true;
      if (this.legalAffairsManager && !this.paymentForm.legal_ma_message) {
        this.warningInfo();
        return;
      } else {
        if (this.paymentForm.legal_ma_message) {
          args.legal_ma_message = this.paymentForm.legal_ma_message;
        }
      }

      if (this.legalAffairs && !this.paymentForm.legal_message) {
        this.warningInfo();
        return;
      } else {
        if (this.paymentForm.legal_message) {
          args.legal_message = this.paymentForm.legal_message;
        }
      }

      if (this.auditor && !this.paymentForm.auditor_message) {
        this.warningInfo();
        return;
      } else {
        if (this.paymentForm.auditor_message) {
          args.auditor_message = this.paymentForm.auditor_message;
        }
      }

      if (this.bdManager && !this.paymentForm.bd_ma_message) {
        this.warningInfo();
        return;
      } else {
        if (this.paymentForm.bd_ma_message) {
          args.bd_ma_message = this.paymentForm.bd_ma_message;
        }
      }
      if (this.agreeStatus) {
        this.auditingPayment(this, this.paymentID, args);
        return;
      }
      if (this.rejectStatus) {
        this.rejected(args);
        return;
      }
    },
    rejected(args) {
      this.setting.loading = true;
      paymentReject(this, this.paymentID, args)
        .then(res => {
          this.dialogFormVisible = false;
          this.$message({
            message: "驳回成功",
            type: "success"
          });
          this.$router.push({
            path: "/payment/list"
          });
          this.setting.loading = false;
        })
        .catch(err => {
          this.dialogFormVisible = false;
          this.setting.loading = false;
          this.$message({
            message: err.response.data.message,
            type: "warning"
          });
        });
    },
    warningInfo() {
      this.$message({
        type: "warning",
        message: "意见必填"
      });
      this.setting.loading = false;
    },
    // 管理弹窗
    cancel() {
      this.dialogFormVisible = false;
      if (this.legalAffairsManager) {
        this.paymentForm.legal_ma_message = "";
      }
      if (this.bdManager) {
        this.paymentForm.bd_ma_message = "";
      }
      if (this.legalAffairs) {
        this.paymentForm.legal_message = "";
      }
      if (this.auditor) {
        this.paymentForm.auditor_message = "";
      }

      this.setting.loading = false;
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
    .download {
      color: #fff;
      font-size: 10px;
      padding: 3px 5px;
      background: #77a245;
      border-radius: 5px;
      margin-left: 5px;
      cursor: pointer;
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
