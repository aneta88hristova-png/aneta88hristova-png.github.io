function checkNumber() {
  let input = prompt("Enter a number:");

  if (input === null || input.trim() === "") {
    alert("Please enter a number");
    return;
  }

  let numberValue = Number(input);

  if (isNaN(numberValue)) {
    alert(
      "That's not a valid number! Please enter a number like 1, 2, 3, etc."
    );
    return;
  }

  if (!Number.isInteger(numberValue)) {
    alert("Decimal numbers are neither even nor odd. Please enter an integer.");
    return;
  }

  if (numberValue % 2 === 0) {
    alert(numberValue + " is even");
  } else {
    alert(numberValue + " is odd");
  }
}

checkNumber();
