import {parse_solution} from "./mods/solution.js";


// Set the exercise list items to the exercise data once the dom has loaded...
document.addEventListener("DOMContentLoaded", function() {
  solution();
});


async function get_solution()
{
  const params = new URLSearchParams(window.location.search);
  const source = params.get("source");

  const solution = await parse_solution(source);

  if (!solution)
  {
    console.error("Failed to parse solution because");
    window.location.replace("index.html");
  }
  
  return solution;
}


async function solution()
{
  const solution = await get_solution();
  
  document.querySelector(".solDate").textContent = solution.date;
  document.querySelector(".solAttempt").textContent = solution.attempt;

  if (solution.type == "code") display_code_solution(solution)

}


function display_code_solution(solution)
{
    const code_template = document.querySelector("#codeSolution");
    const code_row_template = document.querySelector("#codeRow");
    
    const t = code_template.content.cloneNode(true);
    t.querySelector(".solViewRaw").onclick = view_raw;
    
    for (const line of solution.data.split("\n"))
    {
      const row = code_row_template.content.cloneNode(true);
      row.querySelector(".codeRowData").textContent = line + " ";
      t.querySelector(".codeList").appendChild(row);
    }

    document.querySelector(".solContent").appendChild(t);
}


function view_raw()
{
  get_solution().then(s => window.open(s.source));
}

