<template>
  <div class="item-wrap-template">
    <div v-loading="setting.loading" :element-loading-text="setting.loadingText" class="pane">
      <div class="pane-title">{{demandModifyID ? '编辑需求修改' : '新增需求修改'}}</div>
      <el-form ref="demandModfiyForm" :model="demandModfiyForm" :rules="rules" label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目标的" prop="demand_application_id">
              <el-select
                v-model="demandModfiyForm.demand_application_id"
                :loading="searchLoading"
                placeholder="请选择项目标的"
                filterable
                clearable
              >
                <el-option
                  v-for="item in titleList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人" prop="applicant_name">
              <el-input
                v-model="demandModfiyForm.applicant_name"
                :disabled="true"
                :maxlength="50"
                class="item-input"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="修改标题" prop="title">
              <el-input
                v-model="demandModfiyForm.title"
                placeholder="请填写修改标题"
                :maxlength="15"
                class="item-input"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修改详情" prop="content">
              <el-input
                v-model="demandModfiyForm.content"
                placeholder="请填写节修改详情"
                :maxlength="200"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                class="item-input"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="submit('demandModfiyForm')">保存</el-button>
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
  getSearchDemandApplication,
  demandModifyDetail,
  saveDemandModify,
  editDemandModifyDetail
} from "service";

import {
  Form,
  Select,
  Option,
  FormItem,
  Button,
  Input,
  Row,
  MessageBox,
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
    ElInput: Input
  },
  data() {
    return {
      searchLoading: false,
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      demandModfiyForm: {
        demand_application_id: "",
        applicant_id: "",
        applicant_name: "",
        title: "",
        content: ""
      },
      rules: {
        demand_application_id: [
          { required: true, message: "请选择项目标的", trigger: "submit" }
        ],
        applicant_name: [
          { required: true, message: "申请人不能为空", trigger: "submit" }
        ],
        title: [
          { required: true, message: "修改标题不能为空", trigger: "submit" }
        ],
        content: [
          { required: true, message: "修改详情不能为空", trigger: "submit" }
        ]
      },
      demandModifyID: null,
      titleList: []
    };
  },
  created() {
    this.demandModifyID = this.$route.params.uid;
    this.setting.loading = true;
    this.getSearchDemandApplication();
    if (this.demandModifyID) {
      this.demandModifyDetail();
    } else {
      let user_info = JSON.parse(Cookies.get("user_info"));
      this.demandModfiyForm.applicant_name = user_info.name;
      this.demandModfiyForm.applicant_id = user_info.id;
      this.setting.loading = false;
    }
  },
  methods: {
    getSearchDemandApplication() {
      this.searchLoading = true;
      let args = {
        no_status: 0
      };
      getSearchDemandApplication(this, args)
        .then(res => {
          this.titleList = res;
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
    demandModifyDetail() {
      this.setting.loading = true;
      demandModifyDetail(this, this.demandModifyID)
        .then(res => {
          this.demandModfiyForm.demand_application_id =
            res.demand_application_id;
          this.demandModfiyForm.applicant_id = res.applicant_id;
          this.demandModfiyForm.title = res.title;
          this.demandModfiyForm.content = res.content;
          this.demandModfiyForm.applicant_name = res.applicant_name;
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
    historyBack() {
      historyBack();
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true;
          delete this.demandModfiyForm.applicant_name;
          let args = this.demandModfiyForm;
          if (this.demandModifyID) {
            editDemandModifyDetail(this, this.demandModifyID, args)
              .then(res => {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/demand/modify"
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
            saveDemandModify(this, args)
              .then(res => {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/demand/modify"
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
