import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  Text,
  StatusBar,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { Menu, MenuItem } from 'react-native-material-menu';


const Item = ({ item }) => (
  <View style={[styles['item']]}>
    <View style={[styles['flex']]}>
      <Image style={styles['icon']} source={{ uri: item.image }} />
      <View>
        <Text style={styles['symbol']}>{item.symbol}</Text>
        <Text style={styles['name']}>{item.name}</Text>
      </View>
    </View>
    <View>
      <Text style={styles['price']}>{`${item.current_price}(US$)`}</Text>
      <Text style={styles['volume']}>{`${item.total_volume}(US$)`}</Text>
    </View>
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
    { name: '即時幣價 ↑', onPress: () => handlePress('market_cap_asc'), asc: true },
    { name: '即時幣價 ↓', onPress: () => handlePress('market_cap_desc'), asc: false },
    { name: '即時交易量 ↑', onPress: () => handlePress('volume_asc'), asc: true },
    { name: '即時交易量 ↓', onPress: () => handlePress('volume_desc'), asc: false },
    { name: '貨幣名稱 ↑', onPress: () => handlePress('id_asc'), asc: true },
    { name: '貨幣名稱 ↓', onPress: () => handlePress('id_desc'), asc: false },
  ]

  const ascIcon = require('./assets/arrow-up.png');
  const descIcon = require('./assets/arrow-down.png');

  useEffect(() => {
    setLoading(true)
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=${filter.market}&per_page=25&page=${filter.page}&order=${filter.order}`)
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
    <SafeAreaView style={styles['container']}>
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={styles['top-bar']}>
          <View style={{ flex: 1 }}>
            <Text style={styles['title']}>加密貨幣列表</Text>
          </View>
          <Menu
            visible={visible}
            anchor={<Text style={styles['menu']} onPress={showMenu}>{{
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
              <MenuItem key={idx} onPress={option.onPress} style={{ backgroundColor: '#2b2b2b' }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: '#fff' }}>{option.name}</Text>
                </View>
              </MenuItem>)}
          </Menu>
        </View>
        <View style={{ flex: .9 }}>
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
        </View>
        {isLoading && <ActivityIndicator size="large" color="#fff" />}
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  'container': {
    flex: 1,
    marginTop: StatusBar.currentHeight,
    backgroundColor: '#22262f',
  },
  'flex': {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  'item': {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  'symbol': {
    fontSize: 20,
    textTransform: 'uppercase',
    color: '#e7eaf1'
  },
  'name': {
    fontSize: 14,
    color: '#8d949e'
  },
  'price': {
    fontSize: 14,
    color: '#e7eaf1',
    textAlign: 'right'
  },
  'volume': {
    fontSize: 14,
    color: '#e7eaf1',
    textAlign: 'right'
  },
  'icon': {
    width: 18,
    height: 18,
    marginRight: 18
  },
  'top-bar': {
    flex: .1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  'menu': {
    color: '#e7eaf1',
    backgroundColor: '#2a303e',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  'title': {
    fontSize: 22,
    color: '#e7eaf1',
  }
});

export default App;