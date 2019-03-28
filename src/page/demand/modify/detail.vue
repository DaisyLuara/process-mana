<template>
  <div class="item-wrap-template">
    <div 
      v-loading="setting.loading" 
      :element-loading-text="setting.loadingText" 
      class="pane">
      <div class="pane-title">需求修改详情</div>
      <el-form 
        ref="demandModfiyForm" 
        :model="demandModfiyForm" 
        label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="项目标的"
              prop="demand_application_name"
            >{{ demandModfiyForm.demand_application_name }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="申请人" 
              prop="applicant_name">{{ demandModfiyForm.applicant_name }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="修改标题" 
              prop="title">{{ demandModfiyForm.title }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="修改详情" 
              prop="content">{{ demandModfiyForm.content }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="反馈人"
              prop="feedback_person_name"
            >{{ demandModfiyForm.feedback_person_name }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="反馈内容" 
              prop="feedback">{{ demandModfiyForm.feedback }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="审核人" 
              prop="reviewer_name">{{ demandModfiyForm.reviewer_name }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="审核备注" 
              prop="reject_remark">{{ demandModfiyForm.reject_remark }}</el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            v-if="demandModfiyForm.receiver_id === applicant_id && demandModfiyForm.has_feedback === 0"
            type="warning"
            @click="feedback('demandModfiyForm')"
          >反馈</el-button>
          <el-button @click="historyBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog 
      :visible.sync="dialogFormVisible" 
      :show-close="false" 
      title="反馈信息">
      <el-form :model="demandModfiyForm">
        <el-form-item
          :rules="[{ required: true, message: '请输入接单人备注', trigger: 'submit' }]"
          label="需求修改反馈"
          label-width="120px"
        >
          <el-input
            v-model="demandModfiyForm.feedback"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请填写需求修改反馈"
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
          @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  Cookies,
  historyBack,
  feedbackDemand,
  demandModifyDetail
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
  Col,
  Dialog
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
    ElDialog: Dialog
  },
  data() {
    return {
      dialogFormVisible: false,
      searchLoading: false,
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      demandModfiyForm: {
        has_feedback: null,
        demand_application_name: "",
        receiver_id: null,
        applicant_name: "",
        title: "",
        content: "",
        feedback_person_name: "",
        feedback: "",
        reviewer_name: "",
        reject_remark: ""
      },
      demandModifyID: null,
      applicant_id: null
    };
  },
  created() {
    this.demandModifyID = this.$route.params.uid;
    this.demandModifyDetail();
    let user_info = JSON.parse(Cookies.get("user_info"));
    this.applicant_id = user_info.id;
  },
  methods: {
    demandModifyDetail() {
      this.setting.loading = true;
      demandModifyDetail(this, this.demandModifyID)
        .then(res => {
          this.demandModfiyForm.has_feedback = res.has_feedback;
          this.demandModfiyForm.demand_application_name =
            res.demand_application.title;
          this.demandModfiyForm.receiver_id =
            res.demand_application.receiver_id;
          this.demandModfiyForm.title = res.title;
          this.demandModfiyForm.content = res.content;
          this.demandModfiyForm.applicant_name = res.applicant_name;
          this.demandModfiyForm.feedback_person_name = res.feedback_person_name;
          this.demandModfiyForm.feedback = res.feedback;
          this.demandModfiyForm.reviewer_name = res.reviewer_name;
          this.demandModfiyForm.reject_remark = res.reject_remark;
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
    feedback() {
      this.dialogFormVisible = true;
    },
    cancel() {
      this.dialogFormVisible = false;
      this.demandModfiyForm.feedback = "";
    },
    submit() {
      let args = {
        feedback: this.demandModfiyForm.feedback
      };
      feedbackDemand(this, this.demandModifyID, args)
        .then(res => {
          this.$message({
            message: "反馈成功",
            type: "success"
          });
          this.$router.push({
            path: "/demand/modify"
          });
        })
        .catch(err => {
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
