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
        <el-form-item label="硬件性质" prop="quality">
          <el-radio-group v-model="detailsForm.quality">
            <el-radio :label="1">出厂</el-radio>
            <el-radio :label="2">返厂</el-radio>
            <el-radio :label="3">购入</el-radio>
            <el-radio :label="4">返修</el-radio>
            <el-radio :label="5">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="调整出处" prop="source">
          <el-select v-model="detailsForm.source" filterable clearable placeholder="请选择调整出处">
            <el-option
              v-for="item in sourceList"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="调整形式" prop="form">
          <el-radio-group v-model="detailsForm.form">
            <el-radio :label="1">增加</el-radio>
            <el-radio :label="2">减少</el-radio>
            <el-radio :label="3">不变</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="调整数量" prop="amount">
          <el-input
            v-model="detailsForm.amount"
            placeholder="请填写调整数量"
            :maxlength="30"
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
import {
  saveDetails,
  modifyDetails,
  storeDetail,
  Cookies,
  historyBack
} from "service";

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
      if (typeof parseFloat(value) !== "number") {
        callback(new Error("必须是数字"));
      } else {
        callback();
      }
    };
    return {
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      detailsID: "",
      detailsForm: {
        model: "",
        color: "",
        quality: 3,
        source: "",
        form: "",
        amount: "",
        remark: ""
      },
      pid: "",
      sourceList: {},
      rules: {
        quality: [
          { required: true, message: "请选择硬件性质", trigger: "submit" }
        ],
        source: [
          { required: true, message: "请选择调整出处", trigger: "submit" }
        ],
        form: [
          { required: true, message: "请选择调整形式", trigger: "submit" }
        ],
        amount: [
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
    if (this.detailsID) {
      this.storeDetail();
    } else {
      this.setting.loading = false;
    }
  },
  methods: {
    storeDetail() {
      storeDetail(this, this.detailsID)
        .then(res => {
          this.detailsForm.model = res.model;
          this.detailsForm.color = res.color;
          this.detailsForm.shenyue_stock = res.shenyue_stock;
          this.detailsForm.yuezhan_stock = res.yuezhan_stock;
          this.detailsForm.zhouyou_stock = res.zhouyou_stock;
          this.detailsForm.warehouse_stock = res.warehouse_stock;
          this.detailsForm.company_stock = res.company_stock;
          this.detailsForm.back_amount = res.back_amount;

          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
        });
    },
    historyBack() {
      historyBack();
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true;
          let args = this.detailsForm;
          if (this.detailsID) {
            args.id = this.detailsID;
            modifyDetails(this, this.detailsID, args)
              .then(res => {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                // this.$router.push({
                //   path: "/purchase/list"
                // });
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
          } else {
            saveDetails(this, args)
              .then(res => {
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                // this.$router.push({
                //   path: "/purchase/detail"
                // });
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
