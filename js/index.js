//Functions
function showRegions(path, toDraw) {
  $.getJSON(path, function (data) {
	  var demPartyRegions = 0;
      var demIndependentRegions = 0;
      $.each(data, function (index, value) {
          if (value.contestStatus == "PARTY") {
              if(toDraw){L.polygon([value.points], { className: value.code, color: "#FFFF00" }).addTo(map);}
              demPartyRegions = demPartyRegions + 1;
          } else if (value.contestStatus == "INDPNT") {
			  if(toDraw){L.polygon([value.points], { className: value.code, color: "#FFCC00" }).addTo(map);}
              demIndependentRegions = demIndependentRegions + 1;
		  } else { //value.contestStatus == "ESTAB"
			  if(toDraw){L.polygon([value.points], { className: value.code}).addTo(map);}
          }
      });
	  
	  var defaultText = "<p class='defaultText'><u>勿忘五大訴求</u><br/>完全撤回逃犯修例<br/>撤銷6月12日暴動定性<br/>撤銷反送中抗爭者控罪<br/>成立獨立調查委員會<br/>立即實行雙普選</p>";
	  
      $("#entry_status").html("在全部452位民選區議員中,來自<span style='background-color: #FFFF00' title='民主黨(91)、公民黨(32)、民協(19)、新民主同盟(19)、工黨(7)、街工(4)、社民連(2)、人民力量(1)、熱血公民(2)'><strong>民主派政黨</strong></span>共" + demPartyRegions.toString() + "位,來自<span style='background-color: #FFCC00'><strong>民主派地區組織或獨立人士</strong></span>共" + demIndependentRegions.toString() + "位,來自<span style='background-color: #ADD8E6'><strong>非民主派</strong></span>共" + (452-demPartyRegions-demIndependentRegions).toString() + "位。" + "<br/><br/>"+ defaultText);
  });
}

//Center of HK for use
var map = L.map('mapid').setView([22.354554, 114.161682], 11);

//Base Map from OpenStreetMap
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
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
                    "選區名稱：" + value.name + "<br/>";
					
                    if (value.contestStatus == "ESTAB") {
                        if(!value.democrat_contestant){
							region_content = region_content + "<span style='color: red;'><strong>未有民主派社區幹事！</strong></span><br/>"
						} else {
							region_content = region_content + "民主派社區幹事：" + value.democrat_contestant + " (" + value.democrat_organization + ")<br/>";
						}
                        // style the detail Info for estab regions
                        if(document.getElementById("infoBoard").classList.contains("demParty")) {
                          document.getElementById("infoBoard").classList.remove("demParty");
                        }
						if(document.getElementById("infoBoard").classList.contains("demIndependent")) {
                          document.getElementById("infoBoard").classList.remove("demIndependent");
                        }
                        if(!(document.getElementById("infoBoard").classList.contains("estab"))){
                          document.getElementById("infoBoard").classList.add("estab");
                        }
                    } else if (value.contestStatus == "PARTY"){ 
                        region_content = region_content + "民主派區議員：" + value.democrat_contestant + " (" + value.democrat_organization + ")<br/>";
                        // style the detail Info for no contestants
                        if(document.getElementById("infoBoard").classList.contains("estab")) {
                          document.getElementById("infoBoard").classList.remove("estab");
                        }
						if(document.getElementById("infoBoard").classList.contains("demIndependent")) {
                          document.getElementById("infoBoard").classList.remove("demIndependent");
                        }
                        if(!(document.getElementById("infoBoard").classList.contains("demParty"))){
                          document.getElementById("infoBoard").classList.add("demParty");
                        }
                    } else if (value.contestStatus == "INDPNT"){
						region_content = region_content + "民主派區議員：" + value.democrat_contestant + " (" + value.democrat_organization + ")<br/>";
                        // style the detail Info contesetants
                        if(document.getElementById("infoBoard").classList.contains("estab")) {
                          document.getElementById("infoBoard").classList.remove("estab");
                        }
						if(document.getElementById("infoBoard").classList.contains("demParty")) {
                          document.getElementById("infoBoard").classList.remove("demParty");
                        }
                        if(!(document.getElementById("infoBoard").classList.contains("demIndependent"))){
                          document.getElementById("infoBoard").classList.add("demIndependent");
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
                          if (!!val.telegram) {organzation_content = organzation_content + "Telegram：<a target='_blank' href='" + val.telegram + "'>" + val.telegram + "</a><br/>";}
						  if (!!val.youtube) {organzation_content = organzation_content + "Youtube：<a target='_blank' href='" + val.youtube + "'>" + val.youtube + "</a><br/>";}
                          if (!!val.email) {organzation_content = organzation_content + "電郵：<a href='mailto:" + val.email + "'>" + val.email + "</a><br/>";}
                          if (!!val.whatsapp) {organzation_content = organzation_content + "Whatsapp：" + val.whatsapp + "<br/>";}
                          if (!!val.telephone) {organzation_content = organzation_content + "電話號碼：" + val.telephone + "<br/>";}
                          organzation_content = organzation_content + "<br/>";
                        });
                    } else {
						organzation_content = "";
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
		map.setView([22.354554, 114.161682], 11);
		showRegions("./boundary.json", false);
	}
}
