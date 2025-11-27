document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-button');
    const formContainer = contactForm ? contactForm.parentNode : null;

    if (!contactForm || !formContainer) {
        console.error('Contact form or its container not found.');
        return;
    }
    
    // Disable the submit button initially
    submitButton.disabled = true;

    // --- DOM Elements for Result Display & Popup ---
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'submission-results-container';
    resultsContainer.style.cssText = 'margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); text-align: left; max-width: 600px; margin: 20px auto 0 auto;';
    formContainer.appendChild(resultsContainer);

    const confirmationPopup = document.createElement('div');
    confirmationPopup.id = 'submission-confirmation';
    confirmationPopup.textContent = 'Form submitted successfully!';
    document.body.appendChild(confirmationPopup);
    
    // --- Validation Rules ---
    const validationRules = {
        name: { 
            required: true, 
            pattern: /^[A-Za-zА-Яа-я\s'-]+$/, // ONLY letters, spaces, hyphens, apostrophes
            error: 'Name can only contain letters, spaces, or hyphens.'
        },
        surname: { 
            required: true, 
            pattern: /^[A-Za-zА-Яа-я\s'-]+$/, 
            error: 'Surname can only contain letters, spaces, or hyphens.'
        },
        email: { 
            required: true, 
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
            error: 'Invalid email format (e.g., user@example.com).' 
        },
        phone: {
            required: true,
            // Strict pattern checking the final masked format
            pattern: /^\+370\s6\d{2}\s\d{5}$/, 
            error: 'Invalid format. Must be +370 6xx xxxxx (9 digits).'
        },
        address: {
            required: true,
            minlength: 5, // Ensures "meaningful text"
            error: 'Address must be at least 5 characters long.'
        }
    };

    // --- Real-time Validation Function ---
    function validateField(input) {
        const fieldName = input.id;
        const value = input.value.trim();
        const rules = validationRules[fieldName];
        let isValid = true;
        let errorMessage = '';

        if (!rules) return true; // Skip if no rules defined

        // Check required fields
        if (rules.required && value === '') {
            isValid = false;
            errorMessage = 'This field is required.';
        } 
        // Check pattern/format
        else if (rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = rules.error;
        } 
        // Check min length
        else if (rules.minlength && value.length < rules.minlength) {
            isValid = false;
            errorMessage = rules.error;
        }
        
        // --- Visible Feedback ---
        const errorElementId = `error-${fieldName}`;
        let errorDisplay = document.getElementById(errorElementId);

        if (!errorDisplay) {
            errorDisplay = document.createElement('small');
            errorDisplay.id = errorElementId;
            errorDisplay.className = 'error-message-text';
            input.parentNode.appendChild(errorDisplay);
        }

        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            errorDisplay.textContent = '';
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            errorDisplay.textContent = errorMessage;
        }

        return isValid;
    }
    
    // --- Total Form Validity Check ---
    function checkFormValidity() {
        let isFormValid = true;
        
        // Check all validated text/email/phone/address fields
        for (const fieldId in validationRules) {
            const input = document.getElementById(fieldId);
            if (input && !validateField(input)) {
                isFormValid = false;
            }
        }
        
        // Check rating inputs (must be within 1-10 range)
        const ratingInputs = document.querySelectorAll('.rating-input');
        ratingInputs.forEach(input => {
             if (!input.checkValidity()) {
                 isFormValid = false;
             }
        });
        
        submitButton.disabled = !isFormValid;
    }

    // --- Phone Number Input Masking (Fixed Logic) ---
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.setAttribute('maxlength', '15'); // Max length for "+370 6xx xxxxx"
        phoneInput.addEventListener('input', function(e) {
            // 1. Strip all non-digits
            let digits = e.target.value.replace(/\D/g, ''); 
            let maskedValue = '';

            // 2. Ensure the correct country code and mobile prefix are established
            if (!digits.startsWith('3706')) {
                // If user pastes/types something else, start fresh with the mask structure
                if (digits.length >= 1) {
                    // Start building from "+370 6" and enforce the '6' prefix
                    digits = '6' + digits.substring(1); 
                } else {
                    digits = '';
                }
            } else {
                // Remove the enforced "3706" so we only deal with the 8 remaining digits
                digits = digits.substring(4);
            }
            
            maskedValue = '+370 6';
            
            // 3. Apply the '6xx xxxxx' mask
            if (digits.length > 0) {
                // First two digits after '6'
                maskedValue += digits.substring(0, 2);
            }
            if (digits.length > 2) {
                // Add space and remaining digits (max 5)
                maskedValue += ' ' + digits.substring(2, 7);
            }
            
            e.target.value = maskedValue.trim();
            validateField(e.target);
            checkFormValidity();
        });
    }

    // --- Attach Real-time Validation Listeners ---
    const fieldsToValidate = ['name', 'surname', 'email', 'address'];
    fieldsToValidate.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                validateField(this);
                checkFormValidity();
            });
            // Initial check on load 
            validateField(input);
        }
    });
    
    // Run initial check on load to set the button state correctly
    checkFormValidity();
    
    // --- Form Submission (Required Task) ---

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Final check before submission
        checkFormValidity();
        if (submitButton.disabled) {
            alert("Please correct the errors in the form before submitting.");
            return;
        }

        const formData = new FormData(contactForm);
        let data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Task 1: Print the object in the browser console
        console.groupCollapsed('--- FORM SUBMISSION DATA OBJECT ---');
        console.log(data); 
        console.groupEnd();

        // Calculate the average rating (Task 2 & 3)
        const rating1 = +data.rating1 || 0; 
        const rating2 = +data.rating2 || 0;
        const rating3 = +data.rating3 || 0;
        
        const sum = rating1 + rating2 + rating3;
        const average = (sum / 3).toFixed(1);

        let colorClass = '';
        if (average >= 7) {
            colorClass = 'average-green';
        } else if (average >= 4) {
            colorClass = 'average-orange';
        } else {
            colorClass = 'average-red';
        }
        
        // Display the data list
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

        const userName = `${data.name} ${data.surname}`;
        const averageHTML = `<p style="margin-top: 15px; font-size: 1.2em; text-align: center;">
            <strong>${userName}:</strong> <span class="average-display ${colorClass}">${average}</span>
        </p>`;

        resultsContainer.innerHTML = dataListHTML + averageHTML;

        // Show a success confirmation (Task 4)
        confirmationPopup.style.display = 'block';
        
        setTimeout(() => {
            confirmationPopup.style.display = 'none';
        }, 3000); 

        // Reset the form and validation state
        contactForm.reset();
        document.querySelectorAll('.is-valid, .is-invalid').forEach(el => el.classList.remove('is-valid', 'is-invalid'));
        document.querySelectorAll('.error-message-text').forEach(el => el.textContent = '');
        checkFormValidity();
    });
});
