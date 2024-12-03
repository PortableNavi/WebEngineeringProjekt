const partner_data = fetch_partner_data("assets/partner.json");


document.addEventListener("DOMContentLoaded", function() {
  onload();
});


class Partner
{
  constructor(name, orga, desc)
  {
    if (!name) throw new Error("Partner name was blank");
    if (!orga) throw new Error("Partner organisation was blank");
    if (!desc) throw new Error("Partner description was blank");

    this.$name = name;
    this.$orga = orga;
    this.$desc = desc;
  }

  get name() {return this.$name;}
  get orga() {return this.$orga;}
  get desc() {return this.$desc;}
}


async function fetch_partner_data(file) 
{
  let data;

  try {
    data = await fetch(file);
    data = await data.json();
  }

  catch (e) {
    console.error("Error while fetching partner data: "+e);
    return [];
  }

  data = data["partners"].map(d => {
    try {
      return new Partner(d["name"], d["orga"], d["desc"])
    }

    catch (e) {
      console.log("Error while parsing partner data "+e);
      return null;
    }
  });


  const template = document.querySelector("#partnerTemplate");

  return data
    .filter(e => e)
    .map(e => {
      const t = template.content.cloneNode(true);
      t.querySelector(".partnerName").textContent = e.name;
      t.querySelector(".partnerOrga").textContent = e.orga;
      t.querySelector(".partnerDesc").textContent = e.desc;
      return t;
    })
}


function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function onload() 
{
  // Just to test the async loading of the partner data...;
  await sleep(100);
  console.log(partner_data); // This should be in a nested fulfilled promise, that was resolved while the page loaded...
  await sleep(1000);

  const data = await partner_data;
  const list = document.querySelector(".partnerList");
  list.innerHTML = "";
  data.forEach(d => list.appendChild(d));
}


