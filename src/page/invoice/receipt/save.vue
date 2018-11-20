<template>
  <div 
    class="item-wrap-template">
    <div 
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText" 
      class="pane">
      <div 
        class="pane-title">
        {{ receiptID ? '修改收款' : '新增收款' }}
      </div>
      <el-form
        ref="receiptForm"
        :model="receiptForm"
        :rules="rules"
        label-position="left"
        label-width="130px">
        <el-form-item 
          label="付款公司" 
          prop="receipt_company" >
          <el-input 
            v-model="receiptForm.receipt_company"
            :maxlength="50"
            placeholder="请填写付款公司"
            class="item-input"/>
        </el-form-item>
        <el-form-item 
          label="收款金额" 
          prop="receipt_money" >
          <el-input 
            v-model="receiptForm.receipt_money" 
            placeholder="请填写收款金额"
            :maxlength="50"
            class="item-input"/>
        </el-form-item>
        <el-form-item 
          label="到账时间" 
          prop="receipt_date" >
          <el-date-picker
            v-model="receiptForm.receipt_date"
            placeholder="请选择到账时间"
            type="date">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary"
            @click="submit('receiptForm')">保存</el-button>
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
  modifyReceipt,
  saveReceipt,
  ReceiptDetail,
  Cookies,
  handleDateTransform
} from 'service'
import {
  Form,
  FormItem,
  Button,
  Input,
  MessageBox,
  DatePicker
} from 'element-ui'

export default {
  components: {
    ElForm: Form,
    ElFormItem: FormItem,
    ElButton: Button,
    ElInput: Input,
    ElDatePicker: DatePicker
  },
  data() {
    let checkNumber = (rule, value, callback) => {
      if (!/^\d*$/.test(value)) {
        callback(new Error('必须是数字'))
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
      receiptID: '',
      receiptForm: {
        receipt_company: '',
        receipt_money: '',
        receipt_date: ''
      },
      rules: {
        receipt_company: [
          { required: true, message: '请输入付款公司', trigger: 'submit' }
        ],
        receipt_money: [
          { required: true, message: '请输入收款金额', trigger: 'submit' },
          { validator: checkNumber, trigger: 'submit' }
        ],
        receipt_date: [
          { required: true, message: '请选择日期', trigger: 'submit' }
        ]
      }
    }
  },
  created() {
    this.receiptID = this.$route.params.uid
    if (this.receiptID) {
      this.setting.loading = true
      this.ReceiptDetail()
    }
  },
  methods: {
    ReceiptDetail() {
      ReceiptDetail(this, this.receiptID)
        .then(res => {
          this.receiptForm.receipt_company = res.receipt_company
          this.receiptForm.receipt_money = res.receipt_money
          this.receiptForm.receipt_date = res.receipt_date
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
          let args = this.receiptForm
          args.receipt_date = handleDateTransform(this.receiptForm.receipt_date)
          if (this.receiptID) {
            modifyReceipt(this, this.receiptID, args)
              .then(res => {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$router.push({
                  path: '/invoice/receipt'
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
            saveReceipt(this, args)
              .then(res => {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.$router.push({
                  path: '/invoice/receipt'
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
