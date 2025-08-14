export const log = (fileName: string, methodName: string, varName: string, val: any, type: string = 'log') => {
    if (type == 'log') {
        console.log(`[${fileName}] - [${methodName}] - [${varName}]\t==>\t`, val);
    } else if(type == 'error') {
        console.error(`[${fileName}] - [${methodName}] - [${varName}]\t==>\t`, val);
    } else if(type == 'warn') {
        console.warn(`[${fileName}] - [${methodName}] - [${varName}]\t==>\t`, val);
    } else {
        console.log(`[${fileName}] - [${methodName}] - [${varName}]\t==>\t`, val);
    }
    
}

export const printErrorMessage = (message:string) => {
    console.error(message);
}

