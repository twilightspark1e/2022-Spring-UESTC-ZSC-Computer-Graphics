// 实验1
window.onload = function main(){
	var canvas = document.getElementById("webgl")
	if(!canvas){
		alert("获取元素失败");
		return;
	}
	
	var gl = WebGLUtils.setupWebGL(canvas);
	if (!gl){
		alert("获取webGL失败");
		return;
	}
	
	/*var vertices = [
		vec2(-0.5,-0.5),//0
		vec2(0.5,0.5),//1
		vec2(-0.5,0.5),//2
		vec2(0.5,-0.5)//3
	];
	
	var vertices = [
		vec2(-0.5,-0.5),//0
		vec2(0.5,-0.5),//1
		vec2(0.5,0.5),//2
		vec2(-0.5,0.5)//3
	];*/
	
	var vertices = [
		vec2(-0.75,0.25),//H
		vec2(-0.75,-0.25),//1
		vec2(-0.75,0),
		vec2(-0.5,0),//2
		vec2(-0.5,0.25),
		vec2(-0.5,-0.25),//3
		
		vec2(-0.25,0.25),//6  R
		vec2(-0.25,0),//7
		vec2(0,0),//8
		vec2(0,0.25),//9
		vec2(-0.25,0),//10
		vec2(-0.25,-0.25),//11
		vec2(-0.25,0),//12
		vec2(0,-0.25),//13
		
		vec2(0.375,0.25),//14
		vec2(0.25,0.25),//15
		vec2(0.5,0.25),//16
		vec2(0.375,0.25),//17
		vec2(0.375,-0.25),//18
		vec2(0.25,0)//19
	];
	
	
	
	
	
	var colors = [
	vec3(0.0,0.0,1.0),
	vec3(1.0,1.0,1.0),
	vec3(1.0,0.0,0.0),
	vec3(0.0,1.0,0.0),
	vec3(0.0,0.0,1.0),
	vec3(1.0,1.0,1.0),
	vec3(1.0,0.0,0.0),
	vec3(0.0,1.0,0.0),
	vec3(0.0,0.0,1.0),
	vec3(0.0,0.0,1.0),
	vec3(0.0,0.0,1.0),
	vec3(0.0,0.0,1.0),
	vec3(1.0,1.0,1.0),
	vec3(0.0,0.0,1.0),
	vec3(0.0,0.0,1.0),
	vec3(0.0,0.0,1.0),
	vec3(1.0,1.0,1.0),
	vec3(0.0,0.0,1.0),
	vec3(1.0,1.0,1.0),
	vec3(0.0,0.0,1.0),
	vec3(0.0,1.0,0.0)
	];
		
	gl.viewport(0,
				0,
				canvas.width,
				canvas.height);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	
	var program = initShaders(gl,"vertex-shader","fragment-shader");
	gl.useProgram(program);
	
	var verticesbufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,verticesbufferId);
	gl.bufferData(gl.ARRAY_BUFFER,
	flatten(vertices),
	gl.STATIC_DRAW );
	var a_Position = gl.getAttribLocation(program,"a_Position");
	if(a_Position < 0){
		alert("获取a_Position变量失败");
		return;
	}
	
	gl.vertexAttribPointer(a_Position,
		2,
		gl.FLOAT,
		false,
		0,
		0);
	gl.enableVertexAttribArray(a_Position);



	var colorsBufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,colorsBufferId);
	gl.bufferData(gl.ARRAY_BUFFER,
	flatten(colors),
	gl.STATIC_DRAW );
	
	var a_Color = gl.getAttribLocation(program,"a_Color");
	if(a_Color < 0){
		alert("获取a_Color变量失败");
		return;
	}
	
	gl.vertexAttribPointer(a_Color,
		3,
		gl.FLOAT,
		false,
		0,
		0);
	gl.enableVertexAttribArray(a_Color);
	render(gl);
	
	
}	

function render(gl){
		gl.clear(gl.COLOR_BUFFER_BIT);
		
		gl.drawArrays(gl.LINES,
		0,
		2);
		
		gl.drawArrays(gl.LINES,
		2,
		2);
		
		gl.drawArrays(gl.LINES,
		4,
		2);
		
		gl.drawArrays(gl.LINE_LOOP,
		6,
		4);
		 
		gl.drawArrays(gl.LINE_STRIP,
		10,
		2);
		
		gl.drawArrays(gl.LINES,
		12,
		2);
		
		gl.drawArrays(gl.LINES,
		14,
		2);
		
		gl.drawArrays(gl.LINES,
		15,
		2);
		
		gl.drawArrays(gl.LINES,
		17,
		2);
		
		gl.drawArrays(gl.LINES,
		18,
		2);
}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	