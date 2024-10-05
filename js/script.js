let flashcards = [];
let currentCardIndex = 0;

// Function to safely get DOM elements
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Element with id '${id}' not found`);
    }
    return element;
}

const flashcardElement = getElement('flashcard');
const termElement = getElement('term');
const definitionElement = getElement('definition');
const exampleElement = getElement('example');
const flipButton = getElement('flip-btn');
const nextButton = getElement('next-btn');
const flashcardContainer = getElement('flashcard-container');

// Fetch and parse the CSV file
function loadFlashcards() {
    fetch('data/unit-ii-flashcards.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            Papa.parse(data, {
                header: true,
                complete: function(results) {
                    console.log('Parsed flashcards:', results.data);  // Debug log
                    flashcards = results.data;
                    if (flashcards.length > 0) {
                        displayCard();
                    } else {
                        throw new Error('No flashcards found in the CSV file');
                    }
                },
                error: function(error) {
                    throw new Error(`Error parsing CSV: ${error}`);
                }
            });
        })
        .catch(e => {
            console.error('There was a problem loading flashcards:', e.message);
            if (flashcardContainer) {
                flashcardContainer.innerHTML = `<p>Error: ${e.message}</p>`;
            }
        });
}

function displayCard() {
    if (flashcards.length === 0) {
        console.error('No flashcards available to display');
        return;
    }
    const card = flashcards[currentCardIndex];
    if (termElement) termElement.textContent = card.term || 'No term available';
    if (definitionElement) definitionElement.textContent = card.definition || 'No definition available';
    if (exampleElement) exampleElement.textContent = card.example ? `Example: ${card.example}` : '';
    
    if (flashcardElement) flashcardElement.classList.remove('flipped');
}

function flipCard() {
    if (flashcardElement) flashcardElement.classList.toggle('flipped');
}

function nextCard() {
    currentCardIndex = (currentCardIndex + 1) % flashcards.length;
    displayCard();
}

// Only add event listeners if elements exist
if (flipButton) flipButton.addEventListener('click', flipCard);
if (nextButton) nextButton.addEventListener('click', nextCard);

// Initial load
loadFlashcards();

console.log('Script loaded');