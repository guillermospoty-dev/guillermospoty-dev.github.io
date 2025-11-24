// Data structure mapping color names to their values and properties
const colorData = {
    'Black': { value: 0, multiplier: 1, hex: '#000000' },
    'Brown': { value: 1, multiplier: 10, tolerance: 0.01, hex: '#964B00' },
    'Red': { value: 2, multiplier: 100, tolerance: 0.02, hex: '#FF0000' },
    'Orange': { value: 3, multiplier: 1000, hex: '#FFA500' },
    'Yellow': { value: 4, multiplier: 10000, hex: '#FFFF00' },
    'Green': { value: 5, multiplier: 100000, tolerance: 0.005, hex: '#008000' },
    'Blue': { value: 6, multiplier: 1000000, tolerance: 0.0025, hex: '#0000FF' },
    'Violet': { value: 7, multiplier: 10000000, tolerance: 0.001, hex: '#EE82EE' },
    'Gray': { value: 8, multiplier: 100000000, hex: '#808080' },
    'White': { value: 9, multiplier: 1000000000, hex: '#FFFFFF' },
    'Gold': { multiplier: 0.1, tolerance: 0.05, hex: '#FFD700' },
    'Silver': { multiplier: 0.01, tolerance: 0.10, hex: '#C0C0C0' },
};

/**
 * Formats a raw resistance value into human-readable units (Ω, kΩ, MΩ).
 * @param {number} resistance - The calculated resistance in Ohms.
 * @returns {string} The formatted resistance string.
 */
function formatResistance(resistance) {
    if (resistance >= 1000000) {
        return (resistance / 1000000).toFixed(2) + ' MΩ';
    } else if (resistance >= 1000) {
        return (resistance / 1000).toFixed(2) + ' kΩ';
    } else {
        return resistance.toFixed(2) + ' Ω';
    }
}

/**
 * Main function to calculate resistance and update the UI.
 */
function calculateResistance() {
    // 1. Get values from dropdowns
    const band1Val = document.getElementById('band1').value;
    const band2Val = document.getElementById('band2').value;
    const multiplierVal = parseFloat(document.getElementById('multiplier').value);
    const tolerancePercent = parseFloat(document.getElementById('tolerance').value) * 100;

    // 2. Calculate Resistance (R = (Digit1 * 10 + Digit2) * Multiplier)
    const baseValue = parseInt(band1Val) * 10 + parseInt(band2Val);
    const totalResistance = baseValue * multiplierVal;

    // 3. Format Result
    const formattedResistance = formatResistance(totalResistance);
    const toleranceString = `± ${tolerancePercent}%`;

    // 4. Update Result Display
    document.getElementById('result-value').textContent = `${formattedResistance} ${toleranceString}`;


    // 5. Update Visual Resistor Bands
    
    // Helper to get the color name from the selected value in the dropdown
    const getSelectedColorName = (elementId) => {
        const selectElement = document.getElementById(elementId);
        // Extracts the color name from the option text (e.g., 'Brown (1)' -> 'Brown')
        return selectElement.options[selectElement.selectedIndex].text.split(' ')[0];
    };

    // Get color names for bands
    const colorBand1 = getSelectedColorName('band1');
    const colorBand2 = getSelectedColorName('band2');
    const colorMultiplier = getSelectedColorName('multiplier');
    const colorTolerance = getSelectedColorName('tolerance');

    // Apply colors to the visual bands
    document.getElementById('viz-band1').style.backgroundColor = colorData[colorBand1].hex;
    document.getElementById('viz-band2').style.backgroundColor = colorData[colorBand2].hex;
    document.getElementById('viz-multiplier').style.backgroundColor = colorData[colorMultiplier].hex;
    document.getElementById('viz-tolerance').style.backgroundColor = colorData[colorTolerance].hex;
}
