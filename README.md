
# Brain Agriculture - Front-End Panel (Teste Técnico)

Este é o repositório do painel administrativo (Front-End) desenvolvido para o teste técnico da **Brain Agriculture** criado por **Tiago honorio**. A aplicação consiste que permite gerenciar produtores rurais, suas propriedades e as respectivas culturas plantadas por safra, além de fornecer um painel analítico com indicadores e gráficos consolidados.

## 🚀 Objetivo do Projeto

O objetivo principal é atender aos requisitos de negócio e critérios de avaliação do desafio técnico para a vaga de desenvolvedor fullstack, garantindo:
- **Interface Administrativa:** Um layout limpo, responsivo e fluido um template Admin.
- **Painel Analítico (Dashboard):** Indicadores numéricos instantâneos e três gráficos no formato de pizza alimentados de forma dinâmica (sem repetição de cores) através de APIs de agregação do back-end.
- **Gerenciamento de Cadastros (CRUD):** Lógica avançada de transferência de dados (*Upsert*) em modais reutilizáveis, permitindo adicionar, remover ou atualizar culturas agrícolas e transferir a propriedade de fazendas entre produtores de forma reativa.

---

## 🛠️ Tecnologias Utilizadas

A arquitetura do front-end foi desenhada utilizando tecnologias de alta performance no mercado:

- **React.js (Vite):** Framework base utilizado pela velocidade de compilação em ambiente de desenvolvimento e otimização de build final.
- **Bootstrap 5 & Bootstrap Icons:** Framework CSS estrutural para garantir um design profissional, responsivo, limpo e padronizado.
- **Chart.js & react-chartjs-2:** Biblioteca robusta para renderização de gráficos performáticos no formato de pizza (Pie Charts).
- **Axios:** Cliente HTTP para comunicação assíncrona com o back-end via Promises.
- **React Router Dom (v6):** Gerenciamento de rotas e navegação SPA (Single Page Application) sem recarregamento de página.
- **Docker & Docker Compose:** Containerização completa da aplicação para garantir execução idêntica em qualquer ambiente (Node v20 LTS).

---

## 📂 Organização Arquitetural de Diretorias

O projeto foi estruturado seguindo os padrões de governança e escalabilidade do React, separando responsabilidades:

```text
src/
├── assets/          # Estilos globais e fontes de ícones do Bootstrap
├── components/      # Componentes globais e reutilizáveis (Ex: Header, Sidebar, WidgetCard)
├── pages/           # Telas funcionais do sistema isoladas por diretórios nomeados
│   ├── dashboard/   # Tela analítica e seus subcomponentes de gráficos isolados
│   ├── farms/       # Listagem e subcomponente de modal para gerenciamento de fazendas
│   └── producers/   # Listagem, modal cadastral e modal dinâmico de listagem de propriedades
├── services/        # Isolamento de requisições HTTP (API Base, FarmService, RuralProducerService)
├── App.jsx          # Roteador central e casca do esqueleto estrutural (Layout Grid)
└── main.jsx         # Ponto de entrada da aplicação e injeção do Bootstrap global
```

---

## ⚙️ Passo a Passo para Iniciar a Aplicação

Siga as instruções abaixo para clonar o repositório e subir o ambiente local isolado no Docker de forma totalmente automatizada.

### 1. Clonar o Repositório
Abra o seu terminal na pasta de preferência e execute o comando:
```bash
git clone https://github.com/20100000/front-end_brain.git
```

### 2. Acessar o Diretério do Front-End
Entre na pasta do projeto front-end:
```bash
cd brain-front
```

### 3. Iniciar a Aplicação via Docker
Certifique-se de que o Docker e o Docker Compose estão instalados e rodando na sua máquina física. Para construir a imagem com o **Node.js 20** e instalar todas as dependências automaticamente dentro do container sem sujar a sua máquina local, execute:
```bash
docker compose up --build
```
*Dica: Se preferir liberar o terminal para continuar digitando comandos, adicione o parâmetro `-d` no final: `docker compose up --build -d`*

### 4. Acessar no Navegador
Assim que o terminal indicar que o Vite iniciou o servidor, abra o seu navegador e acesse:
👉 **http://localhost:5173**

---

## 🔌 Requisito Prévio de Integração

Para que os cards de métricas e os gráficos de pizza carreguem os dados corretamente na tela, certifique-se de que o **Back-End (API NestJS com PostgreSQL)** desenvolvido para este teste esteja rodando na mesma máquina na porta padrão **3000** (`http://localhost:3000`).
para clanar o back-end Link: 🔗 **https://github.com/20100000/back-end_brain**

---


