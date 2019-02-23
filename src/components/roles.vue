<template>
  <el-card class="box">
    <build-bread level1="权限管理" level2="角色列表"></build-bread>
    <el-button type="success" plain @click="showDiaAddUser()" class="roles">添加角色</el-button>
    <el-table height="650px" :data="list" style="width: 100%" @expand-change="fn">
      <el-table-column type="expand" width="80">
        <template slot-scope="scope">
          <el-row v-for="(itme1) in scope.row.children" :key="itme1.id" class="level1">
            <el-col :span="4">
              <el-tag closable type="success" @close="closeTag(scope.row,itme1)">{{itme1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>

            <el-col :span="20">
              <el-row v-for="(itme2) in itme1.children" :key="itme2.id" class="level2">
                <el-col :span="4">
                  <el-tag @close="closeTag(scope.row,itme2)" closable type="info">{{itme2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>

                <el-col :span="20">
                  <el-tag
                    @close="closeTag(scope.row,itme3)"
                    closable
                    type="warning"
                    v-for="(itme3) in itme2.children"
                    :key="itme3.id"
                    class="level3"
                  >{{itme3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0 ">
            <el-col>
              <span>未分配权限</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="180"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="300"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
            @click="editRloes(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
            @click="deleteRoles(scope.row)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
            @click="addRights(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="分配权限" :visible.sync="dialogFormVisible">
      <el-tree
        ref="treeDom"
        :data="treeList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrCheck"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesrights()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleAdd">
      <!-- 表单 -->
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="角色名称">
          <el-input v-model="formdata.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="formdata.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="putList()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑方框弹出层 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleUpdate">
      <!-- 表单 -->
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="角色名称">
          <el-input v-model="formdata.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="formdata.roleDesc"></el-input>
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
      dialogFormVisibleUpdate: false,
      formdata: {
        roleName: "",
        roleDesc: "",
        roleId: ""
      },
      dialogFormVisibleAdd: false,
      list: [],
      treeList: [],
      dialogFormVisible: false,
      defaultProps: {
        label: "authName",
        children: "children"
      },
      arrCheck: [],
      rolesID: -1 + ""
    };
  },
  created() {
    this.getList();
  },
  methods: {
    fn(row, expandedRows) {
      console.log(expandedRows);
      if (expandedRows.length > 1) {
        expandedRows.shift();
      }
    },
    async editRloes(user) {
      const res = await this.$http.get(`roles/${user.id}`);
      const {
        data,
        meta: { status }
      } = res.data;
      this.formdata = data;
      this.dialogFormVisibleUpdate = true;
    },
    async UpdateList() {
      const res = await this.$http.put(
        `roles/${this.formdata.roleId}`,
        this.formdata
      );
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.$message.success("修改成功");
        this.getList();
        this.dialogFormVisibleUpdate = false;
      }
    },
    deleteRoles(user) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(`roles/${user.id}`);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            this.pagenum = 1;
            this.getList();
            this.$message.success("删除成功");
          }
        })
        .catch(() => {
          this.$message.info("取消成功");
        });
    },
    async getList() {
      const res = await this.$http.get("roles");
      const {
        data,
        meta: { status }
      } = res.data;
      this.list = data;
    },
    async showDiaAddUser() {
      this.dialogFormVisibleAdd = true;
    },
    async putList() {
      const res = await this.$http.post(`roles`, this.formdata);
      const {
        data,
        meta: { status, msg }
      } = res.data;
      if (status === 201) {
        this.$message.success("添加角色成功");
        this.dialogFormVisibleAdd = false;
        this.getList();
      }
    },
    async closeTag(role, rights) {
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${rights.id}`
      );
      const {
        data,
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        role.children = data;
        this.$message.success(msg);
      }
    },
    async addRights(roles) {
      this.rolesID = roles.id;
      this.dialogFormVisible = true;
      const res = await this.$http.get(`rights/tree`);
      const {
        data,
        meta: { status }
      } = res.data;
      if (status === 200) {
        this.treeList = data;

        const temp2 = [];
        // this.treeList.forEach(itme1 => {
        //   temp.push(itme1.id);
        //   itme1.children.forEach(itme2 => {
        //     temp.push(itme2.id);
        //     itme2.children.forEach(itme3 => {
        //       temp.push(itme3.id);
        //     });
        //   });
        // });
        // console.log(temp); //原始方法获得所有的id并全部展开

        //获得角色权限的id，之前上一步是获得权限的id，那么需要传参角色的权限的id
        roles.children.forEach(item1 => {
          // temp2.push(item1.id);// 最外层id->temp->arrCheck
          item1.children.forEach(item2 => {
            // temp2.push(item2.id);
            item2.children.forEach(item3 => {
              temp2.push(item3.id);
            });
          });
        });
        this.arrCheck = temp2;
      }
    },
    async addRolesrights() {
      //之前做过，自定义指令是不行，这里需要用ref操纵dom元素，执行组件中提供的方法
      const arr1 = this.$refs.treeDom.getCheckedKeys();
      const arr2 = this.$refs.treeDom.getHalfCheckedKeys();
      //利用es6中的方法进行合并
      const arr = [...arr1, ...arr2];

      const res = await this.$http.post(`roles/${this.rolesID}/rights`, {
        rids: arr.join(",")
      });
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
        this.dialogFormVisible = false;
        this.getList();
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.roles {
  margin-top: 20px;
}
.level1,
.level2,
.level3 {
  margin-bottom: 20px;
}
</style>
