<template>
  <div 
    class="add-customer-wrap">
    <div 
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText"
    >
      <div 
        class="customer-title">
        {{ $route.name }}
      </div>
      <el-form 
        ref="customerForm" 
        :model="customerForm" 
        :rules="rules" 
        label-width="100px">
        <el-form-item 
          label="公司名称" 
          prop="name">
          <el-input 
            v-model="customerForm.name" 
            :maxlength="50"
            class="customer-form-input"/>
        </el-form-item>
        <el-form-item 
          label="公司地址" 
          prop="address">
          <el-input 
            v-model="customerForm.address" 
            :maxlength="60"
            class="customer-form-input" />
        </el-form-item>
        <el-form-item 
          label="公司详情" 
          prop="description">
          <el-input 
            type="textarea"
            v-model="customerForm.description" 
            :maxlength="1000"
            class="customer-form-input" />
        </el-form-item>
        <el-form-item 
          label="公司logo" 
          prop="logo">
          <el-input 
            v-model="customerForm.logo" 
            :maxlength="150"
            class="customer-form-input" />
        </el-form-item>
        <el-form-item 
          label="内部名称" 
          prop="internal_name">
          <el-input 
            v-model="customerForm.internal_name" 
            :maxlength="150"
            class="customer-form-input" />
        </el-form-item>
        <el-form-item 
          v-if="statusFlag"
          label="状态" 
          prop="selectedStatus">
          <el-select 
            v-model="customerForm.selectedStatus" 
            placeholder="请选择状态">
            <el-option
              v-for="item in statusOption"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <div v-if="!customerID">
          <el-form-item 
          label="联系人名称" 
          prop="customer_name">
          <el-input 
            v-model="customerForm.customer_name" 
            :maxlength="50"
            class="customer-form-input"/>
        </el-form-item>
        <el-form-item 
          label="联系人职务" 
          prop="position">
          <el-input 
            v-model="customerForm.position" 
            :maxlength="50"
            class="customer-form-input"/>
        </el-form-item>
        <el-form-item 
          label="手机号码" 
          prop="phone">
          <el-input 
            v-model="customerForm.phone" 
            :maxlength="11"
            class="customer-form-input"/>
        </el-form-item>
        <el-form-item 
          label="座机电话" 
          prop="telephone">
          <el-input 
            v-model="customerForm.telephone" 
            :maxlength="20"
            class="customer-form-input"/>
            <div style="color: #999;font-size:14px;">座机电话格式如下:021-65463432、021-65463432-7898</div>
        </el-form-item>
        <el-form-item 
          label="密码" 
          prop="password">
          <el-input 
            v-model="customerForm.password" 
            :maxlength="30"
            type="password"
            class="customer-form-input"/>
        </el-form-item>
        </div>
        
        <el-form-item>
          <el-button 
            :loading="loading"  
            type="primary"
            size="small" 
            @click="onSubmit('customerForm')">保存</el-button>
          <el-button 
            size="small" 
            @click="historyBack()">取消</el-button>
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
  name: 'AddCustomer',
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
        loading: true,
        loadingText: '拼命加载中'
      },
      customerForm: {
        name: '',
        address: '',
        description: '',
        internal_name: '',
        logo: '',
        customer_name: '',
        phone: '',
        position: '',
        password: '',
        telephone: '',
        selectedStatus: ''
      },
      statusFlag: false,
      statusOption: [
        {
          value: 1,
          label: '待合作'
        },
        {
          value: 2,
          label: '合作中'
        },
        {
          value: 3,
          label: '已结束'
        }
      ],
      customerID: '',
      rules: {
        name: [{ message: '请输入公司名称', trigger: 'blur', required: true }],
        address: [
          { message: '请输入公司地址', trigger: 'blur', required: true }
        ],
        description: [
          { message: '请输入公司详情', trigger: 'blur', required: true }
        ],
        phone: [
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
        telephone: [
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
        customer_name: [
          { message: '请输入联系人名称', trigger: 'blur', required: true }
        ],
        position: [
          { message: '请输入联系人职务', trigger: 'blur', required: true }
        ],
        password: [{ message: '请输入密码', trigger: 'submit', required: true }]
      },
      loading: false
    }
  },
  created: function() {
    this.setting.loadingText = '拼命加载中'
    this.customerID = this.$route.params.uid
    this.getCustomerDetial()
    this.setting.loading = false
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true
          let args = {
            name: this.customerForm.name,
            address: this.customerForm.address,
            description: this.customerForm.description,
            logo: this.customerForm.logo,
            internal_name: this.customerForm.internal_name
          }
          if (this.customerID) {
            this[formName].status = this[formName].selectedStatus
          } else {
            args.customer_name = this.customerForm.customer_name
            args.phone = this.customerForm.phone
            args.telephone = this.customerForm.telephone
            args.position = this.customerForm.position
            args.password = this.customerForm.password
          }
          // if (this.customerForm.logo === '') {
          //   delete args.logo
          // }
          company
            .saveCustomer(this, args, this.customerID)
            .then(result => {
              this.setting.loading = false
              this.$message({
                message: this.customerID ? '修改成功' : '添加成功',
                type: 'success'
              })
              // todo是否返回用户列表
              this.$router.push({
                path: '/company/customers'
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
    getCustomerDetial() {
      this.setting.loading = true
      if (this.customerID) {
        this.rules.customer_name[0].required = false
        this.rules.phone[0].required = false
        this.rules.position[0].required = false
        this.rules.password[0].required = false
        company
          .getCustomerDetial(this, this.customerID)
          .then(result => {
            this.statusFlag = true
            this.customerForm.name = result.name
            this.customerForm.address = result.address
            this.customerForm.description = result.description
            this.customerForm.selectedStatus = result.status
            this.customerForm.logo = result.logo
            this.customerForm.internal_name = result.internal_name
            this.setting.loading = false
          })
          .catch(err => {
            console.log(err)
            this.setting.loading = false
          })
      } else {
        this.statusFlag = false
      }
    },
    resetForm(formName) {},
    historyBack() {
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
