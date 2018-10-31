<template>
  <div 
    class="item-wrap-template">
    <div 
      class="topbar">
      <el-breadcrumb 
        separator="/">
        <el-breadcrumb-item 
          :to="'/payment/list'">付款管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ paymentID ? '修改' : '添加' }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div 
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText" 
      class="pane">
      <div 
        class="pane-title">
        {{ paymentID ? '修改付款' : '新增付款' }}
      </div>
      <el-form
        ref="paymentForm"
        :model="paymentForm"
        :rules="rules"
        label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="合同编号" 
              prop="contract_id" >
              <el-select 
                v-model="paymentForm.contract_id"
                :loading="searchLoading" 
                placeholder="请选择" 
                filterable 
                clearable>
                <el-option
                  v-for="item in contractList"
                  :key="item.id"
                  :label="item.contract_number"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="申请人" 
              prop="applicant_name" >
              <el-input 
                v-model="paymentForm.applicant_name" 
                :disabled="true"
                :maxlength="50"
                class="item-input"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="申请金额（大写)" 
              prop="amount" >
              <el-input 
                v-model="paymentForm.amount" 
                :maxlength="50"
                class="item-input"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="票据种类" 
              prop="type" >
              <el-radio-group v-model="paymentForm.type">
                <el-radio :label="1">支票</el-radio>
                <el-radio :label="2">电汇单</el-radio>
                <el-radio :label="3">贷记凭证</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="申请事由" 
              prop="reason" >
              <el-input 
                v-model="paymentForm.reason" 
                :maxlength="200"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                class="item-input"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="收款人" 
              prop="payee" >
              <el-input 
                v-model="paymentForm.payee"
                :maxlength="50"
                class="item-input"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="收款人开户行" 
              prop="account_bank" >
              <el-input 
                v-model="paymentForm.account_bank"
                :maxlength="50"
                class="item-input"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="收款人账号" 
              prop="account_number" >
              <el-input 
                v-model="paymentForm.account_number"
                :maxlength="20"
                class="item-input"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item 
          label="备注" 
          prop="remark">
          <el-input
            v-model="paymentForm.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            :maxlength="180"
            type="textarea"
            placeholder="请输入内容"
            class="text-input"/>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary"
            @click="submit('paymentForm')">保存</el-button>
          <el-button 
            @click="historyBack" >返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  getContract,
  savePayment,
  modifyPayment,
  paymentDetail,
  Cookies
} from 'service'

import {
  Form,
  Select,
  Option,
  FormItem,
  Button,
  Input,
  Row,
  DatePicker,
  MessageBox,
  RadioGroup,
  Radio,
  Tooltip,
  Checkbox,
  CheckboxGroup,
  Col
} from 'element-ui'

export default {
  components: {
    ElRow: Row,
    ElCol: Col,
    ElForm: Form,
    ElSelect: Select,
    ElOption: Option,
    ElFormItem: FormItem,
    ElButton: Button,
    ElInput: Input,
    ElDatePicker: DatePicker,
    ElRadioGroup: RadioGroup,
    ElRadio: Radio,
    ElTooltip: Tooltip,
    ElCheckboxGroup: CheckboxGroup,
    ElCheckbox: Checkbox
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
      contractList: [],

      searchLoading: false,
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: '拼命加载中'
      },

      paymentID: '',
      paymentForm: {
        payee: '',
        applicant: '',
        type: 1,
        account_bank: '',
        contract_id: '',
        reason: '',
        amount: '',
        account_number: '',
        remark: '',
        applicant_name: ''
      },
      rules: {
        account_number: [
          { required: true, message: '请输入收款人账号', trigger: 'submit' },
          { validator: checkNumber, trigger: 'submit' }
        ],
        reason: [
          { required: true, message: '请输入申请事由', trigger: 'submit' }
        ],
        amount: [
          { required: true, message: '请输入申请金额', trigger: 'submit' }
        ],
        account_bank: [
          { required: true, message: '请输入收款人开户行', trigger: 'submit' }
        ],
        contract_id: [
          { required: true, message: '请选择合同编号', trigger: 'submit' }
        ],
        payee: [{ required: true, message: '请输入收款人', trigger: 'submit' }]
      }
    }
  },
  created() {
    this.setting.loading = true
    this.paymentID = this.$route.params.uid
    this.getContract()
    if (this.paymentID) {
      this.paymentDetail()
    } else {
      let user_info = JSON.parse(Cookies.get('user_info'))
      this.paymentForm.applicant_name = user_info.name
      this.paymentForm.applicant = user_info.id
      this.setting.loading = false
    }
  },
  methods: {
    paymentDetail() {
      paymentDetail(this, this.paymentID)
        .then(res => {
          this.paymentForm.contract_id = res.contract_number
          this.paymentForm.payee = res.payee
          this.paymentForm.type =
            res.type === '支票' ? 1 : res.type === '电汇单' ? 2 : 3
          this.paymentForm.applicant = res.applicant
          this.paymentForm.applicant_name = res.applicant_name
          this.paymentForm.amount = res.amount
          this.paymentForm.remark = res.remark
          this.paymentForm.account_bank = res.account_bank
          this.paymentForm.account_number = res.account_number
          this.paymentForm.reason = res.reason
          this.setting.loading = false
        })
        .catch(err => {
          this.setting.loading = false
        })
    },
    getContract() {
      this.searchLoading = true
      getContract(this)
        .then(res => {
          this.contractList = res.data
          this.searchLoading = false
        })
        .catch(err => {
          this.searchLoading = false
        })
    },
    historyBack() {
      router.back()
    },
    submit(formName) {
      this.setting.loading = true
      this.$refs[formName].validate(valid => {
        if (valid) {
          delete this.paymentForm.applicant_name
          let args = this.paymentForm
          if (this.paymentID) {
            modifyPayment(this, this.paymentID, args)
              .then(res => {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$router.push({
                  path: '/payment/list'
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
            savePayment(this, args)
              .then(res => {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.$router.push({
                  path: '/payment/list'
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
