window.onload = function() {
    const apiEnvironment = $("#apiEnvironment").val();
    const identificadorDaConta = $("#identificadorDaConta").val();
    var s = document.createElement('script');
    s.type = 'text/javascript';
    var v = parseInt(Math.random() * 1000000);
    s.src = `https://${apiEnvironment}.gerencianet.com.br/v1/cdn/${identificadorDaConta}/${v}`;
    s.async = false;
    s.id = identificadorDaConta;
    if (!document.getElementById(`${identificadorDaConta}`)) { document.getElementsByTagName('head')[0].appendChild(s); };
    $gn = { validForm: true, processed: false, done: {}, ready: function(fn) { $gn.done = fn; } };
    var linkCss = '<link rel="stylesheet" href="modules/gateways/efi/gerencianet_lib/css/viewInvoiceModal.css">';
    document.body.insertAdjacentHTML('beforeend', linkCss);
    /**
     * Função Gerencianet para gerar o payment token
     */
    $gn.ready(function(checkout) {
        startProcesso(checkout);
    });


    function startProcesso(checkout) {
        $.ajax({
            url: "modules/gateways/efi/gerencianet_lib/html/btnViewModal.html",
            dataType: "html",
            cache: false,
            success: function(dados) {
                btnModalActions(dados, checkout);
            }
        });
    }





    /**
     * Mascara aplicada nos inputs 
     */
    function format() {
        $("#documentClientBillet").keydown(function() {
            try {
                $("#documentClientBillet").unmask();
            } catch (e) {}

            var tamanho = $("#documentClientBillet").val().length;
            if (tamanho < 13) {
                $("#documentClientBillet").mask("999.999.999-999999");
            } else {
                $("#documentClientBillet").mask("99.999.999/9999-99");
            }

            // ajustando foco
            var elem = this;
            setTimeout(function() {
                // mudo a posição do seletor
                elem.selectionStart = elem.selectionEnd = 10000;
            }, 0);
            // reaplico o valor para mudar o foco
            var currentValue = $(this).val();
            $(this).val('');
            $(this).val(currentValue);
        });

        $("#documentClientCredit").keydown(function() {
            try {
                $("#documentClientCredit").unmask();

            } catch (e) {}

            var tamanho = $("#documentClientCredit").val().length;

            if (tamanho < 13) {
                $("#documentClientCredit").mask("999.999.999-999999");
            } else {
                $("#documentClientCredit").mask("99.999.999/9999-99");
            }

            // ajustando foco
            var elem = this;
            setTimeout(function() {
                // mudo a posição do seletor
                elem.selectionStart = elem.selectionEnd = 10000;
            }, 0);
            // reaplico o valor para mudar o foco
            var currentValue = $(this).val();
            $(this).val('');
            $(this).val(currentValue);
        });

        $("#documentClientPix").keydown(function() {
            try {
                $("#documentClientPix").unmask();
            } catch (e) {}

            var tamanho = $("#documentClientPix").val().length;

            if (tamanho < 13) {
                $("#documentClientPix").mask("999.999.999-999999");
            } else {
                $("#documentClientPix").mask("99.999.999/9999-99");
            }

            // ajustando foco
            var elem = this;
            setTimeout(function() {
                // mudo a posição do seletor
                elem.selectionStart = elem.selectionEnd = 10000;
            }, 0);
            // reaplico o valor para mudar o foco
            var currentValue = $(this).val();
            $(this).val('');
            $(this).val(currentValue);
        });



        $("#documentClientOF").keydown(function() {
            try { $("#documentClientOF").unmask(); } catch (e) {}
            $("#documentClientOF").mask("999.999.999-99");

            // ajustando foco
            var elem = this;
            setTimeout(function() {
                // mudo a posição do seletor
                elem.selectionStart = elem.selectionEnd = 10000;
            }, 0);
            // reaplico o valor para mudar o foco
            var currentValue = $(this).val();
            $(this).val('');
            $(this).val(currentValue);
        });

        $("#documentPJClientOF").keydown(function() {
            try { $("#documentPJClientOF").unmask(); } catch (e) {}
            
            $("#documentPJClientOF").mask("99.999.999/9999-99");

            // ajustando foco
            var elem = this;
            setTimeout(function() {
                // mudo a posição do seletor
                elem.selectionStart = elem.selectionEnd = 10000;
            }, 0);
            // reaplico o valor para mudar o foco
            var currentValue = $(this).val();
            $(this).val('');
            $(this).val(currentValue);
        });

        $("#telephoneBillet").mask("(00) 0000-00009");
        $("#telephoneCredit").mask("(00) 0000-00009");
        $("#cep").mask("99.999-999");
        $("#numCartao").mask("0000 0000 0000 0000");
        $("#numCartaoMobile").mask("0000 0000 0000 0000");
    }

    function shadowButton() {
        $('.button').hover(() => {
            $('.button').addClass('shadow-lg')
        }, () => {
            $('.button').removeClass('shadow-lg')
        })

    }

    function loadParticipantsOpenFinance() {

        $.ajax({
            type: "GET",
            url: "modules/gateways/efi/gerencianet_lib/functions/frontend/ajax/OpenFinanceAjaxHandler.php?participants=1",
            success: function(response) {
                var jsonData = JSON.parse(response);
                console.log("OF response:");
                console.log(jsonData);
                $('#bankOF').empty();
                $('#bankOF').append('<option value="">Escolha o banco...</option>');
                jsonData.participantes.forEach(function(value, i) {
                    $('#bankOF').append(`<option value="${value.identificador}">${value.nome}</option>`)
                });
            },
            error: function(error) {
                console.log(`OF error: ${error.status} - ${error.statusText}`);
            }
        })
    }


    function formatYear() {
        let anoVencimento = new Date().getFullYear();
        let optionAno = `<option value="${anoVencimento}">${anoVencimento}</option>`
        $('#anoVencimento').append(optionAno);
        for (let i = 1; i < 16; i++) {
            let optionAno = `<option value="${anoVencimento + i}">${anoVencimento + i}</option>`
            $('#anoVencimento').append(optionAno);

        }
        $('#anoVencimentoMobile').append(optionAno);
        for (let i = 1; i < 15; i++) {
            let optionAno = `<option value="${anoVencimento + i}">${anoVencimento + i}</option>`
            $('#anoVencimentoMobile').append(optionAno);

        }
    }


    /**
     * Validação da bandeira do cartão
     */
    let brandOption = (element) => {
        let bandeiraCartao = '';
        var numCartao = element.val().replaceAll(' ', '');
        var brand = "null";
        if (numCartao.length >= 13) {
            // MASTERCARD
            var regexMastercard = /^((5(([1-2]|[4-5])[0-9]{8}|0((1|6)([0-9]{7}))|3(0(4((0|[2-9])[0-9]{5})|([0-3]|[5-9])[0-9]{6})|[1-9][0-9]{7})))|((508116)\\d{4,10})|((502121)\\d{4,10})|((589916)\\d{4,10})|(2[0-9]{15})|(67[0-9]{14})|(506387)\\d{4,10})/;
            var resMastercard = regexMastercard.exec(numCartao);
            if (resMastercard) {
                brand = "<img src='modules/gateways/efi/gerencianet_lib/images/mastercard.png' style='width:50px;' >";
                bandeiraCartao = 'mastercard'
            }
            // ELO  
            var regexELO = /^4011(78|79)|^43(1274|8935)|^45(1416|7393|763(1|2))|^50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9])|^627780|^63(6297|6368|6369)|^65(0(0(3([1-3]|[5-9])|4([0-9])|5[0-1])|4(0[5-9]|[1-3][0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8]|4[1-9]|[5-8][0-9]|9[0-8])|7(0[0-9]|1[0-8]|2[0-7])|9(0[1-9]|[1-6][0-9]|7[0-8]))|16(5[2-9]|[6-7][0-9])|50(0[0-9]|1[0-9]|2[1-9]|[3-4][0-9]|5[0-8]))/;
            var resELO = regexELO.exec(numCartao);
            if (resELO) {
                brand = "<img src='modules/gateways/efi/gerencianet_lib/images/elo.png' style='width:50px;' >";
                bandeiraCartao = 'elo'
            }
            // AMEX 
            var regexAmex = /^3[47][0-9]{13}$/;
            var resAmex = regexAmex.exec(numCartao);
            if (resAmex) {
                brand = "<img src='modules/gateways/efi/gerencianet_lib/images/amex.png' style='width:50px;' >";
                bandeiraCartao = 'amex'
            }

            //Diners 
            var regexDiners = /(36[0-8][0-9]{3}|369[0-8][0-9]{2}|3699[0-8][0-9]|36999[0-9])/;
            var resDiners = regexDiners.exec(numCartao);
            if (resDiners) {
                brand = "<img src='modules/gateways/efi/gerencianet_lib/images/diners.png' style='width:50px;' >";
                bandeiraCartao = 'diners'
            }

            // Hipercard
            var regexHipercard = /^606282|^3841(?:[0|4|6]{1})0/;
            var resHipercard = regexHipercard.exec(numCartao);
            if (resHipercard) {
                brand = "<img src='modules/gateways/efi/gerencianet_lib/images/hipercard.png' style='width:50px;' >";
                bandeiraCartao = 'hipercard'
            }

            // Visa 
            var regexVisa = /^4[0-9]{15}$/;
            var resVisa = regexVisa.exec(numCartao);
            if (resVisa) {
                brand = "<img src='modules/gateways/efi/gerencianet_lib/images/visa.png' style='width:50px;' >";
                bandeiraCartao = 'visa'
            }

            // MOSTRA RESULTADO
            if (brand != 'null') {
                $('#card').empty();
                $('#card').append(brand);
            }

            if (brand == 'null') {
                $('#card').empty();
                $('#card').append("<img src='modules/gateways/efi/gerencianet_lib/images/cartao.png' style='width:50px;' >");
            }
        } else {
            $('#card').empty();
            $('#card').append("<img src='modules/gateways/efi/gerencianet_lib/images/cartao.png' style='width:50px;' >");
        }

        return bandeiraCartao;

    }



    function verifyPaymentToken(checkout, inputCartao, i = 0) {


        if (i == 1) {
            var numCartao = inputCartao.val().replaceAll(' ', '');
            let brandOptionVerify = brandOption(inputCartao) != '' && brandOption(inputCartao) != undefined && brandOption(inputCartao) != null && numCartao.length >= 13;
            let codSeguranca = $('#codSeguranca').val().length >= 3;
            let mesVencimento = $('#mesVencimento option:selected').val().length == 2;
            let anoVencimento = $('#anoVencimento option:selected').val().length == 4;
            let numParcelas = $('#numParcelas option:selected').val().length > 0;

            if (brandOptionVerify && codSeguranca && mesVencimento && anoVencimento && numParcelas) {

                $(".invalid-feedback").remove();
                checkout.getPaymentToken({
                    brand: brandOption(inputCartao),
                    number: $('#numCartao').val().replaceAll(' ', ''),
                    cvv: $('#codSeguranca').val(),
                    expiration_month: $('#mesVencimento option:selected').val(),
                    expiration_year: $('#anoVencimento option:selected').val()
                }, (err, res) => {
                    if (err == null) {
                        $("#payment_token").val(res.data.payment_token);

                        $(".formularios :submit").removeAttr('disabled');
                        $("#numCartao").removeClass("is-invalid");
                        $('.formularios :submit').css('opacity', '1');
                    } else {
                        $("#payment_token").val('');
                        var input = '';
                        input = $("<div />", {
                            class: 'invalid-feedback'
                        });
                        $(input).html('Número do cartão inválido');
                        $('#numCartao').after(input);
                        $(".formularios :submit").prop('disabled', true);
                        $('.formularios :submit').css('opacity', '0.3');
                        $("#numCartao").addClass("is-invalid");
                    }


                })
            }
        } else {
            var numCartao = inputCartao.val().replaceAll(' ', '');
            let brandOptionVerify = brandOption(inputCartao) != '' && brandOption(inputCartao) != undefined && brandOption(inputCartao) != null && numCartao.length >= 13;
            let codSeguranca = $('#codSegurancaMobile').val().length >= 3;
            let mesVencimento = $('#mesVencimentoMobile option:selected').val().length == 2;
            let anoVencimento = $('#anoVencimentoMobile option:selected').val().length == 4;
            let numParcelas = $('#numParcelasMobile option:selected').val().length > 0;

            if (brandOptionVerify && codSeguranca && mesVencimento && anoVencimento && numParcelas) {
                checkout.getPaymentToken({
                    brand: brandOption(inputCartao),
                    number: $('#numCartaoMobile').val().replaceAll(' ', ''),
                    cvv: $('#codSegurancaMobile').val(),
                    expiration_month: $('#mesVencimentoMobile option:selected').val(),
                    expiration_year: $('#anoVencimentoMobile option:selected').val()
                }, (err, res) => {
                    if (err == null) {
                        $("#payment_token").val(res.data.payment_token);
                        $(".formularios :submit").removeAttr('disabled');
                        $("#numCartaoMobile").removeClass("is-invalid");
                        $('.formularios :submit').css('opacity', '1');
                    } else {
                        $("#payment_token").val('');
                        var input = '';
                        input = $("<div />", {
                            class: 'invalid-feedback'
                        });
                        $(input).html('Número do cartão inválido');
                        $('#numCartaoMobile').after(input);
                        $(".formularios :submit").prop('disabled', true);
                        $('.formularios :submit').css('opacity', '0.3');
                        $("#numCartaoMobile").addClass("is-invalid");
                    }

                })
            }
        }

    }




    let intervalTotal = () => {
        if ($('.invoice_value').val() > 0) {
            addTotalBoleto();
            addTotalPix();
            addTotalCartao();
            addTotalOpenFinance();

            if ($('.ativarCredito').val() != 1) {
                $('#container_credit').remove();
                //$('.credit_card').remove();
                $('.creditSelected').remove();
                if ($('.boletoOption').val() != 1) {
                    //$('.pix').addClass('selectedOption');
                    $('#container_pix').addClass('selectedOption');
                    $('#pix').prop('checked', true);
                    $('.pixSelected').show();
                    $(".button").html('Gerar QRCode');
                }
            }

            if ($('.boletoOption').val() != 1) {
                //$('.billet').remove();
                $('#container_billet').remove();
                $('.billetSelected').remove();
                //$('.credit_card').addClass('selectedOption');
                $('#container_credit').addClass('selectedOption');
                $('#credit').prop('checked', true);
                $('.creditSelected').show();
                $(".button").html('Pagar');

            }

            if ($('.pixOption').val() != 1) {
                //$('.pix').remove();
                $('#container_pix').remove();
                $('.pixSelected').remove();
            }

            if ($('.openFinanceOption').val() != 1) {
                //$('.pix').remove();
                $('#container_openfinance').remove();
                $('.openfinanceSelected').remove();
            } 

        }
    };

    function verifyActivation(name) {
        return document.getElementById(name) != null;
    }

    function formatValue(value) {
        return Intl.NumberFormat('pt-br', { style: 'currency', currency: 'BRL' }).format(value);
    }

    function addTotalBoleto() {
        if ($('.totalDescontoBoleto').val() > 0) {
            var div = '';
            var span = '';

            div = $("<div />", {
                id: 'total',
                class: 'container-fluid d-flex justify-content-between border mt-5 p-1'
            });
            $('.billetSelected').append(div);
            span = $("<span />", {
                id: 'spanTotal',
                class: 'font-weight-bold'
            });
            $('#total').append(span);
            $('#spanTotal').html(`Total:`)
            span = $("<span />", {
                id: 'spanValorTotal',
                class: 'font-weight-bold'
            });
            $('#total').append(span);
            $('#spanValorTotal').html(`${formatValue($('.invoice_value').val())}`)
            div = $("<div />", {
                id: 'descontoBoleto',
                class: 'container-fluid d-flex justify-content-between border p-1'
            });
            $('.billetSelected').append(div);
            span = $("<span />", {
                id: 'spanDesconto',
                class: 'font-weight-bold'
            });
            $('#descontoBoleto').append(span);
            $('#spanDesconto').html(`Desconto boleto:`)
            span = $("<span />", {
                id: 'spanDescontoTotal',
                class: 'font-weight-bold'
            });
            $('#descontoBoleto').append(span);
            $('#spanDescontoTotal').html(`-${formatValue($('.totalDescontoBoleto').val())}`)
            div = $("<div />", {
                id: 'descontoBoletoSubtraido',
                class: 'container-fluid d-flex justify-content-between border p-1'
            });
            $('.billetSelected').append(div);
            span = $("<span />", {
                id: 'spanDescontoSubtraido',
                class: 'font-weight-bold'
            });
            $('#descontoBoletoSubtraido').append(span);
            $('#spanDescontoSubtraido').html(`Total a pagar:`)
            span = $("<span />", {
                id: 'spanDescontoTotalSubtraido',
                class: 'font-weight-bold'
            });
            $('#descontoBoletoSubtraido').append(span);
            $('#spanDescontoTotalSubtraido').html(`${formatValue($('.invoice_value').val() - $('.totalDescontoBoleto').val())}`)
        } else {
            div = '';
            span = '';
            div = $("<div />", {
                id: 'total',
                class: 'container-fluid d-flex justify-content-between border mt-5 p-1'
            });
            $('.billetSelected').append(div);
            span = $("<span />", {
                id: 'spanTotal',
                class: 'font-weight-bold'
            });
            $('#total').append(span);
            $('#spanTotal').html(`Total:`)
            span = $("<span />", {
                id: 'spanValorTotal',
                class: 'font-weight-bold'
            });
            $('#total').append(span);
            $('#spanValorTotal').html(`${formatValue($('.invoice_value').val())}`)
        }
    }

    function addTotalPix() {
        if ($('.totalDescontoPix').val() > 0) {
            var div = '';
            var span = '';
            div = $("<div />", {
                id: 'totalPix',
                class: 'container-fluid d-flex justify-content-between border mt-5 p-1'
            });
            $('.pixSelected').append(div);
            span = $("<span />", {
                id: 'spanTotalPix',
                class: 'font-weight-bold'
            });
            $('#totalPix').append(span);
            $('#spanTotalPix').html(`Total:`)
            span = $("<span />", {
                id: 'spanValorTotalPix',
                class: 'font-weight-bold'
            });
            $('#totalPix').append(span);
            $('#spanValorTotalPix').html(`${formatValue($('.invoice_value').val())}`)
            div = $("<div />", {
                id: 'descontoPix',
                class: 'container-fluid d-flex justify-content-between border p-1'
            });
            $('.pixSelected').append(div);
            span = $("<span />", {
                id: 'spanDescontoPix',
                class: 'font-weight-bold'
            });
            $('#descontoPix').append(span);
            $('#spanDescontoPix').html(`Desconto pix:`)
            span = $("<span />", {
                id: 'spanDescontoTotalPix',
                class: 'font-weight-bold'
            });
            $('#descontoPix').append(span);
            $('#spanDescontoTotalPix').html(`-${formatValue($('.totalDescontoPix').val())}`)
            div = $("<div />", {
                id: 'descontoPixSubtraido',
                class: 'container-fluid d-flex justify-content-between border p-1'
            });
            $('.pixSelected').append(div);
            span = $("<span />", {
                id: 'spanDescontoSubtraidoPix',
                class: 'font-weight-bold'
            });
            $('#descontoPixSubtraido').append(span);
            $('#spanDescontoSubtraidoPix').html(`Total a pagar:`)
            span = $("<span />", {
                id: 'spanDescontoTotalSubtraidoPix',
                class: 'font-weight-bold'
            });
            $('#descontoPixSubtraido').append(span);
            $('#spanDescontoTotalSubtraidoPix').html(`${formatValue($('.invoice_value').val() - $('.totalDescontoPix').val())}`)

        } else {
            var div = '';
            var span = '';
            div = $("<div />", {
                id: 'totalPix',
                class: 'container-fluid d-flex justify-content-between border mt-5 p-1'
            });
            $('.pixSelected').append(div);
            span = $("<span />", {
                id: 'spanTotalPix',
                class: 'font-weight-bold'
            });
            $('#totalPix').append(span);
            $('#spanTotalPix').html(`Total:`)
            span = $("<span />", {
                id: 'spanValorTotalPix',
                class: 'font-weight-bold'
            });
            $('#totalPix').append(span);
            $('#spanValorTotalPix').html(`${formatValue($('.invoice_value').val())}`)
        }

    }

    function addTotalCartao() {
        var div = '';
        var span = '';
        div = $("<div />", {
            id: 'totalCredito',
            class: 'container-fluid d-flex justify-content-between border mt-5 p-1'
        });
        $('.creditSelected').append(div);
        span = $("<span />", {
            id: 'spanTotaCredit',
            class: 'font-weight-bold'
        });
        $('#totalCredito').append(span);
        $('#spanTotaCredit').html(`Total à vista:`)
        span = $("<span />", {
            id: 'spanValorTotalCredit',
            class: 'font-weight-bold'
        });
        $('#totalCredito').append(span);
        $('#spanValorTotalCredit').html(`${formatValue($('.invoice_value').val())}`)
        $('#totalCredito').append(span);

        $(".creditSelected").append(div);
    }

    function addTotalOpenFinance() {
        var div = '';
        var span = '';
        div = $("<div />", {
            id: 'totalOpenFinance',
            class: 'container-fluid d-flex justify-content-between border mt-5 p-1'
        });
        $('.openfinanceSelected').append(div);
        span = $("<span />", {
            id: 'spanTotalOpenFinance',
            class: 'font-weight-bold'
        });
        $('#totalOpenFinance').append(span);
        $('#spanTotalOpenFinance').html(`Total:`)
        span = $("<span />", {
            id: 'spanValorTotalOpenFinance',
            class: 'font-weight-bold'
        });
        $('#totalOpenFinance').append(span);
        $('#spanValorTotalOpenFinance').html(`${formatValue($('.invoice_value').val())}`)
        $('#totalOpenFinance').append(span);

        $(".openfinanceSelected").append(div);
    }

    function veriFyMinValue() {
        if ($('.totalDescontoBoleto').val() > 0) {
            if (($('.invoice_value').val() - $('.totalDescontoBoleto').val()) < 5) {
                $('.billetSelected').children().remove();
                var div = '';
                var span = '';

                div = $("<div />", {
                    id: 'total',
                    class: 'container-fluid d-flex justify-content-between border mt-5 p-1'
                });
                $('.billetSelected').append(div);
                span = $("<span />", {
                    id: 'spanTotal',
                    class: 'font-weight-bold'
                });
                $('#total').append(span);
                $('#spanTotal').html(`Valor da compra:`)
                span = $("<span />", {
                    id: 'spanValorTotal',
                    class: 'font-weight-bold'
                });
                $('#total').append(span);
                $('#spanValorTotal').html(`${formatValue($('.invoice_value').val())}`)
                div = $("<div />", {
                    id: 'descontoBoleto',
                    class: 'container-fluid d-flex justify-content-between border p-1'
                });
                $('.billetSelected').append(div);
                span = $("<span />", {
                    id: 'spanDesconto',
                    class: 'font-weight-bold'
                });
                $('#descontoBoleto').append(span);
                $('#spanDesconto').html(`Desconto boleto:`)
                span = $("<span />", {
                    id: 'spanDescontoTotal',
                    class: 'font-weight-bold'
                });
                $('#descontoBoleto').append(span);
                $('#spanDescontoTotal').html(`-${formatValue($('.totalDescontoBoleto').val())}`)
                div = $("<div />", {
                    id: 'descontoBoletoSubtraido',
                    class: 'container-fluid d-flex justify-content-between border  p-1',
                    style: 'opacity: 0.6; border-top-width: 2px !important; border-top-color: black !important;'
                });
                $('.billetSelected').append(div);
                span = $("<span />", {
                    id: 'spanDescontoSubtraido',
                    class: 'font-weight-bold'
                });
                $('#descontoBoletoSubtraido').append(span);
                $('#spanDescontoSubtraido').html(`Total a pagar:`)
                span = $("<span />", {
                    id: 'spanDescontoTotalSubtraido',
                    class: 'font-weight-bold '
                });
                $('#descontoBoletoSubtraido').append(span);
                $('#spanDescontoTotalSubtraido').html(`${formatValue($('.invoice_value').val() - $('.totalDescontoBoleto').val())}`)

                div = $("<div />", {
                    id: 'msgFalhaComDesconto',
                    class: 'container-fluid d-flex justify-content-end mt-1 p-1'
                });
                $('.billetSelected').append(div);
                span = $("<span />", {
                    id: 'spanMsgFalhaComDesconto',
                    class: 'font-weight-bold text-danger'
                });
                $('#msgFalhaComDesconto').append(span);
                $('#spanMsgFalhaComDesconto').html(`Compra miníma para boleto: R$5,00`)


                $(".formularios :submit").prop('disabled', true);
                $('.formularios :submit').css('opacity', '0.3');
            }


        }
        if ($('.invoice_value').val() < 5) {

            $('.creditSelected').children().remove();
            $('.creditSelected').html('<span class="validationMessage text-danger">Compra miníma para cartão: R$5,00</span>');

            $('.billetSelected').children().remove();
            $('.billetSelected').html('<span class="validationMessage text-danger">Compra miníma para boleto: R$5,00</span>');

            $(".formularios :submit").prop('disabled', true);
            $('.formularios :submit').css('opacity', '0.3');

        }

    }

    function btnModalActions(btn, checkout) {
        document.getElementById("modal_content").insertAdjacentHTML('beforeend', btn);
        let buttonFinalizar = $('.botao');

        $(buttonFinalizar).css('display', 'inline-block');
        $(buttonFinalizar).prop('disabled', true);
        $(buttonFinalizar).addClass('disabled');
        setTimeout(() => {
            $(buttonFinalizar).removeAttr('disabled');
            $(buttonFinalizar).removeClass('disabled');
        }, 3000);

        $(buttonFinalizar).click(function() {

            $.ajax({
                url: 'modules/gateways/efi/gerencianet_lib/css/bootstrap.min.css',
                dataType: "text",
                cache: false,
                success: function(bootstrap) {
                    style = $("<style />", { id: "theme_gateway" });
                    $(style).html(bootstrap);
                    $("#modal_content").append(style);
                },
                error: function(xhr, status, error) {
                    console.log(error)
                }

            })
            if (!$("div").hasClass("optionPaymentGerencianet")) {

                $.ajax({
                    url: "modules/gateways/efi/gerencianet_lib/html/viewInvoiceModal.html",
                    dataType: "html",
                    cache: false,
                    success: function(modal) {
                        loadModal(modal, checkout);
                    }
                })

            } else {
                $('.optionPaymentGerencianet').show(700);
            }


        });
    }

    function changePaymentOption(btn_label, chosen_option) {
        let pay_options = ['credit', 'billet', 'pix', 'openfinance']
        pay_options.forEach(option => {
            let element = document.getElementById(`container_${option}`);
            if (element != undefined) element.classList.remove('selectedOption');
            $(`.${option}Selected`).hide(0);
        });
        document.getElementById(`container_${chosen_option}`).classList.add('selectedOption');
        document.getElementById(chosen_option).checked = true;
        $('.button').html(btn_label);
        $(`.${chosen_option}Selected`).show();
    }

    function loadModal(modal, checkout) {
        document.getElementById("modal_content").insertAdjacentHTML('beforebegin', modal);
        $("#billet").attr('checked', true);
        $('.optionPaymentGerencianet').show(700);
        $('.optionPaymentGerencianet').css('display', 'flex');
        $('.optionPaymentGerencianet').click(function(e) {
            if (e.target.className.includes('optionPaymentGerencianet')) {
                $("#theme_gateway").remove();
                $('.optionPaymentGerencianet').hide(700);
            }

        });
        changePaymentOption('Gerar Boleto', 'billet');
        $('.fechar').click(function(e) {
            $("#theme_gateway").remove();
            $('.optionPaymentGerencianet').hide(700);

        });

        document.getElementById('container_billet').onclick = () => {
            $(".formularios :submit").removeAttr('disabled');
            $('.formularios :submit').css('opacity', '1');

            veriFyMinValue();

            changePaymentOption('Gerar Boleto', 'billet');

            $('#nameBillet').attr('required', true);
            $('#documentClientBillet').attr('required', true);
            $('#clientEmailBillet').attr('required', true);

            $('#nameCredit').removeAttr('required');
            $('#clientEmailCredit').removeAttr('required');
            $('#documentClientCredit').removeAttr('required');
            $('#telephoneCredit').removeAttr('required');
            $('#dataNasce').removeAttr('required');
            $('#rua').removeAttr('required');
            $('#numero').removeAttr('required');
            $('#bairro').removeAttr('required');
            $('#cidade').removeAttr('required');
            $('#estado').removeAttr('required');
            $('#cep').removeAttr('required');

            if ($(document).width() > 767) {
                $('#numCartao').removeAttr('required');
                $('#codSeguranca').removeAttr('required');
                $('#mesVencimento').removeAttr('required');
                $('#anoVencimento').removeAttr('required');
                $('#numParcelas').removeAttr('required');
            } else {
                $('#numCartaoMobile').removeAttr('required');
                $('#codSegurancaMobile').removeAttr('required');
                $('#mesVencimentoMobile').removeAttr('required');
                $('#anoVencimentoMobile').removeAttr('required');
                $('#numParcelasMobile').removeAttr('required');
            }


            $('#documentClientPix').removeAttr('required');
            $('#clientNamePix').removeAttr('required');

        }


        document.getElementById('container_credit').onclick = () => {
            if ($("#payment_token").val() == '') {
                $(".formularios :submit").prop('disabled', true);
                $('.formularios :submit').css('opacity', '0.3');
            }
            veriFyMinValue();

            changePaymentOption('Pagar', 'credit');

            $('#nameBillet').removeAttr('required');
            $('#documentClientBillet').removeAttr('required');
            $('#clientEmailBillet').removeAttr('required');

            $('#nameCredit').attr('required', true);
            $('#clientEmailCredit').attr('required', true);
            $('#documentClientCredit').attr('required', true);
            $('#telephoneCredit').attr('required', true);
            $('#dataNasce').attr('required', true);
            $('#rua').attr('required', true);
            $('#numero').attr('required', true);
            $('#bairro').attr('required', true);
            $('#cidade').attr('required', true);
            $('#estado').attr('required', true);
            $('#cep').attr('required', true);

            if ($(document).width() > 767) {
                $('#numCartao').attr('required', true);
                $('#codSeguranca').attr('required', true);
                $('#mesVencimento').attr('required', true);
                $('#anoVencimento').attr('required', true);
                $('#numParcelas').attr('required', true);
            } else {
                $('#numCartaoMobile').attr('required', true);
                $('#codSegurancaMobile').attr('required', true);
                $('#mesVencimentoMobile').attr('required', true);
                $('#anoVencimentoMobile').attr('required', true);
                $('#numParcelasMobile').attr('required', true);
            }


            $('#documentClientPix').removeAttr('required');
            $('#clientNamePix').removeAttr('required');
        }

        document.getElementById('container_pix').onclick = () => {
            $(".formularios :submit").removeAttr('disabled');
            $('.formularios :submit').css('opacity', '1');

            changePaymentOption('Gerar QRCode', 'pix');


            $('#nameBillet').removeAttr('required');
            $('#documentClientBillet').removeAttr('required');
            $('#clientEmailBillet').removeAttr('required');


            $('#nameCredit').removeAttr('required');
            $('#clientEmailCredit').removeAttr('required');
            $('#documentClientCredit').removeAttr('required');
            $('#telephoneCredit').removeAttr('required');
            $('#dataNasce').removeAttr('required');
            $('#rua').removeAttr('required');
            $('#numero').removeAttr('required');
            $('#bairro').removeAttr('required');
            $('#cidade').removeAttr('required');
            $('#estado').removeAttr('required');
            $('#cep').removeAttr('required');

            if ($(document).width() > 767) {
                $('#numCartao').removeAttr('required');
                $('#codSeguranca').removeAttr('required');
                $('#mesVencimento').removeAttr('required');
                $('#anoVencimento').removeAttr('required');
                $('#numParcelas').removeAttr('required');
            } else {
                $('#numCartaoMobile').removeAttr('required');
                $('#codSegurancaMobile').removeAttr('required');
                $('#mesVencimentoMobile').removeAttr('required');
                $('#anoVencimentoMobile').removeAttr('required');
                $('#numParcelasMobile').removeAttr('required');
            }

            $('#documentClientPix').attr('required', true);
            $('#clientNamePix').attr('required', true);
        }

        document.getElementById('container_openfinance').onclick = () => {
            $(".formularios :submit").removeAttr('disabled');
            $('.formularios :submit').css('opacity', '1');


            changePaymentOption('Pagar', 'openfinance');

            loadParticipantsOpenFinance();

            $('#nameBillet').removeAttr('required');
            $('#documentClientBillet').removeAttr('required');
            $('#clientEmailBillet').removeAttr('required');


            $('#nameCredit').removeAttr('required');
            $('#clientEmailCredit').removeAttr('required');
            $('#documentClientCredit').removeAttr('required');
            $('#telephoneCredit').removeAttr('required');
            $('#dataNasce').removeAttr('required');
            $('#rua').removeAttr('required');
            $('#numero').removeAttr('required');
            $('#bairro').removeAttr('required');
            $('#cidade').removeAttr('required');
            $('#estado').removeAttr('required');
            $('#cep').removeAttr('required');

            if ($(document).width() > 767) {
                $('#numCartao').removeAttr('required');
                $('#codSeguranca').removeAttr('required');
                $('#mesVencimento').removeAttr('required');
                $('#anoVencimento').removeAttr('required');
                $('#numParcelas').removeAttr('required');
            } else {
                $('#numCartaoMobile').removeAttr('required');
                $('#codSegurancaMobile').removeAttr('required');
                $('#mesVencimentoMobile').removeAttr('required');
                $('#anoVencimentoMobile').removeAttr('required');
                $('#numParcelasMobile').removeAttr('required');
            }


            $('#documentClientPix').removeAttr('required');
            $('#clientNamePix').removeAttr('required');
        }

        /*
        //document.getElementsByClassName('billet')[0].onclick = () => {
        document.getElementById('container_billet').onclick = () => {
            $(".formularios :submit").removeAttr('disabled');
            $('.formularios :submit').css('opacity', '1');
            veriFyMinValue();

            document.getElementById('billet').checked = true;

            //document.getElementsByClassName('billet')[0].classList.add('selectedOption');
            document.getElementById('container_billet').classList.add('selectedOption');
            (document.getElementById('container_pix') != undefined) ? document.getElementById('container_pix').classList.remove('selectedOption') : "";
            (document.getElementById('container_credit') != undefined) ? document.getElementById('container_credit').classList.remove('selectedOption') : "";

            $('.button').html('Gerar Boleto');
            $('.creditSelected').hide(0);
            $('.pixSelected').hide(0);
            $('.billetSelected').show();

            $('#nameBillet').attr('required', true);
            $('#documentClientBillet').attr('required', true);
            $('#clientEmailBillet').attr('required', true);

            $('#nameCredit').removeAttr('required');
            $('#clientEmailCredit').removeAttr('required');
            $('#documentClientCredit').removeAttr('required');
            $('#telephoneCredit').removeAttr('required');
            $('#dataNasce').removeAttr('required');
            $('#rua').removeAttr('required');
            $('#numero').removeAttr('required');
            $('#bairro').removeAttr('required');
            $('#cidade').removeAttr('required');
            $('#estado').removeAttr('required');
            $('#cep').removeAttr('required');

            if ($(document).width() > 767) {
                $('#numCartao').removeAttr('required');
                $('#codSeguranca').removeAttr('required');
                $('#mesVencimento').removeAttr('required');
                $('#anoVencimento').removeAttr('required');
                $('#numParcelas').removeAttr('required');
            } else {
                $('#numCartaoMobile').removeAttr('required');
                $('#codSegurancaMobile').removeAttr('required');
                $('#mesVencimentoMobile').removeAttr('required');
                $('#anoVencimentoMobile').removeAttr('required');
                $('#numParcelasMobile').removeAttr('required');
            }


            $('#documentClientPix').removeAttr('required');
            $('#clientNamePix').removeAttr('required');

        }
        
        document.getElementById('container_credit').onclick = () => {
            if ($(".invalid-feedback").length > 0) {
                $(".formularios :submit").prop('disabled', true);
                $('.formularios :submit').css('opacity', '0.3');
            }
            veriFyMinValue();
            document.getElementById('credit').checked = true;
            document.getElementById('container_credit').classList.add('selectedOption');
            (document.getElementById('container_pix') != undefined) ? document.getElementById('container_pix').classList.remove('selectedOption') : "";
            (document.getElementById('container_billet') != undefined) ? document.getElementById('container_billet').classList.remove('selectedOption') : "";
            $('.button').html('Pagar');
            $('.pixSelected').hide(0);
            $('.billetSelected').hide(0);
            $('.creditSelected').show();

            $('#nameBillet').removeAttr('required');
            $('#documentClientBillet').removeAttr('required');
            $('#clientEmailBillet').removeAttr('required');

            $('#nameCredit').attr('required', true);
            $('#clientEmailCredit').attr('required', true);
            $('#documentClientCredit').attr('required', true);
            $('#telephoneCredit').attr('required', true);
            $('#dataNasce').attr('required', true);
            $('#rua').attr('required', true);
            $('#numero').attr('required', true);
            $('#bairro').attr('required', true);
            $('#cidade').attr('required', true);
            $('#estado').attr('required', true);
            $('#cep').attr('required', true);

            if ($(document).width() > 767) {
                $('#numCartao').attr('required', true);
                $('#codSeguranca').attr('required', true);
                $('#mesVencimento').attr('required', true);
                $('#anoVencimento').attr('required', true);
                $('#numParcelas').attr('required', true);
            } else {
                $('#numCartaoMobile').attr('required', true);
                $('#codSegurancaMobile').attr('required', true);
                $('#mesVencimentoMobile').attr('required', true);
                $('#anoVencimentoMobile').attr('required', true);
                $('#numParcelasMobile').attr('required', true);
            }


            $('#documentClientPix').removeAttr('required');
            $('#clientNamePix').removeAttr('required');

        }
        

        document.getElementById('container_pix').onclick = () => {
            $(".formularios :submit").removeAttr('disabled');
            $('.formularios :submit').css('opacity', '1');
            document.getElementById('pix').checked = true;
            document.getElementById('container_pix').classList.add('selectedOption');
            (document.getElementById('container_credit') != undefined) ? document.getElementById('container_credit').classList.remove('selectedOption') : "";
            (document.getElementById('container_billet') != undefined) ? document.getElementById('container_billet').classList.remove('selectedOption') : "";
            $('.button').html('Gerar QRCode');
            $('.billetSelected').hide(0);
            $('.creditSelected').hide(0);
            $('.pixSelected').show();


            $('#nameBillet').removeAttr('required');
            $('#documentClientBillet').removeAttr('required');
            $('#clientEmailBillet').removeAttr('required');


            $('#nameCredit').removeAttr('required');
            $('#clientEmailCredit').removeAttr('required');
            $('#documentClientCredit').removeAttr('required');
            $('#telephoneCredit').removeAttr('required');
            $('#dataNasce').removeAttr('required');
            $('#rua').removeAttr('required');
            $('#numero').removeAttr('required');
            $('#bairro').removeAttr('required');
            $('#cidade').removeAttr('required');
            $('#estado').removeAttr('required');
            $('#cep').removeAttr('required');

            if ($(document).width() > 767) {
                $('#numCartao').removeAttr('required');
                $('#codSeguranca').removeAttr('required');
                $('#mesVencimento').removeAttr('required');
                $('#anoVencimento').removeAttr('required');
                $('#numParcelas').removeAttr('required');
            } else {
                $('#numCartaoMobile').removeAttr('required');
                $('#codSegurancaMobile').removeAttr('required');
                $('#mesVencimentoMobile').removeAttr('required');
                $('#anoVencimentoMobile').removeAttr('required');
                $('#numParcelasMobile').removeAttr('required');
            }

            $('#documentClientPix').attr('required', true);
            $('#clientNamePix').attr('required', true);


        }
        */

        document.querySelectorAll('.button')[0].onclick = (e) => {



            if ((verifyActivation('billet')) ? document.getElementById('billet').checked : false) {
                validationForm('billet', e)
            } else if ((verifyActivation('pix')) ? document.getElementById('pix').checked : false) {
                validationForm('pix', e)
            } else if ((verifyActivation('openfinance')) ? document.getElementById('openfinance').checked : false) {
                validationForm('openfinance', e)
            } else {
                validationForm('credit', e)
            }

        }
        $("#documentClientBillet").on('paste', (e) => {
            try {
                $("#documentClientBillet").unmask();
            } catch (e) {}

            var tamanho = e.originalEvent.clipboardData.getData('text').replaceAll('.', '').replaceAll('-', '').length;
            if (tamanho <= 11) {
                $("#documentClientBillet").mask("999.999.999-99");
            } else {
                $("#documentClientBillet").mask("99.999.999/9999-99");
            }

            // ajustando foco
            var elem = this;
            setTimeout(function() {
                // mudo a posição do seletor
                elem.selectionStart = elem.selectionEnd = 10000;
            }, 0);
            // reaplico o valor para mudar o foco
            var currentValue = $(this).val();
            $(this).val('');
            $(this).val(currentValue);
        });
        $("#documentClientCredit").on('paste', (e) => {
            try {
                $("#documentClientCredit").unmask();

            } catch (e) {}

            var tamanho = e.originalEvent.clipboardData.getData('text').replaceAll('.', '').replaceAll('-', '').length;

            if (tamanho <= 11) {
                $("#documentClientCredit").mask("999.999.999-99");
            } else {
                $("#documentClientCredit").mask("99.999.999/9999-99");
            }

            // ajustando foco
            var elem = this;
            setTimeout(function() {
                // mudo a posição do seletor
                elem.selectionStart = elem.selectionEnd = 10000;
            }, 0);
            // reaplico o valor para mudar o foco
            var currentValue = $(this).val();
            $(this).val('');
            $(this).val(currentValue);
        });
        $("#documentClientPix").on('paste', (e) => {
            try {
                $("#documentClientPix").unmask();
            } catch (e) {}

            var tamanho = e.originalEvent.clipboardData.getData('text').replaceAll('.', '').replaceAll('-', '').length;

            if (tamanho <= 11) {
                $("#documentClientPix").mask("999.999.999-99");
            } else {
                $("#documentClientPix").mask("99.999.999/9999-99");
            }

            // ajustando foco
            var elem = this;
            setTimeout(function() {
                // mudo a posição do seletor
                elem.selectionStart = elem.selectionEnd = 10000;
            }, 0);
            // reaplico o valor para mudar o foco
            var currentValue = $(this).val();
            $(this).val('');
            $(this).val(currentValue);
        });


        $("#documentClientOF").on('paste', (e) => {
            try {
                $("#documentClientOF").unmask();
            } catch (e) {}

            $("#documentClientOF").mask("999.999.999-99");

            // ajustando foco
            var elem = this;
            setTimeout(function() {
                // mudo a posição do seletor
                elem.selectionStart = elem.selectionEnd = 10000;
            }, 0);
            // reaplico o valor para mudar o foco
            var currentValue = $(this).val();
            $(this).val('');
            $(this).val(currentValue);
        });

        $("#documentPJClientOF").on('paste', (e) => {
            try {
                $("#documentPJClientOF").unmask();
            } catch (e) {}

            $("#documentPJClientOF").mask("99.999.999/9999-99");
           
            // ajustando foco
            var elem = this;
            setTimeout(function() {
                // mudo a posição do seletor
                elem.selectionStart = elem.selectionEnd = 10000;
            }, 0);
            // reaplico o valor para mudar o foco
            var currentValue = $(this).val();
            $(this).val('');
            $(this).val(currentValue);
        });

        $('.creditSelected').hide(0);
        $('.pixSelected').hide(0);
        intervalTotal();
        format();
        shadowButton();
        formatYear();
        autoComplete();
        veriFyMinValue();
        setPaymentToken(checkout)
    }

    function setPaymentToken(checkout) {
        let numCartaoLarge = $('#numCartao');
        let numCartaoMobile = $('#numCartaoMobile');
        $('#numCartao').blur(() => {
            var numCartao = $('#numCartao').val().replaceAll(' ', '');
            var numInputCartao = $('#numCartao');
            var invoiceValue = Math.floor($('.invoice_value').val() * 100);
            if (brandOption(numInputCartao) != '' && brandOption(numInputCartao) != undefined && brandOption(numInputCartao) != null && numCartao.length >= 13) {
                checkout.getInstallments(invoiceValue, brandOption(numInputCartao), function(error, response) {
                    if (error) {
                        console.log(error)
                    } else {
                        let installmentsOptions;

                        for (let i = 0; i < response.data.installments.length; i++) {
                            let juros = (((response.data.installments[i].value / 100) - 0.01) * (i + 1)) > $('.invoice_value').val() ? 'com juros' : 'sem juros';
                            installmentsOptions += `<option valor=${response.data.installments[i].value} value="${i + 1}">${i + 1}x de R$${response.data.installments[i].currency} ${juros} </option> `;
                        }

                        if ($("#numParcelas option:selected").val() == 1 || $("#numParcelas option:selected").val() == '' || $("#numParcelas option:selected").val() == 'Insira os dados do seu cartão...') {

                            $('#numParcelas').html(installmentsOptions);

                        }
                        verifyPaymentToken(checkout, numInputCartao, 1);
                    }
                })

            } else {

                $('#numParcelas').html('<option>Insira os dados do seu cartão...</option>');
            }
        });

        $('#codSeguranca').keyup(() => {
            if ($('#codSeguranca').val().length == 3) {

                verifyPaymentToken(checkout, numCartaoLarge, 1);
            }

        });
        $('#mesVencimento').change(() => {
            verifyPaymentToken(checkout, numCartaoLarge, 1);
        });
        $('#anoVencimento').change(() => {
            verifyPaymentToken(checkout, numCartaoLarge, 1);
        });
        $('#numCartaoMobile').blur(() => {
            var numCartao = $('#numCartaoMobile').val().replaceAll(' ', '');
            var numInputCartao = $('#numCartaoMobile');
            var invoiceValue = $('.invoice_value').val() * 100;
            if (brandOption(numInputCartao) != '' && brandOption(numInputCartao) != undefined && brandOption(numInputCartao) != null && numCartao.length >= 13) {
                checkout.getInstallments(invoiceValue, brandOption(numInputCartao), function(error, response) {
                    if (error) {
                        console.log(error)
                    } else {
                        let installmentsOptions;
                        for (let i = 0; i < response.data.installments.length; i++) {
                            installmentsOptions += `<option value="${i + 1}">${i + 1}x de R$${response.data.installments[i].currency}</option> `;
                        }
                        if ($("#numParcelasMobile option:selected").val() == 1 || $("#numParcelasMobile option:selected").val() == '' || $("#numParcelas option:selected").val() == 'Insira os dados do seu cartão...') {
                            $('#numParcelasMobile').html(installmentsOptions);

                        }
                        verifyPaymentToken(checkout, numInputCartao);
                    }
                })

            } else {
                $('#numParcelasMobile').html('<option>Insira os dados do seu cartão...</option>');
            }
        });
        $('#codSegurancaMobile').keyup(() => {
            if ($('#codSegurancaMobile').val().length == 3) {
                verifyPaymentToken(checkout, numCartaoMobile);
            }

        });
        $('#mesVencimentoMobile').change(() => {
            verifyPaymentToken(checkout, numCartaoMobile);
        });
        $('#anoVencimentoMobile').change(() => {
            verifyPaymentToken(checkout, numCartaoMobile);
        });
    }
}