<script setup lang="ts">
import { request } from '@/mocks/base'

import CotCard from '@/components/CotCard.vue'
import type { Card } from '@/types/card';
import { reactive, ref } from 'vue';

const query = reactive<Card>({
    id: 'USER',
    role: 'USER',
    title: 'USER',
    content: '',
});

const cotList = ref<Card[]>([])
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

// 生成回复
const createAssistant = () => {
    if (query.content.trim() == '') {
        return;
    }
    console.debug('@生成回复');
    // 1.发起请求
    // TODO
    // 2.更新cotList
    // 2.1.清空cotList
    cotList.value = []
    // 2.2.mock新的assistant
    const assistant: Card = {
        id: 'ASSISTANT-1',
        role: 'ASSISTANT',
        title: 'ASSISTANT-1',
        content: '<think>思维链...</think><toolCallStart>工具调用...<toolCallEnd>'
    };
    // 2.3.存数据
    cotList.value.push(assistant)
}



</script>

<template>
    <!-- Query区域 -->
    <div class="card query">
        <!-- 标题 -->
        <div class="left title">
            <span>{{ query.title }}</span>
        </div>
        <!-- 文本、按钮 -->
        <div class="right title">
            <!-- 文本区域 -->
            <div class="content">
                <textarea v-model="query.content" :class="[{'edit-mode': editModel}]" :disabled="textAreaIsDisabled"></textarea>
            </div>
            <!-- 按钮区域 -->
            <div class="btn-area">
                <el-button class="edit-btn" type="primary" size="default" @click="edit">{{ editBtnModel ? "保存修改" : "编辑" }}</el-button>
                <el-button class="generate-btn" type="primary" size="default" @click="createAssistant">生成回复</el-button>
            </div>
        </div>
    </div>
    <!-- COT区域 -->
    <transition-group name="cot-fade" tag="div" class="cot-list-container">
        <CotCard v-for="card in cotList" :key="card.id" :card="card"/>
    </transition-group>
</template>

<style lang="scss">
// 公共样式
.card {
    display: flex;
    min-height: 256px;
    min-width: 512px;
    height: 300px;
    width: 600px;
    box-sizing: border-box;
    border-radius: 10px;

    background-color: pink;

    // 标题
    .left {
        display: flex;
        flex: 1;
        justify-content: center;

        border-radius: 10px;
        border-right: 1px solid #e2e8f0;
        box-sizing: border-box;

        background-color: orange;

        font-size: 18px;
    }

    // 文本、按钮区域
    .right {
        display: flex;
        flex-direction: column;
        flex: 3;

        box-sizing: border-box;

        // 文本区域
        .content {
            display: flex;
            width: 100%;
            flex: 3;

            box-sizing: border-box;

            // 文本
            textarea {
                padding: 12px;
                height: 100%;
                width: 100%;

                box-sizing: border-box;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                background-color: #f8fafc;
                color: #475569;
                font-size: 16px;

                resize: none;
                transition: all 0.3s ease;
            }

            textarea:focus {
                outline: none;
            }

            textarea.edit-mode {
                border-color: #3b82f6;
                background-color: #ffffff;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                color: #1e293b;
            }

            textarea:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
        }

        // 按钮区域
        .btn-area {
            display: flex;
            flex: 1;
            justify-content: flex-end;
            align-items: center;

            padding: 5px;

            box-sizing: border-box;

            // 按钮
            .el-button {
                width: 100px;
                height: 50px;
            }
        }
    }
}


.query {
    
}
</style>