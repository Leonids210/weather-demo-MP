//index.js
//获取应用实例
const app = getApp()

const weatherMap = {
  'sunny': 'sunny',
  'cloudy': 'cloudy',
  'overcast': 'overcast',
  'lightrain': 'light rain',
  'heavyrain': 'heavy rain',
  'snow': 'snow'
}
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}
Page({
  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherBg: '',
    hourlyWeather: []
  },
  onLoad() {
    this.getNow()

  },
  onPullDownRefresh(){
    this.getNow(()=>{
      wx.stopPullDownRefresh({
        complete: (res) => {
          console.log(res)
        },
      })
    })
  },
  getNow() {
    console.log('change')
    const _this = this
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: 'BANGKOK'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        let result = res.data.result

        // set forecast
        _this.setNow(result)
        _this.setHourlyWeather(result)
        _this.setToday(result)
      }
    })
  },
  setNow(result) {
    const _this = this
    let temp = result.now.temp
    let weather = result.now.weather

    _this.setData({
      nowTemp: temp + '°',
      nowWeather: weatherMap[weather],
      nowWeatherBg: '/images/' + weather + '-bg.png'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },
  setHourlyWeather(result) {
    const _this = this
    let hourlyWeather = []
    let forecast = result.forecast
    let nowHour = new Date().getHours()
    for (let i = 0; i < 8; i += 1) {
      hourlyWeather.push({
        time: ((i * 3) + nowHour) % 24 + ':00',
        iconPath: '/images/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + '°'
      })
    }
    hourlyWeather[0].time = 'Now'
    _this.setData({
      hourlyWeather
    })
  },
  setToday(result) {
    let date = new Date()
    this.setData({
      todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
      todayDate: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} Today`
    })
  },
  onTapDayWeather() {
    wx.navigateTo({
      url: '/pages/list/list',
    })
  }
})