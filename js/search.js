(function() {
  proj4.defs("EPSG:2326", "+proj=tmerc +lat_0=22.31213333333334 +lon_0=114.1785555555556 +k=1 +x_0=836694.05 +y_0=819069.8 +ellps=intl +towgs84=-162.619,-276.959,-161.764,0.067753,-2.24365,-1.15883,-1.09425 +units=m +no_defs");
  proj4.defs("EPSG:4326", "+proj=longlat +datum=WGS84 +no_defs");
  
  function convertCoord(x, y) {
    var coord = proj4('EPSG:2326', 'EPSG:4326', [x, y]);
    return [coord[1], coord[0]];
  }

  var marker = null;
  function search() {
    var q = $("#search_input").val();
    if (q.length == 0) return;
    $.ajax({
      url: "https://geodata.gov.hk/gs/api/v1.0.0/locationSearch?q=" + q,
    }).done(function(res) {
      if (res.length == 0) return;
      var coord = convertCoord(res[0].x, res[0].y);

      if (marker != null) {
        map.removeLayer(marker);
      };
      marker = L.marker(coord, {
        riseOnHover: true,
        bubblingMouseEvents: true,
      });
      marker.addTo(map);
    	map.setView(coord, 18);
    })
  }

  $(document).ready(function() {
    $("search_button").on("click", search)
    $("#search_input").on("keydown", function(e) {
      if(e.keyCode == 13) { // Enter
        search();
      }
    });
  });
})();
