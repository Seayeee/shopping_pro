<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!--卡片视图-->

        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!--表格-->
            <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index :border="true">
               <!--用slot定义作用域插槽，scope接收作用域插槽的数据-->
               
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color:red;"></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>

                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>
            <!--分页区域-->

            <!--添加分类对话框-->
            <el-dialog title="添加分类" :visible.sync="addCateDialogVisible">
                <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" >
                    <el-form-item label="分类名称：" prop="cat_name">
                        <el-input v-model="addCateForm.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类：" >
                        <!--options指定数据源-->
                        <!--props指定配置对象-->
                        <el-cascader
                            v-model="selectedKeys"
                            :options="parentCateList"
                            :props="cascaderProps"
                            @change="parentCateChange" clearable change-on-select>    
                        </el-cascader>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addCateDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addCateDialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },

            cateList:[],
            total: 0,
            columns:[
                {
                    label:'分类名称',
                    prop:'cat_name'
                },
                {
                    label:'是否有效',
                    type:'template',
                    template:'isok',
                },
                {
                    label:'排序',
                    type:'template',
                    template:'order',
                },
                {
                    label:'操作',
                    type:'template',
                    template:'opt',
                    width:'200px',
                },
            ],

            //控制添加分类对话款的显示与隐藏
            addCateDialogVisible:false,

            //添加分类表单数据
            addCateForm:{
                cat_name:'',
                cat_pid:0,
                cat_level:0,
            },
            addCateFormRules:{
                    cat_name:[
                        { required: true, message: '请输入分类名称', trigger: 'blur' },
                        
                    ],
                    
            },
            parentCateList:[],
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                expandTrigger:'hover',
            },
            selectedKeys:[],

        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        async getCateList(){
            //此处get返回一个响应体，里面有data:{data:{},meta:{}}，这里是解构出{data，meta}赋值给res
            const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
            if(res.meta.status !== 200){
                return this.$message.error('获取商品分类失败')
            }
            //console.log(res)
            this.cateList = res.data.result
            this.total = res.data.total
            //console.log(res.data)
            
        },
        showAddCateDialog(){
            this.getParentCateList()
            //展示对话框
            this.addCateDialogVisible = true
        },
        async getParentCateList(){
            const {data:res} = await this.$http.get('categories',{params:{type:2}})
            if(res.meta.status !== 200){
                return this.$message.error("获取商品分类失败！")
            }
            this.parentCateList = res.data

        },
        parentCateChange(){
            if(this.selectedKeys.length > 0){
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
                this.addCateForm.level = this.selectedKeys.length
                return
            }else{
                this.addCateForm.cat_pid = 0
                this.addCateForm.level = 0
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .el-button{
        margin-bottom: 15px;
    }
    .el-cascader{
        width:100%;
    }
</style>