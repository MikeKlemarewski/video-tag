Tag = Backbone.Model.extend({
	defaults:{
		start:null,
		end:null
	},
	setStart: function(time){
		this.set({"start": time});
	},
	setEnd: function(time){
		this.set({"end": time});
	}
});

var TagList = Backbone.Collection.extend({
	model: Tag
});