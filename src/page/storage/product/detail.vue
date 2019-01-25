<template>
  <div class="item-wrap-template">
    <div v-loading="setting.loading" :element-loading-text="setting.loadingText" class="pane">
      <div class="pane-title">查看产品</div>
      <el-form ref="productForm" :model="productForm" label-position="left" label-width="130px">
        <el-form-item label="SKU" prop="sku">{{productForm.sku }}</el-form-item>
        <el-form-item label="产品名称" prop="name">{{productForm.name }}</el-form-item>
        <el-form-item label="产品颜色" prop="color">{{ productForm.color }}</el-form-item>
        <el-form-item label="供应商" prop="supplier">{{productForm.supplier_name}}</el-form-item>
        <el-form-item>
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
        supplier_name: ""
      }
    };
  },
  computed: {},
  created() {
    this.productID = this.$route.params.uid;
    if (this.productID) {
      this.getProductDetails();
    }
  },
  methods: {
    getProductDetails() {
      this.setting.loading = true;
      let args = {
        include: "attributes"
      };
      getProductDetails(this, this.productID, args)
        .then(res => {
          this.productForm.sku = res.sku;
          this.productForm.supplier_name = res.supplier_name;
          let attributes = res.attributes.data;
          attributes.map(r => {
            if (r.attributes_id === 1) {
              this.productForm.name = r.attributes_value;
            }
            if (r.attributes_id === 2) {
              this.productForm.color = r.attributes_value;
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
