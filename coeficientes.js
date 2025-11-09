// Coeficientes page functionality
let allTeams = [];
let filteredTeams = [];

// Coeficiente calculation system
const COEFICIENTE_WEIGHTS = {
    winRate: 0.35,      // 35% - Porcentaje de victorias
    goalsFor: 0.25,     // 25% - Goles a favor
    goalDiff: 0.20,     // 20% - Diferencia de goles
    matchesPlayed: 0.10, // 10% - Experiencia (partidos jugados)
    consistency: 0.10   // 10% - Consistencia en resultados
};

// Category thresholds
const CATEGORIES = {
    elite: { min: 85, name: 'Elite', class: 'badge-elite' },
    pro: { min: 70, name: 'Pro', class: 'badge-pro' },
    semi: { min: 55, name: 'Semi-Pro', class: 'badge-semi' },
    amateur: { min: 35, name: 'Amateur', class: 'badge-amateur' },
    rookie: { min: 0, name: 'Rookie', class: 'badge-rookie' }
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadCoeficientes();
    setupFilterButtons();
});

async function loadCoeficientes() {
    try {
        // Load tournament data
        const response = await fetch('/api/tournament');
        const data = await response.json();
        
        // Process teams data
        allTeams = processTeamsData(data);
        
        // Sort by coeficiente
        allTeams.sort((a, b) => b.coeficiente - a.coeficiente);
        
        // Add positions
        allTeams.forEach((team, index) => {
            team.position = index + 1;
        });
        
        filteredTeams = [...allTeams];
        renderTeams();
        
    } catch (error) {
        console.error('Error loading coeficientes:', error);
        showNoData('Error al cargar los datos');
    }
}

function processTeamsData(data) {
    const teams = [];
    const allClubs = [...(data.teams || []), ...(data.clubs || [])];
    
    // Get matches data
    const matches = data.tournament?.matches || [];
    
    // Process each team
    allClubs.forEach(club => {
        const teamStats = calculateTeamStats(club, matches);
        const coeficiente = calculateCoeficiente(teamStats);
        
        teams.push({
            id: club.id,
            name: club.name,
            logo: club.logo || 'img/default-team.png',
            coeficiente: Math.round(coeficiente * 100) / 100,
            category: getCategory(coeficiente),
            ...teamStats
        });
    });
    
    // Add some sample teams if no data exists
    if (teams.length === 0) {
        teams.push(...generateSampleTeams());
    }
    
    return teams;
}

function calculateTeamStats(team, matches) {
    let wins = 0;
    let draws = 0;
    let losses = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;
    let matchesPlayed = 0;
    let results = [];
    
    // Calculate stats from matches
    matches.forEach(match => {
        if (match.team1 === team.name || match.team2 === team.name) {
            matchesPlayed++;
            const isTeam1 = match.team1 === team.name;
            const teamGoals = isTeam1 ? match.score1 : match.score2;
            const opponentGoals = isTeam1 ? match.score2 : match.score1;
            
            goalsFor += teamGoals;
            goalsAgainst += opponentGoals;
            
            if (teamGoals > opponentGoals) {
                wins++;
                results.push('W');
            } else if (teamGoals < opponentGoals) {
                losses++;
                results.push('L');
            } else {
                draws++;
                results.push('D');
            }
        }
    });
    
    // If no matches, generate some sample data
    if (matchesPlayed === 0) {
        matchesPlayed = Math.floor(Math.random() * 20) + 5;
        wins = Math.floor(Math.random() * matchesPlayed * 0.6);
        draws = Math.floor(Math.random() * (matchesPlayed - wins) * 0.4);
        losses = matchesPlayed - wins - draws;
        goalsFor = Math.floor(Math.random() * matchesPlayed * 2.5) + matchesPlayed;
        goalsAgainst = Math.floor(Math.random() * matchesPlayed * 2) + Math.floor(matchesPlayed * 0.5);
    }
    
    const winRate = matchesPlayed > 0 ? (wins / matchesPlayed) * 100 : 0;
    const goalDifference = goalsFor - goalsAgainst;
    const consistency = calculateConsistency(results);
    
    return {
        matchesPlayed,
        wins,
        draws,
        losses,
        goalsFor,
        goalsAgainst,
        goalDifference,
        winRate,
        consistency
    };
}

function calculateCoeficiente(stats) {
    const {
        winRate,
        goalsFor,
        goalDifference,
        matchesPlayed,
        consistency
    } = stats;
    
    // Normalize values to 0-100 scale
    const normalizedWinRate = Math.min(winRate, 100);
    const normalizedGoalsFor = Math.min((goalsFor / Math.max(matchesPlayed, 1)) * 20, 100);
    const normalizedGoalDiff = Math.max(0, Math.min((goalDifference + 20) * 2.5, 100));
    const normalizedMatches = Math.min(matchesPlayed * 2, 100);
    const normalizedConsistency = consistency;
    
    // Calculate weighted coeficiente
    const coeficiente = (
        normalizedWinRate * COEFICIENTE_WEIGHTS.winRate +
        normalizedGoalsFor * COEFICIENTE_WEIGHTS.goalsFor +
        normalizedGoalDiff * COEFICIENTE_WEIGHTS.goalDiff +
        normalizedMatches * COEFICIENTE_WEIGHTS.matchesPlayed +
        normalizedConsistency * COEFICIENTE_WEIGHTS.consistency
    );
    
    return Math.max(0, Math.min(100, coeficiente));
}

function calculateConsistency(results) {
    if (results.length < 3) return 50;
    
    let consistency = 50;
    let streaks = 0;
    let currentStreak = 1;
    
    for (let i = 1; i < results.length; i++) {
        if (results[i] === results[i-1]) {
            currentStreak++;
        } else {
            if (currentStreak >= 3) streaks++;
            currentStreak = 1;
        }
    }
    
    // Reward consistency but not too much
    consistency += Math.min(streaks * 10, 30);
    
    return Math.min(100, consistency);
}

function getCategory(coeficiente) {
    for (const [key, category] of Object.entries(CATEGORIES)) {
        if (coeficiente >= category.min) {
            return { key, ...category };
        }
    }
    return { key: 'rookie', ...CATEGORIES.rookie };
}

function generateSampleTeams() {
    const sampleTeams = [
        { name: 'Real Madrid CF', logo: 'img/teams/real-madrid.png' },
        { name: 'FC Barcelona', logo: 'img/teams/barcelona.png' },
        { name: 'Manchester United', logo: 'img/teams/man-united.png' },
        { name: 'Liverpool FC', logo: 'img/teams/liverpool.png' },
        { name: 'Bayern Munich', logo: 'img/teams/bayern.png' },
        { name: 'Paris Saint-Germain', logo: 'img/teams/psg.png' },
        { name: 'Juventus FC', logo: 'img/teams/juventus.png' },
        { name: 'Chelsea FC', logo: 'img/teams/chelsea.png' },
        { name: 'Manchester City', logo: 'img/teams/man-city.png' },
        { name: 'Arsenal FC', logo: 'img/teams/arsenal.png' },
        { name: 'AC Milan', logo: 'img/teams/milan.png' },
        { name: 'Inter Milan', logo: 'img/teams/inter.png' },
        { name: 'Atletico Madrid', logo: 'img/teams/atletico.png' },
        { name: 'Borussia Dortmund', logo: 'img/teams/dortmund.png' },
        { name: 'Tottenham', logo: 'img/teams/tottenham.png' }
    ];
    
    return sampleTeams.map((team, index) => {
        const matchesPlayed = Math.floor(Math.random() * 25) + 10;
        const wins = Math.floor(Math.random() * matchesPlayed * 0.7);
        const draws = Math.floor(Math.random() * (matchesPlayed - wins) * 0.4);
        const losses = matchesPlayed - wins - draws;
        const goalsFor = Math.floor(Math.random() * matchesPlayed * 3) + matchesPlayed;
        const goalsAgainst = Math.floor(Math.random() * matchesPlayed * 2) + Math.floor(matchesPlayed * 0.3);
        
        const stats = {
            matchesPlayed,
            wins,
            draws,
            losses,
            goalsFor,
            goalsAgainst,
            goalDifference: goalsFor - goalsAgainst,
            winRate: (wins / matchesPlayed) * 100,
            consistency: Math.floor(Math.random() * 40) + 40
        };
        
        const coeficiente = calculateCoeficiente(stats);
        
        return {
            id: index + 1000,
            name: team.name,
            logo: 'img/default-team.png',
            coeficiente: Math.round(coeficiente * 100) / 100,
            category: getCategory(coeficiente),
            ...stats
        };
    });
}

function renderTeams() {
    const teamsList = document.getElementById('teams-list');
    
    if (filteredTeams.length === 0) {
        showNoData('No hay equipos para mostrar');
        return;
    }
    
    const teamsHTML = filteredTeams.map(team => `
        <div class="team-row" data-category="${team.category.key}">
            <div class="team-position">${team.position}</div>
            <div>
                <img src="${team.logo}" alt="${team.name}" class="team-logo" 
                     onerror="this.src='img/default-team.png'">
            </div>
            <div class="team-name">${team.name}</div>
            <div class="coeficiente-value">${team.coeficiente}</div>
            <div class="stat-value">${team.matchesPlayed}</div>
            <div class="stat-value">${team.wins}</div>
            <div class="stat-value">${team.goalsFor}</div>
            <div>
                <span class="coeficiente-badge ${team.category.class}">
                    ${team.category.name}
                </span>
            </div>
        </div>
    `).join('');
    
    teamsList.innerHTML = teamsHTML;
}

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter teams
            const filter = this.dataset.filter;
            if (filter === 'all') {
                filteredTeams = [...allTeams];
            } else {
                filteredTeams = allTeams.filter(team => team.category.key === filter);
            }
            
            renderTeams();
        });
    });
}

function showNoData(message) {
    const teamsList = document.getElementById('teams-list');
    teamsList.innerHTML = `
        <div class="no-data">
            <i class="fas fa-info-circle" style="font-size: 2rem; margin-bottom: 10px;"></i>
            <p>${message}</p>
        </div>
    `;
}
