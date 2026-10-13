const fs = require("fs");

const filePath = "employees.json";
const employees = JSON.parse(fs.readFileSync(filePath, "utf8"));

console.log("Current employees:");
console.log(employees);

const nextId = employees.length
    ? Math.max(...employees.map(employee => employee.id)) + 1
    : 1;

employees.push({
    id: nextId,
    name: "Hassan Malik",
    department: "Engineering"
});

fs.writeFileSync(filePath, JSON.stringify(employees, null, 2), "utf8");
console.log("Added one employee and updated employees.json.");
