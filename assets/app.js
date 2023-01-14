const searchForm = document.querySelector(".searchForm");
const ipcode = document.querySelector(".ipcode");
const iplocation = document.querySelector(".iplocation");
const timezone = document.querySelector(".timezone");
const userIsp = document.querySelector(".userIsp");
const infoDivs = document.querySelectorAll('.info div');
let map = L.map("map");
const mapMarkers = [];

window.onload = () => {
  updateMapAndMarker(40.7128, -74.006);
  updateInfo("69, 69, 100", "New York, City", "utc-05:00", "Verizon");
};

searchForm.addEventListener("submit", searchForIP);

function searchForIP(e) {
  e.preventDefault();
  if (e.target[0].value === "") {
    alert("Enter a zipcode");
    return;
  }
  makeRequest(e.target[0].value.toString().trim());
  e.target[0].value = "";
}

async function makeRequest(userIP) {
  try {
    const res = await axios.get(
      `https://geo.ipify.org/api/v2/country,city?apiKey=at_TWe3JN8mbYbyYmY5ZaDyCkEYagOPC&ipAddress=${userIP}`
    );
    const { ip, isp, location } = res.data;
    const { lat, lng } = res.data.location;
    let ipLocation = `${location.region}, ${location.country}`;
    updateInfo(ip, ipLocation, location.timezone, isp);
    removeLastMarker(mapMarkers);
    updateMapAndMarker(lat, lng);
  } catch (e) {
    console.log(e);
    alert("Something went wrong");
  }
}

function updateMapAndMarker(lat, long) {
  let marker = L.marker([lat, long]).addTo(map);
  mapMarkers.push(marker);
  map.setView([lat, long], 13);
}

function removeLastMarker(markers) {
  if (markers.length > 0) map.removeLayer(markers[markers.length - 1]);
}

function updateInfo(ip, location, ipTimezone, userIsp) {
  ipcode.innerText = ip;
  iplocation.innerText = location;
  timezone.innerText = ipTimezone;
  userIsp.innerText = userIsp;
}

function createElement(title, message) {
  const div = document.createElement('div');
  const h3 = document.createElement('h3');
  const p = document.createElement('p');
  h3.append(title);
  p.append(message);
  div.append(h3);
  div.append(p);
  return div;
}


// ..displaying map
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);
