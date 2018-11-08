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
          label="商户名称" 
          prop="customer.name">
          <el-input 
            v-model="customerForm.customer.name" 
            :maxlength="50"
            class="customer-form-input"/>
        </el-form-item>
        <el-form-item 
          label="商户地址" 
          prop="customer.address">
          <el-input 
            v-model="customerForm.customer.address" 
            :maxlength="60"
            class="customer-form-input" />
        </el-form-item>
        <el-form-item 
          label="商户详情" 
          prop="customer.description">
          <el-input 
            type="textarea"
            v-model="customerForm.customer.description" 
            :maxlength="1000"
            class="customer-form-input" />
        </el-form-item>
        <el-form-item 
          label="商户logo" 
          prop="customer.logo">
          <el-input 
            v-model="customerForm.customer.logo" 
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
        customer: {
          name: '',
          address: '',
          description: '',
          logo: ''
        },
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
        'customer.name': [
          { message: '请输入商户名称', trigger: 'blur', required: true }
        ],
        'customer.address': [
          { message: '请输入商户地址', trigger: 'blur', required: true }
        ],
        'customer.description': [
          { message: '请输入商户详情', trigger: 'blur', required: true }
        ]
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
            name: this.customerForm.customer.name,
            address: this.customerForm.customer.address,
            description: this.customerForm.customer.description,
            logo: this.customerForm.customer.logo
          }
          if (this.customerID) {
            this[formName].customer.status = this[formName].selectedStatus
          }
          if (this.customerForm.customer.logo === '') {
            delete args.logo
          }
          company
            .saveCustomer(this, this[formName].customer, this.customerID)
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
      if (this.customerID) {
        company
          .getCustomerDetial(this, this.customerID)
          .then(result => {
            this.statusFlag = true
            this.customerForm.customer.name = result.name
            this.customerForm.customer.address = result.address
            this.customerForm.customer.description = result.description
            this.customerForm.selectedStatus = result.status
            this.customerForm.customer.logo = result.logo
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
