import {parse_exercise} from "./mods/exercise.js";


// Set the exercise list items to the exercise data once the dom has loaded...
document.addEventListener("DOMContentLoaded", function() {
  solution();
});


async function solution()
{
  const params = new URLSearchParams(window.location.search);
  const source = params.get("source");

  const exercise = await parse_exercise(source);

  if (!exercise)
  {
    console.error("Failed to parse exercise because");
    window.location.replace("index.html");
  }

  document.querySelector(".exTitle").textContent = exercise.title;
  document.querySelector(".exId").textContent = exercise.id;
  document.querySelector(".exTask").innerHTML = exercise.task_text;
}

