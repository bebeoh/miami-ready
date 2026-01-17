const CONFIG = {
    STORE_KEY: 'miami-architect-v9',
    START_DATE: new Date(2026, 0, 11),
    END_DATE: new Date(2026, 2, 21),
};

const SCHEDULE = [
    { d: 0, type: 'tempo', label: 'Tempo + Scan' },
    { d: 1, type: 'lower_c', label: 'Lower C (Stability)' },
    { d: 2, type: 'upper', label: 'Upper Body' },
    { d: 3, type: 'lower_b', label: 'Lower B (Tie-in)' },
    { d: 4, type: 'tempo', label: 'Active Recovery' },
    { d: 5, type: 'lower_a', label: 'Lower A (Shelf)' },
    { d: 6, type: 'upper', label: 'Upper + Mobility' },
];

const EXERCISES = {
    'lower_a': {
        name: 'Shelf + Side (Protrusion Focus)',
        exercises: [
            { name: 'Barbell Hip Thrust', sets: '4×8', cue: 'Exhale, Tuck, Squeeze, HOLD.', video: 'LM8XHLYJoYs' },
            { name: 'Seated Band Abductions', sets: '3×20', cue: 'Lean forward for side-glute volume.', video: 'o7e6Jlj-hj8' }
        ]
    },
    'lower_b': {
        name: 'Under-Butt & Ham Tie-in',
        exercises: [
            { name: 'B-Stance RDL', sets: '3×10', cue: 'Push hips back like closing a door.', video: 'wp1r0s2Vdkk' },
            { name: 'Step Ups', sets: '3×12', cue: 'Drive through the heel.', video: '3VcKaXpzqRo' }
        ]
    },
    'lower_c': {
        name: 'Stability & Side-Glute',
        exercises: [
            { name: 'Clamshells (Wall Drive)', sets: '3×15', cue: 'Keep back flat against the wall.', video: 'rmNf1BgigDk' },
            { name: 'Suitcase Carry', sets: '3×30s', cue: 'Right back stays still/strong.', video: 'kqnua4rHVVA' }
        ]
    },
    'tempo': {
        name: 'Recovery / StretchLab',
        exercises: [{ name: 'StretchLab Session', sets: '30-50 min', cue: 'Focus: Hip Flexors & QL Release.', video: 'rmNf1BgigDk' }]
    },
    'upper': {
        name: 'Upper Body X-Frame',
        exercises: [{ name: 'Lateral Raises', sets: '4×15', cue: 'Shoulder width helps waist look smaller.', video: '3VcKaXpzqRo' }]
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
        activeWorkout: { name: '', exercises: [] },
        baseline: { roundness: 32, protrusion: 25, lift: 83 },

        init() {
            this.load();
        },

        get todayISO() {
            return new Date().toISOString().split('T')[0];
        },

        get currentDay() {
            const diff = new Date() - CONFIG.START_DATE;
            return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
        },

        get todaySchedule() {
            const iso = this.todayISO;
            const type = this.swaps[iso] || SCHEDULE.find(s => s.d === new Date().getDay()).type;
            return { ...SCHEDULE.find(s => s.type === type), type: type };
        },

        get latestScan() {
            return this.scans.length > 0 ? this.scans[this.scans.length - 1] : this.baseline;
        },

        get physiqueStatus() {
            return this.latestScan.protrusion < 30 ? "Priority: Protrusion (Shelf)" : "Growth Mode";
        },

        startWorkout() {
            const type = this.todaySchedule.type;
            this.activeWorkout = EXERCISES[type] || EXERCISES['tempo'];
            this.workoutMode = true;
        },

        handleBackPain(level) {
            this.currentPainLevel = level;
            if (level > 3) {
                this.pivotDay('lower_c');
                alert("Stability Mode: Switched to Spine-Sparing Lower C.");
            }
        },

        pivotDay(type) {
            this.swaps[this.todayISO] = type;
            this.showSwapModal = false;
            this.save();
        },

        save() {
            const data = { scans: this.scans, swaps: this.swaps, currentPainLevel: this.currentPainLevel };
            localStorage.setItem(CONFIG.STORE_KEY, JSON.stringify(data));
        },

        load() {
            const stored = localStorage.getItem(CONFIG.STORE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                this.scans = data.scans || [];
                this.swaps = data.swaps || {};
                this.currentPainLevel = data.currentPainLevel || 0;
            }
        }
    }
}
