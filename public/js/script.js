function limitTextSize(selector, maxLength) {
    var element = document.getElementById(selector),
    textoCortado = element.innerText;

    if (textoCortado.length > maxLength) {
        textoCortado = textoCortado.substr(0,maxLength) + ' (continua...)';
    }

    return textoCortado;
}

document.getElementById('tamanho-maximo').innerText = limitTextSize('tamanho-maximo', 1100);