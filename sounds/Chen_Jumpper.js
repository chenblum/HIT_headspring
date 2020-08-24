(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"Chen_Jumpper_atlas_1", frames: [[1330,713,42,23],[2005,287,8,4],[0,956,2041,110],[83,1185,70,158],[155,1185,70,158],[227,1185,70,158],[299,1185,70,158],[246,0,1245,153],[597,362,313,349],[1493,0,519,115],[912,362,313,349],[0,1068,519,115],[1227,362,313,349],[521,1068,519,115],[246,362,349,313],[1042,1068,519,115],[1902,287,101,65],[0,0,244,954],[1872,748,126,159],[246,713,540,159],[788,713,540,159],[1330,748,540,159],[1542,362,476,191],[1542,555,476,191],[246,155,826,205],[1074,155,826,205],[1662,1068,91,168],[2000,748,39,168],[1936,1068,82,168],[1755,1068,89,168],[2008,117,35,168],[1563,1068,97,168],[0,1185,81,168],[1846,1068,88,168],[1902,117,104,168]]},
		{name:"Chen_Jumpper_atlas_2", frames: [[0,1527,2044,116],[0,1327,1240,198],[1217,0,336,964],[813,307,244,954],[1555,0,244,954],[1801,0,244,954],[0,966,811,359],[0,307,811,359],[0,0,1215,305]]},
		{name:"Chen_Jumpper_atlas_3", frames: [[0,1062,656,701],[972,531,772,572],[0,0,970,529],[658,1105,1042,378],[972,0,970,529],[0,531,970,529],[658,1485,1042,378]]},
		{name:"Chen_Jumpper_atlas_4", frames: [[0,0,1848,937],[0,939,1797,937]]}
];


(lib.AnMovieClip = function(){
	this.actionFrames = [];
	this.currentSoundStreamInMovieclip;
	this.soundStreamDuration = new Map();
	this.streamSoundSymbolsList = [];

	this.gotoAndPlayForStreamSoundSync = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.gotoAndPlay = function(positionOrLabel){
		this.clearAllSoundStreams();
		var pos = this.timeline.resolve(positionOrLabel);
		if (pos != null) { this.startStreamSoundsForTargetedFrame(pos); }
		cjs.MovieClip.prototype.gotoAndPlay.call(this,positionOrLabel);
	}
	this.play = function(){
		this.clearAllSoundStreams();
		this.startStreamSoundsForTargetedFrame(this.currentFrame);
		cjs.MovieClip.prototype.play.call(this);
	}
	this.gotoAndStop = function(positionOrLabel){
		cjs.MovieClip.prototype.gotoAndStop.call(this,positionOrLabel);
		this.clearAllSoundStreams();
	}
	this.stop = function(){
		cjs.MovieClip.prototype.stop.call(this);
		this.clearAllSoundStreams();
	}
	this.startStreamSoundsForTargetedFrame = function(targetFrame){
		for(var index=0; index<this.streamSoundSymbolsList.length; index++){
			if(index <= targetFrame && this.streamSoundSymbolsList[index] != undefined){
				for(var i=0; i<this.streamSoundSymbolsList[index].length; i++){
					var sound = this.streamSoundSymbolsList[index][i];
					if(sound.endFrame > targetFrame){
						var targetPosition = Math.abs((((targetFrame - sound.startFrame)/lib.properties.fps) * 1000));
						var instance = playSound(sound.id);
						var remainingLoop = 0;
						if(sound.offset){
							targetPosition = targetPosition + sound.offset;
						}
						else if(sound.loop > 1){
							var loop = targetPosition /instance.duration;
							remainingLoop = Math.floor(sound.loop - loop);
							if(targetPosition == 0){ remainingLoop -= 1; }
							targetPosition = targetPosition % instance.duration;
						}
						instance.loop = remainingLoop;
						instance.position = Math.round(targetPosition);
						this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop , sound.offset);
					}
				}
			}
		}
	}
	this.InsertIntoSoundStreamData = function(soundInstance, startIndex, endIndex, loopValue, offsetValue){ 
 		this.soundStreamDuration.set({instance:soundInstance}, {start: startIndex, end:endIndex, loop:loopValue, offset:offsetValue});
	}
	this.clearAllSoundStreams = function(){
		this.soundStreamDuration.forEach(function(value,key){
			key.instance.stop();
		});
 		this.soundStreamDuration.clear();
		this.currentSoundStreamInMovieclip = undefined;
	}
	this.stopSoundStreams = function(currentFrame){
		if(this.soundStreamDuration.size > 0){
			var _this = this;
			this.soundStreamDuration.forEach(function(value,key,arr){
				if((value.end) == currentFrame){
					key.instance.stop();
					if(_this.currentSoundStreamInMovieclip == key) { _this.currentSoundStreamInMovieclip = undefined; }
					arr.delete(key);
				}
			});
		}
	}

	this.computeCurrentSoundStreamInstance = function(currentFrame){
		if(this.currentSoundStreamInMovieclip == undefined){
			var _this = this;
			if(this.soundStreamDuration.size > 0){
				var maxDuration = 0;
				this.soundStreamDuration.forEach(function(value,key){
					if(value.end > maxDuration){
						maxDuration = value.end;
						_this.currentSoundStreamInMovieclip = key;
					}
				});
			}
		}
	}
	this.getDesiredFrame = function(currentFrame, calculatedDesiredFrame){
		for(var frameIndex in this.actionFrames){
			if((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)){
				return frameIndex;
			}
		}
		return calculatedDesiredFrame;
	}

	this.syncStreamSounds = function(){
		this.stopSoundStreams(this.currentFrame);
		this.computeCurrentSoundStreamInstance(this.currentFrame);
		if(this.currentSoundStreamInMovieclip != undefined){
			var soundInstance = this.currentSoundStreamInMovieclip.instance;
			if(soundInstance.position != 0){
				var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
				var soundPosition = (soundValue.offset?(soundInstance.position - soundValue.offset): soundInstance.position);
				var calculatedDesiredFrame = (soundValue.start)+((soundPosition/1000) * lib.properties.fps);
				if(soundValue.loop > 1){
					calculatedDesiredFrame +=(((((soundValue.loop - soundInstance.loop -1)*soundInstance.duration)) / 1000) * lib.properties.fps);
				}
				calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
				var deltaFrame = calculatedDesiredFrame - this.currentFrame;
				if(deltaFrame >= 2){
					this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame,calculatedDesiredFrame));
				}
			}
		}
	}
}).prototype = p = new cjs.MovieClip();
// symbols:



(lib.CachedBmp_221 = function() {
	this.initialize(img.CachedBmp_221);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,6147,44);


(lib.CachedBmp_320 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_219 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_319 = function() {
	this.initialize(img.CachedBmp_319);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2140,414);


(lib.CachedBmp_318 = function() {
	this.initialize(img.CachedBmp_318);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2738,491);


(lib.CachedBmp_317 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_316 = function() {
	this.initialize(img.CachedBmp_316);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,4424,1836);


(lib.CachedBmp_315 = function() {
	this.initialize(img.CachedBmp_315);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2580,163);


(lib.CachedBmp_199 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_217 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_191 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_314 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_313 = function() {
	this.initialize(img.CachedBmp_313);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,6831,2034);


(lib.CachedBmp_194 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_312 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_311 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_49 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_48 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_47 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_46 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_45 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_44 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_43 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_42 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_41 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_310 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_309 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_38 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_308 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_307 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_306 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_305 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_304 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_3"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_303 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_3"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_302 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_301 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_300 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_299 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_298 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_2"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_297 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_2"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_25 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(22);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_22 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_4"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_21 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(23);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_296 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_3"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_295 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_3"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_294 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_3"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_293 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_2"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_16 = function() {
	this.initialize(img.CachedBmp_16);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2508,281);


(lib.CachedBmp_292 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(24);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_291 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(25);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_13 = function() {
	this.initialize(img.CachedBmp_13);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,3682,398);


(lib.CachedBmp_290 = function() {
	this.initialize(img.CachedBmp_290);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,6519,775);


(lib.CachedBmp_289 = function() {
	this.initialize(img.CachedBmp_289);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,6519,679);


(lib.CachedBmp_288 = function() {
	this.initialize(img.CachedBmp_288);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,6519,681);


(lib.CachedBmp_9 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(26);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_8 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(27);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(28);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_6 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(29);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(30);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(31);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(32);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(33);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(ss["Chen_Jumpper_atlas_1"]);
	this.gotoAndStop(34);
}).prototype = p = new cjs.Sprite();
// helper functions:

function mc_symbol_clone() {
	var clone = this._cloneProps(new this.constructor(this.mode, this.startPosition, this.loop, this.reversed));
	clone.gotoAndStop(this.currentFrame);
	clone.paused = this.paused;
	clone.framerate = this.framerate;
	return clone;
}

function getMCSymbolPrototype(symbol, nominalBounds, frameBounds) {
	var prototype = cjs.extend(symbol, cjs.MovieClip);
	prototype.clone = mc_symbol_clone;
	prototype.nominalBounds = nominalBounds;
	prototype.frameBounds = frameBounds;
	return prototype;
	}


(lib.מסלולai = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// מסלול_ai
	this.instance = new lib.CachedBmp_221();
	this.instance.setTransform(0,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,3073.5,22);


(lib.swm1Rh = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FFFFFF").ss(0.8).p("ABL1nQAoABAVAVQAUATAkBHQAvBcgKDOQgEBagYCuQgIA+gWDKIgVC+QAHAuAFBAQALCAgHBeQgJB1geEIQgfENgJAoQgJAmgDCrQgDC6gDAWQgDAbAHAsQAGAmgFAOQgLAbgZAbQgYAagNgDQgVgFAPgQQAYgcAEgSQAGgbgRgaQgWgjgFgYQgFgcgVikQgaiognhXQg8iEgfipQgojdAbjXQAXi3gIgyQgCgOgGgeQgFgiACg/QAChNgJhrQgEg8gKh4QgNjZAziuQA1i2BwhBQA2ggAtAEg");
	this.shape.setTransform(23.0807,138.4683);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#EBC29D").s().p("AABVoQgVgFAPgQQAYgcAEgSQAGgbgRgaQgWgjgFgYQgFgcgVikQgaiognhXQg8iEgfipQgojdAbjXQAXi3gIgyIgIgsQgFgiACg/QAChNgJhrIgOi0QgNjZAziuQA1i2BwhBQA2ggAtAEQAoABAVAVQAUATAkBHQAvBcgKDOQgEBagYCuQgIA+gWDKIgVC+QAHAuAFBAQALCAgHBeQgJB1geEIQgfENgJAoQgJAmgDCrQgDC6gDAWQgDAbAHAsQAGAmgFAOQgLAbgZAbQgWAYgNAAIgCgBg");
	this.shape_1.setTransform(23.0807,138.4683);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1,-1,48.2,279);


(lib.Path_160 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_160, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_159 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_159, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_158 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_158, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_157 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_157, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_156 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_156, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_155 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_155, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_154 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_154, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_153 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_153, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_152 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_152, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_151 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_151, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_150 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_150, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_149 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_149, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_148 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_148, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_147 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_147, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_146 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_146, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_145 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_145, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_144 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_144, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_143 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_143, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_142 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_142, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_141 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_141, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_140 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_140, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_139 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_139, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_138 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_138, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_137 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_137, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_136 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_136, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_135 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_135, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_134 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_134, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_133 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_133, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_132 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQg/AAguhlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_132, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_131 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_131, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_130 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_130, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_129 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQg/AAguhlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_129, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_128 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_128, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_127 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_127, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_126 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQg/AAguhlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_126, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_125 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_125, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_124 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_124, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_123 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQg/AAguhlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_123, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_122 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_122, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_121 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_121, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_120 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_120, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_119 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_119, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_118 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQg/AAguhlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_118, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_117 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_117, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_116 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_116, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_115 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_115, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_114 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_114, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_113 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_113, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_112 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_112, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_111 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_111, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_110 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_110, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_109 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_109, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_108 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_108, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_107 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_107, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_106 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_106, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_105 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_105, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_104 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_104, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_103 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_103, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_102 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_102, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_101 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_101, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_100 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_100, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_99 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_99, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_98 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_98, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_97 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_97, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_96 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_96, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_95 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_95, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_94 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_94, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_93 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_93, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_92 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_92, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_91 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_91, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_90 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_90, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_89 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_89, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_88 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_88, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_87 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_87, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_86 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_86, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_85 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_85, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_84 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQg/AAguhlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_84, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_83 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_83, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_82 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_82, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_81 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQg/AAguhlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_81, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_80 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_80, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_79 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_79, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_78 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQg/AAguhlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_78, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_77 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_77, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_76 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_76, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_75 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQg/AAguhlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_75, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_74 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_74, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_73 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_73, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_72 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_72, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_71 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_71, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_70 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQg/AAguhlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_70, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_69 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_69, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_68 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_68, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_67 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_67, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_66 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_66, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_65 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_65, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_64 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_64, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_63 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_63, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_62 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_62, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_61 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_61, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_60 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_60, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_59 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_59, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_58 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_58, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_57 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_57, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_56 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_56, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_55 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_55, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_54 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_54, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_53 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_53, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_52 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_52, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_51 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_51, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_50 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_50, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_49 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_49, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_48 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_48, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_47 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_47, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_46 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_46, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_45 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_45, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_44 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_44, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_43 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_43, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_42 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_42, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_41 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_41, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_40 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_40, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_39 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_39, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_38 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_38, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_37 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_37, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_36 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_36, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_35 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_35, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_34 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBlQguBmhBAAQhAAAgthmg");
	this.shape.setTransform(15.625,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_34, new cjs.Rectangle(0,0,31.3,69.4), null);


(lib.Path_33 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#414E59").s().p("AhtD1QguhlAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBlQgtBmhBAAQg/AAguhmg");
	this.shape.setTransform(15.6,34.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_33, new cjs.Rectangle(0,0,31.2,69.4), null);


(lib.Path_32 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_32, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_31 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQg/AAguhlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_31, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_30 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_30, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_29 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_29, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_28 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_28, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_27 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQg/AAguhlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_27, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_26 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_26, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_25 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_25, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_24 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_24, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_23 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_23, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_22 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_22, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_21 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_21, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_20 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_20, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_19 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_19, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_18 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_18, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_17 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_17, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_16 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_16, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_15 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_15, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_14 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQg/AAguhlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_14, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_13 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_13, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_12 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_12, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_11 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#AAA29B").s().p("EhPlAMoIAA5PQEeDGEcCRQHaDwJhCyUAazAH3ApvAAAQVOAARPh8QOyhpLljDIAAMHg");
	this.shape.setTransform(509.425,80.8);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_11, new cjs.Rectangle(0,0,1018.9,161.6), null);


(lib.Path_10 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#AAA29B").s().p("Ehh4AMoIAA5PQEsDGErCRQHxDwJ/CyUAcIAH3ArzAAAUAsiAAAAbHgHlQQhkoIlnDIAAYvg");
	this.shape.setTransform(626.525,80.8);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_10, new cjs.Rectangle(0,0,1253.1,161.6), null);


(lib.Path_9_0 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8ED8F8").s().p("EgGQA7pMAMhh3RIAAOaMgLBBo3g");
	this.shape.setTransform(40.1,381.7);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_9_0, new cjs.Rectangle(0,0,80.2,763.4), null);


(lib.Path_9 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQg/AAguhlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_9, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_8_0 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FACAB2").s().p("AAvAiQgUgNgNgCQgOgCgFgCQgcgIgUgPIgWgRQgNgLgHgMIAAgDQAAAAABAAQAAAAAAAAQAAgBAAABQABAAAAAAIAPAQQAIAKAHADIAXAMQAYALAeABQAKAAAJAEQAHAEALAJIAWAPQAOAJAIAHQAAAAABAAQAAABAAAAQAAAAgBABQAAAAgBAAIgBAAQgSAAgcgSg");
	this.shape.setTransform(9.6193,5.2075);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_8_0, new cjs.Rectangle(0,0,19.2,10.5), null);


(lib.Path_8 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_8, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_7 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQg/AAguhlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_7, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_6, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_5_0 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FACAB2").s().p("ABjA+QgNgHgegCQgcgDgPgIQgQgUgNgLQgYgYgDARQgCAMAZAfIABACIAAABQgagIgVgHQg8gjgRgLQAKgBAQAEQAMACAeAPQgWgMgUgRQgogkAIgbQADgHACgBQAHAUAaAVQAUAQAQAIQAHADAMgBQATgCAMAIQAHADASATQAWAYAdAIQAoAJAsAcIAQATQgdgUgXgKg");
	this.shape.setTransform(15.0833,9.2);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_5_0, new cjs.Rectangle(0,0,30.2,18.4), null);


(lib.Path_5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQg/AAguhlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_5, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_4, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_3_0 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#FACAB2").s().p("AAvAiQgUgNgNgCIgTgEQgcgIgUgPIgWgRQgNgLgGgMIAAgDQAAAAAAAAQAAAAAAAAQAAAAABAAQAAAAAAAAIAPAQQAJAKAHADIAWAMQAYALAeABQALAAAIAEQAHAEALAJIAWAPQAPAJAHAHQAAAAABAAQAAABAAAAQgBAAAAABQAAAAAAAAIgCAAQgRAAgdgSg");
	this.shape.setTransform(9.5825,5.2192);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_3_0, new cjs.Rectangle(0,0,19.2,10.5), null);


(lib.Path_3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQg/AAguhlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_3, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAuhmA/AAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQg/AAguhlg");
	this.shape.setTransform(15.6,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_2, new cjs.Rectangle(0,0,31.2,69.5), null);


(lib.Path_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_1, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path_0 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAtBmQAuBlAACPQAACQguBmQgtBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path_0, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Path = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#344149").s().p("AhtD2QguhmAAiQQAAiPAuhlQAthmBAAAQBBAAAuBmQAtBlAACPQAACQgtBmQguBlhBAAQhAAAgthlg");
	this.shape.setTransform(15.625,34.725);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Path, new cjs.Rectangle(0,0,31.3,69.5), null);


(lib.Group_241 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AGUA8Qg4gNhrggQhtgfgzgMQi2gqi+A3QiRAvhJARQh7AchcgYQBZgIBTgYQAVgHBwgmQCng7C+ABQCAABBlAWQA8AOBhAkQBgAjA+AOQBlAXCBAAIANAAQg+AUhMAAQhTAAhkgXg");
	this.shape.setTransform(72.5,8.2697);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_241, new cjs.Rectangle(0,0,145,16.6), null);


(lib.Group_240 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AFkAvQjAgxhdgTQihghinAqQh/AlhAANQhsAWhSgTQBPgGBHgTIB2giQCTguCnABQBxAABZASQA1AKBWAdQBVAbA2AKQBZASBzABIALgBQg3APhDAAQhJAAhYgRg");
	this.shape.setTransform(63.9,6.4314);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_240, new cjs.Rectangle(0,0,127.8,12.9), null);


(lib.Group_238 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AGUA8Qg3gNhsggQhtgfgzgMQhdgWhdAEQhaADhgAcQiRAvhIARQh7AchdgYQBagIBRgYQAXgHBvgmQCng7C9ABQCBABBkAWQA9AOBhAkQBhAjA8AOQBmAXCBAAIANAAQg+AUhMAAQhTAAhkgXg");
	this.shape.setTransform(72.475,8.2697);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_238, new cjs.Rectangle(0,0,145,16.6), null);


(lib.Group_237 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AFlAvQjBgxhdgTQihgiinArQiAAlg/ANQhsAWhSgTQBPgGBHgTIB2giQCTguCnABQBxAABZASQA1AKBWAdQBWAbA1AKQBaASByABIALgBQg3APhDAAQhJAAhXgRg");
	this.shape.setTransform(63.925,6.4314);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_237, new cjs.Rectangle(0,0,127.9,12.9), null);


(lib.Group_236 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AGUA8Qg4gNhrggQhtgfgzgMQi2gqi+A3QiRAvhJARQh7AchcgYQBZgIBTgYQAVgHBwgmQCng7C+ABQCAABBlAWQA8AOBhAkQBgAjA+AOQBlAXCBAAIANAAQg+AUhMAAQhTAAhkgXg");
	this.shape.setTransform(72.5,8.2697);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_236, new cjs.Rectangle(0,0,145,16.6), null);


(lib.Group_235 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AGUA8Qg3gNhsggQhtgfgzgMQhdgWhdAEQhaADhgAcQiRAvhIARQh7AchdgYQBagIBRgYQAXgHBvgmQCng7C9ABQCBABBkAWQA9AOBhAkQBhAjA8AOQBmAXCBAAIANAAQg+AUhMAAQhTAAhkgXg");
	this.shape.setTransform(72.475,8.2697);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_235, new cjs.Rectangle(0,0,145,16.6), null);


(lib.Group_95 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AK0BjQhegVi0g0Qi2g0hWgUQidgkieAGQicAFinAtQkABOh9AcQjXAvibgoQCagOCQgnQAngKDEhAQCOguBzgVQChgcDHAAQDbABCqAlQBlAXChA7QChA7BnAWQCqAlDeABIAWAAQhtAgiCAAQiOAAinglg");
	this.shape.setTransform(123.975,13.596);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_95, new cjs.Rectangle(0,0,248,27.2), null);


(lib.Group_94 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AESAoQiSgqhGgQQh6gciDAkQhjAfgyALQhUAUg+gRQBNgHCEgsQBzgnCAABQBXAABDAPQApAJBAAYQBBAXAoAKQBEAPBYAAIAJAAQgrANgzAAQg4AAhDgPg");
	this.shape.setTransform(49.075,5.5198);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_94, new cjs.Rectangle(0,0,98.2,11.1), null);


(lib.Group_93 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("ACpAhQhcgigrgNQhNgXhPAeQg7AagfAKQgyAQgngNQAvgGBPglQBFghBPAAQBQAABRAoQBSAnBRAAIAFgBQgaALghAAQgiAAgogMg");
	this.shape.setTransform(30.2,4.5253);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_93, new cjs.Rectangle(0,0,60.4,9.1), null);


(lib.Group_92 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("ACpAhQhcgigrgNQhOgYhOAgQg8AagdAJQgzAQgngNQAvgGBPglQBFghBPAAQBQAABRAoQBSAnBRAAIAFAAQgaAKggAAQgiAAgpgMg");
	this.shape.setTransform(30.2,4.5444);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_92, new cjs.Rectangle(0,0,60.4,9.1), null);


(lib.Group_91 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AD1AgQiHghhBgNQhvgXhyAdQhWAZgqAJQhJAPg6gNQBEgFBygjQBjggByABQB1AAB5AnQB4AmB2AAIAIAAQglAKguAAQgyAAg+gMg");
	this.shape.setTransform(44,4.4882);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_91, new cjs.Rectangle(0,0.1,88,8.9), null);


(lib.Group_90 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AD1AwQiEgyhBgTQhvgihyAtQhYAmgqAOQhLAXg5gTQA2gHAygUQANgFBDgfQBkgwB0AAQBOAAA9ASQAlALA7AdQA7AcAlALQA+ASBOAAIAIAAQgmAQgvAAQgyAAg8gSg");
	this.shape.setTransform(43.95,6.5882);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_90, new cjs.Rectangle(0,0,87.9,13.2), null);


(lib.Group_89 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AEMAjQiVgkhHgPQh8gZh5AgQhdAbgvAKQhPARg/gPQBKgGB6gmQBqgiB+AAQB/ABCFAqQCGAqCBAAIAIAAQgoAMgyAAQg3AAhDgOg");
	this.shape.setTransform(48,4.8632);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_89, new cjs.Rectangle(0,0,96,9.8), null);


(lib.Group_88 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AEWAmQicgnhLgQQiBgbh9AjQhfAdgwALQhRAShCgQQBNgGB8gqQBtglCCABQCEAACMAuQCNAtCGAAIAIAAQgpAMg0AAQg5AAhGgOg");
	this.shape.setTransform(49.825,5.2381);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_88, new cjs.Rectangle(0,0,99.7,10.5), null);


(lib.Group_87 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AF0AzQg0gLhhgaQhjgbgvgKQingkivAuQiIAohCAOQhyAZhUgVQBSgHBMgUQAVgGBoggQCbgyCuABQB2ABBcATQA3ALBYAfQBYAeA3ALQBcATB4ABIALAAQg6AQhGAAQhMAAhagTg");
	this.shape.setTransform(66.625,6.9939);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_87, new cjs.Rectangle(0,0,133.3,14), null);


(lib.Group_79 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AK0BjQhegVi0g0Qi1g0hXgUQidgkifAGQibAFinAtQkABOh9AcQjXAvibgoQCagOCPgnQAogKDEhAQCOguBzgVQCigcDGAAQDcABCpAlQBlAXChA7QChA7BmAWQCrAlDeABIAVAAQhsAgiDAAQiNAAinglg");
	this.shape.setTransform(123.95,13.596);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_79, new cjs.Rectangle(0,0,247.9,27.2), null);


(lib.Group_78 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AESAoQiRgqhHgQQh6gciCAkQhkAfgxALQhUAUg/gRQBNgHCEgsQBzgnCBABQBWAABEAPQAoAJBBAYQCBAwCDAAIAJAAQgrANgzAAQg4AAhDgPg");
	this.shape.setTransform(49.075,5.5198);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_78, new cjs.Rectangle(0,0,98.2,11.1), null);


(lib.Group_77 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("ACoAhQhbgigsgNQhMgYhOAfQg8AageAKQgzAQgngNQAvgGBPglQBFghBPAAQBRAABRAoQBRAnBRAAIAFgBQgaALghAAQgiAAgpgMg");
	this.shape.setTransform(30.225,4.5253);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_77, new cjs.Rectangle(0,0,60.5,9.1), null);


(lib.Group_76 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("ACoAhQhbgigsgNQhMgYhOAgQg8AageAJQgzAQgngNQAvgGBPglQBFghBPAAQBRAABRAoQBRAnBRAAIAFAAQgaAKggAAQgiAAgqgMg");
	this.shape.setTransform(30.225,4.5444);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_76, new cjs.Rectangle(0,0,60.5,9.1), null);


(lib.Group_75 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AD2AgQiHghhBgNQhwgXhxAdQhXAZgqAJQhKAPg5gNQBEgFBygjQBjggByABQB2AAB4AnQB5AmB1AAIAIAAQglAKguAAQgyAAg9gMg");
	this.shape.setTransform(44,4.4882);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_75, new cjs.Rectangle(0,0.1,88,8.9), null);


(lib.Group_74 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AD1AwQiEgyhBgTQg4gSg4ADQg4ADg5AXQhXAmgsAOQhKAXg5gTQA3gHAwgUQANgFBEgfQBkgwBzAAQBOAAA+ASQAkALA8AdQA6AcAlALQA+ASBPAAIAIAAQgnAQguAAQgyAAg8gSg");
	this.shape.setTransform(43.95,6.5882);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_74, new cjs.Rectangle(0,0,87.9,13.2), null);


(lib.Group_73 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AEMAjQiVgkhIgPQh7gZh6AgQhdAbguAKQhPARg/gPQBKgGB6gmQBrgiB8AAQCAABCFAqQCGAqCBAAIAIAAQgoAMgyAAQg3AAhDgOg");
	this.shape.setTransform(48,4.8632);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_73, new cjs.Rectangle(0,0,96,9.8), null);


(lib.Group_72 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AEWAmQidgnhKgQQiBgbh+AjQheAdgwALQhRAShDgQQBOgGB8gqQBsglCDABQCEAACMAuQCNAtCGAAIAJAAQgpAMg1AAQg5AAhGgOg");
	this.shape.setTransform(49.85,5.2381);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_72, new cjs.Rectangle(0,0,99.7,10.5), null);


(lib.Group_71 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AFzAzQgygLhigaQhjgbgvgKQingkiwAuQiHAohCAOQhyAZhVgVQBTgHBMgUQAVgGBnggQCcgyCuABQB2ABBbATQA4ALBXAfQBZAeA3ALQBcATB4ABIALAAQg6AQhGAAQhMAAhbgTg");
	this.shape.setTransform(66.65,6.9939);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_71, new cjs.Rectangle(0,0,133.3,14), null);


(lib.Group_69 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AGUA8Qg3gNhsggQhtgfgzgMQhdgWhdAEQhaADhgAcQiRAvhIARQh7AchdgYQBagIBRgYQAXgHBvgmQCng7C9ABQCBABBkAWQA9AOBhAkQBhAjA8AOQBmAXCBAAIANAAQg+AUhMAAQhTAAhkgXg");
	this.shape.setTransform(72.475,8.2697);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_69, new cjs.Rectangle(0,0,145,16.6), null);


(lib.Group_68 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AFlAvQjBgxhdgTQihgiinArQiAAlg/ANQhsAWhSgTQBPgGBHgTIB2giQCTguCnABQBxAABZASQA1AKBWAdQBWAbA1AKQBaASByABIALgBQg3APhDAAQhJAAhXgRg");
	this.shape.setTransform(63.925,6.4314);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_68, new cjs.Rectangle(0,0,127.9,12.9), null);


(lib.Group_67 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AGUA8Qg3gNhsggQhtgfgzgMQhdgWhdAEQhaADhgAcQiRAvhIARQh7AchdgYQBagIBRgYQAXgHBvgmQCng7C9ABQCBABBkAWQA9AOBhAkQBhAjA8AOQBmAXCBAAIANAAQg+AUhMAAQhTAAhkgXg");
	this.shape.setTransform(72.475,8.2697);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_67, new cjs.Rectangle(0,0,145,16.6), null);


(lib.Group_6 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AK0BjQhegVi0g0Qi1g0hXgUQidgkifAGQibAFinAtQkABOh9AcQjXAvibgoQCagOCPgnQAogKDEhAQCOguBzgVQCigcDGAAQDcABCpAlQBlAXChA7QChA7BmAWQCrAlDeABIAVAAQhsAgiDAAQiNAAinglg");
	this.shape.setTransform(123.95,13.596);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_6, new cjs.Rectangle(0,0,247.9,27.2), null);


(lib.Group_5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AESAoQiRgqhHgQQh6gciCAkQhkAfgxALQhUAUg/gRQBNgHCEgsQBzgnCBABQBWAABEAPQAoAJBBAYQCBAwCDAAIAJAAQgrANgzAAQg4AAhDgPg");
	this.shape.setTransform(49.075,5.5198);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_5, new cjs.Rectangle(0,0,98.2,11.1), null);


(lib.Group_4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AD2AgQiHghhBgNQhwgXhxAdQhXAZgqAJQhKAPg5gNQBEgFBygjQBjggByABQB2AAB4AnQB5AmB1AAIAIAAQglAKguAAQgyAAg9gMg");
	this.shape.setTransform(44,4.4882);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_4, new cjs.Rectangle(0,0.1,88,8.9), null);


(lib.Group_3 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AD1AwQiEgyhBgTQg4gSg4ADQg4ADg5AXQhXAmgsAOQhKAXg5gTQA3gHAwgUQANgFBEgfQBkgwBzAAQBOAAA+ASQAkALA8AdQA6AcAlALQA+ASBPAAIAIAAQgnAQguAAQgyAAg8gSg");
	this.shape.setTransform(43.95,6.5882);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_3, new cjs.Rectangle(0,0,87.9,13.2), null);


(lib.Group_2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AEMAjQiVgkhIgPQh7gZh6AgQhdAbguAKQhPARg/gPQBKgGB6gmQBrgiB8AAQCAABCFAqQCGAqCBAAIAIAAQgoAMgyAAQg3AAhDgOg");
	this.shape.setTransform(48,4.8632);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group_2, new cjs.Rectangle(0,0,96,9.8), null);


(lib.Group = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#8DCAE7").s().p("AFzAzQgygLhigaQhjgbgvgKQingkiwAuQiHAohCAOQhyAZhVgVQBTgHBMgUQAVgGBnggQCcgyCuABQB2ABBbATQA4ALBXAfQBZAeA3ALQBcATB4ABIALAAQg6AQhGAAQhMAAhbgTg");
	this.shape.setTransform(66.65,6.9939);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.Group, new cjs.Rectangle(0,0,133.3,14), null);


(lib.swimmernoRH = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_312();
	this.instance.setTransform(-0.45,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-0.4,0,328,350.5);


(lib.swimmer = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_311();
	this.instance.setTransform(-1.15,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.swimmer, new cjs.Rectangle(-1.1,0,622.5,76.5), null);


(lib.Scene_1_water_splash = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// water_splash
	this.instance = new lib.CachedBmp_297();
	this.instance.setTransform(1345.45,471.2,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_298();
	this.instance_1.setTransform(1345.45,471.2,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_299();
	this.instance_2.setTransform(1412.5,471.2,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_300();
	this.instance_3.setTransform(1412.5,471.2,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_301();
	this.instance_4.setTransform(1412.5,471.2,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_302();
	this.instance_5.setTransform(1412.5,471.2,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},349).to({state:[{t:this.instance_1}]},17).to({state:[{t:this.instance_2}]},21).to({state:[{t:this.instance_3}]},17).to({state:[{t:this.instance_4}]},9).to({state:[{t:this.instance_5}]},15).to({state:[]},9).wait(128));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,1751,650.7);


(lib.Scene_1_STEP2_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// STEP2
	this.instance = new lib.CachedBmp_304();
	this.instance.setTransform(151.7,179.15,0.5,0.5);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(252).to({_off:false},0).to({_off:true},6).wait(307));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,636.7,443.7);


(lib.Scene_1_STEP2 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// STEP2
	this.instance = new lib.CachedBmp_295();
	this.instance.setTransform(151.7,179.15,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_296();
	this.instance_1.setTransform(151.7,179.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},497).to({state:[{t:this.instance_1}]},5).to({state:[]},1).wait(60));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,636.7,443.7);


(lib.Scene_1_jump_board = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// jump_board
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#1D1D1D").s().p("AyLRZIHvtYIAdhGIAEgsIgIgtIgqg4IhEglIqKjbIhCgvIgEhFIBIkZICognIAYgtIEVgwIh3jzIgIgZIgDgUIAJgUIATgRIA1gSIEDgcQAKASFfDlQCvByCuBuQTmErAeAKQAhAKANAQQAOAQgEAYIgJAfQgGAUABALImfABIgGAKQAgAHCwAeQCtAfA1AYQAaAMAaAXQANAMAXAgQAnA6AOA8QAIAggDATQgDAbgVAeQgFAHgPANIgNAKQg7AugfAUIgZASQgNAHgQACQgVACgTgQQgOgLgIgZQgIgUgRgfIgdgzQgNgQgggQQgLgFgMgDQhJgQiTgPIiGgMIo6QBgAMZgPIBqANQB0APA6ANQAxAKAUAKQAwAYAdAfQAPAQATAnQALAYAOAzIBmhXQAFghgZgxQgagyglgXQgOgIgVgFIglgHIl7hPg");
	this.shape.setTransform(132.464,511.4853,0.8552,0.8552);
	this.shape._off = true;

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1).to({_off:false},0).wait(101).to({x:132.4824,y:511.482},0).wait(463));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,258.5,606.9);


(lib.Scene_1_horizantal_loop_copy = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// horizantal_loop_copy
	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(1417.2,525.7,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_22();
	this.instance_1.setTransform(756.7,152.75,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},240).to({state:[]},2).to({state:[{t:this.instance_1}]},7).to({state:[]},99).wait(150));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,1655.2,621.3);


(lib.Scene_1_horizantal_loop = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// horizantal_loop
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF0000").ss(5,1,1).p("ASIAAQAAC6lUCEQlUCEngAAQngAAlUiEQlUiEAAi6QAAi6FUiEQFUiEHgAAQHgAAFUCEQFUCEAAC6g");
	this.shape.setTransform(1536.4,573.15);

	this.instance = new lib.CachedBmp_24();
	this.instance.setTransform(1417.2,525.7,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_25();
	this.instance_1.setTransform(730.9,152.65,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape}]},240).to({state:[{t:this.instance}]},2).to({state:[{t:this.instance_1}]},7).to({state:[]},98).wait(76));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,1655.2,621.2);


(lib.Scene_1_flash0_ai_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// flash0_ai
	this.instance = new lib.CachedBmp_303();
	this.instance.setTransform(181.8,206.95,0.5,0.5);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(258).to({_off:false},0).to({_off:true},7).wait(300));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,702.8,396);


(lib.Replay = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_42();
	this.instance.setTransform(81.15,-25,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_41();
	this.instance_1.setTransform(38.7,141.75,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_44();
	this.instance_2.setTransform(90.15,-34,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_43();
	this.instance_3.setTransform(38.7,141.75,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_46();
	this.instance_4.setTransform(90.15,-34,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_45();
	this.instance_5.setTransform(38.7,141.75,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_49();
	this.instance_6.setTransform(90.15,-34,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_48();
	this.instance_7.setTransform(38.7,141.75,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_47();
	this.instance_8.setTransform(-22.95,-65,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_1},{t:this.instance}]}).to({state:[{t:this.instance_3},{t:this.instance_2}]},1).to({state:[{t:this.instance_5},{t:this.instance_4}]},1).to({state:[{t:this.instance_8},{t:this.instance_7},{t:this.instance_6}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-22.9,-65,386,286);


(lib.movingwave = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#00CCFF").s().p("EDN/ADMQjSgBingiQhlgUihg1Qiig2hjgUQimggjRgBQjRgBiiAfQhhAUicA0QibA0hiAUQijAgjSAAQjTgBikgiQhjgUidg1Qieg2hhgUQikghjRAAQjRgBilAfQhiAUigA0QifA0hkAUQimAgjSgBQjTgBihghQhhgUiZg2Qiag1hggUQihghjRgBQjRAAinAfQhkATikA1QijA0hmATQioAhjSgBIgBAAIkJgWIgFgCQhHgShugjQh6gng2gOQjbg6kNgBQjRgBifAfQhfAUiYA0QiWA0hhAUQigAgjTgBQjSAAingiQhlgUihg2Qiig1hjgUQinghjRgBQjRAAiiAfQhhATibA1QibA0hiATQijAhjTgBQjSgBikghQhjgVidg1Qidg1higVQijggjRgBQjRgBilAhQhiASigA1QifA0hkATQimAhjSgBQjTgBihghQhigViZg1QiZg1hggUQihghjQgBQjRgBioAhQhkASikA0QijA0hlAUQipAgjSAAQjSgBikgjQhEgOhHgXQgigLhZggQiegyhngUQimggjMAAQjRgBigAgQhfAUiXAzQiXA0hhAUQigAgjTgBQjSAAingiQhlgUihg2Qiig0hjgUQimgijRgBQjRAAiiAgQhhATicA0QibA0hiATQijAhjSgBQjTgBikghQhjgVidg1Qieg0hhgVQikghjRgBQjRgBilAhQhiATigA0QifA0hkATQimAhjSgBQjTgBihghQhhgViZg1Qiag0hggVQihghjRgBQjQgBioAhQhkATikAzQijA0hmAUQioAgjSAAQkggBjbhGIiug8QhogjhbgSIAVh6QBbASBnAjICtA8QDbBEEeABQDSABCngfQBlgUCjgzQCjg0BkgTQCnghDQABQDQABCgAhQBgAUCZA1QCYA1BhAUQChAhDRAAQDSABClgfQBkgTCeg0QCfg0BigTQClggDQAAQDQABCjAhQBhAUCdA2QCcA0BjAVQCkAgDRABQDSAACigfQBigTCag0QCbg0BhgTQChggDQAAQDRABClAhQBjAUChA2QChA0BkAVQCmAgDSABQDSABCfggQBggTCXg0QCWg0BggTQCfggDQABQDtAAC/AtICoAxQC9A2BrAaQCwAqDpAAQDSABCoggQBlgTCigzQCkg0BjgTQCnghDQABQDQABCgAhQBgAUCYA1QCZA1BhATQChAiDRAAQDSABClggQBkgTCegzQCfg0BigTQCkggDQAAQDQABCjAhQBhAUCcA2QCdAzBiAVQCkAhDSABQDSAACiggQBigTCagzQCbg0BggTQCiggDQAAQDQABCmAhQBjAUChA2QChAzBkAVQCmAhDSABQDSABCfghQBggTCXgzQCWg0BfgTQCfggDQABQEOABDdA7QAyAOCAApQBtAiBKARQCCAVCoABQDSAACnggQBlgTCjgzQCjg0BkgTQCnggDQABQDQAACgAiQBgAUCZA1QCYAzBhAVQChAhDRABQDSABClghQBjgTCfgzQCfg0BigTQCkggDQABQDQABCjAhQBiAUCdA1QCcA0BjAUQCkAhDRABQDSABCighQBigTCagzQCbg0BhgTQChggDQABQDQABCmAhQBjAUChA1QChA0BkAUQCmAhDSABQDSABCfggQBggUCXgyQCWg0BfgTQCfghDQABQENABDcA7QAyAOB+AoQBuAiBIARQAFACABAFIASBqQABAEgDADQgEADgEgBQhGgRhugjQh7gog1gOQjbg6kMgBQjRgBigAgQhfATiXA0QiXA1hhATQibAgjLAAIgNAAg");
	this.shape.setTransform(1527.0611,20.375);

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.movingwave, new cjs.Rectangle(0,0,3054.1,40.8), null);


(lib.Go = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// buttonGo
	this.shape = new cjs.Shape();
	this.shape.graphics.f("#0000FF").s().p("ArOtMIWvNcI3BM9g");
	this.shape.setTransform(73.7,84.5);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#000066").s().p("ArOtMIWvNcI3BM9g");
	this.shape_1.setTransform(73.7,84.525);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape}]}).to({state:[{t:this.shape_1,p:{x:73.7}}]},1).to({state:[{t:this.shape_1,p:{x:84.7}}]},1).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,158.4,169.1);


(lib.basicswimmer = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.CachedBmp_310();
	this.instance.setTransform(-1.2,-0.45,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-1.2,-0.4,620,99);


(lib.___Camera___ = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// timeline functions:
	this.frame_0 = function() {
		this.visible = false;
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(2));

	// cameraBoundary
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(0,0,0,0)").ss(2,1,1,3,true).p("EAq+AfQMhV7AAAMAAAg+fMBV7AAAg");

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(2));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(-641,-361,1282,722);


(lib.Path_161 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_1
	this.instance = new lib.movingwave();
	this.instance.setTransform(1557,20.4,1,1,0,0,0,1527,20.4);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({regX:1527.1,x:1554.6},0).wait(1).to({x:1552.1},0).wait(1).to({x:1549.6},0).wait(1).to({x:1547.1},0).wait(1).to({x:1544.6},0).wait(1).to({x:1542.1},0).wait(1).to({x:1539.6},0).wait(1).to({x:1537.1},0).wait(1).to({x:1534.6},0).wait(1).to({x:1532.1},0).wait(1).to({x:1529.6},0).wait(1).to({x:1527.1},0).wait(1).to({x:1537.85},0).wait(1).to({x:1548.55},0).wait(1).to({x:1559.25},0).wait(1).to({x:1570},0).wait(1).to({x:1580.7},0).wait(1).to({x:1591.45},0).wait(1).to({x:1602.15},0).wait(1).to({x:1612.85},0).wait(1).to({x:1623.6},0).wait(1).to({x:1634.3},0).wait(1).to({x:1645.05},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0.1,0,3172,40.8);


(lib.wavesai = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// waves_ai
	this.instance = new lib.Path_161();
	this.instance.setTransform(1527,20.4,1,1,0,0,0,1527,20.4);
	this.instance.compositeOperation = "multiply";

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(30,0,3054.1,40.8);


(lib.ClipGroup = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Layer_2 (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("Ej8QBOIMAAAicPMH4hAAAMAAACcPg");
	mask.setTransform(1644.35,506.5);

	// Layer_3
	this.instance = new lib.CachedBmp_320();
	this.instance.setTransform(2959.3,496.4,0.5,0.5);

	this.instance_1 = new lib.Path_3_0();
	this.instance_1.setTransform(2977.45,509.8,1,1,0,0,0,9.6,5.2);
	this.instance_1.alpha = 0.5;
	this.instance_1.compositeOperation = "screen";

	this.instance_2 = new lib.CachedBmp_219();
	this.instance_2.setTransform(2963.5,504.15,0.5,0.5);

	this.instance_3 = new lib.Path_5_0();
	this.instance_3.setTransform(2971.75,504.1,1,1,0,0,0,15.1,9.2);
	this.instance_3.alpha = 0.6992;
	this.instance_3.compositeOperation = "multiply";

	this.instance_4 = new lib.Group();
	this.instance_4.setTransform(2704.1,418.15,1,1,0,0,0,66.7,7);
	this.instance_4.compositeOperation = "screen";

	this.instance_5 = new lib.Group_2();
	this.instance_5.setTransform(3138.65,330.55,1,1,0,0,0,48,4.9);
	this.instance_5.compositeOperation = "screen";

	this.instance_6 = new lib.Group_3();
	this.instance_6.setTransform(2312.2,292,1,1,0,0,0,44,6.6);
	this.instance_6.compositeOperation = "screen";

	this.instance_7 = new lib.Group_4();
	this.instance_7.setTransform(2925.3,295.05,1,1,0,0,0,44,4.5);
	this.instance_7.compositeOperation = "screen";

	this.instance_8 = new lib.Group_5();
	this.instance_8.setTransform(2653.5,645.1,1,1,0,0,0,49.1,5.5);
	this.instance_8.compositeOperation = "screen";

	this.instance_9 = new lib.Group_6();
	this.instance_9.setTransform(2546.1,557.15,1,1,0,0,0,124,13.6);
	this.instance_9.compositeOperation = "screen";

	this.instance_10 = new lib.CachedBmp_319();
	this.instance_10.setTransform(2235.25,102.1,0.5,0.5);

	this.instance_11 = new lib.Path_160();
	this.instance_11.setTransform(3253,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_11.alpha = 0.1992;
	this.instance_11.compositeOperation = "multiply";

	this.instance_12 = new lib.CachedBmp_217();
	this.instance_12.setTransform(3235.35,70.75,0.5,0.5);

	this.instance_13 = new lib.Path_159();
	this.instance_13.setTransform(3211.65,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_13.alpha = 0.1992;
	this.instance_13.compositeOperation = "multiply";

	this.instance_14 = new lib.CachedBmp_217();
	this.instance_14.setTransform(3194,70.75,0.5,0.5);

	this.instance_15 = new lib.Path_158();
	this.instance_15.setTransform(3172.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_15.alpha = 0.1992;
	this.instance_15.compositeOperation = "multiply";

	this.instance_16 = new lib.CachedBmp_217();
	this.instance_16.setTransform(3155.1,70.75,0.5,0.5);

	this.instance_17 = new lib.Path_157();
	this.instance_17.setTransform(3134.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_17.alpha = 0.1992;
	this.instance_17.compositeOperation = "multiply";

	this.instance_18 = new lib.CachedBmp_217();
	this.instance_18.setTransform(3116.4,70.75,0.5,0.5);

	this.instance_19 = new lib.Path_156();
	this.instance_19.setTransform(3095.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_19.alpha = 0.1992;
	this.instance_19.compositeOperation = "multiply";

	this.instance_20 = new lib.CachedBmp_217();
	this.instance_20.setTransform(3077.75,70.75,0.5,0.5);

	this.instance_21 = new lib.Path_155();
	this.instance_21.setTransform(3056.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_21.alpha = 0.1992;
	this.instance_21.compositeOperation = "multiply";

	this.instance_22 = new lib.CachedBmp_217();
	this.instance_22.setTransform(3039.05,70.75,0.5,0.5);

	this.instance_23 = new lib.Path_154();
	this.instance_23.setTransform(3018.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_23.alpha = 0.1992;
	this.instance_23.compositeOperation = "multiply";

	this.instance_24 = new lib.CachedBmp_217();
	this.instance_24.setTransform(3000.4,70.75,0.5,0.5);

	this.instance_25 = new lib.Path_153();
	this.instance_25.setTransform(2979.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_25.alpha = 0.1992;
	this.instance_25.compositeOperation = "multiply";

	this.instance_26 = new lib.CachedBmp_217();
	this.instance_26.setTransform(2961.75,70.75,0.5,0.5);

	this.instance_27 = new lib.Path_152();
	this.instance_27.setTransform(2940.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_27.alpha = 0.1992;
	this.instance_27.compositeOperation = "multiply";

	this.instance_28 = new lib.CachedBmp_217();
	this.instance_28.setTransform(2923.05,70.75,0.5,0.5);

	this.instance_29 = new lib.Path_151();
	this.instance_29.setTransform(2902.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_29.alpha = 0.1992;
	this.instance_29.compositeOperation = "multiply";

	this.instance_30 = new lib.CachedBmp_217();
	this.instance_30.setTransform(2884.4,70.75,0.5,0.5);

	this.instance_31 = new lib.Path_150();
	this.instance_31.setTransform(2863.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_31.alpha = 0.1992;
	this.instance_31.compositeOperation = "multiply";

	this.instance_32 = new lib.CachedBmp_217();
	this.instance_32.setTransform(2845.75,70.75,0.5,0.5);

	this.instance_33 = new lib.Path_149();
	this.instance_33.setTransform(2824.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_33.alpha = 0.1992;
	this.instance_33.compositeOperation = "multiply";

	this.instance_34 = new lib.CachedBmp_217();
	this.instance_34.setTransform(2807.05,70.75,0.5,0.5);

	this.instance_35 = new lib.Path_148();
	this.instance_35.setTransform(2786.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_35.alpha = 0.1992;
	this.instance_35.compositeOperation = "multiply";

	this.instance_36 = new lib.CachedBmp_217();
	this.instance_36.setTransform(2768.4,70.75,0.5,0.5);

	this.instance_37 = new lib.Path_147();
	this.instance_37.setTransform(2747.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_37.alpha = 0.1992;
	this.instance_37.compositeOperation = "multiply";

	this.instance_38 = new lib.CachedBmp_217();
	this.instance_38.setTransform(2729.75,70.75,0.5,0.5);

	this.instance_39 = new lib.Path_146();
	this.instance_39.setTransform(2708.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_39.alpha = 0.1992;
	this.instance_39.compositeOperation = "multiply";

	this.instance_40 = new lib.CachedBmp_217();
	this.instance_40.setTransform(2691.05,70.75,0.5,0.5);

	this.instance_41 = new lib.Path_145();
	this.instance_41.setTransform(2670.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_41.alpha = 0.1992;
	this.instance_41.compositeOperation = "multiply";

	this.instance_42 = new lib.CachedBmp_217();
	this.instance_42.setTransform(2652.4,70.75,0.5,0.5);

	this.instance_43 = new lib.Path_144();
	this.instance_43.setTransform(2631.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_43.alpha = 0.1992;
	this.instance_43.compositeOperation = "multiply";

	this.instance_44 = new lib.CachedBmp_217();
	this.instance_44.setTransform(2613.75,70.75,0.5,0.5);

	this.instance_45 = new lib.Path_143();
	this.instance_45.setTransform(2554.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_45.alpha = 0.1992;
	this.instance_45.compositeOperation = "multiply";

	this.instance_46 = new lib.CachedBmp_217();
	this.instance_46.setTransform(2536.4,70.75,0.5,0.5);

	this.instance_47 = new lib.Path_142();
	this.instance_47.setTransform(2515.35,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_47.alpha = 0.1992;
	this.instance_47.compositeOperation = "multiply";

	this.instance_48 = new lib.CachedBmp_199();
	this.instance_48.setTransform(2497.7,70.75,0.5,0.5);

	this.instance_49 = new lib.Path_141();
	this.instance_49.setTransform(2360.25,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_49.alpha = 0.1992;
	this.instance_49.compositeOperation = "multiply";

	this.instance_50 = new lib.CachedBmp_217();
	this.instance_50.setTransform(2342.6,70.75,0.5,0.5);

	this.instance_51 = new lib.Path_140();
	this.instance_51.setTransform(2476.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_51.alpha = 0.1992;
	this.instance_51.compositeOperation = "multiply";

	this.instance_52 = new lib.CachedBmp_217();
	this.instance_52.setTransform(2459.05,70.75,0.5,0.5);

	this.instance_53 = new lib.Path_139();
	this.instance_53.setTransform(2438.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_53.alpha = 0.1992;
	this.instance_53.compositeOperation = "multiply";

	this.instance_54 = new lib.CachedBmp_217();
	this.instance_54.setTransform(2420.4,70.75,0.5,0.5);

	this.instance_55 = new lib.Path_138();
	this.instance_55.setTransform(2399.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_55.alpha = 0.1992;
	this.instance_55.compositeOperation = "multiply";

	this.instance_56 = new lib.CachedBmp_199();
	this.instance_56.setTransform(2381.7,70.75,0.5,0.5);

	this.instance_57 = new lib.Path_137();
	this.instance_57.setTransform(3271.45,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_57.alpha = 0.1992;
	this.instance_57.compositeOperation = "multiply";

	this.instance_58 = new lib.CachedBmp_194();
	this.instance_58.setTransform(3253.8,15.1,0.5,0.5);

	this.instance_59 = new lib.Path_136();
	this.instance_59.setTransform(3232.8,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_59.alpha = 0.1992;
	this.instance_59.compositeOperation = "multiply";

	this.instance_60 = new lib.CachedBmp_194();
	this.instance_60.setTransform(3215.15,15.1,0.5,0.5);

	this.instance_61 = new lib.Path_135();
	this.instance_61.setTransform(3191.5,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_61.alpha = 0.1992;
	this.instance_61.compositeOperation = "multiply";

	this.instance_62 = new lib.CachedBmp_194();
	this.instance_62.setTransform(3173.85,15.1,0.5,0.5);

	this.instance_63 = new lib.Path_134();
	this.instance_63.setTransform(3153,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_63.alpha = 0.1992;
	this.instance_63.compositeOperation = "multiply";

	this.instance_64 = new lib.CachedBmp_191();
	this.instance_64.setTransform(3135.3,15.1,0.5,0.5);

	this.instance_65 = new lib.Path_133();
	this.instance_65.setTransform(3114.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_65.alpha = 0.1992;
	this.instance_65.compositeOperation = "multiply";

	this.instance_66 = new lib.CachedBmp_194();
	this.instance_66.setTransform(3096.65,15.1,0.5,0.5);

	this.instance_67 = new lib.Path_132();
	this.instance_67.setTransform(3075.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_67.alpha = 0.1992;
	this.instance_67.compositeOperation = "multiply";

	this.instance_68 = new lib.CachedBmp_194();
	this.instance_68.setTransform(3058,15.1,0.5,0.5);

	this.instance_69 = new lib.Path_131();
	this.instance_69.setTransform(3037,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_69.alpha = 0.1992;
	this.instance_69.compositeOperation = "multiply";

	this.instance_70 = new lib.CachedBmp_194();
	this.instance_70.setTransform(3019.35,15.1,0.5,0.5);

	this.instance_71 = new lib.Path_130();
	this.instance_71.setTransform(2998.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_71.alpha = 0.1992;
	this.instance_71.compositeOperation = "multiply";

	this.instance_72 = new lib.CachedBmp_194();
	this.instance_72.setTransform(2980.65,15.1,0.5,0.5);

	this.instance_73 = new lib.Path_129();
	this.instance_73.setTransform(2959.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_73.alpha = 0.1992;
	this.instance_73.compositeOperation = "multiply";

	this.instance_74 = new lib.CachedBmp_194();
	this.instance_74.setTransform(2942,15.1,0.5,0.5);

	this.instance_75 = new lib.Path_128();
	this.instance_75.setTransform(2920.95,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_75.alpha = 0.1992;
	this.instance_75.compositeOperation = "multiply";

	this.instance_76 = new lib.CachedBmp_191();
	this.instance_76.setTransform(2903.3,15.1,0.5,0.5);

	this.instance_77 = new lib.Path_127();
	this.instance_77.setTransform(2882.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_77.alpha = 0.1992;
	this.instance_77.compositeOperation = "multiply";

	this.instance_78 = new lib.CachedBmp_194();
	this.instance_78.setTransform(2864.65,15.1,0.5,0.5);

	this.instance_79 = new lib.Path_126();
	this.instance_79.setTransform(2843.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_79.alpha = 0.1992;
	this.instance_79.compositeOperation = "multiply";

	this.instance_80 = new lib.CachedBmp_194();
	this.instance_80.setTransform(2826,15.1,0.5,0.5);

	this.instance_81 = new lib.Path_125();
	this.instance_81.setTransform(2804.95,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_81.alpha = 0.1992;
	this.instance_81.compositeOperation = "multiply";

	this.instance_82 = new lib.CachedBmp_194();
	this.instance_82.setTransform(2787.3,15.1,0.5,0.5);

	this.instance_83 = new lib.Path_124();
	this.instance_83.setTransform(2766.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_83.alpha = 0.1992;
	this.instance_83.compositeOperation = "multiply";

	this.instance_84 = new lib.CachedBmp_194();
	this.instance_84.setTransform(2748.65,15.1,0.5,0.5);

	this.instance_85 = new lib.Path_123();
	this.instance_85.setTransform(2727.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_85.alpha = 0.1992;
	this.instance_85.compositeOperation = "multiply";

	this.instance_86 = new lib.CachedBmp_194();
	this.instance_86.setTransform(2710,15.1,0.5,0.5);

	this.instance_87 = new lib.Path_122();
	this.instance_87.setTransform(2688.95,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_87.alpha = 0.1992;
	this.instance_87.compositeOperation = "multiply";

	this.instance_88 = new lib.CachedBmp_194();
	this.instance_88.setTransform(2671.3,15.1,0.5,0.5);

	this.instance_89 = new lib.Path_121();
	this.instance_89.setTransform(2650.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_89.alpha = 0.1992;
	this.instance_89.compositeOperation = "multiply";

	this.instance_90 = new lib.CachedBmp_194();
	this.instance_90.setTransform(2632.65,15.1,0.5,0.5);

	this.instance_91 = new lib.Path_120();
	this.instance_91.setTransform(2572.95,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_91.alpha = 0.1992;
	this.instance_91.compositeOperation = "multiply";

	this.instance_92 = new lib.CachedBmp_194();
	this.instance_92.setTransform(2555.3,15.1,0.5,0.5);

	this.instance_93 = new lib.Path_119();
	this.instance_93.setTransform(2534.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_93.alpha = 0.1992;
	this.instance_93.compositeOperation = "multiply";

	this.instance_94 = new lib.CachedBmp_194();
	this.instance_94.setTransform(2516.65,15.1,0.5,0.5);

	this.instance_95 = new lib.Path_118();
	this.instance_95.setTransform(2495.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_95.alpha = 0.1992;
	this.instance_95.compositeOperation = "multiply";

	this.instance_96 = new lib.CachedBmp_194();
	this.instance_96.setTransform(2478,15.1,0.5,0.5);

	this.instance_97 = new lib.Path_117();
	this.instance_97.setTransform(2456.95,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_97.alpha = 0.1992;
	this.instance_97.compositeOperation = "multiply";

	this.instance_98 = new lib.CachedBmp_194();
	this.instance_98.setTransform(2439.3,15.1,0.5,0.5);

	this.instance_99 = new lib.Path_116();
	this.instance_99.setTransform(2418.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_99.alpha = 0.1992;
	this.instance_99.compositeOperation = "multiply";

	this.instance_100 = new lib.CachedBmp_194();
	this.instance_100.setTransform(2400.65,15.1,0.5,0.5);

	this.instance_101 = new lib.Path_115();
	this.instance_101.setTransform(2379.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_101.alpha = 0.1992;
	this.instance_101.compositeOperation = "multiply";

	this.instance_102 = new lib.CachedBmp_194();
	this.instance_102.setTransform(2362,15.1,0.5,0.5);

	this.instance_103 = new lib.Group_67();
	this.instance_103.setTransform(2820.45,938,1,1,0,0,0,72.5,8.3);
	this.instance_103.compositeOperation = "screen";

	this.instance_104 = new lib.Group_68();
	this.instance_104.setTransform(2622.55,285.35,1,1,0,0,0,63.9,6.4);
	this.instance_104.compositeOperation = "screen";

	this.instance_105 = new lib.Group_69();
	this.instance_105.setTransform(2851.45,696,1,1,0,0,0,72.5,8.3);
	this.instance_105.compositeOperation = "screen";

	this.instance_106 = new lib.CachedBmp_318();
	this.instance_106.setTransform(1887.3,252.85,0.5,0.5);

	this.instance_107 = new lib.Group_71();
	this.instance_107.setTransform(1632.1,418.15,1,1,0,0,0,66.7,7);
	this.instance_107.compositeOperation = "screen";

	this.instance_108 = new lib.Group_72();
	this.instance_108.setTransform(2269.1,410.9,1,1,0,0,0,49.9,5.3);
	this.instance_108.compositeOperation = "screen";

	this.instance_109 = new lib.Group_73();
	this.instance_109.setTransform(2192.65,330.55,1,1,0,0,0,48,4.9);
	this.instance_109.compositeOperation = "screen";

	this.instance_110 = new lib.Group_74();
	this.instance_110.setTransform(1366.2,292,1,1,0,0,0,44,6.6);
	this.instance_110.compositeOperation = "screen";

	this.instance_111 = new lib.Group_75();
	this.instance_111.setTransform(1979.3,295.05,1,1,0,0,0,44,4.5);
	this.instance_111.compositeOperation = "screen";

	this.instance_112 = new lib.Group_76();
	this.instance_112.setTransform(1317.35,530.5,1,1,0,0,0,30.2,4.5);
	this.instance_112.compositeOperation = "screen";

	this.instance_113 = new lib.Group_77();
	this.instance_113.setTransform(1408.75,655.55,1,1,0,0,0,30.2,4.5);
	this.instance_113.compositeOperation = "screen";

	this.instance_114 = new lib.Group_78();
	this.instance_114.setTransform(1581.5,645.1,1,1,0,0,0,49.1,5.5);
	this.instance_114.compositeOperation = "screen";

	this.instance_115 = new lib.Group_79();
	this.instance_115.setTransform(1474.1,557.15,1,1,0,0,0,124,13.6);
	this.instance_115.compositeOperation = "screen";

	this.instance_116 = new lib.CachedBmp_317();
	this.instance_116.setTransform(1289.25,254.5,0.5,0.5);

	this.instance_117 = new lib.Path_8_0();
	this.instance_117.setTransform(847.7,509.8,1,1,0,0,0,9.6,5.2);
	this.instance_117.alpha = 0.5;
	this.instance_117.compositeOperation = "screen";

	this.instance_118 = new lib.Group_87();
	this.instance_118.setTransform(574.3,418.15,1,1,0,0,0,66.6,7);
	this.instance_118.compositeOperation = "screen";

	this.instance_119 = new lib.Group_88();
	this.instance_119.setTransform(1211.3,410.9,1,1,0,0,0,49.8,5.3);
	this.instance_119.compositeOperation = "screen";

	this.instance_120 = new lib.Group_89();
	this.instance_120.setTransform(1134.9,330.55,1,1,0,0,0,48,4.9);
	this.instance_120.compositeOperation = "screen";

	this.instance_121 = new lib.Group_90();
	this.instance_121.setTransform(308.45,292,1,1,0,0,0,44,6.6);
	this.instance_121.compositeOperation = "screen";

	this.instance_122 = new lib.Group_91();
	this.instance_122.setTransform(921.6,295.05,1,1,0,0,0,44,4.5);
	this.instance_122.compositeOperation = "screen";

	this.instance_123 = new lib.Group_92();
	this.instance_123.setTransform(259.65,530.5,1,1,0,0,0,30.2,4.5);
	this.instance_123.compositeOperation = "screen";

	this.instance_124 = new lib.Group_93();
	this.instance_124.setTransform(351.05,655.55,1,1,0,0,0,30.2,4.5);
	this.instance_124.compositeOperation = "screen";

	this.instance_125 = new lib.Group_94();
	this.instance_125.setTransform(523.8,645.1,1,1,0,0,0,49.1,5.5);
	this.instance_125.compositeOperation = "screen";

	this.instance_126 = new lib.Group_95();
	this.instance_126.setTransform(416.35,557.15,1,1,0,0,0,124,13.6);
	this.instance_126.compositeOperation = "screen";

	this.instance_127 = new lib.Path_9_0();
	this.instance_127.setTransform(190.15,637.3,1,1,0,0,0,40.1,381.7);
	this.instance_127.compositeOperation = "multiply";

	this.instance_128 = new lib.CachedBmp_316();
	this.instance_128.setTransform(150.2,102.1,0.5,0.5);

	this.instance_129 = new lib.Path_114();
	this.instance_129.setTransform(2304.45,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_129.alpha = 0.1992;
	this.instance_129.compositeOperation = "multiply";

	this.instance_130 = new lib.CachedBmp_217();
	this.instance_130.setTransform(2286.8,70.75,0.5,0.5);

	this.instance_131 = new lib.Path_113();
	this.instance_131.setTransform(2343,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_131.alpha = 0.1992;
	this.instance_131.compositeOperation = "multiply";

	this.instance_132 = new lib.CachedBmp_217();
	this.instance_132.setTransform(2325.35,70.75,0.5,0.5);

	this.instance_133 = new lib.Path_112();
	this.instance_133.setTransform(2265.65,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_133.alpha = 0.1992;
	this.instance_133.compositeOperation = "multiply";

	this.instance_134 = new lib.CachedBmp_217();
	this.instance_134.setTransform(2248,70.75,0.5,0.5);

	this.instance_135 = new lib.Path_111();
	this.instance_135.setTransform(2226.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_135.alpha = 0.1992;
	this.instance_135.compositeOperation = "multiply";

	this.instance_136 = new lib.CachedBmp_217();
	this.instance_136.setTransform(2209.1,70.75,0.5,0.5);

	this.instance_137 = new lib.Path_110();
	this.instance_137.setTransform(2188.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_137.alpha = 0.1992;
	this.instance_137.compositeOperation = "multiply";

	this.instance_138 = new lib.CachedBmp_217();
	this.instance_138.setTransform(2170.4,70.75,0.5,0.5);

	this.instance_139 = new lib.Path_109();
	this.instance_139.setTransform(2149.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_139.alpha = 0.1992;
	this.instance_139.compositeOperation = "multiply";

	this.instance_140 = new lib.CachedBmp_217();
	this.instance_140.setTransform(2131.75,70.75,0.5,0.5);

	this.instance_141 = new lib.Path_108();
	this.instance_141.setTransform(2110.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_141.alpha = 0.1992;
	this.instance_141.compositeOperation = "multiply";

	this.instance_142 = new lib.CachedBmp_217();
	this.instance_142.setTransform(2093.05,70.75,0.5,0.5);

	this.instance_143 = new lib.Path_107();
	this.instance_143.setTransform(2072.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_143.alpha = 0.1992;
	this.instance_143.compositeOperation = "multiply";

	this.instance_144 = new lib.CachedBmp_217();
	this.instance_144.setTransform(2054.4,70.75,0.5,0.5);

	this.instance_145 = new lib.Path_106();
	this.instance_145.setTransform(2033.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_145.alpha = 0.1992;
	this.instance_145.compositeOperation = "multiply";

	this.instance_146 = new lib.CachedBmp_217();
	this.instance_146.setTransform(2015.75,70.75,0.5,0.5);

	this.instance_147 = new lib.Path_105();
	this.instance_147.setTransform(1994.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_147.alpha = 0.1992;
	this.instance_147.compositeOperation = "multiply";

	this.instance_148 = new lib.CachedBmp_217();
	this.instance_148.setTransform(1977.05,70.75,0.5,0.5);

	this.instance_149 = new lib.Path_104();
	this.instance_149.setTransform(1956.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_149.alpha = 0.1992;
	this.instance_149.compositeOperation = "multiply";

	this.instance_150 = new lib.CachedBmp_217();
	this.instance_150.setTransform(1938.4,70.75,0.5,0.5);

	this.instance_151 = new lib.Path_103();
	this.instance_151.setTransform(1917.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_151.alpha = 0.1992;
	this.instance_151.compositeOperation = "multiply";

	this.instance_152 = new lib.CachedBmp_217();
	this.instance_152.setTransform(1899.75,70.75,0.5,0.5);

	this.instance_153 = new lib.Path_102();
	this.instance_153.setTransform(1878.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_153.alpha = 0.1992;
	this.instance_153.compositeOperation = "multiply";

	this.instance_154 = new lib.CachedBmp_217();
	this.instance_154.setTransform(1861.05,70.75,0.5,0.5);

	this.instance_155 = new lib.Path_101();
	this.instance_155.setTransform(1840.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_155.alpha = 0.1992;
	this.instance_155.compositeOperation = "multiply";

	this.instance_156 = new lib.CachedBmp_217();
	this.instance_156.setTransform(1822.4,70.75,0.5,0.5);

	this.instance_157 = new lib.Path_100();
	this.instance_157.setTransform(1801.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_157.alpha = 0.1992;
	this.instance_157.compositeOperation = "multiply";

	this.instance_158 = new lib.CachedBmp_217();
	this.instance_158.setTransform(1783.75,70.75,0.5,0.5);

	this.instance_159 = new lib.Path_99();
	this.instance_159.setTransform(1762.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_159.alpha = 0.1992;
	this.instance_159.compositeOperation = "multiply";

	this.instance_160 = new lib.CachedBmp_217();
	this.instance_160.setTransform(1745.05,70.75,0.5,0.5);

	this.instance_161 = new lib.Path_98();
	this.instance_161.setTransform(1724.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_161.alpha = 0.1992;
	this.instance_161.compositeOperation = "multiply";

	this.instance_162 = new lib.CachedBmp_217();
	this.instance_162.setTransform(1706.4,70.75,0.5,0.5);

	this.instance_163 = new lib.Path_97();
	this.instance_163.setTransform(1685.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_163.alpha = 0.1992;
	this.instance_163.compositeOperation = "multiply";

	this.instance_164 = new lib.CachedBmp_217();
	this.instance_164.setTransform(1667.75,70.75,0.5,0.5);

	this.instance_165 = new lib.Path_96();
	this.instance_165.setTransform(1608.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_165.alpha = 0.1992;
	this.instance_165.compositeOperation = "multiply";

	this.instance_166 = new lib.CachedBmp_217();
	this.instance_166.setTransform(1590.4,70.75,0.5,0.5);

	this.instance_167 = new lib.Path_95();
	this.instance_167.setTransform(1569.35,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_167.alpha = 0.1992;
	this.instance_167.compositeOperation = "multiply";

	this.instance_168 = new lib.CachedBmp_199();
	this.instance_168.setTransform(1551.7,70.75,0.5,0.5);

	this.instance_169 = new lib.Path_94();
	this.instance_169.setTransform(1414.25,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_169.alpha = 0.1992;
	this.instance_169.compositeOperation = "multiply";

	this.instance_170 = new lib.CachedBmp_217();
	this.instance_170.setTransform(1396.6,70.75,0.5,0.5);

	this.instance_171 = new lib.Path_93();
	this.instance_171.setTransform(1375.55,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_171.alpha = 0.1992;
	this.instance_171.compositeOperation = "multiply";

	this.instance_172 = new lib.CachedBmp_199();
	this.instance_172.setTransform(1357.9,70.75,0.5,0.5);

	this.instance_173 = new lib.Path_92();
	this.instance_173.setTransform(1530.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_173.alpha = 0.1992;
	this.instance_173.compositeOperation = "multiply";

	this.instance_174 = new lib.CachedBmp_217();
	this.instance_174.setTransform(1513.05,70.75,0.5,0.5);

	this.instance_175 = new lib.Path_91();
	this.instance_175.setTransform(1492.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_175.alpha = 0.1992;
	this.instance_175.compositeOperation = "multiply";

	this.instance_176 = new lib.CachedBmp_217();
	this.instance_176.setTransform(1474.4,70.75,0.5,0.5);

	this.instance_177 = new lib.Path_90();
	this.instance_177.setTransform(1453.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_177.alpha = 0.1992;
	this.instance_177.compositeOperation = "multiply";

	this.instance_178 = new lib.CachedBmp_199();
	this.instance_178.setTransform(1435.7,70.75,0.5,0.5);

	this.instance_179 = new lib.Path_89();
	this.instance_179.setTransform(2361.45,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_179.alpha = 0.1992;
	this.instance_179.compositeOperation = "multiply";

	this.instance_180 = new lib.CachedBmp_194();
	this.instance_180.setTransform(2343.8,15.1,0.5,0.5);

	this.instance_181 = new lib.Path_88();
	this.instance_181.setTransform(2322.8,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_181.alpha = 0.1992;
	this.instance_181.compositeOperation = "multiply";

	this.instance_182 = new lib.CachedBmp_194();
	this.instance_182.setTransform(2305.15,15.1,0.5,0.5);

	this.instance_183 = new lib.Path_87();
	this.instance_183.setTransform(2245.5,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_183.alpha = 0.1992;
	this.instance_183.compositeOperation = "multiply";

	this.instance_184 = new lib.CachedBmp_194();
	this.instance_184.setTransform(2227.85,15.1,0.5,0.5);

	this.instance_185 = new lib.Path_86();
	this.instance_185.setTransform(2207,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_185.alpha = 0.1992;
	this.instance_185.compositeOperation = "multiply";

	this.instance_186 = new lib.CachedBmp_191();
	this.instance_186.setTransform(2189.3,15.1,0.5,0.5);

	this.instance_187 = new lib.Path_85();
	this.instance_187.setTransform(2168.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_187.alpha = 0.1992;
	this.instance_187.compositeOperation = "multiply";

	this.instance_188 = new lib.CachedBmp_194();
	this.instance_188.setTransform(2150.65,15.1,0.5,0.5);

	this.instance_189 = new lib.Path_84();
	this.instance_189.setTransform(2129.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_189.alpha = 0.1992;
	this.instance_189.compositeOperation = "multiply";

	this.instance_190 = new lib.CachedBmp_194();
	this.instance_190.setTransform(2112,15.1,0.5,0.5);

	this.instance_191 = new lib.Path_83();
	this.instance_191.setTransform(2091,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_191.alpha = 0.1992;
	this.instance_191.compositeOperation = "multiply";

	this.instance_192 = new lib.CachedBmp_194();
	this.instance_192.setTransform(2073.35,15.1,0.5,0.5);

	this.instance_193 = new lib.Path_82();
	this.instance_193.setTransform(2052.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_193.alpha = 0.1992;
	this.instance_193.compositeOperation = "multiply";

	this.instance_194 = new lib.CachedBmp_194();
	this.instance_194.setTransform(2034.65,15.1,0.5,0.5);

	this.instance_195 = new lib.Path_81();
	this.instance_195.setTransform(2013.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_195.alpha = 0.1992;
	this.instance_195.compositeOperation = "multiply";

	this.instance_196 = new lib.CachedBmp_194();
	this.instance_196.setTransform(1996,15.1,0.5,0.5);

	this.instance_197 = new lib.Path_80();
	this.instance_197.setTransform(1974.95,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_197.alpha = 0.1992;
	this.instance_197.compositeOperation = "multiply";

	this.instance_198 = new lib.CachedBmp_191();
	this.instance_198.setTransform(1957.3,15.1,0.5,0.5);

	this.instance_199 = new lib.Path_79();
	this.instance_199.setTransform(1936.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_199.alpha = 0.1992;
	this.instance_199.compositeOperation = "multiply";

	this.instance_200 = new lib.CachedBmp_194();
	this.instance_200.setTransform(1918.65,15.1,0.5,0.5);

	this.instance_201 = new lib.Path_78();
	this.instance_201.setTransform(1897.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_201.alpha = 0.1992;
	this.instance_201.compositeOperation = "multiply";

	this.instance_202 = new lib.CachedBmp_194();
	this.instance_202.setTransform(1880,15.1,0.5,0.5);

	this.instance_203 = new lib.Path_77();
	this.instance_203.setTransform(1858.95,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_203.alpha = 0.1992;
	this.instance_203.compositeOperation = "multiply";

	this.instance_204 = new lib.CachedBmp_194();
	this.instance_204.setTransform(1841.3,15.1,0.5,0.5);

	this.instance_205 = new lib.Path_76();
	this.instance_205.setTransform(1820.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_205.alpha = 0.1992;
	this.instance_205.compositeOperation = "multiply";

	this.instance_206 = new lib.CachedBmp_194();
	this.instance_206.setTransform(1802.65,15.1,0.5,0.5);

	this.instance_207 = new lib.Path_75();
	this.instance_207.setTransform(1781.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_207.alpha = 0.1992;
	this.instance_207.compositeOperation = "multiply";

	this.instance_208 = new lib.CachedBmp_194();
	this.instance_208.setTransform(1764,15.1,0.5,0.5);

	this.instance_209 = new lib.Path_74();
	this.instance_209.setTransform(1742.95,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_209.alpha = 0.1992;
	this.instance_209.compositeOperation = "multiply";

	this.instance_210 = new lib.CachedBmp_194();
	this.instance_210.setTransform(1725.3,15.1,0.5,0.5);

	this.instance_211 = new lib.Path_73();
	this.instance_211.setTransform(1704.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_211.alpha = 0.1992;
	this.instance_211.compositeOperation = "multiply";

	this.instance_212 = new lib.CachedBmp_194();
	this.instance_212.setTransform(1686.65,15.1,0.5,0.5);

	this.instance_213 = new lib.Path_72();
	this.instance_213.setTransform(1626.95,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_213.alpha = 0.1992;
	this.instance_213.compositeOperation = "multiply";

	this.instance_214 = new lib.CachedBmp_194();
	this.instance_214.setTransform(1609.3,15.1,0.5,0.5);

	this.instance_215 = new lib.Path_71();
	this.instance_215.setTransform(1588.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_215.alpha = 0.1992;
	this.instance_215.compositeOperation = "multiply";

	this.instance_216 = new lib.CachedBmp_194();
	this.instance_216.setTransform(1570.65,15.1,0.5,0.5);

	this.instance_217 = new lib.Path_70();
	this.instance_217.setTransform(1549.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_217.alpha = 0.1992;
	this.instance_217.compositeOperation = "multiply";

	this.instance_218 = new lib.CachedBmp_194();
	this.instance_218.setTransform(1532,15.1,0.5,0.5);

	this.instance_219 = new lib.Path_69();
	this.instance_219.setTransform(1396.35,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_219.alpha = 0.1992;
	this.instance_219.compositeOperation = "multiply";

	this.instance_220 = new lib.CachedBmp_194();
	this.instance_220.setTransform(1378.7,15.1,0.5,0.5);

	this.instance_221 = new lib.Path_68();
	this.instance_221.setTransform(1357.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_221.alpha = 0.1992;
	this.instance_221.compositeOperation = "multiply";

	this.instance_222 = new lib.CachedBmp_194();
	this.instance_222.setTransform(1340,15.1,0.5,0.5);

	this.instance_223 = new lib.Path_67();
	this.instance_223.setTransform(1510.95,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_223.alpha = 0.1992;
	this.instance_223.compositeOperation = "multiply";

	this.instance_224 = new lib.CachedBmp_194();
	this.instance_224.setTransform(1493.3,15.1,0.5,0.5);

	this.instance_225 = new lib.Path_66();
	this.instance_225.setTransform(1472.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_225.alpha = 0.1992;
	this.instance_225.compositeOperation = "multiply";

	this.instance_226 = new lib.CachedBmp_194();
	this.instance_226.setTransform(1454.65,15.1,0.5,0.5);

	this.instance_227 = new lib.Path_65();
	this.instance_227.setTransform(1433.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_227.alpha = 0.1992;
	this.instance_227.compositeOperation = "multiply";

	this.instance_228 = new lib.CachedBmp_194();
	this.instance_228.setTransform(1416,15.1,0.5,0.5);

	this.instance_229 = new lib.CachedBmp_315();
	this.instance_229.setTransform(9.95,102.1,0.5,0.5);

	this.instance_230 = new lib.Path_64();
	this.instance_230.setTransform(1292.85,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_230.alpha = 0.1992;
	this.instance_230.compositeOperation = "multiply";

	this.instance_231 = new lib.CachedBmp_217();
	this.instance_231.setTransform(1275.2,70.75,0.5,0.5);

	this.instance_232 = new lib.Path_63();
	this.instance_232.setTransform(1254.2,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_232.alpha = 0.1992;
	this.instance_232.compositeOperation = "multiply";

	this.instance_233 = new lib.CachedBmp_217();
	this.instance_233.setTransform(1236.55,70.75,0.5,0.5);

	this.instance_234 = new lib.Path_62();
	this.instance_234.setTransform(1217.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_234.alpha = 0.1992;
	this.instance_234.compositeOperation = "multiply";

	this.instance_235 = new lib.CachedBmp_217();
	this.instance_235.setTransform(1199.75,70.75,0.5,0.5);

	this.instance_236 = new lib.Path_61();
	this.instance_236.setTransform(1178.75,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_236.alpha = 0.1992;
	this.instance_236.compositeOperation = "multiply";

	this.instance_237 = new lib.CachedBmp_217();
	this.instance_237.setTransform(1161.1,70.75,0.5,0.5);

	this.instance_238 = new lib.Path_60();
	this.instance_238.setTransform(1140.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_238.alpha = 0.1992;
	this.instance_238.compositeOperation = "multiply";

	this.instance_239 = new lib.CachedBmp_199();
	this.instance_239.setTransform(1122.4,70.75,0.5,0.5);

	this.instance_240 = new lib.Path_59();
	this.instance_240.setTransform(1101.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_240.alpha = 0.1992;
	this.instance_240.compositeOperation = "multiply";

	this.instance_241 = new lib.CachedBmp_217();
	this.instance_241.setTransform(1083.75,70.75,0.5,0.5);

	this.instance_242 = new lib.Path_58();
	this.instance_242.setTransform(1062.75,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_242.alpha = 0.1992;
	this.instance_242.compositeOperation = "multiply";

	this.instance_243 = new lib.CachedBmp_217();
	this.instance_243.setTransform(1045.1,70.75,0.5,0.5);

	this.instance_244 = new lib.Path_57();
	this.instance_244.setTransform(1024.1,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_244.alpha = 0.1992;
	this.instance_244.compositeOperation = "multiply";

	this.instance_245 = new lib.CachedBmp_217();
	this.instance_245.setTransform(1006.4,70.75,0.5,0.5);

	this.instance_246 = new lib.Path_56();
	this.instance_246.setTransform(946.75,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_246.alpha = 0.1992;
	this.instance_246.compositeOperation = "multiply";

	this.instance_247 = new lib.CachedBmp_217();
	this.instance_247.setTransform(929.1,70.75,0.5,0.5);

	this.instance_248 = new lib.Path_55();
	this.instance_248.setTransform(907.8,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_248.alpha = 0.1992;
	this.instance_248.compositeOperation = "multiply";

	this.instance_249 = new lib.CachedBmp_217();
	this.instance_249.setTransform(890.15,70.75,0.5,0.5);

	this.instance_250 = new lib.Path_54();
	this.instance_250.setTransform(869.15,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_250.alpha = 0.1992;
	this.instance_250.compositeOperation = "multiply";

	this.instance_251 = new lib.CachedBmp_217();
	this.instance_251.setTransform(851.5,70.75,0.5,0.5);

	this.instance_252 = new lib.Path_53();
	this.instance_252.setTransform(830.45,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_252.alpha = 0.1992;
	this.instance_252.compositeOperation = "multiply";

	this.instance_253 = new lib.CachedBmp_217();
	this.instance_253.setTransform(812.8,70.75,0.5,0.5);

	this.instance_254 = new lib.Path_52();
	this.instance_254.setTransform(791.8,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_254.alpha = 0.1992;
	this.instance_254.compositeOperation = "multiply";

	this.instance_255 = new lib.CachedBmp_217();
	this.instance_255.setTransform(774.15,70.75,0.5,0.5);

	this.instance_256 = new lib.Path_51();
	this.instance_256.setTransform(753.1,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_256.alpha = 0.1992;
	this.instance_256.compositeOperation = "multiply";

	this.instance_257 = new lib.CachedBmp_199();
	this.instance_257.setTransform(735.45,70.75,0.5,0.5);

	this.instance_258 = new lib.Path_50();
	this.instance_258.setTransform(714.45,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_258.alpha = 0.1992;
	this.instance_258.compositeOperation = "multiply";

	this.instance_259 = new lib.CachedBmp_217();
	this.instance_259.setTransform(696.8,70.75,0.5,0.5);

	this.instance_260 = new lib.Path_49();
	this.instance_260.setTransform(675.8,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_260.alpha = 0.1992;
	this.instance_260.compositeOperation = "multiply";

	this.instance_261 = new lib.CachedBmp_217();
	this.instance_261.setTransform(658.15,70.75,0.5,0.5);

	this.instance_262 = new lib.Path_48();
	this.instance_262.setTransform(637.15,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_262.alpha = 0.1992;
	this.instance_262.compositeOperation = "multiply";

	this.instance_263 = new lib.CachedBmp_217();
	this.instance_263.setTransform(619.45,70.75,0.5,0.5);

	this.instance_264 = new lib.Path_47();
	this.instance_264.setTransform(598.45,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_264.alpha = 0.1992;
	this.instance_264.compositeOperation = "multiply";

	this.instance_265 = new lib.CachedBmp_217();
	this.instance_265.setTransform(580.8,70.75,0.5,0.5);

	this.instance_266 = new lib.Path_46();
	this.instance_266.setTransform(559.8,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_266.alpha = 0.1992;
	this.instance_266.compositeOperation = "multiply";

	this.instance_267 = new lib.CachedBmp_217();
	this.instance_267.setTransform(542.15,70.75,0.5,0.5);

	this.instance_268 = new lib.Path_45();
	this.instance_268.setTransform(521.1,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_268.alpha = 0.1992;
	this.instance_268.compositeOperation = "multiply";

	this.instance_269 = new lib.CachedBmp_199();
	this.instance_269.setTransform(503.45,70.75,0.5,0.5);

	this.instance_270 = new lib.Path_44();
	this.instance_270.setTransform(482.45,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_270.alpha = 0.1992;
	this.instance_270.compositeOperation = "multiply";

	this.instance_271 = new lib.CachedBmp_217();
	this.instance_271.setTransform(464.8,70.75,0.5,0.5);

	this.instance_272 = new lib.Path_43();
	this.instance_272.setTransform(443.8,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_272.alpha = 0.1992;
	this.instance_272.compositeOperation = "multiply";

	this.instance_273 = new lib.CachedBmp_217();
	this.instance_273.setTransform(426.15,70.75,0.5,0.5);

	this.instance_274 = new lib.Path_42();
	this.instance_274.setTransform(405.1,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_274.alpha = 0.1992;
	this.instance_274.compositeOperation = "multiply";

	this.instance_275 = new lib.CachedBmp_217();
	this.instance_275.setTransform(387.45,70.75,0.5,0.5);

	this.instance_276 = new lib.Path_41();
	this.instance_276.setTransform(366.45,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_276.alpha = 0.1992;
	this.instance_276.compositeOperation = "multiply";

	this.instance_277 = new lib.CachedBmp_217();
	this.instance_277.setTransform(348.8,70.75,0.5,0.5);

	this.instance_278 = new lib.Path_40();
	this.instance_278.setTransform(289.1,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_278.alpha = 0.1992;
	this.instance_278.compositeOperation = "multiply";

	this.instance_279 = new lib.CachedBmp_217();
	this.instance_279.setTransform(271.45,70.75,0.5,0.5);

	this.instance_280 = new lib.Path_39();
	this.instance_280.setTransform(250.45,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_280.alpha = 0.1992;
	this.instance_280.compositeOperation = "multiply";

	this.instance_281 = new lib.CachedBmp_217();
	this.instance_281.setTransform(232.8,70.75,0.5,0.5);

	this.instance_282 = new lib.Path_38();
	this.instance_282.setTransform(95.3,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_282.alpha = 0.1992;
	this.instance_282.compositeOperation = "multiply";

	this.instance_283 = new lib.CachedBmp_217();
	this.instance_283.setTransform(77.65,70.75,0.5,0.5);

	this.instance_284 = new lib.Path_37();
	this.instance_284.setTransform(56.65,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_284.alpha = 0.1992;
	this.instance_284.compositeOperation = "multiply";

	this.instance_285 = new lib.CachedBmp_217();
	this.instance_285.setTransform(39,70.75,0.5,0.5);

	this.instance_286 = new lib.Path_36();
	this.instance_286.setTransform(18,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_286.alpha = 0.1992;
	this.instance_286.compositeOperation = "multiply";

	this.instance_287 = new lib.CachedBmp_217();
	this.instance_287.setTransform(0.35,70.75,0.5,0.5);

	this.instance_288 = new lib.Path_35();
	this.instance_288.setTransform(211.8,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_288.alpha = 0.1992;
	this.instance_288.compositeOperation = "multiply";

	this.instance_289 = new lib.CachedBmp_217();
	this.instance_289.setTransform(194.15,70.75,0.5,0.5);

	this.instance_290 = new lib.Path_34();
	this.instance_290.setTransform(173.1,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_290.alpha = 0.1992;
	this.instance_290.compositeOperation = "multiply";

	this.instance_291 = new lib.CachedBmp_217();
	this.instance_291.setTransform(155.45,70.75,0.5,0.5);

	this.instance_292 = new lib.Path_33();
	this.instance_292.setTransform(134.45,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_292.alpha = 0.1992;
	this.instance_292.compositeOperation = "multiply";

	this.instance_293 = new lib.CachedBmp_217();
	this.instance_293.setTransform(116.8,70.75,0.5,0.5);

	this.instance_294 = new lib.Path_32();
	this.instance_294.setTransform(1273.55,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_294.alpha = 0.1992;
	this.instance_294.compositeOperation = "multiply";

	this.instance_295 = new lib.CachedBmp_194();
	this.instance_295.setTransform(1255.9,15.1,0.5,0.5);

	this.instance_296 = new lib.Path_31();
	this.instance_296.setTransform(1235.05,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_296.alpha = 0.1992;
	this.instance_296.compositeOperation = "multiply";

	this.instance_297 = new lib.CachedBmp_194();
	this.instance_297.setTransform(1217.4,15.1,0.5,0.5);

	this.instance_298 = new lib.Path_30();
	this.instance_298.setTransform(1196.35,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_298.alpha = 0.1992;
	this.instance_298.compositeOperation = "multiply";

	this.instance_299 = new lib.CachedBmp_194();
	this.instance_299.setTransform(1178.7,15.1,0.5,0.5);

	this.instance_300 = new lib.Path_29();
	this.instance_300.setTransform(1158.35,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_300.alpha = 0.1992;
	this.instance_300.compositeOperation = "multiply";

	this.instance_301 = new lib.CachedBmp_191();
	this.instance_301.setTransform(1140.7,15.1,0.5,0.5);

	this.instance_302 = new lib.Path_28();
	this.instance_302.setTransform(1119.85,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_302.alpha = 0.1992;
	this.instance_302.compositeOperation = "multiply";

	this.instance_303 = new lib.CachedBmp_194();
	this.instance_303.setTransform(1102.2,15.1,0.5,0.5);

	this.instance_304 = new lib.Path_27();
	this.instance_304.setTransform(1081.2,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_304.alpha = 0.1992;
	this.instance_304.compositeOperation = "multiply";

	this.instance_305 = new lib.CachedBmp_194();
	this.instance_305.setTransform(1063.55,15.1,0.5,0.5);

	this.instance_306 = new lib.Path_26();
	this.instance_306.setTransform(1042.5,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_306.alpha = 0.1992;
	this.instance_306.compositeOperation = "multiply";

	this.instance_307 = new lib.CachedBmp_194();
	this.instance_307.setTransform(1024.85,15.1,0.5,0.5);

	this.instance_308 = new lib.Path_25();
	this.instance_308.setTransform(1003.85,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_308.alpha = 0.1992;
	this.instance_308.compositeOperation = "multiply";

	this.instance_309 = new lib.CachedBmp_194();
	this.instance_309.setTransform(986.2,15.1,0.5,0.5);

	this.instance_310 = new lib.Path_24();
	this.instance_310.setTransform(926.55,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_310.alpha = 0.1992;
	this.instance_310.compositeOperation = "multiply";

	this.instance_311 = new lib.CachedBmp_191();
	this.instance_311.setTransform(908.9,15.1,0.5,0.5);

	this.instance_312 = new lib.Path_23();
	this.instance_312.setTransform(888.05,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_312.alpha = 0.1992;
	this.instance_312.compositeOperation = "multiply";

	this.instance_313 = new lib.CachedBmp_194();
	this.instance_313.setTransform(870.4,15.1,0.5,0.5);

	this.instance_314 = new lib.Path_22();
	this.instance_314.setTransform(849.4,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_314.alpha = 0.1992;
	this.instance_314.compositeOperation = "multiply";

	this.instance_315 = new lib.CachedBmp_194();
	this.instance_315.setTransform(831.75,15.1,0.5,0.5);

	this.instance_316 = new lib.Path_21();
	this.instance_316.setTransform(810.7,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_316.alpha = 0.1992;
	this.instance_316.compositeOperation = "multiply";

	this.instance_317 = new lib.CachedBmp_194();
	this.instance_317.setTransform(793.05,15.1,0.5,0.5);

	this.instance_318 = new lib.Path_20();
	this.instance_318.setTransform(772.05,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_318.alpha = 0.1992;
	this.instance_318.compositeOperation = "multiply";

	this.instance_319 = new lib.CachedBmp_194();
	this.instance_319.setTransform(754.4,15.1,0.5,0.5);

	this.instance_320 = new lib.Path_19();
	this.instance_320.setTransform(733.4,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_320.alpha = 0.1992;
	this.instance_320.compositeOperation = "multiply";

	this.instance_321 = new lib.CachedBmp_194();
	this.instance_321.setTransform(715.75,15.1,0.5,0.5);

	this.instance_322 = new lib.Path_18();
	this.instance_322.setTransform(694.7,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_322.alpha = 0.1992;
	this.instance_322.compositeOperation = "multiply";

	this.instance_323 = new lib.CachedBmp_194();
	this.instance_323.setTransform(677.05,15.1,0.5,0.5);

	this.instance_324 = new lib.Path_17();
	this.instance_324.setTransform(656.05,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_324.alpha = 0.1992;
	this.instance_324.compositeOperation = "multiply";

	this.instance_325 = new lib.CachedBmp_194();
	this.instance_325.setTransform(638.4,15.1,0.5,0.5);

	this.instance_326 = new lib.Path_16();
	this.instance_326.setTransform(617.4,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_326.alpha = 0.1992;
	this.instance_326.compositeOperation = "multiply";

	this.instance_327 = new lib.CachedBmp_194();
	this.instance_327.setTransform(599.75,15.1,0.5,0.5);

	this.instance_328 = new lib.Path_15();
	this.instance_328.setTransform(578.7,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_328.alpha = 0.1992;
	this.instance_328.compositeOperation = "multiply";

	this.instance_329 = new lib.CachedBmp_194();
	this.instance_329.setTransform(561.05,15.1,0.5,0.5);

	this.instance_330 = new lib.Path_14();
	this.instance_330.setTransform(540.05,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_330.alpha = 0.1992;
	this.instance_330.compositeOperation = "multiply";

	this.instance_331 = new lib.CachedBmp_194();
	this.instance_331.setTransform(522.4,15.1,0.5,0.5);

	this.instance_332 = new lib.Path_13();
	this.instance_332.setTransform(501.4,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_332.alpha = 0.1992;
	this.instance_332.compositeOperation = "multiply";

	this.instance_333 = new lib.CachedBmp_191();
	this.instance_333.setTransform(483.7,15.1,0.5,0.5);

	this.instance_334 = new lib.Path_12();
	this.instance_334.setTransform(462.7,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_334.alpha = 0.1992;
	this.instance_334.compositeOperation = "multiply";

	this.instance_335 = new lib.CachedBmp_194();
	this.instance_335.setTransform(445.05,15.1,0.5,0.5);

	this.instance_336 = new lib.Path_9();
	this.instance_336.setTransform(424.05,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_336.alpha = 0.1992;
	this.instance_336.compositeOperation = "multiply";

	this.instance_337 = new lib.CachedBmp_194();
	this.instance_337.setTransform(406.4,15.1,0.5,0.5);

	this.instance_338 = new lib.Path_8();
	this.instance_338.setTransform(385.35,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_338.alpha = 0.1992;
	this.instance_338.compositeOperation = "multiply";

	this.instance_339 = new lib.CachedBmp_194();
	this.instance_339.setTransform(367.75,15.1,0.5,0.5);

	this.instance_340 = new lib.Path_7();
	this.instance_340.setTransform(308.05,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_340.alpha = 0.1992;
	this.instance_340.compositeOperation = "multiply";

	this.instance_341 = new lib.CachedBmp_194();
	this.instance_341.setTransform(290.4,15.1,0.5,0.5);

	this.instance_342 = new lib.Path_6();
	this.instance_342.setTransform(269.4,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_342.alpha = 0.1992;
	this.instance_342.compositeOperation = "multiply";

	this.instance_343 = new lib.CachedBmp_191();
	this.instance_343.setTransform(251.7,15.1,0.5,0.5);

	this.instance_344 = new lib.Path_5();
	this.instance_344.setTransform(230.7,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_344.alpha = 0.1992;
	this.instance_344.compositeOperation = "multiply";

	this.instance_345 = new lib.CachedBmp_194();
	this.instance_345.setTransform(213.05,15.1,0.5,0.5);

	this.instance_346 = new lib.Path_4();
	this.instance_346.setTransform(77.4,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_346.alpha = 0.1992;
	this.instance_346.compositeOperation = "multiply";

	this.instance_347 = new lib.CachedBmp_194();
	this.instance_347.setTransform(59.75,15.1,0.5,0.5);

	this.instance_348 = new lib.Path_3();
	this.instance_348.setTransform(38.75,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_348.alpha = 0.1992;
	this.instance_348.compositeOperation = "multiply";

	this.instance_349 = new lib.CachedBmp_194();
	this.instance_349.setTransform(21.1,15.1,0.5,0.5);

	this.instance_350 = new lib.Path_2();
	this.instance_350.setTransform(192.05,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_350.alpha = 0.1992;
	this.instance_350.compositeOperation = "multiply";

	this.instance_351 = new lib.CachedBmp_194();
	this.instance_351.setTransform(174.4,15.1,0.5,0.5);

	this.instance_352 = new lib.Path_1();
	this.instance_352.setTransform(153.35,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_352.alpha = 0.1992;
	this.instance_352.compositeOperation = "multiply";

	this.instance_353 = new lib.CachedBmp_194();
	this.instance_353.setTransform(135.7,15.1,0.5,0.5);

	this.instance_354 = new lib.Path_0();
	this.instance_354.setTransform(114.7,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_354.alpha = 0.1992;
	this.instance_354.compositeOperation = "multiply";

	this.instance_355 = new lib.CachedBmp_194();
	this.instance_355.setTransform(97.05,15.1,0.5,0.5);

	this.instance_356 = new lib.Path_10();
	this.instance_356.setTransform(650.05,89.8,1,1,0,0,0,626.5,80.8);
	this.instance_356.compositeOperation = "multiply";

	this.instance_357 = new lib.Path_11();
	this.instance_357.setTransform(1851.9,89.8,1,1,0,0,0,509.4,80.8);
	this.instance_357.compositeOperation = "multiply";

	this.instance_358 = new lib.Group_235();
	this.instance_358.setTransform(1748.45,938,1,1,0,0,0,72.5,8.3);
	this.instance_358.compositeOperation = "screen";

	this.instance_359 = new lib.Group_236();
	this.instance_359.setTransform(690.7,938,1,1,0,0,0,72.5,8.3);
	this.instance_359.compositeOperation = "screen";

	this.instance_360 = new lib.Group_237();
	this.instance_360.setTransform(1676.55,285.35,1,1,0,0,0,63.9,6.4);
	this.instance_360.compositeOperation = "screen";

	this.instance_361 = new lib.Group_238();
	this.instance_361.setTransform(1779.45,696,1,1,0,0,0,72.5,8.3);
	this.instance_361.compositeOperation = "screen";

	this.instance_362 = new lib.CachedBmp_314();
	this.instance_362.setTransform(1288.3,252.85,0.5,0.5);

	this.instance_363 = new lib.Group_240();
	this.instance_363.setTransform(618.85,285.35,1,1,0,0,0,63.9,6.4);
	this.instance_363.compositeOperation = "screen";

	this.instance_364 = new lib.Group_241();
	this.instance_364.setTransform(721.7,696,1,1,0,0,0,72.5,8.3);
	this.instance_364.compositeOperation = "screen";

	this.instance_365 = new lib.CachedBmp_313();
	this.instance_365.setTransform(0,0,0.5,0.5);

	this.instance_366 = new lib.Path();
	this.instance_366.setTransform(2284.2,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_366.alpha = 0.1992;
	this.instance_366.compositeOperation = "multiply";

	this.instance_367 = new lib.CachedBmp_194();
	this.instance_367.setTransform(2266.55,15.1,0.5,0.5);

	var maskedShapeInstanceList = [this.instance,this.instance_1,this.instance_2,this.instance_3,this.instance_4,this.instance_5,this.instance_6,this.instance_7,this.instance_8,this.instance_9,this.instance_10,this.instance_11,this.instance_12,this.instance_13,this.instance_14,this.instance_15,this.instance_16,this.instance_17,this.instance_18,this.instance_19,this.instance_20,this.instance_21,this.instance_22,this.instance_23,this.instance_24,this.instance_25,this.instance_26,this.instance_27,this.instance_28,this.instance_29,this.instance_30,this.instance_31,this.instance_32,this.instance_33,this.instance_34,this.instance_35,this.instance_36,this.instance_37,this.instance_38,this.instance_39,this.instance_40,this.instance_41,this.instance_42,this.instance_43,this.instance_44,this.instance_45,this.instance_46,this.instance_47,this.instance_48,this.instance_49,this.instance_50,this.instance_51,this.instance_52,this.instance_53,this.instance_54,this.instance_55,this.instance_56,this.instance_57,this.instance_58,this.instance_59,this.instance_60,this.instance_61,this.instance_62,this.instance_63,this.instance_64,this.instance_65,this.instance_66,this.instance_67,this.instance_68,this.instance_69,this.instance_70,this.instance_71,this.instance_72,this.instance_73,this.instance_74,this.instance_75,this.instance_76,this.instance_77,this.instance_78,this.instance_79,this.instance_80,this.instance_81,this.instance_82,this.instance_83,this.instance_84,this.instance_85,this.instance_86,this.instance_87,this.instance_88,this.instance_89,this.instance_90,this.instance_91,this.instance_92,this.instance_93,this.instance_94,this.instance_95,this.instance_96,this.instance_97,this.instance_98,this.instance_99,this.instance_100,this.instance_101,this.instance_102,this.instance_103,this.instance_104,this.instance_105,this.instance_106,this.instance_107,this.instance_108,this.instance_109,this.instance_110,this.instance_111,this.instance_112,this.instance_113,this.instance_114,this.instance_115,this.instance_116,this.instance_117,this.instance_118,this.instance_119,this.instance_120,this.instance_121,this.instance_122,this.instance_123,this.instance_124,this.instance_125,this.instance_126,this.instance_127,this.instance_128,this.instance_129,this.instance_130,this.instance_131,this.instance_132,this.instance_133,this.instance_134,this.instance_135,this.instance_136,this.instance_137,this.instance_138,this.instance_139,this.instance_140,this.instance_141,this.instance_142,this.instance_143,this.instance_144,this.instance_145,this.instance_146,this.instance_147,this.instance_148,this.instance_149,this.instance_150,this.instance_151,this.instance_152,this.instance_153,this.instance_154,this.instance_155,this.instance_156,this.instance_157,this.instance_158,this.instance_159,this.instance_160,this.instance_161,this.instance_162,this.instance_163,this.instance_164,this.instance_165,this.instance_166,this.instance_167,this.instance_168,this.instance_169,this.instance_170,this.instance_171,this.instance_172,this.instance_173,this.instance_174,this.instance_175,this.instance_176,this.instance_177,this.instance_178,this.instance_179,this.instance_180,this.instance_181,this.instance_182,this.instance_183,this.instance_184,this.instance_185,this.instance_186,this.instance_187,this.instance_188,this.instance_189,this.instance_190,this.instance_191,this.instance_192,this.instance_193,this.instance_194,this.instance_195,this.instance_196,this.instance_197,this.instance_198,this.instance_199,this.instance_200,this.instance_201,this.instance_202,this.instance_203,this.instance_204,this.instance_205,this.instance_206,this.instance_207,this.instance_208,this.instance_209,this.instance_210,this.instance_211,this.instance_212,this.instance_213,this.instance_214,this.instance_215,this.instance_216,this.instance_217,this.instance_218,this.instance_219,this.instance_220,this.instance_221,this.instance_222,this.instance_223,this.instance_224,this.instance_225,this.instance_226,this.instance_227,this.instance_228,this.instance_229,this.instance_230,this.instance_231,this.instance_232,this.instance_233,this.instance_234,this.instance_235,this.instance_236,this.instance_237,this.instance_238,this.instance_239,this.instance_240,this.instance_241,this.instance_242,this.instance_243,this.instance_244,this.instance_245,this.instance_246,this.instance_247,this.instance_248,this.instance_249,this.instance_250,this.instance_251,this.instance_252,this.instance_253,this.instance_254,this.instance_255,this.instance_256,this.instance_257,this.instance_258,this.instance_259,this.instance_260,this.instance_261,this.instance_262,this.instance_263,this.instance_264,this.instance_265,this.instance_266,this.instance_267,this.instance_268,this.instance_269,this.instance_270,this.instance_271,this.instance_272,this.instance_273,this.instance_274,this.instance_275,this.instance_276,this.instance_277,this.instance_278,this.instance_279,this.instance_280,this.instance_281,this.instance_282,this.instance_283,this.instance_284,this.instance_285,this.instance_286,this.instance_287,this.instance_288,this.instance_289,this.instance_290,this.instance_291,this.instance_292,this.instance_293,this.instance_294,this.instance_295,this.instance_296,this.instance_297,this.instance_298,this.instance_299,this.instance_300,this.instance_301,this.instance_302,this.instance_303,this.instance_304,this.instance_305,this.instance_306,this.instance_307,this.instance_308,this.instance_309,this.instance_310,this.instance_311,this.instance_312,this.instance_313,this.instance_314,this.instance_315,this.instance_316,this.instance_317,this.instance_318,this.instance_319,this.instance_320,this.instance_321,this.instance_322,this.instance_323,this.instance_324,this.instance_325,this.instance_326,this.instance_327,this.instance_328,this.instance_329,this.instance_330,this.instance_331,this.instance_332,this.instance_333,this.instance_334,this.instance_335,this.instance_336,this.instance_337,this.instance_338,this.instance_339,this.instance_340,this.instance_341,this.instance_342,this.instance_343,this.instance_344,this.instance_345,this.instance_346,this.instance_347,this.instance_348,this.instance_349,this.instance_350,this.instance_351,this.instance_352,this.instance_353,this.instance_354,this.instance_355,this.instance_356,this.instance_357,this.instance_358,this.instance_359,this.instance_360,this.instance_361,this.instance_362,this.instance_363,this.instance_364,this.instance_365,this.instance_366,this.instance_367];

	for(var shapedInstanceItr = 0; shapedInstanceItr < maskedShapeInstanceList.length; shapedInstanceItr++) {
		maskedShapeInstanceList[shapedInstanceItr].mask = mask;
	}

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_367},{t:this.instance_366},{t:this.instance_365},{t:this.instance_364},{t:this.instance_363},{t:this.instance_362},{t:this.instance_361},{t:this.instance_360},{t:this.instance_359},{t:this.instance_358},{t:this.instance_357},{t:this.instance_356},{t:this.instance_355},{t:this.instance_354},{t:this.instance_353},{t:this.instance_352},{t:this.instance_351},{t:this.instance_350},{t:this.instance_349},{t:this.instance_348},{t:this.instance_347},{t:this.instance_346},{t:this.instance_345},{t:this.instance_344},{t:this.instance_343},{t:this.instance_342},{t:this.instance_341},{t:this.instance_340},{t:this.instance_339},{t:this.instance_338},{t:this.instance_337},{t:this.instance_336},{t:this.instance_335},{t:this.instance_334},{t:this.instance_333},{t:this.instance_332},{t:this.instance_331},{t:this.instance_330},{t:this.instance_329},{t:this.instance_328},{t:this.instance_327},{t:this.instance_326},{t:this.instance_325},{t:this.instance_324},{t:this.instance_323},{t:this.instance_322},{t:this.instance_321},{t:this.instance_320},{t:this.instance_319},{t:this.instance_318},{t:this.instance_317},{t:this.instance_316},{t:this.instance_315},{t:this.instance_314},{t:this.instance_313},{t:this.instance_312},{t:this.instance_311},{t:this.instance_310},{t:this.instance_309},{t:this.instance_308},{t:this.instance_307},{t:this.instance_306},{t:this.instance_305},{t:this.instance_304},{t:this.instance_303},{t:this.instance_302},{t:this.instance_301},{t:this.instance_300},{t:this.instance_299},{t:this.instance_298},{t:this.instance_297},{t:this.instance_296},{t:this.instance_295},{t:this.instance_294},{t:this.instance_293},{t:this.instance_292},{t:this.instance_291},{t:this.instance_290},{t:this.instance_289},{t:this.instance_288},{t:this.instance_287},{t:this.instance_286},{t:this.instance_285},{t:this.instance_284},{t:this.instance_283},{t:this.instance_282},{t:this.instance_281},{t:this.instance_280},{t:this.instance_279},{t:this.instance_278},{t:this.instance_277},{t:this.instance_276},{t:this.instance_275},{t:this.instance_274},{t:this.instance_273},{t:this.instance_272},{t:this.instance_271},{t:this.instance_270},{t:this.instance_269},{t:this.instance_268},{t:this.instance_267},{t:this.instance_266},{t:this.instance_265},{t:this.instance_264},{t:this.instance_263},{t:this.instance_262},{t:this.instance_261},{t:this.instance_260},{t:this.instance_259},{t:this.instance_258},{t:this.instance_257},{t:this.instance_256},{t:this.instance_255},{t:this.instance_254},{t:this.instance_253},{t:this.instance_252},{t:this.instance_251},{t:this.instance_250},{t:this.instance_249},{t:this.instance_248},{t:this.instance_247},{t:this.instance_246},{t:this.instance_245},{t:this.instance_244},{t:this.instance_243},{t:this.instance_242},{t:this.instance_241},{t:this.instance_240},{t:this.instance_239},{t:this.instance_238},{t:this.instance_237},{t:this.instance_236},{t:this.instance_235},{t:this.instance_234},{t:this.instance_233},{t:this.instance_232},{t:this.instance_231},{t:this.instance_230},{t:this.instance_229},{t:this.instance_228},{t:this.instance_227},{t:this.instance_226},{t:this.instance_225},{t:this.instance_224},{t:this.instance_223},{t:this.instance_222},{t:this.instance_221},{t:this.instance_220},{t:this.instance_219},{t:this.instance_218},{t:this.instance_217},{t:this.instance_216},{t:this.instance_215},{t:this.instance_214},{t:this.instance_213},{t:this.instance_212},{t:this.instance_211},{t:this.instance_210},{t:this.instance_209},{t:this.instance_208},{t:this.instance_207},{t:this.instance_206},{t:this.instance_205},{t:this.instance_204},{t:this.instance_203},{t:this.instance_202},{t:this.instance_201},{t:this.instance_200},{t:this.instance_199},{t:this.instance_198},{t:this.instance_197},{t:this.instance_196},{t:this.instance_195},{t:this.instance_194},{t:this.instance_193},{t:this.instance_192},{t:this.instance_191},{t:this.instance_190},{t:this.instance_189},{t:this.instance_188},{t:this.instance_187},{t:this.instance_186},{t:this.instance_185},{t:this.instance_184},{t:this.instance_183},{t:this.instance_182},{t:this.instance_181},{t:this.instance_180},{t:this.instance_179},{t:this.instance_178},{t:this.instance_177},{t:this.instance_176},{t:this.instance_175},{t:this.instance_174},{t:this.instance_173},{t:this.instance_172},{t:this.instance_171},{t:this.instance_170},{t:this.instance_169},{t:this.instance_168},{t:this.instance_167},{t:this.instance_166},{t:this.instance_165},{t:this.instance_164},{t:this.instance_163},{t:this.instance_162},{t:this.instance_161},{t:this.instance_160},{t:this.instance_159},{t:this.instance_158},{t:this.instance_157},{t:this.instance_156},{t:this.instance_155},{t:this.instance_154},{t:this.instance_153},{t:this.instance_152},{t:this.instance_151},{t:this.instance_150},{t:this.instance_149},{t:this.instance_148},{t:this.instance_147},{t:this.instance_146},{t:this.instance_145},{t:this.instance_144},{t:this.instance_143},{t:this.instance_142},{t:this.instance_141},{t:this.instance_140},{t:this.instance_139},{t:this.instance_138},{t:this.instance_137},{t:this.instance_136},{t:this.instance_135},{t:this.instance_134},{t:this.instance_133},{t:this.instance_132},{t:this.instance_131},{t:this.instance_130},{t:this.instance_129},{t:this.instance_128},{t:this.instance_127},{t:this.instance_126},{t:this.instance_125},{t:this.instance_124},{t:this.instance_123},{t:this.instance_122},{t:this.instance_121},{t:this.instance_120},{t:this.instance_119},{t:this.instance_118},{t:this.instance_117},{t:this.instance_116},{t:this.instance_115},{t:this.instance_114},{t:this.instance_113},{t:this.instance_112},{t:this.instance_111},{t:this.instance_110},{t:this.instance_109},{t:this.instance_108},{t:this.instance_107},{t:this.instance_106},{t:this.instance_105},{t:this.instance_104},{t:this.instance_103},{t:this.instance_102},{t:this.instance_101},{t:this.instance_100},{t:this.instance_99},{t:this.instance_98},{t:this.instance_97},{t:this.instance_96},{t:this.instance_95},{t:this.instance_94},{t:this.instance_93},{t:this.instance_92},{t:this.instance_91},{t:this.instance_90},{t:this.instance_89},{t:this.instance_88},{t:this.instance_87},{t:this.instance_86},{t:this.instance_85},{t:this.instance_84},{t:this.instance_83},{t:this.instance_82},{t:this.instance_81},{t:this.instance_80},{t:this.instance_79},{t:this.instance_78},{t:this.instance_77},{t:this.instance_76},{t:this.instance_75},{t:this.instance_74},{t:this.instance_73},{t:this.instance_72},{t:this.instance_71},{t:this.instance_70},{t:this.instance_69},{t:this.instance_68},{t:this.instance_67},{t:this.instance_66},{t:this.instance_65},{t:this.instance_64},{t:this.instance_63},{t:this.instance_62},{t:this.instance_61},{t:this.instance_60},{t:this.instance_59},{t:this.instance_58},{t:this.instance_57},{t:this.instance_56},{t:this.instance_55},{t:this.instance_54},{t:this.instance_53},{t:this.instance_52},{t:this.instance_51},{t:this.instance_50},{t:this.instance_49},{t:this.instance_48},{t:this.instance_47},{t:this.instance_46},{t:this.instance_45},{t:this.instance_44},{t:this.instance_43},{t:this.instance_42},{t:this.instance_41},{t:this.instance_40},{t:this.instance_39},{t:this.instance_38},{t:this.instance_37},{t:this.instance_36},{t:this.instance_35},{t:this.instance_34},{t:this.instance_33},{t:this.instance_32},{t:this.instance_31},{t:this.instance_30},{t:this.instance_29},{t:this.instance_28},{t:this.instance_27},{t:this.instance_26},{t:this.instance_25},{t:this.instance_24},{t:this.instance_23},{t:this.instance_22},{t:this.instance_21},{t:this.instance_20},{t:this.instance_19},{t:this.instance_18},{t:this.instance_17},{t:this.instance_16},{t:this.instance_15},{t:this.instance_14},{t:this.instance_13},{t:this.instance_12},{t:this.instance_11},{t:this.instance_10},{t:this.instance_9},{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance}]}).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.ClipGroup, new cjs.Rectangle(29.9,6.5,3229,1000), null);


(lib.swimmingpool1ai = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// swimming_pool1_ai
	this.instance = new lib.ClipGroup();
	this.instance.setTransform(1707.7,510,1,1,0,0,0,1707.7,510);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,3415.5,1020.1);


(lib.Scene_1_waves = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// waves
	this.instance = new lib.wavesai("synched",0);
	this.instance.setTransform(1668.75,705.2,1,1,0,0,0,1527,20.4);

	this.instance_1 = new lib.wavesai("synched",0);
	this.instance_1.setTransform(1794.15,489.1,1,1,0,0,0,1527,20.4);

	this.instance_2 = new lib.wavesai("synched",0);
	this.instance_2.setTransform(1701.9,348.75,1,1,0,0,0,1527,20.4);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]},1).wait(564));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,3351.3,725.6);


(lib.Scene_1_Swm1RH_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Swm1RH
	this.instance = new lib.swm1Rh("synched",0);
	this.instance.setTransform(239.55,282.4,0.8527,0.8527,29.9995,0,0,23.1,26.8);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF0000").ss(5).p("AAMjXQCEADBfA8QBjA/AABZQAABZhjA/QhjBAiMAAQiLAAhjhAQhjg/AAhZQAAhZBjg/QAOgJAQgI");
	this.shape.setTransform(86.9,414.95);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f().s("#FF0000").ss(5).p("ASUESQAABxhxBQQhxBQihAAQigAAhyhQQhxhQAAhxQAAhxBxhQQByhQCgAAQChAABxBQQBxBQAABxgAs1oiQCEADBfA8QBjA/AABaQAABZhjA/QhjBAiMAAQiMAAhjhAQhjg/AAhZQAAhaBjg/QAOgJAQgI");
	this.shape_1.setTransform(170.325,448.05);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f().s("#FF0000").ss(5,1,1).p("AtMkuIaZJd");
	this.shape_2.setTransform(399.05,348.225);

	this.shape_3 = new cjs.Shape();
	this.shape_3.graphics.f().s("#FF0000").ss(1,1,1).p("ABNAuIiZAXIAdhEABNAuIhfhyIgdBFg");
	this.shape_3.setTransform(488.375,378.5);

	this.shape_4 = new cjs.Shape();
	this.shape_4.graphics.f().s("#FF0000").ss(5).p("As1oiQAqABAmAHQBSAOBBApQBjA/AABaQAABZhjA/QhjBAiMAAQiMAAhjhAQhjg/AAhZQAAhaBjg/QAOgJAQgIASUESQAABxhxBQQhxBQihAAQigAAhyhQQhxhQAAhxQAAhxBxhQQByhQCgAAQChAABxBQQBxBQAABxg");
	this.shape_4.setTransform(170.325,448.05);

	this.shape_5 = new cjs.Shape();
	this.shape_5.graphics.f("#FF0000").s().p("AgvAAIB8AtIiZAZgABNAtgAgvAAIAdhFIBfByg");
	this.shape_5.setTransform(488.375,378.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape},{t:this.instance,p:{scaleX:0.8527,scaleY:0.8527,rotation:29.9995,x:239.55,y:282.4}}]},169).to({state:[{t:this.shape_1},{t:this.instance,p:{scaleX:0.8528,scaleY:0.8528,rotation:0,x:248.8,y:282.35}}]},17).to({state:[{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.instance,p:{scaleX:0.8528,scaleY:0.8528,rotation:0,x:248.8,y:282.35}}]},57).to({state:[]},9).wait(169));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,497.1,505.3);


(lib.Scene_1_Swm1RH = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// Swm1RH
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF0000").ss(0.8).p("AA3AAQgbABgcAAQgbAAgbgB");
	this.shape.setTransform(248.85,492.6261);

	this.instance = new lib.swm1Rh("synched",0);
	this.instance.setTransform(245,491.75,0.7985,0.7985,0,0,0,23.1,276.9);

	this.instance_1 = new lib.swimmernoRH("synched",0);
	this.instance_1.setTransform(192.1,347.3,0.8222,0.8222,0,0,0,163.6,175.3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape}]},458).to({state:[]},1).to({state:[{t:this.instance_1},{t:this.instance}]},34).wait(4));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,326.9,493.8);


(lib.Scene_1_step_5 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// step_5
	this.instance = new lib.basicswimmer("synched",0);
	this.instance.setTransform(640.1,292.8,1,1,-4.8159,0,0,328.1,38.4);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(510).to({_off:false},0).wait(1).to({regX:319.7,regY:37.6,scaleX:0.9999,scaleY:0.9999,rotation:-12.2685,x:640.15,y:292.75},0).wait(1).to({regX:308.8,regY:49,scaleX:1,scaleY:1,rotation:-11.0037,x:668.5,y:305.25},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:-9.7384,x:704.9,y:305.2},0).wait(1).to({scaleX:1,scaleY:1,rotation:-8.473,x:741,y:305.9},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:-7.2077,x:777,y:307.45},0).wait(1).to({scaleX:1,scaleY:1,rotation:-5.9424,x:812.65,y:309.9},0).wait(1).to({rotation:-4.6771,x:848.2,y:313.05},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:-3.4118,x:883.45,y:317.05},0).wait(1).to({scaleX:1,scaleY:1,rotation:-2.1465,x:918.5,y:321.9},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:-0.8811,x:953.3,y:327.55},0).wait(1).to({scaleX:1,scaleY:1,rotation:0.3842,x:987.85,y:334},0).wait(1).to({rotation:1.6495,x:1022.25,y:341.35},0).wait(1).to({rotation:2.9148,x:1056.4,y:349.45},0).wait(1).to({rotation:4.1801,x:1090.35,y:358.35},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:5.4454,x:1124.05,y:368.15},0).wait(1).to({scaleX:1,scaleY:1,rotation:6.7108,x:1157.55,y:378.7},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:7.9761,x:1190.8,y:390.05},0).wait(1).to({scaleX:1,scaleY:1,rotation:9.2414,x:1223.85,y:402.3},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:10.5067,x:1256.65,y:415.35},0).wait(1).to({scaleX:1,scaleY:1,rotation:11.772,x:1289.3,y:429.2},0).wait(1).to({rotation:13.0373,x:1321.65,y:443.9},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:14.3027,x:1353.85,y:459.4},0).wait(1).to({rotation:15.568,x:1385.8,y:475.7},0).wait(1).to({scaleX:1,scaleY:1,rotation:16.8333,x:1417.55,y:492.85},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:18.0986,x:1449.1,y:510.8},0).wait(1).to({scaleX:1,scaleY:1,rotation:19.3639,x:1480.4,y:529.65},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:20.6292,x:1511.55,y:549.3},0).wait(1).to({rotation:21.8946,x:1542.45,y:569.7},0).wait(1).to({rotation:23.1599,x:1573.1,y:591},0).wait(1).to({rotation:24.4252,x:1603.6,y:613.15},0).wait(1).to({rotation:25.6905,x:1633.8,y:636.05},0).wait(1).to({rotation:22.9632,x:1665.65,y:659.85},0).wait(1).to({scaleX:1,scaleY:1,rotation:20.2359,x:1697.45,y:681.45},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:17.5086,x:1729.3,y:701},0).wait(1).to({rotation:14.7813,x:1761.15,y:718.35},0).wait(1).to({scaleX:1,scaleY:1,rotation:12.054,x:1793,y:733.45},0).wait(1).to({rotation:9.3267,x:1824.95,y:746.5},0).wait(1).to({rotation:6.5994,x:1856.9,y:757.35},0).wait(1).to({rotation:3.8721,x:1888.9,y:766.1},0).wait(1).to({rotation:1.1448,x:1920.9,y:772.65},0).wait(1).to({rotation:-1.5825,x:1952.95,y:777.1},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:-4.3098,x:1985.1,y:779.3},0).wait(1).to({scaleX:1,scaleY:1,rotation:-5.6734,x:2034.05,y:773.5},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:-7.037,x:2083.05,y:767.65},0).wait(1).to({scaleX:1,scaleY:1,rotation:-8.4006,x:2132,y:761.75},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:-9.7641,x:2181,y:755.95},0).wait(1).to({scaleX:1,scaleY:1,rotation:-11.1277,x:2230,y:750.05},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:-12.4913,x:2279,y:744.15},0).wait(1).to({rotation:-13.8549,x:2328.05,y:738.25},0).wait(1).to({scaleX:1,scaleY:1,rotation:-15.2184,x:2377.05,y:732.4},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:-16.582,x:2426.1,y:726.5},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,2737.3,862.4);


(lib.Scene_1_step_4_copy = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// step_4_copy
	this.instance = new lib.swimmer();
	this.instance.setTransform(503.3,235.05,1,1,2.0446,0,0,234.1,0);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(265).to({_off:false},0).wait(1).to({regX:310.1,regY:38.3,rotation:2.3973,x:587.5,y:276.4},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:2.7489,x:597.15,y:276.9},0).wait(1).to({scaleX:1,scaleY:1,rotation:3.1004,x:606.8,y:277.4},0).wait(1).to({rotation:3.452,x:616.3,y:277.9},0).wait(1).to({rotation:3.8035,x:625.8,y:278.45},0).wait(1).to({rotation:4.1551,x:635.3,y:279},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:4.5066,x:644.7,y:279.65},0).wait(1).to({scaleX:1,scaleY:1,rotation:4.8582,x:654.1,y:280.25},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:5.2098,x:663.45,y:280.9},0).wait(1).to({scaleX:1,scaleY:1,rotation:5.5613,x:672.75,y:281.6},0).wait(1).to({rotation:5.9129,x:682.05,y:282.3},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:6.2644,x:691.3,y:283.05},0).wait(1).to({scaleX:1,scaleY:1,rotation:6.616,x:700.45,y:283.75},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:6.9675,x:709.65,y:284.55},0).wait(1).to({scaleX:1,scaleY:1,rotation:7.3191,x:718.7,y:285.4},0).wait(1).to({rotation:7.6706,x:727.8,y:286.25},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:8.0222,x:736.85,y:287.05},0).wait(1).to({scaleX:1,scaleY:1,rotation:8.3737,x:745.75,y:288},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:8.7253,x:754.8,y:288.9},0).wait(1).to({scaleX:1,scaleY:1,rotation:9.0768,x:763.65,y:289.8},0).wait(1).to({rotation:9.4284,x:772.55,y:290.85},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:9.7799,x:781.35,y:291.8},0).wait(1).to({rotation:10.1315,x:790.15,y:292.85},0).wait(1).to({rotation:10.483,x:798.9,y:293.85},0).wait(1).to({rotation:10.8346,x:807.6,y:294.95},0).wait(1).to({rotation:11.1861,x:816.25,y:296.05},0).wait(1).to({rotation:11.5377,x:824.9,y:297.15},0).wait(1).to({rotation:11.8893,x:833.45,y:298.4},0).wait(1).to({rotation:12.2408,x:842.05,y:299.55},0).wait(1).to({rotation:12.5924,x:850.5,y:300.75},0).wait(1).to({rotation:12.9439,x:858.95,y:301.95},0).wait(1).to({rotation:13.2955,x:867.4,y:303.2},0).wait(1).to({rotation:13.647,x:875.75,y:304.5},0).wait(1).to({rotation:13.9986,x:884.15,y:305.8},0).wait(1).to({rotation:14.3501,x:892.45,y:307.15},0).wait(1).to({rotation:14.7017,x:900.7,y:308.55},0).wait(1).to({rotation:15.0532,x:908.95,y:309.95},0).wait(1).to({rotation:15.4048,x:917.15,y:311.3},0).wait(1).to({rotation:15.7563,x:925.25,y:312.8},0).wait(1).to({rotation:16.1079,x:933.35,y:314.3},0).wait(1).to({rotation:16.4594,x:941.4,y:315.8},0).wait(1).to({rotation:16.811,x:949.4,y:317.3},0).wait(1).to({rotation:17.1625,x:957.4,y:318.85},0).wait(1).to({rotation:17.5141,x:965.4,y:320.4},0).wait(1).to({rotation:17.8656,x:973.25,y:322},0).wait(1).to({rotation:18.2172,x:981.2,y:323.7},0).wait(1).to({rotation:18.5687,x:989,y:325.3},0).wait(1).to({rotation:18.9203,x:996.75,y:327},0).wait(1).to({rotation:19.2719,x:1004.5,y:328.7},0).wait(1).to({rotation:19.6234,x:1012.2,y:330.4},0).wait(1).to({rotation:19.975,x:1019.85,y:332.15},0).wait(1).to({rotation:20.3265,x:1027.5,y:333.95},0).wait(1).to({rotation:20.6781,x:1035.1,y:335.8},0).wait(1).to({rotation:21.0296,x:1042.6,y:337.6},0).wait(1).to({rotation:21.3812,x:1050.15,y:339.45},0).wait(1).to({rotation:21.7327,x:1057.6,y:341.3},0).wait(1).to({rotation:22.0843,x:1065,y:343.3},0).wait(1).to({rotation:22.4358,x:1072.45,y:345.2},0).wait(1).to({rotation:22.7874,x:1079.75,y:347.15},0).wait(1).to({rotation:23.1389,x:1087.1,y:349.15},0).wait(1).to({rotation:23.4905,x:1094.35,y:351.15},0).wait(1).to({rotation:23.842,x:1101.55,y:353.25},0).wait(1).to({rotation:24.1936,x:1108.8,y:355.3},0).wait(1).to({rotation:24.5451,x:1115.95,y:357.4},0).wait(1).to({rotation:24.8967,x:1123.05,y:359.55},0).wait(1).to({rotation:25.2482,x:1130.1,y:361.65},0).wait(1).to({rotation:25.5998,x:1137.15,y:363.8},0).wait(1).to({rotation:25.9514,x:1144.15,y:366.05},0).wait(1).to({rotation:26.3029,x:1151.1,y:368.25},0).wait(1).to({rotation:26.6545,x:1158,y:370.5},0).wait(1).to({rotation:27.006,x:1164.85,y:372.75},0).wait(1).to({rotation:27.3576,x:1171.75,y:375.05},0).wait(1).to({rotation:27.7091,x:1178.5,y:377.35},0).wait(1).to({rotation:28.0607,x:1185.3,y:379.75},0).wait(1).to({rotation:28.4122,x:1192,y:382.15},0).wait(1).to({rotation:28.7638,x:1198.65,y:384.5},0).wait(1).to({rotation:29.1153,x:1205.3,y:386.95},0).wait(1).to({rotation:29.4669,x:1211.9,y:389.4},0).wait(1).to({rotation:29.8184,x:1218.45,y:391.95},0).wait(1).to({rotation:30.17,x:1225,y:394.4},0).wait(1).to({rotation:30.5215,x:1231.5,y:396.95},0).wait(1).to({rotation:30.8731,x:1237.95,y:399.45},0).wait(1).to({rotation:31.2246,x:1244.35,y:402.1},0).wait(1).to({rotation:31.5762,x:1250.7,y:404.7},0).wait(1).to({rotation:31.9277,x:1257.05,y:407.3},0).wait(1).to({rotation:32.2793,x:1263.35,y:410},0).wait(1).to({rotation:32.6308,x:1269.55,y:412.7},0).wait(1).to({rotation:32.9824,x:1275.8,y:415.35},0).wait(1).to({rotation:33.334,x:1281.95,y:418.15},0).wait(1).to({rotation:33.6855,x:1288.1,y:420.85},0).wait(1).to({rotation:34.0371,x:1294.2,y:423.7},0).wait(1).to({rotation:34.3886,x:1300.2,y:426.45},0).wait(1).to({rotation:34.7402,x:1306.3,y:429.3},0).wait(1).to({rotation:35.0917,x:1312.25,y:432.2},0).wait(1).to({rotation:35.4433,x:1318.2,y:435.1},0).wait(1).to({rotation:35.7948,x:1324.1,y:438},0).wait(1).to({rotation:36.1464,x:1329.95,y:440.95},0).wait(1).to({rotation:36.4979,x:1335.75,y:443.9},0).wait(1).to({rotation:36.8495,x:1341.55,y:446.9},0).wait(1).to({rotation:37.201,x:1347.3,y:449.9},0).wait(1).to({rotation:37.5526,x:1353,y:453},0).wait(1).to({rotation:37.9041,x:1358.65,y:456.05},0).wait(1).to({rotation:38.2557,x:1364.3,y:459.15},0).wait(1).to({rotation:38.6072,x:1369.9,y:462.2},0).wait(1).to({rotation:38.9588,x:1375.45,y:465.4},0).wait(1).to({rotation:39.3103,x:1381,y:468.55},0).wait(1).to({rotation:39.6619,x:1386.45,y:471.8},0).wait(1).to({rotation:40.0135,x:1391.9,y:475},0).wait(1).to({rotation:40.365,x:1397.3,y:478.25},0).wait(1).to({rotation:40.7166,x:1402.6,y:481.5},0).wait(1).to({rotation:41.0681,x:1407.95,y:484.8},0).wait(1).to({rotation:41.4197,x:1413.2,y:488.1},0).wait(1).to({rotation:41.7712,x:1418.5,y:491.5},0).wait(1).to({scaleX:0.9998,scaleY:0.9998,rotation:42.1228,x:1423.65,y:494.85},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:42.4743,x:1428.9,y:498.25},0).wait(1).to({rotation:42.8259,x:1433.95,y:501.7},0).wait(1).to({scaleX:0.9998,scaleY:0.9998,rotation:43.1774,x:1439.1,y:505.15},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:43.529,x:1444.15,y:508.65},0).wait(1).to({rotation:43.8805,x:1449.15,y:512.1},0).wait(1).to({rotation:44.2321,x:1454.1,y:515.7},0).wait(1).to({scaleX:0.9998,scaleY:0.9998,rotation:44.5836,x:1459.05,y:519.2},0).wait(1).to({rotation:44.9352,x:1463.95,y:522.8},0).wait(1).to({rotation:45.2867,x:1468.85,y:526.45},0).wait(1).to({rotation:45.6383,x:1473.65,y:530},0).wait(1).to({rotation:45.9898,x:1478.4,y:533.7},0).wait(1).to({rotation:46.3414,x:1483.2,y:537.4},0).wait(1).to({scaleX:0.9999,scaleY:0.9999,rotation:46.6929,x:1487.9,y:541.05},0).wait(1).to({scaleX:0.9998,scaleY:0.9998,rotation:47.0445,x:1492.55,y:544.8},0).wait(1).to({rotation:45.9195,x:1506.35,y:557.85},0).wait(1).to({rotation:44.7945,x:1520,y:570.4},0).wait(1).to({rotation:43.6695,x:1533.65,y:582.75},0).wait(1).to({rotation:42.5445,x:1547.25,y:594.65},0).wait(1).to({rotation:41.4194,x:1560.65,y:606.25},0).wait(1).to({rotation:40.2944,x:1574.05,y:617.5},0).wait(1).to({rotation:39.1694,x:1587.25,y:628.45},0).wait(1).to({rotation:38.0444,x:1600.45,y:638.9},0).wait(1).to({rotation:36.9194,x:1613.55,y:649.15},0).wait(1).to({rotation:35.7944,x:1626.6,y:659},0).wait(1).to({rotation:34.6694,x:1639.5,y:668.5},0).wait(1).to({rotation:33.5444,x:1652.3,y:677.65},0).wait(1).to({rotation:32.4194,x:1665,y:686.45},0).wait(1).to({rotation:31.2943,x:1677.7,y:694.95},0).wait(1).to({rotation:30.1693,x:1690.25,y:703.1},0).wait(1).to({rotation:29.0443,x:1702.7,y:710.9},0).wait(1).to({rotation:27.9193,x:1715.05,y:718.35},0).wait(1).to({rotation:26.7943,x:1727.35,y:725.45},0).wait(1).to({rotation:25.6693,x:1739.5,y:732.2},0).wait(1).to({rotation:24.5443,x:1751.6,y:738.65},0).wait(1).to({rotation:23.4193,x:1763.6,y:744.7},0).wait(1).to({rotation:22.2942,x:1775.45,y:750.45},0).wait(1).to({rotation:21.1692,x:1787.25,y:755.85},0).wait(1).to({rotation:20.0442,x:1799,y:760.85},0).wait(1).to({rotation:18.9192,x:1810.6,y:765.6},0).wait(1).to({rotation:17.7942,x:1822.1,y:770},0).wait(1).to({rotation:16.6692,x:1833.5,y:774.1},0).wait(1).to({rotation:15.5442,x:1844.85,y:777.75},0).wait(1).to({rotation:14.4192,x:1856,y:781.15},0).wait(1).to({rotation:13.2942,x:1867.15,y:784.15},0).wait(1).to({rotation:12.1691,x:1878.2,y:786.85},0).wait(1).to({rotation:11.0441,x:1889.1,y:789.2},0).wait(1).to({rotation:9.9191,x:1899.9,y:791.2},0).wait(1).to({rotation:8.7941,x:1910.65,y:792.9},0).wait(1).to({rotation:7.6691,x:1921.25,y:794.25},0).wait(1).to({rotation:6.5441,x:1931.8,y:795.3},0).wait(1).to({scaleX:0.9997,scaleY:0.9997,rotation:5.4191,x:1942.25,y:795.95},0).wait(1).to({scaleX:0.9998,scaleY:0.9998,rotation:4.2941,x:1952.55,y:796.3},0).wait(1).to({rotation:3.1691,x:1962.8,y:796.35},0).wait(1).to({rotation:2.044,x:1972.85,y:796},0).wait(1).to({rotation:0.5627,x:2003,y:801.6},0).wait(1).to({scaleX:0.9997,scaleY:0.9997,rotation:-0.9186,x:2033.25,y:805.75},0).wait(1).to({scaleX:0.9998,scaleY:0.9998,rotation:-2.3999,x:2063.6,y:808.4},0).wait(1).to({rotation:-3.8812,x:2094.1,y:809.7},0).wait(1).to({scaleX:0.9997,scaleY:0.9997,rotation:-5.3625,x:2124.7,y:809.55},0).wait(1).to({scaleX:0.9998,scaleY:0.9998,rotation:-6.8439,x:2155.4,y:807.95},0).wait(1).to({rotation:-8.3252,x:2186.25,y:805},0).wait(1).to({scaleX:0.9997,scaleY:0.9997,rotation:-9.8065,x:2217.2,y:800.6},0).wait(1).to({rotation:-11.2878,x:2248.25,y:794.7},0).wait(1).to({scaleX:0.9998,scaleY:0.9998,rotation:-12.7691,x:2279.4,y:787.5},0).wait(1).to({scaleX:0.9997,scaleY:0.9997,rotation:-14.2504,x:2310.8,y:778.8},0).wait(1).to({rotation:-15.7318,x:2342.2,y:768.75},0).wait(1).to({rotation:-17.2131,x:2373.75,y:757.2},0).wait(1).to({scaleX:0.9998,scaleY:0.9998,rotation:-18.6944,x:2405.35,y:744.3},0).wait(1).to({rotation:-20.1757,x:2437.2,y:730.05},0).wait(1).to({scaleX:0.9997,scaleY:0.9997,rotation:-18.0331,x:2603.65,y:675.75},0).wait(1).to({rotation:-15.8904,x:2750.3,y:632.1},0).wait(1).to({scaleX:0.9998,scaleY:0.9998,rotation:-13.7478,x:2877.25,y:599.05},0).wait(1).to({scaleX:0.9997,scaleY:0.9997,rotation:-11.6052,x:2984.5,y:576.5},0).wait(1).to({scaleX:0.9998,scaleY:0.9998,rotation:-9.4625,x:3072.1,y:564.5},0).wait(1).to({scaleX:0.9997,scaleY:0.9997,rotation:-7.3199,x:3140.05,y:563.1},0).wait(1).to({rotation:-5.1772,x:3188.3,y:572.2},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,3501.7,903.8);


(lib.Scene_1_splash = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// splash
	this.instance = new lib.CachedBmp_288();
	this.instance.setTransform(155.85,549.55,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_289();
	this.instance_1.setTransform(155.85,550.9,0.5,0.5);

	this.instance_2 = new lib.מסלולai("synched",0);
	this.instance_2.setTransform(1693.7,695.75,1,1,0,0,0,1536.8,11);

	this.instance_3 = new lib.CachedBmp_290();
	this.instance_3.setTransform(155.85,503,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_291();
	this.instance_4.setTransform(1301.4,551.5,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_13();
	this.instance_5.setTransform(1384.9,485.7,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_292();
	this.instance_6.setTransform(1301.4,551.5,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_293();
	this.instance_7.setTransform(1301.4,551.5,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_16();
	this.instance_8.setTransform(1482.65,706.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},349).to({state:[{t:this.instance_1}]},8).to({state:[{t:this.instance_3},{t:this.instance_2,p:{x:1693.7,y:695.75}}]},11).to({state:[]},122).to({state:[{t:this.instance_5},{t:this.instance_4}]},39).to({state:[{t:this.instance_6}]},1).to({state:[{t:this.instance_8},{t:this.instance_7},{t:this.instance_2,p:{x:1692.3,y:693.1}}]},7).wait(26));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,3415.4,890.5);


(lib.Scene_1_pool = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// pool
	this.instance = new lib.swimmingpool1ai("synched",0);
	this.instance.setTransform(1677.85,440.55,1,1,0,0,0,1707.7,510);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({_off:false},0).wait(1).to({startPosition:0},0).wait(233).to({regX:1707.6,regY:509.9,x:1677.8,y:481.45},0).wait(330));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,-62.9,3229,1041);


(lib.Scene_1_maslul = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// maslul
	this.instance = new lib.מסלולai("synched",0);
	this.instance.setTransform(1692.3,693.1,1,1,0,0,0,1536.8,11);

	this.instance_1 = new lib.מסלולai("synched",0);
	this.instance_1.setTransform(1724.55,476.5,1,1,0,0,0,1536.8,11);

	this.instance_2 = new lib.מסלולai("synched",0);
	this.instance_2.setTransform(1744.15,339.35,1,1,0,0,0,1536.8,11);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]},1).wait(564));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,3280.9,704.1);


(lib.Scene_1_flash0_ai = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// flash0_ai
	this.instance = new lib.CachedBmp_294();
	this.instance.setTransform(181.8,206.95,0.5,0.5);

	this.instance_1 = new lib.basicswimmer("synched",0);
	this.instance_1.setTransform(567.9,248.05,1,1,0,0,0,308.8,49.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},503).to({state:[{t:this.instance_1}]},4).wait(3));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,877.9,396);


(lib.Scene_1_buttons = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// buttons
	this.text = new cjs.Text("דגשים לזינוק נמוך", "72px 'Comix No2 CLM'", "#0000FF");
	this.text.lineHeight = 80;
	this.text.parent = this;
	this.text.setTransform(387.5,491.3);

	this.GoFirst = new lib.Go();
	this.GoFirst.name = "GoFirst";
	this.GoFirst.setTransform(664.8,368.1,1,1,0,0,0,73.7,84.5);
	new cjs.ButtonHelper(this.GoFirst, 0, 1, 2);

	this.instance = new lib.CachedBmp_9();
	this.instance.setTransform(759.9,157.2,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_8();
	this.instance_1.setTransform(744.6,157.2,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_7();
	this.instance_2.setTransform(707.65,157.2,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_6();
	this.instance_3.setTransform(667.15,157.2,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_5();
	this.instance_4.setTransform(653.9,157.2,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_4();
	this.instance_5.setTransform(609.4,157.2,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_3();
	this.instance_6.setTransform(549.05,157.2,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_2();
	this.instance_7.setTransform(509.1,157.2,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_1();
	this.instance_8.setTransform(461.45,157.2,0.5,0.5);

	this.Replaybtn = new lib.Replay();
	this.Replaybtn.name = "Replaybtn";
	this.Replaybtn.setTransform(596.45,415.95);
	new cjs.ButtonHelper(this.Replaybtn, 0, 1, 2, false, new lib.Replay(), 3);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance},{t:this.GoFirst},{t:this.text}]}).to({state:[]},2).to({state:[{t:this.Replaybtn}]},558).wait(4));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,959.5,637);


(lib.Scene_1_basicswimmer = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// basicswimmer
	this.instance = new lib.CachedBmp_305();
	this.instance.setTransform(109.95,4.9,0.5,0.5);

	this.text = new cjs.Text("לקפוץ נכון", "48px 'Comix No2 CLM'", "#0000CC");
	this.text.textAlign = "center";
	this.text.lineHeight = 55;
	this.text.lineWidth = 289;
	this.text.parent = this;
	this.text.setTransform(671.65,264.75,0.9999,0.9999);

	this.instance_1 = new lib.CachedBmp_306();
	this.instance_1.setTransform(109.95,4.9,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_307();
	this.instance_2.setTransform(109.95,4.9,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_308();
	this.instance_3.setTransform(109.95,4.9,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_309();
	this.instance_4.setTransform(81.45,6.6,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_38();
	this.instance_5.setTransform(218.85,465.45,0.5,0.5);

	this.instance_6 = new lib.swimmernoRH("synched",0);
	this.instance_6.setTransform(189.15,343.85,0.8528,0.8528,0,0,0,163.7,178);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF0000").ss(5).p("ADkAAQAAA4hEAoQhCAoheAAQhdAAhDgoQhDgoAAg4QAAg4BDgoQBDgoBdAAQBeAABCAoQBEAoAAA4g");
	this.shape.setTransform(244.1,481.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance_1},{t:this.text}]},1).to({state:[{t:this.instance_2}]},32).to({state:[{t:this.instance_3}]},12).to({state:[{t:this.instance_5},{t:this.instance_4}]},62).to({state:[{t:this.shape},{t:this.instance_6}]},61).to({state:[{t:this.instance_6}]},17).to({state:[{t:this.instance_6}]},21).to({state:[]},45).wait(313));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,818.3,506.2);


// stage content:
(lib.Chen_Jumpper = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,2,6,153,230,258,374,400,432,493,541,560,562,564];
	this.streamSoundSymbolsList[0] = [{id:"whistle",startFrame:0,endFrame:493,loop:1,offset:0}];
	this.streamSoundSymbolsList[2] = [{id:"PourWater2",startFrame:2,endFrame:400,loop:1,offset:0}];
	this.streamSoundSymbolsList[6] = [{id:"Record1",startFrame:6,endFrame:153,loop:1,offset:0}];
	this.streamSoundSymbolsList[153] = [{id:"Record2",startFrame:153,endFrame:230,loop:1,offset:0}];
	this.streamSoundSymbolsList[230] = [{id:"whistle",startFrame:230,endFrame:258,loop:1,offset:0}];
	this.streamSoundSymbolsList[258] = [{id:"Record3",startFrame:258,endFrame:374,loop:1,offset:0}];
	this.streamSoundSymbolsList[374] = [{id:"Splash",startFrame:374,endFrame:432,loop:1,offset:0}];
	this.streamSoundSymbolsList[400] = [{id:"PourWater2",startFrame:400,endFrame:563,loop:1,offset:0}];
	this.streamSoundSymbolsList[432] = [{id:"Record4",startFrame:432,endFrame:541,loop:1,offset:0}];
	this.streamSoundSymbolsList[493] = [{id:"whistle",startFrame:493,endFrame:560,loop:1,offset:0}];
	this.streamSoundSymbolsList[541] = [{id:"Splash",startFrame:541,endFrame:559,loop:1,offset:0}];
	this.___GetDepth___ = function(obj) {
		var depth = obj.depth;
		var cameraObj = this.___camera___instance;
		if(cameraObj && cameraObj.depth && obj.isAttachedToCamera)
		{
			depth += depth + cameraObj.depth;
		}
		return depth;
		}
	this.___needSorting___ = function() {
		for (var i = 0; i < this.numChildren - 1; i++)
		{
			var prevDepth = this.___GetDepth___(this.getChildAt(i));
			var nextDepth = this.___GetDepth___(this.getChildAt(i + 1));
			if (prevDepth < nextDepth)
				return true;
		}
		return false;
	}
	this.___sortFunction___ = function(obj1, obj2) {
		return (this.exportRoot.___GetDepth___(obj2) - this.exportRoot.___GetDepth___(obj1));
	}
	this.on('tick', function (event){
		var curTimeline = event.currentTarget;
		if (curTimeline.___needSorting___()){
			this.sortChildren(curTimeline.___sortFunction___);
		}
	});

	// timeline functions:
	this.frame_0 = function() {
		this.clearAllSoundStreams();
		 
		var soundInstance = playSound("whistle",0);
		this.InsertIntoSoundStreamData(soundInstance,0,493,1);
		this.GoFirst = this.buttons.GoFirst;
		var self = this; // משתנה המכיל בתוכו את כל הבמה והאלמנטים שבה 
		self.stop(); 
		
		self.GoFirst.addEventListener("click", startPlaying);
		
		function startPlaying ()
		{
			self.gotoAndPlay(1); 
		
		}
	}
	this.frame_2 = function() {
		var soundInstance = playSound("PourWater2",0);
		this.InsertIntoSoundStreamData(soundInstance,2,400,1);
		this.GoFirst = undefined;
	}
	this.frame_6 = function() {
		var soundInstance = playSound("Record1",0);
		this.InsertIntoSoundStreamData(soundInstance,6,153,1);
	}
	this.frame_153 = function() {
		var soundInstance = playSound("Record2",0);
		this.InsertIntoSoundStreamData(soundInstance,153,230,1);
	}
	this.frame_230 = function() {
		var soundInstance = playSound("whistle",0);
		this.InsertIntoSoundStreamData(soundInstance,230,258,1);
	}
	this.frame_258 = function() {
		var soundInstance = playSound("Record3",0);
		this.InsertIntoSoundStreamData(soundInstance,258,374,1);
	}
	this.frame_374 = function() {
		var soundInstance = playSound("Splash",0);
		this.InsertIntoSoundStreamData(soundInstance,374,432,1);
	}
	this.frame_400 = function() {
		var soundInstance = playSound("PourWater2",0);
		this.InsertIntoSoundStreamData(soundInstance,400,563,1);
	}
	this.frame_432 = function() {
		var soundInstance = playSound("Record4",0);
		this.InsertIntoSoundStreamData(soundInstance,432,541,1);
	}
	this.frame_493 = function() {
		var soundInstance = playSound("whistle",0);
		this.InsertIntoSoundStreamData(soundInstance,493,560,1);
	}
	this.frame_541 = function() {
		var soundInstance = playSound("Splash",0);
		this.InsertIntoSoundStreamData(soundInstance,541,559,1);
	}
	this.frame_560 = function() {
		this.Replaybtn = this.buttons.Replaybtn;
	}
	this.frame_562 = function() {
		var self = this;
		self.stop();
		
		createjs.Sound.stop();
		
		
		self.Replaybtn.addEventListener("click",playagain);
		
		function playagain()
			{
			self.gotoAndPlay(1);	
			}
	}
	this.frame_564 = function() {
		this.___loopingOver___ = true;
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(2).call(this.frame_2).wait(4).call(this.frame_6).wait(147).call(this.frame_153).wait(77).call(this.frame_230).wait(28).call(this.frame_258).wait(116).call(this.frame_374).wait(26).call(this.frame_400).wait(32).call(this.frame_432).wait(61).call(this.frame_493).wait(48).call(this.frame_541).wait(19).call(this.frame_560).wait(2).call(this.frame_562).wait(2).call(this.frame_564).wait(1));

	// Camera
	this.___camera___instance = new lib.___Camera___();
	this.___camera___instance.name = "___camera___instance";
	this.___camera___instance.setTransform(640,360);
	this.___camera___instance.depth = 0;
	this.___camera___instance.visible = false;

	this.timeline.addTween(cjs.Tween.get(this.___camera___instance).wait(1).to({regX:0.1,regY:0.1,scaleX:0.665,scaleY:0.665,x:640.05,y:360.05},0).wait(1).to({regX:0,regY:0,x:646.4687,y:358.7875},0).wait(1).to({x:652.9375,y:357.575},0).wait(1).to({x:659.4062,y:356.3625},0).wait(1).to({x:665.875,y:355.15},0).wait(1).to({x:672.3437,y:353.9375},0).wait(1).to({x:678.8125,y:352.725},0).wait(1).to({x:685.2812,y:351.5125},0).wait(1).to({x:691.75,y:350.3},0).wait(16).to({scaleX:0.7023,scaleY:0.7023,x:677.8606,y:339.3677},0).wait(1).to({scaleX:0.7395,scaleY:0.7395,x:663.9711,y:328.4354},0).wait(1).to({scaleX:0.7768,scaleY:0.7768,x:650.0817,y:317.5031},0).wait(1).to({scaleX:0.814,scaleY:0.814,x:636.1922,y:306.5708},0).wait(1).to({scaleX:0.8513,scaleY:0.8513,x:622.3028,y:295.6385},0).wait(1).to({scaleX:0.8885,scaleY:0.8885,x:608.4134,y:284.7062},0).wait(1).to({scaleX:0.9258,scaleY:0.9258,x:594.5239,y:273.7739},0).wait(82).to({regX:0.1,regY:0.1,scaleX:0.7082,scaleY:0.7082,x:451.4,y:255.4},0).wait(1).to({regX:0,regY:0,x:451.35,y:255.35},0).wait(39).to({regX:0.3,regY:0.2,scaleX:0.5693,scaleY:0.5693,x:365.85,y:314.65},0).wait(1).to({regX:0,regY:0,x:365.7,y:314.55},0).wait(18).to({regX:0.4,regY:0.3,scaleX:0.5066,scaleY:0.5066,x:327.8,y:345.35},0).wait(1).to({regX:0,regY:0,x:327.6,y:345.2},0).wait(57).to({regX:0.5,regY:0.3,scaleX:0.6456,scaleY:0.6456,x:415.4,y:334.15},0).wait(1).to({regX:0,regY:0,scaleX:0.6592,scaleY:0.6592,x:426.2552,y:333.4459},0).wait(1).to({scaleX:0.6728,scaleY:0.6728,x:437.4105,y:332.9418},0).wait(1).to({scaleX:0.6864,scaleY:0.6864,x:448.5657,y:332.4378},0).wait(1).to({scaleX:0.7,scaleY:0.7,x:459.721,y:331.9337},0).wait(1).to({scaleX:0.7136,scaleY:0.7136,x:470.8762,y:331.4296},0).wait(1).to({scaleX:0.7272,scaleY:0.7272,x:482.0315,y:330.9255},0).wait(1).to({scaleX:0.7408,scaleY:0.7408,x:493.1867,y:330.4214},0).wait(1).to({scaleX:0.7543,scaleY:0.7543,x:504.342,y:329.9174},0).wait(1).to({scaleX:0.7679,scaleY:0.7679,x:515.4972,y:329.4133},0).wait(1).to({scaleX:0.7815,scaleY:0.7815,x:526.6525,y:328.9092},0).wait(1).to({scaleX:0.7951,scaleY:0.7951,x:537.8077,y:328.4051},0).wait(1).to({scaleX:0.8087,scaleY:0.8087,x:548.963,y:327.9011},0).wait(1).to({scaleX:0.8223,scaleY:0.8223,x:560.1182,y:327.397},0).wait(1).to({scaleX:0.8359,scaleY:0.8359,x:571.2734,y:326.8929},0).wait(1).to({scaleX:0.8495,scaleY:0.8495,x:582.4287,y:326.3888},0).wait(1).to({scaleX:0.8631,scaleY:0.8631,x:593.5839,y:325.8847},0).wait(1).to({scaleX:0.8767,scaleY:0.8767,x:604.7392,y:325.3807},0).wait(1).to({scaleX:0.8903,scaleY:0.8903,x:615.8944,y:324.8766},0).wait(1).to({scaleX:0.9039,scaleY:0.9039,x:627.0497,y:324.3725},0).wait(1).to({scaleX:0.9175,scaleY:0.9175,x:638.2049,y:323.8684},0).wait(1).to({scaleX:0.9311,scaleY:0.9311,x:649.3602,y:323.3644},0).wait(1).to({scaleX:0.9447,scaleY:0.9447,x:660.5154,y:322.8603},0).wait(1).to({scaleX:0.9466,scaleY:0.9466,x:670.1824,y:323.9645},0).wait(1).to({scaleX:0.9485,scaleY:0.9485,x:679.8494,y:325.0686},0).wait(1).to({scaleX:0.9504,scaleY:0.9504,x:689.5164,y:326.1728},0).wait(1).to({scaleX:0.9523,scaleY:0.9523,x:699.1834,y:327.277},0).wait(1).to({scaleX:0.9543,scaleY:0.9543,x:708.8504,y:328.3812},0).wait(1).to({scaleX:0.9562,scaleY:0.9562,x:718.5174,y:329.4854},0).wait(1).to({scaleX:0.9581,scaleY:0.9581,x:728.1844,y:330.5896},0).wait(1).to({scaleX:0.96,scaleY:0.96,x:737.8514,y:331.6938},0).wait(1).to({scaleX:0.962,scaleY:0.962,x:747.5183,y:332.7979},0).wait(1).to({scaleX:0.9639,scaleY:0.9639,x:757.1853,y:333.9021},0).wait(1).to({scaleX:0.9658,scaleY:0.9658,x:766.8523,y:335.0063},0).wait(1).to({scaleX:0.9677,scaleY:0.9677,x:776.5193,y:336.1105},0).wait(1).to({scaleX:0.9697,scaleY:0.9697,x:786.1863,y:337.2147},0).wait(1).to({scaleX:0.9716,scaleY:0.9716,x:795.8533,y:338.3189},0).wait(1).to({scaleX:0.9735,scaleY:0.9735,x:805.5203,y:339.4231},0).wait(1).to({scaleX:0.9754,scaleY:0.9754,x:815.1873,y:340.5272},0).wait(1).to({scaleX:0.9773,scaleY:0.9773,x:824.8543,y:341.6314},0).wait(1).to({scaleX:0.9793,scaleY:0.9793,x:834.5213,y:342.7356},0).wait(1).to({scaleX:0.9812,scaleY:0.9812,x:844.1883,y:343.8398},0).wait(1).to({scaleX:0.9831,scaleY:0.9831,x:853.8553,y:344.944},0).wait(1).to({scaleX:0.985,scaleY:0.985,x:863.5222,y:346.0482},0).wait(1).to({scaleX:0.987,scaleY:0.987,x:873.1892,y:347.1524},0).wait(1).to({scaleX:0.9889,scaleY:0.9889,x:882.8562,y:348.2565},0).wait(1).to({scaleX:0.9908,scaleY:0.9908,x:892.5232,y:349.3607},0).wait(1).to({scaleX:0.9927,scaleY:0.9927,x:902.1902,y:350.4649},0).wait(1).to({scaleX:0.9946,scaleY:0.9946,x:911.8572,y:351.5691},0).wait(1).to({scaleX:0.9966,scaleY:0.9966,x:921.5242,y:352.6733},0).wait(1).to({scaleX:0.9985,scaleY:0.9985,x:931.1912,y:353.7775},0).wait(1).to({scaleX:1.0004,scaleY:1.0004,x:940.8582,y:354.8816},0).wait(1).to({scaleX:1.0023,scaleY:1.0023,x:950.5252,y:355.9858},0).wait(1).to({scaleX:1.0043,scaleY:1.0043,x:960.1922,y:357.09},0).wait(1).to({scaleX:1.0062,scaleY:1.0062,x:969.8592,y:358.1942},0).wait(1).to({scaleX:1.0081,scaleY:1.0081,x:979.5262,y:359.2984},0).wait(1).to({scaleX:1.01,scaleY:1.01,x:989.1931,y:360.4026},0).wait(1).to({scaleX:1.012,scaleY:1.012,x:998.8601,y:361.5068},0).wait(1).to({scaleX:1.0139,scaleY:1.0139,x:1008.5271,y:362.6109},0).wait(1).to({scaleX:1.0158,scaleY:1.0158,x:1018.1941,y:363.7151},0).wait(1).to({scaleX:1.0177,scaleY:1.0177,x:1027.8611,y:364.8193},0).wait(1).to({scaleX:1.0196,scaleY:1.0196,x:1037.5281,y:365.9235},0).wait(1).to({scaleX:1.0216,scaleY:1.0216,x:1047.1951,y:367.0277},0).wait(1).to({scaleX:1.0235,scaleY:1.0235,x:1056.8621,y:368.1319},0).wait(1).to({scaleX:1.0254,scaleY:1.0254,x:1066.5291,y:369.2361},0).wait(1).to({x:1073.1737,y:371.2766},0).wait(1).to({x:1079.8183,y:373.3171},0).wait(1).to({x:1086.4629,y:375.3577},0).wait(1).to({x:1093.1075,y:377.3982},0).wait(1).to({x:1099.7521,y:379.4388},0).wait(1).to({x:1106.3966,y:381.4793},0).wait(1).to({x:1113.0412,y:383.5198},0).wait(1).to({x:1119.6858,y:385.5604},0).wait(1).to({x:1126.3304,y:387.6009},0).wait(1).to({x:1132.975,y:389.6415},0).wait(1).to({x:1139.6196,y:391.682},0).wait(1).to({x:1146.2642,y:393.7225},0).wait(1).to({x:1152.9088,y:395.7631},0).wait(1).to({x:1159.5534,y:397.8036},0).wait(1).to({x:1166.198,y:399.8442},0).wait(1).to({x:1172.8426,y:401.8847},0).wait(1).to({x:1179.4872,y:403.9252},0).wait(1).to({x:1186.1318,y:405.9658},0).wait(1).to({x:1192.7764,y:408.0063},0).wait(1).to({x:1199.421,y:410.0469},0).wait(1).to({x:1206.0656,y:412.0874},0).wait(1).to({x:1212.7102,y:414.1279},0).wait(1).to({x:1219.3548,y:416.1685},0).wait(1).to({x:1225.9993,y:418.209},0).wait(1).to({x:1232.6439,y:420.2496},0).wait(1).to({x:1239.2885,y:422.2901},0).wait(1).to({x:1245.9331,y:424.3306},0).wait(1).to({x:1252.5777,y:426.3712},0).wait(1).to({x:1259.2223,y:428.4117},0).wait(1).to({x:1265.8669,y:430.4523},0).wait(1).to({x:1272.5115,y:432.4928},0).wait(1).to({x:1279.1561,y:434.5333},0).wait(1).to({x:1285.8007,y:436.5739},0).wait(1).to({x:1292.4453,y:438.6144},0).wait(1).to({x:1299.0899,y:440.655},0).wait(1).to({x:1305.7345,y:442.6955},0).wait(1).to({x:1312.3791,y:444.7361},0).wait(1).to({x:1319.0237,y:446.7766},0).wait(1).to({x:1325.6683,y:448.8171},0).wait(1).to({x:1332.3129,y:450.8577},0).wait(1).to({x:1338.9575,y:452.8982},0).wait(1).to({x:1345.6021,y:454.9388},0).wait(1).to({x:1352.2466,y:456.9793},0).wait(1).to({x:1358.8912,y:459.0198},0).wait(1).to({x:1365.5358,y:461.0604},0).wait(1).to({x:1372.1804,y:463.1009},0).wait(1).to({x:1378.825,y:465.1415},0).wait(1).to({x:1385.4696,y:467.182},0).wait(1).to({x:1392.1142,y:469.2225},0).wait(1).to({x:1398.7588,y:471.2631},0).wait(1).to({x:1405.4034,y:473.3036},0).wait(1).to({x:1412.048,y:475.3442},0).wait(1).to({x:1418.6926,y:477.3847},0).wait(1).to({x:1425.3372,y:479.4252},0).wait(1).to({x:1431.9818,y:481.4658},0).wait(1).to({x:1438.6264,y:483.5063},0).wait(1).to({x:1445.271,y:485.5469},0).wait(1).to({x:1451.9156,y:487.5874},0).wait(1).to({x:1458.5602,y:489.6279},0).wait(1).to({x:1465.2048,y:491.6685},0).wait(1).to({x:1471.8493,y:493.709},0).wait(1).to({x:1478.4939,y:495.7496},0).wait(1).to({x:1485.1385,y:497.7901},0).wait(1).to({x:1491.7831,y:499.8306},0).wait(1).to({x:1498.4277,y:501.8712},0).wait(1).to({x:1505.0723,y:503.9117},0).wait(1).to({x:1511.7169,y:505.9523},0).wait(1).to({x:1518.3615,y:507.9928},0).wait(1).to({x:1525.0061,y:510.0333},0).wait(1).to({x:1531.6507,y:512.0739},0).wait(1).to({x:1538.2953,y:514.1144},0).wait(1).to({x:1544.9399,y:516.155},0).wait(1).to({x:1551.5845,y:518.1955},0).wait(1).to({x:1558.2291,y:520.2361},0).wait(1).to({x:1566.3361,y:521.6378},0).wait(1).to({x:1574.4431,y:523.0396},0).wait(1).to({x:1582.5501,y:524.4413},0).wait(1).to({x:1590.6571,y:525.8431},0).wait(1).to({x:1598.7642,y:527.2448},0).wait(1).to({x:1606.8712,y:528.6466},0).wait(1).to({x:1614.9782,y:530.0483},0).wait(1).to({x:1623.0852,y:531.4501},0).wait(1).to({x:1631.1922,y:532.8518},0).wait(1).to({x:1639.2993,y:534.2536},0).wait(1).to({x:1647.4063,y:535.6554},0).wait(1).to({x:1655.5133,y:537.0571},0).wait(1).to({x:1663.6203,y:538.4589},0).wait(1).to({x:1671.7273,y:539.8606},0).wait(1).to({x:1679.8343,y:541.2624},0).wait(1).to({x:1687.9414,y:542.6641},0).wait(1).to({x:1696.0484,y:544.0659},0).wait(1).to({x:1704.1554,y:545.4676},0).wait(1).to({x:1712.2624,y:546.8694},0).wait(1).to({x:1720.3694,y:548.2711},0).wait(1).to({x:1728.4764,y:549.6729},0).wait(1).to({x:1736.5835,y:551.0746},0).wait(1).to({x:1744.6905,y:552.4764},0).wait(1).to({x:1752.7975,y:553.8782},0).wait(1).to({x:1760.9045,y:555.2799},0).wait(1).to({x:1769.0115,y:556.6817},0).wait(1).to({x:1777.1186,y:558.0834},0).wait(1).to({x:1785.2256,y:559.4852},0).wait(1).to({x:1793.3326,y:560.8869},0).wait(1).to({x:1801.4396,y:562.2887},0).wait(1).to({x:1809.5466,y:563.6904},0).wait(1).to({x:1817.6536,y:565.0922},0).wait(1).to({x:1825.7607,y:566.4939},0).wait(1).to({x:1833.8677,y:567.8957},0).wait(1).to({x:1841.9747,y:569.2975},0).wait(1).to({x:1850.0817,y:570.6992},0).wait(1).to({x:1858.1887,y:572.101},0).wait(1).to({x:1866.2957,y:573.5027},0).wait(1).to({x:1874.4028,y:574.9045},0).wait(1).to({x:1882.5098,y:576.3062},0).wait(1).to({x:1890.6168,y:577.708},0).wait(1).to({x:1898.7238,y:579.1097},0).wait(1).to({x:1906.8308,y:580.5115},0).wait(1).to({x:1914.9379,y:581.9132},0).wait(1).to({x:1923.0449,y:583.315},0).wait(1).to({x:1931.1519,y:584.7168},0).wait(1).to({x:1939.2589,y:586.1185},0).wait(1).to({x:1947.3659,y:587.5203},0).wait(1).to({x:1955.4729,y:588.922},0).wait(1).to({x:1963.58,y:590.3238},0).wait(1).to({x:1971.687,y:591.7255},0).wait(1).to({x:1979.794,y:593.1273},0).wait(1).to({x:1987.901,y:594.529},0).wait(1).to({x:1996.008,y:595.9308},0).wait(1).to({x:2004.115,y:597.3325},0).wait(1).to({x:2012.2221,y:598.7343},0).wait(1).to({x:2020.3291,y:600.1361},0).wait(1).to({x:2045.6735,y:600.2972},0).wait(1).to({x:2071.018,y:600.4583},0).wait(1).to({x:2096.3624,y:600.6194},0).wait(1).to({x:2121.7069,y:600.7805},0).wait(1).to({x:2147.0513,y:600.9416},0).wait(1).to({x:2172.3957,y:601.1027},0).wait(1).to({x:2197.7402,y:601.2638},0).wait(1).to({x:2223.0846,y:601.4249},0).wait(1).to({x:2248.4291,y:601.5861},0).wait(1).to({x:2273.7735,y:601.7472},0).wait(1).to({x:2299.118,y:601.9083},0).wait(1).to({x:2324.4624,y:602.0694},0).wait(1).to({x:2349.8069,y:602.2305},0).wait(1).to({x:2375.1513,y:602.3916},0).wait(1).to({x:2400.4957,y:602.5527},0).wait(1).to({x:2425.8402,y:602.7138},0).wait(1).to({x:2451.1846,y:602.8749},0).wait(1).to({x:2476.5291,y:603.0361},0).wait(23).to({regX:0.6,regY:0.6,x:663.75,y:404.95},0).wait(1).to({regX:0,regY:0,x:663.15,y:404.35},0).wait(28).to({regX:0.6,regY:0.6,scaleX:1.3721,scaleY:1.3721,x:889.6,y:476.25},0).wait(1).to({regX:0,regY:0,scaleX:1.3722,scaleY:1.3722,x:877.431,y:471.6034},0).wait(1).to({x:896.3835,y:472.0158},0).wait(1).to({x:915.3359,y:472.4282},0).wait(1).to({x:934.2884,y:472.8406},0).wait(1).to({x:953.2409,y:473.253},0).wait(1).to({x:972.1933,y:473.6653},0).wait(1).to({x:991.1458,y:474.0777},0).wait(1).to({x:1010.0982,y:474.4901},0).wait(1).to({x:1029.0507,y:474.9025},0).wait(1).to({x:1048.0032,y:475.3148},0).wait(1).to({x:1066.9556,y:475.7272},0).wait(1).to({x:1085.9081,y:476.1396},0).wait(1).to({x:1104.8606,y:476.552},0).wait(1).to({x:1123.813,y:476.9643},0).wait(1).to({x:1142.7655,y:477.3767},0).wait(1).to({x:1161.718,y:477.7891},0).wait(1).to({x:1180.6704,y:478.2015},0).wait(1).to({x:1199.6229,y:478.6139},0).wait(1).to({x:1218.5754,y:479.0262},0).wait(1).to({x:1237.5278,y:479.4386},0).wait(1).to({x:1256.4803,y:479.851},0).wait(1).to({x:1275.4327,y:480.2634},0).wait(1).to({x:1294.3852,y:480.6757},0).wait(1).to({x:1313.3377,y:481.0881},0).wait(1).to({x:1332.2901,y:481.5005},0).wait(1).to({x:1351.2426,y:481.9129},0).wait(1).to({x:1370.1951,y:482.3252},0).wait(1).to({x:1389.1475,y:482.7376},0).wait(1).to({x:1408.1,y:483.15},0).wait(1).to({x:1441.5469,y:482.1562},0).wait(1).to({x:1474.9937,y:481.1625},0).wait(1).to({x:1508.4406,y:480.1687},0).wait(1).to({x:1541.8875,y:479.175},0).wait(1).to({x:1575.3344,y:478.1812},0).wait(1).to({x:1608.7812,y:477.1875},0).wait(1).to({x:1642.2281,y:476.1937},0).wait(1).to({x:1675.675,y:475.2},0).wait(1).to({x:1709.1219,y:474.2062},0).wait(1).to({x:1742.5687,y:473.2125},0).wait(1).to({x:1776.0156,y:472.2187},0).wait(1).to({x:1809.4625,y:471.225},0).wait(1).to({x:1842.9094,y:470.2312},0).wait(1).to({x:1876.3562,y:469.2375},0).wait(1).to({x:1909.8031,y:468.2437},0).wait(1).to({x:1943.25,y:467.25},0).wait(18).to({regX:0.6,regY:0.6,scaleX:1.3721,scaleY:1.3721,x:881.55,y:475.95},0).wait(1).to({regX:0,regY:0,scaleX:1.3722,scaleY:1.3722,x:880.75,y:475.15},0).wait(2).to({_off:true},1).wait(3));

	// buttons_obj_
	this.buttons = new lib.Scene_1_buttons();
	this.buttons.name = "buttons";
	this.buttons.setTransform(637.1,365.3,1,1,0,0,0,637.1,365.3);
	this.buttons.depth = 0;
	this.buttons.isAttachedToCamera = 0
	this.buttons.isAttachedToMask = 0
	this.buttons.layerDepth = 0
	this.buttons.layerIndex = 0
	this.buttons.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.buttons).wait(2).to({regX:644.5,regY:362.2,scaleX:1.5038,scaleY:1.5038,y:365.25},0).wait(558).to({regX:876.6,regY:482.5,scaleX:0.7288,scaleY:0.7288,x:637},0).to({_off:true},4).wait(1));

	// splash_obj_
	this.splash = new lib.Scene_1_splash();
	this.splash.name = "splash";
	this.splash.depth = 0;
	this.splash.isAttachedToCamera = 0
	this.splash.isAttachedToMask = 0
	this.splash.layerDepth = 0
	this.splash.layerIndex = 1
	this.splash.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.splash).wait(266).to({regX:174,regY:-11.4,scaleX:1.0293,scaleY:1.0293,x:0.05},0).wait(63).to({regX:642.8,regY:71.4,scaleX:0.9752,scaleY:0.9752,y:0.05},0).wait(20).to({regX:775.6,regY:112.2,x:-0.05,y:0},0).wait(8).to({regX:828.9,regY:128.6,x:0.05,y:0.05},0).wait(11).to({regX:902,regY:151,y:0},0).wait(122).to({regX:6.8,regY:35.1,scaleX:0.9753,scaleY:0.9753,x:0,y:-0.05},0).wait(39).to({regX:697.1,regY:-15.7,scaleX:0.7288,scaleY:0.7288,x:0.05,y:0},0).wait(1).to({regX:730.6,regY:-16.8,y:-0.05},0).wait(7).to({regX:964.7,regY:-23.6,x:0,y:0},0).to({_off:true},26).wait(2));

	// flash0_ai_obj_
	this.flash0_ai = new lib.Scene_1_flash0_ai();
	this.flash0_ai.name = "flash0_ai";
	this.flash0_ai.depth = 0;
	this.flash0_ai.isAttachedToCamera = 0
	this.flash0_ai.isAttachedToMask = 0
	this.flash0_ai.layerDepth = 0
	this.flash0_ai.layerIndex = 2
	this.flash0_ai.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.flash0_ai).wait(458).to({regX:1820.3,regY:233.8,scaleX:0.9752,scaleY:0.9752,x:0.05},0).wait(39).to({regX:18.1,regY:-21.8,scaleX:0.7288,scaleY:0.7288,x:0},0).wait(4).to({regX:93.9,regY:-20.2},0).wait(2).to({regX:131.8,regY:-19.4,y:-0.05},0).wait(4).to({regX:207.7,regY:-17.8,y:0},0).to({_off:true},3).wait(55));

	// STEP2_obj_
	this.STEP2 = new lib.Scene_1_STEP2();
	this.STEP2.name = "STEP2";
	this.STEP2.depth = 0;
	this.STEP2.isAttachedToCamera = 0
	this.STEP2.isAttachedToMask = 0
	this.STEP2.layerDepth = 0
	this.STEP2.layerIndex = 3
	this.STEP2.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.STEP2).wait(458).to({regX:1820.3,regY:233.8,scaleX:0.9752,scaleY:0.9752,x:0.05},0).wait(39).to({regX:18.1,regY:-21.8,scaleX:0.7288,scaleY:0.7288,x:0},0).wait(5).to({regX:112.9,regY:-19.8,x:0.05,y:-0.05},0).wait(1).to({regX:131.8,regY:-19.4,x:0},0).to({_off:true},60).wait(2));

	// Swm1RH_obj_
	this.Swm1RH = new lib.Scene_1_Swm1RH();
	this.Swm1RH.name = "Swm1RH";
	this.Swm1RH.depth = 0;
	this.Swm1RH.isAttachedToCamera = 0
	this.Swm1RH.isAttachedToMask = 0
	this.Swm1RH.layerDepth = 0
	this.Swm1RH.layerIndex = 4
	this.Swm1RH.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Swm1RH).wait(458).to({regX:1820.3,regY:233.8,scaleX:0.9752,scaleY:0.9752,x:0.05},0).wait(30).to({regX:6.8,regY:35.1,scaleX:0.9753,scaleY:0.9753,x:0,y:-0.05},0).wait(5).to({_off:true},4).wait(68));

	// horizantal_loop_copy_obj_
	this.horizantal_loop_copy = new lib.Scene_1_horizantal_loop_copy();
	this.horizantal_loop_copy.name = "horizantal_loop_copy";
	this.horizantal_loop_copy.depth = 0;
	this.horizantal_loop_copy.isAttachedToCamera = 0
	this.horizantal_loop_copy.isAttachedToMask = 0
	this.horizantal_loop_copy.layerDepth = 0
	this.horizantal_loop_copy.layerIndex = 5
	this.horizantal_loop_copy.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.horizantal_loop_copy).wait(173).to({regX:3.4,regY:162.8,scaleX:1.974,scaleY:1.974,x:0.1},0).wait(67).to({regX:26.4,regY:47.5,scaleX:1.2796,scaleY:1.2796,x:0,y:0.05},0).wait(2).to({regX:31.3,regY:36.6,scaleX:1.2365,scaleY:1.2365,y:-0.1},0).wait(7).to({regX:48.6,regY:-1,scaleX:1.1064,scaleY:1.1064,x:0.05,y:0},0).wait(99).to({regX:769.1,regY:110.2,scaleX:0.9752,scaleY:0.9752,y:0.05},0).wait(7).to({regX:815.6,regY:124.5},0).wait(11).to({regX:888.6,regY:146.9,x:0,y:0},0).to({_off:true},132).wait(67));

	// step_5_obj_
	this.step_5 = new lib.Scene_1_step_5();
	this.step_5.name = "step_5";
	this.step_5.depth = 0;
	this.step_5.isAttachedToCamera = 0
	this.step_5.isAttachedToMask = 0
	this.step_5.layerDepth = 0
	this.step_5.layerIndex = 6
	this.step_5.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.step_5).wait(458).to({regX:1820.3,regY:233.8,scaleX:0.9752,scaleY:0.9752,x:0.05},0).wait(52).to({regX:264.6,regY:-16.6,scaleX:0.7288,scaleY:0.7288,y:-0.05},0).wait(1).to({regX:283.5,regY:-16.1,x:0,y:0},0).wait(1).to({regX:1523,regY:527.2,scaleX:1,scaleY:1,x:1239.55,y:543.3},0).wait(49).to({_off:true},1).wait(3));

	// step_4_copy_obj_
	this.step_4_copy = new lib.Scene_1_step_4_copy();
	this.step_4_copy.name = "step_4_copy";
	this.step_4_copy.depth = 0;
	this.step_4_copy.isAttachedToCamera = 0
	this.step_4_copy.isAttachedToMask = 0
	this.step_4_copy.layerDepth = 0
	this.step_4_copy.layerIndex = 7
	this.step_4_copy.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.step_4_copy).wait(248).to({regX:46.1,regY:4.3,scaleX:1.1233,scaleY:1.1233,x:0.05,y:0.05},0).wait(1).to({regX:48.6,regY:-1,scaleX:1.1064,scaleY:1.1064,y:0},0).wait(1).to({regX:51,regY:-6.4,scaleX:1.09,scaleY:1.09},0).wait(1).to({regX:53.4,regY:-11.8,scaleX:1.0741,scaleY:1.0741,x:0,y:0.05},0).wait(3).to({regX:72.7,regY:-16.3,scaleX:1.0543,scaleY:1.0543,x:0.05,y:0},0).wait(2).to({regX:89.6,regY:-15.5,scaleX:1.05,scaleY:1.05,x:0},0).wait(2).to({regX:106.5,regY:-14.8,scaleX:1.0458,scaleY:1.0458,x:0.05,y:-0.1},0).wait(7).to({regX:165.5,regY:-11.9,scaleX:1.0313,scaleY:1.0313,x:0,y:0},0).wait(1).to({regX:1883.6,regY:546.8,scaleX:1,scaleY:1,x:1718.1,y:558.65},0).wait(189).to({_off:true},1).wait(109));

	// horizantal_loop_obj_
	this.horizantal_loop = new lib.Scene_1_horizantal_loop();
	this.horizantal_loop.name = "horizantal_loop";
	this.horizantal_loop.depth = 0;
	this.horizantal_loop.isAttachedToCamera = 0
	this.horizantal_loop.isAttachedToMask = 0
	this.horizantal_loop.layerDepth = 0
	this.horizantal_loop.layerIndex = 8
	this.horizantal_loop.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.horizantal_loop).wait(173).to({regX:3.4,regY:162.8,scaleX:1.974,scaleY:1.974,x:0.1},0).wait(67).to({regX:26.4,regY:47.5,scaleX:1.2796,scaleY:1.2796,x:0,y:0.05},0).wait(2).to({regX:31.3,regY:36.6,scaleX:1.2365,scaleY:1.2365,y:-0.1},0).wait(7).to({regX:48.6,regY:-1,scaleX:1.1064,scaleY:1.1064,x:0.05,y:0},0).wait(98).to({regX:762.4,regY:108.1,scaleX:0.9752,scaleY:0.9752,x:0},0).to({_off:true},76).wait(142));

	// water_splash_obj_
	this.water_splash = new lib.Scene_1_water_splash();
	this.water_splash.name = "water_splash";
	this.water_splash.depth = 0;
	this.water_splash.isAttachedToCamera = 0
	this.water_splash.isAttachedToMask = 0
	this.water_splash.layerDepth = 0
	this.water_splash.layerIndex = 9
	this.water_splash.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.water_splash).wait(349).to({regX:775.6,regY:112.2,scaleX:0.9752,scaleY:0.9752,x:-0.05},0).wait(17).to({regX:888.6,regY:146.9,x:0},0).wait(21).to({regX:1056,regY:177.6,x:0.05},0).wait(17).to({regX:1193.8,regY:201.5,y:0.05},0).wait(9).to({regX:1266.7,regY:214,x:0,y:0},0).wait(15).to({regX:1440,regY:231.3,y:-0.05},0).wait(9).to({regX:1668.1,regY:232.8,y:0.05},0).wait(53).to({regX:6.8,regY:35.1,scaleX:0.9753,scaleY:0.9753,y:-0.05},0).wait(47).to({regX:964.7,regY:-23.6,scaleX:0.7288,scaleY:0.7288,y:0},0).wait(28));

	// flash0_ai_obj_
	this.flash0_ai_1 = new lib.Scene_1_flash0_ai_1();
	this.flash0_ai_1.name = "flash0_ai_1";
	this.flash0_ai_1.depth = 0;
	this.flash0_ai_1.isAttachedToCamera = 0
	this.flash0_ai_1.isAttachedToMask = 0
	this.flash0_ai_1.layerDepth = 0
	this.flash0_ai_1.layerIndex = 10
	this.flash0_ai_1.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.flash0_ai_1).wait(248).to({regX:46.1,regY:4.3,scaleX:1.1233,scaleY:1.1233,x:0.05,y:0.05},0).wait(1).to({regX:48.6,regY:-1,scaleX:1.1064,scaleY:1.1064,y:0},0).wait(1).to({regX:51,regY:-6.4,scaleX:1.09,scaleY:1.09},0).wait(1).to({regX:53.4,regY:-11.8,scaleX:1.0741,scaleY:1.0741,x:0,y:0.05},0).wait(5).to({regX:89.6,regY:-15.5,scaleX:1.05,scaleY:1.05,y:0},0).wait(2).to({regX:106.5,regY:-14.8,scaleX:1.0458,scaleY:1.0458,x:0.05,y:-0.1},0).wait(7).to({regX:165.5,regY:-11.9,scaleX:1.0313,scaleY:1.0313,x:0,y:0},0).wait(300));

	// STEP2_obj_
	this.STEP2_1 = new lib.Scene_1_STEP2_1();
	this.STEP2_1.name = "STEP2_1";
	this.STEP2_1.depth = 0;
	this.STEP2_1.isAttachedToCamera = 0
	this.STEP2_1.isAttachedToMask = 0
	this.STEP2_1.layerDepth = 0
	this.STEP2_1.layerIndex = 11
	this.STEP2_1.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.STEP2_1).wait(248).to({regX:46.1,regY:4.3,scaleX:1.1233,scaleY:1.1233,x:0.05,y:0.05},0).wait(1).to({regX:48.6,regY:-1,scaleX:1.1064,scaleY:1.1064,y:0},0).wait(1).to({regX:51,regY:-6.4,scaleX:1.09,scaleY:1.09},0).wait(1).to({regX:53.4,regY:-11.8,scaleX:1.0741,scaleY:1.0741,x:0,y:0.05},0).wait(1).to({regX:55.9,regY:-17.2,scaleX:1.0586,scaleY:1.0586,x:0.05,y:0},0).wait(6).to({regX:106.5,regY:-14.8,scaleX:1.0458,scaleY:1.0458,y:-0.1},0).wait(307));

	// Swm1RH_obj_
	this.Swm1RH_1 = new lib.Scene_1_Swm1RH_1();
	this.Swm1RH_1.name = "Swm1RH_1";
	this.Swm1RH_1.depth = 0;
	this.Swm1RH_1.isAttachedToCamera = 0
	this.Swm1RH_1.isAttachedToMask = 0
	this.Swm1RH_1.layerDepth = 0
	this.Swm1RH_1.layerIndex = 12
	this.Swm1RH_1.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Swm1RH_1).wait(169).to({regX:1.4,regY:109.6,scaleX:1.7567,scaleY:1.7567,x:0.1,y:0.05},0).wait(17).to({regX:3.4,regY:162.8,scaleX:1.974,scaleY:1.974,y:0},0).wait(57).to({regX:33.7,regY:31.3,scaleX:1.2161,scaleY:1.2161,x:0},0).wait(9).to({regX:55.9,regY:-17.2,scaleX:1.0586,scaleY:1.0586,x:0.05},0).to({_off:true},169).wait(144));

	// basicswimmer_obj_
	this.basicswimmer = new lib.Scene_1_basicswimmer();
	this.basicswimmer.name = "basicswimmer";
	this.basicswimmer.depth = 0;
	this.basicswimmer.isAttachedToCamera = 0
	this.basicswimmer.isAttachedToMask = 0
	this.basicswimmer.layerDepth = 0
	this.basicswimmer.layerIndex = 13
	this.basicswimmer.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.basicswimmer).wait(1).to({regX:214.4,regY:120.6,scaleX:1.5038,scaleY:1.5038},0).wait(1).to({regX:220.8,regY:119.4,x:-0.05,y:0.1},0).wait(32).to({regX:2,regY:-59.5,scaleX:1.0802,scaleY:1.0802,x:0,y:-0.05},0).wait(135).to({regX:1.4,regY:109.6,scaleX:1.7567,scaleY:1.7567,x:0.1,y:0.05},0).wait(17).to({regX:3.4,regY:162.8,scaleX:1.974,scaleY:1.974,y:0},0).wait(66).to({regX:55.9,regY:-17.2,scaleX:1.0586,scaleY:1.0586,x:0.05},0).wait(313));

	// jump_board_obj_
	this.jump_board = new lib.Scene_1_jump_board();
	this.jump_board.name = "jump_board";
	this.jump_board.depth = 0;
	this.jump_board.isAttachedToCamera = 0
	this.jump_board.isAttachedToMask = 0
	this.jump_board.layerDepth = 0
	this.jump_board.layerIndex = 14
	this.jump_board.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.jump_board).wait(1).to({regX:214.4,regY:120.6,scaleX:1.5038,scaleY:1.5038},0).wait(101).to({regX:2,regY:-59.5,scaleX:1.0802,scaleY:1.0802,y:-0.05},0).wait(359).to({regX:1820.3,regY:233.8,scaleX:0.9752,scaleY:0.9752,x:0.05,y:0},0).wait(104));

	// maslul_obj_
	this.maslul = new lib.Scene_1_maslul();
	this.maslul.name = "maslul";
	this.maslul.depth = 0;
	this.maslul.isAttachedToCamera = 0
	this.maslul.isAttachedToMask = 0
	this.maslul.layerDepth = 0
	this.maslul.layerIndex = 15
	this.maslul.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.maslul).wait(1).to({regX:214.4,regY:120.6,scaleX:1.5038,scaleY:1.5038},0).wait(564));

	// waves_obj_
	this.waves = new lib.Scene_1_waves();
	this.waves.name = "waves";
	this.waves.depth = 0;
	this.waves.isAttachedToCamera = 0
	this.waves.isAttachedToMask = 0
	this.waves.layerDepth = 0
	this.waves.layerIndex = 16
	this.waves.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.waves).wait(1).to({regX:214.4,regY:120.6,scaleX:1.5038,scaleY:1.5038},0).wait(564));

	// pool_obj_
	this.pool = new lib.Scene_1_pool();
	this.pool.name = "pool";
	this.pool.depth = 0;
	this.pool.isAttachedToCamera = 0
	this.pool.isAttachedToMask = 0
	this.pool.layerDepth = 0
	this.pool.layerIndex = 17
	this.pool.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.pool).wait(1).to({regX:214.4,regY:120.6,scaleX:1.5038,scaleY:1.5038},0).wait(1).to({regX:220.8,regY:119.4,x:-0.05,y:0.1},0).wait(233).to({regX:14.2,regY:74.5,scaleX:1.4014,scaleY:1.4014,x:0,y:0},0).wait(330));

	// stageBackground
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(0,0,0,0)").ss(1,1,1,3,true).p("Ehljg5zMDLHAAAMAAABznMjLHAAAg");
	this.shape.setTransform(640,360);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("EhljA50MAAAhznMDLHAAAMAAABzng");
	this.shape_1.setTransform(640,360);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(565));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,3133.8,978.1);
// library properties:
lib.properties = {
	id: '187D8EA461DA844F85B4E0013DE7EB7F',
	width: 1280,
	height: 720,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_221.png?1598289034154", id:"CachedBmp_221"},
		{src:"images/CachedBmp_319.png?1598289034154", id:"CachedBmp_319"},
		{src:"images/CachedBmp_318.png?1598289034154", id:"CachedBmp_318"},
		{src:"images/CachedBmp_316.png?1598289034154", id:"CachedBmp_316"},
		{src:"images/CachedBmp_315.png?1598289034154", id:"CachedBmp_315"},
		{src:"images/CachedBmp_313.png?1598289034154", id:"CachedBmp_313"},
		{src:"images/CachedBmp_16.png?1598289034154", id:"CachedBmp_16"},
		{src:"images/CachedBmp_13.png?1598289034154", id:"CachedBmp_13"},
		{src:"images/CachedBmp_290.png?1598289034154", id:"CachedBmp_290"},
		{src:"images/CachedBmp_289.png?1598289034154", id:"CachedBmp_289"},
		{src:"images/CachedBmp_288.png?1598289034154", id:"CachedBmp_288"},
		{src:"images/Chen_Jumpper_atlas_1.png?1598289033811", id:"Chen_Jumpper_atlas_1"},
		{src:"images/Chen_Jumpper_atlas_2.png?1598289033811", id:"Chen_Jumpper_atlas_2"},
		{src:"images/Chen_Jumpper_atlas_3.png?1598289033812", id:"Chen_Jumpper_atlas_3"},
		{src:"images/Chen_Jumpper_atlas_4.png?1598289033812", id:"Chen_Jumpper_atlas_4"},
		{src:"sounds/PourWater2.mp3?1598289034154", id:"PourWater2"},
		{src:"sounds/Record1.mp3?1598289034154", id:"Record1"},
		{src:"sounds/Record2.mp3?1598289034154", id:"Record2"},
		{src:"sounds/Record3.mp3?1598289034154", id:"Record3"},
		{src:"sounds/Record4.mp3?1598289034154", id:"Record4"},
		{src:"sounds/Splash.mp3?1598289034154", id:"Splash"},
		{src:"sounds/whistle.mp3?1598289034154", id:"whistle"}
	],
	preloads: []
};



// bootstrap callback support:

(lib.Stage = function(canvas) {
	createjs.Stage.call(this, canvas);
}).prototype = p = new createjs.Stage();

p.setAutoPlay = function(autoPlay) {
	this.tickEnabled = autoPlay;
}
p.play = function() { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
p.stop = function(ms) { if(ms) this.seek(ms); this.tickEnabled = false; }
p.seek = function(ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
p.getDuration = function() { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

p.getTimelinePosition = function() { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

an.bootcompsLoaded = an.bootcompsLoaded || [];
if(!an.bootstrapListeners) {
	an.bootstrapListeners=[];
}

an.bootstrapCallback=function(fnCallback) {
	an.bootstrapListeners.push(fnCallback);
	if(an.bootcompsLoaded.length > 0) {
		for(var i=0; i<an.bootcompsLoaded.length; ++i) {
			fnCallback(an.bootcompsLoaded[i]);
		}
	}
};

an.compositions = an.compositions || {};
an.compositions['187D8EA461DA844F85B4E0013DE7EB7F'] = {
	getStage: function() { return exportRoot.stage; },
	getLibrary: function() { return lib; },
	getSpriteSheet: function() { return ss; },
	getImages: function() { return img; }
};

an.compositionLoaded = function(id) {
	an.bootcompsLoaded.push(id);
	for(var j=0; j<an.bootstrapListeners.length; j++) {
		an.bootstrapListeners[j](id);
	}
}

an.getComposition = function(id) {
	return an.compositions[id];
}

p._getProjectionMatrix = function(container, totalDepth) {	var focalLength = 528.25;
	var projectionCenter = { x : lib.properties.width/2, y : lib.properties.height/2 };
	var scale = (totalDepth + focalLength)/focalLength;
	var scaleMat = new createjs.Matrix2D;
	scaleMat.a = 1/scale;
	scaleMat.d = 1/scale;
	var projMat = new createjs.Matrix2D;
	projMat.tx = -projectionCenter.x;
	projMat.ty = -projectionCenter.y;
	projMat = projMat.prependMatrix(scaleMat);
	projMat.tx += projectionCenter.x;
	projMat.ty += projectionCenter.y;
	return projMat;
}
p._handleTick = function(event) {
	var cameraInstance = exportRoot.___camera___instance;
	if(cameraInstance !== undefined && cameraInstance.pinToObject !== undefined)
	{
		cameraInstance.x = cameraInstance.pinToObject.x + cameraInstance.pinToObject.pinOffsetX;
		cameraInstance.y = cameraInstance.pinToObject.y + cameraInstance.pinToObject.pinOffsetY;
		if(cameraInstance.pinToObject.parent !== undefined && cameraInstance.pinToObject.parent.depth !== undefined)
		cameraInstance.depth = cameraInstance.pinToObject.parent.depth + cameraInstance.pinToObject.pinOffsetZ;
	}
	stage._applyLayerZDepth(exportRoot);
}
p._applyLayerZDepth = function(parent)
{
	var cameraInstance = parent.___camera___instance;
	var focalLength = 528.25;
	var projectionCenter = { 'x' : 0, 'y' : 0};
	if(parent === exportRoot)
	{
		var stageCenter = { 'x' : lib.properties.width/2, 'y' : lib.properties.height/2 };
		projectionCenter.x = stageCenter.x;
		projectionCenter.y = stageCenter.y;
	}
	for(child in parent.children)
	{
		var layerObj = parent.children[child];
		if(layerObj == cameraInstance)
			continue;
		stage._applyLayerZDepth(layerObj, cameraInstance);
		if(layerObj.layerDepth === undefined)
			continue;
		if(layerObj.currentFrame != layerObj.parent.currentFrame)
		{
			layerObj.gotoAndPlay(layerObj.parent.currentFrame);
		}
		var matToApply = new createjs.Matrix2D;
		var cameraMat = new createjs.Matrix2D;
		var totalDepth = layerObj.layerDepth ? layerObj.layerDepth : 0;
		var cameraDepth = 0;
		if(cameraInstance && !layerObj.isAttachedToCamera)
		{
			var mat = cameraInstance.getMatrix();
			mat.tx -= projectionCenter.x;
			mat.ty -= projectionCenter.y;
			cameraMat = mat.invert();
			cameraMat.prependTransform(projectionCenter.x, projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
			cameraMat.appendTransform(-projectionCenter.x, -projectionCenter.y, 1, 1, 0, 0, 0, 0, 0);
			if(cameraInstance.depth)
				cameraDepth = cameraInstance.depth;
		}
		if(layerObj.depth)
		{
			totalDepth = layerObj.depth;
		}
		//Offset by camera depth
		totalDepth -= cameraDepth;
		if(totalDepth < -focalLength)
		{
			matToApply.a = 0;
			matToApply.d = 0;
		}
		else
		{
			if(layerObj.layerDepth)
			{
				var sizeLockedMat = stage._getProjectionMatrix(parent, layerObj.layerDepth);
				if(sizeLockedMat)
				{
					sizeLockedMat.invert();
					matToApply.prependMatrix(sizeLockedMat);
				}
			}
			matToApply.prependMatrix(cameraMat);
			var projMat = stage._getProjectionMatrix(parent, totalDepth);
			if(projMat)
			{
				matToApply.prependMatrix(projMat);
			}
		}
		layerObj.transformMatrix = matToApply;
	}
}
an.makeResponsive = function(isResp, respDim, isScale, scaleType, domContainers) {		
	var lastW, lastH, lastS=1;		
	window.addEventListener('resize', resizeCanvas);		
	resizeCanvas();		
	function resizeCanvas() {			
		var w = lib.properties.width, h = lib.properties.height;			
		var iw = window.innerWidth, ih=window.innerHeight;			
		var pRatio = window.devicePixelRatio || 1, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
		if(isResp) {                
			if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
				sRatio = lastS;                
			}				
			else if(!isScale) {					
				if(iw<w || ih<h)						
					sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==1) {					
				sRatio = Math.min(xRatio, yRatio);				
			}				
			else if(scaleType==2) {					
				sRatio = Math.max(xRatio, yRatio);				
			}			
		}
		domContainers[0].width = w * pRatio * sRatio;			
		domContainers[0].height = h * pRatio * sRatio;
		domContainers.forEach(function(container) {				
			container.style.width = w * sRatio + 'px';				
			container.style.height = h * sRatio + 'px';			
		});
		stage.scaleX = pRatio*sRatio;			
		stage.scaleY = pRatio*sRatio;
		lastW = iw; lastH = ih; lastS = sRatio;            
		stage.tickOnUpdate = false;            
		stage.update();            
		stage.tickOnUpdate = true;		
	}
}

// Virtual camera API : 

an.VirtualCamera = new function() {
var _camera = new Object();
function VC(timeline) {
	this.timeline = timeline;
	this.camera = timeline.___camera___instance;
	this.centerX = lib.properties.width / 2;
	this.centerY = lib.properties.height / 2;
	this.camAxisX = this.camera.x;
	this.camAxisY = this.camera.y;
	if(timeline.___camera___instance == null || timeline.___camera___instance == undefined ) {
		timeline.___camera___instance = new cjs.MovieClip();
		timeline.___camera___instance.visible = false;
		timeline.___camera___instance.parent = timeline;
		timeline.___camera___instance.setTransform(this.centerX, this.centerY);
	}
	this.camera = timeline.___camera___instance;
}

VC.prototype.moveBy = function(x, y, z) {
z = typeof z !== 'undefined' ? z : 0;
	var position = this.___getCamPosition___();
	var rotAngle = this.getRotation()*Math.PI/180;
	var sinTheta = Math.sin(rotAngle);
	var cosTheta = Math.cos(rotAngle);
	var offX= x*cosTheta + y*sinTheta;
	var offY = y*cosTheta - x*sinTheta;
	this.camAxisX = this.camAxisX - x;
	this.camAxisY = this.camAxisY - y;
	var posX = position.x + offX;
	var posY = position.y + offY;
	this.camera.x = this.centerX - posX;
	this.camera.y = this.centerY - posY;
	this.camera.depth += z;
};

VC.prototype.setPosition = function(x, y, z) {
	z = typeof z !== 'undefined' ? z : 0;

	const MAX_X = 10000;
	const MIN_X = -10000;
	const MAX_Y = 10000;
	const MIN_Y = -10000;
	const MAX_Z = 10000;
	const MIN_Z = -5000;

	if(x > MAX_X)
	  x = MAX_X;
	else if(x < MIN_X)
	  x = MIN_X;
	if(y > MAX_Y)
	  y = MAX_Y;
	else if(y < MIN_Y)
	  y = MIN_Y;
	if(z > MAX_Z)
	  z = MAX_Z;
	else if(z < MIN_Z)
	  z = MIN_Z;

	var rotAngle = this.getRotation()*Math.PI/180;
	var sinTheta = Math.sin(rotAngle);
	var cosTheta = Math.cos(rotAngle);
	var offX= x*cosTheta + y*sinTheta;
	var offY = y*cosTheta - x*sinTheta;
	
	this.camAxisX = this.centerX - x;
	this.camAxisY = this.centerY - y;
	this.camera.x = this.centerX - offX;
	this.camera.y = this.centerY - offY;
	this.camera.depth = z;
};

VC.prototype.getPosition = function() {
	var loc = new Object();
	loc['x'] = this.centerX - this.camAxisX;
	loc['y'] = this.centerY - this.camAxisY;
	loc['z'] = this.camera.depth;
	return loc;
};

VC.prototype.resetPosition = function() {
	this.setPosition(0, 0);
};

VC.prototype.zoomBy = function(zoom) {
	this.setZoom( (this.getZoom() * zoom) / 100);
};

VC.prototype.setZoom = function(zoom) {
	const MAX_zoom = 10000;
	const MIN_zoom = 1;
	if(zoom > MAX_zoom)
	zoom = MAX_zoom;
	else if(zoom < MIN_zoom)
	zoom = MIN_zoom;
	this.camera.scaleX = 100 / zoom;
	this.camera.scaleY = 100 / zoom;
};

VC.prototype.getZoom = function() {
	return 100 / this.camera.scaleX;
};

VC.prototype.resetZoom = function() {
	this.setZoom(100);
};

VC.prototype.rotateBy = function(angle) {
	this.setRotation( this.getRotation() + angle );
};

VC.prototype.setRotation = function(angle) {
	const MAX_angle = 180;
	const MIN_angle = -179;
	if(angle > MAX_angle)
		angle = MAX_angle;
	else if(angle < MIN_angle)
		angle = MIN_angle;
	this.camera.rotation = -angle;
};

VC.prototype.getRotation = function() {
	return -this.camera.rotation;
};

VC.prototype.resetRotation = function() {
	this.setRotation(0);
};

VC.prototype.reset = function() {
	this.resetPosition();
	this.resetZoom();
	this.resetRotation();
	this.unpinCamera();
};
VC.prototype.setZDepth = function(zDepth) {
	const MAX_zDepth = 10000;
	const MIN_zDepth = -5000;
	if(zDepth > MAX_zDepth)
		zDepth = MAX_zDepth;
	else if(zDepth < MIN_zDepth)
		zDepth = MIN_zDepth;
	this.camera.depth = zDepth;
}
VC.prototype.getZDepth = function() {
	return this.camera.depth;
}
VC.prototype.resetZDepth = function() {
	this.camera.depth = 0;
}

VC.prototype.pinCameraToObject = function(obj, offsetX, offsetY, offsetZ) {

	offsetX = typeof offsetX !== 'undefined' ? offsetX : 0;

	offsetY = typeof offsetY !== 'undefined' ? offsetY : 0;

	offsetZ = typeof offsetZ !== 'undefined' ? offsetZ : 0;
	if(obj === undefined)
		return;
	this.camera.pinToObject = obj;
	this.camera.pinToObject.pinOffsetX = offsetX;
	this.camera.pinToObject.pinOffsetY = offsetY;
	this.camera.pinToObject.pinOffsetZ = offsetZ;
};

VC.prototype.setPinOffset = function(offsetX, offsetY, offsetZ) {
	if(this.camera.pinToObject != undefined) {
	this.camera.pinToObject.pinOffsetX = offsetX;
	this.camera.pinToObject.pinOffsetY = offsetY;
	this.camera.pinToObject.pinOffsetZ = offsetZ;
	}
};

VC.prototype.unpinCamera = function() {
	this.camera.pinToObject = undefined;
};
VC.prototype.___getCamPosition___ = function() {
	var loc = new Object();
	loc['x'] = this.centerX - this.camera.x;
	loc['y'] = this.centerY - this.camera.y;
	loc['z'] = this.depth;
	return loc;
};

this.getCamera = function(timeline) {
	timeline = typeof timeline !== 'undefined' ? timeline : null;
	if(timeline === null) timeline = exportRoot;
	if(_camera[timeline] == undefined)
	_camera[timeline] = new VC(timeline);
	return _camera[timeline];
}

this.getCameraAsMovieClip = function(timeline) {
	timeline = typeof timeline !== 'undefined' ? timeline : null;
	if(timeline === null) timeline = exportRoot;
	return this.getCamera(timeline).camera;
}
}


// Layer depth API : 

an.Layer = new function() {
	this.getLayerZDepth = function(timeline, layerName)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth; else 0;";
		return eval(script);
	}
	this.setLayerZDepth = function(timeline, layerName, zDepth)
	{
		const MAX_zDepth = 10000;
		const MIN_zDepth = -5000;
		if(zDepth > MAX_zDepth)
			zDepth = MAX_zDepth;
		else if(zDepth < MIN_zDepth)
			zDepth = MIN_zDepth;
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline." + layerName + ".depth = " + zDepth + ";";
		eval(script);
	}
	this.removeLayer = function(timeline, layerName)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		var script = "if(timeline." + layerName + ") timeline.removeChild(timeline." + layerName + ");";
		eval(script);
	}
	this.addNewLayer = function(timeline, layerName, zDepth)
	{
		if(layerName === "Camera")
		layerName = "___camera___instance";
		zDepth = typeof zDepth !== 'undefined' ? zDepth : 0;
		var layer = new createjs.MovieClip();
		layer.name = layerName;
		layer.depth = zDepth;
		layer.layerIndex = 0;
		timeline.addChild(layer);
	}
}
an.handleSoundStreamOnTick = function(event) {
	if(!event.paused){
		var stageChild = stage.getChildAt(0);
		if(!stageChild.paused){
			stageChild.syncStreamSounds();
		}
	}
}


})(createjs = createjs||{}, AdobeAn = AdobeAn||{});
var createjs, AdobeAn;