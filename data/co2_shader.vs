in float latitude;
in float longitude;
in float year;
in float co2;
out float Year;
out float Longitude;
out float Latitude;
out float CO2;
void main(void)
{
	Latitude=latitude;
	Longitude=longitude;
	Year=year;
	CO2=co2;
    gl_Position = vec4(1.0);
}
