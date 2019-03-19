<template>
  <div class="item-wrap-template">
    <div v-loading="setting.loading" :element-loading-text="setting.loadingText" class="pane">
      <div class="pane-title">{{demandID ? '编辑申请' : '新增申请'}}</div>
      <el-form ref="demandApplyForm" :model="demandApplyForm" :rules="rules" label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目标的" prop="title">
              <el-input
                v-model="demandApplyForm.title"
                :maxlength="100"
                placeholder="请填写项目标的"
                class="item-input"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人" prop="applicant_name">
              <el-input
                v-model="demandApplyForm.applicant_name"
                :disabled="true"
                :maxlength="50"
                class="item-input"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="有无合同" prop="has_contract">
              <el-radio-group v-model="demandApplyForm.has_contract" @change="contractHandle">
                <el-radio :label="0">无合同</el-radio>
                <el-radio :label="1">有合同</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同编号" prop="contract_ids">
              <el-select
                v-model="demandApplyForm.contract_ids"
                :loading="searchLoading"
                :disabled="contractUse"
                :multiple-limit="1"
                multiple
                placeholder="请选择合同编号"
                filterable
                clearable
              >
                <el-option
                  v-for="item in contractList"
                  :key="item.id"
                  :label="item.contract_number"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="节目数量" prop="project_num">
              <el-input
                v-model="demandApplyForm.project_num"
                placeholder="请填写节目数量"
                class="item-input"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="节目列表" prop="similar_project_name">
              <el-input
                v-model="demandApplyForm.similar_project_name"
                placeholder="请填写节目列表"
                :maxlength="200"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                class="item-input"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="期望上线日期" prop="expect_online_time">
              <el-date-picker
                v-model="demandApplyForm.expect_online_time"
                type="date"
                placeholder="选择期望上线日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="期望接单人" prop="expect_receiver_ids">
              <el-select
                v-model="demandApplyForm.expect_receiver_ids"
                :loading="searchLoading"
                :multiple-limit="5"
                multiple
                placeholder="请选择期望接单人"
                filterable
                clearable
              >
                <el-option
                  v-for="item in receiverList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="投放地点备注" prop="launch_point_remark">
              <el-input
                v-model="demandApplyForm.launch_point_remark"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                placeholder="请填写投放地点备注"
                class="text-input"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="大屏节目需求" prop="big_screen_demand">
              <el-input
                v-model="demandApplyForm.big_screen_demand"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                placeholder="请填写大屏节目需求"
                class="text-input"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="H5节目需求" prop="h5_demand">
              <el-input
                v-model="demandApplyForm.h5_demand"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                placeholder="请填写H5节目需求"
                class="text-input"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他定制内容" prop="other_demand">
              <el-input
                v-model="demandApplyForm.other_demand"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                placeholder="请填写其他定制内容"
                class="text-input"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="applicant_remark">
              <el-input
                v-model="demandApplyForm.applicant_remark"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                placeholder="请填写备注"
                class="text-input"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="submit('demandApplyForm')">保存</el-button>
          <el-button @click="historyBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  Cookies,
  historyBack,
  getSearchDemandPeople,
  saveDemand,
  getContract,
  handleDateTransform,
  demandDetail,
  editDemandDetail
} from "service";

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
  Col
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
    ElDatePicker: DatePicker
  },
  data() {
    return {
      contractUse: true,
      searchLoading: false,
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      contractList: [],
      receiverList: [],
      demandApplyForm: {
        title: "",
        applicant_id: "",
        has_contract: 0,
        contract_ids: [],
        project_num: 0,
        similar_project_name: "",
        applicant_name: "",
        expect_online_time: "",
        expect_receiver_ids: [],
        launch_point_remark: "",
        big_screen_demand: "",
        h5_demand: "",
        other_demand: "",
        applicant_remark: ""
      },
      rules: {
        title: [
          { required: true, message: "请填写项目标的", trigger: "submit" }
        ],
        applicant_name: [
          { required: true, message: "申请人不能为空", trigger: "submit" }
        ],
        contract_ids: [
          { required: false, message: "请选择合同编号", trigger: "submit" }
        ],
        project_num: [
          { required: true, message: "请填写节目数量", trigger: "submit" }
        ],
        has_contract: [
          { required: true, message: "请选择有无合同", trigger: "submit" }
        ],
        similar_project_name: [
          { required: true, message: "节目列表不能为空", trigger: "submit" }
        ],
        expect_online_time: [
          { required: true, message: "期望上线日期不能为空", trigger: "submit" }
        ],
        launch_point_remark: [
          { required: true, message: "投放地点备注不能为空", trigger: "submit" }
        ],
        big_screen_demand: [
          { required: true, message: "大屏节目需求不能为空", trigger: "submit" }
        ],
        h5_demand: [
          { required: true, message: "H5节目需求不能为空", trigger: "submit" }
        ],
        other_demand: [
          { required: true, message: "其他定制内容不能为空", trigger: "submit" }
        ]
      },
      demandID: null
    };
  },
  created() {
    this.demandID = this.$route.params.uid;
    this.setting.loading = true;
    this.getSearchDemandPeople();
    this.getContract();
    if (this.demandID) {
      this.demandDetail();
    } else {
      let user_info = JSON.parse(Cookies.get("user_info"));
      this.demandApplyForm.applicant_name = user_info.name;
      this.demandApplyForm.applicant_id = user_info.id;
      this.setting.loading = false;
    }
  },
  methods: {
    demandDetail() {
      this.setting.loading = true;
      demandDetail(this, this.demandID)
        .then(res => {
          this.demandApplyForm.title = res.title;
          this.demandApplyForm.applicant_id = res.applicant_id;
          this.demandApplyForm.has_contract = res.has_contract;
          this.demandApplyForm.contract_ids = res.contract_ids;
          this.demandApplyForm.project_num = res.project_num;
          this.demandApplyForm.expect_receiver_ids = res.expect_receiver_ids;
          this.demandApplyForm.similar_project_name = res.similar_project_name;
          this.demandApplyForm.applicant_name = res.applicant_name;
          this.demandApplyForm.expect_online_time = res.expect_online_time;
          this.demandApplyForm.launch_point_remark = res.launch_point_remark;
          this.demandApplyForm.big_screen_demand = res.big_screen_demand;
          this.demandApplyForm.h5_demand = res.h5_demand;
          this.demandApplyForm.other_demand = res.other_demand;
          this.demandApplyForm.applicant_remark = res.applicant_remark;
          this.contractHandle(res.has_contract);
          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
          this.$message({
            type: "success",
            message: err.response.data.message
          });
        });
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
            type: "success",
            message: err.response.data.message
          });
        });
    },
    contractHandle(val) {
      if (val === 0) {
        this.contract_ids = [];
        this.contractUse = true;
        this.rules.contract_ids[0].required = false;
      } else {
        this.rules.contract_ids[0].required = true;
        this.contractUse = false;
      }
    },
    getSearchDemandPeople() {
      this.searchLoading = true;
      let args = {
        permission: "demand.application.receive"
      };
      getSearchDemandPeople(this, args)
        .then(res => {
          this.receiverList = res;
          this.searchLoading = false;
        })
        .catch(err => {
          this.searchLoading = false;
          this.$message({
            type: "success",
            message: err.response.data.message
          });
        });
    },
    historyBack() {
      historyBack();
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true;
          delete this.demandApplyForm.applicant_name;
          let args = this.demandApplyForm;
          args.expect_online_time = handleDateTransform(
            this.demandApplyForm.expect_online_time
          );
          if (this.demandID) {
            editDemandDetail(this, this.demandID, args)
              .then(res => {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/demand/list"
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
          } else {
            saveDemand(this, args)
              .then(res => {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/demand/list"
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
