import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  plugins: [
    uni(),
    // 自动导入配置
    AutoImport({
      imports: [
        // 预设
        "vue",
        "uni-app",
      ],
    }),
  ],
  // server: {
  //   host: "localhost", // 指定服务器应该监听哪个IP地址,默认：localhost
  //   port: 5173, // 指定开发服务器端口,默认：5173
  //   proxy: {
  //     "/api": {
  //       target: "https://tea.qingnian8.com/api/bizhi", // 目标接口
  //       changeOrigin: true, // 是否换源
  //       rewrite: (path) => path.replace(/^\/api/, ""),
  //     },
  //   },
  // },
});
