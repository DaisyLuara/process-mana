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
                  :key="item.sku"
                  :label="item.sku"
                  :value="item.sku"
                />
              </el-select>
            </el-form-item>
            <el-form-item label prop="warehouse">
              <el-select
                v-model="searchForm.warehouse"
                :loading="searchLoading"
                filterable
                clearable
                placeholder="请选择仓库"
              >
                <el-option
                  v-for="item in warehouseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label prop="location">
              <el-select
                v-model="searchForm.location"
                :loading="searchLoading"
                filterable
                clearable
                placeholder="请选择库存位置"
              >
                <el-option
                  v-for="item in locationList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
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
                <el-form-item label="SKU:">
                  <span>{{ scope.row.sku }}</span>
                </el-form-item>
                <el-form-item label="仓库:">
                  <span>{{ scope.row.warehouse }}</span>
                </el-form-item>
                <el-form-item label="库存位置:">
                  <span>{{ scope.row.location }}</span>
                </el-form-item>
                <el-form-item label="库存数量:">
                  <span>{{ scope.row.stock }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="id" label="ID" min-width="80"/>
          <el-table-column :show-overflow-tooltip="true" prop="sku" label="SKU" min-width="100"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="warehouse"
            label="仓库"
            min-width="80"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="location"
            label="库存位置"
            min-width="100"
          />
          <el-table-column :show-overflow-tooltip="true" prop="stock" label="库存数量" min-width="100"/>
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
import {
  getStorageDetailList,
  getSearchSku,
  getSearchLocation,
  getSearchStorageList
} from "service";

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
      skuList: [],
      warehouseList: [],
      locationList: [],
      searchLoading: false,
      searchForm: {
        sku: "",
        warehouse: "",
        location: ""
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
    this.searchForm.location = this.$route.query.pid
    this.getSearchSku();
    this.getSearchLocation();
    this.getStorageDetailList();
    this.getSearchStorageList();
  },
  methods: {
    getSearchStorageList() {
      this.searchLoading = true;
      getSearchStorageList(this)
        .then(res => {
          this.warehouseList = res;
        })
        .catch(err => {
          this.searchLoading = false;
          this.$message({
            message: err.response.data.message,
            type: "success"
          });
        });
    },
    getSearchLocation() {
      this.searchLoading = true;
      getSearchLocation(this)
        .then(res => {
          this.locationList = res;
          this.searchLoading = false;
        })
        .catch(err => {
          this.searchLoading = false;

          this.$message({
            message: err.response.data.message,
            type: "success"
          });
        });
    },
    getSearchSku() {
      this.searchLoading = true;
      getSearchSku(this)
        .then(res => {
          this.skuList = res;
          this.searchLoading = false;
        })
        .catch(err => {
          this.searchLoading = false;
          this.$message({
            message: err.response.data.message,
            type: "success"
          });
        });
    },
    getStorageDetailList() {
      this.setting.loading = true;
      let args = {
        page: this.pagination.currentPage,
        sku: this.searchForm.sku,
        warehouse: this.searchForm.warehouse,
        location: this.searchForm.location
      };
      if (this.searchForm.sku === "") {
        delete args.sku;
      }
      if (!this.searchForm.warehouse) {
        delete args.warehouse;
      }
      if (!this.searchForm.location) {
        delete args.location;
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
