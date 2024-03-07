import 'core-js/features/promise';
import 'core-js/features/url';
import 'core-js/features/array/includes';
import 'core-js/features/object/assign';
import 'proxy-polyfill';
import { TinyEmitter } from 'tiny-emitter';
import { ContainerMethod, ContainerRect, DisableMentionCards, FileType, InvokeMethod, MouseMovePayload, ReadyState, PerformanceEntry, DeviceMode, GenerateUrlHandler, APIAdaptor, RequestContext } from 'shimo-js-sdk-shared';
import { Document, DocumentPro, Presentation, Spreadsheet, Table, Form } from '.';
import { BaseEditor } from './types/BaseEditor';
export declare const MessageEvent: typeof InvokeMethod;
export declare class ShimoSDK extends TinyEmitter {
    /**
     * 编辑器页面对应的 iframe 元素。需要注意调整父元素大小来控制 iframe 大小。
     */
    element: HTMLIFrameElement;
    readonly uuid: string;
    /**
     * 传统文档编辑器实例
     * @deprecated - 用 `sdk.getEditor<T>()` 替代
     */
    documentPro?: DocumentPro.Editor;
    /**
     * 轻文档编辑器实例
     * @deprecated - 用 `sdk.getEditor<T>()` 替代
     */
    document?: Document.Editor;
    /**
     * 表格编辑器实例
     * @deprecated - 用 `sdk.getEditor<T>()` 替代
     */
    spreadsheet?: Spreadsheet.Editor;
    /**
     * 专业幻灯片编辑器实例
     * @deprecated - 用 `sdk.getEditor<T>()` 替代
     */
    presentation?: Presentation.Editor;
    /**
     * 应用表格编辑器实例
     * @deprecated - 用 `sdk.getEditor<T>()` 替代
     */
    table?: Table.Editor;
    /**
     * 表单编辑器实例
     * @deprecated - 用 `sdk.getEditor<T>()` 替代
     */
    form?: Form.Editor;
    private _fileType;
    private readonly messageHandler;
    /**
     * 内部 event emitter，比如用来中转 editor 事件
     */
    private readonly emitter;
    private channel;
    private readonly connectOptions;
    private _readyState;
    private editor;
    private readonly startParams;
    private readonly apiAdaptor;
    private readonly apiAdaptorContext;
    private readonly handledMessageCache;
    /**
     * 消息过期时间，单位毫秒，默认 5 分钟
     */
    private readonly messageExpires;
    /**
     * SDK 服务器的地址
     */
    private readonly endpoint;
    private readonly sameOrigin;
    private readonly onViewportResize;
    constructor(options: ShimoSDKOptions);
    get fileType(): FileType;
    get readyState(): ReadyState;
    getEditor<T extends BaseEditor | Document.Editor | DocumentPro.Editor | Presentation.Editor | Spreadsheet.Editor | Form.Editor | Table.Editor = BaseEditor>(): T;
    /**
     * 更新鉴权 signature 和 token
     */
    setCredentials(payload: {
        signature: string;
        token: string;
    }): Promise<void>;
    /**
     * 设置石墨的鉴权 signature。用于实时更新鉴权信息，优化用户出现因长时间放置，鉴权失败而引起的体验问题。
     * @deprecated - 用 `sdk.setCredentials()` 替代
     */
    setSignature(signature: string): Promise<void>;
    /**
     * 设置您系统的鉴权 token。用于实时更新鉴权信息，优化用户出现因长时间放置，鉴权失败而引起的体验问题。
     * @deprecated - 用 `sdk.setCredentials()` 替代
     */
    setToken(token: string): Promise<void>;
    /**
     * 获取性能信息片段列表，由于性能标记是分段的、异步的，因此每次调用时获取的列表有可能不一致
     */
    getPerformanceEntries(): Promise<PerformanceEntry[]>;
    disconnect(): void;
    /**
     * 初始化 SDK，返回 Promise，当 ReadState 变为 Ready 或 Failed 时，Promise 将被 resolve。
     * Promise resovled 不代表编辑器已经完整加载完毕，只代表 SDK 已经准备好了。
     * 同时 Promise 一直 pending 也不代表编辑器加载失败，只代表无法通过 SDK 和编辑器交互。
     * 比如受浏览器限制无法发出 postMessage() 时，Promise 将会一直 pending。
     */
    init(): Promise<void>;
    private initIframe;
    private initChannel;
    /**
     * 初始化处理编辑器需要容器返回数据的方法
     */
    private bindContainerMethodHandlers;
    private initEditor;
    private shouldHandleMessage;
    private getContainerRect;
}
/**
 * 需要容器提供给编辑器使用的方法
 */
export interface ContainerMethods {
    /**
     * 获取容器尺寸等信息
     */
    [ContainerMethod.GetContainerRect]?: () => ContainerRect;
    /**
     * 处理石墨文档内点击链接事件
     */
    [ContainerMethod.OpenLink]?: (
    /**
     * 目标链接
     */
    url: string, 
    /**
     * 意义和 window.open 的第二个参数一样，属于石墨建议的值，具体是否需要使用请接入方自行判断。
     */
    target?: string) => void;
    /**
     * 生成插入到石墨文档中的链接，用于处理 @ 文件等功能需要插入的链接
     */
    [ContainerMethod.GenerateUrl]?: GenerateUrlHandler;
    /**
     * 用于移动端处理 @ 点击事件
     */
    [ContainerMethod.MentionClickHandlerForMobile]?: (payload: MouseMovePayload) => void;
    /**
     * 用于从客户业务 URL 中获取对应的文件 ID，供编辑器使用。
     */
    [ContainerMethod.GetFileInfoFromUrl]?: (url: string) => Promise<{
        /**
         * 文件 ID
         */
        fileId: string;
        /**
         * 文件对应的类型
         */
        type: string;
    } | undefined>;
}
export declare enum Event {
    /**
     * SDK 初始化事件，用于内部逻辑
     */
    SDKInit = "SDKInit",
    /**
     * 错误事件，包含编辑器抛出的错误
     */
    Error = "error",
    /**
     * ShimoSDK 状态变化事件
     */
    ReadyState = "readyState",
    /**
     * 编辑器事件
     */
    EditorEvent = "editorEvent"
}
export interface Message {
    uuid?: string;
    event: string;
    body: any;
    error?: Error;
}
export interface MessageEventPayload {
    event: InvokeMethod;
    data: unknown[];
}
export interface ContainerMethodPayload {
    method: ContainerMethod;
    args: unknown[];
}
export interface ReadyStateEvent {
    state: ReadyState;
    fileType: FileType;
    error?: Error | string;
}
/**
 * 事件回调函数
 */
export declare type EventCallback = (...args: any[]) => any;
/**
 * ShimoSDK 初始化参数
 */
export interface ShimoSDKOptions extends Omit<ContainerMethods, 'getContainerRect'> {
    /**
     * 石墨 SDK 服务器地址
     */
    endpoint: string;
    /**
     * 您要打开的文档 ID
     */
    fileId: string;
    /**
     * 用于石墨 SDK 鉴权用的签名
     */
    signature: string;
    /**
     * iframe 挂载的目标容器
     */
    container: HTMLElement;
    /**
     * 用于您系统鉴权使用的 token
     */
    token: string;
    /**
     * 添加到 iframe URLSearchParams 的参数列表
     */
    params?: {
        [key: string]: string;
    };
    /**
     * 石墨 SDK URL 参数 url?smParams={params}，用于传递石墨 SDK 内部需要的参数。
     */
    smParams?: string | Record<string, unknown> | Array<string | Record<string, unknown>>;
    /**
     * 指定石墨 SDK 编辑器界面语言，添加到 iframe URLSearchParams 的参数列表。
     * 若未指定，则 iframe 使用服务器设置的默认语言。
     *
     * 目前支持的语言取值：
     * 1. zh-CN（简体中文）
     * 2. en（英文）
     * 3. ja（日文）
     */
    lang?: 'zh-CN' | 'en' | 'ja';
    /**
     * 是否禁用提及的浮动卡片组件
     */
    disableMentionCards?: DisableMentionCards;
    /**
     * 用于控制 iframe feature policy (https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Feature-Policy) 。
     * 会覆盖默认的 policy，因此使用时需要注意把需要的 policy 写完整。
     */
    allowPolicy?: string;
    /**
     * 是否开启调试模式，true 会通过 console 打印一些信息
     */
    debug?: boolean;
    /**
     * 编辑器插件配置，不是所有类型的套件都支持，以套件是否提供 PluginOptions 为准
     */
    plugins?: Spreadsheet.PluginOptions;
    /**
     * iframe postMessage 的目标 origin，默认是当前页面的 location.origin。
     * @deprecated
     */
    targetOrigin?: string;
    /**
     * 使用什么设备类型模式，会直接影响功能和样式，不传值或空字符串则默认用 user-agent 自动判断。受版本限制，不是所有类型都支持。
     */
    deviceMode?: DeviceMode;
    /**
     * 是否禁用默认的签名组件，以支持自定义签名组件。受版本限制，部分版本的特定类型文档才支持。
     */
    disableSignatureComponent?: boolean;
    /**
     * 是否显示内置的加载动画，只在静态资源加载到编辑器渲染这个阶段显示
     */
    showLoadingEffect?: boolean;
    /**
     * 用于在编辑器发起 API 请求时，对请求参数进行修改的函数。详细用法见文档。
     */
    apiAdaptor?: APIAdaptor;
    /**
     * 用于在编辑器发起 API 请求时，对请求参数进行修改的函数时传入的上下文数据。
     */
    apiAdaptorContext?: RequestContext;
    /**
     * 用于判断通信消息过期时间，过期后的消息会被抛弃，默认 5 分钟。
     */
    messageExpires?: number;
}
