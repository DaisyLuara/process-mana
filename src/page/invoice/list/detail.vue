<template>
  <div class="item-wrap-template">
    <div 
      v-loading="setting.loading" 
      :element-loading-text="setting.loadingText" 
      class="pane">
      <div class="pane-title">开票{{ hide ? '详情' : '审批' }}</div>
      <el-form 
        ref="invoiceForm" 
        :model="invoiceForm" 
        label-position="left" 
        label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="合同编号:" 
              prop="contract_number">{{ invoiceForm.contract_number }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="申请人:" 
              prop="applicant_name">{{ invoiceForm.applicant_name }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="开票类型:" 
              prop="type_name">{{ invoiceForm.type_name }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="座机电话:" 
              prop="telephone">{{ invoiceCompany.telephone }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="开票公司:" 
              prop="name">{{ invoiceCompany.name }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="纳税人识别号:" 
              prop="taxpayer_num">{{ invoiceCompany.taxpayer_num }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="电话:" 
              prop="phone">{{ invoiceCompany.phone }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="地址:" 
              prop="address">{{ invoiceCompany.address }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="开户银行:" 
              prop="account_bank">{{ invoiceCompany.account_bank }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="开户行账号:" 
              prop="account_number">{{ invoiceCompany.account_number }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col 
            v-if="invoiceForm.kind" 
            :span="12">
            <el-form-item 
              label="开票种类:" 
              prop="kind">{{ invoiceForm.kind }}</el-form-item>
          </el-col>
          <el-col :span="12">
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
          </el-col>
        </el-row>
        <el-table
          :data="tableData"
          :span-method="arraySpanMethod"
          border
          style="width: 100%;margin-bottom: 10px;"
        >
          <el-table-column
            prop="kind"
            align="center"
            header-align="center"
            label="开票种类"
            min-width="200"
          />
          <el-table-column
            prop="name"
            align="center"
            header-align="center"
            label="货物或应税劳务·服务名称"
            min-width="200"
          />
          <el-table-column 
            align="center" 
            header-align="center" 
            prop="spec_type" 
            label="规格型号"/>
          <el-table-column 
            align="center" 
            header-align="center" 
            prop="unit" 
            label="单位"/>
          <el-table-column 
            align="center" 
            prop="num" 
            header-align="center" 
            label="数量"/>
          <el-table-column 
            prop="price" 
            align="center" 
            header-align="center" 
            label="单价(含税)"/>
          <el-table-column 
            prop="money" 
            align="center" 
            header-align="center" 
            label="金额(含税)"/>
        </el-table>
        <el-form-item
          v-if="invoiceForm.bd_ma_message"
          label="bd主管意见:"
          prop="bd_ma_message"
        >{{ invoiceForm.bd_ma_message }}</el-form-item>
        <el-form-item
          v-if="invoiceForm.legal_ma_message"
          label="法务主管意见:"
          prop="legal_ma_message"
        >{{ invoiceForm.legal_ma_message }}</el-form-item>
        <el-form-item 
          label="备注:" 
          prop="remark">{{ invoiceForm.remark }}</el-form-item>
        <el-form-item>
          <el-button
            v-if="!hide && !finance"
            type="danger"
            size="small"
            @click="dialogFormVisible = true, rejectStatus=true, agreeStatus = false"
          >驳回</el-button>
          <el-button
            v-if="!hide"
            :type="(invoiceForm.status === '已审批' && invoiceForm.handler === id) ? 'warning' : 'primary'"
            size="small"
            @click="auditing"
          >{{ (invoiceForm.status === '已审批' && invoiceForm.handler === id) ?'确认开票' : '审核通过' }}</el-button>
          <el-button 
            size="small" 
            @click="back">返回</el-button>
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
            v-model="invoiceForm.legal_ma_message"
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
            v-model="invoiceForm.bd_ma_message"
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
  checkMobile,
  invoiceDetail,
  auditingInvoice,
  Cookies,
  rejectInvoice
} from "service/index";
import {
  Form,
  FormItem,
  Button,
  Row,
  MessageBox,
  Col,
  Table,
  TableColumn,
  Input,
  Dialog
} from "element-ui";

export default {
  components: {
    ElRow: Row,
    ElCol: Col,
    ElForm: Form,
    ElFormItem: FormItem,
    ElButton: Button,
    ElTable: Table,
    ElInput: Input,
    ElDialog: Dialog,
    ElTableColumn: TableColumn
  },
  data() {
    return {
      rejectStatus: false,
      agreeStatus: false,
      dialogFormVisible: false,
      hide: null,
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      invoiceCompany: {
        phone: "",
        telephone: "",
        account_bank: "",
        account_number: "",
        taxpayer_num: "",
        address: "",
        name: ""
      },
      fileList: [],
      invoiceForm: {
        applicant_name: "",
        applicant: "",
        type: null,
        type_name: "",
        contract_number: null,
        remark: "",
        kind: "",
        bd_ma_message: "",
        legal_ma_message: ""
      },
      id: "",
      roles: [],
      tableData: [
        {
          kind: "开票总计（大写）：",
          name: "",
          spec_type: "",
          unit: "",
          num: "",
          price: "",
          money: ""
        }
      ]
    };
  },
  computed: {
    // bd主管
    bdManager: function() {
      return this.roles.find(r => {
        return r.name === "bd-manager";
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
    this.setting.loading = true;
    this.invoiceID = this.$route.params.uid;
    let user_info = JSON.parse(Cookies.get("user_info"));
    this.hide = this.$route.query.hide;
    this.id = user_info.id;
    this.roles = user_info.roles.data;
    this.invoiceDetail();
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
    invoiceDetail() {
      let params = {
        include:
          "invoice_content.invoiceKind,invoice_content.goodsService,invoice_company,media"
      };
      invoiceDetail(this, this.invoiceID, params)
        .then(res => {
          this.invoiceForm = res;
          let invoice_content = res.invoice_content.data;
          this.invoiceForm.type_name = res.type;
          if (res.invoice_company) {
            this.invoiceCompany.telephone = res.invoice_company.telephone;
            this.invoiceCompany.taxpayer_num = res.invoice_company.taxpayer_num;
            this.invoiceCompany.phone = res.invoice_company.phone;
            this.invoiceCompany.account_bank = res.invoice_company.account_bank;
            this.invoiceCompany.account_number =
              res.invoice_company.account_number;
            this.invoiceCompany.address = res.invoice_company.address;
            this.invoiceCompany.name = res.invoice_company.name;
            this.invoiceForm.bd_ma_message = res.bd_ma_message;
            this.invoiceForm.legal_ma_message = res.legal_ma_message;
          }
          let mediaData = res.media.data;
          this.fileList = mediaData;
          invoice_content.map(r => {
            let data = {
              kind: r.invoiceKind ? r.invoiceKind.name : "",
              name: r.goodsService.name,
              spec_type: r.goodsService.spec_type,
              unit: r.goodsService.unit,
              num: r.num,
              price: r.price,
              money: r.money
            };
            this.tableData.unshift(data);
          });
          let length = this.tableData.length;
          this.tableData[length - 1].kind =
            "开票总计（大写）：" + res.$total_text;
          this.tableData[length - 1].name = "(小写) ¥：" + res.total + "元";
          this.setting.loading = false;
        })
        .catch(err => {
          this.$message({
            message: err.response.data.message,
            type: "success"
          });
          this.setting.loading = false;
        });
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === this.tableData.length - 1) {
        if (columnIndex === 1) {
          return [5, 6];
        }
      }
    },
    back() {
      historyBack();
    },
    auditing() {
      if (
        this.invoiceForm.status === "已审批" &&
        this.invoiceForm.handler === this.id
      ) {
        this.$confirm("确定确认开票吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.auditingInvoice(this, this.invoiceID);
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
    auditingInvoice(obj, invoiceID, args) {
      this.setting.loading = true;
      auditingInvoice(obj, invoiceID, args)
        .then(res => {
          this.dialogFormVisible = false;
          this.$message({
            message:
              this.invoiceForm.status === "已审批" &&
              this.invoiceForm.handler === this.id
                ? "开票成功"
                : "审批通过",
            type: "success"
          });
          this.$router.push({
            path: "/invoice/list"
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

      if (this.legalAffairsManager && !this.invoiceForm.legal_ma_message) {
        this.warningInfo();
        return;
      } else {
        if (this.invoiceForm.legal_ma_message) {
          args.legal_ma_message = this.invoiceForm.legal_ma_message;
        }
      }

      if (this.bdManager && !this.invoiceForm.bd_ma_message) {
        this.warningInfo();
        return;
      } else {
        if (this.invoiceForm.bd_ma_message) {
          args.bd_ma_message = this.invoiceForm.bd_ma_message;
        }
      }
      if (this.agreeStatus) {
        this.auditingInvoice(this, this.invoiceID, args);
        return;
      }

      if (this.rejectStatus) {
        this.rejected(args);
        return;
      }
    },
    rejected(args) {
      this.setting.loading = true;
      rejectInvoice(this, this.invoiceID, args)
        .then(res => {
          this.dialogFormVisible = false;
          this.$message({
            message: "驳回成功",
            type: "success"
          });
          this.$router.push({
            path: "/invoice/list"
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
        this.invoiceForm.legal_ma_message = "";
      }
      if (this.bdManager) {
        this.invoiceForm.bd_ma_message = "";
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
