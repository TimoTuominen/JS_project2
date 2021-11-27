let nappi1 = document.getElementById("nappi1");

const getLanguage = fetch("https://www.finnkino.fi/xml/TheatreAreas/")
  .then((response) => response.text())
  .then((data) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(data, "text/xml");
    let tulos = xml.getElementsByTagName("ID");
    console.log(tulos[0]);
  })
  .catch(console.error);
//console.log(getLanguage);

//const request = fetch("https://www.finnkino.fi/xml/TheatreAreas/");

//console.log(request);
