<template>
  <el-card class="box-card">
    <build-bread level1="商品管理" level2="商品列表"></build-bread>
    <!-- 搜索框 -->
    <el-row class="searchArea">
      <el-col :span="24">
        <el-input
          v-model="query"
          class="searchInput"
          @clear="clear()"
          clearable
          placeholder="请输入内容"
        >
          <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button @click="$router.push({name:'goodsadd'})" type="success" plain>添加商品</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      height="450px"
      border
      stripe
      v-loading="loading"
      :data="list"
      style="width: 100%"
      class="flip-list-item"
    >
      <!-- 序号 -->
      <el-table-column type="index"></el-table-column>

      <el-table-column prop="goods_name" label="商品名称"></el-table-column>

      <el-table-column prop="goods_price" label="商品价格(元)" width="100"></el-table-column>

      <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>

      <el-table-column label="创建日期" width="120">
        <template slot-scope="scope">{{scope.row.add_time | fmtdate('YYYY-MM-DD')}}</template>
      </el-table-column>

      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            plain
            size="mini"
            type="primary"
            icon="el-icon-edit"
            circle
            @click="editshowGoods(scope.row)"
          ></el-button>
          <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 编辑方框弹出层 -->
    <el-dialog title="编辑商品" :visible.sync="dialogFormVisibleUpdate">
      <!-- 表单 -->
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="商品名称">
          <el-input v-model="formdata.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="formdata.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="formdata.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="formdata.goods_number"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleUpdate = false">取 消</el-button>
        <el-button type="primary" @click="UpdateList()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      searchValue: "",
      loading: false,
      list: [],
      pagenum: 1,
      pagesize: 10,
      total: 0,
      query: "",
      dialogFormVisibleUpdate: false,
      formdata: {
        goods_name: "",
        goods_weight: "",
        goods_price: "",
        goods_number: ""
      },
      goods_id: ""
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val;
      this.pagenum = 1;
      this.loadData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val;
      this.loadData();
    },
    handleSearch() {
      this.pagenum = 1;
      this.loadData();
    },
    clear() {
      this.query = "";
      this.loadData();
      this.pagenum = 1;
    },
    async loadData() {
      this.loading = true;
      const { data: resData } = await this.$http.get(
        `goods?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      this.total = resData.data.total;
      this.list = resData.data.goods;
      this.loading = false;
    },
    async editshowGoods(user) {
      this.goods_id = user.goods_id;
      this.dialogFormVisibleUpdate = true;
      const res = await this.$http.get(`goods/${user.goods_id}`);
      const {
        data,
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.formdata = data;
      }
    },
    async UpdateList() {
      const res = await this.$http.put(`goods/${this.goods_id}`, this.formdata);

      const {
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.pagenum = 1;
        this.loadData();
        this.dialogFormVisibleUpdate = false;
      }
    }
  },
  watch: {
    query() {
      if (this.query === "") {
        this.loadData();
        this.pagenum = 1;
      }
    }
  }
};
</script>

<style>
.searchArea {
  margin-top: 10px;
  margin-bottom: 10px;
}
.searchArea .searchInput {
  width: 350px;
}
.flip-list-item {
  transition: all 60s;

  margin-right: 10px;
}
.flip-list-enter,
.flip-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.flip-list-leave-active {
  position: absolute;
}
</style>
