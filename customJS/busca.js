var table = $('#assetTable').DataTable({
    dom: 'Bfrtip',
    select: true,
    buttons: [
        {
            text: 'Abrir',
        }
    ],
    data: "",
    columns: [
        { title: "Ativo" },
        { title: "Hostname" },
        { title: "Classe" },
        { title: "Modelo" },
        { title: "Descrição" }
    ]
})

function consulta() {
    valor = document.getElementById("pesquisar").value
    if (!(valor.length == 0)) {
        // table.destroy()
        // table.draw()
        fetch(`http://127.0.0.1:3000/count/${valor}`)
            .then(response => {
                response.json()
                    .then(data => {
                        var array = []
                        for (var i = 0; i < data[0].Total; i++) {
                            array[i] = [data[i].Ativo, data[i].Hostname, data[i].Classe, data[i].Modelo, data[i].Descricao]
                        }
                        var table = $('#assetTable').DataTable({
                            destroy: true,
                            dom: 'Bfrtip',
                            select: true,
                            buttons: [
                                'copy',
                                'csv',
                                'excel',
                                'pdf',
                                {

                                    text: 'Abrir',
                                    action: function () {
                                        var assetData = table.rows({ selected: true }).data()
                                        var data = assetData[0]
                                        localStorage.setItem("storageName", data[0])
                                        window.open("/consulta/consulta.html", "", "popup")
                                    },
                                    // extend: 'print',
                                    // text: 'Print all (not just selected)',
                                    // exportOptions: {
                                    //     modifier: {
                                    //         selected: null
                                    //     }
                                    // }
                                }
                            ],
                            data: array,
                            columns: [
                                { title: "Ativo" },
                                { title: "Hostname" },
                                { title: "Classe" },
                                { title: "Modelo" },
                                { title: "Descrição" }
                            ]
                        }).clear().rows.add(array).draw()

                        $("#assetTable td").contextMenu({
                            menuSelector: "#contextMenu",
                            menuSelected: function (invokedOn, selectedMenu) {
                                if (selectedMenu.text() == "Abrir") {
                                    var asset = table.row(invokedOn).data();
                                    localStorage.setItem("storageName", asset[0])
                                    window.open("/consulta/consulta.html", "", "popup")
                                };
                            }
                        });

                        $('#assetTable tbody').on('dblclick', 'tr', function () {
                            var asset = table.row(this).data();
                            localStorage.setItem("storageName", asset[0])
                            window.open("/consulta/consulta.html", "", "popup")
                        });
                    })
            });



    } else {
        alert("Campo de busca vazio!")
    }

}

(function context($, window) {
    $.fn.contextMenu = function (settings) {
        return this.each(function () {
            // Open context menu
            $(this).on("contextmenu", function (e) {
                // return native menu if pressing control
                if (e.ctrlKey) return;

                //open menu
                var $menu = $(settings.menuSelector)
                    .data("invokedOn", $(e.target))
                    .show()
                    .css({
                        position: "absolute",
                        left: getMenuPosition(e.clientX, 'width', 'scrollLeft'),
                        top: getMenuPosition(e.clientY, 'height', 'scrollTop'),
                        shadow: true
                    })
                    .off('click')
                    .on('click', 'a', function (e) {
                        $menu.hide();

                        var $invokedOn = $menu.data("invokedOn");
                        var $selectedMenu = $(e.target);

                        settings.menuSelected.call(this, $invokedOn, $selectedMenu);
                    });

                return false;
            });

            //make sure menu closes on any click
            $('body').on("click", function () {
                $(settings.menuSelector).hide();
            });
        });

        function getMenuPosition(mouse, direction, scrollDir) {
            var win = $(window)[direction](),
                scroll = $(window)[scrollDir](),
                menu = $(settings.menuSelector)[direction](),
                position = mouse + scroll;

            // opening menu would pass the side of the page
            if (mouse + menu > win && menu < mouse)
                position -= menu;

            return position;
        }

    };
})(jQuery, window);

$("#pesquisar").keyup(function (event) {
    event.preventDefault()
    if (event.keyCode === 13) {
        $("#consultar-button").click()
    }
})