// Initialize map at India's center
const map = L.map('map').setView([20.5937, 78.9629], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function addMarker(lat, lon, title) {
  L.marker([lat, lon]).addTo(map).bindPopup(title);
}

async function searchStation() {
  const input = document.getElementById('searchInput').value.trim();
  const output = document.getElementById('stationResults');
  output.innerHTML = "<p>Loading...</p>";

  if (!input) {
    output.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  // Simple city coordinates for demo
  const cities = {
    delhi: [28.6139, 77.2090],
    hyderabad: [17.3850, 78.4867],
    mumbai: [19.0760, 72.8777],
    bangalore: [12.9716, 77.5946],
    chennai: [13.0827, 80.2707]
    


  };

  const cityKey = input.toLowerCase();
  const coords = cities[cityKey];

  if (!coords) {
    output.innerHTML = "<p>City not found in demo list. Try Delhi, Mumbai, Hyderabad, etc.</p>";
    return;
  }

  const [lat, lon] = coords;
  map.setView([lat, lon], 12);

  const url = `https://api.openchargemap.io/v3/poi/?output=json&countrycode=IN&latitude=${lat}&longitude=${lon}&distance=20&maxresults=5&key=demo`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    output.innerHTML = "<h3>Nearby Charging Stations:</h3>";
    data.forEach(station => {
      const address = station.AddressInfo;
      output.innerHTML += `
        <div style="margin-bottom:10px;">
          <strong>${address.Title}</strong><br>
          ${address.AddressLine1 || ""}, ${address.Town || ""}, ${address.StateOrProvince || ""}<br>
          📍 ${address.Latitude}, ${address.Longitude}
        </div>
      `;
      addMarker(address.Latitude, address.Longitude, address.Title);
    });
  } catch (error) {
    output.innerHTML = "<p>Error fetching data. Try again later.</p>";
  }
}
