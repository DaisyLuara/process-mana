import router from 'router'

const install = Vue => {
  Vue.prototype.$cancel = function() {
    history.go(-1)
  }
}

const historyBack = () => {
  router.back()
}

const checkMobile = value => {
  if (/^1[345678]\d{9}$/.test(value)) {
    return true
  } else {
    return false
  }
}
// 时间格式化 yyyy-MM-dd
const handleDateTransform = valueDate => {
  let date = new Date(valueDate)
  let year = date.getFullYear() + '-'
  let mouth =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  let day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ''
  return year + mouth + day
}
//数字小写转大写
const formatMoneylowercase = mnum => {
  let number = parseFloat(mnum)
  let strOutput = '',
    strTemp = '',
    strInTemp = ''
  let unitArray = new Array('圆万亿', '仟佰拾', '零壹贰叁肆伍陆柒捌玖')
  let mnumArray = number.toString().split('.')
  let integralnum = mnumArray[0]
  let integrallen = integralnum.length
  let decimalnum =
  number.toString().indexOf('.') >= 0 ? mnumArray[1].substr(0, 2) : '0'
  let decimallen = decimalnum.length
  let ints = parseInt(integrallen / 4)
  let inty = integrallen % 4
  if (ints > 3 || (ints == 3 && inty > 0)) return '超出范围'
  if (inty > 0) {
    ints++
    integralnum = '0000'.substr(inty) + integralnum
    integrallen = integralnum.length
  }
  let i = 0
  while (i < integrallen) {
    let strOutTemp = ''
    strTemp = integralnum.substr(i, 4)
    i += 4
    for (let j = 0; j < 4; j++) {
      strInTemp = parseInt(strTemp.substr(j, 1))
      strOutTemp += unitArray[2].substr(strInTemp, 1)
      if (strInTemp > 0 && j < 3) strOutTemp += unitArray[1].substr(j, 1)
    }
    strOutTemp = strOutTemp.replace(/零+$/, '')
    ints--
    if (strOutTemp != '') strOutTemp += unitArray[0].substr(ints, 1)
    if (strTemp.substr(3, 1) == '0') strOutTemp += '零'
    strOutput += strOutTemp
  }
  strOutput = strOutput
    .replace(/零+/g, '零')
    .replace(/^零/, '')
    .replace(/零$/, '')
  if (strOutput == '圆') strOutput = ''
  if (decimallen == 2) {
    strOutput +=
      decimalnum.charAt(0) != '0'
        ? unitArray[2].substr(parseInt(decimalnum.charAt(0)), 1) + '角'
        : '零'
    if (strOutput == '零') strOutput = ''
    strOutput += unitArray[2].substr(parseInt(decimalnum.charAt(1)), 1) + '分'
  } else {
    if (decimalnum != '0')
      strOutput += unitArray[2].substr(parseInt(decimalnum), 1) + '角'
    if (strOutput != '') strOutput
  }
  if (strOutput == '') strOutput = '零圆'
  return strOutput
}

export {
  checkMobile,
  install,
  historyBack,
  handleDateTransform,
  formatMoneylowercase
}
