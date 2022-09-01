var gl;
var angle = 0.0;
var delta = 60.0;
var size = 25;
var u_Angle;


window.onload = function main(){
	var canvas = document.getElementById("webgl")
	if(!canvas){
		alert("获取元素失败");
		return;
	}
	
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl){
		alert("获取webGL失败");
		return;
	}
	
	var vertices = [
		vec2(-size,-size),vec2(size,-size),vec2(size,size),vec2(-size,size)	
	];

	

		
	gl.viewport(0,
				0,
				canvas.width,
				canvas.height);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	
	var program = initShaders(gl,"vertex-shader","fragment-shader");
	gl.useProgram(program);
	
	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,bufferId);
	gl.bufferData(gl.ARRAY_BUFFER,
		flatten(vertices),
		gl.STATIC_DRAW );
	
	var a_Position = gl.getAttribLocation(program,"a_Position");
	if(a_Position < 0){
		alert("获取变量失败");
		return;
	}
	
	var colorMenu = document.getElementById("ColorMenu");
	if(!colorMenu){
		alert("获取菜单元素失败");
	}
	colorMenu.onclick = function(){
		switch(event.target.index){
			case 0:
				gl.uniform3f(u_Color,1.0,1.0,1.0);
				break;
			case 1:
				gl.uniform3f(u_Color,1.0,0.0,0.0);
				break;
			case 2:
				gl.uniform3f(u_Color,0.0,1.0,0.0);
				break;
			case 3:
				gl.uniform3f(u_Color,0.0,0.0,1.0);
				break;
			
		}
	}

	window.onresize = function(){
		var rect = canvas.getBoundingClientRect();
		canvas.width = innerWidth - 2*rect.left;
		canvas.height = innerHeight - 80;
		if(canvas.width>canvas.height)
			gl.viewport((canvas.width - canvan.height)/2,0,canvas.height,canvas.height);
		else
			gl.viewport(0,(canvas.height - canvas.width)/2,canvas.width,canvas.width);
	}



	gl.vertexAttribPointer(a_Position,
		2,
		gl.FLOAT,
		false,
		0,
		0);
	gl.enableVertexAttribArray(a_Position);

	u_Angle = gl.getUniformLocation(program,"u_Angle");
	if(!u_Angle){
		alert("获取angle变量失败");
		return;
	}

	var incButton = document.getElementById("IncSpeed");
	if(!incButton){
		alert("获取加速按钮失败");
	}
	incButton.onclick = function(){
		delta *=2;
	}

	var DownButton = document.getElementById("DownSpeed");
	if(!DownButton){
		alert("获取减速按钮失败");
	}
	DownButton.onclick = function(){
		delta *=1/2;
	}

	var u_matProj = gl.getUniformLocation(program,"u_matProj");
	if(!u_matProj){
		alert("获取u_matProj变量失败");
		return;
	}

	var matProj = ortho2D(-size*2,size*2,-size*2,size*2);
	gl.uniformMatrix4fv(u_matProj,false,flatten(matProj));
	
	
	var u_Color = gl.getUniformLocation(program,"u_Color");
	if(!u_Color){
		alert("获取u_color变量失败");
		return;
	}
	gl.uniform3f(u_Color,1.0,1.0,1.0);
	render();
};
var last = Date.now();


function render(){
	var now = Date.now();
	var elapsed = now - last;
	last = now;
	angle += delta*elapsed/1000.0;
	angle %= 360;
	gl.uniform1f(u_Angle, angle);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
		
	gl.drawArrays(gl.LINE_LOOP,
		0,
		3);
	requestAnimationFrame(render);
}

