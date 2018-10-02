layout(triangles) in;
layout(triangle_strip, max_vertices = 4) out;

uniform mat4 uv_modelViewProjectionMatrix;
uniform mat4 uv_modelViewMatrix;
uniform mat4 uv_projectionMatrix;
uniform mat4 uv_projectionInverseMatrix;
uniform mat4 uv_modelViewInverseMatrix;
uniform vec4 uv_cameraPos;
uniform mat4 uv_scene2ObjectMatrix;

uniform int uv_simulationtimeDays;
uniform float uv_simulationtimeSeconds;
uniform float uv_fade;
uniform sampler2D stateTexture;

uniform bool simBindRealtime;

uniform float co2Size;

out vec2 texcoord;
out vec3 vertPos;
out vec3 cameraPos;
out float boost;


const float PI = 3.1415926535897932384626433;
const float DEG2RAD = PI / 180.0;

mat4 getRotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}


vec3 getPos(vec2 lonlat,float r){	
	vec2 p = DEG2RAD*lonlat ;
	float x = -1* r * cos(p.x)*cos(p.y);
	float y = -1. * r * sin(p.x)*cos(p.y);
	float z = r * sin(p.y);

	return vec3(x,y,z);
}

void drawSprite(vec2 lonlat, float radius, float rotation)
{
    vec3 pos=getPos(lonlat,637.5+radius);
	vec4 position = vec4(pos,0.0);
    vec3 objectSpaceUp = vec3(0, 0, 1);
    vec3 objectSpaceCamera = (uv_modelViewInverseMatrix * vec4(0, 0, 0, 1)).xyz;
	cameraPos=objectSpaceCamera;
    vec3 cameraDirection = normalize(objectSpaceCamera - position.xyz);
    vec3 orthogonalUp = normalize(objectSpaceUp - cameraDirection * dot(cameraDirection, objectSpaceUp));
    vec3 rotatedUp = mat3(getRotationMatrix(cameraDirection, rotation)) * orthogonalUp;
    vec3 side = cross(rotatedUp, cameraDirection);
	//side *= sign(dot(cameraDirection,position.xyz));
    texcoord = vec2(-1., 1.);
	gl_Position = uv_modelViewProjectionMatrix * vec4(position.xyz + radius * (-side + rotatedUp), 1);
	vertPos=position.xyz + radius * (-side + rotatedUp);
	EmitVertex();
    texcoord = vec2(-1., -1.);
	gl_Position = uv_modelViewProjectionMatrix * vec4(position.xyz + radius * (-side - rotatedUp), 1);
	vertPos=position.xyz + radius * (-side - rotatedUp);
	EmitVertex();
    texcoord = vec2(1, 1);
	gl_Position = uv_modelViewProjectionMatrix * vec4(position.xyz + radius * (side + rotatedUp), 1);
	vertPos=position.xyz + radius * (side + rotatedUp);
	EmitVertex();
    texcoord = vec2(1, -1.);
	gl_Position = uv_modelViewProjectionMatrix * vec4(position.xyz + radius * (side - rotatedUp), 1);
	vertPos=position.xyz + radius * (side - rotatedUp);
	EmitVertex();
	EndPrimitive();
}
void drawFlatSprite(vec2 lonlat, float radius, float rotation)
{
	vec3 pos = getPos(lonlat,637.5);
	float deltaLat = 1.0;
	vec3 posUp = getPos(lonlat + vec2(0,deltaLat),637.5);
	vec3 up = normalize(posUp-pos);
	vec3 side = normalize(cross(up,pos));
	vec3 rotatedUp=up;
    //vec3 objectSpaceUp = vec3(0, 0, 1);
    //vec3 objectSpaceCamera = (uv_modelViewInverseMatrix * vec4(0, 0, 0, 1)).xyz;
    //vec3 cameraDirection = normalize(objectSpaceCamera - position.xyz);
    //vec3 orthogonalUp = normalize(objectSpaceUp - cameraDirection * dot(cameraDirection, objectSpaceUp));
    //vec3 rotatedUp = mat3(getRotationMatrix(cameraDirection, rotation)) * orthogonalUp;
    //vec3 side = cross(rotatedUp, cameraDirection);
	//side *= sign(dot(cameraDirection,position.xyz));
    texcoord = vec2(-1., 1.);
	gl_Position = uv_modelViewProjectionMatrix * vec4(pos.xyz + radius * (-side + rotatedUp), 1);
	EmitVertex();
    texcoord = vec2(-1., -1.);
	gl_Position = uv_modelViewProjectionMatrix * vec4(pos.xyz + radius * (-side - rotatedUp), 1);
	EmitVertex();
    texcoord = vec2(1, 1);
	gl_Position = uv_modelViewProjectionMatrix * vec4(pos.xyz + radius * (side + rotatedUp), 1);
	EmitVertex();
    texcoord = vec2(1, -1.);
	gl_Position = uv_modelViewProjectionMatrix * vec4(pos.xyz + radius * (side - rotatedUp), 1);
	EmitVertex();
	EndPrimitive();
}



void main()
{
    float showTime = texture(stateTexture,vec2(0.5)).r;
	boost = 0;
	float yrs = 365.2425;
	float showYear = min(1970. + (uv_simulationtimeDays )/yrs,2010.5);
	if (!simBindRealtime){
		showYear = min(showTime,2010.5);
	}
	float size= co2Size*sqrt(gl_in[1].gl_Position.x);
	float begin = gl_in[0].gl_Position.x;
	if ((showYear-begin)<=1.0 && showYear > begin){
		drawSprite( gl_in[0].gl_Position.yz, size, 0.0);
	}
}
