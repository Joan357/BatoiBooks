import Module from './module.class.js'
import { getDBModules } from '../services/modules.api.js'

export default class Modules {
  constructor() {
    this.data = []
  }

  async populate() {
    const items = await getDBModules()
    this.data = items.map((item) => {
      return new Module(item.code, item.cliteral, item.vliteral, item.courseId)
    })
    return this.data
  }

  getModuleByCode(code) {
    const module = this.data.find((item) => item.code === code)
    if (!module) throw new Error('Módulo no encontrado')
    return module
  }

  toString() {
    return this.data.map((module) => module.toString()).join('\n')
  }
}
