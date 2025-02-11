var _a, _b, _c;
/*eslint-disable */
const locations = JSON.parse((_c = (_b = (_a = document.getElementById("map")) === null || _a === void 0 ? void 0 : _a.dataset) === null || _b === void 0 ? void 0 : _b.locations) !== null && _c !== void 0 ? _c : "[]");
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
//# sourceMappingURL=mapbox.js.map