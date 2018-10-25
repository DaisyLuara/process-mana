<template>
  <div 
    class="item-wrap-template">
    <div 
      class="topbar">
      <el-breadcrumb 
        separator="/">
        <el-breadcrumb-item 
          :to="'/payment/list'">付款管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{hide ? '详情' : '审批' }}</el-breadcrumb-item>
      </el-breadcrumb>
      <headModule/>
    </div>
    <div 
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText" 
      class="pane">
      <div 
        class="pane-title">
        付款{{hide ? '详情' : '审批' }}
      </div>
      <el-form
        ref="paymentForm"
        :model="paymentForm"
        label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="合同编号:" 
              prop="contract_name" >
              {{ paymentForm.contract_name }}
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
              prop="payee" >
              {{ paymentForm.payee }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="收款人开户行:" 
              prop="account_bank" >
              {{ paymentForm.account_bank }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="收款人账号:" 
              prop="account_number" >
              {{ paymentForm.account_number }}
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
            v-if="!hide"
            type="danger"
            size="small"
            @click="dialogFormVisible = true">退回</el-button>
          <el-button 
            v-if="!hide"
            :type="(paymentForm.status === '已审批' && paymentForm.handler === id) ?'warning' : 'primary'"
            size="small"
            @click="auditing">{{ (paymentForm.status === '已审批' && paymentForm.handler === id) ?'确认付款' : '审核通过' }}</el-button>
          <el-button 
            size="small"
            @click="historyBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="驳回理由" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item
          label="备注:" 
          prop="remark">
          <el-input
            v-model="paymentForm.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            :maxlength="180"
            placeholder="请输入内容"
            class="text-input"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="rejected">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  historyBack,
  paymentDetail,
  modifyPayment,
  auditingPayment
} from 'service'

import {
  Form,
  FormItem,
  Button,
  Row,
  MessageBox,
  Col,
  Dialog,
  Input
} from 'element-ui'

export default {
  components: {
    ElRow: Row,
    ElCol: Col,
    ElForm: Form,
    ElFormItem: FormItem,
    ElButton: Button,
    ElDialog: Dialog,
    ElInput: Input
  },
  data() {
    return {
      hide: null,
      dialogFormVisible: false,
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: '拼命加载中'
      },
      paymentForm: {
        payee: '',
        applicant: '',
        type: 1,
        type_name: '',
        account_bank: '',
        contract_id: '',
        contract_name: '',
        reason: '',
        amount: '',
        account_number: '',
        remark: '',
        applicant_name: '',
        handler: '',
        status: ''
      },
      id: '',

      paymentID: ''
    }
  },
  created() {
    this.paymentID = this.$route.params.uid
    this.hide = this.$route.query.hide
    let user_info = JSON.parse(localStorage.getItem('user_info'))
    this.id = user_info.id
    this.paymentDetail()
  },
  methods: {
    paymentDetail() {
      this.setting.loading = true
      let args = {
        include: 'contract'
      }
      paymentDetail(this, this.paymentID, args)
        .then(res => {
          this.paymentForm.contract_id = res.contract_number
          this.paymentForm.payee = res.payee
          this.paymentForm.contract_name = res.contract.name
          this.paymentForm.type =
            res.type === '支票' ? 1 : res.type === '电汇单' ? 2 : 3
          this.paymentForm.type_name = res.type
          this.paymentForm.applicant = res.applicant
          this.paymentForm.applicant_name = res.applicant_name
          this.paymentForm.amount = res.amount
          this.paymentForm.remark = res.remark
          this.paymentForm.account_bank = res.account_bank
          this.paymentForm.account_number = res.account_number
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
    },
    auditing() {
      this.$confirm(
        this.paymentForm.status === '已审批' &&
        this.paymentForm.handler === this.id
          ? '确定确认付款吗?'
          : '确定审核通过吗?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.setting.loading = true
          auditingPayment(this, this.paymentID)
            .then(res => {
              this.$message({
                message:
                  this.paymentForm.status === '已审批' &&
                  this.paymentForm.handler === this.id
                    ? '付款成功'
                    : '审批通过',
                type: 'success'
              })
              this.$router.push({
                path: '/payment/list'
              })
              this.setting.loading = false
            })
            .catch(err => {
              this.$message({
                message: err.response.data.message,
                type: 'warning'
              })
              this.setting.loading = false
            })
        })
        .catch(e => {
          this.setting.loading = false
        })
    },
    rejected() {
      this.setting.loading = true
      let args = {
        remark: this.paymentForm.remark
      }
      modifyPayment(this, this.paymentID, args)
        .then(res => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$router.push({
            path: '/payment/list'
          })
          this.dialogFormVisible = false
          this.setting.loading = false
        })
        .catch(err => {
          this.dialogFormVisible = false
          this.setting.loading = false
          this.$message({
            message: err.response.data.message,
            type: 'warning'
          })
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
