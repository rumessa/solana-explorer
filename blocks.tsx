import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, StyleSheet, ActivityIndicator, RefreshControl, ToastAndroid, TouchableOpacity, TextInput } from 'react-native';
import { theme } from './assets/theme';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';

const BASE_URL = "https://api.solanabeach.io/v1";
const API_KEY = "b45ba62c-36a4-47e7-b738-d3b0d83b64d0";

const Blocks = ({ navigation }) => {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [limit, setLimit] = useState(10);  
  const [cursor, setCursor] = useState<number | null>(null);

  const getBlocks = async () => {
    setRefreshing(true);
    try {
      const latestBlocks = await fetchLatestBlocks();

      if (latestBlocks.length > 0) {
        setBlocks(latestBlocks);
        console.log("blocks loaded!!!");
      } else {
        console.error("No blocks received, keeping loading state.");
      }
    } catch (error) {
      console.error("Error fetching blocks:", error);
      ToastAndroid.show("Error getting blocks! Try again later bitte", ToastAndroid.SHORT);
    }
    setRefreshing(false);
  };

  // function to get latest blocks
  const fetchLatestBlocks = async () => {
    try {
      const url = `${BASE_URL}/latest-blocks?limit=${limit}` + (cursor ? `&cursor=${cursor}` : '');
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        ToastAndroid.show("Error loading blocks! Try again later bitte", ToastAndroid.SHORT);
        throw new Error(data.err || "Failed to fetch latest blocks");
      }

      if (data.length > 0) {
        setCursor(data[data.length - 1].parentslot);   // Update cursor with last block's parentslot
      }

      return data;
    } catch (error) {
      console.error("Error fetching blocks:", error);
      ToastAndroid.show("Error loading blocks! Try again later bitte", ToastAndroid.SHORT);
      return [];
    }
  };

  useEffect(() => {
    getBlocks(); 
  }, []);

  // search
  const filteredBlocks = blocks.filter((block) =>
    block.blocknumber.toString().includes(searchQuery) || block.blockhash.includes(searchQuery)
  );

  // first 4 chars + ... + last 4 chars
  const truncateHash = (hash: string, maxLength: number = 10) => {
    if (hash.length <= maxLength) return hash;
    return `${hash.slice(0, 7)}...${hash.slice(-4)}`; 
  };

  // convert time to 17m ago, 3s ago etc
  const getRelativeTime = (timestamp: number) => {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const diff = now - timestamp; 
  
    if (diff < 60) return `${diff}s ago`; 
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`; 
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`; 
    return `${Math.floor(diff / 86400)}d ago`; 
  };

  return (
    <View style={styles.blocksContainer}>
      <Text style={[theme.headings.secondary, {marginBottom: 20}]}>Recent Blocks</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by Block # or Hash"
          placeholderTextColor={theme.colors.grey}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="close" size={24} color={theme.colors.grey} style={styles.clearButton}/>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.container}>
        <Text style={styles.text}>Select Limit: </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={limit}
            onValueChange={(itemValue) => setLimit(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="5" value={5} />
            <Picker.Item label="10" value={10} />
            <Picker.Item label="15" value={15} />
            <Picker.Item label="20" value={20} />
            <Picker.Item label="25" value={25} />
          </Picker>
        </View>
        <Text style={styles.selectedValueText}>Selected Limit: {limit}</Text>
      </View>
      <FlatList
        data={filteredBlocks}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getBlocks} />
        }
        keyExtractor={(item) => item.blocknumber.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.blockCard}
            onPress={() => navigation.navigate('Details', { block: item })}
          >
            <Text style={styles.blockNumber}>Block #{item.blocknumber}</Text>
            <View style={styles.blockDetails}>
              <View style={styles.miniBlock}>
                  <Text style={styles.headingText}>TX Hash:</Text>
                  <Text style={styles.text}>{truncateHash(item.blockhash)}</Text>
              </View>
              <View style={styles.miniBlock}>
                  <Text style={styles.headingText}>Slot:</Text>
                  <Text style={styles.text}>{item.parentslot}</Text>
              </View>
              <View style={styles.miniBlock}>
                  <Text style={styles.headingText}>Timestamp:</Text>
                  <Text style={styles.text}>
                  {getRelativeTime(item.blocktime.absolute)}
                  </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  blocksContainer: {
    display: "flex",
    justifyContent: 'space-evenly',
    marginTop: 0,
    marginBottom: 200,
    padding: 20,
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.black,
    borderColor: theme.colors.white,
    borderWidth: 0.5,
    borderRadius: 8,
    marginBottom: 15,
    height: 40,
    paddingHorizontal: 10,
  },
  searchBar: {
    flex: 1,  // Takes up available space
    color: theme.colors.white,
    fontSize: 16,
    paddingVertical: 8,
  },
  clearButton: {
    width: 20, // Fixed width for the button
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  pickerContainer: {
    width: 200, // Control width to avoid overflow
    backgroundColor: '#333', // Optional: background color for better visibility
    borderRadius: 8, // Round the corners
    marginBottom: 15, // Space below the picker
  },
  picker: {
    height: 50, // Make sure the picker is tall enough for good UI
    width: '100%', // Take up full width of the container
    color: '#fff', // White text for visibility
  },
  selectedValueText: {
    fontSize: 16,
    color: '#fff',
  },
  

  blockCard: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
    borderColor: theme.colors.bgAccent,
    borderWidth: 1,
    backgroundColor: theme.colors.black,
    
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  blockNumber: {
    fontFamily: theme.fonts.montBold,
    fontSize: 20,
    color: theme.colors.primary, 
    marginBottom: 10,
  },
  blockDetails: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 5, 
  },
  miniBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5, 
  },
  headingText: {
    color: theme.colors.grey, 
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 5, 
  },
  text: {
    color: theme.colors.white, 
    fontSize: 16,
  }
});


export default Blocks;
