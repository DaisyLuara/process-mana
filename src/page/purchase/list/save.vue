<template>
  <div class="item-wrap-template">
    <div v-loading="setting.loading" :element-loading-text="setting.loadingText" class="pane">
      <div class="pane-title">{{ purchaseID ? '修改硬件' : '新增硬件' }}</div>
      <el-form ref="purchaseForm" :model="purchaseForm" :rules="rules" label-width="130px">
        <el-form-item label="硬件名称" prop="name">
          <el-input
            v-model="purchaseForm.name"
            :maxlength="150"
            placeholder="请填写硬件名称"
            class="item-input"
          />
        </el-form-item>
        <el-form-item label="硬件型号" prop="model">
          <el-input
            v-model="purchaseForm.model"
            placeholder="请填写硬件型号"
            :maxlength="150"
            class="item-input"
          />
        </el-form-item>
        <el-form-item label="所属工厂" prop="factory">
          <el-input
            v-model="purchaseForm.factory"
            placeholder="请填写所属工厂"
            :maxlength="100"
            class="item-input"
          />
        </el-form-item>
        <el-form-item label="工厂库存数" prop="factory_stock">
          <el-input
            v-model="purchaseForm.factory_stock"
            placeholder="请填写工厂库存数"
            :maxlength="30"
            class="item-input"
          />
        </el-form-item>
        <el-form-item label="仓库库存数" prop="warehouse_stock">
          <el-input
            v-model="purchaseForm.warehouse_stock"
            placeholder="请填写仓库库存数"
            :maxlength="30"
            class="item-input"
          />
        </el-form-item>
        <el-form-item label="公司库存数" prop="company_stock">
          <el-input
            v-model="purchaseForm.company_stock"
            placeholder="请填写公司库存数"
            :maxlength="30"
            class="item-input"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('purchaseForm')">保存</el-button>
          <el-button @click="historyBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  savePurchase,
  modifyPurchase,
  purchaseDetail,
  Cookies,
  historyBack
} from "service";

import { Form, FormItem, Button, Input, MessageBox } from "element-ui";

export default {
  components: {
    ElForm: Form,
    ElFormItem: FormItem,
    ElButton: Button,
    ElInput: Input
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
      purchaseID: "",
      purchaseForm: {
        name: "",
        model: "",
        factory: "",
        factory_stock: "",
        warehouse_stock: "",
        company_stock: ""
      },
      rules: {
        factory_stock: [
          { required: true, message: "请输入工厂库存数", trigger: "submit" },
          { validator: checkNumber, trigger: "submit" }
        ],
        warehouse_stock: [
          { required: true, message: "请输入仓库库存数", trigger: "submit" },
          { validator: checkNumber, trigger: "submit" }
        ],
        company_stock: [
          { required: true, message: "请输入公司库存数", trigger: "submit" },
          { validator: checkNumber, trigger: "submit" }
        ],
        model: [
          { required: true, message: "请输入硬件型号", trigger: "submit" }
        ],
        factory: [
          { required: true, message: "请输入所属工厂", trigger: "submit" }
        ],
        name: [{ required: true, message: "请输入硬件名称", trigger: "submit" }]
      }
    };
  },
  created() {
    this.setting.loading = true;
    this.purchaseID = this.$route.params.uid;
    if (this.purchaseID) {
      this.purchaseDetail()
    } else {
      this.setting.loading = false;
    }
  },
  methods: {
    purchaseDetail() {
      purchaseDetail(this, this.purchaseID)
        .then(res => {
          this.purchaseForm.name = res.name;
          this.purchaseForm.model = res.model;
          this.purchaseForm.factory = res.factory;
          this.purchaseForm.factory_stock = res.factory_stock;
          this.purchaseForm.warehouse_stock = res.warehouse_stock;
          this.purchaseForm.company_stock = res.company_stock;
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
          let args = this.purchaseForm;
          if (this.purchaseID) {
            args.id = this.purchaseID;
            modifyPurchase(this, this.purchaseID, args)
              .then(res => {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/purchase/list"
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
            savePurchase(this, args)
              .then(res => {
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/purchase/list"
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
