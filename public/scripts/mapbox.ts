/*eslint-disable */
const locations = JSON.parse(
  document.getElementById("map")?.dataset?.locations ?? "[]"
);
// const mapbox = Script;
mapboxgl.accessToken =
  "pk.eyJ1IjoidGFraWUtZWxkZWVuIiwiYSI6ImNtNm01ODUwcDBnM3QybXBiaTlzdW1iN2YifQ.szTnPu8i6IMPBaIkVRgi7A";

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  scrollZoom: false,
  //   center: [-74.5, 40], // starting position [lng, lat]
  //   zoom: 9, // starting zoom
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((location) => {
  const el = document.createElement("div");
  el.className = "marker";
  new mapboxgl.Popup({
    offset: 40,
  })
    .setLngLat(location.coordinates)
    .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
    .addTo(map);

  new mapboxgl.Marker({
    element: el,
    anchor: "bottom",
  })
    .setLngLat(location.coordinates)
    .addTo(map);
  bounds.extend(location.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 200,
    left: 100,
    right: 100,
  },
});
