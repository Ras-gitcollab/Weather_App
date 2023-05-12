const http =require("http");
const fs =require("fs");
var requests=require("requests");
const homeFile= fs.readFileSync("home.html", "utf-8");
const replaceVal=(tempVal,orgVal)=>{
    let Temperature=tempVal.replace("{%tempVal%}",(orgVal.main.temp-273.15).toFixed(2));
    Temperature=Temperature.replace("{%tempMin%}",(orgVal.main.temp_min-273.15).toFixed(2));
    Temperature=Temperature.replace("{%tempMax%}",(orgVal.main.temp_max-273.15).toFixed(2));
    Temperature=Temperature.replace("{%location%}",orgVal.name);
    Temperature=Temperature.replace("{%country%}",orgVal.sys.country);
    Temperature=Temperature.replace("{%tempStatus%}",orgVal.weather[0].main);
    return Temperature;
}
const server =http.createServer((req,res)=>{
    if (req.url="/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=Bangalore&appid=93bdcdfe579b9362a7e2e19cbbe1420d")
        .on("data",(data)=>{
            const objData= JSON.parse(data);
            const arrData= [objData];
            const realTimeData=arrData.map((val)=>replaceVal(homeFile,val)).join("");
            res.write(realTimeData);
        })
        .on("end",(err)=>{
            if(err) return console.log("connection lost due to error", err);
            res.end();
        });
    }
});

server.listen(8000);
