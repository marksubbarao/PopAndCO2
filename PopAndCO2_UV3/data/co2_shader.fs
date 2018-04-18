uniform float uv_fade;
uniform float uv_alpha;
uniform vec4 co2Color;

in vec2 texcoord;
in vec3 vertPos;
in vec3 cameraPos;

out vec4 fragColor;
in float boost;

float sphereIntersection (vec3 position, vec3 rayDirection, vec3 sphereCenter, float sphereRadius){
	vec3 relPos = position-sphereCenter;
	//A, B and C are coefficents for the relevant quadratic equation
	float A = 1;
	float B = 2*dot(relPos,rayDirection);
	float C = dot(relPos,relPos)-sphereRadius*sphereRadius;
	float st = B*B-4*A*C;
	//If there are no real solutions return a negative distance
	if (st < 0)
		return -1;
	float v1 = (-B+sqrt(st))/(2*A);
	float v2 = (-B-sqrt(st))/(2*A);
	//Return the min distance along the ray to the sphere (if the min is negative we return the max instead)
	float v = min(v1,v2);
	if (v < 0)
		v = max(v1,v2);
	return v;
}

void main(void)
{
	
	float rad = length(texcoord);
	

	//make a circle
	if (rad > 1.){
		discard;
	}
    // Check to see if it is behing the Earth
	float intersectDist = sphereIntersection(cameraPos, normalize(vertPos-cameraPos),vec3(0),637.5);
	if (intersectDist > 0 && intersectDist< length(vertPos-cameraPos)){
		discard;
	}

	vec4 color = co2Color;
	color.a *=  uv_fade * uv_alpha * sqrt(1-rad*rad);

	fragColor = color;
		
}
