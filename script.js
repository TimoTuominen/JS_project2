let taulukko = document.getElementById("taulukko"); // Muuttujien alustus ja elementtien haku
let haeLeffat = document.getElementById("haeLeffat");
let teatteriValinta = document.getElementById("teatteritValinta");
let ylataulukko = document.getElementById("ylataulukko");
let hakukentta = document.getElementById("hakukentta");
let haeOMDBLeffat = document.getElementById("haeOMDBLeffat");
let valintaTeksti = teatteriValinta.options[teatteriValinta.selectedIndex].text; // haetaan kentässä oleva arvo

let elokuvahaku = function () {
  // Tehdään funktio tietojen noutoa varten
  let valintaValue =
    teatteriValinta.options[teatteriValinta.selectedIndex].value;
  alert(valintaValue);
  fetch(`https://www.finnkino.fi/xml/Schedule/?area=${valintaValue}`) // Tehdään haku Fetchiä käyttäen
    .then((response) => response.text()) // Käsitellään ensimmäinen lupaus then käskyllä
    .then((data) => {
      // käsitellään seuraava lupaus ja saatu data
      console.log(data);
      const parser = new DOMParser(); // Luodaan parseri XML tiedon käsittelyyn
      const serializer = new XMLSerializer(); // Luodaan Serializer XML:n muuttamiseksi tekstimuotoon

      const xml = parser.parseFromString(data, "application/xml"); // Tehdään saadusta datasta XML objekti
      let pituus = xml.getElementsByTagName("Theatre").length; // Pituus For looppia varten

      for (let i = 0; i < pituus; i++) {
        // Käydään tulokset läpi For loopilla
        let tulos = xml.getElementsByTagName("Theatre").item(i); // Otetaan elementit järjestyksessä käsittelyyn
        const xmlStr = serializer.serializeToString(tulos); // Muutetaan objekti string muotoon
        let valittuTeatteri =
          teatteriValinta.options[teatteriValinta.selectedIndex].text; // Haeataan select boxin arvo

        if (xmlStr == "<Theatre>" + valittuTeatteri + "</Theatre>") {
          // tarkistetaan onko kyseessä halutun teatterin näytös
          const elokuvanNimi = xml.getElementsByTagName("Title").item(i); // Haetaan elokuvan nimi
          const elokuvanNimiStr = serializer.serializeToString(elokuvanNimi); // Muutetaan nimi String muotoon
          const elokuvanNimiClean = elokuvanNimiStr.replace(
            // Poistetaan Stringistä tagit
            /<\/?[^>]+(>|$)/g,
            ""
          );

          const kuvalinkki = xml // Toistetaan yllä oleva kuvalinkille
            .getElementsByTagName("EventSmallImagePortrait")
            .item(i);
          const kuvalinkkiStr = serializer.serializeToString(kuvalinkki);
          const kuvalinkkiClean = kuvalinkkiStr.replace(/<\/?[^>]+(>|$)/g, "");

          const esitysaika = xml.getElementsByTagName("dttmShowStart").item(i); // Toistetaan ylläoleva esitysajalle
          const esitysaikaStr = serializer.serializeToString(esitysaika);
          const esitysaikaClean = esitysaikaStr.replace(/<\/?[^>]+(>|$)/g, "");
          const esitysaikaErikseen = esitysaikaClean.split("T");
          const esitysaikaKellonaika = esitysaikaErikseen[1].slice(0, 5);

          const sali = xml.getElementsByTagName("TheatreAuditorium").item(i); // Toistetaan ylläoleva salille
          const saliStr = serializer.serializeToString(sali);
          const saliClean = saliStr.replace(/<\/?[^>]+(>|$)/g, "");

          taulukko.insertAdjacentHTML(
            // lisätään haetut tiedot HTML documenttiin
            "beforeend",
            `<tr><td  width="200"><img src="${kuvalinkkiClean}" alt="${kuvalinkkiStr}"> </td> <td><h4 id=elokuva${i}> ${elokuvanNimiClean} </h4><br>Esitysaika: ${esitysaikaErikseen[0]} 
          Klo:  ${esitysaikaKellonaika} <br> Esityspaikka: ${saliClean} </td></tr> <td><button class="btn btn-success" type="submit" id="nappi${i}">
          Lisätietoja
        </button></td> `
          );

          let haeTietokannasta = document.getElementById("nappi" + i); //haetaan painonapin ID muuttujaan
          haeTietokannasta.addEventListener("click", function () {
            // Lisätään painonappiin toiminnaliisuutta painettaesssa
            let omdbHaku = function () {
              fetch(
                `http://www.omdbapi.com/?apikey=bf626253&t=${elokuvanNimiClean}`
              ) //tehdään funktio joka hakee OMDP apia käyttäen tiedot
                .then((response) => response.json()) // käsitellään ensimmäinen lupaus JSON:iksi
                .then((data) => lisaaOMDB(data)); // Käsitellään toinen lupaus, kutsutaan lisäysfunktiota
            };

            omdbHaku(); // Ajetaan funktio
          });
        }
      }
    })
    .catch(console.error); // Välitetään mahdolliset virheet konsoliin
};

haeOMDBLeffat.addEventListener("click", function () {
  //Lisätään kuuntelija hakukentän napille
  ylataulukko.innerHTML = ""; // Tyhjennetään tulostus alue
  let hakuteksti = hakukentta.value; // Haetaan hakukentän teksti
  let omdbHaku2 = function () {
    fetch(`http://www.omdbapi.com/?apikey=bf626253&t=${hakuteksti}`) //tehdään haku funktio OMDB tietoa varten
      .then((response) => response.json())
      .then((data) => lisaaOMDB(data)); // käsitellään kummatkin lupaukset
  };

  omdbHaku2(); // Kutsutaan haku funktiota
  event.preventDefault(); // Estetään sivun päivittyminen
});

function lisaaOMDB(data) {
  // Funktion OMDB tietojen lisäämiseen verkkosivulle
  ylataulukko.innerHTML = ""; // Tyhjennetään taulukko
  ylataulukko.insertAdjacentHTML(
    // Lisätään halutut tiedot
    "beforeend",
    `<tr><td>${data.Title}, Julkaistu: ${data.Released}</td><td text-align: left> Näyttelijät: ${data.Actors}</td></tr>
    <tr><td>Juoni: ${data.Plot} </td></tr> `
  );
}

haeLeffat.addEventListener("click", function () {
  // Funktio elokuvien hakuun paikkakunnittain
  taulukko.innerHTML = ""; // Tyhjennetään taulukko
  elokuvahaku(); // Kutsutaan tiedon haku funktiota
  event.preventDefault(); // Estetään sivun päivittyminen
});
