<template>
  <div class="root">
    <div
      v-loading="setting.loading"
      :element-loading-text="setting.loadingText"
      class="item-list-wrap"
    >
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/purchase/list' }">
          <span>采购库存</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>库存明细</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="item-purchase-wrap">
        <!-- 搜索 -->
        <div class="search-wrap">
          <el-form ref="searchForm" :model="searchForm" :inline="true" class="search-content">
            <el-form-item label prop="source">
              <el-input
                v-model="searchForm.source"
                clearable
                placeholder="请输入出处"
                class="item-input"
              />
            </el-form-item>
            <el-form-item label prop="action">
              <el-input
                v-model="searchForm.action"
                clearable
                placeholder="请输入硬件性质"
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
            <el-button size="small" type="success" @click="addDetail">新增库存明细</el-button>
          </div>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="ID:">
                  <span>{{ scope.row.id }}</span>
                </el-form-item>
                <el-form-item label="硬件型号:">
                  <span>{{ scope.row.model }}</span>
                </el-form-item>
                <el-form-item label="硬件颜色:">
                  <span>{{ scope.row.color }}</span>
                </el-form-item>
                <el-form-item label="硬件性质:">
                  <span>{{ scope.row.action }}</span>
                </el-form-item>
                <el-form-item label="调整出处:">
                  <span>{{ scope.row.source }}</span>
                </el-form-item>
                <el-form-item label="调整形式:">
                  <span>{{ scope.row.change }}</span>
                </el-form-item>
                <el-form-item label="调整数量:">
                  <span>{{ scope.row.num }}</span>
                </el-form-item>
                <el-form-item label="原总库存:">
                  <span>{{ scope.row.hardware.old_stock }}</span>
                </el-form-item>
                <el-form-item label="现总库存:">
                  <span>{{ scope.row.hardware.now_stock }}</span>
                </el-form-item>
                <el-form-item label="创建时间:">
                  <span>{{ scope.row.created_at }}</span>
                </el-form-item>
                <el-form-item label="更新时间:">
                  <span>{{ scope.row.updated_at }}</span>
                </el-form-item>
                <el-form-item label="备注:">
                  <span>{{ scope.row.remark }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="id" label="ID" min-width="80"/>
          <el-table-column :show-overflow-tooltip="true" prop="model" label="硬件型号" min-width="80"/>
          <el-table-column :show-overflow-tooltip="true" prop="color" label="硬件颜色" min-width="80"/>
          <el-table-column :show-overflow-tooltip="true" prop="action" label="硬件性质" min-width="80"/>
          <el-table-column :show-overflow-tooltip="true" prop="source" label="调整出处" min-width="80"/>
          <el-table-column :show-overflow-tooltip="true" prop="change" label="调整形式" min-width="80"/>
          <el-table-column :show-overflow-tooltip="true" prop="num" label="调整数量" min-width="100"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="old_stock"
            label="原总库存"
            min-width="80"
          >
            <template slot-scope="scope">{{ scope.row.hardware.old_stock }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="now_stock"
            label="现总库存"
            min-width="80"
          >
            <template slot-scope="scope">{{ scope.row.hardware.now_stock }}</template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="created_at"
            label="创建时间"
            min-width="100"
          />
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
  Breadcrumb,
  BreadcrumbItem
} from "element-ui";
import { getDetialsList, Cookies } from "service";

export default {
  components: {
    "el-breadcrumb": Breadcrumb,
    "el-breadcrumb-item": BreadcrumbItem,
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
        action: "",
        source: ""
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
      parentInfo: {
        model: "",
        color: "",
        detailId: ""
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
    let user_info = JSON.parse(Cookies.get("user_info"));
    this.roles = user_info.roles.data;
    this.parentInfo.color = this.$route.query.color;
    this.parentInfo.model = this.$route.query.model;
    this.parentInfo.detailId = this.$route.params.uid;
    this.getDetialsList();
  },
  methods: {
    getDetialsList() {
      this.setting.loading = true;
      let args = {
        page: this.pagination.currentPage,
        include: "hardware",
        id: this.parentInfo.detailId,
        action: this.searchForm.action,
        source: this.searchForm.source
      };
      if (!this.searchForm.action) {
        delete args.action;
      }
      if (!this.searchForm.source) {
        delete args.source;
      }
      getDetialsList(this, args)
        .then(res => {
          this.tableData = res.data;
          this.pagination.total = res.meta.pagination.total;
          this.setting.loading = false;
        })
        .catch(err => {
          this.setting.loading = false;
        });
    },
    addDetail() {
      this.$router.push({
        path: "/purchase/list/saveDetail",
        query: {
          model: this.parentInfo.model,
          color: this.parentInfo.color,
          pid: this.parentInfo.detailId
        }
      });
    },
    editDetail(data) {
      let _this = this;
      this.$router.push({
        path: "/purchase/list/saveDetail/" + data.id,
        query: {
          pid: _this.parentInfo.detailId
        }
      });
    },
    changePage(currentPage) {
      this.pagination.currentPage = currentPage;
      this.getDetialsList();
    },
    search() {
      this.pagination.currentPage = 1;
      this.getDetialsList();
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getDetialsList();
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
    .item-purchase-wrap {
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
