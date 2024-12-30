export {Solution, fetch_solutions, parse_solution, get_solutions_for_exercise};


const SOLUTION_REG = new Map();


class Solution
{
  constructor(type, exercise, attempt, date, source, details_source)
  {
    if (!type) throw new Error("Solution type was blank");
    if (!exercise) throw new Error("Solution exercise was blank");
    if (!attempt) throw new Error("Solution attempt was blank");
    if (!date) throw new Error("Solution date was blank");
    if (!source) throw new Error("Solution source was blank");
    if (!details_source) throw new Error("Solution details source was blank");

    this.$type = type;
    this.$exercise = exercise;
    this.$attempt = attempt;
    this.$date = date;
    this.$source = source;
    this.$details_source = details_source;
  }

  get type() {return this.$type;}
  get exercise() {return this.$exercise;}
  get attempt() {return this.$attempt;}
  get date() {return this.$date;}
  get data() {return this.$data;}
  get source() {return thissource;}
  get details_source() {return this.$details_source;}

  async load_source()
  {
    let data;

    try
    {
      data = await fetch(this.$source);

      if (this.$type == "json") data = await data.json(); 
      else data = await data.text();
    }

    catch (e)
    {
      console.error("Error while loading solution source: "+e);
      return;
    }

    this.$data = data;
  }
}


// Fetches all solutions from a file listing all solution sources.
async function fetch_solutions(file) 
{
  let data;

  try {
    data = await fetch(file);
    data = await data.json();
  }

  catch (e) {
    console.error("Error while fetching solution sources: "+e);
    return [];
  }

  data = data["sources"]
    .map(d => {
      return parse_solution(d)
        .then(sol => {
          let list = SOLUTION_REG.get(sol.exercise);

          if (!list)
          {
            list = [];
            SOLUTION_REG.set(sol.exercise, list);
          }

          list.push(sol);
        });
      }
    );

  return Promise.all(data);
}


async function parse_solution(file)
{
  try {
    let data = await fetch(file);
    data = await data.json();
    
    const sol = new Solution(
      data["type"],
      data["exercise"],
      data["attempt"],
      data["date"],
      data["source"],
      file,
    );

    await sol.load_source();
    return sol;
  }

  catch (e) {
    console.error("Error while parsing exercise data: "+e);
    return null;
  }
}


function get_solutions_for_exercise(id)
{
  return SOLUTION_REG.get(id);
}

