// 隨機打亂陣列
export function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// 從陣列中隨機選取 n 個元素
export function randomPick(array, n) {
  return shuffleArray(array).slice(0, n)
}

// 產生測驗選項（包含正確答案和干擾項）
export function generateOptions(correctAnswer, allAnswers, count = 4) {
  const otherAnswers = allAnswers.filter(a => a !== correctAnswer)
  const distractors = randomPick(otherAnswers, count - 1)
  return shuffleArray([correctAnswer, ...distractors])
}

// 計算測驗分數
export function calculateScore(answers) {
  const correct = answers.filter(a => a.isCorrect).length
  const total = answers.length
  const percentage = Math.round((correct / total) * 100)
  return { correct, total, percentage }
}

// 格式化日期
export function formatDate(date) {
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

// 切換全螢幕
export async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      return true
    } else {
      await document.exitFullscreen()
      return false
    }
  } catch (e) {
    console.error('Fullscreen error:', e)
    return document.fullscreenElement !== null
  }
}

// 檢查是否為全螢幕
export function isFullscreen() {
  return document.fullscreenElement !== null
}

// 簡單的單字詞典（用於句子中單字的即時翻譯）
const commonWords = {
  // 冠詞
  'the': '這個/那個',
  'a': '一個',
  'an': '一個',

  // 代名詞
  'i': '我',
  'you': '你',
  'he': '他',
  'she': '她',
  'it': '它',
  'we': '我們',
  'they': '他們',
  'this': '這個',
  'that': '那個',
  'these': '這些',
  'those': '那些',

  // 介係詞
  'in': '在...裡面',
  'on': '在...上面',
  'at': '在',
  'to': '到/向',
  'for': '為了',
  'with': '和/與',
  'by': '被/經由',
  'from': '從',
  'of': '的',
  'about': '關於',

  // 連接詞
  'and': '和',
  'or': '或',
  'but': '但是',
  'because': '因為',
  'so': '所以',
  'if': '如果',
  'when': '當...時',
  'while': '當...時',

  // Be 動詞
  'is': '是',
  'am': '是',
  'are': '是',
  'was': '是(過去)',
  'were': '是(過去)',
  'be': '是',
  'been': '是(過去分詞)',
  'being': '正在是',

  // 常見動詞
  'have': '有/已經',
  'has': '有/已經',
  'had': '有(過去)',
  'do': '做',
  'does': '做',
  'did': '做(過去)',
  'will': '將會',
  'would': '會/將',
  'can': '能夠',
  'could': '能夠(過去)',
  'should': '應該',
  'must': '必須',
  'may': '可能',
  'might': '可能',

  // 常見單字
  'not': '不',
  'no': '不/沒有',
  'yes': '是',
  'more': '更多',
  'most': '最多',
  'very': '非常',
  'also': '也',
  'just': '只是/剛剛',
  'now': '現在',
  'then': '然後/那時',
  'here': '這裡',
  'there': '那裡',
  'where': '哪裡',
  'what': '什麼',
  'who': '誰',
  'how': '如何',
  'why': '為什麼',
  'which': '哪一個',
  'new': '新的',
  'old': '舊的',
  'good': '好的',
  'bad': '壞的',
  'big': '大的',
  'small': '小的',
  'first': '第一',
  'last': '最後',
  'long': '長的',
  'great': '偉大的',
  'little': '小的',
  'own': '自己的',
  'other': '其他的',
  'only': '只有',
  'well': '好地',
  'back': '回來',
  'after': '之後',
  'before': '之前',
  'still': '仍然',
  'over': '超過/結束',
  'such': '如此的',
  'through': '通過',
  'many': '許多',
  'much': '很多',
  'some': '一些',
  'any': '任何',
  'all': '全部',
  'both': '兩者',
  'each': '每個',
  'every': '每一個',
  'between': '之間',
  'under': '在...下面',
  'again': '再次',
  'never': '從不',
  'always': '總是',
  'often': '經常',
  'away': '離開',
  'too': '也/太',
  'even': '甚至',
  'since': '自從',
  'until': '直到',
  'during': '在...期間',
  'without': '沒有',
  'however': '然而',
  'therefore': '因此',
  'although': '雖然',
  'whether': '是否',
}

// 查詢單字翻譯
export function lookupWord(word) {
  const cleaned = word.toLowerCase().replace(/[^a-z]/g, '')
  return commonWords[cleaned] || null
}
