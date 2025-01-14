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
let 	feld = [[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,2,3,2,3,2,3,2,2,3],
				[2,3,2,3,2,3,2,3,2,2,3,2],
				[2,2,1,1,1,1,1,1,1,1,2,2],
				[3,2,1,1,1,1,1,1,1,1,3,2],
				[2,2,1,1,1,5,1,1,7,1,2,2],
				[2,3,1,1,1,1,1,1,1,1,2,3],
				[3,2,1,1,1,1,1,1,1,1,2,2],
				[3,2,2,3,2,2,3,2,3,2,3,2],
				[2,2,3,2,2,3,2,2,2,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]];

/* Spielfigur initialisieren */
let figurX = 2;
let figurY = 5;
feld[figurY][figurX] = 12;			
			
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
let blauX = -7;
let blauY = 4;
let blauIstInLoch = true;
feld[blauY][blauX] = 6;	

//Key Variablen
let isLeftKeyDown = false;
let isRightKeyDown = false;
let isUpKeyDown = false;
let isDownKeyDown = false;

//Lvl Variablen
let lvl = 1;

/* Canvas-Zeichenfläche deklarieren */
let offsetX = 810;
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
	for (let i=0;i<feld.length;i++)
	for (let j=0;j<feld[i].length;j++) 
	{
		/* Isometrische Canvas-Koordinaten berechnen:
			x,y werden auf die Diagonalen x-y und x+y
			mit dem Seitenverhältnis 2:1 transformiert
		*/
		let x = j*kachel.width/2;
		let y = i*(kachel.height-15);
		let isoX = x-y;
		let isoY = (x+y)/2;
		isoX += offsetX;
		isoY += offsetY;
		if (feld[i][j] == 1) /* freie Kachel zeichnen */
		{
			context.drawImage(kachel,isoX,isoY+14,kachel.width,kachel.height);
		} else
		if (feld[i][j] == 2) /* steinKlein zeichnen */
		{
			context.drawImage(kachel,isoX,isoY+14,kachel.width,kachel.height); //kachel unter steinKlein zeichnen
			isoY -= steinKlein.height-kachel.height;
			context.drawImage(steinKlein,isoX,isoY,steinKlein.width,steinKlein.height);
		} else
		if (feld[i][j] == 3) /* stein zeichnen */
		{
			context.drawImage(kachel,isoX,isoY+14,kachel.width,kachel.height); //kachel unter stein zeichnen
			isoY -= stein.height-kachel.height;
			context.drawImage(stein,isoX,isoY,stein.width,stein.height);
		} else
		if (feld[i][j] == 4) /* boxKlein zeichnen */
		{
			context.drawImage(kachel,isoX,isoY+14,kachel.width,kachel.height); //kachel unter boxKlein zeichnen
			isoY -= boxKlein.height-kachel.height;
			context.drawImage(boxKlein,isoX,isoY,boxKlein.width,boxKlein.height);
		} else
		if (feld[i][j] == 5) /* box zeichnen */
		{
			context.drawImage(kachel,isoX,isoY+14,kachel.width,kachel.height); //kachel unter box zeichnen
			isoY -= box.height-kachel.height;
			context.drawImage(box,isoX,isoY,box.width,box.height);
		} else
		if (feld[i][j] == 6) /* eisBox zeichnen */
		{
			context.drawImage(kachel,isoX,isoY+14,kachel.width,kachel.height); //kachel unter eisBox zeichnen
			isoY -= eisBox.height-kachel.height;
			context.drawImage(eisBox,isoX,isoY,eisBox.width,eisBox.height);
		} else
		if (feld[i][j] == 7) /* loch zeichnen */
		{
			isoY -= loch.height-kachel.height;
			context.drawImage(loch,isoX,isoY+14,loch.width,loch.height);
			existiertLoch = true;
		} else
		if (feld[i][j] == 8) /* eisLoch zeichnen */
		{
			isoY -= eisLoch.height-kachel.height;
			context.drawImage(eisLoch,isoX,isoY+14,eisLoch.width,eisLoch.height);
			existiertLoch = true;
		} else
		if (feld[i][j] == 9) /* lochGefuelltKlein zeichnen */
		{
			isoY -= lochGefuelltKlein.height-kachel.height;
			context.drawImage(lochGefuelltKlein,isoX,isoY+14,lochGefuelltKlein.width,lochGefuelltKlein.height);
		} else
		if (feld[i][j] == 10) /* lochGefuellt zeichnen */
		{
			isoY -= lochGefuellt.height-kachel.height;
			context.drawImage(lochGefuellt,isoX,isoY+14,lochGefuellt.width,lochGefuellt.height);
		} else
		if (feld[i][j] == 11) /* lochGefuelltEis zeichnen */
		{
			isoY -= lochGefuelltEis.height-kachel.height;
			context.drawImage(lochGefuelltEis,isoX,isoY+14,lochGefuelltEis.width,lochGefuelltEis.height);
		} else
		if (feld[i][j] == 12) /* figur zeichnen */
		{
			context.drawImage(kachel,isoX,isoY+14,kachel.width,kachel.height); //kachel unter figur zeichnen
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
		feld[blauY][blauX] = 1;
		if (geschwindigkeitX > 0 && (feld[blauY][blauX+1] == 1 ||  feld[blauY][blauX+1] == 9) || geschwindigkeitX < 0 && (feld[blauY][blauX-1] == 1 || feld[blauY][blauX-1] == 9)) blauX += geschwindigkeitX;
		else geschwindigkeitX = 0;
		if (blauY+1 < feld.length && geschwindigkeitY > 0 && (feld[blauY+1][blauX] == 1 || feld[blauY+1][blauX] == 9) || blauY-1 >= 0 && geschwindigkeitY < 0 && (feld[blauY-1][blauX] == 1 || feld[blauY-1][blauX] == 9)) blauY += geschwindigkeitY;
		else geschwindigkeitY = 0;
		feld[blauY][blauX] = 6
		frame = 0;
	}
}

function updateLvl(lvlPlus) {
	lvl += lvlPlus;
	if (lvl == 1) {
		feld = [[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,2,3,2,3,2,3,2,2,3],
				[2,3,2,3,2,3,2,3,2,2,3,2],
				[2,2,1,1,1,1,1,1,1,1,2,2],
				[3,2,1,1,1,1,1,1,1,1,3,2],
				[2,2,1,1,1,5,1,1,7,1,2,2],
				[2,3,1,1,1,1,1,1,1,1,2,3],
				[3,2,1,1,1,1,1,1,1,1,2,2],
				[3,2,2,3,2,2,3,2,3,2,3,2],
				[2,2,3,2,2,3,2,2,2,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]];
				
		figurX = 3;
		figurY = 5;
		feld[figurY][figurX] = 12;	
	} else if (lvl == 2) {
		feld = [[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,2,3,2,3,2,3,2,2,3],
				[2,3,2,3,2,3,2,3,2,2,3,2],
				[2,2,1,1,1,1,1,1,1,1,2,2],
				[3,2,1,1,1,1,1,1,1,1,3,2],
				[2,2,1,1,1,5,1,2,7,1,2,2],
				[2,3,1,1,1,1,1,1,1,1,2,3],
				[3,2,1,1,1,1,1,1,1,1,2,2],
				[3,2,2,3,2,2,3,2,3,2,3,2],
				[2,2,3,2,2,3,2,2,2,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]];
		figurX = 3;
		figurY = 5;
		feld[figurY][figurX] = 12;
	} else if (lvl == 3) {
		feld = [[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,2,3,2,3,2,3,2,2,3],
				[2,3,2,1,1,5,1,1,7,2,3,2],
				[2,2,1,1,1,1,1,1,1,1,2,2],
				[3,2,1,1,1,1,1,1,1,1,3,2],
				[2,2,1,1,1,1,1,1,1,1,2,2],
				[2,3,1,1,1,1,1,7,1,1,2,3],
				[3,2,1,1,1,5,1,1,1,1,2,2],
				[3,2,3,1,1,1,1,1,1,2,3,2],
				[2,2,3,2,2,3,2,2,2,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]];
		figurX = 3;
		figurY = 5;
		feld[figurY][figurX] = 12;
	} else if (lvl == 4) {
		feld = [[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,2,3,2,3,2,3,2,2,3],
				[2,3,2,1,1,1,1,1,1,2,3,2],
				[2,2,1,1,1,1,1,1,1,1,2,2],
				[3,2,1,1,1,1,1,1,1,1,3,2],
				[2,2,1,1,1,5,5,1,7,7,2,2],
				[2,3,1,1,1,1,1,1,1,1,2,3],
				[3,2,1,1,1,1,1,1,1,1,2,2],
				[3,2,3,1,1,1,1,1,1,2,3,2],
				[2,2,3,2,2,3,2,2,2,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]];
		figurX = 3;
		figurY = 5;
		feld[figurY][figurX] = 12;	
	} else if (lvl == 5) {
		feld = [[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,3,2,3,2,3,1,2,2,3],
				[2,3,3,1,2,2,1,2,1,1,3,2],
				[2,3,2,1,1,1,1,1,1,1,1,2],
				[3,1,1,1,2,3,1,3,1,1,1,2],
				[2,1,1,5,2,3,1,2,1,1,1,2],
				[2,1,1,1,2,2,1,2,1,1,1,3],
				[3,1,1,1,1,1,1,2,1,1,1,2],
				[3,3,1,1,3,2,1,2,7,1,3,2],
				[2,2,2,1,1,1,1,3,1,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]];
		figurX = 2;
		figurY = 5;
		feld[figurY][figurX] = 12;	
	} else if (lvl == 6) {
		feld = [[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,1,1,3,2,1,1,2,2,3],
				[2,3,1,1,1,2,2,1,1,7,3,2],
				[2,1,1,1,1,2,3,1,1,1,1,2],
				[3,1,1,1,1,3,2,1,1,1,1,2],
				[2,1,1,1,5,1,1,5,1,1,1,2],
				[2,1,1,1,1,2,3,1,1,1,1,3],
				[3,1,1,1,1,3,2,1,1,1,1,2],
				[3,3,7,1,1,2,2,1,1,1,3,2],
				[2,2,2,1,1,3,2,1,1,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]];
		figurX = 2;
		figurY = 5;
		feld[figurY][figurX] = 12;	
	} else if (lvl == 7) {
		feld = [[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,2,3,2,3,2,3,2,2,3],
				[2,3,2,1,1,1,1,1,1,2,3,2],
				[2,2,1,1,1,1,1,1,1,1,2,2],
				[3,2,1,1,1,1,1,1,1,1,3,2],
				[2,2,1,1,1,1,1,1,7,1,2,2],
				[2,3,1,1,1,1,1,1,1,1,2,3],
				[3,2,1,1,1,1,1,1,1,1,2,2],
				[3,2,3,1,1,1,1,1,1,2,3,2],
				[2,2,3,2,2,3,2,2,2,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]];
		figurX = 3;
		figurY = 5;
		feld[figurY][figurX] = 12;	
		
		geschwindigkeitX = 0;
		geschwindigkeitY = 0;
		blauX = 4;
		blauY = 5;
		blauIstInLoch = false;
		feld[blauY][blauX] = 6;	
	} else if (lvl == 8) {
		feld = [[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,2,3,1,1,1,3,2,2,3],
				[2,3,2,1,1,1,3,1,1,2,3,2],
				[2,2,2,1,1,1,1,1,1,1,2,2],
				[3,2,1,1,1,1,1,1,2,1,3,2],
				[2,2,1,1,1,1,1,1,3,1,2,2],
				[2,3,1,1,1,1,1,1,2,1,2,3],
				[3,2,2,1,1,7,1,1,1,1,2,2],
				[3,2,3,2,1,1,1,1,1,2,3,2],
				[2,2,3,2,1,1,2,2,2,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]];
		figurX = 2;
		figurY = 5;
		feld[figurY][figurX] = 12;
		
		geschwindigkeitX = 0;
		geschwindigkeitY = 0;
		blauX = 3;
		blauY = 5;
		blauIstInLoch = false;
		feld[blauY][blauX] = 6;	
	} else if (lvl == 9) {
		feld = [[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,2,3,2,3,2,3,2,2,3],
				[2,3,2,3,2,3,2,3,2,2,3,2],
				[2,2,1,1,1,1,1,1,1,1,2,2],
				[3,2,1,1,1,1,1,1,1,1,3,2],
				[2,2,7,1,1,1,1,1,5,8,2,2],
				[2,3,1,1,1,1,1,1,1,1,2,3],
				[3,2,1,1,1,1,1,1,1,1,2,2],
				[3,2,2,3,2,2,3,2,3,2,3,2],
				[2,2,3,2,2,3,2,2,2,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]];
		figurX = 5;
		figurY = 5;
		feld[figurY][figurX] = 12;
		
		geschwindigkeitX = 0;
		geschwindigkeitY = 0;
		blauX = 4;
		blauY = 5;
		blauIstInLoch = false;
		feld[blauY][blauX] = 6;	
	} else if (lvl == 10) {
		feld = [[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,1,2,2,1,1,1,1,2,3],
				[2,3,1,1,1,1,1,1,1,1,3,2],
				[2,7,5,1,1,1,1,3,1,1,1,2],
				[3,1,1,2,1,1,1,1,1,1,1,2],
				[2,1,1,1,1,1,8,1,1,2,1,2],
				[2,2,1,1,1,1,1,1,2,1,1,3],
				[3,1,1,1,2,1,1,1,1,1,1,2],
				[3,1,1,1,1,1,1,1,1,2,3,2],
				[2,2,3,2,1,1,1,1,1,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]];
		figurX = 3;
		figurY = 5;
		feld[figurY][figurX] = 12;
		
		geschwindigkeitX = 0;
		geschwindigkeitY = 0;
		blauX = 7;
		blauY = 4;
		blauIstInLoch = false;
		feld[blauY][blauX] = 6;	
	} else if (lvl == 11) {
		feld = [[3,2,3,2,2,2,2,3,2,2,2,3],
				[2,3,2,2,3,2,3,2,3,2,2,3],
				[2,1,1,1,1,3,2,3,2,2,3,2],
				[2,1,5,1,1,2,2,2,1,1,1,3],
				[3,1,1,1,1,2,3,2,1,7,1,2],
				[2,1,1,1,1,1,7,1,1,1,1,2],
				[2,1,1,1,1,3,2,2,1,1,1,3],
				[3,1,4,1,1,2,3,2,1,1,1,2],
				[3,1,1,1,1,2,3,2,3,2,2,2],
				[2,2,3,2,2,3,2,2,2,3,2,3],
				[3,3,2,3,2,2,2,3,3,2,2,3]];
		figurX = 2;
		figurY = 5;
		feld[figurY][figurX] = 12;
	}
}

function bewegen(xDiff, yDiff) {
	feld[figurY][figurX] = 1;
	figurX += xDiff;
	figurY += yDiff;
	feld[figurY][figurX] = 12;
}

function moveUp() {
	let nextFeld = 1;
	let ueberNextFeld = 1;
	if (figurY-1>=0) nextFeld = feld[figurY-1][figurX];
	if (figurY-2>=0) ueberNextFeld = feld[figurY-2][figurX];
	if (nextFeld==1 || nextFeld == 9) { //normales bewegen auf freie kachel oder lochGefuelltKlein
		bewegen(0,-1);
	} else
	if (nextFeld==5 && (ueberNextFeld==1 || ueberNextFeld==9)) { //box schieben auf freie kachel oder lochGefuelltKlein
		feld[figurY-2][figurX] = 5;   
		bewegen(0,-1);
	} else
	if (nextFeld==5 && ueberNextFeld==7) { //box schieben auf Loch
		feld[figurY-2][figurX] = 10;   
		bewegen(0,-1);
	} else
	if (nextFeld==6 && ueberNextFeld==1) { //eisBox schieben auf freie kachel
		feld[figurY-2][figurX] = 6;
		blauY -= 1;
		bewegen(0,-1);
		geschwindigkeitY = -1;
	} else
	if (nextFeld==6 && (ueberNextFeld==7 || ueberNextFeld==8)) { //eisBox schieben auf Loch oder eisLoch
		blauIstInLoch = true;
		feld[figurY-2][figurX] = 11; 
		blauY -= 1;
		bewegen(0,-1);
	} else
	if (nextFeld==4 && ueberNextFeld==1) { //boxKlein schieben auf freie Kachel
		feld[figurY-2][figurX] = 4; 
		bewegen(0,-1);
	} else
	if (nextFeld==4 && ueberNextFeld==7) { //boxKlein schieben auf Loch
		feld[figurY-2][figurX] = 9; 
		bewegen(0,-1);
	}
}

function moveDown() {
	let nextFeld = 1;
	let ueberNextFeld = 1;
	if (figurY+1<feld.length) nextFeld = feld[figurY+1][figurX];
	if (figurY+2<feld.length) ueberNextFeld = feld[figurY+2][figurX];
	if (nextFeld==1 || nextFeld == 9) { //normales bewegen auf freie kachel oder lochGefuelltKlein
		bewegen(0,1);
	} else
	if (nextFeld==5 && (ueberNextFeld==1 || ueberNextFeld==9)) { //box schieben auf freie kachel oder lochGefuelltKlein
		feld[figurY+2][figurX] = 5;   
		bewegen(0,1);
	} else
	if (nextFeld==5 && ueberNextFeld==7) { //box schieben auf loch
		feld[figurY+2][figurX] = 10;   
		bewegen(0,1);
	} else
	if (nextFeld==6 && ueberNextFeld==1) { //eisBox schieben auf freie Kachel
		feld[figurY+2][figurX] = 6;  
		blauY += 1;
		bewegen(0,1);
		geschwindigkeitY = 1;
	} else
	if (nextFeld==6 && (ueberNextFeld==7 || ueberNextFeld==8)) { //eisBox schieben auf Loch oder eisLoch
		blauIstInLoch = true;
		feld[figurY+2][figurX] = 11;
		bewegen(0,1);
	} else
	if (nextFeld==4 && ueberNextFeld==1) { //boxKlein schieben auf freie Kachel
		feld[figurY+2][figurX] = 4;   
		bewegen(0,1);
	} else
	if (nextFeld==4 && ueberNextFeld==7) { //boxKlein schieben auf Loch
		feld[figurY+2][figurX] = 9; 
		bewegen(0,1);
	}
}
function moveLeft() {
	let nextFeld = 1;
	let ueberNextFeld = 1;
	if (figurX+1>=0) nextFeld = feld[figurY][figurX-1];
	if (figurX+2>=0) ueberNextFeld = feld[figurY][figurX-2];
	if (nextFeld==1 || nextFeld == 9) { //normales bewegen auf freie kachel oder lochGefuelltKlein
		bewegen(-1,0);
	} else
	if (nextFeld==5 && (ueberNextFeld==1 || ueberNextFeld==9)) { //box schieben auf freie kachel oder lochGefuelltKlein
		feld[figurY][figurX-2] = 5;   
		bewegen(-1,0);
	} else
	if (nextFeld==5 && ueberNextFeld==7) { //box schieben auf loch
		feld[figurY][figurX-2] = 10;   
		bewegen(-1,0);
	} else
	if (nextFeld==6 && ueberNextFeld==1) { //eisBox schieben auf freie Kachel
		feld[figurY][figurX-2] = 6;   
		blauX -= 1;
		bewegen(-1,0);
		geschwindigkeitX = -1;
	} else
	if (nextFeld==6 && (ueberNextFeld==7 || ueberNextFeld==8)) { //eisBox schieben auf Loch oder eisLoch
		blauIstInLoch = true;
		feld[figurY][figurX-2] = 11;
		bewegen(-1,0);
	} else
	if (nextFeld==4 && ueberNextFeld==1) { //boxKlein schieben auf freie Kachel
		feld[figurY][figurX-2] = 4;   
		bewegen(-1,0);
	} else
	if (nextFeld==4 && ueberNextFeld==7) { //boxKlein schieben auf Loch
		feld[figurY][figurX-2] = 9; 
		bewegen(-1,0);
	}
}
function moveRight() {
	let nextFeld = 1;
	let ueberNextFeld = 1;
	if (figurX+1<=feld.length) nextFeld = feld[figurY][figurX+1];
	if (figurX+2<=feld.length) ueberNextFeld = feld[figurY][figurX+2];
	if (nextFeld==1 || nextFeld == 9) { //normales bewegen auf freie kachel oder lochGefuelltKlein
		bewegen(1,0);
	} else
	if (nextFeld==5 && (ueberNextFeld==1 || ueberNextFeld==9)) { //box schieben auf freie kachel oder lochGefuelltKlein
		feld[figurY][figurX+2] = 5;   
		bewegen(1,0);
	} else
	if (nextFeld==5 && ueberNextFeld==7) { //box schieben auf loch
		feld[figurY][figurX+2] = 10;   
		bewegen(1,0);
	} else
	if (nextFeld==6 && ueberNextFeld==1) { //eisBox schieben auf freie Kachel
		feld[figurY][figurX+2] = 6;   
		blauX += 1
		bewegen(1,0);
		geschwindigkeitX = 1;
	} else
	if (nextFeld==6 && (ueberNextFeld==7 || ueberNextFeld==8)) { //eisBox schieben auf Loch oder eisLoch
		blauIstInLoch = true;
		feld[figurY][figurX+2] = 11;
		bewegen(1,0);
	} else
	if (nextFeld==4 && ueberNextFeld==1) { //boxKlein schieben auf freie Kachel
		feld[figurY][figurX+2] = 4;   
		bewegen(1,0);
	} else
	if (nextFeld==4 && ueberNextFeld==7) { //boxKlein schieben auf Loch
		feld[figurY][figurX+2] = 9; 
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
	}
}

function handleKeyUp(event) {
	if (event.key == "ArrowUp" || event.key == "w") isUpKeyDown = false;
	else if (event.key == "ArrowDown" || event.key == "s") isDownKeyDown = false;
	else if (event.key == "ArrowLeft" || event.key == "a") isLeftKeyDown = false;
	else if (event.key == "ArrowRight" || event.key == "d") isRightKeyDown = false;
}
