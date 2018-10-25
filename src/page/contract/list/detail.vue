<template>
  <div 
    class="item-wrap-template">
    <div 
      class="topbar">
      <el-breadcrumb 
        separator="/">
        <el-breadcrumb-item 
          :to="'/contract/list'">合同管理</el-breadcrumb-item>
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
        合同{{hide ? '详情' : '审批' }}
      </div>
      <el-form
        ref="contractForm"
        :model="contractForm"
        label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="公司名称:" 
              prop="company_name" >
              {{ contractForm.company_name }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="申请人:" 
              prop="applicant_name" >
              {{ contractForm.applicant_name }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="合同名称:" 
              prop="name" >
              {{ contractForm.name }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item 
              label="合同编号:" 
              prop="contract_number" >
              {{ contractForm.contract_number }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="合同类型:" 
              prop="type_name" >
              {{ contractForm.type_name }}
            </el-form-item>
          </el-col>
          <el-col
            :span="12">
            <el-form-item 
              label="收款日期:" 
              prop="receive_date" >
              {{ contractForm.receive_date }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="合同内容:" 
          prop="content" >
          <div v-for="item in fileList" :key="item.id">{{ item.name }}<span class="download" @click="handlePreview(item)">下载</span></div>
        </el-form-item>
        <el-form-item
          label="备注:" 
          prop="remark">
          {{ contractForm.remark }}
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="!hide"
            type="danger"
            size="small"
            @click="dialogFormVisible = true">驳回</el-button>
          <el-button 
            v-if="!hide"
            type="primary"
            size="small"
            @click="auditing">审核通过</el-button>
          <el-button
            size="small"
            @click="historyBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="驳回理由" :visible.sync="dialogFormVisible">
      <el-form >
        <el-form-item
          v-if="!hide && roles.name === 'legal-affairs'"
          label="合同内容" 
          prop="ids" 
          :rules="[{ required: true, message: '请上传文件', trigger: 'submit' }]">
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
              class="el-upload__tip">支持文件类型：doc(.docx)、.wps、.pdf、.txt</div>
            <div 
              v-if="fileList.length !==0" 
              slot="tip" 
              style="color: #ff5722;font-size: 12px;">点击文件名称可以下载</div>
          </el-upload>
        </el-form-item>
        <el-form-item
          label="备注:" 
          prop="remark">
          <el-input
            v-model="contractForm.remark"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            :maxlength="180"
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
  </div>
</template>

<script>
import {
  historyBack,
  contractDetail,
  modifyContract,
  auditingContract
} from 'service'
import auth from 'service/auth'

import {
  Form,
  FormItem,
  Button,
  Row,
  MessageBox,
  Col,
  Input,
  Upload,
  Dialog
} from 'element-ui'
const SERVER_URL = process.env.SERVER_URL

export default {
  components: {
    ElRow: Row,
    ElCol: Col,
    ElForm: Form,
    ElFormItem: FormItem,
    ElButton: Button,
    ElInput: Input,
    ElDialog: Dialog,
    ElUpload: Upload
  },
  data() {
    return {
      dialogFormVisible: false,
      roles: {},
      SERVER_URL: SERVER_URL,
      formHeader: {
        Authorization: 'Bearer ' + auth.getToken()
      },
      fileList: [],
      setting: {
        isOpenSelectAll: true,
        loading: false,
        loadingText: '拼命加载中'
      },
      contractForm: {
        company_name: '',
        company_id: '',
        applicant_name: '',
        applicant: '',
        name: '',
        contract_number: '',
        type: '',
        type_name: '',
        date: [],
        receive_date: '',
        ids: '',
        remark: ''
      },
      hide: null
    }
  },
  created() {
    this.contractID = this.$route.params.uid
    this.hide = this.$route.query.hide
    let user_info = JSON.parse(localStorage.getItem('user_info'))
    this.roles = user_info.roles.data[0]
    this.contractDetail()
  },
  methods: {
    historyBack() {
      historyBack()
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    beforeRemove(file, fileList) {
      if (file.type) {
        return this.$confirm(`确定移除 ${file.name}？`)
      } else {
        const isFile =
          file.raw.type === 'application/vnd.ms-works' ||
          file.raw.type === 'text/plain' ||
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
    handlePreview(file) {
      let url = file.url
      let a = document.createElement('a')
      a.href = url
      a.download = 'download'
      a.click()
      window.URL.revokeObjectURL(url)
    },
    beforeUpload(file) {
      const isFile =
        file.type === 'application/vnd.ms-works' ||
        file.type === 'text/plain' ||
        file.type === 'application/pdf' ||
        file.type === 'application/msword' ||
        file.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      if (!isFile) {
        this.$message.error(
          '上传文件仅支持doc(.docx)、.wps、.pdf、.txt五种格式!'
        )
        return isFile
      }
    },
    // 上传成功后的处理
    handleSuccess(response, file, fileList) {
      this.fileList.push(response)
    },
    contractDetail() {
      this.setting.loading = true
      let args = {
        include: 'media'
      }
      contractDetail(this, this.contractID, args)
        .then(res => {
          let mediaIds = []
          let mediaData = res.media.data
          this.contractForm.applicant_name = res.applicant_name
          this.contractForm.type = res.type === '收款合同' ? 0 : 1
          this.contractForm.type_name = res.type
          this.contractForm.applicant = res.applicant
          this.contractForm.name = res.name
          this.contractForm.contract_number = res.contract_number
          this.contractForm.company_id = res.company_id
          this.contractForm.company_name = res.company_name
          this.contractForm.date = res.receive_date.split(',')
          this.contractForm.receive_date = res.receive_date
          this.contractForm.remark = res.remark
          mediaData.map(r => {
            mediaIds.push(r.id)
          })
          this.contractForm.ids = mediaIds
          this.fileList = mediaData
          this.setting.loading = false
        })
        .catch(err => {
          this.setting.loading = false
          this.$message({
            message: err.response.data.message,
            type: 'warning'
          })
        })
    },
    auditing() {
      this.setting.loading = true
      this.$confirm('确定审核通过吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.setting.loadingText = '审核通过中'
          this.setting.loading = true
          auditingContract(this, this.contractID)
            .then(res => {
              this.$message({
                message: '审批通过',
                type: 'success'
              })
              this.$router.push({
                path: '/contract/list'
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
      let mediaIds = []
      if (this.fileList.length > 0) {
        this.fileList.map(r => {
          mediaIds.push(r.id)
        })
      }
      this.contractForm.ids = mediaIds.join(',')
      let args = {}
      if (this.roles.name === 'legal-affairs') {
        args = {
          ids: this.contractForm.ids,
          remark: this.contractForm.remark
        }
      } else {
        args = {
          remark: this.contractForm.remark
        }
      }
      modifyContract(this, this.contractID, args)
        .then(res => {
          this.dialogFormVisible = false
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$router.push({
            path: '/contract/list'
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
    .download {
      color: #fff;
      font-size: 10px;
      padding: 3px 5px;
      background: #77a245;
      border-radius: 5px;
      margin-left: 5px;
      cursor: pointer;
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
