import User from './user.class.js'
import {
  addDBUser,
  changeDBUser,
  changeDBUserPassword,
  getDBUsers,
  removeDBUser,
} from '../services/users.api.js'

export default class Users {
  constructor() {
    this.data = []
  }

  async populate() {
    const items = await getDBUsers()
    this.data = items.map((item) => new User(item.id, item.nick, item.email, item.password))
    return this.data
  }

  async addUser(userData) {
    const savedUser = await addDBUser(userData)
    const user = new User(savedUser.id, savedUser.nick, savedUser.email, savedUser.password)
    this.data.push(user)
    return user
  }

  async removeUser(id) {
    const index = this.getUserIndexById(id)
    await removeDBUser(id)
    this.data.splice(index, 1)
  }

  async changeUser(userData) {
    const index = this.getUserIndexById(userData.id)
    const savedUser = await changeDBUser(userData)
    const user = new User(savedUser.id, savedUser.nick, savedUser.email, savedUser.password)
    this.data[index] = user
    return user
  }

  async changeUserPassword(id, password) {
    const index = this.getUserIndexById(id)
    const savedUser = await changeDBUserPassword(id, password)
    const user = new User(savedUser.id, savedUser.nick, savedUser.email, savedUser.password)
    this.data[index] = user
    return user
  }

  getUserById(id) {
    const user = this.data.find((item) => item.id === id)
    if (!user) throw new Error('Usuario no encontrado')
    return user
  }

  getUserIndexById(id) {
    const index = this.data.findIndex((user) => user.id === id)
    if (index === -1) throw new Error('Usuario no encontrado')
    return index
  }

  getUserByNick(nick) {
    const user = this.data.find((item) => item.nick === nick)
    if (!user) throw new Error('Usuario no encontrado')
    return user
  }

  getUserByNickName(nick) {
    return this.getUserByNick(nick)
  }

  toString() {
    return this.data.map((user) => user.toString()).join('\n')
  }
}
