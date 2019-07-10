//Functions
function showRegions(path, showUncontestedSeatsOnly) {
  $.getJSON(path, function (data) {
	  var delibratingRegions = 0;
      var uncontestedRegions = 0;
      $.each(data, function (index, value) {
          if (value.contestStatus == "UNCON") {
              L.polygon([value.points], { className: value.code, color: "#FF0000" }).addTo(map);
              uncontestedRegions = uncontestedRegions + 1;
          } else if (value.contestStatus == "DELIB") {
			  L.polygon([value.points], { className: value.code, color: "#FF9A26" }).addTo(map);
              delibratingRegions = delibratingRegions + 1;
		  } else { //value.contestStatus == "CON"
              L.polygon([value.points], { className: value.code}).addTo(map);
          }
      });
      var d = new Date();
      var datetime = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日" + d.getHours() + "時" + d.getMinutes() + "分";
      $("#entry_status").html("截至" + datetime + ",在全部452個選區中,已確認" + (452-uncontestedRegions-delibratingRegions).toString() + "個選區有極大機會出現競爭；並有<span style='color: #FF9A26;'>" + delibratingRegions.toString() + "個選區</span>有人積極考慮參選。" + "<strong>有機會由建制派自動當選的選區<span style='color: red;'>尚餘" + uncontestedRegions.toString() + "個</span>。</strong>");
  });
}

//Center of HK for use
var map = L.map('mapid').setView([22.354554, 114.161682], 11);

//Base Map from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Show All Regions
var showUncontestedSeatsOnly = false;
showRegions("./boundary.json", showUncontestedSeatsOnly);

//Pop-up Functionality according to selected region, Use className for each SVG element
var popup = L.popup();
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
                        region_content = region_content + "非建制派擬參選人：" + value.democrat_contestant + " (" + value.democrat_organization + ")<br/>";
                    } else {
                        region_content = region_content + "<span style='color: red;'><strong>未有非建制派候選人！</strong></span><br/>"
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
