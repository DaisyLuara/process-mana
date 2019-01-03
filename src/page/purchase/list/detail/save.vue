<template>
  <div class="item-wrap-template">
    <div v-loading="setting.loading" :element-loading-text="setting.loadingText" class="pane">
      <div class="pane-title">{{ detailsID ? '修改库存明细' : '新增库存明细' }}</div>
      <el-form ref="detailsForm" :model="detailsForm" :rules="rules" label-width="130px">
        <el-form-item label="硬件型号" prop="model">
          <el-input
            v-model="detailsForm.model"
            placeholder="请填写硬件型号"
            :maxlength="150"
            :disabled="true"
            class="item-input"
          />
        </el-form-item>
        <el-form-item label="硬件颜色" prop="color">
          <el-input
            v-model="detailsForm.color"
            placeholder="请填写硬件颜色"
            :maxlength="100"
            :disabled="true"
            class="item-input"
          />
        </el-form-item>
        <el-form-item label="硬件性质" prop="action">
          <el-radio-group v-model="detailsForm.action">
            <el-radio :label="0">出厂</el-radio>
            <el-radio :label="1">返厂</el-radio>
            <el-radio :label="2">购入</el-radio>
            <el-radio :label="3">返修</el-radio>
            <el-radio :label="4">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="调整出处" prop="source">
          <el-select
            v-model="detailsForm.source"
            :loading="searchLoading"
            filterable
            clearable
            placeholder="请选择调整出处"
          >
            <el-option
              v-for="item in sourceList"
              :key="item.id"
              :label="item.source"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="调整形式" prop="change">
          <el-radio-group v-model="detailsForm.change" @change="adjustFormHandle">
            <el-radio :label="0">增加</el-radio>
            <el-radio :label="1">减少</el-radio>
            <el-radio :label="2">不变</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="调整数量" prop="num">
          <el-input
            v-model="detailsForm.num"
            :maxlength="30"
            :disabled="numDisable"
            placeholder="请填写调整数量"
            class="item-input"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="detailsForm.remark"
            :maxlength="1000"
            type="textarea"
            placeholder="请填写备注"
            class="item-input"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('detailsForm')">保存</el-button>
          <el-button @click="historyBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { saveDetails, Cookies, historyBack, hardwareSource } from "service";

import {
  Form,
  FormItem,
  Button,
  Input,
  MessageBox,
  RadioGroup,
  Radio,
  Select,
  Option
} from "element-ui";

export default {
  components: {
    ElRadioGroup: RadioGroup,
    ElRadio: Radio,
    ElForm: Form,
    ElFormItem: FormItem,
    ElButton: Button,
    ElInput: Input,
    ElSelect: Select,
    ElOption: Option
  },
  data() {
    let checkNumber = (rule, value, callback) => {
      if (!/^\d+$/.test(value)) {
        callback(new Error("必须是正整数 + 0"));
      } else {
        callback();
      }
    };
    return {
      searchLoading: false,
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      detailsID: "",
      numDisable: true,
      detailsForm: {
        model: "",
        color: "",
        action: 3,
        source: "",
        change: 2,
        num: 0,
        remark: ""
      },
      pid: "",
      sourceList: [],
      rules: {
        action: [
          { required: true, message: "请选择硬件性质", trigger: "submit" }
        ],
        source: [
          { required: true, message: "请选择调整出处", trigger: "submit" }
        ],
        change: [
          { required: true, message: "请选择调整形式", trigger: "submit" }
        ],
        num: [
          { required: true, message: "请填写调整数量", trigger: "submit" },
          { validator: checkNumber, trigger: "submit" }
        ]
      }
    };
  },
  created() {
    this.setting.loading = true;
    this.detailsID = this.$route.params.uid;
    this.pid = this.$route.params.pid;
    this.detailsForm.model = this.$route.query.model;
    this.detailsForm.color = this.$route.query.color;
    this.hardwareSource();
    this.setting.loading = false;
  },
  methods: {
    hardwareSource() {
      this.searchLoading = true;
      hardwareSource(this)
        .then(res => {
          this.searchLoading = false;
          this.sourceList = res.data;
        })
        .catch(err => {
          this.searchLoading = false;
          this.$message({
            message: err.response.data.message,
            type: "warning"
          });
        });
    },
    historyBack() {
      historyBack();
    },
    adjustFormHandle(val) {
      if (val === 2) {
        this.detailsForm.change = 0;
        this.numDisable = true;
      } else {
        this.numDisable = false;
      }
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true;
          let args = this.detailsForm;
          saveDetails(this, args)
            .then(res => {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.historyBack();
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
