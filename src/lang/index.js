import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import zhTW from './zh-TW'
import enUS from './en-US'
import jaJP from './ja-JP'
import koKR from './ko-KR'
import esES from './es-ES'
import frFR from './fr-FR'
import deDE from './de-DE'
import ruRU from './ru-RU'

// 获取用户浏览器语言
const getBrowserLanguage = () => {
  // 优先从localStorage获取用户保存的语言设置
  const savedLang = localStorage.getItem('selectedLanguage')
  if (savedLang) {
    return savedLang.toLowerCase()
  }
  
  // 获取浏览器语言（降级处理）
  const lang = navigator.language || navigator.userLanguage || 'zh-CN'
  const langLower = lang.toLowerCase()
  
  // 尝试从navigator.languages数组中找到支持的语言
  if (navigator.languages && navigator.languages.length > 0) {
    for (const l of navigator.languages) {
      const lLower = l.toLowerCase()
      
      // 检查完整语言代码是否直接支持
      if (isLanguageSupported(lLower)) {
        return lLower
      }
      
      // 检查主要语言代码（如 'en' 而不是 'en-US'）
      const mainLang = lLower.split('-')[0]
      
      // 根据主要语言代码返回默认区域变体
      if (mainLang === 'zh') {
        return 'zh-cn'  // 中文默认返回简体中文
      } else if (mainLang === 'en') {
        return 'en-us'
      } else if (mainLang === 'ja') {
        return 'ja-jp'
      } else if (mainLang === 'ko') {
        return 'ko-kr'
      } else if (mainLang === 'es') {
        return 'es-es'
      } else if (mainLang === 'fr') {
        return 'fr-fr'
      } else if (mainLang === 'de') {
        return 'de-de'
      } else if (mainLang === 'ru') {
        return 'ru-ru'
      }
    }
  }
  
  // 检查完整语言代码
  if (langLower.includes('zh') && langLower.includes('tw')) {
    return 'zh-tw'
  } else if (langLower.includes('zh')) {
    return 'zh-cn'
  } else if (langLower.includes('en')) {
    return 'en-us'
  } else if (langLower.includes('ja')) {
    return 'ja-jp'
  } else if (langLower.includes('ko')) {
    return 'ko-kr'
  } else if (langLower.includes('es')) {
    return 'es-es'
  } else if (langLower.includes('fr')) {
    return 'fr-fr'
  } else if (langLower.includes('de')) {
    return 'de-de'
  } else if (langLower.includes('ru')) {
    return 'ru-ru'
  }
  
  // 返回浏览器原始语言
  return langLower
}

// 检测语言是否支持
const isLanguageSupported = (lang) => {
  const supportedLanguages = ['zh-cn', 'zh-tw', 'en-us', 'ja-jp', 'ko-kr', 'es-es', 'fr-fr', 'de-de', 'ru-ru']
  return supportedLanguages.includes(lang)
}


// 获取默认语言
const getDefaultLanguage = () => {
  const browserLang = getBrowserLanguage()
  
  // 检查完整语言代码是否支持
  if (isLanguageSupported(browserLang)) {
    return browserLang
  }
  
  // 检查主要语言代码
  const mainLang = browserLang.split('-')[0]
  
  // 根据主要语言代码选择默认区域变体
  if (mainLang === 'zh') {
    return 'zh-cn'  // 默认为简体中文
  } else if (mainLang === 'en') {
    return 'en-us'
  } else if (mainLang === 'ja') {
    return 'ja-jp'
  } else if (mainLang === 'ko') {
    return 'ko-kr'
  } else if (mainLang === 'es') {
    return 'es-es'
  } else if (mainLang === 'fr') {
    return 'fr-fr'
  } else if (mainLang === 'de') {
    return 'de-de'
  } else if (mainLang === 'ru') {
    return 'ru-ru'
  }
  
  // 默认返回中文
  return 'zh-cn'
}

// 导出语言相关工具函数
export { getBrowserLanguage, getDefaultLanguage, isLanguageSupported }

// 定义各语言的消息对象
const messages = {
  'zh-cn': zhCN,
  'zh-tw': zhTW,
  'en-us': enUS,
  'ja-jp': jaJP,
  'ko-kr': koKR,
  'es-es': esES,
  'fr-fr': frFR,
  'de-de': deDE,
  'ru-ru': ruRU
}

// 配置i18n，使用兼容模式确保$t在模板中正常工作
const i18n = createI18n({
  legacy: true,          // 使用兼容模式，确保$t可用
  locale: getDefaultLanguage(), // 使用默认格式获取语言代码
  fallbackLocale: 'zh-cn',      // 默认语言
  messages,              // 语言消息对象
  globalInjection: true  // 全局注入$t
})

// 导出i18n实例
export default i18n