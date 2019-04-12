<template>
  <div 
    class="item-wrap-template">
    <div 
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText" 
      class="pane">
      <div 
        class="pane-title">
        新增付款
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
                placeholder="请选择合同编号" 
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
                placeholder="请填写申请金额（大写)"
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
                placeholder="请填写申请事由"
                type="textarea"
                class="item-input"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="收款人" 
              prop="payment_payee_id" >
              <el-select 
                v-model="paymentForm.payment_payee_id"
                :loading="searchLoading" 
                placeholder="请选择收款人" 
                filterable 
                clearable
                @change="paymentPayeeHandle">
                <el-option
                  v-for="item in paymentPayeeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="收款人开户行" 
              prop="account_bank" >
              <el-input 
                v-model="paymentPayee.account_bank"
                :disabled="true"
                :maxlength="50"
                placeholder="收款人开户行" 
                class="item-input"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="收款人账号" 
              prop="account_number" >
              <el-input 
                v-model="paymentPayee.account_number"
                :disabled="true"
                :maxlength="30"
                placeholder="收款人账号" 
                class="item-input"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="备注" 
              prop="remark">
              <el-input
                v-model="paymentForm.remark"
                :autosize="{ minRows: 2, maxRows: 4}"
                type="textarea"
                placeholder="请填写备注"
                class="text-input"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="附件内容" 
              prop="ids" >
              <el-upload
                ref="upload"
                :action="SERVER_URL + '/api/media'" 
                :data="{type: 'file'}"
                :headers="formHeader"
                :before-upload="beforeUpload" 
                :on-success="handleSuccess" 
                :on-remove="handleRemove"
                :on-preview="handlePreview"
                :before-remove="beforeRemove"
                :file-list="fileList"
                class="upload-demo">
                <el-button 
                  size="small" 
                  type="primary">点击上传</el-button>
                <div 
                  slot="tip" 
                  style="display:inline-block"
                  class="el-upload__tip">上传文件仅支持png、jpg、jpeg、pdf格式!</div>
                <div 
                  v-if="fileList.length !==0"
                  slot="tip" 
                  style="color: #ff5722;font-size: 12px;" >点击文件名称可以下载</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        
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
  Cookies,
  getPaymentPayee,
  historyBack
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
  Col,
  Upload
} from 'element-ui'
const SERVER_URL = process.env.SERVER_URL
import auth from 'service/auth'

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
    ElCheckbox: Checkbox,
    ElUpload: Upload
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
      SERVER_URL: SERVER_URL,
      formHeader: {
        Authorization: 'Bearer ' + auth.getToken()
      },
      fileList: [],
      contractList: [],
      searchLoading: false,
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: '拼命加载中'
      },
      paymentPayeeList: [],
      paymentID: '',
      paymentPayee: {
        account_bank: '',
        account_number: ''
      },
      paymentForm: {
        payment_payee_id: '',
        applicant: '',
        type: 3,
        contract_id: '',
        reason: '',
        amount: '',
        remark: '',
        applicant_name: '',
        ids: ''
      },
      rules: {
        reason: [
          { required: true, message: '请输入申请事由', trigger: 'submit' }
        ],
        amount: [
          { required: true, message: '请输入申请金额', trigger: 'submit' }
        ],
        contract_id: [
          { required: true, message: '请选择合同编号', trigger: 'submit' }
        ],
        payment_payee_id: [
          { required: true, message: '请输入收款人', trigger: 'submit' }
        ]
      }
    }
  },
  created() {
    this.setting.loading = true
    this.paymentID = this.$route.params.uid
    this.getContract()
    this.getPaymentPayee()
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
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handlePreview(file) {
      let url = file.url
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.responseType = 'blob'
      xhr.onload = () => {
        var urlObject = window.URL || window.webkitURL || window
        let a = document.createElement('a')
        a.href = urlObject.createObjectURL(new Blob([xhr.response]))
        a.download = file.name
        a.click()
      }
      xhr.send()
    },
    beforeRemove(file, fileList) {
      if (file.type) {
        return this.$confirm(`确定移除 ${file.name}？`)
      } else {
        const isFile =
          file.raw.type === 'application/pdf' ||
          file.raw.type === 'image/png' ||
          file.raw.type === 'image/jpeg'
        if (!isFile) {
          return true
        } else {
          return this.$confirm(`确定移除 ${file.name}？`)
        }
      }
    },
    beforeUpload(file) {
      const isFile =
        file.type === 'application/pdf' ||
        file.type === 'image/png' ||
        file.type === 'image/jpeg'
      if (!isFile) {
        this.$message.error('上传文件仅支持png、jpg、jpeg、pdf格式!')
        return isFile
      }
    },
    // 上传成功后的处理
    handleSuccess(response, file, fileList) {
      this.fileList.push(response)
    },
    paymentPayeeHandle(obj) {
      let paymentPayee = this.paymentPayeeList.find(r => {
        return r.id === obj
      })
      if (paymentPayee) {
        this.paymentPayee.account_bank = paymentPayee.account_bank
        this.paymentPayee.account_number = paymentPayee.account_number
      }
    },
    getPaymentPayee() {
      this.searchLoading = true
      getPaymentPayee(this)
        .then(res => {
          this.paymentPayeeList = res.data
          this.searchLoading = false
        })
        .catch(err => {
          this.searchLoading = false
        })
    },
    paymentDetail() {
      let args = {
        include: 'payment_payee,media'
      }
      paymentDetail(this, this.paymentID, args)
        .then(res => {
          this.paymentForm.contract_id = res.contract_id
          this.paymentForm.type =
            res.type === '支票' ? 1 : res.type === '电汇单' ? 2 : 3
          this.paymentForm.applicant = res.applicant
          this.paymentForm.applicant_name = res.applicant_name
          this.paymentForm.amount = res.amount
          this.paymentForm.remark = res.remark
          this.paymentForm.reason = res.reason
          if (res.payment_payee) {
            this.paymentForm.payment_payee_id = res.payment_payee.id
            this.paymentPayee.account_bank = res.payment_payee.account_bank
            this.paymentPayee.account_number = res.payment_payee.account_number
          }
          let mediaIds = []
          let mediaData = res.media.data
          if (mediaData.length > 0) {
            mediaData.map(r => {
              mediaIds.push(r.id)
            })
          }
          this.paymentPayee.ids = mediaIds
          this.fileList = mediaData
          this.setting.loading = false
        })
        .catch(err => {
          this.setting.loading = false
        })
    },
    getContract() {
      this.searchLoading = true
      let args = {
        // 1 付款
        type: 1
      }
      getContract(this, args)
        .then(res => {
          this.contractList = res.data
          this.searchLoading = false
        })
        .catch(err => {
          this.searchLoading = false
        })
    },
    historyBack() {
      historyBack()
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true
          let mediaIds = []
          if (this.fileList.length > 0) {
            this.fileList.map(r => {
              mediaIds.push(r.id)
            })
          }
          this.paymentForm.ids = mediaIds.join(',')
          delete this.paymentForm.applicant_name
          let args = this.paymentForm
          savePayment(this, args)
            .then(res => {
              this.$message({
                message: '提交成功',
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
