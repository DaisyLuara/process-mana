<template>
  <div class="root">
    <div
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText"
      class="item-list-wrap"
    >
      <div class="item-content-wrap">
        <!-- 搜索 -->
        <div class="search-wrap">
          <el-form ref="searchForm" :model="searchForm" :inline="true" class="search-content">
            <el-form-item label prop="name">
              <el-input
                v-model="searchForm.name"
                clearable
                placeholder="请输入产品名称"
                class="item-input"
              />
            </el-form-item>
            <el-form-item label prop="color">
              <el-input
                v-model="searchForm.color"
                clearable
                placeholder="请输入颜色"
                class="item-input"
              />
            </el-form-item>
            <el-form-item label prop="store">
              <el-input
                v-model="searchForm.store"
                clearable
                placeholder="请输入仓库"
                class="item-input"
              />
            </el-form-item>
            <el-form-item label prop="position">
              <el-input
                v-model="searchForm.position"
                clearable
                placeholder="请输入库存位置"
                class="item-input"
              />
            </el-form-item>
            <el-form-item label>
              <el-button type="primary" size="small" @click="search('searchForm')">搜索</el-button>
              <el-button type="default" size="small" @click="resetSearch('searchForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 明细列表 -->
        <div class="total-wrap">
          <span class="label">总数:{{ pagination.total }}</span>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="ID:">
                  <span>{{ scope.row.id }}</span>
                </el-form-item>
                <el-form-item label="产品名称:">
                  <span>{{ scope.row.name }}</span>
                </el-form-item>
                <el-form-item label="产品颜色:">
                  <span>{{ scope.row.color }}</span>
                </el-form-item>
                <el-form-item label="仓库:">
                  <span>{{ scope.row.store }}</span>
                </el-form-item>
                <el-form-item label="库存位置:">
                  <span>{{ scope.row.position }}</span>
                </el-form-item>
                <el-form-item label="库存数量:">
                  <span>{{ scope.row.num }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="id" label="ID" min-width="80"/>
          <el-table-column :show-overflow-tooltip="true" prop="name" label="产品名称" min-width="100"/>
          <el-table-column :show-overflow-tooltip="true" prop="color" label="产品颜色" min-width="100"/>
          <el-table-column :show-overflow-tooltip="true" prop="store" label="仓库" min-width="80"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="position"
            label="库存位置"
            min-width="100"
          />
          <el-table-column :show-overflow-tooltip="true" prop="num" label="库存数量" min-width="100"/>
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
import {
  Button,
  Input,
  Table,
  TableColumn,
  Pagination,
  Form,
  FormItem,
  MessageBox
} from "element-ui";
import { getStorageDetailList } from "service";

export default {
  components: {
    "el-table": Table,
    "el-table-column": TableColumn,
    "el-button": Button,
    "el-input": Input,
    "el-pagination": Pagination,
    "el-form": Form,
    "el-form-item": FormItem
  },
  data() {
    return {
      searchForm: {
        name: "",
        color: "",
        store: "",
        position: ""
      },
      setting: {
        loading: false,
        loadingText: "拼命加载中"
      },
      pagination: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      tableData: []
    };
  },
  created() {
    // this.getStorageDetailList();
  },
  methods: {
    getStorageDetailList() {
      this.setting.loading = true;
      let args = {
        page: this.pagination.currentPage,
        name: this.searchForm.name,
        color: this.searchForm.color,
        store: this.searchForm.store,
        position: this.searchForm.position
      };
      if (!this.searchForm.name) {
        delete args.name;
      }
      if (!this.searchForm.color) {
        delete args.color;
      }
      if (!this.searchForm.store) {
        delete args.store;
      }
      if (!this.searchForm.position) {
        delete args.position;
      }
      getStorageDetailList(this, args)
        .then(res => {
          this.tableData = res.data;
          this.pagination.total = res.meta.pagination.total;
          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
        });
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getStorageDetailList();
    },
    search() {
      this.pagination.currentPage = 1;
      this.getStorageDetailList();
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getStorageDetailList();
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
    padding: 10px 30px 30px;
    .el-form-item {
      margin-bottom: 0;
    }
    .item-content-wrap {
      margin-top: 10px;
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
      .icon-item {
        padding: 10px;
        width: 50%;
      }
      .search-wrap {
        margin-top: 5px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 16px;
        align-items: center;
        margin-bottom: 10px;
        .el-form-item {
          margin-bottom: 10px;
        }
        .el-select {
          width: 200px;
        }
        .item-input {
          width: 200px;
        }
        .warning {
          background: #ebf1fd;
          padding: 8px;
          margin-left: 10px;
          color: #444;
          font-size: 12px;
          i {
            color: #4a8cf3;
            margin-right: 5px;
          }
        }
      }
      .highlighted {
        color: red;
      }
      .total-wrap {
        margin-top: 5px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        font-size: 16px;
        align-items: center;
        margin-bottom: 10px;
        .label {
          font-size: 14px;
          margin: 5px 0;
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
