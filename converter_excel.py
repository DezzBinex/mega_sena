import json
import pandas as pd

arquivo_excel = 'Mega-Sena.xlsx'
arquivo_json = 'historico.json'

# Lê a planilha do Excel
planilha = pd.read_excel(arquivo_excel)

# Mostra os nomes das colunas para conferência
print('Colunas encontradas:')
print(list(planilha.columns))

# Nomes exatos das colunas da sua planilha
coluna_concurso = 'Concurso'
colunas_bolas = [
    'Bola1',
    'Bola2',
    'Bola3',
    'Bola4',
    'Bola5',
    'Bola6'
]

historico = []

for _, linha in planilha.iterrows():
    try:
        concurso = int(linha[coluna_concurso])

        dezenas = [
            str(int(linha[coluna])).zfill(2)
            for coluna in colunas_bolas
        ]

        historico.append({
            'concurso': concurso,
            'dezenas': dezenas
        })

    except (ValueError, TypeError):
        # Ignora linhas incompletas ou inválidas
        continue

# Salva os resultados em JSON
with open(arquivo_json, 'w', encoding='utf-8') as arquivo:
    json.dump(historico, arquivo, ensure_ascii=False, indent=4)

print(f'{len(historico)} concursos foram salvos em {arquivo_json}.')
