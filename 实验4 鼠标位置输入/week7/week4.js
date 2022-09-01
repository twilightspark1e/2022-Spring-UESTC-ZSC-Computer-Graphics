
var MaxNumSquares = 1000;
var MaxNumVertices = MaxNumSquares*6;
var MaxHalfSize = 10.0;

var count = 0;
var gl;
var canvas;
var drawRect = false;

window.onload = function main(){
	canvas = document.getElementById("webgl")
	if(!canvas){
		alert("获取元素失败");
		return;
	}
	
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl){
		alert("获取webGL失败");
		return;
	}
	
		
	gl.viewport(0,
				0,
				canvas.width,
				canvas.height);
	gl.clearColor(0.9, 0.9, 0.9, 1.0);
	
	var program = initShaders(gl,"vertex-shader","fragment-shader");
	gl.useProgram(program);
	
	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,bufferId);
	gl.bufferData(gl.ARRAY_BUFFER,
		Float32Array.BYTES_PER_ELEMENT*6*MaxNumVertices,
		gl.STATIC_DRAW );
	
	var a_Position = gl.getAttribLocation(program,"a_Position");
	if(a_Position < 0){
		alert("获取变量失败");
		return;

		}
			
	
	gl.vertexAttribPointer(a_Position,
		3,
		gl.FLOAT,
		false,
		Float32Array.BYTES_PER_ELEMENT*6,
		0);
	gl.enableVertexAttribArray(a_Position);

	var a_Color = gl.getAttribLocation(program,"a_Color");
	if(a_Color < 0){
		alert("获取a_color变量失败");
		return;

	}

	gl.vertexAttribPointer(a_Color,
		3,
		gl.FLOAT,
		false,
		Float32Array.BYTES_PER_ELEMENT*6,
		Float32Array.BYTES_PER_ELEMENT*3);
	gl.enableVertexAttribArray(a_Color);

	var u_matMVP = gl.getUniformLocation(program,"u_matMVP");
	if(!u_matMVP){
		alert("获取u_matMVP变量失败");
		return;
	}

	var matProj = ortho2D(0,canvas.width,0,canvas.height);
	gl.uniformMatrix4fv(u_matMVP,false,flatten(matProj));
	
	canvas.onclick = function(){
		addSquare(event.clientX,event.clientY);
	};

	canvas.onmousedown = function(){
		if(event.button == 0) 
			drawRect = true;
	};
	
	canvas.onmouseup = function(){
		if(event.button == 0) 
			drawRect = false;
	};

	canvas.onmousemove = function(){
		if(drawRect)
		addSquare(event.clientX,event.clientY);
	};
	
	gl.clear(gl.COLOR_BUFFER_BIT);
};



function render(){
	gl.clear(gl.COLOR_BUFFER_BIT)
	gl.drawArrays(gl.TRIANGLES,
		0,
		count*6);
}

function addSquare(x,y){
	var HalfSize = MaxHalfSize*Math.random();
	if(count >= MaxNumSquares){
		alert("The number of square is reach to limited!");
		return;
	}
	var rect = canvas.getBoundingClientRect();
	x = x-rect.left;
	y = canvas.height - (y - rect.top);

	var vertices = [
		vec3(x-HalfSize,y+HalfSize,0),
		vec3(x-HalfSize,y-HalfSize,0),
		vec3(x+HalfSize,y-HalfSize,0),
		vec3(x-HalfSize,y+HalfSize,0),
		vec3(x+HalfSize,y-HalfSize,0),
		vec3(x+HalfSize,y+HalfSize,0)
	];

	var randColor = vec3(Math.random(),Math.random(),Math.random());
	var data = [];
	var colors = [
		vec3(0,Math.random(),Math.random()),
		vec3(Math.random(),0,Math.random()),
		vec3(Math.random(),Math.random(),0),
		vec3(Math.random(),Math.random(),Math.random()),
		vec3(0,0,Math.random()),
		vec3(Math.random(),Math.random(),Math.random())
	];
	for(var i = 0;i<6;i++){
		data.push(vertices[i]);
		data.push(colors[i]);

	}
	vertices.length = 0;

	gl.bufferSubData(gl.ARRAY_BUFFER,
		count*6*2*3*Float32Array.BYTES_PER_ELEMENT,
		flatten(data));
	data.length = 0;
	count++;
	requestAnimFrame(render)
}


