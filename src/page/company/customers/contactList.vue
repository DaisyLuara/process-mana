<template>
  <div 
    v-loading="setting.loading" 
    :element-loading-text="setting.loadingText" 
    class="root">
    <div class="item-list-wrap">
      <div class="item-content-wrap">
        <div class="actions-wrap">
          <span class="label">{{ companyName }} {{ total }} 人</span>
          <el-button 
            size="small" 
            type="success" 
            @click="linkToAddItem">新增联系人</el-button>
        </div>
        <el-table 
          :data="contactList" 
          style="width: 100%">
          <el-table-column 
            :show-overflow-tooltip="true" 
            prop="name" 
            label="联系人名称"/>
          <el-table-column 
            :show-overflow-tooltip="true" 
            prop="position" 
            label="联系人职务"/>
          <el-table-column 
            :show-overflow-tooltip="true" 
            prop="role" 
            label="角色">
            <template
              slot-scope="scope"
            >{{ scope.row.roles ? scope.row.roles.data[0].display_name : '' }}</template>
          </el-table-column>
          <el-table-column 
            prop="phone" 
            label="联系人手机号"/>
          <el-table-column 
            prop="telephone" 
            label="联系人座机号"/>
          <el-table-column 
            :show-overflow-tooltip="true" 
            prop="created_at" 
            label="创建时间"/>
          <el-table-column 
            :show-overflow-tooltip="true" 
            prop="updated_at" 
            label="修改时间"/>
          <el-table-column 
            label="操作" 
            width="130">
            <template slot-scope="scope">
              <el-button 
                size="small" 
                type="primary" 
                @click="linkToEdit(scope.row.id)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { getContactList } from "service";
import {
  Button,
  Input,
  Table,
  TableColumn,
  Form,
  FormItem,
  MessageBox
} from "element-ui";

export default {
  components: {
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-button": Button,
    "el-input": Input,
    "el-form": Form,
    "el-form-item": FormItem
  },
  data() {
    return {
      setting: {
        loading: false,
        loadingText: "拼命加载中"
      },
      companyName: "",
      total: 0,
      contactList: []
    };
  },
  created() {
    this.companyName = this.$route.query.name;
    this.getContactList();
  },
  methods: {
    getContactList() {
      let uid = this.$route.query.id;
      this.setting.loadingText = "拼命加载中";
      this.setting.loading = true;
      let args = {
        include: "company.user,roles"
      };
      getContactList(this, uid, args)
        .then(response => {
          this.contactList = response.data;
          this.total = response.meta.pagination.total;
          this.setting.loading = false;
        })
        .catch(error => {
          this.setting.loading = false;
        });
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
    },
    linkToAddItem() {
      this.$router.push({
        path: "/company/customers/c_add",
        query: {
          pid: this.$route.query.id,
          name: this.companyName
        }
      });
    },
    linkToEdit(id) {
      this.$router.push({
        path: "/company/customers/c_edit",
        query: {
          uid: id,
          pid: this.$route.query.id,
          name: this.companyName
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.root {
  font-size: 14px;
  color: #5e6d82;
  .item-list-wrap {
    background: #fff;
    padding: 30px;
    .el-form-item {
      margin-bottom: 0;
    }
    .item-content-wrap {
      .show-item-wrap {
        margin-bottom: 15px;
        .customer-info-wrap {
          .clinet-info-title {
            font-size: 24px;
            font-weight: 700;
          }
          .customer-content {
            padding: 10px;
            .item-info {
              margin-bottom: 10px;
              font-size: 16px;
              color: #444;
              word-wrap: break-word;
              img {
                width: 50%;
              }
            }
          }
        }
        .data-wrap {
          .data-title {
            font-size: 24px;
            font-weight: 700;
          }
        }
      }
      .actions-wrap {
        margin-top: 5px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 16px;
        align-items: center;
        margin-bottom: 10px;
        .label {
          font-size: 14px;
        }
      }
      .pagination-wrap {
        margin: 10px auto;
        text-align: right;
      }
    }
  }
}
</style>
