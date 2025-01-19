export {Exercise, fetch_exercises, parse_exercise, get_exercise};


const EXERCISE_REG = new Map();


class Exercise
{
  constructor(id, title, desc, task_source, solution_type, thema, folien, source)
  {
    if (!id) throw new Error("Exercise Id was blank");
    if (!title) throw new Error("Exercise Title was blank");
    if (!desc) throw new Error("Exercise Description was blank");
    if (!task_source) throw new Error("Exercise TaskSource was blank");
    if (!solution_type) throw new Error("Exercise SolutionType was blank");
    if (!source) throw new Error("Exercise Source was blank");
    if (!thema) throw new Error("Thema was blank");
    if (!folien) throw new Error("Folien was blank");

    this.$id = id;
    this.$title = title;
    this.$desc = desc;
    this.$task_source = task_source;
    this.$solution_type = solution_type;
    this.$source = source;
    this.$task_text = "";
    this.$thema = thema;
    this.$folien = folien;
  }

  get id() {return this.$id;}
  get title() {return this.$title;}
  get desc() {return this.$desc;}
  get task_text() {return this.$task_text;}
  get solution_type() {return this.$solution_type;}
  get thema() {return this.$thema;}
  get folien() {return this.$folien}
  get source() {return this.$source}

  async load_source()
  {
    let data;

    try
    {
      data = await fetch(this.$task_source);

      if (!data.ok) 
        throw new Error(`Failed to fetch from {this.$task_source}`);

      if (this.$type == "json") 
        data = await data.json(); 
      
      else data = await data.text();
    }

    catch (e)
    {
      console.error("Error while loading solution source: "+e);
      return;
    }

    this.$task_text = data;
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
      data["thema"],
      data["folien"],
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
