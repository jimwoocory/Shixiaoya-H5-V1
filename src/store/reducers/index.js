import { combineReducers } from 'redux'
import products from './products'
import cases from './cases'
import user from './user'
import ui from './ui'

export default combineReducers({
  products,
  cases,
  user,
  ui
})