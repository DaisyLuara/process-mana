<template>
  <div 
    class="item-wrap-template">
    <div 
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText" 
      class="pane">
      <div 
        class="pane-title">
        {{ invoiceCompanyID ? '修改开票公司' : '新增开票公司' }}
      </div>
      <el-form
        ref="invoiceCompanyForm"
        :model="invoiceCompanyForm"
        :rules="rules"
        label-position="left"
        label-width="130px">
        <el-form-item 
          label="开票公司" 
          prop="name" >
          <el-input 
            v-model="invoiceCompanyForm.name" 
            :maxlength="50"
            class="item-input"/>
        </el-form-item>
        <el-form-item 
          label="地址" 
          prop="address" >
          <el-input 
            v-model="invoiceCompanyForm.address"
            :maxlength="50"
            class="item-input"/>
        </el-form-item>
        <el-form-item 
          label="纳税人识别号" 
          prop="taxpayer_num" >
          <el-input 
            v-model="invoiceCompanyForm.taxpayer_num" 
            :maxlength="50"
            class="item-input"/>
        </el-form-item>
        <el-form-item 
          label="手机号" 
          prop="phone" >
          <el-input 
            v-model="invoiceCompanyForm.phone" 
            :maxlength="11"
            class="item-input"/>
        </el-form-item>
        <el-form-item 
          label="座机电话" 
          prop="telephone">
          <el-input 
            v-model="invoiceCompanyForm.telephone" 
            :maxlength="20"
            class="item-input"/>
          <div style="color: #999;font-size:12px;">座机电话格式如下:021-65463432、021-65463432-7898</div>
        </el-form-item>
        <el-form-item 
          label="开户银行" 
          prop="account_bank" >
          <el-input 
            v-model="invoiceCompanyForm.account_bank"
            :maxlength="50"
            class="item-input"/>
        </el-form-item>
        <el-form-item 
          label="开户行账号" 
          prop="account_number" >
          <el-input 
            v-model="invoiceCompanyForm.account_number"
            :maxlength="20"
            class="item-input"/>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary"
            @click="submit('invoiceCompanyForm')">保存</el-button>
          <el-button 
            @click="back" >返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  historyBack,
  checkMobile,
  modifyInvoiceCompany,
  saveInvoiceCompany,
  invoiceCompanyDetail,
  Cookies
} from 'service'
import {
  Form,
  FormItem,
  Button,
  Input,
  MessageBox,
} from 'element-ui'

export default {
  components: {
    ElForm: Form,
    ElFormItem: FormItem,
    ElButton: Button,
    ElInput: Input,
  },
  data() {
    let checkNumber = (rule, value, callback) => {
      if (!/^\d*$/.test(value)) {
        callback(new Error('必须是数字'))
      } else {
        callback()
      }
    }
    let checkPhone = (rule, value, callback) => {
      if (!value) {
        callback()
        return
      }
      if (!checkMobile(value)) {
        callback(new Error('手机号格式不正确'))
      } else {
        callback()
      }
    }
    return {
      searchLoading: false,
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: '拼命加载中'
      },
      invoiceCompanyID: '',
      invoiceCompanyForm: {
        phone: null,
        account_bank: '',
        address: '',
        taxpayer_num: '',
        account_number: '',
        name: '',
        telephone: ''
      },
      rules: {
        account_number: [
          { required: true, message: '请输入开户行账号', trigger: 'submit' },
          { validator: checkNumber, trigger: 'submit' }
        ],
        name: [
          { required: true, message: '请输入开票名称', trigger: 'submit' }
        ],
        phone: [
          { message: '请输入手机号', trigger: 'submit' },
          { validator: checkPhone, trigger: 'submit' }
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
            trigger: 'submit'
          }
        ],
        taxpayer_num: [
          { required: true, message: '请输入纳税人识别号', trigger: 'submit' }
        ],
        account_bank: [
          { required: true, message: '请输入开户银行', trigger: 'submit' }
        ],
        address: [{ required: true, message: '请输入地址', trigger: 'submit' }]
      }
    }
  },
  created() {
    this.invoiceCompanyID = this.$route.params.uid
    if (this.invoiceCompanyID) {
      this.setting.loading = true
      this.invoiceCompanyDetail()
    }
  },
  methods: {
    invoiceCompanyDetail() {
      invoiceCompanyDetail(this, this.invoiceCompanyID)
        .then(res => {
          this.invoiceCompanyForm.name = res.name
          this.invoiceCompanyForm.phone = res.phone
          this.invoiceCompanyForm.account_bank = res.account_bank
          this.invoiceCompanyForm.address = res.address
          this.invoiceCompanyForm.taxpayer_num = res.taxpayer_num
          this.invoiceCompanyForm.account_number = res.account_number
          this.invoiceCompanyForm.telephone = res.telephone
          this.setting.loading = false
        })
        .catch(err => {
          this.$message({
            message: err.response.data.message,
            type: 'success'
          })
          this.setting.loading = false
        })
    },
    back() {
      historyBack()
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true
          let args = this.invoiceCompanyForm
          if (this.invoiceCompanyID) {
            modifyInvoiceCompany(this, this.invoiceCompanyID, args)
              .then(res => {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$router.push({
                  path: '/invoice/invoice_company'
                })
                this.setting.loading = false
              })
              .catch(err => {
                this.setting.loading = false
                this.$message({
                  message: err.response.data.message,
                  type: 'warning'
                })
              })
          } else {
            saveInvoiceCompany(this, args)
              .then(res => {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.$router.push({
                  path: '/invoice/invoice_company'
                })
                this.setting.loading = false
              })
              .catch(err => {
                this.setting.loading = false
                this.$message({
                  message: err.response.data.message,
                  type: 'warning'
                })
              })
          }
        }
      })
    }
  }
}
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
