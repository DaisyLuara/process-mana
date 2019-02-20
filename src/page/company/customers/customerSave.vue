<template>
  <div class="add-customer-wrap">
    <div v-loading="setting.loading" :element-loading-text="setting.loadingText">
      <div class="customer-title">{{ customerID ? '编辑公司' : '新增公司' }}</div>
      <el-form ref="customerForm" :model="customerForm" :rules="rules" label-width="100px">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="基础信息 Basic Information" name="1">
            <el-form-item label="公司名称" prop="name">
              <el-input v-model="customerForm.name" :maxlength="50" class="customer-form-input"/>
            </el-form-item>
            <el-form-item label="公司地址" prop="address">
              <el-input v-model="customerForm.address" :maxlength="60" class="customer-form-input"/>
            </el-form-item>
            <el-form-item label="公司属性" prop="category">
              <el-radio-group v-model="customerForm.category" @change="categoryHandle">
                <el-radio :label="0">客户</el-radio>
                <el-radio :label="1">供应商</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="公司详情" prop="description">
              <el-input
                type="textarea"
                v-model="customerForm.description"
                :maxlength="1000"
                class="customer-form-input"
              />
            </el-form-item>
            <el-form-item label="公司logo" prop="logo_media_id">
              <el-upload
                class="avatar-uploader"
                :action="SERVER_URL + '/api/media'"
                :data="{type: 'image'}"
                :headers="formHeader"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="logoUrl" :src="logoUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="公司简称" prop="internal_name">
              <el-input
                v-model="customerForm.internal_name"
                :maxlength="150"
                class="customer-form-input"
              />
            </el-form-item>
            <el-form-item v-if="contactFlag" label="所属BD" prop="bd_user_id">
              <el-select v-model="customerForm.bd_user_id" placeholder="请选择所属BD">
                <el-option
                  v-for="item in bdList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="statusFlag" label="状态" prop="selectedStatus">
              <el-select v-model="customerForm.selectedStatus" placeholder="请选择状态">
                <el-option
                  v-for="item in statusOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item v-if="!customerID&&contactFlag" title="联系人信息 Contacts" name="2">
            <div>
              <el-form-item label="联系人名称" prop="customer_name">
                <el-input
                  v-model="customerForm.customer_name"
                  :maxlength="50"
                  class="customer-form-input"
                />
              </el-form-item>
              <el-form-item label="联系人职务" prop="position">
                <el-input
                  v-model="customerForm.position"
                  :maxlength="50"
                  class="customer-form-input"
                />
              </el-form-item>
              <el-form-item label="手机号码" prop="phone">
                <el-input v-model="customerForm.phone" :maxlength="11" class="customer-form-input"/>
              </el-form-item>
              <el-form-item label="座机电话" prop="telephone">
                <el-input
                  v-model="customerForm.telephone"
                  :maxlength="20"
                  class="customer-form-input"
                />
                <div style="color: #999;font-size:14px;">座机电话格式如下:021-65463432、021-65463432-7898</div>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  v-model="customerForm.password"
                  :maxlength="30"
                  type="password"
                  class="customer-form-input"
                />
              </el-form-item>
              <el-form-item label="角色" prop="role_id">
                <el-radio-group v-model="customerForm.role_id">
                  <el-radio
                    v-for="role in allRoles"
                    :data="role"
                    :key="role.id"
                    :label="role.id"
                    class="role-radio"
                  >{{ role.display_name }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-collapse-item>
        </el-collapse>
        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            size="small"
            @click="onSubmit('customerForm')"
          >保存</el-button>
          <el-button size="small" @click="historyBack()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import auth from "service/auth";

import {
  historyBack,
  getSearchBDList,
  getCustomerDetail,
  saveCustomer,
  getSearchRole
} from "service";

import {
  Select,
  Option,
  Button,
  Input,
  Form,
  FormItem,
  RadioGroup,
  Radio,
  CollapseItem,
  Collapse,
  Upload
} from "element-ui";
const SERVER_URL = process.env.SERVER_URL;

export default {
  name: "AddCustomer",
  components: {
    "el-select": Select,
    "el-option": Option,
    "el-button": Button,
    "el-input": Input,
    "el-radio": Radio,
    "el-radio-group": RadioGroup,
    "el-form": Form,
    "el-form-item": FormItem,
    "el-radio-group": RadioGroup,
    "el-radio": Radio,
    "el-collapse-item": CollapseItem,
    "el-collapse": Collapse,
    "el-upload": Upload
  },
  data() {
    return {
      SERVER_URL: SERVER_URL,
      formHeader: {
        Authorization: "Bearer " + auth.getToken()
      },
      logoUrl: "",
      activeNames: ["1", "2"],
      setting: {
        isOpenSelectAll: true,
        loading: true,
        loadingText: "拼命加载中"
      },
      allRoles: [],
      contactFlag: true,
      customerForm: {
        bd_user_id: null,
        role_id: null,
        name: "",
        address: "",
        category: 0,
        description: "",
        internal_name: "",
        customer_name: "",
        phone: "",
        position: "",
        password: "",
        telephone: "",
        selectedStatus: "",
        logo_media_id: null
      },
      statusFlag: false,
      bdList: [],
      statusOption: [
        {
          value: 1,
          label: "待合作"
        },
        {
          value: 2,
          label: "合作中"
        },
        {
          value: 3,
          label: "已结束"
        }
      ],
      customerID: "",
      rules: {
        internal_name: [
          { message: "请输入公司简称", trigger: "submit", required: true }
        ],
        name: [
          { message: "请输入公司名称", trigger: "submit", required: true }
        ],
        role_id: [
          { message: "角色不能为空", trigger: "submit", required: true }
        ],
        category: [
          { message: "请选择公司属性", trigger: "submit", required: true }
        ],
        address: [
          { message: "请输入公司地址", trigger: "submit", required: true }
        ],
        description: [
          { message: "请输入公司详情", trigger: "submit", required: true }
        ],
        bd_user_id: [
          { message: "请选择所属BD", trigger: "submit", required: true }
        ],
        phone: [
          {
            validator: (rule, value, callback) => {
              if (/^\s*$/.test(value)) {
                callback("请输入手机号");
              } else if (!/^1[3456789]\d{9}$/.test(value)) {
                callback("手机格式不正确,请重新输入");
              } else {
                callback();
              }
            },
            trigger: "submit",
            required: true
          }
        ],
        telephone: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback();
                return;
              }
              if (!/^0\d{2,3}-\d{7,8}|0\d{2,3}-\d{7,8}-\d{1,4}$/.test(value)) {
                callback("座机电话格式不正确,请重新输入");
              } else {
                callback();
              }
            },
            trigger: "submit"
          }
        ],
        customer_name: [
          { message: "请输入联系人名称", trigger: "submit", required: true }
        ],
        position: [
          { message: "请输入联系人职务", trigger: "submit", required: true }
        ],
        password: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback("请输入密码");
                return;
              }
              if (value.length < 8) {
                callback("密码长度不能小于8位");
              } else {
                callback();
              }
            },
            trigger: "submit"
          }
        ]
      },
      loading: false
    };
  },
  created: function() {
    this.setting.loadingText = "拼命加载中";
    this.init();
    this.customerID = this.$route.params.uid;
    this.getSearchBDList();
    if (this.customerID) {
      this.getCustomerDetail();
    } else {
      this.statusFlag = false;
      this.setting.loading = false;
    }
  },
  methods: {
    async init() {
      try {
        await this.getSearchRole();
      } catch (e) {
        console.log(e);
      }
    },
    handleAvatarSuccess(res, file) {
      this.customerForm.logo_media_id = res.id;
      this.logoUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    getSearchRole() {
      let args = {
        guard_name: "shop"
      };
      getSearchRole(this, args)
        .then(res => {
          this.allRoles = res.data;
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.response.data.message
          });
        });
    },
    categoryHandle(val) {
      if (val === 1) {
        this.contactFlag = false;
      } else {
        this.contactFlag = true;
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true;
          let args = {
            name: this.customerForm.name,
            address: this.customerForm.address,
            description: this.customerForm.description,
            logo_media_id: this.customerForm.logo_media_id,
            category: this.customerForm.category,
            internal_name: this.customerForm.internal_name,
            bd_user_id: this.customerForm.bd_user_id
          };
          if (this.customerID || !this.contactFlag) {
            args.status = this[formName].selectedStatus;
          } else {
            args.role_id = this.customerForm.role_id;
            args.customer_name = this.customerForm.customer_name;
            args.phone = this.customerForm.phone;
            args.telephone = this.customerForm.telephone;
            args.position = this.customerForm.position;
            args.password = this.customerForm.password;
          }
          if (!this.customerForm.telephone) {
            delete args.telephone;
          }
          saveCustomer(this, args, this.customerID)
            .then(result => {
              this.setting.loading = false;
              this.$message({
                message: this.customerID ? "修改成功" : "添加成功",
                type: "success"
              });
              // todo是否返回用户列表
              this.$router.push({
                path: "/company/customers"
              });
            })
            .catch(error => {
              this.setting.loading = false;
              this.$message({
                message: error.response.message.data,
                type: "error"
              });
            });
        } else {
          return;
        }
      });
    },
    getSearchBDList() {
      getSearchBDList(this)
        .then(res => {
          this.bdList = res;
        })
        .catch(err => {
          this.$message({
            type: "warning",
            message: err.response.data.message
          });
        });
    },
    getCustomerDetail() {
      this.setting.loading = true;
      if (this.customerID) {
        this.rules.customer_name[0].required = false;
        this.rules.phone[0].required = false;
        this.rules.position[0].required = false;
        this.rules.password[0].required = false;
        let args = {
          include: "customers,bdUser,media,roles"
        };
        getCustomerDetail(this, this.customerID, args)
          .then(result => {
            this.statusFlag = true;
            this.customerForm.name = result.name;
            this.customerForm.address = result.address;
            this.customerForm.category = result.category;
            this.customerForm.description = result.description;
            this.customerForm.selectedStatus = result.status;
            if (result.media) {
              this.customerForm.logo_media_id = result.media.id;
              this.logoUrl = result.media.url;
            }
            if (result.roles) {
              if (result.roles.data.length > 0) {
                this.customerForm.role_id = result.roles.data[0].id;
              }
            }
            this.customerForm.internal_name = result.internal_name;
            this.customerForm.bd_user_id = result.bdUser
              ? result.bdUser.id
              : null;
            this.setting.loading = false;
          })
          .catch(err => {
            console.log(err);
            this.setting.loading = false;
          });
      } else {
        this.statusFlag = false;
        this.setting.loading = false;
      }
    },
    historyBack() {
      historyBack();
    }
  }
};
</script>
<style scoped lang="less">
.add-customer-wrap {
  background: #fff;
  padding: 30px;
  .customer-form-input {
    width: 385px;
  }
  .up-area-cover {
    border: 1px dashed #d9d9d9;
    width: 228px;
    height: 228px;
    cursor: pointer;
    position: relative;
    .cover {
      width: 228px;
      height: 228px;
      display: block;
    }
    .cover-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 228px;
      height: 228px;
      line-height: 228px;
      text-align: center;
    }
    .delete-icon-image {
      position: absolute;
      top: 5px;
      right: 5px;
      font-size: 20px;
      color: #83909a;
      cursor: pointer;
    }
  }
  .customer-title {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .avatar-uploader {
    width: 178px;
    height: 178px;
    line-height: 178px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
  }
  .avatar-uploader .el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-checkbox {
    margin-left: 0px;
    margin-right: 15px;
  }
}
</style>
