import Module from './module.class.js'

export default class Modules {
  constructor() {
    this.data = []
  }

  populate(items) {
    this.data = items.map((item) => {
      return new Module(item.code, item.cliteral, item.vliteral, item.courseId)
    })
  }

  addModule(moduleData) {
    const module = new Module(
      moduleData.code,
      moduleData.cliteral,
      moduleData.vliteral,
      moduleData.courseId,
    )
    this.data.push(module)
    return module
  }

  removeModule(code) {
    const index = this.data.findIndex((module) => module.code === code)
    if (index === -1) throw new Error('Módulo no encontrado')
    this.data.splice(index, 1)
  }

  changeModule(moduleData) {
    const index = this.data.findIndex((module) => module.code === moduleData.code)
    if (index === -1) throw new Error('Módulo no encontrado')
    const module = new Module(
      moduleData.code,
      moduleData.cliteral,
      moduleData.vliteral,
      moduleData.courseId,
    )
    this.data[index] = module
    return module
  }

  getModuleByCode(code) {
    return this.data.find((module) => module.code === code)
  }

  toString() {
    return this.data.map((module) => module.toString()).join('\n')
  }
}
