uniform float uv_fade;
uniform float uv_alpha;
uniform vec4 popColor;

in vec2 texcoord;

out vec4 fragColor;
in float boost;

void main(void)
{
	
	float rad = length(texcoord);
	

		//make a circle
		if (rad > 1.){
			discard;
		}


	vec4 color = mix(popColor,vec4(1),boost);
	color.a *=  uv_fade * uv_alpha;

	fragColor = color;
		
}
