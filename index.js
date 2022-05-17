import query from 'jquery'
import { fabric } from 'fabric'

const $ = query

class Tools {
  constructor() {
    this.timer = null
  }

  getRandomColor() { // 随机颜色
    return '#' + Math.floor(Math.random() * 16777215).toString(16)
  }

  getRandomInt(max) { // 随机数
    return Math.floor(Math.random() * max)
  }

  getRandomNum(n, m) {
    return Math.floor(Math.random() * (m - n + 1) + n)
  }
  debounce(fn, delay = 200) {
    const c = this
    return function(...args) {
      if (c.timer) clearTimeout(c.timer)
      c.timer = setTimeout(() => { fn.apply(c, args) }, delay)
    }
  }
}
class AwesomeBtn extends Tools {
  constructor(eleName = '', params = {}) {
    /**
     * eleName 元素名称
     * params {
     *   acType = particular
     *    num = 20
     * }
     */
    // 初始化按钮 创建canvas背景
    super()
    this.cWidth = 0 // canvas宽
    this.cHeight = 0 // canvas高
    this._canvas = null // fabric canvas实例
    this.btnE = null // jq 按钮元素
    // this.partCirList = [] // 粒子特效元素集合

    if (eleName && typeof eleName === 'string') {
      const btnEles = $(eleName)
      if (btnEles.length > 0) {
        console.log('awesomeBtn: got btn!')
        const [ele, ...elseB] = btnEles // 只绑定第一个元素
        if (elseB.length > 0) {
          throw new Error('awesomeBtn: can only bind one btn')
        }
        const btnE = $(ele)
        btnE.css({ position: 'relative' })
        this.cWidth = btnE.width() + 100
        this.cHeight = btnE.height() + 100
        const randomName = Math.random().toString(36).split('.')[1]

        btnE.append(`<canvas id="btn-canvas-${randomName}" width="${this.cWidth}" height="${this.cHeight}"></canvas>`)
        this._canvas = new fabric.StaticCanvas(`btn-canvas-${randomName}`)
        const c = $(`${eleName} .canvas-container,#btn-canvas-${randomName}`)
        c.css({ position: 'absolute', top: ' 50%', left: '50%', 'z-index': -1, transform: `translate3d(-${this.cWidth / 2}px,-${this.cHeight / 2}px,0)` }) // 设置canvas-container样式
        this.btnE = btnE
        this.initAction(params)
      } else {
        throw new Error('awesomeBtn: got no element')
      }
    } else {
      throw new Error('awesomeBtn: name must be a string')
    }
  }

  initAction(params) { // 初始化动画 添加canvas元素
    const { acType = 'particular' } = params
    this.acType = acType // 动画类型
    if (acType === 'particular') { // 粒子特效
      const { num } = params
      this.handleParticular().initParticular(num)
    }
  }

  clickAction() { // 点击类动画效果（控制器）
    if (this.acType === 'particular') {
      this.handleParticular().particularAnimate()
    } else {
      throw new Error('awesomeBtn: maybe no type')
    }
  }

  handleParticular() {
    // 处理粒子特效相关逻辑

    const initParticular = (num = 20) => {
      // 初始化粒子特效
      this.partCirList = []
      const centerX = this.cWidth / 2
      const centerY = this.cHeight / 2

      for (let i = 0; i < num; i++) {
        this.partCirList.push({
          r: this.getRandomNum(10, 20),
          color: this.getRandomColor(),
          moveX: this.getRandomNum(-centerX, centerX),
          moveY: this.getRandomNum(-centerY, centerY),
          duration: this.getRandomNum(400, 500)
        })
      }

      this.partCirList.forEach((cirObj) => {
        const cir = new fabric.Circle({ radius: 0, originX: 'center', originY: 'center' })
        this._canvas.add(cir) // 添加圆
      })
      if (this.partCirList.length > 0) console.log('init particular')
    }

    const particularAnimate = () => {
      // 控制粒子动画
      const len = this.partCirList.length
      if (len > 0) console.log('start particular animate')
      const _c = this._canvas
      this.partCirList.forEach((config, i) => {
        const cir = _c.item(i)

        const params = { onChange: _c.renderAll.bind(_c), easing: fabric.util.ease.easeOutExpo,
          duration: config.duration, onComplete: this.debounce(resetParticular, 500) }
        const diffX = config.moveX > 0 ? `+=${config.moveX}` : `-=${Math.abs(config.moveX)}`
        const diffY = config.moveY > 0 ? `+=${config.moveY}` : `-=${Math.abs(config.moveY)}`

        cir.set({ radius: config.r, fill: config.color, left: this.cWidth / 2, top: this.cHeight / 2 }) // 粒子运动前重置
        cir.animate('left', diffX, params)
        cir.animate('top', diffY, params)
        cir.animate('radius', 0, params)
      })
    }

    const resetParticular = () => {
      // 重置粒子控制List
      console.log('reset')
      const len = this.partCirList.length
      const centerX = this.cWidth / 2
      const centerY = this.cHeight / 2

      for (let i = 0; i < len; i++) {
        this.partCirList[i].r = this.getRandomNum(10, 20)
        this.partCirList[i].color = this.getRandomColor()
        this.partCirList[i].moveX = this.getRandomNum(-centerX, centerX)
        this.partCirList[i].moveY = this.getRandomNum(-centerY, centerY)
        this.partCirList[i].duration = this.getRandomNum(400, 2000)
      }
    }

    return { particularAnimate, initParticular }
  }
}

export default AwesomeBtn
