var NumTimesToSubdivide = 4;
var colors = [vec3(1.0,0.0,0.0),vec3(0.0,1.0,0.0),vec3(0.0,0.0,1.0),vec3(0.0,0.0,0.0)];
var NumTriangles =Math.pow(3,NumTimesToSubdivide);
var NumVertices = 3*NumTriangles;
var attributes = [];
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
	
	var vertices = [
		vec3(0.0,0.0,-1.0),
		vec3(0.0,0.942809,-0.333333),
		vec3(-0.816497,-0.471405,-0.333333),
		vec3(0.816497,-0.471405,-0.333333)];

	divideTriangle(vertices[0],vertices[1],vertices[2],NumTimesToSubdivide,colors);

		
	gl.viewport(0,
				0,
				canvas.width,
				canvas.height);
	gl.clearColor(0.0, 0.0, 0.0, 0.0);
	gl.enable(gl.DEPTH_TEST);

	var program = initShaders(gl,"vertex-shader","fragment-shader");
	gl.useProgram(program);
	
	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,bufferId);
	gl.bufferData(gl.ARRAY_BUFFER,
	flatten(colors),
	gl.STATIC_DRAW );
	
	
	var a_Position = gl.getAttribLocation(program,"a_Position");
	if(a_Position < 0){
		alert("获取变量失败");
		return;
	}
	
	gl.vertexAttribPointer(a_Position,
		2,
		gl.FLOAT,
		false,
		0,
		0);
	gl.enableVertexAttribArray(a_Position);
	render(gl);
};


function triangle(a,b,c,colorIndex){
	attributes.push(a);
	attributes.push(colors[colorIndex]);
	attributes.push(b);
	attributes.push(colors[colorIndex]);
	attributes.push(c);
	attributes.push(colors[colorIndex]);
}


function divideTriangle(a,b,c,k,colorIndex){

	if(k>0){
	
		var ab= mult(0.5,add(a,b));
		var ac= mult(0.5,add(a,c));
		var bc= mult(0.5,add(b,c));
		divideTriangle(a,ab,ac,k-1,colorIndex);
		divideTriangle(c,ac,bc,k-1,colorIndex);
		divideTriangle(b,bc,ab,k-1,colorIndex);

	}
	else
		triangle(a,b,c,colorIndex);
}

function tetrahedron(a,b,c,d,k){
	divideTriangle(a,b,c,k,0);
	divideTriangle(a,c,d,k,1);
	divideTriangle(a,d,b,k,2);
	divideTriangle(b,d,c,k,3);
}

function render(gl){
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	
	gl.drawArrays(gl.TRIANGLES,
	0,
	NumVertices);
}
