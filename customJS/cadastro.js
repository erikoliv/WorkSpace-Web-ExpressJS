// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }
                form.classList.add('was-validated')
            }, false)
        })
})()

fetch(`http://localhost:3000/classe`)
    .then(response => {
        response.json()
            .then(data => {
                for (i = 0; i < data.length; i++) {
                    document.getElementById('classe-select').add(new Option(data[i].Classe))
                }
            })
    })

fetch(`http://localhost:3000/q/tabPreco`)
    .then(response => {
        response.json()
            .then(data => {
                console.log(data)
            })
    })

// var classe = document.getElementById('classe-select')
// classe.addEventListener("change", function () {
//     fetch("http://localhost:3000/modelo", {
//         method: "POST",
//         headers: new Headers({
//             'content-type': 'application/json'
//         }),
//         body: JSON.stringify({
//             classe: classe.value
//         })
//     });
// })


