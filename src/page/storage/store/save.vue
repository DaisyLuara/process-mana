<template>
  <div class="item-wrap-template">
    <div v-loading="setting.loading" :element-loading-text="setting.loadingText" class="pane">
      <div class="pane-title">{{storeID ? '修改仓库' : '新增仓库' }}</div>
      <el-form
        ref="storeForm"
        :model="storeForm"
        :rules="rules"
        label-position="left"
        label-width="130px"
      >
        <el-form-item label="仓库名称" prop="name">
          <el-input
            v-model="storeForm.name"
            placeholder="请输入仓库名称"
            clearable
            :maxlength="30"
            class="item-input"
          />
        </el-form-item>
        <el-form-item label="仓库地址" prop="address">
          <el-input
            v-model="storeForm.address"
            placeholder="请输入仓库地址"
            clearable
            :maxlength="100"
            class="item-input"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('storeForm')">保存</el-button>
          <el-button @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  historyBack,
  saveStore,
  modifyStore,
  getStoreDetails,
  Cookies
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
    return {
      searchLoading: false,
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      storeID: "",
      storeForm: {
        name: "",
        address: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入仓库名称", trigger: "submit" }
        ],
        address: [
          { required: true, message: "请输入仓库地址", trigger: "submit" }
        ]
      }
    };
  },
  created() {
    this.storeID = this.$route.params.uid;
    if (this.storeID) {
      this.setting.loading = true;
      this.getStoreDetails();
    }
  },
  methods: {
    getStoreDetails() {
      getStoreDetails(this, this.storeID)
        .then(res => {
          this.storeForm.name = res.name;
          this.storeForm.receipt_money = res.receipt_money;
          this.storeForm.receipt_date = res.receipt_date;
          this.setting.loading = false;
        })
        .catch(err => {
          this.$message({
            message: err.response.data.message,
            type: "success"
          });
          this.setting.loading = false;
        });
    },
    back() {
      historyBack();
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true;
          let args = this.storeForm;
          if (this.storeID) {
            modifyStore(this, this.storeID, args)
              .then(res => {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/storage/store"
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
            saveStore(this, args)
              .then(res => {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/storage/store"
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
