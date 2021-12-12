enchant();
var game;
var speed;
var playerSpeed;
var score;//スコア（赤点の数）
var scoreCount;
var eid;
var enemyList=[];
addEventListener('load',function(){
	game=new Game(1920,1080);
	game.preload('sozai/ryuunen.png','sozai/yuuwaku.png','sozai/smartphone.png','sozai/title.png','sozai/startBg.png','sozai/akatenKaihi.png','sozai/saishi_system.png','sozai/button_start.png','sozai/button_restart.png','sozai/notSuisen.png','sozai/haikei.png','sozai/player.png','sozai/arrow_up.png','sozai/arrow_down.png','sozai/akaten.png');
	game.addEventListener('load',function(){
		game.pushScene(game.startScene());
	});
	//スタートシーン
	game.startScene=function(){
		var scene=new Scene();
		//背景
		var bg=new Sprite(1920,1080);
		bg.image=game.assets['sozai/startBg.png'];
		scene.addChild(bg);
		var title=new Sprite(640,300);
		title.image=game.assets['sozai/title.png'];
		title.scaleX=1;
		title.scaleY=1;
		title.moveTo(640,-300);
		scene.addChild(title);
		//リスタートボタン
		var gameStart=new Sprite(300,268);
		gameStart.image=game.assets['sozai/button_start.png'];
		gameStart.x=810;
		gameStart.y=810;
		scene.addChild(gameStart);
		//繰り返し処理
		scene.onenterframe=function(){
			if(title.y<=300)title.y+=5;
			else if(title.scaleX<=2){
				title.scaleX+=0.1;
				title.scaleY+=0.1;
			}
		}
		//クリックされたら
		scene.ontouchend = function(e) {
			if(e.x>810&&e.x<=1110&&e.y<=1078&&e.y>810){
				game.replaceScene(game.mainScene());
			}
        	}
		return scene;
	}
	//メインシーン
	game.mainScene=function(){
		speed=10;
		score=0;
		scoreCount=0;
		var scene=new Scene();
		//背景
		var bg=new Sprite(1920,1080);
		bg.image=game.assets['sozai/haikei.png'];
		scene.addChild(bg);
		//スコア
		var scoreLabel=new Label("赤点の数:0");
		scoreLabel.x=280;
		scoreLabel.y=100;
		scoreLabel.width=860;
		scoreLabel.height=200;
		scoreLabel.font="60px Palatino";
		scoreLabel.color="red";
		//タイム
		var time=60;
		var timeLabel=new Label(`残り試験期間:${time}秒`);
		timeLabel.x=680;
		timeLabel.y=100;
		timeLabel.width=960;
		timeLabel.height=200;
		timeLabel.textAlign="right";
		timeLabel.font="60px Palatino";
		timeLabel.color="white";
		//上ボタン
		var up=new Sprite(157,157);
		up.image=game.assets['sozai/arrow_up.png'];
		up.moveTo(0,766);
		//下ボタン
		var down=new Sprite(157,157);
		down.image=game.assets['sozai/arrow_down.png'];
		down.moveTo(0,923);
		//プレイヤー
		var player=new Sprite(200,305);
		player.image=game.assets['sozai/player.png'];
		player.moveTo(600,400);
		playerSpeed=50;
		//赤点
		scene.onenterframe=function(){
			if(game.frame%30==0){
				time-=1;
				timeLabel.text="残り試験期間:"+time+"秒";
				if(time==0)game.replaceScene(game.endScene());
				if(time>2){
					var sumaho=new Sumaho();
					enemyList.push(sumaho);
					
				}
				if(playerSpeed<50)playerSpeed+=10;
				if(playerSpeed==30)player.image=game.assets['sozai/player.png'];
			}
			scene.addChild(scoreLabel);
			scene.addChild(timeLabel);
			if(game.frame%60==0&&time>2){
				scoreCount++;
				speed+=1;
				var enemy=new Enemy();
				enemyList.push(enemy);
			}
			for(var i=0;i<enemyList.length;i++){
				scene.addChild(enemyList[i]);
				if(player.intersect(enemyList[i])){
					if(enemyList[i].eid==0){
						enemyList[i].y=-300;
						score++;//スコアカウント
						scoreLabel.text="赤点の数:"+score;
					}
					else{
						enemyList[i].y=-300;
						playerSpeed=0;
						player.image=game.assets['sozai/yuuwaku.png'];
					}
				}
			}
			scene.addChild(down);
			scene.addChild(up);
			scene.addChild(player);
		}
		//クリックされたら
		scene.ontouchend = function(e) {
			if(e.x>0&&e.x<=157){
				if(e.y<1080&&e.y>=923&&player.y<700)player.y+=playerSpeed*2;
				if(e.y<923&&e.y>=766&&player.y>0)player.y-=playerSpeed*2;
			}
        	}
		//キーボードが押されたときの動作
		player.addEventListener('enterframe',function(){
			if(game.input.down&&this.y<750)this.y+=playerSpeed;
			if(game.input.up&&this.y>0)this.y-=playerSpeed;
		});
		return scene;
	}
	//リザルトシーン
	game.endScene=function(){
		var scene=new Scene();
		//背景
		var bg=new Sprite(1920,1080);
		bg.image=game.assets['sozai/haikei.png'];
		scene.addChild(bg);
		var ryuunen=new Sprite(500,500);
		ryuunen.image=game.assets['sozai/ryuunen.png'];
		ryuunen.x=300;
		ryuunen.y=500;
		var notSuisen=new Sprite(1920,1080);
		notSuisen.image=game.assets['sozai/notSuisen.png'];
		var saishi=new Sprite(480,480);
		saishi.image=game.assets['sozai/saishi_system.png'];
		saishi.x=280;
		saishi.y=100;
		var kaihi=new Sprite(500,500);
		kaihi.image=game.assets['sozai/akatenKaihi.png'];
		kaihi.x=300;
		kaihi.y=500;
		//赤点の数
		var scoreLabel=new Label(`赤点の数:${score}個`);
		scoreLabel.x=640;
		scoreLabel.y=100;
		scoreLabel.width=640;
		scoreLabel.height=200;
		scoreLabel.font="60px Palatino";
		scoreLabel.textAlign="center";
		scene.addChild(scoreLabel);
		//赤点取得数によってはIWS先生が表示される
		if(scoreCount==score){
			scene.addChild(ryuunen);
			scoreLabel.color="red";
		}
		else if(score>=10){
			scene.addChild(saishi);
			scene.addChild(notSuisen);
			scoreLabel.color="red";
		}
		else if(score>0){
			scene.addChild(saishi);
			scoreLabel.color="yellow";
		}
		else{
			scene.addChild(kaihi);
			scoreLabel.color="green";
		}
		//リスタートボタン
		var gameRestart=new Sprite(300,268);
		gameRestart.image=game.assets['sozai/button_restart.png'];
		gameRestart.x=810;
		gameRestart.y=810;
		scene.addChild(gameRestart);
		//クリックされたら
		scene.ontouchend = function(e) {
			if(e.x>810&&e.x<=1110&&e.y<=1078&&e.y>810){
				game.replaceScene(game.startScene());
			}
        	}
		return scene;
	}
	game.start();
});
//赤点のテストのクラス
var Enemy=Class.create(Sprite,{
	initialize:function(){
		//初期化処理
		Sprite.call(this,200,212);
		this.image=game.assets['sozai/akaten.png'];
		this.moveTo(1720,Math.floor(Math.random()*868));
		this.eid=0;
	},
	onenterframe:function(){
		//毎フレーム処理
		if(this.x>-200)this.x-=speed;
		else if(this.x>-400){
			enemyList.shift();
			this.x=-500;
		}
	}
});
//スマホのクラス
var Sumaho=Class.create(Sprite,{
	initialize:function(){
		//初期化処理
		Sprite.call(this,200,217);
		this.image=game.assets['sozai/smartphone.png'];
		this.moveTo(1720,Math.floor(Math.random()*868));
		this.eid=1
	},
	onenterframe:function(){
		//毎フレーム処理
		if(this.x>-200)this.x-=speed;
		else if(this.x>-400){
			enemyList.shift();
			this.x=-500;
		}
	}
});