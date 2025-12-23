// zodiac calculator with if-else statements
let input = prompt("Enter a year:");
let year = parseInt(input);

if (isNaN(year)) {
  alert("Error: Please enter a valid year (numbers only)");
} else {
  let num = (year - 4) % 12;

  if (num === 0) alert(year + " = Rat");
  else if (num === 1) alert(year + " = Ox");
  else if (num === 2) alert(year + " = Tiger");
  else if (num === 3) alert(year + " = Rabbit");
  else if (num === 4) alert(year + " = Dragon");
  else if (num === 5) alert(year + " = Snake");
  else if (num === 6) alert(year + " = Horse");
  else if (num === 7) alert(year + " = Goat");
  else if (num === 8) alert(year + " = Monkey");
  else if (num === 9) alert(year + " = Rooster");
  else if (num === 10) alert(year + " = Dog");
  else alert(year + " = Pig");
}

/* zodiac calculator with switch statement 

let input = prompt("Enter a year:");
let year = parseInt(input);
if (isNaN(year)) {
    alert("Error: Please enter a valid year (numbers only)");
} else {
    let num = (year - 4) % 12;
    let animal;
    
    switch (num) {
        case 0:
            animal = "Rat";
            break;
        case 1:
            animal = "Ox";
            break;
        case 2:
            animal = "Tiger";
            break;
        case 3:
            animal = "Rabbit";
            break;
        case 4:
            animal = "Dragon";
            break;
        case 5:
            animal = "Snake";
            break;
        case 6:
            animal = "Horse";
            break;
        case 7:
            animal = "Goat";
            break;
        case 8:
            animal = "Monkey";
            break;
        case 9:
            animal = "Rooster";
            break;
        case 10:
            animal = "Dog";
            break;
        case 11:
            animal = "Pig";
            break;
        default:
            animal = "Unknown";
    }
    
    alert(year + " = " + animal);
}
    */