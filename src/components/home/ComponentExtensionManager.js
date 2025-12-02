const componentRegistry = {
  activityCards: {
    normal: null,
    promotion: null,
  },
  layouts: {
    grid: null,
    carousel: null,
  },
  custom: {}
};

class ComponentExtensionManager {
  static registerActivityCard(type, component, options = {}) {
    if (!type || !component) return false;
    componentRegistry.activityCards[type] = { component, options };
    return true;
  }

  static registerLayout(type, component, options = {}) {
    if (!type || !component) return false;
    componentRegistry.layouts[type] = { component, options };
    return true;
  }

  static registerCustomComponent(name, component, options = {}) {
    if (!name || !component) return false;
    componentRegistry.custom[name] = { component, options };
    return true;
  }

  static getActivityCard(type) {
    return componentRegistry.activityCards[type] || null;
  }

  static getLayout(type) {
    return componentRegistry.layouts[type] || null;
  }

  static getCustomComponent(name) {
    return componentRegistry.custom[name] || null;
  }

  static isRegistered(category, type) {
    if (!componentRegistry[category]) return false;
    const component = componentRegistry[category][type];
    return component !== null && component !== undefined;
  }

  // 移除JSX语法，返回组件配置而不是组件实例
  static createActivityCard(type, props = {}) {
    const cardConfig = this.getActivityCard(type);
    if (!cardConfig) return null;
    return { component: cardConfig.component, props };
  }

  static getActivityTypes() {
    return Object.keys(componentRegistry.activityCards);
  }

  static getLayoutTypes() {
    return Object.keys(componentRegistry.layouts);
  }

  static getRegistryInfo() {
    return {
      activityCards: this.getActivityTypes(),
      layouts: this.getLayoutTypes(),
      customComponents: Object.keys(componentRegistry.custom)
    };
  }
}

export const ActivityTypeUtils = {
  isSupportedType(type) {
    return ComponentExtensionManager.isRegistered('activityCards', type);
  },
  getCardConfig(activity) {
    const type = activity?.type || 'normal';
    return ComponentExtensionManager.getActivityCard(type) || { options: {} };
  }
};

export const LayoutUtils = {
  isSupportedLayout(type) {
    return ComponentExtensionManager.isRegistered('layouts', type);
  },
  getLayoutConfig(type) {
    return ComponentExtensionManager.getLayout(type) || { options: {} };
  }
};

export default ComponentExtensionManager;