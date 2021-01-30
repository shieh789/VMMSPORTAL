<template>
  <div class="app-container">
    <el-form inline ref="tempForm" :model="tempForm">
      <el-form-item label="配件名称">
        <el-input type="text" v-model="tempForm.partsName" placeholder="请输入内容"  style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="车型">
        <el-input type="text" v-model="tempForm.brandName" placeholder="请输入内容"  style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="配件颜色">
        <el-input type="text" v-model="tempForm.partsColor" placeholder="请输入内容"  style="width: 200px"></el-input>
      </el-form-item>
      <el-button type="primary" @click="findPart">搜索</el-button>
      <el-button type="primary" @click="handleCreate">添加配件</el-button>
    </el-form>


    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column prop="id" label="配件ID" width="180">
      </el-table-column>
      <el-table-column prop="partsName" label="配件名称" width="180">
      </el-table-column>
      <el-table-column prop="brandName" label="配件车型">
      </el-table-column>
      <el-table-column prop="partsColor" label="配件颜色">
      </el-table-column>
      <el-table-column prop="costPrice" label="配件进价">
      </el-table-column>
      <el-table-column prop="partsPrice" label="配件售价">
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text">维修项目明细</el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="partForm" :model="partForm"  label-width="120px">
        <el-form-item label="配件名称" prop="partsName">
          <el-input type="text" v-model="partForm.partsName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="配件颜色" prop="partsColor">
          <el-input type="text" v-model="partForm.partsColor" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="配件车型" prop="brandName">
          <el-input type="text" v-model="partForm.brandName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="配件进价" prop="costPrice">
          <el-input type="text" v-model="partForm.costPrice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="配件售价" prop="partsPrice">
          <el-input type="text" v-model="partForm.partsPrice" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">添加</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <pagination v-show="total>0" :total="total" :page.sync="params.page" :limit.sync="params.size" @pagination="findAllCar" />
  </div>
</template>

<script>
  import { addParts,findParts } from '@/api/parts'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    components: { Pagination },
    data() {
      return {
        tableData: null,
        //添加（修改）窗口是否显示
        dialogFormVisible: false,
        textMap: {
          update: '修改',
          create: '添加'
        },
        resetPartForm() {
          this.partForm = {
            partsName: '',
            partsColor: '',
            brandName: '',
            costPrice: '',
            partsPrice: ''
          }
        },
        dialogStatus: '',
        partForm: {
          partsName: '',
          partsColor: '',
          brandName: '',
          costPrice: '',
          partsPrice: ''
        },
        tempForm:{
          partsName: '',
          brandName: '',
          partsColor: ''
        },
        total:50,
        params:{
          page:1,//页码
          size:10//每页显示个数
        }
      };
    },
    created() {
      this.findPart()
    },
    methods: {
      handleCreate() {
        this.resetPartForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['carForm'].clearValidate()
        })
      },
      findPart(){
        findParts(this.params.page,this.params.size,this.tempForm).then(response => {
          this.tableData = response.queryResult.list;
          this.total=response.queryResult.total;
        })
      },
      async submitForm() {
        const { data } = await addParts(this.partForm)
        this.$message({
          type: 'success',
          message: 'add succed!'
        })
        this.dialogFormVisible = false
        this.findPart()
      },
      resetForm() {
        this.resetPartForm()
      }
    }
  }
</script>

<style>

</style>
