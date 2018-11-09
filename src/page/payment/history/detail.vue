<template>
  <div 
    class="item-wrap-template">
    <div 
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText" 
      class="pane">
      <div 
        class="pane-title">
        付款详情
      </div>
      <el-form
        ref="paymentForm"
        :model="paymentForm"
        label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="合同编号:" 
              prop="contract_number" >
              {{ paymentForm.contract_number }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="申请人:" 
              prop="applicant_name" >
              {{ paymentForm.applicant_name }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="申请金额（大写):" 
              prop="amount" >
              {{ paymentForm.amount }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="票据种类:" 
              prop="type_name" >
              {{ paymentForm.type_name }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="申请事由:" 
              prop="reason" >
              {{ paymentForm.reason }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="收款人:" 
              prop="name" >
              {{ paymentPayee.name }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="收款人开户行:" 
              prop="account_bank" >
              {{ paymentPayee.account_bank }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="收款人账号:" 
              prop="account_number" >
              {{ paymentPayee.account_number }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item 
          label="备注:" 
          prop="remark">
          {{ paymentForm.remark }}
        </el-form-item>
        <el-form-item>
          <el-button 
            size="small"
            @click="historyBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { historyBack, paymentDetail } from 'service'

import { Form, FormItem, Button, Row, MessageBox, Col, Input } from 'element-ui'

export default {
  components: {
    ElRow: Row,
    ElCol: Col,
    ElForm: Form,
    ElFormItem: FormItem,
    ElButton: Button,
    ElInput: Input
  },
  data() {
    return {
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: '拼命加载中'
      },
      paymentPayee: {
        account_number: '',
        account_bank: '',
        name: ''
      },
      paymentForm: {
        applicant: '',
        type: 1,
        type_name: '',
        contract_id: '',
        contract_number: '',
        reason: '',
        amount: '',
        remark: '',
        applicant_name: '',
        handler: '',
        status: ''
      },
      paymentID: ''
    }
  },
  created() {
    this.paymentID = this.$route.params.uid
    this.paymentDetail()
  },
  methods: {
    paymentDetail() {
      this.setting.loading = true
      let args = {
        include: 'contract,payment_payee'
      }
      paymentDetail(this, this.paymentID, args)
        .then(res => {
          this.paymentForm.contract_id = res.contract_number
          this.paymentForm.contract_number = res.contract_number
          this.paymentForm.type =
            res.type === '支票' ? 1 : res.type === '电汇单' ? 2 : 3
          this.paymentForm.type_name = res.type
          this.paymentForm.applicant = res.applicant
          this.paymentForm.applicant_name = res.applicant_name
          this.paymentForm.amount = res.amount
          this.paymentForm.remark = res.remark
          if (res.payment_payee) {
            this.paymentPayee.name = res.payment_payee.name
            this.paymentPayee.account_bank = res.payment_payee.account_bank
            this.paymentPayee.account_number = res.payment_payee.account_number
          }
          this.paymentForm.reason = res.reason
          this.paymentForm.handler = res.handler
          this.paymentForm.status = res.status
          this.setting.loading = false
        })
        .catch(err => {
          this.setting.loading = false
        })
    },
    historyBack() {
      historyBack()
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
