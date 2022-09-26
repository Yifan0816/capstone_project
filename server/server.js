"use strict";

let express = require("express");
let bodyParser = require("body-parser");
let fs = require("fs");

let app = express();
app.use(bodyParser.json());

// Create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false });

// enable CORS
// Since we're not serving pages from Node, you'll get the following error if CORS isn't "enabled"
// Error:  Failed to load http://localhost:3000/login/:
// No 'Access-Control-Allow-Origin' header is present on the requested resource.
// Origin 'null' is therefore not allowed access.
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  // allow preflight
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// ------ Debugging support ------------------

// pass the function an array and it will log the array (example: to console.log members in a group;)
function logArray(arr) {
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
}

// ------ Get next ID helper ------------------

function getNextId(counterType) {
  // use 'group' or 'member' or 'user' as counterType
  // read the counter file
  let data = fs.readFileSync(__dirname + "/data/counters.json", "utf8");
  data = JSON.parse(data);

  // find the next id from the counters file and then increment the
  // counter in the file to indicate that id was used
  let id = -1;
  switch (counterType.toLowerCase()) {
    case "organization":
      id = data.nextOrganization;
      data.nextOrganization++;
      break;
    case "animaltype":
      id = data.nextAnimalType;
      data.nextAnimalType++;
      break;
    case "animal":
      id = data.nextAnimal;
      data.nextAnimal++;
      break;
  }

  // save the updated counter
  fs.writeFileSync(__dirname + "/data/counters.json", JSON.stringify(data));

  return id;
}

// ------ Validation helpers ------------------

function isValidAnimalType(animalType) {
  console.log("New animal type be like" + animalType);
  console.log("New animal type name be like" + animalType.AnimalTypeName);
  if (
    animalType.AnimalTypeName == undefined ||
    animalType.AnimalTypeName.trim() == ""
  )
    return 1;
  return -1;
}

function isValidAnimal(animal) {
  if (animal.AnimalName == undefined || animal.AnimalName.trim() == "")
    return 1;
  if (animal.Age == undefined || animal.Age.trim() == "") return 2;
  if (animal.Gender == undefined || animal.Gender.trim() == "") return 3;
  if (animal.Breed == undefined || animal.Breed.trim() == "") return 4;
  if (animal.Color == undefined || animal.Color.trim() == "") return 5;
  if (animal.Size == undefined || animal.Size.trim() == "") return 6;
  if (animal.Health == undefined || animal.Health.trim() == "") return 7;
  if (animal.Charactor == undefined || animal.Charactor.trim() == "") return 8;

  return -1;
}

// ------------------------------------------------------------------------------

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/" + "index.html");
});

app.get("/index.html", function (req, res) {
  res.sendFile(__dirname + "/public/" + "index.html");
});

// ------------------------------------------------------------------------------
// THIS CODE ALLOWS REQUESTS FOR THE API THROUGH

/* ************************************************************************* */
// NOTE:  To make debugging easy, these methods echo their processing through
//        to the terminal window.  This means there may be some unnecessary
//        parsing and stringifying.  But it is worth it as you debug your code.
/* ************************************************************************* */

// GET ORGANIZATION
app.get("/api/shelters", function (req, res) {
  console.log("Received a GET request for all shelters");

  let data = fs.readFileSync(__dirname + "/data/shelters.json", "utf8");
  data = JSON.parse(data);

  console.log("Returned data is: ");
  console.log(data);
  res.end(JSON.stringify(data));
});

// GET ONE ORGANIZATION BY ID
app.get("/api/shelters/:id", function (req, res) {
  let id = req.params.id;
  console.log("Received a GET request for shelter " + id);

  let data = fs.readFileSync(__dirname + "/data/shelters.json", "utf8");
  data = JSON.parse(data);

  let match = data.find((element) => element.ShelterId == id);
  if (match == null) {
    res.status(404).send("Shelter Not Found");
    console.log("Shelter not found");
    return;
  }

  console.log("Returned data is: ");
  console.log(match);
  // logArray(match.Members);
  res.end(JSON.stringify(match));
})

// GET ALL GROUPS
app.get("/api/animaltypes", function (req, res) {
  console.log("Received a GET request for all animal types");

  let data = fs.readFileSync(__dirname + "/data/animal-types.json", "utf8");
  data = JSON.parse(data);

  console.log("Returned data is: ");
  console.log(data);
  res.end(JSON.stringify(data));
});

// GET ONE GROUP BY ID
app.get("/api/animaltypes/:id", function (req, res) {
  let id = req.params.id;
  console.log("Received a GET request for group " + id);

  let data = fs.readFileSync(__dirname + "/data/animal-types.json", "utf8");
  data = JSON.parse(data);

  let match = data.find((element) => element.AnimalTypeId == id);
  if (match == null) {
    res.status(404).send("Group Not Found");
    console.log("Group not found");
    return;
  }

  console.log("Returned data is: ");
  console.log(match);
  // logArray(match.Members);
  res.end(JSON.stringify(match));
});

// GET All GROUPS BY ORGANIZATION
app.get("/api/animaltypes/byshelter/:id", function (req, res) {
  let id = req.params.id;
  console.log("Received a GET request for groups in organization " + id);

  let orgData = fs.readFileSync(__dirname + "/data/shelters.json", "utf8");
  orgData = JSON.parse(orgData);

  let organization = orgData.find((element) => element.ShelterId == id);
  if (organization == null) {
    res.status(404).send("Organization Not Found");
    console.log("Organization not found");
    return;
  }

  let data = fs.readFileSync(__dirname + "/data/animal-types.json", "utf8");
  data = JSON.parse(data);

  // find the matching groups for a specific organization
  let matches = data.filter(
    (element) => element.ShelterId == organization.ShelterId
  );

  console.log("Returned data is: ");
  console.log(matches);
  res.end(JSON.stringify(matches));
});

// GET A SPECIFIC MEMBER IN A SPECIFIC GROUP
// Not used, not in postman
app.get(
  "/api/animaltypes/:animaltypeid/animals/:animalid",
  function (req, res) {
    let animalTypeId = req.params.animaltypeid;
    let animalId = req.params.animalid;
    console.log(
      "Received a GET request for animal " +
        animalId +
        " in animal type " +
        animalTypeId
    );

    let data = fs.readFileSync(__dirname + "/data/animal-types.json", "utf8");
    data = JSON.parse(data);

    // find the group
    let matchingGroup = data.find(
      (element) => element.AnimalTypeId == animalTypeId
    );
    if (matchingGroup == null) {
      res.status(404).send("Animal type Not Found");
      console.log("Animal type not found");
      return;
    }

    // find the member
    let match = matchingGroup.Animals.find((m) => m.AnimalId == animalId);
    if (match == null) {
      res.status(404).send("Member Not Found");
      console.log("Member not found");
      return;
    }

    console.log("Returned data is: ");
    console.log(match);
    res.end(JSON.stringify(match));
  }
);

// ADD A GROUP
// It'll have empty Animals[]
app.post("/api/animaltypes", urlencodedParser, function (req, res) {
  console.log("Received a POST request to add a animaltype");
  console.log("BODY -------->" + JSON.stringify(req.body));

  // assemble group information so we can validate it
  let group = {
    AnimalTypeId: getNextId("animalType"), // assign id to group
    AnimalTypeName: req.body.AnimalTypeName,
    ShelterId: Number(req.body.ShelterId),
    Capacity: Number(req.body.Capacity),
    Animals: [],
  };

  console.log("Performing validation...");
  let errorCode = isValidAnimalType(group);
  if (errorCode != -1) {
    console.log("Invalid data found! Reason: " + errorCode);
    res.status(400).send("Bad Request - Incorrect or Missing Data");
    return;
  }

  let data = fs.readFileSync(__dirname + "/data/animal-types.json", "utf8");
  data = JSON.parse(data);

  // add the group
  data.push(group);

  fs.writeFileSync(__dirname + "/data/animal-types.json", JSON.stringify(data));

  console.log("Animal type added: ");
  console.log(group);

  //res.status(201).send(JSON.stringify(group));
  res.end(JSON.stringify(group)); // return the new group w it's GroupId
});

// EDIT A GROUP
// Should only change capacity and animal-type in a group
// shouldn't change shelterId, we don't move it around
// shouldn't change animals, we do it in groups page, it's a CRUD to animals.json
app.put("/api/animaltypes", urlencodedParser, function (req, res) {
  console.log("Received a PUT request to edit an animaltypes");
  console.log("BODY -------->" + JSON.stringify(req.body));

  // assemble group information so we can validate it
  let group = {
    AnimalTypeId: Number(req.body.AnimalTypeId),
    AnimalTypeName: req.body.AnimalTypeName,
    ShelterId: Number(req.body.ShelterId),
    Capacity: Number(req.body.Capacity),
    Animals: [],
  };

  console.log("Performing validation...");
  let errorCode = isValidAnimalType(group);
  if (errorCode != -1) {
    console.log("Invalid data found! Reason: " + errorCode);
    res.status(400).send("Bad Request - Incorrect or Missing Data");
    return;
  }

  let data = fs.readFileSync(__dirname + "/data/animal-types.json", "utf8");
  data = JSON.parse(data);

  // find the group
  let match = data.find(
    (element) => element.AnimalTypeId == group.AnimalTypeId
  );
  if (match == null) {
    res.status(404).send("Group Not Found");
    console.log("Group not found");
    return;
  }

  // update the group
  match.AnimalTypeName = group.AnimalTypeName;
  match.ShelterId = group.ShelterId;

  // make sure new values for MaxGroupSize doesn't invalidate grooup
  if (Number(group.Capacity) < match.Animals.length) {
    res
      .status(409)
      .send("New group size too small based on current number of members");
    console.log("New group size too small based on current number of members");
    return;
  }
  match.Capacity = Number(group.Capacity);

  fs.writeFileSync(__dirname + "/data/animal-types.json", JSON.stringify(data));

  console.log("Update successful!  New values: ");
  console.log(match);
  res.status(200).send();
});

// DELETE A GROUP
app.delete("/api/animaltypes/:id", function (req, res) {
  let id = req.params.id;
  console.log("Received a DELETE request for animal type " + id);

  let data = fs.readFileSync(__dirname + "/data/animal-types.json", "utf8");
  data = JSON.parse(data);

  // find the index number of the group in the array
  let foundAt = data.findIndex((element) => element.AnimalTypeId == id);

  // delete the group if found
  if (foundAt != -1) {
    data.splice(foundAt, 1);
  }

  fs.writeFileSync(__dirname + "/data/animal-types.json", JSON.stringify(data));

  console.log("Delete request processed");
  // Note:  even if we didn't find the group, send a 200 because they are gone
  res.status(200).send();
});

// ----------------------------------------------------------------------------
// MEMBER MANAGEMENT

// GET ALL MEMBERS
app.get("/api/animals", function (req, res) {
  console.log("Received a GET request for all animals");

  let data = fs.readFileSync(__dirname + "/data/animals.json", "utf8");
  data = JSON.parse(data);

  console.log("Returned data is: ");
  console.log(data);
  res.end(JSON.stringify(data));
});

// GET ONE MEMBER BY ID
app.get("/api/animals/:id", function (req, res) {
  let id = req.params.id;
  console.log("Received a GET request for animal " + id);

  let data = fs.readFileSync(__dirname + "/data/animals.json", "utf8");
  data = JSON.parse(data);

  let match = data.find((element) => element.AnimalId == id);
  if (match == null) {
    res.status(404).send("Animal Not Found");
    console.log("Animal not found");
    return;
  }

  console.log("Returned data is: ");
  console.log(match);
  // logArray(match.Members);
  res.end(JSON.stringify(match));
});

// GET All MEMBERS BY GROUP
app.get("/api/animals/byanimaltype/:id", function (req, res) {
  let id = req.params.id;
  console.log("Received a GET request for groups in organization " + id);

  let animalTypeData = fs.readFileSync(
    __dirname + "/data/animal-types.json",
    "utf8"
  );
  animalTypeData = JSON.parse(animalTypeData);

  let animalType = animalTypeData.find((element) => element.AnimalTypeId == id);
  if (animalType == null) {
    res.status(404).send("Animal Type Not Found");
    console.log("Animal Type not found");
    return;
  }

  let arr = new Set();
  animalType.Animals.forEach((element) => {
    arr.add(element.AnimalId);
    console.log("Added animalId: " + element.AnimalId);
  });

  let data = fs.readFileSync(__dirname + "/data/animals.json", "utf8");
  data = JSON.parse(data);

  // find the matching groups for a specific organization
  let matches = data.filter((element) => arr.has(element.AnimalId));

  console.log("Returned data is: ");
  console.log(matches);
  res.end(JSON.stringify(matches));
});

// ADD A MEMBER TO A GROUP
app.post("/api/animaltypes/:id/animals", urlencodedParser, function (req, res) {
  let id = req.params.id;
  console.log("Received a POST request to add an animal to animal type " + id);
  console.log("BODY -------->" + JSON.stringify(req.body));

  // assemble member information so we can validate it
  let member = {
    AnimalId: getNextId("animal"), // assign new id
    AnimalName: req.body.AnimalName,
    Age: req.body.Age,
    Gender: req.body.Gender,
    Breed: req.body.Breed,
    Color: req.body.Color,
    Size: req.body.Size,
    Health: req.body.Health,
    Charactor: req.body.Charactor,
    WithCats: req.body.WithCats,
    WithDogs: req.body.WithDogs,
    WithChildren: req.body.WithChildren,
  };

  console.log("Performing member validation...");
  let errorCode = isValidAnimal(member);
  if (errorCode != -1) {
    console.log("Invalid data found! Reason: " + errorCode);
    res.status(400).send("Bad Request - Incorrect or Missing Data");
    return;
  }

  // STEP 1 Add animal to crossbounding animal-type
  let data = fs.readFileSync(__dirname + "/data/animal-types.json", "utf8");
  data = JSON.parse(data);

  // find the group
  let match = data.find((element) => element.AnimalTypeId == id);
  if (match == null) {
    res.status(404).send("Group Not Found");
    console.log("Group not found");
    return;
  }

  if (match.Animals.length == match.Capacity) {
    res.status(409).send("Animal not added - animal type at capacity");
    console.log("Animal not added - animal type at capacity");
    return;
  }

  // add the member
  match.Animals.push({ AnimalId: member.AnimalId });

  fs.writeFileSync(__dirname + "/data/animal-types.json", JSON.stringify(data));

  console.log("New animal added to animal type: " + id);

  // STEP 2 Add animal to animals
  let animalsData = fs.readFileSync(__dirname + "/data/animals.json", "utf8");
  animalsData = JSON.parse(animalsData);

  // add the group
  animalsData.push(member);

  fs.writeFileSync(
    __dirname + "/data/animals.json",
    JSON.stringify(animalsData)
  );

  console.log("New animal added to animals!");
  console.log(member);

  //res.status(201).send(JSON.stringify(member));
  res.end(JSON.stringify(member)); // return the new member with member id
});

// EDIT A MEMBER IN A GROUP
// should only be able to edit animal, not animal types
app.put("/api/animaltypes/:id/animals", urlencodedParser, function (req, res) {
  let id = req.params.id;
  console.log("Received a PUT request to edit a animal in animal type " + id);
  console.log("BODY -------->" + JSON.stringify(req.body));

  // assemble member information so we can validate it
  let member = {
    AnimalId: req.body.AnimalId,
    AnimalName: req.body.AnimalName,
    Age: req.body.Age,
    Gender: req.body.Gender,
    Breed: req.body.Breed,
    Color: req.body.Color,
    Size: req.body.Size,
    Health: req.body.Health,
    Charactor: req.body.Charactor,
    WithCats: req.body.WithCats,
    WithDogs: req.body.WithDogs,
    WithChildren: req.body.WithChildren,
  };

  console.log("Performing member validation...");
  let errorCode = isValidAnimal(member);
  if (errorCode != -1) {
    console.log("Invalid data found! Reason: " + errorCode);
    res.status(400).send("Bad Request - Incorrect or Missing Data");
    return;
  }

  // load all members
  let data = fs.readFileSync(__dirname + "/data/animals.json", "utf8");
  data = JSON.parse(data);

  let match = data.find((element) => element.AnimalId == member.AnimalId);
  if (match == null) {
    res.status(404).send("Animal Not Found");
    console.log("Animal not found");
    return;
  }

  // update the member
  match.AnimalName = req.body.AnimalName;
  match.Age = req.body.Age;
  match.Gender = req.body.Gender;
  match.Breed = req.body.Breed;
  match.Color = req.body.Color;
  match.Size = req.body.Size;
  match.Health = req.body.Health;
  match.Charactor = req.body.Charactor;
  match.WithCats = req.body.WithCats;
  match.WithDogs = req.body.WithDogs;
  match.WithChildren = req.body.WithChildren;

  fs.writeFileSync(__dirname + "/data/animals.json", JSON.stringify(data));

  console.log("Animal updated!");
  res.status(200).send();
});

// DELETE A MEMBER IN A GROUP
app.delete(
  "/api/animaltypes/:animaltypeid/animals/:animalid",
  urlencodedParser,
  function (req, res) {
    let animalTypeId = req.params.animaltypeid;
    let animalId = req.params.animalid;
    console.log(
      "Received a DELETE request for animal " +
        animalId +
        " in animal type " +
        animalTypeId
    );

    // Step 1 Delete from associated animal types
    // find the group
    let data = fs.readFileSync(__dirname + "/data/animal-types.json", "utf8");
    data = JSON.parse(data);

    let matchingGroup = data.find(
      (element) => element.AnimalTypeId == animalTypeId
    );
    if (matchingGroup == null) {
      res.status(404).send("Group Not Found");
      console.log("Group not found");
      return;
    }

    // find the member
    let foundAt = matchingGroup.Animals.findIndex(
      (m) => m.AnimalId == animalId
    );

    // delete the member if found
    if (foundAt != -1) {
      matchingGroup.Animals.splice(foundAt, 1);
    }

    fs.writeFileSync(
      __dirname + "/data/animal-types.json",
      JSON.stringify(data)
    );
    console.log(
      "Delete animal: " + animalId + " from animal type: " + animalTypeId
    );

    // STEP 2, delete from animals
    let animalData = fs.readFileSync(__dirname + "/data/animals.json", "utf8");
    animalData = JSON.parse(animalData);

    // find the index number of the group in the array
    let foundAinmalAt = animalData.findIndex(
      (element) => element.AnimalId == animalId
    );

    // delete the group if found
    if (foundAinmalAt != -1) {
      animalData.splice(foundAinmalAt, 1);
    }

    fs.writeFileSync(
      __dirname + "/data/animals.json",
      JSON.stringify(animalData)
    );
    console.log("Delete animal: " + animalId + " from animals");

    console.log("Delete request processed");
    // Note:  even if we didn't find them, send a 200 back because they are gone
    res.status(200).send();
  }
);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

let server = app.listen(8082, function () {
  let port = server.address().port;

  console.log("App listening at port %s", port);
});
