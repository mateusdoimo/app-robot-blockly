function statusConectar() {
    $('.btn-conectar-wifi').css('display', 'none')
    $('.btn-enviar-code').css('display', 'flex')
    $('#blocklyFooter').removeClass('status-desconectado')
    $('.status-conect').addClass('status-off')
    $('#status-conectado').removeClass('status-off')

    $("#puzzleContainer").css('display', 'none')
    tl.pause();
}

function statusDesconectar() {
    $('.btns-status-pronto').css('display', 'none')
    $('.btn-enviar-code').css('display', 'none')
    $('.btn-conectar-wifi').css('display', 'flex')
    $('#blocklyFooter').addClass('status-desconectado')
    $('.status-conect').addClass('status-off')
    $('#status-desconectado').removeClass('status-off')

    $("#puzzleContainer").css('display', 'none')
    tl.pause();
}

function atualizaStatusCar(status) {
    console.log(status)
    if (status === 0) {
        $('.btns-status-pronto').css('display', 'flex')
        $('.btn-executa-codigo').attr('disabled', false)
        $('.btn-reset-code').attr('disabled', false)
        //$('.btn-enviar-code').css('display', 'flex')
    }
    else if (status === 1) {
        $('.btn-executa-codigo').attr('disabled', true)
        $('.btn-reset-code').attr('disabled', true)
    }
    else if (status === 2) {
        $('.btn-executa-codigo').attr('disabled', false)
        $('.btn-reset-code').attr('disabled', false)
        $('.btns-status-pronto').css('display', 'flex')
    }
    else if (status === 3) {
        $('.btn-executa-codigo').attr('disabled', true)
        $('.btn-reset-code').attr('disabled', true)
        $('.btns-status-pronto').css('display', 'flex')
        //$("#puzzleContainer").css('display', 'flex')
    }
}