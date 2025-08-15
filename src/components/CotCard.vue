<script setup lang="ts">
import type { Card } from '@/types/card';
import { ref, defineProps, computed } from 'vue';
import { log } from '@/utils/logging';

const props = defineProps<{
    card: Card;
    btnLoading: boolean;
}>();

const emits = defineEmits<{
    // 让所有的按钮都处于加载状态
    (e: 'loadingAllBtn'): void;
    (e: 'callTool', card: Card): void;
    (e: 'continueCall', currentCard: Card): void;
    (e: 'endTask', currentCard: Card): void;
    (e: 'save2json'): void;
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

// 是否显示结束任务按钮
let isShowFinalBtn = computed<boolean>(() => {
    // card.content含有<Answer></Answer>标签，表示需要显示结束任务的按钮
    if (!props.card.content) {
        return false;
    }
    if (props.card.role == 'ASSISTANT') {
        // ASSISTANT的content是string类型
        // return props.card.content.includes('<Answer>') || props.card.content.includes('</Answer>');
        return true;
    } else if (props.card.role == 'TOOL') {
        // TOOL的content是个json
        return false;
    } else if(props.card.role == 'FINAL') {
        // FINAL的content是string类型
        // return props.card.content.includes('<Answer>') || props.card.content.includes('</Answer>');
        return false;
    } else {
        // 未知情况
        return false;
    }
});

// 将所有按钮变为加载状态
const loadingAllBtn = () => {
    emits('loadingAllBtn');
}

// 调用工具
const callTool = () => {
    emits('callTool', props.card);
}

const continueCall = () => {
    emits('continueCall', props.card);
}

// 处理文本输入框的输入
const handleContentInput = (e: Event) => {
    const value = (e.target as HTMLTextAreaElement).value;
    if (props.card.role == 'TOOL') {
        try {
            props.card.content = JSON.parse(value);
        } catch(error) {
            log('CotCard.vue', 'handleContentInput', 'json解析出错', error, 'error');
        }
    } else {
        props.card.content = value;
    }
}

const endTask = () => {
    emits('endTask', props.card);
}

// 保存cotList
const save2json = () => {
    emits('save2json');
}

</script>

<template>
    <div class="card cot-list">
        <!-- 标题 -->
        <div class="left title" :style="{ backgroundColor: card.role == 'ASSISTANT' ? '#4ade80' : 'orange' }">
            <span>{{ card.title }}</span>
        </div>
        <!-- 文本、按钮 -->
        <div class="right title">
            <!-- 文本区域 -->
            <div class="content">
                <textarea :value="card.role == 'TOOL' ? JSON.stringify(card.content, null, 2) : card.content"
                 @input="handleContentInput"
                 :class="[{ 'edit-mode': editModel }]" :disabled="textAreaIsDisabled"
                    placeholder="<think></think><toolCallStart><toolCallEnd>"></textarea>
            </div>
            <!-- 按钮区域 -->
            <div class="btn-area">
                <el-button v-if="isShowFinalBtn" class="final-btn" type="primary" size="default" @click="endTask" :loading="btnLoading">
                    结束任务
                </el-button>
                <el-button class="edit-btn" type="primary" size="default" @click="edit" :loading="btnLoading">
                    {{ editBtnModel ? "保存修改" : "编辑" }}
                </el-button>
                <el-button v-if="card.role != 'TOOL' && card.role != 'FINAL'" class="generate-btn" type="primary" size="default" @click="callTool" :loading="btnLoading">调用工具</el-button>
                <!-- 在角色为TOOL时显示 -->
                <el-button v-else-if="card.role == 'TOOL'" class="continue-btn" type="primary" size="default" @click="continueCall" :loading="btnLoading">继续调用</el-button>
                <!-- 在角色为FINAL时显示 -->
                <el-button v-if="card.role == 'FINAL'" class="continue-btn" type="primary" size="default" @click="save2json" :loading="btnLoading">保存</el-button>
            </div>
        </div>
    </div>
</template>

<style lang="scss"></style>