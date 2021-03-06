<template>
  <div class="add-customer-wrap">
    <div 
      v-loading="setting.loading" 
      :element-loading-text="setting.loadingText">
      <div class="customer-title">{{ $route.name }}</div>
      <el-form 
        ref="contactForm" 
        :model="contactForm" 
        :rules="rules" 
        label-width="100px">
        <el-form-item 
          label="联系人名称" 
          prop="contact.name">
          <el-input 
            v-model="contactForm.contact.name" 
            :maxlength="50" 
            class="customer-form-input"/>
        </el-form-item>
        <el-form-item 
          label="联系人职务" 
          prop="contact.position">
          <el-input
            v-model="contactForm.contact.position"
            :maxlength="50"
            class="customer-form-input"
          />
        </el-form-item>
        <el-form-item 
          label="手机号码" 
          prop="contact.phone">
          <el-input
            v-model="contactForm.contact.phone"
            :maxlength="11"
            class="customer-form-input"
          />
        </el-form-item>
        <el-form-item 
          label="座机电话" 
          prop="contact.telephone">
          <el-input
            v-model="contactForm.contact.telephone"
            :maxlength="20"
            class="customer-form-input"
          />
          <div style="color: #999;font-size:14px;">座机电话格式如下:021-65463432、021-65463432-7898</div>
        </el-form-item>
        <el-form-item 
          label="密码" 
          prop="contact.password">
          <el-input
            v-model="contactForm.contact.password"
            :maxlength="30"
            type="password"
            class="customer-form-input"
          />
        </el-form-item>
        <el-form-item 
          label="角色" 
          prop="role_id">
          <el-radio-group v-model="contactForm.role_id">
            <el-radio
              v-for="role in allRoles"
              :key="role.id"
              :label="role.id"
              class="role-radio"
            >{{ role.display_name }} </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            type="primary"
            size="small"
            @click="onSubmit('contactForm')"
          >保存</el-button>
          <el-button 
            size="small" 
            @click="resetForm('contactForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  historyBack,
  getContactDetail,
  saveContact,
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
  Radio
} from "element-ui";

export default {
  name: "AddContact",
  components: {
    "el-select": Select,
    "el-option": Option,
    "el-button": Button,
    "el-input": Input,
    "el-form": Form,
    "el-form-item": FormItem,
    "el-radio-group": RadioGroup,
    "el-radio": Radio
  },
  data() {
    return {
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: "拼命加载中"
      },
      allRoles: [],
      contactForm: {
        role_id: null,
        contact: {
          name: "",
          phone: "",
          position: "",
          password: "",
          telephone: ""
        }
      },
      pid: "",
      contactID: "",
      rules: {
        "contact.phone": [
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
        "contact.telephone": [
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
        "contact.name": [
          { message: "请输入联系人名称", trigger: "submit", required: true }
        ],
        "role_id": [
          { message: "请选择角色", trigger: "submit", required: true }
        ],
        "contact.position": [
          { message: "请输入联系人职务", trigger: "submit", required: true }
        ],
        "contact.password": [
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
      contactName: "",
      loading: false
    };
  },
  created() {
    this.contactID = this.$route.query.uid;
    this.pid = this.$route.query.pid;
    this.contactName = this.$route.query.name;
    this.getSearchRole();
    if (this.contactID) {
      this.getContactDetail();
    }
    this.setting.loadingText = "拼命加载中";
  },
  methods: {
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
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true;
          let pid = this.pid;
          let name = this.contactName;
          let uid = this.$route.query.uid;
          let args = {
            name: this.contactForm.contact.name,
            phone: this.contactForm.contact.phone,
            position: this.contactForm.contact.position,
            password: this.contactForm.contact.password,
            telephone: this.contactForm.contact.telephone,
            role_id: this.contactForm.role_id
          };
          if (this.contactForm.contact.password === "") {
            delete args.password;
          }
          if (!this.contactForm.contact.telephone) {
            delete args.telephone;
          }
          saveContact(this, pid, args, uid)
            .then(result => {
              this.setting.loading = false;
              this.$message({
                message: uid ? "修改成功" : "添加成功",
                type: "success"
              });
              this.$router.push({
                path: "/company/customers/contacts?id=" + pid + "&name=" + name
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
    getContactDetail() {
      let uid = this.$route.query.uid;
      if (uid) {
        this.setting.loading = true;
        let args = {
          include: "roles"
        };
        getContactDetail(this, this.pid, uid, args)
          .then(result => {
            this.contactForm.contact = result;
            if (result.roles) {
              if (result.roles.data.length > 0) {
                this.contactForm.role_id = result.roles.data[0].id;
              }
            }
            this.setting.loading = false;
          })
          .catch(err => {
            this.setting.loading = false;
            this.$message({
              message: err.response.message.data,
              type: "error"
            });
          });
      }
    },
    resetForm(formName) {
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
    margin-bottom: 20px;
  }
  .el-checkbox {
    margin-left: 0px;
    margin-right: 15px;
  }
}
</style>
