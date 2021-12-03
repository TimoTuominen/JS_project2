let nappi1 = document.getElementById("nappi1");
let teksti = document.getElementById("teksti");

const getLanguage = fetch("https://www.finnkino.fi/xml/TheatreAreas/")
  .then((response) => response.text())
  .then((data) => {
    const parser = new DOMParser();
    const serializer = new XMLSerializer();

    const xml = parser.parseFromString(data, "application/xml");
    let pituus = xml.getElementsByTagName("TheatreArea").length;
    console.log(pituus);
    for (let i = 0; i < pituus; i++) {
      let tulos = xml.getElementsByTagName("TheatreArea").item(i);

      const xmlStr = serializer.serializeToString(tulos);
      //console.log(xmlStr);
      let char = xmlStr.charAt(0);
      teksti.innerHTML += `<li><span>${char}</span></li>`;
      teksti.innerHTML += `<li><span>${xmlStr}</span></li>`;
    }

    //let tulosString = xml.toXMLString();
    //teksti.innerHTML = tulosString;
    //teksti.innerHTML =
    //  tulos[0].getElementsByTagName("ID")[0].childNodes[0].nodeValue;
    //teksti.innerHTML = tulosString;
  })
  .catch(console.error);

//teksti.innerHTML = tulos[0];
//console.log(getLanguage);

//const request = fetch("https://www.finnkino.fi/xml/TheatreAreas/");

//console.log(request);
