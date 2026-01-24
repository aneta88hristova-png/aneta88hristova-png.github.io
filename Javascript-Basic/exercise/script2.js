// Function that converts weight in kilograms to chickens
function weightInChickens(weightInKg) {
  // 1 chicken = 0.5 kg, so weightInKg * 2 = number of chickens
  const chickenWeight = 0.5;
  return weightInKg / chickenWeight;
}

// Prompt the user for their weight and store it in a variable
const userWeight = parseFloat(prompt("Please enter your weight in kilograms:"));

// Check if the input is valid
if (isNaN(userWeight) || userWeight <= 0) {
  document.getElementById("result").innerHTML =
    "<p>Invalid input. Please enter a valid weight in kilograms.</p>";
} else {
  // Convert the weight to chickens
  const chickens = weightInChickens(userWeight);
  const roundedChickens = Math.round(chickens * 100) / 100; // Round to 2 decimals

  // Display the result inside the div with id "result"
  let resultHTML = `<p>Your weight of ${userWeight} kg is equal to approximately `;
  resultHTML += `<strong>${roundedChickens} chickens</strong> `;

  // Optional: Add a chicken image after the number of chickens
  resultHTML += `<img src="https://cdn-icons-png.flaticon.com/512/1998/1998610.png" `;
  resultHTML += `alt="Chicken" width="40" height="40" style="vertical-align: middle;">`;

  // Add explanation
  resultHTML += `<br><small>(1 chicken = 0.5 kg)</small></p>`;

  document.getElementById("result").innerHTML = resultHTML;
}
