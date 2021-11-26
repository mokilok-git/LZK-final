const STORAGE_KEY = "number"
// some calculation constants
const SECONDS_PER_MINUTE = 60
const MILLISECONDS_PER_SECOND = 1000

// settings
const REFRESH_SECONDS_API = 5 * SECONDS_PER_MINUTE;   // each 5min
const REFRESH_COUNTDOWN_INTERVAL = 250                // countdown refresh: 0.25sec
const MONEY_DIGITS = 2                                // display price with 2 digits (euro cents)
const KRAKEN_FETCH_URL = "https://api.kraken.com/0/public/Ticker?pair=XBTEUR"
const NOT_AVAILABLE_INFO = "n/a"
let alertMe = 55;


// objects in page
let startButton
let stopButton
let rateSpan
let refreshInfoSpan
let storeButton
let clearButton
let numberField
let storedValueOutput
let errorBlock
let infoBlock
// other variables
let nextRefreshDate = null


// wait for document loaded before init components
document.addEventListener('DOMContentLoaded', function() { initComponents() })
document.addEventListener('DOMContentLoaded', function() { initComponents2() })


// Debug method will simply write string param to console
function dbg(info) {
    console.log(info)
}

// Fetch current rate from KRAKEN and update the ticker
// On error stop refreshing
function fetchRate() {
    fetch(KRAKEN_FETCH_URL)
        .then(function(response) {
            return response.json()
        })
        .then(function(data) {
            let rate = data.result.XXBTZEUR.c[0]
            console.log("rate fetched: " + rate)
            updateTicker(rate)

        })
        .catch(function(err) {
            console.log("Error while fetching data from " + KRAKEN_FETCH_URL)
            console.log(err)
            stopRefresh()
        })
}

// Update the refresh info with seconds left for next rate fetching
function updateRefreshInfo(seconds) {
    refreshInfoSpan.textContent = seconds
}

// Update the rate itself in display.
// Note param is a string contains a number with a lot of digits
function updateTicker(rate) {
    let content = isNaN(rate) ? rate : parseFloat(rate).toFixed(MONEY_DIGITS)
    rateSpan.textContent = content
}

// Store timestamp for next refresh to global variable: NOW + REFRESH_SECONDS_API
function updateNextRefreshDate() {
    nextRefreshDate = new Date()
    nextRefreshDate.setTime(nextRefreshDate.getTime() + REFRESH_SECONDS_API * MILLISECONDS_PER_SECOND)
}

// Interval method which calls itself as long as a nextRefreshDate is set
function updateRefreshInterval() {
    if (nextRefreshDate != null) {
        let currentDate = new Date()
        let difference = Math.round((nextRefreshDate.getTime() - currentDate.getTime()) / MILLISECONDS_PER_SECOND)
        if (difference <= 0) {
            fetchRate()
            updateNextRefreshDate()
            updateRefreshInfo(0)
        } else {
            updateRefreshInfo(difference)
        }
        setTimeout(updateRefreshInterval, REFRESH_COUNTDOWN_INTERVAL)
    }
}

// start button callback
function startRefresh() {
    startButton.disabled = true
    stopButton.disabled = false
    fetchRate()
    updateNextRefreshDate()
    updateRefreshInterval()
    dbg("rate refresh started")
}

// stop button callback
function stopRefresh() {
    startButton.disabled = false
    stopButton.disabled = true
    nextRefreshDate = null         // Note: this will prevent next internal timeout in updateRefreshInterval()
    updateTicker(NOT_AVAILABLE_INFO)
    updateRefreshInfo(NOT_AVAILABLE_INFO)
    dbg("rate refresh stopped")
}

// init components (called after page is loaded)
function initComponents() {
    startButton = document.getElementById("btn_start")
    stopButton = document.getElementById("btn_stop")
    rateSpan = document.getElementById("rate-span")
    refreshInfoSpan = document.getElementById("refresh-info-span")

    updateTicker(NOT_AVAILABLE_INFO)
    updateRefreshInfo(NOT_AVAILABLE_INFO)
    startButton.onclick = function() { startRefresh() }
    stopButton.onclick = function() { stopRefresh() }
    stopButton.disabled = true

    dbg("components initialized")
}

//button functions
/*function myFunction() {
    document.getElementById("frm1").submit();
    document.getElementById("frm3").submit();}
/*function myFunction2() {
    document.getElementById("frm1").reset();
    document.getElementById("frm3").reset();}
////////////////////////*/
function debg(info) {
    console.log(info)
}

function showError(errorMsg) {
    errorBlock.textContent = errorMsg
}

function showInfo(msg) {
    infoBlock.textContent = msg
}

function showStoredValue() {
    storedValueOutput.textContent = localStorage.getItem(STORAGE_KEY)
}

function storeValue() {
    let rawValue = numberField.value
    if (isNaN(rawValue)) {
        showError(rawValue + " is not a number, cannot be stored")
        showInfo("")
    } else {
        showError("") // clear any last error
        localStorage.setItem(STORAGE_KEY, parseFloat(rawValue))
        showStoredValue()
        showInfo("New value stored")
    }
}

function clear() {
    showError("") // clear any last error
    localStorage.removeItem(STORAGE_KEY)
    showStoredValue()
    showInfo("Storage cleared")
}

// init components (called after page is loaded)
function initComponents2() {
    storeButton = document.getElementById("btn_store")
    clearButton = document.getElementById("btn_clear")
    numberField = document.getElementById("tf_numberinput")
    storedValueOutput = document.getElementById("out_currentvalue")
    errorBlock = document.getElementById("error-not-a-number")
    infoBlock = document.getElementById("info")

    storeButton.onclick = function() { storeValue() }
    clearButton.onclick = function() { clear() }
    showStoredValue()

    debg("components initialized")
}
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'red';
ctx.fillRect(20,20,150,100);
