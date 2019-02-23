<template>
  <el-card class="box">
    <build-bread level1="商品管理" level2="分类参数"></build-bread>
    <el-alert title="注意只允许为第三级分类设置参数" type="warning" show-icon class="msg"></el-alert>
    {{selectedOptions}}
    <el-form :model="formdata">
      <el-form-item>
        <span>请选择商品分类</span>
        <el-cascader
          :options="options"
          :show-all-levels="false"
          v-model="selectedOptions"
          :props="props"
          clearable
          @change="chang"
        ></el-cascader>
      </el-form-item>
    </el-form>

    <el-tabs v-model="active" @tab-click="changeTab()">
      <el-tab-pane label="动态参数" name="1">
        <el-button type="success">设置动态参数</el-button>
        <el-table height="650px" :data="list" style="width: 100%" @expand-change="fn">
          <el-table-column type="expand" width="80">
            <template slot-scope="scope">
              <el-tag
                :key="i"
                v-for="(itme,i) in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row,itme)"
              >{{itme}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#" width="180"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="200"></el-table-column>
          <el-table-column label="操作" width="300">
            <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">
        <el-table height="650px" :data="arrStac" style="width: 100%">
          <el-table-column type="index" label="#" width="180"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="200"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值" width="200"></el-table-column>
          <el-table-column label="操作" width="300">
            <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
            <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      inputVisible: false,
      inputValue: "",
      selectedOptions: [],
      options: [],
      attr_vals: [],
      props: {
        value: "cat_id",
        label: "cat_name"
      },
      formdata: {},
      list: [],
      active: "1",
      arrStac: []
    };
  },
  created() {
    this.getGoods();
  },

  methods: {
    fn(row, expandedRows) {
      console.log(expandedRows);
      if (expandedRows.length > 1) {
        expandedRows.shift();
      }
    },
    async handleClose(obj, itme) {
      obj.attr_vals.splice(obj.attr_vals.indexOf(itme), 1);
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${obj.attr_id}`,
        {
          attr_name: obj.attr_name,
          attr_sel: obj.attr_sel,
          attr_vals: obj.attr_vals.join(",")
        }
      );
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    async handleInputConfirm(obj) {
      let inputValue = this.inputValue;
      if (inputValue) {
        obj.attr_vals.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${obj.attr_id}`,
        {
          attr_name: obj.attr_name,
          attr_sel: obj.attr_sel,
          attr_vals: obj.attr_vals.join(",")
        }
      );
    },

    async getGoods() {
      const res = await this.$http.get(`categories?type=3`);

      const {
        data,
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.options = data;
      }
    },
    //当切换tab方法调用时
    changeTab() {
      this.getDVorStac();
    },
    //当级联选择器方法调用时
    chang() {
      this.getDVorStac();
    },
    //获取动态参数和静态
    async getDVorStac() {
      if (this.selectedOptions.length !== 3) {
        this.$message.warning("请选择三级分类");
        if (this.active === "1") {
          this.list = [];
        } else if (this.active === "2") {
          this.arrStac = [];
        }
      }

      if (this.active === "1") {
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        const {
          data,
          meta: { msg, status }
        } = res.data;
        if (status === 200) {
          this.list = data;

          this.list.forEach(itme => {
            if (itme.attr_vals.length === 0) {
              itme.attr_vals = [];
            } else {
              itme.attr_vals = itme.attr_vals.trim().split(",");
            }
          });
        }
      }

      if (this.active === "2") {
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );

        const {
          data,
          meta: { msg, status }
        } = res.data;
        if (status === 200) {
          this.arrStac = data;
        }
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.msg {
  margin: 15px 0;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
