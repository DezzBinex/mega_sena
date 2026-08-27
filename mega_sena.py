from random import sample
from time import sleep

lista = list()
jogos = list()

print('-' * 40)
print('      JOGA NA MEGA SENA      ')
print('-' * 40)

quantidade = int(input('Quantos jogos você quer que eu sorteie? '))

if quantidade < 1 or quantidade > 10:
    print('Quantidade inválida! O número de jogos deve ser entre 1 e 10.')
else:
    numeros = sample(range(1, 61), quantidade * 6)
    jogos = []
    
    for inicio in range(0, quantidade * 6, 6):
        jogo = sorted(numeros[inicio:inicio + 6])
        jogos.append(jogo)
        
    print('-' * 3, f' SORTEANDO {quantidade} JOGOS ', '-' * 3)
    
    for i, jogo in enumerate(jogos):
        print(f'Jogo {i + 1}: {jogo}')
        sleep(1)
        
    print('-' * 5, ' < BOA SORTE! > ', '-' * 5)