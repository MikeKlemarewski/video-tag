/*
	I wrapped the marker div inside the 'hackDiv' in order to have
	the highlighted selection appear overtop of the progress bar
*/
var bar = "<div id='hackDiv'><div id='tagMarker' style='background:red; height=20px; width=20px'></div></div>";
var tag;
var tagList;
var draggable = false;

var getTagPosition = function(){
	var pos = $("#leanback-video-id0_progress_bar_played").offset();
	alert(pos.top + " " + pos.width);
}

var toggleDrag = function(){
	var button = $("#dragButton");
	if(draggable){
		draggable = false;
		button.html('Enable Drag Selection');
	}
	else{
		draggable = true;
		button.html('Disable Drag Selection');
	}
}

var timeToSeconds = function(time){
	var times             = time.split(":");	
	var secondMultipliers = [1,60,3600];
	var seconds = 0;

	var i;
	for(i = 1; i <= times.length ; ++i){
		seconds = seconds + parseInt(times[times.length - i], 10) * secondMultipliers[i-1];
	}
	return seconds;
}

//Calculate width percentage based on time selected vs total video time
var getSelectionWidth = function(start, end, total){
	
	var startSeconds      = timeToSeconds(start);
	var endSeconds        = timeToSeconds(end);
	var totalSeconds      = timeToSeconds(total);

	return Math.floor(((endSeconds - startSeconds) / totalSeconds) * 100);
}

var startTag = function(action){
	var timeMatch = /(\d+:\d+)/g;
	var totalTimeMatch = /(\d+:\d+) \/ (\d+:\d+)/g;
	
	var time;
	if(action==='drag'){
		time = timeMatch.exec($("#leanback-video-id0_progress_bar_time_txt").html())[1];
	}
	else{
		time = timeMatch.exec($("#leanback-video-id0_timer_control_inner").html())[1];
	}
	var start = timeToSeconds(time);
	var total = totalTimeMatch.exec($("#leanback-video-id0_timer_control_inner").html())[2];
	total = timeToSeconds(total);
	var percent = start / total;

	var width  = $("#leanback-video-id0_progress_bar_bg").css('width').replace('px','');
	var margin = $("#leanback-video-id0_progress_bar_played").css('margin-left').replace('px','');
	var end   = tag.get("end");		

	width  = parseInt(width, 10);
	margin = parseInt(margin, 10);
	margin = margin + (width * percent);
	$("#tagMarker").css('margin-left', margin);

	$("#tagMarker").css('height', $("#leanback-video-id0_progress_bar_played").css('height'));
	$("#tagMarker").css('width', 3);

	if(end === null){
		tag.setStart(time);
		console.log("Start: " + tag.get("start") + " End is null: " + tag.get("end"));	
	}
	else{
		if(start <= end){
			tag.setStart(time);	
		}
		else{
			alert("start can't be past the end");
		}
	}
}

var endTag = function(action){
	var timeMatch = /(\d+:\d+)/g;
	var totalTimeMatch = /(\d+:\d+) \/ (\d+:\d+)/g;
	var start = tag.get("start");
	var end;
	if(action==='drag'){
		end = timeMatch.exec($("#leanback-video-id0_progress_bar_time_txt").html())[1];
	}
	else{
		end = timeMatch.exec($("#leanback-video-id0_timer_control_inner").html())[1];
	}	
	var total = totalTimeMatch.exec($("#leanback-video-id0_timer_control_inner").html())[2];
	var width = getSelectionWidth(start, end, total);
	$("#tagMarker").css('width', width + "%");
	tag.setEnd(end);
}

var clearTag = function(){
	$("#tagMarker").css('height', 0);
	$("#tagMarker").css('width', 0);
	tag.setStart(null);
	tag.setEnd(null);
	console.log("Start: " + tag.get("start") + " End is null: " + tag.get("end"));	
}

//Inserts divs that hold and display tag marker
var injectTag = function(){

	$(bar).insertAfter($("#leanback-video-id0_progress_bar_bg"));
	$("#hackDiv").css('width', $("#leanback-video-id0_progress_control").css('width'));
	$("#hackDiv").css('height', $("#leanback-video-id0_progress_control").css('height'));
	$("#hackDiv").css('margin', $("#leanback-video-id0_progress_control").css('margin'));
	$("#hackDiv").css('position', 'absolute');

	$("#tagMarker").css('margin', $("#leanback-video-id0_progress_bar_played").css('margin'));
}

var updateTagList = function(tag){
	$("#tagList").append("<li>" + tag.get("start") + " " + tag.get("end") +"</li>");
}

var saveTag = function(){
	tagList.add(tag);
	updateTagList(tag);
	tag = new Tag;
	clearTag();
}

$(document).ready(function(){

	$("#clearTagButton").click(clearTag);
	$("#saveTagButton").click(saveTag);
	$("#dragButton").click(toggleDrag);
	tag = new Tag;
	tagList = new TagList;

});

$(document).mousedown(function(e){
	switch(e.target['id']){
		case 'leanback-video-id0_progress_bar_time_line':
			if(draggable){
				startTag('drag');
			}
			break;
	}
});

$(document).mouseup(function(e){
	switch(e.target['id']){
		case 'leanback-video-id0_progress_bar_time_line':
			if(draggable){
				endTag('drag');
			}
			break;
	}
});

