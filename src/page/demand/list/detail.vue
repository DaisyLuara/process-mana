<template>
  <div class="item-wrap-template">
    <div 
      v-loading="setting.loading" 
      :element-loading-text="setting.loadingText" 
      class="pane">
      <div class="pane-title">申请详情</div>
      <el-form 
        ref="demandApplyForm" 
        :model="demandApplyForm" 
        label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="项目标的:" 
              prop="title">{{ demandApplyForm.title }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="申请人:" 
              prop="applicant_name">{{ demandApplyForm.applicant_name }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="有无合同:"
              prop="has_contract_text"
            >{{ demandApplyForm.has_contract_text }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="合同编号:"
              prop="contract_no_string"
            >{{ demandApplyForm.contract_no_string }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="节目数量:" 
              prop="project_num">{{ demandApplyForm.project_num }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="节目列表:"
              prop="similar_project_name"
            >{{ demandApplyForm.similar_project_name }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="期望上线日期:"
              prop="expect_online_time"
            >{{ demandApplyForm.expect_online_time }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="期望接单人:"
              prop="expect_receiver_names"
            >{{ demandApplyForm.expect_receiver_names }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="投放地点备注:"
              prop="launch_point_remark"
            >{{ demandApplyForm.launch_point_remark }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="大屏节目需求:"
              prop="big_screen_demand"
            >{{ demandApplyForm.big_screen_demand }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="小屏定制内容:"
              prop="big_screen_demand"
            >{{ demandApplyForm.small_screen_demand }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="H5节目需求:"
              prop="h5_demand">{{ demandApplyForm.h5_demand }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="其他定制内容:"
              prop="other_demand">{{ demandApplyForm.other_demand }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="接单人:" 
              prop="receiver_name">{{ demandApplyForm.receiver_name }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="接单人备注:"
              prop="receiver_remark"
            >{{ demandApplyForm.receiver_remark }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="备注:" 
              prop="applicant_remark">{{ demandApplyForm.applicant_remark }}</el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            v-if="(projectManager || designer || legalAffairsManager) && status===0"
            type="warning"
            @click="receiveDemand"
          >接单</el-button>
          <el-button @click="historyBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog 
      :visible.sync="dialogFormVisible" 
      :show-close="false" 
      title="接单信息">
      <el-form :model="receiveForm">
        <el-form-item 
          label="接单人" 
          label-width="100px">
          <el-select
            v-model="receiveForm.receiver_id"
            :loading="searchLoading"
            :disabled="disabledUse"
            placeholder="请选择接单人"
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
        <el-form-item 
          label="接单人备注" 
          label-width="100px">
          <el-input
            v-model="receiveForm.receiver_remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请填写接单人备注"
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
          @click="receiveConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  Cookies,
  historyBack,
  handleDateTransform,
  demandDetail,
  getSearchDemandPeople,
  receiveDemand
} from "service";

import {
  Form,
  FormItem,
  Button,
  Input,
  Row,
  MessageBox,
  Col,
  Dialog,
  Select,
  Option
} from "element-ui";

export default {
  components: {
    ElSelect: Select,
    ElOption: Option,
    ElRow: Row,
    ElCol: Col,
    ElForm: Form,
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
      receiverList: [],
      applicant_id: "",
      status: null,
      demandApplyForm: {
        title: "",
        applicant_id: "",
        has_contract_text: "",
        contract_no_string: "",
        project_num: 0,
        similar_project_name: "",
        applicant_name: "",
        expect_online_time: "",
        expect_receiver_names: [],
        launch_point_remark: "",
        big_screen_demand: "",
        small_screen_demand: "",
        h5_demand: "",
        other_demand: "",
        applicant_remark: "",
        receiver_remark: "",
        receiver_name: ""
      },
      demandID: null,
      receiveForm: {
        receiver_id: "",
        receiver_remark: ""
      },
      roles: [],
      disabledUse: false
    };
  },
  computed: {
    // 产品经理
    projectManager: function() {
      return this.roles.find(r => {
        return r.name === "project-manager";
      });
    },
    // 设计
    designer: function() {
      return this.roles.find(r => {
        return r.name === "designer";
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
    this.demandID = this.$route.params.uid;
    let user_info = JSON.parse(Cookies.get("user_info"));
    this.applicant_id = user_info.id;
    this.roles = user_info.roles.data;
    this.getSearchDemandPeople();
    this.demandDetail();
  },
  methods: {
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
    demandDetail() {
      this.setting.loading = true;
      demandDetail(this, this.demandID)
        .then(res => {
          this.status = res.status;
          this.demandApplyForm.receiver_name = res.receiver_name;
          this.demandApplyForm.receiver_remark = res.receiver_remark;
          this.demandApplyForm.title = res.title;
          this.demandApplyForm.applicant_id = res.applicant_id;
          this.demandApplyForm.has_contract_text = res.has_contract_text;
          this.demandApplyForm.contract_no_string = res.contract_no_string;
          this.demandApplyForm.project_num = res.project_num;
          this.demandApplyForm.expect_receiver_names =
            res.expect_receiver_names;
          this.demandApplyForm.similar_project_name = res.similar_project_name;
          this.demandApplyForm.applicant_name = res.applicant_name;
          this.demandApplyForm.expect_online_time = res.expect_online_time;
          this.demandApplyForm.launch_point_remark = res.launch_point_remark;
          this.demandApplyForm.big_screen_demand = res.big_screen_demand;
          this.demandApplyForm.small_screen_demand = res.small_screen_demand;
          this.demandApplyForm.h5_demand = res.h5_demand;
          this.demandApplyForm.other_demand = res.other_demand;
          this.demandApplyForm.applicant_remark = res.applicant_remark;
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
    receiveDemand() {
      this.dialogFormVisible = true;
      if (this.legalAffairsManager) {
        this.disabledUse = false;
      } else {
        this.receiveForm.receiver_id = this.applicant_id;
        this.disabledUse = true;
      }
    },
    cancel() {
      this.receiveForm.receiver_id = this.applicant_id;
      this.receiveForm.receiver_remark = "";
      this.dialogFormVisible = false;
    },
    receiveConfirm() {
      let args = {
        receiver_id: this.receiveForm.receiver_id,
        receiver_remark: this.receiveForm.receiver_remark
      };
      receiveDemand(this, this.demandID, args)
        .then(res => {
          this.$message({
            message: "接单成功",
            type: "success"
          });
          this.$router.push({
            path: "/demand/list"
          });
          this.dialogFormVisible = false;
        })
        .catch(err => {
          this.dialogFormVisible = false;
          this.$message({
            type: "success",
            message: err.response.data.message
          });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.item-wrap-template {
  .el-select {
    width: 400px;
  }
  .pane {
    border-radius: 5px;
    background-color: white;
    padding: 20px 40px 80px;

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
