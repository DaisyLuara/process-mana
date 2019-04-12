<template>
  <div class="item-wrap-template">
    <div 
      v-loading="setting.loading" 
      :element-loading-text="setting.loadingText" 
      class="pane">
      <div class="pane-title">编辑合同</div>
      <el-form 
        ref="contractForm" 
        :model="contractForm" 
        :rules="rules" 
        label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="公司名称:" 
              prop="company_name">{{ contractForm.company_name }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="申请人:" 
              prop="applicant_name">{{ contractForm.applicant_name }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="合同名称:" 
              prop="name">{{ contractForm.name }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="合同类型:" 
              prop="type_name">{{ contractForm.type_name }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="合同内容:" 
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
          <el-col 
            v-if="contractForm.type_name === '收款合同'" 
            :span="12">
            <el-form-item 
              label="合同总额:" 
              prop="amount">{{ contractForm.amount }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="合同编号:" 
              prop="contract_number">{{ contractForm.contract_number }}</el-form-item>
          </el-col>
          <el-col 
            v-if="contractForm.type_name === '收款合同'" 
            :span="12">
            <el-form-item 
              label="预估收款日期:" 
              prop="receive_date">{{ contractForm.receive_date }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col 
            v-if="contractForm.legal_message" 
            :span="12">
            <el-form-item 
              label="法务意见:" 
              prop="legal_message">{{ contractForm.legal_message }}</el-form-item>
          </el-col>
          <el-col 
            v-if="contractForm.legal_ma_message" 
            :span="12">
            <el-form-item
              label="法务主管意见:"
              prop="legal_ma_message"
            >{{ contractForm.legal_ma_message }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col 
            v-if="contractForm.bd_ma_message" 
            :span="12">
            <el-form-item 
              label="bd主管意见:" 
              prop="bd_ma_message">{{ contractForm.bd_ma_message }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="备注" 
              prop="remark">{{ contractForm.remark }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              v-if="contractForm.type === 0"
              label="合同种类"
              prop="kind"
            >{{ contractForm.kind }}</el-form-item>
          </el-col>
        </el-row>
        <el-table
          v-if="contractForm.kind !== '服务' && contractForm.type_name === '收款合同'"
          :data="productTableData"
          border
          style="width: 100%;margin-bottom: 20px;"
        >
          <el-table-column
            prop="product_name"
            label="产品名称"
            min-width="80"
            align="center"
            header-align="center"
          />
          <el-table-column
            prop="product_color"
            label="产品颜色"
            min-width="80"
            align="center"
            header-align="center"
          />
          <el-table-column
            prop="product_stock"
            label="产品数量"
            min-width="100"
            align="center"
            header-align="center"
          />
        </el-table>
        <el-row v-if="contractForm.kind === '服务' && contractForm.type_name === '收款合同'">
          <el-col :span="12">
            <el-form-item 
              label="服务对象:" 
              prop="serve_target">{{ contractForm.serve_target }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="预充值:" 
              prop="recharge">{{ contractForm.recharge }}</el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="projectNumFlag">
          <el-col :span="12">
            <el-form-item 
              label="定制节目数" 
              prop="special_num">
              <el-input-number 
                v-model="contractForm.special_num" 
                :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="通用节目数" 
              prop="common_num">
              <el-input-number 
                v-model="contractForm.common_num" 
                :min="0"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button 
            type="primary" 
            @click="submit('contractForm')">保存</el-button>
          <el-button @click="historyBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mofifyContract, historyBack, contractDetail, Cookies } from "service";
import {
  Form,
  Select,
  Option,
  FormItem,
  Button,
  Input,
  Row,
  MessageBox,
  RadioGroup,
  Radio,
  Col,
  Table,
  TableColumn,
  InputNumber
} from "element-ui";

export default {
  components: {
    ElRow: Row,
    ElCol: Col,
    ElForm: Form,
    ElSelect: Select,
    ElOption: Option,
    ElFormItem: FormItem,
    ElButton: Button,
    ElInput: Input,
    ElRadioGroup: RadioGroup,
    ElRadio: Radio,
    ElTable: Table,
    ElTableColumn: TableColumn,
    ElInputNumber: InputNumber
  },
  data() {
    return {
      projectNumFlag: true,
      serviceFlag: false,
      productTableData: [],
      nameList: [],
      colorList: [],
      fileList: [],
      searchLoading: false,
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      roles: [],
      productFlag: true,
      contractID: "",
      contractForm: {
        type_name: "",
        company_id: "",
        applicant_name: "",
        contract_number: "",
        name: "",
        kind: 1,
        type: 0,
        applicant: 0,
        receive_date: [],
        ids: "",
        remark: "",
        serve_target: null,
        amount: null,
        recharge: null,
        special_num: 1,
        common_num: 1,
        bd_ma_message: "",
        legal_message: "",
        legal_ma_message: ""
      },
      rules: {
        special_num: [
          { required: true, message: "请填写定制节目数量", trigger: "submit" }
        ],
        common_num: [
          { required: true, message: "请填写通用节目数量", trigger: "submit" }
        ],
        serve_target: [
          { required: true, message: "请选择服务对象", trigger: "submit" }
        ],
        recharge: [
          { required: true, message: "请选择预充值", trigger: "submit" }
        ]
      }
    };
  },
  computed: {
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
    }
  },
  created() {
    this.setting.loading = true;
    this.contractID = this.$route.params.uid;
    let user_info = JSON.parse(Cookies.get("user_info"));
    this.roles = user_info.roles.data;
    if (this.contractID) {
      this.contractDetail();
    }
  },
  methods: {
    contractDetail() {
      let args = {
        include: "media"
      };
      contractDetail(this, this.contractID, args)
        .then(res => {
          let mediaIds = [];
          let mediaData = res.media.data;
          this.contractForm.applicant_name = res.applicant_name;
          this.contractForm.type =
            res.type === "收款合同" ? 0 : res.type === "付款合同" ? 1 : 2;
          this.contractForm.type_name = res.type;
          this.contractForm.applicant = res.applicant;
          this.contractForm.name = res.name;
          this.contractForm.company_id = res.company_id;
          this.contractForm.receive_date = res.receive_date;
          this.contractForm.remark = res.remark;
          this.contractForm.contract_number = res.contract_number;
          this.contractForm.serve_target = res.serve_target === "商户";
          this.contractForm.recharge = res.recharge === "否";
          this.contractForm.kind = res.kind;
          this.projectNumFlag = this.contractForm.type === 0 ? true : false;
          let product_content = res.product_content;
          this.contractForm.bd_ma_message = res.bd_ma_message;
          this.contractForm.legal_message = res.legal_message;
          this.contractForm.legal_ma_message = res.legal_ma_message;
          this.contractForm.special_num = res.special_num;
          this.contractForm.common_num = res.common_num;
          product_content.map(r => {
            let data = {
              product_name: r.product_name,
              product_color: r.product_color,
              product_stock: r.product_stock
            };
          });
          this.productTableData = product_content;
          this.contractForm.amount = res.amount;
          this.fileList = mediaData;
          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
          console.log(err);
        });
    },
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

    historyBack() {
      historyBack();
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true;
          let args = {
            special_num: this.contractForm.special_num,
            common_num: this.contractForm.common_num
          };
          mofifyContract(this, this.contractID, args)
            .then(res => {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.$router.push({
                path: "/contract/list"
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
