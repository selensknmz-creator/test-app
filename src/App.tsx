/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform
} from 'react-native';
import { 
  Home, 
  User, 
  Settings, 
  Bell, 
  Search, 
  ChevronRight, 
  Smartphone, 
  Tablet, 
  Monitor,
  Battery,
  Wifi,
  Signal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Screen = 'Home' | 'Profile' | 'Settings' | 'Notifications';

// --- Components ---

const Header = ({ title }: { title: string }) => (
  <View style={styles.header}>
    <View style={styles.statusBar}>
      <Text style={styles.timeText}>9:41</Text>
      <View style={styles.statusIcons}>
        <Signal size={14} color="#000" style={{ marginRight: 4 }} />
        <Wifi size={14} color="#000" style={{ marginRight: 4 }} />
        <Battery size={14} color="#000" />
      </View>
    </View>
    <View style={styles.headerContent}>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity style={styles.iconButton}>
        <Search size={20} color="#000" />
      </TouchableOpacity>
    </View>
  </View>
);

const HomeScreen = () => (
  <ScrollView style={styles.screenContainer} showsVerticalScrollIndicator={false}>
    <View style={styles.welcomeSection}>
      <Text style={styles.welcomeText}>Welcome back,</Text>
      <Text style={styles.userName}>Sujoy</Text>
    </View>

    <View style={styles.cardRow}>
      <View style={[styles.card, { backgroundColor: '#E0F2FE' }]}>
        <Text style={styles.cardTitle}>Daily Steps</Text>
        <Text style={styles.cardValue}>8,432</Text>
        <Text style={styles.cardSub}>Goal: 10k</Text>
      </View>
      <View style={[styles.card, { backgroundColor: '#F0FDF4' }]}>
        <Text style={styles.cardTitle}>Calories</Text>
        <Text style={styles.cardValue}>1,240</Text>
        <Text style={styles.cardSub}>kcal</Text>
      </View>
    </View>

    <Text style={styles.sectionTitle}>Recent Activity</Text>
    {[1, 2, 3].map((i) => (
      <TouchableOpacity key={i} style={styles.listItem}>
        <View style={styles.listIconPlaceholder} />
        <View style={styles.listContent}>
          <Text style={styles.listTitle}>Activity {i}</Text>
          <Text style={styles.listSub}>2 hours ago</Text>
        </View>
        <ChevronRight size={20} color="#CBD5E1" />
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const ProfileScreen = () => (
  <View style={styles.screenContainer}>
    <View style={styles.profileHeader}>
      <View style={styles.avatarLarge} />
      <Text style={styles.profileName}>Sujoy Kumar</Text>
      <Text style={styles.profileEmail}>sujoyk211@gmail.com</Text>
    </View>
    <View style={styles.profileStats}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>24</Text>
        <Text style={styles.statLabel}>Posts</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>1.2k</Text>
        <Text style={styles.statLabel}>Followers</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>482</Text>
        <Text style={styles.statLabel}>Following</Text>
      </View>
    </View>
  </View>
);

const SettingsScreen = () => (
  <ScrollView style={styles.screenContainer}>
    <Text style={styles.sectionTitle}>General</Text>
    <TouchableOpacity style={styles.listItem}>
      <Text style={styles.listTitle}>Account Settings</Text>
      <ChevronRight size={20} color="#CBD5E1" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.listItem}>
      <Text style={styles.listTitle}>Privacy & Security</Text>
      <ChevronRight size={20} color="#CBD5E1" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.listItem}>
      <Text style={styles.listTitle}>Help & Support</Text>
      <ChevronRight size={20} color="#CBD5E1" />
    </TouchableOpacity>
  </ScrollView>
);

const NotificationsScreen = () => (
  <View style={styles.screenContainer}>
    <View style={styles.emptyState}>
      <Bell size={48} color="#E2E8F0" />
      <Text style={styles.emptyText}>No new notifications</Text>
    </View>
  </View>
);

// --- Main App ---

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('Home');
  const [deviceMode, setDeviceMode] = useState<'iOS' | 'Android'>('iOS');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Home': return <HomeScreen />;
      case 'Profile': return <ProfileScreen />;
      case 'Settings': return <SettingsScreen />;
      case 'Notifications': return <NotificationsScreen />;
      default: return <HomeScreen />;
    }
  };

  // Platform-specific animation variants
  const screenVariants = {
    iOS: {
      initial: { x: '100%', opacity: 1 },
      animate: { x: 0, opacity: 1 },
      exit: { x: '-30%', opacity: 0.9 },
      transition: { type: 'spring', damping: 25, stiffness: 200 } as any
    },
    Android: {
      initial: { opacity: 0, y: 20, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -10, scale: 1.02 },
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } as any
    }
  };

  const buttonVariants = {
    tap: { scale: 0.95, opacity: 0.8 },
    hover: { scale: 1.02 }
  };

  const currentVariant = screenVariants[deviceMode];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 md:p-8 font-sans">
      {/* Device Toggle */}
      <div className="mb-6 flex gap-2 bg-white p-1 rounded-full shadow-sm border border-slate-200">
        <button 
          onClick={() => setDeviceMode('iOS')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${deviceMode === 'iOS' ? 'bg-black text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          iOS Preview
        </button>
        <button 
          onClick={() => setDeviceMode('Android')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${deviceMode === 'Android' ? 'bg-black text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          Android Preview
        </button>
      </div>

      {/* Phone Frame */}
      <div className={`relative bg-white shadow-2xl overflow-hidden transition-all duration-700 ease-in-out ${deviceMode === 'iOS' ? 'rounded-[3.5rem] border-[12px] border-slate-900 w-[375px] h-[812px]' : 'rounded-3xl border-[6px] border-slate-800 w-[360px] h-[740px]'}`}>
        
        {/* Notch / Camera */}
        {deviceMode === 'iOS' ? (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-slate-900 rounded-b-3xl z-50 flex items-end justify-center pb-1">
            <div className="w-12 h-1 bg-slate-800 rounded-full opacity-50" />
          </div>
        ) : (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-800 rounded-full z-50 border-2 border-slate-700" />
        )}

        {/* App Content */}
        <SafeAreaView style={styles.container}>
          <Header title={activeScreen} />
          
          <View style={styles.content}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeScreen}
                initial={currentVariant.initial}
                animate={currentVariant.animate}
                exit={currentVariant.exit}
                transition={currentVariant.transition}
                className="h-full w-full"
              >
                {renderScreen()}
              </motion.div>
            </AnimatePresence>
          </View>

          {/* Bottom Navigation */}
          <View style={styles.tabBar}>
            {(['Home', 'Notifications', 'Profile', 'Settings'] as const).map((screen) => (
              <TouchableOpacity 
                key={screen}
                onPress={() => setActiveScreen(screen)}
                style={styles.tabItem}
                activeOpacity={0.7}
              >
                <motion.div
                  animate={{ 
                    scale: activeScreen === screen ? 1.1 : 1,
                    y: activeScreen === screen ? -2 : 0
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  {screen === 'Home' && <Home size={24} color={activeScreen === screen ? '#000' : '#94A3B8'} />}
                  {screen === 'Notifications' && <Bell size={24} color={activeScreen === screen ? '#000' : '#94A3B8'} />}
                  {screen === 'Profile' && <User size={24} color={activeScreen === screen ? '#000' : '#94A3B8'} />}
                  {screen === 'Settings' && <Settings size={24} color={activeScreen === screen ? '#000' : '#94A3B8'} />}
                </motion.div>
                <Text style={[styles.tabLabel, activeScreen === screen && styles.tabLabelActive]}>
                  {screen === 'Notifications' ? 'Alerts' : screen}
                </Text>
                {activeScreen === screen && deviceMode === 'Android' && (
                  <motion.div 
                    layoutId="tab-indicator"
                    className="absolute -top-1 w-8 h-1 bg-black rounded-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Home Indicator (iOS) */}
          {deviceMode === 'iOS' && (
            <div className="h-8 flex items-center justify-center bg-white">
              <motion.div 
                className="w-32 h-1.5 bg-slate-900 rounded-full"
                whileHover={{ scaleX: 1.1 }}
              />
            </div>
          )}
        </SafeAreaView>
      </div>

      {/* Info Panel */}
      <div className="mt-8 max-w-md text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Platform-Specific Motion</h2>
        <p className="text-slate-600 text-sm">
          {deviceMode === 'iOS' 
            ? "iOS uses a spring-based slide transition for a physical, elastic feel." 
            : "Android uses a Material-inspired fade and subtle scale-up transition."}
        </p>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: Platform.OS === 'web' ? 10 : 0,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 44,
  },
  timeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    letterSpacing: -0.5,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: '#64748B',
  },
  userName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardTitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  cardSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
    marginTop: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  listIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    marginRight: 12,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  listSub: {
    fontSize: 14,
    color: '#94A3B8',
  },
  tabBar: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingBottom: 8,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#000',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 100,
    alignSelf: 'center',
    marginBottom: 8,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748B',
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: '#94A3B8',
  }
});
