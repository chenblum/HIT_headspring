(function (cjs, an) {

var p; // shortcut to reference prototypes
var lib={};var ss={};var img={};
lib.ssMetadata = [
		{name:"Jumpper_atlas_1", frames: [[0,0,1848,937],[0,939,1805,946]]},
		{name:"Jumpper_atlas_2", frames: [[0,1062,656,701],[972,531,772,572],[0,0,970,529],[658,1105,1042,378],[972,0,970,529],[0,531,970,529],[658,1485,1042,378]]},
		{name:"Jumpper_atlas_3", frames: [[0,1445,2041,110],[0,1327,2044,116],[0,1557,1245,153],[1151,0,313,349],[1151,351,313,349],[1247,1557,313,349],[1641,956,349,313],[338,722,1240,198],[0,0,336,964],[1580,0,244,954],[813,1163,540,159],[0,966,811,359],[338,0,811,359],[1562,1557,476,191],[338,361,811,359],[813,956,826,205],[0,1712,826,205]]},
		{name:"Jumpper_atlas_4", frames: [[542,160,42,23],[103,951,8,4],[604,492,70,158],[607,652,70,158],[607,812,70,158],[542,0,70,158],[0,322,519,115],[0,439,519,115],[0,556,519,115],[0,673,519,115],[0,951,101,65],[0,790,126,159],[0,0,540,159],[0,161,540,159],[333,790,91,168],[605,160,39,168],[521,322,82,168],[426,790,89,168],[646,0,35,168],[234,790,97,168],[521,492,81,168],[517,790,88,168],[128,790,104,168]]}
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



(lib.CachedBmp_219 = function() {
	this.initialize(img.CachedBmp_219);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,6147,44);


(lib.CachedBmp_218 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_217 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_216 = function() {
	this.initialize(img.CachedBmp_216);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2140,414);


(lib.CachedBmp_169 = function() {
	this.initialize(img.CachedBmp_169);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2738,491);


(lib.CachedBmp_168 = function() {
	this.initialize(ss["Jumpper_atlas_3"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_167 = function() {
	this.initialize(img.CachedBmp_167);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,4424,1836);


(lib.CachedBmp_116 = function() {
	this.initialize(img.CachedBmp_116);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,2580,163);


(lib.CachedBmp_197 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_215 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_189 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_52 = function() {
	this.initialize(ss["Jumpper_atlas_3"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_51 = function() {
	this.initialize(img.CachedBmp_51);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,6831,2034);


(lib.CachedBmp_192 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_49 = function() {
	this.initialize(ss["Jumpper_atlas_2"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_48 = function() {
	this.initialize(ss["Jumpper_atlas_3"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_47 = function() {
	this.initialize(ss["Jumpper_atlas_3"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_46 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_45 = function() {
	this.initialize(ss["Jumpper_atlas_2"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_44 = function() {
	this.initialize(ss["Jumpper_atlas_3"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_43 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_42 = function() {
	this.initialize(ss["Jumpper_atlas_3"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_41 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_40 = function() {
	this.initialize(ss["Jumpper_atlas_3"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_39 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_38 = function() {
	this.initialize(ss["Jumpper_atlas_3"]);
	this.gotoAndStop(7);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_37 = function() {
	this.initialize(ss["Jumpper_atlas_3"]);
	this.gotoAndStop(8);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_36 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_35 = function() {
	this.initialize(ss["Jumpper_atlas_3"]);
	this.gotoAndStop(9);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_34 = function() {
	this.initialize(ss["Jumpper_atlas_2"]);
	this.gotoAndStop(2);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_33 = function() {
	this.initialize(ss["Jumpper_atlas_2"]);
	this.gotoAndStop(3);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_32 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_31 = function() {
	this.initialize(ss["Jumpper_atlas_3"]);
	this.gotoAndStop(10);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_30 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_29 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_28 = function() {
	this.initialize(ss["Jumpper_atlas_3"]);
	this.gotoAndStop(11);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_27 = function() {
	this.initialize(ss["Jumpper_atlas_3"]);
	this.gotoAndStop(12);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_26 = function() {
	this.initialize(ss["Jumpper_atlas_1"]);
	this.gotoAndStop(0);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_25 = function() {
	this.initialize(ss["Jumpper_atlas_3"]);
	this.gotoAndStop(13);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_24 = function() {
	this.initialize(ss["Jumpper_atlas_1"]);
	this.gotoAndStop(1);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_23 = function() {
	this.initialize(ss["Jumpper_atlas_2"]);
	this.gotoAndStop(4);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_22 = function() {
	this.initialize(ss["Jumpper_atlas_2"]);
	this.gotoAndStop(5);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_21 = function() {
	this.initialize(ss["Jumpper_atlas_2"]);
	this.gotoAndStop(6);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_20 = function() {
	this.initialize(ss["Jumpper_atlas_3"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_19 = function() {
	this.initialize(img.CachedBmp_19);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,6519,838);


(lib.CachedBmp_18 = function() {
	this.initialize(img.CachedBmp_18);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,6519,838);


(lib.CachedBmp_17 = function() {
	this.initialize(ss["Jumpper_atlas_3"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_16 = function() {
	this.initialize(img.CachedBmp_16);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,3687,969);


(lib.CachedBmp_15 = function() {
	this.initialize(ss["Jumpper_atlas_3"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_14 = function() {
	this.initialize(img.CachedBmp_14);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,3682,398);


(lib.CachedBmp_13 = function() {
	this.initialize(img.CachedBmp_13);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,6617,482);


(lib.CachedBmp_12 = function() {
	this.initialize(img.CachedBmp_12);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,6519,680);


(lib.CachedBmp_11 = function() {
	this.initialize(img.CachedBmp_11);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,6519,678);


(lib.CachedBmp_10 = function() {
	this.initialize(img.CachedBmp_10);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,6519,681);


(lib.CachedBmp_9 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(14);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_8 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(15);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_7 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(16);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_6 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(17);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_5 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(18);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_4 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(19);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_3 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(20);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_2 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(21);
}).prototype = p = new cjs.Sprite();



(lib.CachedBmp_1 = function() {
	this.initialize(ss["Jumpper_atlas_4"]);
	this.gotoAndStop(22);
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
	this.instance = new lib.CachedBmp_219();
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
	this.instance = new lib.CachedBmp_49();
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
	this.instance = new lib.CachedBmp_48();
	this.instance.setTransform(-1.15,0,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1));

	this._renderFirstFrame();

}).prototype = getMCSymbolPrototype(lib.swimmer, new cjs.Rectangle(-1.1,0,622.5,76.5), null);


(lib.Scene_1_water_splash_1 = function(mode,startPosition,loop,reversed) {
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
	this.instance = new lib.CachedBmp_27();
	this.instance.setTransform(1345.75,471.3,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_28();
	this.instance_1.setTransform(1345.75,471.3,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_29();
	this.instance_2.setTransform(1412.85,471.3,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_30();
	this.instance_3.setTransform(1412.85,471.3,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_31();
	this.instance_4.setTransform(1412.85,471.3,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_32();
	this.instance_5.setTransform(1412.85,471.3,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},337).to({state:[{t:this.instance_1}]},17).to({state:[{t:this.instance_2}]},15).to({state:[{t:this.instance_3}]},17).to({state:[{t:this.instance_4}]},9).to({state:[{t:this.instance_5}]},15).to({state:[]},9).wait(138));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,1751.3,650.8);


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

	// timeline functions:
	this.frame_514 = function() {
		playSound("Splash");
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).wait(514).call(this.frame_514).wait(23));

	// water_splash
	this.instance = new lib.CachedBmp_18();
	this.instance.setTransform(155.85,471.25,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_19();
	this.instance_1.setTransform(155.85,471.25,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_20();
	this.instance_2.setTransform(1345.55,471.25,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},512).to({state:[{t:this.instance_1}]},2).to({state:[{t:this.instance_2}]},20).to({state:[]},2).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,3415.4,890.3);


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
	this.instance = new lib.CachedBmp_34();
	this.instance.setTransform(151.7,179.15,0.5,0.5);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(240).to({_off:false},0).to({_off:true},6).wait(311));

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
	this.instance = new lib.CachedBmp_22();
	this.instance.setTransform(151.7,179.15,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_23();
	this.instance_1.setTransform(151.7,179.15,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},479).to({state:[{t:this.instance_1}]},5).to({state:[]},1).wait(68));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,636.7,443.7);


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
	this.instance = new lib.CachedBmp_10();
	this.instance.setTransform(155.85,549.55,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_11();
	this.instance_1.setTransform(155.85,551.5,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_12();
	this.instance_2.setTransform(121.05,551.5,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_13();
	this.instance_3.setTransform(155.85,649.2,0.5,0.5);

	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(94,203,238,0.498)").s().p("Ej+oA4vMAMshyUMHkRAAwMAMUBybg");
	this.shape.setTransform(1766,890.7,1,0.2991,0,0,0,0,365.8);

	this.instance_4 = new lib.CachedBmp_15();
	this.instance_4.setTransform(1301.4,551.5,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_14();
	this.instance_5.setTransform(1384.9,485.7,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_17();
	this.instance_6.setTransform(1301.4,551.5,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_16();
	this.instance_7.setTransform(1384.9,485.7,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},337).to({state:[{t:this.instance_1}]},8).to({state:[{t:this.instance_2}]},42).to({state:[{t:this.instance_3}]},14).to({state:[{t:this.shape}]},3).to({state:[]},68).to({state:[{t:this.instance_5},{t:this.instance_4}]},39).to({state:[{t:this.instance_7},{t:this.instance_6}]},23).wait(19));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,3464.4,970.2);


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
	this.shape.setTransform(132.6206,511.4578,0.8555,0.8555);
	this.shape._off = true;

	this.timeline.addTween(cjs.Tween.get(this.shape).wait(1).to({_off:false},0).wait(89).to({x:132.6391,y:511.4545},0).wait(467));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,258.7,606.9);


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
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF0000").ss(5,1,1).p("ASIAAQAAC6lUCEQlUCEngAAQngAAlUiEQlUiEAAi6QAAi6FUiEQFUiEHgAAQHgAAFUCEQFUCEAAC6g");
	this.shape.setTransform(1536.4,573.15);

	this.instance = new lib.CachedBmp_24();
	this.instance.setTransform(754.8,150.45,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_25();
	this.instance_1.setTransform(1417.2,525.7,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape}]},228).to({state:[{t:this.instance}]},9).to({state:[{t:this.instance_1}]},99).to({state:[]},7).wait(137));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,1657.3,623.5);


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

	this.instance = new lib.CachedBmp_26();
	this.instance.setTransform(730.9,152.65,0.5,0.5);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape}]},228).to({state:[{t:this.instance}]},9).to({state:[]},98).wait(70));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,1655,621.2);


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
	this.instance = new lib.CachedBmp_33();
	this.instance.setTransform(181.8,206.95,0.5,0.5);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(246).to({_off:false},0).to({_off:true},7).wait(304));

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
	this.instance = new lib.CachedBmp_40();
	this.instance.setTransform(81.15,-25,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_39();
	this.instance_1.setTransform(38.7,141.75,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_42();
	this.instance_2.setTransform(90.15,-34,0.5,0.5);

	this.instance_3 = new lib.CachedBmp_41();
	this.instance_3.setTransform(38.7,141.75,0.5,0.5);

	this.instance_4 = new lib.CachedBmp_44();
	this.instance_4.setTransform(90.15,-34,0.5,0.5);

	this.instance_5 = new lib.CachedBmp_43();
	this.instance_5.setTransform(38.7,141.75,0.5,0.5);

	this.instance_6 = new lib.CachedBmp_47();
	this.instance_6.setTransform(90.15,-34,0.5,0.5);

	this.instance_7 = new lib.CachedBmp_46();
	this.instance_7.setTransform(38.7,141.75,0.5,0.5);

	this.instance_8 = new lib.CachedBmp_45();
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
	this.instance = new lib.CachedBmp_38();
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
	this.instance = new lib.CachedBmp_218();
	this.instance.setTransform(2959.3,496.4,0.5,0.5);

	this.instance_1 = new lib.Path_3_0();
	this.instance_1.setTransform(2977.45,509.8,1,1,0,0,0,9.6,5.2);
	this.instance_1.alpha = 0.5;
	this.instance_1.compositeOperation = "screen";

	this.instance_2 = new lib.CachedBmp_217();
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

	this.instance_10 = new lib.CachedBmp_216();
	this.instance_10.setTransform(2235.25,102.1,0.5,0.5);

	this.instance_11 = new lib.Path_160();
	this.instance_11.setTransform(3253,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_11.alpha = 0.1992;
	this.instance_11.compositeOperation = "multiply";

	this.instance_12 = new lib.CachedBmp_215();
	this.instance_12.setTransform(3235.35,70.75,0.5,0.5);

	this.instance_13 = new lib.Path_159();
	this.instance_13.setTransform(3211.65,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_13.alpha = 0.1992;
	this.instance_13.compositeOperation = "multiply";

	this.instance_14 = new lib.CachedBmp_215();
	this.instance_14.setTransform(3194,70.75,0.5,0.5);

	this.instance_15 = new lib.Path_158();
	this.instance_15.setTransform(3172.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_15.alpha = 0.1992;
	this.instance_15.compositeOperation = "multiply";

	this.instance_16 = new lib.CachedBmp_215();
	this.instance_16.setTransform(3155.1,70.75,0.5,0.5);

	this.instance_17 = new lib.Path_157();
	this.instance_17.setTransform(3134.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_17.alpha = 0.1992;
	this.instance_17.compositeOperation = "multiply";

	this.instance_18 = new lib.CachedBmp_215();
	this.instance_18.setTransform(3116.4,70.75,0.5,0.5);

	this.instance_19 = new lib.Path_156();
	this.instance_19.setTransform(3095.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_19.alpha = 0.1992;
	this.instance_19.compositeOperation = "multiply";

	this.instance_20 = new lib.CachedBmp_215();
	this.instance_20.setTransform(3077.75,70.75,0.5,0.5);

	this.instance_21 = new lib.Path_155();
	this.instance_21.setTransform(3056.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_21.alpha = 0.1992;
	this.instance_21.compositeOperation = "multiply";

	this.instance_22 = new lib.CachedBmp_215();
	this.instance_22.setTransform(3039.05,70.75,0.5,0.5);

	this.instance_23 = new lib.Path_154();
	this.instance_23.setTransform(3018.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_23.alpha = 0.1992;
	this.instance_23.compositeOperation = "multiply";

	this.instance_24 = new lib.CachedBmp_215();
	this.instance_24.setTransform(3000.4,70.75,0.5,0.5);

	this.instance_25 = new lib.Path_153();
	this.instance_25.setTransform(2979.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_25.alpha = 0.1992;
	this.instance_25.compositeOperation = "multiply";

	this.instance_26 = new lib.CachedBmp_215();
	this.instance_26.setTransform(2961.75,70.75,0.5,0.5);

	this.instance_27 = new lib.Path_152();
	this.instance_27.setTransform(2940.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_27.alpha = 0.1992;
	this.instance_27.compositeOperation = "multiply";

	this.instance_28 = new lib.CachedBmp_215();
	this.instance_28.setTransform(2923.05,70.75,0.5,0.5);

	this.instance_29 = new lib.Path_151();
	this.instance_29.setTransform(2902.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_29.alpha = 0.1992;
	this.instance_29.compositeOperation = "multiply";

	this.instance_30 = new lib.CachedBmp_215();
	this.instance_30.setTransform(2884.4,70.75,0.5,0.5);

	this.instance_31 = new lib.Path_150();
	this.instance_31.setTransform(2863.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_31.alpha = 0.1992;
	this.instance_31.compositeOperation = "multiply";

	this.instance_32 = new lib.CachedBmp_215();
	this.instance_32.setTransform(2845.75,70.75,0.5,0.5);

	this.instance_33 = new lib.Path_149();
	this.instance_33.setTransform(2824.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_33.alpha = 0.1992;
	this.instance_33.compositeOperation = "multiply";

	this.instance_34 = new lib.CachedBmp_215();
	this.instance_34.setTransform(2807.05,70.75,0.5,0.5);

	this.instance_35 = new lib.Path_148();
	this.instance_35.setTransform(2786.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_35.alpha = 0.1992;
	this.instance_35.compositeOperation = "multiply";

	this.instance_36 = new lib.CachedBmp_215();
	this.instance_36.setTransform(2768.4,70.75,0.5,0.5);

	this.instance_37 = new lib.Path_147();
	this.instance_37.setTransform(2747.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_37.alpha = 0.1992;
	this.instance_37.compositeOperation = "multiply";

	this.instance_38 = new lib.CachedBmp_215();
	this.instance_38.setTransform(2729.75,70.75,0.5,0.5);

	this.instance_39 = new lib.Path_146();
	this.instance_39.setTransform(2708.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_39.alpha = 0.1992;
	this.instance_39.compositeOperation = "multiply";

	this.instance_40 = new lib.CachedBmp_215();
	this.instance_40.setTransform(2691.05,70.75,0.5,0.5);

	this.instance_41 = new lib.Path_145();
	this.instance_41.setTransform(2670.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_41.alpha = 0.1992;
	this.instance_41.compositeOperation = "multiply";

	this.instance_42 = new lib.CachedBmp_215();
	this.instance_42.setTransform(2652.4,70.75,0.5,0.5);

	this.instance_43 = new lib.Path_144();
	this.instance_43.setTransform(2631.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_43.alpha = 0.1992;
	this.instance_43.compositeOperation = "multiply";

	this.instance_44 = new lib.CachedBmp_215();
	this.instance_44.setTransform(2613.75,70.75,0.5,0.5);

	this.instance_45 = new lib.Path_143();
	this.instance_45.setTransform(2554.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_45.alpha = 0.1992;
	this.instance_45.compositeOperation = "multiply";

	this.instance_46 = new lib.CachedBmp_215();
	this.instance_46.setTransform(2536.4,70.75,0.5,0.5);

	this.instance_47 = new lib.Path_142();
	this.instance_47.setTransform(2515.35,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_47.alpha = 0.1992;
	this.instance_47.compositeOperation = "multiply";

	this.instance_48 = new lib.CachedBmp_197();
	this.instance_48.setTransform(2497.7,70.75,0.5,0.5);

	this.instance_49 = new lib.Path_141();
	this.instance_49.setTransform(2360.25,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_49.alpha = 0.1992;
	this.instance_49.compositeOperation = "multiply";

	this.instance_50 = new lib.CachedBmp_215();
	this.instance_50.setTransform(2342.6,70.75,0.5,0.5);

	this.instance_51 = new lib.Path_140();
	this.instance_51.setTransform(2476.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_51.alpha = 0.1992;
	this.instance_51.compositeOperation = "multiply";

	this.instance_52 = new lib.CachedBmp_215();
	this.instance_52.setTransform(2459.05,70.75,0.5,0.5);

	this.instance_53 = new lib.Path_139();
	this.instance_53.setTransform(2438.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_53.alpha = 0.1992;
	this.instance_53.compositeOperation = "multiply";

	this.instance_54 = new lib.CachedBmp_215();
	this.instance_54.setTransform(2420.4,70.75,0.5,0.5);

	this.instance_55 = new lib.Path_138();
	this.instance_55.setTransform(2399.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_55.alpha = 0.1992;
	this.instance_55.compositeOperation = "multiply";

	this.instance_56 = new lib.CachedBmp_197();
	this.instance_56.setTransform(2381.7,70.75,0.5,0.5);

	this.instance_57 = new lib.Path_137();
	this.instance_57.setTransform(3271.45,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_57.alpha = 0.1992;
	this.instance_57.compositeOperation = "multiply";

	this.instance_58 = new lib.CachedBmp_192();
	this.instance_58.setTransform(3253.8,15.1,0.5,0.5);

	this.instance_59 = new lib.Path_136();
	this.instance_59.setTransform(3232.8,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_59.alpha = 0.1992;
	this.instance_59.compositeOperation = "multiply";

	this.instance_60 = new lib.CachedBmp_192();
	this.instance_60.setTransform(3215.15,15.1,0.5,0.5);

	this.instance_61 = new lib.Path_135();
	this.instance_61.setTransform(3191.5,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_61.alpha = 0.1992;
	this.instance_61.compositeOperation = "multiply";

	this.instance_62 = new lib.CachedBmp_192();
	this.instance_62.setTransform(3173.85,15.1,0.5,0.5);

	this.instance_63 = new lib.Path_134();
	this.instance_63.setTransform(3153,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_63.alpha = 0.1992;
	this.instance_63.compositeOperation = "multiply";

	this.instance_64 = new lib.CachedBmp_189();
	this.instance_64.setTransform(3135.3,15.1,0.5,0.5);

	this.instance_65 = new lib.Path_133();
	this.instance_65.setTransform(3114.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_65.alpha = 0.1992;
	this.instance_65.compositeOperation = "multiply";

	this.instance_66 = new lib.CachedBmp_192();
	this.instance_66.setTransform(3096.65,15.1,0.5,0.5);

	this.instance_67 = new lib.Path_132();
	this.instance_67.setTransform(3075.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_67.alpha = 0.1992;
	this.instance_67.compositeOperation = "multiply";

	this.instance_68 = new lib.CachedBmp_192();
	this.instance_68.setTransform(3058,15.1,0.5,0.5);

	this.instance_69 = new lib.Path_131();
	this.instance_69.setTransform(3037,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_69.alpha = 0.1992;
	this.instance_69.compositeOperation = "multiply";

	this.instance_70 = new lib.CachedBmp_192();
	this.instance_70.setTransform(3019.35,15.1,0.5,0.5);

	this.instance_71 = new lib.Path_130();
	this.instance_71.setTransform(2998.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_71.alpha = 0.1992;
	this.instance_71.compositeOperation = "multiply";

	this.instance_72 = new lib.CachedBmp_192();
	this.instance_72.setTransform(2980.65,15.1,0.5,0.5);

	this.instance_73 = new lib.Path_129();
	this.instance_73.setTransform(2959.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_73.alpha = 0.1992;
	this.instance_73.compositeOperation = "multiply";

	this.instance_74 = new lib.CachedBmp_192();
	this.instance_74.setTransform(2942,15.1,0.5,0.5);

	this.instance_75 = new lib.Path_128();
	this.instance_75.setTransform(2920.95,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_75.alpha = 0.1992;
	this.instance_75.compositeOperation = "multiply";

	this.instance_76 = new lib.CachedBmp_189();
	this.instance_76.setTransform(2903.3,15.1,0.5,0.5);

	this.instance_77 = new lib.Path_127();
	this.instance_77.setTransform(2882.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_77.alpha = 0.1992;
	this.instance_77.compositeOperation = "multiply";

	this.instance_78 = new lib.CachedBmp_192();
	this.instance_78.setTransform(2864.65,15.1,0.5,0.5);

	this.instance_79 = new lib.Path_126();
	this.instance_79.setTransform(2843.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_79.alpha = 0.1992;
	this.instance_79.compositeOperation = "multiply";

	this.instance_80 = new lib.CachedBmp_192();
	this.instance_80.setTransform(2826,15.1,0.5,0.5);

	this.instance_81 = new lib.Path_125();
	this.instance_81.setTransform(2804.95,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_81.alpha = 0.1992;
	this.instance_81.compositeOperation = "multiply";

	this.instance_82 = new lib.CachedBmp_192();
	this.instance_82.setTransform(2787.3,15.1,0.5,0.5);

	this.instance_83 = new lib.Path_124();
	this.instance_83.setTransform(2766.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_83.alpha = 0.1992;
	this.instance_83.compositeOperation = "multiply";

	this.instance_84 = new lib.CachedBmp_192();
	this.instance_84.setTransform(2748.65,15.1,0.5,0.5);

	this.instance_85 = new lib.Path_123();
	this.instance_85.setTransform(2727.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_85.alpha = 0.1992;
	this.instance_85.compositeOperation = "multiply";

	this.instance_86 = new lib.CachedBmp_192();
	this.instance_86.setTransform(2710,15.1,0.5,0.5);

	this.instance_87 = new lib.Path_122();
	this.instance_87.setTransform(2688.95,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_87.alpha = 0.1992;
	this.instance_87.compositeOperation = "multiply";

	this.instance_88 = new lib.CachedBmp_192();
	this.instance_88.setTransform(2671.3,15.1,0.5,0.5);

	this.instance_89 = new lib.Path_121();
	this.instance_89.setTransform(2650.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_89.alpha = 0.1992;
	this.instance_89.compositeOperation = "multiply";

	this.instance_90 = new lib.CachedBmp_192();
	this.instance_90.setTransform(2632.65,15.1,0.5,0.5);

	this.instance_91 = new lib.Path_120();
	this.instance_91.setTransform(2572.95,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_91.alpha = 0.1992;
	this.instance_91.compositeOperation = "multiply";

	this.instance_92 = new lib.CachedBmp_192();
	this.instance_92.setTransform(2555.3,15.1,0.5,0.5);

	this.instance_93 = new lib.Path_119();
	this.instance_93.setTransform(2534.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_93.alpha = 0.1992;
	this.instance_93.compositeOperation = "multiply";

	this.instance_94 = new lib.CachedBmp_192();
	this.instance_94.setTransform(2516.65,15.1,0.5,0.5);

	this.instance_95 = new lib.Path_118();
	this.instance_95.setTransform(2495.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_95.alpha = 0.1992;
	this.instance_95.compositeOperation = "multiply";

	this.instance_96 = new lib.CachedBmp_192();
	this.instance_96.setTransform(2478,15.1,0.5,0.5);

	this.instance_97 = new lib.Path_117();
	this.instance_97.setTransform(2456.95,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_97.alpha = 0.1992;
	this.instance_97.compositeOperation = "multiply";

	this.instance_98 = new lib.CachedBmp_192();
	this.instance_98.setTransform(2439.3,15.1,0.5,0.5);

	this.instance_99 = new lib.Path_116();
	this.instance_99.setTransform(2418.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_99.alpha = 0.1992;
	this.instance_99.compositeOperation = "multiply";

	this.instance_100 = new lib.CachedBmp_192();
	this.instance_100.setTransform(2400.65,15.1,0.5,0.5);

	this.instance_101 = new lib.Path_115();
	this.instance_101.setTransform(2379.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_101.alpha = 0.1992;
	this.instance_101.compositeOperation = "multiply";

	this.instance_102 = new lib.CachedBmp_192();
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

	this.instance_106 = new lib.CachedBmp_169();
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

	this.instance_116 = new lib.CachedBmp_168();
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

	this.instance_128 = new lib.CachedBmp_167();
	this.instance_128.setTransform(150.2,102.1,0.5,0.5);

	this.instance_129 = new lib.Path_114();
	this.instance_129.setTransform(2304.45,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_129.alpha = 0.1992;
	this.instance_129.compositeOperation = "multiply";

	this.instance_130 = new lib.CachedBmp_215();
	this.instance_130.setTransform(2286.8,70.75,0.5,0.5);

	this.instance_131 = new lib.Path_113();
	this.instance_131.setTransform(2343,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_131.alpha = 0.1992;
	this.instance_131.compositeOperation = "multiply";

	this.instance_132 = new lib.CachedBmp_215();
	this.instance_132.setTransform(2325.35,70.75,0.5,0.5);

	this.instance_133 = new lib.Path_112();
	this.instance_133.setTransform(2265.65,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_133.alpha = 0.1992;
	this.instance_133.compositeOperation = "multiply";

	this.instance_134 = new lib.CachedBmp_215();
	this.instance_134.setTransform(2248,70.75,0.5,0.5);

	this.instance_135 = new lib.Path_111();
	this.instance_135.setTransform(2226.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_135.alpha = 0.1992;
	this.instance_135.compositeOperation = "multiply";

	this.instance_136 = new lib.CachedBmp_215();
	this.instance_136.setTransform(2209.1,70.75,0.5,0.5);

	this.instance_137 = new lib.Path_110();
	this.instance_137.setTransform(2188.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_137.alpha = 0.1992;
	this.instance_137.compositeOperation = "multiply";

	this.instance_138 = new lib.CachedBmp_215();
	this.instance_138.setTransform(2170.4,70.75,0.5,0.5);

	this.instance_139 = new lib.Path_109();
	this.instance_139.setTransform(2149.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_139.alpha = 0.1992;
	this.instance_139.compositeOperation = "multiply";

	this.instance_140 = new lib.CachedBmp_215();
	this.instance_140.setTransform(2131.75,70.75,0.5,0.5);

	this.instance_141 = new lib.Path_108();
	this.instance_141.setTransform(2110.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_141.alpha = 0.1992;
	this.instance_141.compositeOperation = "multiply";

	this.instance_142 = new lib.CachedBmp_215();
	this.instance_142.setTransform(2093.05,70.75,0.5,0.5);

	this.instance_143 = new lib.Path_107();
	this.instance_143.setTransform(2072.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_143.alpha = 0.1992;
	this.instance_143.compositeOperation = "multiply";

	this.instance_144 = new lib.CachedBmp_215();
	this.instance_144.setTransform(2054.4,70.75,0.5,0.5);

	this.instance_145 = new lib.Path_106();
	this.instance_145.setTransform(2033.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_145.alpha = 0.1992;
	this.instance_145.compositeOperation = "multiply";

	this.instance_146 = new lib.CachedBmp_215();
	this.instance_146.setTransform(2015.75,70.75,0.5,0.5);

	this.instance_147 = new lib.Path_105();
	this.instance_147.setTransform(1994.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_147.alpha = 0.1992;
	this.instance_147.compositeOperation = "multiply";

	this.instance_148 = new lib.CachedBmp_215();
	this.instance_148.setTransform(1977.05,70.75,0.5,0.5);

	this.instance_149 = new lib.Path_104();
	this.instance_149.setTransform(1956.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_149.alpha = 0.1992;
	this.instance_149.compositeOperation = "multiply";

	this.instance_150 = new lib.CachedBmp_215();
	this.instance_150.setTransform(1938.4,70.75,0.5,0.5);

	this.instance_151 = new lib.Path_103();
	this.instance_151.setTransform(1917.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_151.alpha = 0.1992;
	this.instance_151.compositeOperation = "multiply";

	this.instance_152 = new lib.CachedBmp_215();
	this.instance_152.setTransform(1899.75,70.75,0.5,0.5);

	this.instance_153 = new lib.Path_102();
	this.instance_153.setTransform(1878.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_153.alpha = 0.1992;
	this.instance_153.compositeOperation = "multiply";

	this.instance_154 = new lib.CachedBmp_215();
	this.instance_154.setTransform(1861.05,70.75,0.5,0.5);

	this.instance_155 = new lib.Path_101();
	this.instance_155.setTransform(1840.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_155.alpha = 0.1992;
	this.instance_155.compositeOperation = "multiply";

	this.instance_156 = new lib.CachedBmp_215();
	this.instance_156.setTransform(1822.4,70.75,0.5,0.5);

	this.instance_157 = new lib.Path_100();
	this.instance_157.setTransform(1801.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_157.alpha = 0.1992;
	this.instance_157.compositeOperation = "multiply";

	this.instance_158 = new lib.CachedBmp_215();
	this.instance_158.setTransform(1783.75,70.75,0.5,0.5);

	this.instance_159 = new lib.Path_99();
	this.instance_159.setTransform(1762.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_159.alpha = 0.1992;
	this.instance_159.compositeOperation = "multiply";

	this.instance_160 = new lib.CachedBmp_215();
	this.instance_160.setTransform(1745.05,70.75,0.5,0.5);

	this.instance_161 = new lib.Path_98();
	this.instance_161.setTransform(1724.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_161.alpha = 0.1992;
	this.instance_161.compositeOperation = "multiply";

	this.instance_162 = new lib.CachedBmp_215();
	this.instance_162.setTransform(1706.4,70.75,0.5,0.5);

	this.instance_163 = new lib.Path_97();
	this.instance_163.setTransform(1685.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_163.alpha = 0.1992;
	this.instance_163.compositeOperation = "multiply";

	this.instance_164 = new lib.CachedBmp_215();
	this.instance_164.setTransform(1667.75,70.75,0.5,0.5);

	this.instance_165 = new lib.Path_96();
	this.instance_165.setTransform(1608.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_165.alpha = 0.1992;
	this.instance_165.compositeOperation = "multiply";

	this.instance_166 = new lib.CachedBmp_215();
	this.instance_166.setTransform(1590.4,70.75,0.5,0.5);

	this.instance_167 = new lib.Path_95();
	this.instance_167.setTransform(1569.35,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_167.alpha = 0.1992;
	this.instance_167.compositeOperation = "multiply";

	this.instance_168 = new lib.CachedBmp_197();
	this.instance_168.setTransform(1551.7,70.75,0.5,0.5);

	this.instance_169 = new lib.Path_94();
	this.instance_169.setTransform(1414.25,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_169.alpha = 0.1992;
	this.instance_169.compositeOperation = "multiply";

	this.instance_170 = new lib.CachedBmp_215();
	this.instance_170.setTransform(1396.6,70.75,0.5,0.5);

	this.instance_171 = new lib.Path_93();
	this.instance_171.setTransform(1375.55,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_171.alpha = 0.1992;
	this.instance_171.compositeOperation = "multiply";

	this.instance_172 = new lib.CachedBmp_197();
	this.instance_172.setTransform(1357.9,70.75,0.5,0.5);

	this.instance_173 = new lib.Path_92();
	this.instance_173.setTransform(1530.7,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_173.alpha = 0.1992;
	this.instance_173.compositeOperation = "multiply";

	this.instance_174 = new lib.CachedBmp_215();
	this.instance_174.setTransform(1513.05,70.75,0.5,0.5);

	this.instance_175 = new lib.Path_91();
	this.instance_175.setTransform(1492.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_175.alpha = 0.1992;
	this.instance_175.compositeOperation = "multiply";

	this.instance_176 = new lib.CachedBmp_215();
	this.instance_176.setTransform(1474.4,70.75,0.5,0.5);

	this.instance_177 = new lib.Path_90();
	this.instance_177.setTransform(1453.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_177.alpha = 0.1992;
	this.instance_177.compositeOperation = "multiply";

	this.instance_178 = new lib.CachedBmp_197();
	this.instance_178.setTransform(1435.7,70.75,0.5,0.5);

	this.instance_179 = new lib.Path_89();
	this.instance_179.setTransform(2361.45,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_179.alpha = 0.1992;
	this.instance_179.compositeOperation = "multiply";

	this.instance_180 = new lib.CachedBmp_192();
	this.instance_180.setTransform(2343.8,15.1,0.5,0.5);

	this.instance_181 = new lib.Path_88();
	this.instance_181.setTransform(2322.8,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_181.alpha = 0.1992;
	this.instance_181.compositeOperation = "multiply";

	this.instance_182 = new lib.CachedBmp_192();
	this.instance_182.setTransform(2305.15,15.1,0.5,0.5);

	this.instance_183 = new lib.Path_87();
	this.instance_183.setTransform(2245.5,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_183.alpha = 0.1992;
	this.instance_183.compositeOperation = "multiply";

	this.instance_184 = new lib.CachedBmp_192();
	this.instance_184.setTransform(2227.85,15.1,0.5,0.5);

	this.instance_185 = new lib.Path_86();
	this.instance_185.setTransform(2207,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_185.alpha = 0.1992;
	this.instance_185.compositeOperation = "multiply";

	this.instance_186 = new lib.CachedBmp_189();
	this.instance_186.setTransform(2189.3,15.1,0.5,0.5);

	this.instance_187 = new lib.Path_85();
	this.instance_187.setTransform(2168.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_187.alpha = 0.1992;
	this.instance_187.compositeOperation = "multiply";

	this.instance_188 = new lib.CachedBmp_192();
	this.instance_188.setTransform(2150.65,15.1,0.5,0.5);

	this.instance_189 = new lib.Path_84();
	this.instance_189.setTransform(2129.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_189.alpha = 0.1992;
	this.instance_189.compositeOperation = "multiply";

	this.instance_190 = new lib.CachedBmp_192();
	this.instance_190.setTransform(2112,15.1,0.5,0.5);

	this.instance_191 = new lib.Path_83();
	this.instance_191.setTransform(2091,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_191.alpha = 0.1992;
	this.instance_191.compositeOperation = "multiply";

	this.instance_192 = new lib.CachedBmp_192();
	this.instance_192.setTransform(2073.35,15.1,0.5,0.5);

	this.instance_193 = new lib.Path_82();
	this.instance_193.setTransform(2052.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_193.alpha = 0.1992;
	this.instance_193.compositeOperation = "multiply";

	this.instance_194 = new lib.CachedBmp_192();
	this.instance_194.setTransform(2034.65,15.1,0.5,0.5);

	this.instance_195 = new lib.Path_81();
	this.instance_195.setTransform(2013.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_195.alpha = 0.1992;
	this.instance_195.compositeOperation = "multiply";

	this.instance_196 = new lib.CachedBmp_192();
	this.instance_196.setTransform(1996,15.1,0.5,0.5);

	this.instance_197 = new lib.Path_80();
	this.instance_197.setTransform(1974.95,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_197.alpha = 0.1992;
	this.instance_197.compositeOperation = "multiply";

	this.instance_198 = new lib.CachedBmp_189();
	this.instance_198.setTransform(1957.3,15.1,0.5,0.5);

	this.instance_199 = new lib.Path_79();
	this.instance_199.setTransform(1936.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_199.alpha = 0.1992;
	this.instance_199.compositeOperation = "multiply";

	this.instance_200 = new lib.CachedBmp_192();
	this.instance_200.setTransform(1918.65,15.1,0.5,0.5);

	this.instance_201 = new lib.Path_78();
	this.instance_201.setTransform(1897.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_201.alpha = 0.1992;
	this.instance_201.compositeOperation = "multiply";

	this.instance_202 = new lib.CachedBmp_192();
	this.instance_202.setTransform(1880,15.1,0.5,0.5);

	this.instance_203 = new lib.Path_77();
	this.instance_203.setTransform(1858.95,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_203.alpha = 0.1992;
	this.instance_203.compositeOperation = "multiply";

	this.instance_204 = new lib.CachedBmp_192();
	this.instance_204.setTransform(1841.3,15.1,0.5,0.5);

	this.instance_205 = new lib.Path_76();
	this.instance_205.setTransform(1820.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_205.alpha = 0.1992;
	this.instance_205.compositeOperation = "multiply";

	this.instance_206 = new lib.CachedBmp_192();
	this.instance_206.setTransform(1802.65,15.1,0.5,0.5);

	this.instance_207 = new lib.Path_75();
	this.instance_207.setTransform(1781.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_207.alpha = 0.1992;
	this.instance_207.compositeOperation = "multiply";

	this.instance_208 = new lib.CachedBmp_192();
	this.instance_208.setTransform(1764,15.1,0.5,0.5);

	this.instance_209 = new lib.Path_74();
	this.instance_209.setTransform(1742.95,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_209.alpha = 0.1992;
	this.instance_209.compositeOperation = "multiply";

	this.instance_210 = new lib.CachedBmp_192();
	this.instance_210.setTransform(1725.3,15.1,0.5,0.5);

	this.instance_211 = new lib.Path_73();
	this.instance_211.setTransform(1704.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_211.alpha = 0.1992;
	this.instance_211.compositeOperation = "multiply";

	this.instance_212 = new lib.CachedBmp_192();
	this.instance_212.setTransform(1686.65,15.1,0.5,0.5);

	this.instance_213 = new lib.Path_72();
	this.instance_213.setTransform(1626.95,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_213.alpha = 0.1992;
	this.instance_213.compositeOperation = "multiply";

	this.instance_214 = new lib.CachedBmp_192();
	this.instance_214.setTransform(1609.3,15.1,0.5,0.5);

	this.instance_215 = new lib.Path_71();
	this.instance_215.setTransform(1588.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_215.alpha = 0.1992;
	this.instance_215.compositeOperation = "multiply";

	this.instance_216 = new lib.CachedBmp_192();
	this.instance_216.setTransform(1570.65,15.1,0.5,0.5);

	this.instance_217 = new lib.Path_70();
	this.instance_217.setTransform(1549.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_217.alpha = 0.1992;
	this.instance_217.compositeOperation = "multiply";

	this.instance_218 = new lib.CachedBmp_192();
	this.instance_218.setTransform(1532,15.1,0.5,0.5);

	this.instance_219 = new lib.Path_69();
	this.instance_219.setTransform(1396.35,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_219.alpha = 0.1992;
	this.instance_219.compositeOperation = "multiply";

	this.instance_220 = new lib.CachedBmp_192();
	this.instance_220.setTransform(1378.7,15.1,0.5,0.5);

	this.instance_221 = new lib.Path_68();
	this.instance_221.setTransform(1357.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_221.alpha = 0.1992;
	this.instance_221.compositeOperation = "multiply";

	this.instance_222 = new lib.CachedBmp_192();
	this.instance_222.setTransform(1340,15.1,0.5,0.5);

	this.instance_223 = new lib.Path_67();
	this.instance_223.setTransform(1510.95,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_223.alpha = 0.1992;
	this.instance_223.compositeOperation = "multiply";

	this.instance_224 = new lib.CachedBmp_192();
	this.instance_224.setTransform(1493.3,15.1,0.5,0.5);

	this.instance_225 = new lib.Path_66();
	this.instance_225.setTransform(1472.3,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_225.alpha = 0.1992;
	this.instance_225.compositeOperation = "multiply";

	this.instance_226 = new lib.CachedBmp_192();
	this.instance_226.setTransform(1454.65,15.1,0.5,0.5);

	this.instance_227 = new lib.Path_65();
	this.instance_227.setTransform(1433.65,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_227.alpha = 0.1992;
	this.instance_227.compositeOperation = "multiply";

	this.instance_228 = new lib.CachedBmp_192();
	this.instance_228.setTransform(1416,15.1,0.5,0.5);

	this.instance_229 = new lib.CachedBmp_116();
	this.instance_229.setTransform(9.95,102.1,0.5,0.5);

	this.instance_230 = new lib.Path_64();
	this.instance_230.setTransform(1292.85,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_230.alpha = 0.1992;
	this.instance_230.compositeOperation = "multiply";

	this.instance_231 = new lib.CachedBmp_215();
	this.instance_231.setTransform(1275.2,70.75,0.5,0.5);

	this.instance_232 = new lib.Path_63();
	this.instance_232.setTransform(1254.2,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_232.alpha = 0.1992;
	this.instance_232.compositeOperation = "multiply";

	this.instance_233 = new lib.CachedBmp_215();
	this.instance_233.setTransform(1236.55,70.75,0.5,0.5);

	this.instance_234 = new lib.Path_62();
	this.instance_234.setTransform(1217.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_234.alpha = 0.1992;
	this.instance_234.compositeOperation = "multiply";

	this.instance_235 = new lib.CachedBmp_215();
	this.instance_235.setTransform(1199.75,70.75,0.5,0.5);

	this.instance_236 = new lib.Path_61();
	this.instance_236.setTransform(1178.75,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_236.alpha = 0.1992;
	this.instance_236.compositeOperation = "multiply";

	this.instance_237 = new lib.CachedBmp_215();
	this.instance_237.setTransform(1161.1,70.75,0.5,0.5);

	this.instance_238 = new lib.Path_60();
	this.instance_238.setTransform(1140.05,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_238.alpha = 0.1992;
	this.instance_238.compositeOperation = "multiply";

	this.instance_239 = new lib.CachedBmp_197();
	this.instance_239.setTransform(1122.4,70.75,0.5,0.5);

	this.instance_240 = new lib.Path_59();
	this.instance_240.setTransform(1101.4,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_240.alpha = 0.1992;
	this.instance_240.compositeOperation = "multiply";

	this.instance_241 = new lib.CachedBmp_215();
	this.instance_241.setTransform(1083.75,70.75,0.5,0.5);

	this.instance_242 = new lib.Path_58();
	this.instance_242.setTransform(1062.75,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_242.alpha = 0.1992;
	this.instance_242.compositeOperation = "multiply";

	this.instance_243 = new lib.CachedBmp_215();
	this.instance_243.setTransform(1045.1,70.75,0.5,0.5);

	this.instance_244 = new lib.Path_57();
	this.instance_244.setTransform(1024.1,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_244.alpha = 0.1992;
	this.instance_244.compositeOperation = "multiply";

	this.instance_245 = new lib.CachedBmp_215();
	this.instance_245.setTransform(1006.4,70.75,0.5,0.5);

	this.instance_246 = new lib.Path_56();
	this.instance_246.setTransform(946.75,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_246.alpha = 0.1992;
	this.instance_246.compositeOperation = "multiply";

	this.instance_247 = new lib.CachedBmp_215();
	this.instance_247.setTransform(929.1,70.75,0.5,0.5);

	this.instance_248 = new lib.Path_55();
	this.instance_248.setTransform(907.8,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_248.alpha = 0.1992;
	this.instance_248.compositeOperation = "multiply";

	this.instance_249 = new lib.CachedBmp_215();
	this.instance_249.setTransform(890.15,70.75,0.5,0.5);

	this.instance_250 = new lib.Path_54();
	this.instance_250.setTransform(869.15,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_250.alpha = 0.1992;
	this.instance_250.compositeOperation = "multiply";

	this.instance_251 = new lib.CachedBmp_215();
	this.instance_251.setTransform(851.5,70.75,0.5,0.5);

	this.instance_252 = new lib.Path_53();
	this.instance_252.setTransform(830.45,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_252.alpha = 0.1992;
	this.instance_252.compositeOperation = "multiply";

	this.instance_253 = new lib.CachedBmp_215();
	this.instance_253.setTransform(812.8,70.75,0.5,0.5);

	this.instance_254 = new lib.Path_52();
	this.instance_254.setTransform(791.8,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_254.alpha = 0.1992;
	this.instance_254.compositeOperation = "multiply";

	this.instance_255 = new lib.CachedBmp_215();
	this.instance_255.setTransform(774.15,70.75,0.5,0.5);

	this.instance_256 = new lib.Path_51();
	this.instance_256.setTransform(753.1,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_256.alpha = 0.1992;
	this.instance_256.compositeOperation = "multiply";

	this.instance_257 = new lib.CachedBmp_197();
	this.instance_257.setTransform(735.45,70.75,0.5,0.5);

	this.instance_258 = new lib.Path_50();
	this.instance_258.setTransform(714.45,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_258.alpha = 0.1992;
	this.instance_258.compositeOperation = "multiply";

	this.instance_259 = new lib.CachedBmp_215();
	this.instance_259.setTransform(696.8,70.75,0.5,0.5);

	this.instance_260 = new lib.Path_49();
	this.instance_260.setTransform(675.8,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_260.alpha = 0.1992;
	this.instance_260.compositeOperation = "multiply";

	this.instance_261 = new lib.CachedBmp_215();
	this.instance_261.setTransform(658.15,70.75,0.5,0.5);

	this.instance_262 = new lib.Path_48();
	this.instance_262.setTransform(637.15,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_262.alpha = 0.1992;
	this.instance_262.compositeOperation = "multiply";

	this.instance_263 = new lib.CachedBmp_215();
	this.instance_263.setTransform(619.45,70.75,0.5,0.5);

	this.instance_264 = new lib.Path_47();
	this.instance_264.setTransform(598.45,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_264.alpha = 0.1992;
	this.instance_264.compositeOperation = "multiply";

	this.instance_265 = new lib.CachedBmp_215();
	this.instance_265.setTransform(580.8,70.75,0.5,0.5);

	this.instance_266 = new lib.Path_46();
	this.instance_266.setTransform(559.8,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_266.alpha = 0.1992;
	this.instance_266.compositeOperation = "multiply";

	this.instance_267 = new lib.CachedBmp_215();
	this.instance_267.setTransform(542.15,70.75,0.5,0.5);

	this.instance_268 = new lib.Path_45();
	this.instance_268.setTransform(521.1,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_268.alpha = 0.1992;
	this.instance_268.compositeOperation = "multiply";

	this.instance_269 = new lib.CachedBmp_197();
	this.instance_269.setTransform(503.45,70.75,0.5,0.5);

	this.instance_270 = new lib.Path_44();
	this.instance_270.setTransform(482.45,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_270.alpha = 0.1992;
	this.instance_270.compositeOperation = "multiply";

	this.instance_271 = new lib.CachedBmp_215();
	this.instance_271.setTransform(464.8,70.75,0.5,0.5);

	this.instance_272 = new lib.Path_43();
	this.instance_272.setTransform(443.8,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_272.alpha = 0.1992;
	this.instance_272.compositeOperation = "multiply";

	this.instance_273 = new lib.CachedBmp_215();
	this.instance_273.setTransform(426.15,70.75,0.5,0.5);

	this.instance_274 = new lib.Path_42();
	this.instance_274.setTransform(405.1,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_274.alpha = 0.1992;
	this.instance_274.compositeOperation = "multiply";

	this.instance_275 = new lib.CachedBmp_215();
	this.instance_275.setTransform(387.45,70.75,0.5,0.5);

	this.instance_276 = new lib.Path_41();
	this.instance_276.setTransform(366.45,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_276.alpha = 0.1992;
	this.instance_276.compositeOperation = "multiply";

	this.instance_277 = new lib.CachedBmp_215();
	this.instance_277.setTransform(348.8,70.75,0.5,0.5);

	this.instance_278 = new lib.Path_40();
	this.instance_278.setTransform(289.1,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_278.alpha = 0.1992;
	this.instance_278.compositeOperation = "multiply";

	this.instance_279 = new lib.CachedBmp_215();
	this.instance_279.setTransform(271.45,70.75,0.5,0.5);

	this.instance_280 = new lib.Path_39();
	this.instance_280.setTransform(250.45,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_280.alpha = 0.1992;
	this.instance_280.compositeOperation = "multiply";

	this.instance_281 = new lib.CachedBmp_215();
	this.instance_281.setTransform(232.8,70.75,0.5,0.5);

	this.instance_282 = new lib.Path_38();
	this.instance_282.setTransform(95.3,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_282.alpha = 0.1992;
	this.instance_282.compositeOperation = "multiply";

	this.instance_283 = new lib.CachedBmp_215();
	this.instance_283.setTransform(77.65,70.75,0.5,0.5);

	this.instance_284 = new lib.Path_37();
	this.instance_284.setTransform(56.65,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_284.alpha = 0.1992;
	this.instance_284.compositeOperation = "multiply";

	this.instance_285 = new lib.CachedBmp_215();
	this.instance_285.setTransform(39,70.75,0.5,0.5);

	this.instance_286 = new lib.Path_36();
	this.instance_286.setTransform(18,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_286.alpha = 0.1992;
	this.instance_286.compositeOperation = "multiply";

	this.instance_287 = new lib.CachedBmp_215();
	this.instance_287.setTransform(0.35,70.75,0.5,0.5);

	this.instance_288 = new lib.Path_35();
	this.instance_288.setTransform(211.8,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_288.alpha = 0.1992;
	this.instance_288.compositeOperation = "multiply";

	this.instance_289 = new lib.CachedBmp_215();
	this.instance_289.setTransform(194.15,70.75,0.5,0.5);

	this.instance_290 = new lib.Path_34();
	this.instance_290.setTransform(173.1,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_290.alpha = 0.1992;
	this.instance_290.compositeOperation = "multiply";

	this.instance_291 = new lib.CachedBmp_215();
	this.instance_291.setTransform(155.45,70.75,0.5,0.5);

	this.instance_292 = new lib.Path_33();
	this.instance_292.setTransform(134.45,110.3,1,1,0,0,0,15.6,34.7);
	this.instance_292.alpha = 0.1992;
	this.instance_292.compositeOperation = "multiply";

	this.instance_293 = new lib.CachedBmp_215();
	this.instance_293.setTransform(116.8,70.75,0.5,0.5);

	this.instance_294 = new lib.Path_32();
	this.instance_294.setTransform(1273.55,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_294.alpha = 0.1992;
	this.instance_294.compositeOperation = "multiply";

	this.instance_295 = new lib.CachedBmp_192();
	this.instance_295.setTransform(1255.9,15.1,0.5,0.5);

	this.instance_296 = new lib.Path_31();
	this.instance_296.setTransform(1235.05,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_296.alpha = 0.1992;
	this.instance_296.compositeOperation = "multiply";

	this.instance_297 = new lib.CachedBmp_192();
	this.instance_297.setTransform(1217.4,15.1,0.5,0.5);

	this.instance_298 = new lib.Path_30();
	this.instance_298.setTransform(1196.35,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_298.alpha = 0.1992;
	this.instance_298.compositeOperation = "multiply";

	this.instance_299 = new lib.CachedBmp_192();
	this.instance_299.setTransform(1178.7,15.1,0.5,0.5);

	this.instance_300 = new lib.Path_29();
	this.instance_300.setTransform(1158.35,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_300.alpha = 0.1992;
	this.instance_300.compositeOperation = "multiply";

	this.instance_301 = new lib.CachedBmp_189();
	this.instance_301.setTransform(1140.7,15.1,0.5,0.5);

	this.instance_302 = new lib.Path_28();
	this.instance_302.setTransform(1119.85,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_302.alpha = 0.1992;
	this.instance_302.compositeOperation = "multiply";

	this.instance_303 = new lib.CachedBmp_192();
	this.instance_303.setTransform(1102.2,15.1,0.5,0.5);

	this.instance_304 = new lib.Path_27();
	this.instance_304.setTransform(1081.2,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_304.alpha = 0.1992;
	this.instance_304.compositeOperation = "multiply";

	this.instance_305 = new lib.CachedBmp_192();
	this.instance_305.setTransform(1063.55,15.1,0.5,0.5);

	this.instance_306 = new lib.Path_26();
	this.instance_306.setTransform(1042.5,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_306.alpha = 0.1992;
	this.instance_306.compositeOperation = "multiply";

	this.instance_307 = new lib.CachedBmp_192();
	this.instance_307.setTransform(1024.85,15.1,0.5,0.5);

	this.instance_308 = new lib.Path_25();
	this.instance_308.setTransform(1003.85,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_308.alpha = 0.1992;
	this.instance_308.compositeOperation = "multiply";

	this.instance_309 = new lib.CachedBmp_192();
	this.instance_309.setTransform(986.2,15.1,0.5,0.5);

	this.instance_310 = new lib.Path_24();
	this.instance_310.setTransform(926.55,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_310.alpha = 0.1992;
	this.instance_310.compositeOperation = "multiply";

	this.instance_311 = new lib.CachedBmp_189();
	this.instance_311.setTransform(908.9,15.1,0.5,0.5);

	this.instance_312 = new lib.Path_23();
	this.instance_312.setTransform(888.05,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_312.alpha = 0.1992;
	this.instance_312.compositeOperation = "multiply";

	this.instance_313 = new lib.CachedBmp_192();
	this.instance_313.setTransform(870.4,15.1,0.5,0.5);

	this.instance_314 = new lib.Path_22();
	this.instance_314.setTransform(849.4,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_314.alpha = 0.1992;
	this.instance_314.compositeOperation = "multiply";

	this.instance_315 = new lib.CachedBmp_192();
	this.instance_315.setTransform(831.75,15.1,0.5,0.5);

	this.instance_316 = new lib.Path_21();
	this.instance_316.setTransform(810.7,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_316.alpha = 0.1992;
	this.instance_316.compositeOperation = "multiply";

	this.instance_317 = new lib.CachedBmp_192();
	this.instance_317.setTransform(793.05,15.1,0.5,0.5);

	this.instance_318 = new lib.Path_20();
	this.instance_318.setTransform(772.05,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_318.alpha = 0.1992;
	this.instance_318.compositeOperation = "multiply";

	this.instance_319 = new lib.CachedBmp_192();
	this.instance_319.setTransform(754.4,15.1,0.5,0.5);

	this.instance_320 = new lib.Path_19();
	this.instance_320.setTransform(733.4,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_320.alpha = 0.1992;
	this.instance_320.compositeOperation = "multiply";

	this.instance_321 = new lib.CachedBmp_192();
	this.instance_321.setTransform(715.75,15.1,0.5,0.5);

	this.instance_322 = new lib.Path_18();
	this.instance_322.setTransform(694.7,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_322.alpha = 0.1992;
	this.instance_322.compositeOperation = "multiply";

	this.instance_323 = new lib.CachedBmp_192();
	this.instance_323.setTransform(677.05,15.1,0.5,0.5);

	this.instance_324 = new lib.Path_17();
	this.instance_324.setTransform(656.05,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_324.alpha = 0.1992;
	this.instance_324.compositeOperation = "multiply";

	this.instance_325 = new lib.CachedBmp_192();
	this.instance_325.setTransform(638.4,15.1,0.5,0.5);

	this.instance_326 = new lib.Path_16();
	this.instance_326.setTransform(617.4,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_326.alpha = 0.1992;
	this.instance_326.compositeOperation = "multiply";

	this.instance_327 = new lib.CachedBmp_192();
	this.instance_327.setTransform(599.75,15.1,0.5,0.5);

	this.instance_328 = new lib.Path_15();
	this.instance_328.setTransform(578.7,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_328.alpha = 0.1992;
	this.instance_328.compositeOperation = "multiply";

	this.instance_329 = new lib.CachedBmp_192();
	this.instance_329.setTransform(561.05,15.1,0.5,0.5);

	this.instance_330 = new lib.Path_14();
	this.instance_330.setTransform(540.05,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_330.alpha = 0.1992;
	this.instance_330.compositeOperation = "multiply";

	this.instance_331 = new lib.CachedBmp_192();
	this.instance_331.setTransform(522.4,15.1,0.5,0.5);

	this.instance_332 = new lib.Path_13();
	this.instance_332.setTransform(501.4,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_332.alpha = 0.1992;
	this.instance_332.compositeOperation = "multiply";

	this.instance_333 = new lib.CachedBmp_189();
	this.instance_333.setTransform(483.7,15.1,0.5,0.5);

	this.instance_334 = new lib.Path_12();
	this.instance_334.setTransform(462.7,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_334.alpha = 0.1992;
	this.instance_334.compositeOperation = "multiply";

	this.instance_335 = new lib.CachedBmp_192();
	this.instance_335.setTransform(445.05,15.1,0.5,0.5);

	this.instance_336 = new lib.Path_9();
	this.instance_336.setTransform(424.05,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_336.alpha = 0.1992;
	this.instance_336.compositeOperation = "multiply";

	this.instance_337 = new lib.CachedBmp_192();
	this.instance_337.setTransform(406.4,15.1,0.5,0.5);

	this.instance_338 = new lib.Path_8();
	this.instance_338.setTransform(385.35,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_338.alpha = 0.1992;
	this.instance_338.compositeOperation = "multiply";

	this.instance_339 = new lib.CachedBmp_192();
	this.instance_339.setTransform(367.75,15.1,0.5,0.5);

	this.instance_340 = new lib.Path_7();
	this.instance_340.setTransform(308.05,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_340.alpha = 0.1992;
	this.instance_340.compositeOperation = "multiply";

	this.instance_341 = new lib.CachedBmp_192();
	this.instance_341.setTransform(290.4,15.1,0.5,0.5);

	this.instance_342 = new lib.Path_6();
	this.instance_342.setTransform(269.4,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_342.alpha = 0.1992;
	this.instance_342.compositeOperation = "multiply";

	this.instance_343 = new lib.CachedBmp_189();
	this.instance_343.setTransform(251.7,15.1,0.5,0.5);

	this.instance_344 = new lib.Path_5();
	this.instance_344.setTransform(230.7,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_344.alpha = 0.1992;
	this.instance_344.compositeOperation = "multiply";

	this.instance_345 = new lib.CachedBmp_192();
	this.instance_345.setTransform(213.05,15.1,0.5,0.5);

	this.instance_346 = new lib.Path_4();
	this.instance_346.setTransform(77.4,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_346.alpha = 0.1992;
	this.instance_346.compositeOperation = "multiply";

	this.instance_347 = new lib.CachedBmp_192();
	this.instance_347.setTransform(59.75,15.1,0.5,0.5);

	this.instance_348 = new lib.Path_3();
	this.instance_348.setTransform(38.75,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_348.alpha = 0.1992;
	this.instance_348.compositeOperation = "multiply";

	this.instance_349 = new lib.CachedBmp_192();
	this.instance_349.setTransform(21.1,15.1,0.5,0.5);

	this.instance_350 = new lib.Path_2();
	this.instance_350.setTransform(192.05,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_350.alpha = 0.1992;
	this.instance_350.compositeOperation = "multiply";

	this.instance_351 = new lib.CachedBmp_192();
	this.instance_351.setTransform(174.4,15.1,0.5,0.5);

	this.instance_352 = new lib.Path_1();
	this.instance_352.setTransform(153.35,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_352.alpha = 0.1992;
	this.instance_352.compositeOperation = "multiply";

	this.instance_353 = new lib.CachedBmp_192();
	this.instance_353.setTransform(135.7,15.1,0.5,0.5);

	this.instance_354 = new lib.Path_0();
	this.instance_354.setTransform(114.7,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_354.alpha = 0.1992;
	this.instance_354.compositeOperation = "multiply";

	this.instance_355 = new lib.CachedBmp_192();
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

	this.instance_362 = new lib.CachedBmp_52();
	this.instance_362.setTransform(1288.3,252.85,0.5,0.5);

	this.instance_363 = new lib.Group_240();
	this.instance_363.setTransform(618.85,285.35,1,1,0,0,0,63.9,6.4);
	this.instance_363.compositeOperation = "screen";

	this.instance_364 = new lib.Group_241();
	this.instance_364.setTransform(721.7,696,1,1,0,0,0,72.5,8.3);
	this.instance_364.compositeOperation = "screen";

	this.instance_365 = new lib.CachedBmp_51();
	this.instance_365.setTransform(0,0,0.5,0.5);

	this.instance_366 = new lib.Path();
	this.instance_366.setTransform(2284.2,54.6,1,1,0,0,0,15.6,34.7);
	this.instance_366.alpha = 0.1992;
	this.instance_366.compositeOperation = "multiply";

	this.instance_367 = new lib.CachedBmp_192();
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

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]},1).wait(556));

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

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape},{t:this.instance,p:{scaleX:0.8527,scaleY:0.8527,rotation:29.9995,x:239.55,y:282.4}}]},157).to({state:[{t:this.shape_1},{t:this.instance,p:{scaleX:0.8528,scaleY:0.8528,rotation:0,x:248.8,y:282.35}}]},17).to({state:[{t:this.shape_5},{t:this.shape_4},{t:this.shape_3},{t:this.shape_2},{t:this.instance,p:{scaleX:0.8528,scaleY:0.8528,rotation:0,x:248.8,y:282.35}}]},57).to({state:[]},9).wait(163));

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

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.shape}]},440).to({state:[]},1).to({state:[{t:this.instance_1},{t:this.instance}]},34).wait(4));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,326.9,493.8);


(lib.Scene_1_step_4_1 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// step_4
	this.instance = new lib.swimmer();
	this.instance.setTransform(503.2,235.05,1,1,5.7905,0,0,310.2,38.4);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(253).to({_off:false},0).wait(1).to({regX:310.1,regY:38.2,rotation:5.7906,x:510.15,y:235.8},0).wait(1).to({x:517.2,y:236.8},0).wait(1).to({x:524.25,y:237.8},0).wait(1).to({x:531.3,y:238.8},0).wait(1).to({x:538.35,y:239.8},0).wait(1).to({x:545.45,y:240.75},0).wait(1).to({x:552.5,y:241.75},0).wait(1).to({x:559.55,y:242.75},0).wait(1).to({x:566.6,y:243.75},0).wait(1).to({x:573.7,y:244.75},0).wait(1).to({x:580.75,y:245.7},0).wait(1).to({x:587.8,y:246.7},0).wait(1).to({x:594.85,y:247.7},0).wait(1).to({x:601.9,y:248.7},0).wait(1).to({x:609,y:249.7},0).wait(1).to({x:616.05,y:250.65},0).wait(1).to({x:623.1,y:251.65},0).wait(1).to({x:630.15,y:252.65},0).wait(1).to({x:637.2,y:253.65},0).wait(1).to({x:644.3,y:254.65},0).wait(1).to({x:651.35,y:255.6},0).wait(1).to({x:658.4,y:256.6},0).wait(1).to({x:665.45,y:257.6},0).wait(1).to({x:672.5,y:258.6},0).wait(1).to({x:679.6,y:259.6},0).wait(1).to({x:686.65,y:260.55},0).wait(1).to({x:693.7,y:261.55},0).wait(1).to({x:700.75,y:262.55},0).wait(1).to({x:707.8,y:263.55},0).wait(1).to({x:714.9,y:264.55},0).wait(1).to({x:721.95,y:265.5},0).wait(1).to({x:729,y:266.5},0).wait(1).to({x:736.05,y:267.5},0).wait(1).to({x:743.15,y:268.5},0).wait(1).to({x:750.2,y:269.5},0).wait(1).to({x:757.25,y:270.45},0).wait(1).to({x:764.3,y:271.45},0).wait(1).to({x:771.35,y:272.45},0).wait(1).to({x:778.45,y:273.45},0).wait(1).to({x:785.5,y:274.45},0).wait(1).to({x:792.55,y:275.4},0).wait(1).to({x:799.6,y:276.4},0).wait(1).to({x:806.65,y:277.4},0).wait(1).to({x:813.75,y:278.4},0).wait(1).to({x:820.8,y:279.4},0).wait(1).to({x:827.85,y:280.4},0).wait(1).to({x:834.9,y:281.35},0).wait(1).to({x:841.95,y:282.35},0).wait(1).to({x:849.05,y:283.35},0).wait(1).to({x:856.1,y:284.35},0).wait(1).to({x:863.15,y:285.35},0).wait(1).to({x:870.2,y:286.3},0).wait(1).to({x:877.25,y:287.3},0).wait(1).to({x:884.35,y:288.3},0).wait(1).to({x:891.4,y:289.3},0).wait(1).to({x:898.45,y:290.3},0).wait(1).to({x:905.5,y:291.25},0).wait(1).to({x:912.55,y:292.25},0).wait(1).to({x:919.65,y:293.25},0).wait(1).to({x:926.7,y:294.25},0).wait(1).to({x:933.75,y:295.25},0).wait(1).to({x:940.8,y:296.2},0).wait(1).to({x:947.9,y:297.2},0).wait(1).to({x:954.95,y:298.2},0).wait(1).to({x:962,y:299.2},0).wait(1).to({x:969.05,y:300.2},0).wait(1).to({x:976.1,y:301.15},0).wait(1).to({x:983.2,y:302.15},0).wait(1).to({x:990.25,y:303.15},0).wait(1).to({x:997.3,y:304.15},0).wait(1).to({x:1004.35,y:305.15},0).wait(1).to({x:1011.4,y:306.1},0).wait(1).to({x:1018.5,y:307.1},0).wait(1).to({x:1025.55,y:308.1},0).wait(1).to({x:1032.6,y:309.1},0).wait(1).to({x:1039.65,y:310.1},0).wait(1).to({x:1046.7,y:311.05},0).wait(1).to({rotation:13.2053,x:1057.45,y:314},0).wait(1).to({rotation:13.5967,x:1068.05,y:316.95},0).wait(1).to({rotation:13.9944,x:1078.55,y:319.95},0).wait(1).to({rotation:14.3985,x:1088.95,y:323},0).wait(1).to({rotation:14.8089,x:1099.25,y:326.1},0).wait(1).to({rotation:15.2259,x:1109.35,y:329.25},0).wait(1).to({rotation:15.6496,x:1119.45,y:332.45},0).wait(1).to({rotation:16.0801,x:1129.4,y:335.7},0).wait(1).to({rotation:16.5174,x:1139.3,y:338.95},0).wait(1).to({rotation:16.9618,x:1149.05,y:342.35},0).wait(1).to({rotation:17.4133,x:1158.7,y:345.75},0).wait(1).to({rotation:17.872,x:1168.3,y:349.2},0).wait(1).to({rotation:18.3381,x:1177.75,y:352.65},0).wait(1).to({rotation:18.8117,x:1187.1,y:356.25},0).wait(1).to({rotation:19.2929,x:1196.35,y:359.85},0).wait(1).to({rotation:19.7818,x:1205.4,y:363.5},0).wait(1).to({rotation:20.2785,x:1214.5,y:367.15},0).wait(1).to({rotation:20.7832,x:1223.4,y:370.9},0).wait(1).to({rotation:21.2959,x:1232.25,y:374.7},0).wait(1).to({rotation:21.8168,x:1240.95,y:378.55},0).wait(1).to({rotation:22.346,x:1249.55,y:382.45},0).wait(1).to({rotation:22.8836,x:1258.1,y:386.4},0).wait(1).to({rotation:23.4296,x:1266.5,y:390.35},0).wait(1).to({rotation:23.9843,x:1274.75,y:394.35},0).wait(1).to({rotation:24.5477,x:1283,y:398.5},0).wait(1).to({rotation:25.1198,x:1291.05,y:402.6},0).wait(1).to({rotation:25.7009,x:1299.05,y:406.75},0).wait(1).to({rotation:26.2909,x:1306.95,y:411},0).wait(1).to({rotation:26.89,x:1314.7,y:415.25},0).wait(1).to({rotation:27.4982,x:1322.4,y:419.65},0).wait(1).to({rotation:28.1156,x:1330,y:424},0).wait(1).to({rotation:28.7423,x:1337.5,y:428.4},0).wait(1).to({rotation:29.3784,x:1344.8,y:432.9},0).wait(1).to({rotation:30.0238,x:1352.15,y:437.35},0).wait(1).to({rotation:30.6787,x:1359.3,y:441.95},0).wait(1).to({rotation:31.343,x:1366.35,y:446.65},0).wait(1).to({rotation:32.0168,x:1373.35,y:451.3},0).wait(1).to({rotation:32.7002,x:1380.15,y:456},0).wait(1).to({rotation:33.393,x:1386.95,y:460.75},0).wait(1).to({rotation:34.0954,x:1393.6,y:465.6},0).wait(1).to({rotation:34.8073,x:1400.1,y:470.45},0).wait(1).to({rotation:35.5286,x:1406.55,y:475.4},0).wait(1).to({rotation:36.2594,x:1412.9,y:480.35},0).wait(1).to({rotation:36.9995,x:1419.1,y:485.35},0).wait(1).to({rotation:37.749,x:1425.25,y:490.45},0).wait(1).to({rotation:38.5077,x:1431.25,y:495.55},0).wait(1).to({rotation:39.2755,x:1437.2,y:500.7},0).wait(1).to({rotation:40.0523,x:1443,y:505.95},0).wait(1).to({rotation:40.8381,x:1448.7,y:511.2},0).wait(1).to({rotation:41.6325,x:1454.35,y:516.5},0).wait(1).to({rotation:42.4356,x:1459.85,y:521.9},0).wait(1).to({rotation:43.2471,x:1465.25,y:527.25},0).wait(1).to({rotation:44.0667,x:1470.6,y:532.75},0).wait(1).to({rotation:44.8944,x:1475.8,y:538.25},0).wait(1).to({rotation:45.7299,x:1480.85,y:543.85},0).wait(1).to({rotation:49.0996,x:1495.3,y:562.15},0).wait(1).to({rotation:47.9835,x:1509.6,y:579.65},0).wait(1).to({rotation:46.8032,x:1523.85,y:596.4},0).wait(1).to({rotation:45.5538,x:1538.1,y:612.4},0).wait(1).to({rotation:44.2304,x:1552.25,y:627.6},0).wait(1).to({rotation:42.8277,x:1566.35,y:642},0).wait(1).to({rotation:41.3402,x:1580.3,y:655.75},0).wait(1).to({rotation:39.7619,x:1594.3,y:668.6},0).wait(1).to({rotation:38.087,x:1608.2,y:680.75},0).wait(1).to({rotation:36.3092,x:1622.05,y:692.1},0).wait(1).to({rotation:34.4226,x:1635.8,y:702.65},0).wait(1).to({rotation:32.4211,x:1649.5,y:712.5},0).wait(1).to({rotation:30.2992,x:1663.25,y:721.6},0).wait(1).to({rotation:28.0519,x:1676.8,y:729.85},0).wait(1).to({rotation:25.6753,x:1690.35,y:737.4},0).wait(1).to({rotation:23.1666,x:1703.8,y:744.1},0).wait(1).to({rotation:20.5248,x:1717.25,y:750.05},0).wait(1).to({rotation:17.7511,x:1730.65,y:755.35},0).wait(1).to({rotation:14.849,x:1743.95,y:759.7},0).wait(1).to({rotation:13.6851,x:1763.2,y:765.4},0).wait(1).to({rotation:12.5584,x:1782.35,y:770.65},0).wait(1).to({rotation:11.4103,x:1801.4,y:775.5},0).wait(1).to({rotation:10.2411,x:1820.35,y:779.9},0).wait(1).to({rotation:9.0512,x:1839.3,y:783.8},0).wait(1).to({rotation:7.841,x:1858.05,y:787.35},0).wait(1).to({rotation:6.611,x:1876.8,y:790.45},0).wait(1).to({rotation:5.3619,x:1895.45,y:793.15},0).wait(1).to({rotation:4.0944,x:1913.9,y:795.35},0).wait(1).to({rotation:2.8093,x:1932.45,y:797.15},0).wait(1).to({rotation:1.5075,x:1950.8,y:798.55},0).wait(1).to({rotation:0.1901,x:1969.05,y:799.55},0).wait(1).to({rotation:-1.142,x:1987.3,y:800.05},0).wait(1).to({rotation:-2.4875,x:2005.4,y:800.15},0).wait(1).to({rotation:-3.8451,x:2023.45,y:799.85},0).wait(1).to({rotation:-5.2136,x:2041.35,y:799.1},0).wait(1).to({rotation:-6.5914,x:2059.3,y:797.95},0).wait(1).to({rotation:-7.9773,x:2077.1,y:796.35},0).wait(1).to({rotation:-9.3696,x:2094.75,y:794.35},0).wait(1).to({rotation:-10.7668,x:2112.45,y:791.9},0).wait(1).to({rotation:-12.1673,x:2130,y:789.05},0).wait(1).to({rotation:-13.5695,x:2147.45,y:785.75},0).wait(1).to({rotation:-14.9717,x:2164.8,y:782},0).wait(1).to({rotation:-16.3724,x:2182.1,y:777.85},0).wait(1).to({rotation:-21.3398,x:2288.25,y:739.3},0).wait(1).to({rotation:-19.5652,x:2394.4,y:704.3},0).wait(1).to({rotation:-17.7598,x:2500.55,y:673},0).wait(1).to({rotation:-15.9263,x:2606.85,y:645.25},0).wait(1).to({rotation:-14.0674,x:2713.2,y:621.2},0).wait(1).to({rotation:-12.1862,x:2819.65,y:600.7},0).wait(1).to({rotation:-10.2859,x:2926.25,y:583.8},0).wait(1).to({rotation:-8.3702,x:3033,y:570.45},0).wait(1).to({rotation:-6.4428,x:3139.95,y:560.75},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,3453.6,911.6);


(lib.Scene_1_step_4 = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	// step_4
	this.instance = new lib.basicswimmer("synched",0);
	this.instance.setTransform(640.05,292.75,1,1,4.9335,0,0,308.9,48.9);
	this.instance._off = true;

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(492).to({_off:false},0).wait(1).to({regX:308.8,regY:49,rotation:5.1831,x:694.3,y:300.4},0).wait(1).to({rotation:5.4557,x:746.8,y:307.95},0).wait(1).to({rotation:5.7481,x:797.4,y:315.4},0).wait(1).to({rotation:6.0628,x:846.15,y:322.95},0).wait(1).to({rotation:6.4024,x:893,y:330.45},0).wait(1).to({rotation:6.7698,x:937.85,y:337.85},0).wait(1).to({rotation:7.1688,x:981,y:345.35},0).wait(1).to({rotation:7.6036,x:1022.2,y:352.75},0).wait(1).to({rotation:8.0792,x:1061.55,y:360.2},0).wait(1).to({rotation:8.6016,x:1099.05,y:367.6},0).wait(1).to({rotation:9.178,x:1134.7,y:374.95},0).wait(1).to({rotation:9.8173,x:1168.5,y:382.4},0).wait(1).to({rotation:11.2732,x:1201,y:390.1},0).wait(1).to({rotation:12.8578,x:1232.1,y:398.35},0).wait(1).to({rotation:14.5775,x:1261.65,y:407.15},0).wait(1).to({rotation:16.4469,x:1289.8,y:416.55},0).wait(1).to({rotation:18.4823,x:1316.4,y:426.35},0).wait(1).to({rotation:20.7008,x:1341.55,y:436.75},0).wait(1).to({rotation:23.121,x:1365.2,y:447.6},0).wait(1).to({rotation:25.7619,x:1387.35,y:459.05},0).wait(1).to({rotation:28.6424,x:1408.05,y:471},0).wait(1).to({rotation:31.7802,x:1427.3,y:483.55},0).wait(1).to({rotation:32.7834,x:1451.3,y:500.8},0).wait(1).to({x:1475.4,y:518.05},0).wait(1).to({x:1499.45,y:535.25},0).wait(1).to({x:1523.5,y:552.5},0).wait(1).to({x:1547.55,y:569.75},0).wait(1).to({x:1571.65,y:587},0).wait(1).to({x:1595.7,y:604.25},0).wait(1).to({x:1619.75,y:621.5},0).wait(1).to({x:1643.85,y:638.75},0).wait(1).to({x:1667.9,y:656},0).wait(1).to({x:1691.95,y:673.25},0).wait(1).to({x:1716.05,y:690.5},0).wait(1).to({x:1740.1,y:707.75},0).wait(1).to({rotation:20.154,x:1775.85,y:724},0).wait(1).to({rotation:17.124,x:1811.25,y:737.95},0).wait(1).to({rotation:13.9177,x:1846.4,y:749.55},0).wait(1).to({rotation:10.5405,x:1881.2,y:758.95},0).wait(1).to({rotation:7.0032,x:1915.65,y:766.05},0).wait(1).to({rotation:3.3225,x:1949.8,y:770.8},0).wait(1).to({rotation:-0.4791,x:1983.7,y:773.35},0).wait(1).to({rotation:-4.3733,x:2017.25,y:773.55},0).wait(1).to({rotation:-8.327,x:2050.55,y:771.55},0).wait(1).to({rotation:-12.3041,x:2083.55,y:767.15},0).wait(1).to({rotation:-9.9928,x:2136.45,y:760.5},0).wait(1).to({x:2189.35,y:753.9},0).wait(1).to({x:2242.25,y:747.25},0).wait(1).to({x:2295.15,y:740.6},0).wait(1).to({x:2348.05,y:733.95},0).wait(1).to({x:2401,y:727.35},0).wait(1).to({x:2453.9,y:720.7},0).wait(1).to({x:2506.8,y:714.05},0).wait(1).to({x:2559.7,y:707.4},0).wait(1).to({x:2612.6,y:700.8},0).wait(1).to({x:2665.55,y:694.15},0).wait(1).to({x:2718.45,y:687.5},0).wait(1).to({x:2771.35,y:680.9},0).wait(1).to({x:2824.25,y:674.25},0).wait(1).to({x:2877.15,y:667.6},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1).to({startPosition:0},0).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,3191.1,917.3);


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

	this.timeline.addTween(cjs.Tween.get(this.instance).wait(1).to({_off:false},0).wait(222).to({regX:1707.6,regY:509.9,x:1677.8,y:481.45},0).wait(334));

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

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance_2},{t:this.instance_1},{t:this.instance}]},1).wait(556));

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
	this.instance = new lib.CachedBmp_21();
	this.instance.setTransform(181.8,206.95,0.5,0.5);

	this.instance_1 = new lib.basicswimmer("synched",0);
	this.instance_1.setTransform(567.9,248.05,1,1,0,0,0,308.8,49.1);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},485).to({state:[{t:this.instance_1}]},4).wait(3));

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

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.instance_8},{t:this.instance_7},{t:this.instance_6},{t:this.instance_5},{t:this.instance_4},{t:this.instance_3},{t:this.instance_2},{t:this.instance_1},{t:this.instance},{t:this.GoFirst}]}).to({state:[]},1).to({state:[{t:this.Replaybtn}]},555).wait(1));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,894.7,615.2);


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
	this.instance = new lib.CachedBmp_35();
	this.instance.setTransform(109.95,5,0.5,0.5);

	this.instance_1 = new lib.CachedBmp_37();
	this.instance_1.setTransform(81.45,6.7,0.5,0.5);

	this.instance_2 = new lib.CachedBmp_36();
	this.instance_2.setTransform(218.85,465.45,0.5,0.5);

	this.instance_3 = new lib.swimmernoRH("synched",0);
	this.instance_3.setTransform(189.15,343.85,0.8528,0.8528,0,0,0,163.7,178);

	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("#FF0000").ss(5).p("ADkAAQAAA4hEAoQhCAoheAAQhdAAhDgoQhDgoAAg4QAAg4BDgoQBDgoBdAAQBeAABCAoQBEAoAAA4g");
	this.shape.setTransform(244.1,481.6);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[]}).to({state:[{t:this.instance}]},1).to({state:[{t:this.instance_2},{t:this.instance_1}]},95).to({state:[{t:this.shape},{t:this.instance_3}]},61).to({state:[{t:this.instance_3}]},17).to({state:[{t:this.instance_3}]},21).to({state:[]},45).wait(317));

	this._renderFirstFrame();

}).prototype = p = new cjs.MovieClip();
p.nominalBounds = new cjs.Rectangle(0,0,328.9,506.2);


// stage content:
(lib.Jumpper = function(mode,startPosition,loop,reversed) {
if (loop == null) { loop = true; }
if (reversed == null) { reversed = false; }
	var props = new Object();
	props.mode = mode;
	props.startPosition = startPosition;
	props.labels = {};
	props.loop = loop;
	props.reversed = reversed;
	cjs.MovieClip.apply(this,[props]);

	this.actionFrames = [0,1,153,230,258,363,414,436,472,556];
	this.streamSoundSymbolsList[1] = [{id:"PourWater",startFrame:1,endFrame:436,loop:1,offset:0},{id:"Record1",startFrame:1,endFrame:153,loop:1,offset:0}];
	this.streamSoundSymbolsList[153] = [{id:"Record2",startFrame:153,endFrame:230,loop:1,offset:0}];
	this.streamSoundSymbolsList[230] = [{id:"whistle",startFrame:230,endFrame:258,loop:1,offset:0}];
	this.streamSoundSymbolsList[258] = [{id:"Record3",startFrame:258,endFrame:363,loop:1,offset:0}];
	this.streamSoundSymbolsList[363] = [{id:"Splash",startFrame:363,endFrame:414,loop:1,offset:0}];
	this.streamSoundSymbolsList[414] = [{id:"Record4",startFrame:414,endFrame:557,loop:1,offset:0}];
	this.streamSoundSymbolsList[436] = [{id:"PourWater",startFrame:436,endFrame:556,loop:1,offset:0}];
	this.streamSoundSymbolsList[472] = [{id:"whistle",startFrame:472,endFrame:557,loop:1,offset:0}];
	this.streamSoundSymbolsList[556] = [{id:"PourWater",startFrame:556,endFrame:557,loop:1,offset:0}];
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
		 
		this.GoFirst = this.buttons.GoFirst;
		var self = this; // משתנה המכיל בתוכו את כל הבמה והאלמנטים שבה 
		self.stop(); 
		
		self.GoFirst.addEventListener("click", startPlaying);
		
		function startPlaying ()
		{
			self.gotoAndPlay(1); 
		
		}
	}
	this.frame_1 = function() {
		var soundInstance = playSound("Record1",0);
		this.InsertIntoSoundStreamData(soundInstance,1,153,1);
		var soundInstance = playSound("PourWater",0);
		this.InsertIntoSoundStreamData(soundInstance,1,436,1);
		this.GoFirst = undefined;
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
		this.InsertIntoSoundStreamData(soundInstance,258,363,1);
	}
	this.frame_363 = function() {
		var soundInstance = playSound("Splash",0);
		this.InsertIntoSoundStreamData(soundInstance,363,414,1);
	}
	this.frame_414 = function() {
		var soundInstance = playSound("Record4",0);
		this.InsertIntoSoundStreamData(soundInstance,414,557,1);
	}
	this.frame_436 = function() {
		var soundInstance = playSound("PourWater",0);
		this.InsertIntoSoundStreamData(soundInstance,436,556,1);
	}
	this.frame_472 = function() {
		var soundInstance = playSound("whistle",0);
		this.InsertIntoSoundStreamData(soundInstance,472,557,1);
	}
	this.frame_556 = function() {
		var soundInstance = playSound("PourWater",0);
		this.InsertIntoSoundStreamData(soundInstance,556,557,1);
		this.Replaybtn = this.buttons.Replaybtn;
		this.___loopingOver___ = true;
		var self = this;
		self.stop();
		
		createjs.Sound.stop();
		
		
		self.Replaybtn.addEventListener("click",playagain);
		
		function playagain()
			{
			self.gotoAndPlay(1);	
			}
	}

	// actions tween:
	this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(1).call(this.frame_1).wait(152).call(this.frame_153).wait(77).call(this.frame_230).wait(28).call(this.frame_258).wait(105).call(this.frame_363).wait(51).call(this.frame_414).wait(22).call(this.frame_436).wait(36).call(this.frame_472).wait(84).call(this.frame_556).wait(1));

	// Camera
	this.___camera___instance = new lib.___Camera___();
	this.___camera___instance.name = "___camera___instance";
	this.___camera___instance.setTransform(640,360);
	this.___camera___instance.depth = 0;
	this.___camera___instance.visible = false;

	this.timeline.addTween(cjs.Tween.get(this.___camera___instance).wait(2).to({scaleX:0.5156,scaleY:0.5156},0).wait(32).to({regX:0.2,regY:0.2,scaleX:0.7771,scaleY:0.7771,x:499.45,y:283.45},0).wait(1).to({regX:0,regY:0,x:499.3,y:283.3},0).wait(47).to({regX:0.2,regY:0.2,x:499.45,y:283.45},0).wait(1).to({regX:0,regY:0,scaleX:0.7512,scaleY:0.7512,x:482.9285,y:292.2052},0).wait(1).to({scaleX:0.7253,scaleY:0.7253,x:466.557,y:301.1104},0).wait(1).to({scaleX:0.6994,scaleY:0.6994,x:450.1855,y:310.0155},0).wait(1).to({scaleX:0.6735,scaleY:0.6735,x:433.8141,y:318.9207},0).wait(1).to({scaleX:0.6476,scaleY:0.6476,x:417.4426,y:327.8259},0).wait(1).to({scaleX:0.6216,scaleY:0.6216,x:401.0711,y:336.7311},0).wait(1).to({scaleX:0.5957,scaleY:0.5957,x:384.6996,y:345.6363},0).wait(1).to({scaleX:0.5698,scaleY:0.5698,x:368.3281,y:354.5414},0).wait(1).to({scaleX:0.5439,scaleY:0.5439,x:351.9566,y:363.4466},0).wait(1).to({scaleX:0.518,scaleY:0.518,x:335.5851,y:372.3518},0).wait(1).to({scaleX:0.4921,scaleY:0.4921,x:319.2137,y:381.257},0).wait(1).to({scaleX:0.4662,scaleY:0.4662,x:302.8422,y:390.1622},0).wait(1).to({scaleX:0.4403,scaleY:0.4403,x:286.4707,y:399.0674},0).wait(1).to({scaleX:0.4144,scaleY:0.4144,x:270.0992,y:407.9725},0).wait(1).to({scaleX:0.3885,scaleY:0.3885,x:253.7277,y:416.8777},0).wait(67).to({regX:0.1,regY:0.1,x:253.8,y:416.95},0).wait(1).to({regX:0,regY:0,scaleX:0.4001,scaleY:0.4001,x:261.067,y:415.3264},0).wait(1).to({scaleX:0.4117,scaleY:0.4117,x:268.384,y:413.7528},0).wait(1).to({scaleX:0.4234,scaleY:0.4234,x:275.701,y:412.1791},0).wait(1).to({scaleX:0.435,scaleY:0.435,x:283.018,y:410.6055},0).wait(1).to({scaleX:0.4466,scaleY:0.4466,x:290.335,y:409.0319},0).wait(1).to({scaleX:0.4583,scaleY:0.4583,x:297.652,y:407.4583},0).wait(1).to({scaleX:0.4699,scaleY:0.4699,x:304.969,y:405.8847},0).wait(1).to({scaleX:0.4815,scaleY:0.4815,x:312.286,y:404.311},0).wait(1).to({scaleX:0.4932,scaleY:0.4932,x:319.6031,y:402.7374},0).wait(1).to({scaleX:0.5048,scaleY:0.5048,x:326.9201,y:401.1638},0).wait(1).to({scaleX:0.5164,scaleY:0.5164,x:334.2371,y:399.5902},0).wait(1).to({scaleX:0.528,scaleY:0.528,x:341.5541,y:398.0166},0).wait(1).to({scaleX:0.5397,scaleY:0.5397,x:348.8711,y:396.4429},0).wait(1).to({scaleX:0.5513,scaleY:0.5513,x:356.1881,y:394.8693},0).wait(1).to({scaleX:0.5629,scaleY:0.5629,x:363.5051,y:393.2957},0).wait(1).to({scaleX:0.5746,scaleY:0.5746,x:370.8221,y:391.7221},0).wait(1).to({scaleX:0.5919,scaleY:0.5919,x:381.8793,y:393.5532},0).wait(1).to({scaleX:0.6093,scaleY:0.6093,x:392.9364,y:395.3843},0).wait(1).to({scaleX:0.6266,scaleY:0.6266,x:403.9936,y:397.2154},0).wait(1).to({scaleX:0.644,scaleY:0.644,x:415.0508,y:399.0465},0).wait(1).to({scaleX:0.6614,scaleY:0.6614,x:426.108,y:400.8775},0).wait(1).to({scaleX:0.6787,scaleY:0.6787,x:437.1652,y:402.7086},0).wait(1).to({scaleX:0.6961,scaleY:0.6961,x:448.2223,y:404.5397},0).wait(1).to({scaleX:0.7135,scaleY:0.7135,x:459.2795,y:406.3708},0).wait(1).to({scaleX:0.7308,scaleY:0.7308,x:470.3367,y:408.2019},0).wait(1).to({scaleX:0.7482,scaleY:0.7482,x:481.3939,y:410.033},0).wait(1).to({scaleX:0.7656,scaleY:0.7656,x:492.451,y:411.8641},0).wait(1).to({scaleX:0.7829,scaleY:0.7829,x:503.5082,y:413.6952},0).wait(1).to({scaleX:0.8003,scaleY:0.8003,x:514.5654,y:415.5263},0).wait(1).to({scaleX:0.8176,scaleY:0.8176,x:525.6226,y:417.3574},0).wait(1).to({scaleX:0.835,scaleY:0.835,x:536.6798,y:419.1885},0).wait(1).to({scaleX:0.8524,scaleY:0.8524,x:547.7369,y:421.0195},0).wait(1).to({scaleX:0.8697,scaleY:0.8697,x:558.7941,y:422.8506},0).wait(1).to({scaleX:0.8871,scaleY:0.8871,x:569.8513,y:424.6817},0).wait(1).to({scaleX:0.9045,scaleY:0.9045,x:580.9085,y:426.5128},0).wait(1).to({scaleX:0.9218,scaleY:0.9218,x:591.9657,y:428.3439},0).wait(1).to({scaleX:0.9392,scaleY:0.9392,x:603.0228,y:430.175},0).wait(1).to({scaleX:0.9566,scaleY:0.9566,x:614.08,y:432.0061},0).wait(1).to({scaleX:0.9739,scaleY:0.9739,x:625.1372,y:433.8372},0).wait(1).to({scaleX:0.9913,scaleY:0.9913,x:636.1944,y:435.6683},0).wait(1).to({scaleX:1.0086,scaleY:1.0086,x:647.2515,y:437.4994},0).wait(1).to({scaleX:1.026,scaleY:1.026,x:658.3087,y:439.3305},0).wait(1).to({scaleX:1.0434,scaleY:1.0434,x:669.3659,y:441.1616},0).wait(1).to({scaleX:1.0607,scaleY:1.0607,x:680.4231,y:442.9926},0).wait(1).to({scaleX:1.0781,scaleY:1.0781,x:691.4803,y:444.8237},0).wait(1).to({scaleX:1.0955,scaleY:1.0955,x:702.5374,y:446.6548},0).wait(1).to({scaleX:1.1128,scaleY:1.1128,x:713.5946,y:448.4859},0).wait(1).to({scaleX:1.1302,scaleY:1.1302,x:724.6518,y:450.317},0).wait(1).to({scaleX:1.1476,scaleY:1.1476,x:735.709,y:452.1481},0).wait(1).to({scaleX:1.1649,scaleY:1.1649,x:746.7661,y:453.9792},0).wait(1).to({scaleX:1.1823,scaleY:1.1823,x:757.8233,y:455.8103},0).wait(1).to({scaleX:1.1996,scaleY:1.1996,x:768.8805,y:457.6414},0).wait(1).to({scaleX:1.217,scaleY:1.217,x:779.9377,y:459.4725},0).wait(1).to({scaleX:1.2344,scaleY:1.2344,x:790.9949,y:461.3036},0).wait(1).to({scaleX:1.2517,scaleY:1.2517,x:802.052,y:463.1346},0).wait(1).to({scaleX:1.2691,scaleY:1.2691,x:813.1092,y:464.9657},0).wait(1).to({scaleX:1.2865,scaleY:1.2865,x:824.1664,y:466.7968},0).wait(1).to({scaleX:1.3038,scaleY:1.3038,x:835.2236,y:468.6279},0).wait(1).to({scaleX:1.3212,scaleY:1.3212,x:846.2807,y:470.459},0).wait(1).to({scaleX:1.3386,scaleY:1.3386,x:857.3379,y:472.2901},0).wait(1).to({scaleX:1.3559,scaleY:1.3559,x:868.3951,y:474.1212},0).wait(1).to({scaleX:1.3733,scaleY:1.3733,x:879.4523,y:475.9523},0).wait(1).to({scaleX:1.3456,scaleY:1.3456,x:861.8411,y:471.4295},0).wait(1).to({scaleX:1.3179,scaleY:1.3179,x:844.2298,y:466.9067},0).wait(1).to({scaleX:1.2902,scaleY:1.2902,x:826.6186,y:462.384},0).wait(1).to({scaleX:1.2625,scaleY:1.2625,x:809.0074,y:457.8612},0).wait(1).to({scaleX:1.2348,scaleY:1.2348,x:791.3961,y:453.3384},0).wait(1).to({scaleX:1.2071,scaleY:1.2071,x:773.7849,y:448.8157},0).wait(1).to({scaleX:1.1795,scaleY:1.1795,x:756.1737,y:444.2929},0).wait(1).to({scaleX:1.1518,scaleY:1.1518,x:738.5624,y:439.7701},0).wait(1).to({scaleX:1.1241,scaleY:1.1241,x:720.9512,y:435.2474},0).wait(1).to({scaleX:1.0964,scaleY:1.0964,x:703.34,y:430.7246},0).wait(1).to({scaleX:1.0687,scaleY:1.0687,x:685.7287,y:426.2018},0).wait(1).to({scaleX:1.041,scaleY:1.041,x:668.1175,y:421.679},0).wait(1).to({scaleX:1.0133,scaleY:1.0133,x:650.5063,y:417.1563},0).wait(24).to({regX:0.1,scaleX:0.9521,scaleY:0.9521,x:852.95,y:415.4},0).wait(1).to({regX:0,x:852.85},0).wait(65).to({regX:0.3,scaleX:0.8741,scaleY:0.8741,x:1180.75,y:403.05},0).wait(1).to({regX:0,x:1180.5},0).wait(47).to({regY:0.1,scaleX:0.9521,scaleY:0.9521,x:1740.5,y:636.3},0).wait(1).to({regY:0,y:636.2},0).wait(37).to({x:2258.5,y:643.9},0).wait(1).to({scaleX:0.9568,scaleY:0.9568,x:2281.1094,y:640.5625},0).wait(1).to({scaleX:0.9614,scaleY:0.9614,x:2303.7188,y:637.225},0).wait(1).to({scaleX:0.9661,scaleY:0.9661,x:2326.3281,y:633.8875},0).wait(1).to({scaleX:0.9708,scaleY:0.9708,x:2348.9375,y:630.55},0).wait(1).to({scaleX:0.9754,scaleY:0.9754,x:2371.5469,y:627.2125},0).wait(1).to({scaleX:0.9801,scaleY:0.9801,x:2394.1563,y:623.875},0).wait(1).to({scaleX:0.9848,scaleY:0.9848,x:2416.7656,y:620.5375},0).wait(1).to({scaleX:0.9895,scaleY:0.9895,x:2439.375,y:617.2},0).wait(1).to({scaleX:0.9941,scaleY:0.9941,x:2461.9844,y:613.8625},0).wait(1).to({scaleX:0.9988,scaleY:0.9988,x:2484.5938,y:610.525},0).wait(1).to({scaleX:1.0035,scaleY:1.0035,x:2507.2031,y:607.1875},0).wait(1).to({scaleX:1.0081,scaleY:1.0081,x:2529.8125,y:603.85},0).wait(1).to({scaleX:1.0128,scaleY:1.0128,x:2552.4219,y:600.5125},0).wait(1).to({scaleX:1.0175,scaleY:1.0175,x:2575.0313,y:597.175},0).wait(1).to({scaleX:1.0222,scaleY:1.0222,x:2597.6406,y:593.8375},0).wait(1).to({scaleX:1.0268,scaleY:1.0268,x:2620.25,y:590.5},0).wait(1).to({scaleX:1.0315,scaleY:1.0315,x:2132.6,y:541.3},0).wait(1).to({scaleX:1.0362,scaleY:1.0362,x:1644.95,y:492.1},0).wait(1).to({scaleX:1.0408,scaleY:1.0408,x:1157.3,y:442.9},0).wait(1).to({scaleX:1.0455,scaleY:1.0455,x:669.65,y:393.7},0).wait(1).to({scaleX:1.0502,scaleY:1.0502,x:672.7524,y:394.914},0).wait(1).to({scaleX:1.0549,scaleY:1.0549,x:675.8548,y:396.1279},0).wait(1).to({scaleX:1.0595,scaleY:1.0595,x:678.9573,y:397.3419},0).wait(1).to({scaleX:1.0642,scaleY:1.0642,x:682.0597,y:398.5559},0).wait(1).to({scaleX:1.0689,scaleY:1.0689,x:685.1621,y:399.7698},0).wait(1).to({scaleX:1.0735,scaleY:1.0735,x:688.2645,y:400.9838},0).wait(1).to({scaleX:1.0782,scaleY:1.0782,x:691.367,y:402.1978},0).wait(1).to({scaleX:1.0829,scaleY:1.0829,x:694.4694,y:403.4118},0).wait(1).to({scaleX:1.0876,scaleY:1.0876,x:697.5718,y:404.6257},0).wait(1).to({scaleX:1.0922,scaleY:1.0922,x:700.6742,y:405.8397},0).wait(1).to({scaleX:1.0969,scaleY:1.0969,x:703.7767,y:407.0537},0).wait(1).to({scaleX:1.1016,scaleY:1.1016,x:706.8791,y:408.2676},0).wait(1).to({scaleX:1.1062,scaleY:1.1062,x:709.9815,y:409.4816},0).wait(1).to({scaleX:1.1109,scaleY:1.1109,x:713.0839,y:410.6956},0).wait(1).to({scaleX:1.1156,scaleY:1.1156,x:716.1864,y:411.9095},0).wait(1).to({scaleX:1.1203,scaleY:1.1203,x:719.2888,y:413.1235},0).wait(1).to({scaleX:1.1249,scaleY:1.1249,x:722.3912,y:414.3375},0).wait(1).to({scaleX:1.1296,scaleY:1.1296,x:725.4936,y:415.5515},0).wait(1).to({scaleX:1.1343,scaleY:1.1343,x:728.5961,y:416.7654},0).wait(1).to({scaleX:1.1389,scaleY:1.1389,x:731.6985,y:417.9794},0).wait(1).to({scaleX:1.1436,scaleY:1.1436,x:734.8009,y:419.1934},0).wait(1).to({scaleX:1.1483,scaleY:1.1483,x:737.9033,y:420.4073},0).wait(1).to({scaleX:1.153,scaleY:1.153,x:741.0058,y:421.6213},0).wait(1).to({scaleX:1.1576,scaleY:1.1576,x:744.1082,y:422.8353},0).wait(1).to({scaleX:1.1623,scaleY:1.1623,x:747.2106,y:424.0492},0).wait(1).to({scaleX:1.167,scaleY:1.167,x:750.313,y:425.2632},0).wait(1).to({scaleX:1.1716,scaleY:1.1716,x:753.4155,y:426.4772},0).wait(1).to({scaleX:1.1763,scaleY:1.1763,x:756.5179,y:427.6912},0).wait(1).to({scaleX:1.181,scaleY:1.181,x:759.6203,y:428.9051},0).wait(1).to({scaleX:1.1857,scaleY:1.1857,x:762.7227,y:430.1191},0).wait(1).to({scaleX:1.1903,scaleY:1.1903,x:765.8252,y:431.3331},0).wait(1).to({scaleX:1.195,scaleY:1.195,x:768.9276,y:432.547},0).wait(1).to({scaleX:1.1997,scaleY:1.1997,x:772.03,y:433.761},0).wait(1).to({scaleX:1.2044,scaleY:1.2044,x:774.5343,y:436.4617},0).wait(1).to({scaleX:1.209,scaleY:1.209,x:777.0386,y:439.1624},0).wait(1).to({scaleX:1.2137,scaleY:1.2137,x:779.5429,y:441.8631},0).wait(1).to({scaleX:1.2184,scaleY:1.2184,x:782.0471,y:444.5639},0).wait(1).to({scaleX:1.223,scaleY:1.223,x:784.5514,y:447.2646},0).wait(1).to({scaleX:1.2277,scaleY:1.2277,x:787.0557,y:449.9653},0).wait(1).to({scaleX:1.2324,scaleY:1.2324,x:789.56,y:452.666},0).wait(1).to({scaleX:1.2369,scaleY:1.2369,x:801.8271,y:454.6827},0).wait(1).to({scaleX:1.2414,scaleY:1.2414,x:814.0941,y:456.6994},0).wait(1).to({scaleX:1.2458,scaleY:1.2458,x:826.3612,y:458.7161},0).wait(1).to({scaleX:1.2503,scaleY:1.2503,x:838.6282,y:460.7328},0).wait(1).to({scaleX:1.2548,scaleY:1.2548,x:850.8953,y:462.7495},0).wait(1).to({scaleX:1.2593,scaleY:1.2593,x:863.1624,y:464.7662},0).wait(1).to({scaleX:1.2638,scaleY:1.2638,x:875.4294,y:466.7829},0).wait(1).to({scaleX:1.2683,scaleY:1.2683,x:887.6965,y:468.7996},0).wait(1).to({scaleX:1.2728,scaleY:1.2728,x:899.9635,y:470.8164},0).wait(1).to({scaleX:1.2773,scaleY:1.2773,x:912.2306,y:472.8331},0).wait(1).to({scaleX:1.2818,scaleY:1.2818,x:924.4976,y:474.8498},0).wait(1).to({scaleX:1.2862,scaleY:1.2862,x:936.7647,y:476.8665},0).wait(1).to({scaleX:1.2907,scaleY:1.2907,x:949.0318,y:478.8832},0).wait(1).to({scaleX:1.2952,scaleY:1.2952,x:961.2988,y:480.8999},0).wait(1).to({scaleX:1.2997,scaleY:1.2997,x:973.5659,y:482.9166},0).wait(1).to({scaleX:1.3042,scaleY:1.3042,x:985.8329,y:484.9333},0).wait(1).to({scaleX:1.3087,scaleY:1.3087,x:998.1,y:486.95},0).wait(1).to({scaleX:1.3111,scaleY:1.3111,x:1026.6273,y:487.3545},0).wait(1).to({scaleX:1.3135,scaleY:1.3135,x:1055.1545,y:487.7591},0).wait(1).to({scaleX:1.316,scaleY:1.316,x:1083.6818,y:488.1636},0).wait(1).to({scaleX:1.3184,scaleY:1.3184,x:1112.2091,y:488.5682},0).wait(1).to({scaleX:1.3208,scaleY:1.3208,x:1140.7364,y:488.9727},0).wait(1).to({scaleX:1.3232,scaleY:1.3232,x:1169.2636,y:489.3773},0).wait(1).to({scaleX:1.3257,scaleY:1.3257,x:1197.7909,y:489.7818},0).wait(1).to({scaleX:1.3281,scaleY:1.3281,x:1226.3182,y:490.1864},0).wait(1).to({scaleX:1.3305,scaleY:1.3305,x:1254.8455,y:490.5909},0).wait(1).to({scaleX:1.3329,scaleY:1.3329,x:1283.3727,y:490.9955},0).wait(1).to({scaleX:1.3354,scaleY:1.3354,x:1311.9,y:491.4},0).wait(1).to({scaleX:1.3345,scaleY:1.3345,x:1330.2556,y:492.3833},0).wait(1).to({scaleX:1.3337,scaleY:1.3337,x:1348.6111,y:493.3667},0).wait(1).to({scaleX:1.3329,scaleY:1.3329,x:1366.9667,y:494.35},0).wait(1).to({scaleX:1.332,scaleY:1.332,x:1385.3222,y:495.3333},0).wait(1).to({scaleX:1.3312,scaleY:1.3312,x:1403.6778,y:496.3167},0).wait(1).to({scaleX:1.3304,scaleY:1.3304,x:1422.0333,y:497.3},0).wait(1).to({scaleX:1.3295,scaleY:1.3295,x:1440.3889,y:498.2833},0).wait(1).to({scaleX:1.3287,scaleY:1.3287,x:1458.7444,y:499.2667},0).wait(1).to({scaleX:1.3279,scaleY:1.3279,x:1477.1,y:500.25},0).wait(1).to({scaleX:1.33,scaleY:1.33,x:1512.2154,y:500.4808},0).wait(1).to({scaleX:1.3322,scaleY:1.3322,x:1547.3308,y:500.7115},0).wait(1).to({scaleX:1.3343,scaleY:1.3343,x:1582.4462,y:500.9423},0).wait(1).to({scaleX:1.3365,scaleY:1.3365,x:1617.5615,y:501.1731},0).wait(1).to({scaleX:1.3386,scaleY:1.3386,x:1652.6769,y:501.4038},0).wait(1).to({scaleX:1.3408,scaleY:1.3408,x:1687.7923,y:501.6346},0).wait(1).to({scaleX:1.3429,scaleY:1.3429,x:1722.9077,y:501.8654},0).wait(1).to({scaleX:1.3451,scaleY:1.3451,x:1758.0231,y:502.0962},0).wait(1).to({scaleX:1.3472,scaleY:1.3472,x:1793.1385,y:502.3269},0).wait(1).to({scaleX:1.3494,scaleY:1.3494,x:1828.2538,y:502.5577},0).wait(1).to({scaleX:1.3515,scaleY:1.3515,x:1863.3692,y:502.7885},0).wait(1).to({scaleX:1.3537,scaleY:1.3537,x:1898.4846,y:503.0192},0).wait(1).to({scaleX:1.3558,scaleY:1.3558,x:1933.6,y:503.25},0).wait(1).to({scaleX:1.358,scaleY:1.358,x:1964.3731,y:503.0077},0).wait(1).to({scaleX:1.3601,scaleY:1.3601,x:1995.1462,y:502.7654},0).wait(1).to({scaleX:1.3623,scaleY:1.3623,x:2025.9192,y:502.5231},0).wait(1).to({scaleX:1.3644,scaleY:1.3644,x:2056.6923,y:502.2808},0).wait(1).to({scaleX:1.3666,scaleY:1.3666,x:2087.4654,y:502.0385},0).wait(1).to({scaleX:1.3687,scaleY:1.3687,x:2118.2385,y:501.7962},0).wait(1).to({scaleX:1.3709,scaleY:1.3709,x:2149.0115,y:501.5538},0).wait(1).to({scaleX:1.373,scaleY:1.373,x:2179.7846,y:501.3115},0).wait(1).to({scaleX:1.3752,scaleY:1.3752,x:2210.5577,y:501.0692},0).wait(1).to({scaleX:1.3773,scaleY:1.3773,x:2241.3308,y:500.8269},0).wait(1).to({scaleX:1.3795,scaleY:1.3795,x:2272.1038,y:500.5846},0).wait(1).to({scaleX:1.3816,scaleY:1.3816,x:2302.8769,y:500.3423},0).wait(1).to({scaleX:1.3838,scaleY:1.3838,x:2333.65,y:500.1},0).wait(10).to({scaleX:1.1191,scaleY:1.1191,x:2495.2,y:585.4},0).wait(1).to({x:717.75,y:410.65},0).wait(8));

	// buttons_obj_
	this.buttons = new lib.Scene_1_buttons();
	this.buttons.name = "buttons";
	this.buttons.setTransform(633.4,304.9,1,1,0,0,0,633.4,304.9);
	this.buttons.depth = 0;
	this.buttons.isAttachedToCamera = 0
	this.buttons.isAttachedToMask = 0
	this.buttons.layerDepth = 0
	this.buttons.layerIndex = 0
	this.buttons.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.buttons).wait(556).to({regX:710.3,regY:348.9,scaleX:0.8936,scaleY:0.8936},0).wait(1));

	// splash_obj_
	this.splash = new lib.Scene_1_splash();
	this.splash.name = "splash";
	this.splash.depth = 0;
	this.splash.isAttachedToCamera = 0
	this.splash.isAttachedToMask = 0
	this.splash.layerDepth = 0
	this.splash.layerIndex = 1
	this.splash.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.splash).wait(254).to({regX:2,regY:52.3,scaleX:0.9869,scaleY:0.9869},0).wait(63).to({regX:243.5,regY:72.7,scaleX:1.0504,scaleY:1.0504,x:0.05,y:0.05},0).wait(20).to({regX:621.1,regY:88.4,scaleX:1.144,scaleY:1.144,y:0.1},0).wait(50).to({regX:1131.2,regY:293.4,scaleX:1.0504,scaleY:1.0504,y:0},0).wait(85).to({regX:2.2,regY:6,scaleX:0.8208,scaleY:0.8208,x:0},0).wait(39).to({regX:608.4,regY:21,scaleX:0.7526,scaleY:0.7526,x:0.05},0).wait(23).to({regX:1330.5,regY:6,scaleX:0.7272,scaleY:0.7272,x:0},0).to({_off:true},19).wait(4));

	// step_4_obj_
	this.step_4 = new lib.Scene_1_step_4();
	this.step_4.name = "step_4";
	this.step_4.depth = 0;
	this.step_4.isAttachedToCamera = 0
	this.step_4.isAttachedToMask = 0
	this.step_4.layerDepth = 0
	this.step_4.layerIndex = 2
	this.step_4.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.step_4).wait(440).to({regX:1,regY:15,scaleX:0.9356,scaleY:0.9356,y:0.05},0).wait(52).to({regX:160.5,regY:15.8,scaleX:0.7641,scaleY:0.7641,x:0.05,y:0},0).wait(1).to({regX:1759,regY:567.1,scaleX:1,scaleY:1,x:1598.6,y:551.35},0).wait(64));

	// water_splash_obj_
	this.water_splash = new lib.Scene_1_water_splash();
	this.water_splash.name = "water_splash";
	this.water_splash.depth = 0;
	this.water_splash.isAttachedToCamera = 0
	this.water_splash.isAttachedToMask = 0
	this.water_splash.layerDepth = 0
	this.water_splash.layerIndex = 3
	this.water_splash.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.water_splash).wait(440).to({regX:1,regY:15,scaleX:0.9356,scaleY:0.9356,y:0.05},0).wait(72).to({regX:627.2,regY:22.3,scaleX:0.7531,scaleY:0.7531},0).wait(2).to({regX:694.7,regY:21.2,scaleX:0.7507,scaleY:0.7507,y:0},0).wait(20).to({regX:1330.5,regY:6,scaleX:0.7272,scaleY:0.7272},0).wait(2).to({regX:1389.2,regY:4,scaleX:0.7249,scaleY:0.7249,y:0.05},0).to({_off:true},1).wait(20));

	// flash0_ai_obj_
	this.flash0_ai = new lib.Scene_1_flash0_ai();
	this.flash0_ai.name = "flash0_ai";
	this.flash0_ai.depth = 0;
	this.flash0_ai.isAttachedToCamera = 0
	this.flash0_ai.isAttachedToMask = 0
	this.flash0_ai.layerDepth = 0
	this.flash0_ai.layerIndex = 4
	this.flash0_ai.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.flash0_ai).wait(440).to({regX:1,regY:15,scaleX:0.9356,scaleY:0.9356,y:0.05},0).wait(39).to({regX:38.3,regY:10.7,scaleX:0.7998,scaleY:0.7998},0).wait(4).to({regX:75.9,regY:12.3,scaleX:0.7885,scaleY:0.7885},0).wait(2).to({regX:94.7,regY:13.1,scaleX:0.7829,scaleY:0.7829},0).wait(4).to({regX:132.3,regY:14.6,scaleX:0.7721,scaleY:0.7721,x:0.05,y:0},0).to({_off:true},3).wait(65));

	// STEP2_obj_
	this.STEP2 = new lib.Scene_1_STEP2();
	this.STEP2.name = "STEP2";
	this.STEP2.depth = 0;
	this.STEP2.isAttachedToCamera = 0
	this.STEP2.isAttachedToMask = 0
	this.STEP2.layerDepth = 0
	this.STEP2.layerIndex = 5
	this.STEP2.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.STEP2).wait(440).to({regX:1,regY:15,scaleX:0.9356,scaleY:0.9356,y:0.05},0).wait(39).to({regX:38.3,regY:10.7,scaleX:0.7998,scaleY:0.7998},0).wait(5).to({regX:85.4,regY:12.6,scaleX:0.7857,scaleY:0.7857,x:0.05,y:0},0).wait(1).to({regX:94.7,regY:13.1,scaleX:0.7829,scaleY:0.7829,x:0,y:0.05},0).to({_off:true},68).wait(4));

	// Swm1RH_obj_
	this.Swm1RH = new lib.Scene_1_Swm1RH();
	this.Swm1RH.name = "Swm1RH";
	this.Swm1RH.depth = 0;
	this.Swm1RH.isAttachedToCamera = 0
	this.Swm1RH.isAttachedToMask = 0
	this.Swm1RH.layerDepth = 0
	this.Swm1RH.layerIndex = 6
	this.Swm1RH.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Swm1RH).wait(440).to({regX:1,regY:15,scaleX:0.9356,scaleY:0.9356,y:0.05},0).wait(1).to({regX:1.2,regY:14.6,scaleX:0.9315,scaleY:0.9315},0).wait(29).to({regX:3.2,regY:4,scaleX:0.8271,scaleY:0.8271},0).wait(1).to({regX:2.6,regY:4.9,scaleX:0.8239,scaleY:0.8239,x:-0.05,y:0},0).wait(1).to({regX:2.2,regY:6,scaleX:0.8208,scaleY:0.8208,x:0},0).wait(3).to({regX:0.8,regY:9,scaleX:0.8114,scaleY:0.8114},0).to({_off:true},4).wait(78));

	// horizantal_loop_copy_obj_
	this.horizantal_loop_copy = new lib.Scene_1_horizantal_loop_copy();
	this.horizantal_loop_copy.name = "horizantal_loop_copy";
	this.horizantal_loop_copy.depth = 0;
	this.horizantal_loop_copy.isAttachedToCamera = 0
	this.horizantal_loop_copy.isAttachedToMask = 0
	this.horizantal_loop_copy.layerDepth = 0
	this.horizantal_loop_copy.layerIndex = 7
	this.horizantal_loop_copy.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.horizantal_loop_copy).wait(161).to({regX:5,regY:277,scaleX:2.5742,scaleY:2.5742,x:-0.1,y:0.05},0).wait(33).to({regX:2.3,regY:122.9,scaleX:1.223,scaleY:1.223,x:0.05,y:0},0).wait(34).to({regX:0.7,regY:-7.7,scaleX:0.7588,scaleY:0.7588,x:0,y:-0.05},0).wait(9).to({regX:1.7,regY:41.3,scaleX:0.9357,scaleY:0.9357,x:0.05,y:0},0).wait(99).to({regX:621.1,regY:88.4,scaleX:1.144,scaleY:1.144,y:0.1},0).wait(18).to({_off:true},126).wait(77));

	// step_4_obj_
	this.step_4_1 = new lib.Scene_1_step_4_1();
	this.step_4_1.name = "step_4_1";
	this.step_4_1.depth = 0;
	this.step_4_1.isAttachedToCamera = 0
	this.step_4_1.isAttachedToMask = 0
	this.step_4_1.layerDepth = 0
	this.step_4_1.layerIndex = 8
	this.step_4_1.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.step_4_1).wait(236).to({regX:1.6,regY:35.9,scaleX:0.9121,scaleY:0.9121,x:0.05,y:0.05},0).wait(1).to({regX:1.7,regY:41.3,scaleX:0.9357,scaleY:0.9357,y:0},0).wait(1).to({regX:1.8,regY:46.8,scaleX:0.9606,scaleY:0.9606,x:0,y:0.05},0).wait(1).to({regX:2,regY:52.3,scaleX:0.9869,scaleY:0.9869,y:0},0).wait(15).to({regX:1821.6,regY:538.6,scaleX:1,scaleY:1,x:1819.65,y:486.35},0).wait(183).to({_off:true},1).wait(119));

	// horizantal_loop_obj_
	this.horizantal_loop = new lib.Scene_1_horizantal_loop();
	this.horizantal_loop.name = "horizantal_loop";
	this.horizantal_loop.depth = 0;
	this.horizantal_loop.isAttachedToCamera = 0
	this.horizantal_loop.isAttachedToMask = 0
	this.horizantal_loop.layerDepth = 0
	this.horizantal_loop.layerIndex = 9
	this.horizantal_loop.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.horizantal_loop).wait(161).to({regX:5,regY:277,scaleX:2.5742,scaleY:2.5742,x:-0.1,y:0.05},0).wait(33).to({regX:2.3,regY:122.9,scaleX:1.223,scaleY:1.223,x:0.05,y:0},0).wait(34).to({regX:0.7,regY:-7.7,scaleX:0.7588,scaleY:0.7588,x:0,y:-0.05},0).wait(9).to({regX:1.7,regY:41.3,scaleX:0.9357,scaleY:0.9357,x:0.05,y:0},0).wait(98).to({regX:621.1,regY:88.4,scaleX:1.144,scaleY:1.144,y:0.1},0).to({_off:true},70).wait(152));

	// water_splash_obj_
	this.water_splash_1 = new lib.Scene_1_water_splash_1();
	this.water_splash_1.name = "water_splash_1";
	this.water_splash_1.depth = 0;
	this.water_splash_1.isAttachedToCamera = 0
	this.water_splash_1.isAttachedToMask = 0
	this.water_splash_1.layerDepth = 0
	this.water_splash_1.layerIndex = 10
	this.water_splash_1.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.water_splash_1).wait(337).to({regX:621.1,regY:88.4,scaleX:1.144,scaleY:1.144,x:0.05,y:0.1},0).wait(49).to({regX:1131.2,regY:293.4,scaleX:1.0504,scaleY:1.0504,y:0},0).wait(33).to({regX:1727.6,regY:281.1,scaleX:1.0301,scaleY:1.0301,x:0},0).wait(53).to({regX:2.2,regY:6,scaleX:0.8208,scaleY:0.8208},0).wait(47).to({regX:863.4,regY:18.4,scaleX:0.7447,scaleY:0.7447},0).wait(38));

	// flash0_ai_obj_
	this.flash0_ai_1 = new lib.Scene_1_flash0_ai_1();
	this.flash0_ai_1.name = "flash0_ai_1";
	this.flash0_ai_1.depth = 0;
	this.flash0_ai_1.isAttachedToCamera = 0
	this.flash0_ai_1.isAttachedToMask = 0
	this.flash0_ai_1.layerDepth = 0
	this.flash0_ai_1.layerIndex = 11
	this.flash0_ai_1.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.flash0_ai_1).wait(236).to({regX:1.6,regY:35.9,scaleX:0.9121,scaleY:0.9121,x:0.05,y:0.05},0).wait(1).to({regX:1.7,regY:41.3,scaleX:0.9357,scaleY:0.9357,y:0},0).wait(1).to({regX:1.8,regY:46.8,scaleX:0.9606,scaleY:0.9606,x:0,y:0.05},0).wait(1).to({regX:2,regY:52.3,scaleX:0.9869,scaleY:0.9869,y:0},0).wait(318));

	// STEP2_obj_
	this.STEP2_1 = new lib.Scene_1_STEP2_1();
	this.STEP2_1.name = "STEP2_1";
	this.STEP2_1.depth = 0;
	this.STEP2_1.isAttachedToCamera = 0
	this.STEP2_1.isAttachedToMask = 0
	this.STEP2_1.layerDepth = 0
	this.STEP2_1.layerIndex = 12
	this.STEP2_1.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.STEP2_1).wait(236).to({regX:1.6,regY:35.9,scaleX:0.9121,scaleY:0.9121,x:0.05,y:0.05},0).wait(1).to({regX:1.7,regY:41.3,scaleX:0.9357,scaleY:0.9357,y:0},0).wait(1).to({regX:1.8,regY:46.8,scaleX:0.9606,scaleY:0.9606,x:0,y:0.05},0).wait(1).to({regX:2,regY:52.3,scaleX:0.9869,scaleY:0.9869,y:0},0).wait(318));

	// Swm1RH_obj_
	this.Swm1RH_1 = new lib.Scene_1_Swm1RH_1();
	this.Swm1RH_1.name = "Swm1RH_1";
	this.Swm1RH_1.depth = 0;
	this.Swm1RH_1.isAttachedToCamera = 0
	this.Swm1RH_1.isAttachedToMask = 0
	this.Swm1RH_1.layerDepth = 0
	this.Swm1RH_1.layerIndex = 13
	this.Swm1RH_1.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.Swm1RH_1).wait(157).to({regX:5,regY:277,scaleX:2.5742,scaleY:2.5742,x:-0.1,y:0.05},0).wait(17).to({regX:3.8,regY:219.4,scaleX:1.9811,scaleY:1.9811,x:0.05,y:0},0).wait(57).to({regX:1.1,regY:8.7,scaleX:0.8098,scaleY:0.8098,y:0.05},0).wait(9).to({regX:2,regY:52.3,scaleX:0.9869,scaleY:0.9869,x:0,y:0},0).to({_off:true},163).wait(154));

	// basicswimmer_obj_
	this.basicswimmer = new lib.Scene_1_basicswimmer();
	this.basicswimmer.name = "basicswimmer";
	this.basicswimmer.depth = 0;
	this.basicswimmer.isAttachedToCamera = 0
	this.basicswimmer.isAttachedToMask = 0
	this.basicswimmer.layerDepth = 0
	this.basicswimmer.layerIndex = 14
	this.basicswimmer.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.basicswimmer).wait(96).to({regX:4.9,regY:258.8,scaleX:2.4133,scaleY:2.4133,x:0.05},0).wait(61).to({regX:5,regY:277,scaleX:2.5742,scaleY:2.5742,x:-0.1,y:0.05},0).wait(17).to({regX:3.8,regY:219.4,scaleX:1.9811,scaleY:1.9811,x:0.05,y:0},0).wait(21).to({regX:2.1,regY:118.5,scaleX:1.1976,scaleY:1.1976,x:-0.1},0).wait(45).to({regX:2,regY:52.3,scaleX:0.9869,scaleY:0.9869,x:0},0).wait(316).to({regX:1.4,regY:7.7,scaleX:0.8936,scaleY:0.8936,x:-0.05,y:0.05},0).wait(1));

	// jump_board_obj_
	this.jump_board = new lib.Scene_1_jump_board();
	this.jump_board.name = "jump_board";
	this.jump_board.depth = 0;
	this.jump_board.isAttachedToCamera = 0
	this.jump_board.isAttachedToMask = 0
	this.jump_board.layerDepth = 0
	this.jump_board.layerIndex = 15
	this.jump_board.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.jump_board).wait(90).to({regX:3.6,regY:149.5,scaleX:1.755,scaleY:1.755,y:0.1},0).wait(353).to({regX:1.4,regY:13.6,scaleX:0.9235,scaleY:0.9235,x:0.05,y:0},0).wait(114));

	// maslul_obj_
	this.maslul = new lib.Scene_1_maslul();
	this.maslul.name = "maslul";
	this.maslul.depth = 0;
	this.maslul.isAttachedToCamera = 0
	this.maslul.isAttachedToMask = 0
	this.maslul.layerDepth = 0
	this.maslul.layerIndex = 16
	this.maslul.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.maslul).wait(557));

	// waves_obj_
	this.waves = new lib.Scene_1_waves();
	this.waves.name = "waves";
	this.waves.depth = 0;
	this.waves.isAttachedToCamera = 0
	this.waves.isAttachedToMask = 0
	this.waves.layerDepth = 0
	this.waves.layerIndex = 17
	this.waves.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.waves).wait(557));

	// pool_obj_
	this.pool = new lib.Scene_1_pool();
	this.pool.name = "pool";
	this.pool.depth = 0;
	this.pool.isAttachedToCamera = 0
	this.pool.isAttachedToMask = 0
	this.pool.layerDepth = 0
	this.pool.layerIndex = 18
	this.pool.maskLayerName = 0

	this.timeline.addTween(cjs.Tween.get(this.pool).wait(223).to({regX:0.6,regY:-5.3,scaleX:0.7569,scaleY:0.7569},0).wait(334));

	// stageBackground
	this.shape = new cjs.Shape();
	this.shape.graphics.f().s("rgba(0,0,0,0)").ss(1,1,1,3,true).p("Ehljg5zMDLHAAAMAAABznMjLHAAAg");
	this.shape.setTransform(640,360);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("#FFFFFF").s().p("EhljA50MAAAhznMDLHAAAMAAABzng");
	this.shape_1.setTransform(640,360);

	this.timeline.addTween(cjs.Tween.get({}).to({state:[{t:this.shape_1},{t:this.shape}]}).wait(557));

	this._renderFirstFrame();

}).prototype = p = new lib.AnMovieClip();
p.nominalBounds = new cjs.Rectangle(639,340.6,2639.4,658.6999999999999);
// library properties:
lib.properties = {
	id: '187D8EA461DA844F85B4E0013DE7EB7F',
	width: 1280,
	height: 720,
	fps: 24,
	color: "#FFFFFF",
	opacity: 1.00,
	manifest: [
		{src:"images/CachedBmp_219.png?1597955481691", id:"CachedBmp_219"},
		{src:"images/CachedBmp_216.png?1597955481691", id:"CachedBmp_216"},
		{src:"images/CachedBmp_169.png?1597955481691", id:"CachedBmp_169"},
		{src:"images/CachedBmp_167.png?1597955481691", id:"CachedBmp_167"},
		{src:"images/CachedBmp_116.png?1597955481691", id:"CachedBmp_116"},
		{src:"images/CachedBmp_51.png?1597955481691", id:"CachedBmp_51"},
		{src:"images/CachedBmp_19.png?1597955481691", id:"CachedBmp_19"},
		{src:"images/CachedBmp_18.png?1597955481691", id:"CachedBmp_18"},
		{src:"images/CachedBmp_16.png?1597955481691", id:"CachedBmp_16"},
		{src:"images/CachedBmp_14.png?1597955481691", id:"CachedBmp_14"},
		{src:"images/CachedBmp_13.png?1597955481691", id:"CachedBmp_13"},
		{src:"images/CachedBmp_12.png?1597955481691", id:"CachedBmp_12"},
		{src:"images/CachedBmp_11.png?1597955481691", id:"CachedBmp_11"},
		{src:"images/CachedBmp_10.png?1597955481691", id:"CachedBmp_10"},
		{src:"images/Jumpper_atlas_1.png?1597955481424", id:"Jumpper_atlas_1"},
		{src:"images/Jumpper_atlas_2.png?1597955481424", id:"Jumpper_atlas_2"},
		{src:"images/Jumpper_atlas_3.png?1597955481424", id:"Jumpper_atlas_3"},
		{src:"images/Jumpper_atlas_4.png?1597955481424", id:"Jumpper_atlas_4"},
		{src:"sounds/PourWater.mp3?1597955481691", id:"PourWater"},
		{src:"sounds/Record1.mp3?1597955481691", id:"Record1"},
		{src:"sounds/Record2.mp3?1597955481691", id:"Record2"},
		{src:"sounds/Record3.mp3?1597955481691", id:"Record3"},
		{src:"sounds/Record4.mp3?1597955481691", id:"Record4"},
		{src:"sounds/Splash.mp3?1597955481691", id:"Splash"},
		{src:"sounds/whistle.mp3?1597955481691", id:"whistle"}
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