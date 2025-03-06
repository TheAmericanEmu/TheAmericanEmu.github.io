let table,tiles,groundSheet,objectSheet,treeSheet,allSheet,wheel1,wheel2,frame,axles=[],map,gear=0,isloadingScreen=true,facts;
let idleSFX,gearChangeSFX,loadingSFX,revUpSFX,overRevSFX,carImage,smokeFX=[],buildingImage,treeImage,fireFX,fire,fireAniObj,carSmokeFX;
let smokes,chunks=[];
let trees,plants,object,buildings;
let score=0;
let parallaxMountain=[]
let ParalaxObject=[]
let creditsJSON=[]
let isCreditsRolling;
let creditSong;
let CSbackground;
let isMenuLoaded=true
let menuButtons=[]
let mainTheme
let deathScreenButtons=[]
let isDeadMenu=false
let infoJson
let startFrame=0
let endFrame=0
function preload() {
	facts = loadJSON('facts.json');
	infoJson = loadJSON('Info.json');
	idleSFX= loadSound("idle.wav")
	gearChangeSFX= loadSound("gearChange.wav")
	loadingSFX=loadSound("loading.wav")
	revUpSFX=loadSound("highRev.wav")
	overRevSFX=loadSound("overRev.wav")
	carImage=loadImage("spr_classiccar_0.png")
	for(let i = 1;i<25;i++){
		let id=i
		if(i<10){
			id="0"+i
		}
		smokeFX.push("blackSmoke"+id+".png")
	}
	//print(smokeFX)
	buildingImage=loadImage("shack_00_f.png")
	treeImage=loadImage("Tree.png")
	fireFX=loadImage("frie.png")
	carSmokeFX=loadImage("Smoke-SpriteSheet.png")
	parallaxMountain.push(loadImage("parallax-mountain-bg.png"))
	parallaxMountain.push(loadImage("parallax-mountain-montain-far.png"))
	parallaxMountain.push(loadImage("parallax-mountain-mountains.png"))
	parallaxMountain.push(loadImage("parallax-mountain-trees.png"))
	parallaxMountain.push(loadImage("parallax-mountain-foreground-trees.png"))
	creditsJSON=loadJSON("cerdits.json")
	creditSong=loadSound("credits.wav")
	mainTheme=loadSound("MainTheme.wav")
}

function setupSmokes(){
	smokes= new Group()
	// smokes.addAni(smokeFX)
	// smokes.scale =0.05
	// smokes.overlaps(frame)
	// smokes.life=30
	// smokes.speed=0.01
	// smokes.applyForce(random(0,0.5),random(-2,5))
	// smokes.ani.play()
	
}

function setupParalax(){
	//print(parallaxMountain)
	for(let i =0;i<parallaxMountain.length;i++){
		let layerBackground=parallaxMountain[i]
		//print(layerBackground)
		let layerSprite = new Sprite()
		layerSprite.img = layerBackground
		layerSprite.count=0
		layerSprite.countMax=layerBackground.width/2
		layerSprite.scale=2.5
		layerSprite.collider="n"
		ParalaxObject.push(layerSprite)
	}
}

function drawParallax(){
	for(let i =0;i<ParalaxObject.length;i++){
		let layerBackground=ParalaxObject[i]
		layerBackground.y=frame.y
		layerBackground.x=frame.x
		layerBackground.layer=0
		if(i!=0){
			layerBackground.x-=(layerBackground.count)
			layerBackground.count+=axles[0].speed/((i*100)+1);
			if(layerBackground.count>layerBackground.countMax){
			layerBackground.count=0
			}
		}

	}
}

function drawFakeParallax(){
	for(let i =0;i<ParalaxObject.length;i++){
		let layerBackground=ParalaxObject[i]
		if(i==0){
			camera.y=layerBackground.y
			camera.x=layerBackground.x
		}		
		layerBackground.layer=500
		if(i!=0){
			layerBackground.x-=(layerBackground.count)
			layerBackground.count+=0.1/((i*100)+1);
			if(layerBackground.count>0.5){
			layerBackground.count=0
			layerBackground.x=ParalaxObject[0].x
			}
		}

	}
}


function setupCar(){
	wheel1= new Sprite()
	wheel1.d=20
	wheel1.x=75
	wheel1.y=3
	wheel1.color="black"
	wheel2= new Sprite()
	wheel2.d=20
	wheel2.x=160
	wheel2.y=3
	wheel2.color="black"
	frame= new Sprite()
	frame.x=115
	frame.y=-15
	frame.w=160
	
	frame.h=10
	frame.gear=0
	frame.rawRpm = 0
	frame.outRpm = 0
	frame.engineBlock= new Sprite()
	frame.engineBlock.w=1
	frame.engineBlock.h=1
	frame.engineBlock.overlaps(allSprites)
	frame.engineBlock.x=frame.x+40
	frame.engineBlock.y=frame.y-40
	frame.engineBlock.stroke="n"
	frame.engineBlock.fill="n"
	frame.engineBlock.collider="d"
	frame.engineBlock.mass=-20
	frame.engineBlock.addAni("fire",fireFX, { frameSize: [96, 96], frames: 19 })
	frame.engineBlock.addAni("smoke",carSmokeFX, { frameSize: [80, 80], frames: 19 })
	frame.engineBlock.addAni("nill",carSmokeFX, { frameSize: [1, 1], frames: 1 })
	frame.engineBlock.changeAni("nill")
	frame.engineWeld= new GlueJoint(frame,frame.engineBlock)
	frame.engineWeld.visible =false
	frame.exhust = new Sprite()
	frame.img=carImage
	frame.exhust.x = frame.x-60
	frame.exhust.w=0.1
	frame.exhust.h=0.1
	frame.exhust.y=frame.y
	frame.exhust.collider="n"
	timerCount = [0,0,0]
	frame.engineBlock.w=30
	//frame.engineWeld= new GlueJoint(frame.exhust,frame)
	frame.engineHealth = 100
	frame.isOverReving=false
	frame.scale=0.5
	frame.overlaps(wheel1)
	frame.overlaps(wheel2)
	frame.isDead=false
	axles.push(new WheelJoint(frame,wheel1))
	axles.push(new WheelJoint(frame,wheel2))
	frame.hud=new Sprite()
	frame.hud.x=frame.x
	frame.hud.y=frame.y
	frame.hud.collider="n"
	frame.hud.width=600
	frame.hud.height=200
	frame.hud.color="grey"
	frame.hud.rpm = new Sprite()
	frame.hud.rpm.collider="n"
	frame.hud.rpm.color="black"
	frame.hud.milesDriven = new Sprite()
	frame.hud.milesDriven.collider="n"
	frame.hud.milesDriven.color="black"
	frame.hud.gear = new Sprite()
	frame.hud.gear.collider="n"
	frame.hud.gear.h=25
	frame.hud.gear.w=100
	frame.hud.gear.color="black"
	frame.hud.radioBacking=new Sprite()
	frame.hud.radioBacking.d=100
	frame.hud.radioBacking.x=200
	frame.hud.radioBacking.y=200
	frame.hud.radioBacking.collider="n"
	frame.hud.radioBacking.fill="black"
	frame.hud.radioBacking.stroke="rgb(183,182,182)"
	frame.hud.timer=new Sprite()
	frame.hud.timer.w=55
	frame.hud.timer.h=20
	frame.hud.timer.x=200
	frame.hud.timer.y=200
	frame.hud.timer.collider="n"
	frame.hud.timer.fill="green"
	frame.hud.timer.stroke="rgb(170,170,170)"
}
let timerCount = [0,0,0]
function dialUpdate(){
	if(frameCount%frameRate()){
		timerCount[2]++
	}
	if(timerCount[2]>=60){
		timerCount[2]=0
		timerCount[1]++
	}
	if(timerCount[1]>=60){
		timerCount[1]=0
		timerCount[0]++
	}
	frame.hud.rpm.x=frame.hud.x+100
	frame.hud.rpm.y=frame.hud.y-50
	frame.hud.milesDriven.x=frame.hud.x+50
	frame.hud.milesDriven.y=frame.hud.y-50
	frame.hud.gear.x=frame.hud.x+75
	frame.hud.gear.y=frame.hud.y-10
	
	frame.hud.radioBacking.x=frame.hud.x-100
	frame.hud.radioBacking.y=frame.hud.y-25
	frame.hud.timer.x=frame.hud.radioBacking.x
	frame.hud.timer.y=frame.hud.radioBacking.y
	
	if(frameCount%2==0){
		frame.hud.timer.text=str((timerCount[0])+":"+str(timerCount[1])+":"+str(timerCount[2]))
		frame.hud.rpm.text=frame.rawRpm
		if(frame.isOverReving){
			frame.hud.rpm.textFill="red"
		}
		else{
			frame.hud.rpm.textFill="white"
		}
	}
	frame.hud.milesDriven.text=score*1000
	frame.hud.milesDriven.textFill="white"
	let downGear=frame.gear-1
	if(downGear<-1){
		downGear=""
	}
	let upGear=frame.gear+1
	if(upGear>3){
		upGear=""
	}
	frame.hud.gear.text=str(downGear)+"<-"+str(frame.gear)+"->"+str(upGear)
	frame.hud.gear.textFill="white"
	
	
}
//Output gear rpm = Input gear rpm//Gear Ratio

function gearMath(){
	
	if(isloadingScreen==true){
		return
	}
	dialUpdate()
	if(frame.gear!=0){
		frame.outRpm = frame.rawRpm/frame.gear
	}
	else{
		frame.outRpm=0
	}
	
	axles[0].speed = frame.outRpm
	if(frame.rawRpm>10&&frame.gear==-1){
		frame.rawRpm=10 
		frame.isOverReving=true
	}
	else if(frame.rawRpm<10&&frame.gear==-1){
		frame.isOverReving=false
	}
	if(frame.rawRpm>60&frame.gear==1){
		frame.rawRpm=60
		frame.isOverReving=true
	}
	else if(frame.rawRpm<60&&frame.gear==1){
		frame.isOverReving=false
	}
	if(frame.rawRpm>70&&frame.gear==2){
		frame.rawRpm=70
		frame.isOverReving=true
	}
	else if(frame.rawRpm<70&&frame.gear==2){
		frame.isOverReving=false
	}
	if(frame.rawRpm>150&&frame.gear==3){
		frame.rawRpm=150
		frame.isOverReving=true
	}
	else if(frame.rawRpm<150&&frame.gear==3){
		frame.isOverReving=false
	}
	frame.hud.x=camera.x
	frame.hud.y=camera.y+175
	print(frame.hud.y)
	// if(frame.rawRpm == 3.5){
	// 	if(idleSFX.isPlaying()==false){
	// 		idleSFX.play()
	// 	}
	// }
	// if(frame.rawRpm == 3.5){
	// 	if(idleSFX.isPlaying()==false){
	// 		idleSFX.play()
	// 	}
		
	// }
	// for(let i =0;i<5;i++){
	// 	let smoke = new frame.exhust.Sprite()
	// 	smoke.x=frame.x-40
	// 	smoke.y=frame.y
	// 	smoke.d=2
	// 	smoke.applyForce(random(-5,5),-10)
	// 	smoke.collider="k"
	// }
	camera.x = frame.x + 100;
	camera.y = frame.y;
	if(frame.isOverReving==true){
		if(idleSFX.isPlaying()==false) idleSFX.play();
		idleSFX.rate(3)
		frame.engineHealth--;
		
	}
	else{
		idleSFX.rate(frame.rawRpm/150)
		if(idleSFX.isPlaying()==false) idleSFX.play();
		overRevSFX.stop()
		
	}
	// let smoke = new smokes.Sprite()
	// smoke.x = frame.exhust.x
	// smoke.y=frame.exhust.y
	// smoke.overlaps(allSprites)
	
	// for(let smoke of smokes){
	// 	//smoke.applyForce(random(0,0.5),random(-2,-5))
	// 	smoke.vel.y = -2
	// }
	if(frame.engineHealth<=0&&frame.isDead==false){
		frame.isDead=true
		runDead()
	}
	if(frame.engineHealth<50&&frame.engineHealth>25){
		frame.engineBlock.changeAni("smoke")
	}
	else if(frame.engineHealth<25){
		frame.engineBlock.changeAni("fire")
	}
	else if(frame.engineHealth>50){
		frame.engineBlock.changeAni("nill")
	}
	
}

function runDead(){
	for(let axel of axles){
		axel.remove();
	}
	frame.hud.y=1000000
	dialUpdate()
	let startOver= new Sprite()
	isDeadMenu=true
	startOver.x=camera.x
	startOver.x=camera.y+200
	startOver.w=100
	startOver.h=20
	startOver.collider="n"
	startOver.color="brown"
	startOver.stroke="black"
	startOver.text="Start a New"
	startOver.textFill="white"
	startOver.layer=600
	startOver.clickedEvent=()=>{
		frame.hud.y=1000000
		dialUpdate()
		frame.remove()
		chunks[0].remove()
		chunks=[]
		axles=[]
		setupCar()
		drawWorldV2(0,300)
		score=0
		for(let button of deathScreenButtons){
			button.remove()
			
		}
		deathScreenButtons=[]
	}
	let FinalScore= new Sprite()
	FinalScore.x=camera.x
	FinalScore.x=camera.y-150
	FinalScore.w=100
	FinalScore.h=20
	FinalScore.collider="n"
	FinalScore.color="brown"
	FinalScore.stroke="black"
	FinalScore.text=(score*1000)
	FinalScore.textFill="white"
	FinalScore.layer=600
	FinalScore.clickedEvent=()=>{};
	
	deathScreenButtons.push(startOver)
	deathScreenButtons.push(FinalScore)


	
	
}


function input(){
	if(isloadingScreen==true){
		return
	}
	if(kb.presses("r")){
		frame.rotation=0
		frame.y-=100
	}
	if(kb.presses("b")){
		saveGif('mySketch', 15)
	}
	let rpmInc = 1
	if(kb.pressing("right")) {
		frame.rawRpm+=rpmInc;
		
	}
	//else if (kb.pressing("left") ) axles[0].speed--;
	else if(kb.pressing("space")) {axles[0].enableMotor=false;axles[0].speed=0}
	else{
		if(frame.rawRpm>3.5){
			frame.rawRpm-=rpmInc/2
		}
		axles[0].enableMotor=true
	
	}
	
	//else axles[0].enableMotor=false
	// axles[0].speed=axles[0].speed
	if(kb.presses("up")&&frame.gear<3) {
		frame.gear++;
		if(gearChangeSFX.isPlaying()==false){
			gearChangeSFX.play()
		}
		
	}
	else if(kb.presses("down")&&frame.gear>-1) {
		frame.gear--;
		if(gearChangeSFX.isPlaying()==false){
			gearChangeSFX.play()
		}
	}
	text(frame.rawRpm,300,400)
	text(frame.gear,270,400)
	text(round(frame.outRpm),250,400)
}

function drawWorld(){
	let oldY=300
	let oldX=0
	let grade = [[-300,300],[0,300]]
	for(let i = 1;i<500;i+=25){
		let newY=random(oldY,oldY+random(-5*20,5*20))
		let newX = oldX+random(132,164) 
		print([newX,newY])
		
		grade.push([newX,newY])
		oldY=newY
		oldX=newX
	}
	grade.push([oldX+300,oldY])
	map = new Sprite(grade)
	map.collider="s"
	map.stroke=10
	
	
	
}

function setupTiles(){
	trees=new Group()
	trees.tile="t"
	trees.w=15
	trees.h=100
	trees.collider="s"
	trees.layer=0
	trees.img=treeImage
	trees.overlaps(allSprites)
	plants=new Group()
	plants.tile="p"
	plants.w=15
	plants.h=15
	plants.collider="s"
	plants.layer=0
	plants.overlaps(allSprites)
	object=new Group()
	object.tile="o"
	object.w=15
	object.h=50
	object.collider="s"
	object.layer=0
	object.overlaps(allSprites)
	buildings=new Group()
	buildings.tile="b"
	buildings.w=25
	buildings.h=100
	buildings.collider="s"
	buildings.overlap(allSprites)
	buildings.layer=0
	buildings.img=buildingImage
	buildings.scale=1
}



function drawWorldV2(x,y){
	let oldY=y
	let oldX=x+300
	let grade = [[x-100,y],[x+300,y]]
	let backgroundLayer1=""
	for(let i = 1;i<1000;i+=25){
		
		let newY=random(oldY,oldY+random(-5*20,5*20))
		let newX = oldX+random(132,164) 
		//print([newX,newY])
		
		grade.push([newX,newY])
		for(let li = 0;li<(newX-oldX);li++){
			backgroundLayer1=backgroundLayer1+"."
		}
		backgroundLayer1=backgroundLayer1+random(["t","p","o","b"])
		oldY=newY
		oldX=newX

	}
	grade.push([oldX+300,oldY])
	let newMap = new Sprite(grade)
	newMap.collider="s"
	newMap.stroke=10
	newMap.endX=oldX
	newMap.endY=oldY
	newMap.seen=false
	newMap.stroke="rgb(255,255,255)"
	//newMap.backgroundTiles = new Tiles([backgroundLayer1],0,260,0,0)
	chunks.push(newMap)
	
	
}


function setup() {
	
	new Canvas(400, 400);
	setupParalax()
	setupTiles()
	background(100);
	world.gravity.y=10
	//drawWorld()

	//setupcreditsShow()
	// loadingScreen("Start up","",()=>{
	// 	print("startUp")
	// })
	setupSmokes()
	// frame.remove()
	
	
	fire = loadAnimation();
	createMenu()
}

function createMenu(){
	mainTheme.play()
	mainTheme.loop()
	isMenuLoaded=true
	let title = new Sprite()
	title.x=camera.x
	title.y=camera.y-100
	title.h=25
	title.w=75
	title.fill="rgba(128,128,128,0)"
	title.stroke="rgba(128,128,128,0)"
	title.text="Journey"
	title.textFill="rgba(51,179,248,0.84)"
	title.textSize=50
	title.collider="n"
	title.layer=600
	title.clickedEvent=()=>{
		print("fun")
	}
	let playButton = new Sprite()
	playButton.x=camera.x-100
	playButton.y=camera.y
	playButton.h=25
	playButton.w=75
	playButton.collider="s"
	playButton.layer=600
	playButton.color="brown"
	playButton.stroke="black"
	playButton.text="Play"
	playButton.clickedEvent=()=>{
		isloadingScreen=false
		isMenuLoaded=false
		chunks=[]
		setupCar()
		drawWorldV2(0,300)
		mainTheme.stop()
		for(let button of menuButtons){
			button.remove()
		}
		menuButtons=[]
		isMenuLoaded=false
		loadingScreen("Start up","",()=>{
		print("startUp")
		startFrame=frameCount
		})

	}
	let creditsButton = new Sprite()
	creditsButton.x=camera.x-100
	creditsButton.y=camera.y+50
	creditsButton.h=25
	creditsButton.w=75
	creditsButton.collider="s"
	creditsButton.layer=600
	creditsButton.color="brown"
	creditsButton.stroke="black"
	creditsButton.text="Credits"
	creditsButton.clickedEvent=()=>{
		mainTheme.stop()
		setupcreditsShow()
	}
	
	
	let infoButton = new Sprite()
	infoButton.x=camera.x-100
	infoButton.y=camera.y+100
	infoButton.h=25
	infoButton.w=75
	infoButton.collider="s"
	infoButton.layer=600
	infoButton.color="brown"
	infoButton.stroke="black"
	infoButton.text="Toutrial"
	infoButton.clickedEvent=()=>{
		mainTheme.stop()
		setupInfoShow()
	}
	menuButtons.push(infoButton)
	menuButtons.push(creditsButton)
	menuButtons.push(playButton)
	menuButtons.push(title)
}

function setupInfoShow(){
	isloadingScreen=true
	isCreditsRolling=true
	creditSong.play()
	creditSong.loop()
	let startFrame = frameCount
	CSbackground = new Sprite()
	CSbackground.color="black"
	CSbackground.h=400
	CSbackground.w=400
	CSbackground.x=200
	CSbackground.y=200
	CSbackground.collider="n"
	CSbackground.layer=100000
	camera.x = CSbackground.x ;
	camera.y = CSbackground.y;
	CSbackground.credits=[""]
	CSbackground.playCredits=false
	
	let deptName = new Sprite()
	deptName.x=200
	deptName.y=100
	deptName.text="CREDITS"
	deptName.collider="n"
	deptName.fill="black"
	deptName.stroke="black"
	deptName.textFill="white"
	CSbackground.credits.push(deptName)
	
	for(let i1=0;i1<infoJson.Credits.length;i1++ ){
		let dept = infoJson.Credits[i1]
		let deptName = new Sprite()
		deptName.x=200
		deptName.y=500*i1
		deptName.text=dept.Title
		deptName.collider="n"
		deptName.fill="black"
		deptName.stroke="black"
		deptName.textFill="white"
		CSbackground.credits.push(deptName)
		for(let i2=0;i2<dept.Credits.length;i2++ ){
			let personData=dept.Credits[i2]
			let personTitle = new Sprite()
			personTitle.x=200
			personTitle.y=deptName.y+(i2*50)+100
			personTitle.collider="n"
			personTitle.fill="black"
			personTitle.stroke="black"
			personTitle.textFill="white"
			personTitle.text=str(personData.Title)+" --- "+str(personData.Artist)
			personTitle.textSize=10
			CSbackground.credits.push(personTitle)
			
		}
	}
	CSbackground.playCredits=true
}

function setupcreditsShow(){
	isloadingScreen=true
	isCreditsRolling=true
	creditSong.play()
	creditSong.loop()
	let startFrame = frameCount
	CSbackground = new Sprite()
	CSbackground.color="black"
	CSbackground.h=400
	CSbackground.w=400
	CSbackground.x=200
	CSbackground.y=200
	CSbackground.collider="n"
	CSbackground.layer=100000
	camera.x = CSbackground.x ;
	camera.y = CSbackground.y;
	CSbackground.credits=[""]
	CSbackground.playCredits=false
	
	let deptName = new Sprite()
	deptName.x=200
	deptName.y=200
	deptName.text="CREDITS"
	deptName.collider="n"
	deptName.fill="black"
	deptName.stroke="black"
	deptName.textFill="white"
	CSbackground.credits.push(deptName)
	
	for(let i1=0;i1<creditsJSON.Credits.length;i1++ ){
		let dept = creditsJSON.Credits[i1]
		let deptName = new Sprite()
		deptName.x=200
		deptName.y=(500*i1)+300
		deptName.text=dept.Title
		deptName.collider="n"
		deptName.fill="black"
		deptName.stroke="black"
		deptName.textFill="white"
		CSbackground.credits.push(deptName)
		for(let i2=0;i2<dept.Credits.length;i2++ ){
			let personData=dept.Credits[i2]
			let personTitle = new Sprite()
			personTitle.x=200
			personTitle.y=deptName.y+(i2*50)+100
			personTitle.collider="n"
			personTitle.fill="black"
			personTitle.stroke="black"
			personTitle.textFill="white"
			personTitle.text=str(personData.Title)+" --- "+str(personData.Artist)
			CSbackground.credits.push(personTitle)
			
		}
	}
	CSbackground.playCredits=true
}

function loadingScreen(event,sound,onload){
	isloadingScreen=true
	loadingSFX.play()
	loadingSFX.loop()
	let startFrame = frameCount
	let LSbackground = new Sprite()
	LSbackground.color="black"
	LSbackground.h=400
	LSbackground.w=400
	LSbackground.x=200
	LSbackground.y=200
	LSbackground.collider="n"
	LSbackground.layer=1000
	LSbackground.fact = new Sprite()
	LSbackground.fact.text=random(facts.facts)
	LSbackground.fact.collider="n"
	LSbackground.fact.color="black"
	LSbackground.fact.stroke="black"
	LSbackground.fact.textWrap=20
	LSbackground.fact.textFill="white"
	
	LSbackground.event = new Sprite()
	LSbackground.event.text=event
	LSbackground.event.collider="n"
	LSbackground.event.color="black"
	LSbackground.event.stroke="black"
	LSbackground.event.textWrap=20
	LSbackground.event.textFill="white"
	LSbackground.event.y=100
	
	camera.x = LSbackground.x ;
	camera.y = LSbackground.y
	setTimeout(function(){
    LSbackground.remove()
		LSbackground.event.remove()
		LSbackground.fact.remove()
		isloadingScreen=false
		loadingSFX.stop()
		
		onload()
	}, 2000);
	
	
}


function draw() {
	clear();
	input();
	gearMath();
	if(isMenuLoaded==true){
		for(let button of menuButtons){
			if(button.mouse.presses()==true) button.clickedEvent()
		}

	}
	if(chunks.length!=0){
		if(chunks[0].endX-frame.x<20&&chunks[0].seen==false){
			drawWorldV2(0,300)
			chunks[0].seen=true
			chunks[0].remove()
			chunks.splice(0,1)
			frame.y=200
			wheel1.y=200
			wheel2.y=200
			frame.x=0
			wheel1.x=0
			wheel2.x=0
			frame.y=200
			wheel1.y=200
			wheel2.y=200
			print(chunks)
			loadingScreen("Track Time Completed:"+str((timerCount[0])+":"+str(timerCount[1])+":"+str(timerCount[2])),"",()=>{
				frame.x=0
				wheel1.x=0
				wheel2.x=0
				frame.y=200
				wheel1.y=200
				wheel2.y=200
				score=abs((score+1)+(frame.engineHealth-(timerCount[0]+timerCount[1]+timerCount[2])))
				frame.engineHealth=100
				timerCount = [0,0,0]
			});

			//chunks[0].backgroundTiles.y=frame.y
		}
	}
	
	if(isMenuLoaded==true){
		drawFakeParallax()
	}
	else{
		drawParallax()
	}
	
	if(isDeadMenu==true){
		deathScreenButtons[0].x=camera.x
		deathScreenButtons[0].y=camera.y
		deathScreenButtons[1].x=camera.x
		deathScreenButtons[1].y=camera.y-150
		for(let button of deathScreenButtons){
			if(button.mouse.presses()==true) {button.clickedEvent();isDeadMenu=false;}

			
		}
	}
	if(isloadingScreen==true && isCreditsRolling==true){
		for(let nameSprite of CSbackground.credits){
			nameSprite.y-=0.5;
			
		}
		//print(CSbackground.credits[CSbackground.credits.length-1].y)
		if(CSbackground.playCredits==true&&CSbackground.credits[CSbackground.credits.length-1].y<-50){
			//isloadingScreen=false
			isCreditsRolling=false
			CSbackground.playCredits=false
			creditSong.stop()
			
			mainTheme.play()
			for(let textSprite of CSbackground.credits){
				try {
					textSprite.remove()
				}
				catch(err) {
					print(err)
				}
				}
			CSbackground.remove()
		}
	}
	
	
	
	
	//circle(mouseX, mouseY, 20);
}
