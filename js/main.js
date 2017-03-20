(function (){
	var DOM_chessBoard = document.getElementById("chess-board"),
		DOM_outPut = document.getElementById("out-put"),
		knightJumps = [
			{x:"-50" , y: "-100"},
			{x:"-100" , y: "-50"},
			{x:"-100" , y: "50"},
			{x:"-50" , y: "100"},
			{x:"50" , y: "100"},
			{x:"100" , y: "50"},
			{x:"100" , y: "-50"},
			{x:"50" , y: "-100"}
		];
	
	function createBoard(){
		let maxSquares = 64;
		let posY=0;
		let posX=0;
		var boxInitColor="black";
		let idLetter = ["a","b","c","d","e","f","g","h"];
		let idLetterCounter = 0;
		let idNumber=8;
		let id;
		
		for (let i=0 ;i< maxSquares; i++){
			if( i%8 === 0 && i > 1){
				let currentColor = boxInitColor === "black" ? "white" : "black";// keep the same color
				posY+=50;
				posX=0;
				boxInitColor = currentColor;
				idNumber--;
				idLetterCounter = 0;
			}
			id=idLetter[idLetterCounter]+idNumber;
			var newSquare = createSquare(posX,posY,id,boxInitColor);
			DOM_chessBoard.appendChild(newSquare);
			boxInitColor = boxInitColor === "black" ? "white" : "black";// switch colors
			posX+=50;
			idLetterCounter++;
		}
	}
	
	function createSquare(posX,posY,id,boxColor){
		var el = document.createElement("div"); 
		el.classList.add("square", boxColor);
		el.id=id;
		el.style.left = posX + 'px'; 
		el.style.top = posY + 'px';
		el.innerHTML = id;
		el.setAttribute("posx", posX);
		el.setAttribute("posy", posY);
		return el;
	}
	
	function removeReds(){
		for (let square of DOM_chessBoard.childNodes){
			if(!square.classList.contains("square-green")){
				square.classList.remove("square-red");
			}
		}
	}

	function myPosibilities(moves,myCuadro){
		let bestMoves = [];
		for(let i=0;i<DOM_chessBoard.childNodes.length;i++){
			for (let j =0 ;j< moves.length; j++){
				if(DOM_chessBoard.childNodes[i].offsetLeft===myCuadro.offsetLeft + parseInt(moves[j].x)) {
					if(DOM_chessBoard.childNodes[i].offsetTop===myCuadro.offsetTop + parseInt(moves[j].y)){
						if(!DOM_chessBoard.childNodes[i].classList.contains("square-green")){
							bestMoves.push(DOM_chessBoard.childNodes[i].id);
						}
					}
				}
			}
		}
		return bestMoves;
	}
	
	function findReds(){
		return DOM_chessBoard.getElementsByClassName("square-red")
	}
	
	function attachToolTip(e){
		let myPosition=e;
		let moves = checkNext(myPosition.offsetTop,myPosition.offsetLeft);
		var posibilities = myPosibilities(moves,myPosition);
	
		return posibilities.length;
	}
	
	function compareSecondColumn(a, b) {
		if (a[1] === b[1]) {
			return 0;
		}
		else {
			return (a[1] < b[1]) ? -1 : 1;
		}
	}
	
	function loopGame(myId,counter){
		counter--;
		let myCuadro = document.getElementById(myId);
		if(!myCuadro.classList.contains("square-green")){
			removeReds();
			myCuadro.className="square square-green";
		
			let moves = checkNext(myCuadro.offsetTop,myCuadro.offsetLeft);
			showReds(moves,myCuadro);
			
			let misReds = findReds();
			let arrayMoves = [];
			for(let i=0;i<misReds.length;i++){
				let valueToPush = [];
				valueToPush[0] = misReds[i].id;
				valueToPush[1] = attachToolTip(misReds[i]);
				arrayMoves.push(valueToPush);
			}
			let myMovesSorted=arrayMoves.sort(compareSecondColumn);
			DOM_outPut.innerHTML += ", "+myMovesSorted[0][0];
			if(counter>0){
				setInterval(function(){
					loopGame(myMovesSorted[0][0],counter);
				},200);
			}else{
				DOM_outPut.innerHTML += "<h4>Caballo bien BERRACO!.</h4>";
			}
		}
	}
	
	function goGame(e){
		DOM_chessBoard.removeEventListener("click",goGame, false);
		let myCuadro=e.target;
		DOM_outPut.innerHTML = myCuadro.id+", ";
		let squareCounter=62;
		if(!myCuadro.classList.contains("square-green")){
			removeReds();
			myCuadro.className="square square-green";
		
			let moves = checkNext(myCuadro.offsetTop,myCuadro.offsetLeft);
			showReds(moves,myCuadro);
			
			let misReds = findReds();
			let arrayMoves = [];
			let newArrayMoves = [];
			/*
			[].forEach.call(misReds, function(red) {
				newArrayMoves.push({ id: red.id, something: attachToolTip(red)});
			});
			*/
			for (el of misReds){
				newArrayMoves.push({ id: el.id, chances: attachToolTip(el)});
			}
			
			for(let i=0;i<misReds.length;i++){
				let valueToPush = [];
				valueToPush[0] = misReds[i].id;
				valueToPush[1] = attachToolTip(misReds[i]);
				arrayMoves.push(valueToPush);
			}
			console.log(arrayMoves);
			console.log(newArrayMoves);
			let myMovesSorted=arrayMoves.sort(compareSecondColumn);
			DOM_outPut.innerHTML += myMovesSorted[0][0];
			loopGame(myMovesSorted[0][0], squareCounter);
			
		}else{
			console.log('been there, done that');
		}

	}
	
	function showReds(moves,myCuadro){
		let bestMoves = [];
		for(let i=0;i<DOM_chessBoard.childNodes.length;i++){
			for (let j =0 ;j< moves.length; j++){
				if(DOM_chessBoard.childNodes[i].offsetLeft===myCuadro.offsetLeft + parseInt(moves[j].x)) {
					if(DOM_chessBoard.childNodes[i].offsetTop===myCuadro.offsetTop + parseInt(moves[j].y)){
						if(!DOM_chessBoard.childNodes[i].classList.contains("square-green")){
							DOM_chessBoard.childNodes[i].classList.add("square-red");
							bestMoves.push(DOM_chessBoard.childNodes[i].id);
						}
						
					}
				}
			}
		}
		return bestMoves;
	}
	
	function checkNext(myTop,myLeft){
		let moves = knightJumps.filter(function(value){
			if(myLeft + parseInt(value.x, 10) >= 0 && myTop + parseInt(value.y, 10) >= 0){
				if (myLeft + parseInt(value.x, 10) < 400 && myTop + parseInt(value.y, 10) < 400){
					return value;
				}
			}
		});
		return moves;
	}
	
	createBoard();
	DOM_chessBoard.addEventListener("click",goGame, false);
	

	
}());