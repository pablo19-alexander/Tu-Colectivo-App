useEffect(() => {
  async function loadGeoJson() {
    try {
      const response = await fetch(
        "http://localhost:8081/assets/assets/Routes/Ruta106.geojson"
      );
      const json = await response.json();
      setRouteData(json);
    } catch (error) {
      console.error("Error cargando GeoJSON:", error);
    }
  }
  loadGeoJson();
}, []);
