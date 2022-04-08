<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片 -->
    <el-card class="box-card">
      <div>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-input placeholder="请输入内容" v-model="queryInfo.query">
              <el-button @click="getUserList"
                slot="append"
                icon="el-icon-search"
              ></el-button > </el-input
          ></el-col>
          <el-col :span="6">
            <el-button type="primary">添加用户</el-button>
          </el-col>
        </el-row>

        <!--用户列表 -->
        <el-table :data="userList">
            <el-table-column type="index"></el-table-column>
            <el-table-column label="姓名" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="电话" prop="mobile"></el-table-column>
            <el-table-column label="角色" prop="role_name"></el-table-column>
            <el-table-column label="状态" prop="mg_state">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                </template>

            </el-table-column >
            <el-table-column label="操作" width="200px" >
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                    <el-tooltip effect="dark" content="分配角色" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                    </el-tooltip>
                    

                </template>

            </el-table-column>
        </el-table>
        <!-- 分页展示区 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
    data(){
        return{
            //请求需要带上的参数，由api接口决定
            queryInfo:{
                query:'',
                pagenum:1,
                pagesize:1
            },
            //响应的参数
            userList:[],
            total:0,
        }
    },
    created(){
        this.getUserList()
    },
    methods:{
        async getUserList(){
            //这里用get方法以querryInfo为参数向服务器请求数据，服务器返回数据的数量由querryInfo决定
            const {data:res} = await this.$http.get('users',{params: this.queryInfo})
            //console.log(res) //此处是
            //console.log(this.queryInfo) //此处显示已经双向绑定为input框内的值
            //console.log(1,this.userList) //此处显示获取到的uersList仍然是admin，为什么？get接口问题？querry没有匹配到
            //已解决，后端实现是已query为键匹配数据的，query不可写错
            if(res.meta.status !== 200) return this.$message.error('获取用户数据失败')
            this.userList = res.data.users
            this.total = res.data.total
            console.log(2,this.userList)
        },
        //监听pagesize的改变
        handleSizeChange(newPage){
            this.queryInfo.pagesize = newPage
            //由于修改了querryInfo，故请求时返回的数据不一样
            this.getUserList()

        },
        //监听当前页码值的改变
        handleCurrentChange(newPage){
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        //put方法返回一个promise对象，据老师的说法是使用async await来简化promise的操作
        async userStateChanged(userInfo){
            const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
            //console.log(res)
            if(res.meta.status !== 200){
              //则不修改用户的mg_state,然后返回
              userInfo.mg_state = !userInfo.mg_state
              return this.$message.error("更新用户状态失败")
            }
            this.$message.success("更新用户状态成功")
        }


    }

}
</script>


<style lang="less" scoped>
</style>