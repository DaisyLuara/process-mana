<template>
  <div 
    class="item-wrap-template">
    <div 
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText" 
      class="pane">
      <div 
        class="pane-title">
        开票{{ hide ? '详情' : '审批' }}
      </div>
      <el-form
        ref="invoiceForm"
        :model="invoiceForm"
        label-position="left"
        label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="合同编号:" 
              prop="contract_number" >
              {{ invoiceForm.contract_number }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="申请人:" 
              prop="applicant_name" >
              {{ invoiceForm.applicant_name }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="开票类型:" 
              prop="type_name" >
              {{ invoiceForm.type_name }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="座机电话:" 
              prop="telephone">
              {{ invoiceCompany.telephone }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="开票公司:" 
              prop="name" >
              {{ invoiceCompany.name }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="纳税人识别号:" 
              prop="taxpayer_num" >
              {{ invoiceCompany.taxpayer_num }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="电话:" 
              prop="phone" >
              {{ invoiceCompany.phone }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="地址:" 
              prop="address" >
              {{ invoiceCompany.address }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="开户银行:" 
              prop="account_bank" >
              {{ invoiceCompany.account_bank }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="开户行账号:" 
              prop="account_number" >
              {{ invoiceCompany.account_number }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="开票种类:" 
              prop="kind" >
              {{ invoiceForm.kind }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-table
          :data="tableData"
          :span-method="arraySpanMethod"
          border
          style="width: 100%;margin-bottom: 10px;">
          <el-table-column
            prop="name"
            align="center"
            header-align="center"
            label="货物或应税劳务·服务名称"
            width="250"/>
          <el-table-column
            align="center"
            header-align="center"
            prop="spec_type"
            label="规格型号"/>
          <el-table-column
            align="center"
            header-align="center"
            prop="unit"
            label="单位"/>
          <el-table-column
            align="center"
            prop="num"
            header-align="center"
            label="数量"/>
          <el-table-column
            prop="price"
            align="center"
            header-align="center"
            label="单价(含税)"/>
          <el-table-column
            prop="money"
            align="center"
            header-align="center"
            label="金额(含税)"/>
        </el-table>
        <el-form-item
          label="备注:" 
          prop="remark">
          {{ invoiceForm.remark }}
        </el-form-item>
        <el-form-item
          v-if="invoiceForm.bd_ma_message"
          label="bd主管意见:"
          prop="bd_ma_message">
          {{ invoiceForm.bd_ma_message }}
        </el-form-item>
        <el-form-item
          v-if="invoiceForm.legal_ma_message"
          label="法务主管意见:" 
          prop="legal_ma_message">
          {{ invoiceForm.legal_ma_message }}
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="!hide"
            type="danger"
            size="small"
            @click="dialogFormVisible = true">驳回</el-button>
          <el-button
            v-if="!hide"
            :type="(invoiceForm.status === '已审批' && invoiceForm.handler === id) ? 'warning' : 'primary'"
            size="small"
            @click="auditing">{{ (invoiceForm.status === '已审批' && invoiceForm.handler === id) ?'确认开票' : '审核通过' }}</el-button>
          <el-button 
            size="small"
            @click="back" >返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog 
      :visible.sync="dialogFormVisible"
      title="驳回理由">
      <el-form>
        <el-form-item
          label="备注:" 
          prop="remark">
          <el-input
            v-model="invoiceForm.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            :maxlength="180"
            type="textarea"
            placeholder="请输入内容"
            class="text-input"/>
        </el-form-item>
      </el-form>
      <div 
        slot="footer" 
        class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button 
          type="primary" 
          @click="rejected">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog  
      :visible.sync="auditingDialog"
      title="审批">
      <el-form >
        <el-form-item
          v-if="roles.name === 'legal-affairs-manager'"
          :rules="[{ required: true, message: '请填写合同编号', trigger: 'submit' }]"
          label="意见" 
          prop="legal_ma_message">
          <el-input
            v-model="invoiceForm.legal_ma_message"
            :autosize="{ minRows: 2, maxRows: 4}"
            :maxlength="180"
            type="textarea"
            placeholder="请输入内容"
            class="text-input"/>
        </el-form-item>
        <el-form-item
          v-if="roles.name === 'bd-manager'"
          :rules="[{ required: true, message: '请填写合同编号', trigger: 'submit' }]"
          label="意见" 
          prop="bd_ma_message">
          <el-input
            v-model="invoiceForm.bd_ma_message"
            :autosize="{ minRows: 2, maxRows: 4}"
            :maxlength="180"
            type="textarea"
            placeholder="请输入内容"
            class="text-input"/>
        </el-form-item>
      </el-form>
      <div 
        slot="footer" 
        class="dialog-footer">
        <el-button @click="auditingDialog = false">取 消</el-button>
        <el-button 
          type="primary" 
          @click="auditingHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  historyBack,
  checkMobile,
  invoiceDetail,
  auditingInvoice,
  Cookies,
  rejectInvoice
} from 'service/index'
import {
  Form,
  FormItem,
  Button,
  Row,
  MessageBox,
  Col,
  Table,
  TableColumn,
  Input,
  Dialog
} from 'element-ui'

export default {
  components: {
    ElRow: Row,
    ElCol: Col,
    ElForm: Form,
    ElFormItem: FormItem,
    ElButton: Button,
    ElTable: Table,
    ElInput: Input,
    ElDialog: Dialog,
    ElTableColumn: TableColumn
  },
  data() {
    return {
      dialogFormVisible: false,
      hide: null,
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: '拼命加载中'
      },
      auditingDialog: false,
      invoiceCompany: {
        phone: '',
        telephone: '',
        account_bank: '',
        account_number: '',
        taxpayer_num: '',
        address: '',
        name: ''
      },
      invoiceForm: {
        applicant_name: '',
        applicant: '',
        type: null,
        type_name: '',
        contract_number: null,
        remark: '',
        kind: '',
        bd_ma_message: '',
        legal_ma_message: ''
      },
      id: '',
      roles: [],
      tableData: [
        {
          name: '开票总计（大写）：',
          spec_type: '',
          unit: '',
          num: '',
          price: '',
          money: ''
        }
      ]
    }
  },
  created() {
    this.setting.loading = true
    this.invoiceID = this.$route.params.uid
    let user_info = JSON.parse(Cookies.get('user_info'))
    this.hide = this.$route.query.hide
    this.id = user_info.id
    this.roles = user_info.roles.data[0]
    this.invoiceDetail()
  },
  methods: {
    invoiceDetail() {
      let params = {
        include: 'invoice_content.goodsService,invoice_company'
      }
      invoiceDetail(this, this.invoiceID, params)
        .then(res => {
          this.invoiceForm = res
          let invoice_content = res.invoice_content.data
          this.invoiceForm.type_name = res.type
          if (res.invoice_company) {
            this.invoiceCompany.telephone = res.invoice_company.telephone
            this.invoiceCompany.taxpayer_num = res.invoice_company.taxpayer_num
            this.invoiceCompany.phone = res.invoice_company.phone
            this.invoiceCompany.account_bank = res.invoice_company.account_bank
            this.invoiceCompany.account_number =
              res.invoice_company.account_number
            this.invoiceCompany.address = res.invoice_company.address
            this.invoiceCompany.name = res.invoice_company.name
            this.invoiceForm.bd_ma_message = res.bd_ma_message
            this.invoiceForm.legal_ma_message = res.legal_ma_message
          }
          invoice_content.map(r => {
            let data = {
              name: r.goodsService.name,
              spec_type: r.goodsService.spec_type,
              unit: r.goodsService.unit,
              num: r.num,
              price: r.price,
              money: r.money
            }
            this.tableData.unshift(data)
          })
          let length = this.tableData.length
          this.tableData[length - 1].name =
            '开票总计（大写）：' + res.$total_text
          this.tableData[length - 1].spec_type = '(小写) ¥：' + res.total + '元'
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
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === this.tableData.length - 1) {
        if (columnIndex === 1) {
          return [4, 5]
        }
      }
    },
    back() {
      historyBack()
    },
    auditing() {
      if (
        this.invoiceForm.status === '已审批' &&
        this.invoiceForm.handler === this.id
      ) {
        this.$confirm('确定确认开票吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.auditingInvoice(this, this.invoiceID)
          })
          .catch(e => {
            this.setting.loading = false
          })
      } else {
        this.auditingDialog = true
      }
    },
    auditingInvoice(obj, invoiceID, args) {
      this.setting.loading = true
      auditingInvoice(obj, invoiceID, args)
        .then(res => {
          this.$message({
            message:
              this.invoiceForm.status === '已审批' &&
              this.invoiceForm.handler === this.id
                ? '开票成功'
                : '审批通过',
            type: 'success'
          })
          this.$router.push({
            path: '/invoice/list'
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
    },
    auditingHandle() {
      let args = {}
      this.setting.loading = true

      if (
        this.roles.name === 'legal-affairs-manager' &&
        !this.invoiceForm.legal_ma_message
      ) {
        this.$message({
          type: 'info',
          message: '审批意见必填'
        })
        this.setting.loading = false
        return
      } else {
        if (this.invoiceForm.legal_ma_message) {
          args.legal_ma_message = this.invoiceForm.legal_ma_message
        }
      }

      if (this.roles.name === 'bd-manager' && !this.invoiceForm.bd_ma_message) {
        this.$message({
          type: 'info',
          message: '审批意见必填'
        })
        this.setting.loading = false
        return
      } else {
        if (this.invoiceForm.bd_ma_message) {
          args.bd_ma_message = this.invoiceForm.bd_ma_message
        }
      }
      console.log(args)
      this.auditingInvoice(this, this.invoiceID, args)
    },
    rejected() {
      this.setting.loading = true
      let args = {
        remark: this.invoiceForm.remark
      }
      rejectInvoice(this, this.invoiceID, args)
        .then(res => {
          this.dialogFormVisible = false
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$router.push({
            path: '/invoice/list'
          })
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
