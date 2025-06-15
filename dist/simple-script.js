// ========================================
// 🚀 简化版本脚本 - 无需配置文件
// ========================================

// ⚙️ 自定义设置区域 - 在这里修改二维码内容
// ==========================================
const customSettings = {
    // 📱 二维码设置 - 修改下面的内容来自定义二维码
    qrCode: {
        // 🔗 二维码内容 - 可以是网址、文字、微信号等任何内容
        content: "https://www.baidu.com",  // 默认是当前页面网址
        
        // 🎨 二维码样式设置
        size: 150,           // 尺寸大小
        color: '#667eea',    // 前景色（二维码颜色）
        background: 'white'  // 背景色
    }
};

// 全局变量
let currentTheme = 'light';
let clickCount = 856; // 点击统计

// DOM 元素
const elements = {
    shareModal: document.getElementById('shareModal'),
    closeShareModal: document.getElementById('closeShareModal'),
    shareBtn: document.getElementById('shareBtn'),
    themeBtn: document.getElementById('themeBtn'),
    analyticsBtn: document.getElementById('analyticsBtn'),
    shareUrl: document.getElementById('shareUrl'),
    copyUrlBtn: document.getElementById('copyUrlBtn'),
    qrCanvas: document.getElementById('qrCanvas')
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 页面加载完成');
    initializeApp();
    setupEventListeners();
    generateQRCode();
    setupLinkTracking();
});

// 初始化应用
function initializeApp() {
    console.log('🚀 应用初始化中...');
    
    // 设置分享URL
    if (elements.shareUrl) {
        elements.shareUrl.value = window.location.href;
    }
    
    // 添加主题切换动画
    document.body.classList.add('theme-transition');
    
    // 从本地存储加载主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-theme');
            updateThemeButton();
        }
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 分享相关
    if (elements.shareBtn) {
        elements.shareBtn.addEventListener('click', openShareModal);
    }
    if (elements.closeShareModal) {
        elements.closeShareModal.addEventListener('click', closeShareModal);
    }
    if (elements.copyUrlBtn) {
        elements.copyUrlBtn.addEventListener('click', copyShareUrl);
    }
    
    // 工具栏按钮
    if (elements.themeBtn) {
        elements.themeBtn.addEventListener('click', toggleTheme);
    }
    if (elements.analyticsBtn) {
        elements.analyticsBtn.addEventListener('click', showAnalytics);
    }
    
    // 点击模态框背景关闭
    if (elements.shareModal) {
        elements.shareModal.addEventListener('click', function(e) {
            if (e.target === this) closeShareModal();
        });
    }
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && elements.shareModal.classList.contains('active')) {
            closeShareModal();
        }
    });
}

// 打开分享模态框
function openShareModal() {
    if (elements.shareModal) {
        elements.shareModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        elements.shareUrl.value = window.location.href;
        elements.shareUrl.select(); // 自动选中链接
    }
}

// 关闭分享模态框
function closeShareModal() {
    if (elements.shareModal) {
        elements.shareModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// 复制分享链接
function copyShareUrl() {
    if (elements.shareUrl && elements.copyUrlBtn) {
        elements.shareUrl.select();
        
        try {
            // 使用现代剪贴板API
            if (navigator.clipboard) {
                navigator.clipboard.writeText(elements.shareUrl.value).then(() => {
                    showCopySuccess();
                });
            } else {
                // 兼容旧浏览器
                document.execCommand('copy');
                showCopySuccess();
            }
        } catch (err) {
            console.error('复制失败:', err);
            showNotification('复制失败，请手动复制', 'error');
        }
    }
}

// 显示复制成功效果
function showCopySuccess() {
    const originalText = elements.copyUrlBtn.innerHTML;
    elements.copyUrlBtn.innerHTML = '<i class="fas fa-check"></i>';
    elements.copyUrlBtn.style.background = '#28a745';
    
    setTimeout(() => {
        elements.copyUrlBtn.innerHTML = originalText;
        elements.copyUrlBtn.style.background = '';
    }, 2000);
    
    showNotification('链接已复制到剪贴板！', 'success');
}

// 切换主题
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-theme');
    
    // 保存到本地存储
    localStorage.setItem('theme', currentTheme);
    
    updateThemeButton();
    showNotification(`已切换到${currentTheme === 'dark' ? '深色' : '浅色'}主题`, 'success');
}

// 更新主题按钮文字
function updateThemeButton() {
    if (elements.themeBtn) {
        const themeText = currentTheme === 'dark' ? '浅色' : '深色';
        const icon = currentTheme === 'dark' ? 'fa-sun' : 'fa-palette';
        elements.themeBtn.innerHTML = `<i class="fas ${icon}"></i><span>${themeText}</span>`;
    }
}

// 显示统计信息
function showAnalytics() {
    // 获取当前统计数据
    const followersElement = document.querySelector('.stat-number');
    const clicksElement = document.querySelectorAll('.stat-number')[1];
    const linksElement = document.querySelectorAll('.stat-number')[2];
    
    const followers = followersElement ? followersElement.textContent : '1.2K';
    const clicks = clicksElement ? clicksElement.textContent : clickCount;
    const links = linksElement ? linksElement.textContent : '3';
    
    const message = `📊 数据统计\n👥 关注者：${followers}\n👆 总点击：${clicks}\n🔗 链接数：${links}`;
    showNotification(message, 'info', 5000);
}

// 生成二维码
function generateQRCode() {
    if (elements.qrCanvas) {
        if (typeof QRious !== 'undefined') {
            try {
                const qr = new QRious({
                    element: elements.qrCanvas,
                    value: customSettings.qrCode.content,        // 使用自定义内容
                    size: customSettings.qrCode.size,            // 使用自定义尺寸
                    background: customSettings.qrCode.background, // 使用自定义背景色
                    foreground: customSettings.qrCode.color,     // 使用自定义前景色
                    level: 'M'
                });
                console.log('✅ 二维码生成成功，内容:', customSettings.qrCode.content);
            } catch (error) {
                console.error('二维码生成失败:', error);
                drawPlaceholderQR();
            }
        } else {
            console.warn('QRious 库未加载，使用占位符');
            drawPlaceholderQR();
        }
    }
}

// 绘制占位符二维码
function drawPlaceholderQR() {
    if (elements.qrCanvas) {
        elements.qrCanvas.width = customSettings.qrCode.size;
        elements.qrCanvas.height = customSettings.qrCode.size;
        const ctx = elements.qrCanvas.getContext('2d');
        
        const size = customSettings.qrCode.size;
        
        // 绘制背景
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, size, size);
        
        // 绘制边框
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, size-2, size-2);
        
        // 绘制文字
        ctx.fillStyle = '#666';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('二维码', size/2, size/2-10);
        ctx.font = '12px Arial';
        ctx.fillText('点击刷新', size/2, size/2+10);
        
        // 添加点击事件重新生成
        elements.qrCanvas.style.cursor = 'pointer';
        elements.qrCanvas.onclick = generateQRCode;
    }
}

// 链接点击追踪
function setupLinkTracking() {
    document.querySelectorAll('[data-analytics]').forEach(link => {
        link.addEventListener('click', function(e) {
            const linkName = this.getAttribute('data-analytics');
            trackLinkClick(linkName);
        });
    });
}

function trackLinkClick(linkName) {
    clickCount++;
    console.log(`📈 点击追踪: ${linkName}, 总点击数: ${clickCount}`);
    
    // 更新页面上的点击数
    const clicksElement = document.querySelectorAll('.stat-number')[1];
    if (clicksElement) {
        clicksElement.textContent = clickCount;
    }
    
    // 保存到本地存储
    localStorage.setItem('clickCount', clickCount);
}

// 显示通知
function showNotification(message, type = 'info', duration = 3000) {
    // 移除已存在的通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        word-wrap: break-word;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // 设置颜色
    const colors = {
        success: '#28a745',
        error: '#dc3545', 
        warning: '#ffc107',
        info: '#17a2b8'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // 设置内容
    notification.innerHTML = message.replace(/\n/g, '<br>');
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动消失
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, duration);
}

// 从本地存储加载数据
function loadFromStorage() {
    const savedClickCount = localStorage.getItem('clickCount');
    if (savedClickCount) {
        clickCount = parseInt(savedClickCount);
    }
}

// 页面可见性变化时的处理
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // 页面重新可见时，刷新二维码
        generateQRCode();
    }
});

// 加载本地存储的数据
loadFromStorage();

console.log('🎉 简化版脚本加载完成！'); 