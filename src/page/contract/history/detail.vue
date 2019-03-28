<template>
  <div class="item-wrap-template">
    <div 
      v-loading="setting.loading" 
      :element-loading-text="setting.loadingText" 
      class="pane">
      <div class="pane-title">合同详情</div>
      <el-form 
        ref="contractForm" 
        :model="contractForm" 
        label-width="100px">
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
              label="合同编号:" 
              prop="contract_number">{{ contractForm.contract_number }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="合同类型:" 
              prop="type_name">{{ contractForm.type_name }}</el-form-item>
          </el-col>
          <el-col 
            v-if="contractForm.receive_date" 
            :span="12">
            <el-form-item 
              label="收款日期:" 
              prop="receive_date">{{ contractForm.receive_date }}</el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="contractForm.type_name === '收款合同'">
          <el-col :span="12">
            <el-form-item 
              label="合同种类:" 
              prop="kind">{{ contractForm.kind }}</el-form-item>
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
          <el-col :span="12">
            <el-form-item 
              label="备注:" 
              prop="remark">{{ contractForm.remark }}</el-form-item>
          </el-col>
        </el-row>
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
              label="定制节目数量:" 
              prop="special_num">{{ contractForm.special_num }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="通用节目数量:" 
              prop="common_num">{{ contractForm.common_num }}</el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          v-if="contractForm.legal_message"
          label="法务意见:"
          prop="legal_message"
        >{{ contractForm.legal_message }}</el-form-item>
        <el-form-item
          v-if="contractForm.legal_ma_message"
          label="法务主管意见:"
          prop="legal_ma_message"
        >{{ contractForm.legal_ma_message }}</el-form-item>
        <el-form-item
          v-if="contractForm.bd_ma_message"
          label="bd主管意见:"
          prop="bd_ma_message"
        >{{ contractForm.bd_ma_message }}</el-form-item>
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
        <el-form-item>
          <el-button 
            size="small" 
            @click="historyBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { historyBack, contractDetail } from "service";

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
      projectNumFlag: true,
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      fileList: [],
      productTableData: [],
      contractForm: {
        company_name: "",
        company_id: "",
        applicant_name: "",
        applicant: "",
        name: "",
        contract_number: "",
        type: "",
        type_name: "",
        date: [],
        kind: "",
        receive_date: "",
        ids: "",
        remark: "",
        bd_ma_message: "",
        legal_message: "",
        legal_ma_message: "",
        special_num: null,
        common_num: null
      }
    };
  },
  created() {
    this.contractID = this.$route.params.uid;
    this.contractDetail();
  },
  methods: {
    historyBack() {
      historyBack();
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
    contractDetail() {
      this.setting.loading = true;
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
          this.projectNumFlag = this.contractForm.type === 0 ? true : false;
          this.contractForm.type_name = res.type;
          this.contractForm.applicant = res.applicant;
          this.contractForm.name = res.name;
          this.contractForm.contract_number = res.contract_number;
          this.contractForm.company_id = res.company_id;
          this.contractForm.company_name = res.company_name;
          this.contractForm.date = res.receive_date.split(",");
          this.contractForm.receive_date = res.receive_date;
          this.contractForm.remark = res.remark;
          this.contractForm.bd_ma_message = res.bd_ma_message;
          this.contractForm.legal_message = res.legal_message;
          this.contractForm.legal_ma_message = res.legal_ma_message;
          this.contractForm.kind = res.kind;
          this.contractForm.special_num = res.special_num;
          this.contractForm.common_num = res.common_num;
          this.contractForm.serve_target = res.serve_target;
          this.contractForm.recharge = res.recharge;
          if (res.product_content) {
            this.productTableData = res.product_content;
          }
          mediaData.map(r => {
            mediaIds.push(r.id);
          });
          this.contractForm.ids = mediaIds;
          this.fileList = mediaData;
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
