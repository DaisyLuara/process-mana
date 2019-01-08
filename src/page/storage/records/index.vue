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
            <el-form-item label prop="sku">
              <el-select
                v-model="searchForm.sku"
                :loading="searchLoading"
                filterable
                clearable
                placeholder="请选择SKU"
              >
                <el-option
                  v-for="item in skuList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label prop="out_location">
              <el-input
                v-model="searchForm.out_location"
                clearable
                placeholder="请输入调出库位"
                class="item-input"
              />
            </el-form-item>
            <el-form-item label prop="into_location">
              <el-input
                v-model="searchForm.into_location"
                clearable
                placeholder="请输入调入库位"
                class="item-input"
              />
            </el-form-item>
            <el-form-item label>
              <el-button type="primary" size="small" @click="search('searchForm')">搜索</el-button>
              <el-button type="default" size="small" @click="resetSearch('searchForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 调拨记录列表 -->
        <div class="total-wrap">
          <span class="label">总数:{{ pagination.total }}</span>
          <div>
            <!-- v-if="purchasing"  -->
            <el-button type="success" size="small" @click="addRecords">新增调拨记录</el-button>
          </div>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="ID:">
                  <span>{{ scope.row.id }}</span>
                </el-form-item>
                <el-form-item label="SKU:">
                  <span>{{ scope.row.sku }}</span>
                </el-form-item>
                <el-form-item label="产品名称:">
                  <span>{{ scope.row.name }}</span>
                </el-form-item>
                <el-form-item label="产品颜色:">
                  <span>{{ scope.row.color }}</span>
                </el-form-item>
                <el-form-item label="调出库位:">
                  <span>{{ scope.row.out_location }}</span>
                </el-form-item>
                <el-form-item label="调入库位:">
                  <span>{{ scope.row.into_location }}</span>
                </el-form-item>
                <el-form-item label="调拨数量:">
                  <span>{{ scope.row.num }}</span>
                </el-form-item>
                <el-form-item label="时间:">
                  <span>{{ scope.row.updated_at }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="id" label="ID" min-width="80"/>
          <el-table-column :show-overflow-tooltip="true" prop="sku" label="SKU" min-width="100"/>
          <el-table-column :show-overflow-tooltip="true" prop="name" label="产品名称" min-width="100"/>
          <el-table-column :show-overflow-tooltip="true" prop="color" label="产品颜色" min-width="100"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="out_location"
            label="调出库位"
            min-width="80"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="into_location"
            label="调入库位"
            min-width="80"
          />
          <el-table-column :show-overflow-tooltip="true" prop="num" label="调拨数量" min-width="80"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="updated_at"
            label="时间"
            min-width="80"
          />
          <el-table-column label="操作" min-width="100">
            <template slot-scope="scope">
              <!-- v-if="purchasing" -->
              <el-button size="mini" type="primary" @click="editRecords(scope.row)">编辑</el-button>
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
import { getRecordsList, Cookies } from "service";

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
      searchLoading: false,
      skuList: [],
      searchForm: {
        sku: "",
        out_location: "",
        into_location: ""
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
      tableData: [],
      roles: []
    };
  },
  computed: {
    // 采购
    purchasing: function() {
      return this.roles.find(r => {
        return r.name === "purchasing";
      });
    }
  },
  created() {
    let user_info = JSON.parse(Cookies.get("user_info"));
    this.roles = user_info.roles.data;
    // this.getRecordsList();
  },
  methods: {
    addRecords() {
      this.$router.push({
        path: "/storage/records/add"
      });
    },
    editRecords(data) {
      this.$router.push({
        path: "/storage/records/edit/" + data.id
      });
    },
    getRecordsList() {
      this.setting.loading = true;
      let args = {
        page: this.pagination.currentPage,
        sku: this.searchForm.sku,
        out_location: this.searchForm.out_location,
        into_location: this.searchForm.into_location
      };

      if (this.searchForm.sku === "") {
        delete args.sku;
      }
      if (!this.searchForm.out_location) {
        delete args.out_location;
      }
      if (!this.searchForm.into_location) {
        delete args.into_location;
      }
      getRecordsList(this, args)
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
      this.getRecordsList();
    },
    search() {
      this.pagination.currentPage = 1;
      this.getRecordsList();
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getRecordsList();
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
