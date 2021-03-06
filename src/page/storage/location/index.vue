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
          <el-form 
            ref="searchForm" 
            :model="searchForm" 
            :inline="true" 
            class="search-content">
            <el-form-item 
              label 
              prop="name">
              <el-input
                v-model="searchForm.name"
                clearable
                placeholder="请输入库位名称"
                class="item-input"
              />
            </el-form-item>
            <el-form-item label>
              <el-button 
                type="primary" 
                size="small" 
                @click="search('searchForm')">搜索</el-button>
              <el-button 
                type="default" 
                size="small" 
                @click="resetSearch('searchForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 库位列表 -->
        <div class="total-wrap">
          <span class="label">总数:{{ pagination.total }}</span>
          <div>
            <el-button 
              v-if="purchasing" 
              type="success" 
              size="small" 
              @click="addLocation">新增库位</el-button>
            <el-button
              size="small"
              @click="download"
            >下载</el-button>
          </div>
        </div>
        <el-table 
          :data="tableData" 
          style="width: 100%">
          <el-table-column 
            :show-overflow-tooltip="true" 
            prop="id" 
            label="ID" 
            min-width="80"/>
          <el-table-column 
            :show-overflow-tooltip="true" 
            prop="name" 
            label="库位" 
            min-width="100"/>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="warehouse"
            label="所属仓库"
            min-width="100"
          />
          <el-table-column 
            label="操作" 
            min-width="100">
            <template slot-scope="scope">
              <el-button 
                v-if="purchasing" 
                size="mini" 
                @click="editLocation(scope.row)">编辑</el-button>
              <el-button 
                size="mini" 
                type="primary" 
                @click="recordsList(scope.row)">当前库存</el-button>
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
import { getLocationList, Cookies,downloadUrl,getExportDownload } from "service";

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
        name: ""
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
    this.getLocationList();
  },
  methods: {
    setArgs(){
      let args = {
        page: this.pagination.currentPage,
        name: this.searchForm.name
      };
      if (!this.searchForm.name) {
        delete args.name;
      }
      return args
    },
    download(){
      let args = this.setArgs();
      delete args.page;
      return getExportDownload(this,downloadUrl.LOCATION_EXPORT_API, args)
        .then(response => {
          const a = document.createElement("a");
          a.href = response;
          a.download = "download";
          a.click();
          window.URL.revokeObjectURL(response);
        })
        .catch(err => {
          console.log(err);
        });
    },
    addLocation() {
      this.$router.push({
        path: "/storage/location/add"
      });
    },
    editLocation(data) {
      this.$router.push({
        path: "/storage/location/edit/" + data.id
      });
    },
    recordsList(data) {
      this.$router.push({
        path: "/storage/list",
        query: {
          pid: data.id
        }
      });
    },
    getLocationList() {
      this.setting.loading = true;
      let args = this.setArgs();
      getLocationList(this, args)
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
      this.getLocationList();
    },
    search() {
      this.pagination.currentPage = 1;
      this.getLocationList();
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
      this.pagination.currentPage = 1;
      this.getLocationList();
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
