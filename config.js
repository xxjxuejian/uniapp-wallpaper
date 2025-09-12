// 系统信息
export const SYSTEM_INFO = uni.getSystemInfoSync();

// // 小程序端 访问地址前缀
// export const BASE_URL_MP = "https://tea.qingnian8.com/api/bizhi";
// // H5开发环境通过代理
// export const BASE_URL_H5_DEV = "/dev-api";
// // H5生产环境使用真实接口
// export const BASE_URL_H5_PROD = "https://tea.qingnian8.com/api/bizhi";

// 读取环境变量
export const BASE_URL_H5 = import.meta.env.VITE_BASE_API_H5;
export const BASE_URL_MP = import.meta.env.VITE_BASE_API_MP;
