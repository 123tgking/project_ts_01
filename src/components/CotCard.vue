<script setup lang="ts">
import type { Card } from '@/types/card';
import { ref, defineProps } from 'vue';

const props = defineProps<{
    card: Card;
}>();

let textAreaIsDisabled = ref<boolean>(true);
let editModel = ref<boolean>(false);
// 编辑按钮的状态：false：编辑、true：保存修改
let editBtnModel = ref<boolean>(false);

// 编辑
const edit = () => {
    if (editBtnModel.value) {
        // a.保存修改
        // a.1.开启文本框的禁用
        textAreaIsDisabled.value = true;
        // a.2.移除编辑模式的样式
        editModel.value = false;
        // a.3.按钮内容变为编辑
        editBtnModel.value = false;
    } else {
        // b.编辑
        // b.1.取消文本框的禁用
        textAreaIsDisabled.value = false;
        // b.2.添加编辑模式的样式
        editModel.value = true;
        // b.3.按钮内容变为保存修改
        editBtnModel.value = true;
    }
}
</script>

<template>
    <div class="card cot-list">
        <!-- 标题 -->
        <div class="left title" :style="{backgroundColor: card.role == 'ASSISTANT' ? '#4ade80' : 'orange'}">
            <span>{{ card.title }}</span>
        </div>
        <!-- 文本、按钮 -->
        <div class="right title">
            <!-- 文本区域 -->
            <div class="content">
                <textarea v-model="card.content" :class="[{'edit-mode': editModel}]" :disabled="textAreaIsDisabled" placeholder="<think></think><toolCallStart><toolCallEnd>"></textarea>
            </div>
            <!-- 按钮区域 -->
            <div class="btn-area">
                <el-button class="final-btn" type="primary" size="default">结束任务</el-button>
                <el-button class="edit-btn" type="primary" size="default" @click="edit">{{ editBtnModel ? "保存修改" : "编辑" }}</el-button>
                <el-button class="generate-btn" type="primary" size="default">调用工具</el-button>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
</style>