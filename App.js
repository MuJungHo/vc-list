import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Image, StyleSheet, Text, StatusBar, FlatList } from 'react-native';
import { Menu, MenuItem } from 'react-native-material-menu';


const Item = ({ item }) => (
  <View style={styles.item}>
    <Text style={styles.name}>{item.name}</Text>
    <Text style={styles.name}>{item.current_price}</Text>
    <Text style={styles.name}>{item.total_volume}</Text>
    <Image style={{ width: 25, height: 25 }} source={{ uri: item.image }} />
  </View>
);
const App = () => {
  const [isLoading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [filter, setFilter] = useState({
    page: 1,
    order: 'market_cap_desc',
    market: 'usd'
  })

  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  const handlePress = order => {
    setFilter({
      ...filter,
      page: 1,
      order
    })
    hideMenu()
  }

  const filterOptions = [
    { name: '即時幣價', onPress: () => handlePress('market_cap_asc'), asc: true },
    { name: '即時幣價', onPress: () => handlePress('market_cap_desc'), asc: false },
    { name: '即時交易量', onPress: () => handlePress('volume_asc'), asc: true },
    { name: '即時交易量', onPress: () => handlePress('volume_desc'), asc: false },
    { name: '貨幣名稱', onPress: () => handlePress('id_asc'), asc: true },
    { name: '貨幣名稱', onPress: () => handlePress('id_desc'), asc: false },
  ]

  const ascIcon = require('./assets/arrow-up.png');
  const descIcon = require('./assets/arrow-down.png');

  useEffect(() => {
    setLoading(true)
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${filter.market}&per_page=5&page=${filter.page}&order=${filter.order}`)
      .then((response) => response.json())
      .then((json) => {
        if (filter.page === 1) {
          setDataSource(json)
        } else {
          setDataSource(dataSource.concat(json))
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, padding: 24 }}>
        <Menu
          visible={visible}
          anchor={<Text onPress={showMenu}>{{
            'market_cap_asc': '即時幣價 ↑',
            'market_cap_desc': '即時幣價 ↓',
            'volume_asc': '即時交易量 ↑',
            'volume_desc': '即時交易量 ↓',
            'id_asc': '貨幣名稱 ↑',
            'id_desc': '貨幣名稱 ↓',
          }[filter.order]}</Text>}
          onRequestClose={hideMenu}
        >
          {filterOptions.map((option, idx) =>
            <MenuItem key={idx} onPress={option.onPress}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ width: 120 }}>{option.name}</Text>
                <Image style={{ width: 10, height: 10 }} source={option.asc ? ascIcon : descIcon} />
              </View>
            </MenuItem>)}
        </Menu>
        <FlatList
          style={{ flex: 1 }}
          extraData={dataSource}
          onEndReached={() => setFilter({
            ...filter,
            page: filter.page + 1
          })}
          onEndReachedThreshold={0.01}
          data={dataSource}
          renderItem={({ item }) => <Item item={item} />}
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