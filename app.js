// ===== CONFIGURATION & TARGETS =====
const CONFIG = {
    STORE_KEY: 'miami-v7-architect',
    START_DATE: new Date(2026, 0, 11),
    END_DATE: new Date(2026, 2, 21),
    TARGETS: { roundness: 50, protrusion: 45 }, // Natural BBL Goals
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
    'Lower A': {
        name: 'Shelf + Side (Protrusion Focus)',
        backPainSubstitute: 'Lower C (Stability Focus)',
        warmup: [
            { name: '90/90 Hip Switch', time: '2 min', cue: 'Unstick hip capsule', video: 'rmNf1BgigDk' },
            { name: 'Cat-Cow', time: '1 min', video: 'kqnua4rHVVA' }
        ],
        exercises: [
            { name: 'Barbell Hip Thrust', sets: '4×8', cue: 'The Neural Rule: Exhale, Tuck, Squeeze, HOLD.', target: 'Protrusion', video: 'LM8XHLYJoYs' },
            { name: 'Seated Band Abduction', sets: '4×20', cue: 'Lean forward to hit high side-glute.', target: 'Roundness', video: 'o7e6Jlj-hj8' }
        ]
    },
    // ... Lower B and C follow similar structured patterns
};

function app() {
    return {
        view: 'today',
        days: {},
        scans: [],
        swaps: {}, // Logic for Pivot Days (e.g., StretchLab)
        currentPainLevel: 0,
        showSwapModal: false,
        
        init() {
            this.load();
            // Initializing baseline from your ZOZOFIT scan
            this.baseline = { roundness: 32, protrusion: 25, lift: 83 };
        },

        // ===== THE ARCHITECT ENGINE =====
        get todaySchedule() {
            const iso = this.todayISO;
            // Check for manual Pivot/Swap first
            if (this.swaps[iso]) {
                return SCHEDULE.find(s => s.type === this.swaps[iso]);
            }
            // Fallback to default DOW schedule
            return SCHEDULE.find(s => s.d === new Date().getDay());
        },

        get physiqueStatus() {
            const latest = this.scans[this.scans.length - 1] || this.baseline;
            if (latest.protrusion < 30) return "Priority: Protrusion (Building the Shelf)";
            return "Balanced Growth Mode";
        },

        // ===== STABILITY & PAIN LOGIC =====
        handleBackPain(level) {
            this.currentPainLevel = level;
            if (level > 3) {
                alert("Stability Mode Active: High-impact spine loading disabled.");
                // Automatically pivots today's session to Lower C (Stability)
                this.swaps[this.todayISO] = 'lower'; 
                this.save();
            }
        },

        // ===== THE PIVOT (For StretchLab/Schedule changes) =====
        pivotDay(targetType) {
            this.swaps[this.todayISO] = targetType;
            this.save();
            this.showSwapModal = false;
        },

        // ===== ZOZOFIT SYNC =====
        addZozoScan(round, prot, lift) {
            this.scans.push({
                date: this.todayISO,
                roundness: round,
                protrusion: prot,
                lift: lift
            });
            this.save();
        },

        // ... Persistence methods (load/save) remain same as original
    }
}
