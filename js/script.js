let flashcards = [];
let currentCardIndex = 0;
let cardsReviewed = new Set();
let markedCards = new Set();
let isReviewMode = false;

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
const markButton = getElement('mark-btn');
const reviewModeButton = getElement('review-mode-btn');
const flashcardContainer = getElement('flashcard-container');
const progressBar = getElement('progress-bar');
const progressText = getElement('progress-text');
const reviewStatus = getElement('review-status');

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
                    flashcards = results.data;
                    if (flashcards.length > 0) {
                        displayCard();
                        updateProgress();
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
    
    if (flashcardElement) {
        flashcardElement.classList.remove('flipped');
        flashcardElement.classList.toggle('marked-card', markedCards.has(currentCardIndex));
    }
    
    cardsReviewed.add(currentCardIndex);
    updateProgress();
    updateReviewStatus();
}

function updateProgress() {
    const progress = (cardsReviewed.size / flashcards.length) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${cardsReviewed.size} / ${flashcards.length} cards reviewed`;
}

function updateReviewStatus() {
    if (reviewStatus) {
        if (isReviewMode) {
            reviewStatus.textContent = `Reviewing marked cards: ${currentCardIndex + 1} / ${markedCards.size}`;
        } else {
            reviewStatus.textContent = `${markedCards.size} card(s) marked for review`;
        }
    }
}

function flipCard() {
    if (flashcardElement) flashcardElement.classList.toggle('flipped');
}

function nextCard() {
    if (isReviewMode) {
        const markedCardsArray = Array.from(markedCards);
        const currentIndex = markedCardsArray.indexOf(currentCardIndex);
        currentCardIndex = markedCardsArray[(currentIndex + 1) % markedCardsArray.length];
    } else {
        currentCardIndex = (currentCardIndex + 1) % flashcards.length;
    }
    displayCard();
}

function markCard() {
    if (markedCards.has(currentCardIndex)) {
        markedCards.delete(currentCardIndex);
    } else {
        markedCards.add(currentCardIndex);
    }
    if (flashcardElement) {
        flashcardElement.classList.toggle('marked-card', markedCards.has(currentCardIndex));
    }
    updateReviewStatus();
}

function toggleReviewMode() {
    isReviewMode = !isReviewMode;
    if (isReviewMode && markedCards.size > 0) {
        currentCardIndex = Array.from(markedCards)[0];
        reviewModeButton.textContent = 'Exit Review Mode';
    } else {
        currentCardIndex = 0;
        isReviewMode = false;
        reviewModeButton.textContent = 'Review Marked Cards';
    }
    displayCard();
}

if (flipButton) flipButton.addEventListener('click', flipCard);
if (nextButton) nextButton.addEventListener('click', nextCard);
if (markButton) markButton.addEventListener('click', markCard);
if (reviewModeButton) reviewModeButton.addEventListener('click', toggleReviewMode);

loadFlashcards();

console.log('Script loaded');