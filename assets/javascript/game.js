var rpg = {
	//this is the object that has all the characters
	characters:[{ name:"Mario", healthPoints:210,attackPower:13, counterAttackPower:15, 
	imgSrc:"assets/images/mario.jpg" },
	{ name:"Luigi", healthPoints:170, attackPower:13, counterAttackPower:62, 
	imgSrc:"assets/images/luigi.jpg" },
	{ name:"Kirby", healthPoints:140, attackPower:11, counterAttackPower:40, 
	imgSrc:"assets/images/Kirby.jpg" },
	{ name:"Samus", healthPoints:180, attackPower:3,counterAttackPower:25, 
	imgSrc:"assets/images/samus2.png" }],
	//this is an empty array of current characters that is to be modified during gameplay
	currentCharacters: [],PlayerHeroIndex: -1,PlayerAttackPower: 0,PlayerInitialPower: 0,PlayerHealthPoints: 0,
	currentEnemyIndex: -1,
	fight: function()
	{
		//enemy health points
		this.currentCharacters[this.currentEnemyIndex].healthPoints = 
		this.currentCharacters[this.currentEnemyIndex].healthPoints - this.PlayerAttackPower;
		//player attack power 
		this.PlayerAttackPower = this.PlayerAttackPower + this.PlayerInitialPower;
		
		if( this.currentCharacters[this.currentEnemyIndex].healthPoints <= 0 )
		{//after defeating the current enemy
			$("#result").html("<p>You have defeated "+this.currentCharacters[this.currentEnemyIndex].name+", you can choose to fight another enemy.");
			//removes defeated enemy 
			this.currentCharacters.splice(this.currentEnemyIndex,1);
			document.getElementById("defenderRow").innerHTML = "<h2>Defender</h2>";
			//reset enemy index to -1 to select a new enemy
			this.currentEnemyIndex = -1;
			if( this.currentCharacters.length <= 0 )
			{//victorious
				$("#result").html("<p>You Won!!!! GAME OVER</p><button id='restart' value='Restart'>Restart</button>");
			}
			else
			{//new enemies to fight
				document.getElementById("enemyRow").innerHTML = "<h2>Enemies Available To Attack</h2>";
				for(var i = 0; i < this.currentCharacters.length; i++)
				{
					this.drawCharacters("enemyRow",i,
						this.currentCharacters[i].imgSrc,
						this.currentCharacters[i].name,
						this.currentCharacters[i].name,
						this.currentCharacters[i].healthPoints);
				}
			}
		}
		else 
		{//player health points 
			this.PlayerHealthPoints = this.PlayerHealthPoints - this.currentCharacters[this.currentEnemyIndex].counterAttackPower;
			//UPDATE hero and enemy health
			$("#playerRow figure.characters figcaption").html(this.PlayerHealthPoints);
			$("#defenderRow figure.characters figcaption").html(this.currentCharacters[this.currentEnemyIndex].healthPoints);
			$("#result").html("<p>You attacked "+this.currentCharacters[rpg.currentEnemyIndex].name+" for "+this.PlayerAttackPower+
				" damage.</p><p>"+this.currentCharacters[rpg.currentEnemyIndex].name+
				" attacked you back for "+this.currentCharacters[rpg.currentEnemyIndex].counterAttackPower+
				" damage.</p>");

			if( rpg.PlayerHealthPoints <= 0 )
			{//what a loser
				this.currentEnemyIndex = -1;
				console.log("you lost");
				$("#result").html("<p>You been defeated...GAME OVER!!!</p><button id='restart' value='Restart'>Restart</button>");
			}
		}
	},
	drawCharacters: function(rowID,val,imgSrc,name,desc,healthPoints){
		var fig = document.createElement("figure");
		fig.setAttribute("class","characters");
		fig.setAttribute("value",val);
		
		var span = document.createElement("span");
		var t = document.createTextNode(name);
		span.appendChild(t);

		var img = document.createElement("img");
		img.setAttribute("src",imgSrc);
		img.setAttribute("alt",desc);
		
		var figCaption = document.createElement("figcaption");
		var figTxt = document.createTextNode(healthPoints);
		figCaption.appendChild(figTxt);

		fig.appendChild(span);
		fig.appendChild(img);
		fig.appendChild(figCaption);
		document.getElementById(rowID).appendChild(fig);
	},
	restart: function()
	{
		this.PlayerHeroIndex = -1;
		this.PlayerAttackPower = 0;
		this.PlayerInitialPower = 0;
		this.PlayerHealthPoints = 0;
		this.currentEnemyIndex = -1;
		document.getElementById("enemyRow").innerHTML = "<h2>Enemies Available To Attack</h2>";
		document.getElementById("defenderRow").innerHTML = "<h2>Defender</h2>";
		this.startrpg();

	},
	selectCharacter: function(characterIndex)
	{
		this.PlayerHeroIndex = characterIndex; 
		this.PlayerHealthPoints = this.characters[this.PlayerHeroIndex].healthPoints; 
		this.PlayerInitialPower = this.characters[this.PlayerHeroIndex].attackPower;
		this.PlayerAttackPower = this.PlayerAttackPower + this.PlayerInitialPower;
		document.getElementById("playerRow").innerHTML = "<h2>Your Character</h2>";
		this.drawCharacters("playerRow",characterIndex,this.currentCharacters[characterIndex].imgSrc,this.characters[characterIndex].name,this.characters[characterIndex].name,this.characters[characterIndex].healthPoints);
		this.currentCharacters.splice(this.PlayerHeroIndex,1);
		document.getElementById("enemyRow").innerHTML = "<h2>Enemies Available To Attack</h2>";
		for(var i = 0; i < this.currentCharacters.length; i++)
		{
			this.drawCharacters("enemyRow",i,this.currentCharacters[i].imgSrc,this.currentCharacters[i].name,this.currentCharacters[i].name,this.currentCharacters[i].healthPoints);
		}
	},
	startrpg: function()
	{
		document.getElementById("playerRow").innerHTML = "<h2>Your Character</h2>";
		for(var i = 0; i < this.characters.length; i++)
		{
			this.drawCharacters("playerRow",i,this.characters[i].imgSrc,this.characters[i].name,this.characters[i].name,this.characters[i].healthPoints);
		}
		this.currentCharacters = JSON.parse(JSON.stringify(this.characters));
	}
};

$(document).on("ready", function()
{
	rpg.startrpg();
	
	$(".row").on("click", "#playerRow figure.characters", function(ev){
		ev.preventDefault();
		if(rpg.PlayerHeroIndex < 0)
		{
			var PlayerHeroIndex = parseInt($(this).attr("value"));
			rpg.selectCharacter(PlayerHeroIndex);
		}
	});

	$(".row").on("click","#enemyRow figure.characters", function(ev){
		ev.preventDefault();
		if(rpg.PlayerHeroIndex >= 0 && rpg.PlayerHealthPoints > 0)
		{
			rpg.currentEnemyIndex = parseInt($(this).attr("value"));
			if ($('#defenderRow figure.characters').length)
				$("#enemyRow").append($('#defenderRow figure.characters:first'));
			$("#defenderRow").append($(this));
		}
	});
	$(".row").on("click","#restart", function(ev){
		ev.preventDefault();
		rpg.restart();
		$("#result").html("");
	});
	
	$("#attack").on("click", function(ev){
		ev.preventDefault();
		if(rpg.PlayerHeroIndex >= 0 && rpg.PlayerHealthPoints > 0) 
			if(rpg.currentEnemyIndex >= 0) 
				rpg.fight();
			else if(rpg.currentCharacters.length)
				$("#result").html("No enemy here.");
	});
});