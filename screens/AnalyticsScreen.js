import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

const AnalyticsScreen = ({ navigation }) => {
  const { currentUser, challengesList, friendsList, theme, isDarkMode } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('engagement');

  // Mock analytics data (in real app, this would come from backend)
  const analyticsData = {
    userGrowth: {
      '7d': { users: 1247, growth: 12.5, newUsers: 156 },
      '30d': { users: 4892, growth: 28.3, newUsers: 1089 },
      '90d': { users: 12456, growth: 45.7, newUsers: 3924 },
    },
    engagement: {
      '7d': { sessions: 8934, avgDuration: '12m 34s', retention: 78.5 },
      '30d': { sessions: 34567, avgDuration: '15m 42s', retention: 82.1 },
      '90d': { sessions: 98234, avgDuration: '18m 15s', retention: 85.3 },
    },
    challenges: {
      '7d': { completed: 2341, success_rate: 73.2, avg_time: '4.2h' },
      '30d': { completed: 9876, success_rate: 76.8, avg_time: '3.8h' },
      '90d': { completed: 28934, success_rate: 79.4, avg_time: '3.5h' },
    },
    revenue: {
      '7d': { total: 12450, premium: 234, conversion: 4.2 },
      '30d': { total: 48920, premium: 892, conversion: 5.8 },
      '90d': { total: 142380, premium: 2456, conversion: 7.3 },
    },
  };

  const periods = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
  ];

  const metrics = [
    { id: 'engagement', label: 'Engagement', icon: 'pulse' },
    { id: 'challenges', label: 'Challenges', icon: 'flash' },
    { id: 'revenue', label: 'Revenue', icon: 'trending-up' },
  ];

  const getCurrentData = () => {
    return analyticsData[selectedMetric][selectedPeriod];
  };

  const getTopChallenges = () => [
    { name: 'Creative Video Storytelling', completions: 1234, success_rate: 89.2, category: 'Video Production' },
    { name: 'Sustainable Living Challenge', completions: 987, success_rate: 76.5, category: 'Sustainability' },
    { name: 'Tech Innovation Sprint', completions: 756, success_rate: 82.1, category: 'Technology' },
    { name: 'Fitness Transformation', completions: 654, success_rate: 71.8, category: 'Health & Fitness' },
    { name: 'Culinary Mastery', completions: 543, success_rate: 85.3, category: 'Culinary Arts' },
  ];

  const getRevenueProjections = () => [
    { month: 'Jan', projected: 45000, actual: 42300 },
    { month: 'Feb', projected: 52000, actual: 48900 },
    { month: 'Mar', projected: 58000, actual: 55200 },
    { month: 'Apr', projected: 65000, actual: 62100 },
    { month: 'May', projected: 72000, actual: 69800 },
    { month: 'Jun', projected: 80000, actual: null },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Analytics Dashboard</Text>
        <TouchableOpacity>
          <Ionicons name="download" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
        alwaysBounceVertical={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                { backgroundColor: theme.colors.surface },
                selectedPeriod === period.id && { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text
                style={[
                  styles.periodText,
                  { color: theme.colors.text },
                  selectedPeriod === period.id && { color: 'white' },
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Key Metrics Cards */}
        <View style={styles.metricsGrid}>
          <LinearGradient
            colors={['#3b82f6', '#1d4ed8']}
            style={styles.metricCard}
          >
            <View style={styles.metricHeader}>
              <Ionicons name="people" size={24} color="white" />
              <Text style={styles.metricTitle}>Total Users</Text>
            </View>
            <Text style={styles.metricValue}>{analyticsData.userGrowth[selectedPeriod].users.toLocaleString()}</Text>
            <View style={styles.metricChange}>
              <Ionicons name="trending-up" size={16} color="white" />
              <Text style={styles.changeText}>+{analyticsData.userGrowth[selectedPeriod].growth}%</Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.metricCard}
          >
            <View style={styles.metricHeader}>
              <Ionicons name="flash" size={24} color="white" />
              <Text style={styles.metricTitle}>Challenges Completed</Text>
            </View>
            <Text style={styles.metricValue}>{analyticsData.challenges[selectedPeriod].completed.toLocaleString()}</Text>
            <View style={styles.metricChange}>
              <Ionicons name="checkmark-circle" size={16} color="white" />
              <Text style={styles.changeText}>{analyticsData.challenges[selectedPeriod].success_rate}% Success</Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={['#f59e0b', '#d97706']}
            style={styles.metricCard}
          >
            <View style={styles.metricHeader}>
              <Ionicons name="cash" size={24} color="white" />
              <Text style={styles.metricTitle}>Revenue</Text>
            </View>
            <Text style={styles.metricValue}>${analyticsData.revenue[selectedPeriod].total.toLocaleString()}</Text>
            <View style={styles.metricChange}>
              <Ionicons name="trending-up" size={16} color="white" />
              <Text style={styles.changeText}>{analyticsData.revenue[selectedPeriod].conversion}% Conversion</Text>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={['#8b5cf6', '#7c3aed']}
            style={styles.metricCard}
          >
            <View style={styles.metricHeader}>
              <Ionicons name="time" size={24} color="white" />
              <Text style={styles.metricTitle}>Avg Session</Text>
            </View>
            <Text style={styles.metricValue}>{analyticsData.engagement[selectedPeriod].avgDuration}</Text>
            <View style={styles.metricChange}>
              <Ionicons name="heart" size={16} color="white" />
              <Text style={styles.changeText}>{analyticsData.engagement[selectedPeriod].retention}% Retention</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Top Performing Challenges */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Top Performing Challenges</Text>
          {getTopChallenges().map((challenge, index) => (
            <View key={index} style={[styles.challengeItem, { borderBottomColor: theme.colors.border }]}>
              <View style={styles.challengeRank}>
                <Text style={[styles.rankNumber, { color: theme.colors.primary }]}>#{index + 1}</Text>
              </View>
              <View style={styles.challengeInfo}>
                <Text style={[styles.challengeName, { color: theme.colors.text }]}>{challenge.name}</Text>
                <Text style={[styles.challengeCategory, { color: theme.colors.textSecondary }]}>{challenge.category}</Text>
              </View>
              <View style={styles.challengeStats}>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>{challenge.completions}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Completions</Text>
              </View>
              <View style={styles.challengeStats}>
                <Text style={[styles.statValue, { color: theme.colors.success }]}>{challenge.success_rate}%</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Success</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Revenue Projections */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Revenue Projections</Text>
          <View style={styles.chartContainer}>
            {getRevenueProjections().map((data, index) => (
              <View key={index} style={styles.chartBar}>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.projectedBar,
                      { height: (data.projected / 80000) * 100, backgroundColor: theme.colors.border }
                    ]}
                  />
                  {data.actual && (
                    <View
                      style={[
                        styles.actualBar,
                        { height: (data.actual / 80000) * 100, backgroundColor: theme.colors.primary }
                      ]}
                    />
                  )}
                </View>
                <Text style={[styles.chartLabel, { color: theme.colors.textSecondary }]}>{data.month}</Text>
              </View>
            ))}
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.colors.border }]} />
              <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>Projected</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.colors.primary }]} />
              <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>Actual</Text>
            </View>
          </View>
        </View>

        {/* Business Insights */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Business Insights</Text>
          <View style={styles.insightsList}>
            <View style={styles.insightItem}>
              <Ionicons name="trending-up" size={20} color={theme.colors.success} />
              <Text style={[styles.insightText, { color: theme.colors.text }]}>
                User engagement increased by 23% this month
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Ionicons name="flash" size={20} color={theme.colors.warning} />
              <Text style={[styles.insightText, { color: theme.colors.text }]}>
                Video Production challenges have highest completion rates
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Ionicons name="cash" size={20} color={theme.colors.primary} />
              <Text style={[styles.insightText, { color: theme.colors.text }]}>
                Premium conversion rate is 15% above industry average
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Ionicons name="people" size={20} color={theme.colors.secondary} />
              <Text style={[styles.insightText, { color: theme.colors.text }]}>
                Social features drive 40% more user retention
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 8,
    opacity: 0.9,
  },
  metricValue: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    opacity: 0.9,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  challengeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  challengeRank: {
    width: 40,
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  challengeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  challengeName: {
    fontSize: 14,
    fontWeight: '500',
  },
  challengeCategory: {
    fontSize: 12,
    marginTop: 2,
  },
  challengeStats: {
    alignItems: 'center',
    marginLeft: 12,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    marginBottom: 16,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    width: 20,
    height: 100,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  projectedBar: {
    width: '100%',
    borderRadius: 2,
    position: 'absolute',
    bottom: 0,
  },
  actualBar: {
    width: '100%',
    borderRadius: 2,
    position: 'absolute',
    bottom: 0,
  },
  chartLabel: {
    fontSize: 10,
    marginTop: 8,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  },
  insightsList: {
    gap: 12,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
  },
});

export default AnalyticsScreen;
