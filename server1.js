import {createServer} from "http";
import https from "https";

let server1 = createServer((req, res) => { //req es la peticion que se hace al servidor    //res es la respuesta que devuelve el servidor al usuario
   let datos = "";
   let urlKey = "KCCamYnisWLzdgEozQBSOovyV5Li0iTkqsUR2dEZ";
   let urlApi = `https://api.nasa.gov/neo/rest/v1/feed?start_date=2023-07-04&end_date=2023-07-05&api_key=${urlKey}`;

   https.get(urlApi, (myServer)=>{
    myServer.on("data", (chuck)=>{
        datos += chuck;
    });

    myServer.on("end", ()=>{
        let DataJson = JSON.parse(datos);
        let nearEarthObjects = DataJson.near_earth_objects["2023-07-05"];

        let plantilla = "";
        plantilla += `
        <h1>Asteroides Cercanos a la Tierra en 24 Horas</h1>
        <div class="containerCards">
        ${nearEarthObjects.map((val,id)=>{
            return `
            <div class = "cards">
                <div class="headerCard">
                    <div>
                        <h3>Nombre</h3>
                        <p>${val.name}</p>
                    </div>
                    <div>
                        <h3>Id</h3>
                        <p>${val.id}</p>
                    </div>
                </div>
                <div class ="infoCard">
                    <div>
                        <h3>Tamano Estimado</h3>
                        <p>Min: ${val.estimated_diameter.kilometers.estimated_diameter_min} Km</p>
                        <p>Max: ${val.estimated_diameter.kilometers.estimated_diameter_max} Km</p>
                    </div>
                    <div>
                        <h3>Velocidad Relativa</h3>
                        <p>${val.close_approach_data[0].relative_velocity.kilometers_per_hour} Km/h</p>
                    </div>
                    <div>
                        <h3>Fecha de Aproximacion</h3>
                        <p>${val.close_approach_data[0].close_approach_date_full}</p>
                    </div>
                    <div>
                        <h3>Potencialmente Peligroso</h3>
                        <p>${val.is_potentially_hazardous_asteroid}</p>
                    </div>
                </div>
            </div>
            `
        }).join("")}
        </div>`;

        plantilla +=`
        <style>
        h1{
            text-align: center;
            font-size: 3rem;
        }
        .containerCards{
            display: grid;
            grid-template-columns: repeat(auto-fill, 280px);
            gap: 10px;
            place-content: center;
        }
        .cards{
            display: flex;
            flex-direction: column;
            margin: 10px;
            border: 2px solid black;
        }
        .headerCard{
            width: 100%;
            background-color: hsla(50, 33%, 25%, .75);
            justify-content: space-between;
            display: flex;
        }
        .headerCard div{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin: 3px 5px;
        }
        h3{
            font-size: 0.8rem;
            margin: 0;
        }
        p{
            font-size: 1.2rem;
            margin: 0; 
        }
        .infoCard{
            display: flex;
            flex-direction: column;
            background-color: rgba(255, 255, 128, .5);
        }
        .infoCard div{
            width: 100%;
            display: flex;
            flex-direction: column;
            text-align: center;
            margin: 8px;
        }
        </style>`

        res.end(plantilla);
    })
   })
})

//configuracio de nuestro servidor
let config = {
    hostname: "127.17.0.192",
    port: 3000
}

// levanta nuestro servidor 
server1.listen(config, ()=>{
    console.log(`http://${config.hostname}:${config.port}/`); 
})