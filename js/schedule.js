;
(function(undefined) {
	var _global;
	//工具函数
	//配置合并
	function extend(def, opt, override) {
		for(var k in opt) {
			if(opt.hasOwnProperty(k) && (!def.hasOwnProperty(k) || override)) {
				def[k] = opt[k]
			}
		}
		return def;
	}
	//日期格式化
	function formartDate(y, m, d, symbol) {
		symbol = symbol || '-';
		m = (m.toString())[1] ? m : '0' + m;
		d = (d.toString())[1] ? d : '0' + d;
		return y + symbol + m + symbol + d
	}
function formartDate2(y, m,symbol) {
		symbol = symbol || '-';
		m = (m.toString())[1] ? m : '0' + m;
		return y + symbol + m 
	}
	function Schedule(opt) {
		var def = {},
			opt = extend(def, opt, true),
			curDate = opt.date ? new Date(opt.date) : new Date(),
			year = curDate.getFullYear(),
			month = curDate.getMonth(),
			day = curDate.getDate(),
			currentYear = curDate.getFullYear(),
			currentMonth = curDate.getMonth(),
			currentDay = curDate.getDate(),
			selectedDate = '',
			el = document.querySelector(opt.el) || document.querySelector('body'),
			_this = this;
			var _nowMonth = (month+1) < 10 ? ("0"+(month+1)) : (month+1);
			$('#title').text(year+"-"+_nowMonth)
		var bindEvent = function() {
			el.addEventListener('click', function(e) {
				switch(e.target.id) {
					case 'nextMonth':
						_this.nextMonthFun();
						break;
					case 'nextYear':
						_this.nextYearFun();
						break;
					case 'prevMonth':
						_this.prevMonthFun();
						break;
					case 'prevYear':
						_this.prevYearFun();
						break;
					default:
						break;
				};
				if(e.target.className.indexOf('currentDate') > -1) {
						opt.clickCb && opt.clickCb(year, month + 1, e.target.innerHTML);
						selectedDate = e.target.title;
						day = e.target.innerHTML;
						//console.log($('.currentDate'));
						$(".xuanzhong").removeClass('xuanzhong');
						if(selectedDate == e.target.title){
							$(e.target).addClass('xuanzhong')
						}
						
						//if(selectedDate = ){}
						//
					
					//e.target.className.addClass("xx");
					//render();
				}
			}, false)
		}
		var init = function() {
			var scheduleHd = '<div class="schedule-hd">' +
				'<div style="flex:1;display:flex">' +
				'<span class="icon-circle-left" style="flex:1;padding: 1rem;color: #4fa5a5;" id="prevMonth"></span>' +
				'<span class="icon-circle-right" style="flex:1;padding: 1rem;color: #4fa5a5;text-align: end;" id="nextMonth"></span>' +
				'</div>' +
				'</div>'
			var scheduleWeek = '<ul class="week-ul ul-box">' +
				'<li>日</li>' +
				'<li>一</li>' +
				'<li>二</li>' +
				'<li>三</li>' +
				'<li>四</li>' +
				'<li>五</li>' +
				'<li>六</li>' +
				'</ul>'
			var scheduleBd = '<ul class="schedule-bd ul-box" ></ul>';
			el.innerHTML = scheduleHd + scheduleWeek + scheduleBd;
			bindEvent();
			var _userData = JSON.parse(getLsItem("loginData"));
			//console.log(_userData);
				var m2 = (month + 1) < 10 ? ("0"+(month + 1)) : (month + 1);
				mAjax(_url + 'hstserver/getCalendarData', {
					/*year: year,
					month: (month + 1),*/
					month: year+"-"+m2,
					//factoryId:_userData.factoryId,
					//factoryName:_userData.factoryName,
					userName: _userData.userName
				}, function(data) {
					if(data.success == 1) {
						//console.log(data);
						render(data.data);
					}else{
						//切换月份将原来的审核清单置空
						//_this.lpaLists = [];
						//_nowRLData = [];
						render([]);
					}
					//console.log(data);
				})
			//render();
		}
		var render = function(data) {
			//console.log(data);
			if(data == undefined){
				data = []
			}
			var fullDay = new Date(year, month + 1, 0).getDate(), //当月总天数
				startWeek = new Date(year, month, 1).getDay(), //当月第一天是周几
				total = (fullDay + startWeek) % 7 == 0 ? (fullDay + startWeek) : fullDay + startWeek + (7 - (fullDay + startWeek) % 7), //元素总个数
				lastMonthDay = new Date(year, month, 0).getDate(), //上月最后一天
				eleTemp = [];
			for(var i = 0; i < total; i++) {
				if(i < startWeek) {
					//console.log(666666);
					eleTemp.push('<li class="other-month"><span class="dayStyle">' + (lastMonthDay - startWeek + 1 + i) + '</span></li>')
				} else if(i < (startWeek + fullDay)) {
					//console.log(i);
					//console.log(777777);//<span class="select_color"></span>
					var nowDate = formartDate(year, month + 1, (i + 1 - startWeek), '-');
					var addClass = '';
					var initClass = '';
					if(data.length > 0){
						if(data[i-startWeek].color == "red"){
							initClass =  'select_color3';
						}else if(data[i-startWeek].color == ''){
							initClass =  'select_color2';
						}else if(data[i-startWeek].color == "purple"){
							initClass =  'select_color1';
						}else if(data[i-startWeek].color == "yellow"){
							initClass =  'select_color4';
						}else if(data[i-startWeek].color == "green"){
							initClass =  'select_color5';
						}
					}
					
					selectedDate == nowDate && (addClass = 'selected-style');
					formartDate(currentYear, currentMonth + 1, currentDay, '-') == nowDate && (addClass = 'today-flag');
					eleTemp.push('<li class="current-month" ><span title=' + nowDate + ' class="currentDate dayStyle ' + addClass + '">' + (i + 1 - startWeek) + '</span><span class="'+initClass+'"></span></li>')
				} else {
					//console.log(88888);
					eleTemp.push('<li class="other-month"><span class="dayStyle">' + (i + 1 - (startWeek + fullDay)) + '</span></li>')
				}
			}
			el.querySelector('.schedule-bd').innerHTML = eleTemp.join('');
			//el.querySelector('.today').innerHTML = formartDate2(year, month + 1, '-');
		};
		this.nextMonthFun = function() {
				if(month + 1 > 11) {
					year += 1;
					month = 0;
				} else {
					month += 1;
				}
				var _userData = JSON.parse(getLsItem("loginData"));
				//console.log(_userData);
				var m2 = (month + 1) < 10 ? ("0"+(month + 1)) : (month + 1);
				mAjax(_url + 'hstserver/getCalendarData', {
					/*year: year,
					month: (month + 1),*/
					month: year+"-"+m2,
					//factoryId:_userData.factoryId,
					//factoryName:_userData.factoryName,
					userName: _userData.userName
				}, function(data) {
					if(data.success == 1) {
						//console.log(data);
						render(data.data);
					} else {
						//切换月份将原来的审核清单置空
						//_this.lpaLists = [];
						//_nowRLData = [];
						render([]);
					}
					//console.log(data);
				})
				//render();
				opt.nextMonthCb && opt.nextMonthCb(year, month + 1, day);
			},
			this.nextYearFun = function() {
				year += 1;
				render();
				opt.nextYeayCb && opt.nextYeayCb(year, month + 1, day);
			},
			this.prevMonthFun = function() {
				if(month - 1 < 0) {
					year -= 1;
					month = 11;
				} else {
					month -= 1;
				}
				var _userData = JSON.parse(getLsItem("loginData"));
				//console.log(_userData);
				var m2 = (month + 1) < 10 ? ("0"+(month + 1)) : (month + 1);
				mAjax(_url + 'hstserver/getCalendarData', {
					/*year: year,
					month: (month + 1),*/
					month: year+"-"+m2,
					//factoryId:_userData.factoryId,
					//factoryName:_userData.factoryName,
					userName: _userData.userName
				}, function(data) {
					if(data.success == 1) {
						//console.log(data);
						render(data.data);
					} else {
						//切换月份将原来的审核清单置空
						//_this.lpaLists = [];
						//_nowRLData = [];
						render([]);
					}
					//console.log(data);
				})
				
				opt.prevMonthCb && opt.prevMonthCb(year, month + 1, day);
			},
			this.prevYearFun = function() {
				year -= 1;
				render();
				opt.prevYearCb && opt.prevYearCb(year, month + 1, day);
			}
		init();
	}
	//将插件暴露给全局对象
	_global = (function() {
		return this || (0, eval)('this')
	}());
	if(typeof module !== 'undefined' && module.exports) {
		module.exports = Schedule;
	} else if(typeof define === "function" && define.amd) {
		define(function() {
			return Schedule;
		})
	} else {
		!('Schedule' in _global) && (_global.Schedule = Schedule);
	}

}());