<template>
  <div 
    class="item-wrap-template">
    <div 
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText" 
      class="pane">
      <div 
        class="pane-title">
        {{ payeeID ? '修改收款人' : '新增收款人' }}
      </div>
      <el-form
        ref="payeeForm"
        :model="payeeForm"
        :rules="rules"
        label-width="130px">
        <el-form-item 
          label="收款人" 
          prop="name" >
          <el-input 
            v-model="payeeForm.name"
            :maxlength="50"
            placeholder="请填写收款人"
            class="item-input"/>
        </el-form-item>
        <el-form-item 
          label="收款人开户行" 
          prop="account_bank" >
          <el-input 
            v-model="payeeForm.account_bank"
            placeholder="请填写收款人开户行"
            :maxlength="50"
            class="item-input"/>
        </el-form-item>
        <el-form-item 
          label="收款人账号" 
          prop="account_number" >
          <el-input 
            v-model="payeeForm.account_number"
            placeholder="请填写收款人账号"
            :maxlength="20"
            class="item-input"/>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary"
            @click="submit('payeeForm')">保存</el-button>
          <el-button 
            @click="historyBack" >返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  savePayee,
  modifyPayee,
  payeeDetail,
  Cookies,
  historyBack
} from 'service'

import { Form, FormItem, Button, Input, MessageBox } from 'element-ui'

export default {
  components: {
    ElForm: Form,
    ElFormItem: FormItem,
    ElButton: Button,
    ElInput: Input
  },
  data() {
    let checkNumber = (rule, value, callback) => {
      if (typeof parseFloat(value) !== 'number') {
        callback(new Error('必须是数字'))
      } else {
        callback()
      }
    }
    return {
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: '拼命加载中'
      },
      payeeID: '',
      payeeForm: {
        name: '',
        account_bank: '',
        account_number: ''
      },
      rules: {
        account_number: [
          { required: true, message: '请输入收款人账号', trigger: 'submit' },
          { validator: checkNumber, trigger: 'submit' }
        ],
        account_bank: [
          { required: true, message: '请输入收款人开户行', trigger: 'submit' }
        ],
        name: [{ required: true, message: '请输入收款人', trigger: 'submit' }]
      }
    }
  },
  created() {
    this.setting.loading = true
    this.payeeID = this.$route.params.uid
    if (this.payeeID) {
      this.payeeDetail()
    } else {
      this.setting.loading = false
    }
  },
  methods: {
    payeeDetail() {
      payeeDetail(this, this.payeeID)
        .then(res => {
          this.payeeForm.name = res.name
          this.payeeForm.account_bank = res.account_bank
          this.payeeForm.account_number = res.account_number
          this.setting.loading = false
        })
        .catch(err => {
          this.setting.loading = false
        })
    },
    historyBack() {
      historyBack()
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true
          let args = this.payeeForm
          if (this.payeeID) {
            args.id = this.payeeID
            modifyPayee(this, this.payeeID, args)
              .then(res => {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$router.push({
                  path: '/payment/payee'
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
            savePayee(this, args)
              .then(res => {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.$router.push({
                  path: '/payment/payee'
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
