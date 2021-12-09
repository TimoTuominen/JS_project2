let nappi1 = document.getElementById("nappi1");
let taulukko = document.getElementById("taulukko");

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

      if (xmlStr == "<Theatre>" + valittuTeatteri + "</Theatre>") {
        const elokuvanNimi = xml.getElementsByTagName("Title").item(i);
        const elokuvanNimiStr = serializer.serializeToString(elokuvanNimi);
        const elokuvanNimiClean = elokuvanNimiStr.replace(
          /<\/?[^>]+(>|$)/g,
          ""
        );

        const kuvalinkki = xml
          .getElementsByTagName("EventSmallImagePortrait")
          .item(i);
        const kuvalinkkiStr = serializer.serializeToString(kuvalinkki);
        const kuvalinkkiClean = kuvalinkkiStr.replace(/<\/?[^>]+(>|$)/g, "");

        const esitysaika = xml.getElementsByTagName("dttmShowStart").item(i);
        const esitysaikaStr = serializer.serializeToString(esitysaika);
        const esitysaikaClean = esitysaikaStr.replace(/<\/?[^>]+(>|$)/g, "");
        const esitysaikaErikseen = esitysaikaClean.split("T");
        const esitysaikaKellonaika = esitysaikaErikseen[1].slice(0, 5);

        const sali = xml.getElementsByTagName("TheatreAuditorium").item(i);
        const saliStr = serializer.serializeToString(sali);
        const saliClean = saliStr.replace(/<\/?[^>]+(>|$)/g, "");

        taulukko.insertAdjacentHTML(
          "beforeend",
          `<tr><td  width="200"><img src="${kuvalinkkiClean}" alt="${kuvalinkkiStr}"> </td> <td> ${elokuvanNimiClean} <br>Esitysaika: <br> ${esitysaikaErikseen[0]} 
          Klo:  ${esitysaikaKellonaika} <br> Esityspaikka: ${saliClean} </td></tr>`
        );
        //teksti.innerHTML += `<li><span><img src="${cleanText}" alt="${xmlStr2}">${xmlStr}</span></li>`;
      }
    }

    //  tulos[0].getElementsByTagName("ID")[0].childNodes[0].nodeValue;
  })
  .catch(console.error);
