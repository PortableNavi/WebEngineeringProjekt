import { fetch_exercises } from "./mods/exercise.js";


// Start loading exercise data right as this module loads...
const exercise_data = fetch_exercises("assets/exercises.json");


// Set the exercise list items to the exercise data once the dom has loaded...
document.addEventListener("DOMContentLoaded", function() {
  build_mini_ex_list();
});


function build_mini_ex_list()
{
  const list = document.querySelector(".miniExList");

  exercise_data.then(exercises => { 
    exercises = exercises.filter(ex => ex);
    if (exercises.length > 0) list.innerHTML = "";

    exercises
      .forEach(ex => {
        const li = document.createElement("li");
        li.appendChild(ex.mini_template());
        list.appendChild(li);
    });
  });
}

