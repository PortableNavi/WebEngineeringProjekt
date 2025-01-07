export {Exercise, fetch_exercises, parse_exercise, get_exercise};


const EXERCISE_REG = new Map();


class Exercise
{
  constructor(id, title, desc, task_source, solution_type, source)
  {
    if (!id) throw new Error("Exercise Id was blank");
    if (!title) throw new Error("Exercise Title was blank");
    if (!desc) throw new Error("Exercise Description was blank");
    if (!task_source) throw new Error("Exercise TaskSource was blank");
    if (!solution_type) throw new Error("Exercise SolutionType was blank");
    if (!source) throw new Error("Exercise Source was blank");

    this.$id = id;
    this.$title = title;
    this.$desc = desc;
    this.$task_source = task_source;
    this.$solution_type = solution_type;
    this.$source = source;
    this.$task_text = "";
  }

  get id() {return this.$id;}
  get title() {return this.$title;}
  get desc() {return this.$desc;}
  get task_text() {return this.$task_text;}
  get solution_type() {return this.$solution_type;}

  async load_source()
  {
    let data;

    try
    {
      data = await fetch(this.$task_source);

      if (this.$type == "json") data = await data.json(); 
      else data = await data.text();
    }

    catch (e)
    {
      console.error("Error while loading solution source: "+e);
      return;
    }

    this.$task_text = data;
  }

  mini_template(solutions)
  {
    const template = document.querySelector("#miniExTemplate");
    const t = template.content.cloneNode(true);

    t.querySelector(".miniExId").textContent = this.id;
    t.querySelector(".miniExTitle").textContent = this.title;
    t.querySelector(".miniExDesc").textContent = this.desc;
    
    t.querySelector(".miniExSource")
      .setAttribute("href", `exercise_view.html?source=${this.$source}`);

    if (solutions) solutions.forEach(sol => {
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
}


// Fetches all exercises from a file listing all exercise sources.
// This function ensures, that each exercise fetches has a unique id.
async function fetch_exercises(file) 
{
  let data;

  try {
    data = await fetch(file);
    data = await data.json();
  }

  catch (e) {
    console.error("Error while fetching exercise sources: "+e);
    return [];
  }

  data = data["sources"]
    .map(d => {
      return parse_exercise(d)
        .then(ex => {
          if (EXERCISE_REG.get(ex.id)) 
          throw new Error(`Exercise Id ${ex.id} already exists`);

          EXERCISE_REG.set(ex.id, ex);
          return ex;
        })
        .catch(e => {
          console.log("Error while fetching exercise sources: "+e);
        });
      }
    );

  return Promise.all(data);
}


async function parse_exercise(file)
{
  try {
    let data = await fetch(file);
    data = await data.json();
    const ex = new Exercise(
      data["id"],
      data["title"],
      data["description"],
      data["task_source"],
      data["solution_type"],
      file,
    );

    await ex.load_source();
    return ex;
  }

  catch (e) {
    console.error("Error while parsing exercise data: "+e);
    return null;
  }
}


function get_exercise(id)
{
  return EXERCISE_REG.get(id);
}
