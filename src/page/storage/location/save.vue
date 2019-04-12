<template>
  <div class="item-wrap-template">
    <div 
      v-loading="setting.loading" 
      :element-loading-text="setting.loadingText" 
      class="pane">
      <div class="pane-title">{{ locationID ? '修改库位' : '新增库位' }}</div>
      <el-form
        ref="locationForm"
        :model="locationForm"
        :rules="rules"
        label-position="left"
        label-width="100px"
      >
        <el-form-item 
          label="库位名称" 
          prop="name">
          <el-input
            v-model="locationForm.name"
            :maxlength="30"
            placeholder="请输入库位名称"
            clearable
            class="item-input"
          />
        </el-form-item>
        <el-form-item 
          label="所属仓库" 
          prop="warehouse_id">
          <el-select 
            v-model="locationForm.warehouse_id" 
            placeholder="请选择所属仓库" 
            clearable>
            <el-option
              v-for="item in storageList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            @click="submit('locationForm')">保存</el-button>
          <el-button @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  historyBack,
  saveLocation,
  getSearchStorageList,
  modifyLocation,
  getLocationDetails
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
      locationID: "",
      storageList: [],
      locationForm: {
        name: "",
        warehouse_id: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入库位名称", trigger: "submit" }
        ],
        warehouse_id: [
          { required: true, message: "请选择所属仓库", trigger: "submit" }
        ]
      }
    };
  },
  created() {
    this.locationID = this.$route.params.uid;
    this.getSearchStorageList();
    if (this.locationID) {
      this.setting.loading = true;
      this.getLocationDetails();
    }
  },
  methods: {
    getSearchStorageList() {
      this.searchLoading = true;
      getSearchStorageList(this)
        .then(res => {
          this.storageList = res;
        })
        .catch(err => {
          this.searchLoading = false;
          this.$message({
            message: err.response.data.message,
            type: "success"
          });
        });
    },
    getLocationDetails() {
      getLocationDetails(this, this.locationID)
        .then(res => {
          this.locationForm.name = res.name;
          this.locationForm.warehouse_id = res.warehouse_id;
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
          let args = this.locationForm;
          if (this.locationID) {
            modifyLocation(this, this.locationID, args)
              .then(res => {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/storage/location"
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
            saveLocation(this, args)
              .then(res => {
                this.$message({
                  message: "提交成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/storage/location"
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
