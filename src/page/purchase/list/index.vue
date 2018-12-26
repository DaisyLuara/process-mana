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
                placeholder="请输入硬件名称"
                class="item-input"
              />
            </el-form-item>
            <el-form-item label prop="factory">
              <el-input
                v-model="searchForm.factory"
                clearable
                placeholder="请输入所属工厂"
                class="item-input"
              />
            </el-form-item>
            <el-form-item label>
              <el-button type="primary" size="small" @click="search('searchForm')">搜索</el-button>
              <el-button type="default" size="small" @click="resetSearch('searchForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 合同列表 -->
        <div class="total-wrap">
          <span class="label">总数:{{ pagination.total }}</span>
          <div>
            <!-- v-if="purchase"  -->
            <el-button size="small" type="success" @click="addHardware">新增硬件</el-button>
          </div>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="硬件名称:">
                  <span>{{ scope.row.name }}</span>
                </el-form-item>
                <el-form-item label="硬件型号:">
                  <span>{{ scope.row.model }}</span>
                </el-form-item>
                <el-form-item label="所属工厂:">
                  <span>{{ scope.row.factory }}</span>
                </el-form-item>
                <el-form-item label="工厂库存数:">
                  <span>{{ scope.row.factory_amount }}</span>
                </el-form-item>
                <el-form-item label="仓库库存数:">
                  <span>{{ scope.row.store_amount }}</span>
                </el-form-item>
                <el-form-item label="公司库存数:">
                  <span>{{ scope.row.company_amount }}</span>
                </el-form-item>
                <el-form-item label="总库存数:">
                  <span>{{ scope.row.total_amount }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="name" label="硬件名称" min-width="100"/>
          <el-table-column :show-overflow-tooltip="true" prop="model" label="硬件型号" min-width="150"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="factory"
            label="所属工厂"
            min-width="150"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="factory_amount"
            label="工厂库存数"
            min-width="150"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="store_amount"
            label="仓库库存数"
            min-width="150"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="company_amount"
            label="公司库存数"
            min-width="150"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            prop="total_amount"
            label="总库存数"
            min-width="150"
          />
          <el-table-column label="操作" min-width="200">
            <template slot-scope="scope">
              <el-button
                v-if="purchase"
                size="mini"
                type="primary"
                @click="editHardware(scope.row)"
              >编辑</el-button>
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
  MessageBox
} from "element-ui";
import { getPurchaseList, Cookies } from "service";

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
        factory: ""
      },
      roles: {},
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
  computed: {
    // 采购
    purchase: function() {
      return this.roles.find(r => {
        return r.name === "purchase";
      });
    }
  },
  created() {
    // this.getPurchaseList();
    let user_info = JSON.parse(Cookies.get("user_info"));
    this.roles = user_info.roles.data;
  },
  methods: {
    getPurchaseList() {
      this.setting.loading = true;
      let args = {
        page: this.pagination.currentPage,
        name: this.searchForm.name
      };
      if (!this.searchForm.name) {
        delete args.name;
      }
      getPurchaseList(this, args)
        .then(res => {
          this.tableData = res.data;
          this.pagination.total = res.meta.pagination.total;
          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
        });
    },
    addHardware() {
      this.$router.push({
        path: "/purchase/list/add"
      });
    },
    editHardware(data) {
      this.$router.push({
        path: "/purchase/list/edit/" + data.id
      });
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getPurchaseList();
    },
    search() {
      this.pagination.currentPage = 1;
      this.getPurchaseList();
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getPurchaseList();
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
        .search-content {
          width: 800px;
        }
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
