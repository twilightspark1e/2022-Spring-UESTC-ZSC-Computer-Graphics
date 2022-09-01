var canvas;	
var gl;
var angleY = 0.0;		
var angleX = 45.0;		
var angleStep = 3.0;	

var mvpStack = []; 
var matProj;	  
var matMVP;			


var a_Position;  
var u_MVPMatrix;
var u_Color;		

var bufferChessboard;
var numVerticesChessboard = 6; 

var bufferChessline;
var numVerticesChessline; 


var bufferSphere;	 
var numVerticesSphere; 

var chess = new Array(15);
var turn = 1;	
var winFlag = 0;

var FBOforSelect;	


window.onload = function main(){
    canvas = document.getElementById("webgl");
	if(!canvas){ 
		alert("获取canvas元素失败！"); 
		return;
	}
	// 利用辅助程序文件中的功能获取WebGL上下文
	// 成功则后面可通过gl来调用WebGL的函数
    gl = WebGLUtils.setupWebGL(canvas);    
    if (!gl){ 
		alert("获取WebGL上下文失败！"); 
		return;
	}        

    /*设置WebGL相关属性*/
    gl.clearColor(0.5, 0.5, 0.5, 1.0); // 设置背景色为灰色
	gl.enable(gl.DEPTH_TEST);	// 开启深度检测
	gl.enable(gl.CULL_FACE);	// 开启面剔除，默认剔除背面
	// 设置视口，占满整个canvas
	gl.viewport(0, 0, canvas.width, canvas.height);
	// 设置投影矩阵：透视投影，根据视口宽高比指定视域体
	matProj = perspective(35.0, 		// 垂直方向视角
		canvas.width / canvas.height, 	// 视域体宽高比
		1.0, 							// 相机到近裁剪面距离
		100.0);							// 相机到远裁剪面距离
	
	/*加载shader程序并为shader中attribute变量提供数据*/
	// 加载id分别为"vertex-shader"和"fragment-shader"的shader程序，
	// 并进行编译和链接，返回shader程序对象program
    var program = initShaders(gl, "vertex-shader", 
		"fragment-shader");
    gl.useProgram(program);	// 启用该shader程序对象
	
	// 获取名称为"a_Position"的shader attribute变量的位置
    a_Position = gl.getAttribLocation(program, "a_Position");
	if(a_Position < 0){
		alert("获取attribute变量a_Position失败！"); 
		return;
	}	
	gl.enableVertexAttribArray(a_Position);

	u_MVPMatrix = gl.getUniformLocation(program, "u_MVPMatrix");
	if(!u_MVPMatrix){
		alert("获取uniform变量u_MVPMatrix失败！")
		return;
	}

	u_Color = gl.getUniformLocation(program, "u_Color");
	if(!u_Color){
		alert("获取uniform变量u_Color失败！")
		return;
	}

	for(var i = 0; i < 15; i++){
		chess[i] = new Array(15);
		for(var j = 0; j < 15; j++)
			chess[i][j] = 0;
	}
	
	initChessboard();
	initChessline();
	initSphere();
	
	initFrameBufferForSelect();

	canvas.onmousedown = function() {
		if(event.button == 0 && !winFlag){
			var x = event.clientX, y = event.clientY;
			var rect = event.target.getBoundingClientRect();
			var x_in_canvas = x - rect.left;
			var y_in_canvas = rect.bottom - y;
			var id = getSelectedObj(x_in_canvas, y_in_canvas);
			if(id >= 0){
				var i = Math.floor(id / 15);
				var j = id % 15;
				if (chess[i][j] == 0) {
					chess[i][j] = turn;
					if (checkWin(turn)) {
						winFlag = turn;
						setTimeout(function(){
							if (winFlag > 0)
								alert("White Win!");
							else
								alert("Black Win!");
						}, 10);
					}
					turn = -turn;
					requestAnimFrame(render);
				}
			}
		}
		
		// 鼠标右键重新开始
		if (event.button == 2) {
			winFlag = 0;	// 重置胜负标志
			// 重置落子状态
			for (var i = 0; i < 15; i++)
				for (var j = 0; j < 15; j++)
					chess[i][j] = 0;
			requestAnimFrame(render); // 请求重绘
		}
	}
  
	// 屏蔽默认右键菜单
	canvas.oncontextmenu = function() {
		event.preventDefault();
	};

	// 进行绘制
    render();
};

function checkWin(turn){
	var flag;
	var n;	
	
	for (var i = 0; i < 15; i++)
		for (var j = 0; j < 15; j++) {
			if (chess[i][j] == turn) {	
				if (j < 11) {	
					flag = true;
					for (n = 1; n < 5; n++)	
						if (chess[i][j + n] != turn) {
							flag = false;
							break;
						}
					if (flag)
						return turn;	
				}

				if (i < 11) {
					flag = true;
					for (n = 1; n < 5; n++)
						if (chess[i + n][j] != turn) {
							flag = false;
							break;
						}
					if (flag)
						return turn;
				}

				if (i < 11 && j > 3) {
					flag = true;
					for (n = 1; n < 5; n++)
						if (chess[i + n][j - n] != turn) {
							flag = false;
							break;
						}
					if (flag)
						return turn;
				}

				if (i < 11 && j < 11) {
					flag = true;
					for (n = 1; n < 5; n++)
						if (chess[i + n][j + n] != turn) {
							flag = false;
							break;
						}
					if (flag)
						return turn;
				}
			}
		}
	return false;
}

function initFrameBufferForSelect() {
	FBOforSelect = gl.createFramebuffer();
	var colorBuffer = gl.createRenderbuffer();
	var depthBuffer = gl.createRenderbuffer();

	gl.bindRenderbuffer(gl.RENDERBUFFER, colorBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER,gl.RGBA4, canvas.width, canvas.height);

	gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16, canvas.width,canvas.height);	

	gl.bindFramebuffer(gl.FRAMEBUFFER, FBOforSelect);

	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
		gl.RENDERBUFFER, colorBuffer);

	gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
		gl.RENDERBUFFER, depthBuffer);

	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function buildSphere(radius, columns, rows){
	var vertices = []; 

	for (var r = 0; r <= rows; r++){
		var v = r / rows; 
		var theta1 = v * Math.PI;

		var temp = vec3(0, 0, 1);
		var n = vec3(temp); 
		var cosTheta1 = Math.cos(theta1);
		var sinTheta1 = Math.sin(theta1);
		n[0] = temp[0] * cosTheta1 + temp[2] * sinTheta1;
		n[2] = -temp[0] * sinTheta1 + temp[2] * cosTheta1;
		
		for (var c = 0; c <= columns; c++){
			var u = c / columns; 
			var theta2 = u * Math.PI * 2;
			var pos = vec3(n);
			temp = vec3(n);
			var cosTheta2 = Math.cos(theta2);
			var sinTheta2 = Math.sin(theta2);
			
			pos[0] = temp[0] * cosTheta2 - temp[1] * sinTheta2;
			pos[1] = temp[0] * sinTheta2 + temp[1] * cosTheta2;
			
			var posFull = mult(pos, radius);
			
			vertices.push(posFull);
		}
	}

	var spherePoints = []; 

	var colLength = columns + 1;
	for (var r = 0; r < rows; r++){
		var offset = r * colLength;

		for (var c = 0; c < columns; c++){
			var ul = offset  +  c;						
			var ur = offset  +  c + 1;					
			var br = offset  +  (c + 1 + colLength);
			var bl = offset  +  (c + 0 + colLength);

			spherePoints.push(vertices[ul]);
			spherePoints.push(vertices[bl]);
			spherePoints.push(vertices[br]);
			spherePoints.push(vertices[ul]);
			spherePoints.push(vertices[br]);
			spherePoints.push(vertices[ur]);
		}
	}

	vertices.length = 0;
	numVerticesSphere = rows * columns * 6;
	
	return spherePoints; 
}

function initSphere(){
	var ptSphere = buildSphere(0.4, 10, 10);

	bufferSphere = gl.createBuffer(); 

	gl.bindBuffer(gl.ARRAY_BUFFER, bufferSphere);
	gl.bufferData(gl.ARRAY_BUFFER,flatten(ptSphere),gl.STATIC_DRAW);
	ptSphere.length = 0;
}

function initChessline(){
	var ptChessline = [];
	numVerticesChessline = 0;
	for (var i = -7; i <= 7; i++) {
		ptChessline.push(vec3(i, 0.0, 7.0));
		ptChessline.push(vec3(i, 0.0, -7.0));

		ptChessline.push(vec3(-7.0, 0.0, i));
		ptChessline.push(vec3(7.0, 0.0, i));
		numVerticesChessline += 4; 
	}

	bufferChessline = gl.createBuffer(); 

	gl.bindBuffer(gl.ARRAY_BUFFER, bufferChessline);

	gl.bufferData(gl.ARRAY_BUFFER,flatten(ptChessline),gl.STATIC_DRAW);
	ptChessline.length = 0;  
}
	

function initChessboard(){
	var ptChessboard = [
		vec3(-8.0, 0.0, -8.0),
		vec3(-8.0, 0.0,  8.0),
		vec3(8.0, 0.0,  8.0),
		vec3(-8.0, 0.0, -8.0),
		vec3(8.0, 0.0,  8.0),
		vec3(8.0, 0.0, -8.0)
	];

	bufferChessboard = gl.createBuffer(); 

	gl.bindBuffer(gl.ARRAY_BUFFER, bufferChessboard);

	gl.bufferData(gl.ARRAY_BUFFER,flatten(ptChessboard),gl.STATIC_DRAW);
	ptChessboard.length = 0;
}

function drawChessman(i, j) {
	mvpStack.push(matMVP);
	if (chess[i][j] > 0)
		gl.uniform4f(u_Color, 1.0, 1.0, 1.0, 1.0);
	else
		gl.uniform4f(u_Color, 0.0, 0.0, 0.0, 1.0);
	matMVP = mult(matMVP, translate(-7.0 + j * 1.0, 0, -7.0 + i * 1.0));
	gl.uniformMatrix4fv(u_MVPMatrix, false, flatten(matMVP));
	gl.drawArrays(gl.TRIANGLES, 0, numVerticesSphere);
	matMVP = mvpStack.pop();
}

function drawChessmanForSelect(i, j) {
	mvpStack.push(matMVP);
	gl.uniform4f(u_Color, i * 17 / 255.0, j * 17 / 255.0, 0.0, 1.0);
	matMVP = mult(matMVP, translate(-7.0 + j * 1.0, 0, -7.0 + i * 1.0));
	gl.uniformMatrix4fv(u_MVPMatrix, false, flatten(matMVP));
	gl.drawArrays(gl.TRIANGLES, 0, numVerticesSphere);
	matMVP = mvpStack.pop();
}


function getSelectedObj(x, y){
	var pixels = new Uint8Array(4);

	gl.bindFramebuffer(gl.FRAMEBUFFER, FBOforSelect);

	var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
	if (status == gl.FRAMEBUFFER_COMPLETE) {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		matMVP = mult(matProj,mult(translate(0.0, 0.0, -35.0),mult(rotateY(angleY),rotateX(angleX))));

		gl.uniformMatrix4fv(u_MVPMatrix, false, flatten(matMVP));

		gl.bindBuffer(gl.ARRAY_BUFFER, bufferSphere); 
		gl.vertexAttribPointer( a_Position,3,gl.FLOAT,false,0,0);

		for (var i = 0; i < 15; i++)
			for (var j = 0; j < 15; j++)
				drawChessmanForSelect(i, j);

		gl.finish();

		gl.readPixels(x,y,1, 1,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
	}
	else
		return -2;
	
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);

	if(pixels[2] > 0)
		return -1;
	else{
		var i = pixels[0] / 17;
		var j = pixels[1] / 17;
		return i * 15 + j;
	}
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
	matMVP = mult(matProj,
		mult(translate(0.0, 0.0, -35.0),
		mult(rotateY(angleY),
		rotateX(angleX))));

	gl.uniformMatrix4fv(u_MVPMatrix, false, flatten(matMVP));

	gl.enable(gl.POLYGON_OFFSET_FILL);
	gl.polygonOffset(1.0, 1.0);
	gl.uniform4f(u_Color, 0.93, 0.8, 0.22, 1.0);
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferChessboard); 
	gl.vertexAttribPointer( a_Position,3,gl.FLOAT,false,0,0);
	gl.drawArrays(gl.TRIANGLES, 0, numVerticesChessboard);
	gl.disable(gl.POLYGON_OFFSET_FILL);
	
	gl.uniform4f(u_Color, 0.0, 0.0, 0.0, 1.0); 

	gl.bindBuffer(gl.ARRAY_BUFFER, bufferChessline); 

	gl.vertexAttribPointer( a_Position,3,gl.FLOAT,false,0,0);
	gl.drawArrays(gl.LINES, 0, numVerticesChessline);

	gl.bindBuffer(gl.ARRAY_BUFFER, bufferSphere); 

	gl.vertexAttribPointer( 
		a_Position,3,gl.FLOAT,false,0,0);
	for (var i = 0; i < 15; i++) {
		for (var j = 0; j < 15; j++) {
			if (chess[i][j]) {
				drawChessman(i, j);
			}
		}
	}
}

window.onkeydown = function(){
	switch(event.keyCode){
		case 37: // 方向键Left
			angleY -= angleStep;
			if (angleY < -180.0) {
				angleY += 360.0;
			}
			break;
		case 38: // 方向键Up
			angleX -= angleStep;
			if (angleX < -80.0) {
				angleX = -80.0;
			}
			break;
		case 39: // 方向键Right
			angleY += angleStep;
			if (angleY > 180.0) {
				angleY -= 360.0;
			}
			break;
		case 40: // 方向键Down
			angleX += angleStep;
			if (angleX > 80.0) {
				angleX = 80.0;
			}
			break;
		default:
			return;
	}
	requestAnimFrame(render); // 请求重绘
}