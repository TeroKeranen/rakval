

// Selvitetään tällä hetkellä käytössä olevan markerNumber arvon ja kasvatetaan sitä yhdellä uutta markeria varten.
// Käytössä FloorplanScreen.js
export const calculateNextMarkerNumber = (markers) => {
    let maxMarkerNumber = 0;

    if (markers && markers.length > 0) {
        maxMarkerNumber = Math.max(...markers.map(marker => marker.markerNumber))
      }
      return maxMarkerNumber + 1;
}