document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
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
    resultsContainer.style.backgroundColor = '#f9f9f9'; 
    resultsContainer.style.borderRadius = '8px';
    resultsContainer.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    resultsContainer.style.textAlign = 'left'; 
    resultsContainer.style.maxWidth = '600px'; 
    resultsContainer.style.margin = '20px auto 0 auto';
    
    formContainer.appendChild(resultsContainer);

    // Create the submission confirmation popup
    const confirmationPopup = document.createElement('div');
    confirmationPopup.id = 'submission-confirmation';
    confirmationPopup.textContent = 'Form submitted successfully!';
    document.body.appendChild(confirmationPopup);


    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Gather form data into a JavaScript object
        const formData = new FormData(contactForm);
        let data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // --- Console Print (Task 1) ---
        console.groupCollapsed('--- FORM SUBMISSION DATA OBJECT ---');
        console.log(data); 
        console.groupEnd();

        // Calculate the average rating
        const rating1 = +data.rating1 || 0; 
        const rating2 = +data.rating2 || 0;
        const rating3 = +data.rating3 || 0;
        
        const sum = rating1 + rating2 + rating3;
        const average = (sum / 3).toFixed(1);

        // Color-code the average value
        let colorClass = '';
        if (average >= 7) {
            colorClass = 'average-green';
        } else if (average >= 4) {
            colorClass = 'average-orange';
        } else {
            colorClass = 'average-red';
        }
        
        // --- Reverted Display Format: Vertical List (Task 1) ---
        let dataListHTML = '<h4 style="text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px;">Submission Details</h4><ul style="list-style-type: none; padding-left: 0; max-width: 400px; margin: 0 auto; text-align: left;">';
        
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

        // --- Display the average rating (Task 2 & 3) ---
        const userName = `${data.name} ${data.surname}`;
        const averageHTML = `<p style="margin-top: 15px; font-size: 1.2em; text-align: center;">
            <strong>${userName}:</strong> <span class="average-display ${colorClass}">${average}</span>
        </p>`;

        // Combine and display all results
        resultsContainer.innerHTML = dataListHTML + averageHTML;

        // Show a success confirmation (Task 4)
        confirmationPopup.style.display = 'block';
        
        setTimeout(() => {
            confirmationPopup.style.display = 'none';
        }, 3000); 

        // Clear form fields after submission
        contactForm.reset();
    });
});
