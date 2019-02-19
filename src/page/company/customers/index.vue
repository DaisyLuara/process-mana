<template>
  <div v-loading="setting.loading" :element-loading-text="setting.loadingText" class="root">
    <div class="customer-list-wrap">
      <div class="customer-content-wrap">
        <div class="search-wrap">
          <el-form ref="searchForm" :model="searchForm" :inline="true">
            <el-form-item label prop="name">
              <el-input v-model="searchForm.name" placeholder="请输入公司名称" style="width: 200px;"/>
            </el-form-item>
            <el-form-item label prop="internal_name">
              <el-input
                v-model="searchForm.internal_name"
                placeholder="请输入公司简称"
                style="width: 200px;"
              />
            </el-form-item>
            <el-form-item label prop="category">
              <el-select v-model="searchForm.category" placeholder="请选择公司属性" filterable clearable>
                <el-option
                  v-for="item in categoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label prop="status">
              <el-select v-model="searchForm.status" placeholder="请选择状态" filterable clearable>
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label prop="bd_user_id">
              <el-input
                v-model="searchForm.bd_user_id"
                placeholder="请输入所属BD"
                style="width: 200px;"
              />
            </el-form-item>
            <el-button type="primary" size="small" @click="search('searchForm')">搜索</el-button>
            <el-button type="default" size="small" @click="resetSearch('searchForm')">重置</el-button>
          </el-form>
        </div>
        <div class="actions-wrap">
          <span class="label">公司数量: {{ pagination.total }}</span>
          <el-button size="small" type="success" @click="linkToAddClient">新增公司</el-button>
        </div>
        <el-table :data="customerList" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="ID:">
                  <span>{{ scope.row.id }}</span>
                </el-form-item>
                <el-form-item label="公司全称:">
                  <span>{{ scope.row.name }}</span>
                </el-form-item>
                <el-form-item label="公司地址:">
                  <span>{{ scope.row.address }}</span>
                </el-form-item>
                <el-form-item label="公司简称:">
                  <span>{{ scope.row.internal_name }}</span>
                </el-form-item>
                <el-form-item label="公司属性:">
                  <span>{{ scope.row.category === 0 ? '客户' : scope.row.category === 1? '供应商': ''}}</span>
                </el-form-item>
                <el-form-item label="状态:">
                  <span>{{ statusHanlde(scope.row) }}</span>
                </el-form-item>
                <el-form-item label="所属BD:">
                  <span>{{ scope.row.bdUser ? scope.row.bdUser.name :'' }}</span>
                </el-form-item>
                <el-form-item label="创建时间:">
                  <span>{{ scope.row.created_at }}</span>
                </el-form-item>
                <el-form-item label="修改时间:">
                  <span>{{ scope.row.updated_at }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="name" label="公司全称" min-width="100"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="address"
            label="公司地址"
            min-width="100"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="internal_name"
            label="公司简称"
            min-width="80"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="category"
            label="公司属性"
            min-width="80"
          >
            <template
              slot-scope="scope"
            >{{ scope.row.category === 0 ? '客户' : scope.row.category === 1? '供应商': ''}}</template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">{{ statusHanlde(scope.row) }}</template>
          </el-table-column>
          <el-table-column prop="bd_user_id" label="所属BD">
            <template slot-scope="scope">{{ scope.row.bdUser ? scope.row.bdUser.name :''}}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="updated_at"
            label="修改时间"
            min-width="100"
          />
          <el-table-column label="操作" width="280">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="linkToEdit(scope.row.id)">修改</el-button>
              <el-button size="small" @click="showContactDetail(scope.row.id,scope.row.name)">联系人详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrap">
          <el-pagination
            :total="pagination.total"
            :page-size="pagination.pageSize"
            :current-page="pagination.currentPage"
            layout="prev, pager, next, jumper, total"
            @current-change="changePage"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCustomerList } from "service";

import {
  Button,
  Input,
  Table,
  TableColumn,
  Pagination,
  Form,
  FormItem,
  MessageBox,
  Select,
  Option
} from "element-ui";

export default {
  components: {
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-button": Button,
    "el-input": Input,
    "el-pagination": Pagination,
    "el-form": Form,
    "el-form-item": FormItem,
    "el-select": Select,
    "el-option": Option
  },
  data() {
    return {
      searchForm: {
        name: "",
        internal_name: "",
        category: "",
        status: "",
        bd_user_id: ""
      },
      statusList: [
        {
          value: 1,
          label: "待合作"
        },
        {
          value: 2,
          label: "合作中"
        },
        {
          value: 3,
          label: "已结束"
        }
      ],
      categoryList: [
        {
          id: 0,
          name: "客户"
        },
        {
          id: 1,
          name: "供应商"
        }
      ],
      setting: {
        loading: false,
        loadingText: "拼命加载中"
      },
      pagination: {
        total: 100,
        pageSize: 10,
        currentPage: 1
      },
      customerList: []
    };
  },
  created() {
    this.getCustomerList();
  },
  methods: {
    search(formName) {
      this.pagination.currentPage = 1;
      this.getCustomerList();
    },
    statusHanlde(item) {
      switch (item.status) {
        case 1:
          return "待合作";
          break;
        case 2:
          return "合作中";
          break;
        case 3:
          return "已结束";
          break;
      }
    },
    getCustomerList() {
      if (this.setting.loading == true) {
        return false;
      }
      let pageNum = this.pagination.currentPage;
      let args = {
        include: "user,bdUser",
        page: pageNum,
        name: this.searchForm.name,
        internal_name: this.searchForm.internal_name,
        category: this.searchForm.category,
        status: this.searchForm.status,
        bd_user_id: this.searchForm.bd_user_id
      };
      this.setting.loadingText = "拼命加载中";
      this.setting.loading = true;
      if (this.searchForm.name === "") {
        delete args.name;
      }
      if (this.searchForm.internal_name === "") {
        delete args.internal_name;
      }
      if (this.searchForm.category === "") {
        delete args.category;
      }
      if (this.searchForm.status === "") {
        delete args.status;
      }
      if (this.searchForm.bd_user_id === "") {
        delete args.bd_user_id;
      }
      return getCustomerList(this, args)
        .then(response => {
          this.setting.loading = false;
          this.customerList = response.data;
          this.pagination.total = response.meta.pagination.total;
          this.handleRole();
        })
        .catch(error => {
          this.setting.loading = false;
        });
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getCustomerList();
    },
    linkToAddClient() {
      this.$router.push({
        path: "/company/customers/add"
      });
    },
    linkToEdit(id) {
      this.$router.push({
        path: "/company/customers/edit/" + id
      });
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getCustomerList();
    },
    showContactDetail(id, name) {
      this.$router.push({
        path: "/company/customers/contacts",
        query: {
          id: id,
          name: name
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.root {
  // padding: 10px;
  font-size: 14px;
  color: #5e6d82;
  .customer-list-wrap {
    background: #fff;
    padding: 30px;
    .customer-content-wrap {
      .demo-table-expand {
        font-size: 0;
      }
      .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
      }
      .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
      }
      .el-form-item {
        margin-bottom: 10px;
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
