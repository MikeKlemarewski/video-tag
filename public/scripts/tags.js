var timeMatch = /(\d+:\d+) \/ (\d+:\d+)/;
var bar = "<div id='hackDiv'><div id='tagMarker' style='background:red; height=20px; width=20px'></div></div>";
var tag;
var tagList;

var getTagPosition = function(){
	var pos = $("#leanback-video-id0_progress_bar_played").offset();
	alert(pos.top + " " + pos.width);
}

//Calculate width percentage based on time selected vs total video time
var getSelectionWidth = function(start, end, total){
	
	var startTimes        = start.split(":");	
	var endTimes          = end.split(":");
	var totalTimes        = total.split(":");
	var startSeconds      = 0;
	var endSeconds        = 0;
	var totalSeconds      = 0;
	var secondMultipliers = [1,60,3600];

	var i;
	for(i = 1; i <= startTimes.length ; ++i){
		startSeconds = startSeconds + parseInt(startTimes[startTimes.length - i], 10) * secondMultipliers[i-1];
	}

	for(i = 1; i <= endTimes.length ; ++i){
		endSeconds = endSeconds + parseInt(endTimes[endTimes.length - i], 10) * secondMultipliers[i-1];
	}

	for(i = 1; i <= totalTimes.length ; ++i){
		totalSeconds = totalSeconds + parseInt(totalTimes[totalTimes.length - i], 10) * secondMultipliers[i-1];
	}

	return Math.floor(((endSeconds - startSeconds) / totalSeconds) * 100);
}

var startTag = function(){

	var end   = tag.get("end");		
	var start = timeMatch.exec($("#leanback-video-id0_timer_control_inner").html())[1];

	$("#tagMarker").css('height', $("#leanback-video-id0_progress_bar_played").css('height'));
	$("#tagMarker").css('width', 3);

	var width  = $("#leanback-video-id0_progress_bar_played").css('width').replace('px','');
	var margin = $("#leanback-video-id0_progress_bar_played").css('margin-left').replace('px','');
	
	width  = parseInt(width, 10);
	margin = parseInt(margin, 10);
	width  = width + margin;
	$("#tagMarker").css('margin-left', width);

	if(end === null){
		tag.setStart(start);
		console.log("Start: " + tag.get("start") + " End is null: " + tag.get("end"));	
	}
	else{
		if(start <= end){
			tag.setStart(start);	
		}
		else{
			alert("start can't be past the end");
		}
	}
}

var endTag = function(){
	var start = tag.get("start");		
	var timer = timeMatch.exec($("#leanback-video-id0_timer_control_inner").html());
	var end   = timer[1];
	var total = timer[2];
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

	$("#startTagButton").click(startTag);
	$("#endTagButton").click(endTag);
	$("#clearTagButton").click(clearTag);
	$("#saveTagButton").click(saveTag);
	tag = new Tag;
	tagList = new TagList;

});
