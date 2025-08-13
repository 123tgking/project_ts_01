# 必要的依赖安装
- SCSS：`npm install sass sass-loader --save-dev`

# 系统环境
- 查看当前的环境：`import.env.MODE`。
- 自定义环境变量，需要以`VITE_`开头，如：`VITE_MOCK = "true"`，等号右边的值不用加引号也可以，vite统一会将值变为字符串。
- 使用自定义环境变量：`import.env.[自定义的环境变量名]`。
- 一般来说，建议环境变量尽量存放在以下文件中：
  - `.env`：通用环境。
  - `.env.development`：开发环境，使用`npm run dev`就会使用这个环境。
  - `.env.production`：生产环境。