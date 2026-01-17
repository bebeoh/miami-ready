const CONFIG = {
    STORE_KEY: 'miami-architect-v8',
    START_DATE: new Date(2026, 0, 11),
    END_DATE: new Date(2026, 2, 21),
    TARGETS: { roundness: 50, protrusion: 45, lift: 90 },
};

const SCHEDULE = [
    { d: 0, type: 'tempo', label: 'Tempo + Scan', focus: 'Recovery & Scan Day' },
    { d: 1, type: 'lower', label: 'Lower C', focus: 'Side-Glute + Stability' },
    { d: 2, type: 'tempo', label: 'Upper Body', focus: 'X-Frame: Shoulders + Lats' },
    { d: 3, type: 'lower', label: 'Lower B', focus: 'Under-Butt & Ham Tie-in' },
    { d: 4, type: 'tempo', label: 'Active Recovery', focus: 'Walk + Foam Roll' },
    { d: 5, type: 'lower', label: 'Lower A', focus: 'Shelf + Side Glute' },
    { d: 6, type: 'tempo', label: 'Upper + Mobility', focus: 'X-Frame + Stretching' },
];

const EXERCISES = {
    'lower': {
        name: 'Lower Body Sculpt',
        exercises: [
            { name: 'Barbell Hip Thrust', sets: '4×8', cue: 'Exhale, Tuck, Squeeze, HOLD.', video: 'LM8XHLYJoYs' },
            { name: 'B-Stance RDL', sets: '3×10', cue: 'Close the car door with your glutes.', video: 'wp1r0s2Vdkk' }
        ]
    },
    'tempo': {
        name: 'Recovery & Mobility',
        exercises: [{ name: 'StretchLab Session / Foam Roll', sets: '30 min', cue: 'Focus on hip flexors.', video: 'rmNf1BgigDk' }]
    },
    'upper': {
        name: 'Upper Body X-Frame',
        exercises: [{ name: 'Lateral Raises', sets: '4×15', cue: 'Pour the water out of the pitchers.', video: '3VcKaXpzqRo' }]
    }
};

function app() {
    return {
        view: 'today',
        workoutMode: false,
        showSwapModal: false,
        currentPainLevel: 0,
        scans: [],
        swaps: {},
        baseline: { roundness: 32, protrusion: 25, lift: 83 },

        init() {
            this.load();
        },

        // Helper for Dates
        get todayISO() {
            return new Date().toISOString().split('T')[0];
        },

        get currentDay() {
            const diff = new Date() - CONFIG.START_DATE;
            return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
        },

        // Logic for current schedule including PIVOTS
        get todaySchedule() {
            const iso = this.todayISO;
            if (this.swaps[iso]) {
                return SCHEDULE.find(s => s.type === this.swaps[iso]);
            }
            return SCHEDULE.find(s => s.d === new Date().getDay());
        },

        get latestScan() {
            return this.scans[this.scans.length - 1] || this.baseline;
        },

        get physiqueStatus() {
            if (this.latestScan.protrusion < 30) return "Priority: Protrusion (Shelf)";
            return "Balanced Growth Mode";
        },

        // Actions
        startWorkout() {
            this.workoutMode = true;
            // Additional logic to load specific exercises
            this.activeWorkout = EXERCISES[this.todaySchedule.type];
        },

        handleBackPain(level) {
            this.currentPainLevel = level;
            if (level > 3) {
                this.pivotDay('lower'); // Force switch to Stability day
                alert("Back Pain Detected: Switching to Stability Session.");
            }
        },

        pivotDay(type) {
            this.swaps[this.todayISO] = type;
            this.showSwapModal = false;
            this.save();
        },

        // Data Persistence
        save() {
            const data = { scans: this.scans, swaps: this.swaps, currentPainLevel: this.currentPainLevel };
            localStorage.setItem(CONFIG.STORE_KEY, JSON.stringify(data));
        },

        load() {
            const stored = localStorage.getItem(CONFIG.STORE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                this.scans = parsed.scans || [];
                this.swaps = parsed.swaps || {};
                this.currentPainLevel = parsed.currentPainLevel || 0;
            }
        }
    }
}
