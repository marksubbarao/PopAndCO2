in float latitude;
in float longitude;
in float begin_year;
in float end_year;
in float rndFive;
out float Begin_year;
out float Longitude;
out float Latitude;
out float End_year;
out float RndFive;
void main(void)
{
	Latitude=latitude;
	Longitude=longitude;
	Begin_year=begin_year;
	End_year=end_year;
	RndFive=rndFive;
    gl_Position = vec4(1.0);
}

