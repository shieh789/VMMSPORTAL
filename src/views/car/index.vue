<template>
    <div class="app-container">
      <el-form inline ref="tempForm" :model="tempForm">
          <el-form-item label="车牌号">
            <el-input type="text" v-model="tempForm.plateNumber" placeholder="请输入内容"  style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="车型">
            <el-input type="text" v-model="tempForm.motorcycleType" placeholder="请输入内容"  style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item label="车主姓名">
            <el-input type="text" v-model="tempForm.customerName" placeholder="请输入内容"  style="width: 200px"></el-input>
          </el-form-item>
        <el-button type="primary" @click="findAllCar">搜索</el-button>
        <el-button type="primary" @click="handleCreate">添加车辆</el-button>
      </el-form>


      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column prop="plateNumber" label="车牌号" width="180">
        </el-table-column>
        <el-table-column prop="motorcycleType" label="车型" width="180">
        </el-table-column>
        <el-table-column prop="customerName" label="车主姓名">
        </el-table-column>
        <el-table-column prop="customerPhone" label="车主电话">
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
        <el-form ref="carForm" :model="carForm"  label-width="120px">
          <el-form-item label="车牌号" prop="plateNumber">
            <el-input type="text" v-model="carForm.plateNumber" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="车型" prop="motorcycleType">
            <!-- <el-input type="text" v-model="carForm.motorcycleType" autocomplete="off"></el-input> -->
            <el-cascader ref="refSubCat"  @change="handleSubCat" :props="props"  :show-all-levels="false"></el-cascader>
          </el-form-item>
          <el-form-item label="车主姓名" prop="customerName">
            <el-input type="text" v-model="carForm.customerName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="车主电话" prop="customerPhone">
            <el-input type="text" v-model="carForm.customerPhone" autocomplete="off"></el-input>
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
  import { addCar,findCar } from '@/api/car'
  import { findBrand }  from '@/api/brand'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  let id = 0
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
        resetCarForm() {
          this.carForm = {
            plateNumber: '',
            motorcycleType: '',
            customerName: '',
            customerPhone: ''
          }
        },
        dialogStatus: '',
        carForm: {
          plateNumber: '',
          motorcycleType: '',
          customerName: '',
          customerPhone: ''
        },
        tempForm:{
          plateNumber: '',
          motorcycleType: '',
          customerName: ''
        },
        brandForm:{
          brandId: '',
          brandName: '',
          groupId: '',
          groupName: '',
          seriesId: '',
          seriesName: '',
          infoId: '',
          infoName: ''
        },
        total:50,
        params:{
          page:1,//页码
          size:10//每页显示个数
        },
        brand:{
          value: '23423',
          label: '23423',
        },
        props: {
          lazy: true,
          brandForm:{
            brandId: '',
            brandName: '',
            groupId: '',
            groupName: '',
            seriesId: '',
            seriesName: '',
            infoId: '',
            infoName: ''
          },
          lazyLoad (node, resolve) {
            const { level } = node;
            if(level ==1 ){
              this.brandForm.brandId='';
              this.brandForm.brandName='';
              this.brandForm.groupId='';
              this.brandForm.groupName='';
              this.brandForm.seriesId='';
              this.brandForm.seriesName='';
              this.brandForm.infoId='';
              this.brandForm.infoName='';
              this.brandForm.brandId=node.value
            }
            if(level == 2) {
              this.brandForm.groupId='';
              this.brandForm.groupName='';
              this.brandForm.seriesId='';
              this.brandForm.seriesName='';
              this.brandForm.infoId='';
              this.brandForm.infoName='';
              this.brandForm.groupId=node.value
            }
            if(level == 3) {
              this.brandForm.seriesId='';
              this.brandForm.seriesName='';
              this.brandForm.infoId='';
              this.brandForm.infoName='';
              this.brandForm.seriesId=node.value
            }

            findBrand(this.brandForm).then(res => {
              const nodes = res.brandList.map(item => ({
                value: item.brandId,
                label: item.brandName,
                leaf: level >= 3  //控制有几层节点
              }));
              resolve(nodes);
            })
          }
        }
      };
    },
    created() {
      this.findAllCar()
      this.findAllBrand()
    },
    methods: {
      handleCreate() {
        this.resetCarForm()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['carForm'].clearValidate()
        })
      },
      findAllCar(){
        findCar(this.params.page,this.params.size,this.tempForm).then(response => {
          this.tableData = response.queryResult.list;
          this.total=response.queryResult.total;
        })
      },
      handleSubCat(value) {
        this.carForm.motorcycleType=this.$refs["refSubCat"].getCheckedNodes()[0].label;
      },
      async submitForm() {
        const { data } = await addCar(this.carForm)
        this.$message({
          type: 'success',
          message: 'add succed!'
        })
        this.dialogFormVisible = false
        this.findAllCar()
      },
      resetForm() {
        this.resetCarForm()
      }
    }
  }
</script>

<style>

</style>
