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

// 鑾峰彇鐢ㄦ埛娴忚鍣ㄨ瑷€
const getBrowserLanguage = () => {
  // 浼樺厛浠巐ocalStorage鑾峰彇鐢ㄦ埛淇濆瓨鐨勮瑷€璁剧疆
  const savedLang = localStorage.getItem('selectedLanguage')
  if (savedLang) {
    return savedLang.toLowerCase()
  }
  
  // 鑾峰彇娴忚鍣ㄨ瑷€锛堥檷绾у鐞嗭級
  const lang = navigator.language || navigator.userLanguage || 'zh-CN'
  const langLower = lang.toLowerCase()
  
  // 灏濊瘯浠巒avigator.languages鏁扮粍涓壘鍒版敮鎸佺殑璇█
  if (navigator.languages && navigator.languages.length > 0) {
    for (const l of navigator.languages) {
      const lLower = l.toLowerCase()
      
      // 妫€鏌ュ畬鏁磋瑷€浠ｇ爜鏄惁鐩存帴鏀寔
      if (isLanguageSupported(lLower)) {
        return lLower
      }
      
      // 妫€鏌ヤ富瑕佽瑷€浠ｇ爜锛堝 'en' 鑰屼笉鏄?'en-US'锛?
      const mainLang = lLower.split('-')[0]
      
      // 鏍规嵁涓昏璇█浠ｇ爜杩斿洖榛樿鍖哄煙鍙樹綋
      if (mainLang === 'zh') {
        return 'zh-cn'  // 涓枃榛樿杩斿洖绠€浣撲腑鏂?
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
  
  // 妫€鏌ュ畬鏁磋瑷€浠ｇ爜
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
  
  // 杩斿洖娴忚鍣ㄥ師濮嬭瑷€
  return langLower
}

// 妫€娴嬭瑷€鏄惁鏀寔
const isLanguageSupported = (lang) => {
  const supportedLanguages = ['zh-cn', 'zh-tw', 'en-us', 'ja-jp', 'ko-kr', 'es-es', 'fr-fr', 'de-de', 'ru-ru']
  return supportedLanguages.includes(lang)
}


// 鑾峰彇榛樿璇█
const getDefaultLanguage = () => {
  const browserLang = getBrowserLanguage()
  
  // 妫€鏌ュ畬鏁磋瑷€浠ｇ爜鏄惁鏀寔
  if (isLanguageSupported(browserLang)) {
    return browserLang
  }
  
  // 妫€鏌ヤ富瑕佽瑷€浠ｇ爜
  const mainLang = browserLang.split('-')[0]
  
  // 鏍规嵁涓昏璇█浠ｇ爜閫夋嫨榛樿鍖哄煙鍙樹綋
  if (mainLang === 'zh') {
    return 'zh-cn'  // 榛樿涓虹畝浣撲腑鏂?
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
  
  // 榛樿杩斿洖涓枃
  return 'zh-cn'
}

// 瀵煎嚭璇█鐩稿叧宸ュ叿鍑芥暟
export { getBrowserLanguage, getDefaultLanguage, isLanguageSupported }

// 瀹氫箟鍚勮瑷€鐨勬秷鎭璞?
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

// 閰嶇疆i18n锛屼娇鐢ㄥ吋瀹规ā寮忕‘淇?t鍦ㄦā鏉夸腑姝ｅ父宸ヤ綔
const i18n = createI18n({
  legacy: true,          // 浣跨敤鍏煎妯″紡锛岀‘淇?t鍙敤
  locale: getDefaultLanguage(), // 浣跨敤榛樿鏍煎紡鑾峰彇璇█浠ｇ爜
  fallbackLocale: 'zh-cn',      // 榛樿璇█
  messages,              // 璇█娑堟伅瀵硅薄
  globalInjection: true  // 鍏ㄥ眬娉ㄥ叆$t
})

// 瀵煎嚭i18n瀹炰緥
export default i18n
