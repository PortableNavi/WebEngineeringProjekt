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

  exercises
    .forEach(ex => {
      const li = document.createElement("li");
      li.appendChild(ex.mini_template(get_solutions_for_exercise(ex.id)));
      list.appendChild(li);
  });
}

