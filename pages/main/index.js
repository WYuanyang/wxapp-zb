// pages/main/index.js
var util = require("../../utils/util.js");
var toPinyin = require("../../utils/toPinyin.js");
Page({
  data:{
    imagePath:"/images/bankcard.jpg",
    name:"WANG SICONG",
    money:"1000000",
    maskHidden:true,
    /*
    官网说hidden只是简单的控制显示与隐藏，组件始终会被渲染，
    但是将canvas转化成图片走的居然是fail，hidden为false就是成功的
    所以这里手动控制显示隐藏canvas
    */
    canvasHidden:false//初始时显示canvas
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    
  },
  onReady:function(){
    // 页面渲染完成
    this.createNewImg();
    //创建初始化图片
    
  },
  onShow:function(){
    
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },

  onUnload:function(){
    // 页面关闭

  },
 //将金额绘制到canvas的固定
  setMoney:function(context){
    var money=util.toThousands(this.data.money);
    console.log(money);
    context.setFontSize(24);
    context.setFillStyle("#484a3d");
    context.fillText(money, 340, 190);
    context.stroke();
  },
  //将姓名绘制到canvas的固定
  setName:function(context){
    var name = toPinyin.Pinyin.getFullChars(this.data.name);
    context.setFontSize(20);
    context.setFillStyle("#67695b");
    context.save();
    context.translate(170, 506);//必须先将旋转原点平移到文字位置
    context.rotate(-5 * Math.PI / 180);
    context.fillText(name, 0, 0);//必须为（0,0）原点
    context.restore();
    context.stroke();
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg:function(){
    var that = this;
    var context = wx.createContext();
    var path = "images/bankcard.jpg";
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    context.drawImage(path, 0, 0,686,686);
    this.setMoney(context);
    this.setName(context);
    //绘制图片
    wx.drawCanvas({
          canvasId: "mycanvas",
          actions: context.getActions()
    });
    //将生成好的图片保存到本地
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function success(res) {
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function success(res) {
            that.setData({
              imagePath:res.savedFilePath,
              canvasHidden:true//生成完图片后将画布隐藏
            });
          }
        });
      }
    });
  },
  //点击图片进行预览，长按保存分享图片
  previewImg:function(e){
    var img = this.data.imagePath
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },
  formSubmit: function(e) {
    var that = this;
    var name = e.detail.value.name;
    var money = e.detail.value.money;
    name = name == ""?"WANG SICONG":name;
    money = money == ""?"1000000":money;
    this.setData({
      name:name,
      money:money,
      maskHidden:false,
      canvasHidden:false
    });
    wx.showToast({
      title: '装逼中...',
      icon: 'loading',
      duration:2000
    });
    setTimeout(function(){
      wx.hideToast()
      that.createNewImg();
      that.setData({
        maskHidden:true
      });
    },2000)
    
  }

})