require('jquery')
import $ from 'jquery'

$('#download').on('click', function() {
    function download() {
        const jsonObject = {
            name: 'John',
            age: 31,
            city: 'New York'
        }
        const fileContents = JSON.stringify(jsonObject, null, 2)
        const fileName = 'data.json'

        const pp = document.createElement('a')
        pp.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContents))
        pp.setAttribute('download', fileName)
        pp.click()
    }

    setTimeout(function() {
        download()
    }, 500)
})