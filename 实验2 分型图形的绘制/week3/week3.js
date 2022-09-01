var NumPoints = 5000;
var points = [];

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
		vec2(-1.0,-1.0),vec2(0.0,1.0),vec2(1.0,-1.0),
		vec2(0.0,1.0),vec2(1.0,1.0),vec2(1.0,1.0)

	];

    var a = Math.random();
    var b =(1-a)*Math.random();
    var p = add(mult(a,vertices[0]),add(mult(b,vertices[1]),mult(1-a-b,vertices[2])));
    console.log("初始点PL:(%f,%f)",p[0],p[1]);

	var colors =[];

    for(var i = 0;i<NumPoints;++i){
        var j = Math.floor(Math.random()*3);

        var p = mult(0.6,add(p,vertices[j]));
        points.push(p);
		colors.push(vec3(Math.random(),Math.random(),Math.random()));
    }

		
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
	flatten(points),
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
};

function render(gl){
		gl.clear(gl.COLOR_BUFFER_BIT);
		
		gl.drawArrays(gl.POINTS,
		0,
		points.length);
}