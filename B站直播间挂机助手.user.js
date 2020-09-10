// ==UserScript==
// @namespace      https://github.com/andywang425
// @name           B站直播间挂机助手
// @name:en        B站直播间挂机助手
// @author         andywang425
// @description    自动获取小心心，直播区签到，应援团签到，银瓜子换硬币，完成主站每日任务(登录,观看视频,投币,分享视频)，批量送礼、点亮勋章，参与实物抽奖，参与Bilibili直播区礼物抽奖(现在极少)，参加被广播的节奏风暴(几乎没有)，定时发弹幕，快捷购买粉丝勋章
// @description:en 自动获取小心心，直播区签到，应援团签到，银瓜子换硬币，完成主站每日任务(登录,观看视频,投币,分享视频)，批量送礼、点亮勋章，参与实物抽奖，参与Bilibili直播区礼物抽奖(现在极少)，参加被广播的节奏风暴(几乎没有)，定时发弹幕，快捷购买粉丝勋章
// @updateURL      https://raw.githubusercontent.com/andywang425/Bilibili-SGTH/master/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B.user.js
// @downloadURL    https://raw.githubusercontent.com/andywang425/Bilibili-SGTH/master/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B.user.js
// @homepageURL    https://github.com/andywang425/BLTH/
// @supportURL     https://github.com/andywang425/BLTH/issues
// @icon           https://s1.hdslb.com/bfs/live/d57afb7c5596359970eb430655c6aef501a268ab.png
// @copyright      2020, andywang425 (https://github.com/andywang425)
// @license        MIT
// @compatible     chrome 80 or later
// @compatible     firefox 77 or later
// @compatible     opera 69 or later
// @version        4.5.2
// @include       /https?:\/\/live\.bilibili\.com\/[blanc\/]?[^?]*?\d+\??.*/
// @run-at        document-end
// @connect       passport.bilibili.com
// @connect       api.live.bilibili.com
// @connect       live-trace.bilibili.com
// @require       https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @require       https://cdn.jsdelivr.net/gh/andywang425/BLTH@4716930900e64769f19dd7aa00b0824a4961cdd0/modules/BilibiliAPI_Mod.min.js
// @require       https://cdn.jsdelivr.net/gh/andywang425/BLTH@4716930900e64769f19dd7aa00b0824a4961cdd0/modules/layer.js
// @require       https://cdn.jsdelivr.net/gh/andywang425/BLTH@4716930900e64769f19dd7aa00b0824a4961cdd0/modules/libBilibiliToken.js
// @require       https://cdn.jsdelivr.net/gh/andywang425/BLTH@4716930900e64769f19dd7aa00b0824a4961cdd0/modules/libWasmHash.js
// @resource      layerCss https://cdn.jsdelivr.net/gh/andywang425/BLTH@d86732c07164300f64a2e543f264ce4f6099fbfc/modules/layer.css
// @grant         unsafeWindow
// @grant         GM_xmlhttpRequest
// @grant         GM_getResourceText
// @grant         GM_addStyle
// ==/UserScript==
(function(){const NAME='IGIFTMSG',debugSwitch=true,BAPI=BilibiliAPI,UA=navigator.userAgent,tz_offset=new Date().getTimezoneOffset()+480,ts_ms=()=>Date.now(),ts_s=()=>Math.round(ts_ms()/1000),runUntilSucceed=(callback,delay=0,period=100)=>{setTimeout(()=>{if(!callback())runUntilSucceed(callback,period,period);},delay);},delayCall=(callback,delay=10e3)=>{const p=$.Deferred();setTimeout(()=>{const t=callback();if(t&&t.then)t.then((arg1,arg2,arg3,arg4,arg5,arg6)=>p.resolve(arg1,arg2,arg3,arg4,arg5,arg6));else p.resolve();},delay);return p;},MYDEBUG=(sign,...data)=>{if(!debugSwitch)return;let d=new Date();d=`[${NAME}][${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}]`;if(data.length===1){console.log(d,`${sign}:`,data[0]);return}
console.log(d,`${sign}:`,data);},runMidnight=(callback,msg)=>{const t=new Date();let name=msg||' ';t.setMinutes(t.getMinutes()+tz_offset);t.setDate(t.getDate()+1);t.setHours(0,1,0,0);t.setMinutes(t.getMinutes()-tz_offset);setTimeout(callback,t-ts_ms());MYDEBUG('runMidnight',name+" "+t.toString());},runExactMidnight=(callback,msg)=>{const t=new Date();let name=msg||' ';t.setMinutes(t.getMinutes()+tz_offset);t.setDate(t.getDate()+1);t.setHours(0,0,0,0);t.setMinutes(t.getMinutes()-tz_offset);setTimeout(callback,t-ts_ms());MYDEBUG('runExactMidnight',name+" "+t.toString());},runTomorrow=(callback,hour,minute,msg)=>{const t=new Date();let name=msg||' ';t.setMinutes(t.getMinutes()+tz_offset);t.setDate(t.getDate()+1);t.setHours(hour,minute,0,0);t.setMinutes(t.getMinutes()-tz_offset);setTimeout(callback,t-ts_ms());MYDEBUG('runTomorrow',name+" "+t.toString());},appToken=new BilibiliToken(),baseQuery=`actionKey=appkey&appkey=${BilibiliToken.appKey}&build=5561000&channel=bili&device=android&mobi_app=android&platform=android&statistics=%7B%22appId%22%3A1%2C%22platform%22%3A3%2C%22version%22%3A%225.57.0%22%2C%22abtest%22%3A%22%22%7D`,setToken=async()=>{if(tokenData.time>ts_s()){userToken=tokenData;}else{tokenData=await appToken.getToken();tokenData.time=ts_s()+tokenData.expires_in;localStorage.setItem(`${NAME}_Token`,JSON.stringify(tokenData));userToken=tokenData;};MYDEBUG(`${NAME}_Token`,tokenData);return'OK';},newWindow={init:()=>{return newWindow.Toast.init().then(()=>{});},Toast:{init:()=>{try{const list=[];window.toast=(msg,type='info',timeout=5e3)=>{switch(type){case'success':case'info':break;case'caution':break;case'error':break;default:type='info';}
const a=$(`<div class="link-toast ${type} fixed" style="z-index:10001"><span class="toast-text">${msg}</span></div>`)[0];document.body.appendChild(a);a.style.top=(document.body.scrollTop+list.length*40+10)+'px';a.style.left=(document.body.offsetWidth+document.body.scrollLeft-a.offsetWidth-5)+'px';if(msgHide=='hide'){$('.link-toast').hide();}
list.push(a);setTimeout(()=>{a.className+=' out';setTimeout(()=>{list.shift();list.forEach((v)=>{v.style.top=(parseInt(v.style.top,10)-40)+'px';});$(a).remove();},200);},timeout);};return $.Deferred().resolve();}catch(err){console.error(`初始化浮动提示时出现异常`,err);return $.Deferred().reject();}}}},addStyle=async()=>{const layerCss=await GM_getResourceText('layerCss');const myCss=".igiftMsg_input{outline:none;border:1px solid #e9eaec;background-color:#fff;border-radius:4px;padding:1px 0 0;overflow:hidden;font-size:12px;line-height:19px;width:30px;z-index:'10001';}.igiftMsg_btn{background-color:#23ade5;color:#fff;border-radius:4px;border:none;padding:5px;cursor:pointer;box-shadow:0 0 2px #00000075;line-height:10px;z-index:10001;}.igiftMsg_fs{border:2px solid #d4d4d4;z-index:10001;}";const AllCss=layerCss+myCss;return await GM_addStyle(AllCss);},ct=$('#chat-history-list'),getScrollPosition=(el=window)=>({x:el.pageXOffset!==undefined?el.pageXOffset:el.scrollLeft,y:el.pageYOffset!==undefined?el.pageYOffset:el.scrollTop});let msgHide=localStorage.getItem(`${NAME}_msgHide`)||'hide',gift_join_try=0,guard_join_try=0,pk_join_try=0,SEND_GIFT_NOW=false,SEND_DANMU_NOW=false,LIGHT_MEDAL_NOW=false,hideBtnClickable=true,Live_info={room_id:undefined,uid:undefined,ruid:undefined,gift_list:undefined,rnd:undefined,visit_id:undefined,bili_jct:undefined,tid:undefined,},userToken=undefined,tokenData=JSON.parse(localStorage.getItem(`${NAME}_Token`))||{},mainIndex=undefined,menuIndex=undefined;newWindow.init();window.onload=()=>{try{let UNIQUE_CHECK_CACHE=localStorage.getItem(`${NAME}_UNIQUE_CHECK_CACHE`)||0;const t=ts_ms();if(t-UNIQUE_CHECK_CACHE>=0&&t-UNIQUE_CHECK_CACHE<=15e3){window.toast('有其他直播间页面的脚本正在运行，本页面脚本停止运行','caution');return $.Deferred().resolve();}
let timer_unique;const uniqueMark=()=>{timer_unique=setTimeout(uniqueMark,10e3);UNIQUE_CHECK_CACHE=ts_ms();localStorage.setItem(`${NAME}_UNIQUE_CHECK_CACHE`,UNIQUE_CHECK_CACHE)};window.addEventListener('unload',()=>{if(timer_unique){clearTimeout(timer_unique);UNIQUE_CHECK_CACHE=0;localStorage.setItem(`${NAME}_UNIQUE_CHECK_CACHE`,UNIQUE_CHECK_CACHE)}});uniqueMark();}catch(e){MYDEBUG('重复运行检测错误',e);return $.Deferred().reject();}
const loadInfo=(delay)=>{setTimeout(async()=>{const W=typeof unsafeWindow==='undefined'?window:unsafeWindow;if((W.BilibiliLive===undefined||parseInt(W.BilibiliLive.UID)===0||isNaN(parseInt(W.BilibiliLive.UID)))){return loadInfo(1000);}else{Live_info.room_id=W.BilibiliLive.ROOMID;Live_info.uid=W.BilibiliLive.UID;Live_info.tid=W.BilibiliLive.ANCHOR_UID;await BAPI.gift.gift_config().then((response)=>{MYDEBUG('InitData: API.gift.gift_config',response);if(!!response.data&&$.isArray(response.data)){Live_info.gift_list=response.data;}else if(!!response.data.list&&$.isArray(response.data.list)){Live_info.gift_list=response.data.list;}else{Live_info.gift_list=[{"id":6,"price":1000},{"id":1,"price":100},{'id':30607,'price':5000}];window.toast('直播间礼物数据获取失败，使用备用数据','error');}});Live_info.bili_jct=BAPI.getCookie('bili_jct');Live_info.ruid=W.BilibiliLive.ANCHOR_UID;Live_info.rnd=W.BilibiliLive.RND;Live_info.visit_id=W.__statisObserver?W.__statisObserver.__visitId:'';MYDEBUG("Live_info",Live_info);init();}},delay);};loadInfo(1000);addStyle();};Array.prototype.remove=function(val){const index=this.indexOf(val);if(index>-1){this.splice(index,1);}};function init(){const MY_API={CONFIG_DEFAULT:{AUTO_DANMU:false,AUTO_GIFT:false,AUTO_GIFT_ROOMID:["0"],AUTO_GROUP_SIGN:true,CHECK_HOUR_ROOM:false,CHECK_HOUR_ROOM_INTERVAL:600,COIN:false,COIN_NUMBER:0,COIN_TYPE:"COIN_DYN",COIN_UID:0,DANMU_CONTENT:["这是一条弹幕"],DANMU_ROOMID:["22474988"],DANMU_INTERVAL_TIME:["10m"],EXCLUDE_ROOMID:["0"],FORCE_LOTTERY:false,FORCE_LIGHT:false,GIFT_LIMIT:1,GIFT_SEND_HOUR:23,GIFT_SEND_MINUTE:59,GIFT_INTERVAL:5,GIFT_METHOD:"GIFT_SEND_TIME",GIFT_SORT:'high',IN_TIME_RELOAD_DISABLE:false,LOTTERY:true,LIVE_SIGN:true,LOGIN:true,LITTLE_HEART:true,LIGHT_MEDALS:["0"],LIGHT_METHOD:"LIGHT_WHITE",MAX_GIFT:99999,MATERIAL_LOTTERY:true,MATERIAL_LOTTERY_CHECK_INTERVAL:60,MATERIAL_LOTTERY_IGNORE_QUESTIONABLE_LOTTERY:true,QUESTIONABLE_LOTTERY:['test','encrypt','测试','钓鱼','加密','炸鱼'],MATERIAL_LOTTERY_REM:9,NOSLEEP:true,RANDOM_DELAY:true,RANDOM_SEND_DANMU:0,RANDOM_SKIP:0,REMOVE_ELEMENT_2233:false,REMOVE_ELEMENT_activity:true,REMOVE_ELEMENT_rank:true,RND_DELAY_END:5,RND_DELAY_START:2,SEND_ALL_GIFT:false,SHARE:true,SILVER2COIN:false,SPARE_GIFT_ROOM:"0",STORM:false,STORM_MAX_COUNT:100,STORM_ONE_LIMIT:200,STORM_QUEUE_SIZE:3,TIME_AREA_DISABLE:true,TIME_AREA_END_H0UR:8,TIME_AREA_END_MINUTE:0,TIME_AREA_START_H0UR:2,TIME_AREA_START_MINUTE:0,TIME_RELOAD:false,TIME_RELOAD_MINUTE:120,WATCH:true,},CACHE_DEFAULT:{AUTO_SEND_DANMU_TS:[],AUTO_GROUP_SIGH_TS:0,DailyReward_TS:0,LiveReward_TS:0,Silver2Coin_TS:0,Gift_TS:0,GiftInterval_TS:0,LittleHeart_TS:0,materialobject_ts:0,last_aid:632,},CONFIG:{},CACHE:{},GIFT_COUNT:{COUNT:0,SILVER_COUNT:0,CLEAR_TS:0,},init:async()=>{const tabList=$('.tab-list.dp-flex'),tabContent=$('.tab-content'),tabOffSet=tabContent.offset(),tabHeight=tabContent.height(),ctWidth=ct.outerWidth(true),ctHeight=ct.height(),iconHeight=$('.icon-item').height(),top=tabOffSet.top,left=tabOffSet.left,menuDiv=$(`<li data-v-2fdbecb2="" data-v-d2be050a="" class="item dp-i-block live-skin-separate-border border-box t-center pointer live-skin-normal-text" id = "menuDiv">脚本日志</li>`),eleList=['.chat-history-list','.attention-btn-ctnr','.live-player-mounter'];if(eleList.some(i=>i.length===0)||tabList.length===0||tabContent.length===0){window.toast('必要页面元素缺失，强制运行（可能会看不到控制面板，提示信息）','error');}
tabList.append(menuDiv);let tabListItems=[];for(let i=0;i<tabList.children('li').length;i++){tabListItems.push(tabList.children('li')[i]);};function hideTab(hide=true){return hide?tabContent.hide():tabContent.show();};menuIndex=await layer.open({type:1,title:false,offset:[String(top-getScrollPosition().y)+'px',left+'px'],closeBtn:0,shade:0,zIndex:9999,fixed:false,area:[String(ctWidth)+'px',String(ctHeight+tabHeight+iconHeight)+'px'],anim:-1,isOutAnim:false,content:'<div id = "menuWindow"></div>'});layer.style(menuIndex,{'box-shadow':'none','display':'none','background-color':'#f2f3f5'});for(const i of tabListItems){let style='none',hide=false;$(i).click(()=>{for(const item of tabListItems){if(item!=i)$(item).removeClass('active');}
$(i).addClass('active');if($(i).attr('id')==="menuDiv"){style='block';hide=true;}
layer.style(menuIndex,{'display':style});return hideTab(hide);})};try{BAPI.setCommonArgs(Live_info.bili_jct);}catch(err){console.error(`[${NAME}]`,err);return;}
let p=$.Deferred();try{MY_API.loadConfig().then(()=>{MY_API.chatLog('脚本载入配置成功','success');p.resolve()});}catch(e){console.error('API初始化出错',e);MY_API.chatLog('API初始化出错','error');p.reject()}
try{MY_API.loadCache().then(()=>{window.toast('CACHE载入成功','success')
p.resolve()});}catch(e){console.error('CACHE初始化出错',e);window.toast('CACHE初始化出错','error')
p.reject()}
return p;},loadConfig:()=>{let p=$.Deferred();try{let config=JSON.parse(localStorage.getItem(`${NAME}_CONFIG`));$.extend(true,MY_API.CONFIG,MY_API.CONFIG_DEFAULT);for(let item in MY_API.CONFIG){if(!MY_API.CONFIG.hasOwnProperty(item))continue;if(config[item]!==undefined&&config[item]!==null)MY_API.CONFIG[item]=config[item];}
MY_API.loadGiftCount();p.resolve()}catch(e){MYDEBUG('API载入配置失败，加载默认配置',e);MY_API.setDefaults();p.reject()}
return p},loadCache:()=>{let p=$.Deferred();try{let cache=JSON.parse(localStorage.getItem(`${NAME}_CACHE`));$.extend(true,MY_API.CACHE,MY_API.CACHE_DEFAULT);for(let item in MY_API.CACHE){if(!MY_API.CACHE.hasOwnProperty(item))continue;if(cache[item]!==undefined&&cache[item]!==null)MY_API.CACHE[item]=cache[item];}
p.resolve()}catch(e){MYDEBUG('CACHE载入配置失败，加载默认配置',e);MY_API.setDefaults();p.reject()}
return p},newMessage:(version)=>{try{const cache=localStorage.getItem(`${NAME}_NEWMSG_CACHE`);if((cache==undefined||cache==null||cache!='4.5.2')&&version=='4.5.2'){const linkMsg=(msg,link)=>{return'<a href=\"'+link+'\"target=\"_blank\">'+msg+'</a>';};layer.open({title:`${version}更新提示`,content:`1.<strong>金宝箱抽奖优化，解决了刷新页面导致等待参加的抽奖被舍弃的问题</strong><br>
                            2.金宝箱抽奖【忽略关键字】支持${linkMsg('正则表达式', 'https://www.runoob.com/js/js-regexp.html')}<br>
                            （${linkMsg('点我前往github对应说明处', 'https://github.com/andywang425/BLTH#金宝箱抽奖')}）<br>
                            3.金宝箱抽奖日志优化<br>
                            4.新增金宝箱抽奖【每次检查抽奖数量】设置<br>
                            5.重复运行检测优化<br>
                            <hr>
                            <em style="color:grey;">
                            如果使用过程中遇到问题，欢迎去${linkMsg('github', 'https://github.com/andywang425/BLTH/issues')}
                            （或者进qq群${linkMsg('1106094437', "https://jq.qq.com/?_wv=1027&amp;k=fCSfWf1O")}）反馈。
                            </em>`});localStorage.setItem(`${NAME}_NEWMSG_CACHE`,version);}}catch(e){MYDEBUG('提示信息CACHE载入失败',e);}},saveConfig:()=>{try{localStorage.setItem(`${NAME}_CONFIG`,JSON.stringify(MY_API.CONFIG));window.toast('配置已保存，部分设置需刷新后才能生效','info');MYDEBUG('MY_API.CONFIG',MY_API.CONFIG);return true}catch(e){MYDEBUG('API保存出错',e);return false}},saveCache:(logswitch=true)=>{try{localStorage.setItem(`${NAME}_CACHE`,JSON.stringify(MY_API.CACHE));if(logswitch){MYDEBUG('CACHE已保存',MY_API.CACHE)};return true}catch(e){MYDEBUG('CACHE保存出错',e);return false}},setDefaults:()=>{MY_API.CONFIG=MY_API.CONFIG_DEFAULT;MY_API.CACHE=MY_API.CACHE_DEFAULT;MY_API.saveConfig();MY_API.saveCache();MY_API.chatLog('配置和CACHE已重置为默认。3秒后刷新页面');setTimeout(()=>{window.location.reload()},3000);},ReDoDailyTasks:()=>{window.toast('3秒后再次执行所有任务','info')
setTimeout(()=>{MY_API.CACHE=MY_API.CACHE_DEFAULT;MY_API.GroupSign.run();MY_API.DailyReward.run();MY_API.LiveReward.run();MY_API.Exchange.runS2C();MY_API.Gift.run();MY_API.LITTLE_HEART.run();MY_API.AUTO_DANMU.run();MY_API.MaterialObject.run();},3000);},loadGiftCount:()=>{try{let config=JSON.parse(localStorage.getItem(`${NAME}_GIFT_COUNT`));for(let item in MY_API.GIFT_COUNT){if(!MY_API.GIFT_COUNT.hasOwnProperty(item))continue;if(config[item]!==undefined&&config[item]!==null)MY_API.GIFT_COUNT[item]=config[item];}
MYDEBUG('MY_API.GIFT_COUNT',MY_API.GIFT_COUNT);}catch(e){MYDEBUG('读取统计失败',e);}},saveGiftCount:()=>{try{localStorage.setItem(`${NAME}_GIFT_COUNT`,JSON.stringify(MY_API.GIFT_COUNT));MYDEBUG('统计保存成功',MY_API.GIFT_COUNT);return true}catch(e){MYDEBUG('统计保存出错',e);return false}},addGift:(count)=>{MY_API.GIFT_COUNT.COUNT+=count;$('#giftCount span:eq(0)').text(MY_API.GIFT_COUNT.COUNT);MY_API.saveGiftCount();},addSilver:(count)=>{MY_API.GIFT_COUNT.SILVER_COUNT+=(count);$('#giftCount span:eq(1)').text(MY_API.GIFT_COUNT.SILVER_COUNT);MY_API.saveGiftCount();},removeUnnecessary:()=>{const unnecessaryList=['#my-dear-haruna-vm','.activity-entry','.activity-rank'];const settingNameList=['REMOVE_ELEMENT_2233','REMOVE_ELEMENT_activity','REMOVE_ELEMENT_rank'];const removeUntiSucceed=(list_id)=>{if(MY_API.CONFIG[settingNameList[list_id]]){setInterval(()=>{if($(unnecessaryList[list_id]).length>0){$(unnecessaryList[list_id]).remove();}else{return}},200);}};for(let i=0;i<unnecessaryList.length;i++){removeUntiSucceed(i);};if(MY_API.CONFIG.NOSLEEP){setInterval(()=>document.dispatchEvent(new Event('visibilitychange')),10*60*1000);}},buyFanMedal:(room_id)=>{return BAPI.live_user.get_anchor_in_room(room_id).then(function(response){MYDEBUG('API.live_user.get_anchor_in_room response',response)
if(response.code===0&&!!response.data.info){layer.confirm(`是否消耗20硬币购买UP主【${response.data.info.uname}】的粉丝勋章？`,{title:'购买勋章',btn:['是','否']},function(){return BAPI.link_group.buy_medal(response.data.info.uid).then((re)=>{MYDEBUG('API.link_group.buy_medal re',re);if(re.code===0){layer.msg('购买成功',{time:2000,icon:1});}else{layer.msg(`购买失败 ${re.message}`,{time:2500,icon:2});}});},function(){layer.msg('已取消购买',{time:2000});});}
else if(response.code===0&&response.data.info===undefined){layer.msg(`房间不存在`,{time:2500});}
else{layer.msg(`检查房间出错 ${response.message}`,{time:2500});}});},creatSetBox:async()=>{const btnmsg=msgHide=='hide'?'显示窗口和提示信息':'隐藏窗口和提示信息';const btn=$(`<button style="display: inline-block; float: left; margin-right: 7px;background-color: #23ade5;color: #fff;border-radius: 4px;border: none; padding:4px; cursor: pointer;box-shadow: 1px 1px 2px #00000075;" id="hiderbtn">${btnmsg}<br></button>`);const fullSreenBtn=$('button[data-title="网页全屏"]'),settingTableHeight=$('.live-player-mounter').height(),settingTableoffset=$('.live-player-mounter').offset();let fieldsetStyle='\"float:left\"';if(UA.toLowerCase().indexOf("firefox")>-1)fieldsetStyle='\"\"';const html=`
                <div id='allsettings' class = "igiftMsg_main">
                <fieldset class="igiftMsg_fs">
                    <legend style="color: black">今日统计</legend>
                    <div id="giftCount" style="font-size: large; text-shadow: 1px 1px #00000066; color: blueviolet;">
                        辣条&nbsp;<span>${MY_API.GIFT_COUNT.COUNT}</span>
                        银瓜子&nbsp;<span>${MY_API.GIFT_COUNT.SILVER_COUNT}万</span>
                        &nbsp;<button style="font-size: small" class="igiftMsg_btn" data-action="save">保存所有设置</button>
                    </div>
                </fieldset>
                <div id="left_fieldset" style=${fieldsetStyle}>
                    <fieldset class="igiftMsg_fs">
                        <legend style="color: black">抽奖设置</legend>
                    <div data-toggle="LOTTERY">
                        <label style="margin: 5px auto; color: purple;line-height:30px";>
                            <input style="vertical-align: text-top;" type="checkbox">
                            参与礼物抽奖
                        </label>
                    </div>
                        <div data-toggle="RANDOM_DELAY">
                            <label style="margin: 5px auto; color: darkgreen">&nbsp;&nbsp;&nbsp;&nbsp;
                                <input style="vertical-align: text-top;" type="checkbox">
                                抽奖附加随机延迟
                                <input class="RND_DELAY_START igiftMsg_input" style="width: 30px;vertical-align: top;" type="text">~
                                <input class="RND_DELAY_END igiftMsg_input" style="width: 30px;vertical-align: top;" type="text">s
                            </label>
                        </div>
                        <div data-toggle="TIME_AREA_DISABLE">
                            <label style="margin: 5px auto; color: darkgreen">&nbsp;&nbsp;&nbsp;&nbsp;
                                <input style="vertical-align: text-top;" type="checkbox">
                                启用
                                <input class="startHour igiftMsg_input" style="width: 20px;" type="text">点
                                <input class="startMinute igiftMsg_input" style="width: 20px;" type="text">分至
                                <input class="endHour igiftMsg_input" style="width: 20px;" type="text">点
                                <input class="endMinute igiftMsg_input" style="width: 20px;" type="text">分不抽奖(24小时制)
                            </label>
                        </div>
                        <div data-toggle="RANDOM_SKIP">
                            <label style="margin: 5px auto; color: darkgreen">&nbsp;&nbsp;&nbsp;&nbsp;
                                随机跳过礼物(0到100,为0则不跳过)<input class="per igiftMsg_input" style="width: 30px;" type="text">%
                            </label>
                        </div>
                        <div data-toggle="MAX_GIFT">
                            <label style="margin: 5px auto; color: darkgreen">&nbsp;&nbsp;&nbsp;&nbsp;
                                当天最多抢辣条数量<input class="num igiftMsg_input" style="width: 100px;" type="text">
                            </label>
                        </div>
                        <div data-toggle="RANDOM_SEND_DANMU">
                            <label style="margin: 5px auto; color: darkgreen">&nbsp;&nbsp;&nbsp;&nbsp;
                                抽奖时活跃弹幕发送概率(0到5,为0则不发送)<input class="per igiftMsg_input" style="width: 30px;" type="text">%
                            </label>
                        </div>
                        <div data-toggle="CHECK_HOUR_ROOM">
                            <label style="margin: 5px auto; color: darkgreen">&nbsp;&nbsp;&nbsp;&nbsp;
                                <input style="vertical-align: text-top;" type="checkbox">
                                检查小时榜（间隔时间<input class="num igiftMsg_input" style="width: 25px;" type="text">秒）
                            </label>
                        </div>
                        <div data-toggle="FORCE_LOTTERY" style="line-height: 20px">
                        <label style="margin: 5px auto; color: red;">&nbsp;&nbsp;&nbsp;&nbsp;
                            <input style="vertical-align: text-top;" type="checkbox">
                            访问被拒绝后强制重复抽奖(最多5次)
                        </label>
                        </div>
                        <div data-toggle="MATERIAL_LOTTERY">
                        <label style="margin: 5px auto; color: purple;">
                            <input style="vertical-align: text-top;" type="checkbox">
                            参与金宝箱抽奖
                        </label>
                    </div>
                    <div data-toggle="MATERIAL_LOTTERY_CHECK_INTERVAL">
                        <label style="margin: 5px auto; color: black;">&nbsp;&nbsp;&nbsp;&nbsp;
                            检查间隔
                            <input class="num igiftMsg_input" style="width: 30px;" type="text">
                            分钟
                        </label>
                    </div>
                    <div data-toggle="MATERIAL_LOTTERY_REM">
                    <label style="margin: 5px auto; color: black;">&nbsp;&nbsp;&nbsp;&nbsp;
                        每次检查抽奖数量
                        <input class="num igiftMsg_input" style="width: 30px;" type="text">
                    </label>
                </div>
                    <div data-toggle="MATERIAL_LOTTERY_IGNORE_QUESTIONABLE_LOTTERY">
                    <label style="margin: 5px auto; color: black;">&nbsp;&nbsp;&nbsp;&nbsp;
                        <input style="vertical-align: text-top;" type="checkbox">
                        忽略关键字
                        <input class="str igiftMsg_input" style="width: 210px;" type="text">
                    </label>
                </div>
                    </fieldset>
            
                    <fieldset class="igiftMsg_fs" style ="line-height:16px;">
                        <legend style="color: black">每日任务设置</legend>
                        <div data-toggle="LOGIN" style=" color: black">
                            <input style="vertical-align: text-top;" type="checkbox">
                            登陆
                        </div>
                        <div data-toggle="WATCH" style=" color: black">
                            <input style="vertical-align: text-top;" type="checkbox">
                            观看视频
                        </div>
                        <div data-toggle="COIN" style=" color: black">
                            <label style="cursor: pointer">
                                <input style="vertical-align: text-top;" type="checkbox">
                                自动投币<input class="coin_number igiftMsg_input" style="width: 40px;" type="text">个(0-5)
                            </label>
                        </div>
                        <div data-toggle="COIN_TYPE" style=" color: black">
                            <div data-toggle="COIN_UID">
                            <input style="vertical-align: text-top;" type="radio" name="COIN_TYPE">
                            给用户(UID:<input class="num igiftMsg_input" style="width: 80px;" type="text">)
                            的视频投币
                            </div>
                            <div data-toggle="COIN_DYN">
                                <input style="vertical-align: text-top;" type="radio" name="COIN_TYPE">
                                给动态中的的视频投币
                            </div>
                        </div>
                        <div data-toggle="SHARE" style=" color: black">
                            <input style="vertical-align: text-top;" type="checkbox">
                            分享视频
                        </div>
                        <div data-toggle="SILVER2COIN" style=" color: black">
                            <input style="vertical-align: text-top;" type="checkbox">
                            银瓜子换硬币
                        </div>
                        <div data-toggle="LIVE_SIGN" style=" color: black">
                            <input style="vertical-align: text-top;" type="checkbox">
                            直播区签到
                        </div>
                        <div data-toggle="AUTO_GROUP_SIGN" style=" color: darkgreen">
                            <input style="vertical-align: text-top;" type="checkbox">
                            应援团签到
                        </div>
                    </fieldset>
                    <fieldset class="igiftMsg_fs">
                        <legend style="color: black">自动送礼设置</legend>
                        <div data-toggle="AUTO_GIFT" style=" color: purple">
                            <input style="vertical-align: text-top;" type="checkbox">
                            自动送礼
                        </div>
            
                        <div data-toggle="AUTO_GIFT_ROOMID" style=" color: purple">
                            优先送礼房间
                            <input class="num igiftMsg_input" style="width: 150px;" type="text">
                        </div>
            
                        <div data-toggle="EXCLUDE_ROOMID" style=" color: purple">
                            不送礼房间
                            <input class="num igiftMsg_input" style="width: 150px;" type="text">
                        </div>
                        <div data-toggle="GIFT_INTERVAL" style=" color: black">
                            <input style="vertical-align: text-top;" type="radio" name="GIFT_TYPE">
                            间隔
                            <input class="num igiftMsg_input" style="width: 30px;" type="text">
                            分钟送礼
                        </div>
                        <div data-toggle="GIFT_SEND_TIME" style=" color: purple">
                            <input style="vertical-align: text-top;" type="radio" name="GIFT_TYPE">
                            定时送礼<br>&nbsp;&nbsp;&nbsp;&nbsp;
                            送礼时间
                            <input class="Hour igiftMsg_input" style="width: 20px;" type="text">点
                            <input class="Minute igiftMsg_input" style="width: 20px;" type="text">分
                            &nbsp;<button style="font-size: small" class="igiftMsg_btn" data-action="sendGiftNow">立刻开始送礼</button>
                        </div>
                        
                        <div data-toggle="GIFT_LIMIT" style=" color: purple">
                            礼物到期时间
                            <input class="num igiftMsg_input" style="width: 20px;" type="text">
                            天
                        </div>
                        <div data-toggle="GIFT_SORT_HIGH" style=" color: black;line-height: 20px;">
                        粉丝牌送礼优先级<br>
                        &nbsp;&nbsp;&nbsp;&nbsp;<input style="vertical-align: text-top;" type="radio" name = "GIFT_SORT">
                            优先<strong style="color: purple">高</strong>等级粉丝牌
                        </div>
                        <div data-toggle="GIFT_SORT_LOW" style=" color: black">
                        &nbsp;&nbsp;&nbsp;&nbsp;<input style="vertical-align: text-top;" type="radio" name = "GIFT_SORT">
                        优先<strong style="color: purple">低</strong>等级粉丝牌
                        </div>
                        <div data-toggle="SEND_ALL_GIFT" style="color: #ff5200;line-height:15px;">
                            <input style="vertical-align: text-top;" type="checkbox">
                            无视礼物类型和到期时间限制
                        </div>
                        <div data-toggle="SPARE_GIFT_ROOM" style="color: black;line-height:20px;">
                            剩余礼物送礼直播间：
                            <input class="num igiftMsg_input" type="text" style="width: 100px;">
                        </div>
                    </fieldset>
                    <fieldset class="igiftMsg_fs">
                        <legend style="color: black">节奏风暴设置</legend>
                        <div data-toggle="STORM" style="line-height: 15px">
                            <label style="margin: 5px auto; color: #ff5200">
                                <input style="vertical-align: text-top;" type="checkbox">
                                参与节奏风暴
                            </label>
                        </div>
                        <div data-toggle="STORM_QUEUE_SIZE" style="color: black">
                            允许同时参与的节奏风暴次数：
                            <input class="num igiftMsg_input" type="text" style="width: 30px;">
                        </div>
                        <div data-toggle="STORM_MAX_COUNT" style="color: black">
                            单个风暴最大尝试次数：
                            <input class="num igiftMsg_input" type="text" style="width: 30px;">
                        </div>
                        <div data-toggle="STORM_ONE_LIMIT" style="color: black">
                            单个风暴参与次数间隔：
                            <input class="num igiftMsg_input" type="text" style="width: 30px;">
                            毫秒
                        </div>
                    </fieldset>
                </div>
            
            
            
                <div id="right_fieldset" style=${fieldsetStyle}>
                    <fieldset class="igiftMsg_fs">
                        <legend style="color: black">购买粉丝勋章</legend>
                        <div data-toggle="BUY_MEDAL" style="color: black; line-height: 15px">
                        输入粉丝勋章对应房间号：<input class="num igiftMsg_input" type="text" value = ${Live_info.room_id} onclick="select();" style="width: 70px">
                        &nbsp;<button  class="igiftMsg_btn" data-action="buy_medal">点击购买勋章</button>
                        （花费20硬币）
                    </div>
                    </fieldset>
                    <fieldset class="igiftMsg_fs">
                        <legend style="color: black">小心心</legend>
                        <div data-toggle="LITTLE_HEART" style="line-height: 15px">
                            <label style="margin: 5px auto; color: black">
                                <input style="vertical-align: text-top;" type="checkbox"> 自动获取小心心
                            </label>
                        </div>
                        <div data-toggle="LIGHT_MEDALS" style=" color: purple">
                            自动点亮勋章房间号
                        <input class="num igiftMsg_input" style="width: 300px;" type="text">
                    </div>
                    <div data-toggle="LIGHT_METHOD" style="line-height: 15px; color: black; display:inline">
                        勋章点亮模式：&nbsp;&nbsp;
                        <div data-toggle="LIGHT_WHITE" style="color: black; display:inline">
                            <input style="vertical-align: text-top;" type="radio" name="LIGHT_TYPE">
                            白名单
                        </div>
                        <div data-toggle="LIGHT_BLACK" style="color: black; display:inline">
                            &nbsp;
                            <input style="vertical-align: text-top;" type="radio" name="LIGHT_TYPE">
                            黑名单
                        </div>
                        &nbsp;<button style="font-size: small" class="igiftMsg_btn" data-action="lightMedalNow">立刻点亮勋章</button>
                    </div>
                    <div data-toggle="FORCE_LIGHT" style="line-height: 15px">
                    <label style="margin: 5px auto; color: black">
                        <input style="vertical-align: text-top;" type="checkbox"> 点亮勋章时忽略亲密度上限
                    </label>
                    </div>
                    </fieldset>
                    <fieldset class="igiftMsg_fs">
                        <legend style="color: black">内容屏蔽</legend>
                        <div data-toggle="REMOVE_ELEMENT_2233" style="line-height: 15px">
                            <label style="margin: 5px auto; color: black">
                                <input style="vertical-align: text-top;" type="checkbox">
                                移除2233模型
                            </label>
                        </div>
                        <div data-toggle="REMOVE_ELEMENT_activity" style="line-height: 15px">
                            <label style="margin: 5px auto; color: black">
                                <input style="vertical-align: text-top;" type="checkbox">
                                移除活动入口
                            </label>
                        </div>
                        <div data-toggle="REMOVE_ELEMENT_rank" style="line-height: 15px">
                        <label style="margin: 5px auto; color: black">
                            <input style="vertical-align: text-top;" type="checkbox">
                            移除排行榜
                        </label>
                    </div>
                        <div data-toggle="NOSLEEP">
                        <label style="margin: 5px auto; color: black">
                            <input style="vertical-align: text-top;" type="checkbox">
                            屏蔽挂机检测
                        </label>
                    </div>
                    </fieldset>
                    <fieldset class="igiftMsg_fs" style="line-height: 25px">
                        <legend style="color: black">弹幕设置</legend>
                        <div data-toggle="AUTO_DANMU">
                            <input style="vertical-align: text-top;" type="checkbox">
                            自动发弹幕<br>
                            弹幕内容
                            <input class="Danmu igiftMsg_input" style="width: 330px;" type="text"><br>
                            房间号
                            <input class="Roomid igiftMsg_input" style="width: 330px;" type="text"><br>
                            发送时间
                            <input class="Time igiftMsg_input" style="width: 330px;" type="text">
                        </div>
                        &nbsp;<button style="font-size: small" class="igiftMsg_btn" data-action="sendDanmuNow">立刻发送弹幕</button>
                        &nbsp;<button style="font-size: small" class="igiftMsg_btn" data-action="clearDanmuCache">清除弹幕缓存</button>
                    </fieldset>
                    <fieldset class="igiftMsg_fs" style="line-height: 15px">
                        <legend style="color: black">其他设置</legend>
                        <div data-toggle="TIME_RELOAD" style="color: black">
                        <input style="vertical-align: text-top;" type="checkbox">
                            每
                            <input class="delay-seconds igiftMsg_input" type="text" style="width: 30px;">
                            分钟刷新一次页面
                        </div>
                        <div data-toggle="IN_TIME_RELOAD_DISABLE" style="line-height: 20px">
                            <label style="margin: 5px auto; color: darkgreen">
                                <input style="vertical-align: text-top;" type="checkbox">
                                不抽奖时段不刷新直播间
                            </label>
                        </div>
            
                        <div id="resetArea">
                            &nbsp;<button data-action="reset" style="color: red;" class="igiftMsg_btn">重置所有为默认</button>
                            &nbsp;<button data-action="redo_dailyTasks" style="color: red;" class="igiftMsg_btn">再次执行所有任务</button>
                            &nbsp;<button style="font-size: small" class="igiftMsg_btn" data-action="countReset">重置统计</button>
                        </div>
            
                    </fieldset>
                    <label style="color: darkblue; font-size:large;">
                         <a href="https://github.com/andywang425/BLTH"
                            target="_blank">v${GM_info.script.version}&nbsp;更多信息见github上的项目说明(点我)</a>
                    </label>
                </div>
            </div>`;const openMainWindow=()=>{return mainIndex=layer.open({type:1,title:false,offset:[String(settingTableoffset.top-getScrollPosition().y)+'px',String(settingTableoffset.left)+'px'],closeBtn:0,shade:0,zIndex:9998,fixed:false,area:[,String(settingTableHeight)+'px'],content:html,success:()=>{const div=$('#allsettings');div.find('div[data-toggle="MATERIAL_LOTTERY_REM"] .num').val(parseInt(MY_API.CONFIG.MATERIAL_LOTTERY_REM).toString());div.find('div[data-toggle="MATERIAL_LOTTERY_IGNORE_QUESTIONABLE_LOTTERY"] .str').val(MY_API.CONFIG.QUESTIONABLE_LOTTERY.toString());div.find('div[data-toggle="MATERIAL_LOTTERY_CHECK_INTERVAL"] .num').val(parseInt(MY_API.CONFIG.MATERIAL_LOTTERY_CHECK_INTERVAL).toString());div.find('div[data-toggle="AUTO_DANMU"] .Time').val(MY_API.CONFIG.DANMU_INTERVAL_TIME.toString());div.find('div[data-toggle="AUTO_DANMU"] .Roomid').val(MY_API.CONFIG.DANMU_ROOMID.toString());div.find('div[data-toggle="AUTO_DANMU"] .Danmu').val(MY_API.CONFIG.DANMU_CONTENT.toString());div.find('div[data-toggle="MAX_TAB"] .num').val(parseInt(MY_API.CONFIG.MAX_TAB).toString());div.find('div[data-toggle="GIFT_INTERVAL"] .num').val(parseInt(MY_API.CONFIG.GIFT_INTERVAL).toString());div.find('div[data-toggle="LIGHT_MEDALS"] .num').val(MY_API.CONFIG.LIGHT_MEDALS.toString());div.find('div[data-toggle="STORM_MAX_COUNT"] .num').val(parseInt(MY_API.CONFIG.STORM_MAX_COUNT).toString());div.find('div[data-toggle="STORM_ONE_LIMIT"] .num').val(parseInt(MY_API.CONFIG.STORM_ONE_LIMIT).toString());div.find('div[data-toggle="STORM_QUEUE_SIZE"] .num').val(parseInt(MY_API.CONFIG.STORM_QUEUE_SIZE).toString());div.find('div[data-toggle="SPARE_GIFT_ROOM"] .num').val(MY_API.CONFIG.SPARE_GIFT_ROOM.toString());div.find('div[data-toggle="TIME_RELOAD"] .delay-seconds').val(parseInt(MY_API.CONFIG.TIME_RELOAD_MINUTE).toString());div.find('div[data-toggle="RANDOM_SKIP"] .per').val((parseFloat(MY_API.CONFIG.RANDOM_SKIP)).toString());div.find('div[data-toggle="RANDOM_SEND_DANMU"] .per').val((parseFloat(MY_API.CONFIG.RANDOM_SEND_DANMU)).toString());div.find('div[data-toggle="MAX_GIFT"] .num').val((parseInt(MY_API.CONFIG.MAX_GIFT)).toString());div.find('div[data-toggle="COIN"] .coin_number').val(parseInt(MY_API.CONFIG.COIN_NUMBER).toString());div.find('div[data-toggle="COIN_UID"] .num').val(parseInt(MY_API.CONFIG.COIN_UID).toString());div.find('div[data-toggle="RANDOM_DELAY"] .RND_DELAY_START').val(parseFloat(MY_API.CONFIG.RND_DELAY_START).toString());div.find('div[data-toggle="RANDOM_DELAY"] .RND_DELAY_END').val(parseFloat(MY_API.CONFIG.RND_DELAY_END).toString());div.find('div[data-toggle="TIME_AREA_DISABLE"] .startHour').val(parseInt(MY_API.CONFIG.TIME_AREA_START_H0UR).toString());div.find('div[data-toggle="TIME_AREA_DISABLE"] .endHour').val(parseInt(MY_API.CONFIG.TIME_AREA_END_H0UR).toString());div.find('div[data-toggle="TIME_AREA_DISABLE"] .startMinute').val(parseInt(MY_API.CONFIG.TIME_AREA_START_MINUTE).toString());div.find('div[data-toggle="TIME_AREA_DISABLE"] .endMinute').val(parseInt(MY_API.CONFIG.TIME_AREA_END_MINUTE).toString());div.find('div[data-toggle="CHECK_HOUR_ROOM"] .num').val(parseInt(MY_API.CONFIG.CHECK_HOUR_ROOM_INTERVAL).toString());div.find('div[data-toggle="AUTO_GIFT_ROOMID"] .num').val((MY_API.CONFIG.AUTO_GIFT_ROOMID).toString());div.find('div[data-toggle="EXCLUDE_ROOMID"] .num').val((MY_API.CONFIG.EXCLUDE_ROOMID).toString());div.find('div[data-toggle="GIFT_SEND_TIME"] .Hour').val(MY_API.CONFIG.GIFT_SEND_HOUR.toString());div.find('div[data-toggle="GIFT_SEND_TIME"] .Minute').val(MY_API.CONFIG.GIFT_SEND_MINUTE.toString());div.find('div[data-toggle="GIFT_LIMIT"] .num').val(parseInt(MY_API.CONFIG.GIFT_LIMIT).toString());const saveAction=()=>{let val=undefined;let valArray=undefined;let val1=parseInt(div.find('div[data-toggle="TIME_AREA_DISABLE"] .startHour').val());let val2=parseInt(div.find('div[data-toggle="TIME_AREA_DISABLE"] .endHour').val());let val3=parseInt(div.find('div[data-toggle="TIME_AREA_DISABLE"] .startMinute').val());let val4=parseInt(div.find('div[data-toggle="TIME_AREA_DISABLE"] .endMinute').val());if(val1>=24||val2>=24||val3>=60||val4>=60||val1<0||val2<0||val3<0||val4<0){MY_API.chatLog("[定时休眠]时间错误",'warning');return}
MY_API.CONFIG.TIME_AREA_START_H0UR=val1;MY_API.CONFIG.TIME_AREA_END_H0UR=val2;MY_API.CONFIG.TIME_AREA_START_MINUTE=val3;MY_API.CONFIG.TIME_AREA_END_MINUTE=val4;val=parseFloat(div.find('div[data-toggle="RANDOM_SKIP"] .per').val());if(val<0||val>100){MY_API.chatLog('[随机跳过礼物]数据小于0或大于100','warning');return}
MY_API.CONFIG.RANDOM_SKIP=val;val=parseFloat(div.find('div[data-toggle="RANDOM_SEND_DANMU"] .per').val());if(val>5){MY_API.chatLog("[活跃弹幕]为维护直播间弹幕氛围,弹幕发送概率不得大于5%",'warning');return}
else if(val<0){MY_API.chatLog("[活跃弹幕]数据小于0",'warning');return}
MY_API.CONFIG.RANDOM_SEND_DANMU=val;val=parseInt(div.find('div[data-toggle="MAX_GIFT"] .num').val());MY_API.CONFIG.MAX_GIFT=val;val=parseInt(div.find('div[data-toggle="TIME_RELOAD"] .delay-seconds').val());if(val<=0||val>10000){MY_API.chatLog('[直播间重载时间]数据小于等于0或大于10000','warning');return}
MY_API.CONFIG.TIME_RELOAD_MINUTE=val;val=parseFloat(div.find('div[data-toggle="RANDOM_DELAY"] .RND_DELAY_START').val());val2=parseFloat(div.find('div[data-toggle="RANDOM_DELAY"] .RND_DELAY_END').val());if(val<0||val2>100){MY_API.chatLog('[抽奖延时]数据小于0或大于100','warning');return}
else if(val2<=val){MY_API.chatLog('[抽奖延时]数据大小关系不正确','warning');return}
MY_API.CONFIG.RND_DELAY_START=val;MY_API.CONFIG.RND_DELAY_END=val2;val=parseInt(div.find('div[data-toggle="COIN"] .coin_number').val());if(val<0||val>5){MY_API.chatLog("[自动投币]数据小于0或大于5",'warning');return}
MY_API.CONFIG.COIN_NUMBER=val;val=parseInt(div.find('div[data-toggle="CHECK_HOUR_ROOM"] .num').val());if(val<=0){MY_API.chatLog("[检查小时榜间隔]数据小于等于0",'warning');return}
MY_API.CONFIG.CHECK_HOUR_ROOM_INTERVAL=val;val=div.find('div[data-toggle="AUTO_GIFT_ROOMID"] .num').val();valArray=val.split(",");for(let i=0;i<valArray.length;i++){if(valArray[i]===''){valArray[i]=22474988;}};MY_API.CONFIG.AUTO_GIFT_ROOMID=valArray;val=div.find('div[data-toggle="EXCLUDE_ROOMID"] .num').val();valArray=val.split(",");for(let i=0;i<valArray.length;i++){if(valArray[i]===''){valArray[i]=0;}};MY_API.CONFIG.EXCLUDE_ROOMID=valArray;val=parseInt(div.find('div[data-toggle="GIFT_LIMIT"] .num').val());MY_API.CONFIG.GIFT_LIMIT=val;val1=parseInt(div.find('div[data-toggle="GIFT_SEND_TIME"] .Hour').val());val2=parseInt(div.find('div[data-toggle="GIFT_SEND_TIME"] .Minute').val());if(val1<0||val2<0){MY_API.chatLog("[送礼时间]数据小于0",'warning');return}
else if(val1>=24||val2>=60){MY_API.chatLog("[送礼时间]时间错误",'warning');return}
MY_API.CONFIG.GIFT_SEND_HOUR=val1;MY_API.CONFIG.GIFT_SEND_MINUTE=val2;val=div.find('div[data-toggle="SPARE_GIFT_ROOM"] .num').val();MY_API.CONFIG.SPARE_GIFT_ROOM=val;val=parseInt(div.find('div[data-toggle="STORM_QUEUE_SIZE"] .num').val());MY_API.CONFIG.STORM_QUEUE_SIZE=val;val=parseInt(div.find('div[data-toggle="STORM_MAX_COUNT"] .num').val());MY_API.CONFIG.STORM_MAX_COUNT=val;val=parseInt(div.find('div[data-toggle="STORM_ONE_LIMIT"] .num').val());MY_API.CONFIG.STORM_ONE_LIMIT=val;val=parseInt(div.find('div[data-toggle="COIN_UID"] .num').val());MY_API.CONFIG.COIN_UID=val;val=div.find('div[data-toggle="LIGHT_MEDALS"] .num').val();valArray=val.split(",");for(let i=0;i<valArray.length;i++){if(valArray[i]===''){valArray[i]=0;}};MY_API.CONFIG.LIGHT_MEDALS=valArray;val=parseInt(div.find('div[data-toggle="MAX_TAB"] .num').val());MY_API.CONFIG.MAX_TAB=val;val1=div.find('div[data-toggle="AUTO_DANMU"] .Danmu').val();valArray=val1.split(",");for(let i=0;i<valArray.length;i++){if(valArray[i]===''){valArray[i]='这是一条弹幕';}};val1=valArray;val2=div.find('div[data-toggle="AUTO_DANMU"] .Roomid').val();valArray=val2.split(",");for(let i=0;i<valArray.length;i++){if(valArray[i]===''){valArray[i]='22474988';}};val2=valArray;val3=div.find('div[data-toggle="AUTO_DANMU"] .Time').val();valArray=val3.split(",");for(let i=0;i<valArray.length;i++){if(valArray[i]===''){valArray[i]='10m';}};val3=valArray;MY_API.CONFIG.DANMU_CONTENT=val1;MY_API.CONFIG.DANMU_ROOMID=val2;MY_API.CONFIG.DANMU_INTERVAL_TIME=val3;val=div.find('div[data-toggle="MATERIAL_LOTTERY_CHECK_INTERVAL"] .num').val();MY_API.CONFIG.MATERIAL_LOTTERY_CHECK_INTERVAL=parseInt(val);val=div.find('div[data-toggle="MATERIAL_LOTTERY_IGNORE_QUESTIONABLE_LOTTERY"] .str').val();valArray=val.split(",");for(let i=0;i<valArray.length;i++){if(valArray[i]===''){valArray[i]='test';}};MY_API.CONFIG.QUESTIONABLE_LOTTERY=valArray;val=div.find('div[data-toggle="MATERIAL_LOTTERY_REM"] .num').val();if(isNaN(val))val=9;MY_API.CONFIG.MATERIAL_LOTTERY_REM=parseInt(val);return MY_API.saveConfig();};div.find('div[id="giftCount"] [data-action="save"]').click(()=>{saveAction();});div.find('div[data-toggle="BUY_MEDAL"] [data-action="buy_medal"]').click(function(){const room_id=parseInt(div.find('div[data-toggle="BUY_MEDAL"] .num').val());MY_API.buyFanMedal(room_id);});div.find('button[data-action="reset"]').click(()=>{MY_API.setDefaults();});div.find('button[data-action="checkUpdate"]').click(()=>{MY_API.checkUpdate();});div.find('button[data-action="redo_dailyTasks"]').click(()=>{MY_API.ReDoDailyTasks();});div.find('#resetArea [data-action="countReset"]').click(()=>{MY_API.GIFT_COUNT={COUNT:0,SILVER_COUNT:0,CLEAR_TS:0,};MY_API.saveGiftCount();$('#giftCount span:eq(0)').text(MY_API.GIFT_COUNT.COUNT);$('#giftCount span:eq(1)').text(MY_API.GIFT_COUNT.SILVER_COUNT);MY_API.chatLog('已重置统计数据');});div.find('button[data-action="sendGiftNow"]').click(()=>{if(!MY_API.CONFIG.AUTO_GIFT){window.toast('[立刻开始送礼] 请先勾选【自动送礼】再点击此按钮','info');return}
SEND_GIFT_NOW=true;MY_API.Gift.run();});div.find('button[data-action="lightMedalNow"]').click(()=>{if(!MY_API.CONFIG.AUTO_GIFT){window.toast('[立刻点亮勋章] 请先勾选【自动送礼】再点击此按钮','info');return}
LIGHT_MEDAL_NOW=true;MY_API.Gift.run();});div.find('button[data-action="sendDanmuNow"]').click(()=>{if(!MY_API.CONFIG.AUTO_DANMU){window.toast('[立刻发送弹幕] 请先勾选【自动发弹幕】再点击此按钮','info');return}
SEND_DANMU_NOW=true;MY_API.AUTO_DANMU.run();});div.find('button[data-action="clearDanmuCache"]').click(()=>{MY_API.CACHE.AUTO_SEND_DANMU_TS=[];if(MY_API.saveCache())MY_API.chatLog('清除弹幕缓存成功','success');});const checkList=['AUTO_DANMU','RANDOM_DELAY','TIME_AREA_DISABLE','AUTO_GROUP_SIGN','FORCE_LOTTERY','LOGIN','WATCH','COIN','SHARE','SILVER2COIN','LIVE_SIGN','IN_TIME_RELOAD_DISABLE','TIME_RELOAD','IN_TIME_RELOAD_DISABLE',"AUTO_GIFT","SEND_ALL_GIFT",'STORM','LITTLE_HEART','REMOVE_ELEMENT_2233','REMOVE_ELEMENT_activity','REMOVE_ELEMENT_rank',"FORCE_LIGHT","LOTTERY","CHECK_HOUR_ROOM","NOSLEEP",'MATERIAL_LOTTERY','MATERIAL_LOTTERY_IGNORE_QUESTIONABLE_LOTTERY'];for(const i of checkList){const input=div.find(`div[data-toggle="${i}"] input:checkbox`);if(MY_API.CONFIG[i])input.attr('checked','');input.change(function(){MY_API.CONFIG[i]=$(this).prop('checked');saveAction();});};$('input:text').bind('keydown',function(event){if(event.keyCode=="13"){saveAction();}});if(MY_API.CONFIG.COIN_TYPE=='COIN_DYN'){$("div[data-toggle='COIN_DYN'] input:radio").attr('checked','');}else{$("div[data-toggle='COIN_UID'] input:radio").attr('checked','');};if(MY_API.CONFIG.LIGHT_METHOD=='LIGHT_WHITE'){$("div[data-toggle='LIGHT_WHITE'] input:radio").attr('checked','');}else{$("div[data-toggle='LIGHT_BLACK'] input:radio").attr('checked','');};if(MY_API.CONFIG.GIFT_METHOD=='GIFT_INTERVAL'){$("div[data-toggle='GIFT_INTERVAL'] input:radio").attr('checked','');}else{$("div[data-toggle='GIFT_SEND_TIME'] input:radio").attr('checked','');};if(MY_API.CONFIG.GIFT_SORT=='high'){$("div[data-toggle='GIFT_SORT_HIGH'] input:radio").attr('checked','');}else{$("div[data-toggle='GIFT_SORT_LOW'] input:radio").attr('checked','');}
$("input:radio[name='COIN_TYPE']").change(function(){if($("div[data-toggle='COIN_DYN'] input:radio").is(':checked')){MY_API.CONFIG.COIN_TYPE='COIN_DYN';}
else{MY_API.CONFIG.COIN_TYPE='COIN_UID';}
saveAction();});$("input:radio[name='LIGHT_TYPE']").change(function(){if($("div[data-toggle='LIGHT_WHITE'] input:radio").is(':checked')){MY_API.CONFIG.LIGHT_METHOD='LIGHT_WHITE';}
else{MY_API.CONFIG.LIGHT_METHOD='LIGHT_BLACK';}
saveAction();});$("input:radio[name='GIFT_TYPE']").change(function(){if($("div[data-toggle='GIFT_INTERVAL'] input:radio").is(':checked')){MY_API.CONFIG.GIFT_METHOD='GIFT_INTERVAL';}
else{MY_API.CONFIG.GIFT_METHOD='GIFT_SEND_TIME';}
saveAction();});$("input:radio[name='GIFT_SORT']").change(function(){if($("div[data-toggle='GIFT_SORT_HIGH'] input:radio").is(':checked')){MY_API.CONFIG.GIFT_SORT='high';}
else{MY_API.CONFIG.GIFT_SORT='low';}
saveAction();});},end:()=>{msgHide='hide';localStorage.setItem(`${NAME}_msgHide`,msgHide);$('.link-toast').hide();document.getElementById('hiderbtn').innerHTML="显示窗口和提示信息";}});};btn.click(()=>{if(hideBtnClickable){hideBtnClickable=false;setTimeout(function(){hideBtnClickable=true},200);if(msgHide=='show'){msgHide='hide';localStorage.setItem(`${NAME}_msgHide`,msgHide);$('.link-toast').hide();layer.close(mainIndex);document.getElementById('hiderbtn').innerHTML="显示窗口和提示信息";}
else{msgHide='show';localStorage.setItem(`${NAME}_msgHide`,msgHide);$('.link-toast').show();openMainWindow();document.getElementById('hiderbtn').innerHTML="隐藏窗口和提示信息";}}});fullSreenBtn.click(()=>{layer.close(mainIndex);document.getElementById('hiderbtn').innerHTML="显示窗口和提示信息";layer.style(menuIndex,{'display':'none'});$('#menuDiv').removeClass('active');$('.tab-list.dp-flex').children('li')[0].click();});$('.attention-btn-ctnr').append(btn);if(!MY_API.CACHE.DailyReward_TS){layer.tips('点我隐藏/显示控制面板','#hiderbtn',{tips:1});setTimeout(()=>layer.tips('点我查看日志','#menuDiv',{tips:1}),6000);}
if(msgHide=='show'){openMainWindow()}},chatLog:function(text,type='info'){const menuWindow=document.querySelector("#layui-layer1 > div");let div=$("<div class='igiftMsg'>"),msg=$("<div>"),myDate=new Date();msg.html(text);div.text(myDate.toLocaleString());div.append(msg);div.css({'text-align':'center','border-radius':'4px','min-height':'30px','width':'256px','color':'#9585FF','line-height':'30px','padding':'0 10px','margin':'10px auto',});msg.css({'word-wrap':'break-word','width':'100%','line-height':'1em','margin-bottom':'10px',});switch(type){case'warning':div.css({'border':'1px solid rgb(236, 221, 192)','color':'rgb(218, 142, 36)','background':'rgb(245, 235, 221) none repeat scroll 0% 0%',});break;case'success':div.css({'border':'1px solid rgba(22, 140, 0, 0.28)','color':'rgb(69, 171, 69)','background':'none 0% 0% repeat scroll rgba(16, 255, 0, 0.18)',});break;case'error':div.css({'border':'1px solid rgb(255, 46, 0)','color':'white','background':'none 0% 0% repeat scroll #ff4c4c',});break;default:div.css({'border':'1px solid rgb(203, 195, 255)','background':'rgb(233, 230, 255) none repeat scroll 0% 0%',});};$('#menuWindow').append(div);menuWindow.scrollTo(0,menuWindow.scrollHeight);},blocked:false,max_blocked:false,listen:(roomId,uid,area='本直播间')=>{BAPI.room.getConf(roomId).then((response)=>{MYDEBUG(`获取弹幕服务器信息 ${area}`,response);let wst=new BAPI.DanmuWebSocket(uid,roomId,response.data.host_server_list,response.data.token);wst.bind((newWst)=>{wst=newWst;MY_API.chatLog(`${area}弹幕服务器连接断开，尝试重连`,'warning');},()=>{MY_API.chatLog(`——————连接弹幕服务器成功——————<br>房间号: ${roomId} 分区: ${area}`,'success');},()=>{if(MY_API.blocked||MY_API.stormBlack){wst.close();MY_API.chatLog(`进了小黑屋主动与弹幕服务器断开连接-${area}`,'warning')}
if(MY_API.max_blocked&&!MY_API.CONFIG.STORM){wst.close();MY_API.chatLog(`辣条最大值主动与弹幕服务器断开连接-${area}`,'warning')}},(obj)=>{if(inTimeArea(MY_API.CONFIG.TIME_AREA_START_H0UR,MY_API.CONFIG.TIME_AREA_END_H0UR,MY_API.CONFIG.TIME_AREA_START_MINUTE,MY_API.CONFIG.TIME_AREA_END_MINUTE)&&MY_API.CONFIG.TIME_AREA_DISABLE)return;MYDEBUG('弹幕公告'+area,obj);switch(obj.cmd){case'GUARD_MSG':if(obj.roomid===obj.real_roomid){MY_API.checkRoom(obj.roomid,area);}else{MY_API.checkRoom(obj.roomid,area);MY_API.checkRoom(obj.real_roomid,area);}
break;case'PK_BATTLE_SETTLE_USER':if(!!obj.data.winner){MY_API.checkRoom(obj.data.winner.room_id,area);}else{MY_API.checkRoom(obj.data.my_info.room_id,area);}
MY_API.checkRoom(obj.data.winner.room_id,area);break;case'NOTICE_MSG':switch(obj.msg_type){case 1:break;case 2:case 3:case 4:case 8:if(obj.roomid===obj.real_roomid){MY_API.checkRoom(obj.roomid,area);}else{MY_API.checkRoom(obj.roomid,area);MY_API.checkRoom(obj.real_roomid,area);}
break;case 5:break;case 6:window.toast(`监控到房间 ${obj.roomid} 的节奏风暴`,'info');MY_API.Storm.run(obj.roomid);break;}
break;case'SPECIAL_GIFT':if(obj.data['39']){switch(obj.data['39'].action){case'start':window.toast(`监控到房间 ${obj.roomid} 的节奏风暴`,'info');MY_API.Storm.run(obj.roomid);case'end':}};break;default:return;}});},()=>{MY_API.chatLog('获取弹幕服务器地址错误','error')});},EntryRoom_list_history:{add:function(EntryRoom){let EntryRoom_list=[];try{let config=JSON.parse(localStorage.getItem(`${NAME}_EntryRoom_list`));EntryRoom_list=[].concat(config.list);EntryRoom_list.push(EntryRoom);if(EntryRoom_list.length>100){EntryRoom_list.splice(0,50);}
localStorage.setItem(`${NAME}_EntryRoom_list`,JSON.stringify({list:EntryRoom_list}));}catch(e){EntryRoom_list.push(EntryRoom);localStorage.setItem(`${NAME}_EntryRoom_list`,JSON.stringify({list:EntryRoom_list}));}},isIn:function(EntryRoom){let EntryRoom_list=[];try{let config=JSON.parse(localStorage.getItem(`${NAME}_EntryRoom_list`));if(config===null){EntryRoom_list=[];}else{EntryRoom_list=[].concat(config.list);}
return EntryRoom_list.indexOf(EntryRoom)>-1}catch(e){localStorage.setItem(`${NAME}_EntryRoom_list`,JSON.stringify({list:EntryRoom_list}));MYDEBUG('读取'+`${NAME}_EntryRoom_list`+'缓存错误已重置');return EntryRoom_list.indexOf(EntryRoom)>-1}}},RoomId_list:[],err_roomId:[],auto_danmu_list:["(=・ω・=)","（￣▽￣）","nice","666","kksk","(⌒▽⌒)","(｀・ω・´)","╮(￣▽￣)╭","(￣3￣)","Σ( ￣□￣||)","(^・ω・^ )","_(:3」∠)_"],checkRoom:function(roomId,area='本直播间'){if(MY_API.blocked||MY_API.max_blocked){return}
if(MY_API.RoomId_list.indexOf(roomId)>=0){return}else{MY_API.RoomId_list.push(roomId);}
if(!MY_API.EntryRoom_list_history.isIn(roomId)&&MY_API.CONFIG.LOTTERY){BAPI.room.room_entry_action(roomId);MY_API.EntryRoom_list_history.add(roomId);}
if(probability(MY_API.CONFIG.RANDOM_SEND_DANMU)){BAPI.room.get_info(roomId).then((res)=>{MYDEBUG(`API.room.get_info roomId=${roomId} res`,res);BAPI.sendLiveDanmu(MY_API.auto_danmu_list[Math.floor(Math.random()*12)],res.data.room_id).then((response)=>{MYDEBUG('[活跃弹幕]弹幕发送返回信息',response);})})}
BAPI.xlive.lottery.check(roomId).then((re)=>{MY_API.RoomId_list.remove(roomId);MYDEBUG('检查房间返回信息',re);const data=re.data;if(re.code===0){if(data.gift){const list=data.gift;for(let i in list){if(!list.hasOwnProperty(i))continue;MY_API.creat_join(roomId,list[i],'gift',area)}}
if(data.guard){const list=data.guard;for(let i in list){if(!list.hasOwnProperty(i))continue;MY_API.creat_join(roomId,list[i],'guard',area)}}
if(data.pk){const list=data.pk;for(let i in list){if(!list.hasOwnProperty(i))continue;MY_API.creat_join(roomId,list[i],'pk',area)}}}else{MY_API.chatLog(`[检查房间出错]${response.msg}`,'error');if(MY_API.err_roomId.indexOf(roomId)>-1){MYDEBUG(`[检查此房间出错多次]${roomId}${re.message}`);}
else{MY_API.err_roomId.push(roomId);MY_API.checkRoom(roomId,area);MYDEBUG(`[检查房间出错_重试一次]${roomId}${re.message}`);}}})},Id_list_history:{add:function(id,type){let id_list=[];try{let config=JSON.parse(localStorage.getItem(`${NAME}_${type}Id_list`));id_list=[].concat(config.list);id_list.push(id);if(id_list.length>200){id_list.splice(0,50);}
localStorage.setItem(`${NAME}_${type}Id_list`,JSON.stringify({list:id_list}));MYDEBUG(`${NAME}_${type}Id_list_add`,id_list);}catch(e){id_list.push(id);localStorage.setItem(`${NAME}_${type}Id_list`,JSON.stringify({list:id_list}));}},isIn:function(id,type){let id_list=[];try{let config=JSON.parse(localStorage.getItem(`${NAME}_${type}Id_list`));if(config===null){id_list=[];}else{id_list=[].concat(config.list);}
MYDEBUG(`${NAME}_${type}Id_list_read`,config);return id_list.indexOf(id)>-1}catch(e){localStorage.setItem(`${NAME}_${type}Id_list`,JSON.stringify({list:id_list}));MYDEBUG('读取'+`${NAME}_${type}Id_list`+'缓存错误已重置');return id_list.indexOf(id)>-1}}},raffleId_list:[],guardId_list:[],pkId_list:[],creat_join:function(roomId,data,type,area='本直播间'){MYDEBUG('礼物信息',data);if(MY_API.GIFT_COUNT.COUNT>=MY_API.CONFIG.MAX_GIFT){MYDEBUG('超过今日辣条限制，不参与抽奖');MY_API.max_blocked=true;return}
switch(type){case'gift':if(MY_API.Id_list_history.isIn(data.raffleId,'raffle')){MYDEBUG('礼物重复',`raffleId ${data.raffleId}`);return}else{MY_API.raffleId_list.push(data.raffleId);MY_API.Id_list_history.add(data.raffleId,'raffle');}
break;case'guard':if(MY_API.Id_list_history.isIn(data.id,'guard')){MYDEBUG('舰长重复',`id ${data.id}`);return}else{MY_API.guardId_list.push(data.id);MY_API.Id_list_history.add(data.id,'guard');}
break;case'pk':if(MY_API.Id_list_history.isIn(data.id,'pk')){MYDEBUG('pk重复',`id ${data.id}`);return}else{MY_API.pkId_list.push(data.id);MY_API.Id_list_history.add(data.id,'pk');}
break;}
let delay=data.time_wait||0;if(MY_API.CONFIG.RANDOM_DELAY)
delay+=Math.floor(Math.random()*(MY_API.CONFIG.RND_DELAY_END-MY_API.CONFIG.RND_DELAY_START+1))+MY_API.CONFIG.RND_DELAY_START;let div=$("<div class='igiftMsg'>"),msg=$("<div>"),aa=$("<div>"),myDate=new Date();const menuWindow=document.querySelector("#layui-layer1 > div");msg.text(`[${area}]`+data.thank_text.split('<%')[1].split('%>')[0]+data.thank_text.split('%>')[1]);div.text(myDate.toLocaleString());div.append(msg);aa.css('color','red');aa.text('等待抽奖');msg.append(aa);div.css({'text-align':'center','border-radius':'4px','min-height':'30px','width':'256px','color':'#9585FF','line-height':'30px','padding':'0 10px','margin':'10px auto','border':'1px solid rgb(203, 195, 255)','background':'rgb(233, 230, 255) none repeat scroll 0% 0%',});msg.css({'word-wrap':'break-word','width':'100%','line-height':'1em','margin-bottom':'10px',});$('#menuWindow').append(div);menuWindow.scrollTo(0,menuWindow.scrollHeight);let timer=setInterval(()=>{aa.text(`等待抽奖倒计时${delay}秒`);if(delay<=0){if(probability(MY_API.CONFIG.RANDOM_SKIP)){aa.text(`跳过此礼物抽奖`);}else{aa.text(`进行抽奖...`);switch(type){case'gift':MY_API.gift_join(roomId,data.raffleId,data.type).then(function(msg,num){aa.text(msg);if(num){if(msg.indexOf('辣条')>-1){MY_API.addGift(num);}
else if(msg.indexOf('银瓜子')>-1){MY_API.addSilver(num);}}
MY_API.raffleId_list.remove(data.raffleId);});break;case'guard':MY_API.guard_join(roomId,data.id).then(function(msg,num){aa.text(msg);if(num){if(msg.indexOf('辣条')>-1){MY_API.addGift(num);}
else if(msg.indexOf('银瓜子')>-1){MY_API.addSilver(num);}}
MY_API.guardId_list.remove(data.id);});break;case'pk':MY_API.pk_join(roomId,data.id).then(function(msg,num){aa.text(msg);if(num){if(msg.indexOf('辣条')>-1){MY_API.addGift(num);}
else if(msg.indexOf('银瓜子')>-1){MY_API.addSilver(num);}}
MY_API.pkId_list.remove(data.id);});break;}}
aa.css('color','green');clearInterval(timer)}
delay--;},1000);},gift_join:function(roomid,raffleId,type){let p=$.Deferred();BAPI.Lottery.Gift.join(roomid,raffleId,type).then((response)=>{MYDEBUG('抽奖返回信息',response);switch(response.code){case 0:if(response.data.award_text){p.resolve(response.data.award_text,response.data.award_num);}else{p.resolve(response.data.award_name+'X'+response.data.award_num.toString(),response.data.award_num);}
break;default:if(response.msg.indexOf('拒绝')>-1){if(MY_API.CONFIG.FORCE_LOTTERY==false){MY_API.blocked=true;p.resolve('访问被拒绝，您的帐号可能已经被关小黑屋，已停止');}else if(++gift_join_try<=5){MY_API.gift_join(roomid,raffleId,type);}else{gift_join_try=0;p.resolve(`[礼物抽奖](roomid=${roomid},id=${raffleId},type=${type})${response.msg}`);}}else{p.resolve(`[礼物抽奖](roomid=${roomid},id=${raffleId},type=${type})${response.msg}`);}}});return p},guard_join:function(roomid,Id){let p=$.Deferred();BAPI.Lottery.Guard.join(roomid,Id).then((response)=>{MYDEBUG('上船抽奖返回信息',response);switch(response.code){case 0:if(response.data.award_text){p.resolve(response.data.award_text,response.data.award_num);}else{p.resolve(response.data.award_name+'X'+response.data.award_num.toString(),response.data.award_num);}
break;default:if(response.msg.indexOf('拒绝')>-1){if(MY_API.CONFIG.FORCE_LOTTERY==false){MY_API.blocked=true;p.resolve('访问被拒绝，您的帐号可能已经被关小黑屋，已停止');}else if(++guard_join_try<=5){MY_API.guard_join(roomid,id);}else{guard_join_try=0;p.resolve(`[礼物抽奖](roomid=${roomid},id=${raffleId},type=${type})${response.msg}`);}}else{p.resolve(`[上船](roomid=${roomid},id=${Id})${response.msg}`);}
break;}});return p},pk_join:function(roomid,Id){let p=$.Deferred();BAPI.Lottery.Pk.join(roomid,Id).then((response)=>{MYDEBUG('PK抽奖返回信息',response);switch(response.code){case 0:if(response.data.award_text){p.resolve(response.data.award_text,response.data.award_num);}else{p.resolve(response.data.award_name+'X'+response.data.award_num.toString(),response.data.award_num);}
break;default:if(response.msg.indexOf('拒绝')>-1){if(MY_API.CONFIG.FORCE_LOTTERY==false){MY_API.blocked=true;p.resolve('访问被拒绝，您的帐号可能已经被关小黑屋，已停止');}else if(++pk_join_try<=5){MY_API.pk_join(roomid,id);}else{pk_join_try=0;p.resolve(`[礼物抽奖](roomid=${roomid},id=${raffleId},type=${type})${response.msg}`);}}else{p.resolve(`[PK](roomid=${roomid},id=${Id})${response.msg}`);}
break;}});return p},GroupSign:{getGroups:()=>{return BAPI.Group.my_groups().then((response)=>{MYDEBUG('GroupSign.getGroups: API.Group.my_groups',response);if(response.code===0)return $.Deferred().resolve(response.data.list);window.toast(`[自动应援团签到]'${response.msg}`,'caution');return $.Deferred().reject();},()=>{window.toast('[自动应援团签到]获取应援团列表失败，请检查网络','error');return delayCall(()=>MY_API.GroupSign.getGroups());});},signInList:(list,i=0)=>{if(i>=list.length)return $.Deferred().resolve();const obj=list[i];if(obj.owner_uid==Live_info.uid)return MY_API.GroupSign.signInList(list,i+1);return BAPI.Group.sign_in(obj.group_id,obj.owner_uid).then((response)=>{MYDEBUG('GroupSign.signInList: API.Group.sign_in',response);let p=$.Deferred();if(response.code===0){if(response.data.add_num>0){window.toast(`[自动应援团签到]应援团(group_id=${obj.group_id},owner_uid=${obj.owner_uid})签到成功，当前勋章亲密度+${response.data.add_num}`,'success');p.resolve();}
else if(response.data.add_num==0){window.toast(`[自动应援团签到]应援团(group_id=${obj.group_id},owner_uid=${obj.owner_uid})已签到`,'caution');p.resolve();}
else{p.reject();}}else{window.toast(`[自动应援团签到]'${response.msg}`,'caution');return $.Deferred().reject();}
return $.when(MY_API.GroupSign.signInList(list,i+1),p);},()=>{window.toast(`[自动应援团签到]应援团(group_id=${obj.group_id},owner_uid=${obj.owner_uid})签到失败，请检查网络`,'error');return delayCall(()=>MY_API.GroupSign.signInList(list,i));});},run:()=>{try{if(!MY_API.CONFIG.AUTO_GROUP_SIGN)return $.Deferred().resolve();if(!checkNewDay(MY_API.CACHE.AUTO_GROUP_SIGH_TS)){runTomorrow(MY_API.GroupSign.run,8,0,'应援团签到');return $.Deferred().resolve();}else if(new Date().getHours()<8&&MY_API.CACHE.AUTO_GROUP_SIGH_TS!=0){setTimeout(MY_API.GroupSign.run,getIntervalTime(8,0));return $.Deferred().resolve();}
return MY_API.GroupSign.getGroups().then((list)=>{return MY_API.GroupSign.signInList(list).then(()=>{MY_API.CACHE.AUTO_GROUP_SIGH_TS=ts_ms();MY_API.saveCache();runTomorrow(MY_API.GroupSign.run,8,0,'应援团签到');return $.Deferred().resolve();},()=>delayCall(()=>MY_API.GroupSign.run()));},()=>delayCall(()=>MY_API.GroupSign.run()));}catch(err){window.toast('[自动应援团签到]运行时出现异常，已停止','error');console.error(`[${NAME}]`,err);return $.Deferred().reject();}}},DailyReward:{coin_exp:0,login:()=>{return BAPI.DailyReward.login().then(()=>{MYDEBUG('DailyReward.login: API.DailyReward.login');window.toast('[自动每日奖励][每日登录]完成','success');},()=>{window.toast('[自动每日奖励][每日登录]完成失败，请检查网络','error');return delayCall(()=>MY_API.DailyReward.login());});},watch:(aid,cid)=>{if(!MY_API.CONFIG.WATCH)return $.Deferred().resolve();return BAPI.DailyReward.watch(aid,cid,Live_info.uid,ts_s()).then((response)=>{MYDEBUG('DailyReward.watch: API.DailyReward.watch',response);if(response.code===0){window.toast(`[自动每日奖励][每日观看]完成(av=${aid})`,'success');}else{window.toast(`[自动每日奖励][每日观看]'${response.msg}`,'caution');}},()=>{window.toast('[自动每日奖励][每日观看]完成失败，请检查网络','error');return delayCall(()=>MY_API.DailyReward.watch(aid,cid));});},coin:(cards,n,i=0,one=false)=>{if(!MY_API.CONFIG.COIN)return $.Deferred().resolve();if(MY_API.DailyReward.coin_exp>=MY_API.CONFIG.COIN_NUMBER*10){window.toast('[自动每日奖励][每日投币]今日投币已完成','info');return $.Deferred().resolve();}
if(i>=cards.length){window.toast('[自动每日奖励][每日投币]动态里可投币的视频不足','caution');return $.Deferred().resolve();}
const obj=JSON.parse(cards[i].card);let num=Math.min(2,n);if(one)num=1;return BAPI.x.getCoinInfo('','jsonp',obj.aid,ts_ms()).then((re)=>{if(re.data.multiply===2){MYDEBUG('API.x.getCoinInfo',`已投币两个 aid = ${obj.aid}`)
return MY_API.DailyReward.coin(vlist,n,i+1);}
else{if(re.data.multiply===1)num=1;return BAPI.DailyReward.coin(obj.aid,num).then((response)=>{MYDEBUG('DailyReward.coin: API.DailyReward.coin',response);if(response.code===0){MY_API.DailyReward.coin_exp+=num*10;window.toast(`[自动每日奖励][每日投币]投币成功(av=${obj.aid},num=${num})`,'success');return MY_API.DailyReward.coin(cards,n-num,i+1);}else if(response.code===-110){window.toast('[自动每日奖励][每日投币]未绑定手机，已停止','error');return $.Deferred().reject();}else if(response.code===34003){if(one)return MY_API.DailyReward.coin(cards,n,i+1);return MY_API.DailyReward.coin(cards,n,i,true);}else if(response.code===34005){return MY_API.DailyReward.coin(cards,n,i+1);}else if(response.code===-104){window.toast('[自动每日奖励][每日投币]剩余硬币不足，已停止','warning');return $.Deferred().reject();}
window.toast(`[自动每日奖励][每日投币]'${response.msg}`,'caution');return MY_API.DailyReward.coin(cards,n,i+1);},()=>delayCall(()=>MY_API.DailyReward.coin(cards,n,i)));}})},coin_uid:(vlist,n,pagenum,uid,i=0,one=false)=>{if(!MY_API.CONFIG.COIN)return $.Deferred().resolve();if(MY_API.DailyReward.coin_exp>=MY_API.CONFIG.COIN_NUMBER*10){window.toast('[自动每日奖励][每日投币]今日投币已完成','info');return $.Deferred().resolve();}
if(i>=vlist.length){MY_API.DailyReward.UserSpace(MY_API.CONFIG.COIN_UID,30,0,pagenum++,'','pubdate','jsonp');}
const obj=vlist[i];if(obj.is_union_video===1||obj.mid!=uid){MYDEBUG('DailyReward.coin_uid',`联合投稿且UP不是指定UID用户 aid = ${obj.aid}`)
return MY_API.DailyReward.coin_uid(vlist,n,pagenum,uid,i+1);}
let num=Math.min(2,n);if(one)num=1;return BAPI.x.getCoinInfo('','jsonp',obj.aid,ts_ms()).then((re)=>{if(re.data.multiply===2){MYDEBUG('API.x.getCoinInfo',`已投币两个 aid = ${obj.aid}`)
return MY_API.DailyReward.coin_uid(vlist,n,pagenum,uid,i+1);}
else{if(re.data.multiply===1)num=1;return BAPI.DailyReward.coin(obj.aid,num).then((response)=>{MYDEBUG('DailyReward.coin_uid: API.DailyReward.coin_uid',response);if(response.code===0){MY_API.DailyReward.coin_exp+=num*10;window.toast(`[自动每日奖励][每日投币]投币成功(av=${obj.aid},num=${num})`,'success');return MY_API.DailyReward.coin_uid(vlist,n-num,pagenum,uid,i+1);}else if(response.code===-110){window.toast('[自动每日奖励][每日投币]未绑定手机，已停止','error');return $.Deferred().reject();}else if(response.code===34003){if(one)return MY_API.DailyReward.coin_uid(vlist,n,pagenum,uid,i+1);return MY_API.DailyReward.coin_uid(vlist,n,i,pagenum,uid,true);}else if(response.code===34005){return MY_API.DailyReward.coin_uid(vlist,n,pagenum,uid,i+1);}else if(response.code===-104){window.toast('[自动每日奖励][每日投币]剩余硬币不足，已停止','warning');return $.Deferred().reject();}
window.toast(`[自动每日奖励][每日投币]'${response.msg}`,'caution');return MY_API.DailyReward.coin_uid(vlist,n,pagenum,uid,i+1);},()=>delayCall(()=>MY_API.DailyReward.coin_uid(vlist,n,pagenum,uid,i)));}});},share:(aid)=>{if(!MY_API.CONFIG.SHARE)return $.Deferred().resolve();return BAPI.DailyReward.share(aid).then((response)=>{MYDEBUG('DailyReward.share: API.DailyReward.share',response);if(response.code===0){window.toast(`[自动每日奖励][每日分享]分享成功(av=${aid})`,'success');}else if(response.code===71000){window.toast('[自动每日奖励][每日分享]今日分享已完成','info');}else{window.toast(`[自动每日奖励][每日分享]'${response.msg}`,'caution');}},()=>{window.toast('[自动每日奖励][每日分享]分享失败，请检查网络','error');return delayCall(()=>MY_API.DailyReward.share(aid));});},dynamic:async()=>{const coinNum=MY_API.CONFIG.COIN_NUMBER-MY_API.DailyReward.coin_exp/10;const throwCoinNum=await BAPI.getuserinfo().then((re)=>{MYDEBUG('DailyReward.dynamic: API.getuserinfo',re);if(re.data.biliCoin<coinNum)return re.data.biliCoin
else return coinNum});if(throwCoinNum<coinNum)window.toast(`[自动每日奖励][每日投币]剩余硬币不足，仅能投${throwCoinNum}个币`,'warning');return BAPI.dynamic_svr.dynamic_new(Live_info.uid,8).then((response)=>{MYDEBUG('DailyReward.dynamic: API.dynamic_svr.dynamic_new',response);if(response.code===0){if(!!response.data.cards){const obj=JSON.parse(response.data.cards[0].card);const p1=MY_API.DailyReward.watch(obj.aid,obj.cid);let p2;if(MY_API.CONFIG.COIN_UID==0||MY_API.CONFIG.COIN_TYPE=='COIN_DYN'){p2=MY_API.DailyReward.coin(response.data.cards,Math.max(throwCoinNum,0));}else{p2=MY_API.DailyReward.UserSpace(MY_API.CONFIG.COIN_UID,30,0,1,'','pubdate','jsonp');}
const p3=MY_API.DailyReward.share(obj.aid);return $.when(p1,p2,p3);}else{window.toast('[自动每日奖励]"动态-投稿视频"中暂无动态','info');}}else{window.toast(`[自动每日奖励]获取"动态-投稿视频"'${response.msg}`,'caution');}},()=>{window.toast('[自动每日奖励]获取"动态-投稿视频"失败，请检查网络','error');return delayCall(()=>MY_API.DailyReward.dynamic());});},UserSpace:(uid,ps,tid,pn,keyword,order,jsonp)=>{return BAPI.x.getUserSpace(uid,ps,tid,pn,keyword,order,jsonp).then((response)=>{MYDEBUG('DailyReward.UserSpace: API.dynamic_svr.UserSpace',response);if(response.code===0){if(!!response.data.list.vlist){const throwCoinNum=MY_API.CONFIG.COIN_NUMBER-MY_API.DailyReward.coin_exp/10;const p1=MY_API.DailyReward.coin_uid(response.data.list.vlist,Math.max(throwCoinNum,0),pn,uid);return p1;}else{window.toast('[自动每日奖励]"空间-投稿视频"中暂无视频','info');}}
else{window.toast(`[自动每日奖励]获取"空间-投稿视频"'${response.msg}`,'caution');}},()=>{window.toast('[自动每日奖励]获取"空间-投稿视频"失败，请检查网络','error');return delayCall(()=>MY_API.DailyReward.UserSpace(uid,ps,tid,pn,keyword,order,jsonp));})},run:()=>{try{if(!MY_API.CONFIG.LOGIN&&!MY_API.CONFIG.COIN&&!MY_API.CONFIG.WATCH)return $.Deferred().resolve();if(!checkNewDay(MY_API.CACHE.DailyReward_TS)){runMidnight(MY_API.DailyReward.run,'每日任务');return $.Deferred().resolve();}
return BAPI.DailyReward.exp().then((response)=>{MYDEBUG('DailyReward.run: API.DailyReward.exp',response);if(response.code===0){MY_API.DailyReward.coin_exp=response.number;MY_API.DailyReward.login();MY_API.DailyReward.dynamic();MY_API.CACHE.DailyReward_TS=ts_ms();MY_API.saveCache();runMidnight(MY_API.DailyReward.run,'每日任务');}else{window.toast(`[自动每日奖励]${response.message}`,'caution');}},()=>{window.toast('[自动每日奖励]获取每日奖励信息失败，请检查网络','error');return delayCall(()=>MY_API.DailyReward.run());});}catch(err){window.toast('[自动每日奖励]运行时出现异常','error');console.error(`[${NAME}]`,err);return $.Deferred().reject();}}},LiveReward:{dailySignIn:()=>{return BAPI.xlive.dosign().then((response)=>{MYDEBUG('LiveReward.dailySignIn: API.xlive.dosign',response);if(response.code===0){window.toast('[自动直播签到]完成','success');$('.hinter').remove();$('.checkin-btn').remove();}else if(response.code===1011040){window.toast('[自动直播签到]今日直播签到已完成','info')}else{window.toast(`[自动直播签到]${response.message}，尝试点击签到按钮`,'caution');$('.checkin-btn').click();}},()=>{window.toast('[自动直播签到]直播签到失败，请检查网络','error');return delayCall(()=>MY_API.LiveReward.dailySignIn());});},run:()=>{try{if(!MY_API.CONFIG.LIVE_SIGN)return $.Deferred().resolve();if(!checkNewDay(MY_API.CACHE.LiveReward_TS)){runMidnight(MY_API.LiveReward.run,'直播签到');return $.Deferred().resolve();}
MY_API.LiveReward.dailySignIn()
MY_API.CACHE.LiveReward_TS=ts_ms();MY_API.saveCache();runMidnight(MY_API.LiveReward.run,'直播签到');}catch(err){window.toast('[自动直播签到]运行时出现异常','error');console.error(`[${NAME}]`,err);return $.Deferred().reject();}}},Exchange:{silver2coin:()=>{return BAPI.Exchange.silver2coin().then((response)=>{MYDEBUG('Exchange.silver2coin: API.SilverCoinExchange.silver2coin',response);if(response.code===0){window.toast(`[银瓜子换硬币]${response.msg}`,'success');}else if(response.code===403){window.toast(`[银瓜子换硬币]${response.msg}`,'info');}else{window.toast(`[银瓜子换硬币]${response.msg}`,'caution');}},()=>{window.toast('[银瓜子换硬币]兑换失败，请检查网络','error');return delayCall(()=>MY_API.Exchange.silver2coin());});},runS2C:()=>{try{if(!MY_API.CONFIG.SILVER2COIN)return $.Deferred().resolve();if(!checkNewDay(MY_API.CACHE.Silver2Coin_TS)){runMidnight(MY_API.Exchange.runS2C,'瓜子换硬币');return $.Deferred().resolve();}
return MY_API.Exchange.silver2coin().then(()=>{MY_API.CACHE.Silver2Coin_TS=ts_ms();MY_API.saveCache();runMidnight(MY_API.Exchange.runS2C,'瓜子换硬币');},()=>delayCall(()=>MY_API.Exchange.runS2C()));}catch(err){window.toast('[银瓜子换硬币]运行时出现异常，已停止','error');console.error(`[${NAME}]`,err);return $.Deferred().reject();}}},Gift:{run_timer:undefined,ruid:undefined,room_id:undefined,medal_list:undefined,bag_list:undefined,time:undefined,remain_feed:undefined,over:false,run_timer:undefined,sendGiftList:[1,6,30607],getMedalList:async(page=1)=>{if(page===1)MY_API.Gift.medal_list=[];return await BAPI.i.medal(page,25).then((response)=>{MYDEBUG('Gift.getMedalList: API.i.medal',response);MY_API.Gift.medal_list=MY_API.Gift.medal_list.concat(response.data.fansMedalList);if(response.data.pageinfo.curPage<response.data.pageinfo.totalpages)return MY_API.Gift.getMedalList(page+1);},()=>{window.toast('[自动送礼]获取勋章列表失败，请检查网络','error');return delayCall(()=>MY_API.Gift.getMedalList());});},getBagList:async()=>{return await BAPI.gift.bag_list().then((response)=>{MYDEBUG('Gift.getBagList: API.gift.bag_list',response);MY_API.Gift.bag_list=response.data.list;MY_API.Gift.time=response.data.time;},()=>{window.toast('[自动送礼]获取包裹列表失败，请检查网络','error');return delayCall(()=>MY_API.Gift.getBagList());});},getFeedByGiftID:(gift_id)=>{if(gift_id===30607)return 50;for(let i=Live_info.gift_list.length-1;i>=0;--i){if(Live_info.gift_list[i].id===gift_id){return Math.ceil(Live_info.gift_list[i].price/100);}}
return 0;},sort_medals:(medals)=>{if(MY_API.CONFIG.GIFT_SORT=='high'){medals.sort((a,b)=>{if(b.level-a.level==0){return b.intimacy-a.intimacy;}
return b.level-a.level;});}else{medals.sort((a,b)=>{if(a.level-b.level==0){return a.intimacy-b.intimacy;}
return a.level-b.level;});}
if(MY_API.CONFIG.AUTO_GIFT_ROOMID&&MY_API.CONFIG.AUTO_GIFT_ROOMID.length>0){let sortRooms=MY_API.CONFIG.AUTO_GIFT_ROOMID;sortRooms.reverse();for(let froom of sortRooms){let rindex=medals.findIndex(r=>r.roomid==froom);if(rindex!=-1){let tmp=medals[rindex];medals.splice(rindex,1);medals.unshift(tmp);}}}
return medals;},auto_light:async(medal_list)=>{try{const feed=MY_API.Gift.getFeedByGiftID(30607);let light_roomid=MY_API.CONFIG.LIGHT_MEDALS;let unLightedMedals=undefined;if(MY_API.CONFIG.LIGHT_METHOD=='LIGHT_WHITE'){unLightedMedals=medal_list.filter(m=>m.is_lighted==0&&m.day_limit-m.today_feed>=feed&&light_roomid.findIndex(it=>it==m.roomid)>=0)}else{unLightedMedals=medal_list.filter(m=>m.is_lighted==0&&m.day_limit-m.today_feed>=feed&&light_roomid.findIndex(it=>it==m.roomid)==-1)};MYDEBUG('[auto_light]即将点亮勋章房间列表',unLightedMedals);if(unLightedMedals&&unLightedMedals.length>0){unLightedMedals=MY_API.Gift.sort_medals(unLightedMedals);await MY_API.Gift.getBagList();let heartBags=MY_API.Gift.bag_list.filter(r=>r.gift_id==30607);if(heartBags&&heartBags.length>0){for(let medal of unLightedMedals){let gift=heartBags.find(g=>g.gift_id==30607&&g.gift_num>0);if(gift){let remain_feed=medal.day_limit-medal.today_feed;if(remain_feed-feed>=0||MY_API.CONFIG.FORCE_LIGHT){let response=await BAPI.room.room_init(parseInt(medal.roomid,10));let send_room_id=parseInt(response.data.room_id,10);let feed_num=1;let rsp=await BAPI.gift.bag_send(Live_info.uid,30607,medal.target_id,feed_num,gift.bag_id,send_room_id,Live_info.rnd)
if(rsp.code===0){gift.gift_num-=feed_num;medal.today_feed+=feed_num*feed;remain_feed-=feed_num*feed;window.toast(`[自动送礼]勋章[${medal.medalName}]点亮成功，送出${feed_num}个${gift.gift_name}，[${medal.today_feed}/${medal.day_limit}]距离升级还需[${remain_feed}]`,'success');MYDEBUG('Gift.auto_light',`勋章[${medal.medalName}]点亮成功，送出${feed_num}个${gift.gift_name}，[${medal.today_feed}/${medal.day_limit}]`)}else{window.toast(`[自动送礼]勋章[${medal.medalName}]点亮失败【${rsp.msg}】`,'caution');}}
continue;}
break;}}}}catch(e){console.error(e);window.toast(`[自动送礼]点亮勋章出错:${e}`,'error');}},run:async()=>{const FailFunc=()=>{window.toast('[自动送礼]送礼失败，请检查网络','error');return delayCall(()=>MY_API.Gift.run());};const nextTimeDebug=()=>{if(MY_API.CONFIG.GIFT_METHOD=="GIFT_SEND_TIME"){let alternateTime=getIntervalTime(MY_API.CONFIG.GIFT_SEND_HOUR,MY_API.CONFIG.GIFT_SEND_MINUTE);MY_API.Gift.run_timer=setTimeout(MY_API.Gift.run,alternateTime);let runTime=new Date(ts_ms()+alternateTime).toLocaleString();MYDEBUG("[自动送礼]",`将在${runTime}进行自动送礼`);MY_API.CACHE.Gift_TS=ts_ms();MY_API.saveCache();}else{MYDEBUG("[自动送礼]",`将在${MY_API.CONFIG.GIFT_INTERVAL}分钟后进行自动送礼`);MY_API.CACHE.GiftInterval_TS=ts_ms();MY_API.saveCache();}
return}
try{if(!MY_API.CONFIG.AUTO_GIFT)return $.Deferred().resolve();if(MY_API.Gift.run_timer)clearTimeout(MY_API.Gift.run_timer);if(MY_API.CONFIG.GIFT_METHOD=="GIFT_SEND_TIME"&&!isTime(MY_API.CONFIG.GIFT_SEND_HOUR,MY_API.CONFIG.GIFT_SEND_MINUTE)&&!SEND_GIFT_NOW&&!LIGHT_MEDAL_NOW){let alternateTime=getIntervalTime(MY_API.CONFIG.GIFT_SEND_HOUR,MY_API.CONFIG.GIFT_SEND_MINUTE);MY_API.Gift.run_timer=setTimeout(MY_API.Gift.run,alternateTime);let runTime=new Date(ts_ms()+alternateTime).toLocaleString();MYDEBUG("[自动送礼]",`将在${runTime}进行自动送礼`);return $.Deferred().resolve();}else if(MY_API.CONFIG.GIFT_METHOD=="GIFT_INTERVAL"&&!SEND_GIFT_NOW&&!LIGHT_MEDAL_NOW){let GiftInterval=MY_API.CONFIG.GIFT_INTERVAL*60e3;if(MY_API.CACHE.GiftInterval_TS){const interval=ts_ms()-MY_API.CACHE.GiftInterval_TS;if(interval<GiftInterval){let intervalTime=GiftInterval-interval;MY_API.Gift.run_timer=setTimeout(MY_API.Gift.run,intervalTime);MYDEBUG("[自动送礼]",`将在${intervalTime}毫秒后进行自动送礼`);return;}}
else{MY_API.CACHE.GiftInterval_TS=ts_ms();MY_API.saveCache();}}
MY_API.Gift.over=false
await MY_API.Gift.getMedalList();let medal_list=MY_API.Gift.medal_list;MYDEBUG('Gift.run: Gift.getMedalList().then: Gift.medal_list',medal_list);if(medal_list&&medal_list.length>0){medal_list=medal_list.filter(it=>it.day_limit-it.today_feed>0&&it.level<20);medal_list=MY_API.Gift.sort_medals(medal_list);if(MY_API.CONFIG.EXCLUDE_ROOMID&&MY_API.CONFIG.EXCLUDE_ROOMID.length>0){const ArrayEXCLUDE_ROOMID=MY_API.CONFIG.EXCLUDE_ROOMID;medal_list=medal_list.filter(Er=>ArrayEXCLUDE_ROOMID.findIndex(exp=>exp==Er.roomid)==-1);};await MY_API.Gift.auto_light(medal_list);if(LIGHT_MEDAL_NOW){LIGHT_MEDAL_NOW=false;return $.Deferred().resolve();}
for(let v of medal_list){if(MY_API.Gift.over)break;let response=await BAPI.room.room_init(parseInt(v.roomid,10));MY_API.Gift.room_id=parseInt(response.data.room_id,10);MY_API.Gift.ruid=v.target_id;MY_API.Gift.remain_feed=v.day_limit-v.today_feed;if(MY_API.Gift.remain_feed>0){await MY_API.Gift.getBagList();if(MY_API.Gift.remain_feed>0){window.toast(`[自动送礼]勋章[${v.medalName}] 今日亲密度未满[${v.today_feed}/${v.day_limit}]，预计需要[${MY_API.Gift.remain_feed}]送礼开始`,'info');await MY_API.Gift.sendGift(v);}else{window.toast(`[自动送礼]勋章[${v.medalName}] 今日亲密度已满`,'info');}}}}
await MY_API.Gift.sendRemainGift(MY_API.CONFIG.SPARE_GIFT_ROOM);}catch(err){FailFunc();window.toast('[自动送礼]运行时出现异常，已停止','error');console.error(`[${NAME}]`,err);return $.Deferred().reject();}
SEND_GIFT_NOW=false;nextTimeDebug();return $.Deferred().resolve();},sendGift:async(medal)=>{await MY_API.Gift.getBagList();let bag_list;if(MY_API.Gift.remain_feed<=0){window.toast(`[自动送礼]勋章[${medal.medalName}] 送礼结束，今日亲密度已满[${medal.today_feed}/${medal.day_limit}]`,'info');return $.Deferred().resolve();}
if(MY_API.Gift.time<=0)MY_API.Gift.time=ts_s();if(!MY_API.CONFIG.SEND_ALL_GIFT){let pass=MY_API.Gift.bag_list.filter(r=>MY_API.Gift.sendGiftList.includes(r.gift_id)&&r.gift_num>0&&r.corner_mark.substring(0,r.corner_mark.indexOf("天"))<=MY_API.CONFIG.GIFT_LIMIT);MYDEBUG("[自动送礼]pass的礼物",pass)
if(pass.length==0){MY_API.Gift.over=true;return;}else{bag_list=pass;}}else{let pass=MY_API.Gift.bag_list.filter(r=>r.gift_num>0&&r.corner_mark!='永久');if(pass.length==0){MY_API.Gift.over=true;return;}else{bag_list=pass;}}
MYDEBUG('bag_list',bag_list)
for(let v of bag_list){if(medal.day_limit-medal.today_feed<=0){window.toast(`[自动送礼]勋章[${medal.medalName}] 送礼结束，今日亲密度已满[${medal.today_feed}/${medal.day_limit}]`,'info');return;}
let feed=MY_API.Gift.getFeedByGiftID(v.gift_id);if(feed>0){let feed_num=Math.floor(MY_API.Gift.remain_feed/feed);if(feed_num>v.gift_num)feed_num=v.gift_num;if(feed_num>0){MYDEBUG('[自动送礼]送出礼物类型',v.gift_name);await BAPI.gift.bag_send(Live_info.uid,v.gift_id,MY_API.Gift.ruid,feed_num,v.bag_id,MY_API.Gift.room_id,Live_info.rnd).then((response)=>{MYDEBUG('Gift.sendGift: API.gift.bag_send',response);if(response.code===0){v.gift_num-=feed_num;medal.today_feed+=feed_num*feed;MY_API.Gift.remain_feed-=feed_num*feed;window.toast(`[自动送礼]勋章[${medal.medalName}] 送礼成功，送出${feed_num}个${v.gift_name}，[${medal.today_feed}/${medal.day_limit}]距离升级还需[${MY_API.Gift.remain_feed}]`,'success');}else{window.toast(`[自动送礼]勋章[${medal.medalName}] 送礼异常:${response.msg}`,'caution');}},()=>{window.toast('[自动送礼]包裹送礼失败，请检查网络','error');return delayCall(()=>MY_API.Gift.sendGift(medal));});}}}},sendRemainGift:async(ROOM_ID)=>{if(ROOM_ID==0)return $.Deferred().resolve();let UID=undefined;await BAPI.live_user.get_anchor_in_room(ROOM_ID).then((response)=>{MYDEBUG('API.live_user.get_anchor_in_room',response);if(!!response.data.info.uid)UID=response.data.info.uid;else{window.toast('[自动送礼]【剩余礼物】检查房间出错');return $.Deferred().reject();}})
await MY_API.Gift.getBagList();let bag_list;if(MY_API.Gift.time<=0)MY_API.Gift.time=ts_s();if(!MY_API.CONFIG.SEND_ALL_GIFT){let pass=MY_API.Gift.bag_list.filter(r=>MY_API.Gift.sendGiftList.includes(r.gift_id)&&r.gift_num>0&&r.corner_mark==`1天`);if(pass.length==0){MY_API.Gift.over=true;return;}else{bag_list=pass;}}else{let pass=MY_API.Gift.bag_list.filter(r=>r.gift_num>0&&r.corner_mark!='永久');if(pass.length==0){MY_API.Gift.over=true;return;}else{bag_list=pass;}}
MYDEBUG('[自动送礼]【剩余礼物】bag_list',bag_list);for(let v of bag_list){const feed=MY_API.Gift.getFeedByGiftID(v.gift_id);if(feed>0){let feed_num=v.gift_num;if(feed_num>0){await BAPI.gift.bag_send(Live_info.uid,v.gift_id,UID,feed_num,v.bag_id,ROOM_ID,Live_info.rnd).then((response)=>{MYDEBUG('Gift.sendGift: API.gift.bag_send',response);if(response.code===0){v.gift_num-=feed_num;window.toast(`[自动送礼]【剩余礼物】房间[${ROOM_ID}] 送礼成功，送出${feed_num}个${v.gift_name}`,'success');}else{window.toast(`[自动送礼]【剩余礼物】房间[${ROOM_ID}] 送礼异常:${response.msg}`,'caution');}},()=>{window.toast('[自动送礼]【剩余礼物】包裹送礼失败，请检查网络','error');return delayCall(()=>MY_API.Gift.sendGift(medal));});}}}}},stormQueue:[],stormBlack:false,stormIdSet:{add:function(id){let storm_id_list=[];try{let config=JSON.parse(localStorage.getItem(`${NAME}stormIdSet`));storm_id_list=[].concat(config.list);storm_id_list.push(id);if(storm_id_list.length>50){storm_id_list.splice(0,10);}
localStorage.setItem(`${NAME}stormIdSet`,JSON.stringify({list:storm_id_list}));MYDEBUG(`${NAME}storm_Id_list_add`,storm_id_list);}catch(e){storm_id_list.push(id);localStorage.setItem(`${NAME}stormIdSet`,JSON.stringify({list:storm_id_list}));}},isIn:function(id){let storm_id_list=[];try{let config=JSON.parse(localStorage.getItem(`${NAME}stormIdSet`));if(config===null){storm_id_list=[];}else{storm_id_list=[].concat(config.list);}
MYDEBUG(`${NAME}storm_Id_list_read`,config);return storm_id_list.indexOf(id)>-1}catch(e){localStorage.setItem(`${NAME}stormIdSet`,JSON.stringify({list:storm_id_list}));MYDEBUG('读取'+`${NAME}stormIdSet`+'缓存错误已重置');return storm_id_list.indexOf(id)>-1}}},Storm:{check:(id)=>{return MY_API.stormQueue.indexOf(id)>-1;},append:(id)=>{MY_API.stormQueue.push(id);if(MY_API.stormQueue.length>MY_API.CONFIG.STORM_QUEUE_SIZE){MY_API.stormQueue.shift();}},over:(id)=>{var index=MY_API.stormQueue.indexOf(id);if(index>-1){MY_API.stormQueue.splice(id,1);}},run:(roomid)=>{try{if(!MY_API.CONFIG.STORM)return $.Deferred().resolve();if(MY_API.stormBlack)return $.Deferred().resolve();if(inTimeArea(MY_API.CONFIG.TIME_AREA_START_H0UR,MY_API.CONFIG.TIME_AREA_END_H0UR,MY_API.CONFIG.TIME_AREA_START_MINUTE,MY_API.CONFIG.TIME_AREA_END_MINUTE)&&MY_API.CONFIG.TIME_AREA_DISABLE){MYDEBUG(`节奏风暴`,`自动休眠，跳过检测roomid=${roomid}`);return $.Deferred().resolve();}
return BAPI.Storm.check(roomid).then((response)=>{MYDEBUG('MY_API.Storm.run: MY_API.API.Storm.check',response);if(response.code===0){var data=response.data;MY_API.Storm.join(data.id,data.roomid,Math.round(new Date().getTime()/1000)+data.time);return $.Deferred().resolve();}else{window.toast(`[自动抽奖][节奏风暴](roomid=${roomid})${response.msg}`,'caution');}},()=>{window.toast(`[自动抽奖][节奏风暴]检查直播间(${roomid})失败，请检查网络`,'error');});}catch(err){window.toast('[自动抽奖][节奏风暴]运行时出现异常','error');console.error(`[${NAME}]`,err);return $.Deferred().reject();}},join:(id,roomid,endtime)=>{roomid=parseInt(roomid,10);id=parseInt(id,10);if(isNaN(roomid)||isNaN(id))return $.Deferred().reject();var tid=Math.round(id/1000000);if(MY_API.stormIdSet.isIn(tid))return $.Deferred().resolve();MY_API.stormIdSet.add(tid);if(MY_API.Storm.check(id)){return;}
MY_API.Storm.append(id);var stormInterval=0;if(endtime<=0){endtime=Math.round(new Date().getTime()/1000)+90;}
var count=0;window.toast(`[自动抽奖][节奏风暴]尝试抽奖(roomid=${roomid},id=${id})`,'success');async function process(){try{if(!MY_API.Storm.check(id)){clearInterval(stormInterval);return;}
var timenow=Math.round(new Date().getTime()/1000);if(timenow>endtime&&endtime>0){MY_API.Storm.over(id);clearInterval(stormInterval);return;}
count++;if(count>MY_API.CONFIG.STORM_MAX_COUNT&&MY_API.CONFIG.STORM_MAX_COUNT>0){MY_API.Storm.over(id);clearInterval(stormInterval);window.toast(`[自动抽奖][节奏风暴]抽奖(roomid=${roomid},id=${id})到达尝试次数。\r\n尝试次数:${count},距离到期:${endtime - timenow}s`,'caution');return;}
let response;try{if(userToken&&appToken&&tokenData.access_token){response=await BAPI.Storm.join_ex(id,roomid,tokenData.access_token,BilibiliToken.appKey,BilibiliToken.headers);}else{response=await BAPI.Storm.join(id,captcha_token='',captcha_phrase='',roomid);}
MYDEBUG('MY_API.Storm.join: MY_API.API.Storm.join',response);if(response.code){if(response.msg.indexOf("领取")!=-1){MY_API.Storm.over(id);clearInterval(stormInterval);window.toast(`[自动抽奖][节奏风暴]领取(roomid=${roomid},id=${id})成功,${response.msg}\r\n尝试次数:${count}`,'success');return;}
if(response.msg.indexOf("验证码")!=-1){MY_API.Storm.over(id);clearInterval(stormInterval);MY_API.stormBlack=true;window.toast(`[自动抽奖][节奏风暴]抽奖(roomid=${roomid},id=${id})失败,疑似账号不支持,${response.msg}`,'caution');return;}
if(response.data&&response.data.length==0&&response.msg.indexOf("下次要更快一点")!=-1){MY_API.Storm.over(id);window.toast(`[自动抽奖][节奏风暴]抽奖(roomid=${roomid},id=${id})疑似风暴黑屋,终止！`,'error');clearInterval(stormInterval);MY_API.stormBlack=true;setTimeout(()=>{MY_API.stormBlack=false;},3600*1000);return;}
if(response.msg.indexOf("下次要更快一点")==-1){clearInterval(stormInterval);return;}}else{MY_API.Storm.over(id);Statistics.appendGift(response.data.gift_name,response.data.gift_num);window.toast(`[自动抽奖][节奏风暴]领取(roomid=${roomid},id=${id})成功,${response.data.gift_name + "x" + response.data.gift_num}\r\n${response.data.mobile_content}\r\n尝试次数:${count}`,'success');clearInterval(stormInterval);return;}}catch(e){MY_API.Storm.over(id);window.toast(`[自动抽奖][节奏风暴]抽奖(roomid=${roomid},id=${id})疑似触发风控,终止！\r\n尝试次数:${count}`,'error');console.error(e);clearInterval(stormInterval);return;}}
catch(e){MY_API.Storm.over(id);window.toast(`[自动抽奖][节奏风暴]抽奖(roomid=${roomid},id=${id})抽奖异常,终止！`,'error');console.error(e);clearInterval(stormInterval);return;}}
stormInterval=setInterval(()=>process(),MY_API.CONFIG.STORM_ONE_LIMIT);return $.Deferred().resolve();}},LITTLE_HEART:{getInfo:()=>XHR({GM:true,anonymous:true,method:'GET',url:`https://passport.bilibili.com/x/passport-login/oauth2/info?${appToken.signLoginQuery(`access_key=${tokenData.access_token}`)}`,responseType:'json',headers:appToken.headers}),mobileOnline:()=>XHR({GM:true,anonymous:true,method:'POST',url:`https://api.live.bilibili.com/heartbeat/v1/OnLine/mobileOnline?${BilibiliToken.signQuery(`access_key=${tokenData.access_token}&${baseQuery}`)}`,data:`room_id=${Live_info.room_id}&scale=xxhdpi`,responseType:'json',headers:appToken.headers}),RandomHex:(length)=>{const words='0123456789abcdef';let randomID='';randomID+=words[Math.floor(Math.random()*15)+1];for(let i=0;i<length-1;i++)
randomID+=words[Math.floor(Math.random()*16)];return randomID;},uuid:()=>MY_API.LITTLE_HEART.RandomHex(32).replace(/(\w{8})(\w{4})\w(\w{3})\w(\w{3})(\w{12})/,`$1-$2-4$3-${'89ab'[Math.floor(Math.random() * 4)]}$4-$5`),getFansMedal:async()=>{const funsMedals=await XHR({GM:true,anonymous:true,method:'GET',url:`https://api.live.bilibili.com/fans_medal/v1/FansMedal/get_list_in_room?${BilibiliToken.signQuery(`access_key=${tokenData.access_token}&target_id=${Live_info.tid}&uid=${Live_info.uid}&${baseQuery}`)}`,responseType:'json',headers:appToken.headers});if(funsMedals!==undefined&&funsMedals.response.status===200)
if(funsMedals.body.code===0)
if(funsMedals.body.data.length>0)
return funsMedals.body.data;},getGiftNum:async()=>{let todayHeart=0;await BAPI.gift.bag_list().then((re)=>{MYDEBUG('[小心心]检查包裹',re);const allHeart=re.data.list.filter(r=>r.gift_id==30607&&r.corner_mark=="7天");for(const heart of allHeart){todayHeart+=heart.gift_num;}});MYDEBUG(`[小心心]检测到包裹内7天小心心数量`,todayHeart);return todayHeart},mobileHeartBeat:async(postJSON)=>{const wasm=new WasmHash();await wasm.init();const clientSign=(data)=>wasm.hash('BLAKE2b512',wasm.hash('SHA3-384',wasm.hash('SHA384',wasm.hash('SHA3-512',wasm.hash('SHA512',JSON.stringify(data))))));const sign=clientSign(postJSON);let postData='';for(const i in postJSON)
postData+=`${i}=${encodeURIComponent(postJSON[i])}&`;postData+=`client_sign=${sign}`;const mobileHeartBeat=await XHR({GM:true,anonymous:true,method:'POST',url:'https://live-trace.bilibili.com/xlive/data-interface/v1/heartbeat/mobileHeartBeat',data:BilibiliToken.signQuery(`access_key=${tokenData.access_token}&${postData}&${baseQuery}`),responseType:'json',headers:appToken.headers});if(mobileHeartBeat!==undefined&&mobileHeartBeat.response.status===200)
if(mobileHeartBeat.body.code===0)
return true;return false;},run:async()=>{if(!MY_API.CONFIG.LITTLE_HEART)return $.Deferred().resolve();if(!checkNewDay(MY_API.CACHE.LittleHeart_TS)){runMidnight(MY_API.LITTLE_HEART.run,'获取小心心');return $.Deferred().resolve();}
const mobileHeartBeatJSON={platform:'android',uuid:MY_API.LITTLE_HEART.uuid(),buvid:appToken.buvid,seq_id:'1',room_id:'{room_id}',parent_id:'6',area_id:'283',timestamp:'{timestamp}',secret_key:'axoaadsffcazxksectbbb',watch_time:'300',up_id:'{target_id}',up_level:'40',jump_from:'30000',gu_id:MY_API.LITTLE_HEART.RandomHex(43),play_type:'0',play_url:'',s_time:'0',data_behavior_id:'',data_source_id:'',up_session:'l:one:live:record:{room_id}:{last_wear_time}',visit_id:MY_API.LITTLE_HEART.RandomHex(32),watch_status:'%7B%22pk_id%22%3A0%2C%22screen_status%22%3A1%7D',click_id:MY_API.LITTLE_HEART.uuid(),session_id:'',player_type:'0',client_ts:'{client_ts}'};const endFunc=async(check=true)=>{if(check)await sleep(5000);if(!check||await MY_API.LITTLE_HEART.getGiftNum()>=24){window.toast('[小心心]今日小心心已全部获取','success');clearInterval(mobileOnlineTimer);MY_API.CACHE.LittleHeart_TS=ts_ms();MY_API.saveCache();return runMidnight(MY_API.LITTLE_HEART.run,'获取小心心');}else{window.toast('[小心心]小心心未全部获取，295秒后将再次运行','info');return setTimeout(MY_API.LITTLE_HEART.run,295*1000)}}
if(tokenData.access_token===undefined&&await setToken()===undefined)
return;else if(!tokenData.access_token&&!tokenData.mid&&!tokenData.refresh_token){const userInfo=await MY_API.LITTLE_HEART.getInfo();MYDEBUG('[小心心]userInfo',userInfo);if(userInfo===undefined)
return console.error(GM_info.script.name,'获取用户信息错误');if(userInfo.body.code!==0&&await setToken()===undefined)
return;else if(userInfo.body.data.mid!==Live_info.uid&&await setToken()===undefined)
return;};MYDEBUG('[小心心]','开始客户端心跳');window.toast('[小心心]开始获取小心心','success');MY_API.LITTLE_HEART.mobileOnline();let mobileOnlineTimer=setInterval(()=>MY_API.LITTLE_HEART.mobileOnline(),5*60*1000);const giftNum=await MY_API.LITTLE_HEART.getGiftNum();if(giftNum<24){const fansMedal=await MY_API.LITTLE_HEART.getFansMedal();if(fansMedal!==undefined){const control=24-giftNum;const loopNum=Math.ceil(control/fansMedal.length);let count=0;for(let i=0;i<loopNum;i++){for(const funsMedalData of fansMedal){if(count>=control)
return endFunc();const postData=Object.assign({},mobileHeartBeatJSON,{room_id:funsMedalData.room_id.toString(),timestamp:(BilibiliToken.TS-300).toString(),up_id:funsMedalData.target_id.toString(),up_session:`l:one:live:record:${funsMedalData.room_id}:${funsMedalData.last_wear_time}`,client_ts:BilibiliToken.TS.toString()});await MY_API.LITTLE_HEART.mobileHeartBeat(postData);count++;}
if(count>=control){return endFunc();}
else{await sleep(300*1000);}}}}else{return endFunc(false);}}},AUTO_DANMU:{setValue:(array,index)=>{if(MY_API.CONFIG[array][index]===undefined&&index>0)
return MY_API.AUTO_DANMU.setValue(array,index-1);else return MY_API.CONFIG[array][index];},sendDanmu:async(danmuContent,roomId)=>{return BAPI.room.get_info(roomId).then((res)=>{MYDEBUG(`API.room.get_info roomId=${roomId} res`,res);return BAPI.sendLiveDanmu(danmuContent,res.data.room_id).then((response)=>{MYDEBUG(`[自动发弹幕]弹幕发送内容【${danmuContent}】，房间号【${roomId}】`,response);if(response.code===0&&!response.msg)
window.toast(`[自动发弹幕]弹幕【${danmuContent}】（房间号【${roomId}】）发送成功`,'success');else window.toast(`[自动发弹幕]弹幕【${danmuContent}】（房间号【${roomId}】）出错 ${response.msg}`,'caution')},()=>{window.toast(`[自动发弹幕]弹幕【${danmuContent}】（房间号【${roomId}】）发送失败`,'error')})});},getMaxLength:()=>{let maxLength=undefined;const contentLength=MY_API.CONFIG.DANMU_CONTENT.length,roomidLength=MY_API.CONFIG.DANMU_ROOMID.length,intervalTimeLength=MY_API.CONFIG.DANMU_INTERVAL_TIME.length;if(contentLength>=roomidLength)maxLength=contentLength;else maxLength=roomidLength;if(maxLength<intervalTimeLength)
maxLength=intervalTimeLength;return maxLength},run:async()=>{if(!MY_API.CONFIG.AUTO_DANMU)return $.Deferred().resolve();let maxLength=MY_API.AUTO_DANMU.getMaxLength();for(let i=0;i<maxLength;i++){let danmu_content=MY_API.AUTO_DANMU.setValue('DANMU_CONTENT',i),danmu_roomid=parseInt(MY_API.AUTO_DANMU.setValue('DANMU_ROOMID',i)),danmu_intervalTime=MY_API.AUTO_DANMU.setValue('DANMU_INTERVAL_TIME',i),lastSendTime=undefined,jsonCache=MY_API.CACHE.AUTO_SEND_DANMU_TS,objIndex=undefined,isTimeData=undefined,intervalTime=undefined,danmu_intervalTime_Ts=undefined,sleepTime=0;if(danmu_intervalTime.indexOf(':')>-1){isTimeData=true;const danmu_time=danmu_intervalTime.split(':');const hour=parseInt(danmu_time[0]),minute=parseInt(danmu_time[1]),second=parseInt(danmu_time[2]);if(!isTime(hour,minute,second)){sleepTime=getIntervalTime(hour,minute,second);}}
else{isTimeData=false;danmu_intervalTime=danmu_intervalTime.toLowerCase();if(danmu_intervalTime.indexOf('h')>-1||danmu_intervalTime.indexOf('m')>-1||danmu_intervalTime.indexOf('s')>-1){const hourArray=danmu_intervalTime.split('h');const minuteArray=(hourArray[1]===undefined)?hourArray[0].split('m'):hourArray[1].split('m');const secondArray=(minuteArray[1]===undefined)?minuteArray[0].split('s'):minuteArray[1].split('s');const hour=hourArray[0],minute=minuteArray[0],second=secondArray[0];const finalHour=isNaN(hour)?0:hour||0,finalMinute=isNaN(minute)?0:minute||0,finalSecond=isNaN(second)?0:second||0;danmu_intervalTime_Ts=finalHour*3600000+finalMinute*60000+finalSecond*1000;}else{danmu_intervalTime_Ts=danmu_intervalTime*60000;}}
MYDEBUG('[自动发弹幕]MY_API.CACHE.AUTO_SEND_DANMU_TS => jsoncache',jsonCache);for(const obj of jsonCache){if(obj.roomid==danmu_roomid&&obj.content==danmu_content){lastSendTime=obj.sendTs
objIndex=jsonCache.indexOf(obj);break;}}
if(!isTimeData){if(!!lastSendTime)intervalTime=ts_ms()-lastSendTime;else intervalTime=ts_ms();}
const setCache=()=>{const newJson={roomid:danmu_roomid,content:danmu_content,sendTs:ts_ms()};if(!lastSendTime){jsonCache.push(newJson);}else{jsonCache[objIndex].sendTs=ts_ms();}
MY_API.CACHE.AUTO_SEND_DANMU_TS=jsonCache;MY_API.saveCache(false);};const sendNextDanmu=(intervalTS,isTime)=>{if(!isTime)setCache();setTimeout(async()=>{await MY_API.AUTO_DANMU.sendDanmu(danmu_content,danmu_roomid);if(!isTime)setCache();sendNextDanmu(intervalTS,isTime);},intervalTS);}
if(!isTimeData&&(intervalTime>=danmu_intervalTime_Ts||SEND_DANMU_NOW)){SEND_DANMU_NOW=false;await MY_API.AUTO_DANMU.sendDanmu(danmu_content,danmu_roomid);MYDEBUG(`[自动发弹幕]弹幕发送内容【${danmu_content}】，房间号【${danmu_roomid}】，距下次发送还有`,danmu_intervalTime);sendNextDanmu(danmu_intervalTime_Ts,isTimeData);}else if((isTimeData&&!sleepTime)||SEND_DANMU_NOW){SEND_DANMU_NOW=false;await MY_API.AUTO_DANMU.sendDanmu(danmu_content,danmu_roomid);sleepTime=getIntervalTime(danmu_time[0],danmu_time[1],danmu_time[2]);MYDEBUG(`[自动发弹幕]弹幕发送内容【${danmu_content}】，房间号【${danmu_roomid}】，距下次发送还有`,'约24小时');sendNextDanmu(sleepTime,isTimeData);}
else{MYDEBUG(`[自动发弹幕]弹幕发送内容【${danmu_content}】，房间号【${danmu_roomid}】，距下次发送还有`,`${(!isTimeData) ? (danmu_intervalTime_Ts - intervalTime) / 60000 : sleepTime / 60000}分钟`);setTimeout(async()=>{await MY_API.AUTO_DANMU.sendDanmu(danmu_content,danmu_roomid);sendNextDanmu((isTimeData)?86400000:danmu_intervalTime_Ts,isTimeData);},(isTimeData)?sleepTime:danmu_intervalTime_Ts-intervalTime);}
await sleep(1100);}}},MaterialObject:{list:[],firstAid:undefined,run:()=>{try{if(!MY_API.CONFIG.MATERIAL_LOTTERY)return $.Deferred().resolve();if(MY_API.CACHE.materialobject_ts){const diff=ts_ms()-MY_API.CACHE.materialobject_ts;const interval=MY_API.CONFIG.MATERIAL_LOTTERY_CHECK_INTERVAL*60e3||600e3;if(diff<interval){MYDEBUG('[实物抽奖]',`${interval - diff}毫秒后再次运行`);setTimeout(MY_API.MaterialObject.run,interval-diff);return $.Deferred().resolve();}};MY_API.chatLog('[实物抽奖] 开始寻找可参加的抽奖');return MY_API.MaterialObject.check().then((aid)=>{if(aid){MY_API.CACHE.last_aid=aid;MY_API.CACHE.materialobject_ts=ts_ms();MY_API.saveCache();}
MYDEBUG('[实物抽奖]',`将在${MY_API.CONFIG.MATERIAL_LOTTERY_CHECK_INTERVAL}分钟后再次运行实物抽奖`);setTimeout(MY_API.MaterialObject.run,MY_API.CONFIG.MATERIAL_LOTTERY_CHECK_INTERVAL*60e3||600e3);},()=>delayCall(()=>MY_API.MaterialObject.run()));}catch(err){MY_API.chatLog('[实物抽奖]运行时出现异常','error');console.error(`[${NAME}]`,err);return $.Deferred().reject();}},check:(aid,valid=632,rem=MY_API.CONFIG.MATERIAL_LOTTERY_REM||9)=>{aid=parseInt(aid||(MY_API.CACHE.last_aid),10);if(isNaN(aid))aid=valid;MYDEBUG('API.MaterialObject.check: aid=',aid);return BAPI.Lottery.MaterialObject.getStatus(aid).then((response)=>{MYDEBUG('API.MaterialObject.check: API.MY_API.MaterialObject.getStatus',response);if(response.code===0&&response.data){if(response.data.typeB[response.data.typeB.length-1].status!=3&&MY_API.MaterialObject.firstAid===undefined)
MY_API.MaterialObject.firstAid=aid;if(MY_API.CONFIG.MATERIAL_LOTTERY_IGNORE_QUESTIONABLE_LOTTERY){for(const str of MY_API.CONFIG.QUESTIONABLE_LOTTERY){if(str.charAt(0)!='/'&&str.charAt(str.length-1)!='/'){if(response.data.title.toLowerCase().indexOf(str)>-1){MY_API.chatLog(`[实物抽奖] 忽略存疑抽奖(aid=${aid})<br>含有关键字：${str}`,'info');return MY_API.MaterialObject.check(aid+1,aid);}}
else{let reg=eval(str);if(reg.test(str)){MY_API.chatLog(`[实物抽奖] 忽略存疑抽奖(aid=${aid})<br>匹配正则：${str}`,'info');return MY_API.MaterialObject.check(aid+1,aid);}}}}
return MY_API.MaterialObject.join(aid,response.data.title,response.data.typeB).then(()=>MY_API.MaterialObject.check(aid+1,aid));}else if(response.code===-400||response.data==null){if(rem)return MY_API.MaterialObject.check(aid+1,valid,rem-1);return $.Deferred().resolve(MY_API.MaterialObject.firstAid||valid);}else{MY_API.chatLog(`[实物抽奖] ${response.msg}`,'warning');}},()=>{MY_API.chatLog(`[实物抽奖] 检查抽奖(aid=${aid})失败，请检查网络`,'error');return delayCall(()=>MY_API.MaterialObject.check(aid,valid));});},join:(aid,title,typeB,i=0)=>{if(i>=typeB.length)return $.Deferred().resolve();if(MY_API.MaterialObject.list.some(v=>v.aid===aid&&v.number===i+1))
return MY_API.MaterialObject.join(aid,title,typeB,i+1);const number=i+1;let obj={title:title,aid:aid,number:number,status:typeB[i].status,join_start_time:typeB[i].join_start_time,join_end_time:typeB[i].join_end_time,list:typeB[i].list,jpName:''};for(const i of obj.list){obj.jpName=obj.jpName.concat(' ',i.jp_name);}
switch(obj.status){case-1:{MY_API.chatLog(`[实物抽奖] 将在${new Date((obj.join_start_time+1)*1000).toLocaleString()}参加抽奖<br>"${obj.title}" aid=${obj.aid} 第${i + 1}轮 奖品：${obj.jpName}`,'info');MY_API.MaterialObject.list.push(obj);const p=$.Deferred();p.then(()=>{return MY_API.MaterialObject.draw(obj);});setTimeout(()=>{p.resolve();},(obj.join_start_time-ts_s()+1)*1e3);}
break;case 0:return MY_API.MaterialObject.draw(obj).then(()=>{return MY_API.MaterialObject.join(aid,title,typeB,i+1);});case 1:{MY_API.chatLog(`[实物抽奖] 已参加抽奖<br>"${obj.title}" aid=${obj.aid} 第${i + 1}轮 奖品：${obj.jpName}`,'info');MY_API.MaterialObject.list.push(obj);const p=$.Deferred();p.then(()=>{return MY_API.MaterialObject.notice(obj);});setTimeout(()=>{p.resolve();},(obj.join_end_time-ts_s()+1)*1e3);}
break;}
return MY_API.MaterialObject.join(aid,title,typeB,i+1);},draw:(obj)=>{return BAPI.Lottery.MaterialObject.draw(obj.aid,obj.number).then((response)=>{MYDEBUG('API.MaterialObject.check: API.MY_API.MaterialObject.draw',response);if(response.code===0){$.each(MY_API.MaterialObject.list,(i,v)=>{if(v.aid===obj.aid&&v.number===obj.number){v.status=1;MY_API.MaterialObject.list[i]=v;return false;}});MY_API.chatLog(`[实物抽奖] 成功参加抽奖<nr>"${obj.title}"(aid=${obj.aid},number=${obj.number}) 奖品：${obj.jpName}`,'success');const p=$.Deferred();p.then(()=>{return MY_API.MaterialObject.notice(obj);});setTimeout(()=>{p.resolve();},(obj.join_end_time-ts_s()+1)*1e3);}else{MY_API.chatLog(`[实物抽奖] "${obj.title}"(aid=${obj.aid},number=${obj.number})<br>${response.msg}`,'warning');}},()=>{MY_API.chatLog(`[实物抽奖] 参加"${obj.title}"(aid=${obj.aid},number=${obj.number})<br>失败，请检查网络`,'error');return delayCall(()=>MY_API.MaterialObject.draw(obj));});},notice:(obj)=>{return BAPI.Lottery.MaterialObject.getWinnerGroupInfo(obj.aid,obj.number).then((response)=>{MYDEBUG('API.MaterialObject.check: API.MY_API.MaterialObject.getWinnerGroupInfo',response);if(response.code===0){$.each(MY_API.MaterialObject.list,(i,v)=>{if(v.aid===obj.aid&&v.number===obj.number){v.status=3;MY_API.MaterialObject.list[i]=v;return false;}});for(const i of response.data.groups){for(const g of i.list){if(g.uid===Live_info.uid){MY_API.chatLog(`[实物抽奖] 抽奖"${obj.title}"(aid=${obj.aid},number=${obj.number})获得奖励<br>"${i.giftTitle}"`,'success');return true;}}}
MY_API.chatLog(`[实物抽奖] 抽奖"${obj.title}"(aid=${obj.aid},number=${obj.number})未中奖`,'info');}else{MY_API.chatLog(`[实物抽奖] 抽奖"${obj.title}"(aid=${obj.aid},number=${obj.number})<br>${response.msg}`,'warning');}},()=>{MY_API.chatLog(`[实物抽奖] 获取抽奖"${obj.title}"(aid=${obj.aid},number=${obj.number})<br>获取中奖名单失败，请检查网络`,'error');return delayCall(()=>MY_API.MaterialObject.notice(obj));});}}};MY_API.init().then(()=>{try{if(parseInt(Live_info.uid)===0||isNaN(parseInt(Live_info.uid))){MY_API.chatLog('未登录，请先登录再使用脚本','warning');return};MY_API.newMessage(GM_info.script.version);MYDEBUG('MY_API.CONFIG',MY_API.CONFIG);StartPlunder(MY_API);}
catch(e){console.error('重复运行检测错误',e);}});}
function StartPlunder(API){'use strict';let clearStat=()=>{API.GIFT_COUNT.COUNT=0;API.GIFT_COUNT.CLEAR_TS=dateNow();API.saveGiftCount();MYDEBUG('已清空辣条数量')}
if(checkNewDay(API.GIFT_COUNT.CLEAR_TS))clearStat();runExactMidnight(clearStat,'重置统计');API.creatSetBox();API.removeUnnecessary();const fixList=['AUTO_GIFT_ROOMID','LIGHT_MEDALS','EXCLUDE_ROOMID'];if(!fixList.every(i=>$.isArray(API.CONFIG[i]))){for(const i of fixList){if(!$.isArray(API.CONFIG[i])){API.CONFIG[i]=API.CONFIG[i].split(",");}}
API.chatLog('变量类型错误修复完成','success');API.saveConfig();}
setTimeout(()=>{API.AUTO_DANMU.run();API.LITTLE_HEART.run();API.GroupSign.run();API.DailyReward.run();API.LiveReward.run();API.Exchange.runS2C();API.Gift.run();API.MaterialObject.run();},6e3);if(API.CONFIG.LOTTERY){BAPI.room.getList().then((response)=>{MYDEBUG('直播间列表',response);for(const obj of response.data){BAPI.room.getRoomList(obj.id,0,0,1,1).then((response)=>{MYDEBUG('直播间号列表',response);for(let j=0;j<response.data.length;++j){API.listen(response.data[j].roomid,Live_info.uid,`${obj.name}区`);}});}});if(API.CONFIG.CHECK_HOUR_ROOM){let check_top_room=()=>{if(API.GIFT_COUNT.COUNT>=API.CONFIG.MAX_GIFT){MYDEBUG('超过今日辣条限制，不参与抽奖');API.max_blocked=true;}
if(API.blocked||API.max_blocked){if(API.blocked){API.chatLog('进入小黑屋检查小时榜已停止运行');clearInterval(check_timer);return}
else{API.chatLog('辣条已达到最大值检查小时榜已停止运行');return}}
if(inTimeArea(API.CONFIG.TIME_AREA_START_H0UR,API.CONFIG.TIME_AREA_END_H0UR,API.CONFIG.TIME_AREA_START_MINUTE,API.CONFIG.TIME_AREA_END_MINUTE)&&API.CONFIG.TIME_AREA_DISABLE){API.chatLog('当前时间段不检查小时榜礼物','warning');return}
const AreaIdList=['小时总榜','娱乐小时榜','网游小时榜','手游小时榜','绘画小时榜','电台小时榜','单机小时榜',];let AreaNum=1;let checkHourRank=(areaId)=>{BAPI.rankdb.getTopRealTimeHour(areaId).then((data)=>{let list=data.data.list;API.chatLog(`检查${AreaIdList[areaId]}房间的礼物`,'warning');MYDEBUG(`${AreaIdList[areaId]}房间列表`,list);for(let i of list){API.checkRoom(i.roomid,`小时榜-${i.area_v2_parent_name}区`);}})};let timer=setInterval(()=>{if(AreaNum<=AreaIdList.length-1){checkHourRank(AreaNum);AreaNum++;}
else{clearInterval(timer)}},1000);};setTimeout(check_top_room,6e3);let check_timer=setInterval(check_top_room,parseInt(API.CONFIG.CHECK_HOUR_ROOM_INTERVAL*1000));}}
const reset=(delay)=>{let resetTimer=setTimeout(()=>{if(API.raffleId_list.length>0||API.guardId_list.length>0||API.pkId_list.length>0){MYDEBUG('[刷新直播间]','还有礼物没抽，延迟15s后刷新直播间');return reset(15000);}
if(checkNewDay(API.CACHE.LittleHeart_TS)){MYDEBUG('[刷新直播间]','正在获取小心心，10分钟后再次检查');clearTimeout(resetTimer);return reset(600e3);}
if(inTimeArea(API.CONFIG.TIME_AREA_START_H0UR,API.CONFIG.TIME_AREA_END_H0UR,API.CONFIG.TIME_AREA_START_MINUTE,API.CONFIG.TIME_AREA_END_MINUTE)&&API.CONFIG.IN_TIME_RELOAD_DISABLE){let resetTime=getIntervalTime(API.CONFIG.TIME_AREA_START_MINUTE,API.CONFIG.TIME_AREA_END_MINUTE)+60e3;MYDEBUG('[刷新直播间]',`处于休眠时间段，将在${resetTime}毫秒后刷新直播间`);return reset(resetTime);}
window.location.reload();},delay);};if(API.CONFIG.TIME_RELOAD)reset(API.CONFIG.TIME_RELOAD_MINUTE*60000);}
function getIntervalTime(hour,minute,second){const myDate=new Date();const h=myDate.getHours();const m=myDate.getMinutes();const s=myDate.getSeconds();const TargetTime=hour*3600*1e3+minute*60*1e3+((!second)?0:second*1e3);const nowTime=h*3600*1e3+m*60*1e3+s*1e3;const intervalTime=TargetTime-nowTime;MYDEBUG("[getIntervalTime]获取间隔时间",`${intervalTime}毫秒`);if(intervalTime<0){return 24*3600*1e3+intervalTime}
else{return intervalTime}}
function isTime(hour,minute,second){let myDate=new Date();let h=myDate.getHours();let m=myDate.getMinutes();let s=myDate.getSeconds();if((h==hour&&m==minute&&!second)||(h==hour&&m==minute&&s==second)){return true}else{MYDEBUG("isTime 错误时间",`目标时间${hour}时${minute}分${second || 0}秒，当前时间${h}时${m}分${s}秒`);return false}}
function inTimeArea(sH,eH,sM,eM){if(sH>23||eH>24||sH<0||eH<1||sM>59||sM<0||eM>59||eM<0){return false}
let myDate=new Date();let h=myDate.getHours();let m=myDate.getMinutes();if(sH<eH){if(h>=sH&&h<eH)
return true;else if(h==eH&&m>=sM&&m<eM)
return true;else return false;}
else if(sH>eH){if(h>=sH||h<eH)
return true;else if(h==eH&&m>=sM&&m<eM)
return true;else return false;}
else if(sH==eH){if(h==sH&&sM<=eM&&m>=sM&&m<eM)
return true
else if(h==sH&&sM>eM&&m<=eM&&m>sM)
return true
else return false;}};function sleep(millisecond){return new Promise(resolve=>{setTimeout(()=>{resolve()},millisecond)})}
function probability(val){if(val<=0)return false;let rad=Math.random();return(val/100)>=rad}
const dateNow=()=>Date.now();const checkNewDay=(ts)=>{if(ts===0)return true;let t=new Date(ts);let d=new Date();let td=t.getDate();let dd=d.getDate();return(dd!==td);};function XHR(XHROptions){return new Promise(resolve=>{const onerror=(error)=>{console.error(GM_info.script.name,error);resolve(undefined);};if(XHROptions.GM){if(XHROptions.method==='POST'){if(XHROptions.headers===undefined)
XHROptions.headers={};if(XHROptions.headers['Content-Type']===undefined)
XHROptions.headers['Content-Type']='application/x-www-form-urlencoded; charset=utf-8';}
XHROptions.timeout=30*1000;XHROptions.onload=res=>resolve({response:res,body:res.response});XHROptions.onerror=onerror;XHROptions.ontimeout=onerror;GM_xmlhttpRequest(XHROptions);}
else{const xhr=new XMLHttpRequest();xhr.open(XHROptions.method,XHROptions.url);if(XHROptions.method==='POST'&&xhr.getResponseHeader('Content-Type')===null)
xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=utf-8');if(XHROptions.cookie)
xhr.withCredentials=true;if(XHROptions.responseType!==undefined)
xhr.responseType=XHROptions.responseType;xhr.timeout=30*1000;xhr.onload=ev=>{const res=ev.target;resolve({response:res,body:res.response});};xhr.onerror=onerror;xhr.ontimeout=onerror;xhr.send(XHROptions.data);}});}})();