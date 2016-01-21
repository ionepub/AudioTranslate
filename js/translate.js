var text=null;
var xhr=null;
var url_tr = 'http://apistore.baidu.com/microservice/translate';
var url_di = 'http://apistore.baidu.com/microservice/dictionary';
var baseurl = url_tr;
var curr = 'translate';
var url='';
var contentbox = null;
var res = '';
var tips = "<li class='right'>Tips : 点击左下方的话筒可以语音输入！<br>#: 互换语种<br>#1: 中文--英文翻译<br>#2: 中文--日文翻译<br>#3: 中文--韩文翻译<br>#4: 中文--粤语翻译<br>#5: 英文--中文翻译<br>#6: 日文--中文翻译<br>#7: 韩文--中文翻译<br>#8: 粤语--中文翻译</li>"
var from = 'zh';
var to = 'en';
function welcome(){
	/*url = 'http://wechatrw.sinaapp.com/welcome.php';
	xhrCreate();
	setTimeout(function(){
		res = timeout();
		res = "<li class='right'>" + res + "</li>";
		contentbox.innerHTML = res + tips;
		console.log("welcome complete");
	},1000);*/
	res = "<li class='right'>欢迎使用Audio Translate！<br>当前是中英翻译，输入#可切换到英中翻译！</li>";
	contentbox.innerHTML = res + tips;
	scrollBtm();
}
/*var times = 0;
function timeout(){
	if(times<5){
		times += 1;
		if(!xhr){
			setTimeout(timeout,1000);
			console.log('time2');
		}else if(xhr.status!=200){
			setTimeout(timeout,1000);
			console.log('time');
		}else{
			return xhr.responseText;
		}
	}else{
		return false;
	}	
}*/
function startRecognize () {
	var options = {};
	options.engine = 'iFly';
	plus.speech.startRecognize( options, function ( s ) {
		text.value += s;
	}, function ( e ) {
		plus.nativeUI.toast("语音识别失败："+e.message,{duration:"long"});
	} );
}

function checkForm(){
	if(text.value.replace(/(^\s*)|(\s*$)/g,'')==""){
		res = "<li class='right'>你什么也没输入啊，你怎么什么都不输入就发送了呢？你不说点什么我怎么知道你想知道什么呢？只有你输入了什么之后我才知道你想知道什么呀！快输入点什么吧！</li>";
		contentbox.innerHTML += res + tips;
		text.value = '';
		scrollBtm();
	}else{
		//sending
		var req = text.value;
		text.value='';
		document.getElementById("sendbutton").disabled = true;
		res = "<li class='left'>"+ req +"</li>";
		contentbox.innerHTML += res;
		if(!changeType(req)){
			req = encodeURI(req);
			url=baseurl + "?query="+ req +"&from="+ from +"&to="+ to;
			xhrCreate();
			/*setTimeout(function(){
				times = 0;
				res = timeout();
				if(res==false){
					res = "<li class='right'>请求超时！</li>";
				}else{
					res = JSON.parse(res);
					if(res.errNum == 0){
						var res_dst = res.retData.trans_result[0].dst;
					}
					res = "<li class='right'>" + res_dst + "</li>";
					contentbox.innerHTML += res;
					console.log("complete");
				}
			},1000);*/
		}
		document.getElementById("sendbutton").disabled = false;
	}
	return false;
}
function xhrCreate() {
	if ( xhr ) {
		console.log( "xhr请求已创建" );
		//return false;
	}
	console.log( "创建请求：" );
	xhr = new plus.net.XMLHttpRequest();
	xhr.onreadystatechange = function () {
        switch ( xhr.readyState ) {
            case 0:
            	console.log( "xhr请求已初始化" );
            break;
            case 1:
            	console.log( "xhr请求已打开" );
            break;
            case 2:
            	console.log( "xhr请求已发送" );
            break;
            case 3:
                console.log( "xhr请求已响应");
                break;
            case 4:
                console.log( "xhr请求已完成");
                if ( xhr.status == 200 ) {
                	res = JSON.parse(xhr.responseText);
					if(res.errNum == 0){
						if(curr=='translate'){
							var res_dst = res.retData.trans_result[0].dst;							
						}else{
							var res_dst = "<strong>"+res.retData.dict_result.word_name+"</strong><br>";
							console.log(res.retData.dict_result=="");
							if(res.retData.dict_result!=""){
								var res_symsize = res.retData.dict_result.symbols.length;
								for (var i=0;i<res_symsize;i++) {
									res_dst += "[美]"+res.retData.dict_result.symbols[i].ph_am+"<br>"+"[英]"+res.retData.dict_result.symbols[i].ph_en+"<br>";
									var res_partsize = res.retData.dict_result.symbols[i].parts.length;
									for(var j=0;j<res_partsize;j++){
										res_dst += res.retData.dict_result.symbols[i].parts[j].part +"&nbsp;" + res.retData.dict_result.symbols[i].parts[j].means+"<br>";
									}
								}
							}else{
								res_dst = "查询失败";
							}
								
						}
					}else{
						var res_dst = "翻译失败";
					}
					res = "<li class='right'>" + res_dst + "</li>";
					contentbox.innerHTML += res;
					scrollBtm();
                	console.log( "xhr请求成功："+xhr.responseText );
				} else {
                	console.log( "xhr请求失败："+xhr.status);
                }
                break;
            default :
                break;
        }
	}
	xhr.open( "GET", url );
	xhr.send();
}
function xhrResponseHeader() {
	if ( xhr ) {
		if ( xhr.readyState != 4 ) {
			console.log( "xhr请求未完成" );
		} else if ( xhr.status != 200 ) {
			console.log( "xhr请求失败："+xhr.readyState );
		} else {
			console.log( "xhr请求响应头数据：" );
			console.log( xhr.getAllResponseHeaders() );
		}
	} else {
		console.log( "未发送请求" );
	}
}
function changeType(input){
	if(input==''){
		return false;
	}else{
		switch (input){
			case '#1':
				//中--英
				from = 'zh';
				to = 'en';
				contentbox.innerHTML += "<li class='right'>已切换到中英翻译！</li>";
				break;
			case '#2':
				//中--日
				from = 'zh';
				to = 'jp';
				contentbox.innerHTML += "<li class='right'>已切换到中日翻译！</li>";
				break;
			case '#3':
				//中--韩
				from = 'zh';
				to = 'kor';
				contentbox.innerHTML += "<li class='right'>已切换到中韩翻译！</li>";
				break;
			case '#4':
				//中--粤语
				from = 'zh';
				to = 'yue';
				contentbox.innerHTML += "<li class='right'>已切换到中粤翻译！</li>";
				break;
			case '#5':
				//英--中
				from = 'en';
				to = 'zh';
				contentbox.innerHTML += "<li class='right'>已切换到英中翻译！</li>";
				break;
			case '#6':
				//日--中
				from = 'jp';
				to = 'zh';
				contentbox.innerHTML += "<li class='right'>已切换到日中翻译！</li>";
				break;
			case '#7':
				//韩--中
				from = 'kor';
				to = 'zh';
				contentbox.innerHTML += "<li class='right'>已切换到韩中翻译！</li>";
				break;
			case '#8':
				//粤语--中
				from = 'yue';
				to = 'zh';
				contentbox.innerHTML += "<li class='right'>已切换到粤中翻译！</li>";
				break;
			case '#':
				//当前互换
				var temp = to;
				to = from;
				from = temp;
				contentbox.innerHTML += "<li class='right'>翻译语言已互换！</li>";
				break;
			case '*':
				//切换到词典查询
				curr = curr=='translate'?'dict':'translate';
				baseurl = baseurl==url_tr?url_di:url_tr;
				from = 'en';
				to = 'zh';
				var txt = curr=='dict'?'已切换到词典查询，当前仅支持查询英文单词！':'已切换到语种翻译，当前为英中翻译！';
				contentbox.innerHTML += "<li class='right'>"+ txt +"</li>";
				break;
			default:
				//from = 'zh';
				//to = 'en';
				return false;
		}
		scrollBtm();
		return true;
	}
}
function scrollBtm(){
	var sc = document.getElementById("content");
	sc.scrollTop = sc.scrollHeight;
}