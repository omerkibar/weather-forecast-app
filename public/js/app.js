'use strict';

let cities=["Adana", "Adıyaman", "Afyon", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis",
    "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", 
    "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli",
    "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun", "Siirt", "Sinop",
    "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", 
    "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"];
init();
function init(){
    let menu = document.getElementsByClassName("dropdown-menu")[0];
    for(let i = 0;i<81;i++){
        menu.innerHTML += `<button class="dropdown-item" type="button" onclick="changeCity(${i})">${cities[i]}</button>`
    }
    getData(33); 
}

function changeCity(city){
    document.getElementById("dropdownMenu2").innerHTML = cities[city];
    document.getElementById("dailyInfo").innerHTML = "";
    extend.innerHTML = `<div class="row content">
        <div class="col-sm-12">
            <a onclick="showMoreDay()"><img style="width:50px;height:  50px"src="/images/down-arrow.png" alt="drop down icon"></a>
        </div>
    </div>`
    getData(city);
}

let dataObj = {};
function getData(city){
    var xmlhttp = new XMLHttpRequest();
    var url = "/city?cityId="+city;
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            dataObj = JSON.parse(this.response);
            displayData(0,4);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function displayData(start,end){

    let days = ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];
    let date = new Date(dataObj.daily[start].dt*1000);
    let container = document.getElementById("dailyInfo");
    for(let i = start;i<end;i++){
        let description = dataObj.daily[i].weather[0].description;
        let words = description.split(" ");
        for (let j = 0; j < words.length; j++) {
            words[j] = words[j][0].toUpperCase() + words[j].substr(1);
        }
        description = words.join(" ");
        container.innerHTML +=`<div class="row content">
        <div class="col-sm-12 cityInfo"> 
          <table onclick="toggleTable(${i})"class="table table-secondary table-borderless"> 
            <tr>
              <td class="align-middle col-2"><h4>${days[date.getDay()]}<br>${date.getDate()}.${date.getMonth()+1}</h4></td>
              <td class="align-middle col-2"><img class="weather-icon d-inline-block align-center" src="http://openweathermap.org/img/wn/${dataObj.daily[i].weather[0].icon}@2x.png" alt="Güneşli"></td>
              <td class="align-middle col-2"><label style="font-size:50px; font-weight: 500;">${Math.round(dataObj.daily[i].temp.day)}°</label><label style="font-size: 20px; font-weight:500;">/${Math.round(dataObj.daily[i].temp.min)}°</label></td>
              <td colspan="2" class="align-middle col-4"><h4>${description}</h4></td>
              <td class="align-middle col-2">
                  <h4><img class="rain-drop-icon d-inline-block" src="images/rain-drop-icon.png" alt="Yağış ihtimali">%${Math.round(dataObj.daily[i].pop*100)}</h4>
              </td>
            </tr>
            <tr class="row-closed" id="row-${i}">
            </tr>
          </table>
        </div>
    </div>`
    date.setDate(date.getDate()+1);
    }
}

function showMoreDay(){
    displayData(4,8);
    let extend = document.getElementById("extend");
    extend.innerHTML = `<div class="row content">
        <div class="col-sm-12">
            <a onclick="showLessDay()"><img style="width:50px;height:  50px"src="/images/up-arrow.png" alt="drop down icon"></a>
        </div>
    </div>`
}

function showLessDay(){
    let container = document.getElementById("dailyInfo");
    container.innerHTML = "";
    displayData(0,4);
    extend.innerHTML = `<div class="row content">
        <div class="col-sm-12">
            <a onclick="showMoreDay()"><img style="width:50px;height:50px" src="/images/down-arrow.png" alt="drop down icon"></a>
        </div>
    </div>`
    window.scrollTo(0, 0);
}

function toggleTable(id){
    let tr = document.getElementById("row-"+id);
    if(tr.classList.contains("row-closed")){
        tr.innerHTML += `
        <td>Nem:<h5>%${dataObj.daily[id].humidity}</h5></td>
        <td>Rüzgar Yönü:<h5>${getCompDir(dataObj.daily[id].wind_deg)}</h5></td>
        <td>Rüzgar Hızı:<h5>${Math.round(dataObj.daily[id].wind_speed*3,6)} km/s</h5></td>
        <td colspan="2">Hissedilen Sıcaklık:<h5>
        ${Math.round(dataObj.daily[id].feels_like.day)}°/
        ${Math.round(dataObj.daily[id].feels_like.night)}°
        </h5></td>
        <td>Basınç:<h5>${dataObj.daily[id].pressure} mb</h5></td>`
        tr.classList.remove("row-closed");
        tr.classList.add("row-opened");
        return;
    }
    tr.innerHTML="";
    tr.classList.remove("row-opened");
    tr.classList.add("row-closed");
}

function getCompDir(deg){
    let directions = ["Kuzey","Kuzeydoğu","Doğu","Güneydoğu","Güney","Güneybatı","Batı","Kuzeybatı","Kuzey"];
    return directions[Math.round(deg/45)];
}