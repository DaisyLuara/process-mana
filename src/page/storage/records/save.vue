<template>
  <div class="item-wrap-template">
    <div v-loading="setting.loading" :element-loading-text="setting.loadingText" class="pane">
      <div class="pane-title">{{recordsID ? '调拨记录详情' : '新增调拨记录' }}</div>
      <el-form
        ref="recordsForm"
        :model="recordsForm"
        :rules="rules"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="SKU" prop="product_id">
          <el-select
            v-model="recordsForm.product_id"
            placeholder="请选择SKU"
            clearable
            :loading="searchLoading"
            @change="skuHandle"
          >
            <el-option v-for="item in skuList" :key="item.id" :value="item.id" :label="item.sku"/>
          </el-select>
        </el-form-item>
        <el-form-item label="产品名称" prop="name">
          <el-input
            :disabled="true"
            v-model="recordsForm.name"
            placeholder="请输入产品名称"
            clearable
            :maxlength="30"
            class="item-input"
          />
        </el-form-item>
        <el-form-item label="产品颜色" prop="color">
          <el-input
            :disabled="true"
            v-model="recordsForm.color"
            placeholder="请输入产品颜色"
            clearable
            :maxlength="30"
            class="item-input"
          />
        </el-form-item>
        <el-form-item label="供应商" prop="supplier">
          <el-input
            :disabled="true"
            v-model="recordsForm.supplier"
            placeholder="请输入供应商"
            clearable
            :maxlength="30"
            class="item-input"
          />
        </el-form-item>
        <el-form-item label="调出库位" prop="out_location">
          <el-select v-model="recordsForm.out_location" placeholder="请选择调出库位" clearable>
            <el-option
              v-for="item in locationList"
              :value="item.id"
              :key="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="调入库位" prop="in_location">
          <el-select v-model="recordsForm.in_location" placeholder="请选择调入库位" clearable>
            <el-option
              v-for="item in locationList"
              :value="item.id"
              :key="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="调整数量" prop="num">
          <el-input
            v-model="recordsForm.num"
            placeholder="请输入调整数量"
            clearable
            :maxlength="30"
            class="item-input"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="recordsForm.remark"
            placeholder="请填写备注"
            type="textarea"
            :maxlength="1000"
            class="item-input"
          />
        </el-form-item>
        <el-form-item>
          <el-button v-if="!recordsID" type="primary" @click="submit('recordsForm')">保存</el-button>
          <el-button @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  historyBack,
  saveRecords,
  modifyRecords,
  getRecordsDetails,
  getSearchSku,
  getAttributeBySku,
  getSearchLocation
} from "service";
import {
  Form,
  FormItem,
  Button,
  Input,
  MessageBox,
  Option,
  Select
} from "element-ui";

export default {
  components: {
    ElSelect: Select,
    ElOption: Option,
    ElForm: Form,
    ElFormItem: FormItem,
    ElButton: Button,
    ElInput: Input
  },
  data() {
    let checkNumber = (rule, value, callback) => {
      if (!/^\d+$/.test(value)) {
        callback(new Error("必须是大于或等于0的整数"));
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
      skuList: [],
      locationList: [],
      recordsID: null,
      recordsForm: {
        supplier: "",
        product_id: "",
        name: "",
        color: "",
        out_location: "",
        in_location: "",
        num: "",
        remark: ""
      },
      rules: {
        product_id: [
          { required: true, message: "请选择SKU", trigger: "submit" }
        ],
        name: [
          { required: true, message: "请输入产品名称", trigger: "submit" }
        ],
        supplier: [
          { required: true, message: "请输入供应商", trigger: "submit" }
        ],
        num: [
          { required: true, message: "请输入调整数量", trigger: "submit" },
          { validator: checkNumber, trigger: "submit" }
        ],
        color: [
          { required: true, message: "请输入产品颜色", trigger: "submit" }
        ],
        out_location: [
          { required: true, message: "请选择调出库位", trigger: "submit" }
        ],
        in_location: [
          { required: true, message: "请选择调入库位", trigger: "submit" }
        ]
      }
    };
  },
  created() {
    this.recordsID = this.$route.params.uid;
    this.getSearchSku();
    this.getSearchLocation();
    if (this.recordsID) {
      this.setting.loading = true;
      this.getRecordsDetails();
    }
  },
  methods: {
    skuHandle(val) {
      this.getAttributeBySku(val);
    },
    getAttributeBySku(value) {
      let args = {
        id: value
      };
      getAttributeBySku(this, args)
        .then(res => {
          this.recordsForm.name = res.name.attributes_value;
          this.recordsForm.color = res.color.attributes_value;
          this.recordsForm.supplier = res.supplier[0].name;
        })
        .catch(err => {
          this.$message({
            message: err.response.data.message,
            type: "success"
          });
        });
    },
    getSearchLocation() {
      this.searchLoading = true;
      getSearchLocation(this)
        .then(res => {
          this.locationList = res;
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
    getSearchSku() {
      this.searchLoading = true;
      getSearchSku(this)
        .then(res => {
          this.skuList = res;
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
    getRecordsDetails() {
      getRecordsDetails(this, this.recordsID)
        .then(res => {
          this.recordsForm.product_id = res.product_id;
          this.getAttributeBySku(this.recordsForm.product_id);
          this.recordsForm.out_location = res.out_location;
          this.recordsForm.in_location = res.in_location;
          this.recordsForm.num = res.num;
          this.recordsForm.remark = res.remark;
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
          let args = this.recordsForm;
          saveRecords(this, args)
            .then(res => {
              if (res.error_code && res.error_code === "110") {
                this.$message({
                  message: "库存不足",
                  type: "warning"
                });
                this.setting.loading = false;
                return;
              }
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.$router.push({
                path: "/storage/records"
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
