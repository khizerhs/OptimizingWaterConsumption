//Smart Irrigation Module - ETC calculations
var htmlparser = require("htmlparser2");//Scraping sjsu meteorology website for real-time values
var Client = require('node-rest-client').Client;//For wunderground api calls
var client = new Client();
var Rs,P,Prec,Tkmax,Tkmin,T,U2,RHmax,RHmin,Etr,Rn,Rns,Rnl,Eo,EoTmin,EoTmax,Ea,Es,Delta,Gamma,Cn=900,Cd=0.34;//Variables

//Main function to calculate ETC ** Do Not Modify **
function CalEtc(){
	client.get("http://www.met.sjsu.edu/wx/currentfull.php", function (data, response) {
		var dom = htmlparser.parseDOM(data);    
    	Rs=parseFloat(dom[3].children[2].next.children[9].children[3].children[3].children[1].children[1].children[3].children[3].children[1].children[1].children[3].children[3].children[1].children[1].children[1].children[0].children[0].data);
    	Rs=(Rs*3.6)/1000;//Net solar radiation(W/m2)
    	RHmax=parseFloat(dom[3].children[2].next.children[9].children[3].children[3].children[1].children[1].children[3].children[3].children[1].children[1].children[5].children[3].children[1].children[1].children[1].children[0].children[0].data);//Relative humidity(%)
    	P=parseFloat(dom[3].children[2].next.children[9].children[3].children[3].children[1].children[1].children[3].children[3].children[1].children[1].children[5].children[3].children[1].children[1].children[1].children[0].children[0].data);//Atmospheric Pressure(mBar)
    	Tkmax=parseFloat(dom[3].children[2].next.children[9].children[3].children[3].children[1].children[1].children[3].children[1].children[1].children[1].children[5].children[3].children[2].children[0].data);//Max temperature(c)
    	Tkmin=parseFloat(dom[3].children[2].next.children[9].children[3].children[3].children[1].children[1].children[3].children[1].children[1].children[1].children[7].children[3].children[2].children[0].data);
    	T=(parseFloat(Tkmin)+parseFloat(Tkmax))/2;//Min temperature(c)
    	client.get("http://api.wunderground.com/api/90e662793af1aa07/conditions/q/CA/San_Jose.json", function (data, response) {
			U2=parseFloat(data.current_observation.wind_kph);//Wind speed(kmph)
			RHmin=parseFloat(data.current_observation.relative_humidity);//Relative humidity(%)
			Prec=data.current_observation.precip_today_metric;//Precipitation(mm)
			if(RHmin>RHmax){
				RHmax=RHmax+RHmin;RHmin=RHmax-RHmin;RHmax=RHmax-RHmin;
			}Calc();
		});
	});
}

//Function for ETr ** Do Not Modify **
function Calc(){
	Rns=Rs*0.77;
	EoTmin=svapf(Tkmin);	
	EoTmax=svapf(Tkmax);
	Ea=((EoTmin*(RHmax/100))+(EoTmax*(RHmin)/100))/2;//Mean actual vapor pressure
	Es=(EoTmax+EoTmin)/2;//Saturation vapor pressure
	Rnl=(4.901*(Math.pow(10,-9)))*0.525*(0.34-(0.14*Math.pow(Ea,0.5)))*((Math.pow(Tkmax,4))+Math.pow(Tkmin,4))/2;
	Rn=Rns-Rnl;//Net radiation
	Delta=(2503*(Math.pow(2.718,((17.27*T)/(T+273.3)))))/Math.pow((T+237.3),2);//Slope of saturation vapor pressure-temperature curve 
	Gamma=((RHmin+RHmax)/2)*0.1*0.000665;//Psychometric constant
	temp1=0.408*Delta*(Rn);
	temp2=Gamma*(Cn/(T+273))*U2*0.277*(Es-Ea);
	temp3=Delta+Gamma*(1+Cd*U2*0.277);
	Etr=(temp1+temp2)/temp3;
	console.log("Radiation(W/m2):"+Rs+"\nAtmospheric Pressure(mBar):"+P+"\nMax Temperature(C):"+Tkmax+"\nPrecipitation(mm):"+Prec+"\nMin Temperature(C):"+Tkmin+"\nMean Temperature(C):"+T+"\nWind Speed(Kmph):"+U2+"\nMax Humidity(%):"+RHmax+"\nMin Humidity(%):"+RHmin+"\nNet Radiation(MJ/m2/d):"+Rn+"\nNet Short-wave Radiation(MJ/m2/d):"+Rns+"\nNet Long-wave Radiation(MJ/m2/d):"+Rnl+"\nSaturation vapor pressure-Min Temperature(kPa):"+EoTmin+"\nSaturation vapor pressure-Max Temperature(kPa):"+EoTmax+"\nMean actual vapor pressure(kPa):"+Ea+"\nSaturation vapor pressure(kPa):"+Es+"\nSlope of saturation vapor pressure-temperature curve:"+Delta+"\nPsychrometric constant(kPa/c):"+Gamma+"\nETR(mm/d):"+Etr+"\nCrop co-efficient(Cabbage)(Kc):50\nETC(mm/d):"+Etr*50);
}

//Function for saturation vapor pressure ** Do Not Modify **
function svapf(temp){
	t=(17.27*temp)/(temp+273.3);
	Eo=0.6108*(Math.pow(2.718,t));
	return(Eo);
}
