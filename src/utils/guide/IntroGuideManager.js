// Intro.js引导管理器
import introJs from 'intro.js';
import 'intro.js/introjs.css';
import { guideConfigs, getCurrentGuideConfig } from './guideConfigs';

class IntroGuideManager {
  constructor() {
    this.currentGuide = null;
    this.isRunning = false;
  }

  /**
   * 启动指定页面的引导
   * @param {string} page - 页面标识或路径
   */
  startGuide(page) {
    // 停止当前运行的引导
    if (this.isRunning) {
      this.endGuide();
    }

    // 获取引导配置
    const config = typeof page === 'string' && page.startsWith('/')
      ? getCurrentGuideConfig(page)
      : guideConfigs[page];

    if (!config) {
      console.warn(`No guide configuration found for page: ${page}`);
      return;
    }

    // 初始化Intro.js
    this.currentGuide = introJs();
    this.isRunning = true;

    // 配置Intro.js选项
    this.currentGuide.setOptions({
      ...config.options,
      steps: config.steps,
      beforeChange: (targetElement) => {
        // 检查目标元素是否存在
        if (!targetElement) {
          console.warn('Target element not found, skipping step');
          // 自动进入下一步
          setTimeout(() => {
            this.currentGuide.nextStep();
          }, 500);
        }
      },
      oncomplete: () => {
        this._handleGuideComplete();
      },
      onexit: () => {
        this._handleGuideExit();
      }
    });

    // 启动引导
    this.currentGuide.start();
  }

  /**
   * 结束当前引导
   */
  endGuide() {
    if (this.currentGuide) {
      this.currentGuide.exit();
      this._resetState();
    }
  }

  /**
   * 获取当前引导状态
   * @returns {boolean} 是否正在运行
   */
  isGuideRunning() {
    return this.isRunning;
  }

  /**
   * 重置引导状态
   * @private
   */
  _resetState() {
    this.currentGuide = null;
    this.isRunning = false;
  }

  /**
   * 处理引导完成事件
   * @private
   */
  _handleGuideComplete() {
    console.log('Guide completed successfully');
    // 可以在这里添加引导完成后的逻辑，如存储完成状态
    this._resetState();
  }

  /**
   * 处理引导退出事件
   * @private
   */
  _handleGuideExit() {
    console.log('Guide exited');
    this._resetState();
  }
}

// 导出单例实例
export const guideManager = new IntroGuideManager();
