import { log, printErrorMessage } from '@/utils/logging';

const BASE_API = "/local_api/call_gemini";

const CREATE_API = BASE_API + "/create";
const CONTINUE_CREATE_API = BASE_API + "/continue_create";
const STOP_CREATE_API = BASE_API + "/stop_create";

export const generateAssistant = async (data: string) => {
    try {
        const body = {
            content: data,
        }
        const response = await fetch(CREATE_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            throw new Error(`HTTP 错误：${response.status}`);
        }

        const result = await response.json();

        log("callAgent", "generateAssistant", "result", result);

        if (result.code == "2000") {
            return result.data;
        } else {
            log("callAgent", "generateAssistant", "获取数据失败", result.code, "error");
        }
    } catch (error) {
        printErrorMessage(`HTTP请求发生错误：${error}`)
        return null;
    }
}