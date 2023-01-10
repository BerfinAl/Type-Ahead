const endpoint =
  "https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json";

let cities = [];

fetch(endpoint)
  .then((res) => res.json())
  .then((data) => cities.push(...data))
  .catch((er) => console.log(er, "error"));

function matchedCities(userInput) {
  const regEx = new RegExp(userInput, "gi");
  return cities.filter(
    (city) => city.city.match(regEx) || city.state.match(regEx)
  );
}

const suggestions = document.querySelector(".cities");
const infoBox = document.querySelector(".info");

function showCities(e) {
  const places = matchedCities(e.target.value);
  const html = places
    .map((place) => {
      const regex = new RegExp(e.target.value, "gi");
      const cityName = place.city.replace(
        regex,
        `<span class="hl">${e.target.value}</span>`
      );
      const stateName = place.state.replace(
        regex,
        `<span class="hl">${e.target.value}</span>`
      );
      const population = Number(place.population).toLocaleString();
      return ` <div class="city">
  <span>${cityName}, ${stateName}</span> <span> ${population} </span> </div>`;
    })
    .join("");
  suggestions.innerHTML = html;
  if (e.target.value === "")
    suggestions.innerHTML = `<div class="city">Filter for a city</div>
<div class="city">or a state</div> `;
  infoBox.classList.remove("active");
}

function handleClick(e) {
  console.log(e.target.innerText);
  const str = e.target.innerText.toLowerCase().split(",")[0];
  console.log(str);
  const found = cities.find((city) => city.city.toLowerCase() === str);
  console.log(found);
  const html = `
        <h3> ${found.city.toUpperCase()}, ${found.state.toUpperCase()} </h3>
<hr>
        <ul class="details"> 
          <li> <span class="property"> Growth from 2000 to 2013:</span>  ${
            found.growth_from_2000_to_2013
          } </li>
          <li> <span class="property"> Latitude:</span>  ${found.latitude} </li>
          <li> <span class="property"> Longitude: </span> ${
            found.longitude
          } </li>
          <li> <span class="property"> Population:</span>  ${Number(
            found.population
          ).toLocaleString()} </li>
        </ul>
     `;
  infoBox.classList.add("active");
  infoBox.innerHTML = html;
}

function showInfo() {
  const allMatched = [...suggestions.children];
  allMatched.map((match) => {
    match.addEventListener("click", handleClick);
  });
}

document.querySelector(".search").addEventListener("input", (e) => {
  showCities(e);
  showInfo();
});
