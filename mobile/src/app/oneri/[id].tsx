import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/badge';
import { Card } from '@/components/card';
import { Notice } from '@/components/notice';
import {
  type Confidence,
  mockCostRates,
  mockExpectedBenefitTL,
  mockPortfolio,
  mockRecommendation,
} from '@/data/mock';
import { colors, radius, spacing, typography } from '@/theme';
import { calcCost, calcTrades } from '@/utils/cost';
import { formatTL } from '@/utils/format';

const CONFIDENCE_VARIANT: Record<Confidence, 'positive' | 'warning' | 'negative'> = {
  Yüksek: 'positive',
  Orta: 'warning',
  Düşük: 'negative',
};

// FR-068: her ajana bir renk
const AGENT_COLORS: Record<string, string> = {
  Trend: colors.accent.default,
  Makro: colors.primary.default,
  Haber: colors.warning.text,
  Risk: colors.negative.text,
};

const MAX_WEIGHT = 40; // FR-053: tek varlık en fazla %40

// Öneri detayı. [id] = hangi öneri? (bugünkü ya da geçmişteki herhangi biri)
export default function RecommendationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const r = mockRecommendation; // ileride: id ile backend'den çekilecek

  // FR-053 kontrolü: toplam 100 mü, en büyük ağırlık 40'ı aşıyor mu?
  const total = r.weights.reduce((sum, w) => sum + w.to, 0);
  const maxWeight = Math.max(...r.weights.map((w) => w.to));

  // FR-060: maliyet ve "değer mi?"
  const trades = calcTrades(r.weights, mockPortfolio.totalValue);
  const cost = calcCost(trades, mockCostRates);
  const worthIt = mockExpectedBenefitTL > cost.total;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* ── A) ÖZET ───────────────────────────────── */}
      <View style={styles.rowBetween}>
        <Text style={styles.caption}>
          {r.date} · Model {r.modelVersion} · #{id}
        </Text>
        <Badge label={`Güven: ${r.confidence}`} variant={CONFIDENCE_VARIANT[r.confidence]} />
      </View>
      {r.confidence === 'Düşük' && <Notice variant="warning" message="Model bu öneride kararsız." />}

      {/* ── B) ÖNERİLEN DAĞILIM (FR-053, FR-056) ──── */}
      <Card>
        <Text style={styles.h2}>Önerilen dağılım</Text>

        {/* tablo başlığı */}
        <View style={styles.tableRow}>
          <Text style={[styles.caption, styles.colAsset]}>Varlık</Text>
          <Text style={[styles.caption, styles.colNum]}>Dün</Text>
          <Text style={[styles.caption, styles.colNum]}>Bugün</Text>
          <Text style={[styles.caption, styles.colArrow]} />
        </View>

        {r.weights.map((w) => {
          const diff = w.to - w.from;
          const arrow = diff > 0 ? '▲' : diff < 0 ? '▼' : '–';
          const arrowColor =
            diff > 0 ? colors.positive.text : diff < 0 ? colors.negative.text : colors.text.secondary;
          return (
            <View key={w.asset} style={styles.tableRow}>
              <Text style={[styles.body, styles.colAsset]} numberOfLines={1}>
                {w.asset}
              </Text>
              <Text style={[styles.bodySecondary, styles.colNum]}>%{w.from}</Text>
              <Text style={[styles.bodyMedium, styles.colNum]}>%{w.to}</Text>
              <Text style={[styles.bodyMedium, styles.colArrow, { color: arrowColor }]}>{arrow}</Text>
            </View>
          );
        })}

        <View style={styles.divider} />
        <Text style={styles.caption}>
          Toplam %{total} · En yüksek ağırlık %{maxWeight} (sınır %{MAX_WEIGHT})
        </Text>
      </Card>

      {/* ── C) NEDEN? (FR-057, FR-068) ───────────── */}
      <Card>
        <Text style={styles.h2}>Neden?</Text>
        <Text style={styles.body}>{r.explanation}</Text>

        <Text style={[styles.caption, { marginTop: spacing.sm }]}>Karara katkı</Text>
        {r.contributions.map((c) => (
          <View key={c.agent} style={styles.contribRow}>
            <Text style={[styles.body, styles.contribLabel]}>{c.agent}</Text>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${c.pct}%`, backgroundColor: AGENT_COLORS[c.agent] }]} />
            </View>
            <Text style={[styles.bodyMedium, styles.colNum]}>%{c.pct}</Text>
          </View>
        ))}
      </Card>

      {/* ── D) ISI HARİTASI (FR-058) ──────────────── */}
      <Card>
        <Text style={styles.h2}>Varlıklar arası ilişki</Text>
        <Text style={styles.caption}>
          Model bir varlığa karar verirken diğerlerine ne kadar baktı? Koyu = güçlü ilişki.
        </Text>

        {/* üst başlık satırı */}
        <View style={styles.heatRow}>
          <View style={styles.heatLabel} />
          {r.attention.labels.map((l) => (
            <Text key={l} style={[styles.heatHead, styles.heatCell]} numberOfLines={1}>
              {l}
            </Text>
          ))}
        </View>

        {r.attention.matrix.map((row, i) => (
          <View key={r.attention.labels[i]} style={styles.heatRow}>
            <Text style={[styles.caption, styles.heatLabel]} numberOfLines={1}>
              {r.attention.labels[i]}
            </Text>
            {row.map((v, j) => (
              <View
                key={j}
                style={[styles.heatCell, styles.heatBox, { backgroundColor: colors.accent.default, opacity: 0.1 + v * 1.6 }]}
              />
            ))}
          </View>
        ))}
      </Card>

      {/* ── E) MALİYET (FR-060) ───────────────────── */}
      <Card>
        <Text style={styles.h2}>Bu değişikliğe değer mi?</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.body}>Tahmini işlem maliyeti</Text>
          <Text style={styles.bodyMedium}>{formatTL(cost.total)}</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.body}>Modelin beklediği fayda</Text>
          <Text style={styles.bodyMedium}>{formatTL(mockExpectedBenefitTL)}</Text>
        </View>
        {!worthIt && <Notice variant="warning" message="Değişiklik yapmak maliyetli olabilir." />}
      </Card>

      <Pressable
        style={styles.button}
        onPress={() => router.push({ pathname: '/onay/[id]', params: { id: r.id } })}
      >
        <Text style={styles.buttonText}>Öneriyi uygula</Text>
      </Pressable>

      <Text style={styles.footer}>Bu uygulama bir simülatördür; yatırım tavsiyesi değildir.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background.screen },
  content: { padding: spacing.md, gap: spacing.md },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.xs },
  colAsset: { flex: 1 },
  colNum: { width: 56, textAlign: 'right', fontVariant: ['tabular-nums'] },
  colArrow: { width: 28, textAlign: 'right' },
  divider: { height: 1, backgroundColor: colors.text.secondary, opacity: 0.2 },

  contribRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  contribLabel: { width: 56 },
  track: { flex: 1, height: 8, borderRadius: radius.full, backgroundColor: colors.background.screen, overflow: 'hidden' },
  fill: { height: '100%' },

  heatRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heatLabel: { width: 64 },
  heatCell: { flex: 1 },
  heatHead: { ...typography.caption, fontSize: 11, color: colors.text.secondary, textAlign: 'center' },
  heatBox: { aspectRatio: 1, borderRadius: 4 },

  button: {
    backgroundColor: colors.primary.default,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonText: { ...typography.bodyMedium, color: colors.text.inverse },
  footer: { ...typography.caption, color: colors.text.secondary, textAlign: 'center' },

  h2: { ...typography.h2, color: colors.text.primary },
  body: { ...typography.body, color: colors.text.primary },
  bodySecondary: { ...typography.body, color: colors.text.secondary },
  bodyMedium: { ...typography.bodyMedium, color: colors.text.primary },
  caption: { ...typography.caption, color: colors.text.secondary },
});