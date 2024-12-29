export {Exercise, fetch_exercises};


class Exercise
{
  constructor(id, title, desc, task_text, solution_type, source)
  {
    if (!id) throw new Error("Exercise Id was blank");
    if (!title) throw new Error("Exercise Title was blank");
    if (!desc) throw new Error("Exercise Description was blank");
    if (!task_text) throw new Error("Exercise TaskText was blank");
    if (!solution_type) throw new Error("Exercise SolutionType was blank");
    if (!source) throw new Error("Exercise Source was blank");

    this.$id = id;
    this.$title = title;
    this.$desc = desc;
    this.$task_text = task_text;
    this.$solution_type = solution_type;
    this.$source = source;
  }

  get id() {return this.$id;}
  get title() {return this.$title;}
  get desc() {return this.$desc;}
  get task_text() {return this.$task_text;}
  get solution_type() {return this.$solution_type;}

  mini_template()
  {
    const template = document.querySelector("#miniExTemplate");
    const t = template.content.cloneNode(true);

    t.querySelector(".miniExId").textContent = this.id;
    t.querySelector(".miniExTitle").textContent = this.title;
    t.querySelector(".miniExDesc").textContent = this.desc;
    return t;
  }
}


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
      try {
        return parse_exercise(d)
      }

      catch (e) {
        console.log("Error while fetching exercise sources: "+e);
        return null;
      }
    })

  return Promise.all(data);
}


async function parse_exercise(file)
{
  let data;

  try {
    data = await fetch(file);
    data = await data.json();
    return new Exercise(
      data["id"],
      data["title"],
      data["description"],
      data["task_text"],
      data["solution_type"],
      file,
    )
  }

  catch (e) {
    console.error("Error while parsing exercise data: "+e);
    return null;
  }
}

