<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <build-bread level1="商品管理" level2="商品分类"></build-bread>
    <!-- 搜索框 -->
    <el-row>
      <el-col :span="24" class="searchArea">
        <el-button type="success" @click="addGoodsCate()">添加分类</el-button>
      </el-col>
    </el-row>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 级联选择器 (表单元素) -->
        <el-form-item label="分类" :label-width="formLabelWidth">
          {{selectedOptions}}
          <el-cascader
            expand-trigger="hover"
            change-on-select
            clearable
            :options="caslist"
            v-model="selectedOptions"
            :props="defaultProp"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table height="450" :data="list" style="width: 100%">
      <el-tree-grid
        prop="cat_name"
        width="120"
        label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        childKey="children"
        levelKey="cat_level"
      ></el-tree-grid>
      <!-- porp：单元格内容 label：单元格标题就是表头  treekey 数据的id 
    parentkey : 上一级id  childkey :子内容的id  levelkey：数据的层级
    因为服务器后台返回的是这些数据，所以这个必须也得是对应的数据
      -->
      <el-table-column label="级别">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level===0">一级</span>
          <span v-else-if="scope.row.cat_level===1">二级</span>
          <span v-else-if="scope.row.cat_level===2">三级</span>
        </template>
      </el-table-column>

      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted===false">有效</span>
          <span v-else-if="scope.row.cat_deleted===true">无效</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180">
        <template>
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15,20]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
import ElTreeGrid from "element-tree-grid";
import qs from "qs";

export default {
  components: {
    ElTreeGrid
  },
  data() {
    return {
      list: [],
      pagenum: 1,
      pagesize: 10,
      total: 1,
      dialogFormVisibleAdd: false,
      form: {
        cat_pid: -1,
        cat_name: "",
        cat_level: -1
      },
      formLabelWidth: "140px",
      //  级联选择器要用的数据
      caslist: [],
      selectedOptions: [],
      defaultProp: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      }
    };
  },
  created() {
    this.getGoodsCate();
    this.fn1();
  },

  methods: {
    fn1() {},
    // 添加分类 - 发送请求
    async addCate() {
      if (this.selectedOptions.length === 0) {
        this.form.cat_pid = 0;
        this.form.cat_level = 0;
      }

      if (this.selectedOptions.length === 1) {
        this.form.cat_pid = 0;
        this.form.cat_level = this.selectedOptions[1];
      }

      if (this.selectedOptions.length === 2) {
        this.form.cat_pid = 1;
        this.form.cat_level = this.selectedOptions[2];
        console.log(this.cat_level);
      }

      const res = await this.$http.post(`categories`, {
        cat_pid: this.form.cat_pid,
        cat_name: this.form.cat_name,
        cat_level: this.form.cat_level
      });
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 201) {
        this.getGoodsCate();
        this.pagenum = 1;
        this.$message.success(msg);
        this.dialogFormVisibleAdd = false;
      }
    },
    // 添加分类- 显示对话框
    async addGoodsCate() {
      // 获取两级分类的数据
      const res = await this.$http.get(`categories?type=2`);
      this.caslist = res.data.data;

      this.dialogFormVisibleAdd = true;
    },
    // 获取所有分类
    async getGoodsCate() {
      const res = await this.$http.get(
        `categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      // console.log(res)
      this.list = res.data.data.result;

      this.total = res.data.data.total;
    },
    // 分页的相关方法
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val;

      this.pagenum = 1;
      this.getGoodsCate();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      // this.pagenum = 2 = val
      window.location.hash = this.$route.path + "#page=" + val;
      var sum = window.location.hash.substring(
        window.location.hash.length - 1,
        window.location.hash.length
      );

      this.pagenum = sum;
      this.getGoodsCate();
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}

.searchArea {
  margin-top: 10px;
  margin-bottom: 10px;
}

.searchArea .searchInput {
  width: 350px;
}
</style>


