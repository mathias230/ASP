// Transferencias JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Update statistics from MongoDB
    updateTransferStats();
    
    // Initialize typewriter effect
    const typewriterElement = document.querySelector('.typewriter-text');
    if (typewriterElement) {
        typeWriter(typewriterElement, 'Mercado de Transferencias', 100);
    }
    
    // Setup socket connection for real-time updates
    setupSocketConnection();
});

// Setup socket connection for real-time updates
function setupSocketConnection() {
    if (typeof io !== 'undefined') {
        const socket = io();
        
        // Listen for transfer events
        socket.on('transferAdded', function(transfer) {
            console.log('New transfer added:', transfer);
            updateTransferStats();
            // Refresh current filter if needed
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) {
                const filterType = activeTab.getAttribute('data-tab');
                filterTransfers(filterType, activeTab);
            }
        });
        
        socket.on('transferDeleted', function(transferId) {
            console.log('Transfer deleted:', transferId);
            updateTransferStats();
            // Refresh current filter if needed
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) {
                const filterType = activeTab.getAttribute('data-tab');
                filterTransfers(filterType, activeTab);
            }
        });
    }
}

// Update transfer statistics from MongoDB
async function updateTransferStats() {
    try {
        const response = await fetch('/api/transfers/stats');
        if (response.ok) {
            const stats = await response.json();
            
            // Update DOM elements
            const totalTransfersEl = document.getElementById('totalTransfers');
            const totalValueEl = document.getElementById('totalValue');
            const totalLoansEl = document.getElementById('totalLoans');
            
            if (totalTransfersEl) totalTransfersEl.textContent = stats.totalTransfers;
            if (totalValueEl) totalValueEl.textContent = stats.totalValue;
            if (totalLoansEl) totalLoansEl.textContent = stats.totalLoans;
            
            console.log('Stats updated:', stats);
        }
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

// Mapeo de equipos con sus logos
const teamLogos = {
    "ACP 507": "/img/APC 507.png",
    "BKS FC": "/img/BKS FC.jpg",
    "Chorrera FC": "/img/teams/chorrera.jpg",
    "Independiente": "/img/teams/independiente.jpg",
    "Plaza Amador": "/img/teams/plaza.jpg",
    "Tauro FC": "/img/teams/tauro.jpg",
    "Árabe Unido": "/img/teams/arabe.jpg",
    "San Francisco": "/img/teams/sanfrancisco.jpg",
    "Sporting SM": "/img/teams/sporting.jpg",
    "Alianza FC": "/img/teams/alianza.jpg",
    "Universitario": "/img/teams/universitario.jpg",
    "Herrera FC": "/img/teams/herrera.jpg",
    "Veraguas United": "/img/teams/veraguas.jpg",
    "Costa del Este": "/img/teams/costa.jpg",
    "Coiner FC": "/img/teams/coiner.jpg",
    "FC WEST SIDE": "/img/teams/westside.jpg",
    "Humacao FC": "/img/teams/humacao.jpg",
    "Jumpers FC": "/img/teams/jumpers.jpg",
    "LOS PLEBES Tk": "/img/teams/plebes.jpg",
    "Punta Coco FC": "/img/teams/puntacoco.jpg",
    "Pura Vibra": "/img/teams/puravibra.jpg",
    "Rayos X FC": "/img/teams/rayosx.jpg",
    "Tiki Taka FC": "/img/teams/tikitaka.jpg",
    "WEST SIDE PTY": "/img/teams/westsidepty.jpg"
};

// Función para obtener logo del equipo
function getTeamLogo(teamName) {
    return teamLogos[teamName] || "/img/teams/default.png";
}

// Datos de transferencias - se cargan desde localStorage
let transfersData = {
    recientes: [],
    todas: [],
    cesiones: [],
    valores: []
};

function initializeTransfers() {
    loadTransfersFromStorage();
    loadTransferContent('recientes');
}

// Cargar transferencias desde localStorage
function loadTransfersFromStorage() {
    const savedTransfers = localStorage.getItem('transfers');
    if (savedTransfers) {
        const allTransfers = JSON.parse(savedTransfers);
        
        // Organizar transferencias por categorías
        transfersData.todas = allTransfers;
        transfersData.recientes = allTransfers.slice(-10); // Últimas 10
        transfersData.cesiones = allTransfers.filter(t => t.type === 'cesion');
        transfersData.valores = allTransfers.filter(t => t.type === 'fichaje').sort((a, b) => {
            const valueA = parseFloat(a.value.replace(/[$,]/g, '')) || 0;
            const valueB = parseFloat(b.value.replace(/[$,]/g, '')) || 0;
            return valueB - valueA;
        });
    }
}

// Guardar transferencias en localStorage
function saveTransfersToStorage() {
    localStorage.setItem('transfers', JSON.stringify(transfersData.todas));
}

function setupTransferTabs() {
    const tabButtons = document.querySelectorAll('.transfers-tabs .tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTransferTab(tabName);
        });
    });
}

function switchTransferTab(tabName) {
    // Remover clase active de todos los tabs y contenido
    document.querySelectorAll('.transfers-tabs .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Agregar clase active al tab clickeado y contenido correspondiente
    const clickedBtn = document.querySelector(`[data-tab="${tabName}"]`);
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
                }, index * 100);
            });
        } else {
            container.innerHTML = '<div class="no-transfers">No hay transferencias disponibles</div>';
        }
    }
}

function createTransferCard(transfer) {
    const typeClass = transfer.type === 'cesion' ? 'cesion' : '';
    
    // Obtener logos automáticamente basado en el nombre del equipo
    const fromLogo = getTeamLogo(transfer.fromTeam);
    const toLogo = getTeamLogo(transfer.toTeam);
    
    return `
        <div class="transfer-card-compact">
            <div class="transfer-teams-row">
                <div class="team-section">
                    <img src="${fromLogo}" alt="${transfer.fromTeam}" class="team-logo-compact" onerror="this.style.display='none'">
                    <div class="team-name-compact">${transfer.fromTeam}</div>
                </div>
                <div class="transfer-arrow-compact">
                    <i class="fas fa-arrow-right"></i>
                </div>
                <div class="team-section">
                    <img src="${toLogo}" alt="${transfer.toTeam}" class="team-logo-compact" onerror="this.style.display='none'">
                    <div class="team-name-compact">${transfer.toTeam}</div>
                </div>
            </div>
            <div class="player-name-compact">${transfer.playerName}</div>
            <div class="transfer-value-compact ${typeClass}">${transfer.value}</div>
        </div>
    `;
}

// Typewriter effect
function typeWriter(element, text, speed) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===== MODAL FUNCTIONS =====

// Show transfer modal
function showTransferModal() {
    document.getElementById('transferModal').style.display = 'block';
    // Set today's date as default
    document.getElementById('modalTransferDate').value = new Date().toISOString().split('T')[0];
}

// Close transfer modal
function closeTransferModal() {
    document.getElementById('transferModal').style.display = 'none';
    document.getElementById('quickTransferForm').reset();
}

// Show player select modal
function showPlayerSelectModal() {
    document.getElementById('playerSelectModal').style.display = 'block';
    loadTeamButtons();
}

// Close player select modal
function closePlayerSelectModal() {
    document.getElementById('playerSelectModal').style.display = 'none';
    document.getElementById('playersContainer').style.display = 'none';
}

// Toggle modal value field based on type
function toggleModalValueField() {
    const typeSelect = document.getElementById('modalTransferType');
    const valueLabel = document.getElementById('modalValueLabel');
    const valueInput = document.getElementById('modalTransferValue');
    
    if (typeSelect.value === 'cesion') {
        valueLabel.textContent = 'Duración de Cesión';
        valueInput.placeholder = 'Ej: Cesión 6 meses, Cesión 1 año';
    } else {
        valueLabel.textContent = 'Valor de Transferencia';
        valueInput.placeholder = 'Ej: $250,000, €150,000';
    }
}

// Handle quick transfer form submission
document.addEventListener('DOMContentLoaded', function() {
    const quickForm = document.getElementById('quickTransferForm');
    if (quickForm) {
        quickForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const transferData = {
                id: Date.now().toString(),
                playerName: document.getElementById('modalPlayerName').value,
                position: document.getElementById('modalPlayerPosition').value,
                fromTeam: document.getElementById('modalFromTeam').value,
                toTeam: document.getElementById('modalToTeam').value,
                type: document.getElementById('modalTransferType').value,
                value: document.getElementById('modalTransferValue').value,
                date: formatTransferDate(document.getElementById('modalTransferDate').value)
            };
            
            // Add to transfers array
            const savedTransfers = localStorage.getItem('transfers');
            let allTransfers = savedTransfers ? JSON.parse(savedTransfers) : [];
            allTransfers.push(transferData);
            
            // Save to localStorage
            localStorage.setItem('transfers', JSON.stringify(allTransfers));
            
            // Reload transfers data
            loadTransfersFromStorage();
            loadTransferContent('recientes');
            
            // Close modal and show success
            closeTransferModal();
            alert('Transferencia agregada exitosamente');
        });
    }
});

// Format date for transfer
function formatTransferDate(dateString) {
    const date = new Date(dateString);
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Load team buttons for player selection
function loadTeamButtons() {
    const container = document.getElementById('teamButtons');
    const savedTeams = localStorage.getItem('teams');
    
    if (savedTeams) {
        const teams = JSON.parse(savedTeams);
        container.innerHTML = teams.map(team => `
            <button onclick="loadTeamPlayers('${team.name}')" style="background: rgba(0,212,255,0.1); border: 2px solid var(--accent-blue); color: var(--accent-blue); padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease;" onmouseover="this.style.background='var(--accent-blue)'; this.style.color='white';" onmouseout="this.style.background='rgba(0,212,255,0.1)'; this.style.color='var(--accent-blue)';">
                ${team.name}
            </button>
        `).join('');
    } else {
        container.innerHTML = '<p style="color: rgba(255,255,255,0.7);">No hay equipos registrados</p>';
    }
}

// Load players for selected team
function loadTeamPlayers(teamName) {
    const savedPlayers = localStorage.getItem('players');
    const container = document.getElementById('playersList');
    const playersContainer = document.getElementById('playersContainer');
    
    if (savedPlayers) {
        const allPlayers = JSON.parse(savedPlayers);
        const teamPlayers = allPlayers.filter(player => player.team === teamName);
        
        if (teamPlayers.length > 0) {
            container.innerHTML = teamPlayers.map(player => `
                <div style="background: rgba(255,255,255,0.05); border: 2px solid rgba(0,212,255,0.2); border-radius: 12px; padding: 20px; text-align: center; transition: all 0.3s ease;" onmouseover="this.style.borderColor='var(--accent-blue)'" onmouseout="this.style.borderColor='rgba(0,212,255,0.2)'">
                    <div style="color: var(--accent-blue); font-size: 18px; font-weight: 600; margin-bottom: 8px;">${player.name}</div>
                    <div style="color: rgba(255,255,255,0.8); margin-bottom: 15px;">${player.position || 'Sin posición'}</div>
                    <button onclick="selectPlayerForTransfer('${player.name}', '${player.position || ''}', '${teamName}')" style="background: linear-gradient(45deg, var(--accent-blue), #0099cc); border: none; color: white; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        <i class="fas fa-exchange-alt"></i> Transferir
                    </button>
                </div>
            `).join('');
            playersContainer.style.display = 'block';
        } else {
            container.innerHTML = '<p style="color: rgba(255,255,255,0.7); text-align: center;">No hay jugadores en este equipo</p>';
            playersContainer.style.display = 'block';
        }
    } else {
        container.innerHTML = '<p style="color: rgba(255,255,255,0.7); text-align: center;">No hay jugadores registrados</p>';
        playersContainer.style.display = 'block';
    }
}

// Select player for transfer
function selectPlayerForTransfer(playerName, position, fromTeam) {
    // Close player select modal
    closePlayerSelectModal();
    
    // Open transfer modal with pre-filled data
    showTransferModal();
    document.getElementById('modalPlayerName').value = playerName;
    document.getElementById('modalPlayerPosition').value = position;
    document.getElementById('modalFromTeam').value = fromTeam;
}

// Filter functions for transfer tabs
async function filterTransfers(type, clickedButton = null) {
    let transfers = [];
    
    try {
        const response = await fetch('/api/transfers');
        if (response.ok) {
            transfers = await response.json();
        }
    } catch (error) {
        console.error('Error loading transfers:', error);
    }
    
    // Hide all tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    if (clickedButton) {
        clickedButton.classList.add('active');
        // Add loading effect to button
        const originalText = clickedButton.innerHTML;
        clickedButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
        setTimeout(() => {
            clickedButton.innerHTML = originalText;
        }, 300);
    }
    
    let filteredTransfers = [];
    let containerId = '';
    
    switch(type) {
        case 'recientes':
            filteredTransfers = transfers.slice(-10).reverse();
            containerId = 'recent-transfers';
            document.getElementById('recientes').classList.add('active');
            break;
        case 'todas':
            filteredTransfers = [...transfers].reverse();
            containerId = 'all-transfers';
            document.getElementById('todas').classList.add('active');
            break;
        case 'cesiones':
            filteredTransfers = transfers.filter(t => t.type === 'cesion').reverse();
            containerId = 'loans-transfers';
            document.getElementById('cesiones').classList.add('active');
            break;
        case 'valores':
            filteredTransfers = transfers.filter(t => t.type === 'fichaje').sort((a, b) => {
                const valueA = parseTransferValue(a.value);
                const valueB = parseTransferValue(b.value);
                return valueB - valueA;
            });
            containerId = 'value-transfers';
            document.getElementById('valores').classList.add('active');
            break;
    }
    
    // Clear container and display filtered transfers
    const container = document.getElementById(containerId);
    if (container) {
        // Show loading state
        container.innerHTML = '<div class="loading-transfers"><i class="fas fa-spinner fa-spin"></i> Cargando transferencias...</div>';
        
        setTimeout(() => {
            container.innerHTML = '';
            
            if (filteredTransfers.length > 0) {
                filteredTransfers.forEach((transfer, index) => {
                    setTimeout(() => {
                        const transferCard = createTransferCard(transfer);
                        container.insertAdjacentHTML('beforeend', transferCard);
                        
                        // Add fade-in animation to the card
                        const addedCard = container.lastElementChild;
                        if (addedCard) {
                            addedCard.style.opacity = '0';
                            addedCard.style.transform = 'translateY(20px)';
                            setTimeout(() => {
                                addedCard.style.transition = 'all 0.3s ease';
                                addedCard.style.opacity = '1';
                                addedCard.style.transform = 'translateY(0)';
                            }, 10);
                        }
                    }, index * 50);
                });
            } else {
                container.innerHTML = '<div class="no-transfers">No hay transferencias disponibles</div>';
            }
        }, 200);
    }
}

// Helper function to parse transfer values for sorting
function parseTransferValue(valueStr) {
    if (!valueStr) return 0;
    
    const numStr = valueStr.replace(/[^\d.]/g, '');
    const num = parseFloat(numStr);
    
    if (isNaN(num)) return 0;
    
    if (valueStr.includes('M')) {
        return num * 1000000;
    } else if (valueStr.includes('K')) {
        return num * 1000;
    }
    
    return num;
}

// Initialize filter buttons when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set up filter button event listeners
    const filterButtons = document.querySelectorAll('.tab-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterType = this.getAttribute('data-tab');
            filterTransfers(filterType, this);
        });
    });
    
    // Load recent transfers by default
    setTimeout(() => {
        const recentBtn = document.querySelector('.tab-btn[data-tab="recientes"]');
        filterTransfers('recientes', recentBtn);
    }, 100);
});

// Close modals when clicking outside
window.onclick = function(event) {
    const transferModal = document.getElementById('transferModal');
    const playerModal = document.getElementById('playerSelectModal');
    
    if (event.target === transferModal) {
        closeTransferModal();
    }
    if (event.target === playerModal) {
        closePlayerSelectModal();
    }
}
