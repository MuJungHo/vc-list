import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, VirtualizedList, StyleSheet, Text, StatusBar } from 'react-native';


const Item = ({ name }) => (
  <View style={styles.item}>
    <Text style={styles.name}>{name}</Text>
  </View>
);

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [dataSource, setData] = useState([]);
  const [market, setMarket] = useState('usd');
  const getItem = (data, index) => ({ ...dataSource[index] })
  const getItemCount = (data) => 20;
  useEffect(() => {
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${market}`)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [market]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, padding: 24 }}>
        {isLoading ? <Text>Loading...</Text> :
          (<VirtualizedList
            data={dataSource}
            initialNumToRender={4}
            renderItem={({ item }) => <Item name={item.name} />}
            keyExtractor={item => item.id}
            getItemCount={getItemCount}
            getItem={getItem}
          />)}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  item: {
    backgroundColor: '#f9c2ff',
    height: 150,
    justifyContent: 'center',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 20,
  },
  name: {
    fontSize: 32,
  },
});

export default App;