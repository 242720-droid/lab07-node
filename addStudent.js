const fs = require("fs");

const fileData = fs.readFileSync("students.json", "utf8");
const students = JSON.parse(fileData);

const newId = students.length
    ? Math.max(...students.map(student => student.id)) + 1
    : 1;

students.push({
    id: newId,
    name: "Hassan",
    department: "BSCS"
});

fs.writeFileSync("students.json", JSON.stringify(students, null, 2), "utf8");
console.log("Student added and file updated.");
