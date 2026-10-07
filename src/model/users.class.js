import User from './user.class.js'

export default class Users {
  constructor() {
    this.data = []
  }

  populate(items) {
    this.data = items.map((item) => new User(item.id, item.nick, item.email, item.password))
  }

  addUser(userData) {
    const lastId = this.data.reduce((max, user) => Math.max(max, user.id), 0)
    const user = new User(lastId + 1, userData.nick, userData.email, userData.password)
    this.data.push(user)
    return user
  }

  removeUser(id) {
    const index = this.data.findIndex((user) => user.id === id)
    if (index === -1) throw new Error('Usuario no encontrado')
    this.data.splice(index, 1)
  }

  changeUser(userData) {
    const index = this.data.findIndex((user) => user.id === userData.id)
    if (index === -1) throw new Error('Usuario no encontrado')
    const user = new User(userData.id, userData.nick, userData.email, userData.password)
    this.data[index] = user
    return user
  }

  getUserById(id) {
    return this.data.find((user) => user.id === id)
  }

  getUserIndexById(id) {
    return this.data.findIndex((user) => user.id === id)
  }

  getUserByNick(nick) {
    return this.data.find((user) => user.nick === nick)
  }

  getUserByNickName(nick) {
    return this.getUserByNick(nick)
  }

  toString() {
    return this.data.map((user) => user.toString()).join('\n')
  }
}
