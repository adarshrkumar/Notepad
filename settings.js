var items = [
    {
        id: 'username', 
        event: 'onchange', 

    }, 
    // {
    //     id: '', 
    // }, 
]

items.forEach(function(item, i) {
    var element = document.getElementById(item.id)
    if (!!element === false) element = document.querySelector(item.id)
    if (!!element) {
        if (item.event.startsWith('on')) element[item.event] = function() {
            saveToLocalStorage(item, selector)
        }
        else {
            element.addEventListener(item.event, function() {
                saveToLocalStorage(item, selector)
            })
        }
    }
})

function saveToLocalStorage(item, selector) {
    localStorage.setItem(item, selector.value)
}