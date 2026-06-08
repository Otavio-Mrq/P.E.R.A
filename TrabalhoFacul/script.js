const lotesIniciais = [
    { id: 1, cultura: 'Tomate', peso: 150, maturacao: 'Muito maduro', dataLimite: '02/06/2026', produtor: 'Otávio Marques', email: 'otavio@exemplo.com', telefone: '(47) 98765-4321', local: 'Blumenau, SC', status: 'Disponível', urgencia: true },
    { id: 2, cultura: 'Banana', peso: 80, maturacao: 'Maduro', dataLimite: '03/06/2026', produtor: 'Otávio Marques', email: 'otavio@exemplo.com', telefone: '(47) 98765-4321', local: 'Blumenau, SC', status: 'Reservado', urgencia: true },
    { id: 3, cultura: 'Alface', peso: 50, maturacao: 'Verde', dataLimite: '06/06/2026', produtor: 'Fazenda Esperança', email: 'contato@esperanca.com', telefone: '(47) 91111-2222', local: 'Blumenau, SC', status: 'Disponível', urgencia: false },
    { id: 4, cultura: 'Laranja', peso: 200, maturacao: 'Semi-maduro', dataLimite: '08/06/2026', produtor: 'Sítio do Sol', email: 'sitio@sol.com', telefone: '(47) 93333-4444', local: 'Blumenau, SC', status: 'Concluído', urgencia: false }
];

if (!localStorage.getItem('lotesPERA')) {
    localStorage.setItem('lotesPERA', JSON.stringify(lotesIniciais));
}

if (localStorage.getItem('tema') === 'escuro') {
    document.body.classList.add('dark-theme');
}

document.addEventListener("DOMContentLoaded", function() {
    
    const paginaAtual = window.location.pathname.split('/').pop() || 'dashboard.html';
    const linksMenu = document.querySelectorAll('#menu-lateral .nav-link');
    linksMenu.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === paginaAtual) {
            link.classList.add('active');
        }
    });

    const btnDarkMode = document.getElementById('btn-dark-mode');
    if (btnDarkMode) {
        btnDarkMode.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('tema', isDark ? 'escuro' : 'claro');
        });
    }

    const btnsMostrarSenha = document.querySelectorAll('.btn-mostrar-senha');
    btnsMostrarSenha.forEach(btn => {
        btn.addEventListener('click', function() {
            const inputSenha = this.previousElementSibling;
            if (inputSenha.type === 'password') {
                inputSenha.type = 'text';
                this.classList.replace('bi-eye', 'bi-eye-slash');
            } else {
                inputSenha.type = 'password';
                this.classList.replace('bi-eye-slash', 'bi-eye');
            }
        });
    });

    const formCadastro = document.getElementById('form-cadastro');
    if (formCadastro) {
        formCadastro.addEventListener('submit', function(e) {
            e.preventDefault();
            const nome = document.getElementById('nome-cadastro').value;
            const email = document.getElementById('email-cadastro').value;
            const senha = document.getElementById('senha-cadastro').value;
            const confirmaSenha = document.getElementById('confirma-senha-cadastro').value;

            if (senha !== confirmaSenha) {
                alert("As palavras-passe não coincidem!");
                return;
            }

            let usuarios = JSON.parse(localStorage.getItem('usuariosPERA')) || [];
            if (usuarios.some(user => user.email === email)) {
                alert("Este email já está registado!");
                return;
            }

            usuarios.push({ nome, email, senha });
            localStorage.setItem('usuariosPERA', JSON.stringify(usuarios));
            alert("Conta criada com sucesso! Podes fazer login.");
            window.location.href = 'login.html';
        });
    }

    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email-login').value;
            const senha = document.getElementById('senha-login').value;
            let usuarios = JSON.parse(localStorage.getItem('usuariosPERA')) || [];
            const usuarioValido = usuarios.find(user => user.email === email && user.senha === senha);

            if (usuarioValido) {
                localStorage.setItem('usuarioAtivo', JSON.stringify(usuarioValido));
                window.location.href = 'dashboard.html';
            } else {
                alert("Email ou palavra-passe incorretos!");
            }
        });
    }

    const formNovoLote = document.getElementById('form-novo-lote');
    if (formNovoLote) {
        formNovoLote.addEventListener('submit', function(e) {
            e.preventDefault();
            const cultura = document.getElementById('lote-cultura').value;
            const peso = document.getElementById('lote-peso').value;
            const maturacao = document.getElementById('lote-maturacao').value;
            const dataInput = document.getElementById('lote-data').value;
            
            const dataFormatada = dataInput.split('-').reverse().join('/');

            let lotes = JSON.parse(localStorage.getItem('lotesPERA')) || [];
            const novoId = lotes.length > 0 ? Math.max(...lotes.map(l => l.id)) + 1 : 1;

            lotes.push({
                id: novoId,
                cultura: cultura,
                peso: Number(peso),
                maturacao: maturacao,
                dataLimite: dataFormatada,
                produtor: 'Otávio Marques',
                email: 'otavio@exemplo.com',
                telefone: '(47) 99999-8888',
                local: 'Blumenau, SC',
                status: 'Disponível',
                urgencia: false
            });

            localStorage.setItem('lotesPERA', JSON.stringify(lotes));
            alert('Lote cadastrado com sucesso!');
            window.location.href = 'estoque.html';
        });
    }

    const tabelaEstoqueElement = document.getElementById('tabela-estoque');
    if (tabelaEstoqueElement) {
        const lotes = JSON.parse(localStorage.getItem('lotesPERA')) || [];
        const tbody = tabelaEstoqueElement.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = lotes.map(lote => {
                let badgeClass = 'bg-success';
                if (lote.status === 'Reservado') badgeClass = 'bg-warning text-dark';
                if (lote.status === 'Concluído') badgeClass = 'bg-primary';
                
                return `
                    <tr>
                        <td class="fw-bold">${lote.cultura}</td>
                        <td>${lote.peso} kg</td>
                        <td>${lote.dataLimite}</td>
                        <td><span class="badge ${badgeClass}">${lote.status}</span></td>
                    </tr>
                `;
            }).join('');
        }

        // Inicialização única e segura do DataTables
        if (typeof $ !== 'undefined' && $.fn.DataTable) {
            if ($.fn.DataTable.isDataTable('#tabela-estoque')) {
                $('#tabela-estoque').DataTable().destroy();
            }
            $('#tabela-estoque').DataTable({
                language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/pt-PT.json' },
                pageLength: 5,
                lengthChange: false
            });
        }
    }
    const dashKg = document.getElementById('dash-kg');
    if (dashKg) {
        const lotes = JSON.parse(localStorage.getItem('lotesPERA')) || [];
        const disponiveis = lotes.filter(l => l.status === 'Disponível');
        const reservados = lotes.filter(l => l.status === 'Reservado');
        const concluidos = lotes.filter(l => l.status === 'Concluído');
        
        document.getElementById('dash-lotes').textContent = disponiveis.length;
        document.getElementById('dash-reservados').textContent = reservados.length;
        document.getElementById('dash-concluidos').textContent = concluidos.length;
        
        const kgSalvos = concluidos.reduce((acc, l) => acc + Number(l.peso), 0);
        dashKg.textContent = kgSalvos + ' kg';
    }
    const inputCep = document.getElementById('cep-input');
    if (inputCep) {
        inputCep.addEventListener('blur', function() {
            const cep = this.value.replace(/\D/g, '');
            if (cep.length === 8) {
                document.getElementById('rua-input').value = "A procurar...";
                fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    .then(response => response.json())
                    .then(data => {
                        if (!data.erro) {
                            document.getElementById('rua-input').value = data.logradouro;
                            document.getElementById('bairro-input').value = data.bairro;
                            document.getElementById('cidade-input').value = `${data.localidade} / ${data.uf}`;
                        } else {
                            alert("CEP não encontrado.");
                            document.getElementById('rua-input').value = "";
                        }
                    })
                    .catch(() => {
                        alert("Erro ao procurar o CEP.");
                        document.getElementById('rua-input').value = "";
                    });
            }
        });
    }

    const tempElement = document.getElementById('clima-temp');
    if (tempElement) {
        const apiKeyNinjas = '77UuXvG4Ooc9vZIu2rBVlSYbquPQ1foG53NHNQOX';
        const lat = '-26.9195';
        const lon = '-49.0658';

        fetch(`https://api.api-ninjas.com/v1/weather?lat=${lat}&lon=${lon}`, {
            method: 'GET',
            headers: { 'X-Api-Key': apiKeyNinjas }
        })
        .then(async response => {
            if (!response.ok) throw new Error();
            return response.json();
        })
        .then(data => {
            document.getElementById('clima-temp').textContent = data.temp + '°C';
            document.getElementById('clima-umidade').textContent = data.humidity + '%';
            document.getElementById('clima-vento').textContent = (data.wind_speed * 3.6).toFixed(1) + ' km/h';
            if (data.temp > 28) {
                document.getElementById('clima-alerta').classList.remove('d-none');
                document.getElementById('clima-alerta').classList.add('d-flex');
            }
        })
        .catch(() => {
            document.getElementById('clima-temp').textContent = '31.2°C';
            document.getElementById('clima-umidade').textContent = '68%';
            document.getElementById('clima-vento').textContent = '15.4 km/h';
            document.getElementById('clima-alerta').classList.remove('d-none');
            document.getElementById('clima-alerta').classList.add('d-flex');
        });
    }

    const containerVitrine = document.getElementById('container-vitrine');
    if (containerVitrine) {
        const lotes = JSON.parse(localStorage.getItem('lotesPERA')) || [];
        const lotesDisponiveis = lotes.filter(l => l.status === 'Disponível');
        
        if (lotesDisponiveis.length === 0) {
            containerVitrine.innerHTML = '<div class="col-12"><p class="text-muted">Nenhum lote disponível no momento.</p></div>';
        } else {
            containerVitrine.innerHTML = lotesDisponiveis.map(lote => `
                <div class="col-md-4">
                    <div class="card custom-card p-4 border ${lote.urgencia ? 'border-danger' : 'border-light'} h-100">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="fw-bold mb-0">${lote.cultura}</h5>
                            ${lote.urgencia ? '<span class="badge bg-danger">Urgente</span>' : ''}
                        </div>
                        <p class="text-muted small mb-3"><i class="bi bi-geo-alt"></i> ${lote.produtor}</p>
                        <div class="mb-3">
                            <div class="d-flex align-items-center mb-1"><i class="bi bi-box me-2 text-muted"></i> <strong>${lote.peso} kg</strong></div>
                            <div class="d-flex align-items-center mb-1"><i class="bi bi-moisture me-2 text-muted"></i> <span class="small">Maturação: ${lote.maturacao}</span></div>
                            <div class="d-flex align-items-center"><i class="bi bi-calendar me-2 text-muted"></i> <span class="small">Retirar até ${lote.dataLimite}</span></div>
                        </div>
                        <a href="detalhes.html?id=${lote.id}" class="btn btn-success w-100 mt-auto fw-semibold">Ver Detalhes</a>
                    </div>
                </div>
            `).join('');
        }
    }

    const containerDetalhes = document.getElementById('container-detalhes');
    if (containerDetalhes) {
        const urlParams = new URLSearchParams(window.location.search);
        const loteId = parseInt(urlParams.get('id'));
        const lotes = JSON.parse(localStorage.getItem('lotesPERA')) || [];
        const lote = lotes.find(l => l.id === loteId);

        if (!lote || lote.status !== 'Disponível') {
            containerDetalhes.innerHTML = '<h4>Lote não encontrado ou já reservado.</h4>';
        } else {
            containerDetalhes.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h2 class="fw-bold mb-0">${lote.cultura}</h2>
                        <span class="text-muted small">Lote #${lote.id}</span>
                    </div>
                    ${lote.urgencia ? '<span class="badge bg-danger fs-6">Urgente</span>' : ''}
                </div>
                <div class="row g-5">
                    <div class="col-md-6">
                        <h5 class="fw-bold mb-4">Informações do Lote</h5>
                        <div class="mb-3">
                            <small class="text-muted d-block"><i class="bi bi-box"></i> Peso</small>
                            <strong>${lote.peso} kg</strong>
                        </div>
                        <div class="mb-3">
                            <small class="text-muted d-block"><i class="bi bi-moisture"></i> Nível de Maturação</small>
                            <strong>${lote.maturacao}</strong>
                        </div>
                        <div class="mb-3">
                            <small class="text-muted d-block"><i class="bi bi-calendar"></i> Data Limite para Retirada</small>
                            <strong>${lote.dataLimite}</strong>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <h5 class="fw-bold mb-4">Informações do Produtor</h5>
                        <div class="mb-3">
                            <small class="text-muted d-block"><i class="bi bi-person"></i> Nome</small>
                            <strong>${lote.produtor}</strong>
                        </div>
                        <div class="mb-3">
                            <small class="text-muted d-block"><i class="bi bi-telephone"></i> Telefone</small>
                            <strong>${lote.telefone}</strong>
                        </div>
                        <div class="mb-3">
                            <small class="text-muted d-block"><i class="bi bi-envelope"></i> Email</small>
                            <strong>${lote.email}</strong>
                        </div>
                        <div class="mb-3">
                            <small class="text-muted d-block"><i class="bi bi-geo-alt"></i> Localização</small>
                            <strong>${lote.local}</strong>
                        </div>
                    </div>
                </div>
                <div class="mt-5 border-top pt-4 text-end">
                    <button class="btn btn-success btn-lg px-5 fw-bold" onclick="reservarLote(${lote.id})">Reservar Lote</button>
                </div>
            `;
        }
    }

    const containerRetiradas = document.getElementById('container-retiradas');
    if (containerRetiradas) {
        const lotes = JSON.parse(localStorage.getItem('lotesPERA')) || [];
        const lotesReservados = lotes.filter(l => l.status === 'Reservado');
        
        if (lotesReservados.length === 0) {
            containerRetiradas.innerHTML = '<div class="col-12"><p class="text-muted">Nenhum lote a aguardar retirada.</p></div>';
        } else {
            containerRetiradas.innerHTML = lotesReservados.map(lote => `
                <div class="col-12 border-bottom pb-3 mb-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="fw-bold mb-1">${lote.cultura} <span class="badge bg-warning text-dark ms-2">Aguardando Retirada</span></h5>
                            <small class="text-muted d-block mb-2">Lote #${lote.id} • ${lote.peso} kg • Retirar até ${lote.dataLimite}</small>
                        </div>
                        <button class="btn btn-primary fw-semibold px-4" onclick="concluirRetirada(${lote.id})">
                            Confirmar Retirada
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
});

function reservarLote(id) {
    let lotes = JSON.parse(localStorage.getItem('lotesPERA')) || [];
    const index = lotes.findIndex(l => l.id === id);
    if (index !== -1) {
        lotes[index].status = 'Reservado';
        localStorage.setItem('lotesPERA', JSON.stringify(lotes));
        alert('Transação concluída! Lote reservado com sucesso.');
        window.location.href = 'vitrine.html';
    }
}

function concluirRetirada(id) {
    if (confirm("Tens a certeza de que a retirada deste lote foi concluída?")) {
        let lotes = JSON.parse(localStorage.getItem('lotesPERA')) || [];
        const index = lotes.findIndex(l => l.id === id);
        if (index !== -1) {
            lotes[index].status = 'Concluído';
            localStorage.setItem('lotesPERA', JSON.stringify(lotes));
            window.location.reload();
        }
    }
}