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
          <el-select
            v-model="productForm.name"
            :loading="searchLoading"
            placeholder="请选择产品名称"
            clearable
          >
            <el-option
              v-for="item in nameList"
              :key="item.id"
              :value="item.attribute_id+ ',' +item.value"
              :label="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产品颜色" prop="color">
          <el-select
            v-model="productForm.color"
            :loading="searchLoading"
            placeholder="请选择产品颜色"
            clearable
          >
            <el-option
              v-for="item in colorList"
              :key="item.id"
              :value="item.attribute_id + ',' + item.value"
              :label="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="supplier">
          <el-select
            v-model="productForm.supplier"
            :loading="searchLoading"
            placeholder="请选择供应商"
            clearable
          >
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
  getAttributeList,
  getSearchSupplier,
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
    this.init();
    if (this.productID) {
      this.getProductDetails();
    }
  },
  methods: {
    async init() {
      try {
        await this.getAttributeList();
        await this.getSearchSupplier();
      } catch (e) {
        console.log(e);
      }
    },
    getAttributeList() {
      this.searchLoading = true;
      getAttributeList(this)
        .then(res => {
          res.data.map(r => {
            if (r.name === "name") {
              this.nameList = r.value;
            }
            if (r.name === "color") {
              this.colorList = r.value;
            }
          });
          this.searchLoading = false;
        })
        .catch(err => {
          this.searchLoading = false;
          this.$message({
            message: err.response.data.message,
            type: "success"
          });
        });
    },
    getSearchSupplier() {
      this.searchLoading = true;
      getSearchSupplier(this)
        .then(res => {
          this.supplierList = res.data;
          this.searchLoading = false;
        })
        .catch(err => {
          this.searchLoading = false;
          this.$message({
            message: err.response.data.message,
            type: "success"
          });
        });
    },
    getProductDetails() {
      this.setting.loading = true;
      let args = {
        include: "attributes"
      };
      getProductDetails(this, this.productID, args)
        .then(res => {
          this.productForm.sku = res.sku;
          this.productForm.supplier = res.supplier;
          let attributes = res.attributes.data;
          attributes.map(r => {
            if (r.attributes_id === 1) {
              this.productForm.name =
                r.attributes_id + "," + r.attributes_value;
            }
            if (r.attributes_id === 2) {
              this.productForm.color =
                r.attributes_id + "," + r.attributes_value;
            }
          });
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
          let attribute = [];
          attribute.push({
            attributes_id: this.productForm.name.split(",")[0],
            attributes_value: this.productForm.name.split(",")[1]
          });
          attribute.push({
            attributes_id: this.productForm.color.split(",")[0],
            attributes_value: this.productForm.color.split(",")[1]
          });
          let args = {
            sku: this.productForm.sku,
            supplier: this.productForm.supplier,
            attribute: attribute
          };
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
