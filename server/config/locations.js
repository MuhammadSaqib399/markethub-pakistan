/**
 * Pakistan Locations Data
 * Province and city mapping for location-based filtering
 */
const locations = {
  Punjab: [
    "Lahore", "Rawalpindi", "Faisalabad", "Multan", "Gujranwala",
    "Sialkot", "Bahawalpur", "Sargodha", "Sahiwal", "Sheikhupura",
    "Gujrat", "Jhelum", "Rahim Yar Khan", "Kasur", "Dera Ghazi Khan",
    "Mianwali", "Chiniot", "Attock", "Bhakkar", "Khanewal",
  ],
  Sindh: [
    "Karachi", "Hyderabad", "Sukkur", "Larkana", "Nawabshah",
    "Mirpur Khas", "Thatta", "Jacobabad", "Shikarpur", "Khairpur",
  ],
  "Khyber Pakhtunkhwa": [
    "Peshawar", "Mardan", "Abbottabad", "Swat", "Kohat",
    "Dera Ismail Khan", "Haripur", "Bannu", "Charsadda", "Mansehra",
  ],
  Balochistan: [
    "Quetta", "Gwadar", "Turbat", "Khuzdar", "Hub",
    "Chaman", "Sibi", "Zhob", "Loralai", "Dera Bugti",
  ],
  "Islamabad Capital Territory": ["Islamabad"],
  "Azad Kashmir": [
    "Muzaffarabad", "Mirpur", "Bhimber", "Kotli", "Rawalakot",
  ],
  "Gilgit-Baltistan": [
    "Gilgit", "Skardu", "Hunza", "Chilas", "Ghizer",
  ],
};

module.exports = locations;
