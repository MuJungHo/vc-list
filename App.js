import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, VirtualizedList, StyleSheet, Text, StatusBar, FlatList } from 'react-native';


const Item = ({ name }) => (
  <View style={styles.item}>
    <Text style={styles.name}>{name}</Text>
  </View>
);

const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const [market, setMarket] = useState('usd');

  useEffect(() => {
    setLoading(true)
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${market}&per_page=5&page=${page}`)
      .then((response) => response.json())
      .then((json) => {
        setDataSource(dataSource.concat(json))
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [market, page]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, padding: 24 }}>
        <FlatList
          style={{ flex: 1 }}
          extraData={dataSource}
          onEndReached={() => setPage(page + 1)}
          onEndReachedThreshold={0.01}
          data={dataSource}
          renderItem={({ item }) => <Item name={item.name} />}
          keyExtractor={item => item.id}
        />
        {isLoading && <Text>Loading...</Text>}
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