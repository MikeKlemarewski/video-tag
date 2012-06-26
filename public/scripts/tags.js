var timeMatch = /(\d+:\d+) \/ (\d+:\d+)/;
var bar = "<div id='hackDiv'><div id='tagMarker' style='background:red; height=20px; width=20px'></div></div>";
var tag;

var getTagPosition = function(){
	var pos = $("#leanback-video-id0_progress_bar_played").offset();
	alert(pos.top + " " + pos.width);
}

var getSelectionWidth = function(start, end, total){
	var startTimes = start.split(":");	
	var endTimes = end.split(":");
	var totalTimes = total.split(":");
	var startSeconds = 0;
	var endSeconds = 0;
	var totalSeconds = 0;

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
	var end = tag.get("end");		
	var start = timeMatch.exec($("#leanback-video-id0_timer_control_inner").html())[1];



	$(bar).insertAfter($("#leanback-video-id0_progress_bar_bg"));
	$("#hackDiv").css('width', $("#leanback-video-id0_progress_control").css('width'));
	$("#hackDiv").css('height', $("#leanback-video-id0_progress_control").css('height'));
	$("#hackDiv").css('margin', $("#leanback-video-id0_progress_control").css('margin'));
	$("#hackDiv").css('position', 'absolute');
	$("#tagMarker").css('height', $("#leanback-video-id0_progress_bar_played").css('height'));
	$("#tagMarker").css('margin', $("#leanback-video-id0_progress_bar_played").css('margin'));

	var width = $("#leanback-video-id0_progress_bar_played").css('width').replace('px','');
	var margin = $("#leanback-video-id0_progress_bar_played").css('margin-left').replace('px','');
	width = parseInt(width, 10);
	margin = parseInt(margin, 10);

	width = width + margin;
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
	var end = timer[1];
	var total = timer[2];
	var width = getSelectionWidth(start, end, total);
	console.log(width + "%");
	$("#tagMarker").css('width', width + "%");
	tag.setEnd(end);
//	alert("Start: " + tag.get("start") + " End: " + tag.get("end"));
}

$(document).ready(function(){

	$("#startTagButton").click(startTag);
	$("#endTagButton").click(endTag);
	tag = new Tag;

});
