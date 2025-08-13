// 错误状态码
export enum ErrorCode {
    OK = 0,            // 正常
    SERVER_ERROR = 1,  // 服务器错误
}

// 响应
export interface Response<T = any> {
    status: number,
    error: number,
    errorMessage: string,
    data?: T,
}

// 请求
export interface Request<T = any> {
    method: string,
    header: object,
    data?: T,
}