import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Badge } from '@/components/badge';
import { Card } from '@/components/card';
import { Notice } from '@/components/notice';
import {
  type Confidence,
  mockCrisisAlert,
  mockDataStatus,
  mockFavorites,
  mockPortfolio,
  mockRecommendation,
  mockUnreadNotifications,
  mockUser,
} from '@/data/mock';
import { colors, radius, spacing, typography } from '@/theme';
import { formatPct, formatTL } from '@/utils/format';

// Dağılım çubuğu: her varlık sınıfına bir renk (sırayla)
const ALLOCATION_COLORS = [
  colors.accent.default,
  colors.primary.default,
  colors.warning.text,
  colors.positive.text,
];

// FR-054: güven seviyesi → rozet rengi
const CONFIDENCE_VARIANT: Record<Confidence, 'positive' | 'warning' | 'negative'> = {
  Yüksek: 'positive',
  Orta: 'warning',
  Düşük: 'negative',
};

export default function HomeScreen() {
  const p = mockPortfolio;
  const isUp = p.dailyChange >= 0;
const r = mockRecommendation;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ── 1) ÜST KISIM ───────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.h1}>Merhaba, {mockUser.firstName}</Text>
            <View style={styles.row}>
              <Text style={styles.caption}>{p.name} ▾</Text>
              <Badge label={p.type} variant="info" />
            </View>
          </View>

          <Pressable style={styles.bell} hitSlop={8}>
            <Ionicons name="notifications-outline" size={26} color={colors.text.primary} />
            {mockUnreadNotifications > 0 && (
              <View style={styles.bellCount}>
                <Text style={styles.bellCountText}>{mockUnreadNotifications}</Text>
              </View>
            )}
          </Pressable>
        </View>
        {/* ── UYARILAR (sadece gerekirse görünür) ────── */}
                {mockCrisisAlert.active && (
          <Notice
            variant="danger"
            message={mockCrisisAlert.message}
            actionLabel="İncele"
            onAction={() => {}}
          />
        )}
        {mockDataStatus.isStale && (
          <Notice variant="warning" message="Veriler güncel değil. Son başarılı güncelleme gösteriliyor." />
        )}
        {!mockUser.riskTestCompleted && (
          <Notice
            variant="info"
            message={`Risk testini henüz çözmedin. Şu an "${mockUser.riskProfile}" profil kullanılıyor.`}
            actionLabel="Çöz"
            onAction={() => {}}
          />
        )}
        {/* ── 2) PORTFÖY DEĞERİ ──────────────────────── */}
        <Card>
          <Text style={styles.caption}>Portföy değeri</Text>
          <Text style={styles.displayNumber}>{formatTL(p.totalValue)}</Text>
          <Badge
            variant={isUp ? 'positive' : 'negative'}
            label={`${isUp ? '▲' : '▼'} ${formatTL(Math.abs(p.dailyChange))} (${formatPct(p.dailyChangePct)}) bugün`}
          />
        </Card>
        
        {/* ── 3) GÜNÜN ÖNERİSİ ──────────────────────── */}
        <Card>
          <View style={styles.rowBetween}>
            <Text style={styles.h2}>Günün önerisi</Text>
            <Badge label={`Güven: ${r.confidence}`} variant={CONFIDENCE_VARIANT[r.confidence]} />
          </View>

          {r.confidence === 'Düşük' && (
            <Notice variant="warning" message="Model bu öneride kararsız." />
          )}

          {r.changes.map((c) => {
            const up = c.to > c.from;
            return (
              <View key={c.asset} style={styles.rowBetween}>
                <Text style={styles.body}>
                  <Text style={{ color: up ? colors.positive.text : colors.negative.text }}>
                    {up ? '▲' : '▼'}
                  </Text>{' '}
                  {c.asset}
                </Text>
                <Text style={styles.bodyMedium}>
                  %{c.from} → %{c.to}
                </Text>
              </View>
            );
          })}

          <Text style={styles.caption}>{r.explanation}</Text>

          <Pressable style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Detayı gör</Text>
          </Pressable>
        </Card>
        
        {/* ── 4) DAĞILIM ─────────────────────────────── */}
        <Card>
          <Text style={styles.h2}>Dağılım</Text>
          <View style={styles.bar}>
            {p.allocation.map((a, i) => (
              <View key={a.label} style={{ flex: a.pct, backgroundColor: ALLOCATION_COLORS[i] }} />
            ))}
          </View>
          {p.allocation.map((a, i) => (
            <View key={a.label} style={styles.rowBetween}>
              <View style={styles.row}>
                <View style={[styles.dot, { backgroundColor: ALLOCATION_COLORS[i] }]} />
                <Text style={styles.body}>{a.label}</Text>
              </View>
              <Text style={styles.bodyMedium}>%{a.pct}</Text>
            </View>
          ))}
        </Card>

        {/* ── 5) FAVORİLER (FR-048) ─────────────────── */}
        <Card>
          <Text style={styles.h2}>Favoriler</Text>
          {mockFavorites.map((f) => {
            const up = f.changePct >= 0;
            return (
              <View key={f.asset} style={styles.rowBetween}>
                <Text style={styles.body}>{f.asset}</Text>
                <View style={styles.row}>
                  <Text style={styles.bodyMedium}>{formatTL(f.price)}</Text>
                  <Badge
                    variant={up ? 'positive' : 'negative'}
                    label={`${up ? '▲' : '▼'} ${formatPct(Math.abs(f.changePct))}`}
                  />
                </View>
              </View>
            );
          })}
        </Card>
        {/* ── 6) ALT BİLGİ: FR-091 + NFR-058 ─────────── */}
        <Text style={styles.footer}>
          Son güncelleme: {mockDataStatus.updatedAt} · Kaynak: {mockDataStatus.source}
          {'\n'}Bu uygulama bir simülatördür; yatırım tavsiyesi değildir.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background.screen },
  content: { padding: spacing.md, gap: spacing.md },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerText: { gap: spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },

  bell: { padding: spacing.xs },
  bellCount: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: radius.full,
    backgroundColor: colors.negative.icon,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  bellCountText: { color: colors.text.inverse, fontSize: 11, fontWeight: '700' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  button: {
    backgroundColor: colors.primary.default,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + spacing.xs,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  buttonText: { ...typography.bodyMedium, color: colors.text.inverse },
    bar: { flexDirection: 'row', height: 12, borderRadius: radius.full, overflow: 'hidden' },
  dot: { width: 10, height: 10, borderRadius: radius.full },
  footer: { ...typography.caption, color: colors.text.secondary, textAlign: 'center' },
  h1: { ...typography.h1, color: colors.text.primary },
  caption: { ...typography.caption, color: colors.text.secondary },
    h2: { ...typography.h2, color: colors.text.primary },
  body: { ...typography.body, color: colors.text.primary },
  bodyMedium: { ...typography.bodyMedium, color: colors.text.primary },
  displayNumber: { ...typography.displayNumber, color: colors.text.primary },
});