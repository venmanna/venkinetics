export const DEFAULT_EXERCISES = [
  // Chest
  { id: 'ex_bench_press', name: 'Barbell Bench Press', muscle: 'Chest', equipment: 'Barbell', type: 'reps-weight' },
  { id: 'ex_incline_db_press', name: 'Incline Dumbbell Press', muscle: 'Chest', equipment: 'Dumbbell', type: 'reps-weight' },
  { id: 'ex_dips', name: 'Chest Dips', muscle: 'Chest', equipment: 'Bodyweight', type: 'reps-weight' },
  { id: 'ex_cable_fly', name: 'Cable Chest Fly', muscle: 'Chest', equipment: 'Cable', type: 'reps-weight' },
  { id: 'ex_pushups', name: 'Push-Ups', muscle: 'Chest', equipment: 'Bodyweight', type: 'reps-only' },
  { id: 'ex_pec_deck', name: 'Pec Deck Machine', muscle: 'Chest', equipment: 'Machine', type: 'reps-weight' },

  // Back
  { id: 'ex_deadlift', name: 'Conventional Deadlift', muscle: 'Back', equipment: 'Barbell', type: 'reps-weight' },
  { id: 'ex_pullups', name: 'Pull-Ups / Chin-Ups', muscle: 'Back', equipment: 'Bodyweight', type: 'reps-weight' },
  { id: 'ex_lat_pulldown', name: 'Lat Pulldown', muscle: 'Back', equipment: 'Cable', type: 'reps-weight' },
  { id: 'ex_barbell_row', name: 'Barbell Bent Over Row', muscle: 'Back', equipment: 'Barbell', type: 'reps-weight' },
  { id: 'ex_seated_cable_row', name: 'Seated Cable Row', muscle: 'Back', equipment: 'Cable', type: 'reps-weight' },
  { id: 'ex_single_arm_db_row', name: 'Single-Arm Dumbbell Row', muscle: 'Back', equipment: 'Dumbbell', type: 'reps-weight' },
  { id: 'ex_face_pull', name: 'Cable Face Pull', muscle: 'Rear Delts', equipment: 'Cable', type: 'reps-weight' },

  // Legs - Quads & Glutes
  { id: 'ex_barbell_squat', name: 'Barbell Back Squat', muscle: 'Quads', equipment: 'Barbell', type: 'reps-weight' },
  { id: 'ex_front_squat', name: 'Barbell Front Squat', muscle: 'Quads', equipment: 'Barbell', type: 'reps-weight' },
  { id: 'ex_leg_press', name: 'Leg Press (45 Degree)', muscle: 'Quads', equipment: 'Machine', type: 'reps-weight' },
  { id: 'ex_bulgarian_split_squat', name: 'Bulgarian Split Squat', muscle: 'Quads', equipment: 'Dumbbell', type: 'reps-weight' },
  { id: 'ex_leg_extension', name: 'Leg Extension Machine', muscle: 'Quads', equipment: 'Machine', type: 'reps-weight' },
  { id: 'ex_walking_lunges', name: 'Walking Dumbbell Lunges', muscle: 'Quads', equipment: 'Dumbbell', type: 'reps-weight' },
  { id: 'ex_hip_thrust', name: 'Barbell Hip Thrust', muscle: 'Glutes', equipment: 'Barbell', type: 'reps-weight' },

  // Legs - Hamstrings & Calves
  { id: 'ex_romanian_deadlift', name: 'Romanian Deadlift (RDL)', muscle: 'Hamstrings', equipment: 'Barbell', type: 'reps-weight' },
  { id: 'ex_lying_leg_curl', name: 'Lying Hamstring Curl', muscle: 'Hamstrings', equipment: 'Machine', type: 'reps-weight' },
  { id: 'ex_seated_leg_curl', name: 'Seated Hamstring Curl', muscle: 'Hamstrings', equipment: 'Machine', type: 'reps-weight' },
  { id: 'ex_standing_calf_raise', name: 'Standing Calf Raise', muscle: 'Calves', equipment: 'Machine', type: 'reps-weight' },
  { id: 'ex_seated_calf_raise', name: 'Seated Calf Raise', muscle: 'Calves', equipment: 'Machine', type: 'reps-weight' },

  // Shoulders
  { id: 'ex_overhead_press', name: 'Overhead Barbell Press (OHP)', muscle: 'Shoulders', equipment: 'Barbell', type: 'reps-weight' },
  { id: 'ex_db_shoulder_press', name: 'Seated Dumbbell Shoulder Press', muscle: 'Shoulders', equipment: 'Dumbbell', type: 'reps-weight' },
  { id: 'ex_lateral_raise', name: 'Dumbbell Lateral Raise', muscle: 'Shoulders', equipment: 'Dumbbell', type: 'reps-weight' },
  { id: 'ex_cable_lateral_raise', name: 'Cable Lateral Raise', muscle: 'Shoulders', equipment: 'Cable', type: 'reps-weight' },
  { id: 'ex_rear_delt_fly', name: 'Reverse Pec Deck / Rear Delt Fly', muscle: 'Shoulders', equipment: 'Machine', type: 'reps-weight' },

  // Arms - Biceps & Triceps
  { id: 'ex_barbell_curl', name: 'Standing Barbell Bicep Curl', muscle: 'Biceps', equipment: 'Barbell', type: 'reps-weight' },
  { id: 'ex_incline_db_curl', name: 'Incline Dumbbell Curl', muscle: 'Biceps', equipment: 'Dumbbell', type: 'reps-weight' },
  { id: 'ex_hammer_curl', name: 'Dumbbell Hammer Curl', muscle: 'Biceps', equipment: 'Dumbbell', type: 'reps-weight' },
  { id: 'ex_preacher_curl', name: 'EZ-Bar Preacher Curl', muscle: 'Biceps', equipment: 'Barbell', type: 'reps-weight' },
  { id: 'ex_tricep_rope_pushdown', name: 'Tricep Rope Pushdown', muscle: 'Triceps', equipment: 'Cable', type: 'reps-weight' },
  { id: 'ex_skull_crushers', name: 'EZ-Bar Skull Crushers', muscle: 'Triceps', equipment: 'Barbell', type: 'reps-weight' },
  { id: 'ex_overhead_tricep_ext', name: 'Overhead Cable Tricep Extension', muscle: 'Triceps', equipment: 'Cable', type: 'reps-weight' },

  // Core & Abs
  { id: 'ex_hanging_leg_raise', name: 'Hanging Leg Raise', muscle: 'Core', equipment: 'Bodyweight', type: 'reps-only' },
  { id: 'ex_cable_woodchopper', name: 'Cable Woodchopper', muscle: 'Core', equipment: 'Cable', type: 'reps-weight' },
  { id: 'ex_ab_wheel_rollout', name: 'Ab Wheel Rollout', muscle: 'Core', equipment: 'Bodyweight', type: 'reps-only' },
  { id: 'ex_plank', name: 'Plank Hold', muscle: 'Core', equipment: 'Bodyweight', type: 'duration' },

  // Cardio
  { id: 'ex_treadmill_incline', name: 'Incline Treadmill Walk', muscle: 'Cardio', equipment: 'Machine', type: 'duration' },
  { id: 'ex_rowing_machine', name: 'Concept2 Rowing Machine', muscle: 'Cardio', equipment: 'Machine', type: 'duration' },
  { id: 'ex_stairmaster', name: 'StairMaster Climber', muscle: 'Cardio', equipment: 'Machine', type: 'duration' }
];

export const DEFAULT_ROUTINES = [
  {
    id: 'routine_push_a',
    name: 'Push Day (Chest, Shoulders, Triceps)',
    description: 'Hypertrophy focused upper body pressing routine',
    exercises: [
      { id: 'ex_bench_press', targetSets: 4, defaultReps: 8 },
      { id: 'ex_incline_db_press', targetSets: 3, defaultReps: 10 },
      { id: 'ex_overhead_press', targetSets: 3, defaultReps: 10 },
      { id: 'ex_lateral_raise', targetSets: 4, defaultReps: 15 },
      { id: 'ex_tricep_rope_pushdown', targetSets: 3, defaultReps: 12 }
    ]
  },
  {
    id: 'routine_pull_a',
    name: 'Pull Day (Back, Rear Delts, Biceps)',
    description: 'Back thickness, width and arm pulling power',
    exercises: [
      { id: 'ex_deadlift', targetSets: 3, defaultReps: 5 },
      { id: 'ex_pullups', targetSets: 3, defaultReps: 8 },
      { id: 'ex_barbell_row', targetSets: 3, defaultReps: 10 },
      { id: 'ex_face_pull', targetSets: 4, defaultReps: 15 },
      { id: 'ex_incline_db_curl', targetSets: 3, defaultReps: 12 },
      { id: 'ex_hammer_curl', targetSets: 3, defaultReps: 12 }
    ]
  },
  {
    id: 'routine_legs_a',
    name: 'Legs & Core (Quads, Hamstrings, Calves)',
    description: 'High intensity lower body foundation builder',
    exercises: [
      { id: 'ex_barbell_squat', targetSets: 4, defaultReps: 6 },
      { id: 'ex_romanian_deadlift', targetSets: 3, defaultReps: 10 },
      { id: 'ex_leg_press', targetSets: 3, defaultReps: 12 },
      { id: 'ex_lying_leg_curl', targetSets: 3, defaultReps: 12 },
      { id: 'ex_standing_calf_raise', targetSets: 4, defaultReps: 15 },
      { id: 'ex_hanging_leg_raise', targetSets: 3, defaultReps: 15 }
    ]
  },
  {
    id: 'routine_upper',
    name: 'Upper Body Power',
    description: 'Full upper torso development',
    exercises: [
      { id: 'ex_bench_press', targetSets: 4, defaultReps: 6 },
      { id: 'ex_lat_pulldown', targetSets: 4, defaultReps: 8 },
      { id: 'ex_db_shoulder_press', targetSets: 3, defaultReps: 10 },
      { id: 'ex_single_arm_db_row', targetSets: 3, defaultReps: 10 },
      { id: 'ex_barbell_curl', targetSets: 3, defaultReps: 12 },
      { id: 'ex_skull_crushers', targetSets: 3, defaultReps: 12 }
    ]
  },
  {
    id: 'routine_fullbody',
    name: 'Full Body Athlete',
    description: 'Total body strength and metabolic conditioning',
    exercises: [
      { id: 'ex_barbell_squat', targetSets: 3, defaultReps: 8 },
      { id: 'ex_bench_press', targetSets: 3, defaultReps: 8 },
      { id: 'ex_barbell_row', targetSets: 3, defaultReps: 8 },
      { id: 'ex_overhead_press', targetSets: 3, defaultReps: 10 },
      { id: 'ex_hanging_leg_raise', targetSets: 3, defaultReps: 12 }
    ]
  }
];
