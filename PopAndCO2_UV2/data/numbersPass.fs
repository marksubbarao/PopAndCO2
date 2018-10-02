//precision highp float;

uniform float uv_fade;
uniform float uv_alpha;
uniform vec4 imageColor;
in float camDist;
in vec2 texCoord;
out vec4 fragColor;
uniform sampler2D stateTexture;
uniform sampler2D numbersTex;

void main(void)
{
	float simUseTime=texture(stateTexture, vec2(0.5)).r;
    int digitSlot = int(4.*texCoord[0]);
	vec2 newTexCoord = vec2(fract(4.*texCoord[0]),texCoord[1]);
	vec4 color= vec4(0.0);
		int place = 4- digitSlot ;
		if (abs(simUseTime)>pow(10.,(place-1.))) {
			int num2use = int(10.*fract(abs(simUseTime)*pow(10.,0.-place)));	
			vec2 numCoords = vec2(0.1*fract(4.*texCoord[0])+0.1*num2use,texCoord[1]);
			color = texture(numbersTex,numCoords);
		}

	color *=imageColor;
	color.a *= uv_alpha*uv_fade;
	fragColor = color;
}