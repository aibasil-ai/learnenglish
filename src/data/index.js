// 整合所有關卡資料
import { levels as basicLevels } from './levels/01-basic.js'
import { levels as economyLevels } from './levels/02-economy.js'
import { levels as politicsLevels } from './levels/03-politics.js'
import { levels as technologyLevels } from './levels/04-technology.js'
import { levels as societyLevels } from './levels/05-society.js'
import { levels as environmentLevels } from './levels/06-environment.js'
import { levels as healthLevels } from './levels/07-health.js'
import { levels as lawLevels } from './levels/08-law.js'
import { levels as educationLevels } from './levels/09-education.js'
import { levels as mediaLevels } from './levels/10-media.js'
import { levels as militaryLevels } from './levels/11-military.js'
import { levels as sportsLevels } from './levels/12-sports.js'
import { levels as transportLevels } from './levels/13-transport.js'
import { levels as energyLevels } from './levels/14-energy.js'
import { levels as agricultureLevels } from './levels/15-agriculture.js'
import { levels as architectureLevels } from './levels/16-architecture.js'
import { levels as financeLevels } from './levels/17-finance.js'
import { levels as diplomacyLevels } from './levels/18-diplomacy.js'
import { levels as disasterLevels } from './levels/19-disaster.js'
import { levels as advancedLevels } from './levels/20-advanced.js'

export const allLevels = [
  ...basicLevels,
  ...economyLevels,
  ...politicsLevels,
  ...technologyLevels,
  ...societyLevels,
  ...environmentLevels,
  ...healthLevels,
  ...lawLevels,
  ...educationLevels,
  ...mediaLevels,
  ...militaryLevels,
  ...sportsLevels,
  ...transportLevels,
  ...energyLevels,
  ...agricultureLevels,
  ...architectureLevels,
  ...financeLevels,
  ...diplomacyLevels,
  ...disasterLevels,
  ...advancedLevels,
]

export const levelGroups = allLevels.reduce((groups, level) => {
  const lastGroup = groups[groups.length - 1]
  if (!lastGroup || lastGroup.category !== level.category) {
    groups.push({
      category: level.category,
      levels: [level],
    })
  } else {
    lastGroup.levels.push(level)
  }
  return groups
}, [])

const levelMetaMap = new Map()
for (const group of levelGroups) {
  group.levels.forEach((level, index) => {
    levelMetaMap.set(level.id, {
      category: group.category,
      categoryLevel: index + 1,
      categoryLevelCount: group.levels.length,
    })
  })
}

export const getLevelById = (id) => allLevels.find(l => l.id === id)
export const getLevelMetaById = (id) => levelMetaMap.get(id) || null
export const categoryStartLevelIds = levelGroups.map(group => group.levels[0].id)

export const getWordById = (wordId) => {
  for (const level of allLevels) {
    const word = level.words.find(w => w.id === wordId)
    if (word) return word
  }
  return null
}

export const totalWords = allLevels.reduce((sum, l) => sum + l.words.length, 0)
export const totalLevels = allLevels.length
