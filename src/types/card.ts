export type Card = {
    id: string;
    // role：USER、ASSISTANT、TOOL、FINAL
    role: string;
    title: string;
    content: string;
}