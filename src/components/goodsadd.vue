<template>
  <el-card class="box">
    <build-bread level1="商品管理" level2="商品列表"></build-bread>

    <el-alert class="alret" title="添加商品信息" type="info" center show-icon></el-alert>
    <el-steps :active="active*1" finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <el-form label-width="80px" :model="formdata" label-position="top">
      <el-tabs tab-position="left" v-model="active" class="tab" @tab-click="changeTab()">
        <el-tab-pane label="基本信息" name="1">
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
          {{selectedOptions}}
          <el-form-item label="商品分类">
            <el-cascader :options="options" v-model="selectedOptions" :props="props" clearable></el-cascader>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="商品参数" name="2">
          <el-form-item :label="item1.attr_name" v-for="(item1) in arrDy" :key="item1.id">
            <el-checkbox-group v-model="item1.attr_vals">
              <!--
                        视图操作会导致外层数组变化，数组一变，新结果重新遍历，视图则又重新刷新，所以当点击时，点击的那个checkbox则没有了
              这里因为得是选中效果，但是只要是label中的值来自于v-model中的数组就则是选中-->
              <el-checkbox border :label="itme2" v-for="(itme2,i) in item1.attr_vals" :key="i"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="商品属性" name="3">
          <el-form-item :label="itme.attr_name" v-for="(itme) in arrStac" :key="itme.id">
            <el-input v-model="itme.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="商品图片" name="4">
          <el-upload
            action="http://localhost:8888/api/private/v1/upload"
            :headers="headers"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>

        <el-tab-pane label="商品内容" name="5">
          <el-form-item>
            <el-button @click="UpdateGoods()" type="success">提交商品</el-button>

            <quill-editor v-model="formdata.goods_introduce"></quill-editor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
// goods_name	商品名称	不能为空
// goods_cat	以为','分割的分类列表	不能为空
// goods_price	价格	不能为空
// goods_number	数量	不能为空
// goods_weight	重量	不能为空
// goods_introduce	介绍	可以为空
// pics	上传的图片临时路径（对象）	可以为空
// attrs	商品的参数（数组）	可以为空
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      formdata: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        attrs: []
      },
      selectedOptions: [],
      options: [],
      props: {
        //在插件文档的案列中没有这个数据，但是属性有这个值
        //配置选项
        value: "cat_id",
        label: "cat_name"
      },
      arrDy: [],
      arrStac: [],
      headers: {
        //图片上传也需要token，所以在后台也需要再次设置
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    this.getGoods();
  },
  methods: {
    async UpdateGoods() {
      //因为一个要字符串所以给他就是
      this.formdata.goods_cat = this.selectedOptions.join(",");
      //遍历获取动态和静态数据 map方法返还一个数组，写什么返还什么
      const arr1 = this.arrDy.map(itme => {
        return { attr_id: itme.attr_id, attr_vlue: itme.attr_vals };
      });
      const arr2 = this.arrStac.map(itme => {
        return { attr_id: itme.attr_id, attr_vlue: itme.attr_vals };
      });
      const arr3 = [...arr1, ...arr2];

      this.formdata.attrs = arr3;

      const res = await this.$http.post("goods", this.formdata);
      const {
        data,
        meta: { status, msg }
      } = res.data;
      if (status === 201) {
        this.$message.success("添加成功");
        this.$router.push({
          name: "goods"
        });
      }
    },
    handleRemove(file, fileList) {
      // console.log(file);
      //   这是输出内容后，发现这是临时上传的路径，暂存于服务器上面
      //现在不用多部操作
      const index = this.formdata.pics.findIndex(itme => {
        //这个index方法是遍历这个数组，当满足某个条件则返还它的下标
        //则下面的这个条件式是当然这个路径等于这个路径的时候，则返还下标
        itme.pics = file.response.data.tmp_path;
      });
      this.formdata.pics.splice(index, 1);
      console.log(this.formdata.pics);
    },
    handleSuccess(response, file, fileList) {
      this.formdata.pics.push({
        pics: response.data.tmp_path
      });
      //  这是从服务器上的临时路径
      console.log(this.formdata.pics);
    },
    async changeTab() {
      //这里加上判断，这个参数不等于2，并且数组长度不为3，则报错，不返回数据
      if (this.active === "2" || this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          this.$message.error("请选择三级分类");
          //判断如果是没有的则清空
          if (this.active === "2") {
            this.arrDy = [];
          } else {
            this.arrStac = [];
          }
          return;
        }
        // 获取静态数据
        if (this.active === "3") {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          const {
            data,
            meta: { status }
          } = res.data;
          this.arrStac = data;
        }

        //获取动态数据
        if (this.active === "2") {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          const {
            data,
            meta: { status }
          } = res.data;
          if (status === 200) {
            this.arrDy = data;

            //因为动态数据中attr_vals是字符串，而我们是遍历数组，所以需要将这一项转换成数组
            //且如果有的没有这个商品属性，那么就返回一个空数组，不能遍历字符串
            this.arrDy.forEach(itme => {
              if (itme.attr_vals.length === 0) {
                itme.attr_vals = [];
              } else {
                //trim()去掉字符串中的前后空格
                itme.attr_vals = itme.attr_vals.trim().split(",");
              }
            });
          }
        }
      }
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
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}

.alret {
  margin: 20px 0;
}
.tab {
  margin-top: 10px;
  height: auto;
  overflow: auto;
}
</style>
 