<template>
  <div class="item-wrap-template">
    <div v-loading="setting.loading" :element-loading-text="setting.loadingText" class="pane">
      <div class="pane-title">{{productID ? '修改产品' : '新增产品' }}</div>
      <el-form
        ref="productForm"
        :model="productForm"
        :rules="rules"
        label-position="left"
        label-width="130px"
      >
        <el-form-item label="SKU" prop="sku">
          <el-input
            v-model="productForm.sku"
            placeholder="请输入SKU"
            clearable
            :maxlength="100"
            class="item-input"
          />
        </el-form-item>
        <el-form-item label="产品名称" prop="name">
          <el-select v-model="productForm.name" placeholder="请选择产品名称" clearable>
            <el-option v-for="item in nameList" :key="item.id" :value="item.id" :label="item.name"/>
          </el-select>
        </el-form-item>
        <el-form-item label="产品颜色" prop="color">
          <el-select v-model="productForm.color" placeholder="请选择产品颜色" clearable>
            <el-option
              v-for="item in colorList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="supplier">
          <el-select v-model="productForm.supplier" placeholder="请选择供应商" clearable>
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('productForm')">保存</el-button>
          <el-button @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  historyBack,
  saveProduct,
  modifyProduct,
  getProductDetails,
  Cookies
} from "service";
import {
  Form,
  FormItem,
  Button,
  Input,
  MessageBox,
  Select,
  Option
} from "element-ui";

export default {
  components: {
    ElForm: Form,
    ElFormItem: FormItem,
    ElButton: Button,
    ElInput: Input,
    ElSelect: Select,
    ElOption: Option
  },
  data() {
    return {
      supplierList: [],
      nameList: [],
      colorList: [],
      searchLoading: false,
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      productID: "",
      productForm: {
        sku: "",
        name: "",
        color: "",
        supplier: ""
      },
      rules: {
        sku: [{ required: true, message: "请输入SKU", trigger: "submit" }],
        name: [
          { required: true, message: "请选择产品名称", trigger: "submit" }
        ],
        color: [
          { required: true, message: "请选择产品颜色", trigger: "submit" }
        ],
        supplier: [
          { required: true, message: "请选择供应商", trigger: "submit" }
        ]
      }
    };
  },
  created() {
    this.productID = this.$route.params.uid;
    if (this.productID) {
      this.setting.loading = true;
      this.getProductDetails();
    }
  },
  methods: {
    getProductDetails() {
      getProductDetails(this, this.productID)
        .then(res => {
          this.productForm.name = res.name;
          this.productForm.receipt_money = res.receipt_money;
          this.productForm.receipt_date = res.receipt_date;
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
          let args = this.productForm;
          if (this.productID) {
            modifyProduct(this, this.productID, args)
              .then(res => {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/storage/product"
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
            saveProduct(this, args)
              .then(res => {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/storage/product"
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
