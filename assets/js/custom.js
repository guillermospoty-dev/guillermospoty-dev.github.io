document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    // Reference the footer or the form's immediate container
    const formContainer = contactForm ? contactForm.parentNode : null;

    if (!contactForm || !formContainer) {
        console.error('Contact form or its container not found. Check if id="contact-form" exists.');
        return; 
    }

    // Create a container for the average score display. We append this to the form's parent column.
    const averageContainer = document.createElement('div');
    averageContainer.id = 'average-container';
    formContainer.appendChild(averageContainer); 

    // Create the submission confirmation popup
    const confirmationPopup = document.createElement('div');
    confirmationPopup.id = 'submission-confirmation';
    confirmationPopup.textContent = 'Form submitted successfully!';
    document.body.appendChild(confirmationPopup);


    contactForm.addEventListener('submit', function(event) {
        // 1. Prevent the default form submission
        event.preventDefault();

        // 2. Gather form data
        const formData = new FormData(contactForm);
        let data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // 3. Calculate the average rating
        const rating1 = +data.rating1 || 0; 
        const rating2 = +data.rating2 || 0;
        const rating3 = +data.rating3 || 0;
        
        const sum = rating1 + rating2 + rating3;
        const average = (sum / 3).toFixed(1);

        // 4. Determine color class based on average
        let colorClass = '';
        if (average >= 7) {
            colorClass = 'average-green';
        } else if (average >= 4) {
            colorClass = 'average-orange';
        } else {
            colorClass = 'average-red';
        }

        // 5. Display average and color-code the result
        const userName = `${data.name} ${data.surname}`;
        // Apply some bottom margin for spacing in the footer
        const resultHTML = `
            <p style="margin-top: 15px; margin-bottom: 30px; font-size: 1.1em; text-align: center;">
                ${userName} Rating: <span class="average-display ${colorClass}">${average}</span>
            </p>
        `;
        averageContainer.innerHTML = resultHTML;

        // 6. Show a success confirmation popup
        confirmationPopup.style.display = 'block';
        
        // Hide the popup after 3 seconds
        setTimeout(() => {
            confirmationPopup.style.display = 'none';
        }, 3000); 

        // Clear form fields after submission
        contactForm.reset();
    });
});
