const { Alert } = require("bootstrap")

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


async function consultar(ativo) {
    // Select no banco
    fetch(`http://127.0.0.1:3000/ativo/${ativo}`)
        .then(response => {
            response.json()
                .then(data => {
                    document.getElementById("ativo").value = data.Ativo
                    document.getElementById("hostname").value = data.Hostname
                    document.getElementById('classe-select').options[0].innerHTML = data.Classe;
                    document.getElementById('modelo-select').options[0].innerHTML = data.Modelo;
                    document.getElementById('descricao-select').options[0].innerHTML = data.Descricao;
                    document.getElementById("part-number").value = data.PartNumber
                    document.getElementById("numero-serie").value = data.NumeroSerie
                    document.getElementById("perifericos").value = data.Perifericos
                    document.getElementById('fabricante-select').options[0].innerHTML = data.Fabricante;
                    document.getElementById('fornecedor-select').options[0].innerHTML = data.Fornecedor;
                    document.getElementById("data-recebimento").value = data.DataRecebimento
                    document.getElementById("data-entrega").value = data.DataEntrega
                    document.getElementById("data-vencimento").value = data.Vencimento
                    document.getElementById('exercicio-select').options[0].innerHTML = data.Exercicio;
                    document.getElementById("carta-remessa").value = data.CartaRemessa
                    document.getElementById("NF-remessa").value = data.NFRemessa
                    document.getElementById("NF-venda").value = data.NFVenda
                    document.getElementById('contrato-select').options[0].innerHTML = data.Contrato;
                    document.getElementById("cr-servico").value = data.CrServico
                    document.getElementById("usuario").value = data.Usuario
                    document.getElementById('unidade-select').options[0].innerHTML = data.Unidade;
                    document.getElementById("local").value = data.Local
                    document.getElementById("chamado-servico").value = data.ChamadoServico
                    document.getElementById("ID").value = data.ID
                    document.getElementById("resumo").value = data.Resumo
                    document.getElementById("observacao").value = data.Observacao
                    document.getElementById('servico-select').options[0].innerHTML = data.Servico;
                    document.getElementById('status-select').options[0].innerHTML = data.Status;
                    document.getElementById("operacao").value = data.Operacao
                    document.getElementById("cr-cobranca").value = data.CrCobranca
                    document.getElementById("chamado-entrega").value = data.ChamadoEntrega
                    document.getElementById("valor-dolar").value = data.ValorDolar
                    document.getElementById("valor-ptax").value = data.ValorPtax
                    document.getElementById("valor-reais").value = data.ValorReais
                    document.getElementById("lote").value = data.Lote
                    document.getElementById('contratoE-select').options[0].innerHTML = data.ContratoEmbraer;

                    let nameElement = document.getElementById("pesquisar");
                    let newOptionElement = document.createElement("option");
                    newOptionElement.textContent = nameElement.value;
                    let listNameElement = document.getElementById("historico");

                    if (!document.getElementById(newOptionElement.textContent)) {
                        listNameElement.appendChild(newOptionElement);
                        nameElement.value = "";
                        newOptionElement.setAttribute('id', newOptionElement.textContent)
                    }

                })
        })
}
