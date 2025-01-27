/* 2D Spielfeld als Matrix 
	0: nix
	1: freie Kachel
	2: steinKlein
	3: stein
	4: boxKlein
    5: box
    6: eisBox
	7: loch
	8: eisLoch
	9: lochGefuelltKlein
	10: lochGefuellt
	11: lochGefuelltEis
	12: figur
*/ 
let feld = [[[1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,7,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1]],
				
			[[3,2,3,2,2,2,2,3,2,2,2,3],
			[2,3,2,2,3,2,3,2,3,2,2,3],
			[2,3,2,3,2,3,2,3,2,2,3,2],
			[2,2,0,0,0,0,0,0,0,0,2,2],
			[3,2,0,0,0,0,0,0,0,0,3,2],
			[2,2,0,0,0,5,0,0,0,0,2,2],
			[2,3,0,0,0,0,0,0,0,0,2,3],
			[3,2,0,0,0,0,0,0,0,0,2,2],
			[3,2,2,3,2,2,3,2,3,2,3,2],
			[2,2,3,2,2,3,2,2,2,3,2,3],
			[3,3,2,3,2,2,2,3,3,2,2,3]]];	

/* Spielfigur initialisieren */
let figurX = 3;
let figurY = 5;
let figurZ = 1;
feld[figurZ][figurY][figurX] = 12;			
			
/* Bilddateien laden */  
let kachel = new Image();
let steinKlein = new Image();
let stein = new Image();
let boxKlein = new Image();
let box = new Image();
let eisBox = new Image();
let loch = new Image();
let eisLoch = new Image();
let lochGefuelltKlein = new Image();
let lochGefuellt = new Image();
let lochGefuelltEis = new Image();
let figur = new Image();
kachel.src = "tiles/png/grass.png";
steinKlein.src = "tiles/png/steinKlein.png";
stein.src = "tiles/png/stein.png";
boxKlein.src = "tiles/png/boxKlein.png";
box.src = "tiles/png/box.png";
eisBox.src = "tiles/png/eisBox.png";
loch.src = "tiles/png/loch.png";
eisLoch.src = "tiles/png/eisLoch.png";
lochGefuelltKlein.src = "tiles/png/boxKlein.png";
lochGefuellt.src = "tiles/png/box.png";
lochGefuelltEis.src = "tiles/png/eisBox.png";
figur.src = "tiles/png/figur.png";

/* globale variablen */
//Eisbox Variablen
let frame = 0;
let geschwindigkeitX = 0;
let geschwindigkeitY = 0;
let blauX = -3;
let blauY = 5;
let blauZ = 1;
let blauIstInLoch = true;
feld[blauZ][blauY][blauX] = 6;	

//Key Variablen
let isLeftKeyDown = false;
let isRightKeyDown = false;
let isUpKeyDown = false;
let isDownKeyDown = false;
let isRKeyDown = false;

//Lvl Variablen
let lvl = 1;

/* Canvas-Zeichenfläche deklarieren */
let offsetX = 850;
let offsetY = 100;
let canvas, context;

function init() {
	canvas = document.getElementById("spielfeld");
	context = canvas.getContext("2d");
	document.addEventListener("keydown", (event) => handleKeyDown(event));
	document.addEventListener("keyup", (event) => handleKeyUp(event));
}

function zeichneFeld() 
{
	context.clearRect(0,0,canvas.width,canvas.height);
	let existiertLoch = false;
	for (let j=0;j<11;j++) //Y (Breite)
	for (let k=0;k<12;k++) //X (Länge)
	for (let i=0;i<feld.length;i++) //Z (Höhe)
	{
		/* Isometrische Canvas-Koordinaten berechnen:
			x,y werden auf die Diagonalen x-y und x+y
			mit dem Seitenverhältnis 2:1 transformiert
		*/
		let x = k*kachel.width/2;
		let y = j*(kachel.height-15);
		let isoX = x-y;
		let isoY = (x+y)/2;
		isoX += offsetX;
		isoY += offsetY;
		if (feld[i][j][k] == 1) /* freie Kachel zeichnen */
		{
			context.drawImage(kachel,isoX,isoY+14,kachel.width,kachel.height);
		} else
		if (feld[i][j][k] == 2) /* steinKlein zeichnen */
		{
			isoY -= steinKlein.height-kachel.height;
			context.drawImage(steinKlein,isoX,isoY,steinKlein.width,steinKlein.height);
		} else
		if (feld[i][j][k] == 3) /* stein zeichnen */
		{
			isoY -= stein.height-kachel.height;
			context.drawImage(stein,isoX,isoY,stein.width,stein.height);
		} else
		if (feld[i][j][k] == 4) /* boxKlein zeichnen */
		{
			isoY -= boxKlein.height-kachel.height;
			context.drawImage(boxKlein,isoX,isoY,boxKlein.width,boxKlein.height);
		} else
		if (feld[i][j][k] == 5) /* box zeichnen */
		{
			isoY -= box.height-kachel.height;
			context.drawImage(box,isoX,isoY,box.width,box.height);
		} else
		if (feld[i][j][k] == 6) /* eisBox zeichnen */
		{
			isoY -= eisBox.height-kachel.height;
			context.drawImage(eisBox,isoX,isoY,eisBox.width,eisBox.height);
		} else
		if (feld[i][j][k] == 7) /* loch zeichnen */
		{
			isoY -= loch.height-kachel.height;
			context.drawImage(loch,isoX,isoY+14,loch.width,loch.height);
			existiertLoch = true;
		} else
		if (feld[i][j][k] == 8) /* eisLoch zeichnen */
		{
			isoY -= eisLoch.height-kachel.height;
			context.drawImage(eisLoch,isoX,isoY+14,eisLoch.width,eisLoch.height);
			existiertLoch = true;
		} else
		if (feld[i][j][k] == 9) /* lochGefuelltKlein zeichnen */
		{
			isoY -= lochGefuelltKlein.height-kachel.height;
			context.drawImage(lochGefuelltKlein,isoX,isoY+14,lochGefuelltKlein.width,lochGefuelltKlein.height);
		} else
		if (feld[i][j][k] == 10) /* lochGefuellt zeichnen */
		{
			isoY -= lochGefuellt.height-kachel.height;
			context.drawImage(lochGefuellt,isoX,isoY+14,lochGefuellt.width,lochGefuellt.height);
		} else
		if (feld[i][j][k] == 11) /* lochGefuelltEis zeichnen */
		{
			isoY -= lochGefuelltEis.height-kachel.height;
			context.drawImage(lochGefuelltEis,isoX,isoY+14,lochGefuelltEis.width,lochGefuelltEis.height);
		} else
		if (feld[i][j][k] == 12) /* figur zeichnen */
		{
			isoY -= figur.height-kachel.height;
			context.drawImage(figur,isoX,isoY,figur.width,figur.height);
		}
	}
	if (!blauIstInLoch) updateEisBox();
	if (!existiertLoch) updateLvl(1);
	setTimeout(zeichneFeld,10);
} 

function updateEisBox() {
	frame++;
	if (frame > 10) {
		feld[blauZ][blauY][blauX] = 0;
		if (geschwindigkeitX > 0 && feld[blauZ][blauY][blauX+1] == 0 && (feld[blauZ-1][blauY][blauX+1] == 1 ||  feld[blauZ-1][blauY][blauX+1] == 9) || geschwindigkeitX < 0 && feld[blauZ][blauY][blauX-1] == 0 && (feld[blauZ-1][blauY][blauX-1] == 1 || feld[blauZ-1][blauY][blauX-1] == 9)) blauX += geschwindigkeitX;
		else geschwindigkeitX = 0;
		if (blauY+1 < 11 && geschwindigkeitY > 0 && feld[blauZ][blauY+1][blauX] == 0 && (feld[blauZ-1][blauY+1][blauX] == 1 || feld[blauZ-1][blauY+1][blauX] == 9) || blauY-1 >= 0 && geschwindigkeitY < 0 && feld[blauZ][blauY-1][blauX] == 0 && (feld[blauZ-1][blauY-1][blauX] == 1 || feld[blauZ-1][blauY-1][blauX] == 9)) blauY += geschwindigkeitY;
		else geschwindigkeitY = 0;
		feld[blauZ][blauY][blauX] = 6
		frame = 0;
	}
}

function updateLvl(lvlPlus) {
	lvl += lvlPlus;
	if (lvl == 1) {
		feld = [[[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,7,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1]],
				
				[[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,2,3,2,3,2,3,2,2,3],
				[2,3,2,3,2,3,2,3,2,2,3,2],
				[2,2,0,0,0,0,0,0,0,0,2,2],
				[3,2,0,0,0,0,0,0,0,0,3,2],
				[2,2,0,0,0,5,0,0,0,0,2,2],
				[2,3,0,0,0,0,0,0,0,0,2,3],
				[3,2,0,0,0,0,0,0,0,0,2,2],
				[3,2,2,3,2,2,3,2,3,2,3,2],
				[2,2,3,2,2,3,2,2,2,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]]];	
		figurX = 3;
		figurY = 5;
		feld[figurZ][figurY][figurX] = 12;	
	} else if (lvl == 2) {
		feld = [[[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,7,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1]],
		
				[[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,2,3,2,3,2,3,2,2,3],
				[2,3,2,3,2,3,2,3,2,2,3,2],
				[2,2,0,0,0,0,0,0,0,0,2,2],
				[3,2,0,0,0,0,0,0,0,0,3,2],
				[2,2,0,0,0,5,0,2,0,0,2,2],
				[2,3,0,0,0,0,0,0,0,0,2,3],
				[3,2,0,0,0,0,0,0,0,0,2,2],
				[3,2,2,3,2,2,3,2,3,2,3,2],
				[2,2,3,2,2,3,2,2,2,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]]];
		figurX = 3;
		figurY = 5;
		feld[figurZ][figurY][figurX] = 12;
	} else if (lvl == 3) {
		feld = [[[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,7,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,7,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1]],
		
				[[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,2,3,2,3,2,3,2,2,3],
				[2,3,2,0,0,5,0,0,0,2,3,2],
				[2,2,0,0,0,0,0,0,0,0,2,2],
				[3,2,0,0,0,0,0,0,0,0,3,2],
				[2,2,0,0,0,0,0,0,0,0,2,2],
				[2,3,0,0,0,0,0,0,0,0,2,3],
				[3,2,0,0,0,5,0,0,0,0,2,2],
				[3,2,3,0,0,0,0,0,0,2,3,2],
				[2,2,3,2,2,3,2,2,2,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]]];
		figurX = 3;
		figurY = 5;
		feld[figurZ][figurY][figurX] = 12;
	} else if (lvl == 4) {
		feld = [[[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,7,7,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1]],
		
				[[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,2,3,2,3,2,3,2,2,3],
				[2,3,2,0,0,0,0,0,0,2,3,2],
				[2,2,0,0,0,0,0,0,0,0,2,2],
				[3,2,0,0,0,0,0,0,0,0,3,2],
				[2,2,0,0,0,5,5,0,0,0,2,2],
				[2,3,0,0,0,0,0,0,0,0,2,3],
				[3,2,0,0,0,0,0,0,0,0,2,2],
				[3,2,3,0,0,0,0,0,0,2,3,2],
				[2,2,3,2,2,3,2,2,2,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]]];
		figurX = 3;
		figurY = 5;
		feld[figurZ][figurY][figurX] = 12;	
	} else if (lvl == 5) {
		feld = [[[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,7,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1]],
		
				[[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,3,2,3,2,3,0,2,2,3],
				[2,3,3,0,2,2,0,2,0,0,3,2],
				[2,3,2,0,0,0,0,0,0,0,0,2],
				[3,0,0,0,2,3,0,3,0,0,0,2],
				[2,0,0,5,2,3,0,2,0,0,0,2],
				[2,0,0,0,2,2,0,2,0,0,0,3],
				[3,0,0,0,0,0,0,2,0,0,0,2],
				[3,3,0,0,3,2,0,2,0,0,3,2],
				[2,2,2,0,0,0,0,3,0,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]]];
		figurX = 2;
		figurY = 5;
		feld[figurZ][figurY][figurX] = 12;	
	} else if (lvl == 6) {
		feld = [[[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,7,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,7,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1]],
		
				[[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,0,0,3,2,0,0,2,2,3],
				[2,3,0,0,0,2,2,0,0,0,3,2],
				[2,0,0,0,0,2,3,0,0,0,0,2],
				[3,0,0,0,0,3,2,0,0,0,0,2],
				[2,0,0,0,5,0,0,5,0,0,0,2],
				[2,0,0,0,0,2,3,0,0,0,0,3],
				[3,0,0,0,0,3,2,0,0,0,0,2],
				[3,3,0,0,0,2,2,0,0,0,3,2],
				[2,2,2,0,0,3,2,0,0,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]]];
		figurX = 2;
		figurY = 5;
		feld[figurZ][figurY][figurX] = 12;	
	} else if (lvl == 7) {
		feld = [[[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,7,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1]],
		
				[[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,2,3,2,3,2,3,2,2,3],
				[2,3,2,0,0,0,0,0,0,2,3,2],
				[2,2,0,0,0,0,0,0,0,0,2,2],
				[3,2,0,0,0,0,0,0,0,0,3,2],
				[2,2,0,0,0,0,0,0,0,0,2,2],
				[2,3,0,0,0,0,0,0,0,0,2,3],
				[3,2,0,0,0,0,0,0,0,0,2,2],
				[3,2,3,0,0,0,0,0,0,2,3,2],
				[2,2,3,2,2,3,2,2,2,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]]];
		figurX = 3;
		figurY = 5;
		feld[figurZ][figurY][figurX] = 12;	
		
		geschwindigkeitX = 0;
		geschwindigkeitY = 0;
		blauX = 4;
		blauY = 5;
		blauZ = 1;
		blauIstInLoch = false;
		feld[blauZ][blauY][blauX] = 6;	
	} else if (lvl == 8) {
		feld = [[[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,7,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1]],
		
				[[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,2,3,0,0,0,3,2,2,3],
				[2,3,2,0,0,0,3,0,0,2,3,2],
				[2,2,2,0,0,0,0,0,0,0,2,2],
				[3,2,0,0,0,0,0,0,2,0,3,2],
				[2,2,0,0,0,0,0,0,3,0,2,2],
				[2,3,0,0,0,0,0,0,2,0,2,3],
				[3,2,2,0,0,0,0,0,0,0,2,2],
				[3,2,3,2,0,0,0,0,0,2,3,2],
				[2,2,3,2,0,0,2,2,2,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]]];
		figurX = 2;
		figurY = 5;
		feld[figurZ][figurY][figurX] = 12;
		
		geschwindigkeitX = 0;
		geschwindigkeitY = 0;
		blauX = 3;
		blauY = 5;
		blauZ = 1;
		blauIstInLoch = false;
		feld[blauZ][blauY][blauX] = 6;	
	} else if (lvl == 9) {
		feld = [[[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,7,1,1,1,1,1,1,8,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1]],
				
				[[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,2,3,2,3,2,3,2,2,3],
				[2,3,2,3,2,3,2,3,2,2,3,2],
				[2,2,0,0,0,0,0,0,0,0,2,2],
				[3,2,0,0,0,0,0,0,0,0,3,2],
				[2,2,0,0,0,0,0,0,5,0,2,2],
				[2,3,0,0,0,0,0,0,0,0,2,3],
				[3,2,0,0,0,0,0,0,0,0,2,2],
				[3,2,2,3,2,2,3,2,3,2,3,2],
				[2,2,3,2,2,3,2,2,2,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]]];
		figurX = 5;
		figurY = 5;
		feld[figurZ][figurY][figurX] = 12;
		
		geschwindigkeitX = 0;
		geschwindigkeitY = 0;
		blauX = 4;
		blauY = 5;
		blauZ = 1;
		blauIstInLoch = false;
		feld[blauZ][blauY][blauX] = 6;	
	} else if (lvl == 10) {
		feld = [[[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,7,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,8,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1]],
		
				[[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,0,2,2,0,0,0,0,2,3],
				[2,3,0,0,0,0,0,0,0,0,3,2],
				[2,0,5,0,0,0,0,3,0,0,0,2],
				[3,0,0,2,0,0,0,0,0,0,0,2],
				[2,0,0,0,0,0,0,0,0,2,0,2],
				[2,2,0,0,0,0,0,0,2,0,0,3],
				[3,0,0,0,2,0,0,0,0,0,0,2],
				[3,0,0,0,0,0,0,0,0,2,3,2],
				[2,2,3,2,0,0,0,0,0,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]]];
		figurX = 3;
		figurY = 5;
		feld[figurZ][figurY][figurX] = 12;
		
		geschwindigkeitX = 0;
		geschwindigkeitY = 0;
		blauX = 7;
		blauY = 4;
		blauZ = 1;
		blauIstInLoch = false;
		feld[blauZ][blauY][blauX] = 6;	
	} else if (lvl == 11) {
		feld = [[[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,7,1,1],
				[1,1,1,1,1,1,7,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1]],
				
				[[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,2,3,2,3,2,3,2,2,3],
				[2,0,0,0,0,3,2,3,2,2,3,2],
				[2,0,5,0,0,2,2,2,0,0,0,3],
				[3,0,0,0,0,2,3,2,0,0,0,2],
				[2,0,0,0,0,0,0,0,0,0,0,2],
				[2,0,0,0,0,3,2,2,0,0,0,3],
				[3,0,4,0,0,2,3,2,0,0,0,2],
				[3,0,0,0,0,2,3,2,3,2,2,2],
				[2,2,3,2,2,3,2,2,2,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]]];
		figurX = 2;
		figurY = 5;
		feld[figurZ][figurY][figurX] = 12;
	}
}

function bewegen(xDiff, yDiff) {
	feld[figurZ][figurY][figurX] = 0;
	figurX += xDiff;
	figurY += yDiff;
	feld[figurZ][figurY][figurX] = 12;
}

function moveUp() {
	let nextFeld = 0;
	let ueberNextFeld = 0;
	let nextUntenFeld = 1;
	let ueberNextUntenFeld = 1;
	if (figurY-1>=0) nextFeld = feld[figurZ][figurY-1][figurX];
	if (figurY-2>=0) ueberNextFeld = feld[figurZ][figurY-2][figurX];
	if (figurY-1>=0) nextUntenFeld = feld[figurZ-1][figurY-1][figurX];
	if (figurY-2>=0) ueberNextUntenFeld = feld[figurZ-1][figurY-2][figurX];
	
	if (nextFeld==0 && (nextUntenFeld==1 || nextUntenFeld==9)) { //normales bewegen
		bewegen(0,-1);
	} else
	if (nextFeld==5 && ueberNextFeld==0 && (ueberNextUntenFeld==1 || ueberNextUntenFeld==9)) { //box schieben auf freier Boden
		feld[figurZ][figurY-2][figurX] = 5;   
		bewegen(0,-1);
	} else
	if (nextFeld==5 && ueberNextUntenFeld==7) { //box schieben auf Loch
		feld[figurZ-1][figurY-2][figurX] = 10;   
		bewegen(0,-1);
	} else
	if (nextFeld==6 && ueberNextFeld==0 && (ueberNextUntenFeld==1 || ueberNextUntenFeld==9)) { //eisBox schieben auf freier Boden
		feld[figurZ][figurY-2][figurX] = 6;
		blauY -= 1;
		geschwindigkeitY = -1;
		bewegen(0,-1);
	} else
	if (nextFeld==6 && (ueberNextUntenFeld==7 || ueberNextUntenFeld==8)) { //eisBox schieben auf Loch oder eisLoch
		blauIstInLoch = true;
		feld[figurZ-1][figurY-2][figurX] = 11; 
		blauY -= 1;
		blauZ -= 1;
		bewegen(0,-1);
	} else
	if (nextFeld==4 && ueberNextFeld==0 && (ueberNextUntenFeld==1 || ueberNextUntenFeld==9)) { //boxKlein schieben auf freier Boden
		feld[figurZ][figurY-2][figurX] = 4; 
		bewegen(0,-1);
	} else
	if (nextFeld==4 && ueberNextUntenFeld==7) { //boxKlein schieben auf Loch
		feld[figurZ-1][figurY-2][figurX] = 9; 
		bewegen(0,-1);
	}
}

function moveDown() {
	let nextFeld = 0;
	let ueberNextFeld = 0;
	let nextUntenFeld = 1;
	let ueberNextUntenFeld = 1;
	if (figurY+1>=0) nextFeld = feld[figurZ][figurY+1][figurX];
	if (figurY+2>=0) ueberNextFeld = feld[figurZ][figurY+2][figurX];
	if (figurY+1>=0) nextUntenFeld = feld[figurZ-1][figurY+1][figurX];
	if (figurY+2>=0) ueberNextUntenFeld = feld[figurZ-1][figurY+2][figurX];
	
	if (nextFeld==0 && (nextUntenFeld==1 || nextUntenFeld==9)) { //normales bewegen
		bewegen(0,1);
	} else
	if (nextFeld==5 && ueberNextFeld==0 && (ueberNextUntenFeld==1 || ueberNextUntenFeld==9)) { //box schieben auf freier Boden
		feld[figurZ][figurY+2][figurX] = 5;   
		bewegen(0,1);
	} else
	if (nextFeld==5 && ueberNextUntenFeld==7) { //box schieben auf Loch
		feld[figurZ-1][figurY+2][figurX] = 10;   
		bewegen(0,1);
	} else
	if (nextFeld==6 && ueberNextFeld==0 && (ueberNextUntenFeld==1 || ueberNextUntenFeld==9)) { //eisBox schieben auf freier Boden
		feld[figurZ][figurY+2][figurX] = 6;
		blauY += 1;
		geschwindigkeitY = 1;
		bewegen(0,1);
	} else
	if (nextFeld==6 && (ueberNextUntenFeld==7 || ueberNextUntenFeld==8)) { //eisBox schieben auf Loch oder eisLoch
		blauIstInLoch = true;
		feld[figurZ-1][figurY+2][figurX] = 11; 
		blauY += 1;
		blauZ -= 1;
		bewegen(0,1);
	} else
	if (nextFeld==4 && ueberNextFeld==0 && (ueberNextUntenFeld==1 || ueberNextUntenFeld==9)) { //boxKlein schieben auf freier Boden
		feld[figurZ][figurY+2][figurX] = 4; 
		bewegen(0,1);
	} else
	if (nextFeld==4 && ueberNextUntenFeld==7) { //boxKlein schieben auf Loch
		feld[figurZ-1][figurY+2][figurX] = 9; 
		bewegen(0,1);
	}
}

function moveLeft() {
	let nextFeld = 0;
	let ueberNextFeld = 0;
	let nextUntenFeld = 1;
	let ueberNextUntenFeld = 1;
	if (figurX-1>=0) nextFeld = feld[figurZ][figurY][figurX-1];
	if (figurX-2>=0) ueberNextFeld = feld[figurZ][figurY][figurX-2];
	if (figurX-1>=0) nextUntenFeld = feld[figurZ-1][figurY][figurX-1];
	if (figurX-2>=0) ueberNextUntenFeld = feld[figurZ-1][figurY][figurX-2];
	
	if (nextFeld==0 && (nextUntenFeld==1 || nextUntenFeld==9)) { //normales bewegen
		bewegen(-1,0);
	} else
	if (nextFeld==5 && ueberNextFeld==0 && (ueberNextUntenFeld==1 || ueberNextUntenFeld==9)) { //box schieben auf freier Boden
		feld[figurZ][figurY][figurX-2] = 5;   
		bewegen(-1,0);
	} else
	if (nextFeld==5 && ueberNextUntenFeld==7) { //box schieben auf Loch
		feld[figurZ-1][figurY][figurX-2] = 10;   
		bewegen(-1,0);
	} else
	if (nextFeld==6 && ueberNextFeld==0 && (ueberNextUntenFeld==1 || ueberNextUntenFeld==9)) { //eisBox schieben auf freier Boden
		feld[figurZ][figurY][figurX-2] = 6;
		blauX -= 1;
		geschwindigkeitX = -1;
		bewegen(-1,0);
	} else
	if (nextFeld==6 && (ueberNextUntenFeld==7 || ueberNextUntenFeld==8)) { //eisBox schieben auf Loch oder eisLoch
		blauIstInLoch = true;
		feld[figurZ-1][figurY][figurX-2] = 11; 
		blauX -= 1;
		blauZ -= 1;
		bewegen(-1,0);
	} else
	if (nextFeld==4 && ueberNextFeld==0 && (ueberNextUntenFeld==1 || ueberNextUntenFeld==9)) { //boxKlein schieben auf freier Boden
		feld[figurZ][figurY][figurX-2] = 4; 
		bewegen(-1,0);
	} else
	if (nextFeld==4 && ueberNextUntenFeld==7) { //boxKlein schieben auf Loch
		feld[figurZ-1][figurY][figurX-2] = 9; 
		bewegen(-1,0);
	}
}

function moveRight() {
	let nextFeld = 0;
	let ueberNextFeld = 0;
	let nextUntenFeld = 1;
	let ueberNextUntenFeld = 1;
	if (figurX-1>=0) nextFeld = feld[figurZ][figurY][figurX+1];
	if (figurX-2>=0) ueberNextFeld = feld[figurZ][figurY][figurX+2];
	if (figurX-1>=0) nextUntenFeld = feld[figurZ-1][figurY][figurX+1];
	if (figurX-2>=0) ueberNextUntenFeld = feld[figurZ-1][figurY][figurX+2];
	
	if (nextFeld==0 && (nextUntenFeld==1 || nextUntenFeld==9)) { //normales bewegen
		bewegen(1,0);
	} else
	if (nextFeld==5 && ueberNextFeld==0 && (ueberNextUntenFeld==1 || ueberNextUntenFeld==9)) { //box schieben auf freier Boden
		feld[figurZ][figurY][figurX+2] = 5;   
		bewegen(1,0);
	} else
	if (nextFeld==5 && ueberNextUntenFeld==7) { //box schieben auf Loch
		feld[figurZ-1][figurY][figurX+2] = 10;   
		bewegen(1,0);
	} else
	if (nextFeld==6 && ueberNextFeld==0 && (ueberNextUntenFeld==1 || ueberNextUntenFeld==9)) { //eisBox schieben auf freier Boden
		feld[figurZ][figurY][figurX+2] = 6;
		blauX += 1;
		geschwindigkeitX = 1;
		bewegen(1,0);
	} else
	if (nextFeld==6 && (ueberNextUntenFeld==7 || ueberNextUntenFeld==8)) { //eisBox schieben auf Loch oder eisLoch
		blauIstInLoch = true;
		feld[figurZ-1][figurY][figurX+2] = 11; 
		blauX += 1;
		blauZ -= 1;
		bewegen(1,0);
	} else
	if (nextFeld==4 && ueberNextFeld==0 && (ueberNextUntenFeld==1 || ueberNextUntenFeld==9)) { //boxKlein schieben auf freier Boden
		feld[figurZ][figurY][figurX+2] = 4; 
		bewegen(1,0);
	} else
	if (nextFeld==4 && ueberNextUntenFeld==7) { //boxKlein schieben auf Loch
		feld[figurZ-1][figurY][figurX+2] = 9; 
		bewegen(1,0);
	}
}

function handleKeyDown(event) {
	if (!isUpKeyDown && (event.key == "ArrowUp" || event.key == "w")) {
		moveUp();
		isUpKeyDown = true;
	} else if (!isDownKeyDown && (event.key == "ArrowDown" || event.key == "s")) {
		moveDown();
		isDownKeyDown = true;
	} else if (!isLeftKeyDown && (event.key == "ArrowLeft" || event.key == "a")) {
		moveLeft();
		isLeftKeyDown = true;
	} else if (!isRightKeyDown && (event.key == "ArrowRight" || event.key == "d")) {
		moveRight();
		isRightKeyDown = true;
	} else if (!isRKeyDown &&  event.key == "r") {
		updateLvl(0);
	}
}

function handleKeyUp(event) {
	if (event.key == "ArrowUp" || event.key == "w") isUpKeyDown = false;
	else if (event.key == "ArrowDown" || event.key == "s") isDownKeyDown = false;
	else if (event.key == "ArrowLeft" || event.key == "a") isLeftKeyDown = false;
	else if (event.key == "ArrowRight" || event.key == "d") isRightKeyDown = false;
}
