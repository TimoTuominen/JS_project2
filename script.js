//let nappi1 = document.getElementById("nappi1");
let taulukko = document.getElementById("taulukko");
let haeLeffat = document.getElementById("haeLeffat");
let teatteriValinta = document.getElementById("teatteritValinta");
//let valittuTeatteri = teatteriValinta.options[teatteriValinta.selectedIndex].value;
let valintaTeksti = teatteriValinta.options[teatteriValinta.selectedIndex].text;

let elokuvahaku = function () {
  fetch("https://www.finnkino.fi/xml/Schedule/")
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
        let valittuTeatteri =
          teatteriValinta.options[teatteriValinta.selectedIndex].value;

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
            `<tr><td  width="200"><img src="${kuvalinkkiClean}" alt="${kuvalinkkiStr}"> </td> <td><h4 id=elokuva${i}> ${elokuvanNimiClean} </h4><br>Esitysaika: ${esitysaikaErikseen[0]} 
          Klo:  ${esitysaikaKellonaika} <br> Esityspaikka: ${saliClean} </td></tr> <td><button class="btn btn-success" type="submit" id="nappi${i}">
          Search
        </button></td> `
          );

          let haeTietokannasta = document.getElementById("nappi" + i);
          haeTietokannasta.addEventListener("click", function () {
            let omdbHaku = function () {
              fetch("http://www.omdbapi.com/?apikey=bf626253&t=West+Side+Story")
                .then((response) => response.json())
                .then((data) => haeOMDB(data));
            };
            omdbHaku();
          });
        }
      }
    })
    .catch(console.error);
};

function haeOMDB(data) {
  alert(data.Title);
}
// elokuvahaku();
haeLeffat.addEventListener("click", function () {
  taulukko.innerHTML = "";
  elokuvahaku();
  event.preventDefault();
});
