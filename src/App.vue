<script setup lang="ts">
import { request } from '@/mocks/base'

import CotCard from '@/components/CotCard.vue'
import type { Card } from '@/types/card';
import { reactive, ref } from 'vue';
import { log } from '@/utils/logging';
import { extractContentBetweenTags } from '@/utils/strUtils';

// api
import { generateAssistant } from '@/apis/callAgent'

const query = reactive<Card>({
    id: 'USER',
    role: 'USER',
    title: 'USER',
    content: '',
});

const cotList = ref<Card[]>([]);
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
const createAssistant = async () => {
    if (query.content.trim() == '') {
        return;
    }
    console.debug('@生成回复');
    // 1.发起请求
    const response = await generateAssistant(query.content);
    log('APP.vue', 'createAssistant', '[响应]response', response);
    // 2.更新cotList
    // 2.1.清空cotList
    cotList.value = []
    // 2.2.mock新的assistant
    const assistant: Card = {
        id: 'ASSISTANT-1',
        role: 'ASSISTANT',
        title: 'ASSISTANT-1',
        content: "<think>思维链...</think><|FunctionCallBegin|>{\"toolName\": \"Search\", \"parameters\": [\"钱学森\", \"钱学森的成就\"]}<|FunctionCallEnd|>"
    };
    // 2.3.存数据
    cotList.value.push(assistant)
}

// 让所有按钮都变为加载状态
let btnLoadingStatus = ref<boolean>(false);
const loadingAllBtn = () => {
    btnLoadingStatus.value = true;
}

// 调用工具，只有ASSISTANT才能调用
let callTool = (card: Card) => {
    log('APP.vue', 'callTool', '[入参]card', card);
    if (card == null) {
        log('APP.vue', 'callTool', 'card为空', null, 'error');
        return;
    }
    if (!card.content?.trim()) {
        log('APP.vue', 'callTool', 'card.content为空', null, 'error');
        return;
    }
    // 1.获取content中<|FunctionCallBegin|><|FunctionCallEnd|>包裹的内容
    const content = extractContentBetweenTags(card.content, '<|FunctionCallBegin|>', '<|FunctionCallEnd|>');
    if (content == null) {
        log('APP.vue', 'callTool', 'content为空', content, 'error');
        return;
    }
    // 2.对提取出的数据做json转换
    try {
        JSON.parse(content);
    } catch (error) {
        log('APP.vue', 'callTool', 'json解析出错', error, 'error');
        return;
    }
    // 3.发起请求
    // TODO

    // 4.清空当前card之后的card
    log('APP.vue', 'callTool', '[更新前]cotList.value', cotList.value);
    const cutIndex = cotList.value.findIndex((item) => item.id == card.id);
    log('APP.vue', 'callTool', 'cutIndex', cutIndex);
    cotList.value.splice(cutIndex + 1);
    log('APP.vue', 'callTool', '[更新后]cotList.value', cotList.value);

    // 5.更新cotList
    // 5.1.需要对id、title做特殊处理
    const index = Math.floor(cotList.value.length / 2) + 1;
    const tool: Card = {
        id: `TOOL-${index}`,
        role: 'TOOL',
        title: `TOOL-${index}`,
        content: {
            toolName: 'Search',
            parameters: ['苹果', '香蕉'],
        },
    }

    cotList.value.push(tool);
    log('APP.vue', 'callTool', 'cotList', cotList.value);
}

// 继续调用，只会创建ASSISTANT
const continueCall = (currentCard: Card) => {
    log('APP.vue', 'continueCall', '[入参]currentCard', currentCard);
    // 1.创建长文
    const userPrompt = createCotPrompt(currentCard);
    if (userPrompt == null) {
        log('APP.vue', 'continueCall', 'userPrompt为null', null, 'error');
        return;
    }
    log('APP.vue', 'continueCall', 'userPrompt', userPrompt);
    // 2.发送请求
    // TODO
    // 3.更新cotList
    // 3.1.需要移除当前card之后的card
    clearCotAfterCard(currentCard);
    // 3.2.需要对id、title做特殊处理
    const index = Math.floor(cotList.value.length / 2) + 1;
    const assistant: Card = {
        id: `ASSISTANT-${index}`,
        role: 'ASSISTANT',
        title: `ASSISTANT-${index}`,
        content: '<think>思维链...</think><|FunctionCallBegin|>{\"toolName\": \"Search\", \"parameters\": [\"钱学森\", \"钱学森的成就\"]}<|FunctionCallEnd|>'
    };
    cotList.value.push(assistant);
}

// 结束任务
const endTask = (currentCard: Card) => {
    log('APP.vue', 'endTask', '[入参]currentCard', currentCard);
    // 1.创建长文
    const userPrompt = createCotPrompt(currentCard);
    if (userPrompt == null) {
        log('APP.vue', 'endTask', 'userPrompt为null', null, 'error');
        return;
    }
    log('APP.vue', 'endTask', 'userPrompt', userPrompt);
    // 2.发送请求
    // TODO
    // 3.更新cotList
    // 3.1.需要移除当前card之后的card
    clearCotAfterCard(currentCard);
    // 3.2.需要对id、title做特殊处理
    const index = Math.floor(cotList.value.length / 2) + 1;
    const final: Card = {
        id: 'FINAL',
        role: 'FINAL',
        title: 'FINAL',
        content: '<think>任务已经结束</think>'
    };
    cotList.value.push(final);
}

// 保存为json
const save2json = () => {
    if (cotList.value.length == 0) {
        log('APP.vue', 'save2json', 'cotList没有数据', null, 'error');
        return;
    }
    const saveData: Record<string, { id: string; content: any }> = {};

    // 添加query数据（假设query也有id属性）
    saveData[query.id] = {
        id: query.id,
        content: "<query>" + query.content + "</query>"
    };

    // 添加cotList中的卡片数据
    cotList.value.forEach((card) => {
        saveData[card.id] = {
            id: card.id,
            content: card.content
        };
    });

    // TODO：保存JSON
    try {
        // 1. 将数据转换为格式化的 JSON 字符串
        const jsonStr = JSON.stringify(saveData, null, 2);

        // 2. 创建 Blob 对象（二进制数据）
        const blob = new Blob([jsonStr], { type: 'application/json' });

        // 3. 创建下载链接
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        // 4. 设置下载信息
        a.href = url;
        // 可以自定义文件名，这里使用当前时间作为区分
        const fileName = `cot_data_${new Date().getTime()}.json`;
        a.download = fileName;

        // 5. 触发下载并清理
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // 释放 URL 对象

        log('APP.vue', 'save2json', "JSON 文件保存成功: ", fileName);
        alert("JSON 文件保存成功")
    } catch (error) {
        log('APP.vue', 'save2json', "JSON 文件保存失败: ", null, 'error');
        alert("JSON 文件保存失败")
    }
}

// 创建cot长文
const createCotPrompt = (currentCard: Card): string | null => {
    let question = `<query>${query.content}</query>`
    let previous = '<PreviousText>\n'
    // 1.获取当前card之前的card
    // 1.1.获取当前card的index
    const index = cotList.value.findIndex((card) => card.id == currentCard.id)
    if (index == -1) {
        log('APP.vue', 'createCotPrompt', '找不到当前card的索引', null, 'error');
        return null;
    }
    for (let i = 0; i <= index; i++) {
        const cot = cotList.value[i];
        previous = previous + `${cot.id}:${cot.content}\n`
    }
    previous = previous + '</PreviousText>'
    return question;
}

// 清空当前card之后的card
const clearCotAfterCard = (card: Card) => {
    log('APP.vue', 'clearCotAfterCard', '[更新前]cotList', cotList.value);
    const cutIndex = cotList.value.findIndex((cot) => cot.id == card.id);
    log('APP.vue', 'clearCotAfterCard', 'cutIndex', cutIndex);
    cotList.value.splice(cutIndex + 1);
    log('APP.vue', 'clearCotAfterCard', '[更新后]cotList', cotList.value);
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
                <textarea v-model="query.content" :class="[{ 'edit-mode': editModel }]" :disabled="textAreaIsDisabled"
                    placeholder="请输入..."></textarea>
            </div>
            <!-- 按钮区域 -->
            <div class="btn-area">
                <el-button class="edit-btn" type="primary" size="default" @click="edit">{{ editBtnModel ? "保存修改" : "编辑"
                    }}</el-button>
                <el-button class="generate-btn" type="primary" size="default" @click="createAssistant">生成回复</el-button>
            </div>
        </div>
    </div>
    <!-- COT区域 -->
    <CotCard v-for="card in cotList" :key="card.id" :card="card" :btn-loading="btnLoadingStatus"
        @loading-all-btn="loadingAllBtn" @call-tool="callTool" @continue-call="continueCall" @end-task="endTask"
        @save2json="save2json" />

</template>

<style lang="scss">
// 公共样式
.card {
    display: flex;
    margin-top: 10px;
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


.query {}
</style>