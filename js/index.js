//Functions
function contestedSeats(e) {
  showUncontestedSeatsOnly = !showUncontestedSeatsOnly;
  if (showUncontestedSeatsOnly) {
      $("#showUncontestedOnly").addClass("btn-success").removeClass("btn-danger");
      $("#showUncontestedOnly").html("顯示全部選區");
  } else {
      $("#showUncontestedOnly").addClass("btn-danger").removeClass("btn-success");
      $("#showUncontestedOnly").html("只顯示自動當選選區");
  }
  map.eachLayer(function (layer) {
      if (layer._url != "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png") {
          layer.remove();
      }
  });
  showRegions("./boundary.json", showUncontestedSeatsOnly);
}

function showRegions(path, showUncontestedSeatsOnly) {
  $.getJSON(path, function (data) {
      var allRegions = 0;
      var uncontestedRegions = 0;
      $.each(data, function (index, value) {
          /*if(!showUncontestedSeatsOnly){ //Show All Seats
              L.polygon([value.points], {className: value.code}).addTo(map);
          } else*/
          allRegions = allRegions + 1;
          if (value.isUncontested) { //Only Show Uncontested Seats
              L.polygon([value.points], { className: value.code, color: "#FF0000" }).addTo(map);
              uncontestedRegions = uncontestedRegions + 1;
          } else {
              L.polygon([value.points], { className: value.code }).addTo(map);
              //The Contested Seats are not shown
          }
      });
      var d = new Date();
      var datetime = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日" + d.getHours() + "時" + d.getMinutes() + "分";
      $("#entry_status").html("截至" + datetime + ",已輸入" + allRegions.toString() + "/452個選區, 其中<span style='color: red;'>" + uncontestedRegions.toString() + "個選區</span>有機會由建制派自動當選。");
  });
}




//Ad-hoc parameters for data entry
//var map = L.map('mapid').setView([22.320638, 114.194829], 14);

//Center of HK for use
var map = L.map('mapid').setView([22.354554, 114.161682], 11);

//Base Map from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Base JSON
//TODO 1: All Boundaries, Region Name, Contestants, Organization
//TODO 2: Read from Separate JSON Source for easier Maintenance - DONE
//TODO 3: Visualization depends on Use

var showUncontestedSeatsOnly = false;
showRegions("./boundary.json", showUncontestedSeatsOnly);




//TODO: Pop-up Functionality according to selected region, Use className for each SVG element
var popup = L.popup();

//TODO: Take from JSON Source for Content
function onMapClick(e) {
    console.log(e);
    popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(map);
}
//map.on('click', onMapClick);

map.on('click', onRegionClick);

function onRegionClick(e) {
    //console.log(e.originalEvent);
    if (e.originalEvent.target.classList.length == 2) {
        var region_code = e.originalEvent.target.classList[0];
        $.getJSON("./region_details.json", function (data) {
            $.each(data, function (index, value) {
                if (value.code == region_code) {

                    region_content =
                        "地區：" + value.district + "<br/>" +
                        "選區編號：" + value.code + "<br/>" +
                        "選區名稱：" + value.name + "<br/>" +
                        "建制派擬參選人：" + value.estab_contestant + " (" + value.estab_organization + ")<br/>";
                    if (!!value.democrat_contestant) {
                        region_content = region_content + "民主派擬參選人：" + value.democrat_contestant + " (" + value.democrat_organization + ")<br/>";
                    } else {
                        region_content = region_content + "<span style='color: red;'><strong>未有民主派候選人！</strong></span><br/>"
                    }

                    if (!!value.democrat_contestant) {
                        organzation_content = "<br/><strong>民間組織</strong><br/>";
                        $.each(value.organization, function(index, val) {
                          if (!!val.name) {organzation_content = organzation_content + "名稱：" + val.name + "<br/>";}
                          if (!!val.fbpage) {organzation_content = organzation_content + "Facebook Page：<a target='_blank' href='" + val.fbpage + "'>" + val.fbpage + "</a><br/>";}
                          if (!!val.telegram) {organzation_content = organzation_content + "Telegram：" + val.telegram + "<br/>";}
                          if (!!val.email) {organzation_content = organzation_content + "電郵：<a href='mailto:" + val.email + "'>" + val.email + "</a><br/>";}
                          if (!!val.whatsapp) {organzation_content = organzation_content + "Whatsapp：" + val.whatsapp + "<br/>";}
                          if (!!val.telephone) {organzation_content = organzation_content + "電話號碼：" + val.telephone + "<br/>";}
                          organzation_content = organzation_content + "<br/>";
                        });
                    } else {
                      organzation_content = "<br/><strong>有意參選市民,請聯絡<a target='_blank' href='https://www.facebook.com/pg/反自動當選運動-2510455555631639'>反自動當選運動</a></strong><br/>";
                    }

                    popup.setLatLng(e.latlng).setContent(region_content + organzation_content).openOn(map);
                }
            });
        });
    }
}    
