<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import dayjs from "dayjs";
import TdesignLink from "~icons/tdesign/link";
import EpDownload from "~icons/ep/download";
import { getPmDesignRequestsPage } from "@/api/design";

const detailTableData = ref([]);
const pagination = ref({
  pageNo: 1,
  pageSize: 5,
  pageTotal: 0
});

const searchFormRef = ref<FormInstance>();
const searchForm = reactive({
  productId: ""
});
const formatSearchStr = () => {
  const searchStr = [];
  if (searchForm.productId) {
    searchStr.push({
      searchName: "productId",
      searchType: "equals",
      searchValue: `${searchForm.productId}`
    });
  }
  return JSON.stringify(searchStr);
};
const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl?.resetFields();
};
</script>

<template>
  <div>
    <el-card
      shadow="never"
      style="margin-bottom: 12px; border-radius: 10px"
      class="search-card"
    >
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        class="demo-form-inline"
      >
        <el-form-item label="设计师" prop="productId">
          <el-input
            v-model="searchForm.productId"
            placeholder="请输入设计师名称"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button @click="handleReset(searchFormRef)">重置</el-button>
          <el-button type="primary" @click="">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" style="border-radius: 10px">
      <el-table
        :data="detailTableData"
        style="width: 100%"
        size="small"
        :header-cell-style="{ color: '#0a0a0a' }"
      >
        <el-table-column prop="productId" label="设计师" width="" />
      </el-table>

      <div class="mt-[16px] flex justify-end">
        <el-pagination
          v-model:current-page="pagination.pageNo"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[1, 5, 10, 100]"
          size="small"
          background
          layout="total, sizes, prev, pager, next"
          :total="pagination.pageTotal"
        />
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}

:deep(.search-card .el-card__body) {
  padding-bottom: 0;
}
</style>
