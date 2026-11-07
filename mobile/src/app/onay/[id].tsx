import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { Notice } from '@/components/notice';
import { mockCostRates, mockNextTradingDay, mockPortfolio, mockRecommendation } from '@/data/mock';
import { colors, radius, spacing, typography } from '@/theme';
import { calcCost, calcTrades } from '@/utils/cost';
import { formatTL } from '@/utils/format';

// FR-033: uygulamadan önce onay ekranı. FR-034: İptal → hiçbir şey değişmez. FR-035: t+1.
export default function ConfirmScreen() {
  const r = mockRecommendation;
  const trades = calcTrades(r.weights, mockPortfolio.totalValue);
  const cost = calcCost(trades, mockCostRates);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.h1}>Öneriyi onayla</Text>
      <Text style={styles.caption}>
        {mockPortfolio.name} · {mockPortfolio.type}
      </Text>

      {/* 1) Değişen ağırlıklar ve tutarlar */}
      <Card>
        <Text style={styles.h2}>Yapılacak işlemler</Text>
        {trades.map((t) => {
          const buy = t.amountTL > 0;
          return (
            <View key={t.asset} style={styles.rowBetween}>
              <View>
                <Text style={styles.bodyMedium}>{t.asset}</Text>
                <Text style={styles.caption}>
                  %{t.from} → %{t.to}
                </Text>
              </View>
              <Text style={[styles.bodyMedium, { color: buy ? colors.positive.text : colors.negative.text }]}>
                {buy ? 'Al' : 'Sat'} {formatTL(Math.abs(t.amountTL))}
              </Text>
            </View>
          );
        })}
      </Card>

      {/* 2) Maliyet özeti */}
      <Card>
        <Text style={styles.h2}>Tahmini maliyet</Text>
        <View style={styles.rowBetween}>
          <Text style={styles.body}>Komisyon (binde {mockCostRates.commission * 1000})</Text>
          <Text style={styles.body}>{formatTL(cost.commission)}</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.body}>Kayma (binde {mockCostRates.slippage * 1000})</Text>
          <Text style={styles.body}>{formatTL(cost.slippage)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.rowBetween}>
          <Text style={styles.bodyMedium}>Toplam</Text>
          <Text style={styles.bodyMedium}>{formatTL(cost.total)}</Text>
        </View>
      </Card>

      {/* 3) t+1 kuralı */}
      <Notice
        variant="info"
        message={`İşlem, bir sonraki işlem gününün (${mockNextTradingDay}) açılış fiyatıyla gerçekleşir.`}
      />

      {/* 4) Butonlar */}
      <View style={styles.buttons}>
        <Pressable style={[styles.button, styles.secondary]} onPress={() => router.back()}>
          <Text style={[styles.buttonText, { color: colors.text.primary }]}>İptal</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.primary]} onPress={() => router.dismissAll()}>
          <Text style={[styles.buttonText, { color: colors.text.inverse }]}>Onayla</Text>
        </Pressable>
      </View>

      <Text style={styles.footer}>Bu uygulama bir simülatördür; yatırım tavsiyesi değildir.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background.screen },
  content: { padding: spacing.md, gap: spacing.md },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  divider: { height: 1, backgroundColor: colors.text.secondary, opacity: 0.2 },

  buttons: { flexDirection: 'row', gap: spacing.sm },
  button: { flex: 1, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center' },
  primary: { backgroundColor: colors.primary.default },
  secondary: { borderWidth: 1, borderColor: colors.text.secondary },
  buttonText: { ...typography.bodyMedium },
  footer: { ...typography.caption, color: colors.text.secondary, textAlign: 'center' },

  h1: { ...typography.h1, color: colors.text.primary },
  h2: { ...typography.h2, color: colors.text.primary },
  body: { ...typography.body, color: colors.text.primary },
  bodyMedium: { ...typography.bodyMedium, color: colors.text.primary },
  caption: { ...typography.caption, color: colors.text.secondary },
});