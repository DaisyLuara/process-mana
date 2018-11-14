<template>
  <div 
    class="item-wrap-template">
    <div 
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText" 
      class="pane">
      <div 
        class="pane-title">
        新增合同
      </div>
      <el-form
        ref="contractForm"
        :model="contractForm"
        :rules="rules"
        label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="公司名称" 
              prop="company_id" >
              <el-select 
                v-model="contractForm.company_id" 
                :loading="searchLoading"
                placeholder="请选择" 
                filterable 
                clearable>
                <el-option
                  v-for="item in companyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="申请人" 
              prop="applicant_name" >
              <el-input 
                v-model="contractForm.applicant_name" 
                :disabled="true"
                :maxlength="50"
                class="item-input"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="合同名称" 
              prop="name" >
              <el-input 
                v-model="contractForm.name" 
                :maxlength="50"
                class="item-input"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="合同类型" 
              prop="type" >
              <el-radio-group v-model="contractForm.type">
                <el-radio :label="0">收款合同</el-radio>
                <el-radio :label="1">付款合同</el-radio>
                <el-radio :label="2">其他合同</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="合同内容" 
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
                  class="el-upload__tip">支持文件类型：doc(.docx)、.pdf</div>
                <div 
                  v-if="fileList.length !==0"
                  slot="tip" 
                  style="color: #ff5722;font-size: 12px;" >点击文件名称可以下载</div>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="contractForm.type === 0" 
              label="合同总额" 
              prop="amount" >
              <el-input 
                v-model="contractForm.amount"
                :maxlength="7"
                class="item-input"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col 
            v-if="contractForm.type === 0"
            :span="12">
            <el-form-item 
              label="预估收款日期" 
              prop="receive_date" >
              <el-date-picker
                v-model="contractForm.receive_date"
                type="dates"
                placeholder="选择一个或多个日期"/>
            </el-form-item>
          </el-col>
          <el-col 
            :span="12">
            <el-form-item 
              v-if="this.roles.name == 'legal-affairs' || this.roles.name == 'legal-affairs-manager'"
              label="合同编号" 
              prop="contract_number" >
              <el-input 
                v-model="contractForm.contract_number" 
                :maxlength="50"
                placeholder="请输入合同编号"
                class="item-input"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item 
          label="备注" 
          prop="remark">
          <el-input
            v-model="contractForm.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            :maxlength="180"
            type="textarea"
            placeholder="请输入内容"
            class="text-input"/>
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary"
            @click="submit('contractForm')">保存</el-button>
          <el-button 
            @click="historyBack" >返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  getCompanyList,
  saveContract,
  handleDateTransform,
  modifyContract,
  historyBack,
  contractDetail,
  Cookies
} from 'service'
import auth from 'service/auth'
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
  Col,
  Upload
} from 'element-ui'

const SERVER_URL = process.env.SERVER_URL
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
    ElUpload: Upload
  },
  data() {
    return {
      SERVER_URL: SERVER_URL,
      formHeader: {
        Authorization: 'Bearer ' + auth.getToken()
      },
      companyList: [],
      fileList: [],
      searchLoading: false,
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: '拼命加载中'
      },
      roles: [],
      contractID: '',
      contractForm: {
        company_id: '',
        applicant_name: '',
        contract_number: '',
        name: '',
        type: 0,
        applicant: 0,
        receive_date: [],
        ids: '',
        remark: '',
        amount: null
      },
      rules: {
        ids: [{ required: true, message: '请上传文件', trigger: 'submit' }],
        type: [
          { required: true, message: '请选择合同类型', trigger: 'submit' }
        ],
        company_id: [
          { required: true, message: '请选择公司', trigger: 'submit' }
        ],
        name: [{ required: true, message: '请输入合同名称', trigger: 'submit' }]
      }
    }
  },
  created() {
    this.setting.loading = true
    this.contractID = this.$route.params.uid

    this.getCompany()
    if (this.contractID) {
      this.contractDetail()
    } else {
      let user_info = JSON.parse(Cookies.get('user_info'))
      this.contractForm.applicant_name = user_info.name
      this.contractForm.applicant = user_info.id
      this.roles = user_info.roles.data[0]
      this.setting.loading = false
    }
  },
  methods: {
    contractDetail() {
      let args = {
        include: 'media'
      }
      contractDetail(this, this.contractID, args)
        .then(res => {
          let mediaIds = []
          let mediaData = res.media.data
          this.contractForm.applicant_name = res.applicant_name
          this.contractForm.type =
            res.type === '收款合同' ? 0 : res.type === '付款合同' ? 1 : 2
          this.contractForm.applicant = res.applicant
          this.contractForm.name = res.name
          this.contractForm.company_id = res.company_id
          this.contractForm.receive_date = res.receive_date
            ? res.receive_date.split(',')
            : []
          this.contractForm.remark = res.remark
          this.contractForm.contract_number = res.contract_number
          this.contractForm.amount = res.amount
          mediaData.map(r => {
            mediaIds.push(r.id)
          })
          this.contractForm.ids = mediaIds
          this.fileList = mediaData
          this.setting.loading = false
        })
        .catch(err => {
          this.setting.loading = false
          console.log(err)
        })
    },
    getCompany() {
      this.searchLoading = true
      getCompanyList(this)
        .then(res => {
          this.searchLoading = false
          this.companyList = res.data
        })
        .catch(err => {
          this.searchLoading = false
        })
    },
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
          file.raw.type === 'application/msword' ||
          file.raw.type ===
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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
        file.type === 'application/msword' ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      if (!isFile) {
        this.$message.error('上传文件仅支持doc(.docx)、.pdf格式!')
        return isFile
      }
    },
    // 上传成功后的处理
    handleSuccess(response, file, fileList) {
      this.fileList.push(response)
    },
    historyBack() {
      historyBack()
    },
    submit(formName) {
      let mediaIds = []
      if (this.fileList.length > 0) {
        this.fileList.map(r => {
          mediaIds.push(r.id)
        })
      }
      this.contractForm.ids = mediaIds.join(',')
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.setting.loading = true
          let args = {
            name: this.contractForm.name,
            company_id: this.contractForm.company_id,
            applicant: this.contractForm.applicant,
            type: this.contractForm.type,
            ids: this.contractForm.ids,
            remark: this.contractForm.remark
          }
          if (this.contractForm.type === 0) {
            if (!this.contractForm.receive_date.length) {
              this.$message({
                message: '预估收款时间必填',
                type: 'warning'
              })
              this.setting.loading = false
              return
            } else {
              let date = []
              this.contractForm.receive_date.map(r => {
                let dateTransform = handleDateTransform(r)
                date.push(dateTransform)
              })
              args.receive_date = date.join(',')
            }
            if (!this.contractForm.amount) {
              this.$message({
                message: '合同总额必填',
                type: 'warning'
              })
              this.setting.loading = false
              return
            } else {
              args.amount = this.contractForm.amount
            }
          }
          if (
            this.roles.name === 'legal-affairs' ||
            this.roles.name === 'legal-affairs-manager'
          ) {
            if (this.contractForm.contract_number === '') {
              this.$message({
                message: '请填写合同编号',
                type: 'warning'
              })
              this.setting.loading = false
              return
            }
            args.contract_number = this.contractForm.contract_number
          }
          // saveContract(this, args)
          //   .then(res => {
          //     this.$message({
          //       message: '添加成功',
          //       type: 'success'
          //     })
          //     this.$router.push({
          //       path: '/contract/list'
          //     })
          //     this.setting.loading = false
          //   })
          //   .catch(err => {
          //     this.setting.loading = false
          //     this.$message({
          //       message: err.response.data.message,
          //       type: 'warning'
          //     })
          //   })
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
