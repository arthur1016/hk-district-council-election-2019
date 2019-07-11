//Functions
function showRegions(path, toDraw) {
  $.getJSON(path, function (data) {
	  var delibratingRegions = 0;
      var uncontestedRegions = 0;
      $.each(data, function (index, value) {
          if (value.contestStatus == "UNCON") {
              if(toDraw){L.polygon([value.points], { className: value.code, color: "#FF0000" }).addTo(map);}
              uncontestedRegions = uncontestedRegions + 1;
          } else if (value.contestStatus == "DELIB") {
			  if(toDraw){L.polygon([value.points], { className: value.code, color: "#FF9A26" }).addTo(map);}
              delibratingRegions = delibratingRegions + 1;
		  } else { //value.contestStatus == "CON"
			  if(toDraw){L.polygon([value.points], { className: value.code}).addTo(map);}
          }
      });
	  
	  var defaultText = "<p class='defaultText'><u>勿忘行動訴求</u><br/>完全撤回逃犯修例<br/>撤銷6月12日暴動定性<br/>撤銷反送中抗爭者控罪<br/>成立獨立調查委員會<br/>立即實行雙普選</p>";
	  
	  var d = new Date();
      var datetime = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日";// + d.getHours() + "時" + d.getMinutes() + "分";
      $("#entry_status").html("截至" + datetime + ",在全部452個選區中,已確認<span style='color: blue;'>" + (452-uncontestedRegions-delibratingRegions).toString() + "個選區</span>有較大機會出現競爭；並有<span style='color: #FF9A26;'>" + delibratingRegions.toString() + "個選區</span>有人積極考慮參選。" + "<br/><strong>有機會由建制派自動當選的選區<span style='color: red;'>尚餘" + uncontestedRegions.toString() + "個</span>。</strong>" + "<br/><br/>"+ defaultText);
  });
}

//Center of HK for use
var map = L.map('mapid').setView([22.354554, 114.161682], 11);

//Base Map from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Show All Regions
showRegions("./boundary.json", true);

//Click District Icon to focus map
function focusDistrict(id){
	var focusLatLng = [];
	var zoomLevel = 0;
	switch(id) {
		case "18district_cw":
			focusLatLng = [22.284192291588077, 114.14063542530998];
			zoomLevel = 14;
			break;
		case "18district_e":
			focusLatLng = [22.27476484719558, 114.22782419768704];
			zoomLevel = 14;
			break;
		case "18district_s":
			focusLatLng = [22.237402973671813, 114.19441582305673];
			zoomLevel = 13;
			break;
		case "18district_wc":
			focusLatLng = [22.27396704738363, 114.1777336281135];
			zoomLevel = 14;
			break;
		case "18district_ytm":
			focusLatLng = [22.309476317531836, 114.16522966757583];
			zoomLevel = 14;
			break;
		case "18district_ssp":
			focusLatLng = [22.329661849378425, 114.15909541686216];
			zoomLevel = 14;
			break;
		case "18district_kc":
			focusLatLng = [22.32470044368549, 114.18982280749695];
			zoomLevel = 14;
			break;
		case "18district_wts":
			focusLatLng = [22.34157668024854, 114.19845715612716];
			zoomLevel = 14;
			break;
		case "18district_kt":
			focusLatLng = [22.316655160036454, 114.22642177549423];
			zoomLevel = 14;
			break;
		case "18district_i":
			focusLatLng = [22.267966,113.996662];
			zoomLevel = 12;
			break;
		case "18district_ktsing":
			focusLatLng = [22.354990,114.116723];
			zoomLevel = 14;
			break;
		case "18district_tw":
			focusLatLng = [22.373823368598284, 114.11114606411499];
			zoomLevel = 14;
			break;
		case "18district_tm":
			focusLatLng = [22.39422282558875, 113.97274469310167];
			zoomLevel = 13;
			break;
		case "18district_yl":
			focusLatLng = [22.43867730239601, 114.02060721376868];
			zoomLevel = 13;
			break;
		case "18district_n":
			focusLatLng = [22.496288315295303, 114.14203667590677];
			zoomLevel = 12;
			break;
		case "18district_tp":
			focusLatLng = [22.4617515435459, 114.14828220283844];
			zoomLevel = 13;
			break;
		case "18district_st":
			focusLatLng = [22.397435664899156, 114.20856998607152];
			zoomLevel = 13;
			break;
		case "18district_sk":
			focusLatLng = [22.323439847587665, 114.26897071286538];
			zoomLevel = 13;
			break;
		default:
		//do nothing
	}
	
	map.setView(focusLatLng, zoomLevel);
}

//Pop-up Functionality according to selected region, Use className for each SVG element
var popup = L.popup();
map.on('click', onRegionClick);

function onRegionClick(e) {
    //console.log(e.originalEvent);
    if (e.originalEvent.target.classList.length == 2) {
		$("#infoBoard").css("border-color", "");
		$("#detailInfo").show();
		$("#entry_status").hide();
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
                        // style the detail Info contesetants
                        if(document.getElementById("infoBoard").classList.contains("notExisting")) {
                          document.getElementById("infoBoard").classList.remove("notExisting");
                        }
                        if(!(document.getElementById("infoBoard").classList.contains("existing"))){
                          document.getElementById("infoBoard").classList.add("existing");
                        }
                    } else {
                        region_content = region_content + "<span style='color: red;'><strong>未有非建制派候選人！</strong></span><br/>"
                        // style the detail Info for no contestants
                        if(document.getElementById("infoBoard").classList.contains("existing")) {
                          document.getElementById("infoBoard").classList.remove("existing");
                        }
                        if(!(document.getElementById("infoBoard").classList.contains("notExisting"))){
                          document.getElementById("infoBoard").classList.add("notExisting");
                        }
                    }
                    document.getElementById("region_content").innerHTML = region_content;
                    if (!!value.democrat_contestant) {
                        organzation_content = "<br/><strong>民間組織</strong><br/>";
                        $.each(value.organization, function(index, val) {
                          if (!!val.name) {organzation_content = organzation_content + "<u>" + val.name + "</u><br/>";}
                          if (!!val.webpage) {organzation_content = organzation_content + "網頁：<a target='_blank' href='" + val.webpage + "'>" + val.webpage + "</a><br/>";}
						  if (!!val.fbpage) {organzation_content = organzation_content + "Facebook：<a target='_blank' href='" + val.fbpage + "'>" + val.fbpage + "</a><br/>";}
						  if (!!val.instagram) {organzation_content = organzation_content + "Instagram：<a target='_blank' href='" + val.instagram + "'>" + val.instagram + "</a><br/>";}
                          if (!!val.telegram) {organzation_content = organzation_content + "Telegram：" + val.telegram + "<br/>";}
                          if (!!val.email) {organzation_content = organzation_content + "電郵：<a href='mailto:" + val.email + "'>" + val.email + "</a><br/>";}
                          if (!!val.whatsapp) {organzation_content = organzation_content + "Whatsapp：" + val.whatsapp + "<br/>";}
                          if (!!val.telephone) {organzation_content = organzation_content + "電話號碼：" + val.telephone + "<br/>";}
                          organzation_content = organzation_content + "<br/>";
                        });
                    } else {
                      organzation_content = "<br/><strong>有意參選市民,請聯絡<a target='_blank' href='https://www.facebook.com/pg/反自動當選運動-2510455555631639'>反自動當選運動</a></strong><br/>";
                    }
                    document.getElementById("organzation_content").innerHTML = organzation_content;
                    popup.setLatLng(e.latlng).setContent(region_content + organzation_content).openOn(map);
                }
            });
        });
    } else {
		$("#infoBoard").css("border-color", "#FFFFFF");
		$("#detailInfo").hide();
		$("#entry_status").show();
		showRegions("./boundary.json", false);
	}
}
