function calculate() {
  let band1 = parseInt(document.getElementById("band1").value);
  let band2 = parseInt(document.getElementById("band2").value);
  let multiplier = parseInt(document.getElementById("multiplier").value);

  let baseValue = (band1 * 10) + band2;
  let resistance = baseValue * multiplier;

  document.getElementById("result").textContent = resistance.toLocaleString();
}

