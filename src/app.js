import { Component } from 'react'
import './app.scss'

class App extends Component {
  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return this.props.children
  }
}

export default App