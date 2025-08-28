# Remapper

Eu tive um problema com meu teclado emitindo tecla fantasma, especificamente a tecla \* no numpad. Após pesquisar algumas soluções, encontrei algumas formas que funcionavam de maneira parcial ou exigiam configurações que não eram do meu agrado.

Então pensei: por que não fazer um mapeador de teclas no nível do kernel para Linux? Fui inspirado por uma funcionalidade do Windows que permite essa alteração pelo regedit. Após algumas pesquisas e leituras, consegui fazer o módulo em C e resolver meu problema, mapeando a tecla fantasma para o nada.
