<template>
  <div class="item-wrap-template">
    <div v-loading="setting.loading" :element-loading-text="setting.loadingText" class="pane">
      <div class="pane-title">新增合同</div>
      <el-form ref="contractForm" :model="contractForm" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="公司名称" prop="company_id">
              <el-select
                v-model="contractForm.company_id"
                :loading="searchLoading"
                placeholder="请选择公司名称"
                filterable
                clearable
              >
                <el-option
                  v-for="item in companyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人" prop="applicant_name">
              <el-input
                v-model="contractForm.applicant_name"
                :disabled="true"
                :maxlength="50"
                class="item-input"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同名称" prop="name">
              <el-input
                v-model="contractForm.name"
                :maxlength="50"
                placeholder="请填写合同名称"
                class="item-input"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同类型" prop="type">
              <el-radio-group v-model="contractForm.type" @change="contractTypeHandle">
                <el-radio :label="0">收款合同</el-radio>
                <el-radio :label="1">付款合同</el-radio>
                <el-radio :label="2">其他合同</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="合同内容" prop="ids">
              <el-upload
                ref="upload"
                :action="SERVER_URL + '/api/media'"
                :data="{type: 'file'}"
                :headers="formHeader"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
                :on-remove="handleRemove"
                :on-preview="handlePreview"
                :before-remove="beforeRemove"
                :file-list="fileList"
                class="upload-demo"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div
                  slot="tip"
                  style="display:inline-block"
                  class="el-upload__tip"
                >支持文件类型：doc(.docx)、.pdf</div>
                <div
                  v-if="fileList.length !==0"
                  slot="tip"
                  style="color: #ff5722;font-size: 12px;"
                >点击文件名称可以下载</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="contractForm.type === 0" label="合同总额" prop="amount">
              <el-input
                v-model="contractForm.amount"
                :maxlength="7"
                placeholder="请填写合同总额"
                class="item-input"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-if="contractForm.type === 0" :span="12">
            <el-form-item label="预估收款日期" prop="receive_date">
              <el-date-picker
                v-model="contractForm.receive_date"
                type="dates"
                placeholder="选择一个或多个日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="legalAffairs || legalAffairsManager"
              label="合同编号"
              prop="contract_number"
            >
              <el-input
                v-model="contractForm.contract_number"
                :maxlength="80"
                placeholder="请输入合同编号"
                class="item-input"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="contractForm.type === 0" label="合同种类" prop="kind">
              <el-radio-group v-model="contractForm.kind" @change="contractKindHandle">
                <el-radio :label="1">铺屏</el-radio>
                <el-radio :label="2">销售</el-radio>
                <el-radio :label="3">租赁</el-radio>
                <el-radio :label="4">服务</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="productFlag">
          <el-button
            size="small"
            type="success"
            style="margin-bottom: 20px;"
            @click="productAdd"
          >新增硬件信息</el-button>
          <el-table :data="productTableData" border style="width: 100%;margin-bottom: 20px;">
            <el-table-column
              prop="model"
              label="产品名称"
              min-width="80"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.product_name"
                  :loading="searchLoading"
                  placeholder="请选择产品名称"
                  filterable
                  clearable
                >
                  <el-option
                    v-for="item in nameList"
                    :key="item.id"
                    :label="item.value"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="product_color"
              label="产品颜色"
              min-width="80"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.product_color"
                  :loading="searchLoading"
                  placeholder="请选择产品颜色"
                  filterable
                  clearable
                >
                  <el-option
                    v-for="item in colorList"
                    :key="item.id"
                    :label="item.value"
                    :value="item.value"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="product_stock"
              label="产品数量"
              min-width="100"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-input v-model="scope.row.product_stock" placeholder="请输入产品数量"/>
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
        </el-row>
        <el-row v-if="serviceFlag">
          <el-col :span="12">
            <el-form-item label="服务对象" prop="serve_target">
              <el-radio-group v-model="contractForm.serve_target">
                <el-radio :label="1">商户</el-radio>
                <el-radio :label="2">商场</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预充值" prop="recharge">
              <el-radio-group v-model="contractForm.recharge">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="projectNumFlag">
          <el-col :span="12">
            <el-form-item label="定制节目数" prop="special_num">
              <el-input-number v-model="contractForm.special_num" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通用节目数" prop="common_num">
              <el-input-number v-model="contractForm.common_num" :min="0" :max="max"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="contractForm.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请填写备注"
            class="text-input"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('contractForm')">保存</el-button>
          <el-button @click="historyBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  getCompanyList,
  saveContract,
  handleDateTransform,
  modifyContract,
  historyBack,
  contractDetail,
  Cookies,
  getAttributeList
} from "service";
import auth from "service/auth";
import {
  Form,
  Select,
  Option,
  FormItem,
  Button,
  Input,
  Row,
  DatePicker,
  MessageBox,
  RadioGroup,
  Radio,
  Col,
  Upload,
  Table,
  TableColumn,
  InputNumber
} from "element-ui";

const SERVER_URL = process.env.SERVER_URL;
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
    ElDatePicker: DatePicker,
    ElRadioGroup: RadioGroup,
    ElRadio: Radio,
    ElUpload: Upload,
    ElTable: Table,
    ElTableColumn: TableColumn,
    ElInputNumber: InputNumber
  },
  data() {
    return {
      projectNumFlag: true,
      serviceFlag: false,
      productTableData: [],
      SERVER_URL: SERVER_URL,
      formHeader: {
        Authorization: "Bearer " + auth.getToken()
      },
      companyList: [],
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
      max: 2,
      productFlag: true,
      contractID: "",
      contractForm: {
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
        common_num: 1
      },
      rules: {
        ids: [{ required: true, message: "请上传文件", trigger: "submit" }],
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
        ],
        type: [
          { required: true, message: "请选择合同类型", trigger: "submit" }
        ],
        company_id: [
          { required: true, message: "请选择公司", trigger: "submit" }
        ],
        name: [
          { required: true, message: "请输入合同名称", trigger: "submit" }
        ],
        amount: [
          { required: true, message: "请输入合同金额", trigger: "submit" }
        ],
        receive_date: [
          { required: true, message: "请输入预估收款日期", trigger: "submit" }
        ],
        contract_number: [
          { required: true, message: "请输入合同编号", trigger: "submit" }
        ]
      }
    };
  },
  computed: {
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
    this.getCompany();
    this.getAttributeList();
    if (this.legalAffairsManager) {
      this.max = Infinity;
    }
    if (this.contractID) {
      this.contractDetail();
    } else {
      let user_info = JSON.parse(Cookies.get("user_info"));
      this.contractForm.applicant_name = user_info.name;
      this.contractForm.applicant = user_info.id;
      this.roles = user_info.roles.data;
      this.setting.loading = false;
    }
  },
  methods: {
    getAttributeList() {
      getAttributeList(this)
        .then(res => {
          if (res.data.length > 0) {
            res.data.map(r => {
              if (r.name === "name") {
                this.nameList = r.value;
              }
              if (r.name === "color") {
                this.colorList = r.value;
              }
            });
          }
        })
        .catch(err => {
          this.$message({
            message: err.response.data.message,
            type: "warning"
          });
        });
    },
    contractTypeHandle(val) {
      if (val === 0) {
        this.contractForm.kind = 1;
        this.productFlag = true;
        this.projectNumFlag = true;
      } else {
        this.contractForm.kind = 1;
        this.projectNumFlag = false;
        this.serviceFlag = false;
        this.productFlag = false;
      }
    },
    deleteHardware(index) {
      this.productTableData.splice(index, 1);
    },
    productAdd() {
      let td = {
        product_name: "",
        product_color: "",
        product_stock: ""
      };
      this.productTableData.unshift(td);
    },
    contractKindHandle(val) {
      if (val === 1 || val === 2 || val === 3) {
        this.serviceFlag = false;
        this.productFlag = true;
      } else {
        this.productFlag = false;
        this.serviceFlag = true;
      }
    },
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
          this.contractForm.applicant = res.applicant;
          this.contractForm.name = res.name;
          this.contractForm.company_id = res.company_id;
          this.contractForm.receive_date = res.receive_date
            ? res.receive_date.split(",")
            : [];
          this.contractForm.remark = res.remark;
          this.contractForm.contract_number = res.contract_number;
          if (res.kind === "铺屏") {
            this.contractForm.kind = 1;
          } else if (res.kind === "销售") {
            this.contractForm.kind = 2;
          } else if (res.kind === "租赁") {
            this.contractForm.kind = 3;
          } else if (res.kind === "服务") {
            this.contractForm.kind = 4;
          } else {
            this.contractForm.kind = null;
          }
          this.contractKindHandle(this.contractForm.kind);
          let product_content = res.product_content;
          this.contractForm.serve_target = res.serve_target === '商户' ? 1 : 2
          this.contractForm.recharge = res.recharge=== '否' ? 0 : 1
          product_content.map(r => {
            let data = {
              product_name: r.product_name,
              product_color: r.product_color,
              product_stock: r.product_stock
            };
          });
          this.productTableData = product_content;
          this.contractForm.amount = res.amount;
          mediaData.map(r => {
            mediaIds.push(r.id);
          });
          this.contractForm.ids = mediaIds;
          this.fileList = mediaData;
          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
          console.log(err);
        });
    },
    getCompany() {
      this.searchLoading = true;
      getCompanyList(this)
        .then(res => {
          this.searchLoading = false;
          this.companyList = res.data;
        })
        .catch(err => {
          this.searchLoading = false;
        });
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
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
    beforeRemove(file, fileList) {
      if (file.type) {
        return this.$confirm(`确定移除 ${file.name}？`);
      } else {
        const isFile =
          file.raw.type === "application/pdf" ||
          file.raw.type === "application/msword" ||
          file.raw.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        if (!isFile) {
          return true;
        } else {
          return this.$confirm(`确定移除 ${file.name}？`);
        }
      }
    },
    beforeUpload(file) {
      const isFile =
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      if (!isFile) {
        this.$message.error("上传文件仅支持doc(.docx)、.pdf格式!");
        return isFile;
      }
    },
    // 上传成功后的处理
    handleSuccess(response, file, fileList) {
      this.fileList.push(response);
    },
    historyBack() {
      historyBack();
    },
    submit(formName) {
      let mediaIds = [];
      if (this.fileList.length > 0) {
        this.fileList.map(r => {
          mediaIds.push(r.id);
        });
      }
      this.contractForm.ids = mediaIds.join(",");
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true;
          let args = {
            name: this.contractForm.name,
            company_id: this.contractForm.company_id,
            applicant: this.contractForm.applicant,
            type: this.contractForm.type,
            ids: this.contractForm.ids,
            kind: this.contractForm.kind,
            remark: this.contractForm.remark,
            special_num: this.contractForm.special_num,
            common_num: this.contractForm.common_num
          };
          if (this.contractForm.type === 0) {
            if (!this.contractForm.receive_date.length) {
              this.$message({
                message: "预估收款时间必填",
                type: "warning"
              });
              this.setting.loading = false;
              return;
            } else {
              let date = [];
              this.contractForm.receive_date.map(r => {
                let dateTransform = handleDateTransform(r);
                date.push(dateTransform);
              });
              args.receive_date = date.join(",");
            }
            if (!this.contractForm.amount) {
              this.$message({
                message: "合同总额必填",
                type: "warning"
              });
              this.setting.loading = false;
              return;
            } else {
              args.amount = this.contractForm.amount;
            }
          }
          if (this.legalAffairs || this.legalAffairsManager) {
            if (this.contractForm.contract_number === "") {
              this.$message({
                message: "请填写合同编号",
                type: "warning"
              });
              this.setting.loading = false;
              return;
            }
            args.contract_number = this.contractForm.contract_number;
          }
          if (this.contractForm.kind !== 4 && this.contractForm.type === 0) {
            let length = this.productTableData.length;
            if (length <= 0) {
              this.$message({
                message: "必须填写硬件信息,请点击新增硬件",
                type: "warning"
              });
              this.setting.loading = false;
              return;
            }
          } else {
            args.recharge = this.contractForm.recharge;
            args.serve_target = this.contractForm.serve_target;
            this.productTableData = [];
          }
          args.product_content = this.productTableData;
          saveContract(this, args)
            .then(res => {
              this.$message({
                message: "添加成功",
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
