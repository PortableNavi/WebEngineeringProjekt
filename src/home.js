import {fetch_exercises} from "./mods/exercise.js";
import {fetch_solutions, get_last_attempt_for_exercise} from "./mods/solution.js";


// Set the exercise list items to the exercise data once the dom has loaded...
document.addEventListener("DOMContentLoaded", function() {
  build_table();
});


// Start loading exercise/solution data right as this module loads...
const exercise_data = fetch_exercises("data/exercises.json");
const solution_data = fetch_solutions("data/solutions.json");


async function build_table()
{
  const table = document.querySelector(".exTableBody");

  // Wait for solutions and exercises to be loaded before listing them...  
  let [exercises] = await Promise.all([exercise_data, solution_data]);

  // Filter out any errors...
  exercises = exercises.filter(ex => ex);

  const template = document.querySelector("#table_row");

  exercises.sort((a, b) => a.id - b.id)
    .forEach(e => {
      let solution = get_last_attempt_for_exercise(e.id);
      const attempt = (solution != null) ? solution.attempt : "-";
      const abgabe = (solution != null) ? solution.date : "-";

      const t = template.content.cloneNode(true);

      const tr_versuche = t.querySelector(".tr_versuche");
      const tr_title = t.querySelector(".tr_title");

      t.querySelector(".tr_nr").textContent = e.id;
      tr_title.textContent = e.title;
      t.querySelector(".tr_thema").textContent = e.thema;
      t.querySelector(".tr_folien").textContent = e.folien;
      t.querySelector(".tr_art").textContent = e.solution_type;
      tr_versuche.textContent = attempt;
      t.querySelector(".tr_abgabe").textContent = abgabe;

      tr_title.setAttribute("href", `exercise_view.html?source=${e.source}`)

      if (solution != null) 
        tr_versuche.setAttribute("href", `solution_view.html?source=${solution.details_source}`);
      else tr_versuche.classList.add("linkOff");

      table.appendChild(t);
    });
}
