  mapboxgl.accessToken = mapToken;
    
	mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
        zoom: 9,
        center:  coordinates ,// starting position[lng,lat]
    });
    const marker = new mapboxgl.Marker({color:"red"})
        .setLngLat(coordinates)//listing geometry.coordinate
        .setPopup(
         new mapboxgl.Popup({ offset:25 })
        .setHTML(`<p>Exact location will be provided after booking</P>`)
        )
        .addTo(map);
