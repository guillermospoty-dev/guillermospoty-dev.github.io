document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    // Finds the container where results should be displayed (the parent of the form)
    const formContainer = contactForm ? contactForm.parentNode : null;

    if (!contactForm || !formContainer) {
        console.error('Contact form or its container not found. Check if id="contact-form" exists.');
        return; 
    }

    // Create a container for ALL results (data list + average)
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'submission-results-container';
    resultsContainer.style.marginTop = '20px'; 
    resultsContainer.style.padding = '15px';
    resultsContainer.style.backgroundColor = '#f9f9f9'; // Light background for visibility
    resultsContainer.style.borderRadius = '8px';
    resultsContainer.style.textAlign = 'left'; // Align the list text to the left
    
    formContainer.appendChild(resultsContainer);

    // Create the submission confirmation popup
    const confirmationPopup = document.createElement('div');
    confirmationPopup.id = 'submission-confirmation';
    confirmationPopup.textContent = 'Form submitted successfully!';
    document.body.appendChild(confirmationPopup);


    contactForm.addEventListener('submit', function(event) {
        // Prevent default page reload
        event.preventDefault();

        // Gather form data into a JavaScript object
        const formData = new FormData(contactForm);
        let data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // --- User's Task 1: Print the object in the browser console ---
        console.log('Form Submission Data Object:', data);

        // Calculate the average rating
        const rating1 = +data.rating1 || 0; 
        const rating2 = +data.rating2 || 0;
        const rating3 = +data.rating3 || 0;
        
        const sum = rating1 + rating2 + rating3;
        const average = (sum / 3).toFixed(1);

        // --- User's Task 3: Color-code the average value ---
        let colorClass = '';
        if (average >= 7) {
            colorClass = 'average-green';
        } else if (average >= 4) {
            colorClass = 'average-orange';
        } else {
            colorClass = 'average-red';
        }
        
        // --- User's Task 1: Display the data below the form, one item per line ---
        let dataListHTML = '<h4 style="text-align: center;">Submission Details</h4><ul style="list-style-type: none; padding-left: 0;">';
        const labels = {
            name: 'Name', surname: 'Surname', email: 'Email', phone: 'Phone number', 
            address: 'Address', rating1: 'Design Rating', rating2: 'Usefulness Rating', 
            rating3: 'Clarity Rating'
        };

        for (const key in data) {
            const label = labels[key] || key;
            dataListHTML += `<li style="margin-bottom: 5px;"><strong>${label}:</strong> ${data[key]}</li>`;
        }
        dataListHTML += '</ul>';

        // --- User's Task 2: Calculate and display the average rating ---
        const userName = `${data.name} ${data.surname}`;
        const averageHTML = `<p style="margin-top: 15px; font-size: 1.2em; text-align: center;">
            <strong>${userName}:</strong> <span class="average-display ${colorClass}">${average}</span>
        </p>`;

        // Combine and display all results
        resultsContainer.innerHTML = dataListHTML + averageHTML;

        // --- User's Task 4: Show a success confirmation ---
        confirmationPopup.style.display = 'block';
        
        // Hide the popup after 3 seconds
        setTimeout(() => {
            confirmationPopup.style.display = 'none';
        }, 3000); 

        // Clear form fields after submission
        contactForm.reset();
    });
});
