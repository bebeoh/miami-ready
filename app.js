// ===== CONFIGURATION =====
const CONFIG = {
    STORE_KEY: 'miami-v6',
    START_DATE: new Date(2026, 0, 11), // Jan 11, 2026
    END_DATE: new Date(2026, 2, 21),   // Mar 21, 2026
};

// Schedule: 0=Sun, 1=Mon, etc.
const SCHEDULE = [
    { d: 0, type: 'tempo', label: 'Tempo + Scan', short: 'T', focus: 'Recovery & Scan Day' },
    { d: 1, type: 'lower', label: 'Lower C', short: 'C', focus: 'Side-Glute + Stability' },
    { d: 2, type: 'tempo', label: 'Upper Body', short: 'U', focus: 'X-Frame: Shoulders + Lats' },
    { d: 3, type: 'lower', label: 'Lower B', short: 'B', focus: 'Under-Butt & Ham Tie-in' },
    { d: 4, type: 'tempo', label: 'Active Recovery', short: 'R', focus: 'Walk + Foam Roll' },
    { d: 5, type: 'lower', label: 'Lower A', short: 'A', focus: 'Shelf + Side Glute' },
    { d: 6, type: 'tempo', label: 'Upper + Mobility', short: 'M', focus: 'X-Frame + Stretching' },
];

const PHASES = [
    { name: 'SYNC', weeks: [1,2,3], color: 'purple', goal: 'Sync & Stabilize — Fix pelvic alignment' },
    { name: 'ALIGN', weeks: [4,5,6,7], color: 'teal', goal: 'Alignment & Lift — Build the foundation' },
    { name: 'PEAK', weeks: [8,9,10], color: 'gold', goal: 'Peak Performance — Maximum results' },
];

const EXERCISES = {
    'Lower A': {
        name: 'Shelf + Side',
        warmup: [
            { name: 'Broomstick Reset', time: '2 min' },
            { name: 'Cat-Cow', time: '1 min' },
            { name: 'Dead Bugs', time: '2 min' },
            { name: 'Floor I-Y-W', time: '2 min' },
            { name: 'Hip Flexor Stretch', time: '1 min' },
        ],
        exercises: [
            { name: 'Barbell Hip Thrust', sets: '4×6-10', isMain: true, cue: '2-second squeeze at top' },
            { name: 'Back Extension Hold', sets: '3×30-45s', cue: 'Squeeze and hold at top' },
            { name: 'Seated Band Abduction', sets: '4×15-20', cue: 'Push knees out against band' },
            { name: 'Lateral Step-Ups', sets: '3×10 each', cue: 'Drive through heel' },
        ],
        finisher: 'Frog pumps ×40 + Band abduction hold ×1 min',
    },
    'Lower B': {
        name: 'Under-Butt',
        warmup: [
            { name: 'Broomstick Reset', time: '2 min' },
            { name: 'Cat-Cow', time: '1 min' },
            { name: 'Dead Bugs', time: '2 min' },
            { name: 'Floor I-Y-W', time: '2 min' },
            { name: 'Hip Flexor Stretch', time: '1 min' },
        ],
        exercises: [
            { name: 'B-Stance RDL', sets: '4×8 each', isMain: true, cue: 'Hip hinge, bar close to legs' },
            { name: 'High Step-Ups', sets: '3×10 each', cue: 'Full extension at top' },
            { name: 'Hyperextensions', sets: '3×12', cue: 'Squeeze glutes at top' },
            { name: 'Yoga Ball Ham Curls', sets: '3×12', cue: 'Control the negative' },
        ],
        finisher: 'Ankle-weight kickbacks 2×15 each side',
    },
    'Lower C': {
        name: 'Side-Glute + Stability',
        warmup: [
            { name: 'Broomstick Reset', time: '2 min' },
            { name: 'Cat-Cow', time: '1 min' },
            { name: 'Dead Bugs', time: '2 min' },
            { name: 'Floor I-Y-W', time: '2 min' },
            { name: 'Hip Flexor Stretch', time: '1 min' },
        ],
        exercises: [
            { name: 'Single-Leg Hip Thrust', sets: '3×8 each', isMain: true, cue: 'Fix imbalances' },
            { name: 'Cossack Squats', sets: '3×10 each', cue: 'Deep lateral stretch' },
            { name: 'Side-Lying Leg Raises', sets: '3×20', cue: 'Slow and controlled' },
            { name: 'Band Walks', sets: '3×30 steps', cue: 'Stay low, tension constant' },
        ],
        finisher: 'Standing abduction hold 45s each + Bridge pulses 2 min',
    },
};

const CYCLE_PHASES = {
    menstrual: { name: 'Menstrual', start: 1, end: 5, instruction: 'Light weight, focus on feeling it' },
    follicular: { name: 'Follicular', start: 6, end: 14, instruction: 'Add weight when connected' },
    ovulatory: { name: 'Ovulatory', start: 15, end: 17, instruction: 'PR window — go heavy!' },
    luteal: { name: 'Luteal', start: 18, end: 28, instruction: 'Maintain weight, slow negatives' },
};

const CONNECTIONS = [
    { id: 'red', emoji: '😐', label: 'Not yet' },
    { id: 'yellow', emoji: '🤔', label: 'Getting there' },
    { id: 'green', emoji: '😊', label: 'Feeling it' },
    { id: 'fire', emoji: '🔥', label: 'Locked in' },
];

// ===== ALPINE APP =====
function app() {
    return {
        // State
        view: 'today',
        days: {},
        scans: [],
        settings: {
            protein: 130,
            water: 100,
            periodStart: '2026-01-14',
        },
        baseline: { roundness: 32, protrusion: 25 },

        // Vision/Motivation images
        visionImages: [
            { src: 'goal.png', caption: 'The goal' },
            { src: 'miami-vision.jpg', caption: 'Miami sunset vibes' },
        ],
        currentVisionIndex: 0,

        // Workout mode
        workoutMode: false,
        workoutStep: 0,
        workoutSteps: [],
        warmupChecks: [],
        exerciseSets: [],

        // Celebration
        showCelebration: false,
        selectedConnection: null,
        topSet: { weight: null, reps: null },
        isPR: false,

        // Modals
        showQuickLog: false,
        showScanModal: false,
        showVisionModal: false,
        selectedDate: null,
        quickLogData: {},
        scanData: { date: '', roundness: null, protrusion: null },

        // Week navigation
        viewingWeekOffset: 0, // 0 = current week, -1 = last week, etc.

        // Cloud sync
        cloudBinId: '',
        cloudApiKey: '',

        // Constants
        connections: CONNECTIONS,

        // ===== INITIALIZATION =====
        init() {
            this.load();
            this.selectedDate = this.iso(new Date());
            this.scanData.date = this.iso(new Date());
            // Load cloud credentials
            const creds = this.getCloudCredentials();
            this.cloudBinId = creds.binId;
            this.cloudApiKey = creds.apiKey;
        },

        // ===== COMPUTED PROPERTIES =====
        get today() {
            return new Date();
        },

        get todayISO() {
            return this.iso(this.today);
        },

        get todayData() {
            return this.days[this.todayISO] || {};
        },

        set todayData(val) {
            this.days[this.todayISO] = val;
            this.save();
        },

        get currentDay() {
            return Math.max(1, Math.min(70, this.dayNum(this.today)));
        },

        get currentWeek() {
            return Math.ceil(this.currentDay / 7);
        },

        get todaySchedule() {
            return this.getSchedule(this.today);
        },

        get currentPhase() {
            return PHASES.find(p => p.weeks.includes(this.currentWeek)) || PHASES[0];
        },

        get phaseProgress() {
            const phase = this.currentPhase;
            const startWeek = Math.min(...phase.weeks);
            const endWeek = Math.max(...phase.weeks);
            const weeksInPhase = endWeek - startWeek + 1;
            const weeksComplete = this.currentWeek - startWeek;
            return Math.round((weeksComplete / weeksInPhase) * 100);
        },

        get cycleDay() {
            if (!this.settings.periodStart) return null;
            const [y, m, d] = this.settings.periodStart.split('-').map(Number);
            const start = new Date(y, m - 1, d);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const diff = Math.floor((today - start) / 86400000) + 1;
            return ((diff - 1) % 28) + 1;
        },

        get cyclePhase() {
            const day = this.cycleDay;
            if (!day) return null;
            for (const [key, phase] of Object.entries(CYCLE_PHASES)) {
                if (day >= phase.start && day <= phase.end) {
                    return { ...phase, key };
                }
            }
            return { ...CYCLE_PHASES.menstrual, key: 'menstrual' };
        },

        get streak() {
            let count = 0;
            const today = new Date();
            for (let i = 0; i < 70; i++) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                if (d < CONFIG.START_DATE) break;
                if (this.days[this.iso(d)]?.workout) {
                    count++;
                } else if (i > 0) {
                    break;
                }
            }
            return count;
        },

        get totalWorkouts() {
            return Object.values(this.days).filter(d => d.workout).length;
        },

        get caseinNights() {
            return Object.values(this.days).filter(d => d.casein).length;
        },

        get weekDates() {
            const today = new Date();
            const start = new Date(today);
            start.setDate(start.getDate() - start.getDay() + (this.viewingWeekOffset * 7));
            return Array.from({ length: 7 }, (_, i) => {
                const d = new Date(start);
                d.setDate(d.getDate() + i);
                return {
                    date: d.getDate(),
                    dow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()],
                    iso: this.iso(d),
                    isToday: this.iso(d) === this.todayISO,
                    schedule: this.getSchedule(d),
                };
            });
        },

        get weekLabel() {
            const dates = this.weekDates;
            if (dates.length === 0) return '';
            const first = this.parseIso(dates[0].iso);
            const last = this.parseIso(dates[6].iso);
            return `${this.formatDate(first)} - ${this.formatDate(last)}`;
        },

        get canGoNextWeek() {
            // Can go forward up to program end
            const lastDay = this.weekDates[6];
            if (!lastDay) return false;
            const lastDate = this.parseIso(lastDay.iso);
            return lastDate < CONFIG.END_DATE;
        },

        get canGoPrevWeek() {
            // Can go back to program start
            const firstDay = this.weekDates[0];
            if (!firstDay) return false;
            const firstDate = this.parseIso(firstDay.iso);
            return firstDate > CONFIG.START_DATE;
        },

        get allDays() {
            const today = new Date();
            return Array.from({ length: 70 }, (_, i) => {
                const d = new Date(CONFIG.START_DATE);
                d.setDate(d.getDate() + i);
                return {
                    iso: this.iso(d),
                    isToday: this.iso(d) === this.todayISO,
                    isFuture: d > today,
                };
            });
        },

        get currentWorkoutStep() {
            return this.workoutSteps[this.workoutStep];
        },

        get lastWeight() {
            const label = this.todaySchedule.label;
            for (let i = this.currentDay - 1; i >= 1; i--) {
                const d = new Date(CONFIG.START_DATE);
                d.setDate(d.getDate() + i - 1);
                const data = this.days[this.iso(d)];
                if (data?.mainWt && this.getSchedule(d).label === label) {
                    return { weight: data.mainWt, reps: data.mainReps };
                }
            }
            return null;
        },

        get weightRec() {
            const last = this.lastWeight?.weight;
            if (!last) return { action: 'Start light — find your baseline' };
            const phase = this.cyclePhase?.key;
            if (phase === 'menstrual') return { action: `${last} lbs or lighter` };
            if (phase === 'follicular') return { action: `${last}→${last + 5} lbs` };
            if (phase === 'ovulatory') return { action: `${last + 5}-${last + 10} lbs` };
            return { action: `${last} lbs (slow negatives)` };
        },

        get liftHistory() {
            return Object.entries(this.days)
                .filter(([k, v]) => v.mainWt && this.isLowerDay(k))
                .sort((a, b) => a[0].localeCompare(b[0]))
                .slice(-10)
                .map(([k, v]) => ({ date: k, weight: v.mainWt }));
        },

        get maxLift() {
            return Math.max(...this.liftHistory.map(p => p.weight), 1);
        },

        get connectionCounts() {
            const counts = { red: 0, yellow: 0, green: 0, fire: 0 };
            Object.entries(this.days).forEach(([k, v]) => {
                if (v.conn && this.isLowerDay(k)) counts[v.conn]++;
            });
            return counts;
        },

        get totalLowerSessions() {
            return Object.values(this.connectionCounts).reduce((a, b) => a + b, 0);
        },

        get connectionPercent() {
            if (this.totalLowerSessions === 0) return 0;
            const good = (this.connectionCounts.green || 0) + (this.connectionCounts.fire || 0);
            return Math.round((good / this.totalLowerSessions) * 100);
        },

        get latestScan() {
            return this.scans.length ? this.scans[this.scans.length - 1] : null;
        },

        get roundnessChange() {
            return this.latestScan ? this.latestScan.roundness - this.baseline.roundness : 0;
        },

        get protrusionChange() {
            return this.latestScan ? this.latestScan.protrusion - this.baseline.protrusion : 0;
        },

        // ===== UTILITIES =====
        iso(d) {
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        },

        parseIso(s) {
            const [y, m, d] = s.split('-').map(Number);
            return new Date(y, m - 1, d);
        },

        dayNum(d) {
            return Math.floor((d - CONFIG.START_DATE) / 86400000) + 1;
        },

        getSchedule(d) {
            const date = typeof d === 'string' ? this.parseIso(d) : d;
            return SCHEDULE.find(s => s.d === date.getDay());
        },

        isLowerDay(d) {
            return this.getSchedule(d).type === 'lower';
        },

        formatDate(d, style) {
            const date = typeof d === 'string' ? this.parseIso(d) : d;
            if (style === 'long') {
                return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
            }
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        },

        // ===== ACTIONS =====

        // Week Navigation
        prevWeek() {
            if (this.canGoPrevWeek) {
                this.viewingWeekOffset--;
            }
        },

        nextWeek() {
            if (this.canGoNextWeek) {
                this.viewingWeekOffset++;
            }
        },

        goToCurrentWeek() {
            this.viewingWeekOffset = 0;
        },

        addProtein(amount) {
            const data = this.days[this.todayISO] || {};
            data.protein = (data.protein || 0) + amount;
            this.days[this.todayISO] = data;
            this.save();
        },

        addWater(amount) {
            const data = this.days[this.todayISO] || {};
            data.water = (data.water || 0) + amount;
            this.days[this.todayISO] = data;
            this.save();
        },

        toggleCasein() {
            const data = this.days[this.todayISO] || {};
            data.casein = !data.casein;
            this.days[this.todayISO] = data;
            this.save();
        },

        // ===== WORKOUT MODE =====
        startWorkout() {
            const label = this.todaySchedule.label;
            const workout = EXERCISES[label];

            if (!workout) {
                // Tempo day - just open quick log
                this.openQuickLog();
                return;
            }

            this.workoutSteps = [];

            // Add warmup
            this.workoutSteps.push({
                type: 'warmup',
                name: '8-Min Posture Reset',
                items: workout.warmup,
            });

            // Add exercises
            workout.exercises.forEach((ex, i) => {
                this.workoutSteps.push({
                    type: 'exercise',
                    number: i + 1,
                    ...ex,
                });
            });

            // Add finisher
            this.workoutSteps.push({
                type: 'finisher',
                content: workout.finisher,
            });

            this.workoutStep = 0;
            this.warmupChecks = workout.warmup.map(() => false);
            this.exerciseSets = [
                { weight: null, reps: null, logged: false },
                { weight: null, reps: null, logged: false },
                { weight: null, reps: null, logged: false },
                { weight: null, reps: null, logged: false },
            ];
            this.workoutMode = true;
        },

        toggleWarmup(idx) {
            this.warmupChecks[idx] = !this.warmupChecks[idx];
        },

        logSet(idx) {
            this.exerciseSets[idx].logged = true;
            // Track top set
            if (this.exerciseSets[idx].weight > (this.topSet.weight || 0)) {
                this.topSet = {
                    weight: this.exerciseSets[idx].weight,
                    reps: this.exerciseSets[idx].reps,
                };
            }
        },

        nextStep() {
            if (this.workoutStep < this.workoutSteps.length - 1) {
                this.workoutStep++;
                // Reset exercise sets for new exercise
                if (this.currentWorkoutStep?.type === 'exercise') {
                    this.exerciseSets = [
                        { weight: null, reps: null, logged: false },
                        { weight: null, reps: null, logged: false },
                        { weight: null, reps: null, logged: false },
                        { weight: null, reps: null, logged: false },
                    ];
                }
            } else {
                this.completeWorkout();
            }
        },

        skipStep() {
            this.nextStep();
        },

        exitWorkout() {
            if (confirm('Exit workout? Progress will be lost.')) {
                this.workoutMode = false;
                this.workoutStep = 0;
            }
        },

        completeWorkout() {
            // Check for PR
            const last = this.lastWeight;
            this.isPR = last && this.topSet.weight > last.weight;

            // Save workout data
            const data = this.days[this.todayISO] || {};
            data.workout = true;
            if (this.topSet.weight) {
                data.mainWt = this.topSet.weight;
                data.mainReps = this.topSet.reps;
            }
            this.days[this.todayISO] = data;
            this.save();

            // Show celebration
            this.workoutMode = false;
            this.showCelebration = true;

            // Confetti!
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        },

        finishCelebration() {
            // Save connection
            if (this.selectedConnection) {
                const data = this.days[this.todayISO] || {};
                data.conn = this.selectedConnection;
                this.days[this.todayISO] = data;
                this.save();
            }

            this.showCelebration = false;
            this.selectedConnection = null;
            this.topSet = { weight: null, reps: null };
            this.isPR = false;
        },

        // ===== QUICK LOG =====
        openQuickLog() {
            this.selectedDate = this.todayISO;
            const existing = this.days[this.selectedDate] || {};
            this.quickLogData = {
                workout: existing.workout || null,
                weight: existing.mainWt || null,
                reps: existing.mainReps || null,
                connection: existing.conn || null,
            };
            this.showQuickLog = true;
        },

        saveQuickLog() {
            const data = this.days[this.selectedDate] || {};
            data.workout = this.quickLogData.workout;
            if (this.quickLogData.weight) data.mainWt = this.quickLogData.weight;
            if (this.quickLogData.reps) data.mainReps = this.quickLogData.reps;
            if (this.quickLogData.connection) data.conn = this.quickLogData.connection;
            this.days[this.selectedDate] = data;
            this.save();
            this.showQuickLog = false;
        },

        viewDay(iso) {
            this.selectedDate = iso;
            const existing = this.days[iso] || {};
            this.quickLogData = {
                workout: existing.workout || null,
                weight: existing.mainWt || null,
                reps: existing.mainReps || null,
                connection: existing.conn || null,
            };
            this.showQuickLog = true;
        },

        // ===== SCANS =====
        addScan() {
            if (!this.scanData.date || !this.scanData.roundness || !this.scanData.protrusion) {
                alert('Please fill all fields');
                return;
            }
            this.scans = this.scans.filter(s => s.date !== this.scanData.date);
            this.scans.push({ ...this.scanData });
            this.scans.sort((a, b) => a.date.localeCompare(b.date));
            this.save();
            this.showScanModal = false;
            this.scanData = { date: this.iso(new Date()), roundness: null, protrusion: null };
        },

        // ===== VISION GALLERY =====
        get currentVisionImage() {
            return this.visionImages[this.currentVisionIndex] || this.visionImages[0];
        },

        nextVisionImage() {
            this.currentVisionIndex = (this.currentVisionIndex + 1) % this.visionImages.length;
        },

        prevVisionImage() {
            this.currentVisionIndex = (this.currentVisionIndex - 1 + this.visionImages.length) % this.visionImages.length;
        },

        // ===== SETTINGS =====
        saveSettings() {
            this.save();
        },

        exportData() {
            const data = { days: this.days, scans: this.scans, settings: this.settings, baseline: this.baseline };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `miami-ready-${this.iso(new Date())}.json`;
            a.click();
        },

        importData(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.days) this.days = data.days;
                    if (data.scans) this.scans = data.scans;
                    if (data.settings) this.settings = { ...this.settings, ...data.settings };
                    if (data.baseline) this.baseline = data.baseline;
                    this.save();
                    alert('Data imported successfully!');
                } catch {
                    alert('Invalid file format');
                }
            };
            reader.readAsText(file);
        },

        // ===== CLOUD SYNC =====
        async cloudPush() {
            const binId = localStorage.getItem('miami-bin');
            const apiKey = localStorage.getItem('miami-key');
            if (!binId || !apiKey) {
                alert('Please enter Bin ID and API Key in Settings first');
                return;
            }
            try {
                const data = { days: this.days, scans: this.scans, settings: this.settings, baseline: this.baseline };
                const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'X-Master-Key': apiKey },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    alert('✓ Synced to cloud!');
                } else {
                    alert('Sync failed. Check your Bin ID and API Key.');
                }
            } catch (e) {
                alert('Error: ' + e.message);
            }
        },

        async cloudPull() {
            const binId = localStorage.getItem('miami-bin');
            const apiKey = localStorage.getItem('miami-key');
            if (!binId || !apiKey) {
                alert('Please enter Bin ID and API Key in Settings first');
                return;
            }
            if (!confirm('Replace local data with cloud data?')) return;
            try {
                const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
                    headers: { 'X-Master-Key': apiKey }
                });
                if (response.ok) {
                    const result = await response.json();
                    const data = result.record || result;
                    if (data.days) this.days = data.days;
                    if (data.scans) this.scans = data.scans;
                    if (data.settings) this.settings = { ...this.settings, ...data.settings };
                    if (data.baseline) this.baseline = data.baseline;
                    this.save();
                    alert('✓ Loaded from cloud!');
                } else {
                    alert('Failed to load. Check your Bin ID and API Key.');
                }
            } catch (e) {
                alert('Error: ' + e.message);
            }
        },

        saveCloudCredentials(binId, apiKey) {
            if (binId) localStorage.setItem('miami-bin', binId);
            if (apiKey) localStorage.setItem('miami-key', apiKey);
            if (binId && apiKey) {
                alert('Keys saved!');
            }
        },

        getCloudCredentials() {
            return {
                binId: localStorage.getItem('miami-bin') || '',
                apiKey: localStorage.getItem('miami-key') || ''
            };
        },

        resetAll() {
            if (confirm('Delete all data? This cannot be undone.')) {
                this.days = {};
                this.scans = [];
                this.settings = { protein: 130, water: 100, periodStart: '' };
                localStorage.removeItem(CONFIG.STORE_KEY);
            }
        },

        // ===== PERSISTENCE =====
        load() {
            try {
                const stored = localStorage.getItem(CONFIG.STORE_KEY);
                if (stored) {
                    const data = JSON.parse(stored);
                    if (data.days) this.days = data.days;
                    if (data.scans) this.scans = data.scans;
                    if (data.settings) this.settings = { ...this.settings, ...data.settings };
                    if (data.baseline) this.baseline = data.baseline;
                }
            } catch (e) {
                console.error('Failed to load data:', e);
            }
        },

        save() {
            try {
                const data = {
                    days: this.days,
                    scans: this.scans,
                    settings: this.settings,
                    baseline: this.baseline,
                };
                localStorage.setItem(CONFIG.STORE_KEY, JSON.stringify(data));
            } catch (e) {
                console.error('Failed to save data:', e);
            }
        },
    };
}
