function calculate() {
  // Get user input
  const quantity = document.getElementById("quantity").value;

  // Convert to number
  const numberOfPhones = Number(quantity);

  // Fixed prices with const
  const PRICE_PER_PHONE = 119.95;
  const TAX_RATE = 0.05; // 5%

  // Calculate 
  const subtotal = PRICE_PER_PHONE * numberOfPhones;
  const taxAmount = subtotal * TAX_RATE;
  const totalPrice = subtotal + taxAmount;

  // Show result
  document.getElementById(
    "result"
  ).innerHTML = `<h3>For ${numberOfPhones} phones:</h3>
 <p>Subtotal: $${subtotal.toFixed(2)}</p>
 <p>Tax (5%): $${taxAmount.toFixed(2)}</p>
 <h3>Total: $${totalPrice.toFixed(2)}</h3>`;
}

// Calculate on page load
calculate();
