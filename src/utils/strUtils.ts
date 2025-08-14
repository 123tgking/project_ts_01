// 提取标签包裹的内容
export const extractContentBetweenTags = (content: string, startTag: string, endTag: string): string | null => {
    const startIndex = content.indexOf(startTag);
    const endIndex = content.indexOf(endTag);
    if (startIndex == -1 || endIndex == -1) {
        return null;
    }

    const result: string = content.substring(startIndex + startTag.length, endIndex);
    return result == "" ? null : result;
}