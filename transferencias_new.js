// Transferencias JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeTransfers();
});

// Mock data para transferencias
const transfersData = {
    recientes: [
        {
            playerName: "Diego Martínez",
            position: "Extremo Derecho",
            fromTeam: "Chorrera FC",
            toTeam: "Independiente",
            fromLogo: "/img/teams/chorrera.jpg",
            toLogo: "/img/teams/independiente.jpg",
            value: "$320,000",
            date: "15 Enero 2025",
            type: "fichaje"
        },
        {
            playerName: "Carlos Mendoza",
            position: "Delantero",
            fromTeam: "ACP 507",
            toTeam: "BKS FC",
            fromLogo: "/img/APC 507.png",
            toLogo: "/img/BKS FC.jpg",
            value: "$250,000",
            date: "12 Enero 2025",
            type: "fichaje"
        },
        {
            playerName: "Luis González",
            position: "Defensa Central",
            fromTeam: "Plaza Amador",
            toTeam: "Tauro FC",
            fromLogo: "/img/teams/plaza.jpg",
            toLogo: "/img/teams/tauro.jpg",
            value: "Cesión 6 meses",
            date: "10 Enero 2025",
            type: "cesion"
        }
    ],
    todas: [
        {
            playerName: "Diego Martínez",
            position: "Extremo Derecho",
            fromTeam: "Chorrera FC",
            toTeam: "Independiente",
            fromLogo: "/img/teams/chorrera.jpg",
            toLogo: "/img/teams/independiente.jpg",
            value: "$320,000",
            date: "15 Enero 2025",
            type: "fichaje"
        },
        {
            playerName: "Carlos Mendoza",
            position: "Delantero",
            fromTeam: "ACP 507",
            toTeam: "BKS FC",
            fromLogo: "/img/APC 507.png",
            toLogo: "/img/BKS FC.jpg",
            value: "$250,000",
            date: "12 Enero 2025",
            type: "fichaje"
        },
        {
            playerName: "Luis González",
            position: "Defensa Central",
            fromTeam: "Plaza Amador",
            toTeam: "Tauro FC",
            fromLogo: "/img/teams/plaza.jpg",
            toLogo: "/img/teams/tauro.jpg",
            value: "Cesión 6 meses",
            date: "10 Enero 2025",
            type: "cesion"
        },
        {
            playerName: "Roberto Silva",
            position: "Mediocampista",
            fromTeam: "Árabe Unido",
            toTeam: "San Francisco",
            fromLogo: "/img/teams/arabe.jpg",
            toLogo: "/img/teams/sanfrancisco.jpg",
            value: "$180,000",
            date: "8 Enero 2025",
            type: "fichaje"
        },
        {
            playerName: "Miguel Torres",
            position: "Portero",
            fromTeam: "Sporting SM",
            toTeam: "Alianza FC",
            fromLogo: "/img/teams/sporting.jpg",
            toLogo: "/img/teams/alianza.jpg",
            value: "$150,000",
            date: "5 Enero 2025",
            type: "fichaje"
        },
        {
            playerName: "Fernando Ruiz",
            position: "Extremo Izquierdo",
            fromTeam: "Universitario",
            toTeam: "Herrera FC",
            fromLogo: "/img/teams/universitario.jpg",
            toLogo: "/img/teams/herrera.jpg",
            value: "Cesión 1 año",
            date: "3 Enero 2025",
            type: "cesion"
        }
    ],
    cesiones: [
        {
            playerName: "Luis González",
            position: "Defensa Central",
            fromTeam: "Plaza Amador",
            toTeam: "Tauro FC",
            fromLogo: "/img/teams/plaza.jpg",
            toLogo: "/img/teams/tauro.jpg",
            value: "Cesión 6 meses",
            date: "10 Enero 2025",
            type: "cesion"
        },
        {
            playerName: "Fernando Ruiz",
            position: "Extremo Izquierdo",
            fromTeam: "Universitario",
            toTeam: "Herrera FC",
            fromLogo: "/img/teams/universitario.jpg",
            toLogo: "/img/teams/herrera.jpg",
            value: "Cesión 1 año",
            date: "3 Enero 2025",
            type: "cesion"
        },
        {
            playerName: "Andrés Morales",
            position: "Mediocampista",
            fromTeam: "Veraguas United",
            toTeam: "Costa del Este",
            fromLogo: "/img/teams/veraguas.jpg",
            toLogo: "/img/teams/costa.jpg",
            value: "Cesión 8 meses",
            date: "28 Diciembre 2024",
            type: "cesion"
        }
    ],
    valores: [
        {
            playerName: "Diego Martínez",
            position: "Extremo Derecho",
            fromTeam: "Chorrera FC",
            toTeam: "Independiente",
            fromLogo: "/img/teams/chorrera.jpg",
            toLogo: "/img/teams/independiente.jpg",
            value: "$320,000",
            date: "15 Enero 2025",
            type: "fichaje"
        },
        {
            playerName: "Carlos Mendoza",
            position: "Delantero",
            fromTeam: "ACP 507",
            toTeam: "BKS FC",
            fromLogo: "/img/APC 507.png",
            toLogo: "/img/BKS FC.jpg",
            value: "$250,000",
            date: "12 Enero 2025",
            type: "fichaje"
        },
        {
            playerName: "Roberto Silva",
            position: "Mediocampista",
            fromTeam: "Árabe Unido",
            toTeam: "San Francisco",
            fromLogo: "/img/teams/arabe.jpg",
            toLogo: "/img/teams/sanfrancisco.jpg",
            value: "$180,000",
            date: "8 Enero 2025",
            type: "fichaje"
        },
        {
            playerName: "Miguel Torres",
            position: "Portero",
            fromTeam: "Sporting SM",
            toTeam: "Alianza FC",
            fromLogo: "/img/teams/sporting.jpg",
            toLogo: "/img/teams/alianza.jpg",
            value: "$150,000",
            date: "5 Enero 2025",
            type: "fichaje"
        }
    ]
};

function initializeTransfers() {
    loadTransferContent('recientes');
}

function switchTab(tabName) {
    // Remover clase active de todos los tabs y contenido
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Agregar clase active al tab clickeado y contenido correspondiente
    const clickedBtn = document.querySelector(`[onclick*="${tabName}"]`);
    if (clickedBtn) clickedBtn.classList.add('active');
    
    const activeContent = document.getElementById(tabName);
    if (activeContent) activeContent.classList.add('active');
    
    // Cargar contenido para el tab seleccionado
    loadTransferContent(tabName);
}

function loadTransferContent(tabName) {
    let data;
    let containerId;
    
    switch(tabName) {
        case 'recientes':
            data = transfersData.recientes;
            containerId = 'recent-transfers';
            break;
        case 'todas':
            data = transfersData.todas;
            containerId = 'all-transfers';
            break;
        case 'cesiones':
            data = transfersData.cesiones;
            containerId = 'loans-transfers';
            break;
        case 'valores':
            data = transfersData.valores;
            containerId = 'value-transfers';
            break;
        default:
            data = transfersData.recientes;
            containerId = 'recent-transfers';
    }
    
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
        
        if (data && data.length > 0) {
            data.forEach((transfer, index) => {
                setTimeout(() => {
                    const transferCard = createTransferCard(transfer);
                    container.insertAdjacentHTML('beforeend', transferCard);
                }, index * 150);
            });
        } else {
            container.innerHTML = '<div class="no-transfers">No hay transferencias disponibles</div>';
        }
    }
}

function createTransferCard(transfer) {
    const typeClass = transfer.type === 'cesion' ? 'cesion' : '';
    const valueLabel = transfer.type === 'cesion' ? 'Duración' : 'Valor de Transferencia';
    
    return `
        <div class="transfer-card">
            <div class="transfer-header">
                <span class="transfer-type ${typeClass}">${transfer.type.toUpperCase()}</span>
                <span class="transfer-date">${transfer.date}</span>
            </div>
            
            <div class="player-info">
                <div class="player-name">${transfer.playerName}</div>
                <div class="player-position">${transfer.position}</div>
            </div>
            
            <div class="transfer-movement">
                <div class="team-info">
                    ${transfer.fromLogo ? `<img src="${transfer.fromLogo}" alt="${transfer.fromTeam}" class="team-logo" onerror="this.style.display='none'">` : ''}
                    <div class="team-name">${transfer.fromTeam}</div>
                </div>
                <div class="transfer-arrow">
                    <i class="fas fa-arrow-right"></i>
                </div>
                <div class="team-info">
                    ${transfer.toLogo ? `<img src="${transfer.toLogo}" alt="${transfer.toTeam}" class="team-logo" onerror="this.style.display='none'">` : ''}
                    <div class="team-name">${transfer.toTeam}</div>
                </div>
            </div>
            
            <div class="transfer-value">
                <div class="value-amount">${transfer.value}</div>
                <div class="value-label">${valueLabel}</div>
            </div>
        </div>
    `;
}

// Función global para cambio de tabs
window.switchTab = switchTab;
