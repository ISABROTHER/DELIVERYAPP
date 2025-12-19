// Inside TabLayout function in app/(tabs)/_layout.tsx

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: GREEN,
        tabBarInactiveTintColor: INACTIVE,
      }}
      tabBar={(props) => {
        // HIDE TAB BAR ON SEND SCREEN
        const { state } = props;
        const currentRoute = state.routes[state.index].name;
        if (currentRoute === 'send') return null; 
        
        return <ModernTabBar {...props} />;
      }}
    >
      {/* ... rest of screen definitions ... */}
    </Tabs>
  );
}