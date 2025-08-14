import { log } from '@/utils/logging';

const BASE_API = "/local_api/call_gemini";

const CREATE_API = BASE_API + "/create";
const CONTINUE_CREATE_API = BASE_API + "/continue_create";
const STOP_CREATE_API = BASE_API + "/stop_create";

export const generateAssistant = async (data: string) => {
    const response = await fetch(CREATE_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: data,
    })

    if (!response.ok) {
        log("callAgent", "generateAssistant", "HTTP调用失败", response.status, "error");
        return null;
    }

    const result = await response.json();

    log("callAgent", "generateAssistant", "result", result);

    if (result.code == "2000") {
        return result.data;
    } else {
        log("callAgent", "generateAssistant", "获取数据失败", result.code, "error");
    }

}