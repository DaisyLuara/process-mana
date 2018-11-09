<template>
  <div 
    class="item-wrap-template">
    <div 
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText" 
      class="pane">
      <div 
        class="pane-title">
        {{ invoiceID ? '修改开票' : '新增开票' }}
      </div>
      <el-form
        ref="invoiceForm"
        :model="invoiceForm"
        :rules="rules"
        label-position="left"
        label-width="130px">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="合同编号" 
              prop="contract_id" >
              <el-select 
                v-model="invoiceForm.contract_id" 
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
                v-model="invoiceForm.applicant_name" 
                :disabled="true"
                :maxlength="50"
                class="item-input"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="开票类型" 
              prop="type" >
              <el-radio-group v-model="invoiceForm.type">
                <el-radio :label="0">专票</el-radio>
                <el-radio :label="1">普票</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="开票公司" 
              prop="invoice_company_id" >
              <el-select 
                v-model="invoiceForm.invoice_company_id" 
                :loading="searchLoading"
                placeholder="请选择" 
                filterable 
                clearable
                @change="invoiceCompanyHandle">
                <el-option
                  v-for="item in invoiceCompanyList"
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
              label="座机电话" 
              prop="telephone">
              <el-input 
                v-model="invoiceCompany.telephone" 
                :maxlength="20"
                :disabled="true"
                class="item-input"/>
              <div style="color: #999;font-size:14px;">座机电话格式如下:021-65463432、021-65463432-7898</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="纳税人识别号" 
              prop="taxpayer_num" >
              <el-input 
                v-model="invoiceCompany.taxpayer_num" 
                :disabled="true"
                :maxlength="50"
                class="item-input"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="手机号" 
              prop="phone" >
              <el-input 
                v-model="invoiceCompany.phone" 
                :maxlength="11"
                :disabled="true"
                class="item-input"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="地址" 
              prop="address" >
              <el-input 
                v-model="invoiceCompany.address"
                :disabled="true"
                :maxlength="11"
                class="item-input"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="开户银行" 
              prop="account_bank" >
              <el-input 
                v-model="invoiceCompany.account_bank"
                :disabled="true"
                :maxlength="50"
                class="item-input"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="开户行账号" 
              prop="account_number" >
              <el-input 
                v-model="invoiceCompany.account_number"
                :disabled="true"
                :maxlength="20"
                class="item-input"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="收款状态" 
              prop="receive_status" >
              <el-radio-group v-model="invoiceForm.receive_status">
                <el-radio :label="1">已收款</el-radio>
                <el-radio :label="0">未收款</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="开票种类" 
              prop="kind" >
              <el-select 
                v-model="invoiceForm.kind" 
                placeholder="请选择审批状态" 
                filterable 
                clearable>
                <el-option
                  v-for="item in invoiceSpeciesList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button
          size="small" 
          type="success"
          style="margin-bottom: 20px;"
          @click="cargoAdd">新增货物或应税劳务·服务</el-button>
        <el-table 
          :data="tableData"
          :span-method="arraySpanMethod"
          border
          style="width: 100%;margin-bottom: 20px;">
          <el-table-column
            prop="name"
            label="货物或应税劳务·服务名称"
            min-width="150"
            align="center"
            header-align="center">
            <template 
              slot-scope="scope">
              <el-select
                v-if="scope.$index !== tableData.length-1" 
                v-model="scope.row.name" 
                :loading="searchLoading"
                placeholder="请选择" 
                filterable 
                clearable
                @change="googsServiceHandle($event,scope.$index)">
                <el-option
                  v-for="item in goodsServiceList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
              <span v-if="scope.$index === tableData.length-1">¥：{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="规格型号"
            width="100"
            align="center"
            header-align="center">
            <template 
              slot-scope="scope">
              <span v-if="scope.$index !== tableData.length-1">{{ scope.row.spec_type }}</span>
              <span v-if="scope.$index === tableData.length-1">¥：{{ total }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="unit"
            label="单位"
            min-width="120"
            align="center"
            header-align="center">
            <template 
              slot-scope="scope">
              <span>{{ scope.row.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="num"
            label="数量"
            min-width="120"
            align="center"
            header-align="center">
            <template 
              slot-scope="scope">
              <el-input
                v-model="scope.row.num"
                type="tel" 
                placeholder="请输入数量"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="price"
            label="单价（含税）"
            min-width="100"
            align="center"
            header-align="center">
            <template 
              slot-scope="scope">
              <el-input 
                v-model="scope.row.price"
                placeholder="请输入单价"/>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="金额（含税）"
            min-width="100"
            align="center"
            header-align="center">
            <template 
              slot-scope="scope">
              {{ scope.row.num * scope.row.price }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作" 
            min-width="100">
            <template 
              slot-scope="scope">
              <el-button
                size="mini" 
                type="danger" 
                icon="el-icon-delete"
                @click="deletecargop(scope.$index)"/>
            </template>
          </el-table-column>
        </el-table> 
        <el-form-item 
          label="备注" 
          prop="remark">
          <el-input
            v-model="invoiceForm.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            :maxlength="180"
            type="textarea"
            placeholder="请输入内容"
            class="text-input"/>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary"
            @click="submit('invoiceForm')">保存</el-button>
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
  modifyInvoice,
  saveInvoice,
  formatMoneylowercase,
  getContract,
  goodsService,
  invoiceDetail,
  getInvoiceCompany,
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
  MessageBox,
  RadioGroup,
  Radio,
  Col,
  Table,
  TableColumn
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
    ElRadioGroup: RadioGroup,
    ElRadio: Radio,
    ElTable: Table,
    ElTableColumn: TableColumn
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
      contractList: [],
      searchLoading: false,
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: '拼命加载中'
      },
      total: 0,
      total_text: '零',
      invoiceCompanyList: [],
      tableData: [
        {
          name: '开票总计（大写）：',
          spec_type: '',
          amount1: '',
          amount2: '',
          amount3: '',
          amount4: '',
          amount5: ''
        }
      ],
      invoiceSpeciesList: [
        {
          id: '硬件销售：星视度智能互动屏',
          name: '硬件销售：星视度智能互动屏'
        },
        {
          id: '节目定制：*软件*星视度智能互动软件V1.0',
          name: '节目定制：*软件*星视度智能互动软件V1.0'
        },
        {
          id: '节目定制：*信息技术服务*星视度智能互动软件V1.0服务费',
          name: '节目定制：*信息技术服务*星视度智能互动软件V1.0服务费'
        },
        {
          id: '活动租赁：*信息技术服务*星视度智能互动软件V1.0服务费',
          name: '活动租赁：*信息技术服务*星视度智能互动软件V1.0服务费'
        },
        {
          id: '体验营销：*软件*星视度管理软件V1.0',
          name: '体验营销：*软件*星视度管理软件V1.0'
        },
        {
          id: '体验影响：*信息技术服务*星视度管理软件V1.0服务费',
          name: '体验影响：*信息技术服务*星视度管理软件V1.0服务费'
        }
      ],
      invoiceID: '',
      invoiceCompany: {
        phone: '',
        telephone: '',
        account_bank: '',
        account_number: '',
        taxpayer_num: '',
        address: ''
      },
      invoiceForm: {
        applicant_name: '',
        receive_status: 1,
        applicant: '',
        type: 0,
        contract_id: '',
        remark: '',
        invoice_company_id: '',
        kind: ''
      },
      rules: {
        invoice_company_id: [
          { required: true, message: '请输入开票名称', trigger: 'submit' }
        ],
        type: [
          { required: true, message: '请选择开票类型', trigger: 'submit' }
        ],
        receive_status: [
          { required: true, message: '请选择收款状态', trigger: 'submit' }
        ],
        kind: [
          { required: true, message: '请选择开票种类', trigger: 'submit' }
        ],
        contract_id: [
          { required: true, message: '请选择合同编号', trigger: 'submit' }
        ]
      },
      goodsServiceList: []
    }
  },
  watch: {
    tableData: {
      handler: function(val, oldVal) {
        let sum = 0
        val.map(r => {
          if (String(r.name).indexOf('开票总计（大写）：') === -1) {
            sum += parseFloat(r.price) * parseInt(r.num)
          }
        })
        this.total = sum.toFixed(2)
        this.total_text = formatMoneylowercase(sum)
        let length = this.tableData.length
        let data = this.tableData[length - 1]
        data.name = '开票总计（大写）：' + this.total_text
      },
      deep: true
    }
  },
  created() {
    this.invoiceID = this.$route.params.uid
    this.getContract()
    this.goodsService()
    this.getInvoiceCompany()
    if (this.invoiceID) {
      this.setting.loading = true
      this.invoiceDetail()
    } else {
      let user_info = JSON.parse(Cookies.get('user_info'))
      this.invoiceForm.applicant_name = user_info.name
      this.invoiceForm.applicant = user_info.id
    }
  },
  methods: {
    invoiceCompanyHandle(obj) {
      let invoiceCompany = this.invoiceCompanyList.find(r => {
        return r.id === obj
      })
      this.invoiceCompany.phone = invoiceCompany.phone
      this.invoiceCompany.telephone = invoiceCompany.telephone
      this.invoiceCompany.account_bank = invoiceCompany.account_bank
      this.invoiceCompany.account_number = invoiceCompany.account_number
      this.invoiceCompany.taxpayer_num = invoiceCompany.taxpayer_num
      this.invoiceCompany.address = invoiceCompany.address
    },
    invoiceDetail() {
      let params = {
        include: 'invoice_content.goodsService,invoice_company'
      }
      invoiceDetail(this, this.invoiceID, params)
        .then(res => {
          let invoice_content = res.invoice_content.data
          this.invoiceCompany.phone = res.invoice_company.phone
          this.invoiceCompany.telephone = res.invoice_company.telephone
          this.invoiceCompany.account_bank = res.invoice_company.account_bank
          this.invoiceCompany.account_number =
            res.invoice_company.account_number
          this.invoiceCompany.taxpayer_num = res.invoice_company.taxpayer_num
          this.invoiceCompany.address = res.invoice_company.address
          this.invoiceForm.invoice_company_id = res.invoice_company.id
          this.invoiceForm.type = res.type === '专票' ? 0 : 1
          this.invoiceForm.applicant_name = res.applicant_name
          this.invoiceForm.receive_status =
            res.receive_status === '未收款' ? 0 : 1
          this.invoiceForm.applicant = res.applicant
          this.invoiceForm.contract_id = res.contract_id
          this.invoiceForm.remark = res.remark
          this.invoiceForm.kind = res.kind
          invoice_content.map(r => {
            let data = {
              name: r.goodsService.id,
              spec_type: r.goodsService.spec_type,
              unit: r.goodsService.unit,
              num: r.num,
              price: r.price,
              money: r.money
            }
            this.tableData.unshift(data)
          })
          let length = this.tableData.length
          this.total_text = res.$total_text
          this.total = res.total
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
    getInvoiceCompany() {
      this.searchLoading = true
      getInvoiceCompany(this)
        .then(res => {
          this.invoiceCompanyList = res.data
        })
        .catch(err => {
          this.searchLoading = false
          this.$message({
            message: err.response.data.message,
            type: 'warning'
          })
        })
    },
    googsServiceHandle(obj, index) {
      var goodService = this.goodsServiceList.find(r => {
        return r.id === obj
      })
      this.tableData[index].spec_type = goodService.spec_type
      this.tableData[index].unit = goodService.unit
    },
    goodsService() {
      this.searchLoading = true
      goodsService(this)
        .then(res => {
          this.goodsServiceList = res.data
          this.searchLoading = false
        })
        .catch(err => {
          this.searchLoading = false
        })
    },
    getContract() {
      this.searchLoading = true
      let args = {
        // 0 收款
        type: 0
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
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === this.tableData.length - 1) {
        if (columnIndex === 1) {
          return [5, 6]
        }
      }
    },
    back() {
      historyBack()
    },
    deletecargop(index) {
      this.tableData.splice(index, 1)
    },
    cargoAdd() {
      let td = {
        name: '',
        spec_type: '',
        unit: '',
        num: 0,
        price: 1,
        money: ''
      }
      this.tableData.unshift(td)
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true
          delete this.invoiceForm.applicant_name
          let length = this.tableData.length
          let invoice_content = []
          for (let i = 0; i < length; i++) {
            let content = {}
            if (i !== length - 1) {
              content.goods_service_id = this.tableData[i].name
              content.num = parseFloat(this.tableData[i].num)
              content.price = parseFloat(this.tableData[i].price)
              content.money = (
                this.tableData[i].num * this.tableData[i].price
              ).toFixed(2)
              invoice_content.push(content)
            }
          }
          let args = this.invoiceForm
          args.invoice_content = invoice_content
          args.total = this.total
          args.total_text = this.total_text
          console.log(args)
          if (this.invoiceID) {
            modifyInvoice(this, this.invoiceID, args)
              .then(res => {
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
                this.setting.loading = false
                this.$message({
                  message: err.response.data.message,
                  type: 'warning'
                })
              })
          } else {
            saveInvoice(this, args)
              .then(res => {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.$router.push({
                  path: '/invoice/list'
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
