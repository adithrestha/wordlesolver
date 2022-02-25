var wordLength = 5;
var words = [];

const addWordBtn = document.getElementById('add_word_btn');
const wordsArea = document.getElementById('words_area');
const resetBtnArea = document.getElementById('reset_btn_area');
const alertMessageArea = document.getElementById('alert_messages_area');
const searchSuggestionArea = document.getElementById('search_suggestion_area');
const suggestionArea = document.getElementById('suggestion_area');
const inputBox = document.getElementById('input_box');
const pluralCheckbox = document.getElementById('plurals');
const letterSlider = document.getElementById('slider');
const sliderText = document.getElementById('slider_text');
const colors = {
    '-': "secondary",
    '+': "success",
    '?': "warning"
}
const nextColorsAndKeys = {
    '-': ["warning", '?'],
    '?': ["success", '+'],
    '+': ["secondary", '-']

}
$(document).ready(function(){
    resetGame();
    $(letterSlider).on('change', changeSliderValue);
    $(addWordBtn).on('click', function(){ 
        if($(inputBox).val().length!==wordLength)
            return alert('Length not match');
        addWord($(inputBox).val());
        $(inputBox).val('');
    })
});

function addAlertMessage(msg = 'Tap 🡰 to select a suggested word. If you wish to try your word, please type it below.  Tap a tile to change its colour.') {
    $(alertMessageArea).empty();
    $(alertMessageArea).append(`
    <div class="row justify-content-center mt-2 mb-3">
        <div class="col-10 col-md-6">
            <div class="alert alert-primary" role="alert">${msg}</div>
        </div>
    </div>
    `);
}
function addResetBtn() {
    removeResetBtn();
    $(resetBtnArea).append(`
    <div class="row justify-content-center mt-4 mb-5">
        <div class="col-6">
            <button type="button" class="btn btn-success btn-lg">
                <i class="bi bi-arrow-clockwise"></i> Reset 
            </button>
        </div>
    </div>`);
    $(resetBtnArea).find('button').on('click', resetGame);
}
function removeResetBtn() {
    $(resetBtnArea).empty();
}
function addSearchBtn(msg = 'Get suggested words') {
    removeSearchBtn();
    $(searchSuggestionArea).append(`
    <div class="row justify-content-center mt-4 mb-4">
        <div class="col-10">
            <button type="button" class="btn btn-primary btn-lg">
                <i class="bi bi-binoculars"></i> 
                ${msg} 
            </button>
        </div>
    </div>
    `);
    $(searchSuggestionArea).find('button').on("click", searchWords);
}
function removeSearchBtn() {
    $(searchSuggestionArea).empty();
}
function updateSuggestions(data = []) {
    addResetBtn();
    $(searchSuggestionArea).empty();
    $(suggestionArea).empty();
    data.forEach((word, key) => {
        $(suggestionArea).append(`
            <div id="suggestion_${key+1}" class="row justify-content-center mt-2 mb-4">
                <div class="col-5">
                    <p class="fs-1 mt-1 mb-1 fw-bolder" style="letter-spacing: 1rem;">${word.toUpperCase()}</p>
                </div>
                <div class="col-1">
                    <button type="button" class="btn btn-link btn-lg mt-1 fs-3">
                        <i class="bi bi-arrow-left-circle-fill"></i>
                    </button>
                </div>
            </div>
        `);
        $(suggestionArea).find(`#suggestion_${key+1}`).on("click", function(){
            addWord(word);
        });
    });
}
function addWord(word) {
    word = word.toUpperCase();
    words.push([ word, '-'.repeat(wordLength) ]);
    updateWords();
}
function removeWord(key) {
    if(confirm('Are you sure you want to remove word?')) {
        words = words.filter((w,k)=>(key!==k));
        updateWords();
    }
}
function changeSliderValue() {
    wordLength = parseInt($(letterSlider).val());
    resetGame();
}
function changeLetter(w, p) {
    let prev = colors[ words[w][1][p] ];
    let next = nextColorsAndKeys[ words[w][1][p] ];
    $(`#word_${w+1} #leetter_${p+1} button`).removeClass(`btn_${prev}`).addClass(`btn_${next[0]}`);
    let new_word = words[w][1].split('');
    new_word[p] = next[1];
    words[w][1]=new_word.join('');
    updateWords();
}
function updateWords() {
    updateSuggestions([]);
    addResetBtn();
    addSearchBtn();
    $(alertMessageArea).empty();
    $(wordsArea).empty();
    words.forEach((word_arr,key) => {
        let word = word_arr[0];
        $(wordsArea).append(
        `<div id="word_${key+1}" class="row justify-content-center mb-3">
            <div class="col-0 col-md-2 col-lg-3"></div>
            ${
            word.split('').map((w,p)=>(
            `<div class="col pe-0 ps-0" id="letter_${p+1}">
                <button class="btn letter_btn btn-block btn-lg pb-0 btn-${colors[word_arr[1][p]]}" data-position="${p}">
                    <p class="h1 fw-2 pt-1 pb-0 ps-1 pe-1">${w}</p>
                </button>
            </div>`)).join('')}
            <div class="col pe-0">
                <div class="mt-1">
                    <button type="button" class="btn remove_btn btn-lg btn-link fs-3">
                        <i class="bi bi-x-circle-fill text-danger"></i>
                    </button>
                </div>
            </div>
            <div class="col-0 col-md-2 col-lg-3"></div>
        </div>`);
        $(`#word_${key+1}`).find('.letter_btn').on("click", function(){
            changeLetter(key, parseInt($(this).attr('data-position')));
        });
        $(`#word_${key+1}`).find('.remove_btn').on("click", function(){
            removeWord(key);
        });
    })
}
function resetGame() {
    $(wordsArea).empty();
    $(resetBtnArea).empty();
    $(searchSuggestionArea).empty();
    $(suggestionArea).empty();
    $(alertMessageArea).empty();
    addSearchBtn();
    addAlertMessage();
    words = [];
    $(inputBox).val('');
    $(sliderText).text(wordLength);
    $(inputBox).attr('maxlength', wordLength);
}
function addLoader() {
    $(suggestionArea).append(`
    <div class="row justify-content-center mb-3">
        <div class="col-2">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
    `);
}

function searchWords() {
    addLoader();
    fetch("/suggestion", {
		body: JSON.stringify({words:words, word_length:wordLength}),
		method: "POST", 
		headers: {
			"content-type": "application/json; charset=UTF-8",
		}
	})
    .then(res => (res.json()))
    .then(data => {
        $(suggestionArea).empty();
        if(data.message)
            return addAlertMessage(data.message);
        if(data.words.length===0)
            return addAlertMessage('No result found');
        updateSuggestions(data.words);
    })
    .catch(err=>{
        addAlertMessage("Error occured, see console");
        console.log(err);
    });
}