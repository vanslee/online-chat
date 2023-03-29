import { PiniaPluginContext } from "pinia";
import { toRaw } from "vue";
const __piniaKey = "___PINIAKEY___";
type Options = {
  key?: string;
};
// 定义入参类型
// 将数据存在本地
const setStorage = (key: string, value: any): void => {
  localStorage.setItem(key, JSON.stringify(value));
};
// 缓存中读取
const getStorage = (key: string) => {
  return localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key) as string)
    : {};
};
// 利用函数柯里化接受用户入参
const piniaPlugin = (options: Options) => {
  return (context: PiniaPluginContext) => {
    const { store } = context;
    const data = getStorage(`${options?.key ?? __piniaKey}-${store.$id}`);
    store.$subscribe(() => {
      setStorage(
        `${options?.key ?? __piniaKey}-${store.$id}`,
        toRaw(store.$state)
      );
    });
    return {
      //返回值覆盖pina原始值
      ...data,
    };
  };
};

export default piniaPlugin;
