<template>
  <div 
    class="add-customer-wrap">
    <div 
      class="topbar">
      <el-breadcrumb 
        separator="/">
        <el-breadcrumb-item 
          :to="{ path: '/company/customers/contacts?id=' + pid +'&name=' + contactName }">联系人管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ contactID ? '修改' : '添加' }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div
      v-loading="setting.loading" 
      :element-loading-text="setting.loadingText">
      <div 
        class="customer-title">
        {{ $route.name }}
      </div>
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
            class="customer-form-input"/>
        </el-form-item>
        <el-form-item 
          label="手机号码" 
          prop="contact.phone">
          <el-input 
            v-model="contactForm.contact.phone" 
            :maxlength="11"
            class="customer-form-input"/>
        </el-form-item>
        <el-form-item 
          label="座机电话" 
          prop="contact.telephone">
          <el-input 
            v-model="contactForm.contact.telephone" 
            :maxlength="20"
            class="customer-form-input"/>
            <div style="color: #999;font-size:14px;">座机电话格式如下:021-65463432、021-65463432-7898</div>
        </el-form-item>
        <el-form-item 
          label="密码" 
          prop="contact.password">
          <el-input 
            v-model="contactForm.contact.password" 
            :maxlength="30"
            type="password"
            class="customer-form-input"/>
        </el-form-item>
        <el-form-item>
          <el-button 
            :loading="loading"  
            type="primary"
            size="small"
            @click="onSubmit('contactForm')">保存</el-button>
          <el-button 
            size="small"
            @click="resetForm('contactForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import company from 'service/company'
import { historyBack } from 'service'
import { Select, Option, Button, Input, Form, FormItem } from 'element-ui'

export default {
  name: 'AddContact',
  components: {
    'el-select': Select,
    'el-option': Option,
    'el-button': Button,
    'el-input': Input,
    'el-form': Form,
    'el-form-item': FormItem
  },
  data() {
    return {
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: '拼命加载中'
      },
      contactForm: {
        contact: {
          name: '',
          phone: '',
          position: '',
          password: '',
          telephone: ''
        }
      },
      pid: '',
      contactID: '',
      rules: {
        'contact.phone': [
          {
            validator: (rule, value, callback) => {
              if (/^\s*$/.test(value)) {
                callback('请输入手机号')
              } else if (!/^1[3456789]\d{9}$/.test(value)) {
                callback('手机格式不正确,请重新输入')
              } else {
                callback()
              }
            },
            trigger: 'blur',
            required: true
          }
        ],
        'contact.telephone': [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback()
                return
              }
              if (!/^0\d{2,3}-\d{7,8}|0\d{2,3}-\d{7,8}-\d{1,4}$/.test(value)) {
                callback('座机电话格式不正确,请重新输入')
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        'contact.name': [
          { message: '请输入联系人名称', trigger: 'blur', required: true }
        ],
        'contact.position': [
          { message: '请输入联系人职务', trigger: 'blur', required: true }
        ]
      },
      contactName: '',
      loading: false
    }
  },
  created: function() {
    if (this.setting.loading == true) {
      return false
    }
    this.contactID = this.$route.query.uid
    this.pid = this.$route.query.pid
    this.contactName = this.$route.query.name
    this.getContactDetial()
    this.setting.loadingText = '拼命加载中'
    this.setting.loading = false
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true
          let pid = this.pid
          let name = this.contactName
          let uid = this.$route.query.uid
          let args = {
            name: this.contactForm.contact.name,
            phone: this.contactForm.contact.phone,
            position: this.contactForm.contact.position,
            password: this.contactForm.contact.password,
            telephone: this.contactForm.contact.telephone
          }
          if (this.contactForm.contact.password === '') {
            delete args.password
          }
          if (this.contactForm.contact.telephone === '') {
            delete args.telephone
          }
          company
            .saveContact(this, pid, args, uid)
            .then(result => {
              this.setting.loading = false
              this.$message({
                message: uid ? '修改成功' : '添加成功',
                type: 'success'
              })
              this.$router.push({
                path: '/company/customers/contacts?id=' + pid + '&name=' + name
              })
            })
            .catch(error => {
              this.setting.loading = false
              this.$message({
                message: error.response.message.data,
                type: 'error'
              })
            })
        } else {
          return
        }
      })
    },
    getContactDetial() {
      let uid = this.$route.query.uid
      if (uid) {
        company
          .getContactDetial(this, this.pid, uid)
          .then(result => {
            this.contactForm.contact = result
            this.setting.loading = false
          })
          .catch(err => {
            this.setting.loading = false
            this.$message({
              message: error.response.message.data,
              type: 'error'
            })
          })
      }
    },
    resetForm(formName) {
      historyBack()
    }
  }
}
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
