var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var action = URLSearchParams.get('action')

if (action === 'upload') {
    document.querySelector(`input[type='file']#readfile`).click()
}