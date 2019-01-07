<template>
  <div class="item-wrap-template">
    <div v-loading="setting.loading" :element-loading-text="setting.loadingText" class="pane">
      <div class="pane-title">{{recordsID ? '修改调拨记录' : '新增调拨记录' }}</div>
      <el-form
        ref="recordsForm"
        :model="recordsForm"
        :rules="rules"
        label-position="left"
        label-width="130px"
      >
        <el-form-item label="产品名称" prop="name">
          <el-select v-model="recordsForm.name" placeholder="请选择产品名称" clearable>
            <el-option
              v-for="item in productList"
              :value="item.id"
              :key="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产品颜色" prop="color">
          <el-select v-model="recordsForm.color" placeholder="请选择产品颜色" clearable>
            <el-option
              v-for="item in colorList"
              :value="item.id"
              :key="item.id"
              :label="item.name"
            />
          </el-select>
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
        <el-form-item label="调入库位" prop="into_location">
          <el-select v-model="recordsForm.into_location" placeholder="请选择调入库位" clearable>
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
          <el-button type="primary" @click="submit('recordsForm')">保存</el-button>
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
  Cookies
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
      productList: [],
      colorList: [],
      locationList: [],
      recordsID: "",
      recordsForm: {
        name: "",
        color: "",
        out_location: "",
        into_location: "",
        num: "",
        remark: ""
      },
      rules: {
        name: [
          { required: true, message: "请选择产品名称", trigger: "submit" }
        ],
        num: [
          { required: true, message: "请输入调整数量", trigger: "submit" },
          { validator: checkNumber, trigger: "submit" }
        ],
        color: [
          { required: true, message: "请选择产品颜色", trigger: "submit" }
        ],
        out_location: [
          { required: true, message: "请选择调出库位", trigger: "submit" }
        ],
        into_location: [
          { required: true, message: "请选择调入库位", trigger: "submit" }
        ]
      }
    };
  },
  created() {
    this.recordsID = this.$route.params.uid;
    if (this.recordsID) {
      this.setting.loading = true;
      this.getRecordsDetails();
    }
  },
  methods: {
    getRecordsDetails() {
      getRecordsDetails(this, this.recordsID)
        .then(res => {
          this.recordsForm.name = res.name;
          this.recordsForm.receipt_money = res.receipt_money;
          this.recordsForm.receipt_date = res.receipt_date;
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
          if (this.recordsID) {
            modifyRecords(this, this.recordsID, args)
              .then(res => {
                this.$message({
                  message: "修改成功",
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
          } else {
            saveRecords(this, args)
              .then(res => {
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
