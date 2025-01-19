import {fetch_exercises} from "./mods/exercise.js";
import {fetch_solutions, get_solutions_for_exercise} from "./mods/solution.js";


// Set the exercise list items to the exercise data once the dom has loaded...
document.addEventListener("DOMContentLoaded", function() {
  build_mini_ex_list();
});


// Start loading exercise/solution data right as this module loads...
const exercise_data = fetch_exercises("data/exercises.json");
const solution_data = fetch_solutions("data/solutions.json");


async function build_mini_ex_list()
{
  const list = document.querySelector(".miniExList");

  // Wait for solutions and exercises to be loaded before listing them...  
  let [exercises] = await Promise.all([exercise_data, solution_data]);

  exercises = exercises.filter(ex => ex);
  if (exercises.length > 0) list.innerHTML = "";

  exercises.sort((a, b) => a.id - b.id)
    .forEach(ex => {
      const li = document.createElement("li");
      li.appendChild(mini_template(ex, get_solutions_for_exercise(ex.id)));
      list.appendChild(li);
  });
}


function mini_template(ex, solutions)
{
  const template = document.querySelector("#miniExTemplate");
  const t = template.content.cloneNode(true);

  t.querySelector(".miniExId").textContent = ex.id;
  t.querySelector(".miniExTitle").textContent = ex.title;
  t.querySelector(".miniExDesc").textContent = ex.desc;
  
  t.querySelector(".miniExSource")
    .setAttribute("href", `exercise_view.html?source=${ex.source}`);

  if (solutions) solutions.sort((a, b) => a.attempt - b.attempt)
    .forEach(sol => {
      const sol_template = document.querySelector("#solTemplate");
      const solt = sol_template.content.cloneNode(true);
      solt.querySelector(".solDate").textContent = sol.date;
      solt.querySelector(".solAttempt").textContent = sol.attempt;
      
    solt.querySelector(".solDetailSource")
      .setAttribute("href", `solution_view.html?source=${sol.details_source}`);
    
    t.querySelector(".miniExSolutions").appendChild(solt);
  });

  return t;
}

