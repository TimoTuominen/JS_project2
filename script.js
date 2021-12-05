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
        let elokuvanNimi = xml.getElementsByTagName("Title").item(i);
        let elokuvanNimiStr = serializer.serializeToString(elokuvanNimi);
        let elokuvanNimiClean = elokuvanNimiStr.replace(/<\/?[^>]+(>|$)/g, "");
        let kuvalinkki = xml
          .getElementsByTagName("EventSmallImagePortrait")
          .item(i);
        const kuvalinkkiStr = serializer.serializeToString(kuvalinkki);
        let kuvalinkkiClean = kuvalinkkiStr.replace(/<\/?[^>]+(>|$)/g, "");
        taulukko.insertAdjacentHTML(
          "beforeend",
          `<tr><td><img src="${kuvalinkkiClean}" alt="${kuvalinkkiStr}"> </td> <td> ${elokuvanNimiClean} </td></tr>`
        );
        //teksti.innerHTML += `<li><span><img src="${cleanText}" alt="${xmlStr2}">${xmlStr}</span></li>`;
      }
    }

    //  tulos[0].getElementsByTagName("ID")[0].childNodes[0].nodeValue;
  })
  .catch(console.error);
