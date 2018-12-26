<template>
  <div 
    class="item-wrap-template">
    <div 
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText" 
      class="pane">
      <div 
        class="pane-title">
        合同{{ hide ? '详情' : '审批' }}
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
              label="合同类型:" 
              prop="type_name" >
              {{ contractForm.type_name }}
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="12">
            <el-form-item
              label="合同内容:" 
              prop="content" >
              <div 
                v-for="item in fileList" 
                :key="item.id">{{ item.name }}
                <span 
                  class="download" 
                  @click="handlePreview(item)">下载</span></div>
            </el-form-item>
          </el-col>
          <el-col :span="12"
            v-if="contractForm.type_name !== '付款合同'">
            <el-form-item 
              label="合同总额:" 
              prop="amount" >
              {{ contractForm.amount }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item 
              label="合同编号:" 
              prop="contract_number" >
              {{ contractForm.contract_number }}
            </el-form-item>
          </el-col>
          <el-col
            v-if="contractForm.type_name !== '付款合同'"
            :span="12">
            <el-form-item 
              label="预估收款日期:" 
              prop="receive_date" >
              {{ contractForm.receive_date }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          v-if="contractForm.legal_message"
          label="法务意见:"
          prop="legal_message">
          {{ contractForm.legal_message }}
        </el-form-item>
        <el-form-item
          v-if="contractForm.legal_ma_message"
          label="法务主管意见:" 
          prop="legal_ma_message">
          {{ contractForm.legal_ma_message }}
        </el-form-item>
         <el-form-item
          v-if="contractForm.bd_ma_message"
          label="bd主管意见:"
          prop="bd_ma_message">
          {{ contractForm.bd_ma_message }}
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
            @click="dialogFormVisible = true, rejectStatus=true, agreeStatus = false">驳回</el-button>
          <el-button 
            v-if="!hide"
            type="primary"
            size="small"
            @click="dialogFormVisible = true, rejectStatus=false, agreeStatus = true">审核通过</el-button>
          <el-button
            size="small"
            @click="historyBack">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog  
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :show-close="false"
      :title="rejectStatus === true ? '驳回理由': '审批' ">
      <el-form >
        <el-form-item
          :rules="[{ required: true, message: '请上传合同内容', trigger: 'submit' }]"
          v-if="!hide && legalAffairs && rejectStatus"
          label="合同内容" 
          prop="ids">
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
              style="color: #ff5722;font-size: 12px;">点击文件名称可以下载</div>
          </el-upload>
        </el-form-item>
        <el-form-item
          v-if="(legalAffairsManager || legalAffairs) && agreeStatus"
          :rules="[{ required: true, message: '请填写合同编号', trigger: 'submit' }]"
          label="合同编号" 
          prop="contact_number">
         <el-input
            v-model="contractForm.contract_number"
            :maxlength="80"
            :disabled="!legalAffairsManager && !legalAffairs"
            placeholder="请输入合同编号"
            class="text-input"/>
        </el-form-item>
        <el-form-item
          v-if="legalAffairsManager"
          :rules="[{ required: true, message: '请填写意见', trigger: 'submit' }]"
          label="意见" 
          prop="legal_ma_message">
          <el-input
            v-model="contractForm.legal_ma_message"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入内容"
            class="text-input"/>
        </el-form-item>
        <el-form-item
          v-if="legalAffairs"
          :rules="[{ required: true, message: '请填写意见', trigger: 'submit' }]"
          label="意见" 
          prop="legal_message">
          <el-input
            v-model="contractForm.legal_message"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入内容"
            class="text-input"/>
        </el-form-item>
        <el-form-item
          v-if="bdManager"
          :rules="[{ required: true, message: '请填写意见', trigger: 'submit' }]"
          label="意见" 
          prop="bd_ma_message">
          <el-input
            v-model="contractForm.bd_ma_message"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入内容"
            class="text-input"/>
        </el-form-item>
      </el-form>
      <div 
        slot="footer" 
        class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button 
          type="primary" 
          @click="rejectAuditingHandle">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  historyBack,
  contractDetail,
  auditingContract,
  Cookies,
  rejectContract
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
      rejectStatus: false,
      agreeStatus: false,
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
        remark: '',
        amount: '',
        bd_ma_message: '',
        legal_message: '',
        legal_ma_message: ''
      },
      hide: null
    }
  },
  computed: {
    // bd主管
    bdManager: function() {
      return this.roles.find(r => {
        return r.name === "bd-manager";
      });
    },
    // 法务
    legalAffairs: function() {
      return this.roles.find(r => {
        return r.name === "legal-affairs";
      });
    },
    // 法务主管
    legalAffairsManager: function() {
      return this.roles.find(r => {
        return r.name === "legal-affairs-manager";
      });
    }
  },
  created() {
    this.contractID = this.$route.params.uid
    this.hide = this.$route.query.hide
    let user_info = JSON.parse(Cookies.get('user_info'))
    this.roles = user_info.roles.data
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
          this.contractForm.type =
            res.type === '收款合同' ? 0 : res.type === '付款合同' ? 1 : 2
          this.contractForm.type_name = res.type
          this.contractForm.applicant = res.applicant
          this.contractForm.name = res.name
          this.contractForm.contract_number = res.contract_number
          this.contractForm.company_id = res.company_id
          this.contractForm.company_name = res.company_name
          this.contractForm.date = res.receive_date.split(',')
          this.contractForm.receive_date = res.receive_date
          this.contractForm.remark = res.remark
          this.contractForm.amount = res.amount
          this.contractForm.bd_ma_message = res.bd_ma_message
          this.contractForm.legal_message = res.legal_message
          this.contractForm.legal_ma_message = res.legal_ma_message
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
    rejectAuditingHandle() {
      let args = {}
      // 法务主管
      if (
        this.legalAffairsManager &&
        !this.contractForm.legal_ma_message
      ) {
        this.warningInfo()
        return
      } else {
        if (this.contractForm.legal_ma_message) {
          args.legal_ma_message = this.contractForm.legal_ma_message
        }
      }
      // 法务
      if (
        this.legalAffairs &&
        !this.contractForm.legal_message
      ) {
        this.warningInfo()
        return
      } else {
        if (this.contractForm.legal_message) {
          args.legal_message = this.contractForm.legal_message
        }
      }
      // bd主管
      if (this.bdManager && !this.contractForm.bd_ma_message) {
        this.warningInfo()
        return
      } else {
        if (this.contractForm.bd_ma_message) {
          args.bd_ma_message = this.contractForm.bd_ma_message
        }
      }
      // 审批处理
      if (this.agreeStatus) {
        if (!this.contractForm.contract_number) {
          this.$message({
            type: 'warning',
            message: '审批合同编号必填'
          })
          return
        } else {
          args.contract_number = this.contractForm.contract_number
        }
        this.auditing(this, this.contractID, args)
        return
      }
      // 驳回处理
      if (this.rejectStatus) {
        this.setting.loading = true
        // 法务
        if (this.legalAffairs) {
          let mediaIds = []
          if (this.fileList.length > 0) {
            this.fileList.map(r => {
              mediaIds.push(r.id)
            })
          } else {
            this.$message({
              message: '合同内容必须上传',
              type: 'warning'
            })
            this.dialogFormVisible = false
            return
          }
          this.contractForm.ids = mediaIds.join(',')
          args.ids = this.contractForm.ids
        }
        rejectContract(this, this.contractID, args)
          .then(res => {
            this.dialogFormVisible = false
            this.$message({
              message: '驳回成功',
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
        return
      }
    },
    warningInfo() {
      this.$message({
        type: 'warning',
        message: '意见必填'
      })
      this.setting.loading = false
    },
    auditing(obj, contractID, args) {
      auditingContract(obj, contractID, args)
        .then(res => {
          this.dialogFormVisible = false
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
          this.dialogFormVisible = false
          this.$message({
            message: err.response.data.message,
            type: 'warning'
          })
          this.setting.loading = false
        })
    },
    // 管理弹窗
    cancel() {
      this.dialogFormVisible = false
      if (this.legalAffairsManager) {
        this.contractForm.legal_ma_message = ''
      }
      if (this.legalAffairs) {
        this.contractForm.legal_message = ''
      }
      if (this.bdManager) {
        this.contractForm.bd_ma_message = ''
      }
      this.setting.loading = false
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
