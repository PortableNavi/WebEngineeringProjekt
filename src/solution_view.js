import {parse_solution} from "./mods/solution.js";


// Set the exercise list items to the exercise data once the dom has loaded...
document.addEventListener("DOMContentLoaded", function() {
  solution();
});


async function solution()
{
  const params = new URLSearchParams(window.location.search);
  const source = params.get("source");

  const solution = await parse_solution(source);

  if (!solution)
  {
    console.error("Failed to parse solution because");
    window.location.replace("index.html");
  }

  document.querySelector(".solDate").textContent = solution.date;
  document.querySelector(".solAttempt").textContent = solution.attempt;

  if (solution.type == "code")
  {
    const template = document.querySelector("#codeSolution");
    const t = template.content.cloneNode(true);
    t.querySelector(".solutionContent").innerHTML = solution.data;
    document.querySelector(".solContent").appendChild(t);
  }

}

