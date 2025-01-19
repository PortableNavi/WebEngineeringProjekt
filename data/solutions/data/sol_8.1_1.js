const FILE_A_URL = "http://localhost:3000/A.txt";
const FILE_B_URL = "http://localhost:3000/B.txt";


function download_text(f) {
  return new Promise(function(resolve, reject) {
    return fetch(f)
      .then(
        result => result.text(),
        error => (reject(error))
      )
      .then(result => resolve(result.split("\n")
        .map(s => s.trim())
        .filter(s => s))
      );
  });
}


function download_files(files) {
  return Promise.all(files.map(f => download_text(f)))
}


function main() {
  const files = download_files([FILE_A_URL, FILE_B_URL]);

  files.then(result => {
    let i = 0;
    while (true) {
      let row = "";
      for (const files of result) {
        if (files[i]) row += files[i];
      } 
      
      i++;
      if (!row) break;
      console.log(row);
    }
  })
}


main();
