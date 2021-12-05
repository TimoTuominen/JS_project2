let nappi1 = document.getElementById("nappi1");
let teksti = document.getElementById("teksti");

let teatteriValinta = document.getElementById("teatteritValinta");
let valittuTeatteri =
  teatteriValinta.options[teatteriValinta.selectedIndex].value;
let valintaTeksti = teatteriValinta.options[teatteriValinta.selectedIndex].text;

console.log(valittuTeatteri);

const getLanguage = fetch("https://www.finnkino.fi/xml/Schedule/")
  .then((response) => response.text())
  .then((data) => {
    const parser = new DOMParser();
    const serializer = new XMLSerializer();

    const xml = parser.parseFromString(data, "application/xml");
    let pituus = xml.getElementsByTagName("Theatre").length;
    console.log(pituus);
    for (let i = 0; i < pituus; i++) {
      let tulos = xml.getElementsByTagName("Theatre").item(i);
      const xmlStr = serializer.serializeToString(tulos);
      console.log(xmlStr);
      console.log(tulos);
      if (xmlStr == "<Theatre>" + valittuTeatteri + "</Theatre>") {
        let tulos2 = xml
          .getElementsByTagName("EventSmallImagePortrait")
          .item(i);
        const xmlStr2 = serializer.serializeToString(tulos2);
        let cleanText = xmlStr2.replace(/<\/?[^>]+(>|$)/g, "");
        teksti.innerHTML += `<li><span><img src="${cleanText}" alt="${xmlStr2}">${xmlStr}</span></li>`;
      }

      //const xmlStr = serializer.serializeToString(tulos);
      //console.log(xmlStr);
      //let char = xmlStr.charAt(0);
      //teksti.innerHTML += `<li><span>${char}</span></li>`;
      //teksti.innerHTML += `<li><span>${xmlStr}</span></li>`;
    }

    //  tulos[0].getElementsByTagName("ID")[0].childNodes[0].nodeValue;
    //teksti.innerHTML = tulosString;
  })
  .catch(console.error);
