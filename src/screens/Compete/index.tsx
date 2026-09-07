import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { colors, spacing, radius } from '@/constants/theme';

type Run = {
  id: string;
  created_at: string;
  time_seconds: number | string | null;
  notes: string | null;
};

export function CompeteScreen() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [runs, setRuns] = useState<Run[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [event_type, set_event_type] = useState('team_penning');
  const [member_1, set_member_1] = useState('');
  const [member_2, set_member_2] = useState('');
  const [member_3, set_member_3] = useState('');
  const [member_4, set_member_4] = useState('');
  const [time_seconds, set_time_seconds] = useState('');
  const [penalty_seconds, set_penalty_seconds] = useState('');
  const [points_earned, set_points_earned] = useState('');
  const [notes, set_notes] = useState('');

  const loadRuns = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('ranchrodeo_runs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    setRuns((data as Run[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadRuns();
  }, [loadRuns]);

  const resetForm = () => {
    set_event_type('team_penning');
    set_member_1('');
    set_member_2('');
    set_member_3('');
    set_member_4('');
    set_time_seconds('');
    set_penalty_seconds('');
    set_points_earned('');
    set_notes('');
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const payload = {
      user_id: user.id,
      event_type,
      member_1: member_1 || null,
      member_2: member_2 || null,
      member_3: member_3 || null,
      member_4: member_4 || null,
      time_seconds: time_seconds ? Number(time_seconds) : null,
      penalty_seconds: penalty_seconds ? Number(penalty_seconds) : null,
      points_earned: points_earned ? Number(points_earned) : null,
      notes: notes || null,
    };
    const { error } = await supabase.from('ranchrodeo_runs').insert(payload);
    setSaving(false);
    if (error) {
      Alert.alert('Could not save', error.message);
      return;
    }
    resetForm();
    setShowForm(false);
    loadRuns();
  };

  return (
    <ScrollView style={cs.container} contentContainerStyle={cs.content}>
      <View style={cs.headerRow}>
        <Text style={cs.title}>Practice log</Text>
        <TouchableOpacity style={cs.addBtn} onPress={() => setShowForm((v) => !v)}>
          <Text style={cs.addBtnText}>{showForm ? 'Close' : '+ Log run'}</Text>
        </TouchableOpacity>
      </View>
      <Text style={cs.sub}>
        Hand-timed ranch rodeo runs stay yours — they are structurally separated from official results and never reach a
        leaderboard.
      </Text>

      {showForm && (
        <View style={cs.form}>
        <View style={cs.field}>
          <Text style={cs.label}>Event</Text>
          <View style={cs.chips}>
            {(['team_penning', 'ranch_riding', 'ranch_roping', 'wild_cow_milking', 'branding', 'sorting'] as const).map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[cs.chip, event_type === opt && cs.chipActive]}
                onPress={() => set_event_type(opt)}
              >
                <Text style={[cs.chipText, event_type === opt && cs.chipTextActive]}>{opt.replace(/_/g, ' ')}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={cs.field}>
          <Text style={cs.label}>Member 1</Text>
          <TextInput
            style={cs.input}
            value={member_1}
            onChangeText={set_member_1}
            placeholder=""
            placeholderTextColor={colors.muted}
          />
        </View>
        <View style={cs.field}>
          <Text style={cs.label}>Member 2</Text>
          <TextInput
            style={cs.input}
            value={member_2}
            onChangeText={set_member_2}
            placeholder=""
            placeholderTextColor={colors.muted}
          />
        </View>
        <View style={cs.field}>
          <Text style={cs.label}>Member 3</Text>
          <TextInput
            style={cs.input}
            value={member_3}
            onChangeText={set_member_3}
            placeholder=""
            placeholderTextColor={colors.muted}
          />
        </View>
        <View style={cs.field}>
          <Text style={cs.label}>Member 4</Text>
          <TextInput
            style={cs.input}
            value={member_4}
            onChangeText={set_member_4}
            placeholder=""
            placeholderTextColor={colors.muted}
          />
        </View>
        <View style={cs.field}>
          <Text style={cs.label}>Time (s)</Text>
          <TextInput
            style={cs.input}
            value={time_seconds}
            onChangeText={set_time_seconds}
            keyboardType={'numeric'}
            placeholder="0"
            placeholderTextColor={colors.muted}
          />
        </View>
        <View style={cs.field}>
          <Text style={cs.label}>Penalty (s)</Text>
          <TextInput
            style={cs.input}
            value={penalty_seconds}
            onChangeText={set_penalty_seconds}
            keyboardType={'numeric'}
            placeholder="0"
            placeholderTextColor={colors.muted}
          />
        </View>
        <View style={cs.field}>
          <Text style={cs.label}>Points earned</Text>
          <TextInput
            style={cs.input}
            value={points_earned}
            onChangeText={set_points_earned}
            keyboardType={'number-pad'}
            placeholder="0"
            placeholderTextColor={colors.muted}
          />
        </View>
        <View style={cs.field}>
          <Text style={cs.label}>Notes</Text>
          <TextInput
            style={cs.input}
            value={notes}
            onChangeText={set_notes}
            placeholder=""
            placeholderTextColor={colors.muted}
            multiline
          />
        </View>
          <TouchableOpacity style={[cs.saveBtn, saving && cs.disabled]} onPress={handleSave} disabled={saving}>
            <Text style={cs.saveBtnText}>{saving ? 'Saving…' : 'Save run'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={cs.analyzeBtn} onPress={() => router.push('/analyze')}>
        <Text style={cs.analyzeBtnText}>⭐ Analyze a video</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 24 }} />
      ) : runs.length === 0 ? (
        <Text style={cs.empty}>Nothing logged yet. Log your first ranch rodeo run above.</Text>
      ) : (
        runs.map((run) => (
          <View key={run.id} style={cs.runCard}>
            <Text style={cs.runPrimary}>{String(run.time_seconds ?? '—')}</Text>
            <Text style={cs.runDate}>{new Date(run.created_at).toLocaleDateString()}</Text>
            {run.notes ? <Text style={cs.runNotes}>{run.notes}</Text> : null}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const cs = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.screenX, gap: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  sub: { fontSize: 13, color: colors.muted, lineHeight: 19 },
  addBtn: { backgroundColor: colors.accent, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 8 },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  form: { backgroundColor: colors.card, borderRadius: radius.card, padding: spacing.cardPad, gap: 14, borderWidth: 1, borderColor: colors.border },
  field: { gap: 6 },
  label: { fontSize: 14, color: colors.text, fontWeight: '600' },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.control, padding: 12, color: colors.text, fontSize: 15 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.muted, fontSize: 13 },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  saveBtn: { backgroundColor: colors.accent, borderRadius: radius.control, padding: 15, alignItems: 'center', marginTop: 4 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  disabled: { opacity: 0.6 },
  analyzeBtn: { borderWidth: 1, borderColor: colors.accent, borderRadius: radius.control, padding: 14, alignItems: 'center' },
  analyzeBtnText: { color: colors.accent, fontSize: 15, fontWeight: '600' },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 24, fontSize: 14 },
  runCard: { backgroundColor: colors.card, borderRadius: radius.card, padding: spacing.cardPad, gap: 4, borderWidth: 1, borderColor: colors.border },
  runPrimary: { fontSize: 18, fontWeight: '700', color: colors.text },
  runDate: { fontSize: 12, color: colors.muted },
  runNotes: { fontSize: 14, color: colors.muted, marginTop: 4 },
});
