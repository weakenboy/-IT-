let articleTypeArray=['推荐','前端','Android','后台','人工智能','iOS','工具资源','阅读','运维'],
	aritcleLogo=['web','android','back','ai','ios','toolResouce','read','runAndProtect'],
	navList=document.getElementById('navList');

/*给指定子元素添加样式，其他子元素去除样式*/
function selectOne(fatherDom,tag,target,className){
	let array=fatherDom.getElementsByTagName(tag);
	for(let i of array){
		i.classList.remove(className);
	}
	target.classList.add(className);
}
navList.addEventListener('click',function(e){
	selectOne(navList,'li',e.target,'active');
	let type=0;
	for(let i in navList.getElementsByTagName('li')){
		if(articleTypeArray[i]==e.target.innerText){
			type=i;
		}
	}
	if(type!=0)
		getNewOfType(type);
	else{
		getNewArticleAll()
	}
});

/*获取特定种类最新*/
function getNewOfType(type){
	let xhr=new XMLHttpRequest();
	xhr.open('post',xhrUrl+'/se52/note/findNewByCategories.do',true);
	xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhr.send("categorites_id="+type);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				showNewArticleAll(JSON.parse(xhr.responseText)['list']);
			}
		}
	}
}

/*获取所有最新*/
function getNewArticleAll(){
	let xhr=new XMLHttpRequest();
	xhr.open('post',xhrUrl+'/se52/note/newall.do',true);
	xhr.send(null);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				showNewArticleAll(JSON.parse(xhr.responseText)['list']);
			}
		}
	}
}
function showNewArticleAll(array){
	let str="";
	if(array.length==0){
		str=`<li id="noPost">暂时没有文章</li>`;
	}
	else{

			for(let i in array){
			if(array[i]['type']=="share"){
			str+=`<li>
						<a href="article.html?${array[i]['note_id']}">
							<p class="postTitle">${array[i]['note_title']}</p>
							<div class="postDescription">
								<span class=
								"tag ${aritcleLogo[array[i]['categories_id']-1]}">${articleTypeArray[array[i]['categories_id']]}</span>
								<a class="author">${array[i]['poster_name']}</a>
								<span class="postTime">${array[i]['create_time']}</span>
								<span class="pointNumber">${array[i]['visitor_number']}</span>
							</div>
						</a>
					</li>
			`
		}
	}
	
	}
	document.getElementById('postList').innerHTML=str;
}
getNewArticleAll();

~~(function getNewAnnouncement(){
	let xhr=new XMLHttpRequest();
	xhr.open('post',xhrUrl+'/se52/note/findByType.do',true);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.send('type=announcement');
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				let array=JSON.parse(xhr.responseText)['list'],
				i=array.length-1;
				getAnnouncementContent(array[i]['note_id'],array[i]['note_title']);
			}
		}
	}
})();
function getAnnouncementContent(note_id,title){
	let xhr=new XMLHttpRequest();
	xhr.open('post',xhrUrl+'/se52/viewNote.do',true);
	xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	xhr.send('noteId='+note_id);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				let str=JSON.parse(xhr.responseText)['content'].substr(0,JSON.parse(xhr.responseText)['content'].length-4),
					li=`
						<p class="noticeTitle">${title}</p>
						<div class="noticeBody">
							${str}
						</div>
					`;
				document.getElementById('notice').innerHTML=li;
			}
		}
	}
}
/*搜素*/
searchButton.addEventListener('click',function(){
	let searchValue=document.getElementById('searchNote').value;
	searchNote(searchValue);
});
function searchNote(value){
	let xhr=new XMLHttpRequest();
	xhr.open('post',xhrUrl+'/se52/note/findByTitle.do',true);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.send('note_title='+value);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				if(JSON.parse(xhr.responseText)['list']!=0)
				showNewArticleAll(JSON.parse(xhr.responseText)['list']);
				else{
					searchNoteByPoster(value);
				}
			}
		}
	}
}
function searchNoteByPoster(value){
	let xhr=new XMLHttpRequest();
	xhr.open('post',xhrUrl+'/se52/note/findByPosterName.do',true);
	xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
	xhr.send('user_name='+value);
	xhr.onreadystatechange=function(){
		if(xhr.readyState==4){
			if(xhr.status==200){
				showNewArticleAll(JSON.parse(xhr.responseText)['list']);
			}
		}
	}
}