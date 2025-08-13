import type { Response, Request } from "@/types/https"
import { ErrorCode } from "@/types/https"

export function request(request: Request): Response {
    return {
        status: 0,
        error: ErrorCode.OK,
        errorMessage: "",
        data: null,
    }
}